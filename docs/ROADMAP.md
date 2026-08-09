# Roadmap — knowledge-hub

- Updated: 2026-08-09 (M10 dibuka — T-71–T-81)

<!-- The roadmap answers "what order and why". Tasks live in TASK.md, not here. -->

## Milestones

| # | Milestone | Outcome (verifiable) | Status |
|---|---|---|---|
| M1 | Fondasi & Content Engine | Situs Astro live di Vercel: schema frontmatter tervalidasi, Home + Explore + halaman post, 3 case study nyata ter-publish | done |
| M2 | Explore & keterhubungan | Filter tag, related posts, project hub pages, Pagefind search; konten + foto portfolio lama termigrasi | done |
| M3 | Identitas & polish | Desain visual final, About/CV, photography, OG images, RSS, sitemap, Vercel Analytics | done |
| M4 | Interaktivitas (Astro Islands) | ADR-002; carousel drag di Featured Projects; 4 post `research` jadi scrollytelling React island (full-replace, bukan append) — Cikarang, Kaltim/Bontang, Jabung Lampung, RPPLH Papua Selatan | done |
| M5 | DATUM — dual-mode visual overhaul | Etalase berfungsi (repo/demo hidup, project hub bisa diklik, cover nyata); identitas kedua "Immersive" aktif via toggle token remap di Home/`/explore`/`/about` — termasuk 4 post scrollytelling — tanpa satu pun edit React; registration seam bisa diseret & dioperasikan keyboard; aturan motion tercatat di RULES.md | done* |
| M6 | Atlas — satu identitas | Dual-mode hilang total (`grep data-mode` nol); satu wadah `Plate` menggantikan PostCard+PostListItem; rail legenda 224px permanen jadi filter; nav 4 item semuanya halaman nyata, nol orphan; `/topics/**` hidup dengan topik bertetangga terhitung; 14 item verification checklist handoff lolos | done |
| M7 | Atlas — lapisan editorial | 20 definisi topik ter-publish; ≥3 cross-link inline per post (dari nol hari ini); angka `impact` di stamp lembar untuk post yang punya | done** |
| M8 | Perbaikan visual & suara editorial | Cover index tinggi konsisten (`aspect-ratio` menggantikan crop erratic); scrollytelling desktop 5/7 + rail di bawah island, mobile dock tidak lagi menutupi teks; collar mobile 305px→147px; nol em/en dash naratif di seluruh prosa situs | done |
| M9 | 3 artikel naratif baru | 3 post `type: article` ter-publish dari materi pemilik situs (14 post total); 1 tag baru `economic-policy`; nol kalimat prosa milik user diedit | done |
| M10 | Story framework & lapisan spasial | ADR-005; prosa 4 post scrollytelling kembali ke body MDX (`grep "body:" src/lib/scrollytelling` nol); satu stage persisten dengan progress kontinu menggantikan remount-per-scene; post Cikarang dapat scene spasial dari geometri 5 distrik tulis-tangan — nol library peta, nol dependensi baru (`git diff package.json` kosong); `duration: 0.4` di chrome scrollytelling nol; `:active` dan `:hover` chip yang hilang terpasang | in progress |

\* Satu pengecualian tercatat: T-36 (baseline Lighthouse resmi) tetap
terbuka di Backlog — diblokir tooling di luar kendali sesi ini (PSI web UI
macet di polling, API PSI kena rate-limit dari dua jalur berbeda, dicoba
dua kali di sesi yang berbeda), dan user secara eksplisit menunda ini
(2026-07-28). Pengganti sementara (berat transfer produksi nyata via
`curl`, bukan skor Lighthouse resmi) tercatat di `docs/TESTING.md`.

\*\* 8 dari 11 post mencapai ≥3 cross-link; 4 sengaja di bawah itu (2
masing-masing) — `jabodetabek-connect` dan tiga foto Tanggamus, karena
kandidat cross-link nyata untuk post-post itu memang cuma 2, bukan
dipaksakan jadi 3+ dengan tautan yang dikarang-karang. Detail di
`docs/TASK.md` Done, entri T-64.

Custom domain dan arsip repo lama (awalnya bagian M3) ditunda eksplisit oleh
user — lihat T-20/T-21 di TASK.md Backlog.

## Current focus

**M1–M8 semuanya selesai** (M5 dengan satu pengecualian tercatat, lihat
catatan tabel milestone). M6 "Atlas" — perombakan visual dari handoff
Claude Design di `docs/design/atlas/`, arah+konsekuensi di
[ADR-004](decisions/ADR-004-atlas-single-identity.md) — tutup lewat S1
(Fondasi, T-45–T-49) → S2 (Komponen inti, T-50–T-52) → S3 (IA & route,
T-53–T-58) → S4 (Aksesibilitas & search, T-59–T-60) → S5 (Aset & penutupan,
T-61–T-62), sudah di-push. **M7 — lapisan editorial selesai total**: T-63
(20 definisi topik, 17 dari user + 5 fakta teknologi objektif), T-64
(cross-link inline — 8/11 post ≥3, 4 post sengaja 2 karena kandidat nyata
memang cuma segitu), T-65 (6 angka `impact`, semuanya dikutip dari konten
post yang sudah terbit). **M8 — perbaikan visual & suara editorial selesai
total**, dipicu masukan langsung pemilik situs setelah membuka situs
sendiri (`Masukan untuk Knowledge Hub.md`, 2026-08-04): T-67 (lebar &
proporsi scrollytelling, desktop dan mobile — dua akar masalah berbeda),
T-68 (collar mobile 305px→147px), T-66 (SOP cover art +
`scripts/generate-cover.mjs` permanen + perbaikan akar cropping di
`Plate.astro`), T-69 (pass `humanizer` di seluruh prosa situs, nol
fakta/cross-link berubah). Rencana penuh + pengukuran pendukung:
`C:\Users\Luthfi\.claude\plans\jelaskan-state-saat-ini-frolicking-lemur.md`.
**M9 — 3 artikel naratif baru selesai total** (T-70, dibuka+ditutup di
sesi yang sama, 2026-08-04): materi diserahkan langsung dari vault
pribadi pemilik situs, dipublish Bahasa Indonesia (deviasi dicatat
`docs/RULES.md`), nol kalimat prosa milik user diedit.

**M10 — story framework & lapisan spasial: aktif** (dibuka 2026-08-09,
T-71–T-81). Dipicu `Konsep Milestone 10.txt` dari pemilik situs; cakupan
konsep dipersempit dari 5 sub-milestone jadi 2 (framework + spasial),
Knowledge Graph ditunda ke gerbangnya sendiri, AI Layer ditolak, Immersive
ditafsir ulang jadi focus mode per-story. Urutan kerjanya sengaja menaruh
task yang **terverifikasi penuh** lebih dulu (T-72–T-75 semuanya HTML
statis atau fungsi murni) sebelum yang digerakkan scroll — karena
IntersectionObserver/`rAF` tidak menyala di browser tool sesi ini
(`docs/memory/LESSONS.md`, 2026-07-21). Lihat "Phase detail" untuk
riwayat lengkap.

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

- [x] 20 definisi topik 1 kalimat → `src/content/topics/*.md` (T-63, 2026-07-30
  — 17 dari user, 5 fakta teknologi objektif ditulis langsung karena bukan
  konten personal, lihat TASK.md Done).
- [x] 3–5 cross-link inline per post di body MDX (T-64, 2026-07-30 — 8/11
  post ≥3, 4 post sengaja 2 karena kandidat nyata memang cuma segitu;
  `ScrollytellingSection.body` diubah `string`→`ReactNode` supaya 4 modul
  scrollytelling juga bisa membawa tautan, bukan cuma 7 post MDX biasa).
- [x] Angka `impact` untuk sebagian post → tampil di stamp lembar (T-65,
  2026-07-30 — 6 post, tiap angka dikutip dari konten post yang sudah
  terbit, bukan dikarang).

### M8 — Perbaikan visual & suara editorial

Dipicu langsung oleh pemilik situs setelah membuka situs live sendiri
(`Masukan untuk Knowledge Hub.md`, 2026-08-04) — 3 dari 4 masalah yang
dilaporkan terbukti nyata lewat pengukuran browser sungguhan, bukan
sekadar selera; verifikasi juga menemukan 1 masalah tambahan (collar
mobile) yang belum pernah dilaporkan.

- [x] Lebar & proporsi scrollytelling, desktop dan mobile (T-67,
  2026-08-04 — dua akar berbeda: desktop kolom teks 316px/~38
  karakter-baris karena grid `680px 1fr` T-57 tidak sengaja mencakup post
  scrollytelling; mobile dock viz 38vh menutupi teks section karena
  `min-height` section dihitung terhadap viewport penuh, bukan area baca
  tersisa).
- [x] Collar mobile 305px → 147px (T-68, 2026-08-04 — padding horizontal
  48px/8px tanpa syarat di semua viewport, ditemukan saat verifikasi
  T-67, bukan dilaporkan user).
- [x] SOP `docs/design/COVER_ART.md` + `scripts/generate-cover.mjs`
  permanen + regenerate 3 cover project + perbaikan akar cropping
  `Plate.astro` (T-66, 2026-08-04 — `height: 100%` diganti
  `aspect-ratio: 16/10`, di-scope ke `≥480px` saja supaya perilaku
  `<480px` yang sudah benar sejak T-55 tidak teregresi).
- [x] Pass skill `humanizer` di seluruh prosa situs (T-69, 2026-08-04,
  menutup M8 — kosakata AI generik nol match; satu-satunya pola
  bervolume nyata adalah em/en dash naratif, diganti titik/koma/titik-
  dua/kurung; `building-knowledge-hub.mdx` ditulis ulang sungguhan dari
  fakta `PROJECT_BRIEF.md`; nol cross-link M7 hilang).

### M9 — 3 artikel naratif baru

Dibuka dan ditutup dalam satu sesi (2026-08-04) — pemilik situs
menyerahkan 3 artikel jadi dari vault Obsidian pribadi langsung setelah
M8 tutup.

- [x] 3 post `type: article` ter-publish (T-70, 2026-08-04 — "Data
  Spasial dan Pengambilan Keputusan dalam Perencanaan Wilayah",
  "Ketika Denial Presiden Berbuah Ancaman Krisis", "Paradoks Prioritas
  Transportasi Indonesia"; Bahasa Indonesia, deviasi dicatat
  `docs/RULES.md`; nol kalimat prosa milik user diedit — hanya adaptasi
  struktural heading; 1 tag baru `economic-policy`).

### M10 — Story framework & lapisan spasial

Dibuka 2026-08-09 dari `Konsep Milestone 10.txt` yang diserahkan pemilik
situs. Konsep aslinya berisi 5 sub-milestone (Story Framework, Spatial
Layer, Knowledge Graph, Immersive Mode, AI Layer) — itu ukuran roadmap,
bukan satu milestone. Cakupan dipersempit bersama user di sesi
pembukaan; keputusan lengkap + audit desain pendukung:
`C:\Users\Luthfi\.claude\plans\c-users-luthfi-desktop-konsep-milestone-purring-storm.md`.

**Yang dipotong dari konsep, dengan alasan:**

- **Knowledge Graph — ditunda, bukan ditolak.** Gerbangnya sudah tertulis
  di "Digerbangi, bukan dibunuh" di bawah: ≥20 post **dan** ≥15 cross-link.
  Cross-link sudah lewat; post masih 14. M10 tidak menambah post (konten
  M10 memperdalam post yang ada), jadi gerbangnya tetap tertutup setelah
  M10 selesai.
- **AI Knowledge Layer — ditolak.** Butuh backend (non-goal tertulis di
  `PROJECT_BRIEF.md`) atau ~25–30MB model di browser untuk 14 dokumen —
  100× halaman terberat situs. Pagefind sudah mengindeks semua post.
- **Immersive Mode — ditafsir ulang, bukan dihidupkan kembali.** Bukan
  identitas visual kedua (itu persis yang ADR-004 tolak), tapi mode fokus
  layar-penuh untuk SATU story: sembunyikan collar + rail, stage jadi
  dominan. Nol `data-mode`, nol pohon DOM kedua, nol token di-remap, nol
  komponen yang perlu dirancang dua kali — jadi tidak menyentuh ADR-004.
- **Library peta — ditolak.** MapLibre ~200KB gzip + fetch tile ke host
  pihak ketiga tiap kunjungan; endpoint tile remote secara fungsional
  adalah backend. Lapisan spasial dibangun dari geometri disederhanakan
  yang ditulis tangan sebagai array angka + proyeksi Web Mercator ~15
  baris. `d3-scale`/`d3-shape` sudah ada di bundle lewat recharts.

**Temuan yang memicu sebagian task**: mekanika scroll ternyata SUDAH
tersentral penuh di `src/islands/Scrollytelling.tsx` (keempat modul
mengimpornya, duplikasi scroll = nol) — jadi "framework" yang konsep minta
sebagian sudah ada. Yang benar-benar rusak: model step diskret+remounting
(`viz: Record<string, ComponentType>` = viz menerima nol prop, jadi peta
yang pan/zoom antar-scene mustahil secara struktural), prosa hidup sebagai
JSX di `.tsx` bukan di MDX, dan duplikasi nyata di modul viz (tabel a11y
disalin tangan ~16×, `AnimatedNumber` 3 versi berperilaku beda).

- [ ] ADR-005 — story framework: scene di frontmatter, prosa di MDX, satu
  stage persisten, progress berbasis event scroll. Wajib menyatakan di
  paragraf pertama bahwa ADR ini tidak menyentuh ADR-004.
- [ ] Spike verifikasi: event `scroll` + `getBoundingClientRect()` +
  `client:idle` di browser tool (T-71).
- [ ] Perbaikan audit desain berdiri sendiri (T-72) — `scroll-margin-top`,
  `:hover` TopicChip yang hilang, `duration: 0.4`→`0.2`, hover Plate yang
  nyaris tak terlihat, backdrop drawer, `:active`, kurva easing kustom.
- [ ] `view-transition-name` cover plate↔post — Tier-0, nol JS (T-73).
- [ ] Primitif viz reusable: theme, AnimatedNumber, DataTable, Legend,
  Chart (T-74).
- [ ] Skema `story` + shell Astro statis (T-75).
- [ ] `useStoryProgress` + `StoryStage` mode `per-scene` (T-76).
- [ ] Mode `persistent` + proyeksi geo (T-77).
- [ ] **Konten**: perdalam post Cikarang dengan scene spasial dari
  `LAND_BY_DISTRICT_2023`/`DISTRICT_GROWTH` (T-78).
- [ ] Migrasi 3 modul sisa (T-79).
- [ ] Focus mode per-story (T-80, bisa dipotong).
- [ ] Hapus shell lama + ukur bundle (T-81, bisa dipotong).

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
