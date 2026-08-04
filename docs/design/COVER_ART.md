# SOP — Cover art

- Dibuat: 2026-08-04 (M8/T-66)

Aturan untuk membuat/meregenerasi cover post `type: project` (dan, kalau
suatu saat diputuskan, `type: research`). Naik dari konvensi T-33 (M5) yang
tadinya cuma dipakai sekali lalu skripnya dibuang — sekarang ditulis
sebagai aturan tetap karena masalah yang sama (palet mati, rasio salah)
terbukti bisa terulang begitu identitas visual situs berganti (M5 →
Atlas/M6) tanpa cover-nya ikut diperbarui.

## Kenapa dokumen ini ada

M8/T-66 menemukan dua masalah nyata di 3 cover project yang sudah ada:

1. **Palet mati.** Dua cover (`jabodetabek-connect`,
   `jakarta-transit-heritage-explorer`) masih memakai tanah krem
   `#f5efe1` dari Reading Mode (M3–M5, sudah dibongkar di M6/ADR-004);
   satu (`cdmp-jabodetabek`) memakai tanah nyaris-hitam `#18140f` dari
   Immersive Mode (M5, juga sudah dibongkar). Situs sudah pindah ke satu
   identitas Atlas sejak M6, tapi ketiga cover ini tidak ikut — sampai
   sekarang terlihat sebagai anomali visual di index (strip gelap di
   antara plate krem).
2. **Rasio tidak dikunci.** Ketiganya kebetulan 1600×1000 (16:10), tapi
   tidak ada yang menegaskan itu sebagai aturan — kalau cover berikutnya
   dibuat di rasio lain, `Plate.astro`'s `aspect-ratio: 16/10` (T-66) akan
   mengkropnya, bukan salah `Plate`-nya.

## Aturan

### 1. Satu rasio kanonik: 16:10, ekspor 1600×1000

Ini bukan angka baru — mengangkat rasio yang sudah dipakai ketiga cover
generated sejak T-33 jadi aturan tertulis. `Plate.astro`'s kolom cover
(`--plate-cover-width` × `aspect-ratio: 16/10`, berlaku ≥480px) dikunci ke
rasio ini; cover yang tidak 16:10 akan di-crop tengah oleh `object-fit:
cover`, bukan gagal build — jadi ini SOP kualitas, bukan validasi zod.

### 2. Palet wajib token Atlas — nol tanah gelap

`docs/design/atlas/README.md` tetap **sumber kebenaran nilai** token; di
sini cuma daftar peran yang wajib dipakai:

| Peran | Token | Nilai |
|---|---|---|
| Tanah (background) | `--color-paper` | `#f2ebda` |
| Tinta (teks/motif utama) | `--color-ink` | `#171512` |
| Tinta redup (label) | `--color-ink-muted` | `#4a4238` |
| Garis (graticule/divider) | `--color-line` | `#c9bfa6` |
| Garis kuat (motif sekunder) | `--color-line-strong` | `#8e836a` |
| Aksen `type: research` | `--color-research` | `#2c4630` |
| Aksen `type: project` | `--color-project` | `#2f5670` |

Immersive Mode (`#18140f` dkk.) dan Reading Mode lama (`#f5efe1` dkk.)
sudah mati — ADR-004. **Nol tanah gelap**, titik.

### 3. Tipografi: Archivo + IBM Plex Mono, dari `src/lib/og-fonts/`

**Bukan** file variable font yang dipakai situs langsung
(`public/fonts/archivo-variable-latin.woff2`) — Satori/`@resvg/resvg-js`
tidak menangani kompresi woff2 maupun sumbu `wdth`-nya. Ini kendala
teknis yang sama yang sudah membuat `src/lib/og-image.ts` (T-61) memakai
potongan TTF statis per-weight; cover art memakai TTF yang persis sama:
`archivo-800.ttf` (nilai/angka), `archivo-600.ttf`,
`archivo-400.ttf`, `ibm-plex-mono-400.ttf` (label mono).

### 4. Tiap cover mengkodekan fakta nyata dari postnya sendiri

Konvensi T-33, dinaikkan jadi aturan keras: angka yang muncul di cover
**wajib** dikutip dari field `impact` post itu sendiri (atau, kalau belum
ada `impact`, dari isi body yang sudah terbit) — tidak boleh dikarang atau
"terasa masuk akal". Motif visual boleh abstrak/editorial, tapi harus
merujuk subjek nyata postnya (mis. diagram transit untuk post transit),
bukan ilustrasi generik yang bisa dipasang di post manapun.

**Larangan eksplisit**: ilustrasi generik/stok, screenshot UI produk
(kecuali memang itu yang diminta), watermark/logo pihak ketiga.

### 5. Radius nol

Konsisten dengan seluruh sistem Atlas — nol `border-radius` di elemen
manapun dalam komposisi cover.

### 6. `type: photo` dikecualikan

Untuk `type: photo`, foto ITU kontennya (`.refine()` di
`content.config.ts` mewajibkan `cover` untuk tipe ini) — SOP ini tidak
berlaku di sana. Satu-satunya aturan untuk foto: jaga berkas sumber tetap
wajar (lihat "Berat berkas" di bawah) — kompresi/ilustrasi tidak relevan
untuk foto dokumenter asli.

### 7. Cover itu opsional

Post tanpa cover (`building-knowledge-hub`) tetap sah. `Plate.astro`
sudah menangani ini tanpa lubang placeholder — jangan memaksa post
mendapat cover generated hanya supaya "lengkap".

### 8. Berat berkas

Cover generated (`@resvg/resvg-js` PNG, 1600×1000) biasanya 60–80KB —
wajar, tidak perlu tindakan. Untuk foto asli, jaga di bawah ~5MB per
berkas sebelum commit (Astro mengoptimalkan ulang saat build, tapi bobot
repo & waktu build tetap kena beban berkas sumber) — 3 foto Tanggamus yang
ada saat ini (15–20MB masing-masing) **melanggar** batas ini; mengecilkan
yang sudah ada adalah task tersendiri, dicatat di `docs/memory/DEBT.md`,
bukan bagian SOP ini.

## Cara menjalankan generator

```bash
node scripts/generate-cover.mjs                       # regenerasi semua post terdaftar
node scripts/generate-cover.mjs jabodetabek-connect    # regenerasi satu post
```

`scripts/generate-cover.mjs` memakai pipeline yang sama persis dengan
`src/lib/og-image.ts`: Satori menyusun teks jadi vector path (jadi resvg
tidak perlu me-resolve font by name — TTF fontsource yang dipakai punya
nama internal yang tidak konsisten, mis. `archivo-800.ttf` bernama
internal "Archivo SemiBold ExtraBold", bukan "Archivo"), lalu `@resvg/
resvg-js` merasterisasi ke PNG. Motif tiap post ditulis tangan (bespoke),
mengikuti konvensi "nol sistem auto-chart generik" yang sama dengan
`src/lib/scrollytelling/*.tsx` — menambah post baru berarti menambah satu
fungsi motif + entri di `POSTS` array di skrip itu, bukan mengonfigurasi
sistem generik.

## Checklist sebelum commit

1. `node scripts/generate-cover.mjs <slug>` jalan tanpa error.
2. Buka PNG hasilnya langsung (bukan cuma dipercaya dari kode) — cek
   dimensi 1600×1000, tanah `#f2ebda` (bukan krem/gelap lama), motif
   merujuk subjek post yang benar, angka di stamp cocok dengan `impact`
   post.
3. `npm run build` hijau.
4. `astro preview` sungguhan — cek homepage/`/explore/project`: cover
   baru render tanpa error, tinggi plate konsisten dengan cover lain di
   baris grid yang sama (`getComputedStyle('.plate-cover').aspectRatio`
   → `16 / 10` di ≥480px).
