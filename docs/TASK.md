# Tasks — knowledge-hub

- Updated: 2026-07-28

<!-- Rules:
     - No coding before the work exists as a task here (CLAUDE.md, Session protocol).
     - A task is small enough to finish in one session; otherwise split it.
     - Format: "- [ ] T-NN: verb-first description (milestone)".
     - Done tasks move to Done with their completion date; prune Done monthly. -->

## Now

**M5 · S1 — Etalase — selesai kecuali T-36 (ditunda user, lihat Backlog).**
Kriteria sukses PROJECT_BRIEF (`post → project hub → repo/demo` dalam
≤ 2 klik) sudah berfungsi lagi untuk ketiga project post.

**M5 · S2 — Fondasi dual-mode — selesai, terverifikasi.** Toggle
Reading/Immersive bekerja end-to-end (dites via reload sungguhan dengan
preferensi di `localStorage` — lihat `docs/memory/LESSONS.md` untuk gotcha
verifikasi terkait). Aman lanjut ke S3.

**M5 · S3–S5**

- [ ] T-41: tetapkan tipografi Immersive — self-hosted woff2; bukan Bodoni/Karla, dan Fraunces/Playfair/Inter/Space Grotesk terlarang sebagai penanda AI-generik. Usulan awal: Archivo Expanded / Spectral / Spline Sans Mono (M5)
- [ ] T-42: registration seam — overlay fixed `clip-path: inset(0 calc(100% - var(--seam)) 0 0)`, digerakkan `pointerdown`/`pointermove` + `setPointerCapture`, grip `role="slider"` dengan arrow/Home/End. Tanpa `rAF`, tanpa clone DOM. Plus `@view-transition { navigation: auto }` CSS murni — **bukan** `<ClientRouter />`, yang akan merusak init carousel di `FeaturedProjects.astro` dan injeksi Pagefind di `explore/index.astro` (M5)
- [ ] T-43: perluas Immersive ke `/explore` + `/about`; layout mobile terpisah untuk collar (di 375px, collar 88px vertikal + 112px horizontal terlalu rakus — butuh desain kedua, bukan penyusutan) (M5)
- [ ] T-44: tutup M5 — ukur ulang Lighthouse, tulis aturan motion ke `docs/RULES.md` (bukan file `docs/MOTION.md` baru), perbarui ROADMAP/STATE/CHANGELOG (M5)

## Backlog

- [ ] T-36: **ditunda user (2026-07-28).** Ukur baseline Lighthouse via PageSpeed Insights untuk `/` dan satu post scrollytelling; catat di `docs/TESTING.md`. Dicoba 2026-07-28 lewat 3 jalur (PSI web UI, PSI API via WebFetch, PSI API via `curl`) — semua gagal: UI macet di polling (kemungkinan batasan tooling sesi yang sama dengan `IntersectionObserver`/`rAF`, lihat `docs/memory/LESSONS.md`), API kena 429 keyless-quota dari dua jalur jaringan berbeda. Data pengganti (berat transfer nyata, bukan skor Lighthouse resmi) sudah dicatat di `docs/TESTING.md` § "Measured baseline". **Perlu user**: jalankan PageSpeed Insights dari browser asli, atau berikan API key PSI (M5)
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
- [x] T-40: identitas DATUM di homepage — `ImmersiveIndex.astro` baru, dipasang di `index.astro` di sebelah markup Reading Mode lewat wrapper `[data-mode-view]` (kedua markup dikirim di HTML statis yang sama, CSS murni memutuskan mana yang tampil — nol fetch runtime, nol island kedua, sesuai ADR-003). Penempatan plate diturunkan dari `type` (kolom, 4 kolom mengikuti urutan `POST_TYPES` yang sudah dipakai `TypeFilter.astro`) + `date` (urutan baris dalam kolom) — bukan `grid-area` tulis tangan; post baru otomatis jadi baris baru tanpa edit layout. Field graticule CSS murni (`repeating-linear-gradient`, opacity rendah lewat `::before` supaya konten di atasnya tetap tajam). Hatch per `type` memakai ulang token yang sudah ada (`--color-chart-2`, `--color-accent`, `--color-ink-muted`, `--color-line`) — bukan token dekoratif baru. Header kolom = legenda sekaligus filter (`<a href="/explore/{type}">`). Field `coordinates` (string DMS, opsional) ditambah ke schema; diisi manual untuk 10 dari 11 post dengan lokasi geografis nyata (dihitung dari koordinat desimal asli lewat script, bukan kira-kira) — `building-knowledge-hub` sengaja dibiarkan tanpa koordinat karena bukan tentang tempat. `data-pagefind-ignore` dipasang di view immersive supaya judul post tidak terindeks dobel (Pagefind mengindeks `<body>` penuh tanpa peduli `display:none`) — indeks kembali ke 1944 kata dari 2004. Disederhanakan dari deskripsi task asli: "nomor sheet" per-halaman diganti hitungan total sheet (lebih pas untuk halaman indeks); tick lintang & crosshair SVG data-URI dilewati — graticule murni sudah memberi tekstur "lembar survei" tanpa fabrikasi elemen yang tidak memetakan apa pun nyata. Diverifikasi lewat reload sungguhan (`localStorage` diisi lebih dulu, pola dari gotcha T-39): 11 plate persis, kolom 3/1/4/3, semua koordinat & judul benar, aksen `#5a8d5d`. Di 375px grid otomatis 1 kolom, nol overflow horizontal — desain mobile penuh tetap milik T-43 (M5) — 2026-07-28
- [x] T-37: ADR-003 — memperjelas klausa 4 ADR-002 sebagai larangan hidrasi framework (bukan larangan byte mutlak), diputuskan setelah user memilih opsi ini secara eksplisit (2026-07-28); 3 klausa: Tier-0 CSS platform features, Tier-1 vanilla ≤2KB gzip diizinkan di layout global, dual-mode sebagai preferensi tersimpan client via `data-mode` — bukan field frontmatter, bukan pohon route kedua. Bukti pendukung yang dikutip: `<Analytics />` sudah mengirim JS di setiap halaman sejak M3; `jabodetabek-connect.mdx` mencatat proyek Afreza sendiri sudah memakai pola persis "light/dark theme + pre-hydration script" (M5) — 2026-07-28
- [x] T-38: blok `:root[data-mode="immersive"]` di `global.css` di dalam `@layer base` — remap 8 token warna yang sudah ada (bukan token paralel). Kontras WCAG dihitung manual sebelum commit: aksen hijau brainstorm awal (`#4f7d52`) cuma lolos AA teks besar (4,18:1) di atas bg baru; diganti `#5a8d5d` (5,14:1, lolos AA teks normal). Tipografi (`--font-display`/`--font-body`) **sengaja tidak** diremap di sini — ditahan untuk T-41 yang memang tugas memutuskan & self-host typeface Immersive sungguhan, supaya T-38 tidak diam-diam mengambil keputusan desain yang bukan scope-nya (M5) — 2026-07-28
- [x] T-39: `ModeController` Tier-1 — script `is:inline` pra-paint di `BaseLayout.astro` (persis setelah `meta charset`, sebelum stylesheet apa pun) + tombol toggle di `Header.astro` dengan script vanilla ~591 byte mentah / 325 byte gzip (jauh di bawah anggaran 2KB ADR-003). Diverifikasi lewat reload sungguhan dengan `localStorage` diisi lebih dulu (bukan klik-lalu-baca — environment browser sesi ini tidak me-repaint elemen lama setelah mutasi atribut in-page, gotcha baru dicatat di `docs/memory/LESSONS.md`): bg/teks/aksen semuanya benar sebelum first paint. Injeksi font Immersive kondisional **tidak** dikerjakan — menunggu T-41 memutuskan font sungguhan dulu (M5) — 2026-07-28
- [x] T-31: `repo:` ditambah ke 3 post `type: project` (URL diberikan user — `Luthfi-Forma/Jabodetabek-Connect`, `Luthfi-Forma/Jakarta_Transit_Heritage_Explorer`, `Luthfi-Forma/CDMP-Jabodetabek`); org salah di `building-knowledge-hub.mdx` diperbaiki (`afrezahernanda` → `Luthfi-Forma`); jalur ≤2 klik ditelusuri manual di `dist/` build dan tercatat di `docs/TESTING.md` — ternyata post → repo bisa 1 klik langsung dari meta bar post, di luar jalur post → project hub → repo. `demo:` belum diisi — belum ada demo live per bagian "Status" tiap post (M5) — 2026-07-28
- [x] T-33: cover project — diarahkan ulang oleh user dari screenshot ke ilustrasi generated: 3 diagram editorial (bukan foto) yang masing-masing mengkodekan fakta nyata dari postnya (13 lines · 128 stations; 3 node uji bernama; 1989–2027 · 14 project), dibuat sebagai SVG tulisan tangan lalu di-rasterize lewat `@resvg/resvg-js` — library & font TTF yang sama dengan `src/lib/og-image.ts`, tanpa dependency baru. Skrip generator dibuang setelah dipakai (bespoke sekali-render, bukan tooling permanen, mengikuti pola "tidak ada auto-chart generik" yang sudah berlaku di `src/lib/scrollytelling/`). Mematikan 3 placeholder krem di homepage Featured Projects — terverifikasi nol sisa di `dist/index.html` (M5) — 2026-07-28
- [x] T-34: terjemahkan label & caption chart Indonesia → English di 4 modul `src/lib/scrollytelling/*.tsx` — lingkupnya ternyata jauh lebih luas dari 8 kemunculan yang tertandai semula: data label chart (Kelas 1–5, status desa, tenure TLI, skenario, dll.), caption di bawah chart, `vizCitation.fig`/`source` (dirender sebagai "Drawn from" untuk tiap section, bukan cuma section aktif), locator `citations[].where` di panel "Sources for this claim" (dirender untuk semua section), heading "Sumber" → "Source", dan format angka `toLocaleString('id-ID')` → `'en-US'`. Istilah resmi tata ruang yang sudah dipakai apa adanya di body prose English (RTRW, PKL/PKLp/PPK/PPL, Skalogram, Hierarki, IPD, kecamatan/kelurahan/kabupaten-kota, Sasaran 1/2, P3KE, AMDAL) sengaja **dipertahankan** sebagai loanword, mengikuti preseden yang sudah ada di teks post — bukan luput tak sengaja. Judul dokumen sumber yang dikutip literal tetap dalam Bahasa Indonesia (praktik sitasi standar, tidak menerjemahkan judul karya). Terverifikasi lewat `npm run build` + grep pada `dist/`: nol sisa Indonesia pada seluruh teks yang ter-SSR (M5) — 2026-07-28
- [x] T-32: "Project: X" jadi link nyata — `<span>` → `<a href="/projects/...">` di `src/pages/posts/[slug].astro`, memakai `getProjectTitle()` supaya labelnya sama dengan halaman `/projects`; sebelumnya post → project hub adalah nol klik (M5) — 2026-07-28
- [x] T-35: perbaikan aset & a11y — `portrait.png` dipindah ke `src/assets/` + `<Image>` (982.410 → 11.892 byte webp, −98,8%); dua `repeat: Infinity` di `cikarang-industrial-settlement-pattern.tsx` jadi sekali putar (WCAG 2.2.2); net `prefers-reduced-motion` global di `global.css` (sengaja unlayered + `!important` — kebalikan dari reset heading, karena harus menang atas scoped `<style>` di `about.astro`/`FeaturedProjects.astro`); `--font-mono` didefinisikan (dipakai 8× tapi tidak pernah ada, diam-diam jatuh ke default Tailwind) (M5) — 2026-07-28
- [x] T-30: scrollytelling `rpplh-south-papua` — Food Estate 1,2 juta ha/6 distrik vs. 471.026 ha ruang budaya adat tumpang-tindih (7 kategori), skor jasa lingkungan (74,63% pangan kelas-4, 67,88% kehati kelas-5), status desa IPD (89% tertinggal/sangat tertinggal), temuan lapangan (200 ekskavator, 135/140km jalan tanpa AMDAL), tradisi Sasi OAP (M4) — 2026-07-18
<!-- - [x] T-00: example (M1) — 2026-01-01 -->
