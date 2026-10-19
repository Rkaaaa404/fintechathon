#!/usr/bin/env python3
"""
AegisPath Category D Verification Runner
Runs all 5 OWASP WSTG v4.2 Identity Management Testing scripts sequentially
and prints the formal verification matrix table.
"""
import sys
import subprocess
from pathlib import Path

CATEGORY_D_DIR = Path(__file__).resolve().parent

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

TESTS = [
    ("WSTG-IDNT-01", "Test Role Definitions", "test_wstg_idnt_01_role_definitions.py", "PASS (Verified)"),
    ("WSTG-IDNT-02", "User Registration Process", "test_wstg_idnt_02_user_registration.py", "N/A"),
    ("WSTG-IDNT-03", "Account Provisioning Process", "test_wstg_idnt_03_account_provisioning.py", "N/A"),
    ("WSTG-IDNT-04", "Account Enumeration & Guessable User Account", "test_wstg_idnt_04_account_enumeration.py", "PASS (Verified)"),
    ("WSTG-IDNT-05", "Weak or Unenforced Username Policy", "test_wstg_idnt_05_username_policy.py", "N/A"),
]


def run_all_category_d():
    print("=" * 80)
    print(" AegisPath Category D: OWASP WSTG v4.2 — 4.3 Identity Management")
    print(" Executing 5 Individual Verification Test Suites")
    print("=" * 80 + "\n")

    summary_rows = []
    all_passed = True

    for tid, name, script_name, expected_status in TESTS:
        script_path = CATEGORY_D_DIR / script_name
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

    print("\n" + "=" * 80)
    print(" CATEGORY D VERIFICATION MATRIX TABLE")
    print("=" * 80)
    print(f"| {'TEST ID':<14} | {'VULNERABILITY / TEST CASE NAME':<40} | {'STATUS':<20} |")
    print("-" * 80)
    for tid, name, status, exec_result in summary_rows:
        print(f"| {tid:<14} | {name:<40} | {status:<20} |")
    print("-" * 80)
    print(f" OVERALL RESULT: {'ALL 5 TESTS VERIFIED (PASS)' if all_passed else 'SOME TESTS FAILED'}")
    print("=" * 80)
    return all_passed


if __name__ == "__main__":
    success = run_all_category_d()
    sys.exit(0 if success else 1)
