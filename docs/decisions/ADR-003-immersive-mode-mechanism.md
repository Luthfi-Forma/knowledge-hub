# ADR-003: Mekanisme dual-mode (Reading/Immersive) via token remap, bukan island atau route kedua

Status: Accepted
Date: 2026-07-28

<!-- Status lifecycle: Proposed → Accepted → (Superseded by ADR-NNN).
     Never edit an Accepted ADR's Decision section — supersede it.
     Process: C:\Users\Luthfi\Documents\Claude Code\Claude Engineering OS\standards\architecture\adr-process.md -->

## Context

M5 ("DATUM") menambahkan identitas visual kedua — **Immersive Mode** — di
samping identitas krem yang sudah ada ("Reading Mode"), dipilih pengguna
lewat toggle persisten. Ini butuh keputusan arsitektural sebelum kode
ditulis, karena bertabrakan langsung dengan klausa 4 ADR-002: *"Island
TIDAK PERNAH ditaruh di layout global (BaseLayout, Header, Footer)."* Toggle
mode secara alami hidup di `Header.astro`, bagian dari layout global.

Brainstorming multi-agent (lihat plan file M5 dan `docs/memory/STATE.md`)
sudah mengumpulkan bukti konkret yang menyelesaikan pertanyaan ini:

- `<Analytics />` dari `@vercel/analytics/astro` sudah mengirim JS di setiap
  halaman dari `BaseLayout.astro` sejak M3 — klausa 4 pada praktiknya bukan
  larangan byte mutlak.
- ADR-002 klausa 2 sudah menyebut vanilla `<script>` di dalam komponen
  `.astro` (termasuk yang dirender di layout global) sebagai tier resmi
  ("Tier 1"), dengan progressive enhancement.
- ADR-002 Consequences menyatakan alasan sebenarnya klausa 4:
  *"Mitigasi wajib: direktif hidrasi tersempit + larangan island di layout
  global, agar JS tak bocor ke seluruh situs."* — subjeknya adalah **island**
  (hidrasi framework React), bukan setiap baris JavaScript.
- `jabodetabek-connect.mdx` mencatat proyek Afreza sendiri sudah memakai
  pola persis ini: *"Light/dark theme, manually switchable and persisted,
  with a pre-hydration script so there's no flash of the wrong theme on
  load."*
- Token remap sudah terverifikasi murah: **0 hex literal, 72
  `var(--color-*)`** di 4 modul scrollytelling + island, dan 26 file
  `.astro` memakai utility token warna. Me-remap 8 custom property yang
  sudah ada membawa seluruh situs berganti identitas tanpa satu pun edit
  React.

Dua alternatif mekanisme sempat dipertimbangkan serius dan ditolak — lihat
"Alternatives considered".

## Decision

1. **Tier-0: CSS/HTML platform feature tanpa island.** Fitur yang bisa
   dicapai murni dengan CSS/HTML modern (cross-document View Transitions
   via `@view-transition { navigation: auto }`, `scroll-driven animation`,
   `:has()`, dll.) adalah default dan **tidak** butuh island maupun anggaran
   byte — ini bukan pengecualian terhadap ADR-002, melainkan kategori di
   bawah Tier 1 vanilla yang ADR-002 sendiri belum eksplisit menamainya.
2. **Klausa 4 ADR-002 diperjelas, bukan dibatalkan:** yang dilarang di
   layout global adalah **hidrasi island Tier-2 (framework React)**.
   **Satu** script vanilla Tier-1 boleh hidup di `BaseLayout`/`Header` untuk
   mekanisme mode — dengan anggaran **≤ 2 KB gzip kode first-party**,
   `is:inline`, tanpa `client:*` directive, tanpa import framework apa pun.
   Larangan hidrasi framework di layout global **tetap berlaku penuh**.
3. **Dual-mode adalah preferensi tersimpan client, bukan field frontmatter
   dan bukan pohon route kedua.** Mekanisme:
   - Token warna + tipografi Immersive dideklarasikan di
     `src/styles/global.css` di bawah selector `:root[data-mode="immersive"]`,
     **di dalam `@layer base`** (alasan sama dengan reset heading yang sudah
     ada: CSS tanpa layer mengalahkan `@layer utilities` — di luar layer,
     remap ini akan mematikan setiap utility Tailwind di halaman).
   - Preferensi disimpan `localStorage`, dibaca oleh script `is:inline`
     **pra-paint** di `<head>` yang menstempel `data-mode` pada `<html>`
     sebelum first paint — nol *flash of wrong mode*, meniru pola yang
     sudah dipakai proyek Afreza sendiri (lihat Context).
   - Toggle adalah `<button>` biasa di `Header.astro`, didengarkan oleh
     script Tier-1 yang sama.
   - Ini **sengaja berbeda** dari pola `presentation: "scrollytelling"`
     ADR-002 (field frontmatter, diputuskan penulis saat build) — dual-mode
     adalah preferensi **pembaca**, diputuskan saat runtime, bukan properti
     konten per-post.
4. Immersive Mode **tidak** memicu fetch runtime apa pun — invarian "no
   backend" ADR-001 tetap utuh. Satu-satunya sumber data yang berubah adalah
   nilai token CSS.
5. Island React yang sudah ada (scrollytelling) **tidak diubah** — remap
   token otomatis menjangkaunya lewat `var(--color-*)`, tanpa perlu island
   itu sendiri sadar akan mode.

## Rationale

- **Byte-ban ketat akan memblokir toggle mode sama sekali** — tombol
  persisten butuh hidup di Header, dan Header adalah layout global.
  Interpretasi "larangan hidrasi framework" konsisten dengan bukti yang
  sudah ada di codebase (`<Analytics />`) dan dengan teks Rationale ADR-002
  sendiri, tanpa membuka pintu bagi React di BaseLayout.
- **Token remap, bukan island atau route kedua, adalah mekanisme paling
  murah untuk dibalik.** Menghapus satu blok CSS mengembalikan situs ke
  Reading Mode sepenuhnya; tidak ada duplikasi halaman untuk dirawat, tidak
  ada dua kali build, tidak ada dua kali indeks Pagefind.
- **"Preferensi pembaca via localStorage" konsisten dengan pola yang sudah
  terbukti** di proyek lain milik Afreza sendiri — bukan pola baru yang
  butuh dipelajari.

## Alternatives considered

- **Dua pohon route** (`/` Reading + `/immersive/*` sebagai duplikat).
  Zero-JS murni untuk switching (link biasa), tapi berarti setiap halaman
  dibangun dua kali selamanya, indeks Pagefind dobel, dan endpoint OG dobel.
  Ditolak: pajak pemeliharaan permanen untuk solo dev, dan bertentangan
  dengan keputusan pemilik bahwa cakupan Immersive akan diputuskan
  per-halaman (T-40/T-43), bukan situs-duplikat.
- **Immersive sebagai field frontmatter** (seperti `presentation:
  "scrollytelling"`). Konsisten dengan pola ADR-002 yang sudah ada, tapi
  salah secara konsep — dual-mode adalah pilihan **tampilan**, bukan sifat
  **konten**; setiap post harus bisa dilihat di kedua mode.
- **React island untuk toggle** (state di React, dihidrasi `client:load` di
  Header). Ditolak langsung oleh klausa 4 ADR-002 yang tetap berlaku penuh
  di keputusan #2 — dan tidak perlu: `localStorage` + `data-mode` + CSS
  murni mencapai hasil yang sama tanpa membawa React ke setiap halaman.

## Consequences

- (+) Toggle mode legal tanpa melanggar ADR-002; klausa 4 makin presisi
  untuk keputusan berikutnya.
- (+) Membalik keputusan (batalkan Immersive) semurah menghapus satu blok
  CSS + satu script — tidak ada halaman duplikat untuk dibongkar.
- (+) Island scrollytelling yang sudah ada otomatis kompatibel, nol
  perubahan React.
- (−) Anggaran "≤ 2 KB gzip" untuk `ModeController` adalah batas yang harus
  dijaga manual — tidak ada budget script otomatis di CI (lihat
  `docs/TESTING.md` "Known gaps"); pelanggaran hanya terlihat lewat review
  manual.
- (−) `data-mode` di `<html>` berarti **setiap** style baru yang ditambahkan
  ke situs (bukan hanya token M5) berpotensi butuh dipertimbangkan di dua
  mode ke depannya — beban kognitif tambahan permanen, bukan sekali jalan.
- Follow-up: T-38 mengisi blok remap token; T-39 menulis `ModeController`;
  cakupan halaman Immersive (T-40/T-43) dan tipografi asli (T-41) diputuskan
  terpisah.
