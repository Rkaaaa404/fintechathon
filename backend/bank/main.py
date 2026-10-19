from contextlib import asynccontextmanager, closing
from fastapi import FastAPI, Request, Header, HTTPException
from fastapi.responses import JSONResponse
import uuid
import time
import json
import hashlib
from decimal import Decimal
from typing import Optional

from .config import config
from .database import get_connection, init_db
from .security import canonical_json, verify_scoped_token
from .schemas import TransferRequest

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure bank tables and custodial student account exist
    init_db()
    yield
    # Shutdown: Clean teardown if needed

app = FastAPI(
    title="AegisPath Bank Service (Simulated)",
    description="Independent simulated banking and ledger daemon enforcing inner-ring limits.",
    version="0.1.0",
    lifespan=lifespan
)


# ── Middleware for Request ID & Timing ────────────────────────
@app.middleware("http")
async def request_middleware(request: Request, call_next):
    req_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    request.state.request_id = req_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = req_id
    response.headers["Cache-Control"] = "no-store"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Content-Security-Policy"] = "frame-ancestors 'none'"
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
    token = req.token
    token_dict = token.model_dump()
    valid, err_msg = verify_scoped_token(token_dict, req.signature)
    if not valid:
        return problem_response(401, "Scoped Token Validation Failed", err_msg,
                                "INVALID_SCOPED_TOKEN", req_id)
    if idempotency_key != token.idempotency_key:
        return problem_response(400, "Idempotency Key Mismatch",
                                "The header must match the signed idempotency key.",
                                "IDEMPOTENCY_KEY_MISMATCH", req_id)

    token_hash = hashlib.sha256(canonical_json(token_dict)).hexdigest()
    with closing(get_connection()) as conn, conn:
        # Serialize every decision with its effects, including cache and nonce lookup.
        conn.execute("BEGIN IMMEDIATE")
        # A request may have waited for another writer past its token's expiry.
        if token.expires_at <= time.time():
            return problem_response(401, "Scoped Token Validation Failed", "Scoped token expired",
                                    "INVALID_SCOPED_TOKEN", req_id)
        cached = conn.execute(
            "SELECT response_json FROM idempotency_records WHERE idempotency_key = ?",
            (idempotency_key,),
        ).fetchone()
        if cached:
            recorded = conn.execute(
                "SELECT scoped_token_hash FROM ledger WHERE idempotency_key = ? AND account_id = ?",
                (idempotency_key, token.account_id),
            ).fetchone()
            if not recorded or recorded["scoped_token_hash"] != token_hash:
                return problem_response(409, "Idempotency Conflict",
                                        "This key belongs to a different authorized request.",
                                        "IDEMPOTENCY_CONFLICT", req_id)
            response_data = json.loads(cached["response_json"])
            response_data["idempotent_replay"] = True
            return response_data

        if conn.execute("SELECT 1 FROM used_nonces WHERE nonce = ?", (token.nonce,)).fetchone():
            return problem_response(401, "Scoped Token Validation Failed",
                                    "Replay detected: nonce already consumed",
                                    "INVALID_SCOPED_TOKEN", req_id)
        if config.ALLOWED_PAYEES.get(token.account_id, {}).get(token.payee_id) != token.payee_name:
            return problem_response(403, "Payee Not Allowed",
                                    "The bank has not authorized this account and recipient.",
                                    "PAYEE_NOT_ALLOWED", req_id)
        if token.amount > config.SINGLE_SEND_CAP_USD or token.fee_usd > config.MAX_FEE_USD:
            return problem_response(422, "Bank Limit Exceeded",
                                    "Principal or fee exceeds the bank's independent limit.",
                                    "BANK_LIMIT_EXCEEDED", req_id)
        now = time.time()
        day_start = int(now // 86400) * 86400
        spent_cents = conn.execute(
            "SELECT COALESCE(SUM(CAST(ROUND(amount_usd * 100) AS INTEGER)), 0) FROM ledger "
            "WHERE account_id = ? AND direction = 'DEBIT' AND status = 'COMPLETED' "
            "AND created_at >= ? AND created_at < ?",
            (token.account_id, day_start, day_start + 86400),
        ).fetchone()[0]
        amount_cents = int(Decimal(str(token.amount)) * 100)
        fee_cents = int(Decimal(str(token.fee_usd)) * 100)
        if spent_cents + amount_cents > int(Decimal(str(config.DAILY_CAP_USD)) * 100):
            return problem_response(422, "Daily Bank Limit Exceeded",
                                    "The bank's UTC-day principal limit would be exceeded.",
                                    "BANK_DAILY_LIMIT_EXCEEDED", req_id)
        account = conn.execute(
            "SELECT balance_usd FROM accounts WHERE account_id = ?", (token.account_id,),
        ).fetchone()
        if not account:
            return problem_response(404, "Account Not Found", "Account does not exist.",
                                    "ACCOUNT_NOT_FOUND", req_id)
        balance_cents = int(round(Decimal(str(account["balance_usd"])) * 100))
        debit_cents = amount_cents + fee_cents
        if balance_cents < debit_cents:
            return problem_response(422, "Insufficient Funds",
                                    "Available balance is less than principal plus fee.",
                                    "INSUFFICIENT_FUNDS", req_id)

        new_balance = (balance_cents - debit_cents) / 100
        tx_id = f"TX-SIM-{uuid.uuid4().hex.upper()}"
        conn.execute("INSERT INTO used_nonces (nonce, used_at) VALUES (?, ?)", (token.nonce, now))
        conn.execute(
            "UPDATE accounts SET balance_usd = ?, updated_at = ? WHERE account_id = ?",
            (new_balance, now, token.account_id),
        )
        conn.execute(
            "INSERT INTO ledger (tx_id, account_id, payee_id, payee_name, amount_usd, fee_usd, "
            "direction, status, idempotency_key, scoped_token_hash, created_at) "
            "VALUES (?, ?, ?, ?, ?, ?, 'DEBIT', 'COMPLETED', ?, ?, ?)",
            (tx_id, token.account_id, token.payee_id, token.payee_name, token.amount,
             token.fee_usd, idempotency_key, token_hash, now),
        )
        response_data = {
            "tx_id": tx_id,
            "status": "COMPLETED",
            "account_id": token.account_id,
            "payee_id": token.payee_id,
            "payee_name": token.payee_name,
            "amount_usd": token.amount,
            "fee_usd": token.fee_usd,
            "remaining_balance_usd": new_balance,
            "created_at": now,
            "checks": {"spending_rules": "pass", "bank_limit": "pass"},
            "network": "Testnet",
            "simulated": True,
        }
        conn.execute(
            "INSERT INTO idempotency_records (idempotency_key, response_json, created_at) VALUES (?, ?, ?)",
            (idempotency_key, json.dumps(response_data), now),
        )
    return response_data
