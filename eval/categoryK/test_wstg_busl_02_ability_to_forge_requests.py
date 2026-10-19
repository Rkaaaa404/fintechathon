#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category K (Business Logic Testing)
Test ID: WSTG-BUSL-02 - Test Ability to Forge Requests (4.10.2)
Status: PASS (Verified)

White-Box Verification & Architectural Evidence:
Forged ledger requests to Port 8100 fail without a valid Scoped Token signed
by Port 8000's independent secret.
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
from backend.bank.security import sign_scoped_token


def test_wstg_busl_02_ability_to_forge_requests():
    print("=" * 76)
    print(" [TEST ID: WSTG-BUSL-02] Test Ability to Forge Requests (4.10.2)")
    print(" Status: PASS (Verified)")
    print("=" * 76)

    client = TestClient(bank_app)

    # 1. Unsigned / Missing Signature Request
    print("  [1] Direct Transfer Without Cryptographic Signature:")
    raw_payload = {
        "token": {
            "account_id": "acc_student_ayu",
            "amount": 500.0,
            "payee_id": "p_attacker",
            "payee_name": "Attacker",
            "fee_usd": 0.0,
            "expires_at": time.time() + 300,
            "nonce": str(uuid.uuid4())
        },
        "signature": ""
    }
    resp1 = client.post("/v1/bank/transfer", json=raw_payload)
    print(f"      POST /v1/bank/transfer (Empty signature) -> HTTP {resp1.status_code}")
    assert resp1.status_code in [401, 422], f"Expected 401/422, got {resp1.status_code}"
    print("      Rejection confirmed: Unsigned ledger request immediately denied.")

    # 2. Forged Signature (Signed with Attacker's Secret Key)
    print("  [2] Forged Transfer Signed with Attacker Secret Key:")
    attacker_secret = "ATTACKER_UNAUTHORIZED_SECRET_KEY_12345"
    token_data = {
        "account_id": "acc_student_ayu",
        "amount": 800.0,
        "payee_id": "p_attacker_mule",
        "payee_name": "Money Mule",
        "fee_usd": 0.0,
        "expires_at": time.time() + 300,
        "nonce": str(uuid.uuid4())
    }
    forged_sig = sign_scoped_token(token_data, attacker_secret)
    resp2 = client.post("/v1/bank/transfer", json={"token": token_data, "signature": forged_sig})
    print(f"      POST /v1/bank/transfer (Forged HMAC secret) -> HTTP {resp2.status_code}")
    assert resp2.status_code == 401, f"Expected 401, got {resp2.status_code}"
    err_body2 = resp2.json()
    print(f"      Error detail: {err_body2.get('detail')} (Code: {err_body2.get('code')})")
    assert err_body2.get("code") == "INVALID_SCOPED_TOKEN"

    # 3. Parameter Tampering with Legitimate Signature
    print("  [3] Parameter Tampering Attack (Amount Inflation after Signing):")
    # Legitimate signature for $50.00
    valid_amount_token = {
        "account_id": "acc_student_ayu",
        "amount": 50.0,
        "payee_id": "p_landlord",
        "payee_name": "Landlord",
        "fee_usd": 0.0,
        "expires_at": time.time() + 300,
        "nonce": str(uuid.uuid4())
    }
    from backend.bank.config import config as bank_config
    legit_sig = sign_scoped_token(valid_amount_token, bank_config.SECRET_KEY)

    # Attacker alters amount to $5,000.00 but keeps legit signature
    tampered_token = dict(valid_amount_token)
    tampered_token["amount"] = 5000.0
    resp3 = client.post("/v1/bank/transfer", json={"token": tampered_token, "signature": legit_sig})
    print(f"      POST /v1/bank/transfer (Tampered amount $50 -> $5,000) -> HTTP {resp3.status_code}")
    assert resp3.status_code == 401
    err_body3 = resp3.json()
    print(f"      Error detail: {err_body3.get('detail')} (Code: {err_body3.get('code')})")
    assert err_body3.get("code") == "INVALID_SCOPED_TOKEN"

    # 4. Valid Scoped Token Execution Baseline
    print("  [4] Baseline Verification with Authentic Signed Token:")
    clean_token = {
        "account_id": "acc_student_ayu",
        "amount": 10.0,
        "payee_id": "p_canteen",
        "payee_name": "Canteen",
        "fee_usd": 0.0,
        "expires_at": time.time() + 300,
        "nonce": str(uuid.uuid4())
    }
    clean_sig = sign_scoped_token(clean_token, bank_config.SECRET_KEY)
    resp4 = client.post("/v1/bank/transfer", json={"token": clean_token, "signature": clean_sig})
    print(f"      POST /v1/bank/transfer (Authentic token) -> HTTP {resp4.status_code}")
    assert resp4.status_code == 200
    res4 = resp4.json()
    print(f"      Transfer success: TX-ID={res4.get('tx_id')} | Status={res4.get('status')}")

    print("-" * 76)
    print("  >>> VERDICT: PASS (Verified)")
    print("  Architectural Evidence: Forged ledger requests to Port 8100 fail")
    print("  without a valid Scoped Token signed by Port 8000's independent secret.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_busl_02_ability_to_forge_requests()
    sys.exit(0 if success else 1)
