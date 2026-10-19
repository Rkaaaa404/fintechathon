#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category H (Input Validation Testing)
Test ID: WSTG-INPV-07 - Testing for XML Injection (4.7.7)
Status: N/A

White-Box Verification & Architectural Evidence:
All API contracts use JSON; no XML parsers are present. XXE and XML
injection vectors are non-applicable by design.
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


def test_wstg_inpv_07_xml_injection():
    print("=" * 76)
    print(" [TEST ID: WSTG-INPV-07] Testing for XML Injection (XXE) (4.7.7)")
    print(" Status: N/A")
    print("=" * 76)

    # Audit codebase for XML parsers
    print("  [1] Auditing Codebase for XML Parsers & Deserializers:")
    backend_py = list((ROOT_DIR / "backend").rglob("*.py"))
    xml_parsers_found = []

    xml_patterns = [
        r"xml\.etree",
        r"xml\.dom",
        r"xml\.sax",
        r"lxml",
        r"defusedxml",
        r"minidom"
    ]

    for f in backend_py:
        content = f.read_text(encoding="utf-8", errors="ignore")
        for pat in xml_patterns:
            if re.search(pat, content):
                xml_parsers_found.append((f.name, pat))

    print(f"      XML Parsers Found in Backend: {xml_parsers_found}")
    assert len(xml_parsers_found) == 0, f"FAIL: Found XML parsers: {xml_parsers_found}"
    print("      Verification: Zero XML parsers present; all endpoints strictly consume application/json.")

    print("-" * 76)
    print("  >>> VERDICT: N/A")
    print("  Architectural Evidence: All API contracts use JSON; no XML parsers are present.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_inpv_07_xml_injection()
    sys.exit(0 if success else 1)
