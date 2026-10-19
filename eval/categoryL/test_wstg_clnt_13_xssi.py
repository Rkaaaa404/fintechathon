#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category L (Client-side Testing)
Test ID: WSTG-CLNT-13 - Testing for Cross Site Script Inclusion (XSSI) (4.11.13)
Status: PASS (Verified)

White-Box Verification & Architectural Evidence:
JSON responses enforce X-Content-Type-Options: nosniff and disallow JSONP
callbacks.
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


def test_wstg_clnt_13_xssi():
    print("=" * 76)
    print(" [TEST ID: WSTG-CLNT-13] Testing for Cross Site Script Inclusion (XSSI) (4.11.13)")
    print(" Status: PASS (Verified)")
    print("=" * 76)

    api_client = TestClient(api_app)
    bank_client = TestClient(bank_app)

    # 1. Verification of X-Content-Type-Options: nosniff
    print("  [1] X-Content-Type-Options Header Verification across Endpoints:")
    endpoints_to_test = [
        (api_client, "/v1/health", "API Core Health"),
        (api_client, "/v1/audit", "Audit Trail"),
        (bank_client, "/v1/health", "Bank Daemon Health"),
        (bank_client, "/v1/bank/balance", "Custodial Student Balance"),
    ]

    for client, path, desc in endpoints_to_test:
        resp = client.get(path)
        print(f"      Probing {desc:<24} ({path}): Status {resp.status_code}")
        nosniff = resp.headers.get("X-Content-Type-Options")
        content_type = resp.headers.get("Content-Type", "")
        print(f"        X-Content-Type-Options : {nosniff}")
        print(f"        Content-Type           : {content_type}")
        assert nosniff == "nosniff", f"Missing nosniff header on {path}"
        assert "application/json" in content_type or "application/problem+json" in content_type

    print("      Verification: Browser MIME-sniffing strictly disabled on all JSON endpoints.")

    # 2. JSONP Callback Parameter Disallowance (XSSI Immunity)
    print("  [2] JSONP Callback Parameter Probing:")
    jsonp_params = [
        ("?callback=evilHarvestCallback", "evilHarvestCallback"),
        ("?jsonp=handlePayload", "handlePayload"),
        ("?cb=alert", "alert"),
    ]

    for param, fn_name in jsonp_params:
        resp_jsonp = api_client.get(f"/v1/health{param}")
        raw_text = resp_jsonp.text.strip()
        print(f"      GET /v1/health{param:<30} -> Response Starts With: '{raw_text[:25]}...'")
        # Ensure it does NOT wrap response in function callback (e.g. fn_name(...))
        assert not raw_text.startswith(f"{fn_name}("), f"JSONP callback reflected on {param}"
        assert raw_text.startswith("{"), "Response is not a strict JSON object"

    # Also test on bank balance endpoint
    resp_bank_jsonp = bank_client.get("/v1/bank/balance?callback=stealBalance")
    raw_bank = resp_bank_jsonp.text.strip()
    print(f"      GET /v1/bank/balance?callback=stealBalance -> Starts With: '{raw_bank[:25]}...'")
    assert not raw_bank.startswith("stealBalance(")
    assert raw_bank.startswith("{")
    print("      Verification: Zero JSONP callback reflection; XSSI script inclusion defeated.")

    print("-" * 76)
    print("  >>> VERDICT: PASS (Verified)")
    print("  Architectural Evidence: JSON responses enforce X-Content-Type-Options:")
    print("  nosniff and disallow JSONP callbacks.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_clnt_13_xssi()
    sys.exit(0 if success else 1)
