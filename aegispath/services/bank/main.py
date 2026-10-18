from fastapi import FastAPI, Request, Header, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uuid
import time
import json
from typing import Optional, Dict, Any, List

from .config import config
from .database import get_connection
from .security import verify_scoped_token

app = FastAPI(
    title="AegisPath Bank Service (Simulated)",
    description="Independent simulated banking and ledger daemon enforcing inner-ring limits.",
    version="0.1.0"
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

# ── Models ─────────────────────────────────────────────────────
class ScopedTokenPayload(BaseModel):
    account_id: str = "acc_student_ayu"
    amount: float
    payee_id: str
    payee_name: str
    fee_usd: float = 0.42
    nonce: str
    expires_at: float

class TransferRequest(BaseModel):
    token: ScopedTokenPayload
    signature: str

# ── Endpoints ──────────────────────────────────────────────────
@app.get("/v1/health")
def health(request: Request):
    return {
        "status": "ok",
        "service": "bank",
        "version": "0.1.0",
        "simulated": True,
        "request_id": getattr(request.state, "request_id", None)
    }

@app.get("/v1/ready")
def ready():
    conn = get_connection()
    cur = conn.execute("SELECT 1")
    return {"status": "ready", "database": "connected"}

@app.get("/v1/bank/balance")
def get_balance(account_id: str = "acc_student_ayu"):
    conn = get_connection()
    cur = conn.execute("SELECT account_id, owner_name, balance_usd, currency FROM accounts WHERE account_id = ?", (account_id,))
    row = cur.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Account not found")
    return {
        "account_id": row["account_id"],
        "owner_name": row["owner_name"],
        "balance_usd": row["balance_usd"],
        "currency": row["currency"],
        "network": "Testnet",
        "simulated": True
    }

@app.get("/v1/bank/ledger")
def get_ledger(account_id: str = "acc_student_ayu"):
    conn = get_connection()
    cur = conn.execute(
        "SELECT tx_id, account_id, payee_id, payee_name, amount_usd, fee_usd, direction, status, created_at "
        "FROM ledger WHERE account_id = ? ORDER BY created_at DESC LIMIT 50",
        (account_id,)
    )
    entries = [dict(r) for r in cur.fetchall()]
    return {
        "account_id": account_id,
        "total_entries": len(entries),
        "entries": entries,
        "simulated": True
    }

@app.post("/v1/bank/transfer")
def execute_transfer(
    req: TransferRequest,
    request: Request,
    idempotency_key: Optional[str] = Header(None, alias="Idempotency-Key")
):
    req_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    conn = get_connection()

    # 1. Check Idempotency Cache
    if idempotency_key:
        cur = conn.execute("SELECT response_json FROM idempotency_records WHERE idempotency_key = ?", (idempotency_key,))
        row = cur.fetchone()
        if row:
            # Return cached idempotency response
            cached = json.loads(row["response_json"])
            cached["idempotent_replay"] = True
            return cached

    # 2. Verify Scoped Token Signature, Expiry, & Replay
    token_dict = req.token.model_dump()
    valid, err_msg = verify_scoped_token(token_dict, req.signature)
    if not valid:
        return problem_response(
            status_code=status.HTTP_401_UNAUTHORIZED,
            title="Scoped Token Validation Failed",
            detail=err_msg or "Signature verification failed",
            code="INVALID_SCOPED_TOKEN",
            request_id=req_id
        )

    # 3. Check Account Balance
    cur = conn.execute("SELECT balance_usd FROM accounts WHERE account_id = ?", (req.token.account_id,))
    row = cur.fetchone()
    if not row:
        return problem_response(
            status_code=status.HTTP_404_NOT_FOUND,
            title="Account Not Found",
            detail=f"Account {req.token.account_id} does not exist",
            code="ACCOUNT_NOT_FOUND",
            request_id=req_id
        )

    total_debit = req.token.amount + req.token.fee_usd
    current_balance = row["balance_usd"]
    if current_balance < total_debit:
        return problem_response(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            title="Insufficient Funds",
            detail=f"Required ${total_debit:.2f} but available balance is ${current_balance:.2f}",
            code="INSUFFICIENT_FUNDS",
            request_id=req_id
        )

    # 4. Atomic Execution: Debit & Record to Ledger
    tx_id = f"TX-SIM-{uuid.uuid4().hex[:12].upper()}"
    now = time.time()
    new_balance = current_balance - total_debit

    with conn:
        conn.execute(
            "UPDATE accounts SET balance_usd = ?, updated_at = ? WHERE account_id = ?",
            (new_balance, now, req.token.account_id)
        )
        conn.execute(
            """
            INSERT INTO ledger (
                tx_id, account_id, payee_id, payee_name, amount_usd, fee_usd,
                direction, status, idempotency_key, scoped_token_hash, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, 'DEBIT', 'COMPLETED', ?, ?, ?)
            """,
            (
                tx_id, req.token.account_id, req.token.payee_id, req.token.payee_name,
                req.token.amount, req.token.fee_usd, idempotency_key, req.signature[:16], now
            )
        )

        response_data = {
            "tx_id": tx_id,
            "status": "COMPLETED",
            "account_id": req.token.account_id,
            "payee_id": req.token.payee_id,
            "payee_name": req.token.payee_name,
            "amount_usd": req.token.amount,
            "fee_usd": req.token.fee_usd,
            "remaining_balance_usd": round(new_balance, 2),
            "created_at": now,
            "checks": {
                "privacy_filter": "pass",
                "spending_rules": "pass",
                "bank_limit": "pass"
            },
            "network": "Testnet",
            "simulated": True
        }

        # Save Idempotency Record
        if idempotency_key:
            conn.execute(
                "INSERT INTO idempotency_records (idempotency_key, response_json, created_at) VALUES (?, ?, ?)",
                (idempotency_key, json.dumps(response_data), now)
            )

    return response_data
