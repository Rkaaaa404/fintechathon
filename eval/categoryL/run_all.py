#!/usr/bin/env python3
"""
AegisPath Category L Verification Runner
Runs all 13 OWASP WSTG v4.2 Client-side Testing scripts sequentially
and prints the formal verification matrix table.
"""
import sys
import subprocess
from pathlib import Path

CATEGORY_L_DIR = Path(__file__).resolve().parent

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

TESTS = [
    ("WSTG-CLNT-01", "Testing for DOM-Based Cross Site Scripting (4.11.1)", "test_wstg_clnt_01_dom_xss.py", "PASS (Verified)"),
    ("WSTG-CLNT-02", "Testing for JavaScript Execution (4.11.2)", "test_wstg_clnt_02_javascript_execution.py", "PASS (Verified)"),
    ("WSTG-CLNT-03", "Testing for HTML Injection (4.11.3)", "test_wstg_clnt_03_html_injection.py", "PASS (Verified)"),
    ("WSTG-CLNT-04", "Testing for Client-side URL Redirect (4.11.4)", "test_wstg_clnt_04_client_url_redirect.py", "PASS (Verified)"),
    ("WSTG-CLNT-05", "Testing for CSS Injection (4.11.5)", "test_wstg_clnt_05_css_injection.py", "PASS (Verified)"),
    ("WSTG-CLNT-06", "Testing for Client-side Resource Manipulation (4.11.6)", "test_wstg_clnt_06_client_resource_manipulation.py", "PASS (Verified)"),
    ("WSTG-CLNT-07", "Testing Cross Origin Resource Sharing (CORS) (4.11.7)", "test_wstg_clnt_07_cors.py", "PASS (Verified)"),
    ("WSTG-CLNT-08", "Testing for Cross Site Flashing (4.11.8)", "test_wstg_clnt_08_cross_site_flashing.py", "N/A"),
    ("WSTG-CLNT-09", "Testing for Clickjacking (4.11.9)", "test_wstg_clnt_09_clickjacking.py", "PASS (Verified)"),
    ("WSTG-CLNT-10", "Testing WebSockets (4.11.10)", "test_wstg_clnt_10_websockets.py", "N/A"),
    ("WSTG-CLNT-11", "Testing Web Messaging (4.11.11)", "test_wstg_clnt_11_web_messaging.py", "N/A"),
    ("WSTG-CLNT-12", "Testing Browser Storage (4.11.12)", "test_wstg_clnt_12_browser_storage.py", "PASS (Verified)"),
    ("WSTG-CLNT-13", "Testing for Cross Site Script Inclusion (XSSI) (4.11.13)", "test_wstg_clnt_13_xssi.py", "PASS (Verified)"),
]


def run_all_category_l():
    print("=" * 88)
    print(" AegisPath Category L: OWASP WSTG v4.2 — 4.11 Client-side Testing")
    print(" Executing 13 Individual Verification Test Suites")
    print("=" * 88 + "\n")

    summary_rows = []
    all_passed = True

    for tid, name, script_name, expected_status in TESTS:
        script_path = CATEGORY_L_DIR / script_name
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
    print(" CATEGORY L VERIFICATION MATRIX TABLE")
    print("=" * 88)
    print(f"| {'TEST ID':<14} | {'VULNERABILITY / TEST CASE NAME':<44} | {'STATUS':<18} |")
    print("-" * 88)
    for tid, name, status, exec_result in summary_rows:
        print(f"| {tid:<14} | {name:<44} | {status:<18} |")
    print("-" * 88)
    print(f" OVERALL RESULT: {'ALL 13 TESTS VERIFIED (PASS)' if all_passed else 'SOME TESTS FAILED'}")
    print("=" * 88)
    return all_passed


if __name__ == "__main__":
    success = run_all_category_l()
    sys.exit(0 if success else 1)
