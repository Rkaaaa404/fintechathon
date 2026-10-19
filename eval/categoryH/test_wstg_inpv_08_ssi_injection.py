#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category H (Input Validation Testing)
Test ID: WSTG-INPV-08 - Testing for SSI Injection (4.7.8)
Status: N/A

White-Box Verification & Architectural Evidence:
Server-Side Includes (SSI) are not used. Backend services run as ASGI/Uvicorn
Python applications serving structured JSON APIs.
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


def test_wstg_inpv_08_ssi_injection():
    print("=" * 76)
    print(" [TEST ID: WSTG-INPV-08] Testing for SSI Injection (4.7.8)")
    print(" Status: N/A")
    print("=" * 76)

    print("  [1] Web Server Architecture Audit:")
    print("      - Web Ingress: ASGI / Uvicorn / Nginx reverse proxy")
    print("      - SSI Directives (<!--#exec / <!--#include): Disabled by default, zero .shtml files")
    
    shtml_files = list(ROOT_DIR.rglob("*.shtml"))
    print(f"      Server-Side Include (.shtml) Files: {len(shtml_files)}")
    assert len(shtml_files) == 0

    print("-" * 76)
    print("  >>> VERDICT: N/A")
    print("  Architectural Evidence: Server-Side Includes (SSI) are not used.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_inpv_08_ssi_injection()
    sys.exit(0 if success else 1)
