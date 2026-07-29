# Project State — knowledge-hub

<!-- SNAPSHOT file: overwrite it, do not append. Updated at every session close
     by /project-status, grounded in git log — not recall. -->

- Updated: 2026-07-29
- Milestone: M1–M5 selesai (satu pengecualian tercatat: T-36 baseline
  Lighthouse, lihat "Blockers" di bawah). Tidak ada task aktif di
  TASK.md Now.

## Current status

Situs live di
[knowledge-hub-inky.vercel.app](https://knowledge-hub-inky.vercel.app), repo
[github.com/Luthfi-Forma/knowledge-hub](https://github.com/Luthfi-Forma/knowledge-hub)
(public) terhubung ke Vercel — tiap push ke `main` auto-deploy. 11 post
nyata. Situs sekarang punya **dua identitas visual penuh**, dipilih
pengunjung lewat toggle persisten di Header atau registration seam yang
bisa diseret di homepage:

- **Reading Mode** (default) — identitas krem final M3: kertas krem
  `#F5EFE1`, ink `#18140F`, aksen hijau `#38523A`, Bodoni Moda + Karla.
  Tidak diubah sedikit pun selama M5.
- **Immersive Mode** ("DATUM") — identitas kedua dari nol: hampir-hitam
  `#05090C`, teks bone `#DBE2DE`, aksen hijau cerah `#5A8D5D`, tipografi
  Archivo (variable font, sumbu `wdth`+`wght`, self-hosted). Homepage,
  `/explore`, dan `/about` masing-masing punya komposisi Immersive sendiri
  (DATUM index berkolom-per-tipe, atau dossier untuk About); halaman lain
  otomatis ikut berganti palet/font lewat remap token tanpa komposisi
  bespoke.

Mekanisme dual-mode (ADR-003): remap 8 custom property CSS yang sama di
`:root[data-mode='immersive']`, **bukan** island kedua atau route
terpisah — nol fetch runtime, nol duplikasi build, nol duplikasi indeks
Pagefind. Terverifikasi: klausa 4 ADR-002 ("tidak pernah island di layout
global") tetap utuh — toggle dan seam keduanya Tier-1 vanilla, bukan React.

Situs juga tetap punya semua fitur M1–M4: carousel drag Featured Projects,
Explore (filter + search Pagefind), detail post (+TOC, related posts, OG
image — diskip untuk 4 post scrollytelling), halaman tag, project hub
(sekarang dengan repo/demo link nyata + cover art digenerate — lihat di
bawah), About dengan timeline interaktif, `/photography`, 404, sitemap +
RSS + robots.txt, Vercel Web Analytics.

**Aksi tersisa untuk user (bukan kode):**
1. Aktifkan Web Analytics manual di dashboard Vercel (belum berubah sejak
   M3 — toggle akun, tidak bisa disentuh dari kode).
2. T-36 (baseline Lighthouse resmi) — jalankan PageSpeed Insights dari
   browser asli (bukan sesi ini), atau berikan API key PSI. Lihat
   "Blockers" di bawah.

## Last session (M5 — DATUM, 2026-07-28 s/d 2026-07-29)

Dipicu dokumen visi "Knowledge Hub 2.0" milik user. Brainstorming 14 agent
(2 workflow) menemukan situs gagal memenuhi kriteria suksesnya sendiri
(`post → project hub → repo/demo` ≤ 2 klik, putus di setiap sambungan) —
diperbaiki lebih dulu (S1) sebelum kerja visual apa pun. Tujuan yang
menentukan seluruh arah: user menyatakan target 12 bulannya adalah
**situsnya sendiri sebagai bukti kemampuan teknis** — itu sebabnya
identitas kedua dibangun, bukan sekadar konten ditambah.

**S1 — Etalase** (T-31–T-35): `repo:`/`demo:` nyata di 3 post project +
perbaikan org repo salah; `Project: X` jadi link nyata; cover art project
**digenerate** (SVG editorial + `@resvg/resvg-js`, bukan screenshot — atas
arahan eksplisit user, masing-masing mengkodekan fakta nyata dari post-nya
seperti "13 lines · 128 stations"); portrait.png dipindah ke `astro:assets`
(−98,8% ukuran); dua animasi `repeat: Infinity` dihapus (kegagalan WCAG
2.2.2); net `prefers-reduced-motion` global ditambah; terjemahan penuh
label/caption chart Indonesia→English di 4 modul scrollytelling (lingkupnya
jauh lebih luas dari perkiraan awal — lihat LESSONS.md).

**S2 — Fondasi dual-mode** (T-37–T-39): ADR-003 memperjelas klausa 4
ADR-002 sebagai larangan hidrasi framework, bukan larangan byte; blok
remap 8 token warna yang sudah ada di `@layer base` (bukan token
paralel — terverifikasi 0 hex literal & 72 `var(--color-*)` di 4 modul
scrollytelling, jadi seluruh situs ikut berganti tanpa edit React);
`ModeController` Tier-1 (script pra-paint + tombol toggle, ~325 byte gzip).

**S3 — Identitas DATUM** (T-40–T-41): `ImmersiveIndex.astro` — homepage
jadi indeks lembar survei bergraticule, plate berkoordinat asli (field
`coordinates` baru di schema, diisi 10/11 post dari koordinat desimal
nyata), kolom-per-tipe dengan legenda-sebagai-filter. Tipografi Archivo
(variable font self-hosted, disederhanakan dari usulan awal 3-keluarga
jadi 1 — sumbu lebarnya sendiri sudah jadi "payload kartografis").

**S4 — Registration seam** (T-42): grip yang bisa diseret untuk mengupas
Reading dan mengungkap Immersive di bawahnya (`clip-path`, tanpa clone
DOM, tanpa `rAF`), plus `@view-transition { navigation: auto }` CSS murni
untuk crossfade antar halaman. Dua bug aksesibilitas/mobile nyata
ditemukan lewat pengujian dan diperbaiki (grip tak fokusabel saat
istirahat; grip terpotong di layar sempit).

**S5 — Perluasan + penutupan** (T-43–T-44): Immersive diperluas ke
`/explore` (pakai ulang `ImmersiveIndex`) dan `/about` (komposisi baru,
`ImmersiveDossier.astro`). Aturan motion dikonsolidasi ke `docs/RULES.md`.
T-36 (baseline Lighthouse) dicoba ulang, tetap terblokir tooling — lihat
Blockers.

**Pola verifikasi berulang sepanjang M5** (detail lengkap di
`docs/memory/LESSONS.md`): browser tool sesi ini tidak reliably
me-repaint elemen yang sudah dirender setelah custom property CSS-nya
dimutasi via JS pasca-paint (ditemukan 2x, di `background-color` T-39 dan
di `clip-path`/`left` berbasis `clamp()` T-42) — pola verifikasi yang
terbukti andal: reload sungguhan dengan state (`localStorage`) diisi
lebih dulu, bukan mutasi-lalu-baca. Solusinya juga sekaligus jadi kode
yang lebih baik: nilai yang harus benar di first paint ditulis di CSS
lewat selector `:root[data-mode='immersive']`, bukan diserahkan ke script.

Semua 7 commit M5 bersih ter-push ke `main`. Detail lengkap tiap task ada
di `docs/TASK.md` (Done); rasionale arsitektur di ADR-003 dan
`docs/RULES.md` "Motion rules".

## Next steps

1. Tidak ada task M5 aktif — tunggu arahan user untuk M6 atau permintaan
   baru.
2. T-36 (baseline Lighthouse resmi) masih di Backlog — perlu user
   menjalankan PageSpeed Insights dari browser asli, atau memberi API key.
3. T-20/T-21 (custom domain, arsip repo lama) masih di Backlog, menunggu
   keputusan user kapan pun.
4. Kandidat M6 yang digerbangi (bukan dibunuh) selama brainstorming M5 —
   lihat `docs/ROADMAP.md` "Digerbangi, bukan dibunuh": knowledge graph
   SVG statis, digerbangi pada ≥20 post dan ≥15 cross-link inline
   (hari ini nol cross-link ada di seluruh body MDX).
5. Font Spectral (dari usulan tipografi Immersive awal) sengaja belum
   di-self-host — baru relevan kalau ada prosa panjang sungguhan di
   Immersive Mode (mis. kalau /posts/[slug] dapat komposisi Immersive
   sendiri di masa depan).

## Blockers

**T-36 (baseline Lighthouse resmi)** — dicoba 2x di sesi berbeda (2026-07-28
dan 2026-07-29) lewat 3 jalur (PSI web UI, PSI API via WebFetch, PSI API
via `curl`): UI macet di polling, API konsisten 429 (keyless quota) di
kedua percobaan. Bukan sesuatu yang bisa diperbaiki dari sisi kode —
perlu user menjalankan PageSpeed Insights dari browser sungguhan, atau
memberi API key PSI. Data pengganti (berat transfer produksi nyata,
diukur ulang setelah M5 selesai) ada di `docs/TESTING.md` — mengonfirmasi
mekanisme dual-mode menambah <1KB JS ke halaman scrollytelling terberat.

## Open questions

None — lihat "Open questions" di docs/ARCHITECTURE.md untuk yang
arsitektural.
