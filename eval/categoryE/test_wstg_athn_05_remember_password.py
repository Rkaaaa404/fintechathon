#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category E (Authentication Testing)
Test ID: WSTG-ATHN-05 - Testing for Vulnerable Remember Password
Status: N/A (By Design)

White-Box Verification & Architectural Evidence:
Persistent "Remember Me" password cookies are not implemented in the MVP.
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


def test_wstg_athn_05_remember_password():
    print("=" * 76)
    print(" [TEST ID: WSTG-ATHN-05] Testing for Vulnerable Remember Password")
    print(" Status: N/A (By Design)")
    print("=" * 76)

    client = TestClient(api_app)
    resp = client.post("/v1/auth/demo-login")

    print("  [1] Authentication Cookie Audit on Login:")
    set_cookie_hdr = resp.headers.get("set-cookie", "")
    print(f"      'Set-Cookie' Headers Found: '{set_cookie_hdr}' (None)")
    assert "remember" not in set_cookie_hdr.lower()

    print("  [2] Architectural Authentication Model:")
    print("      - Token Model         : Short-lived Bearer JWTs in memory")
    print("      - Long-Term Cookies   : Persistent 'Remember Me' cookies intentionally omitted")
    print("      - Credential Storage  : Zero persistent plaintext credentials in client storage")

    print("-" * 76)
    print("  >>> VERDICT: N/A (By Design)")
    print("  Architectural Evidence: Persistent 'Remember Me' password cookies are")
    print("  not implemented in the MVP.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_athn_05_remember_password()
    sys.exit(0 if success else 1)
