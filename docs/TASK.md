# Tasks — knowledge-hub

- Updated: 2026-07-28

<!-- Rules:
     - No coding before the work exists as a task here (CLAUDE.md, Session protocol).
     - A task is small enough to finish in one session; otherwise split it.
     - Format: "- [ ] T-NN: verb-first description (milestone)".
     - Done tasks move to Done with their completion date; prune Done monthly. -->

## Now

**M5 · S1 — Etalase.** Semua item di bawah terverifikasi lewat membaca diff;
nol risiko arsitektural. Dikerjakan lebih dulu karena kriteria sukses
PROJECT_BRIEF (`post → project hub → repo/demo` dalam ≤ 2 klik) hari ini
putus di setiap sambungan.

- [ ] T-31: tambah `repo:` + `demo:` ke 3 post `type: project`; perbaiki org salah di `building-knowledge-hub.mdx:7` (`afrezahernanda` → `Luthfi-Forma`, saat ini 404); telusuri jalur ≤ 2 klik secara manual dan catat hasilnya di `docs/TESTING.md` (M5)
- [ ] T-33: `cover:` + 3–5 screenshot ber-caption di dalam body tiap case study; mematikan 3 placeholder krem di Featured Projects (`PostCard` fallback saat `cover` kosong); OG image ikut ter-regenerate otomatis (M5)
- [ ] T-36: ukur baseline Lighthouse via PageSpeed Insights (web UI — tanpa install, tanpa hak admin) untuk `/` dan satu post scrollytelling; catat di `docs/TESTING.md`. Target ≥ 90 di brief belum pernah diukur sekali pun (M5)

## Next

**M5 · S2 — Fondasi dual-mode** (kunci arsitektural; kalau gagal, hentikan
sebelum S3)

- [ ] T-37: ADR-003 — 3 klausa: Tier-0 CSS platform features; Tier-1 vanilla diizinkan di layout global dengan anggaran byte sementara hidrasi framework tetap dilarang (reinterpretasi ADR-002 klausa 4, diputuskan user 2026-07-28); dual-mode sebagai remap token pada `data-mode`, bukan pohon route kedua (M5)
- [ ] T-38: blok `:root[data-mode="immersive"]` di `global.css` **di dalam `@layer base`** — remap 8 token warna + `--font-display`/`--font-body` yang sudah ada, **bukan** token paralel. Terverifikasi: 0 hex literal & 72 `var(--color-*)` di 4 modul scrollytelling + island, 26 `.astro` memakai utility token — jadi seluruh situs ikut berganti identitas tanpa edit React (M5)
- [ ] T-39: `ModeController` Tier-1 — script `is:inline` pra-paint membaca `localStorage` dan menstempel `data-mode` sebelum first paint (nol FOUC); tombol toggle di `Header.astro`; script yang sama meng-inject `<link>` font Immersive hanya saat mode immersive supaya Reading Mode tidak membayar sebyte pun (M5)

**M5 · S3–S5**

- [ ] T-40: identitas DATUM di homepage — collar lembar survei (judul seri, nomor sheet, tick lintang, string proyeksi/datum), field graticule CSS murni (`repeating-linear-gradient` + crosshair SVG data-URI, tanpa aset gambar/canvas), plate berhatch per `type` dengan koordinat asli, legenda-sebagai-filter ke `/explore/[type]`. Penempatan diturunkan dari `type` + `date` — **bukan** 11 `grid-area` tulis tangan (pajak pemeliharaan tiap post baru) (M5)
- [ ] T-41: tetapkan tipografi Immersive — self-hosted woff2; bukan Bodoni/Karla, dan Fraunces/Playfair/Inter/Space Grotesk terlarang sebagai penanda AI-generik. Usulan awal: Archivo Expanded / Spectral / Spline Sans Mono (M5)
- [ ] T-42: registration seam — overlay fixed `clip-path: inset(0 calc(100% - var(--seam)) 0 0)`, digerakkan `pointerdown`/`pointermove` + `setPointerCapture`, grip `role="slider"` dengan arrow/Home/End. Tanpa `rAF`, tanpa clone DOM. Plus `@view-transition { navigation: auto }` CSS murni — **bukan** `<ClientRouter />`, yang akan merusak init carousel di `FeaturedProjects.astro` dan injeksi Pagefind di `explore/index.astro` (M5)
- [ ] T-43: perluas Immersive ke `/explore` + `/about`; layout mobile terpisah untuk collar (di 375px, collar 88px vertikal + 112px horizontal terlalu rakus — butuh desain kedua, bukan penyusutan) (M5)
- [ ] T-44: tutup M5 — ukur ulang Lighthouse, tulis aturan motion ke `docs/RULES.md` (bukan file `docs/MOTION.md` baru), perbarui ROADMAP/STATE/CHANGELOG (M5)

## Backlog

- [ ] T-20: custom domain — user eksplisit menunda ini ("belum butuh", 2026-07-17); putuskan nama domain (open question ARCHITECTURE.md), konfigurasi DNS + Vercel saat diminta (M3)
- [ ] T-21: arsipkan repo `Website_Portfolio` lama — task terakhir M3, setelah custom domain live & konten/foto termigrasi penuh dari T-13/T-19 (M3)

## Done

- [x] T-01: init proyek Astro + Tailwind + MDX, struktur folder content collection `posts` (M1) — 2026-07-16
- [x] T-02: definisikan schema frontmatter zod + 1 post contoh yang lolos validasi; buktikan build gagal pada frontmatter invalid (M1) — 2026-07-16
- [x] T-03: buat layout dasar + halaman Home (Hero, Featured, Latest, Contact) dan Explore sederhana (M1) — 2026-07-16
- [x] T-04: halaman detail post `[slug]` + halaman About placeholder + 404 (M1) — 2026-07-16
- [x] T-05: tulis case study #1 — Jabodetabek-Connect (English) (M1) — 2026-07-16
- [x] T-06: tulis case study #2 — Jakarta Transit Heritage Explorer (English) (M1) — 2026-07-16
- [x] T-07: tulis case study #3 — CDMP-Jabodetabek (English) (M1) — 2026-07-16
- [x] T-08: hubungkan repo GitHub + deploy Vercel, verifikasi URL publik (M1) — 2026-07-16
- [x] T-09: filter tag di Explore + halaman `/tags/[tag]` (M2) — 2026-07-17
- [x] T-10: related posts by shared tags/project (M2) — 2026-07-17
- [x] T-11: project hub pages `/projects/[name]` (M2) — 2026-07-17
- [x] T-12: Pagefind search (M2) — 2026-07-17
- [x] T-13: migrasi konten + foto dari Website_Portfolio lama (M2) — 2026-07-17
- [x] T-14: tentukan & terapkan identitas visual final (tipografi, palet, komposisi) menggantikan token provisional M1 (M3) — 2026-07-17
- [x] T-15: About/CV jadi lebih interaktif — timeline pengalaman dengan entri yang bisa di-expand, konten baru digali dari portfolio lama (M3) — 2026-07-17
- [x] T-16: OG image per post (Satori + resvg, statis) + og:/twitter: meta tags site-wide (M3) — 2026-07-17
- [x] T-17: sitemap + RSS feed + robots.txt (M3) — 2026-07-17
- [x] T-18: pasang Vercel Web Analytics (`@vercel/analytics/astro`) — perlu diaktifkan manual sekali di dashboard Vercel (M3) — 2026-07-17
- [x] T-19: section photography — `type: "photo"` + `/photography` grid + 3 foto nyata (Tanggamus, Lampung, Okt 2022) (M3) — 2026-07-17
- [x] T-22: lebur `type: journal` ke `article` — hapus enum & POST_TYPES, migrasi 1 post (`building-knowledge-hub.mdx`) (M4) — 2026-07-17
- [x] T-23: polish baca Article ala Medium — drop cap, pull-quote, lebar ukur (measure) lebih sempit, khusus `type: article` (M4) — 2026-07-17
- [x] T-24: carousel drag kiri/kanan di Featured Projects (Home) — vanilla script + scroll-snap per ADR-002 (M4) — 2026-07-18
- [x] T-25: Research scrollytelling (pilot) — React island (ADR-002 tier 2), re-skin cream-paper, opt-in via `presentation: "scrollytelling"` frontmatter (scoped to `type: research`). Pilot: `cikarang-industrial-settlement-pattern`, dengan citation ke versi published-nya (Rahman & Hernanda 2025, Jurnal Tunas Geografi) (M4) — 2026-07-18
- [x] T-27: scrollytelling full-replace — narasi MDX lama dihapus total (bukan append lagi); skip `<h1>`/dek/cover/TOC/body untuk post scrollytelling, meta row tanpa "min read"; generalisasi gating (`isScrollytelling` + branch per-post eksplisit) supaya post scrollytelling berikutnya jadi diff mekanis (M4) — 2026-07-18
- [x] T-28: scrollytelling `bontang-poverty-mapping` — reframe sebagai studi kasus Bontang di dalam Kajian Pemetaan Karakteristik Masyarakat Miskin Prov. Kaltim (Bappeda Kaltim, 2023); Bontang satu-satunya kab/kota 100% tuntas saat laporan dibuat (7 section: konteks provinsi, metode 2-jalur, kenapa Bontang, peta hotspot, close-up Kelurahan Tanjung Laut Indah, status rollout 9 kab/kota lain) (M4) — 2026-07-18
- [x] T-29: scrollytelling `jabung-lampung-coastal-development` — koreksi metodologi (Analisis Skalogram 12 kecamatan + SWOT, bukan gravity model — kata "gravity" tidak muncul sama sekali di laporan 93 halaman) → zonasi Agropolitan (Bandar Sribhawono) & Minapolitan (Labuhan Maringgai, Pasir Sakti), 3 skenario capaian (M4) — 2026-07-18
- [x] T-34: terjemahkan label & caption chart Indonesia → English di 4 modul `src/lib/scrollytelling/*.tsx` — lingkupnya ternyata jauh lebih luas dari 8 kemunculan yang tertandai semula: data label chart (Kelas 1–5, status desa, tenure TLI, skenario, dll.), caption di bawah chart, `vizCitation.fig`/`source` (dirender sebagai "Drawn from" untuk tiap section, bukan cuma section aktif), locator `citations[].where` di panel "Sources for this claim" (dirender untuk semua section), heading "Sumber" → "Source", dan format angka `toLocaleString('id-ID')` → `'en-US'`. Istilah resmi tata ruang yang sudah dipakai apa adanya di body prose English (RTRW, PKL/PKLp/PPK/PPL, Skalogram, Hierarki, IPD, kecamatan/kelurahan/kabupaten-kota, Sasaran 1/2, P3KE, AMDAL) sengaja **dipertahankan** sebagai loanword, mengikuti preseden yang sudah ada di teks post — bukan luput tak sengaja. Judul dokumen sumber yang dikutip literal tetap dalam Bahasa Indonesia (praktik sitasi standar, tidak menerjemahkan judul karya). Terverifikasi lewat `npm run build` + grep pada `dist/`: nol sisa Indonesia pada seluruh teks yang ter-SSR (M5) — 2026-07-28
- [x] T-32: "Project: X" jadi link nyata — `<span>` → `<a href="/projects/...">` di `src/pages/posts/[slug].astro`, memakai `getProjectTitle()` supaya labelnya sama dengan halaman `/projects`; sebelumnya post → project hub adalah nol klik (M5) — 2026-07-28
- [x] T-35: perbaikan aset & a11y — `portrait.png` dipindah ke `src/assets/` + `<Image>` (982.410 → 11.892 byte webp, −98,8%); dua `repeat: Infinity` di `cikarang-industrial-settlement-pattern.tsx` jadi sekali putar (WCAG 2.2.2); net `prefers-reduced-motion` global di `global.css` (sengaja unlayered + `!important` — kebalikan dari reset heading, karena harus menang atas scoped `<style>` di `about.astro`/`FeaturedProjects.astro`); `--font-mono` didefinisikan (dipakai 8× tapi tidak pernah ada, diam-diam jatuh ke default Tailwind) (M5) — 2026-07-28
- [x] T-30: scrollytelling `rpplh-south-papua` — Food Estate 1,2 juta ha/6 distrik vs. 471.026 ha ruang budaya adat tumpang-tindih (7 kategori), skor jasa lingkungan (74,63% pangan kelas-4, 67,88% kehati kelas-5), status desa IPD (89% tertinggal/sangat tertinggal), temuan lapangan (200 ekskavator, 135/140km jalan tanpa AMDAL), tradisi Sasi OAP (M4) — 2026-07-18
<!-- - [x] T-00: example (M1) — 2026-01-01 -->
