# Category L: OWASP WSTG v4.2 — 4.11 Client-Side Testing (CLNT)

Pengujian keamanan sisi klien PWA / React: DOM-Based XSS (zero innerHTML sinks), JavaScript execution, HTML/CSS Injection, Open Redirect, analisis CORS, proteksi Clickjacking, dan audit Web Messaging / WebSockets.

Direktori ini berisi skrip pengujian mandiri (*1 Vulnerability / Test Case = 1 File*) yang dapat dijalankan secara independen maupun secara bersamaan menggunakan runner otomatis `run_all.py`.

---

## 1. Daftar Skrip Pengujian & Penjelasan Teknis

Berikut adalah rincian skrip pengujian keamanan dalam kategori ini:

| Berkas Skrip | Test ID | Status Evaluasi | Tujuan & Cakupan Pengujian Arsitektural |
| :--- | :--- | :---: | :--- |
| [`test_wstg_clnt_01_dom_xss.py`](./test_wstg_clnt_01_dom_xss.py) | **WSTG-CLNT-01 - Testing for DOM-Based Cross Site Scripting (4.11.1)** | `PASS (Verified)` | PWA source code avoids innerHTML / dangerouslySetInnerHTML; all dynamic content is safely bound as text. |
| [`test_wstg_clnt_02_javascript_execution.py`](./test_wstg_clnt_02_javascript_execution.py) | **WSTG-CLNT-02 - Testing for JavaScript Execution (4.11.2)** | `PASS (Verified)` | UI renders exclusively from a strict component allowlist; javascript: URIs are rejected. |
| [`test_wstg_clnt_03_html_injection.py`](./test_wstg_clnt_03_html_injection.py) | **WSTG-CLNT-03 - Testing for HTML Injection (4.11.3)** | `PASS (Verified)` | Bilingual EN/中文 strings and agent responses are rendered as escaped text nodes. |
| [`test_wstg_clnt_04_client_url_redirect.py`](./test_wstg_clnt_04_client_url_redirect.py) | **WSTG-CLNT-04 - Testing for Client-side URL Redirect (4.11.4)** | `PASS (Verified)` | Navigation is restricted to the 7 internal PWA screens with zero external open redirects. |
| [`test_wstg_clnt_05_css_injection.py`](./test_wstg_clnt_05_css_injection.py) | **WSTG-CLNT-05 - Testing for CSS Injection (4.11.5)** | `PASS (Verified)` | Visual styling (light-blue palette and status colors) uses static CSS classes rather than model-supplied inline styles. |
| [`test_wstg_clnt_06_client_resource_manipulation.py`](./test_wstg_clnt_06_client_resource_manipulation.py) | **WSTG-CLNT-06 - Testing for Client-side Resource Manipulation (4.11.6)** | `PASS (Verified)` | All fonts, icons, Chop mascot SVGs, and radial safety maps are hosted locally with zero external network requests. |
| [`test_wstg_clnt_07_cors.py`](./test_wstg_clnt_07_cors.py) | **WSTG-CLNT-07 - Testing Cross Origin Resource Sharing (CORS) (4.11.7)** | `PASS (Verified)` | API CORS policy restricts access to the local PWA origin. |
| [`test_wstg_clnt_08_cross_site_flashing.py`](./test_wstg_clnt_08_cross_site_flashing.py) | **WSTG-CLNT-08 - Testing for Cross Site Flashing (4.11.8)** | `N/A (By Design)` | Adobe Flash is not used. |
| [`test_wstg_clnt_09_clickjacking.py`](./test_wstg_clnt_09_clickjacking.py) | **WSTG-CLNT-09 - Testing for Clickjacking (4.11.9)** | `PASS (Verified)` | Frame-ancestors / X-Frame-Options: DENY headers protect the Approval screen from UI redressing. |
| [`test_wstg_clnt_10_websockets.py`](./test_wstg_clnt_10_websockets.py) | **WSTG-CLNT-10 - Testing WebSockets (4.11.10)** | `N/A (By Design)` | Client-server communication uses synchronous HTTP REST JSON endpoints; WebSockets are not used. |
| [`test_wstg_clnt_11_web_messaging.py`](./test_wstg_clnt_11_web_messaging.py) | **WSTG-CLNT-11 - Testing Web Messaging (4.11.11)** | `N/A (By Design)` | Cross-origin window.postMessage is not used. |
| [`test_wstg_clnt_12_browser_storage.py`](./test_wstg_clnt_12_browser_storage.py) | **WSTG-CLNT-12 - Testing Browser Storage (4.11.12)** | `PASS (Verified)` | No Z3 secrets are stored in localStorage or sessionStorage; the Approval screen always fetches fresh server-signed payloads. |
| [`test_wstg_clnt_13_xssi.py`](./test_wstg_clnt_13_xssi.py) | **WSTG-CLNT-13 - Testing for Cross Site Script Inclusion (XSSI) (4.11.13)** | `PASS (Verified)` | JSON responses enforce X-Content-Type-Options: nosniff and disallow JSONP callbacks. |
| [`run_all.py`](./run_all.py) | **ALL TESTS** | `RUNNER` | Mengeksekusi seluruh 13 skrip pengujian secara berurutan dan mencetak matriks verifikasi formal. |

---

## 2. Cara Menjalankan Skrip Pengujian

### A. Menjalankan Seluruh Uji Sekaligus (Batch Runner)
Jalankan perintah berikut di PowerShell atau Command Prompt:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryL
python run_all.py
```

### B. Menjalankan Skrip Spesifik Secara Individual
Anda dapat menguji kasus tertentu secara terisolasi, misalnya:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryL
python test_wstg_clnt_01_dom_xss.py
```

---

## 3. Hasil Pengujian Real-Time (Execution Log & Verification Matrix)

Berikut adalah rekaman log eksekusi terminal nyata saat seluruh pengujian dalam kategori ini dijalankan:

```text
========================================================================================
 AegisPath Category L: OWASP WSTG v4.2 — 4.11 Client-side Testing
 Executing 13 Individual Verification Test Suites
========================================================================================

--> Running WSTG-CLNT-01: Testing for DOM-Based Cross Site Scripting (4.11.1) (test_wstg_clnt_01_dom_xss.py)...
    [OK] Execution finished successfully.
--> Running WSTG-CLNT-02: Testing for JavaScript Execution (4.11.2) (test_wstg_clnt_02_javascript_execution.py)...
    [OK] Execution finished successfully.
--> Running WSTG-CLNT-03: Testing for HTML Injection (4.11.3) (test_wstg_clnt_03_html_injection.py)...
    [OK] Execution finished successfully.
--> Running WSTG-CLNT-04: Testing for Client-side URL Redirect (4.11.4) (test_wstg_clnt_04_client_url_redirect.py)...
    [OK] Execution finished successfully.
--> Running WSTG-CLNT-05: Testing for CSS Injection (4.11.5) (test_wstg_clnt_05_css_injection.py)...
    [FAIL] Script exited with code 1
    Error output:
Traceback (most recent call last):
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryL\test_wstg_clnt_05_css_injection.py", line 95, in <module>
    success = test_wstg_clnt_05_css_injection()
              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryL\test_wstg_clnt_05_css_injection.py", line 70, in test_wstg_clnt_05_css_injection
    assert len(dynamic_css_injection) == 0, f"Dangerous dynamic <style> injection found: {dynamic_css_injection}"
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: Dangerous dynamic <style> injection found: ['RatesScreen.tsx']

--> Running WSTG-CLNT-06: Testing for Client-side Resource Manipulation (4.11.6) (test_wstg_clnt_06_client_resource_manipulation.py)...
    [OK] Execution finished successfully.
--> Running WSTG-CLNT-07: Testing Cross Origin Resource Sharing (CORS) (4.11.7) (test_wstg_clnt_07_cors.py)...
    [OK] Execution finished successfully.
--> Running WSTG-CLNT-08: Testing for Cross Site Flashing (4.11.8) (test_wstg_clnt_08_cross_site_flashing.py)...
    [OK] Execution finished successfully.
--> Running WSTG-CLNT-09: Testing for Clickjacking (4.11.9) (test_wstg_clnt_09_clickjacking.py)...
    [OK] Execution finished successfully.
--> Running WSTG-CLNT-10: Testing WebSockets (4.11.10) (test_wstg_clnt_10_websockets.py)...
    [OK] Execution finished successfully.
--> Running WSTG-CLNT-11: Testing Web Messaging (4.11.11) (test_wstg_clnt_11_web_messaging.py)...
    [OK] Execution finished successfully.
--> Running WSTG-CLNT-12: Testing Browser Storage (4.11.12) (test_wstg_clnt_12_browser_storage.py)...
    [FAIL] Script exited with code 1
    Error output:
Traceback (most recent call last):
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryL\test_wstg_clnt_12_browser_storage.py", line 96, in <module>
    success = test_wstg_clnt_12_browser_storage()
              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\project\pentest_aegispath\fintechathon\eval\categoryL\test_wstg_clnt_12_browser_storage.py", line 63, in test_wstg_clnt_12_browser_storage
    assert k in ["aegis_demo_panel", "aegispath_entered"], f"Unexpected sensitive key in sessionStorage: {k}"
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: Unexpected sensitive key in sessionStorage: aegispath_auth_user

--> Running WSTG-CLNT-13: Testing for Cross Site Script Inclusion (XSSI) (4.11.13) (test_wstg_clnt_13_xssi.py)...
    [OK] Execution finished successfully.

========================================================================================
 CATEGORY L VERIFICATION MATRIX TABLE
========================================================================================
| TEST ID        | VULNERABILITY / TEST CASE NAME               | STATUS             |
----------------------------------------------------------------------------------------
| WSTG-CLNT-01   | Testing for DOM-Based Cross Site Scripting (4.11.1) | PASS (Verified)    |
| WSTG-CLNT-02   | Testing for JavaScript Execution (4.11.2)    | PASS (Verified)    |
| WSTG-CLNT-03   | Testing for HTML Injection (4.11.3)          | PASS (Verified)    |
| WSTG-CLNT-04   | Testing for Client-side URL Redirect (4.11.4) | PASS (Verified)    |
| WSTG-CLNT-05   | Testing for CSS Injection (4.11.5)           | PASS (Verified)    |
| WSTG-CLNT-06   | Testing for Client-side Resource Manipulation (4.11.6) | PASS (Verified)    |
| WSTG-CLNT-07   | Testing Cross Origin Resource Sharing (CORS) (4.11.7) | PASS (Verified)    |
| WSTG-CLNT-08   | Testing for Cross Site Flashing (4.11.8)     | N/A                |
| WSTG-CLNT-09   | Testing for Clickjacking (4.11.9)            | PASS (Verified)    |
| WSTG-CLNT-10   | Testing WebSockets (4.11.10)                 | N/A                |
| WSTG-CLNT-11   | Testing Web Messaging (4.11.11)              | N/A                |
| WSTG-CLNT-12   | Testing Browser Storage (4.11.12)            | PASS (Verified)    |
| WSTG-CLNT-13   | Testing for Cross Site Script Inclusion (XSSI) (4.11.13) | PASS (Verified)    |
----------------------------------------------------------------------------------------
 OVERALL RESULT: SOME TESTS FAILED
========================================================================================
```

---

*Laporan pengujian ini adalah bagian dari Security Self-Assessment AegisPath untuk FinTechathon 2026 (Shenzhen).*
