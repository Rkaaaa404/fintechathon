# AegisPath — Tech Stack Final (Production-Ready, Stable-Only)

> **Disusun:** 18 Oktober 2026. **Prinsip:** hanya rilis stabil (GA/LTS). Tidak memakai RC, beta, atau rilis yang baru keluar dalam hitungan hari.
> **Konteks:** Tidak ada sesi coding offline di acara final, sehingga stack ini adalah stack produk akhir.
> **Catatan verifikasi:** Nomor versi dikumpulkan dari ringkasan pencarian web per 18 Okt 2026. Sebelum dikunci di lockfile, cek ulang ke halaman rilis resmi masing-masing.

---

## 1. Tabel Tech Stack

### 1.1 Frontend

| Komponen | Teknologi | Versi | Fungsi |
| :-- | :-- | :-- | :-- |
| Runtime | Node.js | **24 LTS** | Menjalankan build dan server FE |
| Framework | Next.js (App Router) | **16.4.1** | Routing, SSR, Server Components |
| UI library | React | **19.3.1** | Komponen UI, `<ViewTransition>` |
| Bahasa | TypeScript | **7.0.x** | Tipe statis, kontrak API bertipe |
| Styling | Tailwind CSS | **4.3.x** | Design token biru muda via `@theme` |
| Komponen | shadcn/ui + Radix UI | terbaru stabil | Komponen aksesibel, kode dimiliki sendiri |
| Data fetching | TanStack Query | **v5** | Cache, retry, status loading |
| Validasi | Zod | **v4** | Validasi skema di sisi klien |
| i18n | next-intl | terbaru stabil | Inggris dan Mandarin |
| PWA | Serwist | terbaru stabil | Service worker, mode offline |
| Passkey klien | @simplewebauthn/browser | terbaru stabil | WebAuthn di layar Approval |

### 1.2 Backend

| Komponen | Teknologi | Versi | Fungsi |
| :-- | :-- | :-- | :-- |
| Bahasa | Python | **3.14** | Runtime API dan Bank |
| Framework | FastAPI | **0.143.x** | API Core (:8000) dan Bank (:8100) |
| Validasi | Pydantic | **2.14** | Model request/response, JSON schema output LLM |
| Server | Uvicorn | terbaru stabil | ASGI server (tanpa `--reload` di produksi) |
| HTTP client | httpx | terbaru stabil | Panggilan API ke Bank dan LLM |
| ORM | SQLAlchemy | **2.x** | Akses data bertipe |
| Migrasi | Alembic | terbaru stabil | Versi skema database |
| Auth | PyJWT | terbaru stabil | Token akses dan refresh |
| Kripto | cryptography + `hmac` (stdlib) | terbaru stabil | Scoped token, hash intent, rantai audit |
| Passkey server | webauthn (py) | terbaru stabil | Verifikasi passkey sungguhan |
| Rate limit | slowapi + Valkey | terbaru stabil | Pembatasan laju per pengguna |

### 1.3 Data

| Komponen | Teknologi | Versi | Fungsi |
| :-- | :-- | :-- | :-- |
| Database API | PostgreSQL | **18** | Plan, policy, audit chain |
| Database Bank | PostgreSQL | **18** (instance terpisah) | Ledger, saldo, idempotensi |
| Cache | Valkey | **9.1.x** | Rate limit, nonce anti-replay, sesi |

> Dua instance PostgreSQL dengan kredensial berbeda menjaga klaim "layanan bank independen" tetap benar.

### 1.4 AI

| Komponen | Teknologi | Versi | Fungsi |
| :-- | :-- | :-- | :-- |
| Gateway LLM | LiteLLM | terbaru stabil | Satu antarmuka untuk cloud dan lokal |
| LLM cloud | Penyedia API pilihan tim | model GA terbaru | NLU opsional di atas parser aturan |
| LLM lokal | Ollama + Qwen | terbaru stabil | Cadangan offline |
| Parser aturan | Regex/rules Python (sudah ada) | - | Jalur utama, tanpa LLM |
| Privasi | Microsoft Presidio | terbaru stabil | Redaksi PII sebelum keluar batas kepercayaan |
| Output model | Pydantic JSON schema | - | Output LLM selalu JSON bertipe |

### 1.5 Keamanan, Kualitas, dan Operasional

| Komponen | Teknologi | Fungsi |
| :-- | :-- | :-- |
| Test BE | pytest + Hypothesis | Unit test dan fuzzing |
| Test FE | Vitest + Playwright | Unit test, E2E, tangkapan layar demo |
| Lint BE | Ruff | Lint dan format Python |
| Lint FE | Biome | Lint dan format TS/JS |
| Audit dependensi | pip-audit, `pnpm audit` | Kerentanan dependensi |
| Secret scan | Gitleaks | Mencegah kunci bocor ke repo |
| Scan container | Trivy | Kerentanan image Docker |
| Logging | structlog | Log terstruktur |
| Telemetri | OpenTelemetry | Jejak eksekusi untuk Execution Evidence |
| Package manager | pnpm, uv | Lockfile dan install cepat |
| Container | Docker Compose v2 | `docker compose up` satu perintah |
| Reverse proxy | Caddy | TLS dan security headers |
| CI | GitHub Actions | Lint, test, audit, build |

---

## 2. Alasan Pemilihan

1. **Stable-only.** Tujuannya produk yang bisa dipertanggungjawabkan, bukan yang paling baru. Node 26 baru menjadi LTS pada 28 Okt 2026, jadi dipakai Node 24 LTS. Python 3.15 baru rilis 9 Okt dan banyak pustaka belum menyusul, jadi dipakai 3.14. PostgreSQL 19 masih RC, jadi dipakai 18.
2. **Next.js 16.4.1, bukan 15.** Versi ini Active LTS dan memuat patch keamanan RCE dan DoS (14 Okt 2026). Memakai versi lama berarti membawa celah yang diketahui ke dalam penilaian Security 30%.
3. **TypeScript dan Zod.** Kontrak `openapi.json` dapat dijadikan tipe otomatis, sehingga mendukung klaim "keluaran selalu JSON bertipe".
4. **FastAPI dan Pydantic dipertahankan.** Backend, test, dan eval serangan sudah berjalan. Mengganti bahasa tidak menambah nilai.
5. **PostgreSQL menggantikan SQLite.** Transaksi dan isolasi lebih kuat, serta instance terpisah mendukung klaim tiga lapis independen.
6. **Presidio dan LiteLLM.** Presidio memenuhi Privacy Gateway. LiteLLM memungkinkan beralih dari cloud ke Ollama lokal lewat konfigurasi, sehingga demo tidak bergantung pada internet.
7. **Valkey, bukan Redis.** Lisensi BSD lebih sesuai dengan syarat pustaka open-source.
8. **Tooling keamanan.** pip-audit, Gitleaks, Trivy, dan Playwright menghasilkan bukti langsung untuk dokumen Security Self-assessment dan Execution Evidence.
9. **Tailwind v4 dan shadcn/ui.** Token palet biru muda cukup didefinisikan sekali di `@theme`. Komponen aksesibel dan mudah dimodifikasi.

---

## 3. Perubahan dari Kondisi Sekarang

| Area | Sekarang | Target |
| :-- | :-- | :-- |
| Frontend | Vanilla JS | Next.js 16.4.1 + React 19.3.1 + TypeScript |
| Styling | CSS manual | Tailwind 4.3 + shadcn/ui |
| i18n | `i18n.js` manual | next-intl |
| Database | SQLite | PostgreSQL 18 (dua instance) |
| Akses data | SQL mentah | SQLAlchemy 2 + Alembic |
| Parser | Regex saja | Regex + LLM opsional via LiteLLM |
| Passkey | Simulasi (panjang string) | WebAuthn sungguhan |
| Secret | Hardcoded di `config.py` | Variabel lingkungan + Gitleaks |
| Alur jalan | `start.bat` | Docker Compose + CI |

---

## 4. Risiko

- **Migrasi FE berskala besar.** Ke-7 layar harus ditulis ulang. Uji dengan Playwright agar perilaku sama dengan versi vanilla.
- **TypeScript 7 sangat baru.** Pastikan plugin Next.js, Biome, dan Vitest kompatibel sebelum dikunci.
- **Akses dari Tiongkok.** LLM cloud dan CDN dapat terganggu. Semua aset di-host sendiri, dan Ollama lokal menjadi cadangan.
