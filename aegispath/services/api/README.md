# AegisPath API Service

FastAPI service operating on port `8000`.

## Purpose
Coordinates agent intent parsing, spending policy evaluation (Tiers T0–T3), cryptographic intent hash calculation, audit hash-chain maintenance, SSE progress broadcasting, and scoped token issuance.

## Boundaries
- Does NOT have direct database access to the bank balance or ledger.
- Communicates with `services/bank` strictly over HTTP using HMAC-SHA256 scoped tokens.
- Generates the OpenAPI 3.1 contract.
