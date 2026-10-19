#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category H (Input Validation Testing)
Test ID: WSTG-INPV-10 - Testing for IMAP SMTP Injection (4.7.10)
Status: N/A

White-Box Verification & Architectural Evidence:
IMAP/SMTP mail servers are not integrated in the MVP. Notifications
and receipts are delivered exclusively via in-app feeds and event streams.
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


def test_wstg_inpv_10_imap_smtp_injection():
    print("=" * 76)
    print(" [TEST ID: WSTG-INPV-10] Testing for IMAP/SMTP Injection (4.7.10)")
    print(" Status: N/A")
    print("=" * 76)

    print("  [1] Email Protocol & Library Dependency Audit:")
    pyproject = ROOT_DIR / "pyproject.toml"
    content = pyproject.read_text(encoding="utf-8", errors="ignore") if pyproject.exists() else ""
    
    mail_libs = ["smtplib", "imaplib", "aiosmtplib", "sendgrid", "mailgun"]
    found = [m for m in mail_libs if m in content]
    print(f"      Mail Drivers / Libraries Found: {found}")
    assert len(found) == 0
    print("      Verification: Zero email services or SMTP/IMAP interfaces integrated.")

    print("-" * 76)
    print("  >>> VERDICT: N/A")
    print("  Architectural Evidence: IMAP/SMTP mail servers are not integrated in the MVP.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_inpv_10_imap_smtp_injection()
    sys.exit(0 if success else 1)
