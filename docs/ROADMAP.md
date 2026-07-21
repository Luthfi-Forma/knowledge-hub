# Roadmap — knowledge-hub

- Updated: 2026-07-18

<!-- The roadmap answers "what order and why". Tasks live in TASK.md, not here. -->

## Milestones

| # | Milestone | Outcome (verifiable) | Status |
|---|---|---|---|
| M1 | Fondasi & Content Engine | Situs Astro live di Vercel: schema frontmatter tervalidasi, Home + Explore + halaman post, 3 case study nyata ter-publish | done |
| M2 | Explore & keterhubungan | Filter tag, related posts, project hub pages, Pagefind search; konten + foto portfolio lama termigrasi | done |
| M3 | Identitas & polish | Desain visual final, About/CV, photography, OG images, RSS, sitemap, Vercel Analytics | done |
| M4 | Interaktivitas (Astro Islands) | ADR-002; carousel drag di Featured Projects; 4 post `research` jadi scrollytelling React island (full-replace, bukan append) — Cikarang, Kaltim/Bontang, Jabung Lampung, RPPLH Papua Selatan | done |

Custom domain dan arsip repo lama (awalnya bagian M3) ditunda eksplisit oleh
user — lihat T-20/T-21 di TASK.md Backlog.

## Current focus

M1–M4 selesai. Situs live di
[knowledge-hub-inky.vercel.app](https://knowledge-hub-inky.vercel.app).
Tidak ada task aktif di TASK.md Now — sesi berikutnya mulai dari Backlog
(T-20/T-21, menunggu keputusan user) atau permintaan baru.

## Phase detail

### M1 — Fondasi & Content Engine

- Init Astro + Tailwind + MDX; struktur content collection `posts`.
- Schema frontmatter zod: `title, summary, date, type, tags[], project?, repo?,
  demo?, cover?, draft` — build gagal jika tidak valid.
- Layout dasar + halaman: Home (Hero, Featured Projects, Latest Posts, Contact),
  Explore (daftar semua post, filter type sederhana), detail post, About
  (placeholder), 404.
- Tulis 3 case study (English) dari proyek nyata.
- Hubungkan repo GitHub → deploy Vercel, verifikasi URL publik.

### M2 — Explore & keterhubungan

- Filter tag di Explore; halaman `/tags/[tag]`.
- Related posts (shared tags/project) di bawah tiap post.
- Project hub `/projects/[name]` — mengumpulkan semua post satu proyek + link
  repo/demo.
- Pagefind search.
- Migrasi konten + foto dari `Website_Portfolio` lama.

### M3 — Identitas & polish

- Desain visual final (typography, palette) per standar desain OS.
- About/CV interaktif; section photography.
- OG image per post, RSS, sitemap, Vercel Analytics.

### M4 — Interaktivitas (Astro Islands)

- ADR-002: kebijakan two-tier islands (vanilla script untuk interaksi
  sederhana, React island untuk pengalaman kaya) — default situs tetap
  zero-JS SSG.
- Lebur `type: journal` ke `article`; polish baca ala Medium (drop cap,
  pull-quote) khusus `type: article`.
- Carousel drag kiri/kanan di Featured Projects (Home) — tier 1, vanilla.
- Scrollytelling (tier 2, React island) untuk `type: research` — opt-in via
  `presentation: "scrollytelling"`, full-replace (bukan append) narasi MDX
  lama. Diterapkan ke 4 post: `cikarang-industrial-settlement-pattern`
  (pilot), `bontang-poverty-mapping` (reframe ke konteks provinsi Kaltim),
  `jabung-lampung-coastal-development` (koreksi metodologi gravity model →
  Skalogram), `rpplh-south-papua`.

## Icebox

- GitHub API enrichment (stars, last commit, activity feed).
- Komentar via giscus.
- Multi-hashtag AND-filter; trending topics.
- i18n / versi Bahasa Indonesia.
- Research page format paper ilmiah (Abstract/Methodology/...) — baru relevan
  saat ada ≥ 2 konten research.
