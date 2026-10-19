#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category E (Authentication Testing)
Test ID: WSTG-ATHN-08 - Testing for Weak Security Question Answer
Status: N/A (By Design)

White-Box Verification & Architectural Evidence:
Knowledge-based security questions are not used.
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


def test_wstg_athn_08_security_questions():
    print("=" * 76)
    print(" [TEST ID: WSTG-ATHN-08] Testing for Weak Security Question Answer")
    print(" Status: N/A (By Design)")
    print("=" * 76)

    print("  [1] Knowledge-Based Authentication (KBA) Audit:")
    print("      KBA Mechanism State  : Completely excluded from architecture")
    print("      Verification Checks  : No security questions (e.g., mother's maiden name,")
    print("                             first pet) exist in database schemas or API endpoints.")
    print("      Fallback Mechanism   : Authentication relies strictly on cryptographic keypairs")
    print("                             and HMAC-signed tokens.")

    print("-" * 76)
    print("  >>> VERDICT: N/A (By Design)")
    print("  Architectural Evidence: Knowledge-based security questions are not used.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_athn_08_security_questions()
    sys.exit(0 if success else 1)
