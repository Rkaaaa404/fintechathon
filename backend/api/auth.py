import hmac
import hashlib
import base64
import json
import time
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
    parts = token.split('.')
    if len(parts) != 3:
        return False, None, "Malformed token"
    header_b64, payload_b64, sig_b64 = parts
    signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    expected_sig = base64url_encode(hmac.new(secret.encode('utf-8'), signing_input, hashlib.sha256).digest())
    if not hmac.compare_digest(expected_sig, sig_b64):
        return False, None, "Signature mismatch"
    try:
        payload = json.loads(base64url_decode(payload_b64).decode('utf-8'))
    except Exception as e:
        return False, None, f"Failed to decode payload: {e}"

    if time.time() > payload.get("exp", 0):
        return False, None, "Token expired"

    return True, payload, None

def generate_tokens_for_user(user_id: str = "usr_ayu", username: str = "Ayu") -> Dict[str, Any]:
    now = time.time()
    access_exp = now + (config.TOKEN_EXPIRE_MINUTES * 60)
    refresh_exp = now + (config.REFRESH_TOKEN_EXPIRE_DAYS * 86400)

    access_token = sign_jwt({
        "sub": user_id,
        "username": username,
        "type": "access",
        "iat": now,
        "exp": access_exp
    })

    refresh_token = sign_jwt({
        "sub": user_id,
        "username": username,
        "type": "refresh",
        "iat": now,
        "exp": refresh_exp
    })

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "Bearer",
        "expires_in": config.TOKEN_EXPIRE_MINUTES * 60
    }
