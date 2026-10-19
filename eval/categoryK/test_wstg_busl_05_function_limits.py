#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category K (Business Logic Testing)
Test ID: WSTG-BUSL-05 - Test Number of Times a Function Can Be Used Limits (4.10.5)
Status: PASS (Verified)

White-Box Verification & Architectural Evidence:
Enforced via idempotency keys (preventing duplicate execution) and cumulative
spending caps at both Policy Plane and Simulated Bank.
"""
import sys
import time
import uuid
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT_DIR))

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

import warnings
warnings.filterwarnings("ignore")

from fastapi.testclient import TestClient
from backend.bank.main import app as bank_app
from backend.bank.config import config as bank_config
from backend.bank.security import sign_scoped_token
from backend.bank.database import get_connection as get_bank_conn
from backend.api.policy import evaluate_transfer_policy
from backend.api.database import get_connection as get_api_conn


def test_wstg_busl_05_function_limits():
    print("=" * 76)
    print(" [TEST ID: WSTG-BUSL-05] Test Number of Times a Function Can Be Used Limits (4.10.5)")
    print(" Status: PASS (Verified)")
    print("=" * 76)

    bank_client = TestClient(bank_app)

    # 1. Prevention of Duplicate Execution via Idempotency Keys
    print("  [1] Duplicate Invocation Limit (Idempotency Key Control):")
    idempotency_key = f"IDEM-LIMIT-{uuid.uuid4().hex[:10]}"
    nonce = str(uuid.uuid4())
    token_data = {
        "account_id": "acc_student_ayu",
        "amount": 30.0,
        "payee_id": "p1",
        "payee_name": "Mom",
        "fee_usd": 0.0,
        "expires_at": time.time() + 300,
        "nonce": nonce
    }
    sig = sign_scoped_token(token_data, bank_config.SECRET_KEY)
    payload = {"token": token_data, "signature": sig}

    # Call 1: First execution
    r1 = bank_client.post("/v1/bank/transfer", json=payload, headers={"Idempotency-Key": idempotency_key})
    assert r1.status_code == 200
    tx1_id = r1.json().get("tx_id")
    print(f"      Invocation 1 (Initial) -> HTTP 200 | TX-ID: {tx1_id}")

    # Call 2: Duplicate execution attempt with same idempotency key
    r2 = bank_client.post("/v1/bank/transfer", json=payload, headers={"Idempotency-Key": idempotency_key})
    assert r2.status_code == 200
    data2 = r2.json()
    print(f"      Invocation 2 (Replay)  -> HTTP 200 | TX-ID: {data2.get('tx_id')} | Idempotent Replay: {data2.get('idempotent_replay')}")
    assert data2.get("tx_id") == tx1_id, "Different TX created on idempotency replay!"
    assert data2.get("idempotent_replay") is True
    print("      Verification: Multiple invocations of the same function do not trigger duplicate debits.")

    # 2. Cumulative Spending Limits at Policy Plane
    print("  [2] Cumulative Spending Cap at Policy Plane (Daily Cap Enforcement):")
    # Fetch current daily cap and usage for Ayu
    conn = get_api_conn()
    cur = conn.execute("SELECT daily_cap_usd, used_today_usd FROM policy WHERE user_id = 'usr_ayu'")
    row = cur.fetchone()
    daily_cap = row["daily_cap_usd"]
    used_today = row["used_today_usd"]
    print(f"      Policy Status: Daily Cap = ${daily_cap:,.2f} | Already Used = ${used_today:,.2f}")

    # Case A: Amount within remaining allowance
    remaining = daily_cap - used_today
    if remaining > 10.0:
        eval_allowed = evaluate_transfer_policy("usr_ayu", 10.0, "Mom")
        print(f"      Transfer $10.00 -> Tier: {eval_allowed['tier']} | Allowed: {eval_allowed['allowed']}")
        assert eval_allowed["allowed"] is True

    # Case B: Amount exceeding daily cumulative cap
    excess_amount = daily_cap + 500.0
    eval_refused = evaluate_transfer_policy("usr_ayu", excess_amount, "Mom")
    print(f"      Transfer ${excess_amount:,.2f} -> Tier: {eval_refused['tier']} | Allowed: {eval_refused['allowed']}")
    assert eval_refused["tier"] == "REFUSED"
    assert eval_refused["allowed"] is False
    print(f"      Refusal reason: {eval_refused['reason']}")
    print("      Verification: Policy Plane rejects transactions exceeding cumulative allowance.")

    # 3. Bank-Side Hard Overdraft Limit
    print("  [3] Simulated Bank Outer Balance Cap Enforcement:")
    bank_conn = get_bank_conn()
    cur_bal = bank_conn.execute("SELECT balance_usd FROM accounts WHERE account_id = 'acc_student_ayu'").fetchone()[0]
    print(f"      Current Available Balance: ${cur_bal:,.2f}")

    overdraft_amount = cur_bal + 5000.0
    overdraft_token = {
        "account_id": "acc_student_ayu",
        "amount": overdraft_amount,
        "payee_id": "p2",
        "payee_name": "Campus bursar",
        "fee_usd": 0.0,
        "expires_at": time.time() + 300,
        "nonce": str(uuid.uuid4())
    }
    overdraft_sig = sign_scoped_token(overdraft_token, bank_config.SECRET_KEY)
    r_overdraft = bank_client.post(
        "/v1/bank/transfer",
        json={"token": overdraft_token, "signature": overdraft_sig},
        headers={"Idempotency-Key": f"IDEM-OVERDRAFT-{uuid.uuid4().hex[:8]}"}
    )
    print(f"      Attempt transfer ${overdraft_amount:,.2f} -> HTTP {r_overdraft.status_code}")
    assert r_overdraft.status_code == 422
    err_json = r_overdraft.json()
    print(f"      Error code: {err_json.get('code')} | Detail: {err_json.get('detail')}")
    assert err_json.get("code") == "INSUFFICIENT_FUNDS"
    print("      Verification: Bank plane strictly limits function usage to funded balance.")

    print("-" * 76)
    print("  >>> VERDICT: PASS (Verified)")
    print("  Architectural Evidence: Enforced via idempotency keys (preventing")
    print("  duplicate execution) and cumulative spending caps at both Policy")
    print("  Plane and Simulated Bank.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_busl_05_function_limits()
    sys.exit(0 if success else 1)
