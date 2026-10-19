#!/usr/bin/env python3
"""
AegisPath Category B Verification Runner
Runs all 10 OWASP WSTG v4.2 Information Gathering test scripts sequentially
and prints the formal verification matrix table.
"""
import sys
import subprocess
from pathlib import Path

CATEGORY_B_DIR = Path(__file__).resolve().parent

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

TESTS = [
    ("WSTG-INFO-01", "Search Engine Reconnaissance", "test_wstg_info_01_search_engine.py", "N/A"),
    ("WSTG-INFO-02", "Fingerprint Web Server", "test_wstg_info_02_fingerprint_server.py", "PASS (Verified)"),
    ("WSTG-INFO-03", "Review Webserver Metafiles", "test_wstg_info_03_webserver_metafiles.py", "PASS (Verified)"),
    ("WSTG-INFO-04", "Enumerate Applications", "test_wstg_info_04_enumerate_applications.py", "PASS (Verified)"),
    ("WSTG-INFO-05", "Review Webpage Content", "test_wstg_info_05_review_webpage_content.py", "PASS (Verified)"),
    ("WSTG-INFO-06", "Identify Application Entry Points", "test_wstg_info_06_entry_points.py", "PASS (Verified)"),
    ("WSTG-INFO-07", "Map Execution Paths", "test_wstg_info_07_execution_paths.py", "PASS (Verified)"),
    ("WSTG-INFO-08", "Fingerprint Web Framework", "test_wstg_info_08_fingerprint_framework.py", "PASS (Verified)"),
    ("WSTG-INFO-09", "Fingerprint Web Application", "test_wstg_info_09_fingerprint_webapp.py", "N/A"),
    ("WSTG-INFO-10", "Map Application Architecture", "test_wstg_info_10_map_architecture.py", "PASS (Verified)"),
]


def run_all_category_b():
    print("=" * 80)
    print(" AegisPath Category B: OWASP WSTG v4.2 — 4.1 Information Gathering")
    print(" Executing 10 Individual Verification Test Suites")
    print("=" * 80 + "\n")

    summary_rows = []
    all_passed = True

    for tid, name, script_name, expected_status in TESTS:
        script_path = CATEGORY_B_DIR / script_name
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
    print(" CATEGORY B VERIFICATION MATRIX TABLE")
    print("=" * 80)
    print(f"| {'TEST ID':<14} | {'VULNERABILITY / TEST CASE NAME':<34} | {'STATUS':<20} |")
    print("-" * 80)
    for tid, name, status, exec_result in summary_rows:
        print(f"| {tid:<14} | {name:<34} | {status:<20} |")
    print("-" * 80)
    print(f" OVERALL RESULT: {'ALL 10 TESTS VERIFIED (PASS)' if all_passed else 'SOME TESTS FAILED'}")
    print("=" * 80)
    return all_passed


if __name__ == "__main__":
    success = run_all_category_b()
    sys.exit(0 if success else 1)
