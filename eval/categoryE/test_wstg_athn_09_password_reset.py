#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category E (Authentication Testing)
Test ID: WSTG-ATHN-09 - Testing for Weak Password Change or Reset Functionalities
Status: N/A (By Design)

White-Box Verification & Architectural Evidence:
Password reset workflows are not part of the MVP.
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

from backend.api.main import app as api_app


def test_wstg_athn_09_password_reset():
    print("=" * 76)
    print(" [TEST ID: WSTG-ATHN-09] Weak Password Change/Reset Functionality Audit")
    print(" Status: N/A (By Design)")
    print("=" * 76)

    print("  [1] Password Reset & Recovery Endpoint Audit:")
    reset_paths = [
        "/auth/forgot-password", "/auth/reset-password", "/password/reset",
        "/recovery/email", "/user/change-password"
    ]

    registered_paths = [getattr(r, "path", "") for r in api_app.routes]
    found_reset = [p for p in reset_paths if p in registered_paths]

    print(f"      Password Reset Routes Found : {found_reset} (Expected: [])")
    assert len(found_reset) == 0, f"FAIL: Password reset routes exposed: {found_reset}"

    print("  [2] Architectural Workflow Boundary:")
    print("      - Password reset workflows are intentionally excluded from MVP scope.")
    print("      - Sandbox uses synthetic testnet student authentication.")

    print("-" * 76)
    print("  >>> VERDICT: N/A (By Design)")
    print("  Architectural Evidence: Password reset workflows are not part of the MVP.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_athn_09_password_reset()
    sys.exit(0 if success else 1)
