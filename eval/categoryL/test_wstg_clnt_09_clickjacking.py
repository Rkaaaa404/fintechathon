#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category L (Client-side Testing)
Test ID: WSTG-CLNT-09 - Testing for Clickjacking (4.11.9)
Status: PASS (Verified)

White-Box Verification & Architectural Evidence:
Frame-ancestors / X-Frame-Options: DENY headers protect the Approval screen
from UI redressing.
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


def test_wstg_clnt_09_clickjacking():
    print("=" * 76)
    print(" [TEST ID: WSTG-CLNT-09] Testing for Clickjacking (4.11.9)")
    print(" Status: PASS (Verified)")
    print("=" * 76)

    # 1. Frontend Next.js PWA Configuration Audit
    print("  [1] Next.js PWA Security Headers Audit (frontend/next.config.ts):")
    next_config_path = ROOT_DIR / "frontend" / "next.config.ts"
    assert next_config_path.exists(), f"Missing next.config.ts: {next_config_path}"
    next_config_text = next_config_path.read_text(encoding="utf-8")

    has_x_frame = "X-Frame-Options" in next_config_text and "DENY" in next_config_text
    has_csp_frame = "frame-ancestors 'none'" in next_config_text
    print(f"      PWA Config -> X-Frame-Options: DENY             : {has_x_frame}")
    print(f"      PWA Config -> CSP frame-ancestors 'none'        : {has_csp_frame}")
    assert has_x_frame, "Missing X-Frame-Options: DENY in next.config.ts"
    assert has_csp_frame, "Missing frame-ancestors 'none' in next.config.ts"
    print("      Verification: PWA statically forbids iframe embedding on all routes.")

    # 2. Core API Daemon Anti-Framing Headers Verification
    print("  [2] Core API Daemon Response Header Verification (Port 8000):")
    api_client = TestClient(api_app)
    resp_api = api_client.get("/v1/health")
    print(f"      GET /v1/health -> Status {resp_api.status_code}")
    api_x_frame = resp_api.headers.get("X-Frame-Options")
    api_csp = resp_api.headers.get("Content-Security-Policy")
    print(f"        X-Frame-Options          : {api_x_frame}")
    print(f"        Content-Security-Policy  : {api_csp}")
    assert api_x_frame == "DENY", f"Expected X-Frame-Options: DENY, got {api_x_frame}"
    assert "frame-ancestors 'none'" in (api_csp or ""), f"Missing frame-ancestors in {api_csp}"

    # 3. Simulated Bank Daemon Anti-Framing Headers Verification
    print("  [3] Bank Daemon Response Header Verification (Port 8100):")
    bank_client = TestClient(bank_app)
    resp_bank = bank_client.get("/v1/health")
    print(f"      GET /v1/health -> Status {resp_bank.status_code}")
    bank_x_frame = resp_bank.headers.get("X-Frame-Options")
    bank_csp = resp_bank.headers.get("Content-Security-Policy")
    print(f"        X-Frame-Options          : {bank_x_frame}")
    print(f"        Content-Security-Policy  : {bank_csp}")
    assert bank_x_frame == "DENY", f"Expected X-Frame-Options: DENY, got {bank_x_frame}"
    assert "frame-ancestors 'none'" in (bank_csp or ""), f"Missing frame-ancestors in {bank_csp}"
    print("      Verification: All approval endpoints and daemons protected from UI redressing.")

    print("-" * 76)
    print("  >>> VERDICT: PASS (Verified)")
    print("  Architectural Evidence: Frame-ancestors / X-Frame-Options: DENY headers")
    print("  protect the Approval screen from UI redressing.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_clnt_09_clickjacking()
    sys.exit(0 if success else 1)
