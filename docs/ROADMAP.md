# Roadmap — knowledge-hub

- Updated: 2026-07-16

<!-- The roadmap answers "what order and why". Tasks live in TASK.md, not here. -->

## Milestones

| # | Milestone | Outcome (verifiable) | Status |
|---|---|---|---|
| M1 | Fondasi & Content Engine | Situs Astro live di Vercel: schema frontmatter tervalidasi, Home + Explore + halaman post, 3 case study nyata ter-publish | active |
| M2 | Explore & keterhubungan | Filter tag, related posts, project hub pages, Pagefind search; konten + foto portfolio lama termigrasi | planned |
| M3 | Identitas & polish | Desain visual final, About/CV, photography, OG images, RSS, sitemap, Vercel Analytics, custom domain; repo portfolio lama diarsipkan | planned |

## Current focus

M1 aktif. "Done" = situs bisa diakses publik di URL Vercel, build gagal bila
frontmatter tidak valid, dan 3 case study proyek nyata (Jabodetabek-Connect,
JTHE, CDMP-Jabodetabek) tampil di Home dan Explore.

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
- Custom domain; arsipkan repo `Website_Portfolio`.

## Icebox

- GitHub API enrichment (stars, last commit, activity feed).
- Komentar via giscus.
- Multi-hashtag AND-filter; trending topics.
- i18n / versi Bahasa Indonesia.
- Research page format paper ilmiah (Abstract/Methodology/...) — baru relevan
  saat ada ≥ 2 konten research.
