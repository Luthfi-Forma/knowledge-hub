# Project State — knowledge-hub

<!-- SNAPSHOT file: overwrite it, do not append. Updated at every session close
     by /project-status, grounded in git log — not recall. -->

- Updated: 2026-07-16
- Milestone: M1 — Fondasi & Content Engine (see docs/ROADMAP.md)

## Current status

T-01 dan T-02 selesai. Proyek Astro 7 + Tailwind CSS v4 + MDX berjalan di
root repo. Content collection `posts` (`src/content.config.ts`, Content Layer
API) punya schema zod lengkap sesuai content model di ARCHITECTURE.md (title,
summary, date, type enum, tags kebab-case, project/repo/demo/cover optional,
draft). Satu post contoh valid (`building-knowledge-hub.mdx`) lolos build;
build gagal (exit 1, pesan error per-field) sudah dibuktikan dengan post
frontmatter invalid lalu dihapus lagi. Belum ada layout/halaman nyata selain
`index.astro` default.

## Last session

- 2026-07-16: telaah dokumen visi `Personal-Knowledge_Platform.md`, interview
  keputusan (nama, stack Astro, English, ganti portfolio lama), scaffold +
  isi docs + ADR-001, initial commit.
- 2026-07-16: T-01 — scaffold Astro + Tailwind + MDX, struktur folder
  `src/content/posts/`, verifikasi build & dev server di browser.
- 2026-07-16: T-02 — schema zod content collection `posts`, post contoh
  valid, dibuktikan build gagal pada frontmatter invalid.

## Next steps

1. T-03: layout dasar + halaman Home (Hero, Featured, Latest, Contact) dan
   Explore sederhana.
2. T-04: halaman detail post `[slug]` + About placeholder + 404.

## Blockers

None.

## Open questions

None — lihat "Open questions" di docs/ARCHITECTURE.md untuk yang arsitektural.
