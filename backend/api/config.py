import math
import os
from pathlib import Path

# Load .env if present
env_file = Path(__file__).resolve().parents[2] / ".env"
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
    SECRET_KEY: str = os.getenv("API_SECRET_KEY", "dev_api_secret_key_change_in_production_32chars")
    BANK_SECRET_KEY: str = os.getenv("BANK_SECRET_KEY", "dev_bank_shared_secret_key_32chars_min_safe")
    BANK_SERVICE_URL: str = os.getenv("BANK_SERVICE_URL", "http://127.0.0.1:8100")
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
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "none").strip()
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
