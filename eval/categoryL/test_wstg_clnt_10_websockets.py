#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category L (Client-side Testing)
Test ID: WSTG-CLNT-10 - Testing WebSockets (4.11.10)
Status: N/A (By Design)

White-Box Verification & Architectural Evidence:
Client-server communication uses synchronous HTTP REST JSON endpoints;
WebSockets are not used.
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


def test_wstg_clnt_10_websockets():
    print("=" * 76)
    print(" [TEST ID: WSTG-CLNT-10] Testing WebSockets (4.11.10)")
    print(" Status: N/A (By Design)")
    print("=" * 76)

    frontend_src = ROOT_DIR / "frontend" / "src"
    backend_src = ROOT_DIR / "backend"
    assert frontend_src.exists() and backend_src.exists()

    # 1. Frontend Client WebSocket Protocol Scan
    print("  [1] Client-Side WebSocket Interface Audit (frontend/src):")
    client_files = list(frontend_src.rglob("*.tsx")) + list(frontend_src.rglob("*.ts"))

    ws_patterns = [
        ("new WebSocket", re.compile(r"new\s+WebSocket\s*\(", re.IGNORECASE)),
        ("ws:// or wss:// URL", re.compile(r"['\"]wss?://", re.IGNORECASE)),
        ("socket.io import", re.compile(r"socket\.io", re.IGNORECASE)),
    ]

    ws_client_matches = []
    for cf in client_files:
        code = cf.read_text(encoding="utf-8")
        for name, pat in ws_patterns:
            if pat.search(code):
                ws_client_matches.append((cf.name, name))

    print(f"      Client-side WebSocket invocations found: {len(ws_client_matches)}")
    assert len(ws_client_matches) == 0, f"WebSocket usage detected in frontend: {ws_client_matches}"
    print("      Verification: Zero WebSocket connections initiated by PWA client.")

    # 2. Backend Server WebSocket Route Audit
    print("  [2] Server Daemon WebSocket Route Audit (backend):")
    backend_py_files = list(backend_src.rglob("*.py"))
    server_ws_matches = []
    for bf in backend_py_files:
        code = bf.read_text(encoding="utf-8")
        if re.search(r"@app\.websocket\b", code):
            server_ws_matches.append(bf.name)

    print(f"      Server-side @app.websocket endpoints found: {len(server_ws_matches)}")
    assert len(server_ws_matches) == 0, f"WebSocket routes detected in backend: {server_ws_matches}"
    print("      Verification: Server architecture strictly uses stateless synchronous HTTP REST endpoints.")

    print("-" * 76)
    print("  >>> VERDICT: N/A (By Design)")
    print("  Architectural Evidence: Client-server communication uses synchronous")
    print("  HTTP REST JSON endpoints; WebSockets are not used.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_clnt_10_websockets()
    sys.exit(0 if success else 1)
