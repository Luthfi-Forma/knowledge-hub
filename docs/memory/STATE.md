# Project State — knowledge-hub

<!-- SNAPSHOT file: overwrite it, do not append. Updated at every session close
     by /project-status, grounded in git log — not recall. -->

- Updated: 2026-07-30
- Milestone: M1–M6 selesai (satu pengecualian tercatat: T-36 baseline
  Lighthouse, lihat "Blockers" di bawah). **M6 "Atlas" tutup total dan
  sudah di-push** (S1–S5, T-45–T-62). **M7 dimulai** — T-63 selesai;
  T-64/T-65 masih menunggu input pemilik situs.

## Current status

Situs live di
[knowledge-hub-inky.vercel.app](https://knowledge-hub-inky.vercel.app), repo
[github.com/Luthfi-Forma/knowledge-hub](https://github.com/Luthfi-Forma/knowledge-hub)
(public) terhubung ke Vercel — tiap push ke `main` auto-deploy. **M6 sudah
di-push** (19 commit, `1fd6cd2..d39c524`) — situs live sekarang menyajikan
Atlas, bukan lagi M5. T-63 (di bawah) masih di working tree lokal, belum
di-push.

Situs sekarang punya **satu identitas visual, "Atlas"** — dual-mode
Reading/Immersive (M5) sudah dibongkar total (ADR-004). 9 token warna
berperan ketat (`--color-research`/`--color-project`/`--color-flag`
menggantikan satu `--color-accent` serba-guna), tipografi Archivo (self-
hosted, sumbu `wdth`) + IBM Plex Mono untuk notasi, radius nol di seluruh
sistem, satu wadah konten `Plate` (3 ukuran) menggantikan PostCard+
PostListItem, rail legenda 224px permanen (`LegendRail`+`TopicChip`) yang
jadi drawer di <1024px, collar 2-baris (nav 4 item + breadcrumb notasi) di
setiap halaman, dan search sungguhan (dialog Pagefind, token Atlas, buka
lewat tombol/`/`, tutup `Esc`).

IA final: **Index** (`/`, Sheet Index — 1 lead plate + grid standard, filter
tipe via `/explore/[type]` yang memakai ulang komposisi yang sama) ·
**Topics** (`/topics` + `/topics/[topic]`, menggantikan `/tags`, topik
bertetangga dihitung dari co-occurrence tag, **20/20 topik sekarang punya
definisi** — T-63) · **Projects** (`/projects/[name]`, repo/demo sebagai
kontrol) · **About** (`/about`, satu komposisi Dossier dengan kontak
dipromosikan ke kartu fakta). Photography turun jadi sekunder (dijangkau
dari Footer). `/posts/[slug]` **tidak berubah URL-nya** — rail marginalia
baru (stamp, project, topics, related plates) di sampingnya. 404 dapat mini
type-legend. `vercel.json` menangani 3 redirect 308 (`/explore→/`,
`/tags→/topics`, `/tags/:tag→/topics/:tag`) — **sekarang berlaku di
produksi** (M6 sudah di-push), belum diverifikasi lewat request sungguhan
ke domain live pasca-push.

Aksesibilitas: skip-link ke `#main` (WCAG 2.4.1), `aria-current="page"` di
nav, ring fokus `2px solid var(--color-research)` di semua kontrol, semua
kontrol+chip ≥44px (termasuk `TopicChip`'s target sentuh via `::after`
tak-terlihat), 15 chart Recharts dapat tabel data `sr-only` (WCAG 1.1.1),
`useReducedMotion()` dipanggil di 28 fungsi `Viz*` lintas 4 modul
scrollytelling (bukan cuma shell-nya).

OG image (`lib/og-image.ts`) ikut Atlas — palet + Archivo/IBM Plex Mono,
Bodoni Moda/Karla dilepas total dari repo (fungsional maupun font file).

**Sengaja mati** (bukan regresi — dicatat ADR-004): registration seam
(M5/T-42), carousel drag Featured Projects (M4/T-24), toggle mode.

**Aksi tersisa untuk user (bukan kode):**
1. Aktifkan Web Analytics manual di dashboard Vercel (belum berubah sejak
   M3 — toggle akun, tidak bisa disentuh dari kode).
2. T-36 (baseline Lighthouse resmi) — jalankan PageSpeed Insights dari
   browser asli (bukan sesi ini), atau berikan API key PSI. Lihat
   "Blockers" di bawah.
3. **M7 T-64/T-65**: cross-link inline per post, angka `impact` sebagian
   post — cuma bisa ditulis pemilik situs. T-63 (definisi topik) sudah
   selesai sesi ini (17/20 dari user, 5 ditulis langsung — lihat di bawah).

## Sesi ini (M6 push + M7 T-63, 2026-07-30)

Dua hal di luar S1–S5 yang sudah tercatat sebelumnya (lihat "Last session"):
**push M6 ke `main` remote** (19 commit, diminta eksplisit user) dan
**T-63** (M7, definisi topik).

**Push**: `git push origin main` sukses, `1fd6cd2..d39c524`. Situs live
Vercel sekarang men-deploy Atlas — belum diverifikasi ulang pasca-deploy
di domain live (redirect 308 khususnya, yang cuma bisa diuji nyata setelah
push, bukan `astro preview` lokal).

**T-63** (`src/content/topics/*.md`, 20 file baru): user menyerahkan
definisi untuk 17/20 topik lewat file lokal (Bahasa Indonesia), merespons
worksheet Artifact yang disiapkan sesi ini (mengelompokkan topik-per-post,
kandidat cross-link berperingkat shared-tag, dan 6 angka `impact` yang
sudah dikonfirmasi dari konten post yang sudah terbit). 17 definisi
**diterjemahkan ke English** (dekat dengan aslinya, bukan ditulis ulang
bebas) — topik adalah konten publik, `docs/RULES.md` mewajibkan English di
sana. 5 sisanya (`maplibre`, `python`, `coastal-planning`, `d3`, `mdx`)
tidak disuplai user secara berarti — ditulis langsung karena kelimanya
fakta objektif tentang teknologi publik, bukan konten personal, mengikuti
pola faktual-singkat yang user sendiri pakai di 17 lainnya. `.gitkeep` di
direktori topik dihapus (sudah tidak perlu). Diverifikasi lewat `astro
preview` sungguhan: `/topics/gis` merender definisi persis + notasi
"6 plates · 2 project · 4 research" tetap benar, nol console error.
`npm run build` hijau, 44 halaman, Pagefind 2126→2172 kata (definisi baru
terindeks, sesuai ekspektasi).

**Belum di-push** — T-63 masih di working tree lokal (belum commit saat
snapshot ini ditulis; lihat commit terbaru untuk status pasti).

## Last session (M6 Atlas — S4+S5 penutup, T-59–T-62, 2026-07-29/30)

4 commit (T-59, T-60, T-61 kode; T-62 dokumentasi), menutup M6 total.
Detail penuh tiap task ada di `docs/TASK.md` Done — ringkasan:

- **T-59**: `useReducedMotion()` di 28 fungsi `Viz*` lintas 4 modul
  scrollytelling (motion.div/circle via ternary duration, Recharts via
  `isAnimationActive`, `AnimatedNumber` rAF kustom). 15 tabel data
  `sr-only` untuk tiap chart Recharts. Bug dorman ditemukan di
  `AnimatedNumber` Cikarang (`useState(value)` bukan `useState(0)`),
  sengaja tidak diperbaiki (di luar scope).
- **T-60**: dialog search sungguhan di `Header.astro` (buka tombol/`/`,
  tutup `Esc`/backdrop/close), Pagefind direstyle ke token Atlas — menutup
  DEBT #1. Bug ditemukan & diperbaiki: override `--pagefind-ui-*` perlu
  `html:root` bukan `:root` polos (dasi spesifisitas, stylesheet Pagefind
  dimuat belakangan).
- **T-61**: OG image pindah ke palet+font Atlas; 4 TTF baru dari
  fontsource.org, 3 TTF Bodoni/Karla lama dihapus.
- **T-62**: 14 item verification checklist handoff semua lolos;
  remeasurement transfer 4 rute; 6 dokumen diperbarui (ROADMAP, CHANGELOG,
  DEBT, LESSONS ×2 entri baru, RULES — durasi motion 120/200/300ms).

2 lesson baru (`docs/memory/LESSONS.md`, 2026-07-30): (1)
`window.innerWidth`/`getBoundingClientRect()` juga tidak bisa dipercaya di
tooling Browser-pane ini saat elemen `position:fixed` ada di DOM —
`document.documentElement.clientWidth` yang benar. (2) Menimpa custom
property `:root` widget pihak ketiga yang stylesheet-nya dimuat belakangan
butuh `html:root`, bukan cuma urutan file sumber.

## Next steps

1. **Commit T-63** jika belum (lihat git log terbaru untuk status pasti).
2. **M7 T-64/T-65** — cross-link inline per post, angka `impact` sebagian
   post. Keduanya butuh input pemilik situs; worksheet Artifact sesi ini
   sudah menyiapkan kandidat link (berperingkat shared-tag) dan 6 kandidat
   `impact` terkonfirmasi — tinggal keputusan final user.
3. Verifikasi pasca-deploy: cek 3 redirect 308 `vercel.json` di domain
   live sungguhan (belum pernah diuji nyata, cuma statis sebelum push).
4. T-36 (baseline Lighthouse resmi) masih di Backlog — perlu user
   menjalankan PageSpeed Insights dari browser asli, atau memberi API key.
5. T-20/T-21 (custom domain, arsip repo lama) masih di Backlog.

## Blockers

**T-36 (baseline Lighthouse resmi)** — dicoba 2x di sesi berbeda (2026-07-28
dan 2026-07-29) lewat 3 jalur (PSI web UI, PSI API via WebFetch, PSI API
via `curl`): UI macet di polling, API konsisten 429 (keyless quota) di
kedua percobaan. Bukan sesuatu yang bisa diperbaiki dari sisi kode — perlu
user menjalankan PageSpeed Insights dari browser sungguhan, atau memberi
API key PSI. Data pengganti (berat transfer produksi nyata) ada di
`docs/TESTING.md`.

## Open questions

None — lihat "Open questions" di docs/ARCHITECTURE.md untuk yang
arsitektural.
