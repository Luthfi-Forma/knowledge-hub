# ADR-004: Satu identitas visual "Atlas" — dual-mode Reading/Immersive dihentikan

Status: Accepted
Date: 2026-07-29

<!-- Status lifecycle: Proposed → Accepted → (Superseded by ADR-NNN).
     Never edit an Accepted ADR's Decision section — supersede it.
     Process: C:\Users\Luthfi\Documents\Claude Code\Claude Engineering OS\standards\architecture\adr-process.md -->

## Context

M5 (ADR-003) memberi situs **dua identitas visual** — Reading (krem, Bodoni Moda +
Karla) dan Immersive/DATUM (hampir-hitam, Archivo) — dipilih pengunjung lewat toggle
persisten di Header atau registration seam yang bisa diseret di homepage. Mekanismenya
sengaja semurah mungkin: remap 8 custom property CSS, nol island kedua, nol route kedua.

Mekanismenya bekerja persis seperti dirancang. Yang tidak diantisipasi adalah biaya di
**lapisan desain**, bukan di lapisan teknis. ADR-003 sendiri sudah menulis konsekuensi
ini sebagai (−): *"`data-mode` di `<html>` berarti setiap style baru yang ditambahkan ke
situs berpotensi butuh dipertimbangkan di dua mode ke depannya — beban kognitif tambahan
permanen, bukan sekali jalan."*

Setelah M5 ditutup, user berkonsultasi dengan **Claude Design** dan menerima handoff
lengkap bernama **"Atlas"** (di-versi di `docs/design/atlas/`, README-nya adalah
spesifikasi high-fidelity). Audit di dalamnya menemukan bahwa biaya itu sudah terwujud
sebagai duplikasi nyata:

- **Dua pohon DOM per halaman** (`[data-mode-view]`) di 3 route, dan 6+ route lain yang
  hanya mewarisi remap token tanpa komposisi bespoke — Immersive tidak pernah selesai
  sebagai identitas penuh, dan tidak akan pernah tanpa membangun ulang tiap halaman dua
  kali.
- **Dua sistem kartu** (`PostCard` + `PostListItem`), **tiga gaya tag**, **empat bahasa
  tombol** — semuanya hidup berdampingan karena tidak ada satu wadah kanonis.
- **Toggle tersembunyi**: penemuan identitas kedua bergantung pada pengunjung menekan
  tombol yang tidak pernah dijanjikan apa pun.
- **~44% viewport kosong** di sisi kiri pada layar lebar, di situs yang justru punya
  taksonomi kaya (20 topik) yang tidak punya tempat untuk ditampilkan.

Atlas menyelesaikan ini bukan dengan memilih salah satu dari dua identitas, melainkan
dengan **melebur keduanya**: bahasa kartografis DATUM (hatch per tipe, plate
berkoordinat, graticule) diangkat ke latar kertas terang, dan **topik** dinaikkan
menjadi warga kelas satu — pilihan yang digerakkan audiens, karena pembaca utama situs
ini adalah komunitas GIS.

## Decision

1. **Situs punya satu identitas visual: Atlas.** Mekanisme dual-mode dihentikan
   sepenuhnya — `data-mode`, `[data-mode-view]`, `src/lib/mode-toggle.ts`, tombol toggle
   di `Header.astro`, script pra-paint di `BaseLayout.astro`, dan
   `RegistrationSeam.astro` dihapus dari codebase. **ADR-003 menjadi Superseded oleh ADR
   ini.**
2. **Keputusan #1 dan #2 ADR-003 tetap berlaku dan tidak disuperseded.** Tier-0
   (fitur platform CSS/HTML tanpa island) dan Tier-1 (satu script vanilla ≤2KB gzip
   boleh hidup di layout global, `is:inline`, tanpa `client:*`) tetap menjadi kebijakan
   aktif — Atlas memakainya untuk drawer rail di <1024px, filter legenda, dan kontrol
   search. Larangan hidrasi island framework di layout global (ADR-002 klausa 4) tetap
   berlaku penuh. Yang mati adalah **penggunaannya untuk memilih identitas**, bukan
   tier-nya.
3. **Satu wadah konten: `Plate`** (tiga ukuran: lead / standard / compact), anatomi
   selalu sama. Menggantikan `PostCard` + `PostListItem`. Satu bahasa kontrol empat
   tingkat menggantikan empat bahasa tombol; `TopicChip` satu bentuk dua state
   menggantikan tiga gaya tag.
4. **Token warna dibagi per peran, bukan sekadar diganti nilainya.** Satu
   `--color-accent` yang hari ini mengerjakan enam tugas dipecah menjadi
   `--color-research` / `--color-project` / `--color-flag`, plus `--color-line-strong`
   baru untuk batas kontrol interaktif. `--color-chart-1` dan `--color-chart-2`
   **dipertahankan sebagai alias** ke `--color-research`/`--color-project` — ini yang
   menjaga invarian ADR-003 keputusan #5 (island scrollytelling ikut berganti identitas
   **tanpa satu pun edit React**) tetap berlaku di bawah Atlas.
5. **IA berubah: 4 item nav yang semuanya halaman nyata**, nol orphan.
   `/tags/**` → `/topics/**`, `/explore` dilebur ke `/`, `/#contact` keluar dari nav.
   Perpindahan URL ditangani **redirect 308 di `vercel.json`**; `/posts/[slug]` **tidak**
   berubah sama sekali.

## Rationale

- **Dua identitas hanya murah selama tidak ada yang tumbuh di atasnya.** Selama M5 itu
  benar. Begitu ada komponen baru, tiap komponen harus dirancang dua kali — dan Immersive
  yang hanya punya komposisi bespoke di 3 dari 10+ route membuktikan bahwa "dua kali" itu
  tidak pernah benar-benar dibayar penuh.
- **Melebur lebih baik daripada memilih.** Membunuh Immersive dan kembali ke krem M3 akan
  membuang bahasa kartografis yang justru paling tepat untuk audiens GIS situs ini.
  Atlas memindahkan bahasa itu ke latar terang, jadi tidak ada yang dibuang selain
  mekanismenya.
- **Filter legenda menggantikan peran toggle secara fungsional.** Rail permanen memberi
  pengunjung kontrol nyata atas apa yang ditampilkan (tipe, topik) — kontrol yang berguna
  — di tempat yang sebelumnya diisi tombol yang hanya mengganti warna.
- **Perpindahan URL kali ini aman, berbeda dari M5.** Restrukturisasi IA sempat dibunuh
  saat brainstorming M5 karena memindahkan URL terindeks dan mengancam satu sitasi
  eksternal nyata ke post Cikarang. Atlas tidak memindahkan `/posts/[slug]` sama sekali;
  yang pindah hanya route indeks, dan itu ditangani 308.

## Alternatives considered

- **Pertahankan toggle, jadikan Atlas identitas ketiga.** Ditolak: melipatgandakan biaya
  yang persis jadi alasan ADR ini ada, dan bertentangan dengan seluruh premis handoff
  (satu wadah, satu pohon DOM).
- **Buang Immersive, kembali ke identitas krem M3 apa adanya.** Ditolak: menyelesaikan
  masalah duplikasi tapi mengembalikan situs ke kondisi yang audit Claude Design sebut
  sebagai penyebab ~44% viewport kosong dan topik yang tidak punya rumah. Tidak menjawab
  apa pun soal IA.
- **Pertahankan `data-mode` sebagai dark mode biasa** (bukan identitas kedua, cuma palet
  gelap). Ditolak untuk sekarang: Atlas mendefinisikan 9 token dengan pembagian peran
  yang ketat, dan menurunkan semuanya ke varian gelap adalah keputusan desain tersendiri
  yang belum diambil siapa pun. Bisa dipertimbangkan ulang setelah Atlas stabil — dan
  akan lebih murah dari sebelumnya, karena sekarang cuma ada satu pohon DOM untuk
  diwarnai.

## Consequences

- (+) Satu pohon DOM per halaman. Setiap komponen baru dirancang sekali. Indeks Pagefind
  tidak lagi butuh `data-pagefind-ignore` untuk menghindari judul terindeks dobel.
- (+) Empat perbaikan aksesibilitas nyata ikut terbawa: skip-link ke `#main` (kegagalan
  WCAG 2.4.1 hari ini), batas kontrol interaktif naik dari 1,5:1 ke 3,2:1, tabel data
  alternatif untuk tiap chart Recharts (kegagalan 1.1.1), dan `useReducedMotion()` di 4
  modul scrollytelling (gap yang sudah diakui di `global.css` dan RULES.md).
- (+) Dua permintaan Google Fonts hilang — Bodoni Moda + Karla dilepas, Archivo
  self-hosted mengerjakan display dan body lewat sumbu `wdth`.
- (−) **Registration seam (T-42) mati.** Fitur unggulan M5, dengan dua bug aksesibilitas
  nyata yang sudah ditemukan dan diperbaiki di dalamnya. Kodenya hidup di sejarah git
  (commit a5d8937 dan sekitarnya), tidak dihidupkan kembali tanpa alasan baru.
- (−) **Carousel drag Featured Projects (T-24) mati.** Konsekuensi tidak langsung:
  Atlas mempensiunkan `Hero` + `FeaturedProjects` + `LatestPosts` demi satu Sheet Index.
  Ini satu dari dua fitur unggulan M4 — dicatat di sini supaya tidak hilang diam-diam
  dalam diff besar.
- (−) URL indeks yang sudah terindeks (`/explore`, `/tags/*`) berpindah. Dimitigasi 308,
  tapi tetap butuh dijaga: `vercel.json` menjadi file yang tidak boleh hilang.
- (−) Lapisan "topik" lahir **kosong secara editorial**. Struktur `/topics/[topic]` ada
  di M6, tapi 20 definisi topik, cross-link inline antar-post, dan angka `impact` hanya
  bisa ditulis pemilik situs — dijadwalkan sebagai **M7** terpisah atas keputusan user
  (2026-07-29). Sampai itu, slot-slot tersebut wajib memakai empty state yang anggun,
  bukan placeholder yang tampil ke publik.
- Follow-up: seluruh pelaksanaan ada di M6 (T-45 s/d T-62, lihat `docs/TASK.md`);
  konten editorial di M7 (T-63 s/d T-65).
