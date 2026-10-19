#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category C (Configuration & Deployment)
Test ID: WSTG-CONF-08 - Test RIA Cross Domain Policy
Status: N/A (By Design)

White-Box Verification & Architectural Evidence:
Modern Next.js PWA architecture; legacy Flash/Silverlight
(crossdomain.xml / clientaccesspolicy.xml) is not used.
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


def test_wstg_conf_08_ria_cross_domain():
    print("=" * 76)
    print(" [TEST ID: WSTG-CONF-08] Test RIA Cross Domain Policy")
    print(" Status: N/A (By Design)")
    print("=" * 76)

    public_dir = ROOT_DIR / "frontend" / "public"
    print(f"  [1] Legacy RIA Cross-Domain Policy Audit ({public_dir}):")
    assert public_dir.exists(), f"FAIL: Missing frontend public dir {public_dir}"

    ria_files = ["crossdomain.xml", "clientaccesspolicy.xml"]
    found_ria = [f for f in ria_files if (public_dir / f).exists()]

    print(f"      Legacy RIA Policy Files Found: {found_ria} (Expected: [])")
    assert len(found_ria) == 0, f"FAIL: Legacy Flash/Silverlight cross-domain files found: {found_ria}"
    print("      Verification: Modern Next.js PWA completely excludes legacy RIA technologies.")

    print("-" * 76)
    print("  >>> VERDICT: N/A (By Design)")
    print("  Architectural Evidence: Modern PWA architecture; legacy Flash/Silverlight")
    print("  cross-domain policies are completely excluded.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_conf_08_ria_cross_domain()
    sys.exit(0 if success else 1)
