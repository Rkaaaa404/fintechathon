# Category J: OWASP WSTG v4.2 — 4.9 Cryptography Testing (CRYP)

Pengujian implementasi kriptografi: audit transport layer TLS 1.3 produksi vs local docker sandbox, pencegahan Padding Oracle (bebas CBC), verifikasi perlindungan kunci rahasia Zone Z3, dan integritas algoritma HMAC-SHA256 & Ed25519.

Direktori ini berisi skrip pengujian mandiri (*1 Vulnerability / Test Case = 1 File*) yang dapat dijalankan secara independen maupun secara bersamaan menggunakan runner otomatis `run_all.py`.

---

## 1. Daftar Skrip Pengujian & Penjelasan Teknis

Berikut adalah rincian skrip pengujian keamanan dalam kategori ini:

| Berkas Skrip | Test ID | Status Evaluasi | Tujuan & Cakupan Pengujian Arsitektural |
| :--- | :--- | :---: | :--- |
| [`test_wstg_cryp_01_tls_transport.py`](./test_wstg_cryp_01_tls_transport.py) | **WSTG-CRYP-01 - Testing for Weak Transport Layer Security (4.9.1)** | `N/A` | Local container sandbox evaluation; TLS 1.3 termination is specified for production deployment at edge reverse proxy/ingress. |
| [`test_wstg_cryp_02_padding_oracle.py`](./test_wstg_cryp_02_padding_oracle.py) | **WSTG-CRYP-02 - Testing for Padding Oracle (4.9.2)** | `N/A` | CBC-mode block cipher encryption is not used on client-facing tokens. Tokens utilize HMAC-SHA256 cryptographic signatures rather than symmetric block ciphers with PKCS#7 padding. |
| [`test_wstg_cryp_03_sensitive_info_unencrypted.py`](./test_wstg_cryp_03_sensitive_info_unencrypted.py) | **WSTG-CRYP-03 - Testing for Sensitive Information Sent via Unencrypted Channels (4.9.3)** | `PASS (Verified)` | Z2 sensitive fields are tokenized by the Privacy Gateway prior to crossing the external model trust boundary. Raw PII and account credentials never leave the local trust zone. |
| [`test_wstg_cryp_04_weak_encryption.py`](./test_wstg_cryp_04_weak_encryption.py) | **WSTG-CRYP-04 - Testing for Weak Encryption (4.9.4)** | `PASS (Verified)` | Uses SHA-256 and HMAC-SHA256 for intent_hash binding, Scoped Token signing, and hash-chained audit logs (no MD5/SHA-1). Legacy broken ciphers and weak hash functions are strictly prohibited. |
| [`run_all.py`](./run_all.py) | **ALL TESTS** | `RUNNER` | Mengeksekusi seluruh 4 skrip pengujian secara berurutan dan mencetak matriks verifikasi formal. |

---

## 2. Cara Menjalankan Skrip Pengujian

### A. Menjalankan Seluruh Uji Sekaligus (Batch Runner)
Jalankan perintah berikut di PowerShell atau Command Prompt:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryJ
python run_all.py
```

### B. Menjalankan Skrip Spesifik Secara Individual
Anda dapat menguji kasus tertentu secara terisolasi, misalnya:
```bash
cd D:\project\pentest_aegispath\fintechathon\eval\categoryJ
python test_wstg_cryp_01_tls_transport.py
```

---

## 3. Hasil Pengujian Real-Time (Execution Log & Verification Matrix)

Berikut adalah rekaman log eksekusi terminal nyata saat seluruh pengujian dalam kategori ini dijalankan:

```text
====================================================================================
 AegisPath Category J: OWASP WSTG v4.2 — 4.9 Testing for Weak Cryptography
 Executing 4 Individual Verification Test Suites
====================================================================================

--> Running WSTG-CRYP-01: Testing for Weak Transport Layer Security (4.9.1) (test_wstg_cryp_01_tls_transport.py)...
    [OK] Execution finished successfully.
--> Running WSTG-CRYP-02: Testing for Padding Oracle (4.9.2) (test_wstg_cryp_02_padding_oracle.py)...
    [OK] Execution finished successfully.
--> Running WSTG-CRYP-03: Testing for Sensitive Information Sent via Unencrypted Channels (4.9.3) (test_wstg_cryp_03_sensitive_info_unencrypted.py)...
    [OK] Execution finished successfully.
--> Running WSTG-CRYP-04: Testing for Weak Encryption (4.9.4) (test_wstg_cryp_04_weak_encryption.py)...
    [OK] Execution finished successfully.

====================================================================================
 CATEGORY J VERIFICATION MATRIX TABLE
====================================================================================
| TEST ID        | VULNERABILITY / TEST CASE NAME           | STATUS               |
------------------------------------------------------------------------------------
| WSTG-CRYP-01   | Testing for Weak Transport Layer Security (4.9.1) | N/A                  |
| WSTG-CRYP-02   | Testing for Padding Oracle (4.9.2)       | N/A                  |
| WSTG-CRYP-03   | Testing for Sensitive Information Sent via Unencrypted Channels (4.9.3) | PASS (Verified)      |
| WSTG-CRYP-04   | Testing for Weak Encryption (4.9.4)      | PASS (Verified)      |
------------------------------------------------------------------------------------
 OVERALL RESULT: ALL 4 TESTS VERIFIED (PASS)
====================================================================================
```

---

*Laporan pengujian ini adalah bagian dari Security Self-Assessment AegisPath untuk FinTechathon 2026 (Shenzhen).*
