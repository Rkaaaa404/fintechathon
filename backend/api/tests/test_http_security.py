"""Browser trust boundaries must not depend on the caller's network location."""
import pytest
from fastapi.testclient import TestClient

from backend.api.main import app as api_app
from backend.bank.main import app as bank_app
from backend.api.config import config


def test_api_cors_rejects_untrusted_origin_and_allows_pwa():
    with TestClient(api_app) as client:
        for origin, allowed in [("https://attacker.invalid", False), (config.CORS_ORIGINS[0], True)]:
            response = client.options(
                "/v1/agent/messages",
                headers={
                    "Origin": origin,
                    "Access-Control-Request-Method": "POST",
                    "Access-Control-Request-Headers": "authorization,content-type",
                },
            )
            assert response.status_code == (200 if allowed else 400)
            assert response.headers.get("access-control-allow-origin") == (origin if allowed else None)
        response = client.get("/v1/health", headers={"Origin": "https://attacker.invalid"})
        assert "access-control-allow-origin" not in response.headers


def test_bank_does_not_grant_browser_access():
    with TestClient(bank_app) as client:
        response = client.options("/v1/bank/transfer", headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        })
        assert "access-control-allow-origin" not in response.headers


@pytest.mark.parametrize("app", [api_app, bank_app])
@pytest.mark.parametrize("path", ["/v1/health", "/not-a-route"])
def test_security_headers_also_cover_error_responses(app, path):
    with TestClient(app) as client:
        response = client.get(path)
        assert response.headers["cache-control"] == "no-store"
        assert response.headers["x-content-type-options"] == "nosniff"
        assert response.headers["x-frame-options"] == "DENY"
        assert "frame-ancestors 'none'" in response.headers["content-security-policy"]
