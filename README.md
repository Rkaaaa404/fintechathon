# AegisPath — AI-Powered Sovereign Digital Wallet Platform

> **AI Agent that automates cross-border financial operations and tuition payments with deterministic security enforced outside the language model.**  
> *Official Submission for FinTechathon 2026*

---

## 🏛️ Executive Summary

**AegisPath** is a next-generation sovereign digital wallet platform designed for international students and cross-border families. While modern generative AI agents offer unprecedented convenience in planning and navigating financial obligations, placing direct fund movement authority inside an LLM creates catastrophic vulnerabilities (prompt injections, hallucinations, and unauthorized drainage).

AegisPath solves this fundamental dilemma by enforcing **Deterministic Multi-Ring Security Outside the Model**: the AI agent acts solely as a parser and planner, while all financial authorization, rate buffers, and fund executions are constrained by cryptographic intent binding and isolated banking daemons.

---

## 🏗️ Base Product Architecture

The repository is structured as a modular, enterprise-grade base product with clean separation between Frontend, Backend, and Shared Connectors:

```
fintechathon/
├── frontend/                 # Active Next.js application (Port 3000)
│   ├── src/app/              # Page shell and styles
│   ├── src/components/       # Chat, approval, tuition and other screens
│   └── src/lib/              # Typed API connector and presentation-only AI gateway
├── frontend_legacy/          # Archived static demo; not the integrated chat
│
├── backend/                  # [BASE PRODUK: BACKEND]
│   ├── api/                  # Core API Microservice (FastAPI - Port 8000)
│   │   ├── sentinel.py       # Outer Ring: Prompt injection & privacy filter
│   │   ├── policy.py         # Middle Ring: T0–T3 rules & spending limits
│   │   ├── tokens.py         # HMAC-SHA256 scoped token generator
│   │   ├── planner.py        # Graph-based financial task planner
│   │   ├── database.py       # Tamper-evident ledger & audit trail
│   │   └── main.py           # Core FastAPI REST & SSE endpoints
│   ├── bank/                 # Isolated Banking Gateway (FastAPI - Port 8100)
│   │   ├── security.py       # Inner Ring: Scoped token validation & replay defense
│   │   ├── database.py       # Isolated core banking ledger & balances
│   │   └── main.py           # Bank authorization & settlement API
│   ├── contracts/            # OpenAPI 3.1.0 specifications & contract drift checks
│   ├── eval/                 # Automated security benchmark suite (120 attack variants)
│   ├── requirements.txt      # Python dependencies
│   └── server.py             # Unified backend concurrent runner
│
├── connector.js              # [UNIVERSAL CONNECTOR]
│                             # Universal bridge for WebApp and Node.js with automated fallback
│
├── packages/                 # Shared design tokens, i18n bundles, and SDKs
├── docs/                     # Architecture Decision Records (ADR 0001–0005) & Runbooks
├── start.bat                 # One-click Windows development launcher
└── start.sh                  # One-click Unix/Linux/macOS launcher
```

---

## 🛡️ The 3 Independent Defense Rings

```
   [ User Prompt / Invoice ]
              │
              ▼
  ┌─────────────────────────────────────────────────────────┐
  │  1. OUTER RING: Privacy & Prompt Injection Filter       │
  │  - Scans chat with deterministic Sentinel patterns      │
  │  - Cloud: synthetic attestation + limited PII guard      │
  └───────────────────────────┬─────────────────────────────┘
                              │ Sanitized Intent
                              ▼
  ┌─────────────────────────────────────────────────────────┐
  │  2. MIDDLE RING: Policy Plane & Intent Hash             │
  │  - Enforces T0–T3 spending tiers & payee allowlists     │
  │  - Generates immutable SHA-256 Intent Hash              │
  │  - T1 auto-send; T2 explicit demo approval + intent hash │
  └───────────────────────────┬─────────────────────────────┘
                              │ Scoped HMAC Token
                              ▼
  ┌─────────────────────────────────────────────────────────┐
  │  3. INNER RING: Isolated Banking Gateway (Port 8100)    │
  │  - Runs on isolated process with separate crypto keys   │
  │  - Verifies cryptographic signature & single-use nonce  │
  │  - Checks HMAC, expiry, nonce and available balance      │
  └─────────────────────────────────────────────────────────┘
```

---

## 🔌 Universal WebApp Connector (`connector.js`)

The active Next.js client uses `frontend/src/lib/api/connector.ts`. Chat sends `POST /v1/agent/messages`; pending plans use `POST /v1/plans/{plan_id}/approve`. These two operations **never fall back to fabricated transactions**. Provider/network/bank failures remain errors. Some unrelated demonstration screens retain illustrative fixtures/fallbacks.

The root `connector.js` and `frontend_legacy/` are legacy demo utilities, not the active AI integration. SSE provides heartbeat events, not model reasoning streams.
- **CLI Self-Test Suite**: Run `node connector.js` from terminal to verify all 3 defense rings in seconds.

### Quick Connector Test
```bash
node connector.js
```

---

## ⚖️ Production Readiness & Modular Roadmap

To maintain absolute transparency for competition judges and security auditors:

| Capability | Current Base Implementation | Production Extension Roadmap |
| :--- | :--- | :--- |
| **Safety & Policy Engine** | Deterministic Sentinel patterns, spending policy and scoped-token checks. | Production authentication, independent bank caps and stronger privacy controls remain separate work. |
| **Banking Rails / Fiat Gateway** | Local simulated bank with ledger, HMAC validation and single-use nonces. | No real-bank settlement is implemented. |
| **Approval** | Intent-hash binding and demo UI consent; not hardware passkey authentication. | WebAuthn/FIDO2 is not implemented. |
| **AI Intent Engine** | Server-side Gemini or Groq structured extraction, or explicitly selected offline parser. Evidence validation does not guarantee semantic accuracy. | Synthetic cloud demos only; no real personal data. |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Python 3.12+** (`py` or `python`)
- **Node.js 20+** (`node`)

### 2. One-Click Launch (Recommended)
On Windows:
```bash
start.bat
```
On Linux / macOS:
```bash
chmod +x start.sh && ./start.sh
```

### 3. Manual Launch via NPM
```bash
# Start Frontend WebApp (http://127.0.0.1:3000)
npm ci --prefix frontend
npm --prefix frontend run dev

# Start Backend Core & Bank Services (Ports 8000 & 8100)
npm run dev:backend

# Run Connector Diagnostics
npm run test:connector

# Run Core Monorepo Verification Gate
npm run verify
```

### Server-side AI configuration

API and bank load the repository-root `.env`; process environment takes precedence. `backend/.env` is no longer read. Keep secrets out of `NEXT_PUBLIC_*` and browser code.

```dotenv
LLM_PROVIDER=none
GEMINI_API_KEY=
GROQ=
GEMINI_MODEL=gemini-3.8-flash
GROQ_MODEL=openai/gpt-oss-20b
LLM_TIMEOUT_SECONDS=20
```

Select exactly one provider (`none`, `gemini`, `groq`) before starting the backend. A selected cloud provider requires its nonempty key and model. There is no automatic provider failover or offline fallback after a cloud error.

In Chat, check **Synthetic demo data only — do not enter personal data** before cloud extraction. Only the current synthetic instruction is sent, not history, JWT, ledger or account profile. Sentinel runs before network; detected account/ID/email/international-phone patterns reject cloud input. This limited guard is not universal PII detection. Provide one complete instruction, e.g. `Tolong kirim USD 200 ke ibu lewat rute termurah`; clarification requires resending a complete instruction.

Known-payee USD transfers within T1 policy auto-send to the sandbox. USD 600 requires demo approval. CNY 3000 tuition to Campus bursar can be reviewed with sufficient allowance; CNY 18000 exceeds the default USD 1000 daily cap and is refused. The tuition calculator is illustrative and only prepares a chat draft. Receipt transaction IDs must reconcile with the bank ledger; timeout means execution is unconfirmed, not necessarily that no debit occurred. Do not automatically resend.

See [the runbook](docs/runbook.md) for isolated proof commands and failure handling.

---

## 🧪 Verification & Security Benchmarks

AegisPath includes automated test suites ensuring zero regression:
```bash
# 1. Run Verification Gate (ADRs, Syntax, Layout, Contracts)
py scripts/verify.py

# 2. Run Golden Flows Smoke Test (Tuition payment, Attack rejection, Balance check)
py scripts/smoke.py

# 3. Run Security Attack Evaluation Suite (120 test cases, 95% Wilson CI)
py -m eval.attacks
```

---

## 📄 License & Attribution

Licensed under the **Apache License, Version 2.0**.  
Developed for **FinTechathon 2026**.
