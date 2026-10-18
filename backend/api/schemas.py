"""
Pydantic v2 Schemas for AegisPath API Core Service.
Strict typed request & response models conforming to OpenAPI 3.1 & Pydantic 2.x standards.
"""

from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict


class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class DemoLoginRequest(BaseSchema):
    username: str = Field(default="Ayu", description="Demo student username")


class TokenRefreshRequest(BaseSchema):
    refresh_token: str = Field(..., description="JWT Refresh Token")


class PolicyProposalRequest(BaseSchema):
    new_daily_cap_usd: float = Field(..., gt=0, description="New proposed daily spending cap in USD")
    new_single_send_cap_usd: float = Field(..., gt=0, description="New proposed single-send cap in USD")


class ApprovePlanRequest(BaseSchema):
    intent_hash: str = Field(..., min_length=10, description="Cryptographic intent hash bound to user approval")
    passkey_signature: str = Field(..., description="WebAuthn / Passkey cryptographic signature")


class ResumeAgentRequest(BaseSchema):
    passkey_signature: str = Field(..., description="WebAuthn / Passkey signature to resume paused agent")


class AgentMessageRequest(BaseSchema):
    text: str = Field(..., min_length=1, description="Natural language prompt for financial agent")
    locale: str = Field(default="en", description="Target locale: 'en' or 'zh'")


class TuitionQuoteRequest(BaseSchema):
    amount_cny: float = Field(default=18000.0, gt=0, description="Tuition fee amount in CNY")
    mode: str = Field(default="cheapest", description="Routing mode: 'fastest', 'cheapest', or 'balanced'")


class AttackReplayRequest(BaseSchema):
    case_id: str = Field(default="invoice_hidden_instruction_01", description="Simulated attack scenario identifier")
    disabled_layers: List[str] = Field(default_factory=list, description="List of defensive rings to simulate bypass on")


class EvidenceShareRequest(BaseSchema):
    recipient: str = Field(default="Landlord A", description="Verified party requesting funds evidence")
    days: int = Field(default=14, ge=1, le=90, description="Link validity period in days")


class HealthResponse(BaseSchema):
    status: str
    service: str
    version: str
    network: str
    simulated: bool
    request_id: Optional[str] = None
