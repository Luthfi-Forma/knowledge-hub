# Project State — knowledge-hub

<!-- SNAPSHOT file: overwrite it, do not append. Updated at every session close
     by /project-status, grounded in git log — not recall. -->

- Updated: 2026-07-17
- Milestone: M1 dan M2 selesai — M3 (Identitas & polish) sedang berjalan: T-14 dan T-15 selesai (see docs/ROADMAP.md)

## Current status

M1, M2, T-14, dan T-15 selesai. Situs live di
[knowledge-hub-inky.vercel.app](https://knowledge-hub-inky.vercel.app), repo
[github.com/Luthfi-Forma/knowledge-hub](https://github.com/Luthfi-Forma/knowledge-hub)
(public) terhubung ke Vercel — tiap push ke `main` auto-deploy. Situs punya
7 post nyata (3 case study software + 4 case study riset GIS/planning),
Home, Explore (filter type + tag + search Pagefind), detail post (+TOC,
reading time, related posts), halaman tag (`/tags`), project hub
(`/projects`), About dengan timeline pengalaman interaktif, dan 404 custom.
**Identitas visual final sudah diterapkan** (bukan lagi provisional M1):
kertas krem `#F5EFE1`, ink `#18140F`, aksen hijau tua `#38523A`, serif
Bodoni Moda (display + body) + sans Karla (UI/meta) — lihat ARCHITECTURE.md
bagian "Visual identity" untuk token lengkap dan alasannya.

## Last session

2026-07-16 s/d 2026-07-17: T-01–T-08 (M1) lalu T-09–T-13 (M2) dikerjakan via
Workflow multi-agent paralel — detail proses & recovery BSOD ada di
`docs/memory/LESSONS.md`. Kemudian T-14 (M3, identitas visual final)
dikerjakan solo: proses mockup-first dengan 3 arah orisinal (Field Notes /
Blueprint / Reading Room) di-publish sebagai Artifact, user memilih
komposisi Reading Room + palet Field Notes, minta font "kurang
AI-generated" (Piazzolla+Karla / Besley+Jost sebagai opsi), lalu user
memberi referensi visual nyata (travel-blog editorial: kertas krem,
headline serif Didone tebal, meta row, TOC sidebar) yang jadi arah final —
kertas krem + Bodoni Moda + Karla, aksen hijau tua (bukan terracotta,
dihindari sebagai kombinasi klise). Diterapkan ke `global.css` + ~20
komponen/halaman, plus TOC statis dan reading time di halaman post. Satu
bug non-trivial: reset `font-weight` unlayered mengalahkan semua utility
class Tailwind `font-*` (cascade-layer gotcha, didokumentasikan di
LESSONS.md). Lanjut T-15 (timeline pengalaman About, interaktif via native
`<details>`): riset ke repo `Website_Portfolio` lama menemukan deskripsi
per-role di `Portofolio Content.pdf` (termasuk satu baris deskripsi yang
ternyata salah-tempel/duplikat di sumbernya — diverifikasi ke user sebelum
dipakai, 2 entri dihapus dari draft atas permintaan user). Timeline
divalidasi lolos build + browser (toggle expand/collapse, marker rotate,
no overflow 375–1440). Ditemukan dan diperbaiki satu gotcha verifikasi:
`getComputedStyle` segera setelah mutasi DOM di tick skrip yang sama bisa
memberi nilai basi — sempat mengira ada bug CSS padahal rule-nya benar
(didokumentasikan di LESSONS.md).

## Next steps

1. T-16: OG image per post.
2. T-17: sitemap + RSS feed.
3. T-18: pasang Vercel Analytics.

## Blockers

None.

## Open questions

None — lihat "Open questions" di docs/ARCHITECTURE.md untuk yang arsitektural.
