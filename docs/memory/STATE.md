# Project State — knowledge-hub

<!-- SNAPSHOT file: overwrite it, do not append. Updated at every session close
     by /project-status, grounded in git log — not recall. -->

- Updated: 2026-07-16
- Milestone: M1 — Fondasi & Content Engine (see docs/ROADMAP.md)

## Current status

T-01, T-02, T-03 selesai. Proyek Astro 7 + Tailwind CSS v4 + MDX berjalan di
root repo. Content collection `posts` (`src/content.config.ts`, Content Layer
API) punya schema zod lengkap sesuai content model di ARCHITECTURE.md.

Situs sekarang punya layout dasar nyata: `BaseLayout` + `Header`/`Footer`,
Home (`/` — Hero, Featured Projects, Latest Posts, Contact) dan Explore
sederhana (`/explore` + `/explore/[type]` via `getStaticPaths`, filter type
tanpa client-side JS). Empty state jujur dipakai di mana pun belum ada
post nyata (Featured Projects, tab type yang masih kosong) — tidak ada data
fiktif.

**Desain visual masih provisional** (M1 = "layout dasar"; identitas final
milik M3 — lihat ROADMAP.md). Token saat ini: palet zinc netral (ink
`#18181b`, ink-muted `#52525b`, paper `#ffffff`, line `#e4e4e7`, accent biru
`#2563eb`), font Plus Jakarta Sans (display) + Manrope (body), kolom konten
`max-width: 50rem` ditengahkan, Hero center-aligned. Diputuskan lewat proses
mockup-first (`mcp__visualize`) + referensi eksternal yang diminta user
(raihankalla.id — kolom sempit tunggal, grid 2 kolom untuk visual/project,
list polos untuk post). Sengaja berbeda dari palet/font portfolio lama
(forest-green/cream, Space Grotesk+Inter Tight) supaya M3 mulai dari clean
slate.

Diverifikasi: build 6 route statis, kontras WCAG AA jauh di atas ambang,
tap target ≥44px, heading order tanpa skip level, focus ring solid terlihat
(sempat ada bug `outline-style: none` karena lupa utility `outline` polos —
sudah diperbaiki), tidak ada horizontal scroll di 375/768/1024/1440px.

## Last session

- 2026-07-16: telaah dokumen visi `Personal-Knowledge_Platform.md`, interview
  keputusan (nama, stack Astro, English, ganti portfolio lama), scaffold +
  isi docs + ADR-001, initial commit.
- 2026-07-16: T-01 — scaffold Astro + Tailwind + MDX, struktur folder
  `src/content/posts/`, verifikasi build & dev server di browser.
- 2026-07-16: T-02 — schema zod content collection `posts`, post contoh
  valid, dibuktikan build gagal pada frontmatter invalid.
- 2026-07-16: T-03 — layout dasar + Home + Explore. Proses: plan mode +
  mockup-first via visualize tool, iterasi arah visual (netral provisional →
  container centered + hero centered → mengikuti referensi raihankalla.id),
  lalu implementasi Astro/Tailwind + verifikasi build/browser/a11y.

## Next steps

1. T-04: halaman detail post `[slug]` + About placeholder + 404.
2. T-05–T-07: tulis 3 case study nyata — akan mengisi Featured Projects yang
   sekarang masih empty state.

## Blockers

None.

## Open questions

None — lihat "Open questions" di docs/ARCHITECTURE.md untuk yang arsitektural.
