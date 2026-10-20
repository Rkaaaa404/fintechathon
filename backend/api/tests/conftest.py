import pytest
from backend.api.config import config


@pytest.fixture(autouse=True)
def default_offline_provider(monkeypatch):
    monkeypatch.setattr(config, "LLM_PROVIDER", "none")
