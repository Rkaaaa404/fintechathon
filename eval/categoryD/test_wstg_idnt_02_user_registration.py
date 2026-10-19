#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category D (Identity Management)
Test ID: WSTG-IDNT-02 - Test User Registration Process
Status: N/A (By Design)

White-Box Verification & Architectural Evidence:
MVP operates on pre-seeded synthetic international student profiles;
live public registration and real KYC are out of scope.
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


def test_wstg_idnt_02_user_registration():
    print("=" * 76)
    print(" [TEST ID: WSTG-IDNT-02] Test User Registration Process")
    print(" Status: N/A (By Design)")
    print("=" * 76)

    print("  [1] Public User Registration Endpoint Audit:")
    public_registration_paths = ["/register", "/signup", "/auth/register", "/user/create", "/kyc/onboard"]

    registered_paths = [getattr(r, "path", "") for r in api_app.routes]
    found_registration = [p for p in public_registration_paths if p in registered_paths]

    print(f"      Public Self-Registration Endpoints Found: {found_registration} (Expected: [])")
    assert len(found_registration) == 0, f"FAIL: Public registration exposed: {found_registration}"

    print("  [2] Synthetic Identity Sandbox Profile:")
    print("      - Persona Model       : Pre-seeded synthetic student profile ('usr_ayu')")
    print("      - Live Public Onboard : Intentionally out of scope for 10-day MVP")
    print("      - Real KYC Integration: Deferred to post-MVP production deployment")

    print("-" * 76)
    print("  >>> VERDICT: N/A (By Design)")
    print("  Architectural Evidence: MVP operates on pre-seeded synthetic international")
    print("  student profiles; live public registration and real KYC are out of scope.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_idnt_02_user_registration()
    sys.exit(0 if success else 1)
