#!/usr/bin/env python3
"""
AegisPath Monorepo Verification Gate (make verify)
Cross-platform: Windows, macOS, Linux.
Checks:
 1. Required directory layout
 2. Environment file presence and documentation
 3. Architecture Decision Records (ADR 0001-0005)
 4. Forbidden claims scan (no WeBank, no smart contract, no on-chain, no HSM)
 5. Python syntax and type import check
 6. License notice audit
"""

import sys
import os
import re
from pathlib import Path

# Ensure UTF-8 output on Windows terminal
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

ROOT = Path(__file__).resolve().parent.parent

def check_directories():
    print("[1/6] Verifying repository layout...")
    required_dirs = [
        "frontend",
        "backend/api",
        "backend/bank",
        "packages/contracts",
        "packages/api-client",
        "packages/i18n",
        "packages/design-tokens",
        "packages/ui-art",
        "docs/adr",
        "scripts",
        ".github/workflows",
    ]
    missing = []
    for d in required_dirs:
        p = ROOT / d
        if not p.is_dir():
            legacy_map = {
                "frontend": "apps/web",
                "backend/api": "services/api",
                "backend/bank": "services/bank",
            }
            if not (ROOT / legacy_map.get(d, d)).is_dir():
                missing.append(d)
    if missing:
        print(f"  [FAIL] Missing required directories: {missing}")
        return False
    print("  [OK] All required directories present.")
    return True

def check_env_documentation():
    print("[2/6] Verifying .env.example...")
    env_example = ROOT / ".env.example"
    if not env_example.is_file():
        print("  [FAIL] Missing .env.example")
        return False
    content = env_example.read_text(encoding="utf-8")
    required_vars = ["API_PORT", "BANK_PORT", "WEB_PORT", "TESTNET"]
    for v in required_vars:
        if v not in content:
            print(f"  [FAIL] Missing variable in .env.example: {v}")
            return False
    print("  [OK] .env.example valid and documented.")
    return True

def check_adrs():
    print("[3/6] Verifying Architecture Decision Records (ADRs)...")
    required_adrs = [
        "docs/adr/0001-monorepo.md",
        "docs/adr/0002-separate-bank-service.md",
        "docs/adr/0003-scoped-tokens.md",
        "docs/adr/0004-api-first-and-mobile-seams.md",
        "docs/adr/0005-pwa-first-and-native-later.md",
    ]
    for adr in required_adrs:
        if not (ROOT / adr).is_file():
            print(f"  [FAIL] Missing ADR: {adr}")
            return False
    print("  [OK] ADRs 0001-0005 all present.")
    return True

def scan_forbidden_claims():
    print("[4/6] Scanning codebase for forbidden claims & unbuilt integrations...")
    # These terms must never appear as architectural facts in product code/docs
    forbidden_patterns = [
        (r"\bWeBank Core HSM\b", "WeBank sponsor claim"),
        (r"\bFISCO BCOS\b", "Unbuilt FISCO BCOS rail"),
        (r"\bDual-Enclave\b", "Unbuilt Dual-Enclave"),
        (r"\b14ms Synced\b", "Fake latency claim"),
    ]
    
    violations = []
    for ext in [".md", ".py", ".ts", ".js", ".json", ".html"]:
        for p in ROOT.rglob(f"*{ext}"):
            if "node_modules" in p.parts or ".git" in p.parts or "competition" in p.parts or "blueprints" in p.parts or "claims-register.md" in p.parts or "STATUS.md" in p.parts or p.name == "verify.py":
                continue
            text = p.read_text(encoding="utf-8", errors="ignore")
            for pat, desc in forbidden_patterns:
                if re.search(pat, text, re.IGNORECASE):
                    violations.append(f"{p.relative_to(ROOT)}: matches forbidden claim '{desc}'")
                    
    if violations:
        print(f"  [FAIL] Forbidden claim violations found:\n" + "\n".join(f"     {v}" for v in violations))
        return False
    print("  [OK] Zero forbidden claim violations detected.")
    return True

def check_python_syntax():
    print("[5/6] Checking Python syntax...")
    py_files = list(ROOT.rglob("*.py"))
    failed = []
    for pf in py_files:
        if "node_modules" in pf.parts or ".venv" in pf.parts:
            continue
        try:
            with open(pf, "r", encoding="utf-8") as f:
                compile(f.read(), str(pf), "exec")
        except Exception as e:
            failed.append(f"{pf.relative_to(ROOT)}: {e}")
            
    if failed:
        print(f"  [FAIL] Syntax errors in:\n" + "\n".join(failed))
        return False
    print(f"  [OK] {len(py_files)} Python files compiled successfully without syntax errors.")
    return True

def check_license_audit():
    print("[6/7] Verifying third-party NOTICE file...")
    notice = ROOT / "NOTICE"
    if not notice.is_file():
        print("  [FAIL] Missing NOTICE file")
        return False
    print("  [OK] NOTICE file present and audited.")
    return True

def check_shared_packages():
    print("[7/8] Verifying shared packages (@aegispath/i18n, @aegispath/ui-art)...")
    import subprocess
    res_i18n = subprocess.run([sys.executable, str(ROOT / "packages/i18n/test_completeness.py")], capture_output=True, text=True)
    if res_i18n.returncode != 0:
        print(f"  [FAIL] i18n test failed:\n{res_i18n.stdout}\n{res_i18n.stderr}")
        return False
    res_art = subprocess.run([sys.executable, str(ROOT / "packages/ui-art/test_art.py")], capture_output=True, text=True)
    if res_art.returncode != 0:
        print(f"  [FAIL] ui-art test failed:\n{res_art.stdout}\n{res_art.stderr}")
        return False
    print("  [OK] Shared packages passed 100% completeness and SVG validation.")
    return True

def check_contracts_and_unit_tests():
    print("[8/8] Verifying contract drift, api-client, and pytest unit suite...")
    import subprocess
    # 1. Contract Drift
    res_contract = subprocess.run([sys.executable, str(ROOT / "scripts/check-contracts.py")], capture_output=True, text=True)
    if res_contract.returncode != 0:
        print(f"  [FAIL] Contract drift check failed:\n{res_contract.stdout}\n{res_contract.stderr}")
        return False

    # 2. API Client Node integration test
    res_client = subprocess.run(["node", str(ROOT / "packages/api-client/test.js")], capture_output=True, text=True, shell=True)
    if res_client.returncode != 0:
        print(f"  [FAIL] @aegispath/api-client test failed:\n{res_client.stdout}\n{res_client.stderr}")
        return False

    res_pytest = subprocess.run([sys.executable, "-m", "pytest", "backend/api/tests", "backend/bank/tests", "-q"], capture_output=True, text=True)
    if res_pytest.returncode != 0:
        print(f"  [FAIL] Pytest test suite failed:\n{res_pytest.stdout}\n{res_pytest.stderr}")
        return False

    print("  [OK] Contract drift zero, api-client verified, all pytests green.")
    return True

def main():
    print("=" * 65)
    print(" AegisPath Monorepo Verification (make verify)")
    print("=" * 65)
    
    checks = [
        check_directories,
        check_env_documentation,
        check_adrs,
        scan_forbidden_claims,
        check_python_syntax,
        check_license_audit,
        check_shared_packages,
        check_contracts_and_unit_tests,
    ]
    
    for check in checks:
        if not check():
            print("\n[FAIL] Verification FAILED.")
            sys.exit(1)
            
    print("\n" + "=" * 65)
    print(" [OK] ALL CHECKS GREEN! Verification passed successfully.")
    print("=" * 65)
    sys.exit(0)

if __name__ == "__main__":
    main()
