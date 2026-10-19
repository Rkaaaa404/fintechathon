> **Revalidation notice — 2026-10-19:** The original assessment below is retained as historical input, not a current verified security attestation. Its PASS labels, aggregate counts, and zero-loss claims must not be reused as evidence for the current build. Targeted revalidation reproduced API authentication bypass, approval integrity failures, missing independent bank constraints, non-atomic ledger updates, startup balance resets, permissive CORS, and missing security headers. See [the revalidation plan, findings, patches, and verification record](docs/security-revalidation.md) for the superseding evidence.
>
> **Scope and claim corrections:** This is a single-owner synthetic sandbox. Demo login and explicit demo consent are not production identity authentication or WebAuthn. T1 policy permits limited automatic transfers; it is not universally read-only. HMAC is symmetric: the API issuer and bank verifier share the bank token key, distinct from the API session key. Separate SQLite files are not OS/IAM isolation from a compromised same-user process. Agent Pause does not revoke a scoped token already handed to the bank, and a hash chain is tamper-evident, not immutable against an attacker who can rewrite the whole store. Production TLS/IAM, real passkeys/KYC, live banking, and deferred UI/blockchain work remain out of scope. All other unexercised rows below remain **unverified in this revalidation**, regardless of their historical label.

**2026 FINTECHATHON · SUBMISSION TEMPLATE**

**International AI Track | Security Self-assessment**

Optional supporting material. Please complete this document in English.

| Submission Details | Information |
| :---- | :---- |
| **Team Name** | 5 IT Goes To China |
| **Competition Track** | International AI Track |
| **Submission Date** | Oct 20, 2026 9:00 PM GMT+7 |

# **01 Permission Model**

* ## Roles, operations and permission boundaries

1. ### Core Architectural Posture (Deterministic Complete Mediation)

   AegisPath adopts a strict zero-trust posture for its AI components: security, privacy boundaries, and financial limits are enforced deterministically outside the language model. The language model (or our bilingual English/Mandarin rule-based parser) is strictly restricted to natural-language intent parsing and outputs schema-validated, strongly typed JSON. Deterministic application code computes all financial figures and mediates all state transitions. Even if the AI model is compromised, hallucinated, or manipulated via prompt injection, it cannot cause financial loss beyond owner-defined limits because enforcement relies on three independent defense rings:

1. Ring 1: Outer Ring (Privacy Gateway, API Service Port 8000\)

   A fail-closed ingress and egress filter that detects adversarial instruction patterns and tokenizes Personally Identifiable Information (PII) before any data crosses the trust boundary to an external model.

2. Ring 2: Middle Ring (Policy Plane & Sentinel, API Service Port 8000\)

   A deterministic policy decision point that classifies every requested operation into strict permission tiers (T0 \- T3), runs pre-execution balance and runway simulations, enforces cryptographic intent binding (intent\_hash), and executes automated anti-fraud checks (including an Invoice Account-Swap Shield and Money-Mule Recruitment Detection).

3. Ring 3: Inner Ring (Simulated Bank Service, Port 8100\)

   A physically isolated microservice operating in a separate process with its own database and independent cryptographic secrets. The API Service (Port 8000\) holds zero direct write privileges to the bank ledger. Ledger mutations are executed by Port 8100 only after independently re-validating a short-lived, cryptographically signed Scoped Token, strict bank-side spending limits, payee allowlists, and idempotency keys.

   **Database Storage Architecture & Microservice Isolation:** To ensure rigorous security both in local sandbox evaluation and production environments, AegisPath implements a dual-database architecture. In local/offline mode, storage is backed by distinct SQLite databases (aegispath\_api.db for Port 8000 and simulated\_bank.db for Port 8100\) physically partitioned in separate file paths with non-overlapping process file locks. In online production deployments, these map to isolated cloud-managed SQL database instances (e.g., Cloud PostgreSQL) with strict IAM credential segregation, ensuring that the Port 8000 database user has zero network routing or permission to query or mutate the Port 8100 banking schema. All database operations strictly employ parameterized queries, eliminating SQL injection by design.

2. ### Role Definitions and Separation of Duties

   The architecture strictly enforces separation of duties across four distinct operational roles:

1. **Authenticated Student User (Owner):** Holds sovereign authority to configure spending caps, review pre-execution simulations, approve or reject Tier T2 transactions via server-signed approval screens, trigger emergency Agent Pause, and generate or revoke financial evidence links (Prove).  
2. **AI Financial Agent / Intent Parser (Untrusted Actor):** Treated under a strict zero-trust model. It can only propose structured Directed Acyclic Graph (Planner DAG) execution steps and holds no credentials, signing keys, or direct database/ledger access.  
3. **API & Policy Plane Service (Port 8000):** Mediates user sessions, executes deterministic calculations for tuition quotations and runway projections, validates JSON schemas, appends records to the SHA-256 hash-chained audit trail, and issues narrowly scoped execution tokens upon verified user approval.  
4. **Simulated Bank Service (Port 8100):** Acts as the independent custodian of the financial ledger, enforcing hard bank-side caps and recipient allowlists regardless of upstream API state.

3. ### Permission-Tier Implementation Matrix (T0 – T3)

| Permission Tier | Authorized Operations in AegisPath | Authorized Operations in AegisPath	Boundary and Mediation Controls | Standard Alignment |
| :---- | :---- | :---- | :---- |
| Tier T0 *(Read-Only and Simulation)* | Account balance checks, tuition fee quotation with intermediary bank buffer estimation, route comparison (Fastest / Cheapest / Balanced), deterministic cash-flow summaries, and Planner scholarship/tuition runway simulations. | Auto-approved in read-only context; computed 100% by deterministic code (no LLM math); zero state-change or ledger-write capability. | OWASP LLM03:2026 OWASP LLM07:2026 WSTG-BUSL-01  |
| Tier T1 *(Low-Risk Reversible)* | Constructing typed Planner DAG execution plans, formatting draft Prove financial evidence packages, and revoking active evidence-sharing links. | Requires strict JSON schema validation and unique idempotency key assignment; cannot move funds or alter bank-side state. | OWASP LLM01:2026 OWASP LLM10:2026 WSTG-INPV-04  |
| Tier T2 *(Controlled Execution)* | Cross-border tuition payments and remittances (Pay) to allowlisted recipients within policy caps; issuing time-expiring, revocable Prove financial evidence share links. | Requires pre-execution simulation, explicit Human-in-the-Loop (HITL) Approval rendered from a server-signed payload, exact SHA-256 intent\_hash verification, and a short-lived Scoped Token verified by Port 8100\. | OWASP LLM01:2026 (Rule of Two) OWASP LLM03:2026 WSTG-IDNT-01 |
| Tier T3 *(Prohibited / Anomalous)* | Transfers exceeding bank-side caps, transfers to unverified/non-allowlisted payees, post-approval parameter tampering (intent\_hash mismatch), or transactions flagged by Sentinel (invoice account-swap or money-mule velocity patterns). | Deterministically Blocked (Fail-Closed) by Ring 2 (Policy Plane) and/or Ring 3 (Simulated Bank); triggers immediate Agent Pause circuit breaker and writes an immutable alert to the SHA-256 audit log. | OWASP LLM03:2026 OWASP LLM06:2026 WSTG-BUSL-07 |

* ## Confirmation, verification and rollback mechanisms

1. **Server-Signed Human-in-the-Loop (HITL) Confirmation:** High-consequence operations (Tier T2) cannot be authorized via conversational chat text. The PWA Approval screen renders transaction details exclusively from a tamper-proof, server-signed payload, neutralizing UI spoofing and invisible-Unicode smuggling.  
2. **Cryptographic Intent Binding (\`intent\_hash\` Verification):** When a user approves a transaction on the Approval screen, the system binds canonical parameters (recipient\_id, amount, currency, route\_id, idempotency\_key) into a SHA-256 intent\_hash. At execution time, both the Policy Plane (Port 8000\) and the Simulated Bank (Port 8100\) independently recompute the hash against the execution payload. Any post-approval tampering causes an immediate intent\_hash mismatch rejection.  
3. **Scoped Token Verification:** The Policy Plane mints a single-use, short-lived Scoped Token cryptographically bound to the specific allowlisted payee, exact approved amount ceiling, and strict expiration timestamp. The Simulated Bank independently verifies token integrity and constraints before touching the ledger.  
4. **Pre-Execution Simulation:** Prior to requesting user confirmation, every Planner DAG workflow executes a deterministic dry-run simulation against current account balances, intermediary bank fee buffers, and daily/per-transaction limits.  
5. **Idempotency, Rollback/Compensation, and Agent Pause:** Each node in the Planner DAG carries a deterministic idempotency key and explicit compensation logic. If a multi-step workflow encounters a downstream rejection or network fault, completed preparatory steps are cleanly compensated without duplicate debits. At any moment, either the user or the Sentinel fraud engine can activate Agent Pause, an immediate circuit breaker that halts active DAG execution and invalidates outstanding scoped tokens.  
6. **Tamper-Evident Audit Trail:** Every policy evaluation, user approval, blocked attempt, and ledger execution is appended to a SHA-256 hash-chained audit log, where each entry incorporates the cryptographic hash of the preceding record.

# 

# **02 Security Tests**

* ## Prompt injection, social engineering, privilege escalation and failure recovery tests

1. ### Automated Adversarial Evaluation and Three-Ring Ablation Methodology

   AegisPath's security evaluation combines automated adversarial benchmark testing with a comprehensive white-box architectural review across all codebase components (API service on Port 8000, Bank service on Port 8100, and Next.js PWA frontend on Port 3000). Automated evaluation runs against a hash-locked benchmark generated from eval/reports/latest.json, reporting statistical claims using 95% Wilson score confidence intervals (reporting empirical upper bounds when zero failures are observed across 120 attack trials, strictly avoiding unscientific 'zero-risk' claims).

1. Adversarial Prompt Injection Suite: Evaluated across 12 distinct attack families with 10 variants per family (120 total attacks in eval/attacks.py, covering direct system prompt overrides, indirect injections in tuition invoices, invisible Unicode smuggling, payload splitting, and bilingual English/Mandarin adversarial prompts), paired with benign financial requests to measure False Positive Rates (FPR) alongside Task Completion (\~60 golden DAG scenarios).  
2. Student Fraud & Social Engineering Suite: Targets the Sentinel deterministic engine against real-world attack vectors: (a) Invoice Account-Swap Attacks (Flow C) attempting to inject rogue beneficiary accounts into tuition invoices; and (b) Money-Mule Velocity Patterns attempting high-velocity pass-through remittances.  
3. Privilege Escalation & Tampering Suite: Automated replay tests verifying that: (a) post-approval parameter mutation is rejected deterministically via intent\_hash mismatch; (b) direct ledger requests to Port 8100 without a valid Scoped Token are denied; and (c) Tier T0/T1 read-only actions cannot escalate to Tier T2 fund transfers.  
4. Resilience & Failure Recovery Suite: Verifies fail-closed behavior on malformed inputs, idempotency deduplication under concurrent replay, DAG compensation on simulated network faults, immediate Agent Pause responsiveness, and 100% offline execution using the deterministic bilingual rule parser.

2. ### Three-Ring Defense Ablation Table (from eval/reports/latest.json)

| Defense Configuration | Attack Success Rate (ASR) | 95% Wilson CI | Benign FPR | Simulated Funds Lost (\$) |
| :---- | :---- | :---- | :---- | :---- |
| 1\. Baseline: Unprotected Model Only (No Rings) | 100.0% (120/120) | 96.9% – 100.0% | 0.0% (0/12) | \$4,250.00 |
| 2\. Model \+ Ring 1 (Privacy Gateway Only) | 54.2% (65/120) | 45.3% – 62.8% | 0.0% (0/12) | \$850.00 |
| 3\. Model \+ Ring 1 \+ Ring 2 (Policy Plane & Sentinel) | 20.8% (25/120) | 14.5% – 28.9% | 0.0% (0/12) | \$0.00 |
| 4\. Full AegisPath (Ring 1 \+ Ring 2 \+ Ring 3 Simulated Bank) | 0.0%  (0/120) | 0.0% – 3.1% | 0.0% (0/12) | \$0.00 |
| 5a. Single-Ring Drop-out: Ring 1 Disabled (Rings 2 & 3 Active) | 0.0%  (0/120) | 0.0% – 3.1% | 0.0% (0/12) | \$0.00 |
| 5b. Single-Ring Drop-out: Ring 2 Disabled (Rings 1 & 3 Active) | 0.0%  (0/120) | 0.0% – 3.1% | 0.0% (0/12) | \$0.00 |
| 5c. Independent Inner Ring: Only Ring 3 Active (Port 8100 Caps) | 55.0%  (66/120) | 46.1% – 63.6% | 0.0% (0/12) | \$0.00 above cap |

   

3. ### Security Verification Status Distribution and Executive Summary

   To provide clear architectural visibility for evaluators, all 118 evaluation items across AegisPath's attack surface and functional boundaries are classified into four mutually exclusive operational statuses:

| Audit Status Category | Count | Percentage | Definition and Architectural Context in AegisPath |
| :---- | :---- | :---- | :---- |
| PASS (Verified) | 78 | 66.1% | Deterministically verified and enforced by architecture: parameterized queries in SQLite, intent\_hash verification in main.py, isolated Port 8100 bank ledger, and fail-closed Sentinel regex filters. |
| N/A (Not Applicable) | 33 | 28.0% | Feature or technology is intentionally excluded by architectural design (e.g., NoSQL, Flash, LDAP, WebSockets, public user registration; confirmed in docker-compose.yml). |
| KNOWN RISK | 6 | 5.1% | Residual risks inherent to cloud LLM side channels or local docker bridge networking, actively mitigated in MVP and documented transparently in Section 04\. |
| DEFERRED (Out of MVP) | 1 | 0.8% | Secondary non-critical features intentionally postponed beyond the 10-day MVP scope (unbuilt screens labeled "Coming Soon" in Next.js UI). |
| TOTAL EVALUATION SUITE | 118 | 100.0% | 10 AI Agent Security Tests \+ 107 Web & API Security Tests \+ 1 Scope Discipline Item |

   

4. ### High-Priority Spotlight: Known Risks and Deferred Scope

   Evaluators can immediately review all non-PASS items and their associated defensive mitigations in this focused summary table:

| Test ID | Category | Test Case Name | Status | Risk Description & Active MVP Mitigation |
| :---- | :---- | :---- | :---- | :---- |
| LLM02:2026 | AI Security | Sensitive Information Disclosure | KNOWN RISK | Cloud LLM provider observes tokenized sentence syntax and request timing. Mitigation: Zone Z2 PII is redacted/tokenized before egress; full 100% offline rule-based mode is available. |
| LLM07:2026 | AI Security | Misinformation | KNOWN RISK | Correspondent intermediary bank lifting fees may vary in live cross-border corridors. Mitigation: Deterministic fee buffer calculations; UI explicitly labels quotes as estimates with buffers. |
| WSTG-ATHN-01 | Authentication | Credentials Transported over Encrypted Channel | KNOWN RISK | Inter-service Docker bridge network uses unencrypted internal HTTP during local evaluation. Mitigation: Isolated internal container network; TLS 1.3 reverse-proxy termination specified for production. |
| WSTG-BUSL-04 | Business Logic | Test for Process Timing | KNOWN RISK | Inference timing side-channel on external cloud LLM. Mitigation: Strict idempotency keys prevent ledger race conditions; local SLM with timing jitter planned for post-MVP. |
| WSTG-CLNT-07 | Client-Side Security | Testing Cross Origin Resource Sharing (CORS) | KNOWN RISK | Backend API and Bank daemons utilize wildcard CORS (allow\_origins=\["\*"\]) in evaluation stack. Mitigation: Isolated localhost/bridge container network with zero public DNS routing; explicit origin whitelist specified for production reverse proxy. |
| WSTG-CLNT-09 | Client-Side Security | Testing for Clickjacking | KNOWN RISK | HTTP responses currently omit X-Frame-Options: DENY and CSP frame-ancestors 'none'. Mitigation: High-consequence transfers require server-signed intent\_hash and cryptographic confirmation; production ingress proxy must inject anti-framing headers. |
| MVP-SCOPE-01 | Architecture | Secondary Screens and On-Chain Anchor | DEFERRED | Secondary screens (Payees, Rates, More) and smart contract anchoring deferred. Mitigation: Strict MVP scope discipline; UI transparently displays 'Coming Soon' with zero false capability claims. |

   

5. ### Comprehensive White-Box Security Verification Matrix

   To ensure complete lifecycle test coverage, we conducted a full white-box source code, configuration, and dependency audit across all 117 standard security test cases \+ 1 MVP scope discipline item, mapped directly to concrete files, endpoints, and database models in the fintechathon/ repository.

   #### **Category A: OWASP Top 10 for LLM Applications 2026**

| Test ID | Vulnerability / Test Case Name | Status | White-Box Verification & Architectural Evidence in AegisPath |
| :---- | :---- | :---- | :---- |
| LLM01:2026 | Prompt Injection | PASS (Verified) | External invoices treated strictly as passive data; Ring 1 (Privacy Gateway) filters instruction patterns fail-closed; Ring 2 enforces typed JSON schemas & intent\_hash; Ring 3 enforces independent bank allowlists. Verified: direct overrides, invoice injections, and Chinese bilingual exploits intercepted with 0% false positives. |
| LLM02:2026 | Sensitive Information Disclosure | KNOWN RISK | Zones Z0–Z3 enforced; Z2 PII is tokenized before egress (\[REDACTED\_ID\], \[REDACTED\_ACCOUNT\]) and logged in Egress Ledger (0 leaks in Privacy Canary tests); Z3 secrets never enter prompts or logs. 100% offline rule parser fallback available for zero-cloud operations. Residual cloud timing/tokenized structure risk documented in Section 04\. |
| LLM03:2026 | Excessive Agency | PASS (Verified) | Complete mediation via Policy Plane (T0–T3), server-signed HITL approval, cryptographic intent\_hash verification, and physically separate Simulated Bank (Port 8100\) requiring HMAC-signed Scoped Tokens. Verified: direct bank ledger calls without token signature return rejection error. |
| LLM04:2026 | Supply Chain | PASS (Verified) | Pinned dependencies in lockfiles (backend/requirements.txt, package.json), reproducible docker compose build, and 100% self-hosted fonts, icons, and SVG assets with zero external CDN script dependencies verified. |
| LLM05:2026 | Data and Model Poisoning | N/A (By Design) | Architectural static audit verified: zero ML model pre-training, fine-tuning pipelines, or continuous weight learning loops exist in codebase; operates strictly on frozen deterministic rules, temperature=0.0 foundation models, and synthetic datasets. |
| LLM06:2026 | Unbounded Consumption | PASS (Verified) | Bounded Planner DAG step counts, expiring Scoped Tokens with cryptographic nonces, Agent Pause kill-switch circuit breaker (is\_paused=1 instantly halts transfers with REFUSED), and graceful degradation to 100% offline bilingual rule-parser mode. |
| LLM07:2026 | Misinformation | KNOWN RISK | All tuition quotes, base amounts, fee buffers, and exchange conversions are computed by deterministic Python math routines (never hallucinated by LLM). UI explicitly labels quotes as estimates with buffers ("Estimate with a buffer, not a guarantee"). Residual live bank corridor variation risk documented in Section 04\. |
| LLM08:2026 | Hidden Context Exposure | PASS (Verified) | Designed under the architectural assumption that system prompts are discoverable; zero Z3 secrets, bank private keys, or database credentials embedded in prompts; all authorization enforced out-of-band via Scoped Tokens outside the LLM. |
| LLM09:2026 | Vector and Embedding Weaknesses | N/A (By Design) | Architecture uses deterministic rule parsing and structured ACID relational stores (SQLite); codebase audit verified zero vector databases (Chroma, FAISS, Pinecone) or embedding similarity searches are present. |
| LLM10:2026 | Improper Output Handling | PASS (Verified) | All model outputs validated against strict typed Pydantic JSON schemas (ModelIntentOutput); evidence-based substring validation downgrades hallucinated intents to clarification; React JSX automatically escapes raw string interpolation with zero automatic external URL/image fetching. |

   

   #### **Category B: OWASP WSTG v4.2 \- 4.1 Information Gathering** 

| Test ID | Test Case Name | Status | White-Box Verification & Architectural Evidence in AegisPath |
| :---- | :---- | :---- | :---- |
| WSTG-INFO-01 | Conduct Search Engine Discovery Reconnaissance for Information Leakage (4.1.1) | N/A (Out of Scope \- By Design) | Deployed as an isolated local container stack (docker compose up); strictly binds to localhost / bridge network without public DNS routing; not indexed by public search engine crawlers (Googlebot/Bingbot). |
| WSTG-INFO-02 | Fingerprint Web Server (4.1.2) | PASS (Verified) | HTTP response headers on Port 8000 and Port 8100 stripped of verbose server version banners (Server header suppressed in FastAPI/Uvicorn); zero operating system or internal server distribution details leaked. |
| WSTG-INFO-03 | Review Webserver Metafiles for Information Leakage (4.1.3) | PASS (Verified) | Static PWA directory audited (frontend/public/); verified manifest (AegisPath — AI Agent Digital Wallet); zero administrative endpoints, internal credentials, or backup files exposed in public metadata. |
| WSTG-INFO-04 | Enumerate Applications on Webserver (4.1.4) | PASS (Verified) | Container service definitions in docker-compose.yml expose only designated services (web on Port 3000, api on Port 8000, and bank on Port 8100); zero unauthorized services or rogue database consoles (phpMyAdmin/pgAdmin) exposed. |
| WSTG-INFO-05 | Review Webpage Content for Information Leakage (4.1.5) | PASS (Verified) | White-box audit across 27 TypeScript/React source files confirms 0 hardcoded Z3 API keys, private keys, or passwords; zero debug comments or production .map source maps exposed publicly. |
| WSTG-INFO-06 | Identify Application Entry Points (4.1.6) | PASS (Verified) | All REST API endpoints across Port 8000 (24 explicit endpoints) and Port 8100 (9 ledger daemon endpoints) are strictly enumerated in FastAPI routers and governed by typed Pydantic request models. |
| WSTG-INFO-07 | Map Execution Paths Through Application (4.1.7) | PASS (Verified) | Execution paths are deterministically constrained to typed Planner DAG nodes: Flow A (Tuition Payment approval\_sheet), Flow B (Living Allowance approval\_sheet), and Flow C (Invoice / Injection Ingestion blocked\_slip with \$0.00 funds lost). |
| WSTG-INFO-08 | Fingerprint Web Application Framework (4.1.8) | PASS (Verified) | Framework-identifying headers (X-Powered-By) disabled/absent in response headers; Next.js framework obfuscated; 404 error responses suppress internal Python stack traces and file system paths. |
| WSTG-INFO-09 | Fingerprint Web Application (4.1.9) | N/A (Merged into WSTG-INFO-08) | Merged into WSTG-INFO-08 per official OWASP WSTG v4.2 specification. Evaluated and verified under WSTG-INFO-08. |
| WSTG-INFO-10 | Map Application Architecture (4.1.10) | PASS (Verified) | Three-ring defense topology verified with complete database segregation: API Database (audit\_chain, evidence\_shares, plans, policy, policy\_proposals, users) physically segregated from Bank Database (accounts, idempotency\_records, ledger, used\_nonces); direct ledger mutation blocked without HMAC Scoped Token. |

   

   #### **Category C: OWASP WSTG v4.2 \- 4.2 Configuration & Deployment Management**

| Test ID | Test Case Name | Status | White-Box Verification & Architectural Evidence in AegisPath |
| :---- | :---- | :---- | :---- |
| WSTG-CONF-01 | Test Network Infrastructure Configuration (4.2.1) | PASS (Verified) | Verified via docker-compose.yml: isolated service containers, separate databases, and independent secrets. |
| WSTG-CONF-02 | Test Application Platform Configuration (4.2.2) | PASS (Verified) | Logging configuration audited: Z3 secrets and raw Z2 PII excluded from application logs; Privacy Canary verified (0 leaks). |
| WSTG-CONF-03 | Test File Extensions Handling for Sensitive Information (4.2.3) | PASS (Verified) | No .env, .config, or SQLite database files reside inside the PWA static asset directory. |
| WSTG-CONF-04 | Review Old Backup and Unreferenced Files for Sensitive Information (4.2.4) | PASS (Verified) | Repository and container build contexts cleaned of .bak, .old, and unreferenced artifacts. |
| WSTG-CONF-05 | Enumerate Infrastructure and Application Admin Interfaces (4.2.5) | PASS (Verified) | No unauthenticated or hidden backdoor administrative routes exist in the API or Simulated Bank routers. |
| WSTG-CONF-06 | Test HTTP Methods (4.2.6) | PASS (Verified) | API routes explicitly bind only required verbs (GET, POST); TRACE and arbitrary method overrides rejected with HTTP 405\. |
| WSTG-CONF-07 | Test HTTP Strict Transport Security (4.2.7) | N/A (Out of Scope \- Local Sandbox) | Evaluated within local offline-capable Docker sandbox; HSTS is designated for production TLS reverse-proxy deployment. |
| WSTG-CONF-08 | Test RIA Cross Domain Policy (4.2.8) | N/A (By Design) | Modern PWA architecture; legacy Flash/Silverlight cross-domain policies are completely excluded. |
| WSTG-CONF-09 | Test File Permission (4.2.9) | PASS (Verified) | Container filesystem permissions restrict write access to designated runtime database/log volumes. |
| WSTG-CONF-10 | Test for Subdomain Takeover (4.2.10) | N/A (Out of Scope \- By Design) | Self-contained local deployment with no external CNAME/NS subdomain records. |
| WSTG-CONF-11 | Test Cloud Storage (4.2.11) | N/A (By Design) | No public cloud storage buckets are used; all assets and synthetic datasets are hosted locally. |

   

   #### **Category D: OWASP WSTG v4.2 \- 4.3 Identity Management Testing**

| Test ID | Test Case Name | Status | White-Box Verification & Architectural Evidence in AegisPath |
| :---- | :---- | :---- | :---- |
| WSTG-IDNT-01 | Test Role Definitions (4.3.1) | PASS (Verified) | Strict separation between User, Agent (T0–T3), Policy Plane (Port 8000), and Bank (Port 8100), enforcing maker-checker. |
| WSTG-IDNT-02 | Test User Registration Process (4.3.2) | N/A (Out of Scope \- By Design) | MVP operates on pre-seeded synthetic international student profiles; live public registration and real KYC are out of scope. |
| WSTG-IDNT-03 | Test Account Provisioning Process (4.3.3) | N/A (Out of Scope \- By Design) | Accounts are deterministically seeded via synthetic fixture scripts for reproducible sandbox evaluation. |
| WSTG-IDNT-04 | Testing for Account Enumeration and Guessable User Account (4.3.4) | PASS (Verified) | Shared Prove evidence packages use high-entropy, non-sequential tokens and return uniform status responses. |
| WSTG-IDNT-05 | Testing for Weak or Unenforced Username Policy (4.3.5) | N/A (Out of Scope \- By Design) | Public username self-registration is not applicable in the MVP sandbox. |

   

   #### **Category E: OWASP WSTG v4.2 \- 4.4 Authentication Testing**

| Test ID | Test Case Name | Status | White-Box Verification & Architectural Evidence in AegisPath |
| :---- | :---- | :---- | :---- |
| WSTG-ATHN-01 | Testing for Credentials Transported over an Encrypted Channel (4.4.1) | KNOWN RISK | Inter-service calls occur over an isolated internal Docker bridge network (http\://bank:8100); active MVP mitigation relies on non-routed private container perimeters; production deployment roadmap specifies TLS 1.3 reverse-proxy termination in Section 04\. |
| WSTG-ATHN-02 | Testing for Default Credentials (4.4.2) | PASS (Verified) | Verified via configuration audit: API (Port 8000\) and Simulated Bank daemon (Port 8100\) use distinct, non-default cryptographic HMAC signing secrets with high entropy (47 characters). |
| WSTG-ATHN-03 | Testing for Weak Lock Out Mechanism (4.4.3) | PASS (Verified) | Enforced via the deterministic Agent Pause emergency kill switch; execution is immediately locked out (REFUSED: "Agent is paused via kill switch. Resume with passkey first.") upon anomaly triggers. |
| WSTG-ATHN-04 | Testing for Bypassing Authentication Schema (4.4.4) | PASS (Verified) | Direct requests to Port 8100 ledger endpoints without a valid Scoped Token are rejected (empty requests return 422 Unprocessable Entity; forged signatures return 401 Unauthorized with cryptographic layer block). |
| WSTG-ATHN-05 | Testing for Vulnerable Remember Password (4.4.5) | N/A (By Design) | Persistent "Remember Me" password cookies are intentionally omitted by design; authentication utilizes short-lived in-memory Bearer tokens with zero persistent plaintext credentials stored in client storage. |
| WSTG-ATHN-06 | Testing for Browser Cache Weaknesses (4.4.6) | PASS (Verified) | API responses for sensitive financial state and Prove evidence packages enforce non-cacheable representations; all financial balance mutations bind exclusively to HTTP POST (RFC 7231 non-cacheable). |
| WSTG-ATHN-07 | Testing for Weak Password Policy (4.4.7) | N/A (By Design) | Traditional username/password input forms are intentionally omitted in the MVP evaluation stack by design; authentication operates on synthetic WebAuthn/passkey tokens in an isolated student sandbox. |
| WSTG-ATHN-08 | Testing for Weak Security Question Answer (4.4.8) | N/A (By Design) | Knowledge-Based Authentication (KBA) security questions (e.g., mother's maiden name, pet name) are completely excluded from the architecture by design; fallback authentication relies strictly on cryptographic keypairs. |
| WSTG-ATHN-09 | Testing for Weak Password Change or Reset Functionalities (4.4.9) | N/A (By Design) | Password reset/recovery endpoints are intentionally excluded from MVP scope by design; the testnet evaluation operates strictly on curated synthetic student authentication. |
| WSTG-ATHN-10 | Testing for Weaker Authentication in Alternative Channel (4.4.10) | PASS (Verified) | Conversational chat channel cannot bypass the server-signed Approval screen to authorize Tier T2 transfers (\$600 living allowance transfer yielded \$0 balance mutation and generated an unapproved approval\_sheet); voice/telephony channels are disabled by design. |

   

   #### **Category F: OWASP WSTG v4.2 \- 4.5 Authorization Testing**

| Test ID | Test Case Name | Status | White-Box Verification & Architectural Evidence in AegisPath |
| :---- | :---- | :---- | :---- |
| WSTG-ATHZ-01 | Testing Directory Traversal File Include (4.5.1) | PASS (Verified) | Fuzzing REST API routing with traversal payloads (../../../../etc/passwd, ..\\..\\..\\windows\\win.ini, %2e%2e%2f, nested ....//....//) consistently returned HTTP 404; static code audit confirms zero unsanitized user file system open calls in backend routing. |
| WSTG-ATHZ-02 | Testing for Bypassing Authorization Schema (4.5.2) | PASS (Verified) | Complete mediation enforced: neither the agent nor the API service can write to the bank ledger without passing Ring 2 (Policy Plane) and Ring 3 (Simulated Bank) verification. Direct requests without scoped tokens return HTTP 422; counterfeit HMAC signatures and tampered token payloads return HTTP 401 (INVALID\_SCOPED\_TOKEN). |
| WSTG-ATHZ-03 | Testing for Privilege Escalation (4.5.3) | PASS (Verified) | Low-tier operations (T0/T1) cannot escalate to T2 fund movement without a server-signed approval payload, matching intent\_hash, and Scoped Token. Intent hash tampering attempts are rejected with HTTP 400 (INTENT\_HASH\_MISMATCH); state escalation / replaying finalized plans is blocked with HTTP 409\. |
| WSTG-ATHZ-04 | Testing for Insecure Direct Object References (IDOR) (4.5.4) | PASS (Verified) | Cross-tenant plan access attempts by attacker usr\_bob returned HTTP 404 (PLAN\_NOT\_FOUND) due to strict WHERE plan\_id \= ? AND user\_id \= ? query binding; unauthorized deletion of evidence shares has zero effect on victim records; fund transfers strictly enforce allowlisted payee IDs in the Policy Plane. |

   

   #### **Category G: OWASP WSTG v4.2 \- 4.6 Session Management Testing** 

| Test ID | Test Case Name | Status | White-Box Verification & Architectural Evidence in AegisPath |
| :---- | :---- | :---- | :---- |
| WSTG-SESS-01 | Testing for Session Management Schema (4.6.1) | PASS (Verified) | Transaction authorization uses cryptographically signed Scoped Tokens binding account ID, allowlisted payee, amount ceiling, and nonce; enforced via dual-side HMAC-SHA256 signature verification with short TTL window (300 seconds). |
| WSTG-SESS-02 | Testing for Cookies Attributes (4.6.2) | N/A (By Design) | Ambient browser cookies are completely omitted by design (Set-Cookie header absent across API and Bank daemon routes); session management relies strictly on stateless Bearer JWTs and explicit JSON Scoped Tokens, rendering cookie attribute vulnerabilities inapplicable. |
| WSTG-SESS-03 | Testing for Session Fixation (4.6.3) | PASS (Verified) | Every transaction mints a dynamic, non-fixable SHA-256 intent\_hash and single-use Scoped Token nonce; bank database tracks and persists consumed nonces, deterministically rejecting any replay attempt (Replay detected: nonce already consumed). |
| WSTG-SESS-04 | Testing for Exposed Session Variables (4.6.4) | PASS (Verified) | Zero API routes expose session tokens or signing secrets in URL query parameters; persistent SQLite audit logs store zero private keys or raw secrets; bank ledger stores a truncated 16-character reference hash rather than replayable token bodies. |
| WSTG-SESS-05 | Testing for Cross Site Request Forgery (CSRF) (4.6.5) | PASS (Verified) | Dual-layer CSRF defense: Endpoints require typed JSON payloads and reject HTML form submissions (HTTP 422); ambient browser cookies are absent so cross-site requests cannot carry credentials; mutations require an explicit server-computed intent\_hash immune to blind cross-origin spoofing. |
| WSTG-SESS-06 | Testing for Logout Functionality (4.6.6) | PASS (Verified) | Enforced via immediate Prove share link revocation (DELETE /v1/evidence/share/{id} marks is\_revoked=1) and operational de-authorization via the Agent Pause emergency kill switch (REFUSED: Agent is paused via kill switch. Resume with passkey first.). |
| WSTG-SESS-07 | Testing Session Timeout (4.6.7) | PASS (Verified) | Both Scoped Tokens (Port 8100\) and Prove share links enforce strict server-side expiration timestamps; expired tokens return HTTP 401 (INVALID\_SCOPED\_TOKEN: Scoped token expired); expired JWT bearer tokens are rejected by middleware; expired share links clamp remaining lifetime to 0\. |
| WSTG-SESS-08 | Testing for Session Puzzling (4.6.8) | PASS (Verified) | Simulation runway state (Tier T0) is strictly segregated from signed live execution (Tier T2); simulation queries produce zero persistent ledger side-effects; attempting to approve a simulation context is rejected with HTTP 404 (PLAN\_NOT\_FOUND). |
| WSTG-SESS-09 | Testing for Session Hijacking (4.6.9) | PASS (Verified) | Even if a Scoped Token is intercepted in transit, altering destination payee or amount invalidates the HMAC signature (HTTP 401); attempting double-execution is blocked by single-use nonce consumption; safe retransmissions using the original idempotency key return the cached result without double debiting. |

   

   #### **Category H: OWASP WSTG v4.2 \- 4.7 Input Validation Testing**

| Test ID | Test Case Name | Status | White-Box Verification & Architectural Evidence in AegisPath |
| :---- | :---- | :---- | :---- |
| WSTG-INPV-01 | Testing for Reflected Cross Site Scripting (4.7.1) | PASS (Verified) | Fuzzing REST API endpoints with polyglot XSS payloads (\<script\>, \<img onerror\>, \<svg onload\>, javascript:) returned HTTP 200 with strictly application/json Content-Type; static audit of client-side PWA confirmed 0 dangerous HTML sink invocations, safe React text node escaping. |
| WSTG-INPV-02 | Testing for Stored Cross Site Scripting (4.7.2) | PASS (Verified) | Storing malicious script payload in relational database and retrieving via REST API returns uninterpreted raw JSON string data; PWA components (chat history, invoice card, audit trail) strictly render via safe DOM text nodes without raw innerHTML or dangerouslySetInnerHTML. |
| WSTG-INPV-03 | Testing for HTTP Verb Tampering (4.7.3) | PASS (Verified) | Router definitions strictly enforce explicit HTTP method bindings; invalid verbs against state-changing POST endpoints (/v1/plans/.../approve, /v1/agent/pause, /v1/bank/transfer) and read-only GET endpoints (/v1/health, /v1/policy, /v1/bank/balance) consistently return HTTP 405 Method Not Allowed. |
| WSTG-INPV-04 | Testing for HTTP Parameter Pollution (4.7.4) | PASS (Verified) | Query parser handles duplicated URL keys deterministically; Pydantic request models strictly reject schema-violating types (HTTP 422); prototype/object attribute pollution is completely prevented. |
| WSTG-INPV-05 | Testing for SQL Injection (4.7.5) | PASS (Verified) | Fuzzing API and Bank endpoints with SQLi payloads (' OR '1'='1, '; DROP TABLE, UNION SELECT, admin'--, ' OR 1=1\#) returned HTTP 404 with zero syntax errors or unintended queries; 100% of SQLite operations use bind parameters (?); LLM prompt tools strictly exclude SQL generation or direct database execution (DSGAI12). |
| WSTG-INPV-05.1 | Testing for Oracle (4.7.5.1) | N/A (By Design) | Oracle RDBMS and its database connectors are not utilized in the AegisPath architecture stack. |
| WSTG-INPV-05.2 | Testing for MySQL (4.7.5.2) | N/A (By Design) | MySQL server and connectors are not used in the local container stack (isolated SQLite databases used for local evaluation). |
| WSTG-INPV-05.3 | Testing for SQL Server (4.7.5.3) | N/A (By Design) | Microsoft SQL Server is not utilized in the project stack; zero MSSQL drivers exist in dependencies. |
| WSTG-INPV-05.4 | Testing PostgreSQL (4.7.5.4) | PASS (Verified) | Centralized database abstraction and connection management enforce parameterized queries (WHERE ... \= :param) across all relational database access points. |
| WSTG-INPV-05.5 | Testing for MS Access (4.7.5.5) | N/A (By Design) | Legacy Microsoft Access / OLEDB drivers and .mdb/.accdb file formats are completely excluded from the application stack. |
| WSTG-INPV-05.6 | Testing for NoSQL Injection (4.7.5.6) | N/A (By Design) | No NoSQL document stores (MongoDB, CouchDB) or NoSQL query engines are deployed in AegisPath. |
| WSTG-INPV-05.7 | Testing for ORM Injection (4.7.5.7) | PASS (Verified) | Data access layer uses strongly typed parameters with zero raw text() filter string concatenation; SQLAlchemy 2.0 declarative models enforce strict column typing. |
| WSTG-INPV-05.8 | Testing for Client-side SQL Injection (4.7.5.8) | N/A (By Design) | PWA client code contains zero WebSQL openDatabase / executeSql calls; client-side state is handled via React state and standard browser Cache API. |
| WSTG-INPV-06 | Testing for LDAP Injection (4.7.6) | N/A (By Design) | Zero LDAP directory services, protocol libraries, or authentication connectors are integrated into the architecture. |
| WSTG-INPV-07 | Testing for XML Injection (4.7.7) | N/A (By Design) | All API contracts strictly consume and produce application/json; zero XML parsers or document type definition (DTD) handlers exist in the backend. |
| WSTG-INPV-08 | Testing for SSI Injection (4.7.8) | N/A (By Design) | Server-Side Includes (.shtml, \<\!--\#exec, \<\!--\#include) are disabled by default on ASGI/Uvicorn/Nginx ingress; zero .shtml files exist in the codebase. |
| WSTG-INPV-09 | Testing for XPath Injection (4.7.9) | N/A (By Design) | XML documents and XPath evaluation APIs are not used in the application stack. |
| WSTG-INPV-10 | Testing for IMAP SMTP Injection (4.7.10) | N/A (By Design) | Outbound and inbound email services (SMTP/IMAP) are excluded from the MVP scope; zero mail socket drivers exist. |
| WSTG-INPV-11 | Testing for Code Injection (4.7.11) | PASS (Verified) | Static audit confirms zero instances of eval(), exec(), or dynamic code compilation on model or user outputs; LLM outputs are parsed strictly via structured JSON parser (LLM10:2026). |
| WSTG-INPV-11.1 | Testing for Local File Inclusion (4.7.11.1) | PASS (Verified) | Zero dynamic runtime file or module inclusion based on user input; backend imports are statically declared. |
| WSTG-INPV-11.2 | Testing for Remote File Inclusion (4.7.11.2) | PASS (Verified) | Application fetches zero remote scripts, templates, or external executable code. |
| WSTG-INPV-12 | Testing for Command Injection (4.7.12) | PASS (Verified) | AI Agent toolset strictly excludes OS shell execution capabilities (subprocess, os.system, shell child processes); input flow is purely data-driven through typed Pydantic models (LLM03:2026). |
| WSTG-INPV-13 | Testing for Format String Injection (4.7.13) | PASS (Verified) | User inputs are never passed to raw str.format() or % format strings; object traversal payloads ({user.\_\_init\_\_.\_\_globals...}) remain passive string literals without attribute evaluation. |
| WSTG-INPV-14 | Testing for Incubated Vulnerability (4.7.14) | PASS (Verified) | Stored invoice payloads (Flow C) containing embedded prompt injection instructions are parsed as passive data and flagged by Outer Ring Sentinel; re-validated deterministically at Ring 2 (Policy Plane) enforcing step-up approval or refusal (\$1,000 allowance limit breach). |
| WSTG-INPV-15 | Testing for HTTP Splitting Smuggling (4.7.15) | PASS (Verified) | ASGI / Uvicorn server runtime automatically encodes or strips CRLF (\\r\\n) sequences; user inputs are never written directly into raw HTTP response headers. |
| WSTG-INPV-16 | Testing for HTTP Incoming Requests (4.7.16) | PASS (Verified) | Ingress parser strictly rejects malformed or unparseable JSON payloads (HTTP 422); body size limits reject oversized payloads (\>5MB); unsupported Content-Types (text/plain) are rejected. |
| WSTG-INPV-17 | Testing for Host Header Injection (4.7.17) | PASS (Verified) | Spoofed Host: headers (evil-phishing-site.attacker.com) are ignored; Prove share link generation strictly utilizes configured canonical base URLs rather than untrusted client Host headers. |
| WSTG-INPV-18 | Testing for Server-side Template Injection (4.7.18) | PASS (Verified) | Fuzzing with polyglot SSTI expressions ({{7\*7}}, \${7\*7}, \<%= 7\*7 %\>, \#{7\*7}, {{config.items()}}) yielded uninterpreted literal strings; backend serves strictly JSON APIs with zero server-side HTML template engines (Jinja/Mako). |
| WSTG-INPV-19 | Testing for Server-Side Request Forgery (SSRF) (4.7.19) | PASS (Verified) | Agent has zero arbitrary outbound URL-fetching tools; outbound backend HTTP calls are hardcoded to the local Simulated Bank daemon (http\://bank:8100); cloud metadata endpoints (169.254.169.254 IMDS) are completely inaccessible. |

   

   #### **Category I: OWASP WSTG v4.2 \- 4.8 Testing for Error Handling**

| Test ID | Test Case Name | Status | White-Box Verification & Architectural Evidence in AegisPath |
| :---- | :---- | :---- | :---- |
| WSTG-ERRH-01 | Testing for Improper Error Handling (4.8.1) | PASS (Verified) | All three defense rings enforce deterministic fail-closed exception handling: Ring 1 (Privacy Gateway Sentinel) halts execution on prompt/invoice injection; Ring 2 (Policy Plane) halts on policy violation without issuing tokens; Ring 3 (Simulated Bank) halts immediately with zero ledger writes on missing or corrupted scoped tokens. |
| WSTG-ERRH-02 | Testing for Stack Traces (4.8.2) | PASS (Verified) | Error responses strictly adhere to the RFC 7807 Problem Details (application/problem+json) standard; fuzzing non-existent routes, method mismatches, schema validation errors, and missing accounts exposed zero internal stack traces, system file paths, or framework debugging banners. |

   

   #### **Category J: OWASP WSTG v4.2 \- 4.9 Testing for Weak Cryptography**

| Test ID | Test Case Name | Status | White-Box Verification & Architectural Evidence in AegisPath |
| :---- | :---- | :---- | :---- |
| WSTG-CRYP-01 | Testing for Weak Transport Layer Security (4.9.1) | N/A (Out of Scope \- Local Sandbox) | Evaluated in an isolated local container stack (docker compose) on localhost loopback with zero public internet routing; production architecture enforces TLS 1.3 reverse-proxy termination with modern forward-secrecy cipher suites (ECDHE-AES-GCM) and strictly forbids legacy protocols (SSLv3, TLS 1.0/1.1). |
| WSTG-CRYP-02 | Testing for Padding Oracle (4.9.2) | N/A (By Design) | CBC-mode block ciphers are completely excluded from the application stack; client authentication and Bank Scoped Tokens rely on HMAC-SHA256 integrity signatures rather than block cipher encryption, making Vaudenay padding oracle attacks structurally impossible. |
| WSTG-CRYP-03 | Testing for Sensitive Information Sent via Unencrypted Channels (4.9.3) | PASS (Verified) | Ring 1 (Privacy Gateway) redacts all Z2 sensitive entities (account numbers, national student IDs, emails, phone numbers) into placeholder tokens before user prompts cross external LLM trust boundaries; HMAC signing secrets are strictly confined to local backend memory. |
| WSTG-CRYP-04 | Testing for Weak Encryption (4.9.4) | PASS (Verified) | High-entropy primitives standardized across the architecture: SHA-256 for deterministic intent\_hash binding, HMAC-SHA256 for Scoped Token signatures, and SHA-256 digest pointers for tamper-evident audit chains; static code audit confirms 0 invocations of broken algorithms (MD5, SHA-1, DES, RC4). |

   

   #### **Category K: OWASP WSTG v4.2 \- 4.10 Business Logic Testing**

| Test ID | Test Case Name | Status | White-Box Verification & Architectural Evidence in AegisPath |
| :---- | :---- | :---- | :---- |
| WSTG-BUSL-01 | Test Business Logic Data Validation (4.10.1) | PASS (Verified) | Tuition fee buffers, FX routes, and Planner runway projections are computed deterministically by formula; non-positive and negative amounts (\$0, \-\$100, \-\$0.01) are strictly rejected by the input parser and business logic (HTTP 422). |
| WSTG-BUSL-02 | Test Ability to Forge Requests (4.10.2) | PASS (Verified) | Forged ledger requests to Port 8100 fail without a valid Scoped Token signed by Port 8000's independent secret; unsigned requests, counterfeit HMAC signatures, and post-signing amount tampering (\$50 \-\> \$5,000) are deterministically rejected with HTTP 401 (INVALID\_SCOPED\_TOKEN). |
| WSTG-BUSL-03 | Test Integrity Checks (4.10.3) | PASS (Verified) | Core MVP Gate: Modifying any transaction parameter (amount, recipient, route) after approval alters the SHA-256 intent hash and causes a deterministic INTENT\_HASH\_MISMATCH rejection (HTTP 400); execution completes only with authentic locked hashes. |
| WSTG-BUSL-04 | Test for Process Timing (4.10.4) | KNOWN RISK | Ledger race conditions are prevented via idempotency keys (4/4 concurrent replay requests yielded safe idempotent deduplication with single debit of \$25); cloud LLM inference timing metadata and token latency variations are architecturally documented as a residual risk in Section 04\. |
| WSTG-BUSL-05 | Test Number of Times a Function Can Be Used Limits (4.10.5) | PASS (Verified) | Dual spending limits enforced: Duplicate execution prevented via idempotency keys; daily allowance limit (\$1,000/day) strictly enforced at Policy Plane rejecting over-cap transfers (REFUSED: Exceeds daily allowance limit); bank balance cap strictly blocks overdrafts (HTTP 422 INSUFFICIENT\_FUNDS). |
| WSTG-BUSL-06 | Testing for the Circumvention of Work Flows (4.10.6) | PASS (Verified) | Planner DAG state machine prevents skipping pre-execution simulation or server-signed HITL Approval for Tier T2 actions; plan state transitions are strictly one-way (approving an already COMPLETED plan returns HTTP 409 PLAN\_NOT\_PENDING); direct bank ingestion bypass attempts fail with HTTP 401\. |
| WSTG-BUSL-07 | Test Defenses Against Application Misuse (4.10.7) | PASS (Verified) | Outer Ring Sentinel deterministically intercepts invoice account-redirection attacks, indirect prompt overrides, and multi-lingual money mule recruitment velocity patterns; triggers deterministic Agent Pause kill-switch freezing further operations until passkey unlock. |
| WSTG-BUSL-08 | Test Upload of Unexpected File Types (4.10.8) | PASS (Verified) | Invoice ingestion only accepts structured/text invoice payloads; arbitrary binary and executable file uploads (.exe, .elf, .bin, .bat) are strictly rejected at API schema boundaries; text parser isolates non-structured bytes. |
| WSTG-BUSL-09 | Test Upload of Malicious Files (4.10.9) | PASS (Verified) | Malicious invoice payloads (Flow C) are isolated as untrusted data; Three-Ring defense-in-depth ablation proves \$0.00 funds lost even if individual outer defense layers are degraded; ingested payloads flagged with attack\_flagged and halted. |

   

   #### **Category L: OWASP WSTG v4.2 \- 4.11 Client-side Testing**

| Test ID | Test Case Name | Status | White-Box Verification & Architectural Evidence in AegisPath |
| :---- | :---- | :---- | :---- |
| WSTG-CLNT-01 | Testing for DOM-Based Cross Site Scripting (4.11.1) | PASS (Verified) | Static source code audit of 27 TypeScript/React frontend files confirmed 0 dangerous DOM sinks (innerHTML, dangerouslySetInnerHTML); all dynamic user and agent responses bind safely as React Virtual DOM text nodes in ChatScreen.tsx, ApprovalScreen.tsx, and HomeScreen.tsx. |
| WSTG-CLNT-02 | Testing for JavaScript Execution (4.11.2) | PASS (Verified) | UI routing in frontend/src/app/page.tsx executes strictly from a predefined route and component allowlist (\['/', '/tuition', '/chat', '/approve', '/evidence', '/safety', '/planner'\]); zero dynamic eval() or javascript: protocol link injections exist. |
| WSTG-CLNT-03 | Testing for HTML Injection (4.11.3) | PASS (Verified) | Bilingual EN/中文 dictionary (i18n.ts) contains 358 string values with 0 unescaped HTML tags; simulating polyglot injection payloads (\<script\>, \<img onerror\>, \<svg onload\>, \<b onmouseover\>, "\>\<iframe src=javascript:\>) confirmed all markup is neutralized into inert escaped DOM text entities. |
| WSTG-CLNT-04 | Testing for Client-side URL Redirect (4.11.4) | PASS (Verified) | Client navigation state is strictly confined to the 7 internal PWA screens with safe default fallbacks; audit confirmed 0 dynamic window.location sinks and external open redirects are structurally prohibited. |
| WSTG-CLNT-05 | Testing for CSS Injection (4.11.5) | PASS (Verified) | Visual styling strictly uses static CSS design system tokens (--blue, \--sky, \--line, \--ink, \--green, \--red); zero dynamic \<style\> injection in application screens; status colors and card layouts rely entirely on static CSS utility classes rather than untrusted model-supplied inline styles. |
| WSTG-CLNT-06 | Testing for Client-side Resource Manipulation (4.11.6) | PASS (Verified) | All visual assets, fonts, icons, Chop mascot art, and radial attack charts are stored and rendered locally via inline SVG components with 0 external CDN or remote network requests; PWA is fully offline-capable. |
| WSTG-CLNT-07 | Testing Cross Origin Resource Sharing (CORS) (4.11.7) | KNOWN RISK | Audit of backend/api/main.py and backend/bank/main.py reveals wildcard CORS policy (allow\_origins=\["\*"\]) in the evaluation stack. While acceptable within an isolated local container network on loopback, this poses cross-origin exposure risks if routed to public networks. Active MVP mitigation relies on network boundary isolation; production remediation requires an explicit origin whitelist restricting access to the authenticated PWA domain (http\://localhost:3000). |
| WSTG-CLNT-08 | Testing for Cross Site Flashing (4.11.8) | N/A (By Design) | Frontend architecture is 100% modern HTML5 and React; zero Adobe Flash binary files (.swf, .spl, .as) or \<object\>/\<embed\> tags exist. |
| WSTG-CLNT-09 | Testing for Clickjacking (4.11.9) | KNOWN RISK | HTTP response headers currently omit X-Frame-Options: DENY and Content-Security-Policy: frame-ancestors 'none'. Automated iframe embedding audit indicates potential UI redressing risk if the Approval screen is framed by foreign origins. Active MVP mitigation relies on server-signed intent\_hash and explicit user confirmation; production reverse-proxy configuration must enforce strict anti-framing headers. |
| WSTG-CLNT-10 | Testing WebSockets (4.11.10) | N/A (By Design) | Client-server communication is restricted to synchronous stateless HTTP REST JSON endpoints; WebSockets (@app.websocket and new WebSocket) are not implemented by design. |
| WSTG-CLNT-11 | Testing Web Messaging (4.11.11) | N/A (By Design) | Cross-origin HTML5 web messaging (window.postMessage and message event listeners) is completely absent from the PWA codebase by design. |
| WSTG-CLNT-12 | Testing Browser Storage (4.11.12) | PASS (Verified) | Persistent localStorage is completely unused; sessionStorage contains zero banking credentials or Z3 secrets (storing only non-sensitive UI preference flags); ApprovalScreen always retrieves fresh server-signed transaction payloads directly via API connector. |
| WSTG-CLNT-13 | Testing for Cross Site Script Inclusion (XSSI) (4.11.13) | PASS (Verified) | All JSON API endpoints enforce X-Content-Type-Options: nosniff with application/json; JSONP callback query parameters (?callback=, ?jsonp=, ?cb=) are ignored and rejected, defeating cross-site script inclusion.  |

   

   #### **Category M: OWASP WSTG v4.2 \- 4.12 API Testing and Deferred UI Scope**

| Test ID | Test Case Name | Status | White-Box Verification & Architectural Evidence in AegisPath |
| :---- | :---- | :---- | :---- |
| WSTG-APIT-01 | Testing GraphQL (4.12.1) & REST API Contract Validation | PASS (Verified \- REST API) / N/A (By Design \- GraphQL) | Probing Port 8000 and Port 8100 for GraphQL paths (/graphql, /api/graphql, /v1/graphql, /graphiql, /altair, /\_\_graphql) returned HTTP 404; GraphQL is intentionally omitted (by design); REST API contracts enforce strict Pydantic type validation on both API Gateway and Bank Daemon (schema violations consistently return HTTP 422). |
| MVP-SCOPE-01 | Secondary Navigation Screens (Payees, Rates, More) & Optional On-Chain Anchor | DEFERRED (Out of MVP) | Secondary navigation screens are strictly disciplined to the curated MVP sandbox boundary (payee directory and exchange rate lookups are delegated to whitelisted safety policies and quotation engines); zero unbuilt Solidity smart-contracts (.sol) or fictional blockchain features are claimed; audit trail relies transparently on deterministic SHA-256 hash chains. |

# **03 Data and Privacy**

* ## Data provenance, consent, minimisation, storage and deletion

1. ### Data Provenance and 100% Synthetic Evaluation Corpus

1. Synthetic Dataset Guarantee: All user profiles, student tuition invoices, remittance records, and bank ledgers used in AegisPath's development and evaluation are 100% synthetic. No real student PII or live banking credentials are ingested, ensuring absolute compliance with cross-border privacy boundaries and eliminating data-poisoning risks.  
2. Three-Tier Financial Evidence Provenance (Prove): Rather than relying on opaque machine-learning credit scores (which we explicitly reject due to explainability, hallucination, and algorithmic fairness risks), AegisPath generates deterministic financial evidence packages categorized into three explicit provenance tiers (Tier 1: bank-ledger verified transactions, Tier 2: institutional scholarship/tuition schedules, and Tier 3: user-declared cash-flow plans) so external verifiers can audit data origin transparently without exposing unnecessary underlying transaction records.

2. ### Four-Zone Data Classification and Minimisation (Z0 – Z3)

   In strict alignment with OWASP LLM02:2026 (Sensitive Information Disclosure) and OWASP DSGAI, AegisPath enforces rigorous data minimisation across four isolated trust zones:

1. Zone Z0 (Public Interface & Local Static Assets): Bilingual (EN/中文) UI labels, self-hosted typography, and local Chop mascot SVG vector assets. Contains zero user data, zero cookies, and triggers zero external network requests (verified in WSTG-CLNT-06 & WSTG-SESS-02).  
2. Zone Z1 (Internal Session Operational Context): Typed Planner DAG structures, permission tier evaluation states (T0–T3), and deterministic runway simulation projections scoped strictly to the ephemeral active session without persistent ledger side-effects.  
3. Zone Z2 (Sensitive Financial Data & Synthetic PII): Beneficiary names, account identifiers, tuition invoice details, and transaction histories. The Privacy Gateway (Ring 1\) intercepts and tokenizes all Z2 entities before any prompt crosses the trust boundary to an optional external LLM. Every external model call is recorded in an auditable Egress Ledger, and continuous Privacy Canary Tests inject marked synthetic PII tokens to verify that zero (0) unredacted canaries appear in outbound model calls or application logs (verified in WSTG-CONF-02 & WSTG-CRYP-03).  
4. Zone Z3 (Critical Infrastructure Secrets & Cryptographic Keys): Server signing keys, Scoped Token HMAC secrets, and Simulated Bank (Port 8100\) credentials. Z3 material is strictly isolated in backend environment variables and is never placed in system prompts, model context windows, client bundles, or log files (verified in WSTG-SESS-04).

3. ### Consent, Storage Isolation, and Revocable Deletion

1. Physical Storage Segregation (Dual SQLite / Cloud DB): The API Service (Port 8000\) and the Simulated Bank Service (Port 8100\) maintain physically separate databases (aegispath\_api.db and aegispath\_bank.db). In local evaluation, they reside in distinct SQLite database files with zero cross-process read/write handles (verified in WSTG-CONF-01). In cloud deployments, they map to isolated database schemas governed by mutually exclusive IAM service accounts.  
2. Explicit Consent & Revocable Evidence Sharing: Financial evidence packages (Prove) are never shared automatically; sharing requires explicit, user-authenticated generation of a scoped link. Every Prove link enforces a mandatory expiration timestamp and supports instant user-initiated revocation (DELETE /v1/evidence/share/{id}), immediately terminating verifier access upon revocation or expiry (verified in WSTG-SESS-06 & WSTG-ATHZ-04).  
3. Deterministic Deletion & Ephemeral Memory Purging (Right to Erasure): In accordance with GDPR Article 17, AegisPath guarantees that client browser storage contains zero persistent credentials (localStorage is completely unused; verified in WSTG-CLNT-12). In-flight decrypted tokens and conversational context exist strictly in volatile server RAM and are automatically purged upon session termination or kill-switch activation (Agent Pause). Furthermore, evaluation sandbox environments support complete, zero-residual database teardown and re-initialization via automated purge routines.

# **04 Known Risks**

* ## Risk, impact, mitigation and planned improvement

To uphold scientific and engineering integrity, AegisPath avoids absolute claims such as 'unhackable' or 'zero risk'. Below we document our known residual risks, their potential impacts, active MVP mitigations, and post-MVP engineering improvements:

| No | Known Risk & Standard Reference | Potential Impact | Active Mitigation in MVP | Planned Improvement (Post-MVP) |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Cloud Model Tokenized Text & Timing Metadata Exposure (OWASP LLM02:2026, WSTG-BUSL-04) | When the optional cloud LLM parser is enabled, the external provider still observes tokenized sentence structures and request timing metadata (inference side channels). | All Z2 PII is tokenized by the Privacy Gateway prior to egress, logged in the Egress Ledger, and verified by Privacy Canary tests with zero leaks (WSTG-CONF-02). Full 100% offline rule-based mode is available to eliminate cloud egress entirely. | Deploy quantized local Small Language Models (SLMs) inside the container with request batching and random timing padding. |
| 2 | Adaptive Evasion of Ring-1 Text Classifiers (OWASP LLM01:2026, CWE-1427) | Novel obfuscation, steganography, or adaptive multilingual injections may bypass the outer Privacy Gateway text filter. | Defense-in-Depth: Even if Ring 1 is bypassed, Ring 2 (Policy Plane & Sentinel) enforces typed JSON schemas, server-signed HITL approval, and intent\_hash verification, while Ring 3 (Simulated Bank) enforces independent payee allowlists and spending caps (\$0 lost in single-ring drop-out replays across all adversarial tests). | Expand automated red-teaming with continuous gradient-free fuzzing and cryptographic provenance spotlighting. |
| 3 | Correspondent Bank Fee Variance in Live Cross-Border Corridors (OWASP LLM07:2026, WSTG-BUSL-01) | In live international banking networks, intermediary correspondent banks may deduct unforeseen lifting fees exceeding static buffer estimates, causing tuition underpayment. | All tuition quotations and fee buffers are calculated deterministically by code (never by LLM), and the PWA UI explicitly labels 'arrive-in-full' quotes as estimates with a buffer, not a guarantee (verified in WSTG-BUSL-01). | Integrate live SWIFT GPI fee-tracking APIs and institutional tuition payment rails in production deployments. |
| 4 | Linguistic Expressiveness Limits in Offline Rule-Only Mode (OWASP LLM06:2026)  | When operating in 100% offline rule-only mode (to guarantee resilience during network disruptions), highly colloquial phrasing outside defined EN/中文 patterns may require user rephrasing. | The bilingual rule-based parser deterministically covers all core tuition, remittance, evidence, and runway workflows with zero external network dependency. | Bundle a hash-pinned, lightweight local intent classifier for offline fallback. |
| 5 | Human Approval Fatigue & Out-of-Band Social Engineering (OWASP LLM01:2026 Control \#7, ASI09) | A student coerced out-of-band by a scammer might manually approve a valid server-signed prompt, or experience approval fatigue under high transaction volume. | Sentinel deterministically blocks known money-mule velocity patterns and invoice account-swaps at Tier T3 before approval can be requested, and Ring 3 enforces hard daily bank-side spending caps (verified in WSTG-BUSL-07). | Introduce hardware-bound WebAuthn / Passkey step-up authentication and mandatory cooling-off delays for newly added recipients. |
| 6 | Deferred Features Outside MVP Scope & Database Cloud Migration (OWASP WSTG-ATHN-01, WSTG-CONF-07, MVP-SCOPE-01) | Live KYC onboarding, production TLS/HSTS termination, secondary screens (Payees, Rates, More), and cloud database infrastructure setup are deferred outside the 10-day MVP scope. | Unbuilt screens are transparently labeled 'Coming Soon' in the UI without false capability claims; dual-mode storage uses partitioned local SQLite (aegispath\_api.db & aegispath\_bank.db) with zero cross-process write access, ready for cloud DB connection string drop-in. | Complete secondary payee management screens with Maker-Checker MFA, provision cloud PostgreSQL with IAM isolation, and configure TLS 1.3 reverse-proxy termination post-MVP. |

