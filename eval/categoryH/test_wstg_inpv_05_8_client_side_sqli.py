#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category H (Input Validation Testing)
Test ID: WSTG-INPV-05.8 - Testing for Client-side SQL Injection (4.7.5.8)
Status: N/A

White-Box Verification & Architectural Evidence:
Browser WebSQL is not used in the PWA. Client-side state is handled
purely via React state and standard browser APIs.
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


def test_wstg_inpv_05_8_client_side_sqli():
    print("=" * 76)
    print(" [TEST ID: WSTG-INPV-05.8] Testing for Client-side SQL Injection (4.7.5.8)")
    print(" Status: N/A")
    print("=" * 76)

    # Audit client-side codebase for openDatabase / WebSQL calls
    print("  [1] Auditing PWA Client Code for WebSQL APIs:")
    web_dir = ROOT_DIR / "web"
    websql_calls = []

    if web_dir.exists():
        for ext in ["*.js", "*.ts", "*.tsx", "*.html"]:
            for f in web_dir.rglob(ext):
                content = f.read_text(encoding="utf-8", errors="ignore")
                if "openDatabase" in content or "executeSql" in content:
                    websql_calls.append(f.name)

    print(f"      WebSQL openDatabase / executeSql calls: {websql_calls}")
    assert len(websql_calls) == 0, f"FAIL: Found WebSQL calls: {websql_calls}"
    print("      Verification: Zero WebSQL or client-side SQL databases used in frontend.")

    print("-" * 76)
    print("  >>> VERDICT: N/A")
    print("  Architectural Evidence: Browser WebSQL is not used in the PWA.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_inpv_05_8_client_side_sqli()
    sys.exit(0 if success else 1)
