# Handoff: Knowledge Hub — Redesign "Atlas"

Repo target: **Luthfi-Forma/knowledge-hub** (branch `main`) — Astro + MDX content collections, React islands (Recharts scrollytelling), Pagefind search, Vercel.

## Overview

Knowledge Hub hari ini menjalankan **dua identitas visual** (Reading + DATUM/Immersive) yang dipilih lewat toggle tersembunyi, dengan dua pohon DOM per halaman dan 4 route orphan. Redesign "Atlas" **melebur keduanya menjadi satu identitas** — bahasa kartografis DATUM (hatch per tipe, plate berkoordinat, graticule) diangkat ke latar kertas terang — dan menaikkan **topik** menjadi warga kelas satu karena audiens utama situs adalah komunitas GIS.

Hasil bersih: 4 item nav yang semuanya halaman nyata, nol orphan, nol toggle, satu wadah konten (`Plate`), dan rail legenda permanen yang mengisi ~44% viewport yang hari ini kosong.

## About the Design Files

File `.dc.html` dalam bundel ini adalah **design reference yang dibuat dengan HTML** — prototipe yang menunjukkan tampilan dan perilaku yang dituju, **bukan kode produksi untuk disalin**. Tugasnya: **membuat ulang desain ini di dalam codebase Astro yang sudah ada**, memakai pola dan pustaka yang sudah mapan di sana (komponen `.astro`, `src/styles/global.css`, `src/lib/posts.ts`, content collections). Semua styling di prototipe ditulis inline karena batasan tooling desain; di repo, styling harus lewat token CSS + kelas seperti biasa.

## Fidelity

**High fidelity.** Warna, tipografi, spasi, dan interaksi sudah final dan harus direproduksi presisi. Angka apa pun yang tampil di prototipe diambil dari frontmatter MDX nyata di repo; placeholder bertanda garis putus-putus merah (`#A8481F` dashed) menandai konten yang **belum ada** dan harus disediakan pemilik situs (lihat "Editorial prerequisites").

## Design Tokens

Nama token **tidak berubah** dari `src/styles/global.css` — hanya nilainya. Ini penting: 72 rujukan `var(--color-*)` di modul scrollytelling React ikut pindah identitas tanpa satu edit React.

### Warna — 9 token, satu tugas masing-masing

| Token | Nilai | Satu-satunya tugas | Kontras di paper |
|---|---|---|---|
| `--color-paper` | `#F2EBDA` | Kertas lembar (background halaman) | — |
| `--color-paper-raised` | `#E8E0CB` | Collar, header kolom, plate pasif, rail | — |
| `--color-line` | `#C9BFA6` | Graticule & pembatas dekoratif **saja** | 1,5:1 |
| `--color-line-strong` | `#8E836A` | **BARU** — batas kontrol interaktif (input, tombol, tab, chip) | 3,2:1 ✓ UI |
| `--color-ink` | `#171512` | Teks utama, batas plate, judul | 15,3:1 ✓ |
| `--color-ink-muted` | `#4A4238` | Teks sekunder & **semua** notasi mono | 8,3:1 ✓ |
| `--color-research` | `#2C4630` | Kode tipe *research* + warna tautan + ring fokus | 8,7:1 ✓ |
| `--color-project` | `#2F5670` | Kode tipe *project* + seri chart 2 | 6,6:1 ✓ |
| `--color-flag` | `#A8481F` | Penanda **interaktif** saja — tidak untuk hal lain | 4,9:1 · min 13px |

Latar di luar shell (viewport surround): `#DED6C2`.

Perubahan ini bukan perbaikan kontras — palet lama sudah lulus AA. Ini **pembagian peran**: satu hijau yang mengerjakan enam tugas dipecah menjadi research / project / flag. Satu-satunya perbaikan aksesibilitas nyata di lapisan warna: `--color-line` (1,5:1) berhenti dipakai sebagai batas kontrol, digantikan `--color-line-strong` (3,2:1) yang memenuhi syarat komponen UI non-teks.

### Tipografi — satu keluarga variable, tujuh tingkat

**Archivo variable** (sudah self-hosted di `public/fonts/archivo-variable-latin.woff2`) mengerjakan display **dan** body lewat sumbu `wdth`. **IBM Plex Mono** mengerjakan notasi. **Bodoni Moda + Karla dilepas** — dua permintaan Google Fonts hilang, dan lubang skala 60→24→20→18 tertutup.

| Tingkat | Ukuran | Weight | wdth | line-height | Pemakaian |
|---|---|---|---|---|---|
| Sheet title | 64px | 800 | 125% | .98 | 1× per halaman (letter-spacing .004em) |
| Page title | 40px | 700 | 118% | 1.05 | `h1` tiap route |
| Plate lead | 24px | 700 | 115% | 1.15 | Plate besar (tingkat menengah yang hilang) |
| Plate title | 17px | 600 | 110% | 1.25 | Judul konten di plate standar |
| Body | 16px | 400 | 100% | 1.65 | Teks umum; prosa post 17px, measure 68ch |
| Meta / small | 14px | 400 | 100% | 1.55 | Ringkasan plate, caption — `ink-muted` |
| Notation | 12px | 400 | — | — | IBM Plex Mono, letter-spacing .06em; label uppercase .12em |

Aturan notasi: mono **hanya** untuk data yang benar-benar terukur — koordinat, jumlah, tanggal, satuan. Tidak untuk dekorasi.

### Ruang & layout

Modul dasar **44px** (graticule); semua ukuran plate dan padding adalah kelipatannya.

Skala spasi: **4** (notasi→judul) · **8** (antar baris meta) · **12** (padding plate compact) · **16** (padding plate standar, gap grid) · **24** (padding plate lead) · **32** (**ritme minor**, antar blok sejenis) · **48** (gutter desktop) · **72** (**ritme mayor**, pergantian seksi).

Hanya 32 dan 72 dipakai untuk ritme vertikal — dipilih berdasar arti, bukan halaman (hari ini home pakai 32 dan About 64).

Empat lebar menggantikan satu kolom 800px:
- **FIELD** — full-bleed: graticule, peta, foto lapangan
- **SHELL** 1240px — indeks, kolom, About
- **RAIL** 224px — legenda tipe + indeks topik, permanen di ≥1024px
- **PROSE** 680px — measure 68ch

Gutter: **20 / 32 / 48** (mobile / tablet / desktop) — bukan 20 di semua ukuran.

**Border radius: nol.** Radius dihapus dari sistem sepenuhnya. Tidak ada shadow.

### Gerak

Hover/state **120ms**; transisi tata letak **200ms**; tidak ada di atas 300ms. Nol animasi berulang, nol parallax dekoratif. Jaring `prefers-reduced-motion` global dipertahankan, **dan** 4 modul scrollytelling wajib memanggil `useReducedMotion()` (celah nyata hari ini). View transition CSS murni dipertahankan.

## Components

### Plate — satu-satunya wadah konten, tiga ukuran

Anatomi **selalu** sama: *notasi tipe + nomor plate → judul → (ringkasan) → stamp koordinat/angka*. Ukuran plate = kepentingan. Post tanpa cover memakai anatomi identik minus kolom gambar — jadi tidak ada "lubang" visual (hanya 4 dari 11 post punya cover).

- **Lead**: `border: 1px solid #171512`, `background: #F2EBDA`, `padding: 24px`, grid `1fr 300px` (Hi-Fi) / `1fr 148px` (kompak), gap 24px, align-items center. Judul 24–32px w700 wdth115%.
- **Standar**: border ink 1px, paper, `padding: 16px`. Judul 17px w600 wdth110%.
- **Compact** (foto): `border: 1px solid #8E836A`, `background: #E8E0CB`, `padding: 12px`. Judul 15px w600 wdth108%.

Baris notasi: mono 11px, uppercase, letter-spacing .1em, `ink-muted`, flex gap 10px, berisi swatch hatch 11–12px + "Research · Plate 01" + flag opsional.

Menggantikan **PostCard + PostListItem** (dua sistem kartu hari ini).

### Legend swatch — hatch per tipe

Swatch 18×18px, `border: 1px solid #171512`. Pola yang sama dipakai ulang di plate sebagai overlay 10%:

- **Research** — cross-hatch: `repeating-linear-gradient(45deg,#2C4630 0 2px,transparent 2px 7px)` + `repeating-linear-gradient(-45deg,#2C4630 0 2px,transparent 2px 7px)`
- **Project** — single hatch: `repeating-linear-gradient(45deg,#2F5670 0 2px,transparent 2px 7px)`
- **Article** — dot grid: `radial-gradient(#4A4238 1px, transparent 1.5px)`, `background-size: 7px 7px`
- **Photo** — solid `#C9BFA6`
- **INTERACTIVE flag** — mono 12–13px, `color: #A8481F`, `border: 1px solid #A8481F`, `padding: 1px 5px`, uppercase

Jumlah hari ini: research 4 · project 3 · article 1 · photo 3 (11 post total, 20 topik).

Graticule: `repeating-linear-gradient(to right, #C9BFA6 0 1px, transparent 1px 44px)` + arah bawah yang sama.

### TopicChip — satu bentuk, dua state

`display: inline-flex; align-items: baseline; gap: 5px; font-size: 13px; padding: 4px 8px;` — label + hitungan mono 11px.
- **Default**: `border: 1px solid #8E836A`, `background: #F2EBDA`, count `#4A4238`
- **Active**: `border: 1px solid #171512`, `background: #171512`, `color: #F2EBDA`, count `#C9BFA6`

Target sentuh 44px dicapai lewat **area klik**, bukan padding visual. Menggantikan tiga gaya tag berbeda hari ini.

### Kontrol — satu bahasa, tiga tingkat

Semua: sudut tajam, label **mono 12,5px uppercase letter-spacing .1em**, `min-height: 44px`, fokus `2px solid var(--color-research)` offset 2px.
- **Primary**: `background: #171512`, `color: #F2EBDA`, `padding: 0 20px`
- **Secondary**: `border: 1px solid #8E836A`, `color: #171512`, `padding: 0 20px`
- **Tertiary**: `color: #2C4630`, `border-bottom: 1px solid #2C4630`, tanpa padding
- **Icon**: 44×44px, `border: 1px solid #8E836A`, `color: #4A4238`

Menggantikan 4 bahasa tombol yang ada hari ini.

### Header — collar lembar (dua baris)

Baris 1 (`padding: 16px 48px`, `border-bottom: 1px solid #171512`): wordmark "Afreza L. Hernanda" (Archivo 17px w700 wdth118%) di kiri; kanan = 4 item nav + kontrol search.
- Nav item: mono 12px uppercase .1em, `min-height: 44px`, `padding: 0 12px`, `color: #4A4238`; **aktif** = `color: #171512` + `border-bottom: 2px solid #2C4630` + `aria-current="page"`.
- Search: `border: 1px solid #8E836A`, `padding: 0 12px`, mono 12px, "⌕ Search" + badge pintasan `/` (`border: 1px solid #C9BFA6; padding: 0 4px; font-size: 10.5px`).

Baris 2 = **breadcrumb dalam notasi lembar** (`padding: 8px 48px`, `background: #E8E0CB`, mono 11px uppercase .1em, `ink-muted`): kiri menyatakan posisi + filter aktif ("Sheet index · 11 plates · 20 topics · no filter"), kanan konstan ("Projection Web Mercator · Datum WGS84 · Compiled 2026"). Ini menggantikan kebutuhan breadcrumb konvensional.

**Skip-link** ke `#main` sebagai elemen pertama di `<body>` (kegagalan WCAG 2.4.1 hari ini).

### Footer — empat kolom

Index per tipe · 6 topik teratas · proyek · kontak & RSS. (Hari ini: copyright + RSS saja.)

## Information Architecture

### Peta situs Atlas

| Route | Isi |
|---|---|
| `/` — **Sheet Index** | 11 plate + rail legenda (tipe & topik) + search. Menggantikan home **dan** `/explore` |
| `/topics` | **Naik ke nav.** Indeks 20 topik |
| `/topics/[topic]` | Definisi + plate + topik bertetangga |
| `/projects` | **Naik ke nav** |
| `/projects/[name]` | Hub proyek |
| `/posts/[slug]` | Prose 680px + rail marginalia |
| `/about` | Dossier + kontak nyata |
| `/explore/[type]` | **Sekunder** (footer/rail) — sama dengan index terfilter |
| `/photography` | **Sekunder** — 3 item |

Nav utama = **4 item**: Index · Topics · Projects · About. "Contact" keluar dari nav (ia hanya anchor) dan menjadi blok nyata di About + footer. Photography turun ke sekunder — 3 item tidak layak sejajar dengan seluruh arsip.

Dihapus: toggle mode, RegistrationSeam, `[data-mode-view]`, `/tags` (→ redirect), `/#contact` di nav.

### Kedalaman klik yang berubah

| Tugas | Hari ini | Atlas | Mekanisme |
|---|---|---|---|
| Semua karya bertopik *google-earth-engine* | 4+ klik, harus lewat post | 1 klik | Chip topik di rail, ada di setiap halaman |
| Melihat hanya riset | 2 klik | 1 klik | Legenda tipe = filter |
| Post → repo/demo | 1–2 klik | 1 klik | Blok proyek dipromosikan di rail, bukan baris meta 14px |
| Tahu 4 riset itu narasi interaktif | tidak pernah tahu | 0 klik | Flag INTERACTIVE di plate |
| Memahami RPPLH / P3KE / Skalogram | tidak tersedia | 1 klik | Halaman topik berdefinisi |

### Nol jalan buntu

- **`/posts/[slug]`** — rail marginalia: topik post, blok proyek (repo/demo), cross-link inline, lalu 3 plate terkait bergaya **berbeda** dari index (hari ini related posts tampil identik dengan feed sehingga tak terbaca sebagai rekomendasi).
- **`/topics/[topic]`** — definisi 1 kalimat → plate → **topik bertetangga**, dihitung dari tag yang muncul bersama.
- **`/projects/[name]`** — repo/demo sebagai kontrol primer + urutan post proyek sebagai kronologi + topik proyek.
- **404** — sheet index mini: 4 legenda tipe + search.

## Screens

Kelima layar ada di `Hi-Fi - Atlas Screens.dc.html` (lebar kanvas 1440px) dan hidup/interaktif di `Prototype - Atlas.dc.html`.

### 01 · `/` — Sheet Index
**Tujuan:** satu-satunya pintu masuk arsip; melihat seluruh 11 karya, lalu menyaring.
**Layout:** collar 2 baris → grid `224px 1fr`. Rail kiri: `border-right: 1px solid #171512`, `background: #E8E0CB`, `padding: 24px 16px`, flex column gap 24px — blok legenda tipe (4 swatch + hitungan, **dapat diklik untuk memfilter**) lalu blok indeks topik (chip). Kolom kanan: `padding: 32px 48px`, plate lead (grid `1fr 300px`, padding 24, margin-bottom 16) untuk karya berbobot, lalu grid plate standar.
**Interaksi:** klik swatch legenda → filter tipe (breadcrumb collar ikut berubah: "filter: research"); klik chip topik → `/topics/[topic]`; klik plate → detail.

### 02 · `/topics/[topic]` — Topic
**Tujuan:** masuk lewat konsep, bukan kronologi.
**Layout:** grid `224px 1fr`; rail = daftar 20 topik lengkap (yang aktif memakai state chip aktif). Kolom kanan `padding: 32px 48px`: notasi "Topic · 6 plates · 4 research · 2 project" (mono 11px) → `h1` nama topik (56px w800 wdth122% lh1) → **definisi 18px lh1.6 max 64ch** → grid plate → seksi **topik bertetangga**.
**Catatan:** hitungan tetangga dihitung dari co-occurrence `tags[]`, bukan ditulis tangan.

### 03 · `/posts/[slug]` — Post detail
**Tujuan:** membaca, lalu tidak mentok.
**Layout:** collar breadcrumb "Index / Research / Plate 01" + stamp "06°15′S 107°09′E · 20 Agu 2024". Body = prose 680px (17px lh1.65, measure 68ch) + rail marginalia. Rail berisi, dari atas: **Stamp lembar** (mono 12,5px — koordinat, tanggal lengkap, "Research · Plate 01", slot angka dampak) → **blok proyek** (repo + demo sebagai kontrol) → **Marginalia — tautan silang** (prosa 13,5px dengan tautan inline `#2C4630`) → 3 plate terkait.

### 04 · `/projects/[name]` — Project hub
**Tujuan:** melihat satu proyek sebagai satu badan kerja.
**Layout:** collar → header proyek dengan repo/demo sebagai kontrol primer/secondary → kronologi post proyek → topik proyek.

### 05 · `/about` — Dossier
**Tujuan:** kredibilitas + kontak nyata.
**Layout:** collar "Dossier · Afreza Luthfi Hernanda" + "06°15′S 107°09′E · Cikarang Selatan, Bekasi" → `padding: 40px 48px 48px`, komposisi dossier (dipromosikan dari `ImmersiveDossier.astro`) + blok kontak nyata.

## Interactions & State

Semua filter di prototipe berjalan client-side dan **harus tercermin di URL** supaya bisa dibagikan dan di-SSG:

- `activeType: 'research' | 'project' | 'article' | 'photo' | null` — dari klik legenda. Sinkron dengan `/explore/[type]`; `null` = `/`.
- `query: string` — search (Pagefind), dibuka oleh tombol atau pintasan `/`, ditutup `Esc`.
- `activeTopic` — bukan state, ia route (`/topics/[topic]`).
- Breadcrumb collar baris 2 adalah **turunan** dari state di atas; ia harus selalu menyatakan filter yang aktif.
- Rail di <1024px menjadi **drawer** yang dipanggil dari tombol *Legend*.

## Repo impact

| Aksi | File | Catatan |
|---|---|---|
| **Hapus** | `components/home/RegistrationSeam.astro` · `lib/mode-toggle.ts` · tombol toggle di `Header.astro` · script pra-paint di `BaseLayout.astro` · blok `:root[data-mode='immersive']` + aturan `[data-mode-view]` di `global.css` | ADR-003 ditutup sebagai **superseded**, bukan dilanggar |
| **Promosi** | `components/home/ImmersiveIndex.astro` → `components/index/SheetIndex.astro` | Sudah menurunkan posisi dari `type` + `date`; kini indeks tunggal + rail |
| **Promosi** | `components/about/ImmersiveDossier.astro` → `components/about/Dossier.astro` | Menjadi satu-satunya komposisi About |
| **Ganti nama** | `pages/tags/**` → `pages/topics/**` | Redirect `/tags/:tag → /topics/:tag` di `vercel.json`; tautan di `[slug].astro` diperbarui |
| **Gabung** | `pages/index.astro` + `pages/explore/index.astro` | `/explore` → redirect ke `/`. `Hero` · `FeaturedProjects` · `LatestPosts` · `PostListItem` dipensiunkan |
| **Baru** | `components/Plate.astro` · `LegendRail.astro` · `TopicChip.astro` · `Footer.astro` (perluasan) · `lib/topics.ts` | Satu wadah menggantikan PostCard + PostListItem; `lib/topics.ts` menghitung topik bertetangga dari `tags[]` |
| **Schema** | `content.config.ts` · `content/topics/` (koleksi baru) | Definisi topik tervalidasi + field opsional `impact` pada post |

### Schema koleksi `topics`

```ts
// src/content.config.ts
const topics = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/topics' }),
  schema: z.object({
    title: z.string(),            // slug tampil, mis. "google-earth-engine"
    definition: z.string().max(240), // 1 kalimat, tampil di /topics/[topic]
    aliases: z.array(z.string()).default([]),
    related: z.array(z.string()).default([]), // manual override; default dihitung
  }),
});
```

Tambahan opsional pada schema post untuk angka dampak di stamp lembar:

```ts
impact: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
```

### `lib/topics.ts`

Dua fungsi: `topicCounts(posts)` → `Map<topic, {total, byType}>` untuk rail dan chip; `neighbours(topic, posts, limit = 6)` → topik lain yang **muncul bersama** di `tags[]` post yang sama, diurutkan turun berdasar jumlah co-occurrence. Tidak ada daftar manual.

### Redirect (`vercel.json`)

```
/explore        → /            (308)
/tags           → /topics      (308)
/tags/:tag      → /topics/:tag (308)
```

## Aksesibilitas — perbaiki bersamaan

1. Batas kontrol interaktif 1,5:1 → **3,2:1** (`--color-line-strong`).
2. **Skip-link** ke `#main` — kegagalan 2.4.1 hari ini.
3. `aria-current="page"` di nav utama, bukan hanya di filter tipe.
4. Setiap chart Recharts wajib punya **tabel data alternatif** — kegagalan 1.1.1.
5. 4 modul scrollytelling wajib memanggil `useReducedMotion()`.
6. **Pagefind di-restyle** ke token Atlas — menutup utang teknis #1 di `docs/memory/DEBT.md`.

Poin 4 dan 5 adalah satu-satunya pekerjaan sisi React; sisanya berdiri di lapisan Astro/CSS.

## Editorial prerequisites (dari pemilik situs, bukan developer)

Lapisan "jaringan" lahir kosong tanpa ini — struktur tanpa isi:

1. **20 definisi topik** — 1 kalimat per topik, untuk `content/topics/`.
2. **3–5 cross-link inline per post** — hari ini ada **nol** cross-link di seluruh body MDX, jadi rail marginalia kosong.
3. **Angka dampak** untuk sebagian post — field `impact`, tampil di stamp lembar.

Tandai slot ini di UI dengan graceful empty state, jangan dengan placeholder yang tampil ke publik.

## Verification checklist

- [ ] `grep -r "data-mode" src/` → nol hasil; `mode-toggle.ts` dan `RegistrationSeam.astro` terhapus
- [ ] `grep -rn "Bodoni\|Karla" src/` → nol hasil; hanya satu `<link>`/`@font-face` keluarga (Archivo + IBM Plex Mono)
- [ ] Nama token di `global.css` tidak berubah; `--color-line-strong` ditambahkan; modul scrollytelling dibuka tanpa edit React dan mewarisi palet baru
- [ ] Nol `border-radius` non-nol di `src/`
- [ ] `/`, `/explore`, `/tags`, `/tags/gis` semuanya berakhir di tujuan yang benar (308)
- [ ] Rail 224px terlihat ≥1024px; drawer *Legend* di bawahnya
- [ ] Klik swatch legenda mengubah URL **dan** baris breadcrumb collar
- [ ] Setiap chip topik dari rail mendarat di `/topics/[topic]` dalam 1 klik dari halaman mana pun
- [ ] Tab pertama di setiap halaman = skip-link ke `#main`; ring fokus `2px solid var(--color-research)` offset 2px terlihat di semua kontrol
- [ ] Nav aktif punya `aria-current="page"`
- [ ] Semua kontrol dan area klik chip ≥44px
- [ ] Setiap chart punya tabel data alternatif; `useReducedMotion()` terpanggil di 4 modul
- [ ] Pagefind memakai token Atlas, bukan style bawaan
- [ ] Post tanpa cover memakai anatomi plate identik minus kolom gambar — tidak ada ruang kosong

## Assets

Tidak ada aset baru. Archivo variable sudah ada di `public/fonts/archivo-variable-latin.woff2`; IBM Plex Mono sebaiknya di-self-host dengan cara yang sama. Semua tekstur (hatch, graticule, dot grid) adalah CSS gradient — nol file gambar, nol SVG ikon baru. Cover post yang ada tetap dipakai apa adanya.

## Files in this bundle

| File | Isi |
|---|---|
| `Design Language - Atlas.dc.html` | Token, skala tipografi, layout, komponen, gerak — sumber kebenaran nilai |
| `IA Review - Atlas.dc.html` | Peta situs sebelum→sesudah, kedalaman klik, nav, jaringan, dampak repo |
| `Hi-Fi - Atlas Screens.dc.html` | Lima layar 1440px, presisi piksel |
| `Prototype - Atlas.dc.html` | Prototipe interaktif: legenda-sebagai-filter, search, topik tetangga terhitung |
| `Product Discovery - Knowledge Hub.dc.html` | Analisis awal — kenapa keputusan ini diambil |
| `Visual Audit - Knowledge Hub.dc.html` | Temuan yang diperbaiki desain ini |
| `support.js` | Runtime agar file `.dc.html` dapat dibuka langsung di browser |

Buka file `.dc.html` mana pun langsung di browser.
