# Architecture — knowledge-hub

- Updated: 2026-07-17
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

## Visual identity

Final identity (T-14, M3), replacing the M1 provisional zinc/Plus Jakarta Sans
tokens. Determined mockup-first: proposed 3 original directions grounded in
the site's subject (urban planning + GIS field research + software builds),
then converged with the user against a client-supplied reference (an
editorial travel-blog layout) per
`OS_ROOT\standards\design\web-design.md` §2 (references override the
standard's own defaults, short of the hard bans).

- **Palette** — `--color-paper #F5EFE1` (warm cream), `--color-paper-raised
  #EFE8D5`, `--color-ink #18140F`, `--color-ink-muted #6B6152`,
  `--color-line #DDD3BC`, `--color-accent #38523A` (deep green, used
  sparingly: tags, active-state accents, links). Accent deliberately avoids
  terracotta — cream paper + serif + terracotta is a flagged generic-AI
  cliché combination.
- **Type** — `--font-display` = Bodoni Moda (headlines, post/section titles,
  article body copy, italic lead paragraphs — loaded at weights 400/800 and
  italic 500 only; see below), `--font-body` = Karla (nav, meta rows, tags,
  buttons, captions). Both chosen to be less common than typical
  AI-portfolio pairings (Fraunces/Playfair + Inter/Space Grotesk).
- **Composition** — single-column editorial rhythm (generous whitespace,
  italic lead, underlined subheadings), ledger-style bordered rows for post
  lists, a static table-of-contents block on post pages (no scroll-spy JS —
  kept deliberately simple), sharp/minimal corner radius (`rounded-sm` or
  none) instead of pills, in place of the M1 rounded-lg/rounded-full
  defaults.
- **Font-weight gotcha** — Bodoni Moda is loaded at only 400/800/500(italic)
  to keep the font payload small. `global.css` resets the UA default bold
  (700) on `h1,h2,h3` inside `@layer base` so callers must opt into weight
  explicitly (`font-extrabold`, etc.) — Tailwind v4 utility classes live in
  `@layer utilities`, and layered CSS always loses to *unlayered* CSS
  regardless of specificity, so this reset must stay inside `@layer base` or
  every heading weight utility across the site silently stops working.

## Deployment shape

- Git push ke `main` → Vercel build & deploy otomatis; preview deploy per branch.
- Satu environment publik; tanpa env secrets (tidak ada backend).

## Decisions

See [decisions/](decisions/) for all ADRs.

## Open questions

- Custom domain apa — putuskan saat M3.
- Perlukah `type: "photo"` terpisah untuk photography atau cukup tag `photography`
  — putuskan saat M3 (section photography dibuat).
