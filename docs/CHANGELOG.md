# Changelog — knowledge-hub

All notable changes to this project. Format follows
[Keep a Changelog](https://keepachangelog.com/); versions follow SemVer once
the project starts tagging releases.

<!-- Rules:
     - Add entries under Unreleased as you work (same commit as the change).
     - On release: rename Unreleased to the version + date, start a new
       Unreleased section above it.
     - Categories: Added / Changed / Fixed / Removed / Security. -->

## [Unreleased]

### Added

- **Story framework** (M10, T-71–T-80, [ADR-005](decisions/ADR-005-story-framework.md)),
  rebuilding how a scrollytelling post is put together. A post's prose now
  lives in its MDX body as real markdown rather than as JSX inside a
  TypeScript module, so it is editable content, indexed by Pagefind as
  content, and readable with JavaScript disabled. Structure (hero, source,
  per-scene citations) moved to zod-validated frontmatter. The visual stage
  is now the only hydrated part of the page and receives the reader's
  position — scene, progress through it, progress through the story,
  direction — instead of the previous all-or-nothing swap, which makes a
  visual that persists and morphs across scenes possible at all.
- **Focus mode** for a single story (T-80): one control hides the site
  chrome so the stage takes the whole viewport. Not a second theme —
  nothing is recoloured and no component gains a second design. Escape
  exits, and the reading position is preserved in both directions.
- **Cover morph between pages** (T-73): navigating from any index into a
  post animates that post's cover into its new position, using the CSS
  View Transitions the site already opted into. Zero JavaScript. Browsers
  without support keep the existing crossfade.
- **First automated tests** (T-76, T-77): `npm test`, 14 suites over the
  scroll maths and the map projection, using Node's built-in runner with no
  new dependencies. Deliberately narrow — these are the two pure
  computations a build cannot check.
- **Spatial layer groundwork** (T-77): a Web Mercator projection and
  geometry interpolation written from scratch, so hand-authored map shapes
  can morph between two states. No map library, no tile requests, no new
  dependency.

### Fixed

- **Two published research figures read `0`.** The counters in the Bontang
  and South Papua posts initialised at zero, and because Astro renders
  islands to static HTML, that zero shipped: anyone reading before the page
  hydrated — JavaScript disabled, a slow or failed load, a crawler — saw
  zero where an extreme-poverty count (238,464) and a 1.2-million-hectare
  area belong. Both now render the real figure with no JavaScript at all
  (T-74).
- **In-page links landed behind the sticky header.** Every table-of-contents
  jump scrolled its heading to the very top of the window, where the collar
  covered it. Headings now land clear of it (T-72).
- **Topic chips had no hover state** at all, despite being the site's main
  way of moving between topics (T-72).
- **Nothing on the site responded to being pressed** — no control had an
  active state. Buttons, plates, and controls now acknowledge a press
  (T-72).
- Scrollytelling chrome animated for 400ms and one panel for roughly 500ms,
  past the site's own 300ms ceiling. Both had escaped every audit because
  the check greps for millisecond values and these were written in seconds
  in JavaScript (T-72).
- A post's cover hover was near-invisible: it changed one near-black border
  to another. The plate's land-class hatch now strengthens instead (T-72).
- Scrollytelling posts shipped with no `<h1>`, starting their heading order
  at level 2 (T-75).
- The sources panel could not be closed with Escape and did not return
  focus to the control that opened it (T-75).

### Changed

- Easing curves. Every transition on the site used CSS's default `ease`,
  which brakes so late that a 120ms hover spends most of its time barely
  moving and then arrives abruptly. Two curves replace it. Durations are
  unchanged — still exactly three values (T-72).
- Prose in the three migrated posts renders with typographic quotes
  throughout. Previously the same page mixed straight and curly apostrophes
  depending on whether a sentence lived in a JSX expression or a string
  literal. No wording changed: every scene was compared as rendered output
  before and after, and word counts, character counts, and links are
  identical (T-79).

- **Editorial layer** (M7, T-63–T-65), completing Atlas's knowledge-graph
  scaffolding from M6: all 20 `/topics/[topic]` pages now show a real
  one-sentence definition instead of the graceful-empty state; every post
  gained 2–5 inline cross-links to related posts in its own body prose
  (`ScrollytellingSection.body` moved from `string` to `ReactNode` so the
  4 scrollytelling modules could carry links too, not just the 7 plain-MDX
  posts); 6 posts gained an `impact` stamp (station/line counts, hectares
  mapped, indicator counts) sourced from numbers already published in that
  post's own content.
- **Atlas — one visual identity** (M6, T-45–T-62), replacing M5's dual-mode
  mechanism. Design tokens: 9 roled colors (`--color-research`/`-project`/
  `-flag` split apart what one `--color-accent` used to do, `--color-line-
  strong` for interactive-control borders at real WCAG contrast), a single
  variable Archivo family for both display and body via its `wdth` axis,
  self-hosted IBM Plex Mono for coordinates/notation, and radius zero
  site-wide. New shared components: `Plate` (one content container, three
  sizes, replacing `PostCard`+`PostListItem`), `LegendRail`+`TopicChip` (a
  permanent 224px rail below ≥1024px, a drawer above it, doubling as the
  type filter), a two-row collar header (nav + sheet-notation breadcrumb +
  skip-link), and a four-column footer.
- `lib/topics.ts` — co-occurrence-based topic counts and neighbour
  computation (no manual topic list), backing a new `topics` content
  collection and `/topics` + `/topics/[topic]` routes (replacing `/tags`).
- `/` is now the Sheet Index (one lead plate + a standard grid), shared
  with `/explore/[type]` as the same component filtered; post detail pages
  gained a rail of marginalia (section nav, sheet stamp, project controls,
  topic chips, related plates); `/projects/[name]`, `/about` (rewritten as
  one Dossier composition with real contact promoted into it), and
  `/photography` were all rebuilt on the new component set; `404` gained a
  mini type-legend.
- A real search dialog (opened by a header control or the `/` shortcut,
  closed by `Esc`) mounting Pagefind's classic UI widget on first open,
  restyled to Atlas's tokens via `--pagefind-ui-*` overrides — previously
  Pagefind only existed on the retired `/explore` page with its default
  zinc-palette CSS.
- `useReducedMotion()` now gates every animation in all 4 scrollytelling
  data modules (previously only the shared shell called it), and every
  Recharts chart in those modules (15 total) got a screen-reader-only data
  table, closing a real WCAG 1.1.1 gap.
- OG image generation (`lib/og-image.ts`) now renders with Atlas's palette
  and typefaces (Archivo + IBM Plex Mono) instead of the retired cream/
  Bodoni-Karla combination.

- **Immersive Mode** — a second, self-hosted visual identity ("DATUM")
  alongside the existing cream-paper "Reading Mode," switchable via a
  persistent header toggle or a draggable registration seam on the
  homepage. Near-black palette (`#05090C`), a self-hosted variable Archivo
  typeface (width + weight axes), and a distinct composition on Home
  (`ImmersiveIndex.astro` — a survey-sheet index of all posts organized by
  type, each with a real-world coordinate), `/explore` (reuses the same
  index), and `/about` (`ImmersiveDossier.astro`). Every other page
  automatically inherits the Immersive color/font palette without a
  bespoke composition. Both identities ship in the same static HTML —
  ADR-003 remaps the same 8 color tokens under `:root[data-mode=
  'immersive']` rather than adding a second island or route, so Reading
  Mode pays zero extra bytes for Immersive Mode's existence.
- Registration seam: a draggable handle on the homepage that peels back
  Reading Mode to reveal Immersive Mode underneath in real time
  (`clip-path`, pointer events, full keyboard support via arrows/Home/
  End), snapping to whichever mode has the majority on release.
- Cross-document view transitions (`@view-transition { navigation: auto }`)
  — same-origin page navigations crossfade instead of hard-cutting, pure
  CSS with no client-side router.
- `repo:`/`demo:` frontmatter on all three `type: project` posts, using
  real GitHub URLs, plus generated editorial cover art for each (hand-
  authored SVG rasterized at build time — same tooling as the OG image
  generator) — each cover encodes a real fact from its post rather than
  being decorative or a screenshot.
- Optional `coordinates` field on the content schema (a real-world DMS
  string, display-only) — filled for 10 of 11 posts.
- Motion rules consolidated into `docs/RULES.md` (T-44): reduced-motion
  handling, animation-loop restrictions, focus/keyboard requirements for
  interactive controls, and the "first-paint-correct values belong in
  CSS, not script" pattern that recurred throughout M5.

- Project scaffolded from Claude Engineering OS (2026-07-16).
- Astro 7 + Tailwind CSS v4 + MDX site: content collection `posts` with a
  zod-validated schema (T-01, T-02).
- Home, Explore (with type filter), post detail, About placeholder, 404
  (T-03, T-04).
- Three real project case studies: Jabodetabek-Connect, Jakarta Transit
  Heritage Explorer, CDMP-Jabodetabek (T-05–T-07).
- Deployed to Vercel, connected to GitHub for auto-deploy on push (T-08).
- Tag filtering (`/tags`, `/tags/[tag]`) (T-09).
- Related posts on post detail pages, scored by shared tags/project (T-10).
- Project hub pages (`/projects`, `/projects/[name]`) (T-11).
- Client-side search on Explore via Pagefind (T-12).
- Real About page content (bio, education, expertise, experience,
  documents) and four GIS/urban-planning research case studies migrated
  from the previous portfolio site (T-13).
- Static table of contents and computed reading time on post detail pages
  (T-14).
- Interactive experience timeline on the About page — expandable entries
  (native `<details>`) with role descriptions sourced from the old
  portfolio's content deck, translated and condensed (T-15).
- Branded OG image per post (Satori + resvg, generated at build time) plus
  a site-wide default; full `og:*`/`twitter:*` meta tags and `<link
  rel="canonical">` on every page (T-16).
- Sitemap (`@astrojs/sitemap`), RSS feed of all posts (`/rss.xml`, with
  autodiscovery link and a footer link), and a `robots.txt` pointing at the
  sitemap (T-17).
- Vercel Web Analytics (`@vercel/analytics/astro`) in `BaseLayout` (T-18).
- Photography section: new `type: "photo"` on the `posts` collection
  (cover required, enforced at build), `/photography` gallery grid, nav
  link, a photo-specific (uncropped) cover treatment on the post detail
  page, and three real photos from the Tanggamus coast, Lampung (Oct 2022)
  (T-19).
- ADR-002: adopt Astro Islands for bounded client-side interactivity —
  React islands for rich experiences (scrollytelling), vanilla `<script>`
  for simple DOM interactions (carousel); default stays zero-JS SSG.
- Research scrollytelling (ADR-002 tier 2, first React island): opt-in per
  post via `presentation: "scrollytelling"` frontmatter (scoped to `type:
  research`), a reusable shell (`src/islands/Scrollytelling.tsx` — sticky
  viz column swapped via `IntersectionObserver`, Sources panel, keyboard
  snap-nav, mobile fixed viz dock, `prefers-reduced-motion`-aware), re-skinned
  to the site's cream-paper identity. Pilot post:
  `cikarang-industrial-settlement-pattern`, re-telling the province-scale
  land-use and building-growth findings of its published paper (Rahman &
  Hernanda, 2025, Jurnal Tunas Geografi) across 7 sourced, chart-backed
  sections (T-25).
- Second scrollytelling post: `bontang-poverty-mapping` (T-28), reframed
  from a Bontang-only case study to Bontang's role within Bappeda
  Kalimantan Timur's province-wide poverty mapping study — Bontang was the
  only one of the province's ten kabupaten/kota to complete both analysis
  tracks (hotspot mapping + 19-indicator characteristic clustering) at the
  time of the source report. No individual-level P3KE records (names,
  NIK, addresses) are reproduced — every figure is an aggregate already
  public in the source presentation.
- Third scrollytelling post: `jabung-lampung-coastal-development` (T-29),
  with a methodology correction — the previous version described a
  "gravity model," but the source report's actual method is a Skalogram
  settlement-hierarchy analysis across 12 kecamatan plus SWOT (the word
  "gravity"/"gravitasi" does not appear anywhere in the 93-page report).
  Sorts the study area into one main growth pole (Way Jepara), four
  secondary centers, and seven hinterland kecamatan, tracing the case for
  one Agropolitan zone (Bandar Sribhawono) and one Minapolitan zone
  (Labuhan Maringgai + Pasir Sakti) directly to that hierarchy.
- Fourth and final scrollytelling post of this batch: `rpplh-south-papua`
  (T-30) — South Papua's draft RPPLH measured against the national Food
  Estate program's 1.2-million-hectare footprint: 471,026 ha of overlapping
  customary/sacred land across 7 categories, ecosystem-service vulnerability
  scores (74.63% high food-provisioning, 67.88% very-high biodiversity
  support — the same land scores high on both), village development status
  (89% of 125 villages under/very-underdeveloped), and field findings
  (excavators, road construction outpacing AMDAL permitting). Closes on the
  OAP Sasi tradition as a customary conservation practice.

### Changed

- IA restructure (M6, ADR-004): `/explore` folded into `/` (same component,
  optionally filtered by type), `/tags`/`/tags/[tag]` renamed to `/topics`/
  `/topics/[topic]` — both old paths now 308-redirect via `vercel.json`.
  `/posts/[slug]` did not move, preserving existing external citations.
- Motion duration convention consolidated (M6, T-62): 120ms for hover/color
  transitions, 200ms for layout/position changes, 300ms as a hard ceiling
  — replacing M5's ad hoc 300ms/220ms figures. See `docs/RULES.md`.
- Final visual identity applied site-wide, replacing the M1 provisional
  zinc/Plus Jakarta Sans tokens: cream paper palette, Bodoni Moda (display +
  article body) paired with Karla (UI/meta), sharp/minimal corner radii in
  place of pill/rounded-lg defaults (T-14).
- Medium-style reading polish scoped to `type: article` posts: drop cap,
  centered pull-quote, and a narrower measure (`--container-prose`, 42rem);
  project/research posts keep the full content width (T-23).
- Scrollytelling posts (T-27) now **fully replace** the MDX body instead of
  appending the island below it: page-level title/dek/cover image/table of
  contents are skipped, and the meta row drops the `· X min read` segment —
  the island's own hero and Sources panel already cover title, dek, and
  citations. The per-post island-mounting pattern was generalized
  (`isScrollytelling` boolean + one explicit `post.id` branch per post) so
  adding the next scrollytelling post is a mechanical two-line diff.
- Featured Projects on Home is now a drag/swipe carousel (`scroll-snap` +
  vanilla-JS click-drag and prev/next buttons), per ADR-002 tier 1 — works
  as a plain scrollable row with zero JS (T-24).
- ADR-002 clause 4 clarified (ADR-003, T-37): the global-layout island ban
  applies to framework hydration, not to every byte of JavaScript — a
  single Tier-1 vanilla script (the mode toggle) is now explicitly
  permitted there, budgeted at ≤2KB gzip.
- All 4 scrollytelling data modules: chart labels, captions, and citation
  locators translated from Indonesian to English (T-34) — the scope turned
  out far larger than the handful of strings originally flagged, though
  established domain loanwords already used in the surrounding English
  prose (RTRW, Skalogram, kecamatan, IPD/IDM, P3KE, AMDAL) were
  deliberately kept as-is.

### Removed

- Dual-mode mechanism — Immersive Mode, the registration seam, and
  `mode-toggle.ts` — superseded by Atlas's single identity (M6, ADR-004,
  which supersedes ADR-003 #3–#5 while keeping #1–#2). Cross-document view
  transitions (`@view-transition { navigation: auto }`) were kept
  unchanged; they were never mode-specific. `ImmersiveIndex.astro`/
  `ImmersiveDossier.astro` weren't deleted outright — rewritten in place as
  `SheetIndex.astro`/`Dossier.astro`, Atlas's replacements for the same
  routes.
- Bodoni Moda and Karla — the last two references were `lib/og-image.ts`'s
  fonts, migrated to Archivo + IBM Plex Mono (M6, T-61); the live site's
  own `<link>`s were already gone since M6 S1 (T-49).
- `TypeFilter.astro`, `explore/PostList.astro`, `RelatedPosts.astro`,
  `PostListItem.astro`, `Contact.astro`, `SectionHeading.astro` — each
  retired the moment its last caller was rebuilt on `Plate`/`LegendRail`/
  the post-detail rail marginalia (M6, T-50/54/55/57/58). Carousel drag on
  Featured Projects (T-24, M4) died as an indirect consequence of
  `FeaturedProjects.astro` itself being retired, not a direct removal.
- `type: "journal"` merged into `type: "article"` — only one post used it
  and it rendered identically; the sole journal post was migrated (T-22).

### Fixed

- `Plate`'s fixed-pixel cover column (300px for the lead size) didn't
  narrow on small screens, exposed once the Sheet Index became the first
  real caller to render a lead plate with a cover; below 480px the cover
  and text now stack vertically instead (M6, T-55).
- A self-referential `.hatch-*`/`.control-*` comment in `global.css`
  contained a literal `*/`, closing the CSS comment early and silently
  breaking the production CSS optimizer with an easy-to-miss warning
  (build still "succeeded") (M6, T-56).
- The post-detail table of contents rendered twice at once on mobile — the
  breakpoint-exclusive `display` rule targeted `.post-main > nav`, but
  `<nav>` is `TableOfContents.astro`'s own root element carrying its own
  Astro scope-hash, which the parent page's scoped selector can't reach
  across a component boundary; fixed with `:global(nav)` (M6, T-57).
- `--pagefind-ui-*` token overrides initially lost to Pagefind's own
  built-in `:root` defaults, because its stylesheet is injected (and thus
  loads) after the site's own — a tie on selector specificity that source
  order then decides. Fixed by bumping to `html:root`, which wins
  regardless of load order (M6, T-60).
- Post detail pages now render their `cover` image (was silently unused).
- Project titles on `/projects` respect real acronyms (e.g.
  "CDMP-Jabodetabek") instead of naively title-casing the URL slug.
- Mobile header nav overflow at 375px, exposed by adding the fourth
  "Photography" link (T-19).
- The brief's success criterion — a post reaching its project's repo/demo
  in ≤2 clicks — was broken at every hop: the site's one `repo:` link
  pointed at the wrong GitHub org (404), the three project posts had
  neither `repo:` nor `demo:` set, and "Project: X" on the post page
  rendered as plain text instead of a link to the project hub. All fixed
  (T-31, T-32).
- `public/portrait.png` was a 982KB raw PNG serving a 128px avatar on
  `/about`; moved to `astro:assets` (T-35), −98.8% file size.
- Two `repeat: Infinity` animations in the Cikarang scrollytelling charts
  — a WCAG 2.2.2 (Level A) pause-control failure — now play a finite
  number of times (T-35).
- `--font-mono` was referenced 8 times across the scrollytelling shell but
  never declared, silently falling back to Tailwind's default stack;
  now explicit (T-35).
- A keyboard user could never focus the registration seam's grip to begin
  a drag — it was `display:none` until a drag was already in progress,
  and a hidden element can't receive focus. Found via testing; the grip
  is now always rendered and focusable (T-42).
- The registration seam's grip sat half off-screen at its 0%/100% resting
  positions on narrow viewports; clamped to stay fully on-screen at every
  width (T-42).
