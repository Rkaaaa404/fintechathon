import uuid
import time
import json
import httpx
import math
from decimal import Decimal
from typing import Dict, Any, List, Optional
from .config import config
from .database import get_connection
from .policy import evaluate_transfer_policy, compute_intent_hash
from .tokens import create_scoped_bank_token
from .audit import record_audit_event

SIMULATED_FX_USD_CNY = 7.1022
SIMULATED_FX_USD_IDR = 15880.0

def calculate_tuition_quote(amount_cny: float = 18000.0, mode: str = "cheapest") -> Dict[str, Any]:
    """
    Computes deterministic tuition transfer quote.
    """
    base_usd = round(amount_cny / SIMULATED_FX_USD_CNY, 2)
    mode_lower = mode.lower()

    if mode_lower == "fastest":
        fee = 18.00
        buffer = 0.00
        eta_desc = "Arrives in 15 minutes"
        eta_zh = "约15分钟到账"
    elif mode_lower == "balanced":
        fee = 6.50
        buffer = 6.00
        eta_desc = "Arrives in 1-2 hours"
        eta_zh = "约1-2小时到账"
    else: # cheapest
        fee = 0.42
        buffer = 12.50
        eta_desc = "Arrives in 1 business day"
        eta_zh = "约1个工作日到账"

    total_send_usd = round(base_usd + fee + buffer, 2)

    return {
        "amount_cny": amount_cny,
        "base_amount_usd": base_usd,
        "rate": SIMULATED_FX_USD_CNY,
        "rate_pair": "CNY/USD",
        "mode": mode,
        "fee_usd": fee,
        "buffer_usd": buffer,
        "total_send_usd": total_send_usd,
        "eta_desc": eta_desc,
        "eta_zh": eta_zh,
        "estimate_note": "Estimate with a buffer, not a guarantee (含缓冲的估算,非保证)"
    }

async def execute_bank_transfer(token_payload: dict, signature: str, idempotency_key: str) -> dict | None:
    """Return only a confirmed sandbox receipt; failures have unknown execution outcome."""
    client_kwargs = {"timeout": 10.0}
    if config.BANK_TRANSPORT is not None:
        client_kwargs["transport"] = config.BANK_TRANSPORT
    try:
        async with httpx.AsyncClient(**client_kwargs) as client:
            response = await client.post(
                f"{config.BANK_SERVICE_URL}/v1/bank/transfer",
                json={"token": token_payload, "signature": signature},
                headers={"Idempotency-Key": idempotency_key},
            )
        if response.status_code != 200:
            return None
        receipt = response.json()
        if not isinstance(receipt, dict) or receipt.get("status") != "COMPLETED":
            return None
        tx_id = receipt.get("tx_id")
        balance = receipt.get("remaining_balance_usd")
        if not isinstance(tx_id, str) or not tx_id.strip():
            return None
        if isinstance(balance, bool) or not isinstance(balance, (int, float)) or not math.isfinite(balance):
            return None
        return receipt
    except (httpx.HTTPError, ValueError, TypeError, OverflowError):
        return None

async def plan_and_process_intent(parsed: Dict[str, Any], user_id: str = "usr_ayu") -> Dict[str, Any]:
    """
    Executes DAG Planning sequence.
    Returns typed component payload for client rendering.
    """
    # ── Flow C: Attack Injection Flagged ──────────────────────
    if parsed.get("flagged_injection"):
        record_audit_event(
            "ATTACK_INJECTION_BLOCKED",
            user_id,
            {"raw_text": parsed.get("raw_text"), "ring": "outer_privacy_filter"}
        )
        return {
            "type": "blocked_slip",
            "quoted_instruction": parsed.get("raw_text"),
            "amount_lost_usd": 0.0,
            "verdicts": [
                {
                    "ring": "outer",
                    "name": "Privacy filter",
                    "status": "flagged",
                    "text": "Sentinel flagged an instruction in the supplied text"
                }
            ],
            "conclusion": "Nothing was sent. $0 funds lost.",
            "stamp": "BLOCKED"
        }

    action = parsed.get("action")
    if action == "general_query":
        return {"type": "info_note", "message": "I can help with USD transfers and CNY tuition payments."}
    amount = parsed.get("amount")
    payee_name = parsed.get("payee")
    valid_amount = (
        not isinstance(amount, bool)
        and isinstance(amount, (int, float))
        and math.isfinite(amount)
        and amount > 0
        and Decimal(str(amount)).as_tuple().exponent >= -2
    )
    if (
        action not in ("transfer", "tuition")
        or not valid_amount
        or not isinstance(payee_name, str)
        or not payee_name.strip()
        or (action == "transfer" and parsed.get("currency") != "USD")
        or (action == "tuition" and (parsed.get("currency") != "CNY" or payee_name != "Campus bursar"))
    ):
        return {
            "type": "clarification",
            "message": "Specify one payment with an explicit amount, currency, and recipient.",
        }

    # Handle Tuition
    if action == "tuition":
        quote = calculate_tuition_quote(amount, parsed.get("route_preference", "cheapest"))
        amount_usd = quote["total_send_usd"]
        policy_eval = evaluate_transfer_policy(user_id, amount_usd, "Campus bursar")
        if policy_eval.get("tier") == "REFUSED":
            return {"type": "refused_note", "reason": policy_eval.get("reason"), "stamp": "BLOCKED"}

        plan_id = f"plan-tuition-{uuid.uuid4().hex[:8]}"
        intent_hash = policy_eval.get("intent_hash") or compute_intent_hash("p2", "Campus bursar", amount_usd, "CNY", SIMULATED_FX_USD_CNY)

        # Store plan in WAITING_APPROVAL state
        conn = get_connection()
        with conn:
            conn.execute(
                """
                INSERT INTO plans (plan_id, user_id, intent_hash, plan_data_json, status, created_at)
                VALUES (?, ?, ?, ?, 'WAITING_APPROVAL', ?)
                """,
                (
                    plan_id,
                    user_id,
                    intent_hash,
                    json.dumps({
                        "type": "tuition",
                        "amount_usd": amount_usd,
                        "amount_cny": amount,
                        "payee_id": "p2",
                        "payee_name": "Campus bursar",
                        "fee_usd": quote["fee_usd"]
                    }),
                    time.time()
                )
            )

        return {
            "type": "approval_sheet",
            "plan_id": plan_id,
            "payee_name": "Campus bursar",
            "you_asked": parsed.get("raw_text"),
            "understood": f"Pay tuition ¥{amount:,.0f} to Campus bursar (${amount_usd:,.2f} USD)",
            "send_amount_usd": amount_usd,
            "receives_cny": amount,
            "rate": quote["rate"],
            "rate_pair": "CNY/USD",
            "fee_with_buffer_usd": quote["fee_usd"] + quote["buffer_usd"],
            "eta": quote["eta_desc"],
            "intent_hash": intent_hash,
            "why_approval_needed": "Tuition payments require demo approval. " + policy_eval.get("reason", ""),
            "status": "WAITING_APPROVAL"
        }

    # Handle Standard Transfer (Flow A or Tier 2 transfer)
    amount_usd = amount
    policy_eval = evaluate_transfer_policy(user_id, amount_usd, payee_name)

    if not policy_eval.get("allowed") and policy_eval.get("tier") == "REFUSED":
        return {
            "type": "refused_note",
            "reason": policy_eval.get("reason"),
            "stamp": "BLOCKED"
        }

    # If Tier 2: Step-up Approval Required
    if policy_eval.get("tier") == "T2_APPROVAL_REQUIRED":
        plan_id = f"plan-send-{uuid.uuid4().hex[:8]}"
        intent_hash = policy_eval["intent_hash"]

        conn = get_connection()
        with conn:
            conn.execute(
                """
                INSERT INTO plans (plan_id, user_id, intent_hash, plan_data_json, status, created_at)
                VALUES (?, ?, ?, ?, 'WAITING_APPROVAL', ?)
                """,
                (
                    plan_id,
                    user_id,
                    intent_hash,
                    json.dumps({
                        "type": "transfer",
                        "amount_usd": amount_usd,
                        "payee_id": policy_eval["payee"]["id"],
                        "payee_name": payee_name,
                        "fee_usd": 0.42
                    }),
                    time.time()
                )
            )

        return {
            "type": "approval_sheet",
            "plan_id": plan_id,
            "payee_name": payee_name,
            "you_asked": parsed.get("raw_text"),
            "understood": f"Send ${amount_usd:,.2f} to {payee_name}",
            "send_amount_usd": amount_usd,
            "receives_idr": int(amount_usd * SIMULATED_FX_USD_IDR),
            "rate": SIMULATED_FX_USD_IDR,
            "rate_pair": "IDR/USD",
            "fee_with_buffer_usd": 0.42,
            "eta": "Arrives in ~2 minutes",
            "intent_hash": intent_hash,
            "why_approval_needed": policy_eval["reason"],
            "changed_from_request": parsed.get("assumptions", []),
            "status": "WAITING_APPROVAL"
        }

    # ── Flow A: Tier 1 Auto-Approved Transfer (Send $200 to Mom) ─────────
    # Auto-executes directly by calling Bank Daemon
    payee_id = policy_eval["payee"]["id"]
    token_payload, signature = create_scoped_bank_token(
        account_id="acc_student_ayu",
        amount_usd=amount_usd,
        payee_id=payee_id,
        payee_name=payee_name,
        fee_usd=0.42
    )

    bank_res_data = await execute_bank_transfer(token_payload, signature, f"auto-{uuid.uuid4().hex}")
    if bank_res_data is None:
        return {
            "type": "execution_error",
            "code": "BANK_EXECUTION_FAILED",
            "message": "Bank execution was not confirmed. Check the ledger before sending again.",
        }

    # Record used daily allowance & audit event
    conn = get_connection()
    with conn:
        conn.execute("UPDATE policy SET used_today_usd = used_today_usd + ? WHERE user_id = ?", (amount_usd, user_id))

    record_audit_event(
        "TRANSFER_AUTO_EXECUTED",
        user_id,
        {
            "amount_usd": amount_usd,
            "payee_name": payee_name,
            "tier": "T1",
            "tx_id": bank_res_data["tx_id"]
        }
    )

    idr_received = int(amount_usd * SIMULATED_FX_USD_IDR)
    return {
        "type": "slip",
        "plan_chips": ["Quote 报价", "Payee 收款人", "Limits 额度", "Simulate 模拟", "Execute 执行"],
        "status": "COMPLETED",
        "amount_usd": amount_usd,
        "payee_name": payee_name,
        "received_text": f"Received 收款 Rp {idr_received:,} · fee 手续费 $0.42 (simulated)",
        "tx_id": bank_res_data["tx_id"],
        "remaining_balance_usd": bank_res_data["remaining_balance_usd"],
        "stamp": "SENT",
        "checks": {
            "privacy_filter": "pass",
            "spending_rules": "pass",
            "bank_token": "pass"
        },
        "note": "Done. Arrives in about 2 minutes. 已完成,约2分钟到账。"
    }
