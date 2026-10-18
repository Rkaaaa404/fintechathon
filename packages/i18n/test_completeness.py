#!/usr/bin/env python3
"""
Completeness unit test for @aegispath/i18n
"""
import json
from pathlib import Path
import sys

def test_i18n_completeness():
    dir_path = Path(__file__).parent
    en = json.loads((dir_path / "en.json").read_text(encoding="utf-8"))
    zh = json.loads((dir_path / "zh.json").read_text(encoding="utf-8"))
    
    missing_in_zh = set(en.keys()) - set(zh.keys())
    missing_in_en = set(zh.keys()) - set(en.keys())
    
    assert not missing_in_zh, f"Missing keys in zh.json: {missing_in_zh}"
    assert not missing_in_en, f"Missing keys in en.json: {missing_in_en}"
    print(f"[OK] @aegispath/i18n has 100% key completeness across {len(en)} strings.")

if __name__ == "__main__":
    test_i18n_completeness()
