# ADR-002: Adopsi Astro Islands untuk interaktivitas terbatas

Status: Accepted
Date: 2026-07-18

## Context

ADR-001 menetapkan default situs **zero-JS SSG** dan hanya membuka pintu
islands "bila terbukti perlu". Dua fitur M4 kini membuktikan kebutuhan itu,
dan keduanya memerlukan JavaScript client-side yang nyata:

- **T-24 — carousel Featured Projects (Home):** komponen yang bisa di-drag
  kiri/kanan. Interaksi DOM sederhana.
- **T-25 — scrollytelling untuk Research:** narasi berbasis scroll dengan
  kolom teks bergulir + kolom visual *sticky* yang berganti isi mengikuti
  section aktif, progress bar, transisi teranimasi, dan chart. Referensi user
  (`cikarangcountryside`, dibuat di Lovable) mengimplementasikannya sebagai
  **SPA TanStack Start + React 19 + Vite**, memakai `motion/react` untuk
  animasi, `recharts` untuk chart, dan `IntersectionObserver`
  (`useActiveSection`) untuk orkestrasi section-swap.

Situs ini tidak boleh berubah jadi SPA — mayoritas halaman tetap konten
statis. Yang dibutuhkan: mekanisme resmi untuk menyuntik interaktivitas
**per-komponen** tanpa membebani halaman lain, plus keputusan framework
island (Astro mendukung React/Preact/Vue/Svelte/Solid/vanilla) sebelum kode
T-24/T-25 ditulis. Referensi Cikarang juga memakai stack, palet (dark
data-journalism: charcoal + amber/teal, Fraunces+Inter) yang berbeda dari
identitas situs (cream paper, Bodoni Moda+Karla) — jadi yang diadopsi adalah
**pola interaksinya**, bukan kode/visualnya secara utuh.

## Decision

1. **Astro islands adalah mekanisme resmi** untuk semua interaktivitas
   client-side. Default situs tetap SSG statis; JS hanya dihidrasi di
   komponen yang benar-benar interaktif.
2. **Dua tier interaktivitas:**
   - **Interaksi DOM sederhana** (mis. carousel drag T-24) →
     `<script>` **vanilla** di dalam komponen `.astro`, dengan
     *progressive enhancement* (CSS `scroll-snap` tetap berfungsi tanpa JS).
     Tidak menarik framework.
   - **Pengalaman interaktif kaya** (mis. scrollytelling T-25) →
     **React island** via `@astrojs/react`.
3. Bila sebuah island memerlukan framework, framework itu adalah **React**
   (bukan Preact/Vue/Svelte/Solid) — menyelaraskan dengan referensi Cikarang
   yang sudah React + `recharts` + `motion`, sehingga port bersifat mekanis.
4. **Hidrasi pakai direktif tersempit:** `client:visible` sebagai default,
   `client:load` hanya bila komponen interaktif di atas lipatan. Island
   **tidak pernah** ditaruh di layout global (`BaseLayout`, `Header`,
   `Footer`) — hanya di halaman/komponen daun yang membutuhkannya.
5. **Data mengalir ke island sebagai props saat build.** Island tidak
   melakukan fetch runtime — invarian "no backend" (ADR-001) tetap utuh;
   data scrollytelling tetap dari content collection / modul `.ts` statis.
6. Island menghormati `prefers-reduced-motion`.
7. ADR ini hanya **mengizinkan mekanismenya**. Detail render scrollytelling
   Research (pola route, re-skin ke token cream-paper vs. divergensi visual
   sengaja) diputuskan saat implementasi **T-25**.

## Rationale

- **Islands menjaga invarian ADR-001.** HTML statis tetap default; hanya
  route yang menghidrasi island membayar biaya JS. Zero-JS default (dan
  target Lighthouse di BRIEF) tetap berlaku untuk seluruh halaman lain.
- **Tier vanilla vs. React memisahkan biaya dari kebutuhan.** Carousel drag
  cukup dengan `scroll-snap` + segelintir baris pointer-handler — menarik
  framework untuk itu adalah pemborosan. Scrollytelling sebaliknya: transisi
  `motion`, chart `recharts`, dan orkestrasi `IntersectionObserver` akan
  mahal dan rapuh bila dirakit tangan, sementara referensi sudah ada dalam
  React.
- **React (bukan alternatif ringan) karena ekosistem referensi.** `recharts`
  dan `motion` native-React; port dari Cikarang jadi nyaris menyalin.
  Penghematan byte Preact/Svelte tak sepadan dengan biaya menulis ulang atau
  risiko friksi versi.
- **Reversibilitas tetap tinggi.** Island terisolasi per-komponen; menghapus
  atau mengganti satu island tidak menyentuh halaman statis lain.

## Alternatives considered

- **Vanilla-only (tanpa framework sama sekali).** Cukup untuk carousel —
  makanya diadopsi untuk tier itu — tapi untuk scrollytelling berarti
  merakit ulang transisi, chart, dan orkestrasi scroll dari nol. Ditolak
  untuk T-25: mahal, rapuh, dan membuang kode referensi yang sudah jadi.
- **Port Cikarang apa adanya sebagai app TanStack Start terpisah**
  (subdomain/subpath). Mempertahankan kode persis, tapi berarti dua stack
  untuk dirawat, dua identitas visual, dan kehilangan integrasi dengan
  content collection / tag / related posts situs ini. Ditolak.
- **Preact via `preact/compat` sebagai island lebih ringan.** Bundle lebih
  kecil, tapi `recharts`/`motion` berpotensi friksi kompatibilitas; hemat
  byte tak sepadan risikonya. Ditolak.
- **Svelte island.** Animasi kelas satu dan bundle kecil, tapi mengharuskan
  menulis ulang seluruh kode React Cikarang. Ditolak demi kecepatan port.

## Consequences

- (+) Membuka T-24 (carousel) dan T-25 (scrollytelling); pola island bisa
  dipakai ulang untuk interaktivitas berikutnya.
- (+) Seluruh halaman non-interaktif tetap SSG statis, zero-JS — hanya route
  interaktif yang menanggung biaya hidrasi.
- (+) Port scrollytelling dari referensi React bersifat mekanis, bukan tulis
  ulang.
- (−) React masuk ke dependency tree; bundle route scrollytelling jauh lebih
  besar dari halaman statis. Mitigasi wajib: direktif hidrasi tersempit +
  larangan island di layout global, agar JS tak bocor ke seluruh situs.
- (−) Dua paradigma render berdampingan (Astro statis + React island)
  menambah beban kognitif; gotcha (hidrasi, boundary props, SSR mismatch)
  dicatat di `docs/memory/LESSONS.md`.
- (−) `recharts` dan `motion` jadi dependensi pihak ketiga baru yang harus
  dipelihara dan di-update.
- Follow-up: T-25 memutuskan pola route scrollytelling dan arah visualnya
  (re-skin cream-paper vs. divergensi sengaja). Klausul islands di ADR-001
  **diperluas** oleh ADR ini, bukan disuperseksi.
