# Project State — knowledge-hub

<!-- SNAPSHOT file: overwrite it, do not append. Updated at every session close
     by /project-status, grounded in git log — not recall. -->

- Updated: 2026-07-17
- Milestone: M1 dan M2 selesai — M3 (Identitas & polish) sedang berjalan: T-14–T-18 selesai, T-19 dibangun tapi diblokir foto nyata (see docs/ROADMAP.md)

## Current status

M1, M2, T-14–T-18 (M3) selesai; T-19 (photography) kodenya sudah jadi tapi
belum ada konten nyata. Situs live di
[knowledge-hub-inky.vercel.app](https://knowledge-hub-inky.vercel.app), repo
[github.com/Luthfi-Forma/knowledge-hub](https://github.com/Luthfi-Forma/knowledge-hub)
(public) terhubung ke Vercel — tiap push ke `main` auto-deploy. Situs punya
8 post nyata, Home, Explore (filter + search Pagefind), detail post (+TOC,
reading time, related posts, OG image per post), halaman tag, project hub,
About dengan timeline pengalaman interaktif, 404 custom, sitemap + RSS +
robots.txt, Vercel Web Analytics, dan `/photography` (kosong, menunggu
foto). **Identitas visual final sudah diterapkan**: kertas krem `#F5EFE1`,
ink `#18140F`, aksen hijau tua `#38523A`, serif Bodoni Moda + sans Karla —
lihat ARCHITECTURE.md bagian "Visual identity".

**Aksi tersisa untuk user (bukan kode):**
1. Aktifkan Web Analytics manual di dashboard Vercel (Project → Analytics →
   Enable) — toggle akun yang tidak bisa disentuh dari kode.
2. Taruh file foto asli untuk melengkapi T-19 (lihat "Next steps").

## Last session

2026-07-16 s/d 2026-07-17: T-01–T-13 (M1+M2) lalu M3 T-14–T-19 dikerjakan
berurutan dalam sesi yang sama. Ringkas: T-14 identitas visual final
(mockup-first → referensi user → kertas krem + Bodoni Moda + Karla), T-15
timeline pengalaman interaktif di About, T-16 OG image per post (Satori +
resvg) + meta tag sosial lengkap, T-17 sitemap + RSS + robots.txt, T-18
Vercel Web Analytics, T-19 fondasi photography (`type: "photo"` baru di
schema posts, cover wajib divalidasi zod, `/photography` grid, cover foto
tidak di-crop paksa 16:9 seperti cover post lain). Kompresi foto otomatis
lewat Sharp (sudah bundled di Astro via `astro:assets`), tidak perlu
pipeline tambahan. Satu bug ditemukan & diperbaiki saat verifikasi 375px:
nav header overflow setelah nav item "Photography" ditambahkan (4 link
tidak muat 1 baris di mobile) — fix: `flex-wrap` pada header + padding link
lebih kecil di breakpoint kecil. Detail teknis & gotcha non-obvious tiap
task ada di `docs/memory/LESSONS.md`; rasionale desain lengkap di
ARCHITECTURE.md. Semua task diverifikasi build + browser sebelum commit.
User eksplisit menunda T-20 (custom domain) — "belum butuh" (2026-07-17).

## Next steps

1. **User taruh file foto** di `src/content/posts/` sebagai `.mdx` baru,
   format sama seperti post lain tapi `type: "photo"` dan `cover` wajib:
   ```
   ---
   title: "..."
   summary: "..."
   date: 2026-07-17
   type: photo
   tags: [...]
   cover: ./nama-file-foto.jpg
   draft: false
   ---
   ```
   Body MDX boleh kosong/singkat (bukan long-form seperti case study). File
   gambar ditaruh di folder yang sama dengan `.mdx`-nya (co-located, sama
   seperti cover 4 case study GIS yang sudah ada).
2. Setelah foto masuk: build + verifikasi grid `/photography` di browser
   (breakpoint 375–1440), lalu tandai T-19 selesai di TASK.md dan commit.
3. T-20/T-21 menunggu keputusan custom domain dari user.

## Blockers

None — T-19 menunggu aset dari user, bukan blocker teknis.

## Open questions

None — lihat "Open questions" di docs/ARCHITECTURE.md untuk yang arsitektural.
