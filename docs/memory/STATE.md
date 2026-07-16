# Project State — knowledge-hub

<!-- SNAPSHOT file: overwrite it, do not append. Updated at every session close
     by /project-status, grounded in git log — not recall. -->

- Updated: 2026-07-16
- Milestone: M1 — Fondasi & Content Engine (see docs/ROADMAP.md)

## Current status

T-01 sampai T-07 selesai — seluruh 3 case study M1 sudah publish. Proyek
Astro 7 + Tailwind CSS v4 + MDX berjalan di root repo. Content collection
`posts` (`src/content.config.ts`, Content Layer API) punya schema zod
lengkap sesuai content model di ARCHITECTURE.md.

Tiga case study nyata sudah publish, ketiganya diriset dari repo proyek
aslinya (README/brief/architecture/ADR/git log/data), bukan karangan:

- `jabodetabek-connect.mdx` — peta transit octilinear ala Mini Metro, v1
  feature-complete tapi belum di-deploy dan belum punya repo GitHub publik
  → `repo`/`demo`/`cover` sengaja kosong.
- `jakarta-transit-heritage-explorer.mdx` — GIS walking companion 3-node
  (Jakarta Kota/Blok M/Ragunan) + digital passport. Repo GitHub-nya ADA
  (`github.com/Luthfi-Forma/Jakarta_Transit_Heritage_Explorer`, dari `git
  remote`) tapi diverifikasi via browser + `api.github.com` masih **privat**
  (404 publik) dan GitHub Pages-nya belum live (404) meski sudah di-wiring —
  jadi `repo`/`demo` tetap dikosongkan sampai benar-benar publik, bukan
  ditebak dari nama repo.
- `cdmp-jabodetabek.mdx` — peta gelap Jabodetabek + timeline slider (14
  proyek pembangunan 1989–2027, dibaca langsung dari `projects.geojson`),
  animasi crossfade rAF karena MapLibre tidak men-transisikan paint
  data-driven. Belum ada remote git sama sekali → `repo`/`demo` kosong.

Featured Projects di Home & `/explore/project` sekarang menampilkan
ketiganya, bukan lagi empty state — **M1 "3 case study nyata" per
ROADMAP.md tercapai**, tersisa T-08 (deploy) untuk menutup milestone M1
sepenuhnya.

Situs sekarang punya layout dasar nyata: `BaseLayout` + `Header`/`Footer`,
Home (`/` — Hero, Featured Projects, Latest Posts, Contact), Explore
sederhana (`/explore` + `/explore/[type]` via `getStaticPaths`, filter type
tanpa client-side JS), detail post (`/posts/[slug]`, render MDX via
`astro:content` `render()`, tipografi prose custom di scoped `<style>`),
About placeholder (`/about`), dan 404 custom. Nav Header sekarang: Explore,
About, Contact. Empty state jujur dipakai di mana pun belum ada post nyata
(Featured Projects, tab type yang masih kosong) — tidak ada data fiktif.

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

Diverifikasi: build 12 route statis, kontras WCAG AA jauh di atas ambang,
tap target ≥44px, heading order tanpa skip level, focus ring solid terlihat
(sempat ada bug `outline-style: none` karena lupa utility `outline` polos —
sudah diperbaiki), tidak ada horizontal scroll di 375/768/1024/1440px, 404
mengembalikan HTTP 404 yang benar.

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
- 2026-07-16: T-04 — halaman detail post `[slug]`, About placeholder, 404;
  wiring href PostCard/PostListItem ke `/posts/[slug]` yang tadinya sengaja
  ditunda di T-03. Ketemu & perbaiki bug spasi hilang setelah link inline
  (Astro trim whitespace baris baru) di About.
- 2026-07-16: T-05 — case study Jabodetabek-Connect, diriset dari repo
  proyek aslinya (bukan proyek pengganti Website_Portfolio — proyek transit
  map terpisah); verifikasi build + render (heading order, empty state
  hilang di Featured/`/explore/project`); kecilkan `aria-disabled` yang
  selalu `"false"` di PostCard jadi hanya muncul saat memang tanpa href.
- 2026-07-16: T-06 — case study Jakarta Transit Heritage Explorer, diriset
  dari `Documentation/` proyek aslinya (brief, PRD, ARCHITECTURE, ADR-006/
  007/008) + `git log`; cek langsung via browser bahwa repo GitHub-nya masih
  privat dan GitHub Pages belum live sebelum memutuskan tetap mengosongkan
  `repo`/`demo` — jangan percaya begitu saja URL yang disebut di memory file
  proyek lain tanpa verifikasi ulang.
- 2026-07-16: T-07 — case study CDMP-Jabodetabek, diriset dari PROJECT_BRIEF
  + STATE.md proyek aslinya + `projects.geojson` langsung (daftar 14 proyek
  nyata dibaca via node, bukan ditebak); tidak ada git remote sama sekali →
  `repo`/`demo` kosong. Featured Projects & `/explore/project` sekarang
  menampilkan 3 case study — target "3 case study nyata" M1 tercapai.

## Next steps

1. T-08: hubungkan repo GitHub + deploy Vercel — task terakhir M1.

## Blockers

None.

## Open questions

None — lihat "Open questions" di docs/ARCHITECTURE.md untuk yang arsitektural.
