import hmac
import hashlib
import json
import time
from typing import Tuple, Dict, Any, Optional
from .config import config
from .database import get_connection

def canonical_json(obj: Dict[str, Any]) -> bytes:
    return json.dumps(obj, sort_keys=True, separators=(',', ':')).encode('utf-8')

def sign_scoped_token(payload: Dict[str, Any], secret_key: str = config.SECRET_KEY) -> str:
    """Utility used by API to sign scoped tokens with shared secret"""
    data = canonical_json(payload)
    return hmac.new(secret_key.encode('utf-8'), data, hashlib.sha256).hexdigest()

def verify_scoped_token(token_data: Dict[str, Any], signature: str) -> Tuple[bool, Optional[str]]:
    """
    Bank-side verification of scoped token:
    1. Check expiry
    2. Check signature
    3. Check and record single-use nonce
    """
    now = time.time()
    expires_at = token_data.get("expires_at", 0)
    if now > expires_at:
        return False, "Scoped token expired"

    # Verify HMAC signature
    expected_sig = sign_scoped_token(token_data, config.SECRET_KEY)
    if not hmac.compare_digest(expected_sig, signature):
        return False, "Invalid token cryptographic signature"

    nonce = token_data.get("nonce")
    if not nonce:
        return False, "Missing single-use nonce"

    conn = get_connection()
    with conn:
        # Check if nonce is already consumed
        cur = conn.execute("SELECT nonce FROM used_nonces WHERE nonce = ?", (nonce,))
        if cur.fetchone():
            return False, f"Replay detected: nonce {nonce} already consumed"
        
        # Mark nonce as consumed
        conn.execute("INSERT INTO used_nonces (nonce, used_at) VALUES (?, ?)", (nonce, now))

    return True, None
