"""Never run backend tests against operator/demo databases."""
import os
from pathlib import Path
from tempfile import TemporaryDirectory

import pytest

_test_data = TemporaryDirectory(prefix="aegis-tests-", ignore_cleanup_errors=True)
_db_root = Path(_test_data.name).as_posix()
os.environ.update(
    API_DATA_DIR=_test_data.name,
    BANK_DATA_DIR=_test_data.name,
    DATABASE_URL=f"sqlite:///{_db_root}/api.db",
    BANK_DATABASE_URL=f"sqlite:///{_db_root}/bank.db",
    LLM_PROVIDER="none",
)


@pytest.fixture(autouse=True)
def reset_sandbox_state():
    from backend.api.database import get_connection as api_connection
    from backend.bank.database import get_connection as bank_connection
    with api_connection() as conn:
        conn.execute("UPDATE policy SET is_paused = 0, used_today_usd = 200, daily_cap_usd = 1000, single_send_cap_usd = 500 WHERE user_id = 'usr_ayu'")
    with bank_connection() as conn:
        conn.execute("UPDATE accounts SET balance_usd = 12450 WHERE account_id = 'acc_student_ayu'")
    yield


def pytest_unconfigure(config):
    _test_data.cleanup()
