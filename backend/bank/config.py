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


class BankConfig:
    PORT: int = int(os.getenv("BANK_PORT", "8100"))
    HOST: str = os.getenv("BANK_HOST", "127.0.0.1")
    SECRET_KEY: str = os.getenv("BANK_SECRET_KEY", "dev_bank_shared_secret_key_32chars_min_safe")
    DATA_DIR: Path = Path(os.getenv("BANK_DATA_DIR", "./data"))
    DATABASE_PATH: Path = DATA_DIR / "bank.db"
    
    # Dual-Mode Database URL for Bank Sandbox
    _env_db_url = os.getenv("BANK_DATABASE_URL", "").strip()
    if _env_db_url:
        DATABASE_URL: str = _env_db_url
        IS_SQLITE: bool = False
    else:
        DATABASE_URL: str = f"sqlite:///{DATABASE_PATH.as_posix()}"
        IS_SQLITE: bool = True

    SINGLE_SEND_CAP_USD: float = 500.0
    DAILY_CAP_USD: float = 1000.0


config = BankConfig()
config.DATA_DIR.mkdir(parents=True, exist_ok=True)
