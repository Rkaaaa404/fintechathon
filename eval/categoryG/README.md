# Category G: OWASP WSTG v4.2 — 4.6 Session Management Testing (SESS)

Pengujian siklus hidup sesi pengguna (ephemeral session state), pencegahan Cross-Site Request Forgery (CSRF), session fixation, session hijacking, dan verifikasi ketiadaan ambient cookie browser.

Direktori ini berisi skrip pengujian mandiri (*1 Vulnerability / Test Case = 1 File*) yang dapat dijalankan secara independen maupun secara bersamaan menggunakan runner otomatis `run_all.py`.

---

## 1. Daftar Skrip Pengujian & Penjelasan Teknis

Berikut adalah rincian skrip pengujian keamanan dalam kategori ini:

| Berkas Skrip | Test ID | Status Evaluasi | Tujuan & Cakupan Pengujian Arsitektural |
| :--- | :--- | :---: | :--- |
| [`test_wstg_sess_01_session_mgmt_schema.py`](./test_wstg_sess_01_session_mgmt_schema.py) | **WSTG-SESS-01 - Testing for Session Management Schema (4.6.1)** | `PASS (Verified)` | Transaction authorization uses cryptographically signed Scoped Tokens binding amount ceiling, allowlisted recipient, and short TTL. |
| [`test_wstg_sess_02_cookies_attributes.py`](./test_wstg_sess_02_cookies_attributes.py) | **WSTG-SESS-02 - Testing for Cookies Attributes (4.6.2)** | `N/A` | Authorization between PWA, API (8000), and Bank (8100) uses explicit JSON headers/tokens rather than ambient browser cookies. |
| [`test_wstg_sess_03_session_fixation.py`](./test_wstg_sess_03_session_fixation.py) | **WSTG-SESS-03 - Testing for Session Fixation (4.6.3)** | `PASS (Verified)` | Every transaction intent generates a fresh, non-reusable idempotency_key, intent_hash, and Scoped Token. Pre-fixed or replayed session credentials fail verification in Ring 3 (Simulated Bank). |
| [`test_wstg_sess_04_exposed_session_variables.py`](./test_wstg_sess_04_exposed_session_variables.py) | **WSTG-SESS-04 - Testing for Exposed Session Variables (4.6.4)** | `PASS (Verified)` | Scoped Tokens and signing secrets are never transmitted in URL query strings or written to logs. |
| [`test_wstg_sess_05_csrf.py`](./test_wstg_sess_05_csrf.py) | **WSTG-SESS-05 - Testing for Cross Site Request Forgery (CSRF) (4.6.5)** | `PASS (Verified)` | State-changing endpoints require typed JSON payloads, explicit intent_hash binding, and Scoped Tokens immune to ambient cross-site form submissions. |
| [`test_wstg_sess_06_logout_functionality.py`](./test_wstg_sess_06_logout_functionality.py) | **WSTG-SESS-06 - Testing for Logout Functionality (4.6.6)** | `PASS (Verified)` | Enforced via immediate Prove link revocation and Agent Pause token invalidation. Active sessions and shared proving privileges can be immediately terminated server-side. |
| [`test_wstg_sess_07_session_timeout.py`](./test_wstg_sess_07_session_timeout.py) | **WSTG-SESS-07 - Testing Session Timeout (4.6.7)** | `PASS (Verified)` | Both Scoped Tokens (Port 8100) and Prove share links enforce strict server-side expiration timestamps. |
| [`test_wstg_sess_08_session_puzzling.py`](./test_wstg_sess_08_session_puzzling.py) | **WSTG-SESS-08 - Testing for Session Puzzling (4.6.8)** | `PASS (Verified)` | Simulation state (Tier T0) is strictly segregated from signed approval state (Tier T2). Simulation parameters cannot cross into or authenticate live execution plans. |
| [`test_wstg_sess_09_session_hijacking.py`](./test_wstg_sess_09_session_hijacking.py) | **WSTG-SESS-09 - Testing for Session Hijacking (4.6.9)** | `PASS (Verified)` | Even if a Scoped Token is intercepted in transit, it is cryptographically bound to the exact approved intent_hash, payee, and idempotency key, preventing parameter modification or replay. |
| [`run_all.py`](./run_all.py) | **ALL TESTS** | `RUNNER` | Mengeksekusi seluruh 9 skrip pengujian secara berurutan dan mencetak matriks verifikasi formal. |

---

## 2. Cara Menjalankan Skrip Pengujian

### A. Menjalankan Seluruh Uji Sekaligus (Batch Runner)
Jalankan perintah berikut di PowerShell atau Command Prompt:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryG
python run_all.py
```

### B. Menjalankan Skrip Spesifik Secara Individual
Anda dapat menguji kasus tertentu secara terisolasi, misalnya:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryG
python test_wstg_sess_01_session_mgmt_schema.py
```

---

## 3. Hasil Pengujian Real-Time (Execution Log & Verification Matrix)

Berikut adalah rekaman log eksekusi terminal nyata saat seluruh pengujian dalam kategori ini dijalankan:

```text
====================================================================================
 AegisPath Category G: OWASP WSTG v4.2 — 4.6 Session Management Testing
 Executing 9 Individual Verification Test Suites
====================================================================================

--> Running WSTG-SESS-01: Testing for Session Management Schema (4.6.1) (test_wstg_sess_01_session_mgmt_schema.py)...
    [OK] Execution finished successfully.
--> Running WSTG-SESS-02: Testing for Cookies Attributes (4.6.2) (test_wstg_sess_02_cookies_attributes.py)...
    [OK] Execution finished successfully.
--> Running WSTG-SESS-03: Testing for Session Fixation (4.6.3) (test_wstg_sess_03_session_fixation.py)...
    [OK] Execution finished successfully.
--> Running WSTG-SESS-04: Testing for Exposed Session Variables (4.6.4) (test_wstg_sess_04_exposed_session_variables.py)...
    [OK] Execution finished successfully.
--> Running WSTG-SESS-05: Testing for Cross Site Request Forgery (CSRF) (4.6.5) (test_wstg_sess_05_csrf.py)...
    [OK] Execution finished successfully.
--> Running WSTG-SESS-06: Testing for Logout Functionality (4.6.6) (test_wstg_sess_06_logout_functionality.py)...
    [OK] Execution finished successfully.
--> Running WSTG-SESS-07: Testing Session Timeout (4.6.7) (test_wstg_sess_07_session_timeout.py)...
    [OK] Execution finished successfully.
--> Running WSTG-SESS-08: Testing for Session Puzzling (4.6.8) (test_wstg_sess_08_session_puzzling.py)...
    [OK] Execution finished successfully.
--> Running WSTG-SESS-09: Testing for Session Hijacking (4.6.9) (test_wstg_sess_09_session_hijacking.py)...
    [OK] Execution finished successfully.

====================================================================================
 CATEGORY G VERIFICATION MATRIX TABLE
====================================================================================
| TEST ID        | VULNERABILITY / TEST CASE NAME           | STATUS               |
------------------------------------------------------------------------------------
| WSTG-SESS-01   | Testing for Session Management Schema (4.6.1) | PASS (Verified)      |
| WSTG-SESS-02   | Testing for Cookies Attributes (4.6.2)   | N/A                  |
| WSTG-SESS-03   | Testing for Session Fixation (4.6.3)     | PASS (Verified)      |
| WSTG-SESS-04   | Testing for Exposed Session Variables (4.6.4) | PASS (Verified)      |
| WSTG-SESS-05   | Testing for Cross Site Request Forgery (CSRF) (4.6.5) | PASS (Verified)      |
| WSTG-SESS-06   | Testing for Logout Functionality (4.6.6) | PASS (Verified)      |
| WSTG-SESS-07   | Testing Session Timeout (4.6.7)          | PASS (Verified)      |
| WSTG-SESS-08   | Testing for Session Puzzling (4.6.8)     | PASS (Verified)      |
| WSTG-SESS-09   | Testing for Session Hijacking (4.6.9)    | PASS (Verified)      |
------------------------------------------------------------------------------------
 OVERALL RESULT: ALL 9 TESTS VERIFIED (PASS)
====================================================================================
```

---

*Laporan pengujian ini adalah bagian dari Security Self-Assessment AegisPath untuk FinTechathon 2026 (Shenzhen).*
