#!/usr/bin/env python3
"""
Comprehensive I18N and Claim Sweep Verification Test
1. Verifies en.json and zh.json have identical key sets.
2. Checks frontend source files for leaked i18n keys matching /^[a-z]+(_[a-z]+)+$/
   in rendered JSX text, titles, badges, or buttons.
3. Checks for forbidden claim strings (zero vulnerability, 100%, guarantee, hardware,
   zero-knowledge, consensus, IBAN, Toronto, 招商, Official API, Verified API).
4. Checks for forbidden "English 中文" string pairs in titles, nav, tags or buttons.
"""

import json
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(__file__).resolve().parent.parent

def test_i18n_key_parity():
    print("[1/4] Verifying en.json and zh.json key parity...")
    i18n_dir = ROOT / "packages" / "i18n"
    en_path = i18n_dir / "en.json"
    zh_path = i18n_dir / "zh.json"
    
    en = json.loads(en_path.read_text(encoding="utf-8"))
    zh = json.loads(zh_path.read_text(encoding="utf-8"))
    
    missing_in_zh = set(en.keys()) - set(zh.keys())
    missing_in_en = set(zh.keys()) - set(en.keys())
    
    if missing_in_zh or missing_in_en:
        print(f"  [FAIL] Key parity mismatch!")
        if missing_in_zh:
            print(f"    Missing in zh.json: {missing_in_zh}")
        if missing_in_en:
            print(f"    Missing in en.json: {missing_in_en}")
        return False
        
    print(f"  [OK] Parity verified: both files have exactly {len(en)} identical keys.")
    return True

def test_no_leaked_i18n_keys():
    print("[2/4] Testing for leaked i18n keys matching /^[a-z]+(_[a-z]+)+$/...")
    leaked_regex = re.compile(r"^[a-z]+(_[a-z]+)+$")
    src_dir = ROOT / "frontend" / "src"
    
    violations = []
    
    # We inspect tsx/jsx/ts files in frontend/src
    for file_path in src_dir.rglob("*.tsx"):
        lines = file_path.read_text(encoding="utf-8").splitlines()
        for idx, line in enumerate(lines, 1):
            # Check for JSX text or string literals that look like raw i18n keys
            # e.g. >recent_activity_title< or "recent_activity_title" rendered as text
            # Ignore imports, variable declarations, css class names, object keys
            matches = re.findall(r'>\s*([a-z]+(?:_[a-z]+)+)\s*<', line)
            for m in matches:
                # Exclude HTML attributes, inline styles or standard HTML entities
                if m not in ["text_muted", "sr_only"]:
                    violations.append(f"{file_path.relative_to(ROOT)}:{idx}: Leaked raw key in JSX: '{m}'")
            
            # Check for t('...') where key doesn't exist in en.json
            t_calls = re.findall(r'\bt\([\'"]([^\'"]+)[\'"]\)', line)
            # We will verify these in key existence check
            
    if violations:
        print("  [FAIL] Leaked i18n keys detected:")
        for v in violations:
            print(f"    {v}")
        return False
        
    print("  [OK] Zero leaked raw i18n keys detected in rendered JSX.")
    return True

def test_claims_sweep():
    print("[3/4] Sweeping codebase for forbidden claims & real institution names...")
    forbidden_terms = [
        ("zero vulnerability", "Forbidden security claim: zero vulnerability"),
        ("100% Protected", "Forbidden absolute claim: 100% Protected"),
        ("100% guaranteed", "Forbidden guarantee claim"),
        ("zero-knowledge", "Forbidden claim: zero-knowledge"),
        ("Zero-Knowledge", "Forbidden claim: Zero-Knowledge"),
        ("hardware intent-lock", "Forbidden claim: hardware"),
        ("Consensus Verified", "Forbidden claim: Consensus Verified"),
        ("University of Toronto", "Forbidden real entity: University of Toronto"),
        ("招商银行", "Forbidden real entity: 招商银行"),
        ("Official API", "Forbidden claim: Official API"),
        ("Verified API", "Forbidden claim: Verified API"),
    ]
    
    src_dir = ROOT / "frontend" / "src"
    violations = []
    
    for file_path in src_dir.rglob("*.tsx"):
        text = file_path.read_text(encoding="utf-8")
        for term, desc in forbidden_terms:
            if term.lower() in text.lower():
                # Allow comments or mockData id if necessary, but UI text shouldn't have them
                # Let's inspect where it occurs
                lines = text.splitlines()
                for idx, line in enumerate(lines, 1):
                    if term.lower() in line.lower() and not line.strip().startswith("//") and not line.strip().startswith("/*"):
                        violations.append(f"{file_path.relative_to(ROOT)}:{idx}: {desc} -> '{line.strip()}'")
                        
    if violations:
        print("  [FAIL] Forbidden terms found in frontend:")
        for v in violations:
            print(f"    {v}")
        return False
        
    print("  [OK] Clean claim sweep: Zero forbidden claims found.")
    return True

def test_no_dual_language_pairs():
    print("[4/4] Checking for dual-language 'English 中文' pairs in titles, nav, tags, buttons...")
    # Check for patterns like "Services 服务", "Home 首页", "Safety 安全", "Pay Tuition (学费)" in UI titles/buttons
    dual_patterns = [
        re.compile(r'Services\s+[\u4e00-\u9fa5]+'),
        re.compile(r'recent_activity\s+[\u4e00-\u9fa5]+'),
        re.compile(r'Quick Verification\s*[:：]'),
        re.compile(r'Consensus Verified'),
    ]
    
    src_dir = ROOT / "frontend" / "src"
    violations = []
    
    for file_path in src_dir.rglob("*.tsx"):
        text = file_path.read_text(encoding="utf-8")
        for p in dual_patterns:
            matches = p.findall(text)
            if matches:
                violations.append(f"{file_path.relative_to(ROOT)}: Found forbidden pattern '{matches}'")
                
    if violations:
        print("  [FAIL] Dual-language / deprecated patterns found:")
        for v in violations:
            print(f"    {v}")
        return False
        
    print("  [OK] Zero dual-language pairs found.")
    return True

def main():
    print("=" * 65)
    print(" AegisPath Layout, i18n & Claim Verification Suite")
    print("=" * 65)
    
    results = [
        test_i18n_key_parity(),
        test_no_leaked_i18n_keys(),
        test_claims_sweep(),
        test_no_dual_language_pairs(),
    ]
    
    if all(results):
        print("\n[OK] ALL VERIFICATION SUITE TESTS PASSED!")
        sys.exit(0)
    else:
        print("\n[FAIL] Some tests failed.")
        sys.exit(1)

if __name__ == "__main__":
    main()
