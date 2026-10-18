# AegisPath — Addendum Strategi (Revisi 1)
## Validasi Poin Lomba, Peta Juri & Sponsor, Privasi pada Pemrosesan LLM, Dataset Keamanan, dan Alur Klien

> **Disusun:** 9 Oktober 2026. **Melengkapi:** `FINTECHATHON_2026_WINNING_STRATEGY.md`.
> **Batas waktu pengiriman:** 20 Oktober 2026, 23.59 UTC+8 (setara **22.59 WIB**) [3]. Sisa waktu: 11 hari.
> Angka dalam kurung siku, misalnya [3], merujuk ke Daftar Rujukan di akhir dokumen.

---

## 0. Ringkasan Eksekutif dan Erata

Revisi ini dibuat setelah seluruh poin lomba dicocokkan dengan sumber independen. Temuan yang paling berpengaruh terhadap rencana:

1. **Dokumen sebelumnya perlu dikoreksi pada satu hal penting.** Strategi awal menyatakan bahwa penyelenggara memosisikan Agent Wallet sebagai inti International Track, berdasarkan pengumuman IEEE CIS Shenzhen bulan Juni [5]. Pengumuman peluncuran 31 Agustus menyatakan sebaliknya: Agent Wallet dipertahankan sebagai salah satu arah, dan lima arah lain ditambahkan **dengan kedudukan setara dan memakai standar kemampuan inti serta dimensi penilaian yang sama** [4]. Dengan demikian, Topik F tidak lagi dapat dianggap sebagai pilihan yang "disukai" penyelenggara. Keunggulannya tinggal bonus 0–5 poin [3] dan kecocokan dengan kemampuan tim.
2. **Penilaian tahap awal kemungkinan bersifat otomatis plus ulasan buta.** Sumber [4] menyebut mekanisme "evaluasi otomatis dan penilaian buta oleh pakar". Konsekuensinya: sistem harus dapat diuji mesin (antarmuka stabil, dapat direproduksi), dan dokumen harus dapat berdiri sendiri tanpa presentasi lisan.
3. **Babak final memuat hackathon 48 jam.** Sumber [4] menyebut final berformat "optimasi karya 48 jam + sidang peragaan"; README lokal hanya menyebut presentasi dan sidang [1]. Tim harus mampu memodifikasi sistem di Shenzhen dalam waktu singkat.
4. **Ada langkah pendaftaran yang tidak tertulis di README.** Halaman [3] menyatakan formulir pendaftaran beserta halaman biodata paspor setiap anggota harus dikirim lewat email untuk "mengonfirmasi alokasi slot". Langkah ini sebaiknya dilakukan **hari ini**.
5. **Ada konflik tanggal dan saluran pengiriman** antarsumber (Bagian 2). Selama belum dikonfirmasi, perlakukan 20 Oktober sebagai batas mutlak dan kirim ke kedua alamat penerima.
6. **Persaingan sudah terlihat di ruang publik.** Setidaknya satu tim lain telah mengunggah repositori lengkap dengan arsitektur privasi (tokenisasi, vault terenkripsi, log audit berantai-hash, pemetaan OWASP) dan menargetkan Topik E [9]. Ini menunjukkan standar privasi yang realistis untuk dikalahkan: privasi harus menjadi lapisan arsitektur yang dapat dibuktikan, bukan paragraf kebijakan.

Keputusan topik kini bersifat bersyarat (Bagian 4): **Topik F bila aturan resmi mengizinkan chain pilihan sendiri dan mekanisme evaluasinya jelas; selain itu Topik C** dengan inti sistem yang sama.

---

## 1. Register Validasi Poin Lomba

Legenda: **V** = terverifikasi oleh sumber independen; **K** = konflik antarsumber; **S** = sumber tunggal (README lokal); **B** = informasi baru yang belum ada di README.

| No | Poin | Hasil Pencocokan | Status |
| :-: | :-- | :-- | :-: |
| 1 | Registrasi gratis | Dinyatakan sama pada [3] | V |
| 2 | Hadiah International Track RMB 250.000; total seluruh lomba RMB 750.000 | [3], [4], [5] konsisten (250.000 per track) | V |
| 3 | Juara 1/2/3 = RMB 100.000 / 80.000 / 50.000; penghargaan keempat RMB 20.000 | [3], [5] konsisten. Nama penghargaan keempat: *Best Innovation* [3] vs *Best Creativity* [5] | V (nama berbeda) |
| 4 | Peserta: S1/S2/S3 penuh waktu di luar Tiongkok Daratan, Hong Kong, Makau, Taiwan | [3] sama. Versi awal [5] menyebut "21 ekonomi APEC". Indonesia anggota APEC, sehingga tidak merugikan kita, tetapi redaksi aturan perlu dikonfirmasi | V / K ringan |
| 5 | Tim 2–5 orang; ≥60% non-Tiongkok; satu orang satu tim | [3] sama | V |
| 6 | Bahasa resmi Inggris | [3] sama | V |
| 7 | Enam topik A–F; Topik F memberi bonus 0–5 | [3] sama. [4] menjelaskan seluruh arah setara dan memakai dimensi penilaian yang sama | V |
| 8 | Bobot 40% / 30% / 30% + bonus | Hanya pada README [1]. [4] hanya menyebut "standar kemampuan inti dan dimensi penilaian" yang sama | S |
| 9 | Batas pendaftaran dan pengiriman: 20 Okt 2026, 23.59 UTC+8 | [3] sama. Namun [4] dan [5] menyebut masa rekrutmen hingga 1 November dan babak awal ditutup 2 November | K |
| 10 | Ulasan daring 20–31 Okt; finalis diumumkan 31 Okt | [3] sama. [5] menyebut 10 November; [4] menyebut masa penilaian 2–10 November | K |
| 11 | Check-in 20 Nov; final 21–23 Nov di Shenzhen | [3], [4], [5] konsisten. Rincian "sidang 22 Nov, penutupan 23 Nov" hanya di [1] | V / S |
| 12 | Sepuluh tim finalis; tiket PP dan akomodasi ditanggung | [5] menyebut Top 10 dan "tunduk pada aturan final"; [3] menyatakan ditanggung penyelenggara | V (bersyarat) |
| 13 | Jalur wawancara cepat WeBank | [3], [4], [5] konsisten | V |
| 14 | Format final | [4]: hackathon optimasi 48 jam + sidang peragaan. README tidak menyebut hackathon | B |
| 15 | Mekanisme penilaian awal | [4]: evaluasi otomatis + penilaian buta pakar (disebut untuk lomba secara umum; penerapan pada International Track diasumsikan) | B |
| 16 | Daftar berkas wajib (4) dan opsional (3) | Hanya pada [1]. [3] menyebut formulir + biodata paspor + "seluruh berkas" lewat email | S |
| 17 | Saluran pengiriman | README: `fintechathon@ican-x.com` / `info@ican-x.com`. Halaman [3]: email ke koordinator di Tsinghua PBC School of Finance (`wangyr@pbcsf.tsinghua.edu.cn`) | K |
| 18 | Langkah "lodgement" formulir + paspor untuk konfirmasi slot | Hanya pada [3] | B |
| 19 | Struktur penyelenggara | [4]: WeBank dan Universitas Shenzhen sebagai pengarah strategis; Fakultas FinTech Universitas Shenzhen–WeBank sebagai penyelenggara; unit pengarah teknis: CCF Digital Finance, Tsinghua Institute of FinTech, IEEE CIS Singapore dan Shenzhen. [3]: International Track diselenggarakan oleh Tsinghua PBC School of Finance bersama WeBank | V (peran berbeda) |
| 20 | Sertifikat kompetisi terakreditasi Kementerian Pendidikan Tiongkok | Hanya [5] ("opportunities"); tidak boleh dijanjikan | S |
| 21 | Folder `referensi_lomba/` dan isi template resmi | Tidak dapat diverifikasi dari luar. Tautan unduhan pada [3] memblokir akses otomatis; buka manual | Tidak terverifikasi |
| 22 | Daftar pemenang 2024–2025 (berkas `PEMENANG_TAHUN_SEBELUMNYA.md`) | Tidak diverifikasi ulang pada sesi ini. Kesesuaian pola dengan panel juri 2024 [6] masuk akal, tetapi tautan sitasi di dalam berkas perlu dicek sebelum dikutip | Belum diverifikasi |

**Tindakan wajib dari register ini:** buka `international-topics-rules-en.docx` dan tautan "Details & Problem Description" pada [3]. Butir 8, 14–16, 21 hanya dapat dipastikan dari sana.

---

## 2. Konflik yang Harus Diselesaikan dan Draf Email ke Panitia

**Pendekatan konservatif:** anggap batas pengiriman adalah 20 Oktober dan kirim ke **kedua** alamat penerima (ican-x dan PBCSF) dengan isi identik, serta minta konfirmasi tertulis mana saluran yang sah.

### Draf Email (Bahasa Inggris)

```
Subject: [FinTechathon 2026 – International Track] Clarification requests before the 20 Oct deadline

Dear Organizing Committee,

We are a student team preparing a submission for the International Track and would
appreciate your confirmation of the following points, so that we comply fully with the rules:

1. Deadline and channel. Is the submission deadline 20 October 2026, 23:59 (UTC+8)?
   Several public pages mention 1–2 November. Should submissions be sent to
   fintechathon@ican-x.com / info@ican-x.com, or to the PBC School of Finance
   coordinator listed on partner announcements?
2. Registration. Has our registration form and passport bio pages been received and
   our slot allocated? Please confirm the expected acknowledgement.
3. Topic F (Agent Wallet). Is there a mandated blockchain/network, wallet standard,
   or toolchain? How are on-chain results verified (transaction hash, explorer,
   automated checker)? Are public testnets acceptable?
4. Evaluation interface. For topics evaluated in a simulated environment, how will the
   automated evaluation call our system (HTTP endpoint, MCP, CLI, container)? Is the
   simulated environment API specification final?
5. LLM usage. Are there restrictions on which LLM providers or local models may be
   used during evaluation or the on-site final?
6. On-site final. Please confirm the 48-hour optimization format, available network
   access (including access to external APIs and code hosting from the venue), and
   whether teams may bring their own devices and offline model weights.
7. Visa support. When will invitation letters be issued to finalists, relative to the
   announcement date, for the 20 November check-in?

Thank you very much for your time.

Kind regards,
[Team name] — [Institution, Country]
```

---

## 3. Peta Juri, Sponsor, dan Implikasinya

### 3.1 Apa yang Diketahui

- **Pengarah strategis dan sponsor utama:** WeBank dan Universitas Shenzhen. WeBank menggambarkan misinya sebagai membuat keuangan inklusif bagi masyarakat luas dan telah lama berinvestasi pada pengembangan talenta bersama universitas [4].
- **Pengarah teknis:** CCF Digital Finance Chapter, Tsinghua Institute of FinTech, IEEE CIS Singapore, IEEE CIS Shenzhen [4].
- **Dewan penasihat akademik** (menurut cuplikan halaman resmi berbahasa Inggris; daftar terpotong, verifikasi langsung di portal): Shouyang Wang (Chinese Academy of Sciences), Qiang Yang (Chief AI Advisor WeBank), Wenjung Li (CityU), Jianqing Li (Dekan AI, Universitas Shenzhen), Yunpeng Chai (Humboldt-Universität zu Berlin) [5].
- **Panel juri 2026 belum ditemukan dipublikasikan.** Sebagai preseden, panel track AI tahun 2024 dipimpin Qiang Yang, beranggotakan peneliti AI WeBank serta akademisi dari Zhejiang University of Finance & Economics, Universitas Shenzhen, dan HKUST [6].
- Berkas pemenang yang Anda unggah menunjukkan dua tahun berturut-turut karya berbasis ekosistem terbuka WeBank (FATE, FATE-LLM, FISCO BCOS) berada di podium [2]. Berkas ini belum diverifikasi ulang (Bagian 1, butir 22).

### 3.2 Implikasi Strategis (Inferensi, Bukan Fakta Resmi)

| Observasi | Implikasi untuk Rancangan dan Materi |
| :-- | :-- |
| Pimpinan teknis WeBank dikenal pada pembelajaran terfederasi dan AI yang menjaga privasi | Privasi harus menjadi **argumen utama**, dengan bukti terukur (Bagian 5), bukan lampiran |
| Misi keuangan inklusif dan konteks APEC yang ditekankan penyelenggara [4] | Bingkai pengguna: pekerja migran, mahasiswa internasional, biaya rendah, antarmuka multibahasa. Ini sejalan dengan tema resmi dan menaikkan skor *real-world value* |
| Penilaian awal otomatis + ulasan buta [4] | Antarmuka stabil, tes yang dapat dijalankan ulang, dokumen yang mandiri (juri tidak mendengar penjelasan lisan) |
| Final berformat hackathon 48 jam [4] | Basis kode modular, regresi otomatis, kit offline; minimal dua anggota mampu memodifikasi inti sistem di tempat |
| Sponsor dan juri berasal dari bank, regulator-adjacent, dan akademisi | Tampilkan kepatuhan (KYC/AML, jejak audit, tata kelola izin) dan keterbatasan secara jujur. Klaim berlebihan lebih merugikan daripada keterbatasan yang diakui |
| Konteks regulasi aset kripto di Tiongkok daratan sensitif (perdagangan aset kripto dibatasi) | **Bingkai Topik F sebagai pembayaran dan kontrol risiko**, bukan perdagangan atau spekulasi. Gunakan testnet, tanpa imbal hasil atau saran investasi, dan nyatakan batas ini di dokumen dan video. Ini penilaian risiko bahasa, bukan nasihat hukum |
| Bahasa resmi Inggris, juri berbahasa Mandarin | Sertakan ringkasan eksekutif satu halaman bilingual (Inggris dan Mandarin) sebagai nilai tambah, selama kualitas terjemahan terjaga |
| WeBank menyediakan jalur wawancara | Tunjukkan kedalaman rekayasa penuh: repositori bertes, README reproduksi, CI sederhana |

### 3.3 Hal yang Perlu Dihindari

Menyebut nama juri dalam materi untuk mengambil hati, mengklaim afiliasi atau dukungan sponsor yang tidak ada, mengutip makalah juri di luar relevansi teknis, serta menampilkan klaim kepatuhan hukum yang tidak dapat dibuktikan.

---

## 4. Revisi Keputusan Topik dan Arsitektur Adaptor

### 4.1 Keputusan Bersyarat (Batas Waktu: 10 Oktober, Siang)

| Kriteria | Topik F (Agent Wallet) | Topik C (Cross-border & Student) |
| :-- | :-- | :-- |
| Poin tambahan | Bonus 0–5 [3] | Tidak ada |
| Kecocokan kemampuan tim | Tinggi (Stellar/Soroban, keamanan penandatangan) | Tinggi (remitansi lintas negara) |
| Risiko teknis | Tinggi: tergantung chain/verifier yang diwajibkan | Sedang: tergantung kontrak API simulasi |
| Risiko persepsi | Perlu bingkai hati-hati (Bagian 3.2) | Rendah |
| Kepadatan peserta | Belum diketahui. Tiga repositori publik yang ditemukan menargetkan Topik B (+A, C) dan E [9]; sampel kecil dan hanya indikatif | Kemungkinan padat pada A/B/C/E |
| Cocok dengan penilaian otomatis | Verifikasi lewat hash transaksi (menurut README) | Lewat kontrak API simulasi (terbukti ada untuk Topik E pada repositori peserta lain [9]; asumsi serupa untuk topik lain) |

**Aturan keputusan:**
- Pilih **F** jika aturan resmi mengizinkan chain/testnet bebas, mekanisme verifikasi hash jelas, dan bobot bonus dinyatakan.
- Pilih **C** jika F mewajibkan chain atau toolchain di luar kemampuan 11 hari, atau jika kontrak API simulasi Topik C tersedia dan lengkap.
- Dalam kedua kasus, **inti sistem sama** (Bagian 4.2), sehingga peralihan tidak membuang pekerjaan.

### 4.2 Arsitektur Dua Lapis: Trust Kernel dan Adaptor

```
┌───────────────────────── TRUST KERNEL (dipakai semua topik) ─────────────────────────┐
│ Privacy Gateway → Intent Parser → Planner DAG → Policy Plane → Audit & Evidence       │
│ Evaluation Harness (benchmark, red-team, privasi) · Egress Ledger (log keluar LLM)    │
└──────────────┬───────────────────────────────────────────────┬────────────────────────┘
               │ antarmuka tipe tetap                            │
        ┌──────▼───────┐                                 ┌───────▼────────┐
        │ Adaptor A    │                                 │ Adaptor B      │
        │ On-chain     │                                 │ Sandbox resmi  │
        │ (Stellar)    │                                 │ / bank tiruan  │
        └──────────────┘                                 └────────────────┘
 Antarmuka adaptor:  quote() · simulate() · execute(idempotency_key) · verify() · compensate()
```

Dengan pola ini, pernyataan inti ke juri tetap sama: **keamanan dan privasi ditegakkan oleh kernel, bukan oleh kepatuhan model**. Kemampuan inti yang juga dituntut pada track domestik dan dinyatakan sebagai standar bersama dalam [4], yaitu **permission tiering, pencegahan halusinasi dan injeksi, serta pemahaman intent dan perencanaan tugas**, dipetakan satu-satu ke komponen kernel dan dipakai sebagai istilah baku di seluruh dokumen.

---

## 5. Privasi pada Pemrosesan LLM

### 5.1 Prinsip

1. **Minimisasi:** model hanya melihat apa yang diperlukan untuk tugas saat itu.
2. **Pemisahan kepercayaan:** nilai sensitif tidak pernah melintasi batas kepercayaan dalam bentuk asli.
3. **Komputasi deterministik untuk angka dan keputusan:** kode menghitung jumlah, biaya, dan kebijakan; model memahami bahasa dan merencanakan.
4. **Bukti, bukan janji:** setiap klaim privasi harus dapat diuji lewat log keluar (*egress*) dan tes kebocoran.

### 5.2 Klasifikasi Data

| Zona | Isi | Aturan |
| :-- | :-- | :-- |
| **Z3 Rahasia** | Kunci privat, kredensial passkey, token API, seed | Tidak pernah masuk prompt, log, memori agen, maupun dataset. Agen hanya memegang *session key* berbatas |
| **Z2 Sensitif** | Nama lengkap, nomor paspor/ID, telepon, email, alamat, nomor rekening, dokumen KYC, isi invoice, saldo persis | Tinggal di dalam batas kepercayaan; ke LLM hanya sebagai token bertipe |
| **Z1 Pseudonim** | Alamat dompet (publik di ledger), handle penerima (`PAYEE_01`), pita jumlah (*amount band*), koridor (ID→CN), mata uang | Boleh ke LLM; tetap dicatat di Egress Ledger |
| **Z0 Publik** | Kurs, biaya jaringan, dokumentasi protokol | Bebas |

### 5.3 Alur Data dan Batas Kepercayaan

```
 Pengguna / dokumen / halaman web / memo
            │  (teks mentah, bisa memuat Z2 dan serangan)
   ═════════▼═════════════════ BATAS KEPERCAYAAN (perangkat/server sendiri) ═════════════
   [P1] Deteksi lokal: regex + NER model kecil lokal  ──► gagal-tertutup bila ada PII tersisa
   [P2] Tokenisasi bertipe: PERSON_x9f2, ACCT_k31a, AMT_BAND_3  (HMAC per-tenant)
   [P3] Vault terenkripsi (AES-GCM, kunci amplop) menyimpan nilai asli
   [P4] Pemeriksaan injeksi pada sumber tidak tepercaya (dokumen, memo, web)
   [P5] Egress Ledger: catat hash prompt, jumlah token, hasil detektor, tujuan model
   ═════════╤═══════════════════════════════════════════════════════════════════════════
            ▼  hanya teks tokenisasi + slot terstruktur
        ┌─────────────┐   routing: sensitif/OCR/ekstraksi → model lokal (open-weight)
        │ LLM cloud   │            perencanaan/penjelasan → LLM cloud (tanpa retensi)
        └──────┬──────┘
               ▼  keluaran terstruktur (JSON bertipe), bukan teks bebas ke tool
   [P6] Validasi skema + Policy Plane (deterministik, tanpa LLM)
   [P7] Detokenisasi HANYA di backend untuk pemilik yang berwenang, saat render akhir
   [P8] Filter egress keluaran: hapus URL/gambar markdown di luar allowlist
```

### 5.4 Ancaman Privasi Khusus LLM dan Kontrol

| Ancaman | Contoh | Kontrol |
| :-- | :-- | :-- |
| Retensi atau pelatihan oleh penyedia model | Prompt berisi data pengguna disimpan atau dipakai melatih | Tokenisasi sebelum keluar; gunakan tingkat API tanpa pelatihan atas data dan tanpa retensi bila tersedia (periksa kontrak/ketentuan penyedia secara langsung); model lokal untuk tahap paling sensitif |
| Eksfiltrasi lewat injeksi tidak langsung | Invoice berisi perintah tersembunyi agar agen membocorkan saldo lewat URL atau gambar markdown | Filter egress (P8); keluaran agen tidak merender sumber eksternal; tool tidak punya jalur keluar jaringan bebas; Policy Plane menolak argumen di luar skema |
| Kebocoran lewat hasil tool | Tool mengembalikan data pengguna lain atau kolom berlebih | Skema hasil minimal (*field allowlist*); isolasi per tenant; uji lintas-tenant |
| Kebocoran lintas sesi | Memori agen menyimpan data sensitif | Memori hanya menyimpan token dan preferensi non-sensitif; TTL; tidak ada memori bersama antar pengguna |
| Log dan telemetri | Log aplikasi atau layanan pelacak galat menangkap PII | Log hanya berisi ID, hash, dan token; matikan pengiriman PII ke layanan telemetri; uji pemindaian log |
| Embedding dan RAG | Vektor mengungkap isi asli | Embed hanya teks yang sudah tokenisasi; kontrol akses pada penyimpanan vektor |
| Ledger publik | Alamat dan jumlah terlihat siapa saja; PII di memo | Tidak ada PII di memo; hanya pseudonim; jangkar audit berupa *Merkle root* (tanpa data pribadi). **Keterbatasan:** graf transaksi tetap publik; mitigasi parsial (alamat terpisah per penerima, tanpa penggunaan ulang) dan dinyatakan jujur |
| Inferensi atribut dari pita jumlah | Pita sempit mengungkap nilai persis | Lebar pita disesuaikan; angka persis hanya dihitung oleh kode di dalam batas kepercayaan |
| Pemerasan privasi lewat klarifikasi | Agen menanyakan data yang tidak perlu | Aturan klarifikasi: hanya atribut yang memengaruhi keputusan; tidak pernah meminta Z3 |

### 5.5 Opsi Lanjutan yang Selaras dengan Ekosistem WeBank

- **Perturbasi teks berprivasi diferensial sebelum ke LLM cloud:** FATE-LLM menyertakan InferDPT untuk inferensi privat [2]. Untuk 11 hari, cukup ditulis sebagai arah pengembangan dan, bila waktu ada, diuji sebagai eksperimen kecil dengan laporan pertukaran utilitas–privasi. **Verifikasi** detail makalah dan lisensi sebelum dikutip.
- **Ekstraksi dokumen di perangkat:** salah satu karya podium 2025 menekankan ekstraksi struk secara *on-device* demi privasi [2]. Meniru pola ini pada OCR/ekstraksi invoice memperkuat narasi.

### 5.6 Kepatuhan dan Tata Kelola (Bukan Nasihat Hukum)

- **Data uji hanya sintetis.** Tidak ada data pribadi nyata di repositori, dataset, demo, maupun video; wajah dan nomor identitas pada tangkapan layar harus fiktif.
- Kerangka yang relevan sebagai rujukan desain: UU Pelindungan Data Pribadi Indonesia (UU No. 27 Tahun 2022), GDPR bila pengguna di Uni Eropa, dan hukum perlindungan informasi pribadi Tiongkok untuk data yang diproses di Tiongkok. Sebutkan sebagai **rujukan desain**, bukan klaim kepatuhan penuh.
- **Hak subjek data:** akses dan penghapusan atas data di luar rantai (penghapusan kriptografis dengan menghancurkan kunci vault). Data on-chain tidak dapat dihapus, sehingga yang disimpan on-chain hanyalah hash dan transaksi pseudonim. Nyatakan trade-off ini secara eksplisit.
- **KYC/AML:** pada demo gunakan KYC tiruan (misalnya alur SEP-12 pada anchor testnet) dan skrining penerima sederhana. Nyatakan bahwa implementasi produksi memerlukan penyedia KYC berlisensi dan pemenuhan ketentuan *travel rule* di yurisdiksi terkait.

### 5.7 Bukti Privasi yang Disajikan ke Juri

1. **Egress Ledger:** tabel semua panggilan LLM selama demo (jumlah token, hasil detektor, tujuan model, status). Menunjukkan bahwa tidak ada PII yang keluar.
2. **Tes canary:** sisipkan data uji palsu bertanda unik (misalnya nomor paspor palsu `CANARY-…`) ke dalam vault dan dokumen. Metrik: jumlah kemunculan canary pada permintaan keluar, log, keluaran, dan telemetri. **Target: 0 dari N pemeriksaan**, dengan batas atas kepercayaan dilaporkan (Bagian 6.8).
3. **Tes ekstraksi:** upaya memancing model membocorkan token atau nilai asli (*prompt extraction*, *membership probing*). Laporkan tingkat keberhasilan.
4. **Perbandingan sebelum/sesudah:** ukuran kebocoran dengan dan tanpa Privacy Gateway.
5. **Tabel keterbatasan:** apa yang **tidak** dilindungi (graf transaksi publik, metadata waktu, penyedia model cloud tetap melihat teks tokenisasi).

---

## 6. Dataset Pelatihan dan Validasi untuk Menekan Risiko Kerusakan Keamanan

### 6.1 Posisi yang Benar tentang Pelatihan

Jaminan keamanan sistem berasal dari **lapisan deterministik** (Policy Plane dan penegakan on-chain). Model pembelajaran mesin, termasuk pengklasifikasi injeksi, adalah **lapisan tambahan** yang menurunkan beban serangan dan memberi sinyal, **bukan satu-satunya gerbang**. Dataset pelatihan dan validasi berfungsi untuk: (a) mengkalibrasi ambang pengklasifikasi pada tingkat positif palsu yang dapat diterima, (b) mengukur kekokohan end-to-end, dan (c) menjadi suite regresi agar perbaikan tidak merusak keamanan.

### 6.2 Sumber Data

| Sumber | Kegunaan | Catatan |
| :-- | :-- | :-- |
| Dataset publik injeksi prompt dan benchmark agen (AgentDojo, InjecAgent, BIPIA, kumpulan injeksi prompt di hub dataset) | Inspirasi keluarga serangan; sebagian dapat dipakai untuk pelatihan/validasi | **Periksa lisensi, ketersediaan, dan risiko kontaminasi** sebelum dipakai. Unduh sebelum bepergian ke Tiongkok karena akses ke beberapa hub dapat terganggu |
| Data sintetis bertemplat (domain keuangan) | Invoice, memo, nama penerima, laporan mutasi, pesan chat | Dihasilkan dengan template + parafrase LLM, lalu direview manual |
| Mutasi otomatis | Terjemahan ID/EN/ZH, homoglif, karakter lebar-nol, base64, pemecahan instruksi, teks tersembunyi (HTML/markdown/PDF), injeksi pada gambar (OCR) | Meniru taktik penyerang adaptif |
| Penulisan manual oleh tim (*red-team day*) | Serangan kreatif yang tidak mudah dihasilkan mesin | Jadwalkan 2–3 jam; catat |
| Data resmi penyelenggara (bila ada) | Kasus uji sandbox | Prioritas tertinggi untuk validasi akhir |

### 6.3 Skema Label

Setiap contoh memuat: `id`, `family` (12 keluarga serangan; Bagian 6.4), `vector` (pesan pengguna / dokumen / output tool / memo / web / OCR), `target` (transfer / kebijakan / privasi / izin), `lang`, `obfuscation`, `severity`, `expected` (blokir / step-up / izinkan-dengan-sanitasi / minta-klarifikasi), `benign_twin_id` (pasangan jinak dengan minimal perbedaan), `source`, `license`, dan `hash`.

**Pasangan jinak (*minimal pair*)** wajib ada untuk menjaga tingkat positif palsu: misalnya invoice sah yang memuat kata "abaikan biaya lama" versus invoice berisi perintah injeksi.

### 6.4 Keluarga Serangan (12)

Injeksi langsung; injeksi tidak langsung lewat dokumen; injeksi lewat output tool; injeksi lewat memo/nama penerima; penggantian alamat setelah konfirmasi; kebingungan satuan/mata uang/desimal; eskalasi izin; eksfiltrasi privasi; replay/eksekusi ganda; rekayasa sosial (urgensi palsu); *structuring* (memecah transfer); penyalahgunaan tool di luar skema. Tambahkan **peracunan memori** dan **injeksi multibahasa** sebagai varian lintas keluarga.

### 6.5 Pembagian Data dan Pencegahan Kontaminasi

| Himpunan | Porsi | Aturan |
| :-- | :-- | :-- |
| Train | ~50% | Boleh dipakai untuk fine-tuning atau contoh *few-shot* |
| Dev | ~20% | Untuk kalibrasi ambang dan penyetelan |
| **Test tersegel** | ~30% | Dikunci dengan hash yang dicatat di README; tidak dipakai untuk penyetelan; jumlah evaluasi dicatat |

Aturan pembagian: **berbasis keluarga dan templat**, bukan acak per contoh. Sedikitnya tiga keluarga ditahan penuh sebagai uji generalisasi. Lakukan **deduplikasi hampir-duplikat** (MinHash atau kemiripan embedding) sebelum membagi. Contoh pada test tersegel tidak boleh muncul di prompt, contoh few-shot, atau kode.

### 6.6 Target Ukuran yang Realistis untuk 11 Hari

| Himpunan | Target | Catatan |
| :-- | :-- | :-- |
| Serangan | 480 (12 keluarga × ~40 varian) | Variasi semi-otomatis + review manual 20% |
| Jinak | 320, termasuk 160 pasangan jinak | Termasuk kasus tepi (jumlah besar sah, penerima baru sah) |
| Corpus intent | 360 ujaran | Multibahasa; 15–20% ambigu |
| Benchmark tugas | 60 tugas dengan DAG emas | Sudah ada pada strategi awal |
| Kegagalan operasional | 25 skenario | Trustline hilang, kuotasi kedaluwarsa, RPC timeout, dll. |

### 6.7 Pendekatan Pelatihan (Urut dari Paling Layak)

1. **Tanpa pelatihan:** aturan + kebijakan deterministik + evaluasi. Wajib ada.
2. **Pengklasifikasi siap pakai dengan kalibrasi ambang** pada dev untuk target FPR ≤ 1% pada kasus jinak. Periksa lisensi model (beberapa model penjaga memakai lisensi bersyarat) dan sediakan bobot secara offline.
3. **Fine-tuning ringan pengklasifikasi kecil** pada train, dievaluasi pada dev dan test tersegel; laporkan recall pada FPR tetap. Lakukan hanya bila langkah 1–2 stabil.
4. **LLM sebagai penilai** hanya untuk analisis audit pascakejadian, **bukan** gerbang keputusan.

### 6.8 Metrik dan Rigor Statistik

- **ASR** (*attack success rate*) per keluarga, **FPR** pada kasus jinak, **recall pada FPR tetap**, kerugian dana maksimum, tingkat kebocoran canary.
- Laporkan **selang kepercayaan** (misalnya Wilson 95%). Pengamatan "0 kegagalan dari N percobaan" **tidak** berarti risiko nol: batas atas 95% kira-kira 3/N (misalnya N = 120 memberi batas atas sekitar 2,5%). Tulis ini di dokumen; juri yang teliti akan menghargainya.
- **Putaran adaptif:** setelah pertahanan dibekukan, 1–2 orang di luar pengembang diberi akses kode dan 2 jam untuk mencoba menembus. Laporkan hasilnya apa adanya, termasuk temuan yang berhasil.

### 6.9 Integritas Data (Mencegah Peracunan)

Manifest dataset bertanda hash; pencatatan asal-usul setiap contoh; hanya anggota tertentu yang dapat menulis ke himpunan train; tidak melatih dari log produksi tanpa sanitasi; pemindaian pemicu *backdoor* sederhana; tinjau contoh dari sumber publik secara sampling. Sediakan **kartu dataset** (tujuan, komposisi, proses, keterbatasan) sebagai lampiran dokumen teknis.

### 6.10 Pemeliharaan

Setiap bug keamanan yang ditemukan menjadi satu kasus uji permanen; CI menjalankan suite regresi dan memblokir perubahan yang menaikkan ASR atau FPR melebihi batas.

---

## 7. Alur Klien (Client Journey) Lengkap

### 7.1 Aktor

| Aktor | Peran |
| :-- | :-- |
| **Pemilik (klien)** | Pengguna akhir: pekerja migran, mahasiswa internasional |
| **Penjaga (*guardian*)** | Anggota keluarga/wali yang menjadi penandatangan pendamping untuk tindakan Tier 3 dan pemulihan |
| **Agen** | Memegang *session key* terbatas dan kedaluwarsa; tidak pernah memegang kunci pemilik |
| **Penerima** | Keluarga di kampung halaman atau institusi pendidikan |
| **Anchor / jalur keluar-masuk (ramp)** | Penyedia konversi fiat↔token (tiruan di testnet) |
| **Auditor / kepatuhan** | Membaca log audit dan receipt; tidak dapat menggerakkan dana |

### 7.2 Alur F0 — Onboarding dan Persetujuan

1. Pengguna memilih bahasa (ID/EN/ZH) dan membaca **pemberitahuan privasi** ringkas: data apa yang diproses, mana yang keluar dari perangkat, apa yang tercatat on-chain.
2. Persetujuan granular: pemrosesan LLM cloud (ya/tidak; bila tidak, hanya model lokal), penyimpanan riwayat, notifikasi.
3. Pembuatan identitas: **passkey** pemilik (tanpa seed phrase di layar). KYC tiruan (sintetis) pada demo.
4. Pembuatan dompet pintar dengan **kebijakan awal konservatif**.
5. Penetapan penjaga (opsional, sangat disarankan).

*Keluaran:* kebijakan tersimpan, hash kebijakan tercatat di audit. *Kegagalan:* perangkat tanpa dukungan passkey → alternatif pendamping dengan batas lebih rendah.

### 7.3 Alur F1 — Penetapan Batas (Policy Setup)

Pengguna menetapkan: batas per transaksi, batas harian/bulanan, daftar penerima yang diizinkan, jam operasi agen, mata uang yang diizinkan, ambang step-up. Agen **menyarankan** nilai awal berdasarkan skenario, tetapi **hanya pemilik yang dapat menyimpan** kebijakan (T3). Sistem menampilkan "dampak terburuk": kerugian maksimum jika agen dikuasai penyerang.

### 7.4 Alur F2 — Penambahan Penerima

```
Pemilik: "Tambah ibu sebagai penerima, rekening ..., Surabaya"
 → Privacy Gateway menokenisasi data → Agen menyiapkan draft penerima
 → Verifikasi: format, skrining risiko sederhana, pemeriksaan alamat/akun
 → T2 step-up: pemilik melihat ringkasan dan menyetujui dengan passkey
 → Masa tenang (cooling-off) untuk penerima baru: batas transfer rendah
   selama N jam/hari yang dapat diatur
 → Penerima masuk allowlist on-chain (perubahan kebijakan = T3, time-lock)
```

*Alasan masa tenang:* menyulitkan penyerang yang menambahkan penerima lalu menguras dana sekaligus.

### 7.5 Alur F3 — Remitansi Rutin (Tier 1, Otomatis)

Pemilik: "Kirim 200 dolar ke ibu seperti biasa, pilih rute termurah."

1. **Intent Parser** menghasilkan intent terstruktur; slot dibandingkan dengan konteks (penerima di allowlist? jumlah ≤ batas?).
2. **Planner** menyusun DAG: `quote_fx → check_trustline → check_balance → simulate → (approval bila perlu) → execute → verify → notify → update_savings_vault`.
3. **Policy Plane** memeriksa tiap simpul; **hash intent** dikunci.
4. **Simulasi** dibandingkan dengan intent; bila selisih di luar toleransi → berhenti dan jelaskan.
5. **Eksekusi** dengan kunci idempotensi; **verifikasi** pasca-transaksi; **receipt** yang dapat dijelaskan (rute, biaya, kurs, hash).
6. **Notifikasi** ke pemilik (dan ke penerima bila disetujui).

*Metrik:* waktu penyelesaian, jumlah giliran percakapan (target ≤ 3), persentase otomatis tanpa intervensi.

### 7.6 Alur F4 — Tindakan Berisiko (Tier 2, Step-up)

```
 Pemilik        Agen            Policy Plane       Kontrak (on-chain)     Penerima
   │ "Kirim 3.000 ke penerima baru" │                   │                    │
   │────────────►│                  │                   │                    │
   │             │ intent+DAG       │                   │                    │
   │             │────────────────► │ jumlah > batas T1 │                    │
   │             │                  │ penerima belum ada│                    │
   │             │ ◄─── step-up wajib (T2) ─────────────│                    │
   │◄── ringkasan terstruktur (penerima terverifikasi, jumlah, kurs, biaya, risiko) ─┤
   │── passkey ─►│ hash(intent terkonfirmasi) = hash(parameter transaksi)           │
   │             │──────────────────────────────────────►│ cek limit/allowlist/waktu │
   │             │                  │                   │── eksekusi ───────────────►│
   │◄─────────── receipt + hash transaksi + status verifikasi ─────────────────────────┤
```

Layar persetujuan **menampilkan apa yang dipahami agen** dalam bahasa pengguna, bukan JSON. Perbedaan antara permintaan awal dan parameter akhir disorot.

### 7.7 Alur F5 — Pembayaran Uang Kuliah dari Dokumen (Skenario Mahasiswa)

1. Mahasiswa mengunggah tagihan (PDF/gambar). OCR dan ekstraksi dijalankan **di dalam batas kepercayaan**.
2. Teks diperiksa untuk injeksi (P4); isi dokumen dianggap **data tidak tepercaya**, bukan instruksi.
3. Agen menyajikan data hasil ekstraksi (penerima, jumlah RMB, tenggat) untuk **dikonfirmasi pengguna**; rekening penerima dibandingkan dengan daftar verifikasi.
4. Kurs, rute multi-mata uang, dan estimasi biaya ditampilkan; eksekusi mengikuti F4 (T2).

*Serangan terarah (untuk demo):* tagihan berisi perintah tersembunyi untuk mengubah rekening tujuan. Harapan: terblokir pada P4, ditolak pada Policy Plane karena alamat tidak ada di allowlist, dan ditolak lagi oleh kontrak bila lapisan atas dimatikan.

### 7.8 Alur F6 — Kegagalan dan Pemulihan

| Kegagalan | Perilaku Sistem |
| :-- | :-- |
| Kuotasi kedaluwarsa | Ambil ulang, bandingkan toleransi, minta konfirmasi bila selisih material |
| Trustline/saldo kurang | Simpul DAG khusus memperbaiki atau menjelaskan; tidak ada eksekusi parsial |
| Jaringan atau RPC gagal | Cek status via hash; retry dengan kunci idempotensi; tidak ada eksekusi ganda |
| Transaksi sebagian (multi-langkah) | **Aksi kompensasi** per simpul (misalnya batalkan penempatan di vault, kembalikan) dan catat di audit |
| LLM tidak tersedia | Turun ke model lokal atau mode terbatas (hanya T0/T1 terstruktur) |

### 7.9 Alur F7 — Insiden: Kill Switch, Perangkat Hilang, Pemulihan

1. **Kill switch:** satu tindakan pemilik mencabut seluruh *session key* agen; efek langsung, bukti di audit.
2. **Perangkat hilang:** pemulihan melalui penjaga (co-sign + time-lock). Selama masa tunggu, agen dalam mode baca-saja.
3. **Aktivitas mencurigakan:** pola tidak biasa (penerima baru berulang, pemecahan transfer) menurunkan agen ke T0 dan memberi tahu pemilik.
4. **Rotasi kunci agen** terjadwal dan setelah setiap insiden.

### 7.10 Alur F8 — Audit, Ekspor, dan Hak Data

Pemilik dapat melihat: riwayat tindakan, alasan tiap keputusan (termasuk yang diblokir), Egress Ledger sederhana ("data apa yang pernah dikirim ke model"), dan mengekspor atau menghapus data off-chain. Auditor mendapat tampilan baca-saja dengan token, bukan nilai asli.

### 7.11 Siklus Hidup Transaksi (Status)

```
DRAFT → PLANNED → POLICY_CHECKED → SIMULATED ─┬─► AWAITING_STEP_UP → APPROVED
                                               │                         │
                                               └─────────────────────────┤
                                                                         ▼
                                           SUBMITTED → CONFIRMED → VERIFIED → CLOSED
        (di tiap tahap)  REJECTED_BY_POLICY · FAILED · COMPENSATING → COMPENSATED
```

### 7.12 Persyaratan UX

Bahasa sederhana multibahasa; jumlah dan penerima selalu terlihat dalam layar persetujuan; indikator tier ("otomatis / butuh persetujuan Anda / butuh penjaga"); pesan penolakan yang menjelaskan alasan dan langkah berikutnya (menekan frustrasi dari positif palsu); aksesibilitas dasar (kontras, ukuran teks); mode hemat data untuk jaringan lemah.

---

## 8. Memaksimalkan Setiap Dimensi Penilaian

| Dimensi | Yang Dicari (Inferensi dari [1], [3], [4]) | Bukti yang Disajikan | Risiko dan Mitigasi |
| :-- | :-- | :-- | :-- |
| **Task Completion (40%)** | Penyelesaian tugas di lingkungan simulasi, kualitas dekomposisi DAG, akurasi pemanggilan tool | Benchmark 60 tugas (TCR, tool-call accuracy, plan validity); hash transaksi untuk tiap skenario sukses; log eksekusi | Antarmuka evaluator tidak diketahui → adaptor tipis ke kontrak API resmi; uji kepatuhan format keluaran |
| **Security & Compliance (30%)** | Ketahanan terhadap injeksi, manipulasi transfer, eskalasi izin, kebocoran privasi; tier izin; konfirmasi berlapis; kegagalan fatal berpotongan skor besar [1] | Tabel ablasi tiga lapis; ASR per keluarga dengan selang kepercayaan; FPR; tes canary privasi; Egress Ledger; Security Self-assessment | Satu bypass fatal pada demo → uji demo berulang; skenario fatal dikunci sebagai tes regresi; laporkan keterbatasan |
| **Innovation & Interaction (30%)** | Kebaruan, nilai dunia nyata, efisiensi dialog, klarifikasi, pemulihan galat/rollback [1] | Intent binding + keamanan independen model; privasi terukur; remitansi lintas negara untuk pengguna nyata; metrik giliran dialog; demo pemulihan | Kebaruan sulit dibuktikan → tabel pembanding dengan proyek serupa yang sudah ada [7][8], menjelaskan perbedaan |
| **Bonus (0–5), Topik F** | Eksplorasi lanjutan, implementasi on-chain [1][3] | Kontrak publik terverifikasi, hash eksekusi, jangkar audit | Mandat chain tidak cocok → Rencana B (Bagian 4) |

### 8.1 Pelajaran dari Lanskap Kompetitor

Repositori publik peserta lain [9] menunjukkan tingkat kerapian yang mungkin dihadapi: arsitektur privasi, harness evaluasi, pemetaan ke kerangka OWASP untuk aplikasi agen, rencana akses dari Tiongkok, dan video cadangan. Rancangan kita perlu unggul pada **kedalaman keamanan berbukti** (tiga lapis independen, ablasi, canary) dan **kasus pengguna nyata**, bukan pada jumlah fitur.

### 8.2 Kesiapan Final 48 Jam dan Sidang

- Siapkan *offline kit*: model lokal, salinan dependensi, node/akun testnet cadangan atau rekaman, video cadangan.
- Pastikan sedikitnya dua anggota dapat memodifikasi kernel dan adaptor; dokumentasikan perintah satu-baris untuk uji regresi.
- Latih sesi tanya-jawab: bug kontrak, KYC/AML, mengapa pilihan teknologi ini, apa batasannya, bagaimana skala, bagaimana privasi dijamin.

### 8.3 Klaim yang Boleh dan Tidak Boleh

Boleh: angka yang diukur dengan metodologi dan selang kepercayaan; "pada testnet"; "pada data sintetis". Tidak boleh: "tidak dapat diretas", "sepenuhnya patuh regulasi", klaim adopsi atau kemitraan yang tidak ada, penggunaan data nyata.

---

## 9. Rencana Kerja Revisi (9–20 Oktober) dan Persiapan Final

| Hari | Tanggal | Tindakan Tambahan akibat Revisi Ini |
| :-- | :-- | :-- |
| 0 | Jum 9 Okt | Kirim email klarifikasi (Bagian 2) ke kedua alamat; **kirim formulir pendaftaran + biodata paspor** sesuai [3]; baca aturan resmi; verifikasi kelayakan tim |
| 1 | Sab 10 Okt | **Keputusan F atau C (siang)**; kerangka Trust Kernel dan antarmuka adaptor; mulai Privacy Gateway (detektor + tokenisasi) |
| 2–3 | 11–12 Okt | Policy Plane + intent binding; adaptor terpilih; mulai dataset D1–D5 (draft) |
| 4 | 13 Okt | Planner DAG + kompensasi; Egress Ledger; alur F3 dan F4 berjalan end-to-end |
| 5 | 14 Okt | Alur F2, F5, F7; UI persetujuan; klasifikasi data Z0–Z3 diterapkan di log |
| 6 | 15 Okt | Dataset selesai, **test tersegel dikunci (hash)**; benchmark pertama (tugas, serangan, canary) |
| 7 | 16 Okt | Perbaikan; putaran red-team adaptif (orang di luar pengembang); skenario pemulihan; kumpulkan bukti |
| 8 | 17 Okt | Dokumen teknis, Security Self-assessment (termasuk privasi), Execution Evidence; deck; ringkasan bilingual |
| 9 | 18 Okt | **Pembekuan kode siang**; rekam video (versi utama + cadangan, subtitle Inggris); kartu dataset |
| 10 | 19 Okt | **QC revisi seluruh berkas** (angka identik di semua dokumen, sitasi, daftar pustaka, bahasa); isi formulir tim; uji kirim |
| 11 | 20 Okt | Penyangga. **Kirim paling lambat 18.00 WIB** ke kedua saluran; simpan bukti kirim |

**Setelah 31 Oktober (bila lolos):** urus visa dan perjalanan, siapkan offline kit, latihan 48 jam (simulasi perubahan kebutuhan), latihan sidang dengan penanya kritis.

---

## 10. Batas Klaim dan Risiko Residual

- Tidak ada jaminan kemenangan; skor ditentukan juri dan evaluator yang detailnya belum seluruhnya diketahui.
- Poin 8, 14–16 (Bagian 1) hanya sumber tunggal atau berasal dari pemberitaan; perlakukan sebagai hipotesis kerja sampai aturan resmi dibaca.
- Informasi juri 2026 belum ditemukan; seluruh pembacaan preferensi juri adalah inferensi dari preseden.
- Repositori publik kompetitor [9] hanyalah satu titik data; jangan menyimpulkan peta persaingan lengkap darinya, dan jangan menyalin pekerjaan mereka.
- Dokumen ini bukan nasihat hukum. Konfirmasi aspek regulasi (aset digital, perlindungan data, lintas negara) dengan sumber resmi sebelum membuat klaim kepatuhan.

---

## Daftar Rujukan

[1] README_FINTECHATHON_2026.md (berkas yang diunggah pengguna), 2026.
[2] PEMENANG_TAHUN_SEBELUMNYA.md (berkas yang diunggah pengguna), 2026. *Belum diverifikasi ulang secara independen.*
[3] Chiang Mai University, International Relations Administration Center. "Upcoming Event | 2026 Shenzhen International FinTech Competition (FinTechathon) – International Track", 7 Oktober 2026. https://ird.oou.cmu.ac.th/2026-shenzhen-international-fintech-competition/
[4] Beijing News (via Tencent News). "2026第八届深圳国际金融科技大赛正式启动", 2 September 2026. https://news.qq.com/rain/a/20260902A05KG800
[5] IEEE CIS Shenzhen Chapter. "2026 Shenzhen International FinTech Competition – International Track", 17 Juni 2026 (jadwal sementara). https://r10.ieee.org/shenzhen-cis/blog/2026/06/17/2026-shenzhen-international-fintech-competition-international-track/ . Daftar dewan penasihat diambil dari cuplikan hasil pencarian untuk halaman resmi bahasa Inggris dan perlu diverifikasi langsung di portal.
[6] FinTechathon (CSDN). Halaman panel juri edisi 2024. https://fintechathon.csdn.net/
[7] Stellar Development Foundation. "x402 on Stellar" (dokumentasi pengembang). https://developers.stellar.org/docs/build/agentic-payments/x402
[8] Stellar Foundation. "x402 on Stellar: unlocking payments for the new agent economy". https://stellar.org/blog/foundation-news/x402-on-stellar
[9] Repositori publik peserta lain (Topik E), digunakan hanya sebagai indikator lanskap. https://github.com/tanhongsheng050204-code/2026-SHENZHEN-FINTECHATHON-INTERNATIONAL-TRACK
[10] *Perlu dilengkapi dengan DOI/URL sebelum dikutip pada dokumen final:* OWASP Top 10 for LLM Applications; OWASP Top 10 for Agentic Applications; Debenedetti dkk., AgentDojo (NeurIPS 2024, Datasets & Benchmarks); Zhan dkk., InjecAgent (Findings of ACL 2024); Yi dkk., BIPIA (2023); Gebru dkk., "Datasheets for Datasets"; makalah InferDPT/FATE-LLM.
