import hashlib
import json
import time
from typing import Dict, Any, List, Tuple, Optional
from .database import get_connection

def compute_entry_hash(prev_hash: str, action: str, actor: str, details_json: str, timestamp: float) -> str:
    payload = f"{prev_hash}:{action}:{actor}:{details_json}:{timestamp}"
    return hashlib.sha256(payload.encode('utf-8')).hexdigest()

def record_audit_event(action: str, actor: str, details: Dict[str, Any]) -> str:
    """
    Appends an immutable entry to the cryptographic audit hash chain.
    """
    conn = get_connection()
    now = time.time()
    details_str = json.dumps(details, sort_keys=True)

    with conn:
        cur = conn.execute("SELECT entry_hash FROM audit_chain ORDER BY entry_id DESC LIMIT 1")
        row = cur.fetchone()
        prev_hash = row["entry_hash"] if row else "0" * 64

        entry_hash = compute_entry_hash(prev_hash, action, actor, details_str, now)

        conn.execute(
            """
            INSERT INTO audit_chain (action, actor, details_json, prev_hash, entry_hash, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (action, actor, details_str, prev_hash, entry_hash, now)
        )

    return entry_hash

def verify_audit_chain() -> Dict[str, Any]:
    """
    Cryptographically verifies the entire historical audit chain.
    """
    conn = get_connection()
    cur = conn.execute("SELECT entry_id, action, actor, details_json, prev_hash, entry_hash, timestamp FROM audit_chain ORDER BY entry_id ASC")
    rows = cur.fetchall()

    if not rows:
        return {"valid": True, "count": 0, "head_hash": "0" * 64}

    expected_prev = "0" * 64
    for idx, r in enumerate(rows):
        if idx == 0 and r["action"] == "GENESIS":
            expected_prev = r["entry_hash"]
            continue

        if r["prev_hash"] != expected_prev:
            return {
                "valid": False,
                "broken_at_entry_id": r["entry_id"],
                "reason": "Previous hash pointer mismatch",
                "count": len(rows)
            }

        recomputed = compute_entry_hash(
            r["prev_hash"],
            r["action"],
            r["actor"],
            r["details_json"],
            r["timestamp"]
        )

        if recomputed != r["entry_hash"]:
            return {
                "valid": False,
                "broken_at_entry_id": r["entry_id"],
                "reason": "Entry content hash mismatch",
                "count": len(rows)
            }

        expected_prev = r["entry_hash"]

    return {
        "valid": True,
        "count": len(rows),
        "head_hash": rows[-1]["entry_hash"]
    }
