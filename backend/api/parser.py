"""Explicit-field offline parser for English and Chinese single payments."""
import math
import re
from decimal import Decimal
from typing import Any
from .sentinel import scan_text_with_sentinel

ALIASES = {
    "mom": "Mom", "ibu": "Mom", "mama": "Mom", "妈妈": "Mom",
    "dad": "Dad", "ayah": "Dad", "papa": "Dad", "爸爸": "Dad",
    "campus bursar": "Campus bursar",
}
CURRENCY_PATTERNS = {
    "USD": r"\$|\bUSD\b",
    "CNY": r"[¥￥元]|\b(?:CNY|RMB)\b",
    "IDR": r"\b(?:IDR|Rp)\b",
}
NUMBER = r"[+-]?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?"


def valid_amount(value: Any) -> bool:
    return (isinstance(value, (int, float)) and not isinstance(value, bool)
            and math.isfinite(value) and value > 0
            and Decimal(str(value)) * 100 == (Decimal(str(value)) * 100).to_integral_value())


def parse_user_instruction(text: str, locale: str = "en") -> dict[str, Any]:
    clean = text.strip()
    result = dict(raw_text=clean, action="general_query", amount=None, currency=None,
                  currency_assumed=False, payee="", route_preference="balanced",
                  assumptions=[], flagged_injection=False, locale=locale)
    flagged, threats, reason = scan_text_with_sentinel(clean)
    if flagged:
        result.update(action="attack_flagged", flagged_injection=True, threats=threats, reason=reason)
        return result
    # 1. Check remaining limit / balance query (Tier 0 read-only)
    if re.search(r"\b(balance|limit|allowance|cap|saldo|sisa|kuota)\b|查余额|额度|剩余", clean, re.I):
        result["action"] = "check_balance"
        return result

    # 2. Transfer ability inquiry ("Bisa kirim uang?", "Can I still send money?", etc.)
    if re.search(r"(bisa (?:lagi )?kirim|bisa transfer|tidak bisa (?:lagi )?kirim|still (?:send|sent)|can i (?:still )?(?:send|sent)|can i transfer|还能转账|还可以转账|pengiriman)", clean, re.I):
        result["action"] = "transfer_ability_query"
        return result

    tuition = bool(re.search(r"\b(tuition|school|bursar)\b|学费|缴费", clean, re.I))
    payment = tuition or bool(re.search(r"\b(send|transfer|pay)\b|汇款|汇|转账|给", clean, re.I))
    if not payment:
        return result
    result["action"] = "tuition" if tuition else "transfer"
    amounts = re.findall(NUMBER, clean)
    if len(amounts) == 1:
        result["amount"] = float(amounts[0].replace(",", ""))
    currencies = [code for code, pattern in CURRENCY_PATTERNS.items() if re.search(pattern, clean, re.I)]
    if len(currencies) == 1:
        result["currency"] = currencies[0]
    match = re.search(r"(?:\bto\b|\bfor\b|给|收款人)\s*([A-Za-z\u4e00-\u9fff][A-Za-z0-9\u4e00-\u9fff ]*)", clean, re.I)
    if match:
        payee = re.split(r"\b(?:cheapest|fastest|balanced|route)\b|选最|路线", match.group(1), flags=re.I)[0].strip()
        # In Chinese, the recipient can precede the verb and amount.
        payee = re.split(r"汇|转账", payee)[0].strip()
        result["payee"] = ALIASES.get(payee.casefold(), payee)
    if "cheap" in clean.lower() or "便宜" in clean:
        result["route_preference"] = "cheapest"
    elif "fast" in clean.lower() or "快" in clean:
        result["route_preference"] = "fastest"
    if not valid_amount(result["amount"]) or not result["currency"] or not result["payee"]:
        result["action"] = "clarification"
    return result
