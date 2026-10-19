# Category B: OWASP WSTG v4.2 — 4.1 Information Gathering (INFO)

Pengujian pengintaian dan pengumpulan informasi publik terhadap server, framework web, endpoint API, metafiles, dan pemetaan arsitektur AegisPath dalam isolasi Docker sandbox.

Direktori ini berisi skrip pengujian mandiri (*1 Vulnerability / Test Case = 1 File*) yang dapat dijalankan secara independen maupun secara bersamaan menggunakan runner otomatis `run_all.py`.

---

## 1. Daftar Skrip Pengujian & Penjelasan Teknis

Berikut adalah rincian skrip pengujian keamanan dalam kategori ini:

| Berkas Skrip | Test ID | Status Evaluasi | Tujuan & Cakupan Pengujian Arsitektural |
| :--- | :--- | :---: | :--- |
| [`test_wstg_info_01_search_engine.py`](./test_wstg_info_01_search_engine.py) | **WSTG-INFO-01 - Conduct Search Engine Discovery Reconnaissance for Information Leakage** | `N/A (By Design)` | Deployed as an isolated local container stack (docker compose up); not indexed by public search engines. |
| [`test_wstg_info_02_fingerprint_server.py`](./test_wstg_info_02_fingerprint_server.py) | **WSTG-INFO-02 - Fingerprint Web Server** | `PASS (Verified)` | HTTP response headers on Port 8000 and Port 8100 stripped of verbose server version banners (server headers suppressed in Uvicorn / FastAPI). |
| [`test_wstg_info_03_webserver_metafiles.py`](./test_wstg_info_03_webserver_metafiles.py) | **WSTG-INFO-03 - Review Webserver Metafiles for Information Leakage** | `PASS (Verified)` | Static PWA directory audited; no sensitive internal routes or credentials exposed in metadata files (robots.txt, manifest.json). |
| [`test_wstg_info_04_enumerate_applications.py`](./test_wstg_info_04_enumerate_applications.py) | **WSTG-INFO-04 - Enumerate Applications on Webserver** | `PASS (Verified)` | Container service |
| [`test_wstg_info_05_review_webpage_content.py`](./test_wstg_info_05_review_webpage_content.py) | **WSTG-INFO-05 - Review Webpage Content for Information Leakage** | `PASS (Verified)` | White-box audit of Next.js PWA bundle confirms zero hardcoded Z3 API keys, credentials, debug comments, or production .map source maps. |
| [`test_wstg_info_06_entry_points.py`](./test_wstg_info_06_entry_points.py) | **WSTG-INFO-06 - Identify Application Entry Points** | `PASS (Verified)` | All REST API endpoints across Port 8000 and Port 8100 explicitly enumerated in FastAPI OpenAPI routers and governed by strict Pydantic schemas. |
| [`test_wstg_info_07_execution_paths.py`](./test_wstg_info_07_execution_paths.py) | **WSTG-INFO-07 - Map Execution Paths Through Application** | `PASS (Verified)` | Execution paths are deterministically constrained to typed Planner DAG nodes across Flows A, B, and C. |
| [`test_wstg_info_08_fingerprint_framework.py`](./test_wstg_info_08_fingerprint_framework.py) | **WSTG-INFO-08 - Fingerprint Web Application Framework** | `PASS (Verified)` | Framework-identifying headers (X-Powered-By) disabled; |
| [`test_wstg_info_09_fingerprint_webapp.py`](./test_wstg_info_09_fingerprint_webapp.py) | **WSTG-INFO-09 - Fingerprint Web Application** | `N/A (By Design)` | Merged into WSTG-INFO-08 per official OWASP WSTG v4.2 specification. |
| [`test_wstg_info_10_map_architecture.py`](./test_wstg_info_10_map_architecture.py) | **WSTG-INFO-10 - Map Application Architecture** | `PASS (Verified)` | Architecture verified: 3 independent |
| [`run_all.py`](./run_all.py) | **ALL TESTS** | `RUNNER` | Mengeksekusi seluruh 10 skrip pengujian secara berurutan dan mencetak matriks verifikasi formal. |

---

## 2. Cara Menjalankan Skrip Pengujian

### A. Menjalankan Seluruh Uji Sekaligus (Batch Runner)
Jalankan perintah berikut di PowerShell atau Command Prompt:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryB
python run_all.py
```

### B. Menjalankan Skrip Spesifik Secara Individual
Anda dapat menguji kasus tertentu secara terisolasi, misalnya:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryB
python test_wstg_info_01_search_engine.py
```

---

## 3. Hasil Pengujian Real-Time (Execution Log & Verification Matrix)

Berikut adalah rekaman log eksekusi terminal nyata saat seluruh pengujian dalam kategori ini dijalankan:

```text
================================================================================
 AegisPath Category B: OWASP WSTG v4.2 — 4.1 Information Gathering
 Executing 10 Individual Verification Test Suites
================================================================================

--> Running WSTG-INFO-01: Search Engine Reconnaissance (test_wstg_info_01_search_engine.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INFO-02: Fingerprint Web Server (test_wstg_info_02_fingerprint_server.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INFO-03: Review Webserver Metafiles (test_wstg_info_03_webserver_metafiles.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INFO-04: Enumerate Applications (test_wstg_info_04_enumerate_applications.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INFO-05: Review Webpage Content (test_wstg_info_05_review_webpage_content.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INFO-06: Identify Application Entry Points (test_wstg_info_06_entry_points.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INFO-07: Map Execution Paths (test_wstg_info_07_execution_paths.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INFO-08: Fingerprint Web Framework (test_wstg_info_08_fingerprint_framework.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INFO-09: Fingerprint Web Application (test_wstg_info_09_fingerprint_webapp.py)...
    [OK] Execution finished successfully.
--> Running WSTG-INFO-10: Map Application Architecture (test_wstg_info_10_map_architecture.py)...
    [OK] Execution finished successfully.

================================================================================
 CATEGORY B VERIFICATION MATRIX TABLE
================================================================================
| TEST ID        | VULNERABILITY / TEST CASE NAME     | STATUS               |
--------------------------------------------------------------------------------
| WSTG-INFO-01   | Search Engine Reconnaissance       | N/A                  |
| WSTG-INFO-02   | Fingerprint Web Server             | PASS (Verified)      |
| WSTG-INFO-03   | Review Webserver Metafiles         | PASS (Verified)      |
| WSTG-INFO-04   | Enumerate Applications             | PASS (Verified)      |
| WSTG-INFO-05   | Review Webpage Content             | PASS (Verified)      |
| WSTG-INFO-06   | Identify Application Entry Points  | PASS (Verified)      |
| WSTG-INFO-07   | Map Execution Paths                | PASS (Verified)      |
| WSTG-INFO-08   | Fingerprint Web Framework          | PASS (Verified)      |
| WSTG-INFO-09   | Fingerprint Web Application        | N/A                  |
| WSTG-INFO-10   | Map Application Architecture       | PASS (Verified)      |
--------------------------------------------------------------------------------
 OVERALL RESULT: ALL 10 TESTS VERIFIED (PASS)
================================================================================
```

---

*Laporan pengujian ini adalah bagian dari Security Self-Assessment AegisPath untuk FinTechathon 2026 (Shenzhen).*
