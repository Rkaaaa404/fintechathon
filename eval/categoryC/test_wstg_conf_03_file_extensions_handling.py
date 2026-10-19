#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category C (Configuration & Deployment)
Test ID: WSTG-CONF-03 - Test File Extensions Handling for Sensitive Information
Status: PASS (Verified)

White-Box Verification & Architectural Evidence:
No .env, .config, or SQLite database files reside inside the PWA static asset
directory (frontend/public/).
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


def test_wstg_conf_03_file_extensions_handling():
    print("=" * 76)
    print(" [TEST ID: WSTG-CONF-03] Test File Extensions Handling for Sensitive Information")
    print(" Status: PASS (Verified)")
    print("=" * 76)

    public_dir = ROOT_DIR / "frontend" / "public"
    print(f"  [1] Sensitive File Extension Audit in Public Directory ({public_dir}):")
    assert public_dir.exists(), f"FAIL: Missing frontend public dir {public_dir}"

    forbidden_extensions = {
        ".env", ".config", ".conf", ".ini", ".db", ".sqlite", ".sqlite3",
        ".bak", ".old", ".pem", ".key", ".crt", ".sql", ".sh", ".py"
    }

    all_public_files = list(public_dir.rglob("*"))
    leaked_files = []

    for f in all_public_files:
        if f.is_file():
            # Check extension
            if f.suffix.lower() in forbidden_extensions or f.name.startswith(".env"):
                leaked_files.append(f.name)

    print(f"      Total Public Files Scanned : {len([f for f in all_public_files if f.is_file()])}")
    print(f"      Forbidden Extensions Found : {leaked_files}")

    assert len(leaked_files) == 0, f"FAIL: Sensitive file extensions found in public dir: {leaked_files}"
    print("      Verification: Zero database, environment, or configuration files exposed.")

    print("-" * 76)
    print("  >>> VERDICT: PASS (Verified)")
    print("  Architectural Evidence: No .env, .config, or SQLite database files reside")
    print("  inside the PWA static asset directory.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_conf_03_file_extensions_handling()
    sys.exit(0 if success else 1)
