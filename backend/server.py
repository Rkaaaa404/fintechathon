#!/usr/bin/env python3
"""
AegisPath Unified Backend Runner
Launches both services concurrently:
 - Core API Service: http://127.0.0.1:8000
 - Core Banking Service: http://127.0.0.1:8100
"""

import sys
import os
import subprocess
import time
import signal
from pathlib import Path

# Add project root and backend to sys.path
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "aegispath"))
sys.path.insert(0, str(Path(__file__).resolve().parent))

def run_services():
    print("=" * 60)
    print(" AegisPath Enterprise Backend Platform")
    print(" - Port 8000: API Core (Policy, Agent Planner, Sentinel)")
    print(" - Port 8100: Isolated Bank Gateway (HMAC Tokens, Ledger)")
    print("=" * 60)

    env = os.environ.copy()
    env["PYTHONPATH"] = f"{ROOT}{os.pathsep}{ROOT / 'backend'}"

    api_cmd = [sys.executable, "-m", "uvicorn", "backend.api.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"]
    bank_cmd = [sys.executable, "-m", "uvicorn", "backend.bank.main:app", "--host", "127.0.0.1", "--port", "8100", "--reload"]

    cwd = str(ROOT)
    print(f"Starting Bank Service on http://127.0.0.1:8100...")
    bank_proc = subprocess.Popen(bank_cmd, cwd=cwd, env=env)
    time.sleep(1)

    print(f"Starting API Core on http://127.0.0.1:8000...")
    api_proc = subprocess.Popen(api_cmd, cwd=cwd, env=env)

    def handle_exit(signum, frame):
        print("\nShutting down AegisPath services...")
        api_proc.terminate()
        bank_proc.terminate()
        sys.exit(0)

    signal.signal(signal.SIGINT, handle_exit)
    signal.signal(signal.SIGTERM, handle_exit)

    try:
        api_proc.wait()
        bank_proc.wait()
    except KeyboardInterrupt:
        handle_exit(None, None)

if __name__ == "__main__":
    run_services()
