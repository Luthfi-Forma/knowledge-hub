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
| OG images | Satori + resvg (M3, T-16) — static PNG endpoints, di-generate saat build | Tetap statis, tanpa runtime function (ADR-001) |
| Sitemap / RSS | `@astrojs/sitemap`, `@astrojs/rss` (M3, T-17) | Standar Astro, statis |
| Analytics | Vercel Web Analytics via `@vercel/analytics/astro` (M3, T-18) | Privacy-friendly, tanpa cookie; native ke platform deploy |
| Deploy | Vercel | OS default; alternatif ditolak di ADR-001 |

## Components

### Content collection `posts`

Satu collection untuk semua jenis konten. Frontmatter (zod, build gagal bila
invalid):

```
title: string
summary: string
date: date
type: "project" | "article" | "research" | "journal" | "photo"
tags: string[]            // lowercase, vocabulary terkontrol (topic + technology dilebur)
project?: string          // slug proyek — menghubungkan post lintas-jenis
repo?: string (url)
demo?: string (url)
cover?: image
draft: boolean (default false)
```

Tidak boleh: field `year` (turunan `date`) atau `status` selain `draft`.
`type: "photo"` mewajibkan `cover` (build gagal lewat `.refine()` di zod
kalau tidak ada — foto ITU kontennya, bukan dekorasi opsional).

### Pages

| Route | Isi |
|---|---|
| `/` | Hero, Featured Projects, Latest Posts, Contact (4 seksi saja) |
| `/explore` | Semua post; filter type (M1), filter tag + search (M2) |
| `/posts/[slug]` | Detail post + related posts (M2) |
| `/projects/[name]` | Project hub: semua post satu proyek + repo/demo (M2) |
| `/tags/[tag]` | Post per tag (M2) |
| `/about`, `/404` | About/CV, not found |
| `/og/[slug].png`, `/og/default.png` | OG image per post + fallback site-wide (M3, T-16) |
| `/sitemap-index.xml`, `/rss.xml`, `/robots.txt` | Discoverability — sitemap, RSS feed of all posts, robots directive pointing at the sitemap (M3, T-17) |
| `/photography` | Gallery grid of `type: "photo"` posts (M3, T-19) |

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

## OG images (T-16, M3)

`src/lib/og-image.ts` renders a 1200×630 PNG with Satori (JSX-free object
tree → SVG) + `@resvg/resvg-js` (SVG → PNG), reusing the site's actual
design tokens (cream paper, Bodoni Moda headline, Karla meta) so shared
links look like the site instead of a generic card. `src/pages/og/
[slug].png.ts` generates one per published post at build time (static
output, no runtime function — keeps the "no backend" invariant from
ADR-001); `src/pages/og/default.png.ts` covers every non-post page via
`BaseLayout`'s `image` prop default. `BaseLayout.astro` emits the full
`og:*`/`twitter:*` meta set plus `<link rel="canonical">`, both requiring
`Astro.site` — set in `astro.config.mjs` to the current Vercel URL, update
it if/when T-20 (custom domain) lands.

Fonts for Satori are TTF files checked into `src/lib/og-fonts/` (OFL-licensed,
downloaded from Google Fonts) and read via `fs.readFileSync` against
`process.cwd()`, not `import.meta.url` — Vite relocates this module to
`dist/.prerender/chunks/` at build time, which breaks module-relative paths
but leaves the process's working directory (the project root) unchanged.

## Discoverability (T-17, M3)

`@astrojs/sitemap` generates `sitemap-index.xml`/`sitemap-0.xml` from every
static route, filtered to exclude `/og/*.png` (image endpoints, not pages)
and `/404`. `src/pages/rss.xml.ts` lists all published posts via the same
`getPublishedPosts()` used everywhere else, so a post is never in one feed
but not the other. `src/pages/robots.txt.ts` is a dynamic endpoint (not a
static `public/robots.txt`) specifically so its `Sitemap:` line reads
`Astro.site` instead of a hardcoded URL — it can't drift out of sync with
`astro.config.mjs` when the domain changes (T-20).

## Photography (T-19, M3)

Resolved the open question below: `type: "photo"` is a fifth value on the
existing `posts` collection, not a `photography` tag bolted onto the
existing types — a photo entry is structurally different (image + a short
caption, no long-form MDX body), so it earns its own type the same way
`project`/`article`/`research`/`journal` already do. `getPhotos()`
(`src/lib/posts.ts`) filters to that type; `/photography` renders them as a
2/3/4-column `<PhotoTile>` grid (square crop, real `alt` text — the photo
*is* the content, unlike other types' decorative `alt=""` covers).
`getLatestPosts()` (Home) excludes photos — a bare caption reads poorly in
the text-forward ledger-row list; the dedicated grid is where photos
belong. The post detail page skips the forced `aspect-video` crop for
`type: "photo"` covers (`object-contain`, natural aspect, capped height)
since cropping to 16:9 would mutilate portrait/square photos.

Compression: no custom pipeline needed — every photo goes through
`astro:assets`' `<Image>` component exactly like existing post covers,
which already runs on Sharp (bundled with Astro) to resize and re-encode
to WebP at build time.

## Deployment shape

- Git push ke `main` → Vercel build & deploy otomatis; preview deploy per branch.
- Satu environment publik; tanpa env secrets (tidak ada backend).
- Vercel Web Analytics (T-18): `<Analytics />` dari `@vercel/analytics/astro`
  terpasang di `BaseLayout` dan mengirim pageview ke `/_vercel/insights/*`
  di production. **Perlu diaktifkan manual sekali** di dashboard Vercel
  (Project → Analytics → Enable) — itu toggle akun/dashboard yang tidak bisa
  disentuh dari kode/CLI. Tanpa langkah itu, script terpasang tapi Vercel
  akan menolak/mengabaikan datanya.

## Decisions

See [decisions/](decisions/) for all ADRs.

## Open questions

- Custom domain apa — user menunda ini secara eksplisit (2026-07-17,
  "belum butuh"); putuskan saat diminta.
