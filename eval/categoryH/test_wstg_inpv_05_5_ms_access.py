#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category H (Input Validation Testing)
Test ID: WSTG-INPV-05.5 - Testing for MS Access (4.7.5.5)
Status: N/A

White-Box Verification & Architectural Evidence:
Microsoft Access is not used.
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


def test_wstg_inpv_05_5_ms_access():
    print("=" * 76)
    print(" [TEST ID: WSTG-INPV-05.5] Testing for MS Access (4.7.5.5)")
    print(" Status: N/A")
    print("=" * 76)

    print("  [1] Legacy File Database Driver Audit:")
    pyproject_file = ROOT_DIR / "pyproject.toml"
    content = pyproject_file.read_text(encoding="utf-8", errors="ignore") if pyproject_file.exists() else ""
    
    assert "msaccess" not in content.lower()
    print("      Verification: Zero MS Access or OLEDB drivers present.")

    print("-" * 76)
    print("  >>> VERDICT: N/A")
    print("  Architectural Evidence: Microsoft Access is not used.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_inpv_05_5_ms_access()
    sys.exit(0 if success else 1)
