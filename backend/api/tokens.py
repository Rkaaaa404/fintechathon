import hmac
import hashlib
import json
import time
import uuid
from typing import Dict, Any, Tuple
from .config import config

def canonical_json(obj: Dict[str, Any]) -> bytes:
    return json.dumps(obj, sort_keys=True, separators=(',', ':')).encode('utf-8')

def create_scoped_bank_token(
    account_id: str,
    amount_usd: float,
    payee_id: str,
    payee_name: str,
    fee_usd: float = 0.42,
    valid_seconds: int = 300
) -> Tuple[Dict[str, Any], str]:
    """
    Creates an HMAC-SHA256 scoped token for presentation to the bank daemon.
    """
    payload = {
        "account_id": account_id,
        "amount": round(amount_usd, 2),
        "payee_id": payee_id,
        "payee_name": payee_name,
        "fee_usd": round(fee_usd, 2),
        "nonce": str(uuid.uuid4()),
        "expires_at": time.time() + valid_seconds
    }

    sig = hmac.new(
        config.BANK_SECRET_KEY.encode('utf-8'),
        canonical_json(payload),
        hashlib.sha256
    ).hexdigest()

    return payload, sig
