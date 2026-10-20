import math
import os
from pathlib import Path

# Load .env if present
env_file = Path(__file__).resolve().parents[2] / ".env"
if not env_file.exists():
    env_file = Path(__file__).resolve().parents[1] / ".env"
if env_file.exists():
    try:
        with open(env_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    k = k.strip()
                    v = v.strip().strip("'\"")
                    if k and k not in os.environ:
                        os.environ[k] = v
    except OSError:
        raise RuntimeError("Unable to read root .env configuration") from None


class ApiConfig:
    PORT: int = int(os.getenv("API_PORT", "8000"))
    HOST: str = os.getenv("API_HOST", "127.0.0.1")
    DEMO_AUTH_ENABLED: bool = os.getenv("API_DEMO_AUTH_ENABLED", "false").lower() == "true"
    SECRET_KEY: str = os.getenv("API_SECRET_KEY", "")
    BANK_SECRET_KEY: str = os.getenv("BANK_SECRET_KEY", "")
    for _name, _secret in (("API_SECRET_KEY", SECRET_KEY), ("BANK_SECRET_KEY", BANK_SECRET_KEY)):
        if len(_secret) < 32 or _secret.startswith("dev_"):
            raise RuntimeError(f"{_name} must be an explicit non-development secret of at least 32 characters")
    BANK_SERVICE_URL: str = os.getenv("BANK_SERVICE_URL", "http://127.0.0.1:8100")
    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
        if origin.strip()
    ]
    if "*" in CORS_ORIGINS:
        raise RuntimeError("CORS_ORIGINS must contain explicit trusted origins")
    DATA_DIR: Path = Path(os.getenv("API_DATA_DIR", "./data"))
    DATABASE_PATH: Path = DATA_DIR / "api.db"
    
    # Dual-Mode Database URL: PostgreSQL if configured, otherwise local SQLite
    _env_db_url = os.getenv("DATABASE_URL", "").strip()
    if _env_db_url:
        DATABASE_URL: str = _env_db_url
        IS_SQLITE: bool = False
    else:
        # SQLite URL format for SQLAlchemy
        DATABASE_URL: str = f"sqlite:///{DATABASE_PATH.as_posix()}"
        IS_SQLITE: bool = True

    TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    BANK_TRANSPORT: object = None
    USE_LLM_ADAPTER: bool = os.getenv("USE_LLM_ADAPTER", "false").strip().lower() in {"true", "1", "yes"}
    _provider_env = os.getenv("LLM_PROVIDER", "").strip()
    if not _provider_env or (_provider_env == "none" and USE_LLM_ADAPTER):
        if USE_LLM_ADAPTER:
            _provider_env = "gemini" if os.getenv("GEMINI_API_KEY", "").strip() else ("groq" if os.getenv("GROQ", "").strip() else "none")
        else:
            _provider_env = "none"
    LLM_PROVIDER: str = _provider_env
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "").strip()
    GROQ: str = os.getenv("GROQ", "").strip()
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.8-flash").strip()
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b").strip()
    try:
        LLM_TIMEOUT_SECONDS: float = float(os.getenv("LLM_TIMEOUT_SECONDS", "20"))
    except ValueError:
        raise RuntimeError("Invalid LLM_TIMEOUT_SECONDS") from None
    if not math.isfinite(LLM_TIMEOUT_SECONDS) or LLM_TIMEOUT_SECONDS <= 0:
        raise RuntimeError("Invalid LLM_TIMEOUT_SECONDS")
    if LLM_PROVIDER not in {"none", "gemini", "groq"}:
        raise RuntimeError("Invalid LLM_PROVIDER")
    if LLM_PROVIDER == "gemini":
        if not GEMINI_API_KEY:
            raise RuntimeError("Missing GEMINI_API_KEY")
        if not GEMINI_MODEL:
            raise RuntimeError("Missing GEMINI_MODEL")
    if LLM_PROVIDER == "groq":
        if not GROQ:
            raise RuntimeError("Missing GROQ")
        if not GROQ_MODEL:
            raise RuntimeError("Missing GROQ_MODEL")


config = ApiConfig()
config.DATA_DIR.mkdir(parents=True, exist_ok=True)
