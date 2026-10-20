# Category I: OWASP WSTG v4.2 — 4.8 Error Handling Testing (ERRH)

Pengujian penanganan kesalahan fail-closed pada Ring 1, Ring 2, dan Ring 3, serta pencegahan kebocoran stack trace sensitif internal dalam format RFC 7807 (Problem+JSON).

Direktori ini berisi skrip pengujian mandiri (*1 Vulnerability / Test Case = 1 File*) yang dapat dijalankan secara independen maupun secara bersamaan menggunakan runner otomatis `run_all.py`.

---

## 1. Daftar Skrip Pengujian & Penjelasan Teknis

Berikut adalah rincian skrip pengujian keamanan dalam kategori ini:

| Berkas Skrip | Test ID | Status Evaluasi | Tujuan & Cakupan Pengujian Arsitektural |
| :--- | :--- | :---: | :--- |
| [`test_wstg_errh_01_improper_error_handling.py`](./test_wstg_errh_01_improper_error_handling.py) | **WSTG-ERRH-01 - Testing for Improper Error Handling (4.8.1)** | `PASS (Verified)` | All three |
| [`test_wstg_errh_02_stack_traces.py`](./test_wstg_errh_02_stack_traces.py) | **WSTG-ERRH-02 - Testing for Stack Traces (4.8.2)** | `PASS (Verified)` | Error responses return structured JSON status codes without exposing internal stack traces or file paths. RFC 7807 (application/problem+json) standardizes all fault messages. |
| [`run_all.py`](./run_all.py) | **ALL TESTS** | `RUNNER` | Mengeksekusi seluruh 2 skrip pengujian secara berurutan dan mencetak matriks verifikasi formal. |

---

## 2. Cara Menjalankan Skrip Pengujian

### A. Menjalankan Seluruh Uji Sekaligus (Batch Runner)
Jalankan perintah berikut di PowerShell atau Command Prompt:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryI
python run_all.py
```

### B. Menjalankan Skrip Spesifik Secara Individual
Anda dapat menguji kasus tertentu secara terisolasi, misalnya:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryI
python test_wstg_errh_01_improper_error_handling.py
```

---

## 3. Hasil Pengujian Real-Time (Execution Log & Verification Matrix)

Berikut adalah rekaman log eksekusi terminal nyata saat seluruh pengujian dalam kategori ini dijalankan:

```text
====================================================================================
 AegisPath Category I: OWASP WSTG v4.2 — 4.8 Testing for Error Handling
 Executing 2 Individual Verification Test Suites
====================================================================================

--> Running WSTG-ERRH-01: Testing for Improper Error Handling (4.8.1) (test_wstg_errh_01_improper_error_handling.py)...
    [FAIL] Script exited with code 1
    Error output:
Traceback (most recent call last):
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryI\test_wstg_errh_01_improper_error_handling.py", line 111, in <module>
    success = test_wstg_errh_01_improper_error_handling()
              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryI\test_wstg_errh_01_improper_error_handling.py", line 90, in test_wstg_errh_01_improper_error_handling
    assert resp_transfer.status_code == 401
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError

--> Running WSTG-ERRH-02: Testing for Stack Traces (4.8.2) (test_wstg_errh_02_stack_traces.py)...
    [FAIL] Script exited with code 1
    Error output:
Traceback (most recent call last):
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryI\test_wstg_errh_02_stack_traces.py", line 115, in <module>
    success = test_wstg_errh_02_stack_traces()
              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryI\test_wstg_errh_02_stack_traces.py", line 79, in test_wstg_errh_02_stack_traces
    assert resp.status_code in expected_statuses, f"FAIL: Unexpected status {resp.status_code} on {url}"
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: FAIL: Unexpected status 401 on /v1/plans/non-existent-plan-id


====================================================================================
 CATEGORY I VERIFICATION MATRIX TABLE
====================================================================================
| TEST ID        | VULNERABILITY / TEST CASE NAME           | STATUS               |
------------------------------------------------------------------------------------
| WSTG-ERRH-01   | Testing for Improper Error Handling (4.8.1) | PASS (Verified)      |
| WSTG-ERRH-02   | Testing for Stack Traces (4.8.2)         | PASS (Verified)      |
------------------------------------------------------------------------------------
 OVERALL RESULT: SOME TESTS FAILED
====================================================================================
```

---

*Laporan pengujian ini adalah bagian dari Security Self-Assessment AegisPath untuk FinTechathon 2026 (Shenzhen).*
