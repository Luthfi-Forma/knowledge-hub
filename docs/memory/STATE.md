# Project State — knowledge-hub

<!-- SNAPSHOT file: overwrite it, do not append. Updated at every session close
     by /project-status, grounded in git log — not recall. -->

- Updated: 2026-07-17
- Milestone: M1 dan M2 selesai — M3 (Identitas & polish) sedang berjalan: T-14–T-19 selesai, sisanya menunggu keputusan user (see docs/ROADMAP.md)

## Current status

M1, M2, dan T-14–T-19 (M3) selesai. Situs live di
[knowledge-hub-inky.vercel.app](https://knowledge-hub-inky.vercel.app), repo
[github.com/Luthfi-Forma/knowledge-hub](https://github.com/Luthfi-Forma/knowledge-hub)
(public) terhubung ke Vercel — tiap push ke `main` auto-deploy. Situs punya
11 post nyata (8 tulisan/case study + 3 foto), Home, Explore (filter +
search Pagefind), detail post (+TOC, reading time, related posts, OG image
per post), halaman tag, project hub, About dengan timeline pengalaman
interaktif, 404 custom, sitemap + RSS + robots.txt, Vercel Web Analytics,
dan `/photography` (3 foto dari pesisir Tanggamus, Lampung — Okt 2022).
**Identitas visual final sudah diterapkan**: kertas krem `#F5EFE1`, ink
`#18140F`, aksen hijau tua `#38523A`, serif Bodoni Moda + sans Karla — lihat
ARCHITECTURE.md bagian "Visual identity".

**Aksi tersisa untuk user (bukan kode):** aktifkan Web Analytics manual di
dashboard Vercel (Project → Analytics → Enable) — toggle akun yang tidak
bisa disentuh dari kode.

## Last session

2026-07-16 s/d 2026-07-17: T-01–T-13 (M1+M2) lalu M3 T-14–T-19 dikerjakan
berurutan dalam sesi yang sama. Ringkas: T-14 identitas visual final
(mockup-first → referensi user → kertas krem + Bodoni Moda + Karla), T-15
timeline pengalaman interaktif di About, T-16 OG image per post (Satori +
resvg) + meta tag sosial lengkap, T-17 sitemap + RSS + robots.txt, T-18
Vercel Web Analytics, T-19 photography (`type: "photo"` baru di schema
posts, cover wajib divalidasi zod, `/photography` grid, cover foto tidak
di-crop paksa 16:9 seperti cover post lain). User taruh 3 foto asli (pesisir
Tanggamus, Lampung, Okt 2022) di folder staging `pictures/` — dipindahkan
ke `src/content/posts/` dengan penamaan kebab-case konsisten, ditulis 3
entri MDX terpisah (satu foto = satu entri, sesuai keputusan user), folder
staging dihapus. Kompresi foto otomatis lewat Sharp (bundled di Astro via
`astro:assets`) — file asli 15–20MB, hasil akhir 100–260KB per varian
WebP, tidak perlu pipeline tambahan. Satu bug ditemukan & diperbaiki saat
verifikasi 375px: nav header overflow setelah nav item "Photography"
ditambahkan (4 link tidak muat 1 baris di mobile) — fix: `flex-wrap` pada
header + padding link lebih kecil di breakpoint kecil. Semua diverifikasi:
build sukses, gambar ter-generate & terbaca benar (cek visual lewat Read
tool), related posts otomatis saling terhubung lewat tag `photography`
bersama, no overflow 375–1440. Detail teknis & gotcha non-obvious tiap task
ada di `docs/memory/LESSONS.md`; rasionale desain lengkap di
ARCHITECTURE.md. User eksplisit menunda T-20 (custom domain) — "belum
butuh" (2026-07-17).

## Next steps

1. Tunggu arahan user — kemungkinan foto tambahan untuk `/photography`,
   atau lanjut ke task lain.
2. T-20/T-21 menunggu keputusan custom domain dari user.

## Blockers

None.

## Open questions

None — lihat "Open questions" di docs/ARCHITECTURE.md untuk yang arsitektural.
