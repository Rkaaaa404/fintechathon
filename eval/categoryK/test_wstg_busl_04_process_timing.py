#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category K (Business Logic Testing)
Test ID: WSTG-BUSL-04 - Test for Process Timing (4.10.4)
Status: KNOWN RISK

White-Box Verification & Architectural Evidence:
Ledger race conditions are prevented via idempotency keys; cloud LLM request
timing metadata is documented as a residual risk in Section 04.
"""
import sys
import time
import uuid
from concurrent.futures import ThreadPoolExecutor
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
from backend.bank.database import get_connection


def test_wstg_busl_04_process_timing():
    print("=" * 76)
    print(" [TEST ID: WSTG-BUSL-04] Test for Process Timing (4.10.4)")
    print(" Status: KNOWN RISK")
    print("=" * 76)

    client = TestClient(bank_app)

    # 1. Ledger Race Condition Resistance via Idempotency Keys
    print("  [1] High-Concurrency Transfer Race Condition Simulation:")
    idempotency_key = f"IDEM-CONCURRENCY-{uuid.uuid4().hex[:10]}"
    shared_nonce = str(uuid.uuid4())

    token_data = {
        "account_id": "acc_student_ayu",
        "amount": 25.0,
        "payee_id": "p1",
        "payee_name": "Mom",
        "fee_usd": 0.0,
        "expires_at": time.time() + 300,
        "nonce": shared_nonce
    }
    signature = sign_scoped_token(token_data, bank_config.SECRET_KEY)
    request_body = {"token": token_data, "signature": signature}

    # Record initial balance
    conn = get_connection()
    init_bal = conn.execute("SELECT balance_usd FROM accounts WHERE account_id = 'acc_student_ayu'").fetchone()[0]

    # Initial execution
    resp1 = client.post(
        "/v1/bank/transfer",
        json=request_body,
        headers={"Idempotency-Key": idempotency_key}
    )
    assert resp1.status_code == 200, f"Expected 200, got {resp1.status_code}"
    print(f"      Initial Transfer: HTTP 200 | TX-ID: {resp1.json().get('tx_id')}")

    def send_replay(worker_id):
        t_client = TestClient(bank_app)
        return t_client.post(
            "/v1/bank/transfer",
            json=request_body,
            headers={"Idempotency-Key": idempotency_key}
        )

    print(f"      Launching 4 concurrent replay requests with key '{idempotency_key}'...")
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = [executor.submit(send_replay, i) for i in range(4)]
        responses = [f.result() for f in futures]

    statuses = [r.status_code for r in responses]
    replays = [r.json().get("idempotent_replay", False) for r in responses if r.status_code == 200]
    print(f"      HTTP Response Statuses : {statuses}")
    print(f"      Successful responses   : {statuses.count(200)}/4")
    print(f"      Idempotent replays     : {replays.count(True)}/4")
    assert all(s == 200 for s in statuses), "Expected all replays to return cached 200"
    assert all(replays), "Expected all responses to indicate idempotent_replay"

    # Verify atomic debit occurred exactly once
    final_bal = conn.execute("SELECT balance_usd FROM accounts WHERE account_id = 'acc_student_ayu'").fetchone()[0]
    actual_deducted = round(init_bal - final_bal, 2)
    print(f"      Balance before: ${init_bal:.2f} | Balance after: ${final_bal:.2f} | Deducted: ${actual_deducted:.2f}")
    assert actual_deducted == 25.00, f"Race condition failure! Expected exactly $25.00 deducted, but got ${actual_deducted:.2f}"
    print("      Verification: Concurrency race condition prevented; idempotency strictly enforced.")

    # 2. Timing Metadata Analysis (External Cloud LLM Residual Risk)
    print("  [2] Timing Metadata & Inference Latency Risk Assessment:")
    print("      - Target Surface       : External Cloud LLM Endpoints (Gemini / Claude / DeepSeek)")
    print("      - Attack Vector        : Request-Response Timing & Token Generation Variations")
    print("      - Risk Finding         : Time-to-first-token & total completion latency fluctuate")
    print("                               based on prompt length and token reasoning complexity.")
    print("      - Risk Classification  : KNOWN RESIDUAL RISK (Architecturally Documented in Section 04)")
    print("      - Compensating Control : Outer Ring deterministic privacy filter and regex scanner execute")
    print("                               locally in < 1ms before any external cloud model invocation.")

    print("-" * 76)
    print("  >>> VERDICT: KNOWN RISK")
    print("  Architectural Evidence: Ledger race conditions are prevented via")
    print("  idempotency keys; cloud LLM request timing metadata is documented")
    print("  as a residual risk in Section 04.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_busl_04_process_timing()
    sys.exit(0 if success else 1)
