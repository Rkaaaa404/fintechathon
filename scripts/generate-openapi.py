import sys
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from backend.api.main import app

def generate_openapi():
    schema = app.openapi()
    target = ROOT / "packages" / "contracts" / "openapi.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(schema, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(f"Generated committed OpenAPI schema at: {target.relative_to(ROOT)} ({len(schema.get('paths', {}))} endpoints)")

if __name__ == "__main__":
    generate_openapi()
