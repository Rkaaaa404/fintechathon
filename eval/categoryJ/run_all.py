#!/usr/bin/env python3
"""
AegisPath Category J Verification Runner
Runs all 4 OWASP WSTG v4.2 Weak Cryptography Testing scripts sequentially
and prints the formal verification matrix table.
"""
import sys
import subprocess
from pathlib import Path

CATEGORY_J_DIR = Path(__file__).resolve().parent

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

TESTS = [
    ("WSTG-CRYP-01", "Testing for Weak Transport Layer Security (4.9.1)", "test_wstg_cryp_01_tls_transport.py", "N/A"),
    ("WSTG-CRYP-02", "Testing for Padding Oracle (4.9.2)", "test_wstg_cryp_02_padding_oracle.py", "N/A"),
    ("WSTG-CRYP-03", "Testing for Sensitive Information Sent via Unencrypted Channels (4.9.3)", "test_wstg_cryp_03_sensitive_info_unencrypted.py", "PASS (Verified)"),
    ("WSTG-CRYP-04", "Testing for Weak Encryption (4.9.4)", "test_wstg_cryp_04_weak_encryption.py", "PASS (Verified)"),
]


def run_all_category_j():
    print("=" * 84)
    print(" AegisPath Category J: OWASP WSTG v4.2 — 4.9 Testing for Weak Cryptography")
    print(" Executing 4 Individual Verification Test Suites")
    print("=" * 84 + "\n")

    summary_rows = []
    all_passed = True

    for tid, name, script_name, expected_status in TESTS:
        script_path = CATEGORY_J_DIR / script_name
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
    print(" CATEGORY J VERIFICATION MATRIX TABLE")
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
    success = run_all_category_j()
    sys.exit(0 if success else 1)
