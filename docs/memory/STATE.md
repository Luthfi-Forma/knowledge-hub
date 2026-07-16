# Project State — knowledge-hub

<!-- SNAPSHOT file: overwrite it, do not append. Updated at every session close
     by /project-status, grounded in git log — not recall. -->

- Updated: 2026-07-16
- Milestone: M1 — Fondasi & Content Engine (see docs/ROADMAP.md)

## Current status

T-01 selesai: proyek Astro 7 + Tailwind CSS v4 + MDX terpasang di root repo
(scaffold dipindah dari subfolder sementara ke root, digabung dengan docs yang
sudah ada). Content collection `posts` terdaftar di `src/content.config.ts`
(Content Layer API, loader `glob` atas `src/content/posts/*.mdx`) — folder
ada, belum ada schema zod dan belum ada post. Build (`astro build`) dan dev
server terverifikasi jalan, Tailwind terbukti ter-apply di browser.

## Last session

- 2026-07-16: telaah dokumen visi `Personal-Knowledge_Platform.md`, interview
  keputusan (nama, stack Astro, English, ganti portfolio lama), scaffold +
  isi docs + ADR-001, initial commit.
- 2026-07-16: T-01 — scaffold Astro + Tailwind + MDX, struktur folder
  `src/content/posts/`, verifikasi build & dev server di browser.

## Next steps

1. T-02: schema frontmatter zod (sesuai content model di ARCHITECTURE.md) +
   1 post contoh yang lolos validasi; buktikan build gagal pada frontmatter
   invalid.
2. T-03: layout dasar + halaman Home dan Explore sederhana.

## Blockers

None.

## Open questions

None — lihat "Open questions" di docs/ARCHITECTURE.md untuk yang arsitektural.
