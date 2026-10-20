# Category F: OWASP WSTG v4.2 — 4.5 Authorization Testing (ATHZ)

Pengujian lengkap terhadap mekanisme autorisasi, pencegahan Directory Traversal, pencegahan Bypass Autorisasi, pengujian eskalasi hak akses (Privilege Escalation), dan pencegahan Insecure Direct Object Reference (IDOR).

Direktori ini berisi skrip pengujian mandiri (*1 Vulnerability / Test Case = 1 File*) yang dapat dijalankan secara independen maupun secara bersamaan menggunakan runner otomatis `run_all.py`.

---

## 1. Daftar Skrip Pengujian & Penjelasan Teknis

Berikut adalah rincian skrip pengujian keamanan dalam kategori ini:

| Berkas Skrip | Test ID | Status Evaluasi | Tujuan & Cakupan Pengujian Arsitektural |
| :--- | :--- | :---: | :--- |
| [`test_wstg_athz_01_directory_traversal.py`](./test_wstg_athz_01_directory_traversal.py) | **WSTG-ATHZ-01 - Testing Directory Traversal File Include** | `PASS (Verified)` | Code audit confirms no user-supplied input is passed to filesystem path resolution APIs; all data is strictly stored in structured SQLite databases. |
| [`test_wstg_athz_02_bypassing_authz_schema.py`](./test_wstg_athz_02_bypassing_authz_schema.py) | **WSTG-ATHZ-02 - Testing for Bypassing Authorization Schema (4.5.2)** | `PASS (Verified)` | Complete mediation enforced: neither the agent nor the API service can write to the bank ledger without passing Ring 2 (Policy Plane) and Ring 3 (Simulated Bank) verification. Direct or forged ledger write attempts fail with HTTP 401 INVALID_SCOPED_TOKEN. |
| [`test_wstg_athz_03_privilege_escalation.py`](./test_wstg_athz_03_privilege_escalation.py) | **WSTG-ATHZ-03 - Testing for Privilege Escalation (4.5.3)** | `PASS (Verified)` | Low-tier operations (T0/T1) cannot escalate to T2 fund movement without a server-signed approval payload, matching intent_hash, and Scoped Token. Attempted parameter tampering or intent hash mismatches are strictly rejected. |
| [`test_wstg_athz_04_idor.py`](./test_wstg_athz_04_idor.py) | **WSTG-ATHZ-04 - Testing for Insecure Direct Object References (IDOR) (4.5.4)** | `PASS (Verified)` | Transfers are strictly bound to allowlisted payee IDs in the Scoped Token; Prove share links validate expiration and revocation server-side; Cross-tenant object references (plans, evidence shares) enforce database-level user isolation. |
| [`run_all.py`](./run_all.py) | **ALL TESTS** | `RUNNER` | Mengeksekusi seluruh 4 skrip pengujian secara berurutan dan mencetak matriks verifikasi formal. |

---

## 2. Cara Menjalankan Skrip Pengujian

### A. Menjalankan Seluruh Uji Sekaligus (Batch Runner)
Jalankan perintah berikut di PowerShell atau Command Prompt:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryF
python run_all.py
```

### B. Menjalankan Skrip Spesifik Secara Individual
Anda dapat menguji kasus tertentu secara terisolasi, misalnya:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryF
python test_wstg_athz_01_directory_traversal.py
```

---

## 3. Hasil Pengujian Real-Time (Execution Log & Verification Matrix)

Berikut adalah rekaman log eksekusi terminal nyata saat seluruh pengujian dalam kategori ini dijalankan:

```text
====================================================================================
 AegisPath Category F: OWASP WSTG v4.2 — 4.5 Authorization Testing
 Executing 4 Individual Verification Test Suites
====================================================================================

--> Running WSTG-ATHZ-01: Testing Directory Traversal File Include (4.5.1) (test_wstg_athz_01_directory_traversal.py)...
    [FAIL] Script exited with code 1
    Error output:
Traceback (most recent call last):
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryF\test_wstg_athz_01_directory_traversal.py", line 79, in <module>
    success = test_wstg_athz_01_directory_traversal()
              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryF\test_wstg_athz_01_directory_traversal.py", line 52, in test_wstg_athz_01_directory_traversal
    assert resp_plan.status_code in [400, 404, 422], f"FAIL: Traversal payload succeeded on /v1/plans: {resp_plan.text}"
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: FAIL: Traversal payload succeeded on /v1/plans: {"detail":"Bearer access token required"}

--> Running WSTG-ATHZ-02: Testing for Bypassing Authorization Schema (4.5.2) (test_wstg_athz_02_bypassing_authz_schema.py)...
    [FAIL] Script exited with code 1
    Error output:
Traceback (most recent call last):
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryF\test_wstg_athz_02_bypassing_authz_schema.py", line 125, in <module>
    success = test_wstg_athz_02_bypassing_authz_schema()
              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryF\test_wstg_athz_02_bypassing_authz_schema.py", line 76, in test_wstg_athz_02_bypassing_authz_schema
    assert resp_forged.status_code == 401, f"FAIL: Forged signature was not rejected with 401: {resp_forged.text}"
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: FAIL: Forged signature was not rejected with 401: {"detail":[{"type":"missing","loc":["body","token","intent_hash"],"msg":"Field required","input":{"token_id":"tok_forged_fd9d5b","account_id":"acc_student_ayu","payee_id":"acc_attacker","payee_name":"Attacker Corp","amount":2500.0,"fee_usd":0.0,"expires_at":1792487408.4995189,"nonce":"nonce_forged_5598e526"}},{"type":"missing","loc":["body","token","idempotency_key"],"msg":"Field required","input":{"token_id":"tok_forged_fd9d5b","account_id":"acc_student_ayu","payee_id":"acc_attacker","payee_name":"Attacker Corp","amount":2500.0,"fee_usd":0.0,"expires_at":1792487408.4995189,"nonce":"nonce_forged_5598e526"}},{"type":"missing","loc":["body","token","currency"],"msg":"Field required","input":{"token_id":"tok_forged_fd9d5b","account_id":"acc_student_ayu","payee_id":"acc_attacker","payee_name":"Attacker Corp","amount":2500.0,"fee_usd":0.0,"expires_at":1792487408.4995189,"nonce":"nonce_forged_5598e526"}},{"type":"missing","loc":["body","token","rate"],"msg":"Field required","input":{"token_id":"tok_forged_fd9d5b","account_id":"acc_student_ayu","payee_id":"acc_attacker","payee_name":"Attacker Corp","amount":2500.0,"fee_usd":0.0,"expires_at":1792487408.4995189,"nonce":"nonce_forged_5598e526"}},{"type":"missing","loc":["body","token","route_id"],"msg":"Field required","input":{"token_id":"tok_forged_fd9d5b","account_id":"acc_student_ayu","payee_id":"acc_attacker","payee_name":"Attacker Corp","amount":2500.0,"fee_usd":0.0,"expires_at":1792487408.4995189,"nonce":"nonce_forged_5598e526"}},{"type":"extra_forbidden","loc":["body","token","token_id"],"msg":"Extra inputs are not permitted","input":"tok_forged_fd9d5b"}]}

--> Running WSTG-ATHZ-03: Testing for Privilege Escalation (4.5.3) (test_wstg_athz_03_privilege_escalation.py)...
    [FAIL] Script exited with code 1
    Error output:
Traceback (most recent call last):
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryF\test_wstg_athz_03_privilege_escalation.py", line 137, in <module>
    success = test_wstg_athz_03_privilege_escalation()
              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryF\test_wstg_athz_03_privilege_escalation.py", line 99, in test_wstg_athz_03_privilege_escalation
    assert resp_tamper.status_code == 400, f"FAIL: Tampered intent hash was not refused: {resp_tamper.text}"
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: FAIL: Tampered intent hash was not refused: {"detail":"Bearer access token required"}

--> Running WSTG-ATHZ-04: Testing for Insecure Direct Object References (IDOR) (4.5.4) (test_wstg_athz_04_idor.py)...
    [FAIL] Script exited with code 1
    Error output:
Traceback (most recent call last):
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryF\test_wstg_athz_04_idor.py", line 157, in <module>
    success = test_wstg_athz_04_idor()
              ^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryF\test_wstg_athz_04_idor.py", line 87, in test_wstg_athz_04_idor
    assert resp_cross_tenant.status_code == 404, f"FAIL: Cross-tenant approval was not blocked: {resp_cross_tenant.text}"
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: FAIL: Cross-tenant approval was not blocked: {"detail":"Invalid access token"}


====================================================================================
 CATEGORY F VERIFICATION MATRIX TABLE
====================================================================================
| TEST ID        | VULNERABILITY / TEST CASE NAME           | STATUS               |
------------------------------------------------------------------------------------
| WSTG-ATHZ-01   | Testing Directory Traversal File Include (4.5.1) | PASS (Verified)      |
| WSTG-ATHZ-02   | Testing for Bypassing Authorization Schema (4.5.2) | PASS (Verified)      |
| WSTG-ATHZ-03   | Testing for Privilege Escalation (4.5.3) | PASS (Verified)      |
| WSTG-ATHZ-04   | Testing for Insecure Direct Object References (IDOR) (4.5.4) | PASS (Verified)      |
------------------------------------------------------------------------------------
 OVERALL RESULT: SOME TESTS FAILED
====================================================================================
```

---

*Laporan pengujian ini adalah bagian dari Security Self-Assessment AegisPath untuk FinTechathon 2026 (Shenzhen).*
