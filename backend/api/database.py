"""
Database Engine & Session Management for AegisPath API Core Service.
Powered by SQLAlchemy 2.0 with Dual-Mode Support:
- Mode 1 (Offline Demo): Local SQLite (data/api.db)
- Mode 2 (Production Cloud): Cloud PostgreSQL via DATABASE_URL
"""

import sqlite3
import json
import time
import hashlib
from typing import Generator
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker, Session

from .config import config
from .models import Base, User, Policy, AuditChain, EvidenceShare

# ── SQLAlchemy 2.0 Engine & Session Configuration ─────────────────────────
engine_args = {}
if config.IS_SQLITE:
    engine_args["connect_args"] = {"check_same_thread": False}

engine = create_engine(config.DATABASE_URL, **engine_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """FastAPI Dependency Injection for SQLAlchemy database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_connection() -> sqlite3.Connection:
    """
    Backwards compatibility connection bridge for existing direct query modules.
    Ensures zero regressions across policy, audit, and planner evaluations.
    """
    conn = sqlite3.connect(str(config.DATABASE_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """
    Initialize all database tables via SQLAlchemy 2.0 Base metadata
    and populate initial testnet seed records (Ayu, Policy, Genesis Audit, Evidence Share).
    """
    # 1. Create all declarative tables
    Base.metadata.create_all(bind=engine)

    # 2. Seed initial data via SQLAlchemy session
    with SessionLocal() as db:
        # Check student Ayu
        existing_user = db.scalar(select(User).where(User.user_id == "usr_ayu"))
        now = time.time()

        if not existing_user:
            # Seed User
            student = User(
                user_id="usr_ayu",
                username="Ayu",
                role="student",
                created_at=now,
            )
            db.add(student)

            # Seed Policy
            payees = [
                {"id": "p1", "name": "Mom", "relation": "Mother", "initials": "IB"},
                {"id": "p2", "name": "Campus bursar", "relation": "Tuition", "initials": "BU"},
                {"id": "p3", "name": "Dad", "relation": "Father", "initials": "BA"},
            ]
            policy = Policy(
                user_id="usr_ayu",
                single_send_cap_usd=500.0,
                daily_cap_usd=1000.0,
                used_today_usd=200.0,
                allowed_payees_json=json.dumps(payees),
                is_paused=0,
                updated_at=now,
            )
            db.add(policy)

            # Seed Genesis Audit Entry
            genesis_details = json.dumps({"event": "Genesis: AegisPath safety engine initialized"})
            genesis_hash = hashlib.sha256(f"0:{genesis_details}:{now}".encode("utf-8")).hexdigest()
            genesis_audit = AuditChain(
                action="GENESIS",
                actor="system",
                details_json=genesis_details,
                prev_hash="0" * 64,
                entry_hash=genesis_hash,
                timestamp=now,
            )
            db.add(genesis_audit)

        # Check Landlord Share
        existing_share = db.scalar(select(EvidenceShare).where(EvidenceShare.share_id == "share_landlord_a"))
        if not existing_share:
            share = EvidenceShare(
                share_id="share_landlord_a",
                user_id="usr_ayu",
                recipient="Landlord A",
                recipient_zh="房东 A",
                shared_fields="Balance & regular deposits (redacted ID & account numbers)",
                expires_at=now + 14 * 86400,
                is_revoked=0,
                created_at=now,
            )
            db.add(share)

        db.commit()


# Run schema init on startup
init_db()
