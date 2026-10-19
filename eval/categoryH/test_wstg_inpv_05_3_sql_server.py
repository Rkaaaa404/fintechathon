#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category H (Input Validation Testing)
Test ID: WSTG-INPV-05.3 - Testing for SQL Server (4.7.5.3)
Status: N/A

White-Box Verification & Architectural Evidence:
Microsoft SQL Server is not used.
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


def test_wstg_inpv_05_3_sql_server():
    print("=" * 76)
    print(" [TEST ID: WSTG-INPV-05.3] Testing for Microsoft SQL Server (4.7.5.3)")
    print(" Status: N/A")
    print("=" * 76)

    print("  [1] Database Driver Stack Audit:")
    pyproject_file = ROOT_DIR / "pyproject.toml"
    content = pyproject_file.read_text(encoding="utf-8", errors="ignore") if pyproject_file.exists() else ""
    
    mssql_drivers = ["pyodbc", "pymssql"]
    found = [d for d in mssql_drivers if d in content]
    print(f"      MSSQL Drivers in Dependencies: {found}")
    assert len(found) == 0
    print("      Verification: Zero MSSQL database connectors present in stack.")

    print("-" * 76)
    print("  >>> VERDICT: N/A")
    print("  Architectural Evidence: Microsoft SQL Server is not used.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_inpv_05_3_sql_server()
    sys.exit(0 if success else 1)
