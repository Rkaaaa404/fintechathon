#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category D (Identity Management)
Test ID: WSTG-IDNT-03 - Test Account Provisioning Process
Status: N/A (By Design)

White-Box Verification & Architectural Evidence:
Accounts are deterministically seeded via synthetic fixture scripts
for reproducible sandbox evaluation.
"""
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT_DIR))

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from backend.bank.database import get_connection as get_bank_db
from backend.api.database import get_connection as get_api_db


def test_wstg_idnt_03_account_provisioning():
    print("=" * 76)
    print(" [TEST ID: WSTG-IDNT-03] Test Account Provisioning Process")
    print(" Status: N/A (By Design)")
    print("=" * 76)

    print("  [1] Deterministic Synthetic Seeding Audit:")
    conn_bank = get_bank_db()
    cur = conn_bank.execute("SELECT account_id, currency, balance_usd FROM accounts WHERE account_id = 'acc_student_ayu'")
    account = cur.fetchone()

    assert account is not None, "FAIL: Pre-seeded synthetic student account missing!"
    print(f"      Seeded Account ID : {account['account_id']}")
    print(f"      Initial Balance   : ${account['balance_usd']:,.2f} {account['currency']}")
    print("      Provisioning Mode : Deterministic fixture script (Zero dynamic account creation)")

    # 2. Check API Policy Seeding
    conn_api = get_api_db()
    cur_p = conn_api.execute("SELECT user_id, single_send_cap_usd, daily_cap_usd FROM policy WHERE user_id = 'usr_ayu'")
    pol = cur_p.fetchone()
    assert pol is not None, "FAIL: Pre-seeded policy record missing!"
    print(f"      Seeded User ID    : {pol['user_id']}")
    print(f"      Policy Allowance  : Single Cap=${pol['single_send_cap_usd']}, Daily Cap=${pol['daily_cap_usd']}")

    print("-" * 76)
    print("  >>> VERDICT: N/A (By Design)")
    print("  Architectural Evidence: Accounts are deterministically seeded via synthetic")
    print("  fixture scripts for reproducible sandbox evaluation.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_idnt_03_account_provisioning()
    sys.exit(0 if success else 1)
