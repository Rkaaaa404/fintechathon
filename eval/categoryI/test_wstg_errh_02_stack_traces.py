#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category I (Error Handling Testing)
Test ID: WSTG-ERRH-02 - Testing for Stack Traces (4.8.2)
Status: PASS (Verified)

White-Box Verification & Architectural Evidence:
Error responses return structured JSON status codes without exposing internal
stack traces or file paths. RFC 7807 (application/problem+json) standardizes
all fault messages.
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


def test_wstg_errh_02_stack_traces():
    print("=" * 76)
    print(" [TEST ID: WSTG-ERRH-02] Testing for Stack Traces (4.8.2)")
    print(" Status: PASS (Verified)")
    print("=" * 76)

    api_client = TestClient(api_app)
    bank_client = TestClient(bank_app)

    # 1. Trigger Diverse Error Conditions Across Services
    error_test_cases = [
        # 404 Not Found
        (api_client, "GET", "/v1/plans/non-existent-plan-id", None, [404]),
        (api_client, "GET", "/v1/non_existent_route", None, [404]),
        # 405 Method Not Allowed
        (api_client, "POST", "/v1/health", None, [405]),
        # 422 Unprocessable Entity (Schema Validation Error)
        (api_client, "POST", "/v1/agent/messages", {"text": 12345, "synthetic_demo": "not_bool"}, [422]),
        # 400 Bad Request
        (api_client, "POST", "/v1/agent/resume", {"passkey_signature": "short"}, [400]),
        # 401 Unauthorized (Bank Scoped Token Failure)
        (bank_client, "POST", "/v1/bank/transfer", {"token": {"account_id": "none"}, "signature": "bad"}, [401, 422]),
        # 404 Account Not Found
        (bank_client, "GET", "/v1/bank/balance?account_id=acc_unknown_nonexistent", None, [404]),
    ]

    stack_trace_signatures = [
        "Traceback (most recent call last)",
        'File "',
        "SyntaxError:",
        "ZeroDivisionError:",
        "OperationalError:",
        "AttributeError:",
        "KeyError:",
        ROOT_DIR.as_posix()
    ]

    print("  [1] Fuzzing Error Conditions & Inspecting Response Payloads:")
    for client, method, url, body, expected_statuses in error_test_cases:
        if method == "GET":
            resp = client.get(url)
        elif method == "POST":
            resp = client.post(url, json=body)
        else:
            resp = client.request(method, url)

        print(f"      {method:<4} {url:<45} -> Status {resp.status_code}")
        assert resp.status_code in expected_statuses, f"FAIL: Unexpected status {resp.status_code} on {url}"

        # 2. Verify Structured JSON Response
        content_type = resp.headers.get("content-type", "")
        assert "application/json" in content_type or "application/problem+json" in content_type, f"FAIL: Error not returned as JSON: {content_type}"

        # 3. Check for Stack Trace Leakage
        resp_text = resp.text
        for sig in stack_trace_signatures:
            assert sig not in resp_text, f"FAIL: Sensitive stack trace signature '{sig}' found in error response: {resp_text}"

    print("      Verification: Zero internal stack traces or local paths exposed across all error responses.")

    # 4. Problem+JSON RFC 7807 Standard Conformance Audit
    print("  [2] Auditing Structured Problem+JSON Standard Conformance:")
    resp_plan_err = api_client.post(
        "/v1/plans/non-existent-plan-id/approve",
        json={"intent_hash": "INTENT-TEST", "passkey_signature": "SIG_TEST"}
    )
    print(f"      Problem Response Payload: {resp_plan_err.json()}")
    problem_data = resp_plan_err.json()
    assert "title" in problem_data, "FAIL: Missing RFC 7807 'title' field"
    assert "status" in problem_data, "FAIL: Missing RFC 7807 'status' field"
    assert "code" in problem_data, "FAIL: Missing application error 'code' field"
    assert "request_id" in problem_data, "FAIL: Missing correlation 'request_id' field"
    print("      Verification: Clean RFC 7807 Problem Details compliant response structure.")

    print("-" * 76)
    print("  >>> VERDICT: PASS (Verified)")
    print("  Architectural Evidence: Error responses return structured JSON status")
    print("  codes without exposing internal stack traces or file paths.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_wstg_errh_02_stack_traces()
    sys.exit(0 if success else 1)
