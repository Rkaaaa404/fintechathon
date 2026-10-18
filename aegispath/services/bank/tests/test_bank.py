import pytest
import time
import uuid
from fastapi.testclient import TestClient
from services.bank.main import app
from services.bank.security import sign_scoped_token
from services.bank.config import config

client = TestClient(app)

def test_bank_health_and_ready():
    r = client.get("/v1/health")
    assert r.status_code == 200
    assert r.json()["service"] == "bank"
    assert r.json()["simulated"] is True

    r_ready = client.get("/v1/ready")
    assert r_ready.status_code == 200
    assert r_ready.json()["status"] == "ready"

def test_bank_initial_balance():
    r = client.get("/v1/bank/balance?account_id=acc_student_ayu")
    assert r.status_code == 200
    data = r.json()
    assert data["account_id"] == "acc_student_ayu"
    assert data["balance_usd"] >= 2000.0

def test_bank_valid_transfer_and_idempotency():
    initial_r = client.get("/v1/bank/balance?account_id=acc_student_ayu")
    initial_balance = initial_r.json()["balance_usd"]

    nonce = str(uuid.uuid4())
    token_payload = {
        "account_id": "acc_student_ayu",
        "amount": 200.0,
        "payee_id": "p1",
        "payee_name": "Mom",
        "fee_usd": 0.42,
        "nonce": nonce,
        "expires_at": time.time() + 300
    }
    sig = sign_scoped_token(token_payload, config.SECRET_KEY)
    idempotency_key = f"idem-{uuid.uuid4().hex}"

    # 1. Execute Transfer
    r = client.post(
        "/v1/bank/transfer",
        json={"token": token_payload, "signature": sig},
        headers={"Idempotency-Key": idempotency_key}
    )
    assert r.status_code == 200
    res_data = r.json()
    assert res_data["status"] == "COMPLETED"
    assert res_data["amount_usd"] == 200.0
    tx_id_1 = res_data["tx_id"]

    # Balance should decrease by 200 + 0.42 = 200.42
    after_r = client.get("/v1/bank/balance?account_id=acc_student_ayu")
    assert round(after_r.json()["balance_usd"], 2) == round(initial_balance - 200.42, 2)

    # 2. Re-send identical request with same Idempotency-Key -> MUST return same tx_id without debiting again!
    r_idempotent = client.post(
        "/v1/bank/transfer",
        json={"token": token_payload, "signature": sig},
        headers={"Idempotency-Key": idempotency_key}
    )
    assert r_idempotent.status_code == 200
    assert r_idempotent.json()["tx_id"] == tx_id_1
    assert r_idempotent.json().get("idempotent_replay") is True

    # Balance remains the same
    after_idempotent_r = client.get("/v1/bank/balance?account_id=acc_student_ayu")
    assert round(after_idempotent_r.json()["balance_usd"], 2) == round(initial_balance - 200.42, 2)

def test_bank_rejects_tampered_token():
    token_payload = {
        "account_id": "acc_student_ayu",
        "amount": 200.0,
        "payee_id": "p1",
        "payee_name": "Mom",
        "fee_usd": 0.42,
        "nonce": str(uuid.uuid4()),
        "expires_at": time.time() + 300
    }
    sig = sign_scoped_token(token_payload, config.SECRET_KEY)

    # Tamper with amount to $2,000.00
    token_payload["amount"] = 2000.0

    r = client.post(
        "/v1/bank/transfer",
        json={"token": token_payload, "signature": sig}
    )
    assert r.status_code == 401
    assert r.json()["code"] == "INVALID_SCOPED_TOKEN"

def test_bank_rejects_expired_token():
    token_payload = {
        "account_id": "acc_student_ayu",
        "amount": 200.0,
        "payee_id": "p1",
        "payee_name": "Mom",
        "fee_usd": 0.42,
        "nonce": str(uuid.uuid4()),
        "expires_at": time.time() - 10 # expired 10s ago
    }
    sig = sign_scoped_token(token_payload, config.SECRET_KEY)

    r = client.post(
        "/v1/bank/transfer",
        json={"token": token_payload, "signature": sig}
    )
    assert r.status_code == 401
    assert "expired" in r.json()["detail"].lower()
