"""Never run backend tests against operator/demo databases."""
import os
import sys
from pathlib import Path
from tempfile import TemporaryDirectory

try:
    import pytest  # type: ignore[import-not-found, import-untyped]
except ImportError:  # pragma: no cover
    class _DummyPytest:
        @staticmethod
        def fixture(*args, **kwargs):
            def decorator(func):
                return func
            return decorator

    pytest = _DummyPytest()  # type: ignore[assignment]

ROOT_DIR = Path(__file__).resolve().parent
REPO_DIR = ROOT_DIR.parent
for p in [str(REPO_DIR), str(ROOT_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

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
    try:
        from backend.api.database import get_connection as api_connection
        from backend.bank.database import get_connection as bank_connection
    except ImportError:
        from api.database import get_connection as api_connection
        from bank.database import get_connection as bank_connection
    with api_connection() as conn:
        conn.execute("UPDATE policy SET is_paused = 0, used_today_usd = 200, daily_cap_usd = 1000, single_send_cap_usd = 500 WHERE user_id = 'usr_ayu'")
    with bank_connection() as conn:
        conn.execute("UPDATE accounts SET balance_usd = 12450 WHERE account_id = 'acc_student_ayu'")
    yield


def pytest_unconfigure(config):
    _test_data.cleanup()
