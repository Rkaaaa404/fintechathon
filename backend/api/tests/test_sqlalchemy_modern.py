import pytest
from sqlalchemy import select
from backend.api.database import SessionLocal, init_db
from backend.api.models import User, Policy, AuditChain, EvidenceShare
from backend.bank.database import SessionLocal as BankSessionLocal, init_db as init_bank_db
from backend.bank.models import Account
from backend.api.schemas import DemoLoginRequest, TuitionQuoteRequest, PolicyProposalRequest

def test_sqlalchemy_api_models():
    """Verify SQLAlchemy 2.0 ORM mappings and seed data in API Core."""
    init_db()
    with SessionLocal() as db:
        # 1. Student Ayu exists
        user = db.scalar(select(User).where(User.user_id == "usr_ayu"))
        assert user is not None
        assert user.username == "Ayu"
        assert user.role == "student"

        # 2. Policy mapped relationship
        policy = db.scalar(select(Policy).where(Policy.user_id == "usr_ayu"))
        assert policy is not None
        assert policy.single_send_cap_usd == 500.0
        assert policy.daily_cap_usd == 1000.0

        # 3. Genesis audit record
        audit = db.scalar(select(AuditChain).where(AuditChain.action == "GENESIS"))
        assert audit is not None
        assert audit.actor == "system"

        # 4. Landlord share record
        share = db.scalar(select(EvidenceShare).where(EvidenceShare.share_id == "share_landlord_a"))
        assert share is not None
        assert share.recipient == "Landlord A"
        assert share.is_revoked == 0


def test_sqlalchemy_bank_models():
    """Verify SQLAlchemy 2.0 ORM mappings and custodial account in Bank Sandbox."""
    init_bank_db()
    with BankSessionLocal() as db:
        acc = db.scalar(select(Account).where(Account.account_id == "acc_student_ayu"))
        assert acc is not None
        assert acc.owner_name == "Ayu"
        assert acc.balance_usd >= 12450.00
        assert acc.currency == "USD"


def test_pydantic_v2_schemas():
    """Verify Pydantic v2 schemas validate data and reject invalid inputs."""
    req = DemoLoginRequest(username="Ayu")
    assert req.username == "Ayu"
    assert req.model_dump() == {"username": "Ayu"}

    quote = TuitionQuoteRequest(amount_cny=18000.0, mode="cheapest")
    assert quote.amount_cny == 18000.0
    assert quote.mode == "cheapest"

    with pytest.raises(Exception):
        # Negative spending cap must fail Pydantic v2 validation (gt=0)
        PolicyProposalRequest(new_daily_cap_usd=-100.0, new_single_send_cap_usd=500.0)
