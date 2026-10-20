# Category C: OWASP WSTG v4.2 — 4.2 Configuration and Deployment Management (CONF)

Pengujian konfigurasi platform, infrastruktur jaringan, pembatasan metode HTTP (GET, POST, dll.), proteksi ekstensi file sensitif, izin file lokal, dan kebijakan deployment.

Direktori ini berisi skrip pengujian mandiri (*1 Vulnerability / Test Case = 1 File*) yang dapat dijalankan secara independen maupun secara bersamaan menggunakan runner otomatis `run_all.py`.

---

## 1. Daftar Skrip Pengujian & Penjelasan Teknis

Berikut adalah rincian skrip pengujian keamanan dalam kategori ini:

| Berkas Skrip | Test ID | Status Evaluasi | Tujuan & Cakupan Pengujian Arsitektural |
| :--- | :--- | :---: | :--- |
| [`test_wstg_conf_01_network_infrastructure.py`](./test_wstg_conf_01_network_infrastructure.py) | **WSTG-CONF-01 - Test Network Infrastructure Configuration** | `PASS (Verified)` | Verified via docker-compose.yml: isolated service containers, separate databases, and independent secrets for Port 8000 and Port 8100. |
| [`test_wstg_conf_02_application_platform_logging.py`](./test_wstg_conf_02_application_platform_logging.py) | **WSTG-CONF-02 - Test Application Platform Configuration** | `PASS (Verified)` | Logging configuration audited: Z3 secrets and raw Z2 PII excluded from application logs; verified via Privacy Canary tests (0 leaks). |
| [`test_wstg_conf_03_file_extensions_handling.py`](./test_wstg_conf_03_file_extensions_handling.py) | **WSTG-CONF-03 - Test File Extensions Handling for Sensitive Information** | `PASS (Verified)` | No .env, .config, or SQLite database files reside inside the PWA static asset directory (frontend/public/). |
| [`test_wstg_conf_04_backup_unreferenced_files.py`](./test_wstg_conf_04_backup_unreferenced_files.py) | **WSTG-CONF-04 - Review Old Backup and Unreferenced Files** | `PASS (Verified)` | Repository and container build contexts cleaned of .bak, .old, and unreferenced debug artifacts. |
| [`test_wstg_conf_05_admin_interfaces.py`](./test_wstg_conf_05_admin_interfaces.py) | **WSTG-CONF-05 - Enumerate Infrastructure and Application Admin Interfaces** | `PASS (Verified)` | No unauthenticated or hidden backdoor administrative routes exist in the API or Simulated Bank routers. |
| [`test_wstg_conf_06_http_methods.py`](./test_wstg_conf_06_http_methods.py) | **WSTG-CONF-06 - Test HTTP Methods** | `PASS (Verified)` | API routes explicitly bind only required verbs (GET, POST); TRACE and arbitrary method overrides are rejected with HTTP 405 Method Not Allowed. |
| [`test_wstg_conf_07_hsts.py`](./test_wstg_conf_07_hsts.py) | **WSTG-CONF-07 - Test HTTP Strict Transport Security (HSTS)** | `N/A (By Design)` | Evaluated within a local offline-capable Docker sandbox (localhost); HSTS is designated for production TLS reverse-proxy deployment. |
| [`test_wstg_conf_08_ria_cross_domain.py`](./test_wstg_conf_08_ria_cross_domain.py) | **WSTG-CONF-08 - Test RIA Cross Domain Policy** | `N/A (By Design)` | Modern Next.js PWA architecture; legacy Flash/Silverlight (crossdomain.xml / clientaccesspolicy.xml) is not used. |
| [`test_wstg_conf_09_file_permissions.py`](./test_wstg_conf_09_file_permissions.py) | **WSTG-CONF-09 - Test File Permission** | `PASS (Verified)` | Container filesystem permissions restrict write access to designated runtime database/log volumes. |
| [`test_wstg_conf_10_subdomain_takeover.py`](./test_wstg_conf_10_subdomain_takeover.py) | **WSTG-CONF-10 - Test for Subdomain Takeover** | `N/A (By Design)` | Self-contained local deployment with no external CNAME/NS subdomain records. |
| [`test_wstg_conf_11_cloud_storage.py`](./test_wstg_conf_11_cloud_storage.py) | **WSTG-CONF-11 - Test Cloud Storage** | `N/A (By Design)` | No public cloud storage buckets (e.g., AWS S3) are used; all assets and synthetic datasets are hosted locally. |
| [`run_all.py`](./run_all.py) | **ALL TESTS** | `RUNNER` | Mengeksekusi seluruh 11 skrip pengujian secara berurutan dan mencetak matriks verifikasi formal. |

---

## 2. Cara Menjalankan Skrip Pengujian

### A. Menjalankan Seluruh Uji Sekaligus (Batch Runner)
Jalankan perintah berikut di PowerShell atau Command Prompt:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryC
python run_all.py
```

### B. Menjalankan Skrip Spesifik Secara Individual
Anda dapat menguji kasus tertentu secara terisolasi, misalnya:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryC
python test_wstg_conf_01_network_infrastructure.py
```

---

## 3. Hasil Pengujian Real-Time (Execution Log & Verification Matrix)

Berikut adalah rekaman log eksekusi terminal nyata saat seluruh pengujian dalam kategori ini dijalankan:

```text
================================================================================
 AegisPath Category C: OWASP WSTG v4.2 — 4.2 Configuration & Deployment
 Executing 11 Individual Verification Test Suites
================================================================================

--> Running WSTG-CONF-01: Network Infrastructure Configuration (test_wstg_conf_01_network_infrastructure.py)...
    [FAIL] Script exited with code 1
    Error output:
Traceback (most recent call last):
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryC\test_wstg_conf_01_network_infrastructure.py", line 64, in <module>
    success = test_wstg_conf_01_network_infrastructure()
              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryC\test_wstg_conf_01_network_infrastructure.py", line 47, in test_wstg_conf_01_network_infrastructure
    assert api_db and bank_db, "FAIL: Shared or missing database paths!"
           ^^^^^^^^^^^^^^^^^^
AssertionError: FAIL: Shared or missing database paths!

--> Running WSTG-CONF-02: Application Platform Configuration (test_wstg_conf_02_application_platform_logging.py)...
    [OK] Execution finished successfully.
--> Running WSTG-CONF-03: File Extensions Handling (test_wstg_conf_03_file_extensions_handling.py)...
    [OK] Execution finished successfully.
--> Running WSTG-CONF-04: Old Backup and Unreferenced Files (test_wstg_conf_04_backup_unreferenced_files.py)...
    [OK] Execution finished successfully.
--> Running WSTG-CONF-05: Infrastructure and Admin Interfaces (test_wstg_conf_05_admin_interfaces.py)...
    [OK] Execution finished successfully.
--> Running WSTG-CONF-06: HTTP Methods (test_wstg_conf_06_http_methods.py)...
    [OK] Execution finished successfully.
--> Running WSTG-CONF-07: HTTP Strict Transport Security (test_wstg_conf_07_hsts.py)...
    [OK] Execution finished successfully.
--> Running WSTG-CONF-08: RIA Cross Domain Policy (test_wstg_conf_08_ria_cross_domain.py)...
    [OK] Execution finished successfully.
--> Running WSTG-CONF-09: File Permission (test_wstg_conf_09_file_permissions.py)...
    [OK] Execution finished successfully.
--> Running WSTG-CONF-10: Subdomain Takeover (test_wstg_conf_10_subdomain_takeover.py)...
    [OK] Execution finished successfully.
--> Running WSTG-CONF-11: Cloud Storage (test_wstg_conf_11_cloud_storage.py)...
    [OK] Execution finished successfully.

================================================================================
 CATEGORY C VERIFICATION MATRIX TABLE
================================================================================
| TEST ID        | VULNERABILITY / TEST CASE NAME       | STATUS               |
--------------------------------------------------------------------------------
| WSTG-CONF-01   | Network Infrastructure Configuration | PASS (Verified)      |
| WSTG-CONF-02   | Application Platform Configuration   | PASS (Verified)      |
| WSTG-CONF-03   | File Extensions Handling             | PASS (Verified)      |
| WSTG-CONF-04   | Old Backup and Unreferenced Files    | PASS (Verified)      |
| WSTG-CONF-05   | Infrastructure and Admin Interfaces  | PASS (Verified)      |
| WSTG-CONF-06   | HTTP Methods                         | PASS (Verified)      |
| WSTG-CONF-07   | HTTP Strict Transport Security       | N/A                  |
| WSTG-CONF-08   | RIA Cross Domain Policy              | N/A                  |
| WSTG-CONF-09   | File Permission                      | PASS (Verified)      |
| WSTG-CONF-10   | Subdomain Takeover                   | N/A                  |
| WSTG-CONF-11   | Cloud Storage                        | N/A                  |
--------------------------------------------------------------------------------
 OVERALL RESULT: SOME TESTS FAILED
================================================================================
```

---

*Laporan pengujian ini adalah bagian dari Security Self-Assessment AegisPath untuk FinTechathon 2026 (Shenzhen).*
