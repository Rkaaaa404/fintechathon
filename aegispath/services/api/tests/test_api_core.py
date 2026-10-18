import pytest
import time
import json
import uuid
from fastapi.testclient import TestClient
from services.api.main import app
from services.api.database import get_connection
from services.api.policy import evaluate_transfer_policy, compute_intent_hash
from services.api.audit import record_audit_event, verify_audit_chain

client = TestClient(app)

@pytest.fixture(autouse=True)
def reset_policy_state():
    conn = get_connection()
    with conn:
        conn.execute("UPDATE policy SET is_paused = 0, used_today_usd = 200.0 WHERE user_id = 'usr_ayu'")
    yield
    with conn:
        conn.execute("UPDATE policy SET is_paused = 0, used_today_usd = 200.0 WHERE user_id = 'usr_ayu'")

def test_api_health_and_ready():
    r = client.get("/v1/health")
    assert r.status_code == 200
    assert r.json()["service"] == "api"

    r_ready = client.get("/v1/ready")
    assert r_ready.status_code == 200
    assert r_ready.json()["status"] == "ready"

def test_auth_login_and_refresh():
    r = client.post("/v1/auth/demo-login", json={"username": "Ayu"})
    assert r.status_code == 200
    tokens = r.json()
    assert "access_token" in tokens
    assert "refresh_token" in tokens

    # Test refresh
    r_refresh = client.post("/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]})
    assert r_refresh.status_code == 200
    new_tokens = r_refresh.json()
    assert "access_token" in new_tokens

def test_policy_tiers():
    # 1. Tier 1: Send $200 to Mom (Known payee, <= $500)
    p1 = evaluate_transfer_policy("usr_ayu", 200.0, "Mom", "p1")
    assert p1["tier"] == "T1_AUTO_APPROVED"
    assert p1["allowed"] is True
    assert p1["requires_passkey"] is False
    assert "INTENT-SHA256" in p1["intent_hash"]

    # 2. Tier 2: Send $3,000 to new friend (New payee and > $500)
    p2 = evaluate_transfer_policy("usr_ayu", 3000.0, "Rina W")
    # Because 200 used + 3000 > 1000 daily limit, should be refused by daily cap
    assert p2["tier"] == "REFUSED"

    # 3. Tier 2: Send $600 to Mom (exceeds $500 single send, but within daily allowance if daily allowance is expanded or tested on $450)
    # Let's test $450 to new payee (within daily cap $1000, but new payee)
    p3 = evaluate_transfer_policy("usr_ayu", 450.0, "Rina W")
    assert p3["tier"] == "T2_APPROVAL_REQUIRED"
    assert p3["allowed"] is True
    assert p3["requires_passkey"] is True
    assert "recipient 'Rina W' is not on your allowed list" in p3["reason"]

def test_agent_kill_switch():
    # Pause agent
    r_pause = client.post("/v1/agent/pause")
    assert r_pause.status_code == 200
    assert r_pause.json()["is_paused"] is True

    # Policy evaluation while paused must be refused
    p_paused = evaluate_transfer_policy("usr_ayu", 100.0, "Mom", "p1")
    assert p_paused["tier"] == "REFUSED"
    assert "paused via kill switch" in p_paused["reason"]

    # Resume with passkey
    r_resume = client.post("/v1/agent/resume", json={"passkey_signature": "SIG_PASSKEY_VALID_01"})
    assert r_resume.status_code == 200
    assert r_resume.json()["is_paused"] is False

    p_resumed = evaluate_transfer_policy("usr_ayu", 100.0, "Mom", "p1")
    assert p_resumed["allowed"] is True

def test_policy_proposal_flow():
    r = client.put("/v1/policy", json={"new_daily_cap_usd": 1500.0, "new_single_send_cap_usd": 750.0})
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "PENDING_GUARDIAN_OR_DELAY"
    assert "24 hours" in data["notice"]

def test_audit_hash_chain_and_tamper_detection():
    # Verify chain is initially valid
    r_audit = client.get("/v1/audit/verify")
    assert r_audit.status_code == 200
    assert r_audit.json()["valid"] is True

    # Append test event
    h1 = record_audit_event("TEST_EVENT_A", "usr_ayu", {"test": 1})
    assert len(h1) == 64

    # Verification must remain valid
    v_res = verify_audit_chain()
    assert v_res["valid"] is True

    # Intentionally tamper with an entry in SQLite to prove tamper detection
    conn = get_connection()
    last_id = conn.execute("SELECT MAX(entry_id) as mid FROM audit_chain").fetchone()["mid"]
    try:
        with conn:
            conn.execute("UPDATE audit_chain SET action = 'TAMPERED_ACTION' WHERE entry_id = ?", (last_id,))

        # Verification must now FAIL loudly!
        tamper_res = verify_audit_chain()
        assert tamper_res["valid"] is False
        assert "mismatch" in tamper_res["reason"].lower()
    finally:
        # Restore row back to valid action to keep test suite re-runnable
        with conn:
            conn.execute("UPDATE audit_chain SET action = 'TEST_EVENT_A' WHERE entry_id = ?", (last_id,))

def test_plan_approval_intent_hash_refusal():
    plan_id = f"plan-{uuid.uuid4().hex[:8]}"
    locked_intent_hash = "INTENT-SHA256-11223344AABBCCDD"

    conn = get_connection()
    with conn:
        conn.execute(
            """
            INSERT INTO plans (plan_id, user_id, intent_hash, plan_data_json, status, created_at)
            VALUES (?, 'usr_ayu', ?, ?, 'WAITING_APPROVAL', ?)
            """,
            (
                plan_id,
                locked_intent_hash,
                json.dumps({"amount_usd": 200.0, "payee_id": "p1", "payee_name": "Mom", "fee_usd": 0.42}),
                time.time()
            )
        )

    # Attempt to approve with TAMPERED intent hash
    r_refuse = client.post(
        f"/v1/plans/{plan_id}/approve",
        json={
            "intent_hash": "INTENT-SHA256-TAMPERED-WRONG-HASH",
            "passkey_signature": "SIG_VALID_PASSKEY"
        }
    )
    assert r_refuse.status_code == 400
    assert r_refuse.json()["code"] == "INTENT_HASH_MISMATCH"
