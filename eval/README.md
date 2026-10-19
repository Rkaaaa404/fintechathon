# AegisPath Security Evaluation & Verification Suite (`fintechathon/eval/`)

Dedicated security evaluation and testing harness for **Section 02 (Security Tests)** of the FinTechathon 2026 Security Self-Assessment report.

> **Isolation Notice:** This folder is completely self-contained at the root of `fintechathon/`, parallel to `frontend/` and `backend/`. It isolates all security benchmarks, adversarial attack tests, and evaluation scripts away from the core web application (`frontend/`) and API runtime (`backend/api/`, `backend/bank/`). Modifying or running files in this folder does NOT alter or break the web frontend or backend microservices.

---

## Folder Contents

| File | Purpose & Test Mapping |
| :--- | :--- |
| `attacks.py` | **Suite 1: Adversarial Prompt Injection Suite** (12 attack families x 10 variants = 120 attacks) + Three-Ring Defense Ablation benchmark. |
| `verify_suites.py` | **Suites 2, 3, and 4 Verification Harness**: Covers Student Fraud/Social Engineering (Sentinel), Privilege Escalation (`intent_hash` & Scoped Token), and Resilience/Recovery (Agent Pause, offline rule parser). |
| `verify_spotlight.py` | **Section 02.4 Spotlight Verification Harness**: Directly tests the 4 Known Risks + 1 Deferred Scope item (`LLM02`, `LLM07`, `WSTG-ATHN-01`, `WSTG-BUSL-04`, `MVP-SCOPE-01`). |
| `verify_category_a.py` | **Category A Verification Harness**: Verifies all 10 OWASP Top 10 for LLM Applications 2026 test cases (`LLM01` through `LLM10`). |
| `reports/latest.json` | Hash-locked empirical benchmark results, Wilson 95% confidence intervals, and per-family metrics generated from automated evaluation runs. |

---

## How to Run the Tests

### 1. Run the Full 120-Attack Benchmark Suite (Suite 1 & Ablation Table)
```powershell
cd fintechathon/eval
python attacks.py
```
*Generates the Three-Ring Ablation table and saves the empirical data to `reports/latest.json`.*

### 2. Run the Verification Harness for Suites 2, 3, and 4
```powershell
cd fintechathon/eval
python verify_suites.py
```
*Executes automated checks for Sentinel regex anti-fraud filters, intent hash tampering prevention, bank scoped token enforcement, and agent pause resilience.*

### 3. Run the Spotlight Verification Harness (Section 02.4 Known Risks & Deferred Scope)
```powershell
cd fintechathon/eval
python verify_spotlight.py
```
*Tests PII scrubbing, deterministic fee buffer calculations, Docker bridge isolation, bank idempotency cache, and UI 'Coming Soon' scope discipline.*

### 4. Run the Category A Verification Harness (OWASP LLM Top 10 2026)
```powershell
cd fintechathon/eval
python verify_category_a.py
```
*Audits and tests all 10 LLM security cases against the deterministic architecture.*


