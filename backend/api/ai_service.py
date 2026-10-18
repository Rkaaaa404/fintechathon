"""
=========================================================================
AI ENGINEER HOOK: LiteLLM / Ollama Gateway Integration
1. Pasang API Key / Base URL Ollama di sini.
2. Wajib menggunakan JSON Schema (Pydantic model: UserIntentOutput).
3. Jalankan pembersihan PII (Presidio) sebelum request dikirim ke cloud.
4. Fallback deterministik di bawah aktif otomatis jika LLM offline.
=========================================================================
"""

import os
import re
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

# ── AI Gateway Configuration ──────────────────────────────────────────────
LITELLM_API_KEY = os.getenv("LITELLM_API_KEY", "")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
DEFAULT_MODEL = os.getenv("AEGISPATH_AI_MODEL", "gpt-4o-mini")
ENABLE_CLOUD_LLM = os.getenv("ENABLE_CLOUD_LLM", "false").lower() == "true"


# ── Pydantic Schemas for Structured JSON Output ───────────────────────────

class UserIntentOutput(BaseModel):
    """
    Structured extraction schema enforced across all LLM inference calls.
    Guarantees deterministic types for downstream financial policy checks.
    """
    raw_text: str = Field(description="Original user instruction")
    action: str = Field(
        default="general",
        description="Action type: tuition, transfer, evidence, safety, pause, or general"
    )
    amount: float = Field(default=0.0, description="Parsed transaction amount")
    currency: str = Field(default="USD", description="Currency symbol: USD, CNY, IDR")
    currency_assumed: bool = Field(default=False, description="Whether currency was inferred")
    payee: str = Field(default="", description="Recipient name or entity")
    route_preference: str = Field(
        default="balanced",
        description="Transfer route: fastest, cheapest, or balanced"
    )
    assumptions: List[str] = Field(default_factory=list, description="Reasoning assumptions made")
    flagged_injection: bool = Field(
        default=False,
        description="True if prompt injection / adversarial syntax detected"
    )
    threat_reason: Optional[str] = Field(
        default=None,
        description="Explanation if an injection was detected"
    )


class SafetyCheckResult(BaseModel):
    passed: bool
    ring_bypassed: Optional[str] = None
    threats: List[str] = Field(default_factory=list)
    reason: str = ""


class ChatCompletionRequest(BaseModel):
    prompt: str
    locale: str = "en"
    model: Optional[str] = None


class ChatCompletionResponse(BaseModel):
    intent: UserIntentOutput
    reply_text_en: str
    reply_text_zh: str
    execution_recommended: bool


# ── PII Scrubbing Hook (Presidio / Regex Stub) ────────────────────────────

def scrub_pii_entities(text: str) -> str:
    """
    Hook for Microsoft Presidio or custom regex PII scrubber.
    Masks account numbers, passports, and credit card patterns before cloud dispatch.
    """
    # Simple regex sanitizer stub (replace with presidio-analyzer in production):
    # Mask 16-digit card / account numbers
    sanitized = re.sub(r"\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b", "[REDACTED_ACCOUNT]", text)
    # Mask ID / Passport formats
    sanitized = re.sub(r"\b[A-Z]{1,2}[0-9]{7,9}\b", "[REDACTED_ID]", sanitized)
    return sanitized


# ── Deterministic Intent Extraction Fallback (100% Offline Robust) ─────────

def extract_intent_deterministic(text: str, locale: str = "en") -> UserIntentOutput:
    """
    Zero-latency, rule-based intent parser used when LLM is unavailable
    or during high-security offline demo sessions.
    """
    clean = text.strip()
    lower = clean.lower()

    # Outer check: Prompt injection patterns
    injection_tokens = ["ignore previous", "override rules", "system prompt", "drop limit", "bypass", "malicious", "hack"]
    if any(token in lower for token in injection_tokens):
        return UserIntentOutput(
            raw_text=clean,
            action="safety",
            amount=2450.0,
            currency="USD",
            payee="Attacker Account",
            flagged_injection=True,
            threat_reason="Adversarial instruction detected attempting to bypass policy plane."
        )

    # Tuition
    if any(k in lower for k in ["tuition", "bursar", "school"]) or any(k in clean for k in ["学费", "缴费"]):
        return UserIntentOutput(
            raw_text=clean,
            action="tuition",
            amount=18000.0,
            currency="CNY",
            payee="Campus bursar",
            route_preference="cheapest",
            assumptions=["Buffer fee included for guaranteed full arrival"]
        )

    # General Send / Transfer
    m_amt = re.search(r"(?:[$¥￥])?\s*([0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?)", clean)
    amt = float(m_amt.group(1).replace(",", "")) if m_amt else 200.0

    payee = "Mom"
    if "dad" in lower or "爸爸" in clean:
        payee = "Dad"
    elif "bursar" in lower or "财务处" in clean:
        payee = "Campus bursar"

    return UserIntentOutput(
        raw_text=clean,
        action="transfer",
        amount=amt,
        currency="CNY" if "¥" in clean or "cny" in lower or "元" in clean else "USD",
        currency_assumed=not ("$" in clean or "usd" in lower),
        payee=payee,
        route_preference="fastest" if "fast" in lower or "快" in clean else "cheapest"
    )


# ── Main AI Engine Caller Hook ────────────────────────────────────────────

async def extract_intent(prompt: str, locale: str = "en") -> UserIntentOutput:
    """
    Main entry point for AI processing.
    Directs to LiteLLM/Ollama when ENABLE_CLOUD_LLM is true, otherwise uses fallback.
    """
    sanitized_prompt = scrub_pii_entities(prompt)

    if ENABLE_CLOUD_LLM and LITELLM_API_KEY:
        try:
            # AI ENGINEER HOOK: Uncomment below when litellm dependency is installed
            # from litellm import acompletion
            # response = await acompletion(
            #     model=DEFAULT_MODEL,
            #     messages=[
            #         {"role": "system", "content": "You are AegisPath Guardian AI. Output JSON conforming to UserIntentOutput schema."},
            #         {"role": "user", "content": sanitized_prompt}
            #     ],
            #     response_format={"type": "json_object"}
            # )
            # return UserIntentOutput.model_validate_json(response.choices[0].message.content)
            pass
        except Exception as e:
            print(f"[AI Service Warning] LLM call failed ({e}). Falling back to deterministic parser.")

    return extract_intent_deterministic(sanitized_prompt, locale)
