#!/usr/bin/env python3
"""
Clean script to remove temporary caches and build artifacts.
"""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent.parent

def clean():
    patterns = ["__pycache__", ".pytest_cache", ".mypy_cache", ".ruff_cache", "dist", "build"]
    for pat in patterns:
        for p in ROOT.rglob(pat):
            if p.is_dir():
                print(f"Removing {p.relative_to(ROOT)}...")
                shutil.rmtree(p, ignore_errors=True)
    print("Clean complete.")

if __name__ == "__main__":
    clean()
