import hashlib
import sqlite3
import time
import uuid
from concurrent.futures import ThreadPoolExecutor
from contextlib import closing
from threading import Barrier

import pytest
from fastapi.testclient import TestClient
from starlette.requests import Request

from backend.bank import main
from backend.bank.config import config
from backend.bank.database import get_connection, init_db
from backend.bank.schemas import TransferRequest
from backend.bank.security import canonical_json, sign_scoped_token, verify_scoped_token
from backend.transfer_intent import compute_intent_hash

client = TestClient(main.app)


def token(amount=200.0, **changes):
    payload = {
        "account_id": "acc_student_ayu", "amount": amount,
        "payee_id": "p1", "payee_name": "Mom", "fee_usd": 0.42,
        "nonce": str(uuid.uuid4()), "expires_at": time.time() + 300,
        "idempotency_key": str(uuid.uuid4()), "currency": "USD", "rate": 1.0,
        "route_id": "default",
    }
    payload.update(changes)
    payload["intent_hash"] = compute_intent_hash(
        payload["payee_id"], payload["payee_name"], payload["amount"],
        payload["currency"], payload["rate"], fee_usd=payload["fee_usd"],
        route_id=payload["route_id"],
    )
    return payload


def send(payload, signature=None, key=None):
    return client.post(
        "/v1/bank/transfer",
        json={"token": payload, "signature": signature or sign_scoped_token(payload)},
        headers={"Idempotency-Key": key or payload["idempotency_key"]},
    )


def state():
    with closing(get_connection()) as conn:
        return (
            conn.execute("SELECT balance_usd FROM accounts WHERE account_id='acc_student_ayu'").fetchone()[0],
            conn.execute("SELECT COUNT(*), COALESCE(SUM(amount_usd + fee_usd), 0) FROM ledger").fetchone()[:],
            conn.execute("SELECT COUNT(*) FROM used_nonces").fetchone()[0],
            conn.execute("SELECT COUNT(*) FROM idempotency_records").fetchone()[0],
        )


def set_balance(amount):
    with closing(get_connection()) as conn, conn:
        conn.execute("UPDATE accounts SET balance_usd = ?", (amount,))


def test_bank_health_ready_and_balance():
    assert client.get("/v1/health").json()["service"] == "bank"
    assert client.get("/v1/ready").status_code == 200
    assert client.get("/v1/bank/balance").json()["balance_usd"] == 12450


def test_valid_transfer_and_authenticated_exact_idempotency():
    payload = token()
    response = send(payload)
    assert response.status_code == 200
    first_state = state()
    assert first_state == (12249.58, (1, 200.42), 1, 1)
    replay = send(payload)
    assert replay.status_code == 200
    assert replay.json()["tx_id"] == response.json()["tx_id"]
    assert replay.json()["idempotent_replay"] is True
    assert state() == first_state
    with closing(get_connection()) as conn:
        digest = conn.execute("SELECT scoped_token_hash FROM ledger").fetchone()[0]
    assert digest == hashlib.sha256(canonical_json(payload)).hexdigest()


def test_idempotency_cache_never_bypasses_authentication():
    payload = token()
    assert send(payload).status_code == 200
    before = state()
    assert send(payload, signature="0" * 64).status_code == 401
    altered = dict(payload, amount=250.0)
    assert send(altered, signature=sign_scoped_token(payload)).status_code == 401
    assert state() == before


def test_idempotency_key_conflict_and_header_binding():
    payload = token()
    assert send(payload, key="different-key").status_code == 400
    assert state()[1][0] == 0
    assert send(payload).status_code == 200
    other = token(idempotency_key=payload["idempotency_key"])
    response = send(other)
    assert response.status_code == 409
    assert response.json()["code"] == "IDEMPOTENCY_CONFLICT"
    assert state()[1][0] == 1


@pytest.mark.parametrize("changes,code", [
    ({"amount": 1000.01}, "BANK_LIMIT_EXCEEDED"),
    ({"fee_usd": 18.01}, "BANK_LIMIT_EXCEEDED"),
    ({"payee_id": "rogue", "payee_name": "Rogue"}, "PAYEE_NOT_ALLOWED"),
    ({"payee_name": "Not Mom"}, "PAYEE_NOT_ALLOWED"),
    ({"account_id": "different-account"}, "PAYEE_NOT_ALLOWED"),
])
def test_independent_bank_constraints(changes, code):
    before = state()
    response = send(token(**changes))
    assert response.json()["code"] == code
    assert state() == before


def test_bank_hard_cap_is_not_api_auto_approval_threshold():
    assert send(token(600.0)).status_code == 200


def test_daily_limit_and_utc_reset():
    assert send(token(600.0)).status_code == 200
    before = state()
    assert send(token(400.01)).json()["code"] == "BANK_DAILY_LIMIT_EXCEEDED"
    assert state() == before
    assert send(token(400.0)).status_code == 200
    with closing(get_connection()) as conn, conn:
        conn.execute("UPDATE ledger SET created_at = ?", (int(time.time() // 86400) * 86400 - 1,))
    assert send(token(1.0)).status_code == 200


@pytest.mark.parametrize("field,value", [
    ("amount", 201.0), ("payee_id", "p3"), ("payee_name", "Dad"),
    ("fee_usd", 1.0), ("currency", "CNY"), ("rate", 7.0), ("route_id", "fastest"),
])
def test_bank_recomputes_hash_even_with_valid_signature(field, value):
    payload = token()
    payload[field] = value
    response = send(payload)
    assert response.status_code == 401
    assert "intent hash mismatch" in response.json()["detail"]
    assert state()[1][0] == 0


@pytest.mark.parametrize("offset", [-1, 3600])
def test_expiry_and_maximum_token_lifetime(offset):
    assert send(token(expires_at=time.time() + offset)).status_code == 401
    assert state()[2] == 0


def test_expired_cached_token_is_rejected(monkeypatch):
    payload = token()
    assert send(payload).status_code == 200
    monkeypatch.setattr("backend.bank.security.time.time", lambda: payload["expires_at"] + 1)
    assert send(payload).status_code == 401


def test_failed_debit_does_not_consume_nonce_and_can_retry():
    set_balance(100)
    payload = token()
    before = state()
    assert send(payload).json()["code"] == "INSUFFICIENT_FUNDS"
    assert state() == before
    set_balance(1000)
    assert send(payload).status_code == 200


def test_signature_verification_is_pure_and_nonce_commits_with_transfer():
    payload = token()
    signature = sign_scoped_token(payload)
    assert verify_scoped_token(payload, signature) == (True, None)
    assert verify_scoped_token(payload, signature) == (True, None)
    assert state()[2] == 0
    assert send(payload).status_code == 200
    replay = token(nonce=payload["nonce"])
    response = send(replay)
    assert response.status_code == 401
    assert "already consumed" in response.json()["detail"]


def parallel_transfers(payloads):
    barrier = Barrier(len(payloads))
    def execute(payload):
        request = TransferRequest(token=payload, signature=sign_scoped_token(payload))
        barrier.wait(timeout=10)
        return main.execute_transfer(request, Request({"type": "http"}), payload["idempotency_key"])
    with ThreadPoolExecutor(max_workers=len(payloads)) as pool:
        return list(pool.map(execute, payloads))


def test_concurrent_transfers_cannot_overdraw_or_lose_debits():
    set_balance(250)
    results = parallel_transfers([token(), token()])
    assert sum(isinstance(result, dict) for result in results) == 1
    assert state() == (49.58, (1, 200.42), 1, 1)


def test_concurrent_daily_cap_is_atomic():
    results = parallel_transfers([token(600.0), token(600.0)])
    assert sum(isinstance(result, dict) for result in results) == 1
    assert state()[1:] == ((1, 600.42), 1, 1)


def test_concurrent_idempotency_is_single_debit():
    payload = token()
    results = parallel_transfers([payload] * 4)
    assert all(isinstance(result, dict) for result in results)
    assert len({result["tx_id"] for result in results}) == 1
    assert state() == (12249.58, (1, 200.42), 1, 1)


def test_concurrent_nonce_reuse_is_single_debit():
    first = token()
    second = token(nonce=first["nonce"])
    results = parallel_transfers([first, second])
    assert sum(isinstance(result, dict) for result in results) == 1
    assert state()[1:] == ((1, 200.42), 1, 1)


def test_ledger_failure_rolls_back_balance_nonce_and_cache():
    payload = token()
    before = state()
    with closing(get_connection()) as conn, conn:
        conn.execute("CREATE TRIGGER fail_ledger BEFORE INSERT ON ledger BEGIN SELECT RAISE(ABORT, 'injected ledger failure'); END")
    try:
        with pytest.raises(sqlite3.IntegrityError):
            main.execute_transfer(TransferRequest(token=payload, signature=sign_scoped_token(payload)),
                                  Request({"type": "http"}), payload["idempotency_key"])
        assert state() == before
    finally:
        with closing(get_connection()) as conn, conn:
            conn.execute("DROP TRIGGER fail_ledger")
    assert send(payload).status_code == 200


def test_startup_never_refills_existing_balance():
    set_balance(1)
    init_db()
    assert state()[0] == 1


@pytest.mark.parametrize("field,value", [("amount", "Infinity"), ("fee_usd", "NaN"),
                                          ("expires_at", "Infinity"), ("amount", 0.001)])
def test_nonfinite_and_subcent_fields_are_rejected(field, value):
    payload = token()
    payload[field] = value
    assert send(payload, signature="invalid").status_code == 422
    assert state()[2] == 0


def test_unknown_unsigned_fields_are_rejected():
    payload = token()
    signature = sign_scoped_token(payload)
    payload["ignored_authorization"] = "untrusted"
    assert send(payload, signature=signature).status_code == 422
