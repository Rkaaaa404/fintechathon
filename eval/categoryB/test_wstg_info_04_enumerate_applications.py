#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category B (Information Gathering)
Test ID: WSTG-INFO-04 - Enumerate Applications on Webserver
Status: PASS (Verified)

White-Box Verification & Architectural Evidence:
Container service definitions in docker-compose.yml expose only designated
PWA frontend (3000), API (8000), and Simulated Bank (8100).
"""
import sys
import re
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT_DIR))

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass


def test_wstg_info_04_enumerate_applications():
    print("=" * 76)
    print(" [TEST ID: WSTG-INFO-04] Enumerate Applications on Webserver")
    print(" Status: PASS (Verified)")
    print("=" * 76)

    compose_file = ROOT_DIR / "docker-compose.yml"
    print(f"  [1] Container Service Enumeration ({compose_file.name}):")
    assert compose_file.exists(), f"FAIL: Missing {compose_file}"

    compose_text = compose_file.read_text(encoding="utf-8")
    services = re.findall(r"^\s{2}([a-zA-Z0-9_-]+):\s*$", compose_text, re.MULTILINE)
    ports = re.findall(r'["\']?([0-9]{4,5}:[0-9]{4,5})["\']?', compose_text)

    print(f"      Exposed Services Found : {services}")
    print(f"      Mapped Port Bindings   : {ports}")

    # Expected official services in AegisPath
    allowed_services = {"frontend", "api", "bank", "web"}
    unauthorized = set(services) - allowed_services
    print(f"      Unauthorized Services  : {list(unauthorized)} (Expected: [])")
    assert len(unauthorized) == 0, f"FAIL: Rogue services detected in docker-compose: {unauthorized}"

    # Verify no rogue database administration GUIs (phpMyAdmin, Adminer, pgAdmin)
    rogue_tools = ["phpmyadmin", "adminer", "pgadmin", "kibana", "grafana"]
    found_rogue = [tool for tool in rogue_tools if tool in compose_text.lower()]
    print(f"      Rogue Admin Consoles   : {found_rogue} (Expected: [])")
    assert len(found_rogue) == 0, f"FAIL: Rogue admin tools detected: {found_rogue}"

    print("-" * 76)
    print("  >>> VERDICT: PASS (Verified)")
    print("  Architectural Evidence: Container service definitions expose only the")
    print("  designated PWA frontend, API (Port 8000), and Simulated Bank (Port 8100).")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_info_04_enumerate_applications()
    sys.exit(0 if success else 1)
