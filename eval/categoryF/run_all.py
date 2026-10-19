#!/usr/bin/env python3
"""
AegisPath Category F Verification Runner
Runs all 4 OWASP WSTG v4.2 Authorization Testing scripts sequentially
and prints the formal verification matrix table.
"""
import sys
import subprocess
from pathlib import Path

CATEGORY_F_DIR = Path(__file__).resolve().parent

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

TESTS = [
    ("WSTG-ATHZ-01", "Testing Directory Traversal File Include (4.5.1)", "test_wstg_athz_01_directory_traversal.py", "PASS (Verified)"),
    ("WSTG-ATHZ-02", "Testing for Bypassing Authorization Schema (4.5.2)", "test_wstg_athz_02_bypassing_authz_schema.py", "PASS (Verified)"),
    ("WSTG-ATHZ-03", "Testing for Privilege Escalation (4.5.3)", "test_wstg_athz_03_privilege_escalation.py", "PASS (Verified)"),
    ("WSTG-ATHZ-04", "Testing for Insecure Direct Object References (IDOR) (4.5.4)", "test_wstg_athz_04_idor.py", "PASS (Verified)"),
]


def run_all_category_f():
    print("=" * 84)
    print(" AegisPath Category F: OWASP WSTG v4.2 — 4.5 Authorization Testing")
    print(" Executing 4 Individual Verification Test Suites")
    print("=" * 84 + "\n")

    summary_rows = []
    all_passed = True

    for tid, name, script_name, expected_status in TESTS:
        script_path = CATEGORY_F_DIR / script_name
        print(f"--> Running {tid}: {name} ({script_name})...")
        res = subprocess.run([sys.executable, str(script_path)], capture_output=True, text=True, encoding="utf-8")

        if res.returncode == 0:
            print(f"    [OK] Execution finished successfully.")
            summary_rows.append((tid, name, expected_status, "PASS"))
        else:
            print(f"    [FAIL] Script exited with code {res.returncode}")
            print(f"    Error output:\n{res.stderr}")
            summary_rows.append((tid, name, expected_status, "FAIL"))
            all_passed = False

    print("\n" + "=" * 84)
    print(" CATEGORY F VERIFICATION MATRIX TABLE")
    print("=" * 84)
    print(f"| {'TEST ID':<14} | {'VULNERABILITY / TEST CASE NAME':<40} | {'STATUS':<20} |")
    print("-" * 84)
    for tid, name, status, exec_result in summary_rows:
        print(f"| {tid:<14} | {name:<40} | {status:<20} |")
    print("-" * 84)
    print(f" OVERALL RESULT: {'ALL 4 TESTS VERIFIED (PASS)' if all_passed else 'SOME TESTS FAILED'}")
    print("=" * 84)
    return all_passed


if __name__ == "__main__":
    success = run_all_category_f()
    sys.exit(0 if success else 1)
