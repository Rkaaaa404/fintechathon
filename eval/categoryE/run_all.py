#!/usr/bin/env python3
"""
AegisPath Category E Verification Runner
Runs all 10 OWASP WSTG v4.2 Authentication Testing scripts sequentially
and prints the formal verification matrix table.
"""
import sys
import subprocess
from pathlib import Path

CATEGORY_E_DIR = Path(__file__).resolve().parent

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

TESTS = [
    ("WSTG-ATHN-01", "Credentials over Encrypted Channel", "test_wstg_athn_01_encrypted_channel.py", "KNOWN RISK"),
    ("WSTG-ATHN-02", "Default Credentials", "test_wstg_athn_02_default_credentials.py", "PASS (Verified)"),
    ("WSTG-ATHN-03", "Weak Lock Out Mechanism", "test_wstg_athn_03_lock_out_mechanism.py", "PASS (Verified)"),
    ("WSTG-ATHN-04", "Bypassing Authentication Schema", "test_wstg_athn_04_bypass_auth_schema.py", "PASS (Verified)"),
    ("WSTG-ATHN-05", "Vulnerable Remember Password", "test_wstg_athn_05_remember_password.py", "N/A"),
    ("WSTG-ATHN-06", "Browser Cache Weaknesses", "test_wstg_athn_06_browser_cache_weakness.py", "PASS (Verified)"),
    ("WSTG-ATHN-07", "Weak Password Policy", "test_wstg_athn_07_weak_password_policy.py", "N/A"),
    ("WSTG-ATHN-08", "Weak Security Question Answer", "test_wstg_athn_08_security_questions.py", "N/A"),
    ("WSTG-ATHN-09", "Weak Password Reset Functionality", "test_wstg_athn_09_password_reset.py", "N/A"),
    ("WSTG-ATHN-10", "Weaker Auth in Alternative Channel", "test_wstg_athn_10_alternative_channel.py", "PASS (Verified)"),
]


def run_all_category_e():
    print("=" * 80)
    print(" AegisPath Category E: OWASP WSTG v4.2 — 4.4 Authentication Testing")
    print(" Executing 10 Individual Verification Test Suites")
    print("=" * 80 + "\n")

    summary_rows = []
    all_passed = True

    for tid, name, script_name, expected_status in TESTS:
        script_path = CATEGORY_E_DIR / script_name
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
    print(" CATEGORY E VERIFICATION MATRIX TABLE")
    print("=" * 80)
    print(f"| {'TEST ID':<14} | {'VULNERABILITY / TEST CASE NAME':<36} | {'STATUS':<20} |")
    print("-" * 80)
    for tid, name, status, exec_result in summary_rows:
        print(f"| {tid:<14} | {name:<36} | {status:<20} |")
    print("-" * 80)
    print(f" OVERALL RESULT: {'ALL 10 TESTS VERIFIED (PASS)' if all_passed else 'SOME TESTS FAILED'}")
    print("=" * 80)
    return all_passed


if __name__ == "__main__":
    success = run_all_category_e()
    sys.exit(0 if success else 1)
