# Project State — knowledge-hub

<!-- SNAPSHOT file: overwrite it, do not append. Updated at every session close
     by /project-status, grounded in git log — not recall. -->

- Updated: 2026-07-30
- Milestone: **M1–M7 semuanya selesai.** M6 "Atlas" (S1–S5, T-45–T-62) dan
  M7 lapisan editorial (T-63–T-65) keduanya tutup dan sudah di-push. Tidak
  ada milestone aktif — lihat "Next steps" untuk backlog tersisa (bukan
  milestone baru).

## Current status

Situs live di
[knowledge-hub-inky.vercel.app](https://knowledge-hub-inky.vercel.app), repo
[github.com/Luthfi-Forma/knowledge-hub](https://github.com/Luthfi-Forma/knowledge-hub)
(public) terhubung ke Vercel — tiap push ke `main` auto-deploy. **Semua
sudah di-push**, situs live menyajikan Atlas + lapisan editorial penuh.

Situs sekarang punya **satu identitas visual, "Atlas"** — dual-mode
Reading/Immersive (M5) sudah dibongkar total (ADR-004). 9 token warna
berperan ketat, tipografi Archivo (self-hosted, sumbu `wdth`) + IBM Plex
Mono untuk notasi, radius nol di seluruh sistem, satu wadah konten `Plate`
(3 ukuran), rail legenda 224px permanen (`LegendRail`+`TopicChip`) yang
jadi drawer di <1024px, collar 2-baris, dan search sungguhan (dialog
Pagefind, token Atlas, buka lewat tombol/`/`, tutup `Esc`).

**Lapisan editorial (M7) sekarang terisi penuh** — struktur M6 tidak lagi
kosong:
- **20/20 topik** punya definisi 1-kalimat di `/topics/[topic]` (17 dari
  pemilik situs, 5 fakta teknologi objektif ditulis langsung).
- **11/11 post** punya cross-link inline di body-nya sendiri (mulai dari
  nol) — 8 post mencapai ≥3 tautan lewat kandidat shared-tag berperingkat;
  4 post (`jabodetabek-connect` + 3 foto Tanggamus) sengaja di 2 tautan
  karena kandidat nyata memang cuma segitu, bukan dipaksakan.
- **6 post** punya stamp `impact` (Stations/Lines, Projects mapped,
  Nodes, Sub-districts, Cultural space mapped, Characteristic indicators)
  — tiap angka dikutip dari konten post yang sudah terbit, bukan dikarang.
  5 post lain (Cikarang, Building knowledge-hub, 3 foto) sengaja tanpa
  `impact` — field itu memang tidak cocok untuk kontennya.

IA final: **Index** (`/`, Sheet Index) · **Topics** (`/topics` +
`/topics/[topic]`, semuanya terisi) · **Projects** (`/projects/[name]`) ·
**About** (`/about`, Dossier). `/posts/[slug]` tidak berubah URL-nya.
`vercel.json` menangani 3 redirect 308, sudah berlaku di produksi.

Aksesibilitas: skip-link, `aria-current="page"`, ring fokus
`2px solid var(--color-research)`, kontrol+chip ≥44px, 15 chart Recharts
dengan tabel data `sr-only`, `useReducedMotion()` di 28 fungsi `Viz*`.

**Sengaja mati** (dicatat ADR-004): registration seam (M5/T-42), carousel
drag Featured Projects (M4/T-24), toggle mode.

**Aksi tersisa untuk user (bukan kode):**
1. Aktifkan Web Analytics manual di dashboard Vercel (belum berubah sejak
   M3 — toggle akun, tidak bisa disentuh dari kode).
2. T-36 (baseline Lighthouse resmi) — jalankan PageSpeed Insights dari
   browser asli, atau berikan API key PSI. Lihat "Blockers" di bawah.
3. Verifikasi pasca-deploy: redirect 308 + 20 halaman topik baru di domain
   live sungguhan (belum pernah diuji nyata, cuma lokal sebelum push).
4. **Arahan berikutnya** — M6/M7 keduanya tutup; tidak ada task aktif.
   Beri tahu milestone/task baru, atau item Backlog (T-36/T-20/T-21) yang
   ingin dikerjakan.

## Sesi ini (M6 push + M7 T-63/T-64/T-65, 2026-07-30)

Sesi panjang menutup M6 sepenuhnya lalu langsung membuka dan menutup M7:

1. **Push M6** — `git push origin main`, 19 commit, `1fd6cd2..d39c524`.
2. **Worksheet Artifact** disiapkan untuk M7 — menghitung post-count per
   topik, kandidat cross-link berperingkat shared-tag (skema sama dengan
   `getRelatedPosts()`), dan 6 kandidat `impact` yang dikonfirmasi cocok
   dengan konten post yang sudah terbit. Font asli situs (Archivo + IBM
   Plex Mono) di-embed base64 supaya worksheet terasa seperti bagian dari
   sistem Atlas, bukan dokumen generik.
3. **T-63** — user menyerahkan 17/20 definisi topik (Bahasa Indonesia)
   merespons worksheet; diterjemahkan ke English (konten publik, per
   `docs/RULES.md`); 5 sisanya (istilah teknologi objektif) ditulis
   langsung. Push: `d39c524..37b8d6c`.
4. **T-64** — `ScrollytellingSection.body` diubah `string`→`ReactNode`
   supaya 4 modul scrollytelling bisa membawa tautan JSX, bukan cuma 7
   post MDX biasa. Semua 11 post dapat cross-link inline (8 mencapai ≥3,
   4 sengaja di 2 — kandidat nyata memang cuma segitu, tidak dipaksakan).
   Beberapa tautan resiprokal dengan paralel metodologis nyata (mis. "19
   indikator" muncul persis di Bontang DAN Jabung; kernel-density di
   Cikarang DAN Bontang).
5. **T-65** — 6 blok `impact` frontmatter, tiap angka dikutip dari konten
   post sendiri (Jabodetabek-Connect summary, CDMP body heading, Jakarta
   Transit Heritage Explorer body, data modul scrollytelling Jabung/RPPLH/
   Bontang).
6. **STATE.md fixup kecil** (`5b26d3b`) — koreksi status push sebelum T-63
   sempat di-commit.

Diverifikasi lewat `astro preview` sungguhan di tiap langkah + teknik
`client:load`/`useState(ids[N])` sementara untuk modul scrollytelling
(`docs/memory/LESSONS.md`, `IntersectionObserver` tidak fire di tooling
sesi ini) — `git diff` dikonfirmasi bersih sebelum tiap rebuild final.
`npm run build` hijau di setiap task, 44 halaman. Nol console error di
semua halaman yang diuji.

## Last session (M6 Atlas — S4+S5 penutup, T-59–T-62, 2026-07-29/30)

4 commit (T-59, T-60, T-61 kode; T-62 dokumentasi), menutup M6 total.
Detail penuh di `docs/TASK.md` Done. Ringkasan: `useReducedMotion()` +
tabel data `sr-only` di 4 modul scrollytelling (T-59); dialog search
Pagefind token Atlas (T-60, menutup DEBT #1); OG image ikut Atlas (T-61);
14 item verification checklist + remeasurement + 6 dokumen diperbarui
(T-62). 2 lesson baru — `window.innerWidth` tidak bisa dipercaya di
tooling ini saat elemen `position:fixed` ada di DOM, dan spesifisitas
`html:root` vs `:root` untuk widget pihak ketiga lazy-loaded.

## Next steps

1. **Tidak ada task aktif** — M6 dan M7 keduanya tutup. Tunggu arahan user
   untuk milestone/task berikutnya (M8 belum ada di ROADMAP).
2. Verifikasi pasca-deploy: cek redirect 308 + halaman topik baru di
   domain live sungguhan.
3. T-36 (baseline Lighthouse resmi) masih di Backlog — perlu user
   menjalankan PageSpeed Insights dari browser asli, atau memberi API key.
4. T-20/T-21 (custom domain, arsip repo lama) masih di Backlog.

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
