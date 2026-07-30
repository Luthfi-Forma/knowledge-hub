# Project State — knowledge-hub

<!-- SNAPSHOT file: overwrite it, do not append. Updated at every session close
     by /project-status, grounded in git log — not recall. -->

- Updated: 2026-07-30
- Milestone: M1–M6 selesai (satu pengecualian tercatat: T-36 baseline
  Lighthouse, lihat "Blockers" di bawah). **M6 "Atlas" tutup total**
  (S1–S5, T-45–T-62). M7 (lapisan editorial, T-63–T-65) menunggu input
  yang cuma bisa ditulis pemilik situs — lihat "Aksi tersisa untuk user".

## Current status

Situs live di
[knowledge-hub-inky.vercel.app](https://knowledge-hub-inky.vercel.app), repo
[github.com/Luthfi-Forma/knowledge-hub](https://github.com/Luthfi-Forma/knowledge-hub)
(public) terhubung ke Vercel — tiap push ke `main` auto-deploy. **Belum
di-push** — 18 commit M6 ada di `main` lokal, keputusan push menunggu user
(lihat "Next steps").

Situs sekarang punya **satu identitas visual, "Atlas"** — dual-mode
Reading/Immersive (M5) sudah dibongkar total (ADR-004). 9 token warna
berperan ketat (`--color-research`/`--color-project`/`--color-flag`
menggantikan satu `--color-accent` serba-guna), tipografi Archivo (self-
hosted, sumbu `wdth`) + IBM Plex Mono untuk notasi, radius nol di seluruh
sistem, satu wadah konten `Plate` (3 ukuran) menggantikan PostCard+
PostListItem, rail legenda 224px permanen (`LegendRail`+`TopicChip`) yang
jadi drawer di <1024px, collar 2-baris (nav 4 item + breadcrumb notasi) di
setiap halaman, dan search sungguhan (dialog Pagefind, token Atlas, buka
lewat tombol/`/`, tutup `Esc`).

IA final: **Index** (`/`, Sheet Index — 1 lead plate + grid standard, filter
tipe via `/explore/[type]` yang memakai ulang komposisi yang sama) ·
**Topics** (`/topics` + `/topics/[topic]`, menggantikan `/tags`, topik
bertetangga dihitung dari co-occurrence tag) · **Projects** (`/projects/
[name]`, repo/demo sebagai kontrol) · **About** (`/about`, satu komposisi
Dossier dengan kontak dipromosikan ke kartu fakta). Photography turun jadi
sekunder (dijangkau dari Footer). `/posts/[slug]` **tidak berubah URL-nya**
— rail marginalia baru (stamp, project, topics, related plates) di
sampingnya. 404 dapat mini type-legend. `vercel.json` baru menangani 3
redirect 308 (`/explore→/`, `/tags→/topics`, `/tags/:tag→/topics/:tag`) —
**belum teruji di produksi sungguhan**, cuma diverifikasi statis, karena
redirect Vercel hanya berlaku di edge produksi dan M6 belum di-push.

Aksesibilitas: skip-link ke `#main` (WCAG 2.4.1), `aria-current="page"` di
nav, ring fokus `2px solid var(--color-research)` di semua kontrol, semua
kontrol+chip ≥44px (termasuk `TopicChip`'s target sentuh via `::after`
tak-terlihat), 15 chart Recharts dapat tabel data `sr-only` (WCAG 1.1.1),
`useReducedMotion()` dipanggil di 28 fungsi `Viz*` lintas 4 modul
scrollytelling (bukan cuma shell-nya).

OG image (`lib/og-image.ts`) ikut Atlas — palet + Archivo/IBM Plex Mono,
Bodoni Moda/Karla dilepas total dari repo (fungsional maupun font file).

**Sengaja mati** (bukan regresi — dicatat ADR-004): registration seam
(M5/T-42), carousel drag Featured Projects (M4/T-24), toggle mode.

**Aksi tersisa untuk user (bukan kode):**
1. **Push M6 ke `main` remote** — 18 commit lokal, belum dikirim. Situs
   live masih menyajikan build M5 lama sampai ini terjadi.
2. Aktifkan Web Analytics manual di dashboard Vercel (belum berubah sejak
   M3 — toggle akun, tidak bisa disentuh dari kode).
3. T-36 (baseline Lighthouse resmi) — jalankan PageSpeed Insights dari
   browser asli (bukan sesi ini), atau berikan API key PSI. Lihat
   "Blockers" di bawah.
4. **M7**: 20 definisi topik, 3–5 cross-link inline per post, angka
   `impact` sebagian post — semuanya cuma bisa ditulis pemilik situs.

## Sesi ini (M6 Atlas — S4+S5 penutup, T-59–T-62, 2026-07-30)

4 commit (T-59, T-60, T-61 kode; T-62 dokumentasi murni), menutup M6
total. Detail penuh tiap task ada di `docs/TASK.md` Done — ringkasan:

- **T-59**: `useReducedMotion()` di 28 fungsi `Viz*` lintas 4 modul
  scrollytelling (3 kelas motion di-gate: `motion.div`/`circle` via
  ternary duration, Recharts via `isAnimationActive`, `AnimatedNumber`
  rAF kustom). 15 tabel data `sr-only` untuk tiap chart Recharts (cakupan
  sengaja dibatasi ke Recharts, bukan visual kustom). Bug dorman
  ditemukan di `AnimatedNumber` Cikarang (`useState(value)` bukan
  `useState(0)` — animasinya sudah lama tak pernah bergerak), sengaja
  tidak diperbaiki (di luar scope).
- **T-60**: dialog search sungguhan di `Header.astro` (buka tombol/`/`,
  tutup `Esc`/backdrop/close), Pagefind direstyle ke token Atlas — menutup
  DEBT #1. Bug ditemukan & diperbaiki: override `--pagefind-ui-*` perlu
  `html:root` bukan `:root` polos, karena stylesheet Pagefind di-load
  belakangan (JS-injected) dan menang dasi spesifisitas by source order.
- **T-61**: OG image (`lib/og-image.ts`) pindah ke palet+font Atlas; 4 TTF
  baru dari fontsource.org (bukan variable font situs — satori/resvg
  tidak menangani woff2/`wdth`-nya), 3 TTF Bodoni/Karla lama dihapus.
- **T-62**: 14 item verification checklist handoff **semua lolos**
  (diperiksa satu per satu — grep statis untuk yang bisa, `astro preview`
  sungguhan untuk sisanya: rail/legenda/topic-chip/skip-link/focus-ring/
  aria-current/44px/post-tanpa-cover). Remeasurement transfer 4 rute via
  `astro preview` lokal (bukan URL live — M6 belum di-push; gzip bukan
  brotli — `astro preview` tidak menegosiasikan brotli; kedua penyimpangan
  metodologi dari T-36/T-44 ditandai eksplisit di `docs/TESTING.md`).
  Bundle scrollytelling ~209 KB gzip, nyaris flat vs. baseline T-36/T-44
  (~215–220 KB br) — T-59 tidak menambah bobot berarti. 6 dokumen
  diperbarui: ROADMAP (M6 done), CHANGELOG (full pass pertama sejak M5),
  DEBT (nol entri baru), LESSONS (2 entri baru — koreksi teknik
  verifikasi `window.innerWidth`, spesifisitas `html:root` vs `:root`
  untuk widget pihak ketiga), RULES (durasi motion 120/200/300ms,
  digrounding dari `grep` pola yang benar-benar dipakai).

Dua lesson baru dari sesi ini (`docs/memory/LESSONS.md`, 2026-07-30):
(1) `window.innerWidth`/`getBoundingClientRect()` **juga** tidak bisa
dipercaya di tooling Browser-pane ini saat elemen `position:fixed` ada di
DOM — bukan cuma `scrollWidth` seperti dicatat T-55; `document.
documentElement.clientWidth` yang benar. (2) Menimpa custom property
`:root` milik widget pihak ketiga yang stylesheet-nya dimuat belakangan
(lazy-loaded) butuh selector lebih spesifik dari `:root` (`html:root`),
bukan cuma urutan file sumber — cascade menang lewat urutan DOM saat
render, bukan urutan penulisan.

`npm run build` hijau tiap task, 44 halaman. Gate `grep` hex literal: nol
di keempat modul scrollytelling.

## Last session (M6 Atlas — S1, S2, S3, 2026-07-29)

14 commit (T-45–T-58, menutup S1–S3). Ringkasan singkat (detail penuh di
`docs/TASK.md` Done, tidak diulang di sini):

- **S1 — Fondasi**: bundel handoff masuk repo; ADR-004; dual-mode
  dibongkar total; 9 token warna Atlas; radius nol; Archivo+IBM Plex Mono.
- **S2 — Komponen inti**: `Plate.astro`; `LegendRail`+`TopicChip`; collar
  2-baris + skip-link; bahasa kontrol 4 tingkat; Footer 4 kolom.
- **S3 — IA & route**: `lib/topics.ts` (co-occurrence); `/tags` →
  `/topics`; `/` jadi Sheet Index; halaman topik; rail marginalia post;
  `/projects/[name]`, `/about` (Dossier), `/photography`, `404`.

3 bug nyata ditemukan & diperbaiki lewat pengujian sungguhan (bukan
diklaim beres dari kode): `Plate`'s kolom cover tidak menyempit di layar
sempit (T-55); komentar `global.css` dengan `*/` literal menutup komentar
CSS lebih awal (T-56); TOC dirender dua kali karena Astro scoped style
tidak menembus batas komponen anak (T-57). 2 penyimpangan sadar dari
rencana awal (keduanya dijelaskan di TASK.md): `/photography` tidak
memakai `Plate` sama sekali; `/about` Experience menampilkan semua 9 role.

## Next steps

1. **Push ke `main` remote** — 18 commit M6 lokal siap; situs live masih
   menyajikan M5 sampai ini terjadi. Tunggu keputusan eksplisit user.
2. **M7** (T-63–T-65) — 20 definisi topik, 3–5 cross-link inline per post,
   angka `impact` sebagian post. Ketiganya butuh input pemilik situs;
   tidak ada task M7 yang bisa dikerjakan tanpa itu lebih dulu.
3. T-36 (baseline Lighthouse resmi) masih di Backlog — perlu user
   menjalankan PageSpeed Insights dari browser asli, atau memberi API key.
4. T-20/T-21 (custom domain, arsip repo lama) masih di Backlog.

## Blockers

**T-36 (baseline Lighthouse resmi)** — dicoba 2x di sesi berbeda (2026-07-28
dan 2026-07-29) lewat 3 jalur (PSI web UI, PSI API via WebFetch, PSI API
via `curl`): UI macet di polling, API konsisten 429 (keyless quota) di
kedua percobaan. Tidak dicoba ulang di sesi ini (T-62) — sudah dua kali
gagal identik, mengulang lagi tidak menambah informasi. Bukan sesuatu
yang bisa diperbaiki dari sisi kode — perlu user menjalankan PageSpeed
Insights dari browser sungguhan, atau memberi API key PSI. Data pengganti
(berat transfer produksi nyata) ada di `docs/TESTING.md`.

## Open questions

None — lihat "Open questions" di docs/ARCHITECTURE.md untuk yang
arsitektural.
