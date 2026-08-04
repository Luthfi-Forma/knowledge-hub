# Project State — knowledge-hub

<!-- SNAPSHOT file: overwrite it, do not append. Updated at every session close
     by /project-status, grounded in git log — not recall. -->

- Updated: 2026-08-04
- Milestone: **M1–M8 semuanya selesai.** M8 "Perbaikan visual & suara
  editorial" (T-66–T-69) dibuka dan ditutup dalam satu sesi, dipicu
  langsung oleh pemilik situs membuka situs live sendiri. Tidak ada
  milestone aktif — M9 (3 artikel naratif baru) menunggu materi dari
  pemilik situs (lihat "Next steps").

## Current status

Situs live di
[knowledge-hub-inky.vercel.app](https://knowledge-hub-inky.vercel.app), repo
[github.com/Luthfi-Forma/knowledge-hub](https://github.com/Luthfi-Forma/knowledge-hub)
(public) terhubung ke Vercel. **4 commit M8 belum di-push** — `main` lokal
4 commit di depan `origin/main` (keputusan push tetap menunggu user,
konsisten dengan pola sesi-sesi sebelumnya). Situs live saat ini masih
menyajikan build M7 (Atlas + lapisan editorial), belum menyajikan
perbaikan M8.

**M8 dipicu masukan konkret** (`Masukan untuk Knowledge Hub.md` dari
pemilik situs, 2026-08-04) — 3 dari 4 masalah yang dilaporkan terbukti
nyata lewat pengukuran `astro preview` sungguhan, dan verifikasi
menemukan 1 masalah tambahan yang belum pernah dilaporkan:

- **T-67 — scrollytelling timpang, dua akar berbeda**: desktop, grid
  `680px 1fr` T-57 tidak sengaja ikut membungkus post scrollytelling,
  menyempitkan kolom teks internalnya ke ~316px (~38 karakter/baris);
  diperbaiki dengan `post-body-wide` yang melepas post scrollytelling ke
  lebar penuh `--container-shell` + rail pindah ke bawah island + kolom
  internal jadi 5/7 (bukan 6/6). Mobile: dock viz 38vh menutupi teks
  section karena `min-height` section dihitung terhadap viewport penuh,
  bukan area baca tersisa; diperbaiki dengan menurunkan dock ke 28vh
  (memberi margin 2vh, bukan pas-pasan).
- **T-68 — collar mobile 305px → 147px**: ditemukan saat verifikasi T-67,
  bukan dilaporkan user. Padding horizontal 48px/8px tanpa syarat di
  semua viewport; restrukturisasi markup (wordmark/nav/search jadi 3
  saudara langsung, bukan nav+search bersarang dalam satu wrapper) + flex
  `order` di `<640px` supaya nav tetap 4 link penuh (bukan hamburger).
- **T-66 — cropping cover**: akar masalah `.plate-cover { height: 100% }`
  membuat tinggi cover ikut panjang teks tetangganya, bukan rasio
  gambarnya — diganti `aspect-ratio: 16/10`, di-scope ke `≥480px` saja
  (perilaku `<480px` sudah benar sejak T-55, sengaja tidak disentuh). Dua
  bug tersembunyi ditemukan lewat pengujian (bukan kelihatan dari kode):
  urutan CSS source membuat override media query kalah dari aturan dasar;
  grid item `min-height: auto` bawaan membuat kotak tetap mengembang
  untuk gambar lebih tinggi dari 16:10. 3 cover project di-regenerate
  (dua masih pakai tanah krem Reading Mode M5, satu masih tanah gelap
  Immersive Mode M5 — keduanya sudah mati sejak ADR-004) lewat
  `scripts/generate-cover.mjs` baru (di-commit permanen, beda dari
  generator T-33 M5 yang dibuang sekali pakai) + SOP baru
  `docs/design/COVER_ART.md`.
- **T-69 — pass humanizer, menutup M8**: kosakata AI generik (testament,
  vibrant, tapestry, dst.) nol match di seluruh prosa — situs sudah
  spesifik dan bervariasi. Satu-satunya pola bervolume nyata: em/en dash
  penghubung narasi (0–41 per file), diganti titik/koma/titik-dua/kurung.
  `building-knowledge-hub.mdx` ditulis ulang sungguhan (bukan cuma
  dihaluskan — isi lama teks benih) dari fakta `PROJECT_BRIEF.md` +
  riwayat milestone nyata. Cross-link M7 (T-64) dikonfirmasi selamat
  100% lewat hitung ulang.

**Belum berubah dari sebelumnya** (masih berlaku): identitas visual
Atlas (9 token warna, Archivo+IBM Plex Mono, radius nol, `Plate`,
`LegendRail`, collar 2-baris, search Pagefind); lapisan editorial M7 (20
definisi topik, 11/11 post cross-link, 6 post `impact`); IA final Index/
Topics/Projects/About; aksesibilitas (skip-link, `aria-current`, ring
fokus, kontrol ≥44px, tabel `sr-only`, `useReducedMotion()`).

**Aksi tersisa untuk user (bukan kode):**
1. **Push 4 commit M8** ke `origin/main` bila sudah puas dengan hasilnya
   (situs live belum menyajikan perbaikan M8 sampai di-push).
2. Materi untuk M9 (3 artikel naratif baru) — lihat "Next steps".
3. Aktifkan Web Analytics manual di dashboard Vercel (belum berubah sejak
   M3 — toggle akun, tidak bisa disentuh dari kode).
4. T-36 (baseline Lighthouse resmi) — jalankan PageSpeed Insights dari
   browser asli, atau berikan API key PSI. Lihat "Blockers" di bawah.

## Sesi ini (M8 — T-66–T-69, 2026-08-04)

Dibuka lewat lampiran `Masukan untuk Knowledge Hub.md` pemilik situs (4
poin: cropping cover, scrollytelling timpang, teks terasa AI, 3 artikel
baru). Poin ke-4 sengaja dipisah jadi M9 (butuh materi user). Sebelum
menulis rencana, tiap keluhan diukur langsung lewat `astro preview` +
`getBoundingClientRect`/`getComputedStyle` di 375/768/1280px — bukan
ditebak dari kode. Urutan eksekusi: T-67 (paling terisolasi) → T-68
(ditemukan saat verifikasi T-67) → T-66 (SOP + generator + regenerate +
fix) → T-69 (humanizer, terakhir supaya diverifikasi di layout final).

4 commit lokal (`0b2b385`, `bff1c2b`, `b4529f9`, `fac39d3`), **belum
di-push**. Tiap task diverifikasi lewat `astro preview` sungguhan di
ketiga viewport, nol console error, `npm run build` hijau tiap kali (44
halaman). DEBT #3 baru dicatat (di luar scope M8): 3 foto Tanggamus
15–20MB per berkas ditemukan saat pengukuran cover, melanggar batas berat
berkas SOP `COVER_ART.md`.

## Last session (M7 T-63–T-65, 2026-08-02)

3 commit menutup M7 total (dibuka dan ditutup di sesi yang sama): T-63
(20 definisi topik), T-64 (cross-link inline 11/11 post), T-65 (6 blok
`impact`). Detail penuh di `docs/TASK.md` Done.

## Next steps

1. **M9 — 3 artikel naratif baru.** Butuh materi dari pemilik situs
   dulu — apa isinya, dan (karena murni narasi tanpa data, tidak bisa
   pakai format scrollytelling yang dibatasi `type: research` lewat
   `.refine()` di `content.config.ts`) mungkin butuh format editorial
   baru. Skill `emil-design-eng` relevan untuk merancang format itu.
2. User memutuskan kapan push 4 commit M8 ke `origin/main`.
3. T-36 (baseline Lighthouse resmi) masih di Backlog — perlu user
   menjalankan PageSpeed Insights dari browser asli, atau memberi API key.
4. DEBT #3 (3 foto Tanggamus 15–20MB) — task tersendiri, tidak mendesak.
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
