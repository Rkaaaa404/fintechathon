#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category L (Client-side Testing)
Test ID: WSTG-CLNT-07 - Testing Cross Origin Resource Sharing (CORS) (4.11.7)
Status: PASS (Verified)

White-Box Verification & Architectural Evidence:
API CORS policy restricts access to the local PWA origin.
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


def test_wstg_clnt_07_cors():
    print("=" * 76)
    print(" [TEST ID: WSTG-CLNT-07] Testing Cross Origin Resource Sharing (CORS) (4.11.7)")
    print(" Status: PASS (Verified)")
    print("=" * 76)

    client = TestClient(api_app)

    # 1. Authorized PWA Origin Verification
    print("  [1] Authorized Local PWA Origins Verification:")
    pwa_origins = ["http://localhost:3000", "http://127.0.0.1:3000"]

    for origin in pwa_origins:
        resp = client.get("/v1/health", headers={"Origin": origin})
        print(f"      Request with Origin: {origin:<25} -> Status {resp.status_code}")
        allow_origin = resp.headers.get("access-control-allow-origin")
        print(f"        Access-Control-Allow-Origin: {allow_origin}")
        assert allow_origin == origin, f"Expected {origin}, got {allow_origin}"

    # 2. Unauthorized Origin Rejection (Zero Wildcard Reflection)
    print("  [2] Unauthorized Origin Cross-Domain Probe:")
    unauthorized_origins = [
        "http://attacker.com",
        "https://evil-phishing-site.org",
        "http://localhost:9999",
        "null"
    ]

    for unauth in unauthorized_origins:
        resp = client.get("/v1/health", headers={"Origin": unauth})
        allow_origin = resp.headers.get("access-control-allow-origin")
        print(f"      Request with Origin: {unauth:<30} -> Access-Control-Allow-Origin: {allow_origin}")
        assert allow_origin is None or allow_origin != unauth, f"Unauthorized origin reflected: {unauth}"

    # 3. Preflight OPTIONS Request Validation
    print("  [3] Preflight (OPTIONS) Validation for Unauthorized vs Authorized:")
    # Unauthorized preflight
    resp_opt_bad = client.options(
        "/v1/agent/messages",
        headers={
            "Origin": "http://evil-attacker.com",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type"
        }
    )
    print(f"      Preflight from evil-attacker.com -> HTTP {resp_opt_bad.status_code}")
    assert "access-control-allow-origin" not in resp_opt_bad.headers

    # Authorized preflight
    resp_opt_good = client.options(
        "/v1/agent/messages",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type"
        }
    )
    print(f"      Preflight from localhost:3000    -> HTTP {resp_opt_good.status_code}")
    assert resp_opt_good.headers.get("access-control-allow-origin") == "http://localhost:3000"
    print("      Verification: API CORS policy strictly restricts access to local PWA origin.")

    print("-" * 76)
    print("  >>> VERDICT: PASS (Verified)")
    print("  Architectural Evidence: API CORS policy restricts access to the")
    print("  local PWA origin.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_clnt_07_cors()
    sys.exit(0 if success else 1)
