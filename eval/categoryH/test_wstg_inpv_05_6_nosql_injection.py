#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category H (Input Validation Testing)
Test ID: WSTG-INPV-05.6 - Testing for NoSQL Injection (4.7.5.6)
Status: N/A

White-Box Verification & Architectural Evidence:
NoSQL query engines are not used.
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


def test_wstg_inpv_05_6_nosql_injection():
    print("=" * 76)
    print(" [TEST ID: WSTG-INPV-05.6] Testing for NoSQL Injection (4.7.5.6)")
    print(" Status: N/A")
    print("=" * 76)

    print("  [1] NoSQL Library & Driver Dependency Audit:")
    pyproject_file = ROOT_DIR / "pyproject.toml"
    content = pyproject_file.read_text(encoding="utf-8", errors="ignore") if pyproject_file.exists() else ""
    
    nosql_drivers = ["pymongo", "motor", "couchdb", "cassandra-driver"]
    found = [d for d in nosql_drivers if d in content]
    print(f"      NoSQL Drivers in Dependencies: {found}")
    assert len(found) == 0
    print("      Verification: Zero NoSQL query engines or drivers in AegisPath.")

    print("-" * 76)
    print("  >>> VERDICT: N/A")
    print("  Architectural Evidence: NoSQL query engines are not used.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_inpv_05_6_nosql_injection()
    sys.exit(0 if success else 1)
