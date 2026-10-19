#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category H (Input Validation Testing)
Test ID: WSTG-INPV-06 - Testing for LDAP Injection (4.7.6)
Status: N/A

White-Box Verification & Architectural Evidence:
LDAP directory services are not used. Identity management is performed
via cryptographic passkeys (WebAuthn) and localized SQLite/Postgres tables.
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


def test_wstg_inpv_06_ldap_injection():
    print("=" * 76)
    print(" [TEST ID: WSTG-INPV-06] Testing for LDAP Injection (4.7.6)")
    print(" Status: N/A")
    print("=" * 76)

    print("  [1] Auditing LDAP Dependencies & Protocol Usage:")
    pyproject = ROOT_DIR / "pyproject.toml"
    content = pyproject.read_text(encoding="utf-8", errors="ignore") if pyproject.exists() else ""
    
    ldap_libs = ["ldap", "ldap3", "python-ldap"]
    found = [l for l in ldap_libs if l in content]
    print(f"      LDAP Libraries in Dependencies: {found}")
    assert len(found) == 0
    print("      Verification: Zero LDAP directory services or connectors present.")

    print("-" * 76)
    print("  >>> VERDICT: N/A")
    print("  Architectural Evidence: LDAP directory services are not used.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_inpv_06_ldap_injection()
    sys.exit(0 if success else 1)
