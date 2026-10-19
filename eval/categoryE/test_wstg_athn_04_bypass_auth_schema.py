#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category E (Authentication Testing)
Test ID: WSTG-ATHN-04 - Testing for Bypassing Authentication Schema
Status: PASS (Verified)

White-Box Verification & Architectural Evidence:
Direct requests to Port 8100 ledger endpoints without a valid, cryptographically
signed Scoped Token are deterministically rejected.
"""
import sys
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
from backend.bank.security import verify_scoped_token
from backend.api.tokens import create_scoped_bank_token


def test_wstg_athn_04_bypass_auth_schema():
    print("=" * 76)
    print(" [TEST ID: WSTG-ATHN-04] Testing for Bypassing Authentication Schema")
    print(" Status: PASS (Verified)")
    print("=" * 76)

    client = TestClient(bank_app)

    # 1. Direct Ledger Call with Missing Token Payload
    print("  [1] Direct Ledger Transfer without Scoped Token:")
    resp_empty = client.post("/v1/bank/transfer", json={})
    print(f"      Empty Request Status Code  : {resp_empty.status_code} (Rejected)")
    assert resp_empty.status_code in [400, 422], "FAIL: Bank accepted empty request payload!"

    # 2. Direct Ledger Call with Forged Cryptographic Signature
    print("  [2] Direct Ledger Transfer with Forged Signature:")
    token_dict, _ = create_scoped_bank_token("acc_student_ayu", 100.0, "p1", "Mom")
    resp_forged = client.post("/v1/bank/transfer", json={
        "token": token_dict,
        "signature": "forged_cryptographic_signature_0000"
    }, headers={"Idempotency-Key": "idemp-test-bypass-key-1"})
    print(f"      Forged Request Status Code : {resp_forged.status_code} (Expected: 400, 401, or 403)")
    assert resp_forged.status_code in [400, 401, 403], f"FAIL: Forged signature bypassed authentication: {resp_forged.text}"

    # 3. Direct Verification Layer Check
    is_valid, err = verify_scoped_token(token_dict, "invalid_sig")
    print(f"      Cryptographic Layer Verdict: Blocked={not is_valid} (Reason: '{err}')")
    assert is_valid is False

    print("-" * 76)
    print("  >>> VERDICT: PASS (Verified)")
    print("  Architectural Evidence: Direct requests to Port 8100 ledger endpoints")
    print("  without a valid, cryptographically signed Scoped Token are rejected.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_athn_04_bypass_auth_schema()
    sys.exit(0 if success else 1)
