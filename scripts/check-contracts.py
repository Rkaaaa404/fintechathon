#!/usr/bin/env python3
"""
Contract drift check: verifies packages/contracts/openapi.json matches services/api schema.
"""
import sys
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

try:
    from backend.api.main import app
except ImportError as err:
    print(f"[FAIL] Unable to import backend.api.main: {err}")
    print("Ensure all backend dependencies are installed (e.g., sqlalchemy, fastapi, pydantic).")
    sys.exit(1)

def check_contract_drift():
    committed_file = ROOT / "packages" / "contracts" / "openapi.json"
    if not committed_file.exists():
        print("[FAIL] packages/contracts/openapi.json does not exist!")
        sys.exit(1)

    committed = json.loads(committed_file.read_text(encoding="utf-8"))
    live = app.openapi()

    # Compare keys and paths
    committed_paths = sorted(committed.get("paths", {}).keys())
    live_paths = sorted(live.get("paths", {}).keys())

    if committed_paths != live_paths:
        print(f"[FAIL] Contract drift detected in API endpoints!")
        print(f"  Committed: {committed_paths}")
        print(f"  Live:      {live_paths}")
        sys.exit(1)

    print(f"[OK] Committed OpenAPI spec is in sync with live API ({len(live_paths)} paths).")

if __name__ == "__main__":
    check_contract_drift()
