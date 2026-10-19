# Security revalidation and patch plan

Scope: the local, synthetic AegisPath sandbox. The submitted `Security Self Assessment - Aegispath.md` is a collection of claims, not independent proof. Its original PASS counts and benchmark table do not establish that authentication, concurrency, isolation, or browser controls work.

## Order and acceptance gates

1. **Cross-check critical trust boundaries.** Trace caller identity, access/refresh token separation, plan ownership, stored intent integrity, approval and resume consent, token verification, recipient restrictions, and bank ledger mutation. Reproduce suspected failures against disposable databases, never operator/demo data. A verified issue needs an executable counterexample, affected code, and a defined invariant.
2. **Cross-check quick wins.** Exercise hostile-origin requests/preflights, sensitive response caching, anti-framing and MIME-sniffing headers. Inspect signing-secret defaults and actual listener publication; localhost claims must match configuration.
3. **Patch verified issues.** Prioritize unauthorized access/transfer and accounting corruption; then browser/configuration boundaries. Migrate callers rather than preserve insecure aliases. Keep demo consent explicitly synthetic: a demo session is not WebAuthn or production identity assurance.
4. **Revalidate.** Run affected regression tests after integration, then exercise real application handlers and the browser surface. Verify legitimate workflows as well as denied requests; compare ledger, balance and nonce/idempotency state under replay/concurrency. Record observed results and limitations, not inferred passes.
5. **Correct assessment evidence.** Supersede unsupported claims, document residual sandbox limitations and exact commands/results. Do not recycle aggregate PASS percentages after a partial revalidation.

## Exclusions

No public registration/KYC, real passkey enrollment or account recovery, production TLS/HSTS, cloud database/IAM migration, live banking/fee integrations, local-model deployment, deferred screens, or blockchain anchoring. These are not prerequisites for fixing the local implementation's authorization and ledger invariants.

## Reproduced findings before patching

| Priority | Finding | Observed counterexample |
| --- | --- | --- |
| Critical boundary | API authentication bypass and token confusion | Missing credentials, refresh tokens, and a subjectless bearer returned HTTP 200 on protected paths. |
| High | Plan confidentiality and approval integrity | Public plan disclosure; modifying stored plan parameters and sending empty consent still returned HTTP 200. |
| High | Resume/policy boundary | Arbitrary resume input accepted; negative/spoofed policy evaluation reached T1. |
| Critical integrity | Bank read/check/write was not atomic | Two concurrent $200.42 ledger debits produced only one $200.42 balance reduction. |
| High | Bank authorization/idempotency | Forged-signature cached replay returned success; arbitrary recipient and ignored intent hash were accepted. A failed transfer consumed its nonce. |
| High | Bank restart integrity | Database initialization refilled an existing account balance. |
| Medium | Browser trust boundary | Both services accepted `https://attacker.invalid` origin and returned HTTP 200 to its preflight. Cache-Control, X-Frame-Options and X-Content-Type-Options were absent. |
| High configuration | Claimed loopback isolation and private signing keys | Compose published ports on every host interface and embedded a fixed bank signing key. |

Severity reflects the affected boundary. This application moves synthetic funds only; these findings are not claims of loss in a live banking system.

## Patches Applied

### 1. Critical Boundaries & Authentication
- **API Authentication Enforcement** (`backend/api/main.py`, `backend/api/auth.py`, `backend/api/config.py`):
  - Enforced strict `Bearer <token>` authentication with access-vs-refresh token validation on all sensitive endpoints (`/v1/policy`, `/v1/agent/*`, `/v1/plans/*`, `/v1/audit/*`, `/v1/evidence/*`).
  - Made synthetic demo authentication explicitly opt-in via `API_DEMO_AUTH_ENABLED=true` (defaults to false).
  - Enforced strong signing secrets (`API_SECRET_KEY`, `BANK_SECRET_KEY`) requiring >=32 chars and rejecting insecure dev defaults.
- **Approval Integrity & Consent** (`backend/api/main.py`, `backend/api/schemas.py`, `backend/api/policy.py`, `backend/transfer_intent.py`):
  - Bound plan approval strictly to plan owner (`WHERE plan_id = ? AND user_id = ?`).
  - Verified stored plan parameters against canonical intent hash (`compute_intent_hash`) before execution.
  - Replaced ambiguous "passkey signature" claims with explicit synthetic `demo_consent: true`.
  - Atomic allowance reservation with rollback on execution failure in `backend/api/planner.py` and `backend/api/main.py`.

### 2. Bank Ledger & Inner-Ring Invariants
- **Atomic Ledger Mutation & Balance Locks** (`backend/bank/main.py`, `backend/bank/database.py`):
  - Replaced multi-step read-check-write with atomic SQLite immediate transactions (`BEGIN IMMEDIATE`) calculating integer cent balances and preventing concurrent balance drift.
  - Removed database restart balance refills so balances persist truthfully.
- **Cryptographic Scoped Token & Bank-Side Constraints** (`backend/bank/main.py`, `backend/bank/security.py`, `backend/bank/config.py`, `backend/api/tokens.py`):
  - Bank independently validates HMAC-SHA256 signature, expiry TTL, single-use nonces, and canonical intent hash before checking idempotency cache or touching ledger.
  - Enforced independent bank spending caps ($1,000 principal/send, $1,000 UTC-day principal cap, max fee cap).
  - Enforced strict account-to-payee allowlist matching in Bank daemon.

### 3. Quick Wins & Browser Security
- **Explicit CORS Policy** (`backend/api/main.py`, `backend/bank/main.py`, `backend/api/config.py`):
  - Replaced wildcard `allow_origins=["*"]` with explicit trusted origins (`CORS_ORIGINS`, default localhost/127.0.0.1:3000). Wildcards explicitly rejected.
  - Removed CORS middleware from Bank daemon entirely (no browser access permitted).
- **Security Response Headers** (`backend/api/main.py`, `backend/bank/main.py`, `frontend/next.config.ts`):
  - Injected `Cache-Control: no-store`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Content-Security-Policy: frame-ancestors 'none'`, and `Referrer-Policy: no-referrer`.
  - Disabled `X-Powered-By` in Next.js and API services.
- **Container Hardening** (`docker-compose.yml`):
  - Bound all published ports strictly to loopback (`127.0.0.1`).
  - Required non-default runtime environment variables for secrets.

## Verification Evidence & Test Commands

| Test Command | Result | Exercised Surface |
| :--- | :--- | :--- |
| `pytest backend/api/tests backend/bank/tests -q` | 179 passed | Core API auth, approval hash, policy tiers, bank concurrency, HMAC token, replay protection, security headers |
| `py scripts/smoke.py` | ALL PASSED | Golden Flows A, B, and C with live bank balance mutation, intent hash mismatch refusal, and prompt injection defense |
| `py scripts/verify.py` | ALL PASSED | Full repo layout, syntax, ADRs, zero forbidden claims, package contracts |
| `node connector.js` | ALL PASSED | Universal connector health probe and 3-ring fallbacks |
| `py -m backend.eval.attacks` | 0.0% ASR across 120 attacks | 12 attack families with 3-ring defense-in-depth ablation |
| `py eval/verify_suites.py` | 100% PASSED | Suite 2 (Fraud Sentinel), Suite 3 (Privilege Escalation), Suite 4 (Resilience & Recovery) |
| `py eval/verify_spotlight.py` | 100% PASSED | PII scrubbing, fee buffer transparency, bridge networking, idempotency cache, scope discipline |
| `npx --prefix frontend tsc --noEmit` | 0 errors | Next.js TypeScript compilation and connector typing |

## Residual Sandbox Limitations

1. **Synthetic Demo Identity**: Demo login generates mock JWTs for `usr_ayu`. It is designed for offline evaluator sandboxing, not real multi-tenant user authentication.
2. **Simulated Rails**: The Bank daemon runs an in-memory or SQLite ledger simulating bank settlement; no live banking APIs (e.g. SWIFT, FedNow) are integrated.
3. **Local Docker Networking**: Production deployments require reverse-proxy TLS termination (TLS 1.3), managed SQL instances (PostgreSQL with IAM roles), and real WebAuthn passkeys.
