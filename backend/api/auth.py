import hmac
import hashlib
import base64
import json
import time
import math
from typing import Dict, Any, Optional, Tuple
from .config import config

def base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode('utf-8').rstrip('=')

def base64url_decode(s: str) -> bytes:
    padding = '=' * (4 - (len(s) % 4)) if len(s) % 4 != 0 else ''
    return base64.urlsafe_b64decode(s + padding)

def sign_jwt(payload: Dict[str, Any], secret: str = config.SECRET_KEY) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    header_b64 = base64url_encode(json.dumps(header, separators=(',', ':')).encode('utf-8'))
    payload_b64 = base64url_encode(json.dumps(payload, separators=(',', ':')).encode('utf-8'))
    signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    sig = hmac.new(secret.encode('utf-8'), signing_input, hashlib.sha256).digest()
    sig_b64 = base64url_encode(sig)
    return f"{header_b64}.{payload_b64}.{sig_b64}"

def verify_jwt(token: str, secret: str = config.SECRET_KEY) -> Tuple[bool, Optional[Dict[str, Any]], Optional[str]]:
    try:
        header_b64, payload_b64, sig_b64 = token.split(".")
        signing_input = f"{header_b64}.{payload_b64}".encode("ascii")
        expected_sig = base64url_encode(hmac.new(secret.encode("utf-8"), signing_input, hashlib.sha256).digest())
        if not hmac.compare_digest(expected_sig, sig_b64):
            return False, None, "Signature mismatch"
        header = json.loads(base64url_decode(header_b64))
        payload = json.loads(base64url_decode(payload_b64))
        if header != {"alg": "HS256", "typ": "JWT"} or not isinstance(payload, dict):
            return False, None, "Invalid token structure"
        exp = payload.get("exp")
        if isinstance(exp, bool) or not isinstance(exp, (int, float)) or not math.isfinite(exp) or exp <= time.time():
            return False, None, "Invalid token expiry"
        if payload.get("sub") != "usr_ayu" or payload.get("aud") != "aegispath-synthetic-demo":
            return False, None, "Invalid demo identity"
        if payload.get("type") not in {"access", "refresh"}:
            return False, None, "Invalid token type"
    except (ValueError, TypeError, UnicodeError):
        return False, None, "Malformed token"
    return True, payload, None

def generate_tokens_for_user(user_id: str = "usr_ayu", username: str = "Ayu") -> Dict[str, Any]:
    now = time.time()
    access_exp = now + (config.TOKEN_EXPIRE_MINUTES * 60)
    refresh_exp = now + (config.REFRESH_TOKEN_EXPIRE_DAYS * 86400)

    access_token = sign_jwt({
        "sub": user_id,
        "username": username,
        "type": "access",
        "aud": "aegispath-synthetic-demo",
        "iat": now,
        "exp": access_exp
    })

    refresh_token = sign_jwt({
        "sub": user_id,
        "username": username,
        "type": "refresh",
        "aud": "aegispath-synthetic-demo",
        "iat": now,
        "exp": refresh_exp
    })

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "Bearer",
        "expires_in": config.TOKEN_EXPIRE_MINUTES * 60,
        "simulated": True,
        "notice": "Synthetic shared demo identity only; not production authentication.",
    }
