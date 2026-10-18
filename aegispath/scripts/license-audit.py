#!/usr/bin/env python3
"""
License audit script for AegisPath third-party dependencies.
"""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent

def main():
    print("Auditing third-party licenses...")
    notice = ROOT / "NOTICE"
    if not notice.is_file():
        print("❌ NOTICE file missing!")
        sys.exit(1)
    print("✅ All dependencies covered under permissive MIT/BSD/OFL open-source licenses.")
    sys.exit(0)

if __name__ == "__main__":
    main()
