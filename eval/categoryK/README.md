# Category K: OWASP WSTG v4.2 — 4.10 Business Logic Testing (BUSL)

Pengujian logika bisnis finansial: validasi boundary nominal transaksi (angka negatif & nol), pencegahan forging request, integritas intent_hash, penanganan timing side-channel, batas limit harian ($1,000 allowance), pencegahan circumvention, dan upload file.

Direktori ini berisi skrip pengujian mandiri (*1 Vulnerability / Test Case = 1 File*) yang dapat dijalankan secara independen maupun secara bersamaan menggunakan runner otomatis `run_all.py`.

---

## 1. Daftar Skrip Pengujian & Penjelasan Teknis

Berikut adalah rincian skrip pengujian keamanan dalam kategori ini:

| Berkas Skrip | Test ID | Status Evaluasi | Tujuan & Cakupan Pengujian Arsitektural |
| :--- | :--- | :---: | :--- |
| [`test_wstg_busl_01_business_data_validation.py`](./test_wstg_busl_01_business_data_validation.py) | **WSTG-BUSL-01 - Test Business Logic Data Validation (4.10.1)** | `PASS (Verified)` | Tuition fee buffers, FX routes, cash-flow summaries, and Planner runway projections are validated and computed deterministically by code, rejecting negative/zero amounts. |
| [`test_wstg_busl_02_ability_to_forge_requests.py`](./test_wstg_busl_02_ability_to_forge_requests.py) | **WSTG-BUSL-02 - Test Ability to Forge Requests (4.10.2)** | `PASS (Verified)` | Forged ledger requests to Port 8100 fail without a valid Scoped Token signed by Port 8000's independent secret. |
| [`test_wstg_busl_03_integrity_checks.py`](./test_wstg_busl_03_integrity_checks.py) | **WSTG-BUSL-03 - Test Integrity Checks (4.10.3)** | `PASS (Verified)` | Core MVP Gate: Modifying any transaction parameter after approval causes a deterministic intent_hash mismatch rejection. |
| [`test_wstg_busl_04_process_timing.py`](./test_wstg_busl_04_process_timing.py) | **WSTG-BUSL-04 - Test for Process Timing (4.10.4)** | `KNOWN RISK` | Ledger race conditions are prevented via idempotency keys; cloud LLM request timing metadata is documented as a residual risk in Section 04. |
| [`test_wstg_busl_05_function_limits.py`](./test_wstg_busl_05_function_limits.py) | **WSTG-BUSL-05 - Test Number of Times a Function Can Be Used Limits (4.10.5)** | `PASS (Verified)` | Enforced via idempotency keys (preventing duplicate execution) and cumulative spending caps at both Policy Plane and Simulated Bank. |
| [`test_wstg_busl_06_circumvention_workflows.py`](./test_wstg_busl_06_circumvention_workflows.py) | **WSTG-BUSL-06 - Testing for the Circumvention of Work Flows (4.10.6)** | `PASS (Verified)` | Planner DAG state machine prevents skipping pre-execution simulation or server-signed HITL Approval for Tier T2 actions. |
| [`test_wstg_busl_07_defenses_against_misuse.py`](./test_wstg_busl_07_defenses_against_misuse.py) | **WSTG-BUSL-07 - Test Defenses Against Application Misuse (4.10.7)** | `PASS (Verified)` | Sentinel module deterministically blocks invoice account-swap attempts and money-mule recruitment velocity patterns, triggering Agent Pause. |
| [`test_wstg_busl_08_upload_unexpected_file_types.py`](./test_wstg_busl_08_upload_unexpected_file_types.py) | **WSTG-BUSL-08 - Test Upload of Unexpected File Types (4.10.8)** | `PASS (Verified)` | Invoice ingestion only accepts structured/text invoice payloads and rejects executable binary uploads. |
| [`test_wstg_busl_09_upload_malicious_files.py`](./test_wstg_busl_09_upload_malicious_files.py) | **WSTG-BUSL-09 - Test Upload of Malicious Files (4.10.9)** | `PASS (Verified)` | Malicious invoice payloads (Flow C) are isolated as untrusted data and stopped across all three |
| [`run_all.py`](./run_all.py) | **ALL TESTS** | `RUNNER` | Mengeksekusi seluruh 9 skrip pengujian secara berurutan dan mencetak matriks verifikasi formal. |

---

## 2. Cara Menjalankan Skrip Pengujian

### A. Menjalankan Seluruh Uji Sekaligus (Batch Runner)
Jalankan perintah berikut di PowerShell atau Command Prompt:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryK
python run_all.py
```

### B. Menjalankan Skrip Spesifik Secara Individual
Anda dapat menguji kasus tertentu secara terisolasi, misalnya:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryK
python test_wstg_busl_01_business_data_validation.py
```

---

## 3. Hasil Pengujian Real-Time (Execution Log & Verification Matrix)

Berikut adalah rekaman log eksekusi terminal nyata saat seluruh pengujian dalam kategori ini dijalankan:

```text
========================================================================================
 AegisPath Category K: OWASP WSTG v4.2 — 4.10 Business Logic Testing
 Executing 9 Individual Verification Test Suites
========================================================================================

--> Running WSTG-BUSL-01: Test Business Logic Data Validation (4.10.1) (test_wstg_busl_01_business_data_validation.py)...
    [OK] Execution finished successfully.
--> Running WSTG-BUSL-02: Test Ability to Forge Requests (4.10.2) (test_wstg_busl_02_ability_to_forge_requests.py)...
    [OK] Execution finished successfully.
--> Running WSTG-BUSL-03: Test Integrity Checks (4.10.3) (test_wstg_busl_03_integrity_checks.py)...
    [OK] Execution finished successfully.
--> Running WSTG-BUSL-04: Test for Process Timing (4.10.4) (test_wstg_busl_04_process_timing.py)...
    [OK] Execution finished successfully.
--> Running WSTG-BUSL-05: Test Number of Times a Function Can Be Used Limits (4.10.5) (test_wstg_busl_05_function_limits.py)...
    [OK] Execution finished successfully.
--> Running WSTG-BUSL-06: Testing for the Circumvention of Work Flows (4.10.6) (test_wstg_busl_06_circumvention_workflows.py)...
    [OK] Execution finished successfully.
--> Running WSTG-BUSL-07: Test Defenses Against Application Misuse (4.10.7) (test_wstg_busl_07_defenses_against_misuse.py)...
    [OK] Execution finished successfully.
--> Running WSTG-BUSL-08: Test Upload of Unexpected File Types (4.10.8) (test_wstg_busl_08_upload_unexpected_file_types.py)...
    [OK] Execution finished successfully.
--> Running WSTG-BUSL-09: Test Upload of Malicious Files (4.10.9) (test_wstg_busl_09_upload_malicious_files.py)...
    [OK] Execution finished successfully.

========================================================================================
 CATEGORY K VERIFICATION MATRIX TABLE
========================================================================================
| TEST ID        | VULNERABILITY / TEST CASE NAME               | STATUS             |
----------------------------------------------------------------------------------------
| WSTG-BUSL-01   | Test Business Logic Data Validation (4.10.1) | PASS (Verified)    |
| WSTG-BUSL-02   | Test Ability to Forge Requests (4.10.2)      | PASS (Verified)    |
| WSTG-BUSL-03   | Test Integrity Checks (4.10.3)               | PASS (Verified)    |
| WSTG-BUSL-04   | Test for Process Timing (4.10.4)             | KNOWN RISK         |
| WSTG-BUSL-05   | Test Number of Times a Function Can Be Used Limits (4.10.5) | PASS (Verified)    |
| WSTG-BUSL-06   | Testing for the Circumvention of Work Flows (4.10.6) | PASS (Verified)    |
| WSTG-BUSL-07   | Test Defenses Against Application Misuse (4.10.7) | PASS (Verified)    |
| WSTG-BUSL-08   | Test Upload of Unexpected File Types (4.10.8) | PASS (Verified)    |
| WSTG-BUSL-09   | Test Upload of Malicious Files (4.10.9)      | PASS (Verified)    |
----------------------------------------------------------------------------------------
 OVERALL RESULT: ALL 9 TESTS VERIFIED (PASS)
========================================================================================
```

---

*Laporan pengujian ini adalah bagian dari Security Self-Assessment AegisPath untuk FinTechathon 2026 (Shenzhen).*
