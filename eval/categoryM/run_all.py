#!/usr/bin/env python3
"""
AegisPath Category M Verification Runner
Runs both Category M API Testing & Deferred UI Scope scripts sequentially
and prints the formal verification matrix table.
"""
import sys
import subprocess
from pathlib import Path

CATEGORY_M_DIR = Path(__file__).resolve().parent

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

TESTS = [
    ("WSTG-APIT-01", "Testing GraphQL (4.12.1) & REST API Contract Validation", "test_wstg_apit_01_graphql_rest_contract.py", "N/A (GraphQL) / PASS (REST)"),
    ("MVP-SCOPE-01", "Secondary Navigation Screens (Payees, Rates, More) & Optional On-Chain Anchor", "test_mvp_scope_01_deferred_ui_scope.py", "DEFERRED (Out of MVP)"),
]


def run_all_category_m():
    print("=" * 88)
    print(" AegisPath Category M: OWASP WSTG v4.2 — 4.12 API Testing & Deferred UI Scope")
    print(" Executing 2 Individual Verification Test Suites")
    print("=" * 88 + "\n")

    summary_rows = []
    all_passed = True

    for tid, name, script_name, expected_status in TESTS:
        script_path = CATEGORY_M_DIR / script_name
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
    print(" CATEGORY M VERIFICATION MATRIX TABLE")
    print("=" * 88)
    print(f"| {'TEST ID':<14} | {'VULNERABILITY / TEST CASE NAME':<40} | {'STATUS':<26} |")
    print("-" * 88)
    for tid, name, status, exec_result in summary_rows:
        print(f"| {tid:<14} | {name:<40} | {status:<26} |")
    print("-" * 88)
    print(f" OVERALL RESULT: {'ALL 2 TESTS VERIFIED (PASS)' if all_passed else 'SOME TESTS FAILED'}")
    print("=" * 88)
    return all_passed


if __name__ == "__main__":
    success = run_all_category_m()
    sys.exit(0 if success else 1)
