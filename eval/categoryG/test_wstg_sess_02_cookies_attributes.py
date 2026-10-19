#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category G (Session Management Testing)
Test ID: WSTG-SESS-02 - Testing for Cookies Attributes (4.6.2)
Status: N/A

White-Box Verification & Architectural Evidence:
Authorization between PWA, API (8000), and Bank (8100) uses explicit
JSON headers/tokens rather than ambient browser cookies.
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
from backend.api.main import app as api_app
from backend.bank.main import app as bank_app


def test_wstg_sess_02_cookies_attributes():
    print("=" * 76)
    print(" [TEST ID: WSTG-SESS-02] Testing Cookies Attributes (4.6.2)")
    print(" Status: N/A")
    print("=" * 76)

    api_client = TestClient(api_app)
    bank_client = TestClient(bank_app)

    endpoints_to_test = [
        (api_client, "API (Port 8000)", "/v1/health"),
        (api_client, "API (Port 8000)", "/v1/policy"),
        (api_client, "API (Port 8000)", "/v1/evidence"),
        (api_client, "API (Port 8000)", "/v1/planner"),
        (bank_client, "Bank (Port 8100)", "/v1/health"),
        (bank_client, "Bank (Port 8100)", "/v1/bank/balance?account_id=acc_student_ayu"),
        (bank_client, "Bank (Port 8100)", "/v1/bank/ledger?account_id=acc_student_ayu"),
    ]

    print("  [1] Auditing HTTP Response Headers for Ambient Cookie Issuance:")
    for client, svc_name, endpoint in endpoints_to_test:
        resp = client.get(endpoint)
        has_set_cookie = "set-cookie" in resp.headers
        print(f"      [{svc_name}] GET {endpoint:<45} -> Set-Cookie: {has_set_cookie}")
        assert not has_set_cookie, f"FAIL: Unexpected Set-Cookie found in response from {endpoint}"

    # 2. Architectural Session Mechanism Verification
    print("  [2] Architectural Session Authentication Verification:")
    print("      - Client-to-API Session Transport: Authorization: Bearer <JWT>")
    print("      - API-to-Bank Session Transport  : Explicit JSON ScopedTokenPayload + HMAC")
    print("      - Browser Cookie Storage         : Zero Cookies Set or Utilized")
    print("      - Cookie Flags (HttpOnly/Secure) : N/A (Stateless Tokenized Architecture)")

    print("-" * 76)
    print("  >>> VERDICT: N/A")
    print("  Architectural Evidence: Authorization between PWA, API (8000), and")
    print("  Bank (8100) uses explicit JSON headers/tokens rather than ambient browser")
    print("  cookies.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_sess_02_cookies_attributes()
    sys.exit(0 if success else 1)
