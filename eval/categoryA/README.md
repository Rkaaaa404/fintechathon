# Category A: OWASP Top 10 for LLM Applications (2026)

Pengujian keamanan model bahasa besar (LLM) dan agen AI otonom AegisPath berdasarkan standar OWASP LLM Top 10 edisi 2026. Fokus pada pengujian Ring 1 (Privacy Gateway / Sentinel), Ring 2 (Policy Plane Complete Mediation), dan mitigasi risiko tokenisasi cloud.

Direktori ini berisi skrip pengujian mandiri (*1 Vulnerability / Test Case = 1 File*) yang dapat dijalankan secara independen maupun secara bersamaan menggunakan runner otomatis `run_all.py`.

---

## 1. Daftar Skrip Pengujian & Penjelasan Teknis

Berikut adalah rincian skrip pengujian keamanan dalam kategori ini:

| Berkas Skrip | Test ID | Status Evaluasi | Tujuan & Cakupan Pengujian Arsitektural |
| :--- | :--- | :---: | :--- |
| [`test_llm01_prompt_injection.py`](./test_llm01_prompt_injection.py) | **LLM01:2026 - Prompt Injection** | `PASS (Verified)` | External invoices treated strictly as passive data; Ring 1 (Privacy Gateway) filters instruction patterns fail-closed; Ring 2 enforces typed JSON schemas & intent_hash; Ring 3 enforces independent bank allowlists. |
| [`test_llm02_sensitive_info.py`](./test_llm02_sensitive_info.py) | **LLM02:2026 - Sensitive Information Disclosure** | `KNOWN RISK (Mitigated)` | Zones Z0–Z3 enforced; Z2 PII is tokenized before egress and logged in Egress Ledger (0 leaks in Privacy Canary tests); Z3 secrets never enter prompts or logs. Residual cloud timing/tokenized structure risk documented in Section 04. |
| [`test_llm03_excessive_agency.py`](./test_llm03_excessive_agency.py) | **LLM03:2026 - Excessive Agency** | `PASS (Verified)` | Complete mediation via Policy Plane (T0–T3), server-signed HITL approval, intent_hash verification, and physically separate Simulated Bank (Port 8100) requiring Scoped Tokens. |
| [`test_llm04_supply_chain.py`](./test_llm04_supply_chain.py) | **LLM04:2026 - Supply Chain** | `PASS (Verified)` | Pinned dependencies in lockfiles, reproducible docker compose build, and 100% self-hosted fonts, icons, and SVG assets with zero external CDN calls. |
| [`test_llm05_data_model_poisoning.py`](./test_llm05_data_model_poisoning.py) | **LLM05:2026 - Data and Model Poisoning** | `N/A (By Design)` | AegisPath performs no ML model pre-training, fine-tuning, or continuous learning; operates on deterministic rules and 100% synthetic datasets. |
| [`test_llm06_unbounded_consumption.py`](./test_llm06_unbounded_consumption.py) | **LLM06:2026 - Unbounded Consumption** | `PASS (Verified)` | Bounded Planner DAG step counts, expiring Scoped Tokens, Agent Pause circuit breaker, and graceful degradation to 100% offline bilingual rule-parser mode. |
| [`test_llm07_misinformation.py`](./test_llm07_misinformation.py) | **LLM07:2026 - Misinformation** | `KNOWN RISK (Mitigated)` | All tuition quotes, fee buffers, cash-flow summaries, and runway simulations are computed by deterministic code (never by LLM). UI explicitly labels quotes as estimates with buffers, not guarantees. |
| [`test_llm08_hidden_context.py`](./test_llm08_hidden_context.py) | **LLM08:2026 - Hidden Context Exposure** | `PASS (Verified)` | Designed under the assumption that system prompts are discoverable; zero Z3 secrets or credentials in prompts; authorization enforced deterministically outside the LLM. |
| [`test_llm09_vector_embedding.py`](./test_llm09_vector_embedding.py) | **LLM09:2026 - Vector and Embedding Weaknesses** | `N/A (By Design)` | Architecture uses deterministic rule parsing and structured relational/ledger stores; no vector databases or embedding similarity search are used. |
| [`test_llm10_improper_output.py`](./test_llm10_improper_output.py) | **LLM10:2026 - Improper Output Handling** | `PASS (Verified)` | All model outputs are validated against strict typed JSON schemas; PWA renders exclusively from a component allowlist with zero automatic external URL/image fetching. |
| [`run_all.py`](./run_all.py) | **ALL TESTS** | `RUNNER` | Mengeksekusi seluruh 10 skrip pengujian secara berurutan dan mencetak matriks verifikasi formal. |

---

## 2. Cara Menjalankan Skrip Pengujian

### A. Menjalankan Seluruh Uji Sekaligus (Batch Runner)
Jalankan perintah berikut di PowerShell atau Command Prompt:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryA
python run_all.py
```

### B. Menjalankan Skrip Spesifik Secara Individual
Anda dapat menguji kasus tertentu secara terisolasi, misalnya:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryA
python test_llm01_prompt_injection.py
```

---

## 3. Hasil Pengujian Real-Time (Execution Log & Verification Matrix)

Berikut adalah rekaman log eksekusi terminal nyata saat seluruh pengujian dalam kategori ini dijalankan:

```text
================================================================================
 AegisPath Category A: OWASP Top 10 for LLM Applications 2026
 Executing 10 Individual Verification Test Suites
================================================================================

--> Running LLM01:2026: Prompt Injection (test_llm01_prompt_injection.py)...
    [OK] Execution finished successfully.
--> Running LLM02:2026: Sensitive Information Disclosure (test_llm02_sensitive_info.py)...
    [OK] Execution finished successfully.
--> Running LLM03:2026: Excessive Agency (test_llm03_excessive_agency.py)...
    [OK] Execution finished successfully.
--> Running LLM04:2026: Supply Chain (test_llm04_supply_chain.py)...
    [OK] Execution finished successfully.
--> Running LLM05:2026: Data and Model Poisoning (test_llm05_data_model_poisoning.py)...
    [OK] Execution finished successfully.
--> Running LLM06:2026: Unbounded Consumption (test_llm06_unbounded_consumption.py)...
    [OK] Execution finished successfully.
--> Running LLM07:2026: Misinformation (test_llm07_misinformation.py)...
    [OK] Execution finished successfully.
--> Running LLM08:2026: Hidden Context Exposure (test_llm08_hidden_context.py)...
    [OK] Execution finished successfully.
--> Running LLM09:2026: Vector and Embedding Weaknesses (test_llm09_vector_embedding.py)...
    [OK] Execution finished successfully.
--> Running LLM10:2026: Improper Output Handling (test_llm10_improper_output.py)...
    [OK] Execution finished successfully.

================================================================================
 CATEGORY A VERIFICATION MATRIX TABLE
================================================================================
| TEST ID      | VULNERABILITY NAME               | STATUS                   |
--------------------------------------------------------------------------------
| LLM01:2026   | Prompt Injection                 | PASS (Verified)          |
| LLM02:2026   | Sensitive Information Disclosure | KNOWN RISK               |
| LLM03:2026   | Excessive Agency                 | PASS (Verified)          |
| LLM04:2026   | Supply Chain                     | PASS (Verified)          |
| LLM05:2026   | Data and Model Poisoning         | N/A                      |
| LLM06:2026   | Unbounded Consumption            | PASS (Verified)          |
| LLM07:2026   | Misinformation                   | KNOWN RISK               |
| LLM08:2026   | Hidden Context Exposure          | PASS (Verified)          |
| LLM09:2026   | Vector and Embedding Weaknesses  | N/A                      |
| LLM10:2026   | Improper Output Handling         | PASS (Verified)          |
--------------------------------------------------------------------------------
 OVERALL RESULT: ALL 10 TESTS VERIFIED (PASS)
================================================================================
```

---

*Laporan pengujian ini adalah bagian dari Security Self-Assessment AegisPath untuk FinTechathon 2026 (Shenzhen).*
