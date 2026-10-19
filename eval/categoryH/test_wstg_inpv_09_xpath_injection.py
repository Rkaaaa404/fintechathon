#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category H (Input Validation Testing)
Test ID: WSTG-INPV-09 - Testing for XPath Injection (4.7.9)
Status: N/A

White-Box Verification & Architectural Evidence:
XPath queries are not used. All relational and document entities are queried
via SQL/SQLAlchemy.
"""
import sys
import re
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT_DIR))

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass


def test_wstg_inpv_09_xpath_injection():
    print("=" * 76)
    print(" [TEST ID: WSTG-INPV-09] Testing for XPath Injection (4.7.9)")
    print(" Status: N/A")
    print("=" * 76)

    # Audit codebase for XPath syntax
    print("  [1] Auditing Codebase for XPath Query APIs:")
    backend_py = list((ROOT_DIR / "backend").rglob("*.py"))
    xpath_calls = []

    for f in backend_py:
        content = f.read_text(encoding="utf-8", errors="ignore")
        if re.search(r"\.xpath\s*\(", content):
            xpath_calls.append(f.name)

    print(f"      XPath Method Calls Found: {xpath_calls}")
    assert len(xpath_calls) == 0, f"FAIL: Found XPath calls: {xpath_calls}"
    print("      Verification: Zero XPath evaluation APIs present.")

    print("-" * 76)
    print("  >>> VERDICT: N/A")
    print("  Architectural Evidence: XPath queries are not used.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_inpv_09_xpath_injection()
    sys.exit(0 if success else 1)
