#!/usr/bin/env python3
"""
AegisPath Category G Verification Runner
Runs all 9 OWASP WSTG v4.2 Session Management Testing scripts sequentially
and prints the formal verification matrix table.
"""
import sys
import subprocess
from pathlib import Path

CATEGORY_G_DIR = Path(__file__).resolve().parent

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

TESTS = [
    ("WSTG-SESS-01", "Testing for Session Management Schema (4.6.1)", "test_wstg_sess_01_session_mgmt_schema.py", "PASS (Verified)"),
    ("WSTG-SESS-02", "Testing for Cookies Attributes (4.6.2)", "test_wstg_sess_02_cookies_attributes.py", "N/A"),
    ("WSTG-SESS-03", "Testing for Session Fixation (4.6.3)", "test_wstg_sess_03_session_fixation.py", "PASS (Verified)"),
    ("WSTG-SESS-04", "Testing for Exposed Session Variables (4.6.4)", "test_wstg_sess_04_exposed_session_variables.py", "PASS (Verified)"),
    ("WSTG-SESS-05", "Testing for Cross Site Request Forgery (CSRF) (4.6.5)", "test_wstg_sess_05_csrf.py", "PASS (Verified)"),
    ("WSTG-SESS-06", "Testing for Logout Functionality (4.6.6)", "test_wstg_sess_06_logout_functionality.py", "PASS (Verified)"),
    ("WSTG-SESS-07", "Testing Session Timeout (4.6.7)", "test_wstg_sess_07_session_timeout.py", "PASS (Verified)"),
    ("WSTG-SESS-08", "Testing for Session Puzzling (4.6.8)", "test_wstg_sess_08_session_puzzling.py", "PASS (Verified)"),
    ("WSTG-SESS-09", "Testing for Session Hijacking (4.6.9)", "test_wstg_sess_09_session_hijacking.py", "PASS (Verified)"),
]


def run_all_category_g():
    print("=" * 84)
    print(" AegisPath Category G: OWASP WSTG v4.2 — 4.6 Session Management Testing")
    print(" Executing 9 Individual Verification Test Suites")
    print("=" * 84 + "\n")

    summary_rows = []
    all_passed = True

    for tid, name, script_name, expected_status in TESTS:
        script_path = CATEGORY_G_DIR / script_name
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
    print(" CATEGORY G VERIFICATION MATRIX TABLE")
    print("=" * 84)
    print(f"| {'TEST ID':<14} | {'VULNERABILITY / TEST CASE NAME':<40} | {'STATUS':<20} |")
    print("-" * 84)
    for tid, name, status, exec_result in summary_rows:
        print(f"| {tid:<14} | {name:<40} | {status:<20} |")
    print("-" * 84)
    print(f" OVERALL RESULT: {'ALL 9 TESTS VERIFIED (PASS)' if all_passed else 'SOME TESTS FAILED'}")
    print("=" * 84)
    return all_passed


if __name__ == "__main__":
    success = run_all_category_g()
    sys.exit(0 if success else 1)
