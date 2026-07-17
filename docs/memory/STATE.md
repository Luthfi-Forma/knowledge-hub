# Project State — knowledge-hub

<!-- SNAPSHOT file: overwrite it, do not append. Updated at every session close
     by /project-status, grounded in git log — not recall. -->

- Updated: 2026-07-17
- Milestone: M1 dan M2 selesai — M3 (Identitas & polish) sedang berjalan: T-14–T-18 selesai, sisanya diblokir input user (see docs/ROADMAP.md)

## Current status

M1, M2, dan T-14–T-18 (M3) selesai. Situs live di
[knowledge-hub-inky.vercel.app](https://knowledge-hub-inky.vercel.app), repo
[github.com/Luthfi-Forma/knowledge-hub](https://github.com/Luthfi-Forma/knowledge-hub)
(public) terhubung ke Vercel — tiap push ke `main` auto-deploy. Situs punya
8 post nyata, Home, Explore (filter + search Pagefind), detail post (+TOC,
reading time, related posts, OG image per post), halaman tag, project hub,
About dengan timeline pengalaman interaktif, 404 custom, sitemap + RSS +
robots.txt, dan Vercel Web Analytics terpasang. **Identitas visual final
sudah diterapkan** (bukan lagi provisional M1): kertas krem `#F5EFE1`, ink
`#18140F`, aksen hijau tua `#38523A`, serif Bodoni Moda + sans Karla — lihat
ARCHITECTURE.md bagian "Visual identity" untuk detail dan alasannya.

**Aksi tersisa untuk user (bukan kode):** aktifkan Web Analytics secara
manual di dashboard Vercel (Project → Analytics → Enable) — Claude tidak
bisa menyentuh toggle dashboard/akun itu; skrip `<Analytics />` sudah
terpasang dan siap begitu diaktifkan.

## Last session

2026-07-16 s/d 2026-07-17: T-01–T-13 (M1+M2, sebagian via Workflow
multi-agent — detail & recovery BSOD di LESSONS.md). Lalu M3 T-14–T-18
dikerjakan solo berurutan dalam sesi yang sama:

- **T-14** — identitas visual final: mockup-first (3 arah di-publish sebagai
  Artifact), user memilih komposisi Reading Room + palet Field Notes +
  font anti-mainstream, lalu konvergen ke referensi nyata user (kertas
  krem, serif Didone Bodoni Moda, meta row, TOC) — diterapkan ke seluruh
  situs. Satu bug ditemukan: reset `font-weight` unlayered mengalahkan
  semua utility Tailwind `font-*` (cascade-layer gotcha).
- **T-15** — timeline pengalaman interaktif di About (native `<details>`),
  konten digali dari `Website_Portfolio` lama, diverifikasi ke user sebelum
  dipakai (1 deskripsi ternyata salah-tempel di sumber, dibuang).
- **T-16** — OG image per post (Satori + resvg, 1200×630, pakai token
  desain situs sendiri) + meta tag `og:*`/`twitter:*` lengkap yang
  sebelumnya tidak ada sama sekali. `astro.config.mjs` diberi `site:` (URL
  Vercel saat ini).
- **T-17** — sitemap (`@astrojs/sitemap`, exclude `/og/*` & `/404`), RSS
  feed semua post, `robots.txt` sebagai endpoint dinamis (bukan file
  statis) supaya selalu sinkron dengan `Astro.site`.
- **T-18** — Vercel Web Analytics (`@vercel/analytics/astro`) terpasang di
  `BaseLayout`; perlu diaktifkan manual di dashboard (lihat "Current
  status" di atas).

Detail teknis & gotcha non-obvious tiap task ada di
`docs/memory/LESSONS.md`; rasionale desain lengkap di ARCHITECTURE.md.
Semua task diverifikasi build + browser sebelum commit.

User eksplisit menunda T-20 (custom domain) — "belum butuh" (2026-07-17).

## Next steps

1. Tunggu arahan user: T-19 (photography, butuh foto nyata) atau task lain.
2. T-20/T-21 menunggu keputusan custom domain dari user.

## Blockers

None — sisa M3 backlog menunggu input/aset dari user, bukan blocker teknis.

## Open questions

None — lihat "Open questions" di docs/ARCHITECTURE.md untuk yang arsitektural.
