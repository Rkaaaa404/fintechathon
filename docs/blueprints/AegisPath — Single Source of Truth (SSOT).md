# AegisPath — Single Source of Truth (SSOT)

*Dokumen rujukan utama tim FinTechathon 2026 — International Track, kategori Artificial Intelligence*

**Terakhir diperbarui:** 18 Oktober 2026 **Batas pengumpulan lomba:** 20 Oktober 2026, pukul 23:59 waktu Beijing (22:59 WIB) **Status:** Dokumen ini adalah rujukan tunggal untuk seluruh tim — termasuk yang mengerjakan kode, dokumen teknis, video, dan pitch deck. Jika ada perbedaan dengan dokumen lama, dokumen ini yang berlaku.

---

## 1. Ringkasan Produk

AegisPath adalah agen keuangan berbasis AI untuk mahasiswa internasional dan orang yang mengirim uang lintas negara.

**Kompetisi:** FinTechathon 2026 (Shenzhen International FinTech Competition — WeBank FinTech University Challenge), International Track, kategori Artificial Intelligence. **Topik yang dipilih:** Topik C — Cross-border & Student Finance Assistant. **Tema lomba:** "AI as a Financial Participant".

Cara kerja produk secara sederhana — pengguna mengetik permintaan dalam bahasa biasa, misalnya "kirim $200 ke Mama, pakai rute termurah" atau "bayar uang kuliah saya". Sistem kemudian:

1. Memahami permintaan pengguna.
2. Menyusun rencana eksekusi langkah demi langkah.
3. Memeriksa rencana tersebut terhadap aturan keamanan yang berlaku.
4. Meminta persetujuan pengguna jika transaksi tergolong berisiko atau bernilai besar.
5. Menjalankan transaksi melalui sistem bank simulasi.
6. Menyimpan bukti transaksi yang dapat diverifikasi.

**Pernyataan inti produk** (dipakai konsisten di semua materi — dokumen teknis, pitch deck, video):

> "AegisPath adalah agen keuangan AI yang keamanannya tidak bergantung pada AI itu sendiri. Tiga lapis pertahanan yang berdiri sendiri-sendiri tetap menghentikan kerugian, bahkan jika model AI berhasil ditipu."

Versi Inggris (dipakai untuk juri dan dokumen berbahasa Inggris):

> "AegisPath is an AI financial agent whose safety does not depend on the AI: three independent layers stop the damage even when the model is fooled."

---

## 2. Masalah yang Diselesaikan

AegisPath menjawab tiga masalah nyata yang dialami mahasiswa internasional dan pengirim uang lintas negara:

1. **Biaya transfer lintas negara yang mahal dan tidak transparan.** Bank perantara memotong biaya tersembunyi, sehingga uang yang diterima penerima akhir sering lebih sedikit dari jumlah yang dikirim.
2. **Mahasiswa asing tidak memiliki riwayat keuangan di negara tujuan.** Karena tidak ada riwayat kredit lokal, mereka kesulitan membuktikan kemampuan finansial ke pihak lain, misalnya pemilik kos atau bank.
3. **Penipuan yang menyasar mahasiswa asing.** Dua pola yang paling sering terjadi: perekrutan menjadi "rekening perantara" pencucian uang (money mule), dan penggantian nomor rekening tujuan pada tagihan (invoice fraud). Kasus pembekuan rekening mahasiswa asing karena money mule sudah pernah terjadi dan terdokumentasi secara resmi (sumber: Royal United Services Institute, 2019).

---

## 3. Solusi: Tiga Fungsi Utama

### Pay — Bayar dan Kirim

Menghitung dan menjalankan pembayaran uang kuliah serta kiriman uang ke keluarga lewat jalur resmi. Sistem memberi estimasi jumlah uang yang akan diterima, termasuk cadangan untuk kemungkinan potongan biaya bank perantara. Estimasi ini selalu diberi label "estimasi, bukan jaminan", karena bank perantara berada di luar kendali sistem.

Pengguna bisa memilih rute pengiriman: Fastest (tercepat), Cheapest (termurah), atau Balanced (seimbang).

### Prove — Bukti Finansial

Menyusun paket bukti kemampuan finansial yang bisa dibagikan secara terbatas ke pihak lain (misalnya pemilik kos atau bank). Paket ini bukan skor kredit. Isinya adalah ringkasan arus kas yang dihitung dengan aturan pasti (deterministik), bukan prediksi machine learning, sehingga hasilnya selalu bisa dijelaskan dan dilacak.

### Protect — Batas dan Pertahanan

Membatasi tindakan yang boleh dilakukan agen AI dengan sendirinya, mendeteksi dan memblokir pola penipuan (money mule, penggantian rekening pada tagihan), dan menyediakan tombol jeda yang selalu bisa diakses pengguna untuk menghentikan seluruh aktivitas agen.

---

## 4. Prinsip Keamanan Inti

Prinsip paling penting dalam seluruh produk:

**Keamanan dan privasi ditegakkan di luar model bahasa (AI), bukan oleh model bahasa itu sendiri.**

Artinya, meskipun AI salah paham, tertipu, atau berhasil dijebak oleh instruksi berbahaya yang disisipkan dalam pesan atau dokumen, sistem tetap tidak bisa menjalankan transaksi di luar batas yang sudah ditentukan oleh pemilik akun. Batas ini ditegakkan oleh tiga lapis pertahanan yang berdiri sendiri-sendiri, dijelaskan lengkap di Bagian 7.

Dua hal yang secara sadar TIDAK dipakai di jalur utama produk:

- **Smart contract / blockchain.** Tidak dipakai, dan tidak boleh diklaim dipakai, kecuali sebagai fitur tambahan opsional setelah MVP selesai.
- **Skor kredit berbasis machine learning.** Dibuang sepenuhnya, diganti dengan paket bukti finansial berbasis aturan pasti (lihat fungsi Prove).

---

## 5. Pengguna dan Skenario Demo

**Pengguna utama:** mahasiswa internasional dan orang yang mengirim uang lintas negara. Persona contoh yang dipakai dalam desain dan demo: "Ayu", seorang mahasiswa biasa — bukan tim treasuri perusahaan atau institusi keuangan.

**Tiga alur skenario utama**, dipakai sebagai dasar pengujian sekaligus alur demo untuk juri:

| Alur | Nama | Deskripsi |
| :-- | :-- | :-- |
| A | Kirim ke keluarga | Pengguna minta kirim sejumlah uang ke penerima terdaftar. Sistem memilih rute sesuai preferensi (tercepat/termurah/seimbang) dan mengeksekusi otomatis jika nilainya di bawah batas harian. |
| B | Bayar uang kuliah | Pengguna minta membayar tagihan kuliah. Sistem menghitung estimasi dengan cadangan biaya, meminta persetujuan pengguna karena nilainya besar, lalu mengeksekusi setelah disetujui. |
| C | Percobaan penipuan invoice | Ada upaya mengganti nomor rekening tujuan pada tagihan. Sistem mendeteksi dan memblokir upaya ini di tiga lapis pertahanan, dan menunjukkan buktinya. |

---

## 6. Ruang Lingkup Fitur

### Termasuk dalam MVP

| Fungsi | Fitur |
| :-- | :-- |
| Pay | Kuotasi uang kuliah dengan cadangan biaya bank, kirim uang ke daftar penerima, pilihan rute Fastest/Cheapest/Balanced |
| Agent | Percakapan dalam bahasa Inggris dan Mandarin, parser berbasis aturan (LLM opsional sebagai tambahan), rencana eksekusi (DAG) yang ditampilkan sebagai langkah-langkah |
| Protect | Tingkat izin transaksi (tier), pencocokan hash maksud pengguna, simulasi transaksi sebelum eksekusi, batas sisi bank, tombol jeda agen, log audit berantai hash, Sentinel (deteksi pola money mule dan penggantian rekening pada invoice) |
| Prove | Paket bukti dengan tiga tingkat asal-usul dokumen, tautan berbagi yang kedaluwarsa dan bisa dicabut, ringkasan arus kas deterministik |
| Planner | Simulasi ketahanan dana (runway) terhadap jadwal kuliah dan beasiswa, tanpa model prediksi machine learning |

### Tidak Termasuk dalam MVP

Layar Payees (daftar penerima), Rates (kurs), dan More (lainnya) — hanya menampilkan "segera hadir". Skor kredit, integrasi blockchain, pembayaran sungguhan, proses KYC sungguhan, model machine learning, mode gelap, dan input suara juga tidak termasuk dalam MVP.

---

## 7. Arsitektur Sistem

Sistem terdiri dari dua layanan yang sengaja dipisah, agar lapisan pertahanan benar-benar independen satu sama lain.

**Layanan 1 — API Utama (port 8000).** Berisi lima komponen:

- **Privacy Gateway:** mendeteksi instruksi tersembunyi dan data pribadi sebelum diproses lebih lanjut. Jika ragu, sistem menolak (gagal-tertutup), bukan melanjutkan.
- **Parser Intent:** memahami maksud pengguna dalam bahasa Inggris dan Mandarin, berbasis aturan, dengan AI (LLM) sebagai pilihan tambahan di atasnya.
- **Planner DAG:** menyusun rencana eksekusi berupa langkah-langkah bertipe. Setiap langkah punya kunci agar tidak dieksekusi dua kali (idempotensi) dan punya aksi pemulihan jika gagal (kompensasi).
- **Policy Plane:** menegakkan empat tingkat izin transaksi (lihat tabel di bawah), mencocokkan hash dari maksud pengguna dengan hash parameter transaksi, dan mensimulasikan transaksi sebelum benar-benar dijalankan.
- **Audit:** mencatat seluruh aktivitas dalam rantai hash SHA-256 yang bisa diverifikasi keasliannya.

**Layanan 2 — Bank Simulasi (port 8100).** Layanan terpisah, dengan basis data dan kredensial rahasia yang berbeda dari API Utama. Tugasnya memvalidasi ulang batas transaksi secara independen, mencegah transaksi ganda, dan mencatat buku besar (ledger). API Utama tidak pernah menulis langsung ke buku besar — semua harus melalui Bank Simulasi.

Komunikasi antara kedua layanan memakai token akses terbatas (scoped token) yang punya batas nominal, daftar penerima yang diizinkan, dan waktu kedaluwarsa.

### Tiga Lapis Pertahanan

| Lapis | Nama | Fungsi |
| :-- | :-- | :-- |
| 1 | Privacy Gateway | Mendeteksi instruksi tersembunyi dan data pribadi sensitif sebelum masuk ke sistem |
| 2 | Policy Plane | Menegakkan tingkat izin transaksi, mencocokkan hash maksud dengan hash transaksi, simulasi sebelum eksekusi |
| 3 | Bank Simulasi | Layanan terpisah yang memvalidasi ulang semua batas transaksi secara independen |

Ketiganya dibuat independen — proses, basis data, dan kredensial berbeda — sehingga jika satu lapis gagal atau dimatikan, dua lapis lainnya tetap bisa menghentikan transaksi berbahaya. Hal ini dibuktikan lewat pengujian "tabel ablasi" (lihat Bagian 9).

### Tingkat Izin Transaksi (Tier)

| Tier | Jenis Tindakan | Mekanisme |
| :-- | :-- | :-- |
| T0 | Lihat saldo, cek kurs, lihat riwayat | Otomatis, tanpa persetujuan |
| T1 | Kirim di bawah batas harian ke penerima yang sudah terdaftar | Otomatis, dibatasi sistem |
| T2 | Penerima baru, atau jumlah di atas batas | Perlu persetujuan pengguna (passkey) |
| T3 | Ubah kebijakan, tambah pihak yang berwenang | Perlu waktu tunda dan persetujuan tambahan |

### Aturan Desain yang Tidak Boleh Dilanggar

- Kode (bukan AI) yang menghitung angka dan menegakkan aturan. AI hanya bertugas memahami bahasa.
- Keluaran dari model AI selalu berupa data terstruktur (JSON) yang sudah divalidasi, sebelum dipakai sistem.
- Dokumen atau pesan dari pihak luar selalu diperlakukan sebagai data, bukan sebagai perintah yang harus dijalankan AI.
- Layar persetujuan transaksi menampilkan data yang sudah ditandatangani server, bukan teks yang dibuat AI.
- Hash dari maksud pengguna harus sama persis dengan hash parameter transaksi saat dieksekusi.
- Tampilan aplikasi hanya menampilkan komponen dari daftar yang sudah disetujui sebelumnya (whitelist).

### Privasi Data

Data diklasifikasikan dalam empat tingkat kerahasiaan, dari Z0 (publik) sampai Z3 (paling sensitif). Kunci dan data rahasia tidak pernah dikirim ke AI atau dicatat di log. Data sensitif diubah menjadi token sebelum keluar dari sistem. Jika AI (LLM) diaktifkan, setiap pemanggilannya dicatat di log terpisah (Egress Ledger). Seluruh data pengujian adalah data buatan (sintetis), bukan data pengguna asli.

Batasan yang disampaikan secara jujur: jika memakai AI dari penyedia cloud, penyedia tersebut tetap melihat teks yang sudah ditokenisasi. Metadata waktu (jam, durasi akses) tidak dilindungi secara khusus.

---

## 8. Tech Stack

Prinsip pemilihan teknologi: hanya memakai versi rilis stabil (GA/LTS), tidak memakai versi uji coba (RC/beta) atau versi yang baru dirilis dalam hitungan hari. Alasannya, tidak ada sesi coding offline saat acara final di Shenzhen, sehingga stack ini adalah stack produk akhir yang dipakai saat presentasi.

Catatan: nomor versi dikumpulkan per 18 Oktober 2026. Sebelum dikunci di lockfile, versi harus dicek ulang ke halaman rilis resmi masing-masing.

### 8.1 Frontend (Tampilan Aplikasi)

| Komponen | Teknologi | Versi | Fungsi |
| :-- | :-- | :-- | :-- |
| Runtime | Node.js | 24 LTS | Menjalankan proses build dan server frontend |
| Framework | Next.js (App Router) | 16.4.1 | Routing, server-side rendering, server components |
| UI library | React | 19.3.1 | Komponen antarmuka |
| Bahasa | TypeScript | 7.0.x | Tipe statis, kontrak API bertipe |
| Styling | Tailwind CSS | 4.3.x | Sistem warna dan tata letak |
| Komponen | shadcn/ui + Radix UI | Versi stabil terbaru | Komponen antarmuka yang aksesibel |
| Data fetching | TanStack Query | v5 | Pengambilan data, cache, retry |
| Validasi | Zod | v4 | Validasi data di sisi klien |
| Multi-bahasa | next-intl | Versi stabil terbaru | Dukungan Bahasa Inggris dan Mandarin |
| PWA | Serwist | Versi stabil terbaru | Service worker, mode offline |
| Passkey (klien) | @simplewebauthn/browser | Versi stabil terbaru | Autentikasi passkey di layar persetujuan |

### 8.2 Backend (Server)

| Komponen | Teknologi | Versi | Fungsi |
| :-- | :-- | :-- | :-- |
| Bahasa | Python | 3.14 | Runtime untuk API Utama dan Bank Simulasi |
| Framework | FastAPI | 0.143.x | Menjalankan API Utama (port 8000) dan Bank Simulasi (port 8100) |
| Validasi | Pydantic | 2.14 | Validasi data request/response, skema JSON untuk keluaran AI |
| Server aplikasi | Uvicorn | Versi stabil terbaru | Menjalankan aplikasi di produksi |
| HTTP client | httpx | Versi stabil terbaru | Komunikasi antar-layanan dan ke penyedia AI |
| ORM | SQLAlchemy | 2.x | Akses data bertipe ke database |
| Migrasi database | Alembic | Versi stabil terbaru | Mengelola perubahan skema database |
| Autentikasi | PyJWT | Versi stabil terbaru | Token akses dan refresh |
| Kriptografi | cryptography + hmac (bawaan Python) | Versi stabil terbaru | Token terbatas, hash maksud pengguna, rantai audit |
| Passkey (server) | webauthn (Python) | Versi stabil terbaru | Verifikasi passkey sungguhan |
| Pembatas laju | slowapi + Valkey | Versi stabil terbaru | Membatasi jumlah permintaan per pengguna |

### 8.3 Data

| Komponen | Teknologi | Versi | Fungsi |
| :-- | :-- | :-- | :-- |
| Database API Utama | PostgreSQL | 18 | Menyimpan rencana transaksi, kebijakan, rantai audit |
| Database Bank Simulasi | PostgreSQL | 18 (instance terpisah) | Menyimpan buku besar, saldo, data idempotensi |
| Cache | Valkey | 9.1.x | Pembatasan laju, pencegahan transaksi ganda, sesi |

Catatan: dua instance PostgreSQL dengan kredensial berbeda inilah yang membuat klaim "layanan bank independen" benar secara teknis, bukan sekadar klaim di atas kertas.

### 8.4 AI

| Komponen | Teknologi | Versi | Fungsi |
| :-- | :-- | :-- | :-- |
| Gateway AI | LiteLLM | Versi stabil terbaru | Satu antarmuka untuk AI cloud maupun AI lokal |
| AI cloud | Penyedia API pilihan tim | Model GA (rilis stabil) terbaru | Pemahaman bahasa opsional di atas parser berbasis aturan |
| AI lokal | Ollama + Qwen | Versi stabil terbaru | Cadangan jika akses internet terganggu |
| Parser berbasis aturan | Regex/rules Python | - | Jalur utama pemahaman bahasa, tanpa AI |
| Privasi | Microsoft Presidio | Versi stabil terbaru | Menyamarkan data pribadi sebelum keluar dari sistem |
| Format keluaran AI | Skema JSON (Pydantic) | - | Memastikan keluaran AI selalu berupa data terstruktur |

### 8.5 Keamanan, Kualitas, dan Operasional

| Komponen | Teknologi | Fungsi |
| :-- | :-- | :-- |
| Test backend | pytest + Hypothesis | Unit test dan pengujian otomatis dengan data acak (fuzzing) |
| Test frontend | Vitest + Playwright | Unit test, pengujian end-to-end, tangkapan layar untuk demo |
| Lint backend | Ruff | Pemeriksaan dan pemformatan kode Python |
| Lint frontend | Biome | Pemeriksaan dan pemformatan kode TypeScript/JavaScript |
| Audit dependensi | pip-audit, pnpm audit | Memeriksa kerentanan pada pustaka yang dipakai |
| Pemindai rahasia | Gitleaks | Mencegah kunci/kredensial bocor ke repositori kode |
| Pemindai container | Trivy | Memeriksa kerentanan pada image Docker |
| Logging | structlog | Pencatatan log terstruktur |
| Telemetri | OpenTelemetry | Melacak jejak eksekusi untuk dokumen Execution Evidence |
| Package manager | pnpm (frontend), uv (backend) | Mengelola lockfile dan instalasi paket |
| Container | Docker Compose v2 | Menjalankan seluruh sistem dengan satu perintah |
| Reverse proxy | Caddy | Pengelolaan TLS dan header keamanan |
| CI (integrasi berkelanjutan) | GitHub Actions | Otomasi lint, test, audit, dan build |

### 8.6 Alasan Pemilihan Teknologi

1. Hanya rilis stabil dipakai agar hasil akhir bisa dipertanggungjawabkan, bukan sekadar memakai teknologi terbaru.
2. Next.js 16.4.1 dipilih (bukan versi 15) karena sudah memuat perbaikan keamanan untuk celah RCE dan DoS yang dirilis 14 Oktober 2026. Memakai versi lama berarti membawa celah keamanan yang sudah diketahui ke penilaian juri pada aspek Security.
3. TypeScript dan Zod dipakai agar kontrak API (`openapi.json`) bisa otomatis diubah menjadi tipe data, mendukung klaim "keluaran AI selalu berupa data terstruktur".
4. FastAPI dan Pydantic dipertahankan sebagai backend karena sistem, pengujian, dan evaluasi serangan sudah dibangun di atasnya; mengganti bahasa pemrograman tidak menambah nilai.
5. PostgreSQL menggantikan SQLite karena transaksi dan isolasi data lebih kuat, dan penggunaan dua instance terpisah mendukung klaim tiga lapis pertahanan yang independen.
6. Presidio menjalankan fungsi Privacy Gateway, dan LiteLLM memungkinkan sistem berpindah dari AI cloud ke AI lokal (Ollama) hanya lewat konfigurasi, sehingga demo tidak bergantung pada koneksi internet.
7. Valkey dipilih dibanding Redis karena lisensinya (BSD) lebih sesuai dengan syarat lomba yang mewajibkan pustaka open-source.
8. Perangkat keamanan (pip-audit, Gitleaks, Trivy, Playwright) menghasilkan bukti langsung untuk dokumen Security Self-assessment dan Execution Evidence yang wajib dikumpulkan.
9. Tailwind v4 dan shadcn/ui dipakai agar sistem warna cukup didefinisikan satu kali, dengan komponen yang aksesibel dan mudah dimodifikasi.

### 8.7 Perubahan dari Kondisi Saat Ini

| Area | Kondisi Sekarang | Target |
| :-- | :-- | :-- |
| Frontend | Vanilla JavaScript | Next.js 16.4.1 + React 19.3.1 + TypeScript |
| Styling | CSS manual | Tailwind 4.3 + shadcn/ui |
| Multi-bahasa | File i18n.js manual | next-intl |
| Database | SQLite | PostgreSQL 18 (dua instance terpisah) |
| Akses data | SQL mentah | SQLAlchemy 2 + Alembic |
| Parser bahasa | Hanya regex | Regex + AI opsional lewat LiteLLM |
| Passkey | Simulasi (string biasa) | WebAuthn sungguhan |
| Penyimpanan rahasia | Hardcoded di config.py | Variabel lingkungan + Gitleaks |
| Cara menjalankan | File start.bat | Docker Compose + CI |

### 8.8 Risiko Teknis

- **Migrasi frontend berskala besar.** Ketujuh layar aplikasi harus ditulis ulang dari vanilla JavaScript ke Next.js/React. Mitigasi: uji dengan Playwright agar perilaku tetap sama seperti versi sebelumnya.
- **TypeScript 7 masih sangat baru.** Perlu dipastikan dulu plugin Next.js, Biome, dan Vitest sudah kompatibel sebelum versi dikunci di lockfile.
- **Akses dari Tiongkok dapat terganggu.** AI cloud dan CDN berisiko tidak bisa diakses. Semua aset (font, ikon) di-host sendiri, dan Ollama lokal menjadi cadangan jika internet bermasalah.

---

## 9. Bukti dan Evaluasi

Bukti pengujian adalah faktor yang paling menentukan penilaian juri, karena dua kriteria terbesar langsung berkaitan dengannya: Task Completion (40%) dan Security & Compliance (30%).

Yang harus tersedia sebelum pengumpulan:

- **Benchmark tugas:** sekitar 60 skenario pengujian dengan "DAG emas" (rencana eksekusi yang sudah diketahui benar), untuk mengukur tingkat penyelesaian tugas, akurasi pemanggilan tool, dan validitas rencana.
- **Suite serangan:** 12 kelompok jenis serangan, minimal 10 variasi di tiap kelompok, ditambah pola perekrutan rekening perantara dan serangan dalam berbagai bahasa. Disertai kasus-kasus "jinak" (bukan serangan) untuk mengukur berapa banyak kasus aman yang salah dianggap serangan (positif palsu).
- **Tabel ablasi:** mengukur tingkat keberhasilan serangan pada beberapa kondisi — hanya AI, AI + Privacy Gateway, AI + Policy Plane, AI + Bank Simulasi — dan untuk setiap lapis yang dimatikan satu per satu. Tabel ini membuktikan bahwa ketiga lapis benar-benar independen.
- **Uji canary privasi:** data uji palsu yang sudah diberi tanda dimasukkan ke sistem, lalu diperiksa apakah data itu muncul di panggilan AI atau log yang seharusnya tidak melihatnya.
- **Standar statistik yang dipakai:** himpunan data uji dikunci dengan hash (tidak bisa diubah setelah disegel), dibagi berdasarkan kelompok jenis serangan, dan hasil dilaporkan dengan selang kepercayaan Wilson 95%. Jika hasil pengujian menunjukkan nol kegagalan dari N percobaan, itu dilaporkan beserta batas atas kemungkinan kegagalan — bukan ditulis sebagai "risiko nol".

Seluruh hasil pengujian berasal dari satu laporan tunggal: `eval/reports/latest.json`. **Tidak ada angka yang boleh ditulis sebelum benar-benar diukur.**

---

## 10. Antarmuka dan Desain

Aplikasi memiliki tujuh layar: Home, Agent chat, Pay tuition, Approval, Evidence, Planner, dan Safety. Satu tampilan tambahan, Proof Console, dibuat khusus untuk juri dan auditor di layar desktop, menampilkan hasil benchmark, tabel ablasi, log audit, dan putar ulang serangan.

Ketentuan desain utama:

- Bahasa antarmuka: Inggris dan Mandarin saja.
- Sistem warna: satu keluarga warna biru muda sebagai warna utama; hijau, kuning, dan merah hanya dipakai untuk menandai status (aman, perlu perhatian, diblokir).
- Maskot bernama "Chop" tampil di beberapa layar, dengan ekspresi yang berubah mengikuti status sistem (siap, menyapa, menunggu persetujuan, memblokir, dijeda).
- Semua data di aplikasi berlabel simulasi, tidak ada logo atau nama sponsor, dan tidak ada klaim fitur yang belum benar-benar dibangun.
- Semua angka yang ditampilkan (misalnya "$0 lost", status "3/3 lapis aktif") dihitung otomatis dari data sistem, tidak boleh ditulis manual di kode.

Detail lengkap spesifikasi visual (warna, tipografi, tata letak tiap layar, aset) ada di dokumen terpisah: `AEGISPATH_ANTIGRAVITY_PROTOTYPE_PROMPT.md` dan `AEGISPATH_UI_REVISION_PROMPT.md`.

---

## 11. Rencana Kerja dan Timeline

### Tahap Persiapan (Minggu 11 – Senin 12 Oktober)

Tujuan: menghilangkan ketidakpastian yang bisa menggagalkan seluruh rencana.

- Membaca dokumen aturan resmi lomba dan mencatat ketentuan penting (kontrak sandbox Topik C, aturan bonus on-chain, format video, ketentuan lisensi pustaka).
- Memeriksa kelayakan setiap anggota tim tanpa mengirim pendaftaran dulu.
- Menyiapkan struktur folder project, Docker Compose satu perintah, font dan ikon yang di-host sendiri, dan data simulasi.
- Menulis daftar klaim yang boleh dan tidak boleh digunakan, serta kontrak API.
- Membangun tampilan statis (UI) tahap pertama.

**Syarat lulus tahap ini:** `docker compose up` berjalan di komputer bersih, kutipan aturan resmi sudah tersimpan, dan tampilan statis sesuai rancangan.

### Tahap Pengerjaan (Senin 12 – Jumat 16 Oktober)

| Hari | Fokus | Target Hasil |
| :-- | :-- | :-- |
| Senin 12 | Dua layanan terpisah (API Utama & Bank Simulasi), token terbatas, buku besar | Transfer berjalan lewat Bank Simulasi; pengujian token dan idempotensi lulus |
| Selasa 13 | Parser bahasa Inggris/Mandarin, Policy Plane, hash maksud, simulasi, audit | Alur A (kirim ke keluarga) berjalan lengkap lewat API |
| Rabu 14 | Penyambungan tampilan, layar persetujuan, Alur B (bayar kuliah) | Perubahan transaksi setelah persetujuan ditolak sistem; layar Approval membaca data dari server |
| Kamis 15 | Privacy Gateway, Sentinel, suite serangan, uji ulang per lapis | Alur C (serangan invoice) berhasil ditahan di tiga lapis pertahanan |
| Jumat 16 | Evidence, Planner, mode offline, perbaikan | Ketujuh layar menampilkan data nyata; mode tanpa AI (hanya aturan) berjalan tanpa internet |

### Gerbang MVP (Jumat 16 Oktober, akhir hari)

MVP dinyatakan selesai jika semua kondisi berikut terpenuhi:

- Alur A, B, dan C berjalan nyata melalui API dan layanan bank terpisah.
- Transaksi yang diubah setelah persetujuan langsung ditolak sistem (hash tidak cocok).
- Mematikan satu lapis pertahanan mana pun tetap menyisakan lapis lain yang menghentikan serangan, dan ini dibuktikan lewat pengujian ulang dari backend.
- Tabel ablasi dan angka "funds lost" (dana hilang) dihasilkan otomatis dari laporan evaluasi.
- Ketujuh layar tampil sesuai desain dalam bahasa Inggris dan Mandarin, tanpa permintaan ke jaringan eksternal.
- `docker compose up`, `pytest`, dan skrip tangkapan layar berjalan di komputer bersih.

### Setelah MVP (Sabtu 17 – Selasa 20 Oktober)

| Tanggal | Kegiatan |
| :-- | :-- |
| Sabtu 17 | Menyusun dokumen teknis, asesmen keamanan mandiri, bukti eksekusi, dan pitch deck — semua angka diambil dari laporan evaluasi |
| Minggu 18 | Pembekuan kode di siang hari, rekam video demo 5 menit (versi utama dan cadangan), siapkan kit offline |
| Senin 19 | Pengecekan mutu seluruh berkas, verifikasi referensi satu per satu, isi formulir tim |
| Selasa 20 | Kirim paling lambat pukul 18.00 WIB (sebelum batas resmi 22.59 WIB) |

**Aturan jika terlambat:** pangkas dari fitur yang paling tidak penting dulu — jangkar hash, halaman tambahan, hiasan visual. Jangan pangkas: benchmark, intent binding (pencocokan hash maksud), uji privasi, dan bukti eksekusi.

---

## 12. Status Pendaftaran dan Kelayakan Tim

**Syarat kelayakan tim** (menurut sumber yang sudah diverifikasi):

- Setiap anggota harus mahasiswa aktif penuh waktu di universitas yang berlokasi di luar Tiongkok Daratan, Hong Kong, Makau, dan Taiwan. Kelayakan ditentukan oleh lokasi universitas, bukan kewarganegaraan.
- Jumlah anggota tim: 2 sampai 5 orang.
- Minimal 60% anggota tim berkewarganegaraan non-Tiongkok.
- Satu orang hanya boleh terdaftar di satu tim.

**Keputusan tim:** pendaftaran ditunda sampai MVP berfungsi. Risiko dari penundaan ini:

1. Formulir pendaftaran dan halaman paspor kemungkinan perlu dikirim lebih awal untuk konfirmasi alokasi slot — ini belum dipastikan.
2. Kelayakan anggota tim belum diverifikasi secara formal ke panitia.

**Mitigasi:** kelayakan tim diperiksa secara internal sekarang (tanpa mengirim apa pun), dan tenggat pribadi untuk mendaftar ditetapkan paling lambat 16 Oktober, bersamaan dengan gerbang MVP.

---

## 13. Risiko dan Hal yang Masih Terbuka

1. **Aturan resmi lomba belum sepenuhnya diverifikasi.** Dokumen aturan resmi (`international-topics-rules-en.docx`) menentukan kontrak sandbox, format bukti, dan aturan bonus on-chain. Ada perbedaan sumber soal topik mana yang berhak mendapat bonus on-chain — perlakukan sebagai belum pasti sampai ada kutipan asli dari dokumen resmi.
2. **Dua sumber tanggal berbeda.** Beberapa sumber menyebut tanggal pengumuman finalis dan masa penilaian yang berbeda dari README utama. 20 Oktober 2026 diperlakukan sebagai batas mutlak.
3. **Kontrak API evaluator otomatis belum diketahui.** Rancangan API tim saat ini adalah usulan, dan perlu disesuaikan dengan kontrak resmi begitu tersedia.
4. **Akses layanan di Tiongkok berisiko terganggu.** Seluruh sistem harus bisa berjalan secara offline, dengan parser berbasis aturan dan AI lokal sebagai cadangan.
5. **Beban kerja besar untuk waktu 10 hari.** Dikendalikan lewat gerbang harian dan aturan pemangkasan fitur di Bagian 11.

---

## 14. Klaim: Boleh dan Tidak Boleh Digunakan

Bagian ini penting untuk semua materi komunikasi — dokumen teknis, pitch deck, narasi video — agar tidak ada klaim yang berlebihan atau tidak bisa dipertanggungjawabkan saat ditanya juri.

### Boleh Digunakan

- Hasil yang sudah diukur dengan metodologi jelas dan selang kepercayaan statistik.
- "Pada data sintetis" (data buatan, bukan data pengguna asli).
- "Pada bank simulasi" (bukan bank sungguhan).
- "Estimasi dengan cadangan" (untuk perhitungan biaya transfer).
- "Ringkasan bukti, bukan skor kredit" (untuk fitur Prove).
- "Tiga lapis independen" — selama layanan Bank Simulasi benar-benar berjalan terpisah dari API Utama.

### Tidak Boleh Digunakan

- Klaim integrasi atau afiliasi dengan sponsor lomba (misalnya WeBank) tanpa dasar yang benar.
- Klaim memakai smart contract, HSM, atau teknologi "on-chain" di jalur utama produk.
- Klaim "tidak dapat diretas", "nol risiko", atau "menutup 100% serangan".
- Jaminan dana sampai dengan jumlah utuh tanpa potongan.
- Klaim kepatuhan hukum penuh (full legal compliance).
- Klaim soal kuota valuta asing atau regulasi Tiongkok yang belum diverifikasi ke sumber resmi.
- Hasil pengujian yang ditulis sebelum benar-benar diukur.

---

## 15. Daftar Istilah

| Istilah | Penjelasan Sederhana |
| :-- | :-- |
| PWA (Progressive Web App) | Aplikasi web yang bisa diinstal dan dipakai seperti aplikasi biasa di ponsel, tanpa perlu diunduh dari app store |
| DAG (Directed Acyclic Graph) | Rencana eksekusi berupa urutan langkah yang jelas, di mana tidak ada langkah yang berputar kembali ke langkah sebelumnya |
| Idempotensi | Jaminan bahwa satu langkah/transaksi tidak akan dieksekusi dua kali meski diminta berulang |
| Hash | Kode unik hasil perhitungan dari suatu data; jika datanya berubah sedikit saja, hasilnya pasti berbeda. Dipakai untuk memastikan data tidak diubah tanpa sepengetahuan sistem |
| Token terbatas (scoped token) | Izin akses sementara yang hanya berlaku untuk tindakan, jumlah, dan waktu tertentu |
| Sandbox | Lingkungan simulasi/uji coba yang terpisah dari sistem sungguhan, aman untuk pengujian |
| Ablasi / tabel ablasi | Pengujian dengan cara mematikan satu komponen sistem secara bergantian, untuk melihat seberapa penting komponen itu terhadap keamanan keseluruhan |
| Policy Plane | Bagian sistem yang menegakkan aturan transaksi (siapa boleh kirim berapa, ke mana, dan kapan perlu persetujuan) |
| Intent (maksud pengguna) | Apa yang sebenarnya diminta pengguna, hasil pemahaman sistem terhadap permintaan dalam bahasa biasa |
| Canary test (uji canary) | Pengujian dengan menyisipkan data palsu bertanda untuk memeriksa apakah data tersebut bocor ke tempat yang seharusnya tidak |
| Selang kepercayaan Wilson 95% | Metode statistik untuk melaporkan rentang kemungkinan hasil sebenarnya, dipakai karena lebih akurat untuk jumlah sampel kecil |
| GA / LTS | Singkatan untuk versi perangkat lunak yang sudah stabil dan didukung jangka panjang (General Availability / Long-Term Support), lawan dari versi uji coba (beta/RC) |
| ORM | Alat yang menerjemahkan kode program menjadi perintah database, sehingga akses data lebih aman dan terstruktur |
| Egress Ledger | Catatan log khusus yang mencatat setiap kali sistem mengirim data ke AI dari luar (cloud) |
| Money mule | Istilah untuk orang (sering tanpa sadar) yang rekeningnya dipakai untuk menampung dan meneruskan dana hasil kejahatan |

---

## 16. Berkas Pendukung dan Referensi

**Dokumen pendukung dalam proyek ini:**

- `FINTECHATHON_2026_WINNING_STRATEGY.md` — strategi penilaian per kriteria lomba
- `FINTECHATHON_2026_ADDENDUM_PRIVASI_DATASET_ALUR.md` — detail tambahan privasi dan dataset
- `AEGISPATH_APP_BLUEPRINT.md` — cetak biru aplikasi secara detail
- `AEGISPATH_UI_REVISION_PROMPT.md` — spesifikasi desain dan revisi antarmuka
- `AEGISPATH_ANTIGRAVITY_PROTOTYPE_PROMPT.md` — instruksi pembuatan prototipe tujuh layar
- `AEGISPATH_WEB_FIRST_PROMPT.md` — strategi pengembangan web-first
- Kanvas desain tujuh layar dan aset ilustrasi (storyboard, concept board)

**Sumber eksternal yang dikutip:**

1. README\_FINTECHATHON\_2026.md (berkas unggahan tim), 2026.
2. Chiang Mai University, International Relations Administration Center, "Upcoming Event | 2026 Shenzhen International FinTech Competition (FinTechathon) – International Track", 7 Oktober 2026.
3. Beijing News (via Tencent News), "2026第八届深圳国际金融科技大赛正式启动", 2 September 2026.
4. README\_CreditBridge\_AI\_v2.md dan README\_NexusCFO\_AI.md (berkas unggahan tim), 2026.
5. Daftar "Invited Academic Advisers" dari portal resmi lomba — perlu diverifikasi ulang sebelum dikutip di materi resmi.
6. Royal United Services Institute, "Whack-a-Mule: Have the Police Mastered the Game?", 19 Maret 2019.
