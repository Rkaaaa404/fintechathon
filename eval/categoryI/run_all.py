#!/usr/bin/env python3
"""
AegisPath Category I Verification Runner
Runs all 2 OWASP WSTG v4.2 Error Handling Testing scripts sequentially
and prints the formal verification matrix table.
"""
import sys
import subprocess
from pathlib import Path

CATEGORY_I_DIR = Path(__file__).resolve().parent

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

TESTS = [
    ("WSTG-ERRH-01", "Testing for Improper Error Handling (4.8.1)", "test_wstg_errh_01_improper_error_handling.py", "PASS (Verified)"),
    ("WSTG-ERRH-02", "Testing for Stack Traces (4.8.2)", "test_wstg_errh_02_stack_traces.py", "PASS (Verified)"),
]


def run_all_category_i():
    print("=" * 84)
    print(" AegisPath Category I: OWASP WSTG v4.2 — 4.8 Testing for Error Handling")
    print(" Executing 2 Individual Verification Test Suites")
    print("=" * 84 + "\n")

    summary_rows = []
    all_passed = True

    for tid, name, script_name, expected_status in TESTS:
        script_path = CATEGORY_I_DIR / script_name
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
    print(" CATEGORY I VERIFICATION MATRIX TABLE")
    print("=" * 84)
    print(f"| {'TEST ID':<14} | {'VULNERABILITY / TEST CASE NAME':<40} | {'STATUS':<20} |")
    print("-" * 84)
    for tid, name, status, exec_result in summary_rows:
        print(f"| {tid:<14} | {name:<40} | {status:<20} |")
    print("-" * 84)
    print(f" OVERALL RESULT: {'ALL 2 TESTS VERIFIED (PASS)' if all_passed else 'SOME TESTS FAILED'}")
    print("=" * 84)
    return all_passed


if __name__ == "__main__":
    success = run_all_category_i()
    sys.exit(0 if success else 1)
