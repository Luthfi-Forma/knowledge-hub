# Project State — knowledge-hub

<!-- SNAPSHOT file: overwrite it, do not append. Updated at every session close
     by /project-status, grounded in git log — not recall. -->

- Updated: 2026-07-17
- Milestone: M1 dan M2 selesai — M3 (Identitas & polish) belum di-breakdown ke TASK.md (see docs/ROADMAP.md)

## Current status

**M1 dan M2 selesai.** T-01 sampai T-13 semua done. Situs live di
[knowledge-hub-inky.vercel.app](https://knowledge-hub-inky.vercel.app), repo
[github.com/Luthfi-Forma/knowledge-hub](https://github.com/Luthfi-Forma/knowledge-hub)
(public) terhubung ke Vercel project `luthfi-formas-projects/knowledge-hub`
— tiap push ke `main` auto-deploy. Diverifikasi langsung di production:
Home/Explore/`/posts/[slug]`/404 semua 200 (404 benar-benar 404), 3 case
study tampil di Featured Projects, tanpa console error.

Proyek Astro 7 + Tailwind CSS v4 + MDX berjalan di root repo. Content
collection `posts` (`src/content.config.ts`, Content Layer API) punya schema
zod lengkap sesuai content model di ARCHITECTURE.md.

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
ketiganya, bukan lagi empty state.

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

Diverifikasi (M1): kontras WCAG AA jauh di atas ambang, tap target ≥44px,
heading order tanpa skip level, focus ring solid terlihat (sempat ada bug
`outline-style: none` karena lupa utility `outline` polos — sudah
diperbaiki), tidak ada horizontal scroll di 375/768/1024/1440px, 404
mengembalikan HTTP 404 yang benar.

**M2 selesai (T-09–T-13)**, dikerjakan via Workflow tool (multi-agent
paralel, atas permintaan eksplisit user) — 6 agent di git worktree
terisolasi:

- T-09: `getAllTags`/`getPostsByTag` di lib/posts.ts; `/tags` (browse semua
  tag + count) dan `/tags/[tag]`; tag di halaman post jadi link.
- T-10: `getRelatedPosts` (skor: +2 project sama, +1 per tag sama, min
  skor>0, tanpa padding) + komponen `RelatedPosts` (render null bila kosong,
  bukan empty-state box) di halaman post.
- T-11: `getProjectSlugs`/`getPostsByProject`/`getProjectSummary` +
  `/projects` dan `/projects/[name]` (repo/demo ditarik dari post mana pun
  dalam grup yang punya field itu).
- T-12: Pagefind (`pagefind --site dist` sebagai postbuild step di
  package.json) + search UI di `/explore` — diverifikasi nyata (bukan
  cuma "build sukses"): `astro preview` + search query "octilinear"
  mengembalikan hasil yang benar dengan sub-result highlights.
- T-13: About diisi konten nyata (bio/pendidikan/expertise/dokumen/
  pengalaman kerja, diriset dari `Website_Portfolio/index.html` +
  portrait.png asli) + 4 case study baru (`type: research`) diriset dari
  proyek nyata pemilik (thesis Cikarang, pemetaan kemiskinan Bontang, RPPLH
  Papua, Jabung Lampung) lengkap dengan cover image asli.

**Insiden BSOD saat workflow berjalan** — 3 dari 6 agent sempat commit
sebelum crash (T-09, T-10, T-13b), 3 lainnya (T-11, T-12, T-13a) punya kerja
belum ter-commit tapi utuh di worktree masing-masing (diverifikasi build
sukses dulu sebelum di-commit manual, bukan langsung dipercaya). Semua 6
branch di-merge manual ke `main` satu per satu — 2 konflik (di
`src/lib/posts.ts`, karena 2-3 agent menambah fungsi baru di baris akhir
file yang sama) diselesaikan dengan menggabungkan kedua sisi, bukan memilih
salah satu. Build gabungan + verifikasi browser dijalankan ulang dari nol
setelah semua merge, BUKAN dipercaya dari verifikasi per-agent yang
terpisah.

Perbaikan pasca-merge yang ditemukan saat verifikasi gabungan (bukan oleh
agent manapun secara individual): halaman detail post tidak pernah
me-render `cover` image sama sekali (di-flag oleh agent T-13b sendiri
sebagai di luar scope-nya, diperbaiki saat integrasi); bug spasi hilang
setelah link inline muncul lagi di halaman About (kelas bug yang sama
dengan LESSONS.md 2026-07-16); judul project di `/projects` men-title-case
mentah slug ("Cdmp Jabodetabek") — ditambah override map kecil
(`getProjectTitle`).

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
- 2026-07-16: T-08 — user membuat repo GitHub kosong
  (`Luthfi-Forma/knowledge-hub`), saya verifikasi via `git ls-remote` sebelum
  push (bukan langsung push blind). `npx vercel whoami` (dimaksudkan cek
  status read-only) ternyata langsung menyelesaikan device-auth login tanpa
  approval eksplisit terlihat — dilaporkan ke user, dikonfirmasi itu memang
  akunnya. `vercel link` otomatis mendeteksi & menghubungkan remote GitHub;
  `vercel --prod` deploy sukses ke `knowledge-hub-inky.vercel.app`.
  Diverifikasi langsung di URL production (bukan cuma percaya command
  sukses): beberapa route return 200, 404 return 404, tanpa console error.
  Update ROADMAP (M1 done, M2 active), README, DEPLOYMENT.md, DEVELOPMENT.md
  dengan info deploy nyata; hapus entri LESSONS.md placeholder, tambah lesson
  soal `vercel whoami` tidak read-only.

- 2026-07-17: T-09–T-13 (M2) — dikerjakan via Workflow multi-agent paralel
  (6 agent, git worktree terisolasi) atas permintaan eksplisit user. BSOD
  menghentikan proses di tengah jalan; 3 agent sudah sempat commit, 3
  lainnya diselamatkan dari worktree yang masih utuh (diverifikasi build
  dulu, baru di-commit manual). Semua 6 branch di-merge ke main satu per
  satu, 2 konflik di lib/posts.ts diselesaikan manual (gabung, bukan
  pilih). Build+browser diverifikasi ulang dari nol pasca-merge; ditemukan
  & diperbaiki 3 gap integrasi (cover image tak pernah dirender, bug spasi
  About kambuh lagi, judul project mentah). Worktree & branch sementara
  dibersihkan setelah semua ter-merge dan push.

## Next steps

1. Breakdown task M3 (Identitas & polish) ke docs/TASK.md sebelum mulai
   coding — belum ada task M3 yang didefinisikan.

## Blockers

None.

## Open questions

None — lihat "Open questions" di docs/ARCHITECTURE.md untuk yang arsitektural.
