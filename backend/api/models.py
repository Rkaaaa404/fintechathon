"""
SQLAlchemy 2.0 Declarative Models for AegisPath API Core Service.
Compatible with SQLite (local demo) and PostgreSQL (cloud production).
"""

from typing import Optional
from sqlalchemy import (
    String,
    Float,
    Integer,
    Text,
    ForeignKey,
)
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
    relationship,
)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    user_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    username: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    role: Mapped[str] = mapped_column(String(32), default="student", nullable=False)
    created_at: Mapped[float] = mapped_column(Float, nullable=False)

    policy: Mapped[Optional["Policy"]] = relationship("Policy", back_populates="user", uselist=False)


class Policy(Base):
    __tablename__ = "policy"

    user_id: Mapped[str] = mapped_column(String(64), ForeignKey("users.user_id"), primary_key=True)
    single_send_cap_usd: Mapped[float] = mapped_column(Float, default=500.0, nullable=False)
    daily_cap_usd: Mapped[float] = mapped_column(Float, default=1000.0, nullable=False)
    used_today_usd: Mapped[float] = mapped_column(Float, default=200.0, nullable=False)
    allowed_payees_json: Mapped[str] = mapped_column(Text, nullable=False)
    is_paused: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    updated_at: Mapped[float] = mapped_column(Float, nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="policy")


class PolicyProposal(Base):
    __tablename__ = "policy_proposals"

    proposal_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), nullable=False)
    new_single_send_cap_usd: Mapped[float] = mapped_column(Float, nullable=False)
    new_daily_cap_usd: Mapped[float] = mapped_column(Float, nullable=False)
    effective_at: Mapped[float] = mapped_column(Float, nullable=False)
    guardian_required: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="PENDING", nullable=False)
    created_at: Mapped[float] = mapped_column(Float, nullable=False)


class AuditChain(Base):
    __tablename__ = "audit_chain"

    entry_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    action: Mapped[str] = mapped_column(String(64), nullable=False)
    actor: Mapped[str] = mapped_column(String(64), nullable=False)
    details_json: Mapped[str] = mapped_column(Text, nullable=False)
    prev_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    entry_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    timestamp: Mapped[float] = mapped_column(Float, nullable=False)


class Plan(Base):
    __tablename__ = "plans"

    plan_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), nullable=False)
    intent_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    plan_data_json: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="WAITING_APPROVAL", nullable=False)
    created_at: Mapped[float] = mapped_column(Float, nullable=False)


class EvidenceShare(Base):
    __tablename__ = "evidence_shares"

    share_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), nullable=False)
    recipient: Mapped[str] = mapped_column(String(128), nullable=False)
    recipient_zh: Mapped[str] = mapped_column(String(128), nullable=False)
    shared_fields: Mapped[str] = mapped_column(Text, nullable=False)
    expires_at: Mapped[float] = mapped_column(Float, nullable=False)
    is_revoked: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[float] = mapped_column(Float, nullable=False)


class RevokedToken(Base):
    __tablename__ = "revoked_tokens"

    token_hash: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), nullable=False)
    revoked_at: Mapped[float] = mapped_column(Float, nullable=False)
