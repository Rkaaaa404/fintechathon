import httpx
import pytest
from fastapi.testclient import TestClient

from backend.api.config import config
from backend.api.database import get_connection
from backend.api.main import app, get_current_user
from backend.bank.main import app as bank_app
from backend.bank.database import get_connection as bank_connection


@pytest.fixture
def client(monkeypatch):
    monkeypatch.setattr(config, "BANK_TRANSPORT", httpx.ASGITransport(app=bank_app))
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.pop(get_current_user, None)


def snapshot():
    with bank_connection() as conn:
        balance = conn.execute("SELECT balance_usd FROM accounts WHERE account_id = 'acc_student_ayu'").fetchone()[0]
    with get_connection() as conn:
        usage = conn.execute("SELECT used_today_usd FROM policy WHERE user_id = 'usr_ayu'").fetchone()[0]
    return balance, usage


def pending(client):
    result = client.post("/v1/agent/messages", json={"text": "Send USD 600 to Mom"})
    assert result.status_code == 200
    plan = result.json()["response"]
    assert plan["type"] == "approval_sheet"
    return plan


def approve(client, plan, intent_hash=None):
    return client.post(f"/v1/plans/{plan['plan_id']}/approve", json={
        "intent_hash": intent_hash or plan["intent_hash"], "passkey_signature": "DEMO_UI_CONSENT_ONLY"})


def test_approval_hash_owner_and_single_accounting(client):
    before = snapshot()
    plan = pending(client)
    assert snapshot() == before
    assert approve(client, plan, "INTENT-SHA256-WRONG").status_code == 400
    assert snapshot() == before
    app.dependency_overrides[get_current_user] = lambda: "another_user"
    denied = approve(client, plan)
    assert denied.status_code == 404 and denied.json()["code"] == "PLAN_NOT_FOUND"
    assert snapshot() == before
    app.dependency_overrides.pop(get_current_user)
    result = approve(client, plan)
    assert result.status_code == 200
    receipt = result.json()
    assert receipt["status"] == "COMPLETED" and receipt["payee_name"] == "Mom"
    assert snapshot() == (round(before[0] - 600.42, 2), before[1] + 600)
    ledger = TestClient(bank_app).get("/v1/bank/ledger?account_id=acc_student_ayu").json()
    assert any(entry["tx_id"] == receipt["tx_id"] for entry in ledger["entries"])
    after = snapshot()
    replay = approve(client, plan)
    assert replay.status_code == 409 and replay.json()["code"] == "PLAN_NOT_PENDING"
    assert snapshot() == after


@pytest.mark.parametrize("change", ["is_paused = 1", "used_today_usd = 900"])
def test_approval_rechecks_policy(client, change):
    plan = pending(client)
    with get_connection() as conn:
        conn.execute(f"UPDATE policy SET {change} WHERE user_id = 'usr_ayu'")
    before = snapshot()
    result = approve(client, plan)
    assert result.status_code == 409 and result.json()["code"] == "POLICY_REFUSED"
    assert snapshot() == before


@pytest.mark.parametrize("body", [{"status": "FAILED"}, {"status": "COMPLETED", "tx_id": "", "remaining_balance_usd": 1000}, {"status": "COMPLETED", "tx_id": "bad", "remaining_balance_usd": "NaN"}])
def test_approval_unconfirmed_bank_never_completes(client, monkeypatch, body):
    plan = pending(client)
    before = snapshot()
    monkeypatch.setattr(config, "BANK_TRANSPORT", httpx.MockTransport(lambda req: httpx.Response(200, json=body)))
    result = approve(client, plan)
    assert result.status_code == 502 and result.json()["code"] == "BANK_EXECUTION_FAILED"
    assert "stamp" not in result.json()
    assert snapshot() == before
    with get_connection() as conn:
        assert conn.execute("SELECT status FROM plans WHERE plan_id = ?", (plan["plan_id"],)).fetchone()[0] == "WAITING_APPROVAL"
