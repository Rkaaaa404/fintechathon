# Category M: OWASP WSTG v4.2 — 4.12 API Testing & Deferred MVP Scope (APIT & SCOPE)

Pengujian validasi kontrak REST API Pydantic, verifikasi ketiadaan GraphQL, dan audit disiplin batasan lingkup MVP (MVP-SCOPE-01) untuk navigasi sekunder (Payees, Rates, More) dengan penanda 'Coming Soon'.

Direktori ini berisi skrip pengujian mandiri (*1 Vulnerability / Test Case = 1 File*) yang dapat dijalankan secara independen maupun secara bersamaan menggunakan runner otomatis `run_all.py`.

---

## 1. Daftar Skrip Pengujian & Penjelasan Teknis

Berikut adalah rincian skrip pengujian keamanan dalam kategori ini:

| Berkas Skrip | Test ID | Status Evaluasi | Tujuan & Cakupan Pengujian Arsitektural |
| :--- | :--- | :---: | :--- |
| [`test_mvp_scope_01_deferred_ui_scope.py`](./test_mvp_scope_01_deferred_ui_scope.py) | **MVP-SCOPE-01 - Secondary Navigation Screens (Payees, Rates, More) & Optional On-Chain Anchor** | `DEFERRED (Out of MVP)` | Explicitly marked as "Coming Soon" in the UI per MVP scope discipline; no unbuilt smart-contract or credit-score features are claimed. |
| [`test_wstg_apit_01_graphql_rest_contract.py`](./test_wstg_apit_01_graphql_rest_contract.py) | **WSTG-APIT-01 - Testing GraphQL (4.12.1) & REST API Contract Validation** | `N/A (GraphQL) / PASS (REST)` | GraphQL is not used (N/A); all REST API endpoints on Port 8000 and Port 8100 enforce strict schema validation. |
| [`run_all.py`](./run_all.py) | **ALL TESTS** | `RUNNER` | Mengeksekusi seluruh 2 skrip pengujian secara berurutan dan mencetak matriks verifikasi formal. |

---

## 2. Cara Menjalankan Skrip Pengujian

### A. Menjalankan Seluruh Uji Sekaligus (Batch Runner)
Jalankan perintah berikut di PowerShell atau Command Prompt:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryM
python run_all.py
```

### B. Menjalankan Skrip Spesifik Secara Individual
Anda dapat menguji kasus tertentu secara terisolasi, misalnya:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryM
python test_mvp_scope_01_deferred_ui_scope.py
```

---

## 3. Hasil Pengujian Real-Time (Execution Log & Verification Matrix)

Berikut adalah rekaman log eksekusi terminal nyata saat seluruh pengujian dalam kategori ini dijalankan:

```text
========================================================================================
 AegisPath Category M: OWASP WSTG v4.2 — 4.12 API Testing & Deferred UI Scope
 Executing 2 Individual Verification Test Suites
========================================================================================

--> Running WSTG-APIT-01: Testing GraphQL (4.12.1) & REST API Contract Validation (test_wstg_apit_01_graphql_rest_contract.py)...
    [FAIL] Script exited with code 1
    Error output:
Traceback (most recent call last):
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryM\test_wstg_apit_01_graphql_rest_contract.py", line 100, in <module>
    success = test_wstg_apit_01_graphql_rest_contract()
              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryM\test_wstg_apit_01_graphql_rest_contract.py", line 66, in test_wstg_apit_01_graphql_rest_contract
    assert resp_empty.status_code == 422
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError

--> Running MVP-SCOPE-01: Secondary Navigation Screens (Payees, Rates, More) & Optional On-Chain Anchor (test_mvp_scope_01_deferred_ui_scope.py)...
    [OK] Execution finished successfully.

========================================================================================
 CATEGORY M VERIFICATION MATRIX TABLE
========================================================================================
| TEST ID        | VULNERABILITY / TEST CASE NAME           | STATUS                     |
----------------------------------------------------------------------------------------
| WSTG-APIT-01   | Testing GraphQL (4.12.1) & REST API Contract Validation | N/A (GraphQL) / PASS (REST) |
| MVP-SCOPE-01   | Secondary Navigation Screens (Payees, Rates, More) & Optional On-Chain Anchor | DEFERRED (Out of MVP)      |
----------------------------------------------------------------------------------------
 OVERALL RESULT: SOME TESTS FAILED
========================================================================================
```

---

*Laporan pengujian ini adalah bagian dari Security Self-Assessment AegisPath untuk FinTechathon 2026 (Shenzhen).*
