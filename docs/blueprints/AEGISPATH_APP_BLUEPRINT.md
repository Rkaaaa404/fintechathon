# AegisPath — Cetak Biru Aplikasi
## Persiapan, Eksekusi, dan Pascakompetisi untuk FinTechathon 2026 (International Track, AI)

> **Disusun:** Sabtu, 10 Oktober 2026. **Batas pengiriman:** 20 Oktober 2026, 23.59 UTC+8 (22.59 WIB) [1][2]. Sisa waktu: 10 hari setelah hari ini.
> **Melengkapi:** `FINTECHATHON_2026_WINNING_STRATEGY.md`, `FINTECHATHON_2026_ADDENDUM_PRIVASI_DATASET_ALUR.md`, dan `AEGISPATH_UI_REVISION_PROMPT.md` [10].
> **Ilustrasi:** `aegispath_app_storyboard.svg` (lima layar, data simulasi), diletakkan satu folder dengan dokumen ini.

![Storyboard aplikasi](aegispath_app_storyboard.svg)

---

## 0. Keputusan Utama dan Asumsi

### 0.1 Jawaban Singkat: Aplikasi atau Web?

Rekomendasi saya adalah **aplikasi seluler berbasis web (Progressive Web App, PWA) yang mobile-first, ditambah satu *Proof Console* berbasis web desktop, dengan seluruh logika berada di API.** Aplikasi native (Flutter atau React Native) tidak direkomendasikan untuk jadwal sepuluh hari, karena biayanya tinggi sedangkan manfaatnya pada rubrik hampir nol.

Alasannya berangkat dari cara lomba ini dinilai. Penilaian tahap awal disebut memakai evaluasi otomatis dan penilaian buta oleh pakar [3], sehingga bobot terbesar (Task Completion 40% dan Security & Compliance 30% [1]) jatuh pada perilaku sistem di balik antarmuka, bukan pada tampilan. Antarmuka berperan pada dimensi Innovation & Interaction (30%) dan pada babak final, tempat juri melihat sistem secara langsung. Yang dibutuhkan adalah antarmuka yang meyakinkan di layar ponsel, mudah dibuka oleh juri tanpa instalasi, mudah dimodifikasi dalam hackathon 48 jam di Shenzhen [3], dan tidak bergantung pada toko aplikasi yang aksesnya tidak pasti dari Tiongkok.

| Opsi | Waktu 10 hari | Akses juri | Keamanan (passkey, kontrol) | Modifikasi saat final | Penilaian |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Web responsif biasa | Sangat cepat | Satu tautan | Baik | Mudah | Kurang terasa sebagai "aplikasi" |
| **PWA mobile-first + Proof Console** | **Cepat** | **Tautan atau QR, tanpa instal** | **Baik (WebAuthn)** | **Mudah** | **Direkomendasikan** |
| Aplikasi native | Lambat | Perlu APK/TestFlight, rawan hambatan distribusi | Sangat baik | Sedang | Biaya tidak sebanding dengan nilai rubrik |
| Mini-program super-app | Tidak layak | Perlu akun dan prosedur pengembang setempat | Bergantung platform | Sulit | Hanya sebagai peta jalan |

### 0.2 Asumsi Dokumen

Dokumen ini mengasumsikan **Topik C (Cross-border & Student Finance Assistant)** sebagai topik utama, dengan gagasan akhir hasil penggabungan AegisPath dan CreditBridge AI [7] (Bagian 1). Keputusan Topik C atau F tetap bergantung pada `international-topics-rules-en.docx`, yang belum terbaca pada sesi ini. Jika aturan resmi mensyaratkan hal lain, bagian yang paling terdampak adalah adaptor (Bagian 3.4) dan bagian API (Bagian 3.3); inti sistem, antarmuka, dan rencana kerja tidak berubah.

---

## 1. Gagasan Akhir

### 1.1 Pernyataan Gagasan

AegisPath adalah agen keuangan untuk mahasiswa internasional dan pengirim uang lintas negara yang bekerja dengan tiga fungsi, **Pay, Prove, dan Protect**, di atas satu prinsip: *keamanan dan privasi ditegakkan di luar model bahasa, sehingga agen yang keliru atau diretas tetap tidak dapat melampaui batas yang ditetapkan pemilik.*

*Pay* menghitung dan menjalankan pembayaran uang kuliah serta kiriman keluarga lewat jalur resmi, dengan estimasi dana yang sampai secara utuh. *Prove* menyusun paket bukti finansial yang dapat dibagikan secara terbatas kepada pihak lain, misalnya pemilik sewa atau bank. *Protect* membatasi apa yang boleh dilakukan agen sendiri, memblokir pola penipuan seperti perekrutan rekening perantara (*money mule*), dan menyediakan tombol jeda yang selalu terlihat.

### 1.2 Apa yang Diambil dari CreditBridge dan Apa yang Diubah

Dokumen CreditBridge menyodorkan masalah yang nyata. Pembekuan lebih dari sembilan puluh rekening yang sebagian besar milik mahasiswa asing di Inggris pada 2019 terdokumentasi [9], dan literatur memang menunjukkan manfaat data alternatif bagi peminjam berkas tipis [8]. Namun, paper "Invisible Primes" ditulis oleh Di Maggio, Ratnadiwakara, dan Carmichael dan memakai data sebuah platform fintech di Amerika Serikat, bukan mutasi bank lintas negara [8]; atribusi pada README CreditBridge keliru dan harus dikoreksi sebelum dikutip. Karena itu, tiga keputusan diambil.

Pertama, **skor kredit 300–850 diganti dengan paket bukti finansial**. Tidak ada kebenaran dasar untuk gagal bayar mahasiswa asing, dan tidak ada pihak yang wajib menerima skor itu. Paket bukti berisi fitur arus kas yang dihitung secara deterministik, penjelasan yang dapat dibaca, serta tingkat asal-usul setiap dokumen (diunggah pengguna, diambil lewat API bank tiruan, atau ditandatangani institusi). Posisi ini juga menghindari klaim sebagai biro kredit, yang kemungkinan diatur di Tiongkok (perlu diverifikasi). Model pembelajaran mesin hanya menjadi eksperimen opsional dengan batasan yang dinyatakan jujur.

Kedua, **"jaminan tanpa kurang bayar" diganti dengan "estimasi dengan cadangan"**, karena bank perantara berada di luar kendali sistem.

Ketiga, **penjaga AML dilebur ke Policy Plane AegisPath** sehingga mendapat tier izin, intent binding, dan bukti audit. Perlu ditekankan bahwa sistem tidak boleh membantu menyiasati batas kuota valas. Bila pengguna mendekati kuota tahunan, sistem memperingatkan, bukan memecah transfer.

### 1.3 Pelajaran dari Tiga Tangkapan Layar Rujukan

Tiga gambar yang Anda berikan [6] memperlihatkan bahasa visual yang akrab bagi sponsor dan juri. Gambar pertama adalah materi kampanye WeBank dengan ilustrasi datar tentang pekerja sehari-hari (programmer, pembuat kue, florist, kurir, penjual siaran langsung) dan satu angka utama: pinjaman pertama bagi satu dari lima pengguna Weilidai, dengan data per 31 Desember 2025. Gambar kedua adalah aplikasi investasi CCB Asia dengan kisi ikon aksi cepat dan daftar portofolio dalam bahasa Mandarin. Gambar ketiga adalah aplikasi pinjaman usaha WeBank dengan angka batas besar di bagian atas, login nomor ponsel dan kode verifikasi, satu tombol utama oranye, dan kisi layanan.

Dari sana ditarik lima pelajaran, tanpa meniru identitas visual siapa pun. Aplikasi keuangan Tiongkok berorientasi ponsel, sehingga demo harus tampil di bingkai ponsel. Satu angka besar dengan label sederhana dipahami cepat. Satu tombol utama per layar menurunkan kebingungan. Narasi inklusi keuangan lewat orang biasa beresonansi dengan sponsor; angka "satu dari lima" pada gambar pertama sebaiknya diverifikasi ke sumber resmi sebelum dikutip. Terakhir, pengguna di sana terbiasa dengan kepadatan ikon, sehingga baris aksi cepat (kirim, bayar kuliah, bagikan bukti, jeda) layak dipertahankan, tetapi dengan kepadatan lebih rendah. Logo, nama, dan komponen merek WeBank tidak boleh dipakai.

---

## 2. Persiapan

### 2.1 Administrasi dan Kepatuhan Lomba (Hari 0)

Sebelum menulis kode, selesaikan hal-hal yang dapat menggugurkan tim. Buka `international-topics-rules-en.docx` dan tautan "Details & Problem Description" untuk memastikan kontrak API sandbox Topik C, mekanisme evaluasi otomatis, dan syarat Topik F. Kirim email klarifikasi dengan draf pada Addendum Bagian 2 kepada kedua alamat penerima yang tercantum pada sumber berbeda [1][2]. Kirim formulir pendaftaran beserta halaman biodata paspor setiap anggota, karena halaman pengumuman menyebut langkah ini untuk konfirmasi alokasi slot [2]. Verifikasi kelayakan: setiap anggota harus mahasiswa penuh waktu di universitas yang berlokasi di luar Tiongkok Daratan, Hong Kong, Makau, dan Taiwan; tim 2–5 orang; minimal 60% non-Tiongkok; satu orang hanya satu tim [1][2]. Kelayakan ditentukan oleh lokasi universitas, bukan kewarganegaraan, jadi periksa ini untuk anggota yang kuliah di luar negeri.

Catatan tanggal: sumber berita menyebut masa rekrutmen sampai 1 November dan masa penilaian 2–10 November [3], dan halaman IEEE menyebut finalis diumumkan 10 November [4]; halaman pengumuman Chiang Mai dan README menyebut 20 dan 31 Oktober [1][2]. Perlakukan 20 Oktober sebagai batas mutlak sampai panitia menjawab.

### 2.2 Peta Penasihat Akademik dan Implikasinya

Daftar penasihat akademik yang Anda salin dari portal resmi [5] memuat delapan nama. Mereka berstatus penasihat, bukan terkonfirmasi sebagai juri penilai; susunan juri 2026 belum ditemukan. Pembacaan di bawah adalah inferensi dari jabatan yang tertulis, dipakai untuk menyiapkan materi, bukan untuk memprediksi individu. Koreksi: dokumen Addendum sebelumnya menulis afiliasi Chai Yunpeng dan satu nama lain berdasarkan cuplikan pencarian yang keliru; daftar pada [5] yang berlaku (Chai Yunpeng: Renmin University of China; Härdle: Humboldt-Universität zu Berlin).

| Penasihat | Jabatan (menurut [5]) | Sudut pandang yang mungkin | Yang perlu disiapkan | Risiko |
| :-- | :-- | :-- | :-- | :-- |
| Wang Shouyang | Peneliti terkemuka, Chinese Academy of Sciences; akademisi sains sistem dan sibernetika | Sudut pandang sistem dan manajemen risiko secara menyeluruh | Peta sistem utuh, asumsi, dan mode kegagalan | Klaim sistem tanpa batasan |
| Qiang Yang | Chief AI Adviser, WeBank; Fellow Royal Society of Canada | Privasi data, AI tepercaya; dikenal pada pembelajaran terfederasi | Privacy Gateway, Egress Ledger, uji canary, batasan privasi yang jujur | Privasi hanya berupa pernyataan |
| Li Wenrong | Wakil Rektor, City University of Hong Kong | Kepemimpinan akademik AI; kejelasan dampak dan kebaruan | Pernyataan kontribusi satu kalimat, perbandingan dengan karya serupa | Kebaruan tidak terartikulasi |
| Li Jianqiang | Dekan College of AI, Shenzhen University; direktur laboratorium sistem komputasi data besar | Rekayasa sistem dan skalabilitas | Arsitektur berlapis, uji beban sederhana, reproduksi satu perintah | Prototipe rapuh |
| Chai Yunpeng | Dekan School of Information, Renmin University of China | Sistem informasi dan tata kelola data | Data lineage, retensi, hak subjek data | Data governance tipis |
| Dacheng Xiu | Profesor ekonometrika, statistika, dan keuangan, Chicago Booth | Ketelitian statistik, validasi di luar sampel, kehati-hatian klaim keuangan | Selang kepercayaan, himpunan uji tersegel, tidak ada klaim prediksi kurs | Klaim angka tanpa metodologi |
| Wolfgang Härdle | Profesor statistika dan bisnis, Humboldt-Universität zu Berlin; direktur pusat riset aset digital | Metode statistik, risiko, realisme aset digital | Definisi metrik, batas atas risiko, bingkai testnet yang jujur | Klaim aset digital berlebihan |
| Joshua Bongard | Profesor ilmu komputer, University of Vermont; direktur laboratorium morfologi, evolusi, dan kognisi | Otonomi agen, adaptasi, ketahanan terhadap kondisi tak terduga | Skenario kegagalan, pemulihan otomatis, perilaku saat model gagal | Agen hanya diuji pada jalur normal |

Implikasinya ada tiga. Materi harus memuat metodologi yang tahan pertanyaan statistik, karena sedikitnya dua penasihat berlatar statistika dan ekonometrika. Privasi dan batasannya harus dapat dibuktikan, karena penasihat dari sponsor utama berlatar privasi. Dan kegagalan harus dipertunjukkan, bukan disembunyikan.

### 2.3 Persiapan Teknis

Siapkan repositori tunggal (monorepo) dengan folder `api/` (kernel dan adaptor), `app/` (PWA), `console/` (Proof Console), `eval/` (benchmark dan red-team), `data/` (dataset sintetis), dan `docs/`. Siapkan Docker Compose yang menjalankan seluruh sistem dengan satu perintah, karena itu yang akan dipakai juri, evaluator, dan hackathon 48 jam.

Aset yang harus disiapkan sekarang, sebelum ada gangguan akses: font dan ikon yang di-host sendiri (IBM Plex, Noto Sans SC, Phosphor Icons; lihat dokumen UI), bobot model lokal untuk fallback, salinan data pendukung (Remittance Prices Worldwide dan data uji publik yang lisensinya sudah diperiksa), dan dependensi yang sudah di-*vendor* atau di-*cache*. Siapkan akun layanan cloud yang diperlukan dan batas biaya. Putuskan penyedia model bahasa dan pastikan pilihan tanpa pelatihan atas data serta ketentuan retensinya diperiksa langsung dari ketentuan penyedia.

Putuskan lokasi hosting dengan memperhitungkan keterjangkauan dari Tiongkok. Domain dan wilayah tertentu pada platform hosting umum sering terganggu di sana (sebuah repositori peserta lain mencatat hal serupa untuk `vercel.app` dan Google Fonts) [11]. Pilihan seperti wilayah Hong Kong pada penyedia cloud perlu diverifikasi kelayakannya, termasuk kebutuhan pencatatan situs. Apa pun pilihannya, siapkan jalur cadangan: image Docker yang dapat dijalankan lokal, video demo, dan unduhan build statis.

### 2.4 Rancangan Aplikasi

Aplikasi memiliki empat tab: **Home** (percakapan dengan agen), **Pay**, **Prove**, dan **Protect**. Percakapan adalah layar utama; hasil tindakan agen tampil sebagai "slip" dengan stempel Terkirim atau Diblokir, sedangkan persetujuan Tier 2 tampil sebagai lembar bawah yang menjelaskan apa yang diminta, apa yang dipahami agen, dan apa yang berubah. Tanda login adalah autentikasi tiruan dengan passkey bila tersedia, dan nomor ponsel simulasi sebagai cadangan. Seluruh tampilan, token warna, tipografi, dan aturan gerak mengikuti `AEGISPATH_UI_REVISION_PROMPT.md`, dengan penyesuaian: persona kini mahasiswa dan pengirim uang, bukan treasuri institusi.

Lima layar pada ilustrasi di atas adalah: percakapan dengan slip terkirim; rencana uang kuliah yang menampilkan nominal besar, kurs, biaya, cadangan, dan jumlah yang dikirim; lembar persetujuan; paket bukti dengan tingkat asal-usul dan tautan berbagi berkedaluwarsa; serta pusat keamanan dengan jatah harian, daftar penerima, item serangan yang diblokir, dan tombol jeda.

*Proof Console* adalah tampilan desktop untuk juri dan auditor. Ia tidak dimaksudkan untuk pengguna akhir.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ AegisPath Proof Console                         Testnet, simulated  EN ID 中文    │
├──────────────────────────────┬───────────────────────────────────────────────────┤
│ Benchmark terbaru            │ Ablasi pertahanan                                 │
│ Tugas: 60  Berhasil: n/60    │ LLM saja | + Policy Plane | + Kontrak/Adaptor     │
│ Akurasi tool-call: x%        │ ASR per keluarga serangan dengan selang kepercayaan│
├──────────────────────────────┼───────────────────────────────────────────────────┤
│ Egress Ledger                │ Verifikasi rantai audit                           │
│ Panggilan ke model, hasil    │ [ Verifikasi sekarang ]  Hash terakhir, jumlah    │
│ detektor, tujuan, status     │ entri, status: valid / rusak                      │
├──────────────────────────────┴───────────────────────────────────────────────────┤
│ Putar ulang serangan: pilih kasus → lihat tiga lapis menolak satu per satu       │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Eksekusi

### 3.1 Arsitektur dan Prinsip Implementasi

Arsitektur mengikuti dua lapis: **Trust Kernel** yang dipakai semua topik (Privacy Gateway, Intent Parser, Planner DAG, Policy Plane, Audit, Evaluation Harness) dan **adaptor** ke dunia luar (sandbox bank resmi atau tiruan, dan opsional rantai blok) [10]. Aplikasi PWA dan Proof Console hanyalah klien dari API yang sama. Prinsip implementasi: kode menghitung angka dan menegakkan kebijakan, model bahasa memahami bahasa dan merencanakan; keluaran model selalu berupa JSON bertipe yang divalidasi sebelum menyentuh tool; persetujuan dirender dari muatan transaksi yang ditandatangani server, bukan dari teks buatan model.

### 3.2 Modul

**Pay.** Penghitung estimasi menerima nominal tagihan dan mata uang, lalu menghitung jumlah yang dikirim dari kurs, biaya transfer, dan cadangan biaya perantara. Hasilnya diberi catatan "estimasi, bukan jaminan". Perencana menyusun DAG: kuotasi, pemeriksaan penerima, pemeriksaan batas, simulasi, persetujuan bila perlu, eksekusi, verifikasi, dan notifikasi. Setiap simpul memiliki kunci idempotensi dan aksi kompensasi. Data biaya koridor dari Remittance Prices Worldwide dipakai sebagai pembanding, dengan pernyataan sumber dan tanggal data.

**Prove.** Pengguna menambahkan dokumen; sistem menghitung hash dan mencatat tingkat asal-usul: dinyatakan sendiri, diunggah, diambil lewat API bank tiruan dengan persetujuan, atau ditandatangani institusi (tanda tangan diverifikasi bila ada). Fitur arus kas dihitung deterministik (stabilitas saldo, keteraturan pemasukan, rasio cadangan) beserta penjelasan yang dapat dibaca. Pengguna dapat membuat tautan berbagi yang kedaluwarsa dan dapat dicabut, dengan ruang lingkup bidang yang eksplisit. Layar harus menyatakan bahwa ini adalah ringkasan bukti, bukan skor kredit, dan bahwa penerimaan oleh pihak lain tidak dijamin.

**Protect.** Policy Plane menegakkan empat tier: tindakan baca otomatis; kirim di bawah batas ke penerima di daftar secara otomatis; penerima baru atau jumlah besar dengan persetujuan passkey; dan perubahan kebijakan dengan penundaan waktu serta pendamping. Sentinel memeriksa penerima, pola transfer, kedekatan dengan kuota tahunan, dan pesan yang mengandung pola perekrutan rekening perantara: tawaran komisi, permintaan menerima dana pihak ketiga lalu meneruskannya, urgensi, dan penerima tak dikenal. Tindakan yang ditolak selalu disertai alasan dan langkah berikutnya, dan label risiko memakai bahasa "perlu diverifikasi", bukan tuduhan. Tombol "Jeda agen" mencabut seluruh *session key* seketika.

### 3.3 Kontrak API (Rancangan, Selaraskan dengan Kontrak Resmi)

Seluruh antarmuka bersifat API-first agar dapat diuji mesin. Nama titik akhir di bawah adalah rancangan kami; **selaraskan dengan kontrak resmi penyelenggara** begitu tersedia, dan simpan pemetaan antar keduanya di dokumen teknis.

| Titik akhir | Fungsi |
| :-- | :-- |
| `POST /v1/agent/messages` | Kirim pesan; mengembalikan intent, rencana, dan status |
| `GET /v1/plans/{id}`, `POST /v1/plans/{id}/approve`, `POST /v1/plans/{id}/cancel` | Tinjau, setujui (dengan bukti passkey), atau batalkan rencana |
| `POST /v1/tuition/quote` | Hitung estimasi uang kuliah beserta cadangan |
| `GET /v1/policy`, `PUT /v1/policy` (membuat usulan), `POST /v1/policy/proposals/{id}/approve` | Baca kebijakan; perubahan melalui usulan dengan penundaan |
| `POST /v1/agent/pause`, `POST /v1/agent/resume` | Jeda dan lanjutkan agen |
| `POST /v1/evidence-packs`, `GET /v1/evidence-packs/{id}`, `POST /v1/evidence-packs/{id}/grants`, `DELETE /v1/evidence-packs/{id}/grants/{gid}` | Paket bukti dan tautan berbagi |
| `GET /v1/audit`, `GET /v1/audit/verify`, `GET /v1/egress-ledger` | Log audit, verifikasi rantai hash, dan log keluar model |
| `GET /v1/eval/reports/latest` | Hasil benchmark terbaru untuk Proof Console |

Contoh muatan rencana (disederhanakan):

```json
{
  "plan_id": "pl_0192",
  "intent": { "type": "pay_tuition", "amount": 18000, "currency": "CNY", "payee_ref": "PAYEE_NEW_1" },
  "dag": [
    { "id": "n1", "op": "quote",        "deps": [] },
    { "id": "n2", "op": "check_payee",  "deps": ["n1"] },
    { "id": "n3", "op": "check_limits", "deps": ["n1"] },
    { "id": "n4", "op": "simulate",     "deps": ["n2","n3"] },
    { "id": "n5", "op": "await_step_up","deps": ["n4"], "reason": ["new_payee","above_cap"] },
    { "id": "n6", "op": "execute",      "deps": ["n5"], "idempotency_key": "k_7f2a", "compensate": "n6c" },
    { "id": "n7", "op": "verify",       "deps": ["n6"] }
  ],
  "intent_hash": "sha256:…",
  "status": "awaiting_step_up"
}
```

### 3.4 Adaptor

Adaptor B (sandbox bank resmi atau tiruan) adalah adaptor utama untuk Topik C. Antarmukanya tetap lima operasi: kuotasi, simulasi, eksekusi dengan kunci idempotensi, verifikasi, dan kompensasi. Adaptor A (rantai blok, misalnya Stellar testnet) hanya dibangun bila aturan resmi memberi nilai tambah atau bonus untuk Topik F; bonus 0–5 poin hanya disebut untuk Topik F [1][2]. Dengan antarmuka yang sama, peralihan topik tidak membuang kernel maupun antarmuka.

### 3.5 Dampak Aplikasi terhadap Setiap Aspek Penilaian

Aplikasi memengaruhi enam hal, dan masing-masing membawa kontrol tersendiri.

| Aspek | Kontribusi aplikasi | Risiko dari sisi klien | Kontrol |
| :-- | :-- | :-- | :-- |
| Task Completion (40%) | Menjalankan alur Pay/Prove/Protect dengan jejak yang dapat diuji; evaluator mesin tetap memakai API | Kontrak API tidak cocok dengan penyelenggara | Adaptor tipis, uji format keluaran, pemetaan kontrak di dokumen |
| Security & Compliance (30%) | Layar persetujuan, tier izin, kill switch, Egress Ledger, hak data | XSS, pembajakan sesi, *clickjacking* pada layar persetujuan, cache usang pada service worker | CSP ketat tanpa skrip inline, `frame-ancestors none`, kuki/token aman, persetujuan dirender dari muatan bertanda tangan server, service worker hanya meng-cache aset statis dan mode baca-saja, pembatasan laju |
| Innovation & Interaction (30%) | Dialog yang efisien, klarifikasi, pemulihan galat yang terlihat | Antarmuka mengalihkan dari inti keamanan | Satu momen unggulan: slip dan stempel; serangan diblokir sebagai demo utama |
| Penilaian buta oleh pakar | Dokumen dan video menjadi sumber utama; aplikasi pendukung bila tautan tersedia | Tautan mati saat dinilai | Tautan stabil, video cadangan, tangkapan layar di dokumen |
| Evaluasi otomatis | Tidak langsung | Kegagalan karena antarmuka berubah | API stabil, versi kontrak, tes kontrak di CI |
| Final 48 jam | Modifikasi cepat pada PWA dan API | Perubahan merusak keamanan | Tes regresi satu perintah, cabang rilis terkunci, kit offline |

### 3.6 Rencana Harian (10–20 Oktober)

| Hari | Tanggal | Hasil yang Harus Ada |
| :-- | :-- | :-- |
| 0 | Sab 10 Okt | Aturan resmi dibaca; email klarifikasi dan formulir pendaftaran terkirim; kelayakan tim diverifikasi; keputusan topik; monorepo, Docker Compose, dan token desain |
| 1 | Min 11 Okt | Kerangka API; Privacy Gateway v0; Policy Plane v0; adaptor tiruan; cangkang PWA dengan i18n dan font lokal |
| 2 | Sen 12 Okt | Modul Pay (kuotasi dan DAG); loop agen; lembar persetujuan dengan passkey atau cadangan |
| 3 | Sel 13 Okt | Modul Protect: batas, daftar penerima, kill switch, Sentinel perekrutan rekening perantara; rantai audit |
| 4 | Rab 14 Okt | Modul Prove: paket bukti, tingkat asal-usul, tautan berbagi; Proof Console v0 |
| 5 | Kam 15 Okt | Dataset dikunci (himpunan uji tersegel); benchmark pertama; uji canary privasi; pemolesan antarmuka |
| 6 | Jum 16 Okt | Perbaikan; putaran red-team adaptif oleh orang di luar pengembang; latihan kegagalan jaringan dan model |
| 7 | Sab 17 Okt | Dokumen teknis, asesmen keamanan mandiri, bukti eksekusi, deck |
| 8 | Min 18 Okt | Pembekuan kode tengah hari; rekaman video (utama dan cadangan); kit offline |
| 9 | Sen 19 Okt | Pengecekan mutu seluruh berkas; formulir tim; uji kirim |
| 10 | Sel 20 Okt | Penyangga; kirim paling lambat 18.00 WIB ke kedua saluran; simpan bukti kirim |

Jika terlambat, pangkas dari bawah: model skor opsional, tautan berbagi lanjutan, mode gelap, jangkar rantai blok. Jangan pangkas benchmark keamanan, intent binding, uji canary privasi, dan bukti eksekusi.

### 3.7 Pengujian dan Bukti

Benchmark tugas (sekitar 60 skenario), himpunan serangan (dua belas keluarga ditambah pola perekrutan rekening perantara dan injeksi multibahasa), himpunan jinak berpasangan, dan uji canary privasi mengikuti rancangan pada Addendum Bagian 5 dan 6, termasuk pembagian berbasis keluarga, himpunan uji tersegel, selang kepercayaan, dan putaran adaptif. Laporkan angka apa adanya. Pengamatan nol kegagalan dari N percobaan tidak menyatakan risiko nol; sebutkan batas atasnya. Kumpulkan log eksekusi untuk berkas bukti eksekusi dan simpan laporan benchmark sebagai satu sumber kebenaran angka untuk dokumen, deck, dan video.

---

## 4. Troubleshooting

Susun penanganan gangguan sebagai tangga pemulihan: **L0** (sistem hidup, terhubung penuh), **L1** (model lokal dan adaptor tiruan lokal), **L2** (video rekaman dan tangkapan layar). Putuskan sebelum final pada tingkat mana setiap gangguan jatuh.

| Gejala | Penyebab yang mungkin | Tindakan cepat | Pencegahan |
| :-- | :-- | :-- | :-- |
| Passkey gagal didaftarkan | Bukan konteks aman (bukan HTTPS), domain tidak cocok dengan pengenal pihak yang mengandalkan (RP ID), perangkat tanpa dukungan | Gunakan cadangan nomor ponsel simulasi dengan batas lebih rendah; periksa domain | Uji di perangkat nyata sejak hari 2; dokumentasikan RP ID |
| Tampilan lama setelah perubahan | Service worker menyajikan cache usang | Perbarui versi cache dan paksa muat ulang; matikan service worker saat debugging | Strategi cache hanya untuk aset statis, penomoran versi |
| Perilaku berbeda di iOS dan Android | Perbedaan dukungan PWA, penyimpanan, dan notifikasi antar peramban | Uji pada kedua platform; hindari ketergantungan pada notifikasi push untuk alur inti | Daftar uji perangkat |
| Font Mandarin tidak muncul atau lambat | Subset font tidak termuat; fallback salah | Pakai fallback sistem (`PingFang SC`, `Microsoft YaHei`) | Subset font di-host sendiri; uji dengan jaringan lambat |
| Layanan tak terjangkau dari Tiongkok | Domain atau CDN terganggu | Jalankan L1 lokal; tunjukkan video | Hosting yang dipilih cermat, tanpa CDN eksternal, kit offline |
| Model bahasa lambat atau tak tersedia | Gangguan jaringan atau batas laju | Beralih ke model lokal; tampilkan banner mode terbatas (baca saja dan jeda tetap berfungsi) | Cache rencana skenario demo, batas token, uji fallback |
| Keluaran model tidak valid | Format JSON rusak, argumen halusinasi | Retry terbatas; tolak dan minta klarifikasi | Skema ketat, daftar putih tool, suhu rendah |
| Detektor PII melewatkan data | Pola baru atau bahasa campuran | Perluas aturan; blokir panggilan keluar saat ragu (gagal-tertutup) | Uji canary multibahasa; pembaruan aturan dari kegagalan nyata |
| Positif palsu tinggi | Ambang terlalu ketat | Kalibrasi ulang pada himpunan dev; sediakan jalur konfirmasi | Metrik FPR di CI; pasangan jinak pada dataset |
| Evaluator otomatis menolak keluaran | Format atau waktu respons tidak sesuai kontrak | Bandingkan dengan kontrak; naikkan batas waktu; log permintaan/respons | Tes kontrak di CI; dokumentasi pemetaan |
| Docker tidak berjalan di mesin lain | Versi dependensi, port, variabel lingkungan | Satu skrip pemeriksaan lingkungan; versi dikunci | `docker compose up` diuji pada mesin bersih |
| Pemisahan data bocor ke log | Log mencetak payload mentah | Hentikan, rotasi rahasia bila perlu, bersihkan | Log hanya berisi ID, hash, dan token; pemindaian log di CI |
| Ukuran video atau berkas melebihi batas | Resolusi atau bitrate tinggi | Kompres ulang; unggah tautan bila diizinkan | Cek batas ukuran di aturan resmi sebelum merekam |
| Konflik perubahan saat 48 jam | Banyak anggota mengubah kode inti | Satu pemilik modul; cabang rilis terkunci | Konvensi cabang, tes regresi sebelum gabung |
| Tenggat terlewat karena zona waktu | Salah mengonversi 23.59 UTC+8 | Ingat: 22.59 WIB; kirim lebih awal | Tenggat internal 18.00 WIB |

---

## 5. Setelah Pengiriman (After All)

### 5.1 Hari Pengiriman dan Masa Penilaian

Pada 20 Oktober, kirim ke kedua saluran, simpan bukti kirim, dan pastikan tautan demo hidup. Pada masa penilaian daring (20–31 Oktober menurut [2]; sumber lain menyebut 2–10 November [3][4]), pertahankan layanan tetap berjalan dengan batas biaya dan batas laju, pantau ketersediaan, dan **bekukan kode**: hanya perbaikan darurat yang diberi tag rilis dan dicatat. Jawab permintaan panitia dalam hitungan jam. Jangan mengubah angka pada dokumen yang sudah dikirim tanpa menyampaikannya kepada panitia.

### 5.2 Jika Menjadi Finalis

Urus visa dan perjalanan segera setelah pengumuman, karena check-in dijadwalkan 20 November dan surat undangan baru terbit setelah finalis diumumkan [2]. Siapkan kit offline berisi model lokal, salinan dependensi, build statis, data uji, dan video cadangan. Karena final memuat hackathon optimasi 48 jam [3], latih simulasi perubahan kebutuhan: satu anggota memegang kernel dan keamanan, satu memegang aplikasi dan demo, satu memegang dokumentasi dan pertanyaan juri, dan semua memiliki satu perintah untuk menjalankan regresi. Latih sidang dengan ulasan berbasis peran (Bagian 6) beberapa kali, dan siapkan jawaban jujur atas pertanyaan tentang batasan, bug kontrak, privasi, kepatuhan, dan skalabilitas. Konfirmasi dengan panitia akses jaringan di lokasi dan kebolehan membawa perangkat serta bobot model sendiri.

### 5.3 Sesudah Lomba

Terlepas dari hasil, siapkan paket yang dapat dipakai ulang. Untuk jalur wawancara cepat, siapkan ringkasan kontribusi, tautan repositori yang bersih, dan penjelasan keputusan teknis. Sebelum membuka kode, periksa ketentuan kekayaan intelektual pada aturan resmi, sapu rahasia dan data dari riwayat repositori, tambahkan lisensi, `SECURITY.md`, dan kartu dataset. Susun refleksi: apa yang diukur, apa yang gagal, dan apa yang dipelajari. Peta jalan pasca-lomba yang realistis mencakup pilot dengan penyedia KYC berlisensi, integrasi API bank yang sebenarnya, pengujian kegunaan dengan mahasiswa sungguhan, dan, bila relevan, penelaahan regulasi di yurisdiksi sasaran. Jika tidak lolos ke final, karya tetap berguna untuk portofolio dan hackathon lain, dengan data dan klaim yang sudah bersih.

---

## 6. Ulasan Berbasis Peran dengan AI

Gunakan prompt di bawah untuk meminta AI memerankan setiap penasihat dan memberi kritik. Peran adalah simulasi dari jabatan yang tercantum [5], bukan prediksi perilaku orang sebenarnya, dan nama mereka tidak boleh muncul di materi lomba. Jalankan setiap peran pada versi terbaru dokumen teknis, deck, dan skrip video, di percakapan terpisah agar jawabannya tidak saling memengaruhi.

### 6.1 Prompt Induk

```
You are {ROLE_NAME}, {ROLE_DESCRIPTION}. You are reviewing a student submission to
the FinTechathon 2026 International Track (Topic C, "AI as a Financial Participant").
The scoring rubric is: Task Completion 40, Security & Compliance 30, Innovation &
Interaction 30 (plus a 0-5 bonus only for Topic F).

Materials (pasted below): technical document, slide outline, demo script, benchmark report.

Rules:
1. Be specific. Quote the exact sentence or section you are reacting to.
2. No flattery. If something is strong, say why in one sentence and move on.
3. List at most five concerns, ranked by severity. For each: why it matters from your
   perspective, the evidence in the materials, and the smallest fix.
4. Flag every claim that is not supported by a measurement, a citation, or a shown
   mechanism. Do not assume anything the materials do not show; write "not shown".
5. Write the three hardest questions you would ask in a five-minute Q&A.
6. Score each dimension out of its maximum with a one-line justification and a
   confidence level, then state what evidence would raise each score.
7. Do not invent facts about the team or the system.

Your lens: {ROLE_LENS}
Typical questions you ask: {ROLE_QUESTIONS}
What you penalize: {ROLE_PENALTIES}
```

### 6.2 Blok Peran

Isi `{ROLE_NAME}`, `{ROLE_DESCRIPTION}`, `{ROLE_LENS}`, `{ROLE_QUESTIONS}`, dan `{ROLE_PENALTIES}` dengan salah satu blok berikut. Deskripsi hanya mengulang jabatan pada [5]; sudut pandang adalah inferensi.

```
[Wang Shouyang]
DESCRIPTION: Distinguished researcher at the Chinese Academy of Sciences, academician of
  the World Academy of Sciences and the International Academy for Systems and Cybernetic Sciences.
LENS: whole-system risk, feedback effects, failure modes, societal impact.
QUESTIONS: What are the system-level failure modes? What happens when two defenses fail
  together? Who bears the loss?
PENALTIES: unbounded claims, missing assumptions, no failure analysis.

[Qiang Yang]
DESCRIPTION: Chief AI Adviser at WeBank, Fellow of the Royal Society of Canada.
LENS: privacy-preserving and trustworthy AI, data minimization, what actually leaves
  the trust boundary.
QUESTIONS: What exact data reaches the cloud model? How do you prove it? What does the
  design not protect?
PENALTIES: privacy stated as policy rather than shown, no leakage tests, hidden limitations.

[Li Wenrong]
DESCRIPTION: Vice-President of City University of Hong Kong, Fellow of the National
  Academy of Artificial Intelligence.
LENS: clarity of contribution, novelty against prior work, communication to a broad audience.
QUESTIONS: What is new here in one sentence? How is it different from existing agent-wallet
  or remittance tools?
PENALTIES: vague novelty, buzzwords, no comparison.

[Li Jianqiang]
DESCRIPTION: Dean of the College of AI at Shenzhen University, executive director of a
  national engineering laboratory for big-data system computing.
LENS: systems engineering, reproducibility, scalability, operational robustness.
QUESTIONS: Can I run it with one command? What breaks at ten times the load? Where is
  state kept and how is it recovered?
PENALTIES: fragile prototype, unreproducible results, no tests.

[Chai Yunpeng]
DESCRIPTION: Dean of the School of Information at Renmin University of China.
LENS: information systems, data governance, lineage, retention, data subject rights.
QUESTIONS: Where does each data class live? How long? How is erasure done? How are
  audit logs protected?
PENALTIES: unclear data lifecycle, no retention rules, logs that leak.

[Dacheng Xiu]
DESCRIPTION: Professor of econometrics, statistics and finance at Chicago Booth.
LENS: statistical rigor, out-of-sample validation, honest uncertainty, financial claims.
QUESTIONS: How large is the test set and how was it kept clean? What are the confidence
  intervals? Is any number a prediction you cannot support?
PENALTIES: point estimates without intervals, leakage between train and test, claims
  about FX timing or credit quality without evidence.

[Wolfgang Karl Härdle]
DESCRIPTION: Professor of statistics and business at Humboldt University of Berlin,
  director of a data research centre and a digital assets research institute.
LENS: statistical methods, risk measurement, realism about digital assets.
QUESTIONS: How are risk metrics defined? What is the tail behavior? Is the on-chain
  component necessary, or decoration?
PENALTIES: loosely defined metrics, overstated digital-asset claims, no risk bounds.

[Joshua Bongard]
DESCRIPTION: Professor of computer science at the University of Vermont, director of a
  laboratory on morphology, evolution and cognition.
LENS: autonomy, adaptation, resilience when the agent is surprised or wrong.
QUESTIONS: What does the agent do when its model of the world is wrong? How does it
  recover from partial failure? Was it tested outside the happy path?
PENALTIES: only normal-path demos, brittle plans, no recovery behavior.
```

### 6.3 Prompt Ketua Panel

```
You are the panel chair. Below are five reviews of the same submission. Merge them:
1. List contradictions between reviewers and decide which view the evidence supports.
2. Produce a ranked fix list (maximum ten items) with effort in hours and the expected
   effect on each rubric dimension.
3. Identify claims that three or more reviewers flagged as unsupported.
4. Propose the single most convincing demo moment and the single biggest risk.
Be blunt. Do not flatter. Do not add facts that are not in the reviews or the materials.
```

### 6.4 Prompt Tanya-Jawab Keras

```
Act as a hostile but fair examiner for a ten-minute defence. Ask one question at a time,
wait for my answer, then either follow up on a weakness in the answer or move on. After
eight questions, give me: the three weakest answers, what a stronger answer would have
contained, and any claim I made that I cannot support.
Start with: "{ROLE_NAME}, your first question:".
```

---

## 7. Pengecekan Mutu Revisi

Lakukan pengecekan ini setiap kali dokumen, deck, atau video direvisi.

- Seluruh angka identik pada dokumen teknis, deck, video, dan Proof Console, dan semuanya berasal dari laporan benchmark terakhir.
- Setiap klaim memiliki sitasi dalam teks atau hasil ukur, dan daftar pustaka lengkap; rujukan akademik diperiksa satu per satu terhadap sumber aslinya (penulis, jurnal, DOI).
- Tidak ada merek sponsor, klaim integrasi yang tidak dibangun, atau klaim kepatuhan hukum yang tidak dapat dibuktikan.
- Semua data bersifat sintetis dan berlabel, serta ada tulisan "Testnet, dana simulasi" di aplikasi, video, dan dokumen.
- Pesan dan terjemahan Indonesia dan Mandarin ditinjau penutur asli.
- Format berkas, durasi, rasio, dan resolusi video sesuai aturan; bahasa Inggris telah disunting.
- Seluruh rahasia, kunci, dan token tidak ada di repositori maupun dokumen; riwayat repositori telah disapu.
- Perubahan terakhir diuji ulang dengan satu perintah regresi dan satu kali jalan penuh `docker compose up` pada mesin bersih.

---

## Daftar Pustaka

[1] README_FINTECHATHON_2026.md (berkas unggahan pengguna), 2026.
[2] Chiang Mai University, International Relations Administration Center. "Upcoming Event | 2026 Shenzhen International FinTech Competition (FinTechathon) – International Track", 7 Oktober 2026. https://ird.oou.cmu.ac.th/2026-shenzhen-international-fintech-competition/
[3] Beijing News (melalui Tencent News). "2026第八届深圳国际金融科技大赛正式启动", 2 September 2026. https://news.qq.com/rain/a/20260902A05KG800
[4] IEEE CIS Shenzhen Chapter. "2026 Shenzhen International FinTech Competition – International Track", 17 Juni 2026 (jadwal sementara). https://r10.ieee.org/shenzhen-cis/blog/2026/06/17/2026-shenzhen-international-fintech-competition-international-track/
[5] Daftar "Invited Academic Advisers" yang disalin pengguna dari portal resmi lomba. Verifikasi langsung di portal sebelum dikutip.
[6] Tiga tangkapan layar yang diberikan pengguna (kampanye Weilidai WeBank dengan data per 31 Desember 2025; aplikasi investasi CCB Asia; aplikasi pinjaman usaha WeBank). Sumber aslinya belum diverifikasi.
[7] README_CreditBridge_AI.md (berkas unggahan pengguna), 2026. Sitasi akademik di dalamnya perlu diperiksa ulang.
[8] Di Maggio, M., Ratnadiwakara, D., dan Carmichael, D. "Invisible Primes: Fintech Lending with Alternative Data". *Management Science*. https://doi.org/10.1287/mnsc.2024.07854 (versi kerja NBER w29840).
[9] Royal United Services Institute. "Whack-a-Mule: Have the Police Mastered the Game?", 19 Maret 2019. https://www.rusi.org/networks/shoc/informer/whack-mule-have-police-mastered-game
[10] FINTECHATHON_2026_WINNING_STRATEGY.md; FINTECHATHON_2026_ADDENDUM_PRIVASI_DATASET_ALUR.md; AEGISPATH_UI_REVISION_PROMPT.md (dokumen internal tim).
[11] Repositori publik peserta lain (Topik E), digunakan hanya sebagai indikator lanskap dan catatan keterjangkauan dari Tiongkok. https://github.com/tanhongsheng050204-code/2026-SHENZHEN-FINTECHATHON-INTERNATIONAL-TRACK
[12] *Perlu dilengkapi sebelum dikutip pada dokumen final:* spesifikasi W3C Web Authentication; panduan OWASP untuk keamanan aplikasi web dan seluler; OWASP Top 10 for LLM Applications dan untuk aplikasi agen; sumber resmi kuota valas perorangan Tiongkok (SAFE) dan ketentuan layanan pelaporan kredit.
