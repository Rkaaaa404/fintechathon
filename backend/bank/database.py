"""
Database Engine & Session Management for Bank Sandbox Service.
Powered by SQLAlchemy 2.0 with Dual-Mode Support:
- Mode 1 (Offline Demo): Local SQLite (data/bank.db)
- Mode 2 (Production Cloud): Cloud PostgreSQL via BANK_DATABASE_URL
"""

import sqlite3
import time
from typing import Generator
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker, Session

from .config import config
from .models import BankBase, Account

# ── SQLAlchemy 2.0 Engine & Session Configuration ─────────────────────────
engine_args = {}
if config.IS_SQLITE:
    engine_args["connect_args"] = {"check_same_thread": False}

engine = create_engine(config.DATABASE_URL, **engine_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """FastAPI Dependency Injection for Bank database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_connection() -> sqlite3.Connection:
    """
    Backwards compatibility connection bridge for existing bank modules.
    Ensures zero regressions for HMAC-scoped ledger operations.
    """
    conn = sqlite3.connect(str(config.DATABASE_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """
    Initialize all bank tables via SQLAlchemy 2.0 BankBase metadata
    and populate testnet student custodial account for Ayu.
    """
    # 1. Create all declarative tables
    BankBase.metadata.create_all(bind=engine)

    # 2. Seed initial account via SQLAlchemy session
    with SessionLocal() as db:
        existing_acc = db.scalar(select(Account).where(Account.account_id == "acc_student_ayu"))
        now = time.time()

        if not existing_acc:
            account = Account(
                account_id="acc_student_ayu",
                owner_name="Ayu",
                balance_usd=12450.00,
                currency="USD",
                updated_at=now,
            )
            db.add(account)
            db.commit()
        else:
            # Ensure sufficient testnet balance for repeated demo/smoke runs
            if existing_acc.balance_usd < 12450.00:
                existing_acc.balance_usd = 12450.00
                existing_acc.updated_at = now
                db.commit()


# Run schema init on startup
init_db()
