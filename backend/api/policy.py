import hashlib
import json
import time
from typing import Dict, Any, List, Tuple, Optional
from .database import get_connection

def compute_intent_hash(
    payee_id: str,
    payee_name: str,
    amount_usd: float,
    currency: str = "USD",
    rate: float = 1.0
) -> str:
    """
    Computes cryptographic intent hash.
    Ties user visual confirmation to transaction execution parameters.
    """
    canonical_repr = f"recipient:{payee_id}:{payee_name}|amount:{amount_usd:.2f}|currency:{currency}|rate:{rate:.4f}"
    h = hashlib.sha256(canonical_repr.encode('utf-8')).hexdigest()
    return f"INTENT-SHA256-{h[:16].upper()}"

def evaluate_transfer_policy(
    user_id: str,
    amount_usd: float,
    payee_name: str,
    payee_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Evaluates transfer against policy tiers:
      - Tier 1: Auto-approved (<= $500, known payee, within daily limit)
      - Tier 2: Step-up approval required (new payee or > $500)
    """
    conn = get_connection()
    cur = conn.execute(
        "SELECT single_send_cap_usd, daily_cap_usd, used_today_usd, allowed_payees_json, is_paused "
        "FROM policy WHERE user_id = ?",
        (user_id,)
    )
    row = cur.fetchone()
    if not row:
        raise ValueError(f"No policy configured for user {user_id}")

    is_paused = bool(row["is_paused"])
    if is_paused:
        return {
            "tier": "REFUSED",
            "allowed": False,
            "reason": "Agent is paused via kill switch. Resume with passkey first."
        }

    single_cap = row["single_send_cap_usd"]
    daily_cap = row["daily_cap_usd"]
    used_today = row["used_today_usd"]
    allowed_payees = json.loads(row["allowed_payees_json"])

    # Match payee
    matched_payee = None
    for p in allowed_payees:
        if (payee_id and p["id"] == payee_id) or p["name"].lower() == payee_name.lower():
            matched_payee = p
            break

    is_new_payee = matched_payee is None
    exceeds_single_cap = amount_usd > single_cap
    exceeds_daily_cap = (used_today + amount_usd) > daily_cap

    if exceeds_daily_cap:
        return {
            "tier": "REFUSED",
            "allowed": False,
            "reason": f"Exceeds daily allowance limit of ${daily_cap:,.2f}. (${used_today:,.2f} already used today)."
        }

    # Tier 2 triggers: new payee or amount > $500
    if is_new_payee or exceeds_single_cap:
        reasons = []
        if is_new_payee:
            reasons.append(f"recipient '{payee_name}' is not on your allowed list")
        if exceeds_single_cap:
            reasons.append(f"amount ${amount_usd:,.2f} exceeds auto-send limit of ${single_cap:,.2f}")

        intent_hash = compute_intent_hash(
            payee_id=matched_payee["id"] if matched_payee else "new_payee",
            payee_name=payee_name,
            amount_usd=amount_usd
        )

        return {
            "tier": "T2_APPROVAL_REQUIRED",
            "allowed": True,
            "requires_passkey": True,
            "reason": "Step-up authorization required: " + " and ".join(reasons) + ".",
            "intent_hash": intent_hash,
            "payee": matched_payee or {"id": "new_payee", "name": payee_name, "relation": "New"}
        }

    # Tier 1: Auto-approved
    intent_hash = compute_intent_hash(
        payee_id=matched_payee["id"],
        payee_name=matched_payee["name"],
        amount_usd=amount_usd
    )

    return {
        "tier": "T1_AUTO_APPROVED",
        "allowed": True,
        "requires_passkey": False,
        "reason": f"Within limits: <= ${single_cap:,.2f} and recipient on list.",
        "intent_hash": intent_hash,
        "payee": matched_payee
    }
