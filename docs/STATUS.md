# AegisPath Feature Status Inventory

This document tracks **REAL vs SIMULATED** implementations and explicitly documents what is NOT built, maintaining absolute transparency for judges and auditors.

## Safety & Core Enforcement

| Feature | Status | Implementation Details |
| :--- | :--- | :--- |
| **Privacy Filter (Outer Ring)** | REAL | Deterministic keyword and hidden instruction detector for prompts & invoice files. |
| **Spending Rules (Middle Ring)** | REAL | Python policy engine enforcing T0-T3 tiers, daily cap, and intent hash match. |
| **Bank Limit (Inner Ring)** | REAL | Independent FastAPI banking daemon validating HMAC scoped tokens and enforcing per-tx limit. |
| **Simulated Funds & Ledger** | REAL | SQLite database recording deterministic credit/debit transactions with testnet tags. |
| **Intent Hash Cryptography** | REAL | SHA-256 hash chaining tying user approval payload to the final transaction params. |
| **Audit Hash Chain** | REAL | Append-only SHA-256 Merkle-like chain verifying complete tamper resistance. |
| **Attack Suite Benchmark** | REAL | 12 attack families x 10 variants (120 test cases) with Wilson 95% confidence intervals. |

## Implementation Phases Status

| Phase | Description | Status | Verification Gate |
| :--- | :--- | :--- | :--- |
| **W0** | Scaffold, tooling, CI, docs skeleton, ADRs 0001-0005 | ✅ Complete | `make verify` [OK] |
| **W1** | Shared packages: `design-tokens`, `i18n`, `ui-art`, `/dev/art` | ✅ Complete | `test_completeness.py` & `test_art.py` [OK] |
| **W2** | Bank (8100) & API Core (8000), Scoped Tokens, Policy T0-T3, OpenAPI | ✅ Complete | Pytest (18/18) & Drift Check [OK] |
| **W3** | Agent, parser, planner, flows A/B/C, SSE events | ✅ Complete | `make smoke` (Flows A, B, C) [OK] |
| **W4** | Web app (7 routes wired to API, dual layout, live events) | ✅ Complete | Browser SPA routes & fallback [OK] |
| **W5** | Attack suite (12x10 variants), live Safety replay | ✅ Complete | `eval/reports/latest.json` & Wilson 95% table [OK] |
| **W6** | Hardening, offline shell, CSP, Docker Compose, v0.1.0 | ✅ Complete | Docker Compose & Nginx CSP [OK] |

## What is NOT Built Yet (Honest Limitations)

1. **Not a Real Bank / Fiat Gateway**: Integrations with live banking APIs (e.g. SWIFT, FedNow, WeBank) are simulated via local bank daemon on port 8100.
2. **Not On-Chain / No Smart Contracts**: We do not use blockchain or smart contracts; safety is enforced via cryptographic HMAC scoped tokens and deterministic policy state.
3. **No Hardware Enclave / WebAuthn Biometric Driver**: Passkey signatures use simulated software cryptographic signatures over SHA-256 intent hashes.
4. **No Real Model Weights**: Agent reasoning is powered by deterministic regex and DAG graph planning outside the model.
