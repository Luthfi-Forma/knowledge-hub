# Project State — knowledge-hub

<!-- SNAPSHOT file: overwrite it, do not append. Updated at every session close
     by /project-status, grounded in git log — not recall. -->

- Updated: 2026-07-30
- Milestone: M1–M5 selesai (satu pengecualian tercatat: T-36 baseline
  Lighthouse, lihat "Blockers" di bawah). **M6 "Atlas" — S1, S2, S3 selesai,
  S4 sebagian** (T-45–T-59); T-60 (S4) dan S5 (T-61–T-62) tersisa. M7
  (lapisan editorial, T-63–T-65) menunggu setelah M6 tutup.

## Current status

Situs live di
[knowledge-hub-inky.vercel.app](https://knowledge-hub-inky.vercel.app), repo
[github.com/Luthfi-Forma/knowledge-hub](https://github.com/Luthfi-Forma/knowledge-hub)
(public) terhubung ke Vercel — tiap push ke `main` auto-deploy. **Belum
di-push sesi ini** — 14 commit M6 baru ada di `main` lokal.

Situs sekarang punya **satu identitas visual, "Atlas"** — dual-mode
Reading/Immersive (M5) sudah dibongkar total (ADR-004). 9 token warna
berperan ketat (`--color-research`/`--color-project`/`--color-flag`
menggantikan satu `--color-accent` serba-guna), tipografi Archivo (self-
hosted, sumbu `wdth`) + IBM Plex Mono untuk notasi, radius nol di seluruh
sistem, satu wadah konten `Plate` (3 ukuran) menggantikan PostCard+
PostListItem, rail legenda 224px permanen (`LegendRail`+`TopicChip`) yang
jadi drawer di <1024px, dan collar 2-baris (nav 4 item + breadcrumb notasi)
di setiap halaman.

IA final: **Index** (`/`, Sheet Index — 1 lead plate + grid standard, filter
tipe via `/explore/[type]` yang memakai ulang komposisi yang sama) ·
**Topics** (`/topics` + `/topics/[topic]`, menggantikan `/tags`, topik
bertetangga dihitung dari co-occurrence tag) · **Projects** (`/projects/
[name]`, repo/demo sebagai kontrol) · **About** (`/about`, satu komposisi
Dossier dengan kontak dipromosikan ke kartu fakta). Photography turun jadi
sekunder (dijangkau dari Footer). `/posts/[slug]` **tidak berubah URL-nya**
— rail marginalia baru (stamp, project, topics, related plates) di
sampingnya. 404 dapat mini type-legend. `vercel.json` baru menangani 3
redirect 308 (`/explore→/`, `/tags→/topics`, `/tags/:tag→/topics/:tag`).

**Sengaja mati** (bukan regresi — dicatat ADR-004): registration seam
(M5/T-42), carousel drag Featured Projects (M4/T-24), toggle mode.

**Aksi tersisa untuk user (bukan kode):**
1. Aktifkan Web Analytics manual di dashboard Vercel (belum berubah sejak
   M3 — toggle akun, tidak bisa disentuh dari kode).
2. T-36 (baseline Lighthouse resmi) — jalankan PageSpeed Insights dari
   browser asli (bukan sesi ini), atau berikan API key PSI. Lihat
   "Blockers" di bawah.
3. **M7** (setelah M6 tutup): 20 definisi topik, 3–5 cross-link inline per
   post, angka `impact` sebagian post — semuanya cuma bisa ditulis pemilik
   situs.

## Sesi ini (M6 Atlas — S4 T-59, 2026-07-30)

Satu task, belum di-commit. T-59 (satu-satunya kerja sisi React S4):
`useReducedMotion()` sekarang dipanggil di 28 fungsi `Viz*` lintas 4 modul
`lib/scrollytelling/*.tsx` (sebelumnya cuma shell `islands/Scrollytelling.tsx`
yang memanggilnya, T-35) — men-gate 3 kelas motion (`motion.div`/`motion.circle`
via ternary duration/delay, Recharts `Bar`/`Line`/`Pie` via prop bawaan
`isAnimationActive`, `AnimatedNumber` kustom berbasis `requestAnimationFrame`
di 3/4 modul). Tabel data `sr-only` ditambah untuk 15 chart Recharts (bukan
untuk visual kustom non-Recharts — cakupan sengaja dibatasi persis sesuai
teks task, WCAG 1.1.1). Detail lengkap + bug dorman yang ditemukan
(`AnimatedNumber` Cikarang yang animasinya sudah lama tidak pernah bergerak)
ada di `docs/TASK.md` Done T-59.

Diverifikasi lewat teknik `docs/memory/LESSONS.md` (`client:load` +
`useState(ids[N])` sementara, karena `IntersectionObserver` tidak fire di
tooling Browser-pane sesi ini): 2 chart representatif diuji langsung dengan
data cocok 1:1 (Cikarang `BarChart`, Bontang `PieChart`), Jabung/RPPLH tidak
diuji terpisah (pola struktural identik, type-check + build sudah hijau).
`npm run build` hijau, 44 halaman. Gate `grep` hex literal: nol di keempat
modul.

## Last session (M6 Atlas — S1, S2, S3, 2026-07-29)

14 commit bersih di `main` (belum di-push): dari `a77f81f` (persiapan —
handoff dipindah ke `docs/design/atlas/`, ADR-004) sampai `ac88863` (T-58,
menutup S3). Task T-45 s/d T-58 selesai; detail lengkap tiap task ada di
`docs/TASK.md` Done (masing-masing punya paragraf verifikasi sendiri, tidak
diulang di sini).

**S1 — Fondasi** (T-45–T-49): bundel handoff masuk repo; ADR-004 (satu
identitas Atlas, ADR-003 Superseded sebagian — Tier-0/Tier-1 ADR-003 #1/#2
tetap berlaku); mekanisme dual-mode dibongkar total; 9 token warna Atlas
(`--color-chart-1/2` dipertahankan sebagai alias supaya nol edit React di
4 modul scrollytelling tetap benar); radius nol; tipografi Archivo+IBM Plex
Mono (Bodoni Moda/Karla dilepas).

**S2 — Komponen inti** (T-50–T-52): `Plate.astro` (satu wadah konten, 3
ukuran); `LegendRail.astro`+`TopicChip.astro` (rail permanen/drawer); collar
Header 2-baris + skip-link (menutup kegagalan WCAG 2.4.1 nyata) + bahasa
kontrol 4 tingkat + Footer 4 kolom.

**S3 — IA & route** (T-53–T-58): `lib/topics.ts` (co-occurrence, tanpa
daftar manual) + skema koleksi `topics` (kosong sampai M7); `/tags` →
`/topics` + `vercel.json` redirect; `/` jadi Sheet Index (disatukan dengan
`/explore/[type]` — satu komponen `SheetIndex`, dua rute); `/topics` +
`/topics/[topic]`; rail marginalia post detail; `/projects/[name]`,
`/about` (Dossier, kontak dipromosikan), `/photography`, `404`.

**3 bug nyata ditemukan & diperbaiki lewat pengujian sungguhan** (bukan
diklaim beres dari kode):
1. `Plate.astro`'s kolom cover lebar-piksel-tetap (300px untuk lead) tidak
   menyempit di layar sempit — pemanggil pertama yang benar-benar merender
   lead+cover (Sheet Index, T-55) baru mengekspos ini; T-50 sendiri tidak
   pernah menguji kombinasi itu. Diperbaiki: tumpuk vertikal di <480px.
2. Komentar sendiri di `global.css` (`.hatch-*/.control-*`) memuat `*/`
   literal yang menutup komentar CSS lebih awal — parser produksi gagal
   dengan warning yang nyaris terlewat karena build tetap "sukses" (T-56).
3. Selector `.post-main > nav` tidak pernah cocok karena `<nav>` adalah
   root element komponen ANAK (`TableOfContents.astro`) yang membawa
   scope-hash sendiri — Astro scoped style tidak menembus batas komponen
   (pola yang sama seperti `<Image>`'s `<img>` di Plate.astro, T-50).
   Kedua salinan TOC tampil sekaligus di mobile sampai diperbaiki dengan
   `:global(nav)` (T-57).

**2 penyimpangan sadar dari deskripsi task/rencana awal**, keduanya
dijelaskan alasannya di commit + TASK.md:
- `/photography` TIDAK memakai `Plate` sama sekali (rencana asli:
  "grid plate compact") — baik compact (tak pernah tampilkan cover) maupun
  standard (cover jadi kolom-samping kecil) tidak cocok untuk galeri foto;
  `PhotoTile.astro` dipertahankan & direstyle, bukan dihapus (T-58).
- Experience di `/about` menampilkan semua 9 role, bukan "3 + tombol lihat
  selebihnya" seperti Hi-Fi — dianggap kurang jujur untuk portofolio yang
  justru ingin menunjukkan riwayat kerja nyata (T-58).

**Pola verifikasi berulang** (detail di `docs/memory/LESSONS.md`): tab
browser baru dipakai setelah console log ditemukan menumpuk lintas-navigasi
di tab lama (bukan bug halaman); `astro preview` dipakai konsisten, bukan
dev server.

## Next steps

1. **Commit T-59** — kerja di working tree sesi ini belum di-commit; minta
   konfirmasi user dulu (aturan commit eksplisit).
2. T-60 — restyle Pagefind ke token Atlas, tutup `docs/memory/DEBT.md` #1.
3. T-61 — OG image ikut Atlas (palet + Archivo/IBM Plex Mono, hapus 3 TTF
   Bodoni/Karla).
4. T-62 — tutup M6: 14 item verification checklist handoff, remeasure
   berat transfer, **CHANGELOG diperbarui di sini** (sengaja belum
   disentuh sepanjang S1–S4, mengikuti pola M5/T-44 — full pass di
   task penutup milestone, bukan per-task).
5. **Belum di-push** — pertimbangkan push setelah M6 benar-benar tutup
   (T-62), atau lebih awal jika user memintanya secara eksplisit.
6. M7 (T-63–T-65) menunggu setelah M6 — lihat ROADMAP.md.
7. T-36 (baseline Lighthouse resmi) masih di Backlog — perlu user
   menjalankan PageSpeed Insights dari browser asli, atau memberi API key.
8. T-20/T-21 (custom domain, arsip repo lama) masih di Backlog.

## Blockers

**T-36 (baseline Lighthouse resmi)** — dicoba 2x di sesi berbeda (2026-07-28
dan 2026-07-29) lewat 3 jalur (PSI web UI, PSI API via WebFetch, PSI API
via `curl`): UI macet di polling, API konsisten 429 (keyless quota) di
kedua percobaan. Bukan sesuatu yang bisa diperbaiki dari sisi kode —
perlu user menjalankan PageSpeed Insights dari browser sungguhan, atau
memberi API key PSI. Data pengganti (berat transfer produksi nyata) ada di
`docs/TESTING.md`.

## Open questions

None — lihat "Open questions" di docs/ARCHITECTURE.md untuk yang
arsitektural.
