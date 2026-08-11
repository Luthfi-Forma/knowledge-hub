# Project State — knowledge-hub

<!-- SNAPSHOT file: overwrite it, do not append. Updated at every session close
     by /project-status, grounded in git log — not recall. -->

- Updated: 2026-08-09
- Milestone: **M10 "Story framework & lapisan spasial" aktif dan sebagian
  besar selesai.** T-71–T-77, T-80 selesai; T-79 selesai untuk 3 dari 4
  post. **T-78, migrasi Cikarang, dan T-81 semuanya terblokir oleh satu
  hal yang sama** (lihat Blockers).

## Current status

Situs live di
[knowledge-hub-inky.vercel.app](https://knowledge-hub-inky.vercel.app), repo
[github.com/Luthfi-Forma/knowledge-hub](https://github.com/Luthfi-Forma/knowledge-hub).
**11 commit sesi ini, semuanya sudah di-push** dan deploy diverifikasi live
tiga kali (setelah T-79 Jabung, setelah T-79 Bontang+RPPLH, setelah T-80).
43 file berubah, +4.849/−1.616.

**M10 dibuka dari `Konsep Milestone 10.txt`** yang diserahkan pemilik situs.
Konsep aslinya 5 sub-milestone — ukuran roadmap, bukan satu milestone.
Dipersempit bersama user jadi 2 (framework + spasial). Keputusan penuh di
[ADR-005](../decisions/ADR-005-story-framework.md); tiap penolakan berdiri
di atas aturan tertulis, bukan selera: Knowledge Graph kena gerbang ROADMAP
sendiri (≥20 post, masih 14), AI Layer kena non-goal backend, Immersive
ditafsir ulang jadi **focus mode per-story** sehingga ADR-004 tidak
tersentuh, library peta ditolak karena endpoint tile remote fungsinya
backend.

**Yang sudah hidup di produksi**: shell story statis (prosa kembali ke MDX),
stage digerakkan scroll dengan progress kontinu, proyeksi Web Mercator +
stage persisten yang bisa morph, 3 dari 4 post scrollytelling termigrasi
(Jabung, Bontang, RPPLH), 7 perbaikan audit desain, view-transition cover
antar-halaman, dan focus mode.

**Tes otomatis pertama proyek** ada sekarang: `npm test`, 14 suite, nol
dependensi baru (runner bawaan Node + type stripping). Sengaja sempit —
hanya menguji `computeStageState` dan proyeksi geo, dua hal yang `astro
build` tidak bisa cek **dan** browser di sesi ini tidak bisa jalankan.

**Dua bug konten nyata ditemukan lewat pengecekan aritmetika, bukan
membaca**: (1) `AnimatedNumber` menaruh `0` dan `0.0` di HTML statis Bontang
dan RPPLH tempat angka kemiskinan dan luas wilayah seharusnya — sudah
diperbaiki dan terverifikasi live (`238,464` dan `1.2`); (2) angka Cikarang
yang bertentangan (DEBT #5), yang memblokir sisa milestone.

## Sesi ini (M10 T-71–T-80, 2026-08-09)

Sesi sangat panjang, dibuka dengan `/emil-design-eng` + `/find-animation-opportunities`
atas permintaan user: audit desain situs+kode, cari peluang animasi, dan
rumuskan milestone baru dari file konsep.

Urutan kerja sengaja menaruh task **terverifikasi penuh** lebih dulu
(T-72–T-75 HTML statis atau fungsi murni) sebelum yang digerakkan scroll,
karena batasan tooling.

Yang layak diingat, karena tiap satu mengubah keputusan:

- **T-71 membatalkan dua keputusan yang sudah tertulis di draf ADR-005.**
  Diukur, bukan mengutip LESSONS lama: event `scroll` **tidak** menyala
  (jadi pindah dari IntersectionObserver tidak membeli verifiabilitas), dan
  `requestIdleCallback` tidak pernah menyala (jadi `client:idle` sama
  saja). Keduanya dikoreksi sebelum commit → `client:load`, dan matematika
  progress wajib fungsi murni dengan viewport di-inject.
- **T-75 membatalkan keputusan #1 ADR-005.** Prop yang dikirim ke
  `<Content />` **tidak sampai** ke body MDX (`Astro.props` melempar
  `ReferenceError`). Menganyam chrome frontmatter dengan prosa MDX
  per-scene **mustahil di Astro**, bukan sulit. Kicker+judul pindah ke
  MDX; sitasi tetap di frontmatter. Sambil itu ketahuan shell lama
  merender tiap sitasi **dua kali** dari array yang sama.
- **T-74 menemukan angka palsu yang sudah terbit** saat merekonsiliasi 3
  versi `AnimatedNumber`. Versi yang paling terlihat rusak (cikarang,
  tidak pernah beranimasi) justru satu-satunya yang benar — mengambil
  "dua versi yang cocok" sebagai mayoritas akan membakukan bug-nya.
- **T-78 dihentikan sebelum menulis konten**, karena verifikasi aritmetika
  menemukan angka yang bertentangan di post yang tayang (DEBT #5).
- **T-80 hampir membuat saya "memperbaiki" cascade yang tidak rusak.**
  Transisi CSS **tidak pernah maju** di tool ini, jadi `getComputedStyle`
  melaporkan nilai awal selamanya. Dicatat di LESSONS dengan metode
  verifikasinya.

Kesalahan saya sendiri yang tertangkap dan diperbaiki: mengarang hero
Jabung (ketahuan sebelum build, dibandingkan dengan modul lama), dan
pembungkus `<Chart>` menghilangkan baris total 471.026 ha di RPPLH.

## Last session (M9 T-70, 2026-08-04)

3 post `type: article` dari vault pribadi pemilik situs, Bahasa Indonesia,
nol kalimat prosa user diedit. Detail di `docs/TASK.md` Done.

## Next steps

1. **Semua langkah berikutnya menunggu satu hal: Tabel 1 paper Rahman &
   Hernanda (2025).** Tiga angka yang dibutuhkan ada di Blockers.
2. Setelah datanya jelas, urutannya: perbaiki angka Cikarang yang tayang →
   **T-78** (scene spasial dari geometri 5 distrik) → migrasi Cikarang ke
   shell baru → **T-81** (hapus `src/islands/Scrollytelling.tsx`, yang kini
   hanya dipakai Cikarang, lalu ukur bundle).
3. **DEBT #4 sudah diputuskan user (2026-08-09)**: tidak menambah devDeps
   sekarang. Evaluasi ulang setelah M10 tutup (T-81) — apakah pola
   "bangun modul sebelum konsumennya" akan berulang di milestone
   berikutnya. Kalau tidak, dependensinya memang tidak perlu.
4. **Aturan content-first M10 belum terpenuhi.** M10 sejauh ini menambah
   fitur, bukan konten — deliverable kontennya (T-78) justru yang
   terblokir. Ini harus ditutup sebelum M10 bisa disebut selesai.
5. T-36 (baseline Lighthouse resmi) masih di Backlog — perlu user
   menjalankan PageSpeed Insights dari browser asli, atau memberi API key.

## Blockers

**Angka Cikarang yang bertentangan (DEBT #5, severity high)** — memblokir
T-78, migrasi Cikarang, dan T-81 sekaligus.

Scene "Finding 01" di `cikarang-industrial-settlement-pattern` menyatakan
*"rose from 4,477.99 to 5,570.68 hectares, an addition of 687.45 hectares"* —
selisih kedua endpoint itu **+1.092,69**, bukan 687,45. Residensial sama:
selisih endpoint **+1.092,68** vs prosa 622,9. Panel itu merender kedua
versi berdampingan (bar chart dari `TOTAL_LAND` + counter `+687,45 ha`).
Absolut 2023 per distrik juga meleset 404,25 / 469,39 ha dari total.

**Yang dibutuhkan dari pemilik situs**, dari Tabel 1 paper:
1. Total industri & residensial untuk 2016 **dan** 2023.
2. Apakah 5 kecamatan Cikarang itu seluruh wilayah studi, atau sebagian?
3. Nilai 2016 per distrik, kalau tabelnya memuatnya.

**Hipotesis yang belum terbukti** (kalau benar, perbaikannya satu kalimat,
bukan satu dataset): tabel distrik mungkin mencakup 5 kecamatan saja
sementara `TOTAL_LAND` mencakup wilayah lebih luas — kalimatnya yang
mencampur dua cakupan, bukan angkanya yang salah.

Migrasi prosa Cikarang sengaja **ditahan** supaya kalimat bermasalah itu
tidak diedit dua kali.

**T-36 (baseline Lighthouse)** — tidak berubah, lihat `docs/TASK.md`.

## Open questions

1. ~~DEBT #4 devDeps~~ — **sudah diputuskan** (lihat Next steps).
2. Penilaian user atas **focus mode** dan **rasa gerak saat scroll asli** —
   keduanya di luar jangkauan verifikasi sesi ini (transisi CSS, rAF, dan
   event scroll semuanya mati di browser tool). Kalau scrollytelling terasa
   tersendat di HP, jalan keluarnya sudah disiapkan: `MotionValue`/
   `useTransform` yang melewati render React (ADR-005 Consequences).
3. Arsitektural: lihat "Open questions" di `docs/ARCHITECTURE.md` (custom
   domain). Catatan: dokumen itu sendiri kini **DEBT #6** — masih stempel
   2026-07-17 dan belum mencerminkan M6–M10. Paling murah ditulis ulang
   sekali saat M10 benar-benar tutup (T-81), bukan sekarang.
