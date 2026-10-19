#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category H (Input Validation Testing)
Test ID: WSTG-INPV-05.1 - Testing for Oracle (4.7.5.1)
Status: N/A

White-Box Verification & Architectural Evidence:
Oracle RDBMS is not used in AegisPath.
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


def test_wstg_inpv_05_1_oracle():
    print("=" * 76)
    print(" [TEST ID: WSTG-INPV-05.1] Testing for Oracle Injection (4.7.5.1)")
    print(" Status: N/A")
    print("=" * 76)

    # Architectural audit
    print("  [1] Database Driver & Dependency Stack Audit:")
    pyproject_file = ROOT_DIR / "pyproject.toml"
    content = pyproject_file.read_text(encoding="utf-8", errors="ignore") if pyproject_file.exists() else ""
    
    oracle_drivers = ["cx_Oracle", "oracledb"]
    found = [d for d in oracle_drivers if d in content]
    print(f"      Oracle Drivers in Dependencies: {found}")
    assert len(found) == 0, f"Unexpected Oracle driver found: {found}"
    print("      Verification: Zero Oracle database connectors present in stack.")

    print("-" * 76)
    print("  >>> VERDICT: N/A")
    print("  Architectural Evidence: Oracle RDBMS is not used in AegisPath.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_inpv_05_1_oracle()
    sys.exit(0 if success else 1)
