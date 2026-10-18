"""
Pydantic v2 Schemas for Bank Sandbox Service.
Strict typed request models for HMAC-scoped tokens and ledger transfers.
"""

from pydantic import BaseModel, Field, ConfigDict


class BankBaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class ScopedTokenPayload(BankBaseSchema):
    account_id: str = Field(default="acc_student_ayu", description="Target bank account ID")
    amount: float = Field(..., gt=0, description="Authorized debit amount in USD")
    payee_id: str = Field(..., description="Allowlisted payee identifier")
    payee_name: str = Field(..., description="Allowlisted payee display name")
    fee_usd: float = Field(default=0.42, ge=0, description="Network settlement fee in USD")
    nonce: str = Field(..., min_length=8, description="Cryptographic single-use nonce")
    expires_at: float = Field(..., description="Unix timestamp expiration of scoped token")


class TransferRequest(BankBaseSchema):
    token: ScopedTokenPayload
    signature: str = Field(..., description="HMAC-SHA256 signature issued by API Core Sentinel")
