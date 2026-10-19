#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category L (Client-side Testing)
Test ID: WSTG-CLNT-11 - Testing Web Messaging (4.11.11)
Status: N/A (By Design)

White-Box Verification & Architectural Evidence:
Cross-origin window.postMessage is not used.
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


def test_wstg_clnt_11_web_messaging():
    print("=" * 76)
    print(" [TEST ID: WSTG-CLNT-11] Testing Web Messaging (4.11.11)")
    print(" Status: N/A (By Design)")
    print("=" * 76)

    frontend_src = ROOT_DIR / "frontend" / "src"
    assert frontend_src.exists(), f"Frontend source directory missing: {frontend_src}"

    # 1. Audit Client Source for postMessage Invocations
    print(f"  [1] Client-Side postMessage Sinks Audit ({frontend_src}):")
    client_files = list(frontend_src.rglob("*.tsx")) + list(frontend_src.rglob("*.ts"))

    post_message_pattern = re.compile(r"\bpostMessage\s*\(", re.IGNORECASE)
    message_listener_pattern = re.compile(r"addEventListener\s*\(\s*['\"]message['\"]", re.IGNORECASE)
    onmessage_pattern = re.compile(r"\bonmessage\s*=", re.IGNORECASE)

    post_message_violations = []
    listener_violations = []

    for cf in client_files:
        code = cf.read_text(encoding="utf-8")
        if post_message_pattern.search(code):
            post_message_violations.append(cf.name)
        if message_listener_pattern.search(code) or onmessage_pattern.search(code):
            listener_violations.append(cf.name)

    print(f"      window.postMessage call sites found: {len(post_message_violations)} ({post_message_violations})")
    print(f"      'message' event listeners found    : {len(listener_violations)} ({listener_violations})")

    assert len(post_message_violations) == 0, f"postMessage usage detected: {post_message_violations}"
    assert len(listener_violations) == 0, f"Cross-window message listeners detected: {listener_violations}"
    print("      Verification: Cross-origin HTML5 web messaging channels completely absent.")

    print("-" * 76)
    print("  >>> VERDICT: N/A (By Design)")
    print("  Architectural Evidence: Cross-origin window.postMessage is not used.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_clnt_11_web_messaging()
    sys.exit(0 if success else 1)
