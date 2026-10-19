#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category L (Client-side Testing)
Test ID: WSTG-CLNT-08 - Testing for Cross Site Flashing (4.11.8)
Status: N/A (By Design)

White-Box Verification & Architectural Evidence:
Adobe Flash is not used.
"""
import re
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT_DIR))

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass


def test_wstg_clnt_08_cross_site_flashing():
    print("=" * 76)
    print(" [TEST ID: WSTG-CLNT-08] Testing for Cross Site Flashing (4.11.8)")
    print(" Status: N/A (By Design)")
    print("=" * 76)

    frontend_dir = ROOT_DIR / "frontend"
    assert frontend_dir.exists(), f"Frontend directory missing: {frontend_dir}"

    # 1. Binary Flash File Extension Audit
    print(f"  [1] Binary Flash Artifact Scan ({frontend_dir}):")
    flash_extensions = [".swf", ".spl", ".as"]
    found_flash_files = []

    for ext in flash_extensions:
        matches = list(frontend_dir.rglob(f"*{ext}"))
        found_flash_files.extend(matches)

    print(f"      Adobe Flash files found: {len(found_flash_files)} ({found_flash_files})")
    assert len(found_flash_files) == 0, f"Flash binary files detected: {found_flash_files}"
    print("      Verification: Zero Adobe Flash binary files (.swf / .spl / .as) present.")

    # 2. Flash Object/Embed Tag and MIME Type Audit
    print("  [2] Markup and MIME Type Audit for Flash Embeds:")
    src_dir = frontend_dir / "src"
    all_source = list(src_dir.rglob("*.tsx")) + list(src_dir.rglob("*.html")) + list(src_dir.rglob("*.ts"))

    flash_patterns = [
        re.compile(r"application/x-shockwave-flash", re.IGNORECASE),
        re.compile(r"<embed\b[^>]*\.(?:swf|spl)", re.IGNORECASE),
        re.compile(r"<object\b[^>]*classid=[\"']clsid:D27CDB6E-AE6D-11cf-96B8-444553540000", re.IGNORECASE),
    ]

    flash_refs = []
    for sf in all_source:
        code = sf.read_text(encoding="utf-8")
        for pat in flash_patterns:
            if pat.search(code):
                flash_refs.append(sf.name)

    print(f"      Flash object/embed references found: {len(flash_refs)}")
    assert len(flash_refs) == 0, f"Flash references detected in: {flash_refs}"
    print("      Verification: Pure React/HTML5 architecture with complete absence of Flash.")

    print("-" * 76)
    print("  >>> VERDICT: N/A (By Design)")
    print("  Architectural Evidence: Adobe Flash is not used.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_clnt_08_cross_site_flashing()
    sys.exit(0 if success else 1)
