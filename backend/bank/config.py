import os
from pathlib import Path

class BankConfig:
    PORT: int = int(os.getenv("BANK_PORT", "8100"))
    HOST: str = os.getenv("BANK_HOST", "127.0.0.1")
    SECRET_KEY: str = os.getenv("BANK_SECRET_KEY", "dev_bank_shared_secret_key_32chars_min_safe")
    DATA_DIR: Path = Path(os.getenv("BANK_DATA_DIR", "./data"))
    DATABASE_PATH: Path = DATA_DIR / "bank.db"
    SINGLE_SEND_CAP_USD: float = 500.0
    DAILY_CAP_USD: float = 1000.0

config = BankConfig()
config.DATA_DIR.mkdir(parents=True, exist_ok=True)
