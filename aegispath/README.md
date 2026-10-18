# AegisPath — AI Agent Digital Wallet

> **AI agent that sends money and pays tuition across borders for international students, with safety enforced outside the language model.**

*FinTechathon 2026 Prototype* | **Status: Testnet 测试网 (Simulated Funds)**

---

## Architecture Overview

AegisPath guarantees funds security through **three independent defense rings**:
1. **Outer Ring — Privacy & Injection Filter:** Scans instructions, invoices, and memos for prompt injection attacks and sensitive credential leakage.
2. **Middle Ring — Spending Rules (Policy Plane):** Deterministic enforcement of spending tiers (T0–T3), payee allowlist, and cryptographic intent-hash binding.
3. **Inner Ring — Bank-Side Limit:** An isolated banking service (`services/bank`) running on an independent process with separate secrets and SQLite database, validating scoped HMAC tokens and enforcing idempotency.

```
       [ User / Ayu ]
             │
             ▼
      ┌─────────────┐
      │  apps/web   │ (React 18 + Vite PWA)
      └──────┬──────┘
             │ (Typed API Client)
             ▼
   ┌───────────────────┐
   │   services/api    │ ───► Outer Ring (Privacy Filter)
   │    (Port 8000)    │ ───► Middle Ring (Policy Plane & Intent Hash)
   └─────────┬─────────┘
             │ (Scoped HMAC Token)
             ▼
   ┌───────────────────┐
   │   services/bank   │ ───► Inner Ring (Bank Limit & Ledger)
   │    (Port 8100)    │
   └───────────────────┘
```

---

## Quick Start

### Prerequisites
- Python 3.12 or 3.13 (`py` or `python`)
- Node.js 20+ and npm / pnpm
- Docker & Docker Compose (optional for containerized deployment)

### Setup & Run
```bash
# 1. Verify repository health & dependencies
py scripts/verify.py

# 2. Run Golden Flows smoke test
py scripts/smoke.py

# 3. Run attack evaluation benchmark
py -m eval.attacks

# 4. Run local dev server (Services on 8000 & 8100, Web on 3001)
node apps/web/server.js
# Or via Docker Compose:
docker compose up --build
```

- **Web Application:** [http://127.0.0.1:3001](http://127.0.0.1:3001)
- **API Core (Swagger docs):** [http://127.0.0.1:8000/v1/docs](http://127.0.0.1:8000/v1/docs)
- **Bank Daemon (Swagger docs):** [http://127.0.0.1:8100/v1/docs](http://127.0.0.1:8100/v1/docs)

---

## Verification & Testing Commands

| Command | Purpose |
| :--- | :--- |
| `py scripts/verify.py` | Full verification: linting, types, package health, license check |
| `py -m pytest` | Run all backend unit & integration tests |
| `py scripts/smoke.py` | Run Golden Flows A, B, and C against running services |
| `py -m eval.attacks` | Run full attack evaluation suite (12 families x 10 variants) |
| `py scripts/seed.py` | Reset and seed database with testnet student persona |

---

## Legal & Licensing Note

*Ownership and licensing terms for this prototype are currently reserved for competition submission. All third-party dependencies used are open-source licensed and audited in `NOTICE`.*
