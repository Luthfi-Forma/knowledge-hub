# Architecture — knowledge-hub

- Updated: 2026-07-16
- Process: `C:\Users\Luthfi\Documents\Claude Code\Claude Engineering OS\standards\architecture\system-design-process.md`

<!-- Keep this document TRUE. When reality diverges, update it in the same
     commit — an outdated architecture doc is worse than none. -->

## System context

Situs statis yang dibangun dari file MDX di repo ini dan di-deploy ke Vercel.
Tidak ada backend/database. Website adalah pusat navigasi: source code tiap
proyek tetap di repo GitHub-nya, demo di hosting-nya masing-masing — halaman
post menautkan keluar ke sana.

```
Pengunjung ──> Vercel (situs statis Astro)
                 │  build time
                 └─ content/posts/*.mdx  (repo ini)
                      └─ link keluar ──> repo GitHub per proyek, live demo
```

## Tech stack

| Layer | Choice | Why / ADR |
|---|---|---|
| Framework | Astro | [ADR-001](decisions/ADR-001-astro-over-nextjs.md) |
| Styling | Tailwind CSS | OS default |
| Konten | MDX via Astro content collections + zod schema | ADR-001 |
| Search | Pagefind (client-side, M2) | Tanpa backend |
| Deploy | Vercel | OS default; alternatif ditolak di ADR-001 |

## Components

### Content collection `posts`

Satu collection untuk semua jenis konten. Frontmatter (zod, build gagal bila
invalid):

```
title: string
summary: string
date: date
type: "project" | "article" | "research" | "journal"
tags: string[]            // lowercase, vocabulary terkontrol (topic + technology dilebur)
project?: string          // slug proyek — menghubungkan post lintas-jenis
repo?: string (url)
demo?: string (url)
cover?: image
draft: boolean (default false)
```

Tidak boleh: field `year` (turunan `date`) atau `status` selain `draft`.

### Pages

| Route | Isi |
|---|---|
| `/` | Hero, Featured Projects, Latest Posts, Contact (4 seksi saja) |
| `/explore` | Semua post; filter type (M1), filter tag + search (M2) |
| `/posts/[slug]` | Detail post + related posts (M2) |
| `/projects/[name]` | Project hub: semua post satu proyek + repo/demo (M2) |
| `/tags/[tag]` | Post per tag (M2) |
| `/about`, `/404` | About/CV, not found |

## Data flow

1. Menambah konten: tulis `content/posts/x.mdx` → build memvalidasi frontmatter
   → halaman, listing, tag, dan related posts ter-generate otomatis.
2. Pengunjung menjelajah: post → (project hub) → repo GitHub / live demo, atau
   post → tag → post lain.

## Deployment shape

- Git push ke `main` → Vercel build & deploy otomatis; preview deploy per branch.
- Satu environment publik; tanpa env secrets (tidak ada backend).

## Decisions

See [decisions/](decisions/) for all ADRs.

## Open questions

- Custom domain apa — putuskan saat M3.
- Perlukah `type: "photo"` terpisah untuk photography atau cukup tag `photography`
  — putuskan saat M3 (section photography dibuat).
