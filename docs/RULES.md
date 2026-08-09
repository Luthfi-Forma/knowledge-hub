# Project Rules — knowledge-hub

- Updated: 2026-07-30

This project follows Claude Engineering OS standards by default (see
`CLAUDE.md`, "Standards in force"). **This file records only the deltas** —
where this project deliberately deviates from an OS standard, and why.

<!-- Empty table = full OS compliance. That is the ideal state.
     A deviation that changes architecture or tooling also needs an ADR. -->

## Deviations from OS standards

| OS rule (file + rule) | This project does | Why / ADR |
|---|---|---|
| `CLAUDE.md` — "Konten publik fill language: **English**" | 3 post M9 (`data-spasial-perencanaan-wilayah`, `denial-presiden-krisis-ekonomi`, `paradoks-transportasi-indonesia`) diterbitkan **Bahasa Indonesia**, bukan diterjemahkan | Keputusan eksplisit user (2026-08-04): artikel esai analitis panjang dengan kutipan tokoh publik dan angka spesifik — risiko salah nuansa kalau diterjemahkan tanpa review manual lebih besar daripada manfaat konsistensi bahasa. Ketiga artikel ini juga suara asli penulis (dari vault pribadi), bukan konten yang ditulis untuk situs ini — sama seperti 17 definisi topik T-63 yang tidak disentuh karena "sudah suara aslinya" |
| `hooks/profiles/standard.json` — OS's default profile also includes `data_validation_check.py` and (in `strict`) `perf_reminder.py` | Only `commit_message_gate.py` + `code_quality_reminder.py` wired | No JSON/GeoJSON data files exist anywhere in this project, and no map/render-sensitive components exist (this is a content blog, not a map app) — those two hooks would never fire, so they're omitted rather than wired inert. |

## Known limitation (not a deviation to fix ad-hoc)

`code_quality_reminder.py`'s file pattern covers `.ts/.tsx/.js/.jsx/.py`
but **not `.astro` or `.mdx`** — the two extensions that make up most of
this project's source (27 `.astro` + 11 `.mdx` vs. 7 `.ts` + 5 `.tsx`).
The hook still fires correctly on the project's TS/TSX files (islands,
`src/lib/scrollytelling/*.tsx`), just not on Astro components or content
pages. Extending the shared hook script's pattern is an OS-level change
(affects all projects), not a per-project fix — noted here as a
harvest-lessons candidate rather than patched silently mid-migration.
| `standards/architecture/technology-selection.md` — web-app default Next.js | Astro + content collections (Tailwind & Vercel tetap default) | [ADR-001](decisions/ADR-001-astro-over-nextjs.md) |
| `CLAUDE.md` — "Standards in force" menunjuk `knowledge/react-nextjs.md` | Tidak berlaku penuh (bukan Next.js); gotcha Astro dicatat di `docs/memory/LESSONS.md` | ADR-001, Consequences |

## Project-specific conventions

<!-- Rules that exist ONLY here because of this project's domain (e.g., "all
     timestamps in WIB", "station IDs follow GTFS stop_id"). Keep short. -->

- Konten publik (post, halaman) berbahasa **English**; dokumen `docs/` Bahasa
  Indonesia.
- Tags: lowercase, vocabulary terkontrol — topic dan technology dilebur ke satu
  field `tags` (mis. `gis`, `python`, `urban-planning`); tanpa field `year`
  atau `status` selain `draft` (lihat content model di `docs/ARCHITECTURE.md`).
- Aturan *content-first*: tiap milestone wajib menambah konten nyata, bukan
  hanya fitur.

## Motion rules (M5 T-44, diperbarui M6 T-62)

Dikonsolidasi dari pola yang benar-benar dipakai selama M5 — bukan sistem
token baru, murni penulisan ulang apa yang sudah terbukti bekerja supaya
kerja berikutnya (termasuk perluasan Immersive di M6+) mengikuti pola yang
sama, bukan menemukan ulang.

- **Satu sumber kebenaran untuk CSS, satu untuk JS — jangan campur.**
  Motion berbasis CSS (semua `transition`/`animation` di `.astro` dan
  `global.css`) otomatis dinetralkan oleh net global di `global.css`
  (`@media (prefers-reduced-motion: reduce)`, sengaja *unlayered* +
  `!important` supaya menang atas segala `@layer` dan `<style>` scoped).
  Motion berbasis JS (React `motion/react` di island scrollytelling) **tidak**
  tersentuh net itu — wajib panggil `useReducedMotion()` sendiri. Jangan
  buat mekanisme reduced-motion kedua di scoped `<style>` manapun; jika
  butuh pengecualian, tambah selector ke net yang sudah ada.
- **Pseudo-element non-standar butuh entry sendiri di net reduced-motion.**
  `*::before`/`*::after` tidak mencakup `::view-transition-*` — keduanya
  pseudo-element berbeda yang dibuat browser untuk View Transitions.
  Ditemukan lewat T-42; entry terpisah sudah ada di `global.css`. Pola ini
  berlaku untuk pseudo-element non-standar apa pun ke depannya (cek
  eksplisit, jangan asumsi wildcard menjangkau semuanya).
- **Nol animasi berulang tanpa kontrol jeda.** `repeat: Infinity`/`loop`
  dilarang — ditemukan sebagai pelanggaran WCAG 2.2.2 Level A nyata di T-35
  (dua chart scrollytelling), diperbaiki jadi hitungan putaran terbatas.
  Kalau ide desainnya memang butuh gerak ambien terus-menerus, itu tandanya
  idenya salah untuk situs ini, bukan tandanya perlu tombol jeda.
- **Kontrol interaktif harus fokusabel di keadaan istirahat, bukan cuma
  saat sedang dipakai.** Ditemukan sebagai bug aksesibilitas nyata di T-42:
  grip registration seam awalnya `display:none` sampai drag dimulai — user
  keyboard tak pernah bisa fokus untuk *memulai* drag (masalah ayam-telur).
  Elemen `tabindex="0"`/`role` interaktif apa pun harus selalu ada di DOM
  dan fokusabel; sembunyikan cuma bagian dekoratifnya (garis panduan, dll),
  bukan kontrolnya.
- **Posisi/nilai awal yang harus benar di first paint ditulis di CSS, bukan
  diserahkan ke script yang jalan setelah paint.** Pola yang sudah terbukti
  di seluruh dual-mode: warna/tipografi Immersive (`:root[data-mode=
  'immersive']` di `@layer base`) dan posisi awal grip seam
  (`:root[data-mode='immersive'] .seam-stage { --seam: 100% }`) — keduanya
  sengaja diset lewat selector CSS yang match sebelum browser pernah
  mengecat frame pertama, bukan lewat `<script>` yang memperbaikinya
  belakangan. Ini bukan cuma soal linimasa render: script yang jalan
  setelah elemen ter-render lalu memutasi custom property CSS-nya juga
  ternyata tidak reliably ter-verifikasi di tooling browser sesi Claude Code
  ini (lihat `docs/memory/LESSONS.md`, entri T-39 dan T-42) — jadi menaruh
  nilai awal di CSS sekaligus menghindari kelas bug ini dan mempercepat
  first paint di browser sungguhan.
- **Durasi yang sudah dipakai** (bukan token formal, konvensi longgar untuk
  konsistensi) — **diperbarui M6 (T-62)**, menggantikan konvensi M5 di
  bawah: **120ms `ease` untuk hover/fokus** (warna teks, warna/latar
  border — `.control`, `Plate`, `TopicChip`, nav link, semua kontrol
  interaktif Atlas dipakai konsisten di sinilah); **200ms `ease` untuk
  perubahan layout/posisi** (`transform` drawer `LegendRail`, satu-satunya
  kasus hari ini — geser posisi, bukan sekadar ganti warna, jadi butuh
  sedikit lebih lama supaya terbaca sebagai gerak, bukan kedip); **300ms
  sebagai batas atas keras**, bukan target — dipakai `body`'s
  `background-color`/`color` transition (kasus paling "berat": seluruh
  halaman berpotensi berganti warna sekaligus, meski hari ini tidak ada
  state yang benar-benar memicunya). Ketiganya sudah konsisten dipakai di
  seluruh komponen Atlas (`grep -rn "[0-9]\+ms" src/` mengonfirmasi tidak
  ada nilai lain selain tiga ini) — jangan tambah nilai keempat kecuali ada
  kategori interaksi baru yang benar-benar tidak cocok di salah satu dari
  tiga di atas, dan tetap jangan bikin sistem token durasi formal kecuali
  kebutuhannya tumbuh jauh melampaui pola ad-hoc ini. (Konvensi M5 lama —
  300ms untuk pergantian warna/latar mode, 220ms untuk settle registration
  seam — digantikan di atas; mekanisme dual-mode & seam yang jadi
  konsumennya sudah dibongkar total di M6, ADR-004, jadi 220ms tidak lagi
  punya pemakai, digantikan 200ms layout untuk kasus serupa/perubahan
  posisi.)
- **Dua kategori gerak, bukan satu — diperbarui M10 (T-72).** Aturan durasi
  di atas ditulis seolah berlaku untuk seluruh situs, dan itu tidak pernah
  benar. Ada dua kategori dengan aturan berbeda, dan mencampurnya membuat
  audit menghasilkan "pelanggaran" palsu sekaligus melewatkan yang asli:
  1. **Chrome UI** — hover, fokus, press, drawer, crossfade antar-state.
     **Tunduk penuh pada 120/200/300ms di atas.** Di sinilah plafon keras
     berlaku.
  2. **Animasi penjelas di dalam viz** — gerak yang tugasnya menerangkan
     sebuah proses, bukan menandai perubahan state UI. Contoh: dua lingkaran
     yang saling mendekat selama 3 detik di
     `lib/scrollytelling/cikarang-industrial-settlement-pattern.tsx`, dan
     `animationDuration` recharts 800–1200ms. **Tidak tunduk pada plafon
     300ms** — memaksa konvergensi 3 detik jadi 300ms menghancurkan hal yang
     sedang dijelaskannya. Yang tetap mengikat di kategori ini: **sekali
     jalan, nol `repeat: Infinity`** (WCAG 2.2.2, pelanggaran nyata yang
     ditemukan di T-35), dan wajib menghormati reduced motion.
- **Cek millisecond punya titik buta: durasi yang ditulis dalam detik di
  JS.** `grep -rn "[0-9]\+ms" src/` tidak pernah melihat
  `transition={{ duration: 0.4 }}`. Karena itu klaim lama "tidak ada nilai
  lain selain tiga ini" **salah sejak M4** — T-72 menemukan 400ms di dua
  tempat (progress bar + crossfade viz) dan satu `spring` tanpa durasi yang
  settle di sekitar 500ms, semuanya di chrome `Scrollytelling.tsx`, semuanya
  melewati plafon keras dan semuanya lolos berkali-kali audit. Sudah
  diperbaiki ke 200ms. **Cek yang benar butuh dua grep**, bukan satu:
  `grep -rn "[0-9]\+ms" src/` untuk CSS, dan
  `grep -rn "duration:\|type: 'spring'" src/` untuk motion JS.
- **Dua kurva easing, bukan `ease` bawaan — ditambahkan M10 (T-72).**
  `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` untuk apa pun yang masuk,
  keluar, atau merespons pengguna (hover, fokus, press); `--ease-in-out:
  cubic-bezier(0.77, 0, 0.175, 1)` untuk sesuatu yang berpindah melintasi
  layar sambil tetap hadir (drawer `LegendRail`, panel Sources). **Ini bukan
  nilai durasi keempat** — durasinya tetap persis tiga; yang berubah hanya
  bentuk kurva yang dilalui ketiga durasi itu. `ease` bawaan CSS mengerem
  sangat terlambat, sehingga hover 120ms menghabiskan sebagian besar
  waktunya nyaris diam lalu tiba mendadak. Dua kurva, keduanya terpakai,
  **bukan tangga penamaan dan bukan sistem token** — batas yang aturan di
  atas minta dijaga tetap dijaga. Motion JS tidak bisa membaca custom
  property CSS, jadi kedua kurva itu dinyatakan ulang sebagai array
  `EASE_OUT`/`EASE_IN_OUT` di `src/islands/Scrollytelling.tsx` — nilainya
  wajib tetap sinkron dengan stylesheet.
- **Island (React/framework apa pun) tidak pernah di layout global** — ini
  aturan ADR-002/ADR-003, bukan aturan motion baru, tapi motion-nya sendiri
  jadi konsekuensi langsung: transisi mode dan seam dikerjakan Tier-1
  vanilla (CSS + `pointerdown`/`pointermove`/`keydown`), bukan React,
  persis supaya tidak melanggar aturan itu.
