# AegisPath Bank Service

Independent FastAPI banking daemon operating on port `8100`.

## Purpose
Simulates a custodial banking entity. Validates scoped HMAC tokens received from `services/api`, ensures per-transaction and velocity limits, guarantees idempotency via `Idempotency-Key`, and maintains the double-entry simulated ledger in an isolated SQLite database.

## Boundaries
- Completely separate process, secret key, and database file from `services/api`.
- Does NOT parse natural language, execute LLMs, or interact directly with end users.
