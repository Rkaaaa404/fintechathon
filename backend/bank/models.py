"""
SQLAlchemy 2.0 Declarative Models for Bank Sandbox Service.
Independent ledger, custodial balance, idempotency, and nonce tables.
"""

from typing import Optional
from sqlalchemy import (
    String,
    Float,
    Text,
    ForeignKey,
)
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
    relationship,
)


class BankBase(DeclarativeBase):
    pass


class Account(BankBase):
    __tablename__ = "accounts"

    account_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    owner_name: Mapped[str] = mapped_column(String(128), nullable=False)
    balance_usd: Mapped[float] = mapped_column(Float, nullable=False)
    currency: Mapped[str] = mapped_column(String(8), default="USD", nullable=False)
    updated_at: Mapped[float] = mapped_column(Float, nullable=False)

    ledger_entries: Mapped[list["LedgerEntry"]] = relationship("LedgerEntry", back_populates="account")


class LedgerEntry(BankBase):
    __tablename__ = "ledger"

    tx_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    account_id: Mapped[str] = mapped_column(String(64), ForeignKey("accounts.account_id"), nullable=False)
    payee_id: Mapped[str] = mapped_column(String(64), nullable=False)
    payee_name: Mapped[str] = mapped_column(String(128), nullable=False)
    amount_usd: Mapped[float] = mapped_column(Float, nullable=False)
    fee_usd: Mapped[float] = mapped_column(Float, nullable=False)
    direction: Mapped[str] = mapped_column(String(16), nullable=False) # DEBIT / CREDIT
    status: Mapped[str] = mapped_column(String(16), nullable=False)    # COMPLETED / BLOCKED
    idempotency_key: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    scoped_token_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    created_at: Mapped[float] = mapped_column(Float, nullable=False)

    account: Mapped["Account"] = relationship("Account", back_populates="ledger_entries")


class IdempotencyRecord(BankBase):
    __tablename__ = "idempotency_records"

    idempotency_key: Mapped[str] = mapped_column(String(128), primary_key=True)
    response_json: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[float] = mapped_column(Float, nullable=False)


class UsedNonce(BankBase):
    __tablename__ = "used_nonces"

    nonce: Mapped[str] = mapped_column(String(128), primary_key=True)
    used_at: Mapped[float] = mapped_column(Float, nullable=False)
