# Analisis juri kritis dan ranking ide FinTechathon 2026

Tanggal evaluasi: **10 Oktober 2026**. Bahasa: Indonesia. Basis: dokumen lokal yang diminta, ekstraksi isi DOCX/PPTX/XLSX dalam `referensi_lomba`, pemeriksaan sumber publik, dan perhitungan ulang contoh matematis.

## 1. Keputusan utama

**Ranking proposal sebagaimana tertulis: (1) AegisPath, (2) CreditBridge AI v2, (3) NexusCFO AI.** AegisPath unggul karena lebih konsisten membatasi klaim, memiliki rencana implementasi dan evaluasi yang masuk akal, serta mengakui ketidakpastian. CreditBridge v2 memperinci ide yang hampir sama, tetapi menambahkan klaim absolut, salah sitasi, dan kesalahan metodologi. NexusCFO memiliki masalah bisnis yang bernilai, tetapi contoh finansial, identitas dataset, asumsi pendanaan, dan klaim keamanannya belum cukup dapat dipercaya.

| Ranking | Proposal yang benar-benar tersedia | Topik | Task /40 | Security /30 | Innovation /30 | Total /100 | Rentang penilaian subjektif |
| --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| 1 | AegisPath — versi application blueprint | C | 28 | 25 | 21 | **74** | 68–80 |
| 2 | CreditBridge AI v2 | C | 27 | 20 | 19 | **66** | 60–74 |
| 3 | NexusCFO AI | E | 20 | 16 | 16 | **52** | 44–64 |

**Ini skor kualitas rancangan dan kelayakan pembuktian, bukan skor resmi lomba, hasil pengujian sistem, probabilitas menang, atau confidence interval statistik.** Bonus on-chain tidak dihitung. Semua angka performa dalam proposal yang belum memiliki log diperlakukan sebagai rencana, bukan hasil.

Jika memilih proyek untuk dikerjakan sebelum 20 Oktober, pilih **satu proyek Topik C berbasis AegisPath**, memakai spesifikasi operasional CreditBridge yang sudah dikoreksi. Jangan mengembangkan keduanya sebagai dua produk terpisah. NexusCFO layak naik peringkat bila tim sudah mempunyai data piutang yang relevan, akses pemilik usaha, dan simulator pembiayaan yang realistis; bukti itu belum tersedia di folder ini.

### Kesalahan perbandingan yang mengubah ranking

CreditBridge v2 menggambarkan AegisPath sebagai Topik F dengan enam subsistem blockchain/Soroban. Namun, `AEGISPATH_APP_BLUEPRINT.md` §0.2 dan §1.1 secara eksplisit memilih **Topik C**, dengan **Pay–Prove–Protect**, sandbox bank utama, dan blockchain opsional. Penilaian harus memakai versi file yang diberikan, bukan versi AegisPath lama yang tidak tersedia. Dengan demikian, ini sebenarnya **dua varian satu ide mahasiswa dan satu ide UMKM**, bukan tiga ide yang independen.

## 2. Metode, cakupan, dan batas bukti

### Bahan lokal yang diperiksa

| Bahan | Peran dalam evaluasi |
| --- | --- |
| [README_FINTECHATHON_2026.md](README_FINTECHATHON_2026.md) | Ringkasan lomba; diperiksa terhadap aturan dan pengumuman publik |
| [PEMENANG_TAHUN_SEBELUMNYA.md](PEMENANG_TAHUN_SEBELUMNYA.md) | Hipotesis pola pemenang; klaim kemenangan dipisahkan dari interpretasi penyebab kemenangan |
| [AEGISPATH_APP_BLUEPRINT.md](AEGISPATH_APP_BLUEPRINT.md) | Proposal AegisPath yang dinilai |
| [README_CreditBridge_AI_v2.md](README_CreditBridge_AI_v2.md) | Proposal CreditBridge v2 yang dinilai |
| [README_NexusCFO_AI.md](README_NexusCFO_AI.md) | Proposal NexusCFO yang dinilai |
| [international-topics-rules-en.docx](referensi_lomba/international-topics-rules-en.docx) | Acuan utama rubrik dan tema dari salinan lokal |
| [international-technical-document-en.docx](referensi_lomba/international-technical-document-en.docx) | Struktur wajib deskripsi teknis |
| [international-security-self-assessment-en.docx](referensi_lomba/international-security-self-assessment-en.docx) | Model izin, pengujian keamanan, privasi, risiko yang diketahui |
| [international-execution-evidence-en.docx](referensi_lomba/international-execution-evidence-en.docx) | Log, hash transaksi, dan langkah reproduksi |
| [demo-video-guide-en.docx](referensi_lomba/demo-video-guide-en.docx) | Panduan video; ada konflik dengan aturan topik |
| [presentation-template.pptx](referensi_lomba/presentation-template.pptx) | Template presentasi, masih berisi placeholder Mandarin; tidak memuat rubrik tambahan |
| [source-code-readme-template-en.md](referensi_lomba/source-code-readme-template-en.md) | Ekspektasi setup, pengujian, deployment, dan batasan |
| [team-information-form.xlsx](referensi_lomba/team-information-form.xlsx) | Formulir administratif; bukan bukti sistem fungsional atau kriteria penilaian tambahan |

Tidak ditemukan kode implementasi ketiga proyek, dataset buatan tim, laporan benchmark terisi, video demo, atau log eksekusi proyek di folder yang diberikan. Template kosong **bukan** laporan hasil. Referensi internal AegisPath seperti addendum privasi, winning strategy, UI revision prompt, dan storyboard SVG juga tidak tersedia; kontribusinya tidak diasumsikan telah terbukti.

Label audit yang digunakan:

- **Terverifikasi:** sumber primer atau isi berkas mendukung pernyataan dalam lingkup yang jelas.
- **Sebagian benar:** inti didukung, tetapi cakupan, tahun, identitas, atau kesimpulannya berlebihan.
- **Salah/kontradiktif:** bertentangan dengan sumber atau perhitungan yang dapat diperiksa.
- **Belum terverifikasi:** bukti spesifik tidak ditemukan dalam pemeriksaan ini; tidak berarti pasti palsu.
- **Target/simulasi:** boleh dipakai bila dilabeli demikian; tidak boleh disajikan sebagai dampak empiris.

Prioritas audit adalah klaim yang memengaruhi keputusan topik, skor, keamanan transaksi, legalitas, validitas model, atau kredibilitas ilmiah. Halaman yang gagal diakses tidak otomatis dinyatakan tidak ada. Portal lomba berbasis JavaScript tidak memberikan isi lengkap melalui pembaca web; tidak dilakukan pembandingan checksum salinan DOCX dengan unduhan panitia. Status “resmi” salinan lokal karena itu digunakan sebagai **acuan kerja**, bukan sertifikasi keaslian berkas.

## 3. Konteks dan aturan lomba yang dapat dipertahankan

Tema “AI as a Financial Participant”, enam pilihan topik, eligibility universitas di luar Mainland China/Hong Kong/Macao/Taiwan, tim 2–5 mahasiswa penuh waktu, dan minimal 60% non-Chinese didukung pengumuman [IEEE CIS Singapore](https://www.ieee-cis-singapore.org/2026-fintechathon). Sumber itu juga menyebut International Track pertama kali pada 2026. **HKUST Guangzhou berlokasi di Mainland China**; kemenangan kampus itu pada jalur lama tidak membuktikan eligibility International Track 2026.

Tenggat 20 Oktober 2026 pukul 23:59 UTC+8 didukung [pengumuman Chiang Mai University, 7 Oktober 2026](https://ird.oou.cmu.ac.th/2026-shenzhen-international-fintech-competition/). Konversinya **22:59 WIB / 15:59 UTC**. DOCX lokal menulis 16:00 UTC sebagai ekuivalen; ada ketidaktepatan satu menit. Gunakan waktu Beijing yang disebut secara eksplisit.

### Rubrik: mana resmi, mana operasionalisasi reviewer

Aturan topik lokal §3 menetapkan **Task completion 40%, Security & compliance 30%, Innovation & interaction 30%**, dengan challenge bonus on-chain 0–5. Aturan tersebut tidak memberi subbobot terperinci.

| Dimensi | Yang memang ada pada aturan/template | Cara reviewer menilai proposal ini |
| --- | --- | --- |
| Task completion, 40 | Agen menyelesaikan tugas finansial; template meminta intent, planning, tool use, state management dan pengujian | Ketepatan hasil finansial, alur eksekusi, konsistensi state, recovery, kejelasan bukti dan kelayakan implementasi |
| Security & compliance, 30 | Permission tiering, konfirmasi aksi sensitif, prompt injection, privilege escalation, privacy; template juga menanyakan social engineering dan recovery | Boundary otorisasi yang benar, perlindungan data, realisme compliance, threat model, dan desain uji yang jujur |
| Innovation & interaction, 30 | Nama dimensi resmi, plus penjelasan core value/innovation dalam template teknis | Kontribusi terhadap solusi yang sudah ada, manfaat terukur, dialog, klarifikasi, dan pengalaman menghadapi kegagalan |

**DAG khusus, multi-agent, MCP, blockchain, angka benchmark tertentu, passkey, atau jumlah keluarga serangan bukan syarat wajib eksplisit dalam guidebook lokal.** Itu pilihan desain. Tidak ada dasar menganggap banyak lapisan otomatis menghasilkan skor lebih tinggi. Pernyataan README bahwa “fatal security failure” pasti mendapat potongan tertentu tidak disertai rumus penalti pada salinan aturan yang diperiksa. Reviewer tentu dapat menilai kegagalan itu berat, tetapi tidak boleh mengarang penalti resmi.

### Konflik dan asumsi aturan

| Pernyataan dokumen | Temuan | Implikasi praktis |
| --- | --- | --- |
| Bonus berlaku pasti bagi semua topik yang menambahkan on-chain | §2 mengaitkan bonus dengan F, §3 menyebut bonus eksplorasi on-chain secara umum. [CMU](https://ird.oou.cmu.ac.th/2026-shenzhen-international-fintech-competition/) juga mengaitkan bonus dengan F | **Ambigu**, bukan terbukti khusus F saja ataupun tersedia pasti bagi C/E. Skor dasar semua ide tidak diberi bonus; konfirmasi tertulis sebelum menjadikannya strategi |
| Video wajib tanpa keraguan | Aturan topik §5 menyebut video optional; panduan video menyebut required; execution evidence meminta logs dan demo video | Sertakan video ≤5 menit sebagai keputusan mitigasi administrasi. Jangan menulis konflik ini sudah terselesaikan |
| Source code opsional | Daftar dalam aturan topik memasukkannya tanpa label optional, sedangkan ringkasan README menyebut opsional | Siapkan kode dan README reproduksi. Status formal perlu mengikuti instruksi panitia terbaru |
| Security self-assessment/evidence optional | Template keduanya menyebut optional, tetapi tercantum pada checklist aturan | Tetap sertakan; penting untuk membuktikan 70% dimensi pertama |
| Finalis seluruh anggota otomatis dibiayai | Aturan membatasi ke anggota yang **diundang**, sesuai invitation | Jangan menjanjikan pembiayaan setiap anggota sebelum undangan |
| Seleksi 22–23 Oktober, tepat 10 finalis, final tepat 22 November | Salinan aturan hanya menetapkan akhir Oktober, finalis by 31 Oktober, final 21–23 November. IEEE memiliki detail seleksi lain | Jangan memperlakukan detail ringkasan ini sebagai kepastian |
| Evaluator mesin, penilaian buta, API resmi khusus C, final hackathon 48 jam | Tidak tercantum dalam guidebook lokal yang diperiksa | Boleh persiapan teknis, belum menjadi kewajiban resmi International Track; aturan jalur domestik tidak otomatis berlaku |
| Sandbox lokal sah 100% | Aturan menerima simulated-account/sandbox logs untuk non-on-chain | Arah desain masuk akal. Penerimaan tetap bergantung kelengkapan submission dan instruksi panitia; jangan membuat jaminan absolut |
| Tsinghua PBCSF terlibat sebagai host | Didukung pengumuman CMU; portal lomba umum menonjolkan SZU/WeBank | Dukungan terhadap keterlibatan Tsinghua ada, tetapi jangan menganggap seluruh struktur panitia/juri sama untuk semua jalur |
| Kirim hanya ke email pada README | CMU memberi `wangyr@pbcsf.tsinghua.edu.cn` untuk registrasi dan submission; README memberi kontak lain | Ada variasi kanal. Verifikasi rute International Track yang berlaku; laporan ini tidak mengirim email atau data paspor |

## 4. Audit klaim faktual dan ilmiah

### 4.1 AegisPath dan CreditBridge: masalah mahasiswa

| Klaim | Verdict | Bukti dan koreksi | Dampak penilaian |
| --- | --- | --- | --- |
| Lebih dari 6 juta mahasiswa studi di luar negeri | **Terverifikasi dalam arti populasi**, bukan 6 juta keberangkatan baru tiap tahun | [UNESCO](https://www.unesco.org/en/higher-education/global-convention) menyebut 7,3 juta studying abroad. Cantumkan tahun/definisi; stock berbeda dari annual flow | Masalah potensial besar, tetapi tidak membuktikan ukuran pasar yang terjangkau tim |
| Mayoritas mahasiswa asing mapan/beasiswa dan solvent | **Belum terverifikasi** | Tidak ada survei representatif pada proposal. Kepemilikan saldo atau surat beasiswa tidak otomatis berarti daya bayar berkelanjutan | Segmentasikan target; jangan mengasumsikan seluruh populasi berisiko rendah |
| Tidak ada mekanisme pertukaran riwayat kredit lintas negara | **Salah bila absolut** | [Nova Credit Credit Passport](https://www.novacredit.com/credit-passport) dan [dokumentasi API](https://docs.novacredit.com/credit-passport-quickstart) menyediakan akses consumer-permissioned ke laporan biro luar negeri | Ganti menjadi akses terbatas menurut negara/provider. Kebaruan bukan menemukan pertukaran kredit untuk pertama kali |
| Mahasiswa dipaksa membayar deposit sewa 6–12 bulan | **Generalisasi bermasalah** | Deposit berbeda dari rent in advance; yurisdiksi berbeda. Untuk **England**, [GOV.UK](https://www.gov.uk/guidance/fees-you-can-charge-as-part-of-a-tenancy) membatasi rent in advance yang diminta menjadi satu bulan untuk tenancy yang tercakup perubahan mulai 1 Mei 2026; deposit umumnya 5/6 minggu berdasarkan annual rent | Berita lama Inggris tidak cukup membenarkan solusi deposit 6–12 bulan pada Oktober 2026. Sebut negara, jenis kontrak, tanggal, dan pengecualian |
| Evidence Pack membuat deposit turun menjadi 1–2 bulan | **Target tanpa bukti adopsi** | Tidak ada landlord/bank yang sudah menerima pack, studi before/after, atau komitmen mitra | Nilai Prove saat ini adalah transparansi bukti; penghematan deposit belum boleh dinilai sebagai dampak tercapai |
| >70% mahasiswa mengalami masalah dalam 90 hari; Wise 1 dari 5 short-payment; Flywire 84% menuntut exact amount | **Belum terverifikasi sebagaimana dikutip** | Tidak ada judul survei, sampel, instrumen, dan URL spesifik yang cocok. [Flywire India](https://www.flywire.com/resources/perspectives-on-higher-education-payments-from-students-in-india) memiliki angka 84% untuk kebutuhan bantuan membiayai pendidikan, bukan klaim exact amount | Hapus persentase sampai sumber yang benar tersedia. Angka sama dengan konteks berbeda tidak dapat dipertukarkan |
| Transfer SWIFT selalu lewat 2–3 perantara, $25–50/hop, markup 1–5%, kurang $30–100 | **Sebagian masuk akal, angka universal belum terbukti** | [BIS/CPMI d193](https://www.bis.org/cpmi/publ/d193.htm) mendukung adanya friksi lintas batas, bukan tarif tetap setiap koridor | Butuh fee schedule, quote bertanggal, opsi charge bearer, bank dan koridor spesifik |
| Risiko money mule/pembekuan rekening mahasiswa adalah masalah nyata | **Terverifikasi untuk peristiwa historis** | [NCA Annual Report 2018–19](https://www.nationalcrimeagency.gov.uk/who-we-are/publications/329-nca-annual-report-accounts-2018-19/file) mendokumentasikan 95 rekening, >£3,6 juta, sebagian besar overseas students | Valid sebagai contoh risiko; tidak membuktikan prevalensi 2026 atau bahwa semua korban tidak sadar |
| Sentinel menghindarkan pembekuan rekening/hukuman/kehilangan visa | **Tidak dapat dijamin** | Pola bahasa mendesak bukan ground truth AML. Sistem tidak mengendalikan bank, polisi, asal dana di luar aplikasi, atau status visa | Klaim harus “mengurangi paparan pada pola tertentu”, bukan perlindungan hukum menyeluruh |
| SAFE USD50.000 berlaku sebagai batas keras bagi semua mahasiswa, tracking rolling 365 hari cukup | **Salah lingkup/implementasi belum dibenarkan** | [SAFE](https://www.safe.gov.cn/en/2017/0119/1244.html) menjelaskan kuota pembelian valas domestic residents dan transaksi current-account melebihi kuota dengan dokumen pendukung, termasuk studi. Kuota bukan larangan total semua remitansi dan tidak boleh otomatis diterapkan pada semua persona asing | Definisikan residency, arah exchange/remittance, yurisdiksi, kategori transaksi, periode menurut aturan bank. Counter 365 hari tidak terbukti cocok dengan periode administratif |
| Evidence Pack pasti aman dari lisensi PBOC karena bukan skor angka | **Salah sebagai kesimpulan hukum otomatis** | [PBOC Measures 2021, efektif 2022](https://www.pbc.gov.cn/en/3688241/3688687/3688693/2025092319420287536/2021111916465019962.pdf) mendefinisikan jasa berdasarkan pengumpulan/pemrosesan/penyediaan informasi untuk menilai credit status, bukan semata format skor | Perubahan nama mengurangi overclaim, tetapi bukan pengecualian izin. Prototype sintetis dan rencana produk komersial harus dibedakan |
| WeBank mempunyai blind spot yang persis akan diselesaikan proyek | **Hipotesis produk** | Tidak ada wawancara, kebijakan eligibility produk, atau bukti bahwa sponsor meminta fitur ini | Jangan mengklaim kebutuhan sponsor sudah tervalidasi atau integrasi siap pakai |

### 4.2 Koreksi literatur CreditBridge

1. **Invisible Primes:** DOI memang nyata, tetapi [halaman jurnal](https://pubsonline.informs.org/doi/10.1287/mnsc.2024.07854) menyatakan terbit online **13 Mei 2026**, dengan **Marco Di Maggio dan Dimuthu Ratnadiwakara**. Versi kerja [ECB 2023](https://www.ecb.europa.eu/press/conferences/shared/pdf/20230921_8th_ARC/2023_ARC_DiMaggio_paper.pdf) mencantumkan **Don Carmichael** sebagai penulis ketiga. CreditBridge mencampurkan metadata versi kerja dan versi jurnal serta membaca “2024” dalam DOI sebagai tahun publikasi. Paper mendukung manfaat alternative data di platform AS, **bukan** validasi Evidence Pack mahasiswa lintas negara atau bukti cash-flow saja cukup menilai solvabilitas.
2. **Digital Footprints:** judul/DOI `10.1093/rfs/hhz099` relevan sebagai literatur alternative data, tetapi direct DOI tidak berhasil dibaca pada sesi ini. Klaim hasil detail tetap perlu diperiksa pada naskah; penelitian jejak digital tidak otomatis memvalidasi fitur mutasi mahasiswa.
3. **Mental Accounting Matters:** relevansi konseptual wajar. Tidak ada dasar mengubah teori behavioral menjadi bukti bahwa aplikasi ini mengurangi kesalahan anggaran atau denda. Metadata lengkapnya tidak diverifikasi ulang dalam sesi ini.
4. **CFPB Credit Invisibles:** [laporan resmi](https://www.consumerfinance.gov/data-research/research-reports/data-point-credit-invisibles/) ada. Klaim “imigran dan mahasiswa adalah kelompok terbesar” memerlukan tabulasi spesifik; existence laporan tidak membenarkan kesimpulan itu dengan sendirinya.
5. **AgentDojo:** [arXiv resmi](https://arxiv.org/abs/2406.13352) memberi judul *AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents*. Penulis: Edoardo Debenedetti, Jie Zhang, Mislav Balunović, Luca Beurer-Kellner, Marc Fischer, Florian Tramèr. Daftar CreditBridge memasukkan Vechev dan melewatkan beberapa penulis; koreksi. Benchmark ini mendukung metodologi, bukan bukti bahwa pertahanan tim berhasil.
6. **InjecAgent:** [ACL Anthology](https://aclanthology.org/2024.findings-acl.624/) memberi penulis **Qiusi Zhan, Zhixiang Liang, Zifan Ying, Daniel Kang**. Daftar enam penulis dalam CreditBridge salah. Benchmark bersifat lintas tool, bukan standar khusus integrasi API bank.

Kesimpulan audit: judul “daftar pustaka lengkap & terverifikasi” tidak dapat dipertahankan untuk CreditBridge v2 dalam bentuk sekarang. Beberapa rujukan nyata, tetapi metadata dan pemakaiannya belum benar seluruhnya.

### 4.3 NexusCFO: data bisnis dan literatur

| Klaim | Verdict | Bukti dan koreksi |
| --- | --- | --- |
| Trade-finance gap $2,5 triliun | **Terverifikasi sebagai estimasi global** | [ADB Global Trade Finance Gap Survey, Desember 2025](https://www.adb.org/publications/adb-global-trade-finance-gap-survey) mendukung angka tersebut. Itu unmet demand global, bukan TAM aplikasi CFO atau dana yang dapat dicairkan oleh agen |
| Penolakan UMKM 41%, jauh berlawanan dengan perusahaan besar | **Angka benar, pembandingan menyesatkan** | [ADB, 15 Januari 2026](https://www.adb.org/subjects/trade-and-supply-chain-finance) menyebut SME 41% dan large/mid-cap 40%, dengan kebutuhan penelitian lebih lanjut. Proposal tidak boleh menyimpulkan jurang besar dari data ini |
| Sumber ADB 2025 Brief No.302 memakai link laporan 2023 | **Metadata dan tautan tidak konsisten** | [Laporan 2023](https://www.adb.org/sites/default/files/publication/906596/adb-brief-256-2023-trade-finance-gaps-growth-jobs-survey.pdf) adalah Brief No.256 dan estimasi gap untuk 2022. Pakai laporan 2025 yang benar, jangan menggabungkan tahun/edisi |
| BEC >$3 miliar dan >24.000 kasus per tahun | **Didukung untuk 2025, perlu definisi** | [IC3 Annual Report 2025](https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf), PDF halaman 7 dan 9: 24.768 keluhan BEC dan $3.046.598.558 reported losses. Keluhan bukan otomatis jumlah perusahaan korban yang unik; bukan total kerugian dunia |
| Kerugian kumulatif BEC dunia >$50 miliar | **Angka mendekati benar, istilah salah** | [IC3 PSA 11 September 2024](https://www.ic3.gov/PSA/2024/PSA240911) mencatat **$55,5 miliar exposed dollar loss**, Oktober 2013–Desember 2023. Jangan menyebutnya seluruhnya kerugian aktual terealisasi atau laporan tahunan 2025/2026 |
| DSO 60–90, DPO 0–15, pertumbuhan 200% mematikan usaha, pemilik menghabiskan 40% waktu untuk tagihan | **Asumsi/klaim empiris belum terverifikasi** | Sah sebagai parameter persona sintetis; tidak ada data representatif untuk menjadikannya sifat umum eksportir |
| Software Xero/QuickBooks hanya mencatat masa lalu | **Salah sebagai dasar kebaruan** | [Xero Central](https://central.xero.com/0/article/Short-term-cash-flow-AU) menyediakan prediksi kas dan scenario adjustment; [JAX](https://central.xero.com/0/article/About-Just-Ask-Xero-JAX-AU) memberi kemampuan AI finansial. Harus bandingkan fitur nyata, bukan versi ERP yang disederhanakan |
| WeBank SME Liquidity Sandbox dapat mencairkan factoring | **Belum terverifikasi** | Tidak ditemukan dokumentasi API/credential/akses untuk sandbox yang dinamai proposal. Aturan lokal hanya mengizinkan simulated-account/sandbox logs. Jangan menyebut mock buatan tim sebagai layanan WeBank |
| Pembiayaan PO = factoring piutang yang sudah ada | **Mencampur produk** | Persona Budi mengunggah purchase order sebelum produksi, sedangkan factoring menjual accounts receivable. [Kouvelis–Xu](https://pubsonline.informs.org/doi/10.1287/mnsc.2020.3788) membahas post-shipment factoring. Bedakan PO financing, invoice factoring, reverse factoring |
| Pencairan 70% dalam 24 jam, DSO 60→14 hari, kebangkrutan turun 90% | **Target tanpa bukti** | Tidak ada kebijakan mitra, simulator terlampir, sampel pilot, atau estimasi kausal. DSO juga tidak otomatis sama dengan waktu mendapat cash dari penjualan piutang |
| Hash invoice membuktikan keaslian dan memblokir BEC | **Salah bila berdiri sendiri** | Hash membuktikan konsistensi terhadap nilai referensi terpercaya. PDF palsu yang pertama kali masuk juga memiliki hash valid. BEC membutuhkan onboarding vendor dan verifikasi perubahan rekening melalui kanal independen; [FBI/IC3](https://www.ic3.gov/PSA/2024/PSA240911) merekomendasikan secondary channels |
| Registry testnet mencegah bank mana pun mendanai invoice yang sama | **Salah lingkup** | Hanya peserta yang memakai registry, mengidentifikasi invoice secara konsisten, dan menegakkan status bersama yang bisa dibatasi. Bank di luar registry tetap dapat membiayai; perubahan nomor/tanggal/nominal menghasilkan hash baru |
| Highest regulatory compliance, tanpa risiko fraud lintas negara | **Klaim absolut tanpa bukti** | Belum ada pemetaan yurisdiksi, izin, data transfer, validasi credit decision, atau audit. Frasa tersebut sebaiknya dihapus |

### Koreksi bibliografi NexusCFO yang material

- **Kouvelis & Xu:** paper dan DOI benar. Metadata yang benar pada [INFORMS](https://pubsonline.informs.org/doi/10.1287/mnsc.2020.3788) ialah **Management Science 67(10):6071–6088 (2021)**, bukan 67(7):4199–4219. Afiliasi Xu pada paper adalah Syracuse, bukan Tsinghua. Paper juga menunjukkan reverse factoring tidak selalu pilihan terbaik pemasok; proposal menghilangkan trade-off ini.
- **Tunca & Zhu:** judul yang benar **Buyer Intermediation in Supplier Finance**, **64(12):5631–5650**, issue Desember 2018; online 2 November 2017. [INFORMS](https://pubsonline.informs.org/doi/abs/10.1287/mnsc.2017.2863?journalCode=mnsc). Rentang 1477–1974 dalam proposal bukan halaman paper. Tautan “INFORMS” pada tabelnya malah mengulang DOI Kouvelis–Xu.
- **Reverse Factoring for MSMEs:** [IDB Invest](https://idbinvest.org/en/blog/development-impact/how-can-anchor-companies-boost-access-finance-their-msme-suppliers) merujuk kajian terkait. Versi judul yang ditemukan ditulis Gabriela Aparicio, Enrique Carreras, Lucas Figal Garone, bukan Bals/Tempelhof dalam POMS. Rujukan proposal **belum dapat dipertahankan**; ganti dengan metadata sumber asli yang tepat.
- **McGuinness / Working Capital Management:** DOI proposal `10.1016/j.jcorpfin.2017.11.004` sebenarnya menunjuk **Jun Lu dan Zhen Shi, Does improved disclosure lead to higher executive compensation? Evidence from the conversion to IFRS and the dual-class share system in China**, Journal of Corporate Finance 48:244–260 (2018). [Halaman penerbit](https://www.sciencedirect.com/science/article/abs/pii/S0929119917303978). Ini salah atribusi substantif, bukan typo ringan; tidak mendukung survival UMKM.
- **Rujukan WTO 2024:** tanpa URL, DOI, atau nomor laporan yang spesifik, belum terverifikasi sebagaimana ditulis. Jangan memberi status verified.

## 5. Audit dataset: apakah data cocok dengan tugas?

| Ide / dataset | Status | Kekurangan utama | Keputusan reviewer |
| --- | --- | --- | --- |
| CreditBridge D1–D7 sintetis | Target 350 ujaran, 50 DAG, 200 traces, 120 serangan, 100 benign, 10 persona, 25 failure; belum ada berkas | Label manusia 20% dan template LLM berpotensi menyisakan ambiguity salah; D3 turunan D2 bukan bukti independen | Rencana paling spesifik, tetapi jumlah bukan hasil dan bukan validasi pasar |
| AegisPath ~60 task dan red-team | Rencana; sebagian detail bergantung addendum yang hilang | Gold set, split dan evaluator belum terlihat | Kredit untuk desain evaluasi dan kehati-hatian; tidak memberi kredit atas hasil yang belum ada |
| World Bank RPW | **Ada**, situs menyebut 367 corridors | [Metodologi RPW](https://remittanceprices.worldbank.org/methodology) adalah snapshot harga; bukan live quote untuk tuition besar. [Data download](https://remittanceprices.worldbank.org/data-download) membutuhkan atribusi | Cocok sebagai pembanding koridor, tidak sebagai jaminan tarif/settlement |
| IBM Synthetic AML | **Ada**, [IBM Research](https://research.ibm.com/publications/realistic-synthetic-financial-transactions-for-anti-money-laundering-models) | Transaksi berlabel pola AML tidak melabeli pesan recruitment money mule atau keputusan pembekuan rekening | Gunakan untuk transaksi sintetis bila relevan; buat corpus recruitment tersendiri dan jangan mengklaim transfer domain terbukti |
| FRED FX | Portal sumber ada; series spesifik belum diberi | Referensi St. Louis Fed dan ECB dicampur; ketersediaan seluruh mata uang dan tanggal tidak dibuktikan | Pilih series ID, quote direction dan timestamp; rate referensi bukan executable rate |
| Home Credit Default Risk | Dataset dikenal, identitas link jelas; ukuran/skema belum diverifikasi langsung dalam sesi ini | Label default peminjam tidak sama dengan label “stabilitas arus kas mahasiswa” | Hapus dari MVP; kalau dipakai, jadikan eksperimen lintas domain dengan batasan eksplisit |
| Nexus “B2B Accounts Receivable & Payment Delay, 50.000+” | **Tidak teridentifikasi** dari link halaman utama Kaggle | Tidak ada author, slug, versi, lisensi, schema, clearing-date label atau sampel | Tidak boleh menjadi fondasi claim predictor yang sudah feasible |
| DataCo | Dataset nyata: [Mendeley v5](https://data.mendeley.com/datasets/8gx2fvg2k6/5) | Data supply chain tidak otomatis mencakup clearing date invoice, kapal laut, atau pasangan invoice↔payment | Validasi kolom sebelum menghubungkan shipping delay dengan collection delay; volume bukan relevansi label |
| SBA ~899.000 loans | Link proposal tidak spesifik; edisi/skema belum terverifikasi | Loan/default AS bukan piutang eksportir Shenzhen, label payment delay atau underwriting factoring | Tidak memvalidasi cash-flow forecasting lintas negara |
| Nexus D-BEC 150 | Target sintetis belum ada | Tidak ada benign denominator, split, adaptive attacker atau manifest | Tabel ASR dan dana $0 belum menjadi bukti |

Sebelum memakai dataset: catat URL spesifik, pemilik, versi, tanggal pengambilan, lisensi, schema, contoh record, target label, dan aturan split. “Ada di Kaggle” tidak sama dengan dapat digunakan secara legal dan sesuai tugas.

## 6. Audit teknis dan matematis

### 6.1 CreditBridge: formula Wilson yang ditulis salah

§4.3 menulis interval berpusat pada `p_hat` dengan faktor koreksi hanya pada lebar. Wilson seharusnya memakai **pusat yang ikut terkoreksi**:

```text
denominator = 1 + z²/n
center = (p_hat + z²/(2n)) / denominator
half_width = z/denominator × sqrt(p_hat(1−p_hat)/n + z²/(4n²))
CI = [center − half_width, center + half_width]
```

Formula tersebut sesuai [NIST: Confidence intervals for a binomial proportion](https://itl.nist.gov/div898/handbook/prc/section2/prc241.htm). Dengan 0 serangan berhasil dari 120, Wilson dua sisi 95% adalah **[0%; 3,10%]**, bukan risiko nol. Untuk 0/150: **[0%; 2,50%]**. Rule of three menghasilkan sekitar 2,5% dan 2,0% sebagai **batas atas satu sisi**; jangan menyamakannya dengan Wilson dua sisi.

Kasus dari template yang sama juga tidak otomatis independen. Laporkan per keluarga, seed, model, budget attacker dan run; selang binomial merupakan ringkasan bersyarat atas set uji, bukan jaminan prevalensi serangan dunia nyata.

### 6.2 Nexus: skor risiko bergerak ke arah yang salah

§4.2 memakai:

```text
Risk = 1 − 1/(1 + exp(−k × (Threshold − Runway)))
```

Untuk `k>0`, ketika runway turun di bawah threshold, hasil justru mendekati **0**, padahal risiko seharusnya naik. Ketika runway jauh di atas threshold, hasil mendekati **1**. Dengan selisih threshold−runway = 10 dan k=1, hasil sekitar **0,000045**.

Perbaikan arah yang mungkin:

```text
Risk = 1/(1 + exp(−k × (Threshold − Runway)))
```

Namun, sigmoid yang benar arahnya pun **belum probabilitas kebangkrutan yang terkalibrasi**. Dokumen menyebut rolling standard deviation dan “Runway Z-Score” tetapi tidak memasukkannya dalam rumus. Burn rata-rata juga tidak memadai untuk arus kas lumpy, musiman, atau net burn≤0; gunakan proyeksi saldo bertanggal dan distribusi penerimaan.

### 6.3 Nexus: contoh penyelamatan kas tidak konsisten

Dengan cash flow lain tetap, pada hari ketika baseline = −$48.000:

```text
−48.000 + 30.000 + 20.000 = +2.000
```

Belum termasuk diskon, factoring fee, reserve, atau biaya lain. Ini tidak membuktikan saldo minimum **$12.000 sepanjang 60 hari**. Untuk mencapai $12.000 dari titik itu dibutuhkan tambahan net $60.000, atau perubahan cash flow lain yang harus dijelaskan. Karena ledger tidak tersedia, ada kemungkinan asumsi tambahan; klaim contoh belum dapat diverifikasi.

Lebih serius: jika $30.000 merupakan invoice yang sudah masuk baseline pada hari ke-60, penerimaan awal hari ke-10 harus **menghapus penerimaan hari ke-60**. Factoring juga memindahkan hak penerimaan ke factor; jangan menerima advance lalu menghitung invoice itu kembali sebagai kas perusahaan. Simulasi harus menjaga conservation of cash dan hak piutang.

### 6.4 Nexus: APR hampir benar, kesimpulan ekonominya berlebihan

Diskon 1,5% untuk pembayaran hari 10 daripada 60:

```text
(1,5 / 98,5) × (365 / 50) = 11,11675% per tahun
```

Pembulatan standar dua desimal adalah **11,12%**, bukan 11,11%. Ini equivalent simple annualized rate atas opportunity cost tertentu, bukan otomatis APR disclosure menurut semua regulasi. Bukan pula “risk-free”: ada risiko sengketa invoice, delivery/performance, fraud, dan biaya likuiditas buyer. Perbandingan terhadap pasar uang 3–4% memerlukan currency, tanggal dan tenor yang sama; tidak diverifikasi sebagai rate terkini.

### 6.5 Kelemahan keamanan bersama

| Mekanisme | Yang benar-benar diselesaikan | Yang belum diselesaikan |
| --- | --- | --- |
| Deterministic Policy Plane | Bisa menolak aksi di luar kebijakan eksplisit | Kebijakan salah, master data beracun, kompromi backend, izin yang terlalu luas, race dan bypass adaptor |
| JSON schema / temperature 0 | Membatasi bentuk argumen; mengurangi variasi sampling tertentu | Tidak membuktikan kebenaran nilai, niat, security atau reproduksi bit-identical |
| SHA-256 intent hash | Mengidentifikasi payload tertentu jika canonicalization dan referensi terpercaya benar | Hash bukan signature; pemegang kendali bisa menghitung hash baru. Perlu auth challenge yang mengikat payload, anti-replay, expiry dan state |
| Hash-chained audit log | Membantu mendeteksi perubahan terhadap checkpoint terpercaya | Admin dapat menulis ulang seluruh chain dan head lokal. “Immutable” tidak terbukti tanpa anchor/checkpoint independen dan kontrol akses |
| Uploaded-document hash | Mendeteksi perubahan byte setelah referensi ditetapkan | Tidak membuktikan dokumen asli dari bank, identitas issuer, atau saldo yang benar |
| API bank tiruan / tanda tangan issuer tiruan | Menguji alur permission dan verifikasi dalam simulator | Tidak menjadikannya bukti finansial dari institusi riil; mock harus dilabeli |
| Allowlist vendor/payee | Membatasi recipient ke master data yang dipercaya | Allowlist diisi dari invoice palsu, takeover vendor sah, atau rekening sah yang kini kompromi |
| Kill switch | Menghentikan antrian/izin baru jika seluruh worker memeriksa revocation | Tidak membatalkan transaksi yang telah settled atau pasti menghentikan request in-flight |
| Limited session key | Membatasi izin jika enforcement berada di boundary yang benar | REST mock bank tidak otomatis memiliki session-key enforcement setara smart-contract vault |
| Sharing link expiry/revoke | Membatasi akses berikutnya | Tidak menghapus screenshot, download atau cache penerima; token dapat bocor melalui URL/log |
| Redaksi PII | Mengurangi sebagian data identitas yang keluar | Saldo, merchant, metadata dan kombinasi atribut masih dapat mengungkap identitas atau rahasia dagang |

CreditBridge §3.5 mengklaim hash menutup **100% TOCTOU/Confused Deputy**, sedangkan §4.3 mengatakan jangan mengklaim risiko nol. Ini kontradiksi internal. Egress Ledger mencatat apa yang keluar; ia **tidak dengan sendirinya memblokir kebocoran**.

Otorisasi server, verifikasi data yang dilihat pengguna, expiry, dan credential unik per operasi sesuai prinsip [OWASP Transaction Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html). Untuk rancangan tim, payload persetujuan sebaiknya meliputi recipient ID/account, amount dalam minor units, source/destination currency, FX quote ID, fee maksimum, expiry, nonce, action type, serta policy version. Perubahan signifikan memerlukan persetujuan baru.

### 6.6 Timeout bukan rollback

CreditBridge menyatakan transfer yang timeout bisa dibatalkan dan kembali ke keadaan awal tanpa risiko double execution. Timeout justru berarti **hasil belum diketahui**; bank mungkin sudah menerima perintah. Idempotency hanya bekerja jika provider/adaptor menegakkannya secara persisten. [Dokumentasi Stripe](https://docs.stripe.com/api/idempotent_requests) adalah contoh implementasi provider, bukan bukti bahwa bank tiruan tim sudah mempunyai semantics yang sama.

State minimum yang perlu ditunjukkan:

```text
APPROVED → SUBMITTING → SETTLED
                   ↘ PENDING_UNKNOWN → RECONCILE → SETTLED / FAILED
```

Jangan otomatis retry dengan key baru atau menganggap saldo bisa dikembalikan hanya dengan mengubah database. Refund/recall adalah operasi terpisah, dapat gagal dan memerlukan otorisasi. Untuk invoice financing, kompensasi juga bisa melibatkan lender dan buyer, bukan sekadar rollback node DAG.

### 6.7 Klaim “multi-agent” dan kebaruan arsitektur

Ketiga dokumen menyebut multi-agent, tetapi diagram kebanyakan memuat parser, planner dan tool di satu pipeline. Tidak ada bukti agent roles terpisah, komunikasi, koordinasi state atau keuntungan dibanding satu agent. DAG dan policy engine dapat menjadi implementasi yang baik; istilah multi-agent tidak boleh memperoleh kredit inovasi tanpa kontribusi terukur.

## 7. Validasi pemenang lama dan batas inferensi

| Klaim dalam arsip | Hasil audit | Yang boleh dipelajari |
| --- | --- | --- |
| LingCaoPan juara 1 AI 2025, HKUST(GZ); FinAgent juara 3 | Didukung [berita kampus HKUST(GZ), 17 Desember 2025](https://www.hkust-gz.edu.cn/zh/?p=13630%2F%2F) | Masalah konkret, integrasi workflow, dan hasil implementasi membantu komunikasi |
| LingCaoPan deployed/pilot dan kerja sama beberapa perusahaan | Berita kampus mendukung deployment evaluasi dan trial tertentu; tidak sama dengan audit independen atau semua fitur terbukti production | Bukti pemakaian eksternal lebih kuat daripada klaim siap komersial tanpa mitra |
| FinAgent pemenang memakai Qwen-VL on-device dan tiga agent bernama tertentu | Rincian tersebut tidak dikonfirmasi dalam berita kampus yang dibaca | Jangan meniru rincian yang belum sumbernya jelas |
| `effective-p/FinAgent` adalah sumber pemenang atau repositori riset resminya | [README repo](https://github.com/effective-p/FinAgent) menyebut implementasi trading berdasarkan arXiv 2402.18485, dengan pipeline harga/news, KRX, backtest; tidak mengidentifikasi dirinya sebagai kode one piece pemenang 2025 | Nama sama bukan bukti proyek sama. [Paper 2024](https://arxiv.org/abs/2402.18485) juga bukan bukti kemenangan 2025 |
| EchoPolis Best Creative Award | Didukung [berita Nanjing University](https://sdem.nju.edu.cn/b0/99/c56973a831641/pagem.htm). [Repo EchoPolis](https://github.com/ianchiou28/EchoPolis) tersedia, tetapi belum dijalankan atau diaudit implementasinya | Behavioral insight dan pengalaman pengguna dapat menjadi pembeda; bukan bukti setiap desain digital twin efektif |
| SSVFATE 2024 juara 1 dan detail tim/kode | Repo yang diberikan gagal diakses; tidak dikonfirmasi ulang dari sumber primer yang berhasil dibaca | Tetap kandidat rujukan, jangan otomatis memberi status verified |
| CipherBridge juara 2 blockchain, proyek AIGC provenance BIT juara 1 blockchain 2024 | Posisi dan kampus didukung [rilis FISCO, 13 Desember 2024](https://www.fisco.com.cn/news_7/962.html). Folder CipherHub dan zhiyilian memang ada dalam [monorepo FISCO](https://github.com/FISCO-BCOS/hackathon/tree/master/2024-shenzhen-FinTechathon); seluruh rincian anggota/ZK/FHE belum diaudit | Ada artefak nyata untuk dipelajari, tetapi kemenangan jalur blockchain lama bukan bonus resmi bagi Topik C/E baru |
| Anti-Fraud Squad PKU juara 1 data analytics, AI4Fin juara 2 AI 2025, dan digital-human lansia juara 3 AI 2024 | Klaim dan rincian ini belum dikonfirmasi ulang dari sumber primer yang berhasil dibaca dalam pemeriksaan ini | Tidak dipakai sebagai dasar skor atau pola kemenangan yang pasti |
| Semua proyek tanpa repo ditemukan pasti closed-source/proprietary | **Tidak sah sebagai inferensi** | “Repo belum ditemukan” berbeda dari informasi lisensi closed-source |
| Juara menang karena privacy/multi-agent/anti-halusinasi tertentu | **Tidak dapat disimpulkan kausal** tanpa lembar nilai/komentar juri | Fitur pemenang adalah contoh, bukan formula kemenangan |

Arsip itu berguna sebagai petunjuk, tetapi label “valid & aktif” tidak dapat disalin tanpa pemeriksaan. International Track baru memiliki populasi peserta dan rubrik berbeda. Tidak ada dasar memberi poin tambahan karena menyerupai teknologi pemenang 2024/2025.

## 8. Penilaian per ide menurut rubrik

### 8.1 AegisPath — 74/100

**Kekuatan utama:** rancangan paling jujur tentang estimasi biaya, ketiadaan ground truth kredit, penerimaan pihak ketiga, simulated funds, dan hasil uji. Ada perhatian konkret terhadap client security, stale PWA cache, setup bersih, offline fallback, privacy canary, adaptive red team dan pemangkasan fitur.

| Dimensi | Skor | Alasan |
| --- | ---: | --- |
| Task | 28/40 | Alur Pay jelas, API dan state diantisipasi, Prove menghasilkan output yang dapat diuji. Minus: detail gold set berada pada addendum hilang; belum ada hasil, correctness rate, reconciliation timeout atau finansial per koridor |
| Security | 25/30 | Boundary di luar LLM, approval dirender dari payload, privasi diuji, dan risiko nol ditolak. Minus: enforcement independen/session key belum dibuktikan; simulated auth dan ketergantungan pada master data perlu batas jelas |
| Innovation & interaction | 21/30 | Klarifikasi material, slip aksi, Prove selective sharing, dan failure UI masuk akal. Minus: Pay dan credit evidence sudah ada pada vendor; kebaruan terutama integrasi dan evaluasi, bukan penemuan finansial baru |

**Pertanyaan juri yang belum terjawab:** “Jika bank timeout setelah uang terkirim, bagaimana agen mengetahui status sebenarnya dan mencegah pembayaran kedua?” “Mengapa landlord mempercayai ringkasan yang issuer-nya tiruan?” “Apa peningkatan agent dibanding rule-based payment wizard?”

**Penghambat terbesar:** ketergantungan pada dokumen strategi yang tidak disertakan dan beberapa mekanisme evaluasi lomba yang diasumsikan. Harus dibuat self-contained sebelum submission.

**Demo terbaik:** instruksi bayar tuition yang ambigu → satu klarifikasi penting → quote bertanggal → approval recipient dan fee → bank timeout setelah menerima transfer → reconciliation memastikan satu settlement → PDF berbahaya mencoba mengganti recipient → eksekusi ditolak dengan alasan yang jelas.

### 8.2 CreditBridge AI v2 — 66/100

**Kekuatan utama:** spesifikasi dataset, attack families, permission tiers, API dan rencana hariannya lebih eksplisit. Penggantian skor kredit menjadi evidence summary dan pemisahan policy dari LLM adalah arah yang benar.

| Dimensi | Skor | Alasan |
| --- | ---: | --- |
| Task | 27/40 | Tugas finansial dapat dibuat konkret di simulator; spesifikasi D1–D7 membantu engineering. Minus: rollback timeout salah, formula pembayaran menyamakan currency tanpa konversi eksplisit, evidence outcome dan sandbox execution belum ada |
| Security | 20/30 | Banyak kontrol dan desain ablasi, tetapi klaim 100%, $0 tanpa hasil, batas L5 tanpa enforcement terbukti, kesimpulan izin PBOC, dan tracker SAFE generik mengurangi kepercayaan |
| Innovation & interaction | 19/30 | Paket fungsi relevan, tetapi hampir identik AegisPath; klaim “pertama” tidak terbukti, vendor kompetitor dan dampak deposit belum dibandingkan secara adil |

**Pertanyaan juri yang belum terjawab:** “Mengapa tabel loss sudah $0 padahal ASR belum diukur?” “Apakah mock API bank dianggap lebih autentik dari dokumen bank asli?” “Apa makna status verified bila formula Wilson dan metadata paper salah?”

**Penghambat terbesar:** dokumen berbicara lebih pasti daripada bukti yang dimiliki. Bagian non-goals berhati-hati, tetapi bagian impact dan security mengembalikan jaminan yang sudah ditolak.

**Perbaikan tercepat:** gunakan semua hasil sebagai placeholder sampai benchmark terisi; koreksi Wilson, paper metadata, SAFE, hash/approval dan reconciliation. Potong ML lintas domain, on-chain, dan multilingual dari jalur kritis. Setelah koreksi dan penyamaan scope, posisi CreditBridge dan AegisPath dapat menjadi **praktis seri**; selisih sekarang terutama kualitas proposal dan konsistensi klaim.

### 8.3 NexusCFO AI — 52/100

**Kekuatan utama:** cash-flow shortfall, invoice financing dan perubahan rekening vendor adalah workflow finansial yang kuat. KPI berupa hari kas di bawah batas, biaya pendanaan dan kewajiban terbayar dapat dinilai dengan jelas. Proyek tidak perlu menciptakan credit score baru untuk membuktikan manfaat simulator.

| Dimensi | Skor | Alasan |
| --- | ---: | --- |
| Task | 20/40 | Tujuan konkret, tetapi matematika risk terbalik, contoh cash flow tidak cocok, cash accounting berpotensi double count, buyer/lender acceptance hilang, dan sumber data utama tidak jelas |
| Security | 16/30 | Allowlist dan dua approver cocok untuk BEC, tetapi hash-as-authenticity, immutable log, universal double-financing block, serta hasil $0 belum dapat dibuktikan |
| Innovation & interaction | 16/30 | Menyatukan forecasting–action–governance menarik, namun pembandingan Xero salah dan klaim sponsor/impact berlebihan. Skenario corporate kompleks belum disertai desain interaksi penolakan/revisi |

**Pertanyaan juri yang belum terjawab:** “Apa yang terjadi jika buyer menolak diskon dan semua lender menolak?” “Di mana dataset clearing-date yang melatih forecast?” “Bagaimana PO menjadi receivable?” “Bagaimana hash membedakan invoice sah dan palsu jika keduanya pertama kali masuk?”

**Penghambat terbesar:** sumber likuiditas di simulator berperilaku terlalu mudah. Agen tidak benar-benar menyelesaikan masalah bila simulator selalu menyetujui pembiayaan dan buyer selalu membayar lebih awal.

**Demo yang layak:** cash ledger konsisten → forecast probabilistik atau scenario range → optimizer membandingkan net cost/eligibility → buyer menolak tawaran pertama → lender memberi partial funding → agent merevisi rencana → dua approver setuju → transaksi dicatat sekali → rekening vendor berubah dan harus diverifikasi melalui kanal berbeda.

## 9. Perkiraan lensa adviser: inferensi, bukan prediksi individu

Pengumuman [IEEE CIS Singapore](https://www.ieee-cis-singapore.org/2026-fintechathon) menyebut Academic Advisory Board. **Adviser tidak otomatis juri penilai**, dan tidak tersedia bobot pribadi/rekaman keputusan mereka. Pertanyaan di bawah merupakan inferensi reviewer dari bidang publik, bukan pernyataan yang diatribusikan kepada tokoh tersebut. Tidak ada tambahan bobot di luar 40/30/30.

Identitas CityU yang lebih tepat: **Wen Jung Li / 李文榮**, bukan menganggap “Li Wenrong” profesor fintech dengan keahlian yang tidak diperiksa. [Profil CityU](https://www.cityu.edu.hk/mne/people/academic-staff/mne-faculty/prof-li-wen-jung) menekankan sensing dan embodied intelligence. [Profil Li Jianqiang SZU](https://ai.szu.edu.cn/english/info/1102/6212.htm) juga mencantumkan embodied intelligence/robotics dan big-data health; lensa systems engineering adalah generalisasi yang wajar, bukan preferensi skor yang pasti.

| Adviser dan dasar bidang | Pertanyaan yang masuk akal | Implikasi AegisPath | Implikasi CreditBridge | Implikasi NexusCFO |
| --- | --- | --- | --- | --- |
| **Shouyang Wang** — financial engineering, risk, supply chain; [CV universitas](https://iaer.dufe.edu.cn/upload/opupload/2021_09/27/1557465969091326.pdf) | Apa konsekuensi sistemik dan siapa menanggung kerugian bila rencana gagal? | Non-goals membantu; perlu batas loss dan bank pending state | Klaim batas loss L5 perlu enforcement riil | Relevansi supply chain kuat, tetapi dana tidak muncul otomatis dan buyer liquidity perlu data |
| **Qiang Yang** — federated/privacy-aware AI; [paper federated learning](https://arxiv.org/abs/1902.04885) | Apa data yang keluar, bagaimana leakage dibuktikan, dan apakah kontrol bisa dilewati? | Canary/egress dan batasan paling meyakinkan | Redaksi tidak membenarkan klaim privasi sempurna | Margin dapat bocor dari derived outputs/log; masking bukan proof |
| **Wen Jung Li** — sensing/embodied intelligence; [CityU](https://www.cityu.edu.hk/mne/people/academic-staff/mne-faculty/prof-li-wen-jung) | Apa kemampuan agen saat input rusak dan dunia berbeda dari skenario demo? | Failure modes sudah dipikirkan; perlu demo actual | Tool layer eksplisit, tetapi rencana kaku belum membuktikan adaptasi | Perlu perilaku buyer/lender refusal dan parsing invoice yang salah |
| **Jianqiang Li** — AI dan rekayasa sistem; [SZU](https://ai.szu.edu.cn/english/info/1102/6212.htm) | Bagaimana sistem direproduksi, menangani state/concurrency, dan mengukur latency? | Setup/offline/test regimen paling matang sebagai rencana | Stack jelas; klaim offline zero risk tidak sah | Corporate workflow, OCR, optimizer, model dan blockchain membuat scope berat |
| **Yunpeng Chai** — storage/database systems; [RUC](https://info.ruc.edu.cn/xwgg/xwrw/a2f61a78cfc4401daa37f2fe0e54bccd.htm) | Bagaimana transaksi, isolation, crash recovery dan audit konsisten? | Perlu uji kill-switch race dan durable keys | SQLite/idempotency memerlukan atomicity yang nyata | Double-financing check harus atomic; hash chain lokal tidak immutable |
| **Dacheng Xiu** — statistical methods dan financial ML; [UChicago](https://stat.uchicago.edu/people/profile/dacheng-xiu/) | Apa target, label, test split, baseline dan uncertainty yang benar? | Menghindari credit-score tanpa label adalah keputusan kuat | Wilson salah dan angka survey tak terbukti akan diserang | Dataset salah domain, sigmoid tak terkalibrasi, 90% survival claim dan contoh kas lemah |
| **Wolfgang Härdle** — financial statistics/risk; [Humboldt](https://agnes.hu-berlin.de/lupo/rds?keep=y&moduleCall=webInfo&personal.pid=15427&publishConfFile=webInfoPerson&publishSubDir=personal&state=verpublish&status=init&vmfile=no) | Bagaimana risk bounds dihitung dan apakah on-chain memberi manfaat yang bisa diisolasi? | Bonus opsional menjaga fokus; butuh metrik risiko | 0/120 tidak risk-free dan on-chain bukan bonus pasti | Risk score salah arah; registry perlu boundary peserta dan identitas invoice |
| **Joshua Bongard** — evolutionary robotics/computation; [UVM](https://www.uvm.edu/cems/cs/profile/josh-bongard) | Apakah sistem dapat pulih ketika model dunianya salah atau sebagian aksi selesai? | Recovery paling eksplisit, tetap perlu pengujian | D7 target bagus, belum bukti berhasil | Fixed demo “selamat” tidak membuktikan replanning di bawah refusal/partial funding |

Dari lensa ini, ranking tetap **AegisPath > CreditBridge > NexusCFO** untuk bahan yang tersedia. NexusCFO bisa menarik perhatian bidang supply chain, tetapi ketelitian finansial justru membuat kesalahannya lebih mudah terlihat. Nama sponsor atau adviser bukan kompensasi untuk hasil yang tidak benar.

## 10. Transparansi perhitungan skor dan sensitivitas ranking

Karena guidebook tidak memiliki subbobot, reviewer memakai pembagian berikut secara konsisten; ini **alat audit internal**, bukan rubrik tambahan panitia.

| Subdimensi internal | Maks | AegisPath | CreditBridge | NexusCFO |
| --- | ---: | ---: | ---: | ---: |
| Task: kejelasan dan correctness output finansial | 15 | 11 | 10 | 6 |
| Task: alur action, state, recovery | 15 | 11 | 10 | 8 |
| Task: rencana bukti, reproducibility, scope | 10 | 6 | 7 | 6 |
| Security: otorisasi dan boundary | 12 | 10 | 8 | 7 |
| Security: privasi dan realisme compliance | 10 | 8 | 6 | 4 |
| Security: threat model dan kejujuran evaluasi | 8 | 7 | 6 | 5 |
| Innovation: kontribusi dibanding prior art | 10 | 6 | 5 | 4 |
| Innovation: nilai guna dan validitas klaim dampak | 10 | 7 | 6 | 6 |
| Innovation: interaksi dan penanganan ambiguity/failure | 10 | 8 | 8 | 6 |
| **Total** | **100** | **74** | **66** | **52** |

Klaim salah dikurangi pada dimensi yang dipengaruhinya; tidak ada “credibility penalty” keempat yang ditambahkan setelah total. Ketiadaan kode berlaku untuk ketiganya: poin diberikan atas spesifikasi yang layak dibuktikan, bukan karena menganggap sistem sudah bekerja.

| Kondisi perubahan bukti | Perubahan kesimpulan |
| --- | --- |
| Semua proposal tetap hanya README | Ranking di atas berlaku; tidak ada yang layak diklaim punya performa finalis terbukti |
| CreditBridge menghapus overclaim, memperbaiki math dan membuat state semantics setara AegisPath | Selisih dapat hilang; keduanya adalah ide yang sama dengan kualitas dokumen berbeda |
| Nexus menunjukkan data piutang asli berizin, baseline forecast, ledger benar, rejection simulator dan customer validation | Nexus dapat melewati dua proposal mahasiswa; bukti ini jauh lebih bernilai daripada tambahan blockchain |
| Bonus semua topik akhirnya dikonfirmasi dan satu tim memperoleh penuh +5 | Selisih saat ini tidak terbalik hanya oleh bonus maksimum; bonus harus berdasarkan implementasi yang memenuhi syarat |
| Salah satu proyek menunjukkan unauthorized settlement atau kebocoran lintas user saat demo | Ranking dapat berubah drastis; tingkat penalti resmi tidak diasumsikan karena tidak tersedia |

Saya tidak memberikan probabilitas juara atau “pasti masuk 10 finalis”: tidak ada data peserta, hasil prototipe, kualitas tim, atau distribusi nilai yang mendukungnya.

## 11. Rencana perbaikan paling bernilai sebelum submission

### Prioritas bersama

| Prioritas | Hasil konkret | Mengapa memengaruhi skor |
| --- | --- | --- |
| P0 | Satu scope dan satu koridor/jenis usaha; seluruh mock jelas dilabeli | Task correctness lebih mudah dibuktikan daripada daftar fitur luas |
| P0 | Hapus “100%”, “zero risk”, “pertama”, “aman lisensi”, “immutable”, “bank mana pun”, dan impact angka yang tidak terukur | Memulihkan kepercayaan tanpa memerlukan fitur baru |
| P0 | Implementasi state transaksi, atomic limits, idempotency persist, approval binding dan reconciliation | Menghindari double payment, TOCTOU dan loss yang benar-benar memengaruhi keamanan |
| P0 | Dataset manifest, held-out test, benchmark task+attack+benign dan laporan terisi | Menyediakan bukti 70% dimensi pertama, bukan diagram saja |
| P0 | Rapikan sitasi versi asli, sumber angka, satuan uang dan seluruh hitungan | Kesalahan ilmiah/finansial mudah diverifikasi juri dan merusak narasi |
| P1 | Test cross-user access, link revoke, privacy canary, model/tool failure dan restart | Memperluas bukti di luar happy path |
| P1 | Demo ≤5 menit, technical doc bahasa Inggris, README setup dan evidence bundle | Membuat hasil reviewable dan mengurangi risiko konflik checklist |
| P2 | On-chain, ML opsional, multi-bahasa, UI tambahan | Ditambahkan hanya bila core dan evidence sudah lulus; bonus belum pasti |

### MVP yang direkomendasikan untuk AegisPath/CreditBridge

Pilih pembayaran tuition dalam **satu koridor eksplisit**, memakai account simulator lokal dengan quote expiry, source/destination balances, biaya dan settlement state. Prove cukup menghitung beberapa fitur arus kas dan menandai semua issuer mock; Protect membatasi recipient, cumulative cap, approval dan pause. Jangan menjanjikan akses kredit atau perubahan deposit.

Gunakan baseline **payment wizard/rule engine tanpa LLM**, **LLM dengan prompt guardrail saja**, dan **LLM dengan policy enforcement**. Ini menjawab “apa kontribusi AI?” sekaligus “apa kontribusi security?”. Jika workflow sudah terstruktur dan LLM tidak memperbaiki user effort atau generalisasi intent, akui bahwa manfaatnya terutama antarmuka bahasa alami.

Perubahan scope ini bukan proyek baru; memakai dasar AegisPath dan spesifikasi CreditBridge yang benar. Storytelling yang lebih dapat dipertahankan: **agen membayar kewajiban dalam simulator dengan izin terikat transaksi dan memulihkan status ketika provider gagal, sambil membuat bukti finansial yang sumbernya ditandai secara transparan.**

### MVP bila tetap memilih NexusCFO

Gunakan satu usaha sintetis dengan ledger 60 hari yang konsisten dan invoice ID stabil. Bangun **scenario cash-flow engine**, lalu satu optimizer yang membandingkan diskon pembayaran dini dan factoring berdasarkan eligibility, net proceeds, all-in cost, due date, recourse dan reserve. Buyer/lender simulator harus bisa menolak, membayar sebagian dan terlambat.

Hilangkan “WeBank Sandbox” dari nama mock, jangan melatih loan-default model AS untuk mengklaim payment-delay forecast Shenzhen, dan jangan menghitung manfaat factoring dua kali. Registry on-chain dapat ditunda; unique invoice constraint dan atomic pledge dalam simulator lebih penting dahulu.

## 12. Bukti yang dapat mengubah keputusan reviewer

| Bukti yang diperlukan | AegisPath/CreditBridge | NexusCFO |
| --- | --- | --- |
| Task success | Hasil amount/currency/payee benar, fee bounds, receipt, approval dan single settlement | Kewajiban terbayar, ledger konsisten, financing eligible, net funding dan biaya benar |
| Failure recovery | Timeout setelah accepted, quote expired, restart dan duplicate request | Buyer refusal, lender partial approval, invoice dispute, duplicate pledge dan delayed settlement |
| Security | Attack suite per family, benign FPR, bypass langsung API, privilege change, cross-user access | BEC dengan rekening master sah dan palsu, independent verification, multi-approver separation |
| Privacy | Outbound payload capture dan canary leakage dengan ground truth | Margin, buyer identity, invoice fields dan derived secret leakage |
| Business validation | Interview mahasiswa dan pihak yang menerima evidence; bukan hanya persona | Interview owner/CFO dan financing provider; buktikan kebutuhan dan akses data |
| Reproduction | Repo, commit, model config, dataset hash, raw results, run command | Sama, ditambah cash ledger dan optimizer baseline yang dapat dihitung ulang |

ASR harus mendefinisikan attacker objective yang benar-benar tercapai; penolakan teks tidak cukup bila backend tetap mentransfer. Task success harus menghitung kegagalan aman sebagai task failure bila tugas sah tidak selesai, bukan menaikkan nilai hanya karena sistem menolak semuanya. FPR memakai jumlah request **jinak** sebagai denominator, bukan 120/150 serangan. Dana hilang teramati pada test suite berbeda dari maximum loss bound yang harus diturunkan dari invariant dan asumsi enforcement.

Semua hasil, deck, dokumen dan video harus berasal dari report yang sama. Jika memperbaiki pertahanan setelah melihat sealed test failures, hasil berikutnya memakai set uji baru atau dilabeli sebagai regression, bukan hasil held-out yang masih bersih.

## 13. Batas verifikasi dan catatan akhir reviewer

Sumber yang berhasil dibaca mendukung konteks lomba, sebagian pemenang, masalah pembayaran/AML, data ADB/IC3, kompetitor, serta sejumlah paper. Tidak semua klaim kecil atau semua tautan arsip berhasil dibuka; yang belum selesai ditandai pada tabel, bukan dinaikkan menjadi verified. Beberapa halaman DOI, situs kampus lama, dan link Nextcloud CMU gagal diakses. Keadaan itu tidak dipakai sebagai bukti sumber palsu.

Penilaian feasibility mengasumsikan implementasi dimulai dari keadaan folder yang tersedia dengan sekitar sepuluh hari sampai tenggat. Keahlian, jumlah anggota, hardware model lokal, interview pengguna dan akses sandbox tim belum diketahui. Label “10 hari feasible” karena itu selalu bersyarat. Offline Docker/model lokal mengurangi risiko jaringan, tetapi masih menyisakan risiko dependency, RAM/VRAM, latency, auth origin dan boot pada mesin lain.

**Keputusan reviewer:** prioritaskan AegisPath sebagai rancangan inti dan gabungkan detail CreditBridge yang dapat dibuktikan. Jangan memilih NexusCFO hanya karena narasi sponsor atau gap $2,5 triliun. Perubahan terbesar pada peluang kompetisi akan datang dari satu alur finansial yang benar, kontrol otorisasi yang tidak dapat dilewati dalam threat model yang dinyatakan, dan hasil uji yang dapat direproduksi.
