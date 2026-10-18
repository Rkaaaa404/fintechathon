import os
from pathlib import Path

# Load .env if present
env_file = Path(__file__).resolve().parent.parent / ".env"
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
    except Exception:
        pass


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


config = ApiConfig()
config.DATA_DIR.mkdir(parents=True, exist_ok=True)
