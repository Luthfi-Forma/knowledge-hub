# Roadmap — knowledge-hub

- Updated: 2026-07-29 (M6 S1–S3 selesai, S4–S5 tersisa)

<!-- The roadmap answers "what order and why". Tasks live in TASK.md, not here. -->

## Milestones

| # | Milestone | Outcome (verifiable) | Status |
|---|---|---|---|
| M1 | Fondasi & Content Engine | Situs Astro live di Vercel: schema frontmatter tervalidasi, Home + Explore + halaman post, 3 case study nyata ter-publish | done |
| M2 | Explore & keterhubungan | Filter tag, related posts, project hub pages, Pagefind search; konten + foto portfolio lama termigrasi | done |
| M3 | Identitas & polish | Desain visual final, About/CV, photography, OG images, RSS, sitemap, Vercel Analytics | done |
| M4 | Interaktivitas (Astro Islands) | ADR-002; carousel drag di Featured Projects; 4 post `research` jadi scrollytelling React island (full-replace, bukan append) — Cikarang, Kaltim/Bontang, Jabung Lampung, RPPLH Papua Selatan | done |
| M5 | DATUM — dual-mode visual overhaul | Etalase berfungsi (repo/demo hidup, project hub bisa diklik, cover nyata); identitas kedua "Immersive" aktif via toggle token remap di Home/`/explore`/`/about` — termasuk 4 post scrollytelling — tanpa satu pun edit React; registration seam bisa diseret & dioperasikan keyboard; aturan motion tercatat di RULES.md | done* |
| M6 | Atlas — satu identitas | Dual-mode hilang total (`grep data-mode` nol); satu wadah `Plate` menggantikan PostCard+PostListItem; rail legenda 224px permanen jadi filter; nav 4 item semuanya halaman nyata, nol orphan; `/topics/**` hidup dengan topik bertetangga terhitung; 14 item verification checklist handoff lolos | in progress (S1–S3 selesai T-45–T58; S4–S5 tersisa T-59–T-62) |
| M7 | Atlas — lapisan editorial | 20 definisi topik ter-publish; ≥3 cross-link inline per post (dari nol hari ini); angka `impact` di stamp lembar untuk post yang punya | planned |

\* Satu pengecualian tercatat: T-36 (baseline Lighthouse resmi) tetap
terbuka di Backlog — diblokir tooling di luar kendali sesi ini (PSI web UI
macet di polling, API PSI kena rate-limit dari dua jalur berbeda, dicoba
dua kali di sesi yang berbeda), dan user secara eksplisit menunda ini
(2026-07-28). Pengganti sementara (berat transfer produksi nyata via
`curl`, bukan skor Lighthouse resmi) tercatat di `docs/TESTING.md`.

Custom domain dan arsip repo lama (awalnya bagian M3) ditunda eksplisit oleh
user — lihat T-20/T-21 di TASK.md Backlog.

## Current focus

**M6 — Atlas.** M1–M5 selesai (M5 dengan satu pengecualian tercatat, lihat
catatan tabel milestone). M6 mengerjakan perombakan visual "Atlas" dari
handoff Claude Design yang di-versi di `docs/design/atlas/` — arah dan
konsekuensinya diputuskan di
[ADR-004](decisions/ADR-004-atlas-single-identity.md). S1 (Fondasi,
T-45–T-49), S2 (Komponen inti, T-50–T-52), dan S3 (IA & route, T-53–T-58)
selesai — 14 commit bersih di `main`. Task aktif dimulai dari T-59 (S4 —
Aksesibilitas & search) di TASK.md.

Rencana M6 lengkap (slicing S1–S5, koreksi terhadap handoff, verifikasi):
`C:\Users\Luthfi\.claude\plans\persiapkan-untuk-pengerjaan-milestone-crystalline-avalanche.md`.
Rencana M5 (arah visual, skor juri, daftar yang dibunuh):
`C:\Users\Luthfi\.claude\plans\c-users-luthfi-desktop-knowledge-hub-m5-squishy-gadget.md`.

## Phase detail

### M1 — Fondasi & Content Engine

- Init Astro + Tailwind + MDX; struktur content collection `posts`.
- Schema frontmatter zod: `title, summary, date, type, tags[], project?, repo?,
  demo?, cover?, draft` — build gagal jika tidak valid.
- Layout dasar + halaman: Home (Hero, Featured Projects, Latest Posts, Contact),
  Explore (daftar semua post, filter type sederhana), detail post, About
  (placeholder), 404.
- Tulis 3 case study (English) dari proyek nyata.
- Hubungkan repo GitHub → deploy Vercel, verifikasi URL publik.

### M2 — Explore & keterhubungan

- Filter tag di Explore; halaman `/tags/[tag]`.
- Related posts (shared tags/project) di bawah tiap post.
- Project hub `/projects/[name]` — mengumpulkan semua post satu proyek + link
  repo/demo.
- Pagefind search.
- Migrasi konten + foto dari `Website_Portfolio` lama.

### M3 — Identitas & polish

- Desain visual final (typography, palette) per standar desain OS.
- About/CV interaktif; section photography.
- OG image per post, RSS, sitemap, Vercel Analytics.

### M4 — Interaktivitas (Astro Islands)

- ADR-002: kebijakan two-tier islands (vanilla script untuk interaksi
  sederhana, React island untuk pengalaman kaya) — default situs tetap
  zero-JS SSG.
- Lebur `type: journal` ke `article`; polish baca ala Medium (drop cap,
  pull-quote) khusus `type: article`.
- Carousel drag kiri/kanan di Featured Projects (Home) — tier 1, vanilla.
- Scrollytelling (tier 2, React island) untuk `type: research` — opt-in via
  `presentation: "scrollytelling"`, full-replace (bukan append) narasi MDX
  lama. Diterapkan ke 4 post: `cikarang-industrial-settlement-pattern`
  (pilot), `bontang-poverty-mapping` (reframe ke konteks provinsi Kaltim),
  `jabung-lampung-coastal-development` (koreksi metodologi gravity model →
  Skalogram), `rpplh-south-papua`.

### M5 — DATUM (dual-mode visual overhaul)

Identitas krem sekarang menjadi **Reading Mode** dan tidak diubah; identitas
kedua **Immersive Mode** dirancang dari nol dengan konsep *seri lembar peta*
(DATUM): collar lembar survei, field bergraticule CSS, tiap post sebagai
*plate* berkoordinat, tipe post sebagai kelas lahan berhatch.

- **S1 — Etalase.** Kriteria sukses brief (`post → project hub → repo/demo`
  dalam ≤ 2 klik) hari ini putus di setiap sambungan; ini diperbaiki lebih
  dulu karena murah dan terverifikasi lewat baca diff. Termasuk cover art
  project (SVG editorial digenerate, bukan screenshot, atas arahan user).
- **S2 — Fondasi dual-mode.** ADR-003, blok remap token di `@layer base`,
  `ModeController` Tier-1 pra-paint. Kunci arsitekturnya: **remap 8 token
  yang sudah ada, bukan bikin token paralel** — terverifikasi 0 hex literal
  dan 72 `var(--color-*)` di 4 modul scrollytelling, sehingga seluruh situs
  ikut berganti identitas tanpa edit React.
- **S3 — Identitas DATUM** di homepage (`ImmersiveIndex.astro`): collar
  bar atas/bawah (disederhanakan dari frame 4-sisi *fixed* di brainstorming
  awal — tick lintang & crosshair SVG dilewati, tidak memetakan apa pun
  nyata), field graticule CSS murni, plate berkoordinat asli (field
  `coordinates` baru di schema, diisi 10/11 post), legenda kolom sekaligus
  filter ke `/explore/[type]`. Tipografi Immersive: satu keluarga variable
  font self-hosted, Archivo (sumbu `wdth`+`wght`) — disederhanakan dari
  usulan awal 3-keluarga (Archivo Expanded/Spectral/Spline Sans Mono);
  Spectral ditahan sampai ada prosa panjang sungguhan di Immersive.
- **S4 — Registration seam.** Wipe `clip-path` di bawah jari pengunjung,
  pointer + keyboard, tanpa `rAF`, tanpa clone DOM — menyeret dua tree
  `[data-mode-view]` yang sudah ada dari S3. Plus `@view-transition
  { navigation: auto }` CSS murni untuk crossfade antar halaman.
- **S5 — Perluasan + pengukuran.** `/explore` (pakai ulang `ImmersiveIndex`)
  + `/about` (komposisi baru, `ImmersiveDossier.astro`, bahasa visual sama
  tanpa hatch). Kekhawatiran layout mobile collar di deskripsi task asli
  ternyata sudah tidak berlaku — collar S3 sudah versi sederhana, cukup
  dicek ulang di 375px. Aturan motion dikonsolidasi ke `docs/RULES.md`
  (bukan file `MOTION.md` baru). Baseline Lighthouse tetap terbuka (T-36,
  lihat catatan di tabel milestone atas).

### M6 — Atlas (satu identitas)

Dipicu handoff eksternal dari **Claude Design** (`docs/design/atlas/`, README-nya
spesifikasi high-fidelity; 5 file `.dc.html` adalah design reference, bukan kode
produksi). Arah: melebur Reading + Immersive jadi satu identitas dengan mengangkat
bahasa kartografis DATUM ke latar kertas terang, dan menaikkan **topik** jadi warga
kelas satu karena audiens utama situs adalah komunitas GIS. Keputusan +
konsekuensinya: [ADR-004](decisions/ADR-004-atlas-single-identity.md).

- **S1 — Fondasi** (T-45–T-49). Bundel handoff masuk repo; ADR-004; bongkar
  dual-mode (`data-mode`, seam, toggle, `mode-toggle.ts`); token Atlas 9 warna
  dengan pembagian peran (`--color-accent` yang mengerjakan 6 tugas dipecah jadi
  research/project/flag) — `--color-chart-1/2` **dipertahankan sebagai alias**
  supaya invarian "nol edit React" ADR-003 #5 tetap berlaku; Bodoni+Karla dilepas,
  Archivo mengerjakan display *dan* body, IBM Plex Mono di-self-host untuk notasi;
  radius nol di seluruh sistem.
- **S2 — Komponen** (T-50–T-52). `Plate` (lead/standard/compact) menggantikan
  PostCard+PostListItem; `LegendRail` 224px + `TopicChip`; collar 2 baris dengan
  breadcrumb notasi, skip-link, satu bahasa kontrol 4 tingkat, footer 4 kolom.
- **S3 — IA** (T-53–T-58). `lib/topics.ts` (co-occurrence, bukan daftar manual) +
  koleksi `topics`; `/tags/**` → `/topics/**` dan `/explore` → `/` lewat 308 di
  `vercel.json` baru; Sheet Index; halaman topik; rail marginalia di post; sisa route.
- **S4 — A11y & search** (T-59–T-60). Satu-satunya kerja sisi React: tabel data
  alternatif tiap chart + `useReducedMotion()` di 4 modul. Pagefind di-restyle ke
  token Atlas → menutup DEBT #1.
- **S5 — Penutupan** (T-61–T-62). OG image ikut Atlas (palet + typeface, 3 TTF
  Bodoni/Karla dihapus); 14 item verification checklist handoff; remeasure berat
  transfer; dokumentasi.

**Sengaja mati di M6** (bukan regresi tak sengaja — lihat ADR-004 Consequences):
registration seam (T-42, M5) dan carousel drag Featured Projects (T-24, M4).

### M7 — Atlas (lapisan editorial)

Dipisah dari M6 atas keputusan user (2026-07-29): M6 membangun struktur dengan
graceful empty state, M7 mengisinya. Ketiganya hanya bisa ditulis pemilik situs,
bukan diturunkan dari kode.

- 20 definisi topik 1 kalimat → `src/content/topics/*.md`.
- 3–5 cross-link inline per post di body MDX — hari ini **nol** di seluruh repo,
  sehingga rail marginalia M6 lahir kosong.
- Angka `impact` untuk sebagian post → tampil di stamp lembar.

## Icebox

- GitHub API enrichment (stars, last commit, activity feed).
- Komentar via giscus.
- Multi-hashtag AND-filter; trending topics.
- i18n / versi Bahasa Indonesia.
- Research page format paper ilmiah (Abstract/Methodology/...) — baru relevan
  saat ada ≥ 2 konten research.

### Dibunuh di brainstorming M5 (jangan dihidupkan tanpa alasan baru)

- three.js / camera system / Knowledge Observatory — butuh teknologi di luar
  brief **dan** tidak bisa diverifikasi (`rAF` tidak pernah jalan di
  environment ini).
- Particle system + animated background — penanda AI-generik persis yang
  T-14 habiskan satu milestone untuk dihindari.
- Digital Workspace desk metaphor — butuh aset ilustrasi yang tidak ada, dan
  mengunci 6 kategori ke dalam furnitur (bertentangan dengan keputusan
  satu-tipe-konten di PROJECT_BRIEF).
- Route Notes / Journal / Book Reviews — 0 post masing-masing; T-22 sudah
  melebur `journal` → `article` persis karena alasan ini.
- ~~Restrukturisasi IA 10 route~~ — **dihidupkan kembali di M6 dengan alasan baru**
  (ADR-004 #5). Alasan pembunuhnya dulu adalah sitasi eksternal nyata ke post
  Cikarang; Atlas tidak memindahkan `/posts/[slug]` sama sekali — yang pindah hanya
  route indeks (`/explore`, `/tags/*`), ditangani redirect 308 di `vercel.json`.
- Metadata `difficulty`, Learning Path, GitHub auto-sync (non-goal tertulis
  di brief yang sudah Approved).

### Digerbangi, bukan dibunuh

- **Knowledge graph SVG statis build-time** (nol library, tiap node `<a href>`
  asli, satu file untuk dihapus) — gerbang: **≥ 20 post dan ≥ 15 cross-link
  inline antar-post**. Hari ini nol cross-link ada di seluruh body MDX, dan
  relasi `project` menyumbang nol edge karena tiap slug hanya dipakai 1 post.
  **M7 (T-64) menggerakkan setengah gerbang ini** — 3–5 cross-link × 11 post
  melewati ambang 15; sisa gerbangnya (≥20 post) tetap butuh konten baru. Selain
  itu M6 sudah membangun lapisan relasi yang sebenarnya dibutuhkan graph:
  `lib/topics.ts` menghitung co-occurrence topik, yang menyumbang edge nyata
  tanpa bergantung pada `project`.
