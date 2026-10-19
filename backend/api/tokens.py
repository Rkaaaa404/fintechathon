import hmac
import hashlib
import json
import time
import uuid
from typing import Dict, Any, Tuple
from .config import config

def canonical_json(obj: Dict[str, Any]) -> bytes:
    return json.dumps(obj, sort_keys=True, separators=(',', ':'), allow_nan=False).encode('utf-8')

def create_scoped_bank_token(
    account_id: str,
    amount_usd: float,
    payee_id: str,
    payee_name: str,
    fee_usd: float = 0.42,
    valid_seconds: int = 300,
    *,
    intent_hash: Optional[str] = None,
    idempotency_key: Optional[str] = None,
    currency: str = "USD",
    rate: float = 1.0,
    route_id: str = "default",
) -> Tuple[Dict[str, Any], str]:
    """
    Creates an HMAC-SHA256 scoped token for presentation to the bank daemon.
    """
    if intent_hash is None:
        from backend.transfer_intent import compute_intent_hash
        intent_hash = compute_intent_hash(
            payee_id=payee_id,
            payee_name=payee_name,
            amount_usd=amount_usd,
            currency=currency,
            rate=rate,
            fee_usd=fee_usd,
            route_id=route_id,
        )
    if idempotency_key is None:
        idempotency_key = f"auto-{uuid.uuid4().hex}"
    payload = {
        "account_id": account_id,
        "amount": round(amount_usd, 2),
        "payee_id": payee_id,
        "payee_name": payee_name,
        "fee_usd": round(fee_usd, 2),
        "nonce": str(uuid.uuid4()),
        "expires_at": time.time() + valid_seconds,
        "intent_hash": intent_hash,
        "idempotency_key": idempotency_key,
        "currency": currency,
        "rate": float(rate),
        "route_id": route_id,
    }

    sig = hmac.new(
        config.BANK_SECRET_KEY.encode('utf-8'),
        canonical_json(payload),
        hashlib.sha256
    ).hexdigest()

    return payload, sig
