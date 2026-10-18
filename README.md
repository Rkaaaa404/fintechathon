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
├── frontend/                 # [BASE PRODUK: FRONTEND]
│   ├── css/                  # Curated design tokens & responsive styles
│   ├── js/                   # SPA routing, screen controllers & i18n
│   │   ├── screens/          # Modular screen views (Home, Chat, Approval, Tuition, etc.)
│   │   ├── connector.js      # Dedicated WebApp Connector client
│   │   ├── router.js         # Client-side router
│   │   └── mockData.js       # Resilient local fallback fixtures
│   ├── index.html            # Main WebApp entrypoint
│   ├── server.js             # High-performance static application server (Port 3000)
│   └── sw.js                 # PWA service worker with offline cache
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
  │  - Scans memo, OCR invoices, and chat prompts           │
  │  - Blocks prompt injections, role-play & leaked keys    │
  └───────────────────────────┬─────────────────────────────┘
                              │ Sanitized Intent
                              ▼
  ┌─────────────────────────────────────────────────────────┐
  │  2. MIDDLE RING: Policy Plane & Intent Hash             │
  │  - Enforces T0–T3 spending tiers & payee allowlists     │
  │  - Generates immutable SHA-256 Intent Hash              │
  │  - Requires explicit user biometric / Passkey approval │
  └───────────────────────────┬─────────────────────────────┘
                              │ Scoped HMAC Token
                              ▼
  ┌─────────────────────────────────────────────────────────┐
  │  3. INNER RING: Isolated Banking Gateway (Port 8100)    │
  │  - Runs on isolated process with separate crypto keys   │
  │  - Verifies cryptographic signature & single-use nonce  │
  │  - Rejects transactions exceeding bank-side limits      │
  └─────────────────────────────────────────────────────────┘
```

---

## 🔌 Universal WebApp Connector (`connector.js`)

The platform includes a dedicated **Universal Connector** (`connector.js` at root and `frontend/js/connector.js`), designed to seamlessly link any client application to the AegisPath backend ecosystem:

- **Automatic Service Discovery**: Detects whether Backend Core (:8000) and Bank Gateway (:8100) are online.
- **Dual-Mode Execution**:
  - **Live Mode**: Directly interacts with FastAPI REST and Server-Sent Events (SSE) streaming.
  - **Deterministic Fallback**: Automatically provides zero-latency deterministic mock responses if backend is booting or operating offline.
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
| **Safety & Policy Engine** | **100% Functional (Real)**: Deterministic policy, 3 defense rings, 120-variant attack evaluation. | Ready for deployment in live container environments. |
| **Banking Rails / Fiat Gateway** | **Simulated Bank Daemon (Port 8100)**: Complete ledger, HMAC token validation, and single-use nonces. | Decoupled adapter ready to plug into SWIFT, BI-FAST, FedNow, or partner bank APIs. |
| **Biometric Signatures** | **Cryptographic Software Signatures**: SHA-256 intent binding with mock passkey credentials. | Drop-in WebAuthn / FIDO2 hardware enclave API integration. |
| **AI Planning Engine** | **Deterministic Graph Parser**: Zero hallucinations, verifiable execution paths. | Can be supplemented with fine-tuned local SLMs (Small Language Models) under the same policy guardrails. |

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
npm run dev:frontend

# Start Backend Core & Bank Services (Ports 8000 & 8100)
npm run dev:backend

# Run Connector Diagnostics
npm run test:connector

# Run Core Monorepo Verification Gate
npm run verify
```

---

## 🧪 Verification & Security Benchmarks

AegisPath includes automated test suites ensuring zero regression:
```bash
# 1. Run Verification Gate (ADRs, Syntax, Layout, Contracts)
py aegispath/scripts/verify.py

# 2. Run Golden Flows Smoke Test (Tuition payment, Attack rejection, Balance check)
py aegispath/scripts/smoke.py

# 3. Run Security Attack Evaluation Suite (120 test cases, 95% Wilson CI)
py -m eval.attacks
```

---

## 📄 License & Attribution

Licensed under the **Apache License, Version 2.0**.  
Developed for **FinTechathon 2026**.
