# Tasks — knowledge-hub

- Updated: 2026-08-09 (M10 dibuka — T-71–T-81)

<!-- Rules:
     - No coding before the work exists as a task here (CLAUDE.md, Session protocol).
     - A task is small enough to finish in one session; otherwise split it.
     - Format: "- [ ] T-NN: verb-first description (milestone)".
     - Done tasks move to Done with their completion date; prune Done monthly. -->

## Now

**M10 — Story framework & lapisan spasial: aktif** (dibuka 2026-08-09
dari `Konsep Milestone 10.txt`). Rencana penuh + audit desain/animasi
pendukung:
`C:\Users\Luthfi\.claude\plans\c-users-luthfi-desktop-konsep-milestone-purring-storm.md`.
Cakupan konsep dipersempit bersama user: Knowledge Graph ditunda (gerbang
ROADMAP ≥20 post belum tercapai — masih 14), AI Layer ditolak (butuh
backend, non-goal PROJECT_BRIEF), Immersive ditafsir ulang jadi focus mode
per-story (tidak menyentuh ADR-004), library peta ditolak (geometri
tulis-tangan + proyeksi ~15 baris sebagai gantinya).

Urutan sengaja: task **terverifikasi penuh** dulu (T-72–T-75 = HTML statis
atau fungsi murni), baru yang digerakkan scroll — karena
IntersectionObserver/`rAF`/ResizeObserver tidak menyala di browser tool
sesi ini (`docs/memory/LESSONS.md`, 2026-07-21).

- [ ] ADR-005: story framework — scene di frontmatter, prosa di MDX, satu
  stage persisten menggantikan remount-per-scene, progress berbasis event
  scroll menggantikan `IntersectionObserver`. Catat juga penolakan
  eksplisit (nol library peta, nol AI layer, Immersive = focus mode bukan
  identitas kedua) supaya sesi mendatang tidak mengulang perdebatan.
  Paragraf pertama **wajib** menyatakan ADR ini tidak menyentuh ADR-004 —
  ia memperkenalkan "mode" story (`per-scene`/`persistent`) dan "focus
  mode", dan pembaca yang menyapu sekilas akan pattern-match ke dual-mode.
  Target: nol dependensi baru (M10)
- [x] T-71: spike verifikasi — **selesai, dan membatalkan dua asumsi**.
  Diukur langsung terhadap `astro preview` sungguhan, bukan mengutip
  LESSONS lama. **Mati**: event `scroll` (0 event terpicu di 2× `scrollTo`),
  `requestIdleCallback` (ada di runtime, tidak pernah menyala — jadi
  `client:idle` sama tidak terhidrasinya dengan `client:visible`),
  `IntersectionObserver`, `rAF`, dan semua probe tinggi viewport
  (`innerHeight`/`documentElement.clientHeight`/`visualViewport`/`screen`
  semuanya 0). **Hidup**: `setTimeout` (satu-satunya primitif async yang
  jalan), `window.scrollY` (maju benar 0→2500→4200),
  `getBoundingClientRect()` (nilai asli, dan offset absolut konsisten —
  `sec-finding1` = 3149 baik di scrollY 0 maupun 4200), dan
  **`client:load` terhidrasi** (`astro-island` kehilangan `ssr=""`, host
  dapat React fiber; di bawah `client:visible` halaman yang sama tetap
  `ssr=""` tanpa fiber — diuji dengan membalik satu direktif, rebuild,
  lalu **revert terkonfirmasi lewat `git status --short src/` kosong**).
  **Dua asumsi yang batal**: (1) draf ADR-005 mengklaim pindah ke event
  `scroll` membuat stage terverifikasi — salah, event-nya sama matinya;
  (2) rekomendasi `client:idle` — salah, harus `client:load`. Keduanya
  dikoreksi di ADR-005 sebelum commit. Konsekuensi desain: matematika
  progress wajib fungsi murni terekspor dengan tinggi viewport di-inject
  sebagai argumen, bukan dibaca di dalam. Nol commit kode; hasil tercatat
  di ADR-005 § spike dan `docs/memory/LESSONS.md` (M10) — 2026-08-09
- [x] T-72: perbaikan audit desain yang berdiri sendiri — **selesai
  2026-08-09**. (1) **Anchor mendarat di balik collar**: nol
  `scroll-margin-top`/`scroll-padding-top` di seluruh repo padahal collar
  `position: sticky; top: 0` — tiap klik TOC menaruh heading di y=0,
  tertutup penuh. Diperbaiki lewat `scroll-padding-top` di `html` (satu
  aturan mencakup semua anchor termasuk deep-link Pagefind dan skip-link,
  bukan per-heading), dengan `--collar-height` 148px `<640px` / 112px
  `≥640px`. 148px **diukur langsung** dan cocok dengan 147px yang T-68
  catat; 112px dihitung dari CSS (baris 1: 16+44+16+1, baris 2: 8+18+8+1).
  **Diverifikasi secara perilaku**, bukan cuma dibaca: `location.hash`
  lompat → heading mendarat di `top: 164px`, persis 16px bebas di atas
  collar; sebelum perbaikan mendarat di 0px. (2) **`TopicChip` nol
  `:hover`** — transisi 3 properti dideklarasikan sejak M6 tapi nol rule
  memicunya; ditambahkan mengikuti `.neighbour-chip` yang sudah benar.
  (3) **400ms di chrome scrollytelling** — `Scrollytelling.tsx` progress
  bar + crossfade viz `0.4`→`0.2`, dock mobile `0.3`→`0.2`, dan `spring`
  (satu-satunya di repo, settle ~500ms) → `0.2` `ease-in-out` sehingga
  panel Sources bergerak sama persis dengan drawer `LegendRail`. Ketiganya
  melewati plafon keras 300ms dan lolos audit berkali-kali karena
  `grep "[0-9]\+ms"` tidak melihat detik-di-JS. (4) **Hover `.plate`
  nyaris tak terlihat** (`#171512`→`#2C4630`, dua-duanya nyaris hitam):
  diganti menaikkan opacity hatch `0.1`→`0.16` — memakai mesin yang sudah
  ada, nol shadow/radius/properti baru, tetap di dalam kosakata Atlas.
  (5) **Backdrop `LegendRail`** pop→fade 200ms menyamai slide rail-nya;
  `display: block` meng-override UA `[hidden]` supaya bisa dianimasikan,
  `visibility` yang mencabutnya dari hit-testing. (6) **Nol `:active` di
  seluruh repo** — ditambahkan `scale(0.985)` untuk `.control` dan
  `0.995` untuk `.plate`, **dibungkus `prefers-reduced-motion:
  no-preference`** (jaring global cuma menolkan durasi, yang akan
  menyisakan transform menjentak) mengikuti pola `Dossier.astro`.
  (7) **Kurva easing** `--ease-out`/`--ease-in-out` — durasi tetap persis
  tiga nilai, nol nilai keempat. Motion JS tidak bisa baca custom property
  CSS, jadi dinyatakan ulang sebagai `EASE_OUT`/`EASE_IN_OUT`.
  **Koreksi RULES.md**: dua kategori gerak (chrome UI tunduk plafon;
  animasi penjelas di dalam viz tidak — memaksa konvergensi 3 detik jadi
  300ms menghancurkan yang dijelaskannya, tapi tetap wajib sekali jalan),
  plus titik buta cek millisecond → sekarang butuh **dua** grep.
  Diverifikasi dari CSS terkompilasi (`document.styleSheets`, ground truth
  per LESSONS 2026-07-30), bukan `getComputedStyle` pada hover simulasi:
  kedua `:active` terkonfirmasi ter-guard reduced-motion, token easing
  resolve (`cubic-bezier(0.23, 1, 0.32, 1)`), backdrop punya
  `visibility`+`display: block`, rail pakai `--ease-in-out`. `npm run
  build` hijau 48 halaman; nol console error nyata (8× 404 semuanya
  `/_vercel/insights/script.js`, hanya ada di platform Vercel, pre-existing)
  (M10) — 2026-08-09
- [x] T-73: `view-transition-name: plate-{slug}` di cover `Plate` dan cover
  post — **selesai 2026-08-09**. Tier-0 murni (ADR-003 #1): nol JS, nol
  byte bundle, memanfaatkan `@view-transition { navigation: auto }` yang
  sudah aktif sejak M5. **Temuan saat verifikasi**: post scrollytelling
  punya cover di plate tapi TIDAK di halaman detailnya
  (`[slug].astro` merender cover di balik `!isScrollytelling`), jadi
  penamaan naif akan mengangkat 4 elemen keluar dari root snapshot di
  tiap halaman indeks untuk beranimasi melawan ketiadaan. Diperbaiki
  dengan `coverTransitionName` yang hanya diberikan kalau tujuannya
  benar-benar punya cover — 10 nama turun jadi 6, nol yatim.
  **Diverifikasi dari HTML hasil build, bukan browser** (view transition
  digerakkan compositor dan pane browser sesi ini tidak meng-compose
  frame, jadi morph visualnya memang tidak bisa dilihat di sini):
  keenam pasangan cocok 1:1 antara indeks dan halaman post-nya, dan
  sapuan seluruh 47 halaman menghasilkan **nol nama duplikat** (nama
  duplikat akan membatalkan transisi diam-diam). **Perlu cek browser
  asli** untuk menilai morph-nya sendiri (M10) — 2026-08-09
- [x] T-74: primitif viz reusable di `src/components/story/viz/` —
  **selesai 2026-08-09**, dan menemukan **bug konten yang sudah tayang**.
  5 primitif dibuat: `theme.ts`, `AnimatedNumber.tsx`, `DataTable.tsx`,
  `Legend.tsx`, `Chart.tsx` (yang membuat `table` jadi **prop wajib** —
  chart tanpa padanan pembaca layar tidak lolos typecheck, menggantikan
  konvensi salin-tempel di 16 titik).
  **Bug yang ditemukan**: `AnimatedNumber` versi `bontang` dan `rpplh`
  memakai `useState(0)`, dan karena Astro meng-SSR island jadi HTML statis,
  **angka nol itu ikut terbit**. Terukur di build:
  `dist/posts/bontang-poverty-mapping/index.html` memuat `0` di posisi
  jumlah penduduk miskin ekstrem (asli 238.464), `rpplh` memuat `0.0` di
  posisi 1,2 juta ha. Siapa pun yang membaca sebelum hidrasi selesai —
  JS mati, hidrasi gagal, crawler, reader mode, dan **khususnya
  lingkungan verifikasi proyek ini yang T-71 buktikan tidak pernah
  menghidrasi `client:visible`** — membaca nol sebagai temuan riset.
  Versi `cikarang` (`useState(value)`) satu-satunya yang benar; "cacat"-nya
  (tidak pernah beranimasi) justru baris yang menjaganya jujur. Rekonsiliasi
  memilih semantik cikarang: seed dengan `value`, tween hanya saat `value`
  berubah — yang justru dibutuhkan stage persisten ADR-005 #3. Hitung-naik
  dari nol dibuang; ia hanya terlihat oleh klien terhidrasi dan datang
  sepaket dengan angka palsu untuk semua orang lain.
  **Diverifikasi**: `238,464` dan `1.2` kini ada di HTML statis (sebelumnya
  `0`/`0.0`); Pagefind 4016→4018 kata, kenaikan yang justru mengonfirmasi
  angka asli masuk indeks. Duplikasi dihapus: `AnimatedNumber` lokal 3→0,
  `tooltipStyle` lokal 4→0. Karena TypeScript tidak terpasang di proyek ini
  dan `astro build` hanya memproses modul yang terjangkau, primitif
  diverifikasi lewat halaman uji sementara yang memasukkannya ke build graph
  (`src/pages/t74-check.astro` + `_t74check.tsx`) — markup `DataTable`
  diperiksa di HTML nyata (`caption`, `scope="col"`, `scope="row"`,
  pemisah ribuan), lalu **kedua file dihapus** dan build kembali 48 halaman.
  Lesson dicatat di `docs/memory/LESSONS.md`. Nol console error nyata (M10)
  — 2026-08-09
- [x] T-75: skema `story` + shell Astro statis — **selesai 2026-08-09**, dan
  **membatalkan keputusan #1 ADR-005**. Diuji, bukan diasumsikan: prop yang
  dikirim ke `<Content />` **tidak sampai** ke scope body MDX (`Astro.props`
  melempar `ReferenceError: Astro is not defined`; variabel biasa tiba
  `undefined`). Artinya komponen di dalam MDX tidak akan pernah bisa membaca
  frontmatter, dan komponen pembungkus `<Content />` tidak akan pernah bisa
  menyisipkan apa pun ke dalamnya — **menganyam chrome frontmatter dengan
  prosa MDX per-scene mustahil di Astro**, bukan sekadar sulit. Keputusan
  bersama user: `kicker`+`title` pindah ke atribut `<Scene>` di MDX (menempel
  pada prosanya, nol duplikasi); sitasi tetap di frontmatter dan tampil di
  panel Sources saja. Blok `<details>` inline dihapus — **bukan kehilangan
  fitur**: shell lama merender tiap sitasi dua kali dari data yang sama.
  Assertion build-time id yang ADR rencanakan **ternyata mustahil** karena
  alasan yang sama; dicatat sebagai konsekuensi, bukan dilewatkan.
  **Dibangun**: `Story.astro`, `Scene.astro`, `StoryHero.astro`,
  `SourcesPanel.astro`, skema `story` zod, dan wiring di `[slug].astro`
  (`usesStoryShell` — keempat post lama tetap di island lama sampai T-79).
  **Perbaikan yang ikut terbawa**: (a) post scrollytelling selama ini **nol
  `<h1>`** — `[slug].astro` menyembunyikan h1 post dan shell lama mulai dari
  h2; shell baru memakai h1 untuk judul story dan h2 per scene. (b) Panel
  Sources kini punya handler Escape dan pengembalian fokus ke trigger; panel
  React lama tidak punya keduanya. (c) Nomor scene dari CSS counter, bukan
  indeks yang ditulis tangan — menyisipkan scene menomori ulang sendiri.
  **Diverifikasi lewat post uji sementara** (dibuat, dilatih, dihapus):
  h1 tepat 1 dengan urutan h1→h2×3; `emphasise` membelah judul benar dan
  **melempar error kalau substring-nya tidak ada** — bukan gagal diam;
  `counter-reset`/`counter-increment` aktif dan `::before` selebar 14px
  (dua digit mono, jadi counternya benar-benar merender); panel buka→fokus
  ke Close, Escape→fokus balik ke trigger; scene tanpa sitasi benar-benar
  dilewati panel tapi tetap dihitung nomornya; cross-link markdown utuh;
  nol overflow horizontal pada container 1240px. **Nol chunk JS dirujuk**
  (halaman island lama merujuk 216 KB raw hanya dari chunk langsungnya).
  **Bug kecil ditemukan sendiri**: komentar `<!-- -->` di template `Scene.astro`
  ikut terkirim ke browser 3× per halaman — dipindah ke frontmatter komponen,
  output kini nol komentar HTML. Build 48 halaman/4018 kata, identik dengan
  baseline; keempat post lama dikonfirmasi tetap memakai island (M10)
  — 2026-08-09
- [x] T-76: `useStoryProgress.ts` + `StoryStage.tsx` — **selesai 2026-08-09**.
  Dibangun: `story/types.ts` (`StageState`, `StageVisual`, dan
  **`computeStageState` sebagai fungsi murni terekspor**), `useStoryProgress.ts`,
  `story/motion.ts` (kurva easing diekstrak dari `Scrollytelling.tsx` begitu
  ada konsumen kedua — bukan disalin), dan `islands/StoryStage.tsx`.
  **Yang hilang dari shell lama, sengaja**: `IntersectionObserver` kedua
  (`useWithinViewport`) dihapus total — dock mobile kini digating
  `withinStory` yang dihitung dari offset yang sudah di-cache, jadi bekerja
  di lingkungan yang observer-nya tidak pernah menyala.
  **Perubahan desain saat verifikasi**: progress bar semula `motion.div`
  ber-`animate`; diganti binding langsung ke `storyProgress` tanpa animasi.
  Bar lama melangkah per-scene sehingga easing-lah yang membuatnya terbaca
  sebagai gerak; sekarang nilainya sudah kontinu dan sudah mengikuti scroll,
  jadi menganimasikannya hanya menambah jeda antara gerakan pembaca dan
  bar — indikator progres yang tertinggal dari yang diukurnya itu salah,
  bukan halus. Sekaligus melepas ketergantungan rAF terakhir di chrome stage,
  yang membuatnya **bisa diamati** di verifikasi (rAF mati di sini, T-71).
  **Verifikasi berlapis**: (a) **6 suite tes Node** (`npm test`, runner bawaan
  + type stripping, **nol dependensi baru**) menguji `computeStageState` di
  tiap batas scene, kuantisasi 1/200, clamp, arah dua arah, dan input
  degenerate — offset kosong, viewport 0, scene tinggi 0 semuanya finite,
  nol NaN. Ini **tes otomatis pertama proyek**, ditulis persis untuk satu
  hal yang `astro build` tidak bisa cek dan browser tidak bisa jalankan.
  (b) Pipeline penuh lewat probe sementara: `client:load` **terhidrasi**,
  `initial={{sceneIndex:1, sceneProgress:0.5}}` menghasilkan `sceneId:
  problem`, `storyProgress: 0.5` — dicocokkan manual terhadap offset DOM
  nyata (span 1512, readingLine 1366 → 0.5 tepat); `fig. 02` benar; caption
  vizCitation muncul hanya untuk scene yang punya; progress bar
  `matrix(0.5,0,0,1,0,0)`. Probe dihapus setelahnya. **Tidak terverifikasi
  di sini**: pelacakan kontinu saat scroll sungguhan — event scroll tidak
  pernah menyala di lingkungan ini, jadi butuh browser asli.
  **Catatan pengukuran**: `document.body.innerText` tidak reliable di tool
  ini (mengembalikan kosong untuk teks yang jelas ada); pakai `textContent`.
  **Utang dicatat** (DEBT #4): `StoryStage` dkk. di luar build graph sehingga
  tidak diketik sampai T-78 (M10) — 2026-08-09
- [ ] T-77: mode `persistent` + `geo/project.ts` (Web Mercator ~15 baris).
  Buktikan morph dengan 2 scene percobaan sebelum post asli ada (M10)
- [ ] T-78: **konten M10 (aturan content-first)** — perdalam post Cikarang
  dengan scene spasial dari `LAND_BY_DISTRICT_2023` + `DISTRICT_GROWTH`
  (`cikarang:52-67`, keduanya Tabel 1 paper Rahman & Hernanda 2025):
  5 poligon distrik tulis-tangan yang warna/nilainya melakukan morph
  2016→2023 pada stage yang bertahan. Prosa pindah dari JSX ke body MDX.
  `VizProblem` (dua lingkaran saling mendekat, `cikarang:155-197`) memang
  sudah pengganti kasar peta — diganti geometri asli. Stage-nya **bebas
  recharts**, `viewBox` eksplisit tanpa `ResponsiveContainer`, jadi
  terverifikasi dengan cara yang keempat post lama tidak pernah bisa.
  **Wajib diakhiri cek diff mekanis** (hitung kata, link, dash per scene)
  terhadap sumber `.tsx`, bukan dibaca ulang — LESSONS 2026-08-04 (M10)
- [ ] T-79: migrasi 3 modul sisa ke framework, `jabung` dulu (terkecil,
  422 baris, satu-satunya tanpa `AnimatedNumber`). Push, lalu **user lihat
  live di Vercel sebelum lanjut** (LESSONS 2026-07-18 "additive-first, then
  full-replace once seen live"). Wajib men-diff angka ter-render per scene:
  di bawah remounting counter bontang/rpplh mulai dari 0 tiap scene aktif,
  di bawah stage persisten tidak — perubahan perilaku yang terlihat pada
  konten tayang yang nol test maupun build error akan menangkapnya (M10)
- [ ] T-80: focus mode per-story — satu tombol dalam satu post yang
  menyembunyikan collar + rail, stage jadi dominan. Nol identitas kedua,
  nol `data-mode`, nol pohon DOM kedua. **Bisa dipotong** kalau milestone
  kepanjangan (M10)
- [ ] T-81: hapus `src/islands/Scrollytelling.tsx` (dipertahankan utuh
  sepanjang M10 sebagai permukaan kompatibilitas), ukur `dist/_astro/*.js`
  sebelum/sesudah, catat di `docs/TESTING.md` di sebelah data berat
  transfer yang sudah ada. **Bisa dipotong** (M10)

**M9 — 3 artikel naratif baru: selesai** (T-70, lihat Done — dibuka+
ditutup 2026-08-04).

**M8 — Perbaikan visual & suara editorial: selesai** (T-66–T-69, lihat
Done — dibuka+ditutup 2026-08-04, dipicu `Masukan untuk Knowledge Hub.md`
dari pemilik situs). Rencana penuh + pengukuran pendukung:
`C:\Users\Luthfi\.claude\plans\jelaskan-state-saat-ini-frolicking-lemur.md`.

**M6 — Atlas: selesai** (S1–S5, T-45–T-62, lihat Done — di-push). Spesifikasi:
`docs/design/atlas/README.md`. Keputusan:
[ADR-004](decisions/ADR-004-atlas-single-identity.md).

**M7 — lapisan editorial: selesai** (T-63–T-65, lihat Done).

## Backlog

- [ ] T-36: **ditunda user (2026-07-28), dicoba ulang & masih terblokir (2026-07-29 via T-44).** Ukur baseline Lighthouse via PageSpeed Insights untuk `/` dan satu post scrollytelling; catat di `docs/TESTING.md`. Dicoba 2026-07-28 lewat 3 jalur (PSI web UI, PSI API via WebFetch, PSI API via `curl`) — semua gagal: UI macet di polling (kemungkinan batasan tooling sesi yang sama dengan `IntersectionObserver`/`rAF`, lihat `docs/memory/LESSONS.md`), API kena 429 keyless-quota dari dua jalur jaringan berbeda. Dicoba ulang 2026-07-29 (API via `curl`) — masih 429, belum membaik sendiri. Data pengganti (berat transfer nyata, diukur ulang pasca-M5 di 4 halaman) sudah dicatat di `docs/TESTING.md` § "Measured baseline" + "Post-M5 remeasurement". **Perlu user**: jalankan PageSpeed Insights dari browser asli, atau berikan API key PSI (M5)
- [ ] T-20: custom domain — user eksplisit menunda ini ("belum butuh", 2026-07-17); putuskan nama domain (open question ARCHITECTURE.md), konfigurasi DNS + Vercel saat diminta (M3)
- [ ] T-21: arsipkan repo `Website_Portfolio` lama — task terakhir M3, setelah custom domain live & konten/foto termigrasi penuh dari T-13/T-19 (M3)

## Done

- [x] T-70: publish 3 artikel naratif baru `type: article`, membuka dan
  menutup M9 dalam satu sesi. Materi diserahkan langsung oleh pemilik
  situs dari vault pribadi Obsidian (bukan ditulis untuk situs ini).
  **Bahasa Indonesia** — deviasi eksplisit dari `docs/RULES.md` "konten
  publik English" dicatat di file yang sama (keputusan user: risiko salah
  nuansa menerjemahkan esai berkutipan tokoh publik lebih besar daripada
  manfaat konsistensi bahasa). **Nol kalimat baru ditambahkan ke prosa
  siapa pun** — hanya adaptasi struktural minimal: level heading
  dinormalisasi untuk `TableOfContents` (`### `→`## ` di satu artikel
  yang H3-nya tidak punya H2 induk), satu baris kosong ditambah sebelum
  satu heading yang di sumber aslinya menempel langsung ke paragraf
  sebelumnya, bagian "Reference:" kosong di satu artikel dihapus (nol
  isi untuk ditampilkan, konsisten dengan aturan "nol placeholder"
  situs). **Dash prosa asli (em/en dash) sengaja TIDAK disentuh** —
  berbeda dari T-69: itu pass humanizer untuk teks yang ditulis untuk
  situs ini, sedangkan ketiga artikel ini teks jadi milik user sendiri,
  jadi voice aslinya (termasuk gaya dash) dipertahankan persis. **Bug
  ditemukan & diperbaiki sebelum commit**: draf pertama dua dari tiga
  file secara tidak sengaja mengganti sebagian dash prosa jadi koma/titik
  (refleks dari kerja T-69 sebelumnya di sesi yang sama) — ditemukan
  lewat `grep` hitung dash per file dibanding count manual dari sumber
  asli, diperbaiki di 4 titik sebelum build final; artikel ketiga
  ditranskripsi lebih hati-hati sejak awal dan dash-nya cocok
  sempurna dengan sumber pada percobaan pertama (11 dash, semuanya
  legitimate — 7 prosa penghubung + 4 rentang tahun). **3 post**:
  "Data Spasial dan Pengambilan Keputusan dalam Perencanaan Wilayah"
  (slug `data-spasial-perencanaan-wilayah`, tags `gis`+`urban-planning`
  — keduanya tag existing, nol tag baru); "Ketika Denial Presiden
  Berbuah Ancaman Krisis" (slug `denial-presiden-krisis-ekonomi`, tag
  baru `economic-policy` — domain kebijakan ekonomi/fiskal, nol tag
  existing yang cocok); "Paradoks Prioritas Transportasi Indonesia"
  (slug `paradoks-transportasi-indonesia`, tags `transportation`+
  `urban-planning`, existing, plus daftar referensi akademik/berita
  ~30 entri dipertahankan utuh sebagai bagian `## Referensi`). **Topik
  baru** `economic-policy.md` ditulis langsung (definisi faktual netral
  satu kalimat tentang bidang studi, mengikuti pola 5 definisi objektif
  T-63 — bukan opini pribadi, jadi aman ditulis langsung, bukan
  menunggu user). Semua `type: article` (bukan `research`) — cocok
  dengan `.prose-article`'s treatment drop-cap + pull-quote yang sudah
  ada sejak T-23, nol komponen baru dibutuhkan. **Sengaja tidak
  diberi**: `cover` (opsional, matching `building-knowledge-hub`'s
  precedent — teks tanpa aset visual sumber), `impact` (field itu
  berarti hasil terukur dari SEBUAH KARYA, bukan sekadar angka yang
  disebut dalam esai — dipaksakan akan salah semantik), `coordinates`
  (topik nasional/lintas-negara, bukan satu lokasi nyata), cross-link
  inline manual (menyisipkan tautan baru ke dalam kalimat milik user
  akan berarti mengedit prosa mereka — dibiarkan mengalir lewat rail
  "Related plates" otomatis via shared tags, bukan diedit tangan).
  `date: 2026-08-04` untuk ketiganya (tanggal publish ke situs, bukan
  tanggal ditulis di vault pribadi — sama dengan konvensi
  `building-knowledge-hub`). Diverifikasi lewat `astro preview`
  sungguhan: `/posts/paradoks-transportasi-indonesia` — 8 H2 (TOC) + 6
  H3 nested benar, `.prose-article` aktif; `/posts/denial-presiden-
  krisis-ekonomi` — 9 section TOC, kutipan blockquote render benar;
  homepage — breadcrumb "Sheet index · 14 plates · 21 topics", ketiga
  post baru muncul sebagai 3 plate terbaru; `/topics/economic-policy` —
  definisi + 1 artikel terkait render benar. Nol overflow horizontal di
  375px pada artikel terpanjang, nol console error di semua halaman
  yang diuji. `npm run build` hijau, 44→48 halaman (3 post + 1 halaman
  topik baru), Pagefind 2271→4016 kata (wajar — 3 esai panjang baru)
  (M9) — 2026-08-04
- [x] T-69: pass skill `humanizer` di seluruh prosa situs, menutup M8.
  **Diagnosis dulu, bukan asumsi**: grep pola kosakata AI (testament,
  vibrant, tapestry, delve, crucial, boasts, showcase, dst.) di seluruh
  `src/content/posts` menghasilkan **nol match** — prosa situs sudah
  spesifik dan bervariasi (detail teknis nyata: bug CSS `.maplibregl-map
  { position: relative }`, rasio detour OSRM 1,06×–2,85×), bukan generik.
  Satu-satunya pola AI yang benar-benar terukur skala besar: **em/en dash**
  (§14 skill humanizer, "hard constraint") — 0–41 kemunculan per file,
  terkonsentrasi di 6 post project/photo (jabodetabek-connect 21,
  cdmp-jabodetabek 24, jakarta-transit-heritage-explorer 20) dan 4 modul
  scrollytelling (cikarang 41, jabung 34, rpplh 31, bontang 24). **Cakupan
  aktual**: 11 summary frontmatter, body 6 post MDX non-scrollytelling,
  prosa (title/body/dek/eyebrow, bukan komentar kode) di 4 modul
  `src/lib/scrollytelling/*.tsx`, bio+expertise+experience di
  `pages/about.astro`, dek `SheetIndex.astro`, label
  `pages/topics/[topic].astro`. **Dipertahankan sebagai konvensi
  tipografi sah, bukan diubah**: en-dash rentang tahun/halaman ("2016 –
  2023", "pp. 56–62"), en-dash nama majemuk/rute ("Soekarno–Hatta",
  "Jakarta–Cikampek"), em-dash pemisah judul situs-lebar ("{Title} —
  Afreza Hernanda", dipakai konsisten di 9+ file, konvensi tab-judul yang
  sudah ada sebelum AI), dan dash di dalam data CV terstruktur
  (`about.astro`'s field `role`/`dates`) — hanya dash PENGHUBUNG NARASI
  yang diganti titik/koma/titik-dua/kurung sesuai urutan preferensi skill.
  **5 definisi topik tulisan Claude** (maplibre/python/coastal-planning/
  d3/mdx) **sengaja tidak disentuh** — nol dash, nol kosakata AI, register
  ensiklopedis pendek memang sudah suara manusia yang benar untuk konten
  referensi (aturan eksplisit skill humanizer). **17 definisi topik
  tulisan pemilik situs** (T-63) juga tidak disentuh — itu sudah suara
  aslinya. **`building-knowledge-hub.mdx` ditulis ulang sungguhan**
  (bukan cuma dihaluskan) — isi lama cuma teks benih ("seeded to prove the
  content collection schema works"). Ditulis pakai fakta nyata dari
  `docs/PROJECT_BRIEF.md` (masalah: karya tersebar GitHub/Vercel/foto
  tanpa pintu masuk; portfolio lama `Website_Portfolio` statis GitHub
  Pages cuma menampilkan hasil akhir; solusi: satu `type` content
  collection tervalidasi Zod menggantikan folder kaku) dan riwayat
  milestone nyata (M5 dual-mode Reading/Immersive yang dibongkar di M6,
  ADR-004) — bukan dikarang. Ketiga cross-link kontekstual asli T-64
  dipertahankan (project/research/photo: jabodetabek-connect, Cikarang,
  Tanggamus). **Nol fakta/angka/tanggal berubah** di file manapun —
  dikonfirmasi lewat pembacaan ulang tiap edit sebelum diterapkan, bukan
  cuma diasumsikan aman. **Cross-link M7 (T-64) dikonfirmasi selamat**:
  dihitung ulang lewat grep `](/posts/...)` + `href="/posts/..."` di
  seluruh 11 post — 7 post di 3 tautan, 4 post (jabodetabek-connect + 3
  foto Tanggamus) di 2 tautan, persis cocok dengan tiap kasus bernama di
  catatan T-64 (angka ringkasan "8 dari 11" di catatan T-64 sendiri
  ternyata tidak match totalnya 4+7=11 — dicatat di sini sebagai
  penyimpangan aritmetika pada dokumen lama, bukan sesuatu yang
  diperkenalkan sesi ini). Diverifikasi lewat `astro preview` sungguhan:
  `building-knowledge-hub` dan `rpplh-south-papua` dibaca utuh di
  browser, prosa mengalir alami tanpa dash tersisa; stamp lembar
  `jabodetabek-connect` masih persis "Stations: 128" + "Lines: 13"
  (angka `impact` tidak tersentuh); nol overflow horizontal di 375px; nol
  console error. `npm run build` hijau, 44 halaman, Pagefind 2225→2271
  kata (naik — `building-knowledge-hub` yang tadinya ~50 kata sekarang
  ~350 kata prosa nyata, bukan regresi) (M8) — 2026-08-04
- [x] T-66: SOP cover art + regenerate 3 cover project + perbaikan akar
  cropping di `Plate.astro`. **Akar masalah** (diukur, bukan ditebak): 10
  cover pada index (`≥480px`) punya tinggi kotak **berbeda-beda per plate**
  (401/561/583/294px terhadap lebar tetap 104px, rasio 0.18–0.38) padahal
  sumber aslinya 0.80–1.72 — `.plate-cover`'s `height: 100%` membuat
  tingginya mengikuti panjang teks tetangganya, bukan rasio gambarnya
  sendiri; ~16% lebar cover art landscape yang benar-benar terlihat.
  Diperparah 3 cover project (`cdmp-jabodetabek`,
  `jabodetabek-connect`, `jakarta-transit-heritage-explorer`) masih
  memakai palet mati: dua tanah krem `#f5efe1` (Reading Mode M5), satu
  tanah nyaris-hitam `#18140f` (Immersive Mode M5) — keduanya dibongkar
  total di M6/ADR-004, itu sebabnya CDMP muncul sebagai strip gelap di
  antara plate krem pada laporan pemilik situs. **Perbaikan `Plate.astro`**
  — `aspect-ratio: 16/10` menggantikan `height: 100%`, di-scope KHUSUS ke
  dalam `@media (min-width: 480px)` (bukan unconditional) supaya perilaku
  `<480px` yang sudah benar (T-55 menumpuk cover di bawah teks, rasio
  sumber asli, nol crop) tidak ikut teregresi — dikonfirmasi lewat
  pengukuran ulang di 375px persis identik sebelum/sesudah. **Dua bug
  tersembunyi ditemukan lewat pengujian, bukan dibaca dari kode**: (1)
  urutan sumber CSS — aturan dasar `img{height:auto}` (ditulis di bagian
  bawah file) menang atas override media query `img{height:100%}`
  (ditulis di bagian atas) karena spesifisitas sama dan cascade hanya
  peduli urutan sumber, bukan lokasi `@media`; diperbaiki dengan
  memindahkan aturan dasar ke ATAS media query dalam file — sekarang
  override benar-benar menang di breakpoint yang dituju; (2) grid item
  punya `min-height: auto` bawaan (content-based) yang membuat kotak
  cover tetap mengembang melebihi `aspect-ratio` untuk gambar yang lebih
  "tinggi" dari 16:10 (mis. foto Tanggamus 0,80) — ditambah
  `min-height: 0` eksplisit untuk mematikannya. Tanpa kedua perbaikan ini,
  hasil awal HANYA benar untuk cover yang kebetulan sudah 16:10 (3 cover
  project generated), gagal diam-diam untuk 7 cover foto lainnya.
  **`--plate-cover-width` standar** dinaikkan 104px → 168px (168×65 pada
  16:10 terlalu kecil untuk terbaca). **SOP baru** `docs/design/
  COVER_ART.md`: rasio kanonik 16:10/1600×1000, palet token Atlas wajib
  (nol tanah gelap), tipografi dari `src/lib/og-fonts/` (bukan variable
  font situs — Satori/resvg tidak menangani woff2/sumbu `wdth`, kendala
  sama dengan T-61), aturan "tiap cover mengkodekan fakta `impact` nyata",
  `type: photo` dikecualikan, batas berat berkas. **`scripts/
  generate-cover.mjs`** (baru, di-commit — beda dari T-33 yang membuang
  skripnya setelah sekali pakai, karena regenerasi memang perlu terulang
  saat identitas visual berganti): Satori menyusun teks jadi vector path
  (menghindari resvg perlu resolve nama font TTF fontsource yang tidak
  konsisten, mis. `archivo-800.ttf` bernama internal "Archivo SemiBold
  ExtraBold") + `@resvg/resvg-js` merasterisasi — pipeline identik dengan
  `src/lib/og-image.ts`. 3 motif bespoke ditulis tangan (nol sistem
  auto-chart generik, konsisten dengan `src/lib/scrollytelling/*.tsx`):
  diagram transit oktilinear (jabodetabek-connect, "128 · 13"), 3 rute
  jalan kaki dari hub transit ke situs heritage bertriangle
  (jakarta-transit-heritage-explorer, "3 · 1.802 m"), timeline slider 14
  tanda proyek (cdmp-jabodetabek, "14 · 1989–2027") — ketiga angka dikutip
  dari field `impact` post masing-masing. **Sengaja tidak disentuh**: 4
  cover research (foto lapangan asli dari portfolio lama, T-13 — mengganti
  foto dokumenter dengan diagram membuang materi nyata) dan 3 foto
  Tanggamus (`type: photo`, foto ITU kontennya). **DEBT baru dicatat**
  (#3, di luar scope task ini): 3 foto Tanggamus 15–20MB per berkas
  ditemukan saat pengukuran, melanggar batas berat SOP baru — perbaikannya
  task tersendiri. Diverifikasi lewat `astro preview` sungguhan di 375/
  768/1280px: `≥480px` — **semua 10 cover kini identik 168×105
  (`aspect-ratio: 16/10`)**, termasuk 7 foto yang sebelumnya melebar
  mengikuti rasio native (dikonfirmasi lewat `getComputedStyle` dan
  `getBoundingClientRect` pada `.plate-cover` DAN elemen `img`-nya, bukan
  cuma satu); `<480px` — rasio kotak kembali bervariasi 0,80–1,72 mengikuti
  sumber persis seperti sebelum T-66 (nol regresi); screenshot homepage
  mengonfirmasi CDMP kini menampilkan diagram timeline penuh, bukan strip
  gelap. Nol overflow horizontal di ketiga viewport, nol console error.
  `npm run build` hijau, 44 halaman, Pagefind 2225 kata (tidak berubah —
  T-66 murni gambar+layout, nol teks tersentuh) (M8) — 2026-08-04
- [x] T-68: collar mobile — header 305px di layar 375px turun ke 147px.
  Akar masalah terukur, bukan ditebak: `.collar-row-1`/`.collar-row-2` di
  `Header.astro` memakai padding horizontal `48px`/`8px` **tanpa syarat**
  di semua viewport (nol media query di file ini sebelumnya) — di 375px
  itu menyisakan cuma ~279px untuk wordmark + 4 nav link + tombol search,
  memaksa wrap jadi 3 baris (`collar-row-1` 210px, `collar-row-2` 95px).
  Nav dan tombol search juga bersarang dalam satu `<div class="collar-
  controls">`, jadi keduanya cuma bisa wrap sebagai satu blok — tidak bisa
  diatur ulang independen tanpa mengubah markup. **Restrukturisasi**:
  `collar-controls` dihapus, wordmark/nav/search jadi 3 saudara langsung di
  `.collar-row-1`; `margin-left: auto` di `.collar-nav` menggantikan
  `justify-content: space-between` lama untuk tetap mengelompokkan
  nav+search di kanan pada desktop (dikonfirmasi nol regresi visual).
  **`<640px`**: `order` menyusun ulang jadi 2 baris — wordmark+search di
  baris 1 (`justify-content: space-between`), nav di baris 2 sebagai
  `flex-basis: 100%` + `flex-wrap: nowrap` + `overflow-x: auto` (tetap 4
  link penuh, **bukan** hamburger — itu keputusan IA baru yang di luar
  scope task ini). `collar-row-2` dipangkas ke `breadcrumbLeft` saja
  (`breadcrumb-right` di-`display:none`) — teks kanan
  ("Projection Web Mercator · Datum WGS84 · Compiled {year}" atau
  ekuivalennya per halaman) adalah notasi dekoratif, bukan navigasi, aman
  dihilangkan saat ruang sempit. Diverifikasi lewat `astro preview`
  sungguhan: 375px — header **147px** (target ≤160px), 4 nav link satu
  baris tanpa perlu scroll (`navScrollable: false`, `top` identik 62px
  keempatnya), konten pertama (`.sheet-title`) naik dari y=373 ke **y=215**,
  `aria-current="page"` masih benar, skip-link masih elemen pertama
  `<body>`, target sentuh nav-link & search tetap 44px, nol overflow
  horizontal (`window.scrollX` tetap 0 setelah `scrollTo(1000,0)`). 768px
  (137px) dan 1280px (111px, posisi wordmark/nav/search identik piksel)
  dikonfirmasi **nol regresi** dari baseline sebelum T-68. Dialog search
  dicoba fungsional (bukan cuma visual) — klik trigger membuka dialog +
  fokus pindah ke input, sama seperti sebelum restrukturisasi markup. Nol
  console error. `npm run build` hijau, 44 halaman, Pagefind 2225 kata
  (tidak berubah — T-68 murni layout) (M8) — 2026-08-04
- [x] T-67: lebar & proporsi scrollytelling, membuka M8. Dipicu masukan
  pemilik situs (`Masukan untuk Knowledge Hub.md`, 2026-08-04) — "porsi
  konten tidak seimbang" pada post `presentation: scrollytelling`.
  **Desktop**: akar masalahnya diukur langsung di `astro preview`, bukan
  dibaca dari kode — T-57 memindahkan **seluruh** `/posts/[slug]` ke grid
  `680px 1fr`, tapi island scrollytelling punya grid 6/6 internal sendiri;
  terukur kolom teks & viz cuma 316px masing-masing (~38 karakter/baris,
  jauh di bawah target 55–75) dan rail marginalia (416px) justru lebih
  lebar dari kolom teks island sendiri (316px). Diperbaiki dua sisi:
  `pages/posts/[slug].astro` — `.post-body` dapat modifier
  `post-body-wide` untuk `isScrollytelling`, melepaskan split
  `var(--container-prose) 1fr` supaya `.post-main` memakai penuh
  `--container-shell` (1240px); rail pindah ke bawah island (bukan di
  sebelahnya — alasan desain, bukan cuma lebar: island sudah py narasi
  2-kolom sendiri, kolom ketiga di sebelahnya salah secara desain) sebagai
  grid `auto-fit minmax(220px,1fr)` horizontal. `islands/Scrollytelling.tsx`
  — kolom `lg:col-span-6/6` → `5/7` (teks lebih sempit dari viz) +
  `max-w-[54ch]` pada prosa; komentar basi baris ~265 yang mengklaim
  caller sudah memberi `--container-shell` (padahal sejak T-57 salah)
  ditulis ulang menjelaskan kenapa sekarang benar. **Mobile** (temuan baru,
  belum pernah terdeteksi sebelumnya): dock viz `fixed bottom` 38vh (309px)
  menutupi bagian bawah layar sementara tiap section scrollytelling
  `min-height: 70vh` disentrasikan terhadap viewport **penuh**, bukan area
  baca yang tersisa — akibatnya teks section jatuh di belakang dock.
  Diperbaiki dengan menurunkan dock (dan spacer-nya) dari `h-[38vh]` ke
  `h-[28vh]`, membiarkan `min-h-[70vh]` section apa adanya — 100vh−28vh=72vh
  tersisa untuk baca, memberi margin 2vh di atas yang diminta section
  (bukan pas-pasan). Nilai `28vh` sengaja diulang literal di dua tempat
  (dock + spacer) alih-alih custom property JS, karena Tailwind v4 JIT
  butuh string kelas statis untuk pemindaian — didokumentasikan lewat
  komentar yang menghubungkan ketiganya, supaya tidak diubah sebelah pihak.
  Diverifikasi lewat `astro preview` sungguhan di 375/1280px:
  `getBoundingClientRect` di 1280px mengonfirmasi `postBodyCols` jadi satu
  kolom 1144px penuh, rail benar-benar di bawah island (`railTop` 4652 >
  `mainBottom` 4612), kolom island 449/647px (rasio 5/7 persis); di 375px
  setelah scroll ke tengah section, `textParagraph.bottom` (564px) berada
  **sebelum** `dockTop` (585px) — nol overlap, dikonfirmasi lewat DOM bukan
  screenshot. Post non-scrollytelling (`jabodetabek-connect`) dicek
  **tidak berubah**: `680px 416px` di 1280px, `335.2px` satu kolom di
  375px, persis seperti sebelum T-67 — regresi nol. Nol console error di
  kedua post & kedua viewport. `npm run build` hijau, 44 halaman, Pagefind
  2225 kata (tidak berubah — T-67 murni layout, nol teks tersentuh) (M8) —
  2026-08-04
- [x] T-65: angka `impact` untuk 6 post, menutup M7. `impact: [{label, value}]` ditambah ke frontmatter `jabodetabek-connect` (Stations 128, Lines 13), `cdmp-jabodetabek` (Projects mapped 14, Span 1989–2027), `jakarta-transit-heritage-explorer` (Nodes 3, Reference route 1,802 m), `jabung-lampung-coastal-development` (Sub-districts 12), `rpplh-south-papua` (Cultural space mapped 471,026 ha, Of Food Estate footprint 1.2M ha), `bontang-poverty-mapping` (Characteristic indicators 19) — keenam angka dikutip persis dari konten post yang sudah terbit sendiri (bukan dikarang), sudah dikonfirmasi cocok di worksheet Artifact T-63/T-64/T-65 sebelum diimplementasi di sini; 5 post lain (Cikarang, Building knowledge-hub, 3 foto Tanggamus) sengaja dibiarkan tanpa `impact` — bukan gap, field itu memang tidak cocok untuk konten itu. Diverifikasi lewat `astro preview` sungguhan: stamp lembar `/posts/jabodetabek-connect` merender persis "Stations: 128" + "Lines: 13", nol console error. `npm run build` hijau, 44 halaman, Pagefind 2172→2185 kata (label impact baru terindeks) — 2026-07-30
- [x] T-64: 3–5 cross-link inline per post, menutup M7 total. **Perubahan tipe**: `ScrollytellingSection.body` di `islands/Scrollytelling.tsx` diubah dari `string` ke `ReactNode` — satu-satunya pemakaian (`<p>{s.body}</p>`) sudah kompatibel tanpa perubahan lain, karena 4 modul scrollytelling menulis prosa di React (bukan MDX), jadi tautan di sana adalah JSX `<a href>` langsung, bukan sintaks markdown untuk diparse. **11/11 post** dapat tautan (link berwarna `--color-research` + underline, kelas `text-research underline underline-offset-2 hover:no-underline` dipakai konsisten di keempat modul scrollytelling; MDX biasa mewarisi style `.prose-content a` yang sudah ada sejak awal). Kandidat dipilih dari peringkat shared-tag yang sama persis dengan `getRelatedPosts()` (worksheet Artifact T-63 sudah menghitungnya) — 8 dari 11 post mencapai 3 tautan; **4 post sengaja di bawah 3** karena kandidat asli memang tidak ada/tipis, bukan dipaksakan: `jabodetabek-connect` (2 — cuma `cdmp-jabodetabek` dan `jakarta-transit-heritage-explorer` yang punya overlap tag nyata) dan ketiga foto Tanggamus (2 masing-masing — cuma 2 saudara foto yang ada untuk saling ditautkan). `building-knowledge-hub` (nol kandidat shared-tag di worksheet) mendapat 3 tautan kontekstual (bukan tag-driven) yang mencontohkan tipe project/research/photo lewat instance nyata. Beberapa tautan sengaja dibuat resiprokal (mis. Cikarang↔RPPLH, Cikarang↔Jabung, Bontang↔Jabung — paralel metodologis nyata seperti "19 indikator" yang muncul persis di Bontang DAN Jabung, atau kernel-density di Cikarang DAN Bontang) bukan satu arah. Diverifikasi lewat teknik `docs/memory/LESSONS.md` (`client:load` + `useState(ids[N])` sementara untuk modul scrollytelling, karena `IntersectionObserver` tidak fire di tooling sesi ini) + `astro preview` langsung untuk MDX biasa: `building-knowledge-hub` (3 tautan `.prose-content a`), `tanggamus-wave` (2 tautan), `cikarang` section "problem" (1 tautan ke Jakarta Transit Heritage Explorer, warna `rgb(44,70,48)` = `--color-research` terkonfirmasi `getComputedStyle`, underline benar), `rpplh` (tautan ke Cikarang + Bontang terkonfirmasi di section intro/conclusion) — semua nol console error. `git diff` pada kedua file yang di-hardcode sementara dikonfirmasi bersih sebelum rebuild final (pola yang sama dengan T-59). `npm run build` hijau, 44 halaman, Pagefind 2185→2225 kata (prosa cross-link baru terindeks) (M7) — 2026-07-30
- [x] T-63: 20 definisi topik 1 kalimat → `src/content/topics/*.md`, membuka M7. Sumber: 17 dari 20 ditulis user (Bahasa Indonesia, diserahkan lewat file `worksheet.txt` merespons worksheet Artifact sesi ini) — **diterjemahkan ke English** per konvensi `docs/RULES.md` "konten publik English, docs Indonesia" (topik adalah konten publik, dirender di `/topics/[topic]`), diterjemahkan sedekat mungkin ke definisi asli user, bukan ditulis ulang bebas. 5 sisanya (`maplibre`, `python`, `coastal-planning`, `d3`, `mdx`) tidak disuplai user (dua terakhir cuma diisi nama teknologinya sendiri, bukan definisi) — **ditulis sendiri** karena kelimanya fakta objektif tentang teknologi publik (bukan opini/pengalaman pribadi pemilik situs), mengikuti pola definisi user yang sudah ada (kalimat faktual singkat, bukan personal); ditandai eksplisit di sini supaya user tahu persis mana yang perlu ditinjau ulang. `title` tiap file = slug tag itu sendiri (sesuai skema `content.config.ts`), `aliases`/`related` dibiarkan default `[]` — tidak ada override manual hari ini. `.gitkeep` di direktori dihapus (sudah tidak perlu, direktori tidak lagi kosong). Diverifikasi lewat `astro preview` sungguhan: `/topics/gis` merender definisi persis seperti ditulis, notasi "Topic · 6 plates · 2 project · 4 research" tetap benar (tidak berubah dari T-56); `/topics` index 20 chip tetap benar; nol console error. `npm run build` hijau, 44 halaman, Pagefind naik 2126→2172 kata (definisi baru terindeks, sesuai ekspektasi — bukan regresi). T-64/T-65 belum dikerjakan (M7) — 2026-07-30
- [x] T-62: tutup M6 — semua 14 item verification checklist handoff lolos (`docs/design/atlas/README.md` § Verification checklist), remeasurement transfer, 6 dokumen diperbarui. **Checklist** (satu per satu, bukan diklaim sekaligus): (1) `grep -r "data-mode" src/` nol + `mode-toggle.ts`/`RegistrationSeam.astro` sudah tidak ada sejak T-47; (2) `grep -rn "Bodoni\|Karla" src/` nol referensi fungsional (3 hasil tersisa semuanya komentar historis yang menjelaskan migrasi, pola yang sama sudah diterima sejak T-49), 2 `@font-face` (Archivo + IBM Plex Mono); (3) `--color-line-strong` ada + terpakai, 4 modul scrollytelling tetap nol hex literal (`var(--color-chart-1/2)` dikonfirmasi 2× tiap file); (4) nol `border-radius`/`rounded-*` non-nol di `src/` (termasuk cek word-boundary penuh, bukan cuma grep dangkal); (5) `vercel.json` berisi 3 redirect 308 yang benar — **dikonfirmasi statis saja**, bukan lewat request sungguhan, karena redirect Vercel cuma berlaku di edge produksi dan M6 belum di-push (`/explore`/`/tags`/`/tags/gis` sengaja 404 lokal di `astro preview`, konsisten dengan catatan T-54); (6) rail 224px `position:static` permanen di ≥1024px, drawer trigger `display:none` (dikonfirmasi `getComputedStyle`, bukan cuma dibaca dari kode); (7) klik swatch legenda mengubah URL (`/explore/research`) **dan** breadcrumb ("filter: research") sekaligus; (8) chip topik dari rail `/explore/research` (halaman lain, bukan homepage) mendarat di `/topics/gis` dalam 1 klik; (9) Tab pertama = skip-link ke `#main` (dikonfirmasi lewat keypress Tab sungguhan, bukan `.focus()` terprogram — pola yang sama dengan T-52), ring fokus `2px solid var(--color-research)` dikonfirmasi benar dari `CSSRule.cssText` langsung (`getComputedStyle` sempat melaporkan `1.6px` — investigasi menemukan ini artefak `devicePixelRatio` tooling sesi ini, bukan bug situs, didokumentasikan sebagai lesson baru); (10) `aria-current="page"` ada di nav aktif; (11) kontrol ≥44px dikonfirmasi termasuk `TopicChip`'s target sentuh via `::after` (44.39×44px, box visual sendiri cuma 30px — desain T-51 yang disengaja); (12) 15 tabel data chart + `useReducedMotion()` di 4 modul — diwarisi dari verifikasi T-59 sesi ini; (13) Pagefind token Atlas — diwarisi dari verifikasi T-60 sesi ini; (14) post tanpa cover (`building-knowledge-hub`) dikonfirmasi lewat DOM `gridTemplateColumns: none`, nol kolom gambar kosong. **Remeasurement** (`docs/TESTING.md` § "Post-M6 remeasurement"): diukur dari `astro preview` lokal (bukan URL live — M6 belum di-push, mengukur situs live cuma akan mengukur build M5 lama), gzip bukan brotli (`astro preview` tidak menegosiasikan brotli) — kedua penyimpangan metodologi dari pola T-36/T-44 ditandai eksplisit, bukan disamarkan seolah-olah angka yang sama persis. 4 rute (`/`, `/topics`, `/about`, `/posts/rpplh-south-papua`) antara 4,1–9,2 KB gzip HTML. Bundle scrollytelling total (client+island+PieChart+Scrollytelling+react-dom): ~693 KB raw / ~209 KB gzip — nyaris flat dibanding baseline T-36 (~220 KB br) dan T-44 (~215 KB br), mengonfirmasi penambahan T-59 (`useReducedMotion` + tabel `sr-only`) tidak menambah bobot berarti. T-36 (Lighthouse resmi) sengaja tidak dicoba ulang — dua percobaan terakhir (T-36, T-44) sama-sama kena `HTTP 429`, tetap di Backlog. **Dokumen diperbarui**: `ROADMAP.md` (M6 → done, "Current focus" pindah ke M7); `CHANGELOG.md` (full pass pertama sejak M5 — blok Added/Changed/Removed/Fixed baru untuk seluruh Atlas, termasuk mencatat penghapusan Immersive Mode/registration seam yang tadinya ada di blok Added M5 yang sama, bukan menghapus diam-diam riwayat lama); `DEBT.md` (tidak ada entri baru — nol shortcut sadar diambil di S4/S5); `LESSONS.md` (2 entri baru: koreksi atas teknik verifikasi `window.innerWidth` T-55 yang ternyata sama-sama tidak bisa dipercaya saat elemen `position:fixed` ada di DOM — `document.documentElement.clientWidth` yang benar; dan spesifisitas `html:root` vs `:root` saat menimpa custom property widget pihak ketiga yang stylesheet-nya dimuat belakangan, digeneralisasi dari temuan T-60); `RULES.md` (konvensi durasi motion diperbarui 120ms hover/200ms layout/300ms batas atas, digrounding dari `grep -rn "[0-9]\+ms" src/` yang mengonfirmasi cuma 3 nilai itu yang benar-benar dipakai di seluruh komponen Atlas — bukan angka baru yang dikarang). **M6 resmi tutup**: 18 commit lokal di `main`, belum di-push (keputusan push tetap menunggu user, sesuai catatan sesi-sesi sebelumnya) (M6) — 2026-07-30
- [x] T-61: OG image ikut Atlas, membuka S5. **Warna** — 5 hex literal palet lama (`COLOR.paper/ink/inkMuted/line/accent`) diganti nilai Atlas persis (`#f2ebda`/`#171512`/`#4a4238`/`#c9bfa6`/`#2c4630`) — `line` dipetakan ke `--color-line` biasa (bukan `--color-line-strong`), karena garis pembatas di kartu OG adalah divider dekoratif, bukan batas kontrol interaktif; keputusan ini sempat salah di draf pertama (dipetakan ke `line-strong`) dan diperbaiki sebelum build. **Font** — 4 TTF baru diunduh dari CDN fontsource.org (`archivo-800/600/400.ttf`, `ibm-plex-mono-400.ttf`, magic byte `00 01 00 00` dikonfirmasi persis seperti T-49 mengonfirmasi `wOF2`), BUKAN dari file variable yang sudah di-self-host situs (`public/fonts/archivo-variable-latin.woff2`) — satori/resvg tidak menangani kompresi woff2 atau sumbu `wdth` fail variable font itu, kendala teknis yang sama persis yang membuat cut Bodoni Moda/Karla lama juga TTF per-weight statis, bukan variable, jadi ini bukan penyimpangan baru dari pola yang sudah ada. Eyebrow pindah ke IBM Plex Mono 400 (peran "notation" Atlas — dulu Karla 600) — sengaja tetap weight 400 karena hanya itu yang di-*load*, sama seperti situs sungguhan cuma pernah men-self-host IBM Plex Mono di satu weight (T-49). Title tetap Archivo 800 (dulu Bodoni Moda 800, angka weight sama). Baris meta bawah tetap 400/600 (dulu default/Karla 600), sekarang keduanya Archivo. `lib/og-fonts/bodoni-800.ttf` + `karla-400.ttf` + `karla-600.ttf` dihapus. Gate `grep -rn "Bodoni\|Karla" src/` sisa hanya komentar historis di `og-image.ts` (menjelaskan migrasi, pola sama dengan `global.css` sejak T-49) — nol referensi fungsional. Diverifikasi lewat `astro preview` build production sungguhan (fitur ini memang cuma hidup di build, sama seperti Pagefind T-60): `/og/default.png` dan `/og/cikarang-industrial-settlement-pattern.png` diunduh & dibuka langsung sebagai gambar — keduanya PNG 1200×630 valid, palet cream/ink/research-green benar, IBM Plex Mono eyebrow uppercase, Archivo extrabold title, divider `--color-line`, meta 400+600 Archivo semua terkonfirmasi visual. `npm run build` hijau, 44 halaman (M6) — 2026-07-30
- [x] T-60: Pagefind di-restyle ke token Atlas + dibuka jadi kontrol permanen, menutup S4. Tiga bagian: (1) **Token** — blok `--pagefind-ui-*` baru di `global.css` memetakan 10 custom property bawaan widget klasik Pagefind (`pagefind-ui.js`/`.css`) ke token Atlas (`--pagefind-ui-primary`→`--color-research`, `background`→`paper`, `border`→`line-strong`, radius→0, `font`→`--font-body` bukan mono — hasil excerpt pencarian adalah prosa, bukan notasi data). **Bug ditemukan & diperbaiki sebelum verifikasi selesai**: override pertama dipakai selector `:root` polos, tapi `pagefind-ui.css` sendiri mendeklarasikan blok `:root{...}` dengan default zinc-nya — karena `<link>` Pagefind disuntik JS Header.astro's script *setelah* stylesheet Astro sendiri sudah termuat, pada dasi spesifisitas yang sama, stylesheet yang tiba belakangan di DOM menang kartu terakhir, jadi default Pagefind selalu menimpa token Atlas apa pun urutan penulisan file sumbernya — dikonfirmasi lewat `getComputedStyle` (`--pagefind-ui-primary` terbaca `#393939` bawaan, bukan `#2c4630`). Diperbaiki dengan menaikkan spesifisitas selector jadi `html:root` (elemen + pseudo-class, tetap menunjuk root yang sama) — menang apa pun urutan muat tanpa `!important`; dikonfirmasi ulang `getComputedStyle` sesudahnya menunjukkan token Atlas benar di kelimanya. (2) **Dialog** — markup+script baru di `Header.astro` (co-located dengan tombol `.header-search` yang sudah ada sejak T-52, mengikuti pola LegendRail's trigger+panel-satu-file): dibuka oleh klik tombol ATAU pintasan `/` (dijaga terhadap target ketik — pola `isTypingTarget` yang sama persis dengan handler `PageUp`/`PageDown` Scrollytelling shell), ditutup `Esc`/klik backdrop/tombol close (`.control.control-icon`), fokus dipindah ke input saat buka dan kembali ke trigger saat tutup — persis level rigor yang sama dengan drawer LegendRail (T-51) dan SourcesPanel (shell scrollytelling), tanpa focus-trap penuh (konsisten, bukan pengurangan). `pagefind-ui.js`/`.css` **baru disuntik saat dialog pertama kali dibuka**, bukan di setiap page load — aset itu cuma ada di `dist/pagefind/` setelah `pagefind --site dist` (langkah build `package.json`), jadi tak ada yang perlu di-fetch sebelum pengunjung benar-benar membuka search; kegagalan fetch (mis. `astro dev`, yang tidak pernah menjalankan CLI Pagefind) ditangani lewat `script.onerror` yang menulis pesan fallback ke `#pagefind-search`, bukan gagal diam — batasan "hanya hidup di build produksi" ini sudah didokumentasikan di handoff sendiri (`Product Discovery - Knowledge Hub.dc.html` W8), bukan sesuatu yang perlu "diperbaiki". (3) **DEBT #1 ditutup** — kolom "Closed by" diisi `T-60 (2026-07-30)`, baris tetap (file append-only). Diverifikasi lewat `astro preview` sungguhan (fitur ini secara desain tak bisa diuji di `astro dev`): klik tombol Search membuka dialog + `PagefindUI` termount (`input` dgn placeholder "Search" terkonfirmasi ada di DOM); mengetik "Cikarang" menghasilkan "11 results for Cikarang" dengan judul post Cikarang sebagai hasil teratas; `Esc`, klik backdrop, dan tombol close ketiganya menutup dialog + mengembalikan fokus ke trigger (dikonfirmasi lewat `document.activeElement`); pintasan `/` membuka dialog DAN memfokuskan input pencarian secara langsung; radius `0px` terkonfirmasi lewat `getComputedStyle` pada panel dialog; nol console error di semua langkah. **Catatan verifikasi 375px**: `getBoundingClientRect()` pada dialog (`position: fixed`) sempat melaporkan lebar 468px vs viewport 375px saat dialog terbuka — pola tooling sesi ini yang sama persis dengan catatan T-55 (elemen `position:fixed` salah ukur di Browser-pane tool ini, lihat `docs/memory/LESSONS.md`) — dikonfirmasi bukan overflow nyata lewat 3 cara: `document.documentElement.clientWidth` tetap 375 (benar), `window.scrollX` tetap 0 setelah `scrollTo(1000,0)` (halaman tidak benar-benar bisa di-scroll horizontal), dan hitungan overflow elemen non-fixed turun ke 0 begitu dialog ditutup (artefak hanya muncul saat elemen `fixed` yang sama itu ada di DOM, bukan regresi layout permanen). `npm run build` hijau, 44 halaman, 2126 kata Pagefind (naik tipis dari label dialog/tombol close yang ikut terindeks — bukan konten baru) (M6) — 2026-07-30
- [x] T-59: satu-satunya kerja sisi React S4 — (a) `useReducedMotion()` sekarang dipanggil di setiap fungsi `Viz*` (28 total lintas 4 modul, bukan satu pemanggilan terpusat — mengikuti pola "bespoke per post, tanpa sistem auto-chart generik" yang sudah ditetapkan tiap modul sejak dibuat) di `lib/scrollytelling/cikarang-industrial-settlement-pattern.tsx`, `bontang-poverty-mapping.tsx`, `jabung-lampung-coastal-development.tsx`, `rpplh-south-papua.tsx` — menutup gap yang diakui RULES.md "Motion rules" (sebelumnya hanya shell `islands/Scrollytelling.tsx`, T-35, yang memanggilnya). Tiga kelas motion digated: `motion.div`/`motion.circle` (delay+duration di-nolkan lewat ternary `reduceMotion ? 0 : X`, pola identik dengan yang sudah dipakai shell), Recharts `Bar`/`Line`/`Pie` (prop bawaan `isAnimationActive={!reduceMotion}` — dipilih di atas menol-kan `animationDuration` manual karena itu prop resmi Recharts untuk kasus ini), dan `AnimatedNumber` kustom berbasis `requestAnimationFrame` di 3 dari 4 modul (Jabung tidak punya — angkanya statis) — reduceMotion melompat langsung ke `value` final alih-alih menjalankan rAF loop. (b) **Tabel data alternatif** ditambah untuk tiap chart Recharts SAJA (15 total: Cikarang 4, Bontang 4, Jabung 3, RPPLH 4) — cakupan sengaja dibatasi ke Recharts persis sesuai teks task ("tabel data alternatif tiap chart Recharts"), bukan diperluas ke visual kustom non-Recharts (progress bar `motion.div` lebar-animasi di Cikarang `VizFinding4`/Bontang tenure, diagram SVG kualitatif di Bontang `VizFinding2`/Jabung/RPPLH `VizProblem`) — itu tetap dekoratif, bukan representasi chart numerik yang butuh alternatif WCAG 1.1.1. Pola per chart: wrapper visual dapat `aria-hidden="true"`, `<table className="sr-only">` (util Tailwind bawaan, pemakaian pertama di codebase ini) persis setelahnya dengan `<caption>` + `<th scope="col">`/`<th scope="row">` berisi data mentah yang sama dengan yang dipakai chart (bukan angka baru yang ditulis ulang tangan). **Ditemukan & diperbaiki sebelum commit** (bukan bagian scope asli tapi konsekuensi langsung menyentuh `AnimatedNumber` Cikarang): versi lama komponen itu memulai `useState(value)` (bukan `useState(0)` seperti Bontang/RPPLH), jadi `start === value` sepanjang efek — animasinya sudah lama tidak pernah terlihat bergerak sama sekali, sebuah bug dorman yang sudah ada sebelum T-59. **Sengaja tidak diperbaiki** — di luar scope task ini (gating reduced-motion, bukan audit ulang animasi yang sudah ada), jadi perilaku lama dipertahankan apa adanya, hanya ditambah jalur reduced-motion di sekitarnya. Gate `grep -n "#[0-9a-fA-F]\{3,6\}"` di keempat modul: nol match, dikonfirmasi ulang setelah semua edit (klaim "nol hex literal" T-48 masih berlaku). Diverifikasi lewat `astro preview` sungguhan + `npm run build` hijau (44 halaman, tidak berubah). Karena `useActiveSection`'s `IntersectionObserver` tidak pernah fire di tooling Browser-pane sesi ini (isu terdokumentasi, `docs/memory/LESSONS.md` 2026-07-21) — dan karena itu `client:visible` juga tidak pernah hydrate — dipakai teknik yang sama persis yang didokumentasikan di LESSONS.md: `client:visible` → `client:load` sementara di `pages/posts/[slug].astro` + `useState(ids[0])` → `useState(ids[N])` sementara di `islands/Scrollytelling.tsx` untuk memaksa satu section aktif, rebuild, periksa DOM, lalu `git diff` dikonfirmasi nol (bersih) sebelum rebuild final. Dua representasi diuji langsung (bukan diasumsikan dari kode): Cikarang `VizFinding1` (`BarChart` grouped) — tabel `sr-only` berisi persis `Industrial 4,477.99/5,570.68` dan `Residential 6,236.05/7,328.73`, cocok 1:1 dengan `TOTAL_LAND`; Bontang `VizConclusion` (`PieChart`) — tabel berisi persis `Complete (both tracks) 1 / Partial (Sasaran 1 only) 3 / Not started 6`, cocok 1:1 dengan `ROLLOUT_STATUS`. Kedua kasus: wrapper visual chart terkonfirmasi `aria-hidden="true"` lewat DOM, nol console error. Jabung dan RPPLH tidak diuji lewat browser secara terpisah (pola strukturnya identik, sudah type-check + build hijau) — keputusan cakupan verifikasi yang sama dengan yang dipakai task-task S3 untuk pola berulang (M6) — 2026-07-30
- [x] T-58: sisa route S3 — 4 halaman dibangun ulang sekaligus, penutup S3 IA. **`/about`**: `about/ImmersiveDossier.astro` (M5 DATUM) di-`git mv` jadi `about/Dossier.astro`, ditulis ulang total sebagai satu-satunya komposisi (bukan lagi markup Reading Mode + Immersive terpisah) — header 3-kolom (potret 200px | nama+bio | kartu fakta cepat) dengan **kontak sungguhan dipromosikan ke sana** (email `.control-primary`, LinkedIn `.control-secondary`) — inilah makna "Contact.astro dilebur": komponen berdiri sendiri DAN link `/#contact` yang lama (yang sudah rusak sejak T-55 menghapus Contact dari homepage) berdua hilang, diganti blok yang selalu terlihat ini. Expertise dua-kolom dengan item pertama "featured" (border ink lebih tebal, chip keahlian ikut tampil — sisanya hanya judul+deskripsi) meniru pola "item pertama lebih berat" yang sudah dipakai Sheet Index. **Penyimpangan disengaja dari Hi-Fi**: Experience menampilkan SEMUA 9 peran, bukan "3 terlihat + 6 tersembunyi di balik klik" seperti mockup — pada situs portofolio yang justru ingin menunjukkan riwayat kerja nyata, menyembunyikan 6 dari 9 peran terasa kurang jujur, dan `<details>` per-item (M3, dipertahankan) sudah memberi disclosure bertahap yang cukup; diperlakukan sebagai artefak keterbatasan tinggi kanvas mockup, bukan mandat. **`/projects/[name]`**: notasi+swatch hatch-project → h1 → dek (dari summary post utama) → kontrol Repository (primary)/Live demo (secondary) → kronologi proyek → Topik proyek (gabungan tag unik lintas post) → Proyek lain. **3 kartu statistik Hi-Fi ("128 · stasiun" dst.) SENGAJA tidak dibuat** — angka itu berasal dari skrip generate cover art M5, tidak pernah tersimpan di skema konten; menampilkannya berarti mengarang data, bukan menyajikannya — kembali kalau field `impact` (T-53) suatu saat diisi per-proyek. **`/photography`**: **menyimpang dari deskripsi task asli** ("grid plate compact") — baik `size="compact"` MAUPUN `size="standard"` milik `Plate.astro` sama-sama tidak cocok untuk galeri foto: compact tidak pernah menampilkan cover sama sekali (kontradiksi langsung dengan tujuan halaman foto), dan standard-bercover menaruh foto sebagai kolom-samping kecil, bukan gambar utama. `PhotoTile.astro` **dipertahankan** (bukan dihapus seperti rencana awal), direstyle ke bahasa Atlas (border ink, radius nol, baris notasi mono baru "Photo · Plate NN · koordinat · tanggal") — nomor plate ikut global & stabil (09/10/11, sama dengan yang muncul di Sheet Index). **`404`**: bukan `LegendRail` penuh (butuh prop `topics` wajib yang tak relevan untuk pengunjung tersasar) — blok kustom kecil 4 link tipe (swatch hatch + label + hitungan) pakai ulang kelas global `.hatch-*`; kontrol search sudah otomatis ada di collar sejak T-52 tanpa kerja tambahan. **Dead code dihapus sekalian** begitu benar-benar yatim: `Contact.astro` (nol pemanggil sejak T-55) dan `SectionHeading.astro` (nol pemanggil begitu `/projects/[name]` berhenti memakainya — pemakai terakhirnya). Diverifikasi lewat `astro preview` sungguhan di keempat halaman: `/about` (kontak+expertise+dokumen+organisasi+9 role experience semua benar, radius 0px, nol `/#contact` tersisa di seluruh `src/`), `/projects/jabodetabek-connect` (cover render, kontrol Repository primary, topik gabungan, proyek lain), `/photography` (3 foto plate 09-11, radius 0px), `/404` (4 legenda tipe + hitungan benar, tombol kembali). Nol overflow sungguhan di 375px di keempat halaman, nol console error. `npm run build` hijau, 44 halaman (M6) — 2026-07-29
- [x] T-57: `/posts/[slug]` + rail marginalia. Spec: Hi-Fi Screens layar 03 (Cikarang, scrollytelling). Prose sekarang selalu 680px (`--container-prose`) lewat grid `680px 1fr` — bukan cuma untuk `type: article` seperti sebelumnya; `--container-shell` (1240px) yang lama dibuang sepenuhnya dari halaman ini, jadi aturan lebar khusus-article yang tadinya ada di `.prose-article` (T-23) jadi redundan dan dihapus (kolomnya sudah 680px untuk SEMUA tipe post). Rail: **Bagian** (`TableOfContents`, hanya post non-scrollytelling — scrollytelling punya section nav sendiri di dalam island React, di luar cakupan task ini) → **Stamp lembar** (koordinat opsional + tanggal + "Type · Plate NN" nomor global + slot `impact` yang digracefully-omit karena field itu masih kosong, T-53) → **Project** (repo/demo naik jadi `.control-primary`/`.control-secondary` sungguhan, project link jadi `.control-tertiary` — bukan lagi baris teks meta 14px) → **Topics** (chip datar tanpa hitungan, beda dari `TopicChip` yang punya badge angka — Hi-Fi tidak menampilkan hitungan di sini) → **Related plates** (markup kustom `.related-plate`, **bukan** `Plate.astro` — disengaja: "bergaya berbeda dari index supaya terbaca sebagai rekomendasi"). **Blok marginalia cross-link Hi-Fi TIDAK dirender sama sekali** — nol post punya cross-link inline di body MDX-nya hari ini dan tidak ada field skema untuk mendeteksinya; slot kosong tanpa data akan jadi placeholder yang dilarang aturan M6, jadi dihilangkan total, bukan digambar kosong — kembali begitu M7 memberi cross-link nyata. `getRelatedPosts()` di `lib/posts.ts` diubah signature-nya: dulu mengembalikan `CollectionEntry[]`, sekarang `{post, sharedTagCount}[]` — dibutuhkan untuk menampilkan "+N shared tags" di kartu related-plate (skor ranking tetap termasuk bonus +2 sesama-proyek, tapi `sharedTagCount` yang ditampilkan sengaja HANYA hitungan tag asli, bukan skor gabungan). Nomor plate tetap global & stabil (dihitung dari `getPublishedPosts()` penuh) — post yang sama menunjukkan nomor identik di sini dan di Sheet Index/halaman topik. `RelatedPosts.astro` dihapus (diganti markup kustom di halaman ini); `PostListItem.astro` ikut dihapus begitu jadi yatim (satu-satunya pemanggilnya). `TableOfContents.astro` ditulis ulang mengikuti bahasa rail (heading mono + list vertikal) — **sengaja tanpa** indikator "section aktif" yang menunjuk item pertama di Hi-Fi: itu butuh scroll-spy (`IntersectionObserver`) sungguhan supaya jujur, bukan dekoratif, dan tooling sesi ini punya isu terdokumentasi memverifikasi perilaku berbasis `IntersectionObserver` (`docs/memory/LESSONS.md`) — ditunda, bukan dipalsukan. Flag "Interactive" (`.flag`) dan hatch (`.hatch-*`) diekstrak/dipakai ulang dari T-50/51 lewat kelas global — swatch di header post pakai ukuran 13px sendiri (beda dari Plate 12px/LegendRail 15px, tiga ukuran berbeda memang disengaja per konteks). **Bug nyata ditemukan & diperbaiki lewat pengujian**: TOC dirender DUA kali di markup (sekali di atas prose untuk <1024px, sekali di rail untuk ≥1024px) dengan CSS `display:none/block` yang seharusnya saling eksklusif per breakpoint — tapi selector awal (`.post-main > nav`) TIDAK PERNAH cocok karena `<nav>` adalah root element komponen ANAK (`TableOfContents.astro`) yang membawa scope-hash miliknya sendiri, bukan milik halaman induk — Astro scoped style tidak otomatis menembus batas komponen (persis isu yang sama seperti `<Image>`'s `<img>` di Plate.astro, T-50). Akibatnya KEDUA salinan TOC tampil sekaligus di mobile, ditemukan lewat `getComputedStyle` bukan cuma dibaca dari kode. Diperbaiki dengan `:global(nav)` di keempat selector. Diverifikasi lewat `astro preview` sungguhan: post scrollytelling (Cikarang) — notasi+flag, stamp "Research · Plate 06", related plates dengan "+2 shared tags", nol Bagian/Project (sesuai data), nol console error; post project (Jabodetabek-Connect) — Bagian tampil, kontrol Repository (primary) + link project (tertiary) benar; post article (building-knowledge-hub) — drop cap tetap jalan, stamp tanpa koordinat (post ini memang tidak tentang tempat); post photo (Tanggamus) — gambar cover render benar. TOC dua-salinan dikonfirmasi benar-benar saling eksklusif di 375px DAN 1280px setelah perbaikan `:global()`. Radius 0px di semua elemen rail, nol overflow sungguhan di 375px (`getBoundingClientRect` + `window.scrollX`). `npm run build` hijau, 44 halaman (M6) — 2026-07-29
- [x] T-56: `/topics` (indeks 20 topik, naik ke nav — grid `TopicChip` T-51, tanpa mockup Hi-Fi khusus jadi dibangun mengikuti bahasa komponen yang sudah ada, bukan mengarang gaya baru) + `/topics/[topic]` (rail topik-saja, **tanpa** blok legenda tipe — dikonfirmasi dari Hi-Fi Screens layar 02, beda dari Sheet Index; notasi hitungan "Topic · N plates · X project · Y research" → h1 56px w800 wdth122% sesuai Hi-Fi persis meski token formal `--text-page-title` T-49 menyebut "40px, h1 tiap route" — diperlakukan sebagai pengecualian hero halaman-ini, pola yang sama dengan judul lead plate Sheet Index T-55 → definisi dari koleksi `topics` **atau dihilangkan seluruhnya** kalau entry belum ada, bukan placeholder dashed-border publik (koleksi masih kosong sampai M7, jadi ini yang sebenarnya teruji hari ini) → grid plate standard → topik bertetangga dari `neighbours()` sebagai chip kustom dengan sufiks "×" — bukan `TopicChip` yang dipakai ulang, karena visualnya sengaja beda (bg `paper-raised` bukan `paper`, per Hi-Fi) dan `TopicChip` tidak punya prop untuk sufiks itu). Nomor plate tetap **global & stabil** (dihitung dari `getPublishedPosts()` penuh, sama seperti T-55) — dikonfirmasi post yang sama bernomor identik di `/` dan `/topics/gis`. `getPostsByTag()` di `lib/posts.ts` dihapus begitu jadi yatim (pemanggil lamanya, versi `/topics/[topic]` sebelum ditulis ulang, sudah tidak ada). **Bug nyata ditemukan & diperbaiki sebelum verifikasi browser**: komentar sendiri di `global.css` (`.hatch-*/.control-*`) memuat `*/` literal yang menutup komentar CSS lebih awal, membuat parser CSS produksi gagal ("Unexpected token Delim('*')") — build tetap "sukses" tapi dengan warning CSS-optimizer yang nyaris terlewat karena tidak menghentikan build; diperbaiki jadi `` `.hatch-*` dan `.control-*` `` (kata pemisah, bukan garis miring). Refactor sekalian: grid `224px 1fr` yang dipakai `SheetIndex` (T-55) dan `/topics/[topic]` (dua pemakai — ambang yang sama dengan `.hatch-*`/`.control-*`) diekstrak jadi kelas global `.rail-layout` di `global.css`. Diverifikasi lewat `astro preview` sungguhan (tab browser baru dipakai setelah menemukan console log menumpuk lintas-navigasi di tab lama — bukan bug halaman, dikonfirmasi lewat tab baru bersih): `/topics` 20 chip benar; `/topics/gis` — rail topik-saja, notasi "6 plates · 2 project · 4 research", 6 plate bernomor 02/04/05/06/07/08 (sama dengan nomor di homepage), tetangga arcgis/google-earth-engine/maplibre/nextjs/python/typescript semua "2×" (cocok dengan hasil T-53), definisi memang tidak tampil (graceful, dikonfirmasi lewat DOM); radius 0px, drawer mobile jalan, 375px nol overflow sungguhan (`getBoundingClientRect` menyeluruh + `window.scrollX` tetap 0). `npm run build` hijau, 44 halaman (M6) — 2026-07-29
- [x] T-55: `/` jadi Sheet Index. `components/home/ImmersiveIndex.astro` (M5 DATUM, kolom-per-tipe dark theme) di-`git mv` jadi `components/index/SheetIndex.astro` lalu ditulis ulang total memakai `Plate`+`LegendRail` (T-50/51). **Disatukan dengan `/explore/[type]` sejak awal** (bukan dua markup terpisah) — persis sesuai catatan yang ditinggalkan di T-54: README IA menyebut `/explore/[type]` "sama dengan index terfilter", jadi `SheetIndex` menerima `activeType` opsional; `/` memanggilnya tanpa filter, `/explore/[type]` dengan filter — satu komponen, dua rute. Hitungan rail (`typeCounts`/`topics`) **selalu dihitung dari seluruh post**, tidak ikut menyempit saat difilter (dikonfirmasi: `/explore/research` tetap menampilkan "Research 4" di legenda, bukan hitungan yang sudah tersaring) — cocok dengan perilaku Hi-Fi. **Algoritma layout disederhanakan dari mockup Hi-Fi**: Hi-Fi menunjukkan 3-4 tingkat baris (lead, grid-3-kolom-bercover, grid-2-kolom-cover-samping, grid-4-kolom-compact) yang tampak seperti variasi ilustratif kurasi-tangan, bukan rumus; teks README sendiri untuk layar ini cuma menyebut 2 tingkat ("plate lead ... untuk karya berbobot, lalu grid plate standar"). Diimplementasi sebagai 2 tingkat: **lead = post terbaru** (dari `getPublishedPosts()` yang sudah terurut, bukan dipilih tangan) + **grid standard seragam untuk sisanya** — deterministik, memelihara diri sendiri saat post baru ditambah, tanpa kurasi manual. Nomor plate **global & stabil**: dihitung sekali dari daftar lengkap tak-tersaring, jadi satu post selalu "Plate 04" baik dilihat di `/` maupun di `/explore/research` — dikonfirmasi lewat browser: research di homepage bernomor 05-08, angka yang SAMA persis muncul di `/explore/research`. Token `--text-sheet-title` (64px) dan `--text-plate-lead` (24px) — dideklarasikan T-49, menunggu konsumen sejak itu — akhirnya terpakai. Pensiunkan `Hero.astro`, `FeaturedProjects.astro` (carousel drag T-24 ikut mati — disengaja, dicatat ADR-004), `LatestPosts.astro`; `<Contact />` dihapus dari homepage (redundan dengan kolom Contact Footer sejak T-52, bukan kehilangan — Contact.astro sendiri tetap ada, nasibnya diputuskan T-58). **Koreksi atas deskripsi task asli**: `SectionHeading.astro` TERNYATA masih dipakai `projects/[name].astro` (T-58) dan `RelatedPosts.astro` (T-57) — tidak dipensiunkan di sini seperti tertulis semula di rencana. **Dead code lain ditemukan & dihapus sekalian** (bukan dibiarkan): `explore/TypeFilter.astro` jadi yatim begitu `explore/[type].astro` berhenti memakainya (LegendRail's blok legenda tipe sudah menyediakan navigasi filter yang sama, TypeFilter jadi duplikat) — dihapus; `getFeaturedProjects()`/`getLatestPosts()` di `lib/posts.ts` jadi yatim begitu pemanggil satu-satunya (FeaturedProjects/LatestPosts) dihapus — dihapus juga. **Bug nyata ditemukan & diperbaiki lewat pengujian**: `Plate.astro`'s kolom cover lebar-piksel-tetap (`--plate-cover-width`, 300px untuk lead) tidak menyempit di layar sempit — pada Sheet Index (pemanggil pertama yang benar-benar merender lead plate BERCOVER, T-50 tidak pernah menguji kombinasi ini) tampilan jadi sangat sempit di 375px (kolom teks cuma tersisa ~75px). Diperbaiki: `<480px` cover-with-plate ditumpuk vertikal (grid 1 kolom), `≥480px` kembali ke tata letak samping-sampai sesuai spek. **Catatan verifikasi**: `document.documentElement.scrollWidth` sempat melaporkan 468px vs viewport 375px setelah perbaikan pertama — diselidiki lewat `getBoundingClientRect()` menyeluruh (nol elemen sungguhan melebihi 375px) dan `window.scrollX` (tetap 0 setelah `scrollTo(1000,0)`, membuktikan halaman tidak benar-benar bisa di-scroll horizontal) — kesimpulan: `scrollWidth` adalah artefak pengukuran tooling sesi ini terkait elemen `position:fixed`+`transform` (drawer LegendRail), bukan overflow nyata; perbaikan cover-plate tetap dipertahankan karena tata letaknya sendiri memang lebih baik (dikonfirmasi lewat `getComputedStyle` — grid berubah jadi 1 kolom, cover&teks bertumpuk rapi), terlepas dari angka `scrollWidth` yang menyesatkan. Diverifikasi menyeluruh lewat `astro preview` sungguhan: `/` merender 11 plate (lead=Article/Building-knowledge-hub sebagai post terbaru, 10 plate standard), breadcrumb "Sheet index · 11 plates · 20 topics · no filter"; `/explore/research` merender 4 plate dengan nomor stabil 05-08, breadcrumb "...filter: research", legenda Research aktif+hitungan tetap 4; drawer mobile & `/about` & post scrollytelling nol console error. `npm run build` hijau, 44 halaman (M6) — 2026-07-29
- [x] T-54: rename route + redirect — `pages/tags/index.astro` → `pages/topics/index.astro`, `pages/tags/[tag].astro` → `pages/topics/[topic].astro` (`getStaticPaths` params key berubah ke `topic`, isi tetap `tag` dari `getPostsByTag` — nama field frontmatter `tags` di skema tidak berubah, hanya URL/IA yang berganti bahasa); tiap tautan `/tags/${tag}` diperbarui ke `/topics/${tag}` di `posts/[slug].astro`, `Footer.astro`, dan file yang di-rename sendiri; nav "Topics" di `Header.astro` (T-52) akhirnya menunjuk `/topics` sungguhan (sebelumnya sengaja `/tags` sampai rute ini ada). **`vercel.json` baru** (belum ada di repo) dengan 3 redirect 308 eksplisit (`statusCode: 308`, bukan cuma `permanent: true`, untuk kejelasan): `/explore → /`, `/tags → /topics`, `/tags/:tag → /topics/:tag`. `/posts/[slug]` **tidak** berubah — menjaga sitasi eksternal ke post Cikarang. `explore/index.astro` dihapus (dilebur ke `/`, sesuai deskripsi task) — konsekuensinya `explore/PostList.astro` jadi benar-benar yatim (satu-satunya pemanggilnya hilang) sehingga ikut dihapus, bukan dibiarkan jadi kode mati; `TypeFilter.astro`'s tab "All" diarahkan ke `/` (bukan `/explore` yang kini cuma redirect stub), dan 3 `EmptyState ctaHref="/explore"` di halaman yang bertahan (`explore/[type].astro`, `photography/index.astro`, `projects/index.astro`) diarahkan ke `/`. **Sengaja tidak disentuh**: `Hero`/`FeaturedProjects`/`LatestPosts`'s tautan `/explore` — ketiganya dipensiunkan total di T-55 (task berikutnya persis), memperbaikinya sekarang cuma kerja buang untuk teks yang beberapa menit lagi dihapus bersama filenya. Konsekuensinya: `/explore` (bare index) 404 di `astro preview` lokal antara commit T-54 ini dan T-55 — **disengaja dan diverifikasi**, bukan luput; redirect Vercel cuma berlaku sesudah deploy (tidak pernah di-push sesi ini), dan gap-nya ditutup oleh task berikutnya di urutan yang sama. Diverifikasi lewat `astro preview` sungguhan: `/topics` dan `/topics/gis` render benar (6 post, cocok dengan T-53); `/tags/gis` dan `/explore` sama-sama 404 lokal sesuai ekspektasi; `/explore/research` (route sekunder) tetap hidup; nav "Topics", tag chip di post detail, dan link topik di footer semuanya menunjuk `/topics/*`; nol console error di semua halaman yang diuji. `npm run build` hijau, 44 halaman (turun dari 45 — satu route asli dihapus, `explore/index.astro`) (M6) — 2026-07-29
- [x] T-53: `lib/topics.ts` — dua fungsi murni (ambil `posts` sebagai parameter, tidak query koleksi sendiri): `topicCounts(posts)` → `Map<topic, {total, byType}>` dengan `byType` dibangun dari `POST_TYPES` (bukan 4 field ditulis tangan); `neighbours(topic, posts, limit=6)` → co-occurrence `tags[]` diurutkan turun berdasar hitungan, dasi diputus alfabetis untuk urutan yang deterministik antar-build. Tanpa daftar manual di kode manapun. Koleksi `topics` ditambah di `content.config.ts` (`title`/`definition` maks 240 karakter/`aliases`/`related`, `related` sebagai override manual atas hasil `neighbours()` — bukan sumber utama) plus field opsional `impact` (`{label, value}[]`) di skema `posts`, keduanya schema-only, nol post/topic memakainya hari ini sesuai batas M6/M7. Direktori `src/content/topics/` dibuat dengan `.gitkeep` supaya warning glob-loader berubah dari "direktori tidak ada" jadi "belum ada file cocok" — sinyal yang lebih akurat untuk kondisi transisi M6→M7, bukan yang menandakan kesalahan. Diverifikasi lewat halaman scratch sementara (`src/pages/scratch-t53.astro`, dihapus sebelum commit) via `astro preview` sungguhan memakai data post asli: `topicCounts` untuk topik "gis" menghasilkan persis `{total: 6, byType: {research: 4, project: 2}}` — cocok persis dengan notasi Hi-Fi Screens "Topic · 6 plates · 4 research · 2 project"; `neighbours('gis')` mengembalikan 6 topik (batas default), `neighbours('arcgis', posts, 3)` membuktikan parameter `limit` custom bekerja, `neighbours('does-not-exist', posts)` mengembalikan array kosong tanpa crash. `npm run build` hijau (45 halaman, satu warning glob-loader yang diharapkan, bukan error) (M6) — 2026-07-29
- [x] T-52: chrome — `Header.astro` ditulis ulang jadi collar 2 baris: baris 1 wordmark (Archivo 18px w700 wdth118% — dipakai nilai Hi-Fi, bukan 17px dari teks ringkas README, konsisten dengan pola T-50) + nav 4-item (Index/Topics/Projects/About, `aria-current="page"` dihitung dari `Astro.url.pathname` langsung, bukan prop) + kontrol search visual-only (wiring Pagefind + pintasan `/` menyusul di T-60); baris 2 breadcrumb notasi (mono, `paper-raised`) dengan `breadcrumbLeft`/`breadcrumbRight` opsional di `BaseLayout`/`Header` — default jatuh ke `title` halaman (kiri) dan string konstan "Projection Web Mercator · Datum WGS84 · Compiled {year}" (kanan) supaya tiap halaman yang BELUM dibangun ulang (T-55–58) tetap dapat baris breadcrumb yang koheren, bukan kosong, sampai halamannya sendiri mengisi teks presisi (Hi-Fi menunjukkan breadcrumb kanan **bukan** selalu konstan — halaman topik/post punya teks kanan sendiri; itu diserahkan ke task masing-masing lewat prop, bukan dipaksakan di sini). Nav "Topics" sengaja **tetap** menunjuk `/tags` (bukan `/topics`) — rename rute baru terjadi di T-54; kalau linknya diganti sekarang, klik "Topics" akan 404 sampai T-54 selesai. **Skip-link** ditambah sebagai elemen pertama literal di `<body>` (`BaseLayout.astro`) menutup kegagalan WCAG 2.4.1 nyata — dipakai `:focus` bukan `:focus-visible` (satu-satunya di seluruh codebase), sengaja: diverifikasi lewat testing bahwa `.focus()` terprogram tidak reliably memicu `:focus-visible` tanpa keydown asli mendahuluinya (risiko skip-link gagal tampil persis di kasus yang penting), dan tidak ada skenario di mana fokus mouse pada elemen pertama-tak-terlihat ini akan terlihat buruk. **Bahasa kontrol 4 tingkat** (primary/secondary/tertiary/icon, README menyebutnya "tiga tingkat" di judul tapi mendokumentasikan Icon terpisah sebagai tingkat ke-4) ditulis sebagai kelas global `.control`/`.control-primary/-secondary/-tertiary/-icon` di `global.css` (pola sama seperti `.hatch-*` T-51) — `.control` sendiri dibungkus `:where()` supaya spesifisitas nol, karena LegendRail's drawer trigger (T-51) perlu override `display` (none secara default, `inline-flex` di <1024px) tanpa terikat urutan sumber terhadap kelas global. **Refactor sekalian**: `LegendRail.astro`'s `.legend-trigger` dikomposisi ulang memakai `control control-secondary` (menghapus duplikasi font/border/padding yang tadinya scoped lokal). Belum diterapkan ke kontrol ad-hoc lain yang masih ada (`Hero`/`404`/`TypeFilter`/`tags/[tag]`) — semuanya dijadwalkan mati atau ditulis ulang di T-54/55/58, menyentuhnya sekarang adalah kerja buang, pola yang sama seperti keputusan T-50 soal `PostCard`/`PostListItem`. **`Footer.astro`** ditulis ulang jadi 4 kolom (Index tipe+hitungan → `/explore/{type}`, Top topics 6 teratas diurutkan-ulang manual berdasar hitungan turun karena `getAllTags()` mengurutkan alfabetis bukan popularitas, Projects dari `getProjectSlugs()`+`getProjectTitle()`, Contact email+LinkedIn+RSS nyata) menggantikan footer M3 (copyright+RSS saja) — sekaligus jadi satu-satunya jalur Photography tersisa dari chrome global (`Photography 3` → `/explore/photo`) karena Photography turun dari nav sesuai IA. Diverifikasi lewat `astro preview` sungguhan di `/`, `/about`, dan post scrollytelling: nav aktif + `aria-current` benar per halaman, breadcrumb fallback ke title benar, footer 4 kolom + 16 link benar (topik top-6 by count dikonfirmasi: gis 6, lalu 5 topik count-3 lainnya), radius 0px, kontrol search border `line-strong` + font mono + min-height 44px benar. Skip-link diverifikasi 2 kali — percobaan pertama dengan `.focus()` terprogram salah menunjukkan gagal (top tetap -900px meski `:focus` sudah diganti dari `:focus-visible`), percobaan kedua dengan **Tab key sungguhan** via `computer` tool mengonfirmasi bekerja benar (top: 0px) — bukti langsung bahwa fokus terprogram tidak reliably match `:focus-visible`/kadang tidak match cepat dengan `:focus` juga dalam satu tick skrip yang sama, alasan kuat kenapa keputusan `:focus` di atas tetap dipertahankan dan kenapa verifikasi lewat interaksi keyboard nyata (bukan `.focus()` sintetis) yang jadi bukti final. `npm run build` hijau (45 halaman, Pagefind 1991 kata, naik dari 1983 karena teks header/footer baru muncul di tiap halaman) (M6) — 2026-07-29
- [x] T-51: `components/LegendRail.astro` + `components/TopicChip.astro`. TopicChip: satu bentuk dua state (default border `line-strong`/bg `paper`; active border+bg `ink`, teks `paper`) per `docs/design/atlas/README.md`; target sentuh 44px dicapai lewat `::after` yang mengembangkan area klik tak terlihat (bukan padding visual, yang akan menggelembungkan tampilan chip 13px). LegendRail: dua blok opsional — legenda tipe (swatch 15px + label + hitungan, hanya render kalau `typeCounts` diisi) dan daftar topik (`TopicChip[]` + link "more" opsional) — dikonfirmasi dari Hi-Fi Screens bahwa `/topics/[topic]` rail **tidak** punya blok legenda tipe (beda dari asumsi awal task description yang menyiratkan keduanya selalu ada bersamaan). "Filter" legenda tipe adalah **link nyata** ke `/explore/{type}` (bukan re-render client-side) — cocok dengan "Interactions & State" README (`activeType` disinkronkan ke `/explore/[type]`, `null` = `/`), jadi SSG dan bisa dibagikan tanpa JS. Satu-satunya JS di komponen ini adalah drawer <1024px (tombol "Legend" + backdrop + Escape, Tier-1 vanilla ADR-003 #2 yang masih berlaku via ADR-004): fokus pindah ke item rail pertama saat dibuka, kembali ke tombol trigger saat ditutup lewat Escape. **Refactor sekalian di `Plate.astro` (T-50)**: hatch per tipe yang tadinya scoped-duplicate di `Plate.astro` dipindah jadi kelas global `.hatch-research/-project/-article/-photo` di `global.css` — LegendRail butuh pola yang SAMA persis untuk swatch legenda-nya, jadi ini saat yang tepat mencegah salinan gradient ketiga sebelum terjadi (bukan sesudah). Overlay 10% opacity di Plate ikut diubah dari `::before` jadi elemen `<span>` nyata (`plate-overlay`) supaya bisa memakai kelas global yang sama — pseudo-element tidak bisa "meminjam" style dari kelas yang dipakai elemen nyata tanpa duplikasi. Belum diwire ke halaman manapun (pemanggilnya — Sheet Index `/`, `/topics`, `/topics/[topic]` — baru ada di T-55/T-56); diverifikasi lewat halaman scratch sementara (`src/pages/scratch-t51.astro`, dihapus sebelum commit ini) via `astro preview` sungguhan: rail 224px + border ink + bg paper-raised benar, swatch hatch research/project/article/photo benar, chip aktif (bg ink, teks paper) benar, radius 0px di rail dan chip, drawer di 375px terverifikasi lewat `element.click()` terprogram (klik simulasi `computer` tool tidak reliably mendaftar sebagai event klik asli di viewport sempit sesi ini — pola gotcha tooling yang sama seperti dicatat di `docs/memory/LESSONS.md` M5, bukan bug komponen: `.click()` terprogram mengonfirmasi toggle/Escape/backdrop-close semuanya benar), dan di 1280px trigger `display:none` + rail `position:static` terkonfirmasi lewat `getComputedStyle` (catatan: preset `resize_window` "desktop" bawaan tool ternyata cuma memberi viewport 600px di pane sesi ini — dipakai lebar eksplisit 1280×800 sebagai gantinya, bukan preset). Nol console error di semua kondisi (M6) — 2026-07-29
- [x] T-50: `components/Plate.astro` — satu wadah, tiga ukuran (lead/standard/compact), anatomi selalu sama: notasi (swatch hatch + "Type · Plate NN" atau "Type · NN" + flag INTERACTIVE opsional) → judul → ringkasan opsional (dihilangkan di compact, bukan dikosongkan — mengikuti anatomi Hi-Fi yang konsisten 3-baris tanpa summary di compact, bukan ringkasan README yang di satu tempat melipat koordinat ke baris notasi) → stamp koordinat+tanggal. Post tanpa cover memakai anatomi identik minus kolom gambar (grid `1fr {coverWidth}px` cuma diterapkan lewat class `plate-with-cover`, bukan cek kehadiran atribut `style` yang rapuh — diperbaiki sebelum commit). Compact **tidak pernah** menampilkan cover sama sekali, termasuk untuk post `type: photo` yang selalu punya cover — dikonfirmasi dari Hi-Fi Screens (baris compact 4-kolom merender foto sebagai teks murni, sama seperti research/article/project di baris yang sama), bukan diasumsikan. Hatch per tipe (`repeating-linear-gradient`/`radial-gradient`, nol file gambar) dipakai dobel: swatch 12px di notasi + overlay 10% opacity di seluruh plate lewat `::before`, pola yang sudah terbukti di `ImmersiveIndex.astro` lama (M5), bukan didesain ulang dari nol. Nilai persis (padding, grid gap, ukuran judul 24/17/15px, wdth 115/110/108%) diambil dari `docs/design/atlas/Hi-Fi - Atlas Screens.dc.html` (rujukan presisi-piksel), bukan dari tabel ringkas README yang di beberapa titik tidak konsisten dengan Hi-Fi (mis. README menyebut judul Lead "24-32px", Hi-Fi menunjukkan 32px khusus utuk satu hero homepage — token `--text-plate-lead` T-49 dipakai apa adanya di 24px, penyesuaian "hero of homepage" jika dibutuhkan jadi keputusan T-55, bukan properti Plate). Field `impact` (T-53, belum ada) sengaja **tidak** diberi placeholder di stamp — hanya render field yang benar-benar ada hari ini (`coordinates`, `date`); ekstensi jelas dan additive begitu T-53 mendarat. `repo`/`demo` juga sengaja **tidak** dirender di dalam plate (akan jadi nested `<a>` di dalam `<a>` pembungkus plate, HTML tidak valid) — README sendiri menaruh kontrol repo/demo di rail marginalia (T-57), bukan di kartu indeks, jadi ini konsisten dengan IA yang direncanakan, bukan fitur yang dilewatkan. Ditambah `TYPE_LABEL` terpusat di `lib/posts.ts` (dipakai Plate + `explore/[type].astro`), menggantikan 3 salinan map label yang sebelumnya terpisah (`TypeFilter.astro`, `PostListItem`/`PostCard`, `ImmersiveIndex.astro` lama). **`PostCard.astro`/`PostListItem.astro`/`RelatedPosts.astro` sengaja belum dihapus** — deskripsi task asli "pensiunkan" ternyata prematur: pemanggil mereka hari ini (Hero+FeaturedProjects+LatestPosts, `explore/PostList` di `/explore`, `RelatedPosts` di post detail, `PostCard` di `/projects/[name]`, `PostListItem` di `/tags/[tag]`) masing-masing dijadwalkan dibangun ulang di T-55/T-56/T-57/T-58 — menghapus sekarang akan merusak build sebelum penggantinya ada; menghapusnya sekarang juga berarti kerja ganda karena tiap pemanggil toh ditulis ulang nanti. Pola yang sama seperti `--color-flag` (T-48)/`--text-*` (T-49): primitif dideklarasikan duluan, konsumen menyusul. **Satu gap ditemukan & ditutup di luar deskripsi task asli**: `explore/[type].astro` ternyata tidak diklaim task manapun di S3 untuk dibangun ulang (T-55 eksplisit menyebut route-nya "tetap ada" tapi tidak menyebut markup internalnya), padahal ia hari ini memakai sistem kartu lama — dimigrasikan ke Plate sekalian di commit ini (grid `sm:grid-cols-2`, size="standard", `TypeFilter` tidak disentuh) supaya tidak ada route hidup yang tertinggal memakai kartu yang justru sedang dipensiunkan, sekaligus memberi Plate pemanggil nyata pertama untuk diverifikasi di browser. Diverifikasi lewat `astro preview` sungguhan di `/explore/research` (hatch cross-hatch research + flag INTERACTIVE + cover asli + stamp koordinat/tanggal), `/explore/photo` (swatch solid `--color-line`, cover asli, stamp benar), `/explore/article` (swatch dot-grid, **nol kolom cover** untuk `building-knowledge-hub` yang memang tidak punya `cover` — dikonfirmasi lewat DOM, bukan diasumsikan), radius `0px` terkonfirmasi lewat `getComputedStyle`, 375px nol overflow horizontal, nol console error di semua rute yang diuji. `npm run build` hijau (45 halaman; Pagefind naik 1943→1983 kata, wajar karena `/explore/[type]` sekarang merender stamp koordinat/tanggal yang sebelumnya tidak ada di `PostListItem`) (M6) — 2026-07-29
- [x] T-49: tipografi Atlas — hapus 3 `<link>` Google Fonts (Bodoni Moda + Karla, plus 2 `<link rel="preconnect">`) dari `BaseLayout.astro`; self-host IBM Plex Mono (`public/fonts/ibm-plex-mono-400-latin.woff2`, ~14KB, satu static cut w400 — bukan variable font seperti Archivo, karena peran notasi Atlas tidak pernah butuh weight/italic kedua) diambil lewat `fonts.googleapis.com` css2 API subset `latin` yang sama polanya dengan Archivo di T-41, diverifikasi magic byte `wOF2` sebelum dipakai. `--font-display`/`--font-body` diremap ke Archivo (satu keluarga dua peran lewat sumbu `wdth`, bukan dua cut terpisah seperti Bodoni+Karla); `--font-mono` diremap ke IBM Plex Mono dengan fallback sistem tetap di rantai. Skala 7 tingkat handoff (Sheet title 64 → Notation 12) dideklarasikan sebagai token `--text-*`/`--text-*--line-height` berpasangan (konvensi Tailwind v4) — **ditulis, belum dipakai** di komponen mana pun: Sheet title (SheetIndex, T-55) dan Plate lead/title (Plate.astro, T-50) belum ada, dan merapikan ukuran teks di komponen yang beberapa hari lagi dipensiunkan (Hero/FeaturedProjects/LatestPosts di T-55, PostCard/PostListItem di T-50, About lama di T-58) akan jadi kerja buang — pola yang sama dengan `--color-flag` di T-48 (token duluan, konsumen menyusul). Weight & sumbu `wdth` per tier sengaja **tidak** ikut token berpasangan (Tailwind tak punya token font-stretch berpasangan) — komponen menambahkannya eksplisit saat dibangun. Reset `h1,h2,h3{font-weight:400}` **dipertahankan** tapi komentarnya ditulis ulang: alasan aslinya (Bodoni Moda cuma dimuat di 3 weight, cegah fake-bold) sudah tidak berlaku (Archivo native 100–900), tapi beberapa komponen (`Contact.astro`, `SectionHeading.astro`, `PostCard.astro`) sengaja bergantung pada default 400 ini untuk tampilan editorial ringan — reset dipertahankan sebagai keputusan desain, bukan lagi workaround loading font. Diperbaiki juga: `posts/[slug].astro` inline `<code>` yang bypass token (`font-family: ui-monospace, "IBM Plex Mono", monospace` literal) → `var(--font-mono)`. Gate `grep -rn "Bodoni\|Karla" src/` sisa hanya di `src/lib/og-image.ts` (deferred T-61) + dua komentar historis di `global.css` yang menjelaskan migrasi — sesuai rencana. Diverifikasi lewat `astro preview` sungguhan: `read_network_requests` mengonfirmasi nol request ke `fonts.googleapis.com`/`gstatic.com` di 4 halaman (`/`, post scrollytelling, `/about`, `/posts/building-knowledge-hub`), `archivo-variable-latin.woff2` dan `ibm-plex-mono-400-latin.woff2` sama-sama 200 OK, `getComputedStyle` mengonfirmasi `--font-mono` diterapkan di 22 elemen notasi pada satu halaman scrollytelling dan pada `<code>` inline post biasa, nol console error di keempat halaman. `npm run build` hijau (45 halaman, Pagefind 1943 kata, tidak berubah) (M6) — 2026-07-29
- [x] T-48: token Atlas di `@theme` — 9 warna sesuai `docs/design/atlas/README.md` (paper `#F2EBDA` → flag `#A8481F`), `--color-line-strong` (`#8E836A`) baru untuk batas kontrol interaktif (3,2:1, menggantikan `--color-line` 1,5:1 yang sekarang murni dekoratif); `--color-accent` (satu hijau untuk enam tugas) dihapus, tiap callsite Tailwind (`text-accent`/`bg-accent`/`border-accent`/`outline-accent`/`hover:*-accent`/`var(--color-accent)`) diganti mekanis ke `-research` lewat `sed` di 24 file — dicek nol hasil `grep` selain satu komentar historis yang sengaja menyebut nama lama untuk menjelaskan migrasi. **`--color-chart-1`/`--color-chart-2` dipertahankan sebagai alias** (`var(--color-research)`/`var(--color-project)`) — ini yang menjaga klaim "nol edit React" tetap benar di bawah Atlas; diverifikasi ulang keempat modul `lib/scrollytelling/*.tsx` masih nol hex literal setelah sed. 4 lebar (`--container-shell` 1240px, `--container-rail` 224px, `--container-prose` 680px) menggantikan `--container-content`/`--container-prose` lama (800px/672px); FIELD sengaja tanpa token — ia cuma ketiadaan max-width. Skala spasi 4–72 dan modul graticule 44px **tidak butuh token baru** — semuanya sudah kelipatan 4px yang otomatis tersedia lewat formula spacing dinamis Tailwind v4 (`p-11`=44px, `p-18`=72px, dst), ditemukan saat mengecek versi Tailwind terpasang (`^4.3.2`) sebelum menambah token yang ternyata tidak perlu. **Radius nol**: 16 kemunculan `rounded-sm`/`rounded-full`/`border-radius` di 9 file dihapus satu per satu (dua titik dot linimasa `/about` sengaja jadi kotak, bukan lingkaran — konsekuensi langsung aturan radius-nol, bukan regresi). Diverifikasi lewat `astro preview` sungguhan: `getComputedStyle` mengonfirmasi 9 token warna + `--container-shell` bernilai benar dan `--color-accent`/`--container-content` sudah tidak ada; tombol "Get in touch" `border-radius: 0px`; nol console error di `/`, `/about`, dan post scrollytelling. Ditambah config `knowledge-hub-preview` (T-47) dipakai ulang. `npm run build` hijau (45 halaman, Pagefind 1943 kata, tidak berubah dari T-47) (M6) — 2026-07-29
- [x] T-47: bongkar mekanisme dual-mode — hapus `RegistrationSeam.astro` + `lib/mode-toggle.ts`; lepas tombol toggle + script dari `Header.astro` (nav sekarang murni 4 link, tanpa kontrol mode); lepas script pra-paint dari `BaseLayout.astro`; hapus blok `:root[data-mode='immersive']` (palet+tipografi) dan aturan `[data-mode-view]` dari `global.css`, sisakan komentar historis yang menjelaskan apa yang hilang dan kenapa (tanpa mengulang literal token yang dihapus, supaya gate grep benar-benar nol); lepas wrapper `[data-mode-view]` beserta `data-pagefind-ignore` di `index.astro`/`explore/index.astro`/`about.astro` — pilihan sadar untuk **sementara** menyisakan markup Reading Mode saja di tiga halaman itu (Hero/FeaturedProjects/LatestPosts di beranda; TypeFilter/PostList di Explore; expertise/experience/dokumen di About), bukan markup Immersive, karena penggantinya (Plate/SheetIndex/Dossier) belum ada — dijadwalkan S2/S3 (T-50, T-55, T-58). `ImmersiveIndex.astro`/`ImmersiveDossier.astro` dibiarkan ada sebagai file tak terpakai untuk dipromosikan nanti, komentar header-nya ditulis ulang supaya tidak menyebut mekanisme yang sudah tidak ada. Gate `grep -rn "data-mode\|mode-toggle\|RegistrationSeam\|kh-mode" src/` terverifikasi nol (butuh dua ronde — komentar penjelas yang saya tulis sendiri sempat memuat literal `data-mode`/`kh-mode`, diperbaiki jadi deskriptif tanpa token tersebut). `npm run build` hijau (45 halaman, Pagefind 1943 kata, tidak byte-for-byte sama dengan 1944 pra-M6 karena `data-pagefind-ignore` yang dulu mengecualikan pohon Immersive kini tidak relevan — bukan regresi). Diverifikasi lewat `astro preview` sungguhan (bukan dev server): `/`, `/explore`, `/about`, dan satu post scrollytelling (`cikarang-industrial-settlement-pattern`) semuanya render satu pohon konten bersih, nol tombol toggle di header (dikonfirmasi lewat `read_page` — nav cuma 4 link), nol console error di keempatnya termasuk island React. Ditambah config `knowledge-hub-preview` di `.claude/launch.json` supaya `astro preview` bisa dijalankan lewat Browser pane tooling, bukan cuma `npm run dev` (M6) — 2026-07-29
- [x] T-45: pindahkan bundel handoff Claude Design ke `docs/design/atlas/` — 8 file diekstrak dari zip di root repo, `support.js` sengaja ditaruh satu folder dengan 5 `.dc.html` supaya file design reference bisa dibuka langsung di browser tanpa server; zip dihapus dari root; pointer ditambah di `CLAUDE.md` "Documentation map". `README.md` di dalam bundel adalah spesifikasi high-fidelity lengkap (token, komponen, IA, 14 item verification checklist); `.dc.html` adalah design reference, **bukan kode produksi untuk disalin** (M6) — 2026-07-29
- [x] T-46: ADR-004 — satu identitas Atlas menggantikan dual-mode. ADR-003 ditandai Superseded lewat catatan di header, bagian Decision-nya tidak diedit (ADR-process OS); yang mati hanya keputusan #3–#5 (dual-mode sebagai preferensi client via `data-mode`), sedangkan **#1 (Tier-0 platform feature) dan #2 (klausa 4 ADR-002 = larangan hidrasi framework, satu script vanilla Tier-1 ≤2KB boleh di layout global) tetap berlaku** dan dibawa apa adanya — Atlas masih memakainya untuk drawer rail, filter legenda, dan search. Tiga konsekuensi negatif dicatat eksplisit supaya tidak hilang dalam diff besar: registration seam T-42 mati, carousel drag T-24 mati (konsekuensi tidak langsung dari mempensiunkan `FeaturedProjects`), URL indeks pindah. Satu alternatif baru dicatat untuk masa depan: `data-mode` sebagai dark mode biasa — ditolak sekarang karena menurunkan 9 token berperan ketat ke varian gelap adalah keputusan desain tersendiri, tapi jadi lebih murah setelah Atlas karena tinggal satu pohon DOM (M6) — 2026-07-29
- [x] T-01: init proyek Astro + Tailwind + MDX, struktur folder content collection `posts` (M1) — 2026-07-16
- [x] T-02: definisikan schema frontmatter zod + 1 post contoh yang lolos validasi; buktikan build gagal pada frontmatter invalid (M1) — 2026-07-16
- [x] T-03: buat layout dasar + halaman Home (Hero, Featured, Latest, Contact) dan Explore sederhana (M1) — 2026-07-16
- [x] T-04: halaman detail post `[slug]` + halaman About placeholder + 404 (M1) — 2026-07-16
- [x] T-05: tulis case study #1 — Jabodetabek-Connect (English) (M1) — 2026-07-16
- [x] T-06: tulis case study #2 — Jakarta Transit Heritage Explorer (English) (M1) — 2026-07-16
- [x] T-07: tulis case study #3 — CDMP-Jabodetabek (English) (M1) — 2026-07-16
- [x] T-08: hubungkan repo GitHub + deploy Vercel, verifikasi URL publik (M1) — 2026-07-16
- [x] T-09: filter tag di Explore + halaman `/tags/[tag]` (M2) — 2026-07-17
- [x] T-10: related posts by shared tags/project (M2) — 2026-07-17
- [x] T-11: project hub pages `/projects/[name]` (M2) — 2026-07-17
- [x] T-12: Pagefind search (M2) — 2026-07-17
- [x] T-13: migrasi konten + foto dari Website_Portfolio lama (M2) — 2026-07-17
- [x] T-14: tentukan & terapkan identitas visual final (tipografi, palet, komposisi) menggantikan token provisional M1 (M3) — 2026-07-17
- [x] T-15: About/CV jadi lebih interaktif — timeline pengalaman dengan entri yang bisa di-expand, konten baru digali dari portfolio lama (M3) — 2026-07-17
- [x] T-16: OG image per post (Satori + resvg, statis) + og:/twitter: meta tags site-wide (M3) — 2026-07-17
- [x] T-17: sitemap + RSS feed + robots.txt (M3) — 2026-07-17
- [x] T-18: pasang Vercel Web Analytics (`@vercel/analytics/astro`) — perlu diaktifkan manual sekali di dashboard Vercel (M3) — 2026-07-17
- [x] T-19: section photography — `type: "photo"` + `/photography` grid + 3 foto nyata (Tanggamus, Lampung, Okt 2022) (M3) — 2026-07-17
- [x] T-22: lebur `type: journal` ke `article` — hapus enum & POST_TYPES, migrasi 1 post (`building-knowledge-hub.mdx`) (M4) — 2026-07-17
- [x] T-23: polish baca Article ala Medium — drop cap, pull-quote, lebar ukur (measure) lebih sempit, khusus `type: article` (M4) — 2026-07-17
- [x] T-24: carousel drag kiri/kanan di Featured Projects (Home) — vanilla script + scroll-snap per ADR-002 (M4) — 2026-07-18
- [x] T-25: Research scrollytelling (pilot) — React island (ADR-002 tier 2), re-skin cream-paper, opt-in via `presentation: "scrollytelling"` frontmatter (scoped to `type: research`). Pilot: `cikarang-industrial-settlement-pattern`, dengan citation ke versi published-nya (Rahman & Hernanda 2025, Jurnal Tunas Geografi) (M4) — 2026-07-18
- [x] T-27: scrollytelling full-replace — narasi MDX lama dihapus total (bukan append lagi); skip `<h1>`/dek/cover/TOC/body untuk post scrollytelling, meta row tanpa "min read"; generalisasi gating (`isScrollytelling` + branch per-post eksplisit) supaya post scrollytelling berikutnya jadi diff mekanis (M4) — 2026-07-18
- [x] T-28: scrollytelling `bontang-poverty-mapping` — reframe sebagai studi kasus Bontang di dalam Kajian Pemetaan Karakteristik Masyarakat Miskin Prov. Kaltim (Bappeda Kaltim, 2023); Bontang satu-satunya kab/kota 100% tuntas saat laporan dibuat (7 section: konteks provinsi, metode 2-jalur, kenapa Bontang, peta hotspot, close-up Kelurahan Tanjung Laut Indah, status rollout 9 kab/kota lain) (M4) — 2026-07-18
- [x] T-29: scrollytelling `jabung-lampung-coastal-development` — koreksi metodologi (Analisis Skalogram 12 kecamatan + SWOT, bukan gravity model — kata "gravity" tidak muncul sama sekali di laporan 93 halaman) → zonasi Agropolitan (Bandar Sribhawono) & Minapolitan (Labuhan Maringgai, Pasir Sakti), 3 skenario capaian (M4) — 2026-07-18
- [x] T-44: tutup M5. **Lighthouse**: dicoba ulang (API PSI via `curl`), masih 429 — tetap terblokir sama seperti T-36, bukan sesuatu yang membaik sendiri; T-36 tetap terbuka di Backlog, ini bukan mencoba menggantikannya. Pengganti sementara diukur ulang pasca-M5 di 4 halaman yang tersentuh (`/`, `/explore`, `/about`, satu post scrollytelling): bundle scrollytelling praktis tidak berubah (~215KB br vs ~220KB baseline T-36 — mekanisme dual-mode lengkap menambah <1KB), dan font Archivo terkonfirmasi nol request di HTML default Reading Mode pada deployment produksi sungguhan (bukan cuma preview lokal). **Aturan motion**: dikonsolidasi ke `docs/RULES.md` (bukan file `MOTION.md` baru) — bukan sistem token baru, tapi penulisan ulang pola yang benar-benar dipakai sepanjang M5 (satu sumber reduced-motion CSS vs JS; pseudo-element non-standar butuh entry sendiri; nol animasi berulang tanpa jeda; kontrol interaktif harus fokusabel saat istirahat; nilai first-paint ditulis di CSS bukan script — pola yang berulang kali terbukti perlu setelah dua gotcha verifikasi nyata di T-39/T-42). **Dokumentasi**: ROADMAP (M5 ditandai selesai dengan catatan pengecualian T-36, detail S1–S5 disamakan dengan yang benar-benar dibangun bukan rencana awal), STATE (snapshot ditulis ulang penuh, digroundkan ke git log 7 commit M5), CHANGELOG (belum pernah diperbarui sejak M4 — ditambah entri Added/Changed/Fixed lengkap untuk seluruh M5, T-31 s/d T-43) (M5) — 2026-07-29
- [x] T-43: perluas Immersive ke `/explore` + `/about`. `/explore` memakai ulang `ImmersiveIndex.astro` apa adanya (11 plate, kolom 3/1/4/3) — "Explore" secara semantik memang "semua post, bisa dijelajah", persis yang sudah dirender komponen itu; tidak ada UI Pagefind terpisah di sana, header kolom sudah jadi filter (konsisten dengan filosofi "legenda adalah filter" DATUM, dan menghindari mencampur widget Pagefind tak berskin — DEBT.md #1 — ke dalam chrome DATUM yang presisi). `/explore/[type]` **sengaja tidak** dapat komposisi bespoke — cuma warisi remap token (sama seperti semua halaman lain) karena post yang sudah difilter-per-tipe akan membuat 3 dari 4 kolom `ImmersiveIndex` kosong, terlihat rusak bukan cuma sepi. `/about` dapat komposisi baru, `ImmersiveDossier.astro`, memakai bahasa visual sama (collar, hairline, label mono) tanpa hatch (tidak ada taksonomi `type` untuk expertise/experience) — data expertise/documents/experience/organizations dioper sebagai props dari `about.astro`, bukan didupleksi. Kekhawatiran mobile di deskripsi task asli ("collar 88px vertikal + 112px horizontal") ternyata sudah tidak berlaku — collar yang benar-benar dibangun di T-40 sudah versi sederhana (bar atas/bawah dalam alur dokumen normal, bukan frame 4-sisi fixed dari brainstorming awal), jadi tidak perlu desain kedua, cukup dicek ulang. Diverifikasi lewat reload sungguhan: `/explore` 11 plate benar, `/about` 4 plate expertise + 11 baris ledger (9 experience + 2 organisasi) + 4 sitasi dokumen, semua Reading Mode dicek ulang tidak regresi, 375px nol overflow di kedua halaman, indeks Pagefind tidak berubah (M5) — 2026-07-29
- [x] T-42: registration seam — grip `role="slider"` di homepage (`RegistrationSeam.astro` baru), menyeret dua tree `[data-mode-view]` yang sudah ada dari T-40 (tanpa clone DOM), ditumpuk lewat CSS Grid (`grid-area: 1/1`) hanya saat drag aktif, diungkap lewat `clip-path: inset(0 calc(100% - var(--seam)) 0 0)` persis formula di task. `pointerdown`/`pointermove` + `setPointerCapture`, snap ke mayoritas saat `pointerup` (nol `rAF` — pointer event sudah frame-coalesced; `--seam` didaftar via `@property` supaya transisi settle-nya CSS murni). Keyboard: arrow ±10%, Home/End commit langsung. Logika mode dipindah ke `src/lib/mode-toggle.ts` supaya tombol Header dan seam berbagi satu sumber kebenaran (`kh-mode-change` custom event menyinkronkan keduanya tanpa reload). Plus `@view-transition { navigation: auto }` CSS murni di `global.css` — bukan `<ClientRouter />`; diverifikasi lewat navigasi sungguhan antar halaman bahwa init carousel (`FeaturedProjects.astro`) dan injeksi Pagefind (`explore/index.astro`) tidak rusak (keduanya tetap jalan tiap navigasi karena ini tetap full page load, cuma pixel lama/baru di-crossfade browser). **Dua bug nyata ditemukan & diperbaiki lewat pengujian, bukan cuma diklaim beres**: (1) grip semula `display:none` sampai drag dimulai — pengguna keyboard tidak pernah bisa fokus untuk memulainya (masalah ayam-telur); diperbaiki jadi selalu fokusabel, cuma garis panduan penuh-tinggi yang disembunyikan saat istirahat. (2) di 375px grip terpotong separuh di luar viewport pada posisi 0%/100%; diperbaiki dengan `clamp()`. Sempat dapat sinyal salah lagi dari tooling sesi ini (varian baru dari gotcha T-39, kali ini di `left: clamp(..., var(--seam), ...)` yang dimutasi JS setelah first paint, bukan `background-color` — dicatat di `LESSONS.md`); solusinya sekaligus jadi kode yang lebih baik: posisi awal grip diset CSS murni (`:root[data-mode='immersive'] .seam-stage { --seam: 100% }`), bukan cuma via script. Diverifikasi menyeluruh: drag penuh dua arah, keyboard Home/End, sinkron lintas kontrol, posisi grip benar di mobile & desktop, build production hijau, indeks Pagefind tidak berubah (M5) — 2026-07-28
- [x] T-41: tipografi Immersive — satu keluarga variable font self-hosted, "Archivo" (SIL OFL, dari Google Fonts, diunduh via query rentang 2-axis `wdth,wght@62..125,100..900` — bukan ambil instance statis satuan), `public/fonts/archivo-variable-latin.woff2`, ~88KB. Disederhanakan dari usulan awal 3-keluarga (Archivo Expanded/Spectral/Spline Sans Mono) jadi 1 keluarga: sumbu lebarnya sendiri sudah jadi "payload kartografis" yang dimaksud brainstorming, tidak perlu file terpisah untuk peran display vs body; Spectral ditahan sampai ada prosa panjang sungguhan di Immersive (T-43+) — menyimpannya sekarang cuma berat tanpa guna terpakai. `--font-display`/`--font-body` diremap ke Archivo yang sama; heading (`h1`–`h3`) dapat sentuhan `font-stretch: 118%` khusus mode Immersive supaya sumbu lebarnya benar-benar terpakai, bukan sekadar diklaim. **Nol JS injeksi font** — klaim awal T-39 soal "script inject `<link>` font" ternyata tidak perlu: `@font-face` yang di-scope lewat token `var(--font-display)`/`var(--font-body)` di dalam `:root[data-mode='immersive']` sudah lazy-load secara native di browser. Diverifikasi lewat network log build **production** (`astro preview`, bukan dev server — dev server Vite sempat memberi sinyal salah, font ter-fetch bahkan di Reading Mode; ternyata artefak pipeline CSS dev, tidak muncul di build sungguhan): Reading Mode nol request ke file font; Immersive Mode memicu satu `GET .../archivo-variable-latin.woff2 → 200` tepat saat toggle aktif. `font-stretch` komputasi terkonfirmasi 118% pada heading, `font-family` terkonfirmasi Archivo di body + plate title. Reading Mode dicek ulang tidak regresi (Bodoni Moda + Karla tetap) (M5) — 2026-07-28
- [x] T-40: identitas DATUM di homepage — `ImmersiveIndex.astro` baru, dipasang di `index.astro` di sebelah markup Reading Mode lewat wrapper `[data-mode-view]` (kedua markup dikirim di HTML statis yang sama, CSS murni memutuskan mana yang tampil — nol fetch runtime, nol island kedua, sesuai ADR-003). Penempatan plate diturunkan dari `type` (kolom, 4 kolom mengikuti urutan `POST_TYPES` yang sudah dipakai `TypeFilter.astro`) + `date` (urutan baris dalam kolom) — bukan `grid-area` tulis tangan; post baru otomatis jadi baris baru tanpa edit layout. Field graticule CSS murni (`repeating-linear-gradient`, opacity rendah lewat `::before` supaya konten di atasnya tetap tajam). Hatch per `type` memakai ulang token yang sudah ada (`--color-chart-2`, `--color-accent`, `--color-ink-muted`, `--color-line`) — bukan token dekoratif baru. Header kolom = legenda sekaligus filter (`<a href="/explore/{type}">`). Field `coordinates` (string DMS, opsional) ditambah ke schema; diisi manual untuk 10 dari 11 post dengan lokasi geografis nyata (dihitung dari koordinat desimal asli lewat script, bukan kira-kira) — `building-knowledge-hub` sengaja dibiarkan tanpa koordinat karena bukan tentang tempat. `data-pagefind-ignore` dipasang di view immersive supaya judul post tidak terindeks dobel (Pagefind mengindeks `<body>` penuh tanpa peduli `display:none`) — indeks kembali ke 1944 kata dari 2004. Disederhanakan dari deskripsi task asli: "nomor sheet" per-halaman diganti hitungan total sheet (lebih pas untuk halaman indeks); tick lintang & crosshair SVG data-URI dilewati — graticule murni sudah memberi tekstur "lembar survei" tanpa fabrikasi elemen yang tidak memetakan apa pun nyata. Diverifikasi lewat reload sungguhan (`localStorage` diisi lebih dulu, pola dari gotcha T-39): 11 plate persis, kolom 3/1/4/3, semua koordinat & judul benar, aksen `#5a8d5d`. Di 375px grid otomatis 1 kolom, nol overflow horizontal — desain mobile penuh tetap milik T-43 (M5) — 2026-07-28
- [x] T-37: ADR-003 — memperjelas klausa 4 ADR-002 sebagai larangan hidrasi framework (bukan larangan byte mutlak), diputuskan setelah user memilih opsi ini secara eksplisit (2026-07-28); 3 klausa: Tier-0 CSS platform features, Tier-1 vanilla ≤2KB gzip diizinkan di layout global, dual-mode sebagai preferensi tersimpan client via `data-mode` — bukan field frontmatter, bukan pohon route kedua. Bukti pendukung yang dikutip: `<Analytics />` sudah mengirim JS di setiap halaman sejak M3; `jabodetabek-connect.mdx` mencatat proyek Afreza sendiri sudah memakai pola persis "light/dark theme + pre-hydration script" (M5) — 2026-07-28
- [x] T-38: blok `:root[data-mode="immersive"]` di `global.css` di dalam `@layer base` — remap 8 token warna yang sudah ada (bukan token paralel). Kontras WCAG dihitung manual sebelum commit: aksen hijau brainstorm awal (`#4f7d52`) cuma lolos AA teks besar (4,18:1) di atas bg baru; diganti `#5a8d5d` (5,14:1, lolos AA teks normal). Tipografi (`--font-display`/`--font-body`) **sengaja tidak** diremap di sini — ditahan untuk T-41 yang memang tugas memutuskan & self-host typeface Immersive sungguhan, supaya T-38 tidak diam-diam mengambil keputusan desain yang bukan scope-nya (M5) — 2026-07-28
- [x] T-39: `ModeController` Tier-1 — script `is:inline` pra-paint di `BaseLayout.astro` (persis setelah `meta charset`, sebelum stylesheet apa pun) + tombol toggle di `Header.astro` dengan script vanilla ~591 byte mentah / 325 byte gzip (jauh di bawah anggaran 2KB ADR-003). Diverifikasi lewat reload sungguhan dengan `localStorage` diisi lebih dulu (bukan klik-lalu-baca — environment browser sesi ini tidak me-repaint elemen lama setelah mutasi atribut in-page, gotcha baru dicatat di `docs/memory/LESSONS.md`): bg/teks/aksen semuanya benar sebelum first paint. Injeksi font Immersive kondisional **tidak** dikerjakan — menunggu T-41 memutuskan font sungguhan dulu (M5) — 2026-07-28
- [x] T-31: `repo:` ditambah ke 3 post `type: project` (URL diberikan user — `Luthfi-Forma/Jabodetabek-Connect`, `Luthfi-Forma/Jakarta_Transit_Heritage_Explorer`, `Luthfi-Forma/CDMP-Jabodetabek`); org salah di `building-knowledge-hub.mdx` diperbaiki (`afrezahernanda` → `Luthfi-Forma`); jalur ≤2 klik ditelusuri manual di `dist/` build dan tercatat di `docs/TESTING.md` — ternyata post → repo bisa 1 klik langsung dari meta bar post, di luar jalur post → project hub → repo. `demo:` belum diisi — belum ada demo live per bagian "Status" tiap post (M5) — 2026-07-28
- [x] T-33: cover project — diarahkan ulang oleh user dari screenshot ke ilustrasi generated: 3 diagram editorial (bukan foto) yang masing-masing mengkodekan fakta nyata dari postnya (13 lines · 128 stations; 3 node uji bernama; 1989–2027 · 14 project), dibuat sebagai SVG tulisan tangan lalu di-rasterize lewat `@resvg/resvg-js` — library & font TTF yang sama dengan `src/lib/og-image.ts`, tanpa dependency baru. Skrip generator dibuang setelah dipakai (bespoke sekali-render, bukan tooling permanen, mengikuti pola "tidak ada auto-chart generik" yang sudah berlaku di `src/lib/scrollytelling/`). Mematikan 3 placeholder krem di homepage Featured Projects — terverifikasi nol sisa di `dist/index.html` (M5) — 2026-07-28
- [x] T-34: terjemahkan label & caption chart Indonesia → English di 4 modul `src/lib/scrollytelling/*.tsx` — lingkupnya ternyata jauh lebih luas dari 8 kemunculan yang tertandai semula: data label chart (Kelas 1–5, status desa, tenure TLI, skenario, dll.), caption di bawah chart, `vizCitation.fig`/`source` (dirender sebagai "Drawn from" untuk tiap section, bukan cuma section aktif), locator `citations[].where` di panel "Sources for this claim" (dirender untuk semua section), heading "Sumber" → "Source", dan format angka `toLocaleString('id-ID')` → `'en-US'`. Istilah resmi tata ruang yang sudah dipakai apa adanya di body prose English (RTRW, PKL/PKLp/PPK/PPL, Skalogram, Hierarki, IPD, kecamatan/kelurahan/kabupaten-kota, Sasaran 1/2, P3KE, AMDAL) sengaja **dipertahankan** sebagai loanword, mengikuti preseden yang sudah ada di teks post — bukan luput tak sengaja. Judul dokumen sumber yang dikutip literal tetap dalam Bahasa Indonesia (praktik sitasi standar, tidak menerjemahkan judul karya). Terverifikasi lewat `npm run build` + grep pada `dist/`: nol sisa Indonesia pada seluruh teks yang ter-SSR (M5) — 2026-07-28
- [x] T-32: "Project: X" jadi link nyata — `<span>` → `<a href="/projects/...">` di `src/pages/posts/[slug].astro`, memakai `getProjectTitle()` supaya labelnya sama dengan halaman `/projects`; sebelumnya post → project hub adalah nol klik (M5) — 2026-07-28
- [x] T-35: perbaikan aset & a11y — `portrait.png` dipindah ke `src/assets/` + `<Image>` (982.410 → 11.892 byte webp, −98,8%); dua `repeat: Infinity` di `cikarang-industrial-settlement-pattern.tsx` jadi sekali putar (WCAG 2.2.2); net `prefers-reduced-motion` global di `global.css` (sengaja unlayered + `!important` — kebalikan dari reset heading, karena harus menang atas scoped `<style>` di `about.astro`/`FeaturedProjects.astro`); `--font-mono` didefinisikan (dipakai 8× tapi tidak pernah ada, diam-diam jatuh ke default Tailwind) (M5) — 2026-07-28
- [x] T-30: scrollytelling `rpplh-south-papua` — Food Estate 1,2 juta ha/6 distrik vs. 471.026 ha ruang budaya adat tumpang-tindih (7 kategori), skor jasa lingkungan (74,63% pangan kelas-4, 67,88% kehati kelas-5), status desa IPD (89% tertinggal/sangat tertinggal), temuan lapangan (200 ekskavator, 135/140km jalan tanpa AMDAL), tradisi Sasi OAP (M4) — 2026-07-18
<!-- - [x] T-00: example (M1) — 2026-01-01 -->
