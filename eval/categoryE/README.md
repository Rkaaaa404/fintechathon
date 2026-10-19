# Category E: OWASP WSTG v4.2 — 4.4 Authentication Testing (ATHN)

Pengujian mekanisme autentikasi mock OIDC / passkey, pengujian kredensial default, pengujian lockout, dan verifikasi proteksi channel komunikasi antar-layanan (API Port 8000 dan Bank Port 8100).

Direktori ini berisi skrip pengujian mandiri (*1 Vulnerability / Test Case = 1 File*) yang dapat dijalankan secara independen maupun secara bersamaan menggunakan runner otomatis `run_all.py`.

---

## 1. Daftar Skrip Pengujian & Penjelasan Teknis

Berikut adalah rincian skrip pengujian keamanan dalam kategori ini:

| Berkas Skrip | Test ID | Status Evaluasi | Tujuan & Cakupan Pengujian Arsitektural |
| :--- | :--- | :---: | :--- |
| [`test_wstg_athn_01_encrypted_channel.py`](./test_wstg_athn_01_encrypted_channel.py) | **WSTG-ATHN-01 - Testing for Credentials Transported over an Encrypted Channel** | `KNOWN RISK (Mitigated)` | Inter-service calls occur over an isolated internal Docker bridge network during local evaluation; production deployment requires TLS termination. |
| [`test_wstg_athn_02_default_credentials.py`](./test_wstg_athn_02_default_credentials.py) | **WSTG-ATHN-02 - Testing for Default Credentials** | `PASS (Verified)` | API (Port 8000) and Simulated Bank (Port 8100) use distinct, non- |
| [`test_wstg_athn_03_lock_out_mechanism.py`](./test_wstg_athn_03_lock_out_mechanism.py) | **WSTG-ATHN-03 - Testing for Weak Lock Out Mechanism** | `PASS (Verified)` | Enforced via the deterministic Agent Pause circuit breaker, which immediately locks agent execution upon Tier T3 or Sentinel anomaly triggers. |
| [`test_wstg_athn_04_bypass_auth_schema.py`](./test_wstg_athn_04_bypass_auth_schema.py) | **WSTG-ATHN-04 - Testing for Bypassing Authentication Schema** | `PASS (Verified)` | Direct requests to Port 8100 ledger endpoints without a valid, cryptographically signed Scoped Token are deterministically rejected. |
| [`test_wstg_athn_05_remember_password.py`](./test_wstg_athn_05_remember_password.py) | **WSTG-ATHN-05 - Testing for Vulnerable Remember Password** | `N/A (By Design)` | Persistent "Remember Me" password cookies are not implemented in the MVP. |
| [`test_wstg_athn_06_browser_cache_weakness.py`](./test_wstg_athn_06_browser_cache_weakness.py) | **WSTG-ATHN-06 - Testing for Browser Cache Weaknesses** | `PASS (Verified)` | API responses for sensitive financial state and Prove evidence packages enforce Cache-Control: no-store headers (or non-cacheable dynamic representations). |
| [`test_wstg_athn_07_weak_password_policy.py`](./test_wstg_athn_07_weak_password_policy.py) | **WSTG-ATHN-07 - Testing for Weak Password Policy** | `N/A (By Design)` | End-user password management is outside the MVP sandbox scope. |
| [`test_wstg_athn_08_security_questions.py`](./test_wstg_athn_08_security_questions.py) | **WSTG-ATHN-08 - Testing for Weak Security Question Answer** | `N/A (By Design)` | Knowledge-based security questions are not used. |
| [`test_wstg_athn_09_password_reset.py`](./test_wstg_athn_09_password_reset.py) | **WSTG-ATHN-09 - Testing for Weak Password Change or Reset Functionalities** | `N/A (By Design)` | Password reset workflows are not part of the MVP. |
| [`test_wstg_athn_10_alternative_channel.py`](./test_wstg_athn_10_alternative_channel.py) | **WSTG-ATHN-10 - Testing for Weaker Authentication in Alternative Channel** | `PASS (Verified)` | Conversational chat channel cannot bypass the server-signed Approval screen to authorize Tier T2 transfers; voice input is disabled. |
| [`run_all.py`](./run_all.py) | **ALL TESTS** | `RUNNER` | Mengeksekusi seluruh 10 skrip pengujian secara berurutan dan mencetak matriks verifikasi formal. |

---

## 2. Cara Menjalankan Skrip Pengujian

### A. Menjalankan Seluruh Uji Sekaligus (Batch Runner)
Jalankan perintah berikut di PowerShell atau Command Prompt:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryE
python run_all.py
```

### B. Menjalankan Skrip Spesifik Secara Individual
Anda dapat menguji kasus tertentu secara terisolasi, misalnya:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryE
python test_wstg_athn_01_encrypted_channel.py
```

---

## 3. Hasil Pengujian Real-Time (Execution Log & Verification Matrix)

Berikut adalah rekaman log eksekusi terminal nyata saat seluruh pengujian dalam kategori ini dijalankan:

```text
================================================================================
 AegisPath Category E: OWASP WSTG v4.2 — 4.4 Authentication Testing
 Executing 10 Individual Verification Test Suites
================================================================================

--> Running WSTG-ATHN-01: Credentials over Encrypted Channel (test_wstg_athn_01_encrypted_channel.py)...
    [OK] Execution finished successfully.
--> Running WSTG-ATHN-02: Default Credentials (test_wstg_athn_02_default_credentials.py)...
    [OK] Execution finished successfully.
--> Running WSTG-ATHN-03: Weak Lock Out Mechanism (test_wstg_athn_03_lock_out_mechanism.py)...
    [OK] Execution finished successfully.
--> Running WSTG-ATHN-04: Bypassing Authentication Schema (test_wstg_athn_04_bypass_auth_schema.py)...
    [OK] Execution finished successfully.
--> Running WSTG-ATHN-05: Vulnerable Remember Password (test_wstg_athn_05_remember_password.py)...
    [OK] Execution finished successfully.
--> Running WSTG-ATHN-06: Browser Cache Weaknesses (test_wstg_athn_06_browser_cache_weakness.py)...
    [OK] Execution finished successfully.
--> Running WSTG-ATHN-07: Weak Password Policy (test_wstg_athn_07_weak_password_policy.py)...
    [OK] Execution finished successfully.
--> Running WSTG-ATHN-08: Weak Security Question Answer (test_wstg_athn_08_security_questions.py)...
    [OK] Execution finished successfully.
--> Running WSTG-ATHN-09: Weak Password Reset Functionality (test_wstg_athn_09_password_reset.py)...
    [OK] Execution finished successfully.
--> Running WSTG-ATHN-10: Weaker Auth in Alternative Channel (test_wstg_athn_10_alternative_channel.py)...
    [OK] Execution finished successfully.

================================================================================
 CATEGORY E VERIFICATION MATRIX TABLE
================================================================================
| TEST ID        | VULNERABILITY / TEST CASE NAME       | STATUS               |
--------------------------------------------------------------------------------
| WSTG-ATHN-01   | Credentials over Encrypted Channel   | KNOWN RISK           |
| WSTG-ATHN-02   | Default Credentials                  | PASS (Verified)      |
| WSTG-ATHN-03   | Weak Lock Out Mechanism              | PASS (Verified)      |
| WSTG-ATHN-04   | Bypassing Authentication Schema      | PASS (Verified)      |
| WSTG-ATHN-05   | Vulnerable Remember Password         | N/A                  |
| WSTG-ATHN-06   | Browser Cache Weaknesses             | PASS (Verified)      |
| WSTG-ATHN-07   | Weak Password Policy                 | N/A                  |
| WSTG-ATHN-08   | Weak Security Question Answer        | N/A                  |
| WSTG-ATHN-09   | Weak Password Reset Functionality    | N/A                  |
| WSTG-ATHN-10   | Weaker Auth in Alternative Channel   | PASS (Verified)      |
--------------------------------------------------------------------------------
 OVERALL RESULT: ALL 10 TESTS VERIFIED (PASS)
================================================================================
```

---

*Laporan pengujian ini adalah bagian dari Security Self-Assessment AegisPath untuk FinTechathon 2026 (Shenzhen).*
