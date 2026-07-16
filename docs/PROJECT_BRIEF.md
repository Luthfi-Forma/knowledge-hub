# Project Brief — knowledge-hub

> Personal knowledge hub that connects all projects, writing, and research into one explorable ecosystem

- Date: 2026-07-16
- Status: Approved

## Problem

Karya tersebar di banyak platform (repo GitHub per proyek, demo di Vercel, foto,
riset akademik) tanpa satu pintu masuk yang menghubungkannya. Portfolio lama
(`Website_Portfolio`, HTML statis di GitHub Pages) hanya menampilkan hasil akhir,
bukan proses berpikir, dan tidak dirancang untuk tumbuh bersama bertambahnya
artikel/riset. Recruiter atau kolaborator yang menemukan satu karya tidak punya
jalan untuk menemukan karya lain yang berkaitan.

## Audience

- **Recruiter / calon klien** — menilai kompetensi lewat case study proyek, bukan
  sekadar daftar skill.
- **Komunitas GIS / AI / urban planning** — menemukan tutorial, riset, dan tools
  lewat topik.
- **Diri sendiri** — arsip jangka panjang perjalanan belajar dan referensi antar
  proyek.

## Proposed solution

Situs Astro statis dengan **satu jenis konten ("post")** yang dibedakan lewat
metadata tervalidasi (type, tags, project), bukan folder/kategori kaku. Website
berperan sebagai museum/pusat navigasi: cerita dan dokumentasi ada di sini,
source code tetap di repo GitHub masing-masing, demo di hosting masing-masing —
semuanya ditautkan dari halaman post. Konten publik berbahasa **English**.
Menggantikan `Website_Portfolio` lama; kontennya dimigrasikan (M2), reponya
diarsipkan (M3).

## Scope (v1)

- Content collection `posts` dengan frontmatter tervalidasi zod:
  `title, summary, date, type (project|article|research|journal), tags[],
  project?, repo?, demo?, cover?, draft`.
- Halaman inti: Home (Hero, Featured Projects, Latest Posts, Contact), Explore
  (filter type + tag), detail post `[slug]`, project hub `/projects/[name]`,
  About, 404.
- Related posts berdasarkan shared tags/project.
- Search client-side (Pagefind).
- Seed dengan konten nyata: case study Jabodetabek-Connect, Jakarta Transit
  Heritage Explorer, CDMP-Jabodetabek + migrasi konten portfolio lama.
- SEO dasar: OG image, sitemap, RSS.
- Deploy Vercel sejak hari pertama.

## Non-goals

- **Komentar** (giscus dkk.) — butuh moderasi; v2 bila ada pembaca.
- **GitHub API auto-sync** (stars, activity feed, auto-import README) — rapuh
  (rate limit, format tak seragam); v1 cukup link keluar manual.
- **i18n / konten dwibahasa** — konten publik English saja dulu.
- **CMS / admin UI** — konten adalah file MDX di repo, diedit via editor.
- **Multi-hashtag AND-filter & trending topics** — butuh analytics yang belum ada.
- **Backend/database apa pun** — situs sepenuhnya statis.

## Success criteria

- Situs live di Vercel dengan ≥ 6 konten nyata (bukan lorem ipsum) saat v1 selesai.
- Pengunjung bisa: menemukan post lewat tag ATAU search, dan berpindah dari post →
  project hub → repo/demo dalam ≤ 2 klik.
- Setiap milestone menambah konten nyata, bukan hanya fitur (aturan *content-first*).
- Lighthouse Performance & SEO ≥ 90 pada halaman Home dan satu halaman post.
- Frontmatter tidak valid menggagalkan build (schema zod enforced).

## Constraints

- Solo developer, pemula — teknologi baru dibatasi: hanya Astro (ADR-001);
  sisanya (Tailwind, Vercel, MDX) sudah dikenal.
- Dev di Windows tanpa admin; gratis (free tier Vercel).
- Kritik desain awal yang membentuk scope ini terdokumentasi di
  `C:\Users\Luthfi\Documents\Personal-Knowledge_Platform.md` + interview 2026-07-16.

## References

- Dokumen visi: `C:\Users\Luthfi\Documents\Personal-Knowledge_Platform.md`
- Portfolio lama (digantikan): `Projects\Website_Portfolio`
- Sumber konten seed: `Projects\Jabodetabek-Connect`,
  `Projects\Jakarta_Transit_Heritage_Explorer`, `Projects\CDMP-Jabodetabek`
- ADR stack: [decisions/ADR-001-astro-over-nextjs.md](decisions/ADR-001-astro-over-nextjs.md)
