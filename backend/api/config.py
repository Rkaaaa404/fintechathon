import os
from pathlib import Path

class ApiConfig:
    PORT: int = int(os.getenv("API_PORT", "8000"))
    HOST: str = os.getenv("API_HOST", "127.0.0.1")
    SECRET_KEY: str = os.getenv("API_SECRET_KEY", "dev_api_secret_key_change_in_production_32chars")
    BANK_SECRET_KEY: str = os.getenv("BANK_SECRET_KEY", "dev_bank_shared_secret_key_32chars_min_safe")
    BANK_SERVICE_URL: str = os.getenv("BANK_SERVICE_URL", "http://127.0.0.1:8100")
    DATA_DIR: Path = Path(os.getenv("API_DATA_DIR", "./data"))
    DATABASE_PATH: Path = DATA_DIR / "api.db"
    TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    BANK_TRANSPORT: object = None

config = ApiConfig()
config.DATA_DIR.mkdir(parents=True, exist_ok=True)
