import uuid
import time
import json
import httpx
import math
import re
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
    raw_text = parsed.get("raw_text", "").strip().lower()

    # ── Flow: Tier 0 Balance / Limit Inspection & Conversational Inquiries ──
    if action in ("check_balance", "transfer_ability_query", "general_query"):
        conn = get_connection()
        p_row = conn.execute(
            "SELECT single_send_cap_usd, daily_cap_usd, used_today_usd, is_paused FROM policy WHERE user_id = ?",
            (user_id,)
        ).fetchone()
        single_cap = float(p_row["single_send_cap_usd"]) if p_row else 500.0
        daily_cap = float(p_row["daily_cap_usd"]) if p_row else 1000.0
        used_today = float(p_row["used_today_usd"]) if p_row else 0.0
        remaining = max(0.0, daily_cap - used_today)
        is_paused = bool(p_row["is_paused"]) if p_row else False

        # Live custodial balance from bank sandbox
        balance_usd = 12450.0
        try:
            from backend.bank.database import get_connection as get_bank_conn
            with get_bank_conn() as bconn:
                acc = bconn.execute("SELECT balance_usd FROM accounts WHERE account_id = 'acc_student_ayu'").fetchone()
                if acc:
                    balance_usd = float(acc["balance_usd"])
        except Exception:
            pass

        locale = parsed.get("locale", "en")
        is_zh = (locale == "zh") or bool(re.search(r"[\u4e00-\u9fff]", raw_text))

        # 1. Balance / Allowance Query (Tier 0 read-only check)
        if action == "check_balance" or any(k in raw_text for k in ("balance", "saldo", "limit", "allowance", "cap", "kuota", "余额", "额度")):
            msg_en = (
                f"💳 **Account Balance:** ${balance_usd:,.2f} USD\n"
                f"📊 **Daily Allowance:** ${remaining:,.2f} USD remaining today (Used ${used_today:,.2f} of ${daily_cap:,.2f} daily cap)\n"
                f"⚡ **Single-Send Limit:** ${single_cap:,.2f} USD (Tier 1 auto-approved)\n"
                f"👥 **Allowlisted Payees:** Mom, Campus bursar, Dad\n"
                f"🛡️ **Safety Status:** {'Paused (Kill-switch engaged)' if is_paused else 'Active (Resets daily at 00:00 UTC)'}"
            )
            msg_zh = (
                f"💳 **账户余额:** ${balance_usd:,.2f} USD\n"
                f"📊 **今日可用额度:** 剩余 ${remaining:,.2f} USD (已使用 ${used_today:,.2f} / ${daily_cap:,.2f} USD 上限)\n"
                f"⚡ **单笔限额:** ${single_cap:,.2f} USD (Tier 1 自动确认)\n"
                f"👥 **白名单收款人:** 妈妈 (Mom), 学院财务处 (Campus bursar), 爸爸 (Dad)\n"
                f"🛡️ **智能体状态:** {'已暂停 (安全熔断已触发)' if is_paused else '正常运行 (每日 00:00 UTC 重置)'}"
            )
            return {
                "type": "info_note",
                "message": msg_zh if is_zh else msg_en,
                "message_en": msg_en,
                "message_zh": msg_zh,
                "action_type": "check_balance"
            }

        # 2. Transfer Ability Inquiry ("Can I still send money?", "还能转账吗？", etc.)
        if action == "transfer_ability_query" or any(k in raw_text for k in ("can i", "still send", "still sent", "bisa kirim", "bisa transfer", "pengiriman", "转账")):
            if is_paused:
                msg_en = "Transfers are currently paused because the Kill-Switch is engaged. Please resume the agent in Safety controls before sending funds."
                msg_zh = "智能体转账功能目前已被紧急制动（Kill-Switch）暂停。请在安全中心恢复运行后再发起转账。"
            elif remaining <= 0:
                msg_en = f"You have reached your daily limit of ${daily_cap:,.2f} USD for today ($0.00 remaining). The allowance will reset at 00:00 UTC."
                msg_zh = f"您今日的 ${daily_cap:,.2f} USD 转账额度已达上限（剩余 $0.00）。该额度将于每日 00:00 UTC 自动重置。"
            else:
                msg_en = f"Yes, you can still send money! Your daily allowance has **${remaining:,.2f} USD remaining today** (used ${used_today:,.2f} of ${daily_cap:,.2f} limit). You can send up to ${single_cap:,.2f} USD per transaction to allowlisted payees (Mom, Dad, Campus bursar)."
                msg_zh = f"是的，您仍可进行转账汇款！您今日的可用额度仍有 **${remaining:,.2f} USD**（今日已使用 ${used_today:,.2f} / ${daily_cap:,.2f} USD 上限）。单笔向白名单收款人（妈妈 Mom、爸爸 Dad、财务处 Campus bursar）转账限额为 ${single_cap:,.2f} USD。"
            return {
                "type": "info_note",
                "message": msg_zh if is_zh else msg_en,
                "message_en": msg_en,
                "message_zh": msg_zh,
                "action_type": "transfer_ability_query"
            }

        # 3. Help & Greeting Inquiries
        if any(k in raw_text for k in ("help", "halo", "hello", "hi", "hey", "apa yang bisa", "what can you do", "siapa kamu", "who are you", "你好", "帮助")):
            msg_en = (
                "Hello! I am Chop, your AI Digital Wallet Assistant for cross-border student finance.\n\n"
                "Here is what I can do:\n"
                "1. ⚡ **Instant Transfers (Tier 1):** Send USD up to $500 to allowlisted family (e.g. *'Send USD 200 to Mom'*).\n"
                "2. 🎓 **Tuition Planning (Tier 2):** Plan CNY tuition to Campus bursar with dynamic FX buffer.\n"
                "3. 💳 **Allowance Tracking (Tier 0):** Check remaining daily spending allowance (*'Check remaining limit'*).\n"
                "4. 🛡️ **Autonomous Sentinel Defense:** Real-time defense against invoice tampering and prompt injection."
            )
            msg_zh = (
                "你好！我是 Chop，专为留学生打造的跨境数字钱包 AI 智能体助手。\n\n"
                "我能为您提供以下服务：\n"
                "1. ⚡ **极速汇款 (Tier 1)：** 向白名单家庭成员发送最高 $500 USD（例：*'给妈妈汇款 $200'*）。\n"
                "2. 🎓 **学费规划 (Tier 2)：** 向学院财务处 (Campus bursar) 预约缴纳 CNY 学费并享受动态汇率缓冲保护。\n"
                "3. 💳 **额度查询 (Tier 0)：** 随时查看今日剩余消费与转账额度（点击 *'查询剩余额度'*）。\n"
                "4. 🛡️ **哨兵防御 (Sentinel)：** 智能识别伪造账单、钓鱼欺诈与提示词注入攻击。"
            )
            return {
                "type": "info_note",
                "message": msg_zh if is_zh else msg_en,
                "message_en": msg_en,
                "message_zh": msg_zh,
                "action_type": "general_query"
            }

        # General query default
        msg_en = "I can help with USD transfers and CNY tuition payments. You can also check your remaining allowance by clicking '💳 Check remaining limit'."
        msg_zh = "我可以帮您处理 USD 跨境转账和 CNY 留学生学费缴费。您也可以点击“💳 查询今日剩余可用额度”随时查看额度。"
        return {
            "type": "info_note",
            "message": msg_zh if is_zh else msg_en,
            "message_en": msg_en,
            "message_zh": msg_zh
        }
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
            "message_en": "Specify one payment with an explicit amount, currency, and recipient.",
            "message_zh": "请提供具体的单笔付款指令，包含明确的金额、币种和收款人。",
        }

    # Handle Tuition
    if action == "tuition":
        quote = calculate_tuition_quote(amount, parsed.get("route_preference", "cheapest"))
        amount_usd = quote["total_send_usd"]
        policy_eval = evaluate_transfer_policy(user_id, amount_usd, "Campus bursar")
        if policy_eval.get("tier") == "REFUSED":
            return {"type": "refused_note", "reason": policy_eval.get("reason"), "stamp": "BLOCKED"}

        plan_id = f"plan-tuition-{uuid.uuid4().hex[:8]}"
        intent_hash = compute_intent_hash("p2", "Campus bursar", amount_usd, "CNY", quote["rate"], fee_usd=quote["fee_usd"], route_id=quote["mode"])

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
                        "fee_usd": quote["fee_usd"],
                        "currency": "CNY",
                        "rate": quote["rate"],
                        "route_id": quote["mode"],
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
                        "fee_usd": 0.42,
                        "currency": "USD",
                        "rate": 1.0,
                        "route_id": "default",
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
    conn = get_connection()
    with conn:
        reserved = conn.execute(
            "UPDATE policy SET used_today_usd = used_today_usd + ? WHERE user_id = ? AND is_paused = 0 AND ? <= single_send_cap_usd AND used_today_usd + ? <= daily_cap_usd",
            (amount_usd, user_id, amount_usd, amount_usd),
        )
        if reserved.rowcount != 1:
            return {"type": "refused_note", "reason": "Agent paused or allowance unavailable.", "stamp": "BLOCKED"}
    idempotency_key = f"auto-{uuid.uuid4().hex}"
    payee_id = policy_eval["payee"]["id"]
    token_payload, signature = create_scoped_bank_token(
        account_id="acc_student_ayu",
        amount_usd=amount_usd,
        payee_id=payee_id,
        payee_name=payee_name,
        fee_usd=0.42,
        intent_hash=compute_intent_hash(payee_id, payee_name, amount_usd),
        idempotency_key=idempotency_key,
    )

    bank_res_data = await execute_bank_transfer(token_payload, signature, idempotency_key)
    if bank_res_data is None:
        with conn:
            conn.execute("UPDATE policy SET used_today_usd = used_today_usd - ? WHERE user_id = ?", (amount_usd, user_id))
        return {
            "type": "execution_error",
            "code": "BANK_EXECUTION_FAILED",
            "message": "Bank execution was not confirmed. Check the ledger before sending again.",
        }

    # Allowance was reserved before execution and stays reserved on unknown outcomes.

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
