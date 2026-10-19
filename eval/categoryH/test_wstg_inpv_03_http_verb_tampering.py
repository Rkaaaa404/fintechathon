#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category H (Input Validation Testing)
Test ID: WSTG-INPV-03 - Testing for HTTP Verb Tampering (4.7.3)
Status: PASS (Verified)

White-Box Verification & Architectural Evidence:
Router definitions enforce explicit HTTP method bindings per endpoint.
Unregistered or tampered HTTP verbs are rejected with HTTP 405 Method Not Allowed.
"""
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT_DIR))

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

import warnings
warnings.filterwarnings("ignore")

from fastapi.testclient import TestClient
from backend.api.main import app as api_app
from backend.bank.main import app as bank_app


def test_wstg_inpv_03_http_verb_tampering():
    print("=" * 76)
    print(" [TEST ID: WSTG-INPV-03] Testing for HTTP Verb Tampering (4.7.3)")
    print(" Status: PASS (Verified)")
    print("=" * 76)

    api_client = TestClient(api_app)
    bank_client = TestClient(bank_app)

    # 1. Test Inappropriate HTTP Verbs Against POST Endpoints
    print("  [1] Tampering HTTP Verbs on State-Changing POST Endpoints:")
    post_targets = [
        (api_client, "/v1/plans/sample-plan-id/approve"),
        (api_client, "/v1/agent/pause"),
        (bank_client, "/v1/bank/transfer"),
    ]

    tampered_verbs = ["GET", "PUT", "PATCH", "DELETE", "HEAD"]
    for client, endpoint in post_targets:
        for verb in tampered_verbs:
            resp = client.request(verb, endpoint)
            # FastAPI rejects undefined verbs with 405 Method Not Allowed
            print(f"      {verb:<6} {endpoint:<38} -> Status {resp.status_code}")
            assert resp.status_code == 405, f"FAIL: Verb {verb} was not rejected with 405 on {endpoint}: {resp.status_code}"

    # 2. Test Inappropriate HTTP Verbs Against GET Endpoints
    print("  [2] Tampering HTTP Verbs on Read-Only GET Endpoints:")
    get_targets = [
        (api_client, "/v1/health"),
        (api_client, "/v1/policy"),
        (bank_client, "/v1/bank/balance"),
    ]

    for client, endpoint in get_targets:
        resp_post = client.post(endpoint)
        resp_delete = client.delete(endpoint)
        print(f"      POST   {endpoint:<38} -> Status {resp_post.status_code}")
        print(f"      DELETE {endpoint:<38} -> Status {resp_delete.status_code}")
        assert resp_post.status_code == 405
        assert resp_delete.status_code == 405

    print("-" * 76)
    print("  >>> VERDICT: PASS (Verified)")
    print("  Architectural Evidence: Router definitions enforce explicit HTTP method")
    print("  bindings per endpoint.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_inpv_03_http_verb_tampering()
    sys.exit(0 if success else 1)
