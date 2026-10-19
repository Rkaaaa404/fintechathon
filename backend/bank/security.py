import hmac
import hashlib
import json
import time
from typing import Tuple, Dict, Any, Optional
from .config import config
from backend.transfer_intent import compute_intent_hash
from .schemas import ScopedTokenPayload
from pydantic import ValidationError

def canonical_json(obj: Dict[str, Any]) -> bytes:
    return json.dumps(obj, sort_keys=True, separators=(',', ':'), allow_nan=False).encode('utf-8')

def sign_scoped_token(payload: Dict[str, Any], secret_key: str = config.SECRET_KEY) -> str:
    """Utility used by API to sign scoped tokens with shared secret"""
    data = canonical_json(payload)
    return hmac.new(secret_key.encode('utf-8'), data, hashlib.sha256).hexdigest()

def verify_scoped_token(token_data: Dict[str, Any], signature: str) -> Tuple[bool, Optional[str]]:
    """Verify authorization without mutating nonce or ledger state."""
    try:
        token = ScopedTokenPayload.model_validate(token_data)
        expected_sig = sign_scoped_token(token.model_dump(), config.SECRET_KEY)
        if not hmac.compare_digest(expected_sig, signature):
            return False, "Invalid token cryptographic signature"
        now = time.time()
        if token.expires_at <= now:
            return False, "Scoped token expired"
        if token.expires_at > now + config.MAX_TOKEN_TTL_SECONDS:
            return False, "Scoped token lifetime exceeds bank maximum"
        expected_hash = compute_intent_hash(
            token.payee_id, token.payee_name, token.amount, token.currency, token.rate,
            fee_usd=token.fee_usd, route_id=token.route_id,
        )
        if not hmac.compare_digest(expected_hash, token.intent_hash):
            return False, "Scoped token intent hash mismatch"
    except (ValidationError, ValueError, TypeError, OverflowError):
        return False, "Malformed scoped token"
    return True, None
