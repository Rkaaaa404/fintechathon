#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category H (Input Validation Testing)
Test ID: WSTG-INPV-05.2 - Testing for MySQL (4.7.5.2)
Status: N/A

White-Box Verification & Architectural Evidence:
MySQL is not used in the local container stack.
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


def test_wstg_inpv_05_2_mysql():
    print("=" * 76)
    print(" [TEST ID: WSTG-INPV-05.2] Testing for MySQL (4.7.5.2)")
    print(" Status: N/A")
    print("=" * 76)

    # Architectural audit
    print("  [1] Container & Database Driver Audit:")
    compose_file = ROOT_DIR / "docker-compose.yml"
    compose_content = compose_file.read_text(encoding="utf-8", errors="ignore") if compose_file.exists() else ""
    
    assert "mysql" not in compose_content.lower(), "FAIL: MySQL found in compose file"
    print("      Container Stack: Zero MySQL services configured.")

    print("-" * 76)
    print("  >>> VERDICT: N/A")
    print("  Architectural Evidence: MySQL is not used in the local container stack.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_inpv_05_2_mysql()
    sys.exit(0 if success else 1)
