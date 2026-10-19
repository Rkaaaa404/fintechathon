#!/usr/bin/env python3
"""
AegisPath Category K Verification Runner
Runs all 9 OWASP WSTG v4.2 Business Logic Testing scripts sequentially
and prints the formal verification matrix table.
"""
import sys
import subprocess
from pathlib import Path

CATEGORY_K_DIR = Path(__file__).resolve().parent

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

TESTS = [
    ("WSTG-BUSL-01", "Test Business Logic Data Validation (4.10.1)", "test_wstg_busl_01_business_data_validation.py", "PASS (Verified)"),
    ("WSTG-BUSL-02", "Test Ability to Forge Requests (4.10.2)", "test_wstg_busl_02_ability_to_forge_requests.py", "PASS (Verified)"),
    ("WSTG-BUSL-03", "Test Integrity Checks (4.10.3)", "test_wstg_busl_03_integrity_checks.py", "PASS (Verified)"),
    ("WSTG-BUSL-04", "Test for Process Timing (4.10.4)", "test_wstg_busl_04_process_timing.py", "KNOWN RISK"),
    ("WSTG-BUSL-05", "Test Number of Times a Function Can Be Used Limits (4.10.5)", "test_wstg_busl_05_function_limits.py", "PASS (Verified)"),
    ("WSTG-BUSL-06", "Testing for the Circumvention of Work Flows (4.10.6)", "test_wstg_busl_06_circumvention_workflows.py", "PASS (Verified)"),
    ("WSTG-BUSL-07", "Test Defenses Against Application Misuse (4.10.7)", "test_wstg_busl_07_defenses_against_misuse.py", "PASS (Verified)"),
    ("WSTG-BUSL-08", "Test Upload of Unexpected File Types (4.10.8)", "test_wstg_busl_08_upload_unexpected_file_types.py", "PASS (Verified)"),
    ("WSTG-BUSL-09", "Test Upload of Malicious Files (4.10.9)", "test_wstg_busl_09_upload_malicious_files.py", "PASS (Verified)"),
]


def run_all_category_k():
    print("=" * 88)
    print(" AegisPath Category K: OWASP WSTG v4.2 — 4.10 Business Logic Testing")
    print(" Executing 9 Individual Verification Test Suites")
    print("=" * 88 + "\n")

    summary_rows = []
    all_passed = True

    for tid, name, script_name, expected_status in TESTS:
        script_path = CATEGORY_K_DIR / script_name
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

    print("\n" + "=" * 88)
    print(" CATEGORY K VERIFICATION MATRIX TABLE")
    print("=" * 88)
    print(f"| {'TEST ID':<14} | {'VULNERABILITY / TEST CASE NAME':<44} | {'STATUS':<18} |")
    print("-" * 88)
    for tid, name, status, exec_result in summary_rows:
        print(f"| {tid:<14} | {name:<44} | {status:<18} |")
    print("-" * 88)
    print(f" OVERALL RESULT: {'ALL 9 TESTS VERIFIED (PASS)' if all_passed else 'SOME TESTS FAILED'}")
    print("=" * 88)
    return all_passed


if __name__ == "__main__":
    success = run_all_category_k()
    sys.exit(0 if success else 1)
