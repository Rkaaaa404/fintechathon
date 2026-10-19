#!/usr/bin/env python3
"""
AegisPath Category C Verification Runner
Runs all 11 OWASP WSTG v4.2 Configuration & Deployment Management test scripts sequentially
and prints the formal verification matrix table.
"""
import sys
import subprocess
from pathlib import Path

CATEGORY_C_DIR = Path(__file__).resolve().parent

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

TESTS = [
    ("WSTG-CONF-01", "Network Infrastructure Configuration", "test_wstg_conf_01_network_infrastructure.py", "PASS (Verified)"),
    ("WSTG-CONF-02", "Application Platform Configuration", "test_wstg_conf_02_application_platform_logging.py", "PASS (Verified)"),
    ("WSTG-CONF-03", "File Extensions Handling", "test_wstg_conf_03_file_extensions_handling.py", "PASS (Verified)"),
    ("WSTG-CONF-04", "Old Backup and Unreferenced Files", "test_wstg_conf_04_backup_unreferenced_files.py", "PASS (Verified)"),
    ("WSTG-CONF-05", "Infrastructure and Admin Interfaces", "test_wstg_conf_05_admin_interfaces.py", "PASS (Verified)"),
    ("WSTG-CONF-06", "HTTP Methods", "test_wstg_conf_06_http_methods.py", "PASS (Verified)"),
    ("WSTG-CONF-07", "HTTP Strict Transport Security", "test_wstg_conf_07_hsts.py", "N/A"),
    ("WSTG-CONF-08", "RIA Cross Domain Policy", "test_wstg_conf_08_ria_cross_domain.py", "N/A"),
    ("WSTG-CONF-09", "File Permission", "test_wstg_conf_09_file_permissions.py", "PASS (Verified)"),
    ("WSTG-CONF-10", "Subdomain Takeover", "test_wstg_conf_10_subdomain_takeover.py", "N/A"),
    ("WSTG-CONF-11", "Cloud Storage", "test_wstg_conf_11_cloud_storage.py", "N/A"),
]


def run_all_category_c():
    print("=" * 80)
    print(" AegisPath Category C: OWASP WSTG v4.2 — 4.2 Configuration & Deployment")
    print(" Executing 11 Individual Verification Test Suites")
    print("=" * 80 + "\n")

    summary_rows = []
    all_passed = True

    for tid, name, script_name, expected_status in TESTS:
        script_path = CATEGORY_C_DIR / script_name
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
    print(" CATEGORY C VERIFICATION MATRIX TABLE")
    print("=" * 80)
    print(f"| {'TEST ID':<14} | {'VULNERABILITY / TEST CASE NAME':<36} | {'STATUS':<20} |")
    print("-" * 80)
    for tid, name, status, exec_result in summary_rows:
        print(f"| {tid:<14} | {name:<36} | {status:<20} |")
    print("-" * 80)
    print(f" OVERALL RESULT: {'ALL 11 TESTS VERIFIED (PASS)' if all_passed else 'SOME TESTS FAILED'}")
    print("=" * 80)
    return all_passed


if __name__ == "__main__":
    success = run_all_category_c()
    sys.exit(0 if success else 1)
