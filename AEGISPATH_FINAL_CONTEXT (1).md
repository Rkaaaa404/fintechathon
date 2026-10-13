# AegisPath — Konteks Akhir (Final Concept)
## Satu Sumber Kebenaran untuk FinTechathon 2026, International Track: dari Persiapan sampai MVP

> **Dibuat:** Minggu, 11 Oktober 2026. **Batas pengiriman:** 20 Oktober 2026, 23.59 UTC+8 (22.59 WIB) [1][2]. Sisa waktu: 10 hari.
> Dokumen ini merangkum dan menetapkan keputusan dari seluruh diskusi, termasuk ide teman Anda (CreditBridge AI v2 dan NexusCFO AI) [4]. Bila ada perbedaan dengan dokumen lama, **dokumen ini yang berlaku**, sampai aturan resmi dibaca dan terbukti lain.

---

## 1. Keputusan Final

| Hal | Keputusan |
| :-- | :-- |
| Topik | **Topik C** (Cross-border & Student Finance Assistant) sebagai topik utama |
| Nama produk | **AegisPath** |
| Pengguna | Mahasiswa internasional dan pengirim uang lintas negara |
| Tiga fungsi | **Pay** (bayar dan kirim), **Prove** (bukti finansial), **Protect** (batas dan pertahanan) |
| Prinsip inti | Keamanan dan privasi ditegakkan **di luar model bahasa** |
| Bentuk | PWA mobile-first + backend API; satu konsol bukti desktop (opsional setelah MVP) |
| Bahasa antarmuka | **Inggris dan Mandarin saja** |
| Palet | Satu keluarga biru muda; hijau, kuning, merah hanya untuk status |
| Maskot | **Chop** (karakter segel), orisinal, ekspresinya mengikuti status sistem |
| Lapis pertahanan | Tiga lapis independen: filter privasi, aturan pengeluaran, **batas sisi bank sebagai layanan terpisah** |
| Kontrak pintar | **Tidak ada di jalur utama** dan tidak boleh diklaim |
| Skor kredit ML | **Dibuang**, diganti paket bukti finansial (aturan deterministik) |
| Dari NexusCFO | Diambil tiga komponen: perisai pergantian rekening pada invoice, simulasi runway deterministik, dan jangkar hash opsional |
| Bonus on-chain | **Opsional, setelah MVP**, hanya bila aturan resmi mengonfirmasi bonus berlaku di luar Topik F |
| Pendaftaran | Ditunda sampai MVP berfungsi (keputusan tim); lihat risikonya pada Bagian 8 |

---

## 2. Gagasan Akhir

AegisPath adalah agen keuangan berbasis AI untuk mahasiswa internasional. Pengguna meminta, misalnya, "kirim $200 ke Mom, rute termurah" atau "bayar uang kuliah saya". Agen memahami permintaan, menyusun rencana langkah demi langkah, memeriksanya terhadap kebijakan, meminta persetujuan bila berisiko, lalu mengeksekusi di bank simulasi dan menyimpan bukti.

Pembedanya satu kalimat: **agen yang keliru, tertipu, atau diretas tetap tidak dapat merugikan pengguna di atas batas yang ditetapkan pemilik, karena batas itu ditegakkan oleh tiga lapis yang tidak bergantung pada model.**

*Kalimat untuk juri (Inggris):* "AegisPath is an AI financial agent whose safety does not depend on the AI: three independent layers stop the damage even when the model is fooled."

Masalah yang dijawab ada tiga. Pertama, pembayaran lintas negara yang mahal dan tidak transparan: biaya tersembunyi dan dana yang tiba kurang karena potongan bank perantara. Kedua, mahasiswa asing yang tidak memiliki riwayat lokal sehingga sulit menunjukkan kemampuan finansialnya. Ketiga, penipuan yang menyasar mereka, antara lain perekrutan sebagai rekening perantara (*money mule*) dan penggantian rekening pada tagihan. Kasus pembekuan rekening mahasiswa asing yang terdokumentasi menunjukkan bahwa risiko ketiga nyata [6].

Tiga kontribusi yang dapat dipertanggungjawabkan: (1) arsitektur pertahanan berlapis independen yang dapat didemonstrasikan dan diukur, (2) paket bukti finansial dengan tingkat asal-usul yang dapat dibagikan secara terbatas, dan (3) agen yang menunjukkan perencanaan, persetujuan, dan pemulihannya secara kasatmata.

---

## 3. Ruang Lingkup Fitur

**Masuk MVP.**

- **Pay:** kuotasi uang kuliah dengan cadangan biaya bank ("tiba utuh", dengan catatan estimasi, bukan jaminan), kirim ke daftar penerima, rute Fastest/Cheapest/Balanced.
- **Agent:** percakapan Inggris dan Mandarin; parser berbasis aturan (LLM opsional di atasnya); rencana DAG yang tampil sebagai langkah-langkah.
- **Protect:** tier izin, hash intent, simulasi sebelum eksekusi, batas sisi bank, jeda agen, log audit berantai-hash, dan Sentinel (pola perekrutan rekening perantara, pergantian rekening pada invoice).
- **Prove:** paket bukti dengan tiga tingkat asal-usul, tautan berbagi yang kedaluwarsa dan dapat dicabut, ringkasan arus kas deterministik.
- **Planner:** simulasi runway dana terhadap jadwal kuliah dan beasiswa, tanpa model prediksi.

**Tidak masuk.** Layar Payees, Rates, dan More (hanya menampilkan "segera hadir"); skor kredit; integrasi rantai blok; pembayaran sungguhan; KYC sungguhan; model ML; mode gelap; masukan suara.

---

## 4. Arsitektur Akhir

```
Pengguna ─► PWA (7 layar, EN/中文) ─► API (port 8000)
                                      │  Privacy Gateway  → deteksi instruksi/PII, gagal-tertutup
                                      │  Parser intent    → aturan EN/中文 (+LLM opsional)
                                      │  Planner DAG      → langkah bertipe, idempotensi, kompensasi
                                      │  Policy Plane     → tier T0-T3, intent hash, simulasi
                                      │  Audit            → rantai hash SHA-256
                                      ▼  token bercakupan (batas, daftar penerima, kedaluwarsa)
                                 BANK SIMULASI (port 8100, rahasia dan basis data terpisah)
                                      memvalidasi ulang batas, idempotensi, buku besar
```

Tiga lapis pertahanan yang independen: **cincin luar** (filter privasi), **cincin tengah** (aturan pengeluaran pada Policy Plane), dan **cincin dalam** (batas sisi bank pada layanan terpisah). Layanan bank sengaja berada di proses dan basis data berbeda, dengan rahasia berbeda, agar baris "hanya lapis ketiga aktif" pada tabel ablasi benar-benar independen. API tidak pernah menulis buku besar langsung.

Aturan rancangan yang tidak boleh dilanggar: kode menghitung angka dan menegakkan kebijakan, model hanya memahami bahasa; keluaran model selalu JSON bertipe yang divalidasi; dokumen dari pihak luar diperlakukan sebagai data, bukan perintah; layar persetujuan dirender dari muatan bertanda tangan server; hash intent harus sama dengan hash parameter transaksi saat eksekusi; antarmuka hanya merender komponen dari daftar putih.

**Privasi.** Data diklasifikasikan Z0 sampai Z3. Kunci dan rahasia tidak pernah masuk prompt atau log; data sensitif ditokenisasi sebelum keluar batas kepercayaan; setiap panggilan model (bila LLM dinyalakan) tercatat di Egress Ledger; data uji seluruhnya sintetis. Batasan dinyatakan jujur: penyedia model cloud tetap melihat teks yang sudah ditokenisasi, dan metadata waktu tidak dilindungi.

---

## 5. Bukti dan Evaluasi

Bukti adalah hal yang akan benar-benar menentukan penilaian (Task Completion 40%, Security 30%) [1]. Yang harus ada pada MVP:

- **Benchmark tugas** sekitar 60 skenario dengan DAG emas: tingkat penyelesaian, akurasi pemanggilan tool, validitas rencana.
- **Suite serangan** 12 keluarga dengan sedikitnya 10 varian tiap keluarga, ditambah pola perekrutan rekening perantara dan injeksi multibahasa; plus pasangan kasus jinak untuk mengukur positif palsu.
- **Tabel ablasi:** tingkat keberhasilan serangan untuk konfigurasi model saja, ditambah filter privasi, ditambah aturan pengeluaran, ditambah batas bank, dan untuk tiap lapis dimatikan satu per satu.
- **Uji canary privasi:** data uji palsu bertanda dimasukkan ke dalam sistem; metrik adalah jumlah kemunculannya di panggilan keluar dan log.
- **Rigor statistik:** himpunan uji tersegel yang dikunci hash, pembagian berdasarkan keluarga serangan, selang kepercayaan Wilson 95%. Nol kegagalan dari N percobaan dilaporkan beserta batas atasnya, bukan sebagai "risiko nol".

Semua hasil keluar dari satu laporan (`eval/reports/latest.json`). **Tidak ada angka yang ditulis sebelum diukur.**

---

## 6. Antarmuka Akhir

Tujuh layar telah dirancang pada kanvas desain: Home, Agent chat, Pay tuition, Approval, Evidence, Planner, dan Safety. Seluruhnya memakai satu palet biru muda, teks dwibahasa Inggris dan Mandarin, maskot Chop dengan ekspresi sesuai status (melambai, berjaga, memblokir, dijeda), ilustrasi doodle pada header, dan peta radial serangan pada layar Safety yang menampilkan paket serangan berhenti di cincin pertahanan. Spesifikasi lengkap dan aset berada pada `AEGISPATH_ANTIGRAVITY_PROTOTYPE_PROMPT.md`.

Aturan konten yang berlaku: semua data berlabel simulasi; tidak ada merek atau nama sponsor; tidak ada klaim komponen yang tidak dibangun; angka seperti "$0 lost" dan "3/3" dihitung dari buku besar dan status lapis, bukan ditulis tangan.

---

## 7. Tahapan: Persiapan, Berjalan, sampai MVP

### 7.1 Persiapan (Min 11 sampai Sen 12 Okt)

Tujuan: menghapus ketidakpastian yang dapat menggagalkan seluruh rencana. Kegiatan: (1) baca `international-topics-rules-en.docx` dan salin kutipan yang menentukan (kontrak sandbox Topik C, aturan bonus on-chain, format video, ketentuan lisensi pustaka); (2) periksa kelayakan setiap anggota (universitas berlokasi di luar Tiongkok Daratan, Hong Kong, Makau, Taiwan; tim 2–5 orang; minimal 60% non-Tiongkok) [1][2] tanpa mengirim apa pun; (3) siapkan monorepo, Docker Compose satu perintah, font dan ikon yang di-host sendiri, dan modul data tiruan; (4) tulis daftar klaim dan kontrak API; (5) kerjakan Fase 1 pada prompt Antigravity (UI statis). **Gerbang:** `docker compose up` berjalan di mesin bersih, kutipan aturan tersimpan, dan UI statis cocok dengan tangkapan layar.

### 7.2 Berjalan (Sen 12 sampai Jum 16 Okt)

| Hari | Fokus | Hasil |
| :-- | :-- | :-- |
| Sen 12 | Dua layanan terpisah, token bercakupan, buku besar | Transfer berjalan lewat bank simulasi; tes token dan idempotensi lulus |
| Sel 13 | Parser EN/中文, Policy Plane, hash intent, simulasi, audit | Alur A (kirim ke Mom) berjalan end-to-end lewat API |
| Rab 14 | Penyambungan UI, persetujuan, alur B (bayar kuliah) | Perubahan setelah persetujuan ditolak; layar Approval membaca muatan server |
| Kam 15 | Filter privasi, Sentinel, suite serangan, replay per lapis | Alur C (serangan invoice) tertahan di tiga lapis; peta radial digerakkan hasil nyata |
| Jum 16 | Evidence, Planner, mode offline, perbaikan | Seluruh tujuh layar membaca data nyata; mode aturan-saja berjalan tanpa internet |

### 7.3 Gerbang MVP (Jum 16 Okt, akhir hari)

MVP dinyatakan selesai bila semua ini terpenuhi:

- Alur A, B, dan C berjalan nyata melalui API dan layanan bank terpisah.
- Mengubah transaksi setelah persetujuan ditolak (hash intent tidak cocok).
- Mematikan satu cincin mana pun tetap menyisakan cincin lain yang menghentikan serangan, dibuktikan oleh replay dari backend.
- Tabel ablasi dan angka "funds lost" dihasilkan dari laporan evaluasi.
- Ketujuh layar tampil sesuai desain dalam bahasa Inggris dan Mandarin, tanpa permintaan jaringan eksternal.
- `docker compose up`, `pytest`, dan skrip tangkapan layar berjalan di mesin bersih.

### 7.4 Setelah MVP (Sab 17 sampai Sel 20 Okt)

Sabtu 17: dokumen teknis, asesmen keamanan mandiri, bukti eksekusi, dan deck, disusun dari fragmen yang angkanya berasal dari laporan evaluasi. Minggu 18: pembekuan kode siang hari, rekam video 5 menit (versi utama dan cadangan), siapkan kit offline. Senin 19: pengecekan mutu seluruh berkas, rujukan diperiksa satu per satu, formulir tim. Selasa 20: **kirim paling lambat 18.00 WIB.** Pangkas dari bawah bila terlambat: jangkar hash, halaman lanjutan, ornamen. Jangan pangkas benchmark, intent binding, uji privasi, dan bukti eksekusi.

---

## 8. Risiko dan Hal yang Masih Terbuka

1. **Aturan resmi belum terkonfirmasi terbaca.** Isi `international-topics-rules-en.docx` menentukan kontrak sandbox, format bukti, dan aturan bonus. Teman Anda mengutip bahwa bonus on-chain tidak terbatas pada Topik F [4], sedangkan README yang kami pegang menyebut Topik F [1]. Belum terselesaikan; perlakukan sebagai hipotesis sampai ada kutipan asli.
2. **Menunda pendaftaran memiliki dua risiko.** Halaman pengumuman menyebut formulir dan halaman paspor dikirim untuk konfirmasi alokasi slot [2], dan kelayakan anggota belum diverifikasi. Mitigasi: periksa kelayakan sekarang (tanpa mengirim) dan tetapkan tenggat pribadi paling lambat **16 Oktober, bersamaan dengan gerbang MVP**.
3. **Tanggal bersumber ganda.** Sumber berita menyebut masa rekrutmen hingga 1 November dan penilaian 2–10 November [3]; sumber lain dan README menyebut 20 dan 31 Oktober [1][2]. Perlakukan 20 Oktober sebagai batas mutlak.
4. **Antarmuka evaluator otomatis tidak diketahui.** Rancangan API kami adalah usulan dan harus dipetakan ke kontrak resmi begitu tersedia.
5. **Akses di Tiongkok.** Layanan eksternal dapat terganggu saat final; seluruh sistem harus berjalan offline dengan parser aturan dan model lokal sebagai cadangan.
6. **Beban kerja.** Cakupan MVP besar untuk 10 hari. Gerbang harian dan aturan pemangkasan di atas adalah kendalinya.

---

## 9. Klaim

**Boleh:** hasil yang diukur dengan metodologi dan selang kepercayaan; "pada data sintetis"; "pada bank simulasi"; "estimasi dengan cadangan"; "ringkasan bukti, bukan skor kredit"; "tiga lapis independen" selama layanan bank benar-benar terpisah.

**Tidak boleh:** integrasi atau afiliasi dengan sponsor; kontrak pintar, HSM, atau "on-chain" pada jalur utama; "tidak dapat diretas", "nol risiko", atau "menutup 100% serangan"; jaminan dana tiba utuh; klaim kepatuhan hukum penuh; kuota valas atau regulasi Tiongkok yang belum diverifikasi sumber resminya; hasil uji yang ditulis sebelum diukur.

---

## 10. Berkas Pendamping

`FINTECHATHON_2026_WINNING_STRATEGY.md`, `FINTECHATHON_2026_ADDENDUM_PRIVASI_DATASET_ALUR.md`, `AEGISPATH_APP_BLUEPRINT.md`, `AEGISPATH_WORKFLOW_AND_UI_SYSTEM.md`, `AEGISPATH_UI_REVISION_PROMPT.md`, `AEGISPATH_ANTIGRAVITY_PROTOTYPE_PROMPT.md`, `aegispath_app_storyboard.svg`, `aegispath_ui_concept_board.svg`, dan kanvas desain tujuh layar.

---

## Daftar Pustaka

[1] README_FINTECHATHON_2026.md (berkas unggahan pengguna), 2026.
[2] Chiang Mai University, International Relations Administration Center. "Upcoming Event | 2026 Shenzhen International FinTech Competition (FinTechathon) – International Track", 7 Oktober 2026. https://ird.oou.cmu.ac.th/2026-shenzhen-international-fintech-competition/
[3] Beijing News (melalui Tencent News). "2026第八届深圳国际金融科技大赛正式启动", 2 September 2026. https://news.qq.com/rain/a/20260902A05KG800
[4] README_CreditBridge_AI_v2.md dan README_NexusCFO_AI.md (berkas unggahan pengguna), 2026. Kutipan aturan resmi di dalamnya belum diverifikasi terhadap dokumen aslinya.
[5] Daftar "Invited Academic Advisers" yang disalin pengguna dari portal resmi lomba. Verifikasi langsung di portal sebelum dikutip.
[6] Royal United Services Institute. "Whack-a-Mule: Have the Police Mastered the Game?", 19 Maret 2019. https://www.rusi.org/networks/shoc/informer/whack-mule-have-police-mastered-game
