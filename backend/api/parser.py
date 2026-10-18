import re
from typing import Dict, Any, List, Optional
from .sentinel import scan_text_with_sentinel

def parse_user_instruction(text: str, locale: str = "en") -> Dict[str, Any]:
    """
    Deterministic rules parser supporting English and Chinese.
    Extracts action, amount, currency, payee, route preference, and assumptions.
    """
    clean = text.strip()
    result = {
        "raw_text": clean,
        "action": "unknown",
        "amount": 0.0,
        "currency": "USD",
        "currency_assumed": False,
        "payee": "",
        "route_preference": "balanced",
        "assumptions": [],
        "flagged_injection": False
    }

    # Outer Ring: Check for prompt injection via Sentinel
    is_flagged, threats, reason = scan_text_with_sentinel(clean)
    if is_flagged:
        result["flagged_injection"] = True
        result["action"] = "attack_flagged"
        result["threats"] = threats
        result["reason"] = reason
        return result

    # 1. Tuition Intent
    if re.search(r"\b(tuition|school|bursar|学费|缴纳学费)\b", clean, re.IGNORECASE):
        result["action"] = "tuition"
        result["payee"] = "Campus bursar"
        # Search for amount in CNY or USD
        m_cny = re.search(r"[¥￥]?\s*([0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?)\s*(CNY|元|cny|RMB)?", clean)
        if m_cny and m_cny.group(1):
            val_str = m_cny.group(1).replace(",", "")
            result["amount"] = float(val_str)
            if "元" in clean or "cny" in clean.lower() or "¥" in clean or "￥" in clean or result["amount"] > 1000:
                result["currency"] = "CNY"
            else:
                result["currency"] = "USD"
        else:
            result["amount"] = 18000.0
            result["currency"] = "CNY"
        return result

    # 2. General Transfer Intent
    # Patterns: "Send $200 to Mom", "汇款 3000 给 Rina W", "给妈妈汇 $200"
    m_send = re.search(r"(?:send|transfer|pay|汇款|汇|转账|给)\s*(?:[$¥￥])?\s*([0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?)", clean, re.IGNORECASE)
    if m_send and m_send.group(1):
        result["action"] = "transfer"
        result["amount"] = float(m_send.group(1).replace(",", ""))

        # Check currency
        if "$" in clean or "usd" in clean.lower():
            result["currency"] = "USD"
        elif "¥" in clean or "￥" in clean or "cny" in clean.lower() or "元" in clean:
            result["currency"] = "CNY"
        else:
            # Currency assumed USD
            result["currency"] = "USD"
            result["currency_assumed"] = True
            result["assumptions"].append("Currency assumed USD (no currency symbol provided)")

        # Extract payee
        m_to = re.search(r"(?:to|for|给|收款人)\s+([A-Za-z0-9\u4e00-\u9fa5\s]+)", clean, re.IGNORECASE)
        if m_to:
            raw_payee = m_to.group(1).strip()
            # Clean common trailing route preferences
            raw_payee = re.split(r"(?:,|，|\bcheapest\b|\bfastest\b|\b选最\b|\b路线\b)", raw_payee, flags=re.IGNORECASE)[0].strip()
            if raw_payee in ["妈妈", "Ibu"]:
                result["payee"] = "Mom"
            elif raw_payee in ["爸爸", "Ayah"]:
                result["payee"] = "Dad"
            else:
                result["payee"] = raw_payee
        elif "妈妈" in clean or "mom" in clean.lower():
            result["payee"] = "Mom"
        elif "爸爸" in clean or "dad" in clean.lower():
            result["payee"] = "Dad"

        # Route preference
        if "cheap" in clean.lower() or "便宜" in clean:
            result["route_preference"] = "cheapest"
        elif "fast" in clean.lower() or "快" in clean:
            result["route_preference"] = "fastest"

        return result

    # Default fallback
    result["action"] = "general_query"
    return result
