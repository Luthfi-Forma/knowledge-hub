# ADR-005: Story framework — scene di frontmatter, prosa di MDX, satu stage persisten

Status: Accepted
Date: 2026-08-09

<!-- Status lifecycle: Proposed → Accepted → (Superseded by ADR-NNN).
     Never edit an Accepted ADR's Decision section — supersede it.
     Process: C:\Users\Luthfi\Documents\Claude Code\Claude Engineering OS\standards\architecture\adr-process.md -->

## Context

**ADR ini tidak menyentuh ADR-004.** Perlu dinyatakan lebih dulu karena ADR ini
memperkenalkan istilah yang akan memicu pattern-match ke dual-mode bagi pembaca
yang menyapu sekilas: "mode" story (`per-scene` / `persistent`), "lapisan
spasial", dan "focus mode". Nol dari ketiganya adalah identitas visual kedua.
Tidak ada `data-mode`, tidak ada pohon DOM kedua, tidak ada token yang di-remap,
tidak ada satu pun komponen yang perlu dirancang dua kali — yang justru
satu-satunya alasan ADR-004 ditulis. Atlas tetap satu-satunya identitas situs.

Pemilik situs menyerahkan `Konsep Milestone 10.txt`: rencana mengembangkan
scrollytelling dari "artikel dengan animasi" menjadi "interactive knowledge
experience". Konsep itu meminta framework reusable dengan tujuh primitif
(StoryContainer, StorySection, ScrollTrigger, Visualization, Timeline, MapScene,
DataPanel), dengan premis bahwa "setiap interactive page berpotensi dibuat
secara custom" dan "belum memiliki framework reusable".

**Premis itu setengah keliru, dan itu mengubah bentuk pekerjaan.** Audit kode
menemukan mekanika scroll sudah tersentral penuh: `src/islands/Scrollytelling.tsx`
(385 baris) memuat `useActiveSection` (`:33-53`), loop section (`:301-311`), dan
seluruh orkestrasi scroll; keempat modul di `src/lib/scrollytelling/`
mengimpornya. **Duplikasi mekanika scroll = nol.** Memecah file tanpa duplikasi
menjadi tiga komponen bernama adalah refactor untuk kosakata, bukan leverage.

Yang benar-benar menghambat, dan tidak terlihat dari luar:

- **Model step diskret dan remounting.** `AnimatePresence mode="wait"` di-key ke
  section aktif (`:325-336`) meng-unmount viz tiap langkah, dan
  `viz: Record<string, ComponentType>` (`:29`) berarti viz menerima **nol prop**.
  Tidak ada progress kontinu, tidak ada persistensi lintas scene. Peta yang
  pan/zoom antar-scene — inti permintaan konsep — **mustahil secara struktural**
  karena satu baris tipe ini, bukan karena kurang komponen.
- **Prosa hidup di TypeScript.** Body MDX post scrollytelling merender nol
  (`[slug].astro:107-113` melewati `<Content />`); teksnya adalah `ReactNode`
  di dalam `.tsx`. Penulis menulis prosa di dalam kode.
- **Duplikasi nyata ada di modul viz, bukan di shell.** `tooltipStyle` identik
  byte-per-byte di 4 file; `AnimatedNumber` didefinisikan 3× dengan **semantik
  berbeda** (satu tween dari nilai sebelumnya, dua mulai dari 0, satu tanpa
  pembulatan); `<table className="sr-only">` — fallback aksesibilitas tiap
  chart — disalin tangan ~16×.
- **~700KB JS untuk merender halaman yang teksnya tidak pernah berubah.** Hero,
  kolom teks, `CitationBlock`, dan `SourcesPanel` semuanya React terhidrasi
  padahal 100% statis. `CitationBlock` bahkan sudah berupa `<details>` yang
  dirender React tanpa alasan.

Ada satu batasan lingkungan yang ikut membentuk keputusan di bawah, bukan hanya
cara mengujinya: `docs/memory/LESSONS.md` (2026-07-21) mencatat bahwa
`IntersectionObserver`, `requestAnimationFrame`, dan `ResizeObserver` **tidak
pernah menyala** di browser tool sesi ini. Selama scroll dideteksi lewat
`IntersectionObserver` dan seluruh halaman dirender React, praktis tidak ada
bagian scrollytelling yang bisa diverifikasi sebelum deploy.

**Spike T-71 (2026-08-09)** mengukur batasan itu langsung terhadap
`astro preview` yang sungguhan, bukan mengandalkan catatan lama, karena
rancangan awal ADR ini bertumpu pada asumsi yang ternyata keliru — draf
pertamanya mengklaim bahwa berpindah ke event `scroll` akan membuat stage
terverifikasi. **Klaim itu salah.** Hasil terukur:

| Primitif | Hasil |
|---|---|
| `window.scrollY` — dibaca & maju setelah `scrollTo` | **ya** (0 → 2500 → 4200) |
| `getBoundingClientRect()` pada `<section>` statis | **ya**, dan offset absolut tetap konsisten di tiap posisi scroll (`sec-finding1` = 3149 baik pada scrollY 0 maupun 4200) |
| event `scroll` | **tidak** — 0 event terpicu |
| `IntersectionObserver` | **tidak** |
| `requestAnimationFrame` | **tidak** |
| `requestIdleCallback` | ada di runtime, **tidak pernah menyala** |
| `setTimeout` | **ya** — satu-satunya primitif async yang hidup |
| `client:visible` terhidrasi | **tidak** (`astro-island` tetap `ssr=""`, nol React fiber) |
| `client:load` terhidrasi | **ya** (`ssr` hilang, React fiber ada) |
| tinggi viewport (`innerHeight`, `documentElement.clientHeight`, `visualViewport`, `screen`) | **semua 0** |
| recharts merender `<svg>` | **tidak** (butuh `ResizeObserver`) |

Tiga konsekuensi yang membentuk keputusan #5 dan #6, bukan sekadar cara
mengujinya: pindah ke event `scroll` **tidak** memperbaiki verifiabilitas
(event-nya sama matinya dengan IO); yang benar-benar bisa diuji adalah
**perhitungannya**, karena `scrollY` dan `getBoundingClientRect()` keduanya
mengembalikan nilai asli; dan tinggi viewport tidak tersedia sama sekali, jadi
apa pun yang membaginya harus menerima nilai itu dari luar atau ia akan
membagi dengan nol di sini tapi tidak di browser asli.

## Decision

1. **Struktur story di frontmatter, prosa di body MDX.** Skema `posts` mendapat
   objek `story` opsional (divalidasi zod, JSON-serializable by construction)
   berisi daftar scene: `id`, `kicker`, `title`, `citations`, `vizCitation`.
   Prosa tiap scene ditulis sebagai markdown di body MDX, dibungkus
   `<Scene id="...">`. `Story.astro` mengambil daftar scene dari frontmatter,
   bukan dari introspeksi children.

   `<Story><Scene>` literal seperti yang konsep bayangkan **tidak bisa dicapai**,
   dan alasannya perlu dicatat supaya tidak dicoba ulang: parent Astro tidak bisa
   membaca prop children yang di-slot — konten slot dirender jadi string HTML
   sebelum parent melihatnya, jadi `Story` tidak akan pernah tahu daftar id
   scene-nya. Merendernya lewat React juga tidak menolong: children yang masuk ke
   island tiba sebagai HTML pra-render opaque di `<astro-slot>`, bukan children
   React yang bisa diintrospeksi. Frontmatter memberi semua manfaat yang
   diinginkan konsep (prosa jadi markdown, cross-link jadi link markdown, prosa
   terindeks Pagefind sebagai konten, menambah scene = edit MDX) tanpa melawan
   model rendering.

2. **Shell story statis; satu island saja.** Hero, kolom prosa, blok sitasi, dan
   panel sumber jadi komponen `.astro` — semuanya panel disclosure atau teks
   mati, jadi Tier-0 (ADR-003 keputusan #1). Satu-satunya bagian terhidrasi
   adalah stage visual, `<StoryStage client:idle />`.

3. **Kontrak prop stage menggantikan `Record<string, ComponentType>`:**

   ```ts
   interface StageState {
     sceneId: string; sceneIndex: number; sceneCount: number;
     sceneProgress: number;   // 0..1 di dalam scene aktif
     storyProgress: number;   // 0..1 sepanjang story
     direction: 1 | -1;
     reduceMotion: boolean;
   }
   type StageVisual =
     | { kind: 'per-scene'; viz: Record<string, SceneViz> }  // perilaku hari ini
     | { kind: 'persistent'; stage: SceneViz };              // satu mount, morph
   ```

   `kind: 'per-scene'` kompatibel dengan keempat modul yang ada tanpa satu pun
   edit. `kind: 'persistent'` adalah satu-satunya yang membuka jalan spasial.

4. **`reduceMotion` diturunkan sebagai prop, bukan dipanggil sebagai hook di tiap
   viz.** Hari ini ada 20+ call site `useReducedMotion()` tersebar di 4 modul,
   tiap satu peluang lupa — dan RULES.md sudah menyatakan motion JS tidak
   tercakup jaring CSS global. Di-resolve sekali di stage, lupa jadi mustahil,
   **dan reduced-motion bisa diuji untuk pertama kalinya** dengan membalik satu
   prop.

5. **Progress scroll dihitung dari event `scroll`, bukan `IntersectionObserver`.**
   Offset scene diukur saat mount dan resize lalu di-cache; handler scroll nol
   pembacaan layout, jadi tidak bisa memaksa reflow. `setState` hanya saat nilai
   ter-kuantisasi (1/200) berubah.

   **Matematika progress wajib berupa fungsi murni yang diekspor terpisah** dari
   hook yang memasang listener — `computeStageState(scrollY, offsets, viewportHeight)
   → StageState`. Tinggi viewport **di-inject sebagai argumen, tidak pernah dibaca
   di dalam fungsi**. Kedua batasan ini bukan preferensi gaya: keduanya
   satu-satunya cara stage bisa diuji sama sekali di lingkungan ini (lihat spike
   T-71 di bawah).

6. **Hidrasi pindah `client:visible` → `client:load`** untuk post scrollytelling.
   Island ini **adalah** halamannya — di atas lipatan, konten utama route — jadi
   menunda hidrasinya tidak membeli apa pun. `client:visible` (IO-gated) dan
   `client:idle` (`requestIdleCallback`-gated) sama-sama **tidak pernah
   terhidrasi** di lingkungan verifikasi proyek ini; `client:load` terhidrasi.
   Ini satu-satunya perubahan satu-kata yang mengubah stage dari
   permanen-tak-terverifikasi jadi terverifikasi.

7. **Lapisan spasial dibangun tanpa library peta.** Geometri disederhanakan
   ditulis tangan sebagai modul TypeScript berisi array angka, diproyeksikan
   Web Mercator (~15 baris), dirender sebagai `<path>`/`<circle>`. **Nol
   dependensi baru adalah target eksplisit M10.** `d3-scale`/`d3-shape`/
   `d3-interpolate` sudah ada di bundle secara transitif lewat recharts.

8. **`coordinates` di `content.config.ts` tidak disentuh.** Ia string DMS
   dekoratif, dipakai 10 dari 14 post, dan nol yang menghitung darinya.
   Koordinat asli untuk story spasial hidup di modul data story-nya sendiri.

9. **Migrasi inkremental, bukan big-bang.** `src/islands/Scrollytelling.tsx`
   dipertahankan utuh sepanjang M10 sebagai permukaan kompatibilitas; dihapus
   hanya setelah keempat post dimigrasikan dan dilihat live.

## Rationale

- **Memecah shell jadi statis mengecilkan permukaan yang tidak bisa
  diverifikasi.** Perlu presisi di sini, karena versi kasar dari argumen ini
  keliru: Astro sudah meng-SSR island, jadi hero dan prosa **memang sudah** ada
  di HTML statis hari ini — spike T-71 membacanya (7 `<section>`) pada halaman
  yang terbukti tidak terhidrasi. Yang didapat dari keputusan #2 karenanya bukan
  "membuat teks terlihat oleh tool", melainkan: ~700KB hidrasi hilang untuk
  konten yang tidak pernah berubah, dan permukaan interaktif yang tersisa
  menyusut jadi satu stage kecil — cukup kecil untuk seluruhnya dijangkau oleh
  fungsi murni di keputusan #5 plus `client:load` di keputusan #6. Bagian yang
  benar-benar tidak pernah terverifikasi selama ini (swap viz, progress bar)
  justru itulah yang jadi terverifikasi.
- **Prop mengalahkan hook untuk hal yang wajib benar di tiap viz.** Reduced
  motion adalah kewajiban aksesibilitas yang RULES.md serahkan ke tiap island
  secara manual. Kewajiban yang diulang 20 kali adalah kewajiban yang akan
  terlewat; kewajiban yang mengalir dari satu tempat tidak bisa.
- **Frontmatter mengembalikan prosa jadi konten.** Hari ini prosa post
  scrollytelling tidak terlihat oleh `getRelatedPosts`, tidak terindeks Pagefind
  sebagai body, dan tidak bisa diedit tanpa menyentuh TypeScript. Memindahkannya
  ke MDX mengembalikannya ke lapisan konten tempat seharusnya ia berada.
- **Geometri tulis-tangan lebih tepat daripada library peta untuk situs ini,
  bukan sekadar lebih murah.** Keempat modul yang ada sudah memakai diagram SVG
  abstrak sebagai pengganti kartografi; melanjutkannya konsisten. Dan sebuah
  endpoint tile remote secara fungsional adalah backend — melanggar non-goal
  "situs sepenuhnya statis" di `PROJECT_BRIEF.md` yang sudah Approved. Yang
  paling menentukan: `<path>` yang ditulis sendiri **bertahan lintas scene dan
  bisa di-morph**, yang justru seluruh maksud keputusan #3.
- **Nol dependensi baru menjaga janji ADR-001.** Constraint tertulis di brief:
  "Solo developer, pemula — teknologi baru dibatasi".

## Alternatives considered

- **Tujuh primitif seperti diminta konsep** (StoryContainer/StorySection/
  ScrollTrigger/…). Ditolak: tiga yang pertama sudah ada dan sudah tunggal di
  `Scrollytelling.tsx`; mengekstraknya menambah file dan indireksi tanpa mengubah
  apa pun yang dilihat pembaca. Empat sisanya (Visualization/Timeline/MapScene/
  DataPanel) mengasumsikan sistem chart generik, yang ADR-002 sudah tolak secara
  eksplisit ("no generic auto-chart system") dan tiap modul yang ada mengulanginya.
- **MapLibre / Leaflet / deck.gl untuk lapisan spasial.** Ditolak: ~200KB gzip
  plus fetch tile ke host pihak ketiga tiap kunjungan halaman. WebGL juga tidak
  bisa diverifikasi di lingkungan ini — ROADMAP sudah membunuh three.js persis
  karena alasan itu ("`rAF` tidak pernah jalan di environment ini").
- **Knowledge Graph Mode di M10.** Ditunda, bukan ditolak. Gerbangnya sudah
  tertulis di ROADMAP "Digerbangi, bukan dibunuh": **≥20 post dan ≥15 cross-link
  inline**. Cross-link sudah melewati ambang; post masih 14. Menerbitkannya
  sekarang berarti menimpa gerbang yang proyek ini tetapkan sendiri tanpa
  argumen baru. Lapisan relasinya sudah siap saat gerbang terbuka —
  `lib/topics.ts` sudah menghitung co-occurrence topik.
- **AI Knowledge Layer.** Ditolak, bukan ditunda. Hanya ada dua implementasi
  statis: mengirim model embedding ke browser (~25–30MB pada query pertama,
  100× halaman terberat situs hari ini, untuk menjawab pertanyaan tentang 14
  dokumen), atau memanggil API inferensi saat runtime — yang adalah backend,
  non-goal `PROJECT_BRIEF.md`. Menundanya ke milestone berikutnya akan menyiratkan
  ia layak nanti; di bawah brief ini, tidak. Kalau retrieval terasa lemah,
  perbaikan yang jujur adalah peringkat/UI Pagefind, yang sudah mengindeks
  seluruh post.
- **Immersive Mode sebagai identitas visual kedua** (seperti konsep aslinya
  tulis). Ditolak: ini persis alternatif yang ADR-004 tolak sebagai "Pertahankan
  toggle, jadikan Atlas identitas ketiga", sebelas hari sebelum ADR ini, dan nol
  alasan baru muncul sejak itu. Perlu dicatat pula bahwa prinsip "Optional
  Complexity" yang konsep inginkan **sudah terpenuhi dengan bentuk yang lebih
  baik**: `presentation: 'scrollytelling'` adalah opt-in per-konten saat build,
  bukan preferensi per-pembaca saat runtime — persis garis yang ADR-003 keputusan
  #3 tarik. Yang dipakai sebagai gantinya adalah **focus mode per-story**: satu
  tombol di dalam satu post yang menyembunyikan collar dan rail. Nol identitas
  kedua, jadi nol biaya yang ADR-004 hindari.
- **Big-bang: tulis framework, migrasi keempat post sekaligus.** Ditolak per
  LESSONS 2026-07-18 ("additive-first, then full-replace once seen live"), yang
  contohnya justru jalur kode ini. Keempat post adalah konten unggulan situs,
  semantik swap-nya berbeda halus per modul, dan nol dari itu bisa diamati
  sedang di-scroll di lingkungan ini.

## Consequences

- (+) Sebagian besar rewrite jadi terverifikasi tanpa JS berjalan — pembalikan
  nyata dari kondisi hari ini, di mana `docs/ARCHITECTURE.md` sendiri mencatat
  "Known verification gap" untuk fitur ini.
- (+) Prosa keempat post (~2.100 baris) kembali jadi konten yang bisa diedit,
  terindeks, dan dilihat perkakas topik — bukan kode.
- (+) Reduced motion jadi bisa diuji; fallback tabel a11y jadi mustahil dilupakan
  karena dipaksakan oleh primitif `Chart`, bukan oleh disiplin penyalin.
- (+) Stage post baru bebas recharts dengan `viewBox` eksplisit, jadi terverifikasi
  dengan cara yang keempat post lama tidak pernah bisa (recharts butuh
  `ResizeObserver`, yang tidak menyala di sini).
- (−) **Bundle akan memburuk sebelum membaik, dan mungkin tidak membaik.** Chunk
  482KB itu didominasi recharts, bukan shell; memindahkan prosa keluar React
  menghemat mungkin 20–40KB raw. Selama migrasi, **dua shell hidup bersamaan**.
  Yang benar-benar menggerakkan angka hanya membuang recharts — sengaja **tidak**
  dimasukkan M10 (itu rewrite kelima di atas empat), tapi wajib diukur di akhir
  dan dicatat sebagai DEBT dengan angka asli. Nol perf budget di CI (T-36
  terblokir), jadi nol yang akan menangkap regresi selain pengukuran sengaja.
- (−) **`setState` saat scroll adalah cara klasik membuat scrollytelling
  tersendat**, dan mitigasinya (offset ter-cache, progress ter-kuantisasi,
  subtree kecil) **tidak bisa diverifikasi di lingkungan ini** — timing paint
  persis yang tool tidak bisa amati. Butuh pemilik situs men-scroll halaman
  ter-deploy di HP asli. Kalau tersendat, jalan keluarnya adalah `MotionValue`/
  `useTransform` yang melewati render React sepenuhnya — yang lalu jadi tidak
  terverifikasi di sini juga.
- (−) **Stage persisten diam-diam mengubah perilaku `AnimatedNumber` yang sudah
  tayang.** Di bawah remounting, counter di bontang dan rpplh mulai dari 0 tiap
  kali scene-nya jadi aktif; di bawah stage persisten, tidak. Bisa dibilang lebih
  baik, tapi ini perubahan yang terlihat pada konten terbit yang nol test maupun
  build error akan menangkapnya.
- (−) **Id scene hidup di dua tempat** (array frontmatter dan atribut `<Scene>`).
  Typo menghasilkan scene beranchor tanpa prosa, atau prosa tanpa anchor, dan
  build tetap hijau. Dimitigasi assertion build-time di `Story.astro` — murah,
  wajib ada sejak task shell, bukan ditambahkan belakangan.
- (−) **Diff migrasi prosa besar dan tidak bisa direview borongan.** LESSONS
  2026-08-04 mencatat kebijakan editing task sebelumnya bocor ke task berikutnya
  dan diam-diam mengubah prosa pemilik situs, ketahuan hanya lewat perbandingan
  hitungan karakter. Bahaya yang sama berlaku di sini dengan volume ~10×. Tiap
  task migrasi wajib diakhiri cek diff mekanis (hitung kata, link, dash per
  scene), bukan dibaca ulang.
- (−) Empat cabang `post.id === '...'` di `[slug].astro:115-118` menyusut tapi
  tidak hilang — `client:*` tetap butuh referensi komponen yang bisa dianalisis
  statis (LESSONS 2026-07-18). Satu import + satu cabang per post tetap harga
  yang harus dibayar, dan lesson yang sama sudah menyebutnya wajar.
- Follow-up: pelaksanaan di M10 (T-71 s/d T-81, lihat `docs/TASK.md`).
