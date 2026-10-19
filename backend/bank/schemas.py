"""
Pydantic v2 Schemas for Bank Sandbox Service.
Strict typed request models for HMAC-scoped tokens and ledger transfers.
"""

from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict, field_validator


class BankBaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True, extra="forbid", allow_inf_nan=False)


class ScopedTokenPayload(BankBaseSchema):
    account_id: str = Field(..., min_length=1, max_length=64)
    amount: float = Field(..., gt=0, description="Authorized principal amount in USD")
    payee_id: str = Field(..., min_length=1, max_length=64)
    payee_name: str = Field(..., min_length=1, max_length=128)
    fee_usd: float = Field(..., ge=0)
    nonce: str = Field(..., min_length=8, max_length=128)
    expires_at: float
    intent_hash: str = Field(..., min_length=1, max_length=128)
    idempotency_key: str = Field(..., min_length=1, max_length=128)
    currency: str = Field(..., min_length=3, max_length=3)
    rate: float = Field(..., gt=0)
    route_id: str = Field(..., min_length=1, max_length=64)

    @field_validator("amount", "fee_usd")
    @classmethod
    def whole_cents(cls, value: float) -> float:
        cents = Decimal(str(value)) * 100
        if cents != cents.to_integral_value():
            raise ValueError("Money must be specified in whole cents")
        return value


class TransferRequest(BankBaseSchema):
    token: ScopedTokenPayload
    signature: str = Field(..., min_length=1, max_length=128, description="HMAC-SHA256 signature issued by API Core Sentinel")
