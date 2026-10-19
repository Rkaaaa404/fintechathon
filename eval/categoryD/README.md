# Category D: OWASP WSTG v4.2 — 4.3 Identity Management Testing (IDNT)

Pengujian pemisahan peran operasional (Separation of Duties), pencegahan enumerasi akun, dan audit integritas akun mahasiswa sintetis testnet terisolasi.

Direktori ini berisi skrip pengujian mandiri (*1 Vulnerability / Test Case = 1 File*) yang dapat dijalankan secara independen maupun secara bersamaan menggunakan runner otomatis `run_all.py`.

---

## 1. Daftar Skrip Pengujian & Penjelasan Teknis

Berikut adalah rincian skrip pengujian keamanan dalam kategori ini:

| Berkas Skrip | Test ID | Status Evaluasi | Tujuan & Cakupan Pengujian Arsitektural |
| :--- | :--- | :---: | :--- |
| [`test_wstg_idnt_01_role_definitions.py`](./test_wstg_idnt_01_role_definitions.py) | **WSTG-IDNT-01 - Test Role Definitions** | `PASS (Verified)` | Strict separation between User, Agent (T0–T3), Policy Plane (Port 8000), and Bank (Port 8100), enforcing maker-checker approval on Tier T2. |
| [`test_wstg_idnt_02_user_registration.py`](./test_wstg_idnt_02_user_registration.py) | **WSTG-IDNT-02 - Test User Registration Process** | `N/A (By Design)` | MVP operates on pre-seeded synthetic international student profiles; live public registration and real KYC are out of scope. |
| [`test_wstg_idnt_03_account_provisioning.py`](./test_wstg_idnt_03_account_provisioning.py) | **WSTG-IDNT-03 - Test Account Provisioning Process** | `N/A (By Design)` | Accounts are deterministically seeded via synthetic fixture scripts for reproducible sandbox evaluation. |
| [`test_wstg_idnt_04_account_enumeration.py`](./test_wstg_idnt_04_account_enumeration.py) | **WSTG-IDNT-04 - Testing for Account Enumeration and Guessable User Account** | `PASS (Verified)` | Shared Prove evidence packages use high-entropy, non-sequential tokens and return uniform status responses when expired or revoked. |
| [`test_wstg_idnt_05_username_policy.py`](./test_wstg_idnt_05_username_policy.py) | **WSTG-IDNT-05 - Testing for Weak or Unenforced Username Policy** | `N/A (By Design)` | Public username self-registration is not applicable in the MVP sandbox. |
| [`run_all.py`](./run_all.py) | **ALL TESTS** | `RUNNER` | Mengeksekusi seluruh 5 skrip pengujian secara berurutan dan mencetak matriks verifikasi formal. |

---

## 2. Cara Menjalankan Skrip Pengujian

### A. Menjalankan Seluruh Uji Sekaligus (Batch Runner)
Jalankan perintah berikut di PowerShell atau Command Prompt:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryD
python run_all.py
```

### B. Menjalankan Skrip Spesifik Secara Individual
Anda dapat menguji kasus tertentu secara terisolasi, misalnya:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryD
python test_wstg_idnt_01_role_definitions.py
```

---

## 3. Hasil Pengujian Real-Time (Execution Log & Verification Matrix)

Berikut adalah rekaman log eksekusi terminal nyata saat seluruh pengujian dalam kategori ini dijalankan:

```text
================================================================================
 AegisPath Category D: OWASP WSTG v4.2 — 4.3 Identity Management
 Executing 5 Individual Verification Test Suites
================================================================================

--> Running WSTG-IDNT-01: Test Role Definitions (test_wstg_idnt_01_role_definitions.py)...
    [OK] Execution finished successfully.
--> Running WSTG-IDNT-02: User Registration Process (test_wstg_idnt_02_user_registration.py)...
    [OK] Execution finished successfully.
--> Running WSTG-IDNT-03: Account Provisioning Process (test_wstg_idnt_03_account_provisioning.py)...
    [OK] Execution finished successfully.
--> Running WSTG-IDNT-04: Account Enumeration & Guessable User Account (test_wstg_idnt_04_account_enumeration.py)...
    [OK] Execution finished successfully.
--> Running WSTG-IDNT-05: Weak or Unenforced Username Policy (test_wstg_idnt_05_username_policy.py)...
    [OK] Execution finished successfully.

================================================================================
 CATEGORY D VERIFICATION MATRIX TABLE
================================================================================
| TEST ID        | VULNERABILITY / TEST CASE NAME           | STATUS               |
--------------------------------------------------------------------------------
| WSTG-IDNT-01   | Test Role Definitions                    | PASS (Verified)      |
| WSTG-IDNT-02   | User Registration Process                | N/A                  |
| WSTG-IDNT-03   | Account Provisioning Process             | N/A                  |
| WSTG-IDNT-04   | Account Enumeration & Guessable User Account | PASS (Verified)      |
| WSTG-IDNT-05   | Weak or Unenforced Username Policy       | N/A                  |
--------------------------------------------------------------------------------
 OVERALL RESULT: ALL 5 TESTS VERIFIED (PASS)
================================================================================
```

---

*Laporan pengujian ini adalah bagian dari Security Self-Assessment AegisPath untuk FinTechathon 2026 (Shenzhen).*
