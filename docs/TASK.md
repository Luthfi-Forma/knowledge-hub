# Tasks — knowledge-hub

- Updated: 2026-07-18

<!-- Rules:
     - No coding before the work exists as a task here (CLAUDE.md, Session protocol).
     - A task is small enough to finish in one session; otherwise split it.
     - Format: "- [ ] T-NN: verb-first description (milestone)".
     - Done tasks move to Done with their completion date; prune Done monthly. -->

## Now

Tidak ada.

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
<!-- - [x] T-00: example (M1) — 2026-01-01 -->
