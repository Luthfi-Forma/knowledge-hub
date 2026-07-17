# Project State — knowledge-hub

<!-- SNAPSHOT file: overwrite it, do not append. Updated at every session close
     by /project-status, grounded in git log — not recall. -->

- Updated: 2026-07-17
- Milestone: M1 dan M2 selesai — M3 (Identitas & polish) belum di-breakdown ke TASK.md (see docs/ROADMAP.md)

## Current status

M1 dan M2 selesai (T-01–T-13). Situs live di
[knowledge-hub-inky.vercel.app](https://knowledge-hub-inky.vercel.app), repo
[github.com/Luthfi-Forma/knowledge-hub](https://github.com/Luthfi-Forma/knowledge-hub)
(public) terhubung ke Vercel — tiap push ke `main` auto-deploy. Situs punya
7 post nyata (3 case study software + 4 case study riset GIS/planning),
Home, Explore (filter type + tag + search Pagefind), detail post (+related
posts), halaman tag (`/tags`), project hub (`/projects`), About berisi
konten nyata, dan 404 custom. Desain visual masih **provisional** (M1 =
"layout dasar"; identitas final adalah scope M3) — palet zinc netral, font
Plus Jakarta Sans + Manrope, lihat ARCHITECTURE.md/ROADMAP.md untuk detail
token dan alasannya.

## Last session

2026-07-16 s/d 2026-07-17: T-01–T-08 (M1, scaffold → 3 case study nyata →
deploy Vercel) lalu T-09–T-13 (M2: tag filter, related posts, project hub,
Pagefind search, migrasi konten About + 4 case study dari
`Website_Portfolio` lama) dikerjakan via Workflow multi-agent paralel atas
permintaan eksplisit user. Sebuah BSOD menghentikan workflow M2 di tengah
jalan — dipulihkan dengan aman (progres tak ter-commit di worktree
diverifikasi build dulu sebelum di-commit manual; tidak ada yang hilang).
Prosedur recovery-nya didokumentasikan di `docs/memory/LESSONS.md`
(2026-07-17). Semua 6 branch hasil workflow di-merge manual ke `main`,
build+browser diverifikasi ulang dari nol pasca-merge, 3 gap integrasi
ditemukan & diperbaiki (cover image tak pernah dirender di halaman post,
bug spasi hilang di link inline About, judul project mentah dari slug).
Semua sudah live dan diverifikasi di production.

## Next steps

1. Breakdown task M3 (Identitas & polish — desain visual final, About/CV
   interaktif, OG images, RSS, sitemap, Vercel Analytics, custom domain) ke
   `docs/TASK.md` sebelum mulai coding.

## Blockers

None.

## Open questions

None — lihat "Open questions" di docs/ARCHITECTURE.md untuk yang arsitektural.
