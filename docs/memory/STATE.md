# Project State — knowledge-hub

<!-- SNAPSHOT file: overwrite it, do not append. Updated at every session close
     by /project-status, grounded in git log — not recall. -->

- Updated: 2026-07-18
- Milestone: M1–M4 selesai (see docs/ROADMAP.md). Tidak ada task aktif di TASK.md Now.

## Current status

Situs live di
[knowledge-hub-inky.vercel.app](https://knowledge-hub-inky.vercel.app), repo
[github.com/Luthfi-Forma/knowledge-hub](https://github.com/Luthfi-Forma/knowledge-hub)
(public) terhubung ke Vercel — tiap push ke `main` auto-deploy. Situs punya
11 post nyata, Home (dengan carousel drag di Featured Projects), Explore
(filter + search Pagefind), detail post (+TOC, reading time, related posts,
OG image per post — semua diskip untuk post scrollytelling), halaman tag,
project hub, About dengan timeline interaktif, `/photography`, 404 custom,
sitemap + RSS + robots.txt, Vercel Web Analytics. Identitas visual final
(kertas krem `#F5EFE1`, ink `#18140F`, aksen hijau `#38523A`, Bodoni Moda +
Karla) diterapkan penuh.

**Baru (M4, sesi ini):** situs sekarang punya interaktivitas client-side
per ADR-002 (two-tier: vanilla script vs. React island), dengan 4 dari 4
post `type: research` sudah jadi scrollytelling — narasi MDX statis
digantikan total (bukan ditambah) oleh React island: hero besar, kolom teks
+ viz sticky yang berganti mengikuti scroll, panel Sources, chart bersumber
jelas. Situs tetap zero-JS SSG di luar route-route ini; bundle React
(~700KB) terverifikasi hanya ter-load di 4 halaman post itu.

**Aksi tersisa untuk user (bukan kode):** aktifkan Web Analytics manual di
dashboard Vercel (belum berubah dari sesi lalu — toggle akun, tidak bisa
disentuh dari kode).

## Last session

**2026-07-21** (dua sesi berurutan, di-summarize bersama):

Sesi 1 — T-22 s/d T-25: T-22 lebur `type: journal` ke `article` (cuma 1
post terpengaruh). T-23 polish baca ala Medium (drop cap, pull-quote,
measure 42rem) khusus `type: article`. T-24 carousel drag di Featured
Projects — vanilla `<script>` + `scroll-snap`, tier 1 ADR-002, zero
framework. T-25 (+ ADR-002 tertulis dulu): island React pertama situs —
`@astrojs/react` + `motion` + `recharts`, shell reusable
`src/islands/Scrollytelling.tsx` (sticky viz swap via
`IntersectionObserver`, Sources panel, keyboard nav, dock mobile), pilot di
`cikarang-industrial-settlement-pattern` — waktu itu masih **append**
(narasi lama + island keduanya render).

Sesi 2 (setelah user lihat hasil live di Vercel) — T-27 s/d T-30: user minta
full-replace, bukan append. T-27 restrukturisasi `[slug].astro`: skip
`<h1>`/dek/cover/TOC/body MDX untuk post scrollytelling, meta row tanpa
"min read", generalisasi gating (`isScrollytelling` + branch `post.id`
eksplisit per post — pola mekanis 1 import + 1 blok untuk post berikutnya).
User lalu kirim 3 dokumen sumber (PDF) untuk 3 post research lain, dengan
instruksi: Bontang dibahas lebih luas (bagian kajian se-provinsi Kaltim).
**T-28** (`bontang-poverty-mapping`): dokumen ternyata laporan progres
per-Juni-2023 — hanya Bontang yang 100% tuntas dari 10 kab/kota; post
dibingkai ulang: konteks provinsi (~238rb individu P3KE) → kenapa Bontang
satu-satunya yang tuntas → close-up 1 kelurahan (590 KK, angka nyata,
**tanpa** data individu/NIK/nama) → status rollout 9 kab/kota lain.
**T-29** (`jabung-lampung-coastal-development`): koreksi faktual — post lama
klaim "gravity model", tapi kata itu **tidak muncul sama sekali** di
laporan 93 halaman; metode asli Analisis Skalogram (12 kecamatan → hierarki
1/2/3) + SWOT → zonasi Agropolitan/Minapolitan. **T-30**
(`rpplh-south-papua`): data jauh lebih kaya dari post lama — Food Estate 1,2
juta ha/6 distrik vs. 471.026 ha ruang budaya adat (7 kategori), skor jasa
lingkungan (74,63% pangan kelas-4, 67,88% kehati kelas-5 — tanah yang sama),
status desa (89% tertinggal), temuan lapangan (200 ekskavator, 135/140km
jalan tanpa AMDAL).

**Gotcha teknis penting (lihat LESSONS.md untuk detail):** (1) `layout`
adalah kata kunci reserved Astro MDX (bukan `presentation`); (2) `client:*`
butuh import statis di JSX, bukan lookup map runtime; (3) `pdftoppm`
(dipakai Read tool untuk PDF) tidak terpasang di environment ini —
workaround: `pdftotext` + render halaman via Python `fitz` (PyMuPDF); (4)
tool browser sesi ini tidak bisa menjalankan `IntersectionObserver`,
`requestAnimationFrame`, ATAU `ResizeObserver` (chart recharts perlu ini
untuk ukur ukuran container) — verifikasi visual scrollytelling selalu
lewat trik sementara `client:load` + override `useState(ids[N])` di
`Scrollytelling.tsx`, diverifikasi via `svgCount`/`textContent`, lalu
di-revert bersih sebelum commit (dicek via `git diff` kosong).

Semua 9 commit sesi ini bersih ter-push ke `main`. Detail lengkap tiap task
ada di `docs/memory/LESSONS.md`; rasionale arsitektur di ARCHITECTURE.md
bagian "Scrollytelling" dan "Interactivity".

## Next steps

1. Tidak ada task aktif — tunggu arahan user.
2. T-20/T-21 (custom domain, arsip repo lama) masih di Backlog, menunggu
   keputusan user kapan pun.
3. Scrollytelling bisa diperluas ke post research baru di masa depan
   (pola sudah mekanis — lihat ARCHITECTURE.md "Adding a new scrollytelling
   post") — tidak ada task terjadwal, murni jika user punya dokumen baru.

## Blockers

None.

## Open questions

None — lihat "Open questions" di docs/ARCHITECTURE.md untuk yang arsitektural.
