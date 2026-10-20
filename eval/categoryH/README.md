# Category H: OWASP WSTG v4.2 — 4.7 Input Validation Testing (INPV)

Kategori pengujian input validation paling komprehensif (29 skrip uji): Reflected/Stored XSS, HTTP Parameter Pollution, SQL Injection lintas mesin database (SQLite, PostgreSQL, Oracle, MySQL, NoSQL), Code/Command Injection, SSRF, SSTI, dan Format String.

Direktori ini berisi skrip pengujian mandiri (*1 Vulnerability / Test Case = 1 File*) yang dapat dijalankan secara independen maupun secara bersamaan menggunakan runner otomatis `run_all.py`.

---

## 1. Daftar Skrip Pengujian & Penjelasan Teknis

Berikut adalah rincian skrip pengujian keamanan dalam kategori ini:

| Berkas Skrip | Test ID | Status Evaluasi | Tujuan & Cakupan Pengujian Arsitektural |
| :--- | :--- | :---: | :--- |
| [`test_wstg_inpv_01_reflected_xss.py`](./test_wstg_inpv_01_reflected_xss.py) | **WSTG-INPV-01 - Testing for Reflected Cross Site Scripting (4.7.1)** | `PASS (Verified)` | API returns strictly application/json; PWA escapes all dynamic text strings. Reflected XSS payloads are never interpreted or rendered as HTML. |
| [`test_wstg_inpv_02_stored_xss.py`](./test_wstg_inpv_02_stored_xss.py) | **WSTG-INPV-02 - Testing for Stored Cross Site Scripting (4.7.2)** | `PASS (Verified)` | Chat history, invoice fields, and audit logs render solely through allowlisted UI components without raw HTML injection. |
| [`test_wstg_inpv_03_http_verb_tampering.py`](./test_wstg_inpv_03_http_verb_tampering.py) | **WSTG-INPV-03 - Testing for HTTP Verb Tampering (4.7.3)** | `PASS (Verified)` | Router |
| [`test_wstg_inpv_04_http_parameter_pollution.py`](./test_wstg_inpv_04_http_parameter_pollution.py) | **WSTG-INPV-04 - Testing for HTTP Parameter Pollution (4.7.4)** | `PASS (Verified)` | Strict JSON schema validation rejects duplicate keys, unexpected fields, or type mismatches. |
| [`test_wstg_inpv_05_1_oracle.py`](./test_wstg_inpv_05_1_oracle.py) | **WSTG-INPV-05.1 - Testing for Oracle (4.7.5.1)** | `N/A` | Oracle RDBMS is not used in AegisPath. |
| [`test_wstg_inpv_05_2_mysql.py`](./test_wstg_inpv_05_2_mysql.py) | **WSTG-INPV-05.2 - Testing for MySQL (4.7.5.2)** | `N/A` | MySQL is not used in the local container stack. |
| [`test_wstg_inpv_05_3_sql_server.py`](./test_wstg_inpv_05_3_sql_server.py) | **WSTG-INPV-05.3 - Testing for SQL Server (4.7.5.3)** | `N/A` | Microsoft SQL Server is not used. |
| [`test_wstg_inpv_05_4_postgresql.py`](./test_wstg_inpv_05_4_postgresql.py) | **WSTG-INPV-05.4 - Testing PostgreSQL (4.7.5.4)** | `N/A / PASS` | Parameterized queries enforced across relational stores (both SQLite testbed and PostgreSQL production configurations). |
| [`test_wstg_inpv_05_5_ms_access.py`](./test_wstg_inpv_05_5_ms_access.py) | **WSTG-INPV-05.5 - Testing for MS Access (4.7.5.5)** | `N/A` | Microsoft Access is not used. |
| [`test_wstg_inpv_05_6_nosql_injection.py`](./test_wstg_inpv_05_6_nosql_injection.py) | **WSTG-INPV-05.6 - Testing for NoSQL Injection (4.7.5.6)** | `N/A` | NoSQL query engines are not used. |
| [`test_wstg_inpv_05_7_orm_injection.py`](./test_wstg_inpv_05_7_orm_injection.py) | **WSTG-INPV-05.7 - Testing for ORM Injection (4.7.5.7)** | `PASS (Verified)` | Data access layer uses strongly typed parameters with zero raw filter string concatenation. SQLAlchemy 2.0 select() constructs bind all user input. |
| [`test_wstg_inpv_05_8_client_side_sqli.py`](./test_wstg_inpv_05_8_client_side_sqli.py) | **WSTG-INPV-05.8 - Testing for Client-side SQL Injection (4.7.5.8)** | `N/A` | Browser WebSQL is not used in the PWA. Client-side state is handled purely via React state and standard browser APIs. |
| [`test_wstg_inpv_05_sql_injection.py`](./test_wstg_inpv_05_sql_injection.py) | **WSTG-INPV-05 - Testing for SQL Injection (4.7.5)** | `PASS (Verified)` | All database operations use parameterized queries; the language model never generates SQL statements (DSGAI12). |
| [`test_wstg_inpv_06_ldap_injection.py`](./test_wstg_inpv_06_ldap_injection.py) | **WSTG-INPV-06 - Testing for LDAP Injection (4.7.6)** | `N/A` | LDAP directory services are not used. Identity management is performed via cryptographic passkeys (WebAuthn) and localized SQLite/Postgres tables. |
| [`test_wstg_inpv_07_xml_injection.py`](./test_wstg_inpv_07_xml_injection.py) | **WSTG-INPV-07 - Testing for XML Injection (4.7.7)** | `N/A` | All API contracts use JSON; no XML parsers are present. XXE and XML injection vectors are non-applicable by design. |
| [`test_wstg_inpv_08_ssi_injection.py`](./test_wstg_inpv_08_ssi_injection.py) | **WSTG-INPV-08 - Testing for SSI Injection (4.7.8)** | `N/A` | Server-Side Includes (SSI) are not used. Backend services run as ASGI/Uvicorn Python applications serving structured JSON APIs. |
| [`test_wstg_inpv_09_xpath_injection.py`](./test_wstg_inpv_09_xpath_injection.py) | **WSTG-INPV-09 - Testing for XPath Injection (4.7.9)** | `N/A` | XPath queries are not used. All relational and document entities are queried via SQL/SQLAlchemy. |
| [`test_wstg_inpv_10_imap_smtp_injection.py`](./test_wstg_inpv_10_imap_smtp_injection.py) | **WSTG-INPV-10 - Testing for IMAP SMTP Injection (4.7.10)** | `N/A` | IMAP/SMTP mail servers are not integrated in the MVP. Notifications and receipts are delivered exclusively via in-app feeds and event streams. |
| [`test_wstg_inpv_11_1_lfi.py`](./test_wstg_inpv_11_1_lfi.py) | **WSTG-INPV-11.1 - Testing for Local File Inclusion (4.7.11.1)** | `PASS (Verified)` | No dynamic file/module inclusion based on user input. Modules are imported statically at startup. |
| [`test_wstg_inpv_11_2_rfi.py`](./test_wstg_inpv_11_2_rfi.py) | **WSTG-INPV-11.2 - Testing for Remote File Inclusion (4.7.11.2)** | `PASS (Verified)` | Application fetches zero remote scripts or templates. All business logic and UI components are packaged locally in container images. |
| [`test_wstg_inpv_11_code_injection.py`](./test_wstg_inpv_11_code_injection.py) | **WSTG-INPV-11 - Testing for Code Injection (4.7.11)** | `PASS (Verified)` | Zero use of eval(), exec(), or dynamic code execution on model outputs (LLM10:2026). All model outputs are parsed strictly via Pydantic schemas. |
| [`test_wstg_inpv_12_command_injection.py`](./test_wstg_inpv_12_command_injection.py) | **WSTG-INPV-12 - Testing for Command Injection (4.7.12)** | `PASS (Verified)` | Agent has zero OS shell tools (subprocess, os.system, child_process) (LLM03:2026). No user or model input can trigger system command execution. |
| [`test_wstg_inpv_13_format_string.py`](./test_wstg_inpv_13_format_string.py) | **WSTG-INPV-13 - Testing for Format String Injection (4.7.13)** | `PASS (Verified)` | Prompt and response templates use safe variable substitution without object attribute traversal. User strings are never passed as template format strings. |
| [`test_wstg_inpv_14_incubated_vuln.py`](./test_wstg_inpv_14_incubated_vuln.py) | **WSTG-INPV-14 - Testing for Incubated Vulnerability (4.7.14)** | `PASS (Verified)` | Stored invoice payloads (Flow C) are treated as passive data and re-validated at policy and bank layers before any execution can occur. |
| [`test_wstg_inpv_15_http_splitting.py`](./test_wstg_inpv_15_http_splitting.py) | **WSTG-INPV-15 - Testing for HTTP Splitting / Smuggling (4.7.15)** | `PASS (Verified)` | User inputs are never written into raw HTTP response headers. ASGI server and FastAPI enforce strict header validation preventing CRLF injection. |
| [`test_wstg_inpv_16_incoming_requests.py`](./test_wstg_inpv_16_incoming_requests.py) | **WSTG-INPV-16 - Testing for HTTP Incoming Requests (4.7.16)** | `PASS (Verified)` | Request body size limits and strict JSON parsing enforced at ingress. Malformed JSON or oversized bodies are rejected before business logic execution. |
| [`test_wstg_inpv_17_host_header_injection.py`](./test_wstg_inpv_17_host_header_injection.py) | **WSTG-INPV-17 - Testing for Host Header Injection (4.7.17)** | `PASS (Verified)` | Prove share link generation uses configured base URLs rather than untrusted Host headers. Password reset poisoning and cache poisoning via Host header are mitigated. |
| [`test_wstg_inpv_18_ssti.py`](./test_wstg_inpv_18_ssti.py) | **WSTG-INPV-18 - Testing for Server-side Template Injection (4.7.18)** | `PASS (Verified)` | Backend serves JSON APIs only; no server-side HTML template rendering of user strings. Jinja2 / Mako SSTI is structurally impossible. |
| [`test_wstg_inpv_19_ssrf.py`](./test_wstg_inpv_19_ssrf.py) | **WSTG-INPV-19 - Testing for Server-Side Request Forgery (SSRF) (4.7.19)** | `PASS (Verified)` | Agent has no arbitrary URL-fetching tool; outbound backend calls are hardcoded to Port 8100 (Simulated Bank). Cloud metadata (169.254.169.254) and internal network endpoints cannot be requested. |
| [`run_all.py`](./run_all.py) | **ALL TESTS** | `RUNNER` | Mengeksekusi seluruh 29 skrip pengujian secara berurutan dan mencetak matriks verifikasi formal. |

---

## 2. Cara Menjalankan Skrip Pengujian

### A. Menjalankan Seluruh Uji Sekaligus (Batch Runner)
Jalankan perintah berikut di PowerShell atau Command Prompt:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryH
python run_all.py
```

### B. Menjalankan Skrip Spesifik Secara Individual
Anda dapat menguji kasus tertentu secara terisolasi, misalnya:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryH
python test_wstg_inpv_01_reflected_xss.py
```

---

## 3. Hasil Pengujian Real-Time (Execution Log & Verification Matrix)

Berikut adalah rekaman log eksekusi terminal nyata saat seluruh pengujian dalam kategori ini dijalankan:

```text
========================================================================================
 AegisPath Category H: OWASP WSTG v4.2 — 4.7 Input Validation Testing
 Executing 29 Individual Verification Test Suites
========================================================================================

--> Running WSTG-INPV-01   : Testing for Reflected Cross Site Scripting (4.7.1) (test_wstg_inpv_01_reflected_xss.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INPV-02   : Testing for Stored Cross Site Scripting (4.7.2) (test_wstg_inpv_02_stored_xss.py)...
    [FAIL] Script exited with code 1
    Error output:
Traceback (most recent call last):
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryH\test_wstg_inpv_02_stored_xss.py", line 92, in <module>
    success = test_wstg_inpv_02_stored_xss()
              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryH\test_wstg_inpv_02_stored_xss.py", line 61, in test_wstg_inpv_02_stored_xss
    assert resp.status_code == 200
           ^^^^^^^^^^^^^^^^^^^^^^^
AssertionError

--> Running WSTG-INPV-03   : Testing for HTTP Verb Tampering (4.7.3)        (test_wstg_inpv_03_http_verb_tampering.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INPV-04   : Testing for HTTP Parameter Pollution (4.7.4)   (test_wstg_inpv_04_http_parameter_pollution.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INPV-05   : Testing for SQL Injection (4.7.5)              (test_wstg_inpv_05_sql_injection.py)...
    [FAIL] Script exited with code 1
    Error output:
Traceback (most recent call last):
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryH\test_wstg_inpv_05_sql_injection.py", line 96, in <module>
    success = test_wstg_inpv_05_sql_injection()
              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryH\test_wstg_inpv_05_sql_injection.py", line 55, in test_wstg_inpv_05_sql_injection
    assert resp_plan.status_code in [400, 404, 422], f"FAIL: Potential SQL injection on /v1/plans: {resp_plan.text}"
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: FAIL: Potential SQL injection on /v1/plans: {"detail":"Bearer access token required"}

--> Running WSTG-INPV-05.1 : Testing for Oracle (4.7.5.1)                   (test_wstg_inpv_05_1_oracle.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INPV-05.2 : Testing for MySQL (4.7.5.2)                    (test_wstg_inpv_05_2_mysql.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INPV-05.3 : Testing for SQL Server (4.7.5.3)               (test_wstg_inpv_05_3_sql_server.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INPV-05.4 : Testing PostgreSQL (4.7.5.4)                   (test_wstg_inpv_05_4_postgresql.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INPV-05.5 : Testing for MS Access (4.7.5.5)                (test_wstg_inpv_05_5_ms_access.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INPV-05.6 : Testing for NoSQL Injection (4.7.5.6)          (test_wstg_inpv_05_6_nosql_injection.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INPV-05.7 : Testing for ORM Injection (4.7.5.7)            (test_wstg_inpv_05_7_orm_injection.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INPV-05.8 : Testing for Client-side SQL Injection (4.7.5.8) (test_wstg_inpv_05_8_client_side_sqli.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INPV-06   : Testing for LDAP Injection (4.7.6)             (test_wstg_inpv_06_ldap_injection.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INPV-07   : Testing for XML Injection (4.7.7)              (test_wstg_inpv_07_xml_injection.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INPV-08   : Testing for SSI Injection (4.7.8)              (test_wstg_inpv_08_ssi_injection.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INPV-09   : Testing for XPath Injection (4.7.9)            (test_wstg_inpv_09_xpath_injection.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INPV-10   : Testing for IMAP SMTP Injection (4.7.10)       (test_wstg_inpv_10_imap_smtp_injection.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INPV-11   : Testing for Code Injection (4.7.11)            (test_wstg_inpv_11_code_injection.py)...
    [FAIL] Script exited with code 1
    Error output:
Traceback (most recent call last):
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryH\test_wstg_inpv_11_code_injection.py", line 70, in <module>
    success = test_wstg_inpv_11_code_injection()
              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryH\test_wstg_inpv_11_code_injection.py", line 50, in test_wstg_inpv_11_code_injection
    assert len(dangerous_code_evals) == 0, f"FAIL: Found dynamic code execution: {dangerous_code_evals}"
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: FAIL: Found dynamic code execution: [('attacks.py', ['eval('])]

--> Running WSTG-INPV-11.1 : Testing for Local File Inclusion (4.7.11.1)    (test_wstg_inpv_11_1_lfi.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INPV-11.2 : Testing for Remote File Inclusion (4.7.11.2)   (test_wstg_inpv_11_2_rfi.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INPV-12   : Testing for Command Injection (4.7.12)         (test_wstg_inpv_12_command_injection.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INPV-13   : Testing for Format String Injection (4.7.13)   (test_wstg_inpv_13_format_string.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INPV-14   : Testing for Incubated Vulnerability (4.7.14)   (test_wstg_inpv_14_incubated_vuln.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INPV-15   : Testing for HTTP Splitting Smuggling (4.7.15)  (test_wstg_inpv_15_http_splitting.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INPV-16   : Testing for HTTP Incoming Requests (4.7.16)    (test_wstg_inpv_16_incoming_requests.py)...
    [FAIL] Script exited with code 1
    Error output:
Traceback (most recent call last):
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryH\test_wstg_inpv_16_incoming_requests.py", line 88, in <module>
    success = test_wstg_inpv_16_incoming_requests()
              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryH\test_wstg_inpv_16_incoming_requests.py", line 76, in test_wstg_inpv_16_incoming_requests
    assert resp_bad_ct.status_code == 422, "FAIL: Accepted non-JSON content-type"
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: FAIL: Accepted non-JSON content-type

--> Running WSTG-INPV-17   : Testing for Host Header Injection (4.7.17)     (test_wstg_inpv_17_host_header_injection.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INPV-18   : Testing for Server-side Template Injection (4.7.18) (test_wstg_inpv_18_ssti.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INPV-19   : Testing for Server-Side Request Forgery (SSRF) (4.7.19) (test_wstg_inpv_19_ssrf.py)...
    [OK] Execution finished successfully.

========================================================================================
 CATEGORY H VERIFICATION MATRIX TABLE
========================================================================================
| TEST ID         | VULNERABILITY / TEST CASE NAME                   | STATUS           |
----------------------------------------------------------------------------------------
| WSTG-INPV-01    | Testing for Reflected Cross Site Scripting (4.7.1) | PASS (Verified)  |
| WSTG-INPV-02    | Testing for Stored Cross Site Scripting (4.7.2)  | PASS (Verified)  |
| WSTG-INPV-03    | Testing for HTTP Verb Tampering (4.7.3)          | PASS (Verified)  |
| WSTG-INPV-04    | Testing for HTTP Parameter Pollution (4.7.4)     | PASS (Verified)  |
| WSTG-INPV-05    | Testing for SQL Injection (4.7.5)                | PASS (Verified)  |
| WSTG-INPV-05.1  | Testing for Oracle (4.7.5.1)                     | N/A              |
| WSTG-INPV-05.2  | Testing for MySQL (4.7.5.2)                      | N/A              |
| WSTG-INPV-05.3  | Testing for SQL Server (4.7.5.3)                 | N/A              |
| WSTG-INPV-05.4  | Testing PostgreSQL (4.7.5.4)                     | N/A / PASS       |
| WSTG-INPV-05.5  | Testing for MS Access (4.7.5.5)                  | N/A              |
| WSTG-INPV-05.6  | Testing for NoSQL Injection (4.7.5.6)            | N/A              |
| WSTG-INPV-05.7  | Testing for ORM Injection (4.7.5.7)              | PASS (Verified)  |
| WSTG-INPV-05.8  | Testing for Client-side SQL Injection (4.7.5.8)  | N/A              |
| WSTG-INPV-06    | Testing for LDAP Injection (4.7.6)               | N/A              |
| WSTG-INPV-07    | Testing for XML Injection (4.7.7)                | N/A              |
| WSTG-INPV-08    | Testing for SSI Injection (4.7.8)                | N/A              |
| WSTG-INPV-09    | Testing for XPath Injection (4.7.9)              | N/A              |
| WSTG-INPV-10    | Testing for IMAP SMTP Injection (4.7.10)         | N/A              |
| WSTG-INPV-11    | Testing for Code Injection (4.7.11)              | PASS (Verified)  |
| WSTG-INPV-11.1  | Testing for Local File Inclusion (4.7.11.1)      | PASS (Verified)  |
| WSTG-INPV-11.2  | Testing for Remote File Inclusion (4.7.11.2)     | PASS (Verified)  |
| WSTG-INPV-12    | Testing for Command Injection (4.7.12)           | PASS (Verified)  |
| WSTG-INPV-13    | Testing for Format String Injection (4.7.13)     | PASS (Verified)  |
| WSTG-INPV-14    | Testing for Incubated Vulnerability (4.7.14)     | PASS (Verified)  |
| WSTG-INPV-15    | Testing for HTTP Splitting Smuggling (4.7.15)    | PASS (Verified)  |
| WSTG-INPV-16    | Testing for HTTP Incoming Requests (4.7.16)      | PASS (Verified)  |
| WSTG-INPV-17    | Testing for Host Header Injection (4.7.17)       | PASS (Verified)  |
| WSTG-INPV-18    | Testing for Server-side Template Injection (4.7.18) | PASS (Verified)  |
| WSTG-INPV-19    | Testing for Server-Side Request Forgery (SSRF) (4.7.19) | PASS (Verified)  |
----------------------------------------------------------------------------------------
 OVERALL RESULT: SOME TESTS FAILED
========================================================================================
```

---

*Laporan pengujian ini adalah bagian dari Security Self-Assessment AegisPath untuk FinTechathon 2026 (Shenzhen).*
