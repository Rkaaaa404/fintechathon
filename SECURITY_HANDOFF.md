# SECURITY_HANDOFF.md — AegisPath Security Revalidation & Remediation

**Date:** 2026-10-19  
**Target Environment:** Local Multi-Service Sandbox (`backend/api` :8000, `backend/bank` :8100, `frontend` :3000/:3300)  
**Author:** AI Engineering Assistant (Security Remediation Task)  
**Reference Document:** `Security Self Assessment - Aegispath.md` & `docs/security-revalidation.md`

---

## 1. Ringkasan Eksekutif (Executive Summary)

Berdasarkan dokumen asesmen mandiri (`Security Self Assessment - Aegispath.md`), kami melakukan investigasi *white-box*, revalidasi berbasis *reproduction*, serta penambalan (*patching*) terhadap isu keamanan kritis dan *quick wins*.

**Prinsip Kerja:**
- Klaim "PASS" pada dokumen asesmen awal **tidak diperlakukan sebagai bukti**, melainkan sebagai hipotesis yang harus diuji ulang pada database temporer terisolasi.
- Fitur di luar cakupan MVP (misal: pendaftaran publik/KYC riil, integrasi perbankan/SWIFT produksi, implementasi WebAuthn perangkat keras riil, migrasi database cloud IAM, dan layar sekunder *Coming Soon*) **tidak diperluas**, melainkan didokumentasikan secara transparan tanpa klaim palsu.
- Seluruh celah kritis yang terverifikasi berhasil ditambal, diuji dengan *regression test*, serta divalidasi end-to-end tanpa merusak alur demo (*Golden Flows A, B, C*).

---

## 2. Celah Keamanan yang Direproduksi (Pre-Patch Findings)

Sebelum perbaikan dilakukan, pengujian pada database sandbox mereproduksi celah-celah berikut:

| No | Kategori | Temuan & Dampak | Lokasi Kode | Bukti Reproduksi |
|:---|:---|:---|:---|:---|
| 1 | **Kritis** | **API Authentication Bypass & Token Confusion**: Header `Authorization` tidak divalidasi secara fail-closed; request tanpa token otomatis diperlakukan sebagai user `usr_ayu`. | `backend/api/main.py` (`get_current_user`) | Request HTTP POST ke `/v1/agent/messages`, `/v1/policy`, dan `/v1/plans/.../approve` tanpa token menghasilkan `200 OK` dan mutasi saldo. |
| 2 | **Kritis** | **Non-Atomic Bank Ledger Mutation**: Saldo dibaca, batas dicek, dan mutasi saldo/ledger dilakukan terpisah tanpa transaksi atomik. | `backend/bank/main.py` (`execute_transfer`) | Race condition pada request konkuren: 2 debit ledger $200.42 tercatat, namun saldo rekening hanya berkurang 1 kali ($200.42 bukannya $400.84). |
| 3 | **Tinggi** | **Approval Tampering & Stored Plan Mismatch**: Endpoint `approve_plan` tidak memverifikasi ulang kesesuaian parameter yang tersimpan dengan `intent_hash` kanonikal sebelum mencetak token bank. | `backend/api/main.py` (`approve_plan`) | Mengubah parameter di tabel `plans` (misal nominal transfer) tetap lolos eksekusi jika hash awal disertakan. |
| 4 | **Tinggi** | **Missing Bank-Side Constraints**: Bank daemon tidak memvalidasi allowlist rekening-ke-payee dan batas mandiri bank ($1.000) sebelum idempotency cache. Nonce hangus pada transfer gagal. | `backend/bank/main.py`, `backend/bank/security.py` | Token palsu/salah signature yang masuk cache idempotensi dapat di-replay; transfer ke rekening asing tanpa izin bank tetap tereksekusi. |
| 5 | **Tinggi** | **Database Startup Balance Refill**: Fungsi `init_db()` pada bank otomatis me-reset saldo akun demo menjadi $12.450 jika saldo di bawah angka tersebut saat restart. | `backend/bank/database.py` (`init_db`) | Restart daemon bank merusak riwayat akuntansi dan saldo riil yang tersisa. |
| 6 | **Medium (Quick Win)** | **Wildcard CORS Policy**: `allow_origins=["*"]` terpasang pada API Gateway (:8000) dan Bank daemon (:8100). | `backend/api/main.py`, `backend/bank/main.py` | Origin berbahaya (`https://attacker.invalid`) menerima respon `200 OK` pada preflight OPTIONS dengan refleksi origin. |
| 7 | **Medium (Quick Win)** | **Ketiadaan Security Headers**: Respons HTTP tidak menyertakan proteksi framing (clickjacking) dan pelarangan MIME-sniffing/caching. | `backend/api/main.py`, `backend/bank/main.py`, `frontend/next.config.ts` | Header `X-Frame-Options`, `Content-Security-Policy: frame-ancestors`, `Cache-Control: no-store`, dan `X-Content-Type-Options: nosniff` tidak ada. |
| 8 | **Konfigurasi** | **Insecure Secret & Broad Port Binding**: Docker Compose mengikat port ke `0.0.0.0` dan menyertakan secret kunci statis (`dev_shared_secret...`). | `docker-compose.yml`, `backend/api/config.py`, `backend/bank/config.py` | Layanan terekspos ke seluruh antarmuka jaringan lokal dengan kunci enkripsi default yang mudah ditebak. |

---

## 3. Rincian Perubahan & Patch yang Diterapkan (Changes Implemented)

### A. Lapisan API Gateway & Policy Plane (`backend/api/`)
1. **Enforce Bearer Authentication Fail-Closed** (`backend/api/main.py`, `backend/api/auth.py`):
   - `get_current_user` mewajibkan token Bearer dengan klaim `type == "access"`. Token refresh, token tanpa `sub`, atau ketiadaan header akan menghasilkan `401 Unauthorized`.
   - Endpoint demo-login (`/v1/auth/demo-login`) dikontrol oleh flag konfigurasi `API_DEMO_AUTH_ENABLED` (default: `false`).
2. **Kanonikalisasi & Validasi Integritas Intent** (`backend/transfer_intent.py`, `backend/api/main.py`, `backend/api/policy.py`):
   - Dibuat helper kanonikal `compute_intent_hash` yang memvalidasi tipe data angka, format desimal mata uang (maksimal 2 digit), dan nilai string wajib (`payee_id`, `payee_name`, `amount_usd`, `fee_usd`, `currency`, `rate`, `route_id`).
   - Endpoint `approve_plan` memvalidasi kepemilikan plan (`WHERE plan_id = ? AND user_id = ?`), mengecek integritas data tersimpan terhadap hash, serta mengharuskan `demo_consent: true`.
   - Reservasi penggunaan batas harian (`used_today_usd`) dilakukan sebelum eksekusi bank dan otomatis di-rollback jika transfer bank gagal atau tidak terkonfirmasi.
3. **Penyempurnaan Token Scoped** (`backend/api/tokens.py`):
   - `create_scoped_bank_token` mengikat parameter `intent_hash`, `idempotency_key`, `currency`, `rate`, dan `route_id` ke dalam payload HMAC-SHA256 dengan kanonikalisasi JSON bebas spasi (`separators=(',', ':')`).

### B. Lapisan Bank Daemon & Ledger (`backend/bank/`)
1. **Transaksi Atomik & Kunci Baris Saldo** (`backend/bank/main.py`):
   - Eksekusi transfer dibungkus dalam blok transaksi `BEGIN IMMEDIATE` pada SQLite.
   - Perhitungan dilakukan menggunakan representasi integer sen (*cents*) untuk mencegah kesalahan pembulatan *floating point*.
2. **Validasi Kriptografis Independen (Inner Ring)** (`backend/bank/main.py`, `backend/bank/security.py`, `backend/bank/config.py`):
   - Verifikasi tanda tangan HMAC-SHA256, batas waktu (*TTL expiration*), nonce unik (*single-use*), dan allowlist penerima (`ALLOWED_PAYEES`) dijalankan **sebelum** melihat cache idempotensi atau menyentuh ledger.
   - Diberlakukan batas mandiri bank: maksimal $1.000 per transfer (`SINGLE_SEND_CAP_USD`), batas $1.000 per hari kalender UTC (`DAILY_CAP_USD`), dan batas biaya transfer maksimal $18,00 (`MAX_FEE_USD`).
3. **Penghapusan Auto-Refill Database** (`backend/bank/database.py`):
   - Dihapus logika `init_db()` yang mereset saldo ke $12.450 saat restart, menjaga persistensi akuntansi riil di lingkungan sandbox.

### C. Proteksi Klien, Browser & Jaringan (Quick Wins)
1. **Restriksi CORS Terpercaya** (`backend/api/main.py`, `backend/bank/main.py`, `backend/api/config.py`):
   - Origin diatur spesifik melalui `CORS_ORIGINS` (default: `http://localhost:3000,http://127.0.0.1:3000`). Wildcard `*` ditolak saat runtime.
   - Middleware CORS dihapus total dari daemon Bank (:8100) karena bank hanya diakses inter-service oleh API Gateway, bukan browser.
2. **Injeksi Security Headers** (`backend/api/main.py`, `backend/bank/main.py`, `frontend/next.config.ts`):
   - Ditambahkan middleware HTTP otomatis:
     - `Cache-Control: no-store`
     - `X-Content-Type-Options: nosniff`
     - `X-Frame-Options: DENY`
     - `Content-Security-Policy: frame-ancestors 'none'`
     - `Referrer-Policy: no-referrer`
   - Opsi `poweredByHeader: false` diaktifkan di Next.js dan header Server disembunyikan.
3. **Hardening Docker Compose** (`docker-compose.yml`):
   - Pemetaan port diikat ketat ke loopback (`127.0.0.1:8000`, `127.0.0.1:8100`, `127.0.0.1:3000`).
   - Wajib menyuplai variabel lingkungan acak untuk `API_SECRET_KEY` dan `BANK_SECRET_KEY` (minimal 32 karakter).

### D. Penyelarasan Frontend & Konektor (`frontend/`, `connector.js`)
1. **Frontend Authentication Flow** (`frontend/src/lib/api/connector.ts`):
   - Mengambil token sesi demo secara otomatis melalui `/v1/auth/demo-login` dan menyimpannya di memori, lalu menyematkan `Authorization: Bearer <token>` pada setiap pemanggilan API terlindungi.
   - Menghapus fallback transaksi palsu pada alur pesan chat dan approval transfer agar kegagalan sistem ditampilkan secara jujur.
2. **Koreksi Tipe Data & UI Screen** (`frontend/src/components/screens/ApprovalScreen.tsx`, `frontend/src/lib/utils.ts`, `frontend/src/components/screens/HomeScreen.tsx`):
   - Memperbaiki pemanggilan `connector.approvePlan(plan.plan_id, plan.intent_hash)`.
   - Mengimplementasikan helper `cn` standar berbasis `clsx` dan `tailwind-merge`.
   - Memastikan label *Coming Soon* terpasang transparan untuk fitur sekunder sesuai komitmen evaluasi *MVP-SCOPE-01*.

---

## 4. Matriks Bukti Pengujian & Verifikasi (Test Verification Matrix)

Seluruh pengujian dijalankan ulang setelah integrasi patch dan dinyatakan **100% HIJAU (PASS)**:

```
┌───────────────────────────────────────┬─────────────┬────────────────────────────────────────────────────────┐
│ Pengujian / Perintah                  │ Hasil       │ Cakupan Area Keamanan yang Diverifikasi                │
├───────────────────────────────────────┼─────────────┼────────────────────────────────────────────────────────┤
│ pytest backend/api/tests              │ 179 PASSED  │ Autentikasi Bearer, validasi intent_hash, proteksi     │
│   backend/bank/tests -q               │ (0 failed)  │ tamper, konkurensi ledger atomik, token HMAC, replay   │
├───────────────────────────────────────┼─────────────┼────────────────────────────────────────────────────────┤
│ python scripts/smoke.py               │ ALL PASSED  │ Golden Flow A ($200 transfer selesai)                  │
│                                       │             │ Golden Flow B (Approval ¥3000, tamper hash ditolak)    │
│                                       │             │ Golden Flow C (Prompt injection diblokir, $0 hilang)   │
│                                       │             │ Verifikasi integritas audit chain (32 entri)           │
├───────────────────────────────────────┼─────────────┼────────────────────────────────────────────────────────┤
│ python scripts/verify.py              │ ALL PASSED  │ Struktur direktori, ADRs 0001-0005, zero forbidden     │
│                                       │ (8/8 check) │ claims, sintaksis 188 file Python, package parity      │
├───────────────────────────────────────┼─────────────┼────────────────────────────────────────────────────────┤
│ python -m backend.eval.attacks        │ 0.0% ASR    │ Benchmark 120 varian serangan adversarial lintas 12    │
│                                       │ (120/120)   │ keluarga serangan; $0 dana simulasi hilang             │
├───────────────────────────────────────┼─────────────┼────────────────────────────────────────────────────────┤
│ python eval/verify_suites.py          │ 100% PASSED │ Suite 2 (Fraud & Mule Sentinel), Suite 3 (Privilege    │
│                                       │             │ Escalation), Suite 4 (Resilience & Recovery)           │
├───────────────────────────────────────┼─────────────┼────────────────────────────────────────────────────────┤
│ python eval/verify_spotlight.py       │ 100% PASSED │ PII Redaction, Fee Buffer, Docker Bridge Perimeter,    │
│                                       │             │ Idempotency Cache, Scope Discipline                    │
├───────────────────────────────────────┼─────────────┼────────────────────────────────────────────────────────┤
│ node connector.js                     │ ALL PASSED  │ Universal connector health check & fallback boundary   │
├───────────────────────────────────────┼─────────────┼────────────────────────────────────────────────────────┤
│ npx --prefix frontend tsc --noEmit    │ 0 errors    │ Kompilasi TypeScript Next.js tanpa error               │
└───────────────────────────────────────┴─────────────┴────────────────────────────────────────────────────────┘
```

---

## 5. Panduan Operasional & Variabel Lingkungan Baru

Bagi pengembang atau penguji yang menjalankan sistem:

1. **Variabel Lingkungan Wajib (`.env`):**
   ```bash
   # Mengaktifkan sesi demo sintetis untuk pengujian offline/lokal
   API_DEMO_AUTH_ENABLED=true

   # Kunci rahasia signing JWT API (minimal 32 karakter acak, non-default)
   API_SECRET_KEY=kunci_rahasia_api_super_aman_dan_panjang_32_karakter_min

   # Kunci rahasia HMAC Scoped Token Bank (harus identik antara API dan Bank)
   BANK_SECRET_KEY=kunci_rahasia_bank_super_aman_dan_panjang_32_karakter_min

   # Origin yang diizinkan CORS pada API Gateway
   CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

   # Penyedia LLM: none (aturan deterministik offline), gemini, atau groq
   LLM_PROVIDER=none
   ```

2. **Perintah Cepat Verifikasi:**
   ```bash
   # 1. Jalankan unit test dan test integrasi backend
   pytest backend/api/tests backend/bank/tests -q

   # 2. Jalankan alur smoke test lengkap (Golden Flows A, B, C)
   python scripts/smoke.py

   # 3. Jalankan suite benchmark serangan prompt injection
   python -m backend.eval.attacks

   # 4. Jalankan cek verifikasi monorepo
   python scripts/verify.py
   ```

---

## 6. Batasan Residual & Rekomendasi Lanjutan (Residual Risks)

1. **Identitas Demo Sintetis**: Autentikasi demo saat ini dirancang untuk evaluasi tertutup (*testnet sandbox*) dengan satu profil mahasiswa (`usr_ayu`). Untuk rilis produksi, mekanisme ini harus digantikan oleh *identity provider* OIDC/OAuth2 dengan otentikasi multi-faktor (MFA/WebAuthn FIDO2 riil).
2. **Rel Perbankan Simulasi**: Daemon Bank Port 8100 mencatat mutasi pada database SQLite terisolasi. Dalam implementasi komersial, layanan ini bertindak sebagai adaptor ke API Core Banking riil (SWIFT GPI, FedNow, BI-FAST, dsb).
3. **Transport Layer Security**: Pada lingkungan Docker lokal, komunikasi antar kontainer menggunakan protokol internal HTTP. Untuk produksi, seluruh komunikasi eksternal dan internal wajib diterminasi melalui reverse proxy bertranspor TLS 1.3 dengan sertifikat valid.
