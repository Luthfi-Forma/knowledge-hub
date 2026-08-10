# Testing — knowledge-hub

- Updated: 2026-08-09 (M10/T-76 — first automated test)
- Baseline: `C:\Users\Luthfi\Documents\Claude Code\Claude Engineering OS\standards\testing.md` (this doc records the
  project-specific plan, not the general rules)

## How to run

```
npm run build
```

`astro build` is still the main correctness check for this project (see
"What we test" below) — almost everything here is static rendering, which
the build validates by producing it.

```
npm test
```

Added in M10/T-76, and deliberately narrow. Node's built-in test runner with
type stripping, **zero new dependencies**, covering one thing: the scroll
maths in `computeStageState` (`src/components/story/types.ts`). It earns a
test because it is the only non-trivial pure computation in the codebase, and
because it is the one piece a build cannot check *and* the browser cannot
exercise — scroll events never fire in this session's browser tool
(`docs/memory/LESSONS.md`, 2026-08-09), so the reader's position can never be
driven there by scrolling. Making the maths a pure exported function was
ADR-005 #5's answer to exactly that; this is the other half of it.

Not a general testing strategy. Do not add tests for static rendering — the
build already covers it, and the manual browser pass covers what the build
cannot see.

## What we test, per layer

| Layer | Tool | What is covered | Target |
|---|---|---|---|
| schema validation | zod (`src/content.config.ts`), runs on every build | Every post's frontmatter — build fails loudly on an invalid field, bad date, wrong `type` enum, non-kebab-case tag, etc. | 100% of content |
| type check | `astro build` (TypeScript under the hood) | Compile-time errors across `.astro`/`.ts` files — but **only for modules the build graph actually reaches**. Vite compiles nothing else, and TypeScript is not installed standalone, so a file no page imports is never checked (DEBT #4) | Every module reachable from a page — **not** 100% of source |
| unit test | `npm test` (Node's runner, type stripping) | `computeStageState` — scene boundaries, quantisation, clamping, direction, degenerate inputs | The one pure computation that a build cannot check and a browser cannot exercise here |
| manual browser verification | Claude Code's Browser pane, done at the end of every task this project has shipped | Rendered output, heading order, focus states, contrast, responsive breakpoints (375/768/1024/1440), console errors, and — after deploy — the live production URL | Every page touched in a session |

## Test data

Content is real, not fixture data — every post in `src/content/posts/` is
either the site owner's own real project or a real personal case study
(see docs/RULES.md's content-first rule). There is no separate test dataset.

## ≤2-click path walkthrough (T-31, T-33, 2026-07-28)

PROJECT_BRIEF's success criterion — `post → project hub → repo/demo` in
≤2 clicks — was verified broken at every hop before this session (no
`repo:`/`demo:` on any project post, "Project: X" was plain text). Fixed
this session (T-31/T-32/T-33) and manually walked in the built output
(`dist/`, not just dev):

| From | To | Clicks | Verified |
|---|---|---|---|
| `/posts/cdmp-jabodetabek` | `https://github.com/Luthfi-Forma/CDMP-Jabodetabek` | **1** (repo link is directly on the post's meta bar, not just the project hub) | yes — `<a href="...Repository ↗</a>` present |
| `/posts/cdmp-jabodetabek` | `/projects/cdmp-jabodetabek` | 1 | yes — `Project:` is now a real `<a href>` |
| `/projects/cdmp-jabodetabek` | `https://github.com/Luthfi-Forma/CDMP-Jabodetabek` | 1 (2 total via the hub) | yes |

Same pattern confirmed for all 3 `type: project` posts (Jabodetabek-Connect,
Jakarta Transit Heritage Explorer, CDMP-Jabodetabek) — repo links now
resolve to real, user-supplied GitHub URLs under `Luthfi-Forma/*`. No
`demo:` URLs were supplied this session (live demos aren't up yet per the
posts' own "Status" sections — GitHub Pages/Vercel deploys are described as
pending); `demo` stays unset, which the schema treats as optional.

`building-knowledge-hub.mdx`'s `repo:` was also corrected — it pointed at
`github.com/afrezahernanda/knowledge-hub` (wrong org, 404) and now resolves
to the real `github.com/Luthfi-Forma/knowledge-hub`.

**Cover art (T-33):** per the project owner's direction, covers are
generated editorial diagrams rather than screenshots — each one encodes a
real fact from its post (13 lines · 128 stations; the 3 named test nodes;
1989–2027 · 14 projects) in the site's exact Reading Mode palette, built as
hand-authored SVG rasterized via `@resvg/resvg-js` (same library and same
embedded fonts as `src/lib/og-image.ts`, so no new dependency). Verified in
`dist/`: all 3 Featured Projects cards on Home now render a real `<img>`;
zero remaining `bg-paper-raised` placeholder boxes for these posts.

## Measured baseline (T-36, 2026-07-28)

The brief's success criterion — Lighthouse Performance & SEO ≥ 90 on Home
and one post — had never actually been measured (verified: no score exists
anywhere in the repo prior to this entry). Attempting to measure it hit two
independent blockers, both worth recording as gotchas:

- **PageSpeed Insights web UI** (pagespeed.web.dev): the run queues
  successfully (`batchexecute` POST returns 200) but the page's client-side
  polling loop never surfaces a result — stuck indefinitely on "Running
  analysis / data loading" with zero follow-up network requests. Consistent
  with this session's documented browser-tool limitation around JS timers
  and async callbacks (see `docs/memory/LESSONS.md`, 2026-07-21 entry on
  `IntersectionObserver`/`rAF`/`ResizeObserver`) — likely the same class of
  issue extending to whatever polling mechanism the PSI frontend uses.
- **PageSpeed Insights API** (`googleapis.com/pagespeedonline/v5`), tried
  both via WebFetch and directly via `curl` from two different network
  paths: both returned **HTTP 429** (keyless quota exhausted). Getting a
  real Lighthouse score requires either a Google Cloud API key for the PSI
  API, or running the PageSpeed Insights web UI from a real browser (not
  this session's tooling) — **action item for the project owner**, not
  something the agent could complete unattended this session.

**What was measured instead** (raw production transfer weight via `curl`
against the live Vercel deployment — a genuine proxy for the JS/CSS cost
Lighthouse would score, not a substitute for the actual audit categories
like accessibility, SEO markup, or CWV timing which need a real browser):

| Route | HTML | CSS (br) | JS (br) | Total (br) | TTFB |
|---|---|---|---|---|---|
| `/` (Home) | 17.7 KB | 6.5 KB | 1.3 KB (`/_vercel/insights/script.js`, loaded by `<Analytics />` in `BaseLayout.astro`) | ~25.5 KB | 0.94 s |
| `/posts/rpplh-south-papua` (scrollytelling) | 36.3 KB | 6.5 KB | 220.4 KB (`client.js` + 4 chunks: `rpplh-south-papua`, `PieChart`, `Scrollytelling`, `react-dom`) | ~263 KB | 0.95 s |

The scrollytelling bundle's brotli-compressed weight (**~220 KB**) and raw
weight (**~719 KB** across `client.CAF2SiBH.js` + the 4 chunks it pulls in)
closely match the figures already recorded in `docs/ARCHITECTURE.md`
("~700KB uncombined... ~220 KB gz") from the M4 session — good independent
corroboration that those numbers hold in the current production build.
Confirmed via chunk-import tracing (`grep` on the served JS for
`from"./*.js"`) that the heavy chunk (`Scrollytelling.*.js`, 482 KB raw /
146 KB br — the React+motion+recharts core) is pulled in only by the 4
scrollytelling post pages, not by Home or any non-scrollytelling route —
consistent with ADR-002's bundle-scoping requirement.

TTFB for both routes is under 1s from this session's network path (not
representative of a real user's location/connection — Lighthouse's mobile
run applies deliberate network/CPU throttling that this measurement does
not).

**Still needed to close T-36 properly:** an actual Lighthouse run (PSI web
UI in a real browser, or `npx lighthouse` if Node + Chrome are available
locally) for the four audit categories (Performance, Accessibility, Best
Practices, SEO) plus Core Web Vitals (LCP, CLS, TBT) on both routes above.

## Post-M5 remeasurement (T-44, 2026-07-29)

Retried the PageSpeed Insights API before writing this off again — still
**HTTP 429** (keyless quota), same as T-36. T-36 stays genuinely open;
this is not a new attempt superseding it, just confirmation the blocker
hasn't cleared on its own. Re-ran the same `curl`-based weight measurement
from T-36 against the now-deployed M5 build, across every route M5 touched:

| Route | HTML | TTFB |
|---|---|---|
| `/` | 30.4 KB | 0.12 s |
| `/explore` | 25.5 KB | 0.44 s |
| `/about` | 42.7 KB | 0.36 s |
| `/posts/rpplh-south-papua` | 37.7 KB | 0.49 s |

HTML grew on every route — expected, since each now ships **both**
Reading and Immersive markup in one document (ADR-003's chosen tradeoff:
paid in HTML bytes to every visitor, avoided paying in a second island, a
second route tree, or a runtime fetch). The homepage's own HTML roughly
doubled (17.7 KB → 30.4 KB) primarily from the DATUM index's 11 plates.

**The number that actually matters — does Reading Mode pay any JS/font
cost for Immersive Mode existing — checked directly:**

- Homepage JS: `Header.astro` script (397 B br) + `RegistrationSeam`
  script (615 B br) ≈ **1.0 KB br total**, comfortably under ADR-003's 2
  KB budget for the Tier-1 mode mechanism.
- `archivo-variable-latin.woff2` (T-41's self-hosted Immersive typeface):
  **zero occurrences** in the default-mode homepage HTML — confirms the
  lazy `@font-face` behavior verified in T-41 still holds against the real
  deployment, not just the local preview.
- Scrollytelling bundle (`/posts/rpplh-south-papua`, the heaviest route
  type): **219,838 bytes br (~215 KB)** total across `client.js` +
  `mode-toggle.js` + `react-dom.js` + `PieChart.js` + `Scrollytelling.js` +
  the header script — versus **~220 KB** measured in T-36, before any M5
  dual-mode code existed. The entire S1–S5 addition (ADR-003 mechanism,
  DATUM composition, Archivo font, registration seam, view transitions)
  added under 1 KB to this page's JS weight.

This is still not a Lighthouse score — no CWV timing, no accessibility or
SEO audit categories — see T-36 in `docs/TASK.md` Backlog for what's still
needed and from whom.

## Post-M6 remeasurement (T-62, 2026-07-30)

T-36 stays open and untouched this round — not re-attempted, since the last
two tries (T-36, T-44) both hit the same `HTTP 429` keyless-quota wall with
no sign it clears on its own; see T-36 in `docs/TASK.md` Backlog.

**Methodology differs from T-36/T-44 on purpose**: M6 has not been pushed
yet (16 local commits ahead of the deployed M5 site as of this entry), so
measuring the *live* URL the way T-36/T-44 did would just remeasure the old
M5 build, not Atlas. Measured instead via `curl` against `astro preview`
(the real production `dist/` build) on localhost — a legitimate stand-in
for "the production build," same server this session already used to
verify every M6 task, just not yet the deployed origin. Two consequences,
both flagged rather than silently glossed over: (1) `astro preview`'s
`compression` middleware only negotiates **gzip**, not the **brotli** T-36/
T-44 measured against Vercel's CDN — gzip runs a few percent larger than
brotli on the same text, so these numbers aren't a byte-exact comparison
against the earlier tables, only a relative-trend one; (2) TTFB is
loopback-to-localhost, not a real network path — expect it near zero
regardless of route, not comparable to T-36/T-44's ~0.1–1s figures.

| Route | HTML (gzip) | TTFB (loopback) |
|---|---|---|
| `/` (Sheet Index) | 7.4 KB | 6 ms |
| `/topics` | 4.1 KB | 8 ms |
| `/about` (Dossier) | 5.7 KB | 9 ms |
| `/posts/rpplh-south-papua` (scrollytelling) | 9.2 KB | 34 ms |

Chosen to track the same shape of route T-44 covered (index, a secondary
listing, About, the heaviest scrollytelling post) while swapping in M6's
renamed/rebuilt equivalents (`/explore` → `/`, `/tags` → `/topics`).

**The number that actually matters — did T-59's `useReducedMotion()` +
`sr-only` table additions meaningfully grow the scrollytelling bundle**,
checked directly via chunk-import tracing (same technique as T-36/T-44):
`client.js` (56.5 KB gz) + the post's own island chunk (5.5 KB gz) +
`PieChart.js` (5.4 KB gz) + `Scrollytelling.js` (143.0 KB gz) +
`react-dom.js` (4.3 KB gz) = **~693 KB raw / ~209 KB gzip total**. Against
T-36's pre-M6 baseline (**~220 KB br**) and T-44's post-M5 figure
(**~215 KB br**), this is flat within measurement noise — T-59 added
conditional ternaries and markup to existing code, zero new dependencies,
exactly as expected. (Not a regression given the gzip-vs-brotli caveat
above either — gzip run against the *same* build would read a few percent
higher than brotli on identical bytes, so ~209 KB gzip is if anything a
slightly pessimistic reading next to the brotli-measured priors, not an
optimistic one.)

## Known gaps

- **Partially closed (M10/T-76.)** There is now one automated test file,
  `tests/story-progress.test.mjs`, covering `computeStageState` — see "How to
  run". Everything else still relies on build-time schema/type validation plus
  manual browser verification each session. That remains acceptable for a
  solo-maintained static content site, and the story framework is exactly the
  "client-side interactivity" this gap warned about: the first piece of it to
  carry real logic got the project's first test
- **`astro build` does not typecheck unreferenced modules.** Vite only compiles
  what the build graph reaches, and TypeScript is not installed here, so a file
  no page imports is never checked at all. Currently affects the M10 framework
  modules built ahead of their first consumer (DEBT #4). Closes either at T-78
  or by adding `@astrojs/check` + `typescript` and putting `astro check` in the
  build script
  beyond the current zero-JS-by-default islands (ADR-001).
- No automated accessibility or Lighthouse check wired into CI — both are
  checked manually per session (see docs/PROJECT_BRIEF.md's Lighthouse ≥ 90
  success criterion) but nothing fails a build if they regress.
