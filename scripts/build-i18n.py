#!/usr/bin/env python3
"""
Extracts i18n strings and validates 100% key completeness between en.json and zh.json.
"""
import re
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent

def build():
    source = ROOT.parent / "prototype" / "js" / "i18n.js"
    if not source.exists():
        print("Source i18n.js not found.")
        sys.exit(1)
        
    text = source.read_text(encoding="utf-8")
    
    m_en = re.search(r"en:\s*\{(.*?)\},\s*zh:", text, re.DOTALL)
    m_zh = re.search(r"zh:\s*\{(.*?)\}\s*\};", text, re.DOTALL)
    
    if not m_en or not m_zh:
        print("Failed to locate en / zh dictionaries in source.")
        sys.exit(1)
        
    def parse_dict(s):
        result = {}
        for line in s.splitlines():
            line = line.strip()
            if not line or line.startswith("//"):
                continue
            m = re.match(r"(\w+):\s*\"([^\"]*)\",?", line)
            if m:
                result[m.group(1)] = m.group(2)
        return result

    en_dict = parse_dict(m_en.group(1))
    zh_dict = parse_dict(m_zh.group(1))

    # Add missing bilingual pairs for planner
    if "planner_title" not in zh_dict:
        zh_dict["planner_title"] = "学期收支规划"
    if "planner_sub" not in zh_dict:
        zh_dict["planner_sub"] = "Runway planner"
    if "planner_subtitle" not in zh_dict:
        zh_dict["planner_subtitle"] = "估算参考，非收益承诺"
    if "planner_subtitle_sub" not in zh_dict:
        zh_dict["planner_subtitle_sub"] = "Estimate, not a guarantee"
    
    out_dir = ROOT / "packages" / "i18n"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    (out_dir / "en.json").write_text(json.dumps(en_dict, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (out_dir / "zh.json").write_text(json.dumps(zh_dict, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    
    print(f"Successfully generated packages/i18n/en.json ({len(en_dict)} keys) and zh.json ({len(zh_dict)} keys).")
    
    # Verify completeness
    missing_in_zh = set(en_dict.keys()) - set(zh_dict.keys())
    missing_in_en = set(zh_dict.keys()) - set(en_dict.keys())
    
    if missing_in_zh or missing_in_en:
        print(f"[FAIL] Key mismatch! Missing in ZH: {missing_in_zh}, Missing in EN: {missing_in_en}")
        sys.exit(1)
    else:
        print("[OK] 100% i18n key completeness verified!")

if __name__ == "__main__":
    build()
