# Project State — knowledge-hub

<!-- SNAPSHOT file: overwrite it, do not append. Updated at every session close
     by /project-status, grounded in git log — not recall. -->

- Updated: 2026-08-04
- Milestone: **M1–M9 semuanya selesai.** M8 "Perbaikan visual & suara
  editorial" (T-66–T-69) dan M9 "3 artikel naratif baru" (T-70) keduanya
  dibuka dan ditutup di sesi yang sama. Tidak ada milestone aktif.

## Current status

Situs live di
[knowledge-hub-inky.vercel.app](https://knowledge-hub-inky.vercel.app), repo
[github.com/Luthfi-Forma/knowledge-hub](https://github.com/Luthfi-Forma/knowledge-hub)
(public) terhubung ke Vercel — tiap push ke `main` auto-deploy. **M8 (5
commit) sudah di-push**; **M9 (T-70) belum di-push** — situs live saat ini
menyajikan M8 (perbaikan cover/scrollytelling/collar/humanizer) tapi
belum menyajikan 3 artikel baru M9.

**M8** memperbaiki 3 masalah nyata yang dilaporkan pemilik situs
(cropping cover, scrollytelling timpang, teks terasa AI) plus 1 masalah
tambahan yang ditemukan saat verifikasi (collar mobile 305px→147px).
Detail lengkap di `docs/TASK.md` Done, entri T-66–T-69.

**M9** menambah 3 post `type: article` baru dari materi yang diserahkan
langsung oleh pemilik situs (vault Obsidian pribadi, bukan ditulis untuk
situs ini):
- "Data Spasial dan Pengambilan Keputusan dalam Perencanaan Wilayah"
  (`gis`+`urban-planning`)
- "Ketika Denial Presiden Berbuah Ancaman Krisis" (`economic-policy`,
  tag baru)
- "Paradoks Prioritas Transportasi Indonesia"
  (`transportation`+`urban-planning`)

Ketiganya **Bahasa Indonesia** — deviasi eksplisit dari `docs/RULES.md`
"konten publik English" dicatat di file yang sama atas keputusan user.
**Nol kalimat prosa milik user diedit** — hanya adaptasi struktural
minimal (level heading untuk TOC). Situs sekarang **14 post total**, 21
topik.

**Belum berubah dari sebelumnya**: identitas visual Atlas (9 token
warna, Archivo+IBM Plex Mono, radius nol, `Plate`, `LegendRail`, collar
2-baris, search Pagefind); lapisan editorial M7 (20 definisi topik,
11/11 post lama cross-link, 6 post `impact`); aksesibilitas (skip-link,
`aria-current`, ring fokus, kontrol ≥44px, tabel `sr-only`,
`useReducedMotion()`).

**Aksi tersisa untuk user (bukan kode):**
1. **Push T-70 (M9)** ke `origin/main` bila sudah puas — situs live
   belum menyajikan 3 artikel baru sampai di-push.
2. Aktifkan Web Analytics manual di dashboard Vercel (belum berubah sejak
   M3 — toggle akun, tidak bisa disentuh dari kode).
3. T-36 (baseline Lighthouse resmi) — jalankan PageSpeed Insights dari
   browser asli, atau berikan API key PSI. Lihat "Blockers" di bawah.
4. DEBT #3 (3 foto Tanggamus 15–20MB per berkas) — task tersendiri,
   tidak mendesak.

## Sesi ini (M8 T-66–T-69 + M9 T-70, 2026-08-04)

Sesi panjang: dibuka lampiran `Masukan untuk Knowledge Hub.md` (4 poin
keluhan visual/teks) → M8 (T-67→T-68→T-66→T-69, diukur dulu lewat
`astro preview` sebelum menulis rencana, bukan ditebak dari kode) → push
5 commit M8 atas persetujuan user → M9 dibuka langsung dengan 3 artikel
jadi yang diserahkan user.

**M9 (T-70)** — poin penting: keputusan bahasa (Indonesia vs terjemahan)
ditanyakan eksplisit ke user sebelum menulis (risiko salah nuansa
menerjemahkan esai berkutipan tokoh publik). **Bug ditemukan &
diperbaiki sendiri sebelum commit**: draf pertama 2 dari 3 file secara
tidak sengaja mengganti sebagian dash prosa milik user jadi koma/titik —
refleks dari kerja T-69 (humanizer, aturannya berlawanan) yang baru saja
selesai di sesi yang sama. Ditemukan lewat perbandingan hitungan dash
`grep` terhadap sumber asli, bukan dari baca ulang biasa (kalimat hasil
edit tetap terbaca alami). Dicatat sebagai lesson baru
(`docs/memory/LESSONS.md`) karena polanya generalizable: kebijakan
editing dari task sebelumnya bisa "bocor" ke task berikutnya kalau
kontennya mirip tapi aturannya berlawanan.

4 commit lokal M8 sudah di-push. M9 (T-70) 1 commit lokal, **belum
di-push**. Build hijau di tiap task, nol console error, nol overflow
horizontal di 375/768/1280px di semua halaman yang diuji.

## Last session (M7 T-63–T-65, 2026-08-02)

3 commit menutup M7 total (dibuka dan ditutup di sesi yang sama): T-63
(20 definisi topik), T-64 (cross-link inline 11/11 post), T-65 (6 blok
`impact`). Detail penuh di `docs/TASK.md` Done.

## Next steps

1. **Tidak ada task aktif.** Tunggu arahan user untuk milestone/task
   berikutnya, atau item Backlog di bawah.
2. User memutuskan kapan push commit M9 (T-70) ke `origin/main`.
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
