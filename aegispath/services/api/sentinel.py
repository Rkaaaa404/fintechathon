"""
AegisPath Outer Ring: Privacy Filter & Security Sentinel
Detects prompt injections, indirect invoice injections, PII exfiltration,
unauthorized tool misuse, and social engineering attempts before LLM processing.
"""
import re
from typing import Dict, Any, List, Tuple

# Comprehensive regex patterns for Outer Ring Sentinel
SENTINEL_PATTERNS = [
    # 1. Direct injection & overrides
    (r"ignore\s+(previous|all|the|prior|before)?\s*(rules|instructions|constraints|policies|guidelines|security)?", "direct_injection"),
    (r"disregard\s+(all|prior|previous)\s+(rules|guidelines|instructions|policy)", "direct_injection"),
    (r"system\s*:\s*(override|bypass|admin|eval|discard|reset)", "direct_injection"),
    (r"bypass\s+(safety|security|policy|limit|rules|spending|filter)", "direct_injection"),
    (r"(忽略|忽视|重置)(之前|所有|此前)?\s*(规则|指令|限制|安全|风控|约束)?", "direct_injection"),
    (r"绕过(安全|限制|规则|风控|过滤)", "direct_injection"),
    (r"admin\s+mode|root\s+access|developer\s+mode|root\s+mode", "direct_injection"),

    # 2. Indirect invoice injection & bracketed instructions
    (r"\[.*?(payment note|system prompt|hidden instruction|note for ai|prompt injection|instruction|ai override|hidden rule|系统提示|隐藏指令).*?\]", "indirect_injection"),
    (r"(invoice|memo|note|附言|发票)\s*[:：].*?(ignore|forward|drain|override|忽视|忽略|划转|转出|代收)", "indirect_injection"),

    # 3. Exfiltration & PII dumping
    (r"(dump|exfiltrate|reveal|leak|print|display|export|show).*?(pii|credential|key|secret|passport|statement|tax\s+id|account\s+number|unmasked|salt|private|lease|token)", "privacy_exfiltration"),
    (r"(导出|泄露|显示|打印|外发|查询).*?(未脱敏|护照|身份证|银行流水|凭单|密码|密钥|账号|hmac)", "privacy_exfiltration"),
    (r"\bpassport\b.*?\b[A-Z0-9]{7,10}\b", "privacy_exfiltration"),

    # 4. Tool misuse, SQL, & code execution
    (r"(services\.bank|execute_ledger|eval\(|import\s+os|system\(|drop\s+table|update\s+accounts|curl\s+http|sqlite3|bash\s+-c)", "tool_misuse"),
    (r"(直接调用|底层数据库|免密扣款|内部反射)", "tool_misuse"),

    # 5. Full balance drain
    (r"send\s+(the\s+)?full\s+balance", "balance_drain"),
    (r"drain\s+(the\s+)?(account|wallet|funds|checking)", "balance_drain"),
    (r"(转出|汇出|清空)(所有|全部)?\s*(账户)?\s*余额", "balance_drain"),

    # 6. Social engineering / Urgency coercion
    (r"(expelled|deportation|arrest|urgent|stranded|emergency|bail|police|threat).*?(send|transfer|wire|pay|bypass|立即|汇款|转账|开除|电汇|保释|核查)", "social_engineering"),
    (r"(紧急通知|开除学籍|紧急遣返|领事馆).*?(立即|电汇|汇款|转入|滞纳金)", "social_engineering"),

    # 7. Money mule patterns
    (r"(money\s+mule|receive.*?forward.*?keep|part-time.*?forward\s+crypto|rent\s+out.*?bank\s+account|deposit\s+check.*?send\s+immediate)", "mule_recruitment"),
    (r"(兼职刷单|代收代付|接收公账.*?转交|高薪刷单)", "mule_recruitment"),

    # 8. Multilingual obfuscation & Leetspeak
    (r"(1gn0r|byp4ss|sw4p|dr4in|tr4nsf3r|0x[0-9a-fA-F]+|0xHacker|0x3v1l|hu\s+lue|Qing\s+hu\s+lue|---BEGIN|---END|zero-width|nested\s+translation|encoded\s+payload|base64|hex\s+prompt)", "obfuscated_injection")
]

def scan_text_with_sentinel(text: str) -> Tuple[bool, List[str], str]:
    """
    Scans input text for injection and security threats.
    Returns: (is_flagged, threat_categories, reason)
    """
    if not text:
        return False, [], "Clean text"

    clean = text.strip()
    threats = []

    for pattern, cat in SENTINEL_PATTERNS:
        if re.search(pattern, clean, re.IGNORECASE):
            threats.append(cat)

    if threats:
        primary_threat = threats[0]
        return True, threats, f"Outer Ring Sentinel flagged threat: {primary_threat}"

    return False, [], "Clean text passed Outer Ring Sentinel"
