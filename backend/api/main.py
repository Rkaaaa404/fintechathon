from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Header, HTTPException, status, Depends
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uuid
import time
import json
import httpx
import asyncio
from typing import Optional, Dict, Any, List

from .config import config
from .database import get_connection, init_db, get_db
from .auth import generate_tokens_for_user, verify_jwt
from .policy import evaluate_transfer_policy, compute_intent_hash
from .tokens import create_scoped_bank_token
from .audit import record_audit_event, verify_audit_chain
from .parser import parse_user_instruction
from .planner import calculate_tuition_quote, plan_and_process_intent
from .schemas import (
    DemoLoginRequest,
    TokenRefreshRequest,
    PolicyProposalRequest,
    ApprovePlanRequest,
    ResumeAgentRequest,
    AgentMessageRequest,
    TuitionQuoteRequest,
    AttackReplayRequest,
    EvidenceShareRequest,
    HealthResponse,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure database tables and initial testnet records exist
    init_db()
    yield
    # Shutdown: Clean teardown if needed

app = FastAPI(
    title="AegisPath Core API Service",
    description="Main agent policy plane, spending limit checks, audit chain, and scoped token issuer.",
    version="0.1.0",
    openapi_url="/v1/openapi.json",
    docs_url="/v1/docs",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Middleware for Request ID & Timing ────────────────────────
@app.middleware("http")
async def request_middleware(request: Request, call_next):
    req_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    request.state.request_id = req_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = req_id
    return response

# ── Problem+JSON Helper ────────────────────────────────────────
def problem_response(status_code: int, title: str, detail: str, code: str, request_id: str):
    return JSONResponse(
        status_code=status_code,
        media_type="application/problem+json",
        content={
            "type": f"https://aegispath.dev/errors/{code}",
            "title": title,
            "status": status_code,
            "detail": detail,
            "code": code,
            "request_id": request_id,
            "timestamp": time.time()
        }
    )

# ── Auth Dependency ────────────────────────────────────────────
def get_current_user(authorization: Optional[str] = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        # Default to demo user for local test convenience if header omitted
        return "usr_ayu"
    token = authorization.split(" ")[1]
    valid, payload, err = verify_jwt(token)
    if not valid:
        raise HTTPException(status_code=401, detail=f"Invalid or expired token: {err}")
    return payload.get("sub", "usr_ayu")

# ── Endpoints ──────────────────────────────────────────────────
@app.get("/v1/health")
def health(request: Request):
    return {
        "status": "ok",
        "service": "api",
        "version": "0.1.0",
        "network": "Testnet",
        "simulated": True,
        "request_id": getattr(request.state, "request_id", None)
    }

@app.get("/v1/ready")
def ready():
    conn = get_connection()
    cur = conn.execute("SELECT 1")
    return {"status": "ready", "database": "connected"}

# ── Auth Endpoints ─────────────────────────────────────────────
@app.post("/v1/auth/demo-login")
def demo_login(req: DemoLoginRequest = DemoLoginRequest()):
    tokens = generate_tokens_for_user(user_id="usr_ayu", username=req.username)
    record_audit_event("AUTH_LOGIN", "usr_ayu", {"method": "demo_login", "username": req.username})
    return tokens

@app.post("/v1/auth/refresh")
def refresh_token(req: TokenRefreshRequest):
    valid, payload, err = verify_jwt(req.refresh_token)
    if not valid or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    new_tokens = generate_tokens_for_user(user_id=payload.get("sub", "usr_ayu"), username=payload.get("username", "Ayu"))
    return new_tokens

# ── Policy Endpoints ───────────────────────────────────────────
@app.get("/v1/policy")
def get_policy(user_id: str = Depends(get_current_user)):
    conn = get_connection()
    cur = conn.execute("SELECT * FROM policy WHERE user_id = ?", (user_id,))
    row = cur.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Policy not found")

    return {
        "user_id": row["user_id"],
        "single_send_cap_usd": row["single_send_cap_usd"],
        "daily_cap_usd": row["daily_cap_usd"],
        "used_today_usd": row["used_today_usd"],
        "remaining_today_usd": max(0.0, row["daily_cap_usd"] - row["used_today_usd"]),
        "allowed_payees": json.loads(row["allowed_payees_json"]),
        "is_paused": bool(row["is_paused"]),
        "rule_summary": f"The agent can send up to ${row['single_send_cap_usd']:,.0f} at a time and ${row['daily_cap_usd']:,.0f} a day, only to people on your list.",
        "simulated": True
    }

@app.put("/v1/policy")
def propose_policy_change(req: PolicyProposalRequest, user_id: str = Depends(get_current_user)):
    """
    Tier 3: Policy change proposal. Live sliders are strictly forbidden.
    Requires passkey and takes effect after a 24-hour safety delay unless co-signed by guardian.
    """
    proposal_id = f"PROP-{uuid.uuid4().hex[:8].upper()}"
    effective_at = time.time() + (24 * 3600)

    conn = get_connection()
    with conn:
        conn.execute(
            """
            INSERT INTO policy_proposals (proposal_id, user_id, new_single_send_cap_usd, new_daily_cap_usd, effective_at, guardian_required, status, created_at)
            VALUES (?, ?, ?, ?, ?, 1, 'PENDING_GUARDIAN_OR_DELAY', ?)
            """,
            (proposal_id, user_id, req.new_single_send_cap_usd, req.new_daily_cap_usd, effective_at, time.time())
        )

    record_audit_event(
        "POLICY_CHANGE_PROPOSED",
        user_id,
        {
            "proposal_id": proposal_id,
            "new_daily_cap": req.new_daily_cap_usd,
            "effective_in_hours": 24
        }
    )

    return {
        "proposal_id": proposal_id,
        "status": "PENDING_GUARDIAN_OR_DELAY",
        "notice": "Takes effect in 24 hours unless your guardian co-signs.",
        "effective_at": effective_at
    }

# ── Agent Control: Kill Switch ─────────────────────────────────
@app.post("/v1/agent/pause")
def pause_agent(user_id: str = Depends(get_current_user)):
    conn = get_connection()
    with conn:
        conn.execute("UPDATE policy SET is_paused = 1 WHERE user_id = ?", (user_id,))
    record_audit_event("AGENT_KILL_SWITCH_ENGAGED", user_id, {"is_paused": True})
    return {
        "is_paused": True,
        "banner": "Agent paused. It can still show your balance. Resume with passkey."
    }

@app.post("/v1/agent/resume")
def resume_agent(req: ResumeAgentRequest, user_id: str = Depends(get_current_user)):
    # Simulated passkey verification
    if not req.passkey_signature or len(req.passkey_signature) < 6:
        raise HTTPException(status_code=400, detail="Valid passkey signature required to resume agent")

    conn = get_connection()
    with conn:
        conn.execute("UPDATE policy SET is_paused = 0 WHERE user_id = ?", (user_id,))
    record_audit_event("AGENT_RESUMED", user_id, {"resumed_with": "passkey"})
    return {
        "is_paused": False,
        "message": "Agent resumed successfully."
    }

# ── Audit Chain Endpoints ──────────────────────────────────────
@app.get("/v1/audit")
def get_audit_trail(limit: int = 50):
    conn = get_connection()
    cur = conn.execute("SELECT entry_id, action, actor, details_json, prev_hash, entry_hash, timestamp FROM audit_chain ORDER BY entry_id DESC LIMIT ?", (limit,))
    rows = [dict(r) for r in cur.fetchall()]
    return {
        "count": len(rows),
        "entries": rows
    }

@app.get("/v1/audit/verify")
def verify_audit():
    result = verify_audit_chain()
    return result

# ── Plan Approval & Bank Execution (Flows A / B) ───────────────
@app.post("/v1/plans/{plan_id}/approve")
async def approve_plan(plan_id: str, req: ApprovePlanRequest, request: Request, user_id: str = Depends(get_current_user)):
    req_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    conn = get_connection()
    cur = conn.execute("SELECT plan_id, intent_hash, plan_data_json, status FROM plans WHERE plan_id = ?", (plan_id,))
    row = cur.fetchone()
    if not row:
        return problem_response(404, "Plan Not Found", f"Plan {plan_id} does not exist", "PLAN_NOT_FOUND", req_id)

    # Cryptographic Intent Hash Verification
    stored_hash = row["intent_hash"]
    if req.intent_hash != stored_hash:
        return problem_response(
            400,
            "Intent Hash Mismatch",
            f"Provided intent hash '{req.intent_hash}' does not match locked plan hash '{stored_hash}'. Execution refused.",
            "INTENT_HASH_MISMATCH",
            req_id
        )

    plan_data = json.loads(row["plan_data_json"])
    amount_usd = plan_data["amount_usd"]
    payee_id = plan_data["payee_id"]
    payee_name = plan_data["payee_name"]

    # Issue Scoped Token for Bank Daemon
    token_payload, signature = create_scoped_bank_token(
        account_id="acc_student_ayu",
        amount_usd=amount_usd,
        payee_id=payee_id,
        payee_name=payee_name,
        fee_usd=plan_data.get("fee_usd", 0.42)
    )

    # Call Bank Service Daemon (Port 8100)
    try:
        client_kwargs = {"timeout": 10.0}
        if config.BANK_TRANSPORT is not None:
            client_kwargs["transport"] = config.BANK_TRANSPORT
        async with httpx.AsyncClient(**client_kwargs) as client:
            bank_res = await client.post(
                f"{config.BANK_SERVICE_URL}/v1/bank/transfer",
                json={"token": token_payload, "signature": signature},
                headers={"Idempotency-Key": f"plan-{plan_id}"}
            )
            bank_data = bank_res.json()
    except Exception as e:
        return problem_response(502, "Bank Service Unreachable", f"Failed to contact bank daemon: {e}", "BANK_UNREACHABLE", req_id)

    if bank_res.status_code != 200:
        return JSONResponse(status_code=bank_res.status_code, content=bank_data)

    # Mark plan completed in API database
    with conn:
        conn.execute("UPDATE plans SET status = 'COMPLETED' WHERE plan_id = ?", (plan_id,))
        # Increment used daily allowance
        conn.execute("UPDATE policy SET used_today_usd = used_today_usd + ? WHERE user_id = ?", (amount_usd, user_id))

    record_audit_event(
        "TRANSFER_EXECUTED",
        user_id,
        {
            "plan_id": plan_id,
            "amount_usd": amount_usd,
            "payee_name": payee_name,
            "tx_id": bank_data.get("tx_id"),
            "intent_hash": stored_hash
        }
    )

    return {
        "status": "COMPLETED",
        "plan_id": plan_id,
        "tx_id": bank_data.get("tx_id"),
        "amount_usd": amount_usd,
        "payee_name": payee_name,
        "remaining_balance_usd": bank_data.get("remaining_balance_usd"),
        "intent_hash": stored_hash,
        "stamp": "SENT",
        "checks": {
            "privacy_filter": "pass",
            "spending_rules": "pass",
            "bank_limit": "pass"
        }
    }

# ── Agent Conversation & Parser ────────────────────────────────
@app.post("/v1/agent/messages")
async def agent_message(req: AgentMessageRequest, user_id: str = Depends(get_current_user)):
    parsed = parse_user_instruction(req.text, req.locale)
    plan_res = await plan_and_process_intent(parsed, user_id)
    return {
        "user_id": user_id,
        "input": req.text,
        "parsed": parsed,
        "response": plan_res
    }

# ── Tuition Quote Endpoint ─────────────────────────────────────
@app.post("/v1/tuition/quote")
def get_tuition_quote(req: TuitionQuoteRequest = TuitionQuoteRequest()):
    return calculate_tuition_quote(req.amount_cny, req.mode)

# ── Plan Details (Polling Fallback) ────────────────────────────
@app.get("/v1/plans/{plan_id}")
def get_plan_details(plan_id: str):
    conn = get_connection()
    cur = conn.execute("SELECT plan_id, user_id, intent_hash, plan_data_json, status, created_at FROM plans WHERE plan_id = ?", (plan_id,))
    row = cur.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Plan not found")
    return {
        "plan_id": row["plan_id"],
        "user_id": row["user_id"],
        "intent_hash": row["intent_hash"],
        "plan_data": json.loads(row["plan_data_json"]),
        "status": row["status"],
        "created_at": row["created_at"]
    }

# ── Server-Sent Events (SSE) ───────────────────────────────────
@app.get("/v1/events")
async def sse_events(request: Request):
    async def event_generator():
        yield f"event: connected\ndata: {json.dumps({'status': 'connected', 'timestamp': time.time()})}\n\n"
        for _ in range(2):
            if await request.is_disconnected():
                break
            await asyncio.sleep(0.5)
            yield f"event: heartbeat\ndata: {json.dumps({'agent': 'online', 'timestamp': time.time()})}\n\n"
    return StreamingResponse(event_generator(), media_type="text/event-stream")

# ── Evidence Pack Endpoints ────────────────────────────────────
@app.get("/v1/evidence")
def get_evidence_pack(user_id: str = Depends(get_current_user)):
    conn = get_connection()
    cur = conn.execute("SELECT * FROM evidence_shares WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
    shares = []
    for r in cur.fetchall():
        days_left = max(0, int((r["expires_at"] - time.time()) / 86400))
        shares.append({
            "id": r["share_id"],
            "recipient": r["recipient"],
            "recipient_zh": r["recipient_zh"],
            "expires_in_days": days_left,
            "shared_fields": r["shared_fields"],
            "revoked": bool(r["is_revoked"])
        })
    return {
        "avg_monthly_balance_usd": 1820.0,
        "income_months_ratio": "6/6",
        "statement_months": 6,
        "sources": [
            {"name": "Bank statements 6 months", "name_zh": "6个月银行流水", "provenance": "Uploaded by you", "provenance_zh": "本人上传", "tier": "Tier 1", "tier_badge": "T1"},
            {"name": "Family transfers", "name_zh": "家庭经常性汇款", "provenance": "Bank API (simulated)", "provenance_zh": "银行接口（模拟）", "tier": "Tier 2", "tier_badge": "T2"},
            {"name": "Scholarship letter", "name_zh": "奖学金证明函", "provenance": "Signed by university", "provenance_zh": "大学官方签署", "tier": "Tier 3", "tier_badge": "T3"}
        ],
        "shares": shares,
        "disclaimer": "An evidence summary, not a credit score. Acceptance by others is not guaranteed (财力证明摘要，非信用评级，不保证第三方绝对采纳)。",
        "simulated": True
    }

@app.post("/v1/evidence/share")
def create_evidence_share(req: EvidenceShareRequest, user_id: str = Depends(get_current_user)):
    share_id = f"share_{uuid.uuid4().hex[:8]}"
    now = time.time()
    expires_at = now + (req.days * 86400)
    conn = get_connection()
    with conn:
        conn.execute("""
            INSERT INTO evidence_shares (share_id, user_id, recipient, recipient_zh, shared_fields, expires_at, is_revoked, created_at)
            VALUES (?, ?, ?, ?, 'Balance & regular deposits (redacted ID & account numbers)', ?, 0, ?)
        """, (share_id, user_id, req.recipient, req.recipient, expires_at, now))
    record_audit_event("EVIDENCE_SHARE_CREATED", user_id, {"share_id": share_id, "recipient": req.recipient})
    return {
        "id": share_id,
        "recipient": req.recipient,
        "expires_in_days": req.days,
        "status": "active"
    }

@app.delete("/v1/evidence/share/{share_id}")
def revoke_evidence_share(share_id: str, user_id: str = Depends(get_current_user)):
    conn = get_connection()
    with conn:
        conn.execute("UPDATE evidence_shares SET is_revoked = 1 WHERE share_id = ? AND user_id = ?", (share_id, user_id))
    record_audit_event("EVIDENCE_SHARE_REVOKED", user_id, {"share_id": share_id})
    return {
        "id": share_id,
        "revoked": True,
        "status": "revoked"
    }

# ── Runway Planner Endpoint ────────────────────────────────────
@app.get("/v1/planner")
def get_runway_plan(scenario: str = "on_time"):
    is_delayed = scenario == "delayed"
    months = [
        {"month": "Oct", "balance_usd": 2450.0},
        {"month": "Nov", "balance_usd": 2100.0},
        {"month": "Dec", "balance_usd": 1800.0},
        {"month": "Jan", "balance_usd": 750.0 if is_delayed else 1600.0},
        {"month": "Feb", "balance_usd": 1100.0 if is_delayed else 1950.0},
        {"month": "Mar", "balance_usd": 1700.0 if is_delayed else 2300.0}
    ]
    warning = None
    if is_delayed:
        warning = {
            "title": "Below the safe minimum in January",
            "title_zh": "1月将低于安全线",
            "detail": "Tuition deduction happens before delayed scholarship arrives. Projected shortfall: $250.",
            "detail_zh": "学费扣款先于延迟奖学金到账，预计资金缺口：$250。",
            "remedies": [
                {"id": "move_date", "label": "Request bursar payment split (申请分期/延期)", "icon": "calendar"},
                {"id": "advance", "label": "Request family advance (申请家庭临时备用金)", "icon": "family"},
                {"id": "topup", "label": "Top up runway balance (手动转入备用金)", "icon": "wallet"}
            ]
        }
    return {
        "scenario": scenario,
        "safe_minimum_usd": 1000.0,
        "months": months,
        "warning": warning,
        "disclaimer": "Deterministic simulation from your schedule, not a prediction (基于时间表的确定性推演，非未来预测)。",
        "simulated": True
    }

# ── Attack Replay Endpoint (Three-Ring Defense) ─────────────────
@app.post("/v1/attacks/replay")
def replay_attack(req: AttackReplayRequest, user_id: str = Depends(get_current_user)):
    disabled = set(req.disabled_layers or [])
    privacy_active = "privacy" not in disabled
    rules_active = "rules" not in disabled
    bank_active = "bank" not in disabled

    if privacy_active:
        stopped_by = "outer"
        funds_lost = 0.0
        verdicts = [
            {"ring": "outer", "name": "Privacy filter", "status": "flagged", "text": "Privacy filter flagged an instruction inside the invoice/memo"},
            {"ring": "middle", "name": "Spending rules", "status": "inactive", "text": "Spending rules would refuse: recipient is not on your list"},
            {"ring": "inner", "name": "Bank limit", "status": "inactive", "text": "Bank-side limit would refuse: unverified scoped token"}
        ]
    elif rules_active:
        stopped_by = "middle"
        funds_lost = 0.0
        verdicts = [
            {"ring": "outer", "name": "Privacy filter", "status": "bypassed", "text": "Layer disabled: prompt injection bypassed Outer Ring"},
            {"ring": "middle", "name": "Spending rules", "status": "refused", "text": "Middle Ring policy engine dropped transfer: recipient not allowed & unapproved"},
            {"ring": "inner", "name": "Bank limit", "status": "inactive", "text": "Bank-side limit would refuse: missing scoped token"}
        ]
    elif bank_active:
        stopped_by = "inner"
        funds_lost = 0.0
        verdicts = [
            {"ring": "outer", "name": "Privacy filter", "status": "bypassed", "text": "Layer disabled: prompt injection bypassed Outer Ring"},
            {"ring": "middle", "name": "Spending rules", "status": "bypassed", "text": "Layer disabled: bypassed spending rules policy plane"},
            {"ring": "inner", "name": "Bank limit", "status": "refused", "text": "Inner Ring bank daemon rejected transfer: invalid/missing HMAC token"}
        ]
    else:
        # All disabled!
        stopped_by = "none"
        funds_lost = 2450.0
        verdicts = [
            {"ring": "outer", "name": "Privacy filter", "status": "bypassed", "text": "Layer disabled"},
            {"ring": "middle", "name": "Spending rules", "status": "bypassed", "text": "Layer disabled"},
            {"ring": "inner", "name": "Bank limit", "status": "bypassed", "text": "Layer disabled: catastrophic failure without defense rings"}
        ]

    record_audit_event("ATTACK_REPLAY_EXECUTED", user_id, {
        "case_id": req.case_id,
        "disabled_layers": list(disabled),
        "stopped_by": stopped_by,
        "funds_lost_usd": funds_lost
    })

    return {
        "case_id": req.case_id,
        "stopped_by": stopped_by,
        "funds_lost_usd": funds_lost,
        "verdicts": verdicts,
        "timeline_ms": [0, 200, 400],
        "simulated": True
    }

