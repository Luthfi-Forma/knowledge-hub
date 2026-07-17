# Project State — knowledge-hub

<!-- SNAPSHOT file: overwrite it, do not append. Updated at every session close
     by /project-status, grounded in git log — not recall. -->

- Updated: 2026-07-17
- Milestone: M1 dan M2 selesai — M3 (Identitas & polish) sedang berjalan, T-14 (identitas visual final) selesai (see docs/ROADMAP.md)

## Current status

M1, M2, dan T-14 (M3) selesai. Situs live di
[knowledge-hub-inky.vercel.app](https://knowledge-hub-inky.vercel.app), repo
[github.com/Luthfi-Forma/knowledge-hub](https://github.com/Luthfi-Forma/knowledge-hub)
(public) terhubung ke Vercel — tiap push ke `main` auto-deploy. Situs punya
7 post nyata (3 case study software + 4 case study riset GIS/planning),
Home, Explore (filter type + tag + search Pagefind), detail post (+TOC,
reading time, related posts), halaman tag (`/tags`), project hub
(`/projects`), About berisi konten nyata, dan 404 custom. **Identitas visual
final sudah diterapkan** (bukan lagi provisional M1): kertas krem
`#F5EFE1`, ink `#18140F`, aksen hijau tua `#38523A`, serif Bodoni Moda
(display + body) + sans Karla (UI/meta) — lihat ARCHITECTURE.md bagian
"Visual identity" untuk token lengkap dan alasannya.

## Last session

2026-07-16 s/d 2026-07-17: T-01–T-08 (M1) lalu T-09–T-13 (M2) dikerjakan via
Workflow multi-agent paralel — detail proses & recovery BSOD ada di
`docs/memory/LESSONS.md`. Kemudian T-14 (M3, identitas visual final)
dikerjakan solo (bukan multi-agent, sengaja — perubahan visual butuh tangan
yang konsisten lintas file): proses mockup-first dengan 3 arah orisinal
(Field Notes / Blueprint / Reading Room) di-publish sebagai Artifact,
user memilih komposisi Reading Room + palet Field Notes lalu minta font
yang "kurang AI-generated" (diganti dari Fraunces/Playfair-style ke
Piazzolla+Karla / Besley+Jost), lalu user memberi referensi visual nyata
(travel-blog editorial: kertas krem, headline serif Didone tebal, meta row,
TOC sidebar) yang menang atas draft sebelumnya — final direction: kertas
krem + Bodoni Moda (bukan Fraunces, dihindari sebagai kombinasi klise
krem+serif+terracotta) + Karla, aksen hijau tua bukan terracotta. Diterapkan
ke seluruh `global.css` + ~20 komponen/halaman, ditambah TOC statis pada
halaman post (dari `render()` headings, tanpa scroll-spy JS) dan reading
time terhitung dari word count nyata. Build + `astro build` + verifikasi
browser (computed styles, contrast WCAG AA, no horizontal overflow di
375/768/1024/1440) semua lolos. Satu bug non-trivial ditemukan & diperbaiki
saat verifikasi: reset `font-weight` pada heading yang unlayered mengalahkan
semua utility class Tailwind `font-*` di seluruh situs (Tailwind v4
cascade-layer gotcha) — didokumentasikan di LESSONS.md.

## Next steps

1. T-15: About/CV jadi lebih interaktif (timeline pengalaman dsb.),
   mengikuti identitas visual T-14 yang baru diterapkan.

## Blockers

None.

## Open questions

None — lihat "Open questions" di docs/ARCHITECTURE.md untuk yang arsitektural.
