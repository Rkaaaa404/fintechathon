"""Canonical sandbox transfer intent shared by the API and independent bank verifier."""
import hashlib
import json
import math
from decimal import Decimal


def compute_intent_hash(
    payee_id: str,
    payee_name: str,
    amount_usd: float,
    currency: str = "USD",
    rate: float = 1.0,
    *,
    fee_usd: float = 0.42,
    route_id: str = "default",
) -> str:
    for value in (payee_id, payee_name, currency, route_id):
        if not isinstance(value, str) or not value.strip():
            raise ValueError("Intent text fields must be nonempty strings")
    for value, positive in ((amount_usd, True), (fee_usd, False), (rate, True)):
        if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
            raise ValueError("Intent numbers must be finite")
        if value < 0 or (positive and value == 0):
            raise ValueError("Invalid intent amount or rate")
    for value in (amount_usd, fee_usd):
        if Decimal(str(value)).as_tuple().exponent < -2:
            raise ValueError("Money must use at most two decimal places")
    canonical = json.dumps({
        "payee_id": payee_id, "payee_name": payee_name,
        "amount_usd": f"{amount_usd:.2f}", "fee_usd": f"{fee_usd:.2f}",
        "currency": currency, "rate": str(Decimal(str(rate)).normalize()), "route_id": route_id,
    }, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return "INTENT-SHA256-" + hashlib.sha256(canonical.encode("utf-8")).hexdigest().upper()
