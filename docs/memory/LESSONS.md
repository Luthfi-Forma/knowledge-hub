# Lessons Learned — knowledge-hub

## 2026-07-21 — This session's Browser-pane tool doesn't fire IntersectionObserver, requestAnimationFrame, or ResizeObserver [harvested 2026-07-21]

Tags: #browser-verification #react #recharts

Discovered incrementally across T-25/28/29/30 while verifying scrollytelling
posts: this project's `mcp__Claude_Browser__*` tool, in this environment,
never fires any paint/compositor-tied browser callback —

1. `IntersectionObserver` — confirmed via a from-scratch test observer that
   never received even the spec-guaranteed initial callback. This is why
   `client:visible` hydration never triggers (Astro's directive is
   IO-based) and why the in-island `useActiveSection` hook never updates on
   scroll.
2. `requestAnimationFrame` — confirmed by queuing a self-rescheduling rAF
   loop and polling a counter; it stayed at 0 after a 500ms wait. This is
   why `AnimatedNumber` components display a frozen `0` instead of
   counting up.
3. `ResizeObserver` — confirmed indirectly: a `recharts` `<ResponsiveContainer>`
   rendered zero `<svg>` elements and `getBoundingClientRect()` on its
   container returned all-zero, even though the parent chain has real
   computed CSS height (`h-[68vh]` etc.). Recharts measures via
   `ResizeObserver` and never draws without a real measurement — this is
   *not* a rendering bug in the chart code, it's this same class of issue.

**Working verification technique** (used repeatedly this session, always
reverted before commit): temporarily change the target `client:*` directive
to `client:load` (bypasses the IO-gated trigger) *and* temporarily hardcode
the shared shell's `useState(ids[N])` initial value in
`src/islands/Scrollytelling.tsx` to force a specific section active, then
check `document.querySelectorAll('svg').length` and `.textContent` on the
sticky viz box. This proves the component mounts, the specific chart/data
renders correctly, and there are no console errors — independent of the
scroll-linked swap, which cannot be observed in this tool at all. Always
`git diff src/islands/Scrollytelling.tsx` after reverting to confirm a
clean no-op before committing (a stray hardcoded `useState(ids[N])` left
in the shared shell would silently break every scrollytelling post at once).

Real browsers (Chrome/Firefox/Safari/Edge) support all three APIs
natively and have for years — this is specific to the automated tool, not
a site defect. A real-browser sanity check after each scrollytelling
deploy is still worth doing once, per the existing "Known verification
gap" note in ARCHITECTURE.md.

## 2026-07-21 — `pdftoppm` (Read tool's PDF-page renderer) isn't installed here; `pdftotext` + PyMuPDF (`fitz`) fill the gap [harvested 2026-07-21]

Tags: #pdf #tooling

The `Read` tool's built-in PDF handling (page-range rendering) depends on
`pdftoppm` (poppler-utils), which errored as not installed in this
environment. Two things ARE available and cover the same need:

- `pdftotext -layout <pdf> <out.txt>` (poppler-utils' text extractor,
  found at `/mingw64/bin/pdftotext.exe` — poppler is partially installed,
  just missing the image-rendering binary) — fast, good for text-heavy
  reports (a 93-page formal report extracted cleanly with real paragraph
  structure), but produces garbled/unusable output for slide-deck-style
  PDFs whose content is mostly infographics (chart labels scatter with no
  positional meaning once flattened to text).
- For those slide-deck PDFs, rendered individual pages to PNG directly via
  Python's `fitz` (PyMuPDF, already installed — `python -c "import fitz"`
  succeeds): `fitz.open(path)[page_index].get_pixmap(dpi=110).save(out.png)`,
  then read the PNG with the `Read` tool as an image. Wrote this as a small
  reusable script (`render_pdf.py`) taking a path, a filename prefix, and a
  comma-separated page list, rather than inlining it in Bash `-c` each
  time (Windows paths with backslashes inside a Python `-c` string hit
  `unicodeescape` decode errors — write the script to a file with a raw
  string constant instead).

Practical split: use `pdftotext` first to get oriented (cheap, fast) on
any PDF; fall back to per-page `fitz` rendering specifically for pages
that read as garbled/low-information text (slide decks, infographic-heavy
reports) rather than rendering every page of every document.

## 2026-07-18 — Additive-first, then full-replace once seen live: a case for shipping the smaller diff first [partially harvested 2026-07-21 — cross-reference sub-point only]

Tags: #astro #product-decisions

T-25 (scrollytelling pilot) deliberately appended the new React island
*below* the existing MDX prose rather than replacing it outright — the
smaller, reversible diff, so the pilot could ship and be judged on its own
merits without also committing to deleting existing content. After seeing it
live on Vercel, the user's actual call was "replace it entirely" (T-27) —
which turned out to be the right call (the island's own hero/Sources panel
already duplicated everything the old prose said), but only became obvious
*after* seeing both versions side by side on a real deployed page, not from
describing the options in the abstract. Two follow-on lessons from doing the
full-replace:

1. **Cross-references baked into content can point at page position, not
   just content.** The scrollytelling section copy said "the thesis above"
   and "the building-level thesis above" — true when the old MDX prose was
   still rendered above the island, silently wrong once that prose was
   removed (nothing "above" the reference anymore). Caught by re-reading the
   rendered page text after the restructure, not by the build (no error) or
   type-checking (plain strings). When removing/reordering content that
   OTHER content refers to positionally, grep the surviving content for
   spatial language ("above", "below", "earlier", "the following") before
   calling it done.
2. **Generalizing a one-off hardcoded gate is cheap if done immediately.**
   The original per-post boolean (`isCikarangScrollytelling`, combining the
   general `presentation` check AND a specific `post.id` check in one name)
   was fine for a single pilot post but would have made every future
   scrollytelling post's diff progressively messier (either copy-pasting a
   similarly-named boolean, or refactoring under time pressure once several
   posts existed). Splitting it into a general `isScrollytelling` boolean
   (drives all the shared UI-skip logic) plus a separate, explicit
   `post.id === '<slug>'` branch per post (still required — ADR-002:
   `client:*` needs a statically-imported component reference, not a
   runtime lookup) cost nothing extra to do at the 2-post mark (well,
   1-pilot-plus-the-next-one-coming mark) and makes every future addition a
   clean, obvious two-line diff (one import + one branch) instead of a
   refactor.

## 2026-07-18 — Astro islands: `layout` is a reserved MDX frontmatter key; `client:*` hydration needs a statically-imported component reference [harvested 2026-07-21]

Tags: #astro #react #mdx

Two gotchas hit back-to-back while wiring the first React island
(scrollytelling, T-25, ADR-002):

1. Named the opt-in frontmatter field `layout: "scrollytelling"`. Build
   failed with `Rolldown failed to resolve import "scrollytelling"` — Astro's
   MDX integration treats a frontmatter key literally named `layout` as a
   magic import path to a layout component (same convention as Markdown's
   `layout:` frontmatter), so a plain string value there gets fed to the
   module resolver instead of the content schema. Renamed the field to
   `presentation` — any other non-reserved name works; the bug is specific
   to the exact key name `layout` in `.mdx` files, not a schema issue.
2. First wiring attempt looked up the island component from a `Record<string,
   Component>` map by `post.id` and rendered the resulting *variable* with
   `client:visible`. Build failed with `NoMatchingImport: Could not render
   ScrollytellingIsland` — Astro's compiler statically analyzes the template
   to know which import corresponds to a `client:*` directive; it can't
   trace a dynamically-assigned variable back to its import. Fix: reference
   the imported component identifier directly in the JSX (`<CikarangThing
   client:visible />` behind a boolean condition), not through a runtime
   lookup. Consequence: each new scrollytelling post needs its own explicit
   conditional branch in the post-detail page — which is fine, since ADR-002
   already rules out a generic auto-chart system per post anyway.

Related, not a bug: a `viz: Record<string, ComponentType>` prop (component
*functions*, not data) can't be passed from `.astro` frontmatter into a
hydrated island either — `client:*` props are serialized to JSON for the
client bundle. Resolved by making each scrollytelling post's data module
export one fully-wired default component (data + viz + the shared shell
composed internally, in React-land where passing component references as
props is normal) instead of exporting raw data for the `.astro` file to
assemble.

## 2026-07-17 — `import.meta.url`-relative file reads break once Vite relocates the module at build [harvested 2026-07-21]

Tags: #astro #vite #build

`src/lib/og-image.ts` (T-16) loads local TTF font files at build time for
Satori with plain Node `fs.readFileSync`. First attempt resolved the path
with the standard ESM idiom — `fileURLToPath(new URL('./og-fonts/x.ttf',
import.meta.url))` — which works perfectly in `astro dev` but threw `ENOENT
.../dist/.prerender/chunks/og-fonts/bodoni-800.ttf` during `astro build`.
Cause: Astro/Vite bundles this module into a chunk under
`dist/.prerender/chunks/` for the prerender step, so `import.meta.url`
correctly points at the *bundled* file's new location — but the raw
`.ttf` files were never copied there (they're read via a runtime `fs` call,
invisible to Vite's static import-graph analysis, unlike an `import`
statement Vite would bundle/copy as an asset). Fix: resolve the path from
`process.cwd()` instead — the project root is stable across dev and build,
unlike the bundled module's own location. General rule: `import.meta.url`-
relative `fs` reads are only safe for files Vite treats as real imports
(copied/inlined); for anything read as a runtime side-channel (`fs`,
dynamic `require`), resolve from `process.cwd()`.

## 2026-07-17 — Verifying computed style right after a same-tick DOM mutation gives a stale read [harvested 2026-07-21]

Tags: #browser-verification #css

Built an expand/collapse `<details>` timeline (About page, T-15) with a
rotating "+" marker driven by `details[open] > summary .marker { transform:
rotate(45deg) }`. First verification attempt set `details.open = true` and
read `getComputedStyle(marker).transform` in the *same* `javascript_tool`
call — got `matrix(1,0,0,1,0,0)` (identity, i.e. "not rotated") every time,
which looked like the CSS rule wasn't matching at all. Spent real effort
chasing a phantom CSS specificity/cascade-layer bug (even tried a Tailwind
`motion-safe:group-open:rotate-45` compound variant first and blamed *that*
for the same symptom) before realizing: reading a computed style
immediately after mutating `.open`/a class/an attribute in the same script
tick can return a stale pre-mutation value — the engine hasn't necessarily
recalculated style before the next line runs. Splitting the mutation and
the read into two separate `javascript_tool` calls (so a real task
boundary/reflow happens between them) showed the correct `matrix(0.707,
0.707, -0.707, 0.707, 0, 0)` (45°) immediately. When a CSS state-change
appears not to apply during verification, re-check with the mutation and
the read in separate calls before concluding the selector/cascade is wrong.

## 2026-07-17 — Prefer plain scoped CSS over deeply-stacked Tailwind v4 arbitrary variants for state-based selectors [harvested 2026-07-21]

Tags: #tailwind #css

While chasing the false-negative above, also independently confirmed that
`motion-safe:group-open:rotate-45` on a `<details class="group">` *did*
generate a real, matching CSS rule in this project's Tailwind v4 build
(`element.matches(selectorText)` returned `true`, and the generated
selector correctly used `:is(:where(.group):is([open], :popover-open,
:open) *)`) — so it likely would have worked once the stale-read issue
above was understood. Switched to a plain scoped `<style>` block
(`details[open] > summary .marker { transform: rotate(45deg) }`) anyway and
kept it, because a 3-deep stacked variant (`motion-safe:` +
`group-open:` + `rotate-45`) relying on the newest CSS nesting/`:is()`
forgiving-selector-list behavior is materially harder to debug than five
lines of plain CSS when something *does* go wrong — plain CSS was verified
correct on the first try once the stale-read issue was fixed. Reserve
Tailwind's stacked arbitrary/state variants for cases with no simple plain-
CSS equivalent; reach for a scoped `<style>` block for anything combining
3+ conditions (motion preference + parent state + descendant).

## 2026-07-17 — Tailwind v4: unlayered custom CSS always beats `@layer utilities`, regardless of specificity [harvested 2026-07-21]

Tags: #tailwind #css

Added `h1,h2,h3 { font-weight: 400; }` to `global.css` (below `@import
"tailwindcss";`, not wrapped in any `@layer`) to reset the browser's default
bold on headings for a font loaded without a 700 weight. Result: every
per-element `font-extrabold`/`font-bold`/`font-medium` utility across the
site silently stopped working — headings all rendered at 400 regardless of
the class applied. Root cause: Tailwind v4's utilities live inside `@layer
utilities`, and CSS's cascade-layer rule is that **unlayered declarations
always win over layered ones**, independent of selector specificity — a
bare element selector (`h1`, specificity 0,0,1) with no layer beat a `.font-
extrabold` class (0,1,0) sitting inside a layer. Fix: wrap custom base CSS
in `@layer base { ... }` so it participates in the same layer ordering as
Tailwind's own base/utilities and utility classes can override it normally.
Caught by asserting `getComputedStyle(h1).fontWeight` in the browser after
applying the class, not by eyeballing rendered text (an 800 vs 400 Bodoni
Moda headline looks subtly different at a glance, easy to miss).

<!-- APPEND-ONLY, newest first. Write an entry after: a bug with a non-obvious
     cause, a milestone retro, or whenever something cost more than an hour to
     learn. Tag with topics (#python #gis #fastapi ...) so /harvest-lessons can
     classify. Mark entries worth generalizing to the OS with [harvest-candidate];
     after harvesting they get marked [harvested YYYY-MM-DD]. -->

## 2026-07-17 — Recovering a Workflow (multi-agent) run after a host crash [harvested 2026-07-21]

Tags: #workflow #git #multi-agent

A background Workflow run (6 parallel agents, each in an isolated
`isolation: 'worktree'`) was killed mid-run by a host BSOD. The resume
notification said "no completion record found... may have been stopped" —
not reassuring on its own. What actually happened, and how to recover:

1. `git worktree list` still showed all 6 worktrees on disk, each pointing
   at a branch. Some had already advanced past the base commit (agent
   finished + committed before the crash); others were still at the base
   commit but had real uncommitted changes sitting in the working tree
   (agent was mid-task when killed) — `git status --short` per worktree
   tells you which is which immediately.
2. `<transcriptDir>/journal.jsonl` (path returned by the original Workflow
   call) has a `"result"` line for every agent that fully finished and
   returned — cross-reference against the worktree list to know exactly
   which 3-of-6 completed vs. which 3-of-6 were interrupted. Don't guess
   from the ambiguous "stopped" notification alone.
3. For the interrupted ones: `cd` into the worktree, check `node_modules`
   already exists (it does — npm install had completed), then just run the
   build yourself. If it passes, the agent's work was actually done in
   substance, just not committed — commit it yourself rather than
   re-running the whole agent (cheaper, and the in-progress work was often
   already complete or nearly so).
4. Locked worktrees (`git worktree list` shows `locked`, left over from the
   killed process) block `git worktree remove` with a single `--force`;
   need `remove --force --force` (or unlock first) once you've confirmed
   their content is safely merged elsewhere.
5. Merging N worktree branches back into `main` one at a time: conflicts
   cluster on shared files multiple agents extended (e.g. everyone
   appending new functions to the end of the same `lib/posts.ts`) — these
   are almost always "keep both sides" merges, not real semantic conflicts,
   because each agent was scoped to touch a different, non-overlapping
   region of the file logically even though the diff lands at the same
   line. Rebuild + browser-verify fresh after ALL merges land, not after
   each individual merge — integration bugs only show up once everything
   is actually combined (here: a post-detail cover-image gap only one
   agent had flagged, plus a whitespace-trim slip that showed up in newly
   written prose independent of any single agent's diff).

## 2026-07-16 — `vercel whoami` can silently complete a device-auth login [harvested 2026-07-21]

Tags: #vercel #deploy

Ran `npx vercel whoami` intending a read-only auth check before deploying.
Instead of erroring or reporting logged-out, the CLI printed "No existing
credentials found. Starting login flow..." and then completed a full device
authorization (`Congratulations! You are now signed in.`) with no visible
interactive approval step — landed authenticated as the user's real Vercel
account. Likely an already-trusted browser session on this machine
auto-approved the device code. Practical effect: `vercel whoami` is **not**
safely read-only in an environment with a live authenticated browser —
treat it as a potential auth action and tell the user it happened, don't
assume "just checking status" has no side effects. `vercel link` afterward
also auto-detected and connected the GitHub remote without being asked to.

## 2026-07-16 — Astro trims newline whitespace around inline elements [harvested 2026-07-21]

Tags: #astro

Text wrapped across multiple source lines around an inline `<a>`/`<span>`
loses the line break's whitespace entirely (not collapsed to one space like
HTML/JSX normally do) — `see <a>Explore</a>\n  for X` renders as
`Explore</a>for X` with no space. Astro's compiler trims leading whitespace
on a new line inside markup. Fix: keep a literal space before the next word
on the *same* line as the closing tag, or use `{' '}`. Only bites
inline/prose text that wraps a link mid-sentence — block-level elements are
unaffected. Caught by reading actual rendered `outerHTML`, not by eyeballing
`get_page_text` output (its whitespace normalization masked the bug).

## 2026-07-16 — Tailwind v4 `focus-visible:outline-*` needs the bare `outline` class [harvested 2026-07-21]

Tags: #tailwind #accessibility

Setting `focus-visible:outline-2 focus-visible:outline-offset-2
focus-visible:outline-{color}` alone renders an *invisible* focus ring —
`outline-style` stays `none` because none of those utilities set it. Need
the bare `focus-visible:outline` class too (sets `outline-style: solid`).
Caught by testing with a real keyboard `Tab` press in the browser and reading
`getComputedStyle(document.activeElement).outlineStyle` — calling
`el.focus()` via JS does **not** trigger `:focus-visible` in Chromium, so
that check silently passes even when the ring is broken; must drive focus
with an actual key press to verify.

## 2026-07-16 — Astro scaffolding gotchas [harvested 2026-07-21]

Tags: #astro

- `npm create astro@latest .` refuses to scaffold into a non-empty directory
  (it silently creates a sibling subfolder instead) — this repo already had
  `docs/`, `CLAUDE.md` etc. from the OS scaffold. Workaround: let it create
  the subfolder, then move the generated files up and merge `.gitignore`
  manually instead of overwriting the project's own root files.
- Astro 7 uses the Content Layer API: collections are declared in
  `src/content.config.ts` (project-root-of-`src`, not `src/content/config.ts`
  like the old Content Collections API), with a `loader: glob({...})` and a
  `schema: ({ image }) => z.object({...})` callback.

## 2026-07-28 — PageSpeed Insights is unreachable from this session by two independent paths [harvested 2026-07-29]

Tags: #browser-verification #tooling #performance

Attempting T-36 (Lighthouse baseline) hit two separate, unrelated blockers —
worth distinguishing since they need different fixes:

1. **PSI web UI (pagespeed.web.dev) hangs indefinitely.** Navigating to
   `pagespeed.web.dev/analysis?url=...&form_factor=mobile` does queue a real
   analysis — `read_network_requests` shows the `batchexecute` POST
   returning `200` — but the page then sits on "Running analysis / data
   loading" forever with zero follow-up polling requests, even after 2+
   minutes and a full page reload. Likely the same class of issue as the
   2026-07-21 entry above (this session's browser tool not firing whatever
   timer/callback the page's polling loop depends on), just manifesting in
   a third-party SPA instead of this project's own code — so it's a
   property of the tool, not something fixable in this repo.
2. **PSI's keyless REST API returns 429**, tried via both `WebFetch` and a
   direct `curl` from the Bash tool (two different network paths, same
   result): `googleapis.com/pagespeedonline/v5/runPagespeed` has a very low
   shared quota for requests with no API key, and it's already exhausted.
   Getting real numbers this way needs a Google Cloud API key.

**Workaround used to still produce something real:** `curl -sI` /
`curl -s --compressed -H "Accept-Encoding: br, gzip"` against the live
Vercel deployment gives genuine TTFB and brotli-compressed transfer weight
per route — not a Lighthouse score (no CWV timing, no accessibility/SEO
audit), but real production numbers, and they independently corroborated
the M4-era "~700KB uncombined / ~220KB gz" scrollytelling-bundle figure
already recorded in `docs/ARCHITECTURE.md` almost exactly. Chunk-import
tracing (`grep` the served JS for `from"./*.js"`, recursively) is a decent
manual substitute for a bundle analyzer when there's no build tooling for
one. See `docs/TESTING.md` § "Measured baseline" for the actual numbers.

**Still true:** getting the real Lighthouse score needs either a real
browser (outside this session's tooling) or a PSI API key — this is a
task-owner action item, not something to keep retrying unattended.

## 2026-07-28 — Existing elements don't repaint after an in-page CSS custom-property attribute mutation in this session's browser tool [harvested 2026-07-29]

Tags: #browser-verification #css #immersive-mode

Verifying T-39 (the `data-mode="immersive"` toggle, ADR-003) hit a variant
of the already-documented rendering-pipeline gap above (IntersectionObserver
/ rAF / ResizeObserver never firing) — this time for a completely different,
very standard technique: `:root[data-mode='immersive'] { --color-paper:
#05090c; ... }` plus `body { background-color: var(--color-paper); }`, the
same pattern countless dark-mode toggles use.

Symptom, isolated with three separate probes:

1. `document.documentElement.dataset.mode = 'immersive'` then, in a
   **separate** `javascript_exec` call (to avoid the same-tick stale-read
   gotcha two entries above), `getComputedStyle(document.documentElement)
   .getPropertyValue('--color-paper')` correctly returned the new value
   (`#05090c`) — the custom property itself updates fine.
2. But `getComputedStyle(document.body).backgroundColor` — set purely by
   `body { background-color: var(--color-paper) }`, confirmed via
   `document.styleSheets` traversal to be the *only* rule touching that
   property, no competing rule — stayed stuck at the old value
   (`rgb(245, 239, 225)`), even after `void document.body.offsetHeight`
   (the standard force-synchronous-reflow trick) before reading.
3. A **freshly created** `<div>` with an *inline* `style.background =
   'var(--color-paper)'`, appended and immediately queried, correctly
   resolved to the new value. So `var()` resolution itself works — only
   already-rendered elements relying on a *stylesheet* rule fail to
   repaint after the attribute mutation.

**A genuine full page reload (`navigate`) with the preference already in
`localStorage` renders correctly from the first paint** — `body`
background, text color, and the accent custom property all matched the
Immersive palette exactly, because the pre-paint `is:inline` script in
`BaseLayout.astro`'s `<head>` sets `data-mode` before this environment's
first (and apparently only reliably-computed) style pass.

**Working verification technique:** never trust a live in-page toggle click
in this tool. Set the preference in `localStorage`, then `navigate()` to
force a real page load, then read computed styles in a follow-up call. This
is the same "reload rather than mutate-and-read" shape as the `client:load`
+ hardcoded-`useState` workaround two entries above — different API, same
root cause (this session's browser doesn't reliably run parts of a real
browser's rendering pipeline for in-page mutations, only for full
navigations). Real browsers handle in-page custom-property attribute
toggles like this correctly and near-instantly — dark-mode libraries have
used this exact pattern for years — so this is a tooling gap, not a defect
in the toggle mechanism itself. Relevant for verifying any future
Immersive-mode work (T-40 composition, T-42 registration seam) that
involves toggling `data-mode` live rather than reloading with it pre-set.

## 2026-07-28 — Same gap, different property: `left: clamp(..., var(--x), ...)` on a JS-mutated element also doesn't repaint in this tool [harvested 2026-07-29]

Tags: #browser-verification #css

Building T-42's registration seam grip hit the exact same class of bug as
the entry above, on a different CSS property — worth recording separately
because the fix generalizes into a real rule, not just a workaround for
verification.

Setup: `.seam-grip { left: clamp(1.375rem, var(--seam), calc(100% -
1.375rem)); }`, with `--seam` set via `stage.style.setProperty('--seam',
...)` inside a regular (non-`is:inline`) `<script>` that runs *after*
first paint. On page load with the value already meant to be `100%`
(persisted mode = immersive), the grip rendered at `left: 22px` — the
clamp's MIN, as if `--seam` were still its `@property`-declared
`initial-value: 0%`.

Isolated with a fresh test element (`document.createElement('div')`,
`--seam` set before ever assigning `left`): the identical clamp formula
resolved correctly (353px, the MAX) immediately. So `clamp()` and the
registered `@property` are both fine — the failure is specific to an
**already-painted element whose custom property is mutated by JS after
that first paint**, same root cause as the body-background finding above.

**Fix (not just a test workaround — a real code fix):** stopped relying on
the script to set the resting position at all. Added a plain CSS rule
mirroring the already-proven-reliable color-remap pattern —
`:root[data-mode='immersive'] .seam-stage { --seam: 100%; }` — so the
correct value is present from the *first* paint via the pre-paint
`data-mode` stamp, never mutated on an existing element for the resting
state. Confirmed correct afterward via a genuine reload in this tool
(`left: 331px` of 375px viewport, i.e. clamped to the right edge). The
script's `setSeam()` call still runs on load and during drags/keyboard
input, but no longer carries the only-path responsibility for the resting
position.

**Generalized rule for this project:** for anything that must be correct
on first paint under `data-mode='immersive'` (not just something that
merely CAN be toggled later), set it in CSS via the `:root[data-mode=...]`
selector, not by having a `<script>` compute and apply it after the fact —
even when the JS approach would be correct in a real browser. This
sidesteps the tooling gap entirely rather than working around it per
verification, and is arguably better practice regardless (one less thing
depending on JS execution order).

## 2026-07-29 — Astro scoped `<style>` does not reach into child components' own root elements [harvested 2026-07-30]

Tags: #astro #css-scoping

Hit twice this session, both times as a silent no-op rather than an error:
Plate.astro's `.plate-cover img` never matched an `<Image>`-rendered
`<img>` (T-50), and `posts/[slug].astro`'s `.post-main > nav` /
`.post-rail > nav` never matched `TableOfContents.astro`'s `<nav>` root
element (T-57) — both TOC copies rendered simultaneously on mobile
instead of the CSS toggling between them.

Root cause: Astro's scoped-style mechanism stamps each component's
compiled output with *that component's own* scope-hash attribute. A
child component's root element carries the child's hash, not the
parent's — so a parent selector like `.post-main > nav` compiles to
something like `.post-main > nav[data-astro-cid-PARENTHASH]`, which can
never match a `<nav data-astro-cid-CHILDHASH>` rendered by a child. This
is invisible in the source and produces no build warning; it just quietly
never applies.

**Fix**: wrap the un-namespaced tag selector in `:global()` — e.g.
`.post-main > :global(nav)`. **Generalized rule**: any parent-scoped CSS
selector that targets a bare tag/class expected to be a *child
component's own root element* (not an element the parent itself renders)
needs `:global()`. Check this class of bug specifically whenever a new
child component's root element is targeted from a parent's `<style>`
block for the first time.

## 2026-07-29 — A CSS comment containing the literal substring `*/` self-terminates early [harvested 2026-07-30]

Tags: #css #build-tooling

In `global.css` (T-56), a comment reading `.hatch-*/.control-*` (word
separator `-*` immediately followed by `/control-*`) contains the literal
two-character sequence `*/`, which is the CSS comment terminator — so the
comment closed after `.hatch-*` and the remaining text (`.control-*` plus
the real closing `*/`) became live, invalid CSS. This produced only a
production-optimizer warning ("Unexpected token Delim('*')"), not a build
failure — `npm run build` still reported success, making it very easy to
miss.

**Fix**: reword to avoid the literal `*/` sequence (e.g. spell it out as
"`.hatch-*` dan `.control-*`" instead of joining them with a slash).
**Generalized rule**: never write `*/` as a literal substring inside a CSS
comment's text, even when it reads naturally as a word/path separator —
grep for `\*/` inside comment bodies specifically after editing any
comment that discusses glob-style or path-style class name patterns.

## 2026-07-29 — `document.documentElement.scrollWidth` can be a false positive for horizontal overflow when `position:fixed` + `transform`-animated elements are present in this tool [harvested 2026-07-30]

Tags: #browser-verification #css-overflow

While verifying the Sheet Index at a 375px viewport (T-55),
`scrollWidth` reported 468px — looked like a real horizontal-overflow
regression from the Plate cover-column fix just applied. It wasn't:
`window.scrollX` stayed 0 after `scrollTo(1000, 0)` (a real overflow
would have let the page actually scroll), and an exhaustive
`getBoundingClientRect()` sweep over every DOM element found no element
whose right edge exceeded the 375px viewport (max was 375.2px, i.e.
rounding noise). The likely cause is `LegendRail`'s drawer, which uses
`position: fixed` + `transform: translateX(-100%)` — this combination
appears to confuse `scrollWidth` measurement in this session's specific
browser tool, not in real browsers.

**Working verification technique**: when `scrollWidth` suggests overflow
but the page "feels" fine, cross-check with (1) `window.scrollX` after a
forced `scrollTo` (does the viewport actually move?) and (2) a full
`getBoundingClientRect()` sweep for any element's right edge exceeding
`window.innerWidth`. Only treat it as a real bug if both of those also
indicate overflow — `scrollWidth` alone is not trustworthy in this tool
whenever `position:fixed`-animated elements are on the page.

## 2026-07-30 — Correction to the above: `window.innerWidth` itself is unreliable whenever a `position:fixed` element is in the DOM in this tool; use `document.documentElement.clientWidth` as ground truth instead [harvested 2026-07-30]

Tags: #browser-verification #css-overflow

While verifying the T-60 search dialog (`position: fixed; inset: 0`) at a
375px viewport, `getBoundingClientRect()` on the dialog itself reported
`width: 468`, and `window.innerWidth` — the exact value the 2026-07-29
entry above recommends as the cross-check ground truth — read **468 too**,
not 375. So the technique that entry proposes ("compare against
`window.innerWidth`") would have silently validated a false overflow
reading as correct, because both numbers are wrong together in this tool
whenever a `position:fixed` element is present — not just `scrollWidth` as
originally scoped. `document.documentElement.clientWidth`, by contrast,
correctly read `375` in the same check.

Root cause looks broader than the original entry's `position:fixed` +
`transform` framing: `window.devicePixelRatio` itself was observed at
different values across page loads in this tool (`2.0` during one 375px
check, `1.25` during an unrelated 1280px check moments later, neither
matching this environment's real display) — a real browser's DPR doesn't
fluctuate between loads at a fixed viewport size. A third data point from
the same session: `getComputedStyle(el).outlineWidth` on a plain
(non-fixed) focused nav link read `1.6px` for a rule that unambiguously
specifies `outline: 2px solid` in the actual stylesheet (confirmed by
reading the matched `CSSRule` directly, not just the computed value) —
`1.6 / 2 = 0.8 = 1 / 1.25`, matching that moment's reported DPR exactly.

**Revised working technique**: don't trust `window.innerWidth`/
`window.innerHeight` or `getBoundingClientRect()`/`getComputedStyle()` px
readings at face value in this tool — they can carry a DPR-shaped scaling
error that isn't present in the actual rendered page. Ground truth that
held up under cross-checking every time this session: (1)
`document.documentElement.clientWidth`/`clientHeight` for viewport size,
(2) `window.scrollX`/`scrollY` after a forced `scrollTo` for "is this
actually scrollable" (a boolean, immune to scaling), and (3) reading the
matched CSS rule's `cssText` directly from `document.styleSheets` for "what
value does the source actually specify" instead of trusting the computed
pixel readout. When a computed-style number looks off by a suspicious
ratio (0.8, 1.25, 2, etc.), check `window.devicePixelRatio` first before
concluding there's a real layout bug.

## 2026-07-30 — Overriding a third-party stylesheet's own `:root` custom properties needs higher specificity than `:root`, not just later source order, when that stylesheet loads dynamically [harvested 2026-07-30]

Tags: #css #specificity #third-party-widgets

T-60 added `--pagefind-ui-*` token overrides to `global.css`, a `<link>`
Astro bundles into `<head>` on first paint. Pagefind's own classic UI
widget (`pagefind-ui.css`) ships its own `:root { --pagefind-ui-primary:
#393939; ... }` block with its zinc-palette defaults — and that
stylesheet is injected by a `<script>`-created `<link>` only when a
visitor actually opens search, i.e. well *after* `global.css` has already
loaded. Confirmed via `getComputedStyle(document.documentElement)
.getPropertyValue('--pagefind-ui-primary')` returning `#393939` (Pagefind's
default) instead of the intended `#2c4630` (Atlas's `--color-research`),
and via `document.querySelectorAll('link[rel=stylesheet]')` showing
`pagefind-ui.css` listed after the site's own bundled stylesheet.

Both blocks use the exact same selector (`:root`), so specificity is tied
— and on a tie, CSS resolves by the order rules appear in the *cascade*,
which for separate stylesheets is the order their `<link>`/`<style>`
entered the DOM, not the order the source files were written or the order
their content conceptually "belongs." A dynamically-injected stylesheet
therefore always cascade-wins any tied-specificity rule against whatever
was already on the page, regardless of which one a developer intends to
be authoritative.

**Fix**: bump the intended-authoritative rule's specificity above a plain
`:root` — `html:root` (element + pseudo-class matching the same root
element) has specificity (0,1,1) vs. `:root`'s (0,1,0), so it wins
unconditionally without `!important` and without caring what order the
two stylesheets load in. Generalizes to any case of restyling a
third-party widget's CSS-custom-property API when that widget's own
stylesheet is loaded on-demand (lazy search UIs, embedded players, chat
widgets, map libraries) rather than up front alongside the site's own
CSS.

## 2026-08-04 — Two rules targeting the same selector at different specificity-ties resolve by SOURCE ORDER, not by which one is inside a `@media` block [harvested 2026-08-05]

Tags: #css #specificity #media-queries

T-66's first attempt at fixing `Plate.astro`'s cover-image cropping wrote
the `@media (min-width: 480px)` override (`.plate-cover img { height:
100% }`) physically ABOVE a same-selector base rule (`.plate-cover img {
height: auto }`) later in the file. Both compile to the identical selector
at identical specificity (Astro's scoped-style hash applies equally to
both), so at `>=480px`, where the media query legitimately matches, the
base rule still won every time — because it appeared LATER in the
compiled stylesheet's source order, and `@media` grants zero extra
cascade priority over an unlayered rule outside it. The bug was silent:
`getComputedStyle` on the wrapper div correctly showed the media query's
`aspect-ratio` taking effect (that property had no competing base-rule
declaration), which made it look like the whole override was live, while
the coupled `height` property quietly kept losing.

**Fix**: physically place the base (unconditional) rule BEFORE the
breakpoint override in the source file, so the override — which only
applies when its `@media` condition matches — is also the LATER rule for
that selector when both are in play, and therefore wins on the tie.
**Generalized rule**: when writing a `@media`-scoped override for a
selector that also has an unconditional base rule, always put the base
rule first in the file and the override after. Verify with the compiled
CSS output (`grep` the built `.css` file for the selector), not just
`getComputedStyle` on one property — a partial win (some properties
correctly overridden, others not) can look like full success if you only
check the properties that happen to have no conflicting base declaration.

## 2026-08-04 — CSS Grid/Flex items' implicit `min-height: auto` (content-based) can silently override `aspect-ratio` [harvested 2026-08-05]

Tags: #css #grid #aspect-ratio

Same T-66 fix, second layer of the same bug: even after correcting the
cascade-order issue above, cover images whose native aspect ratio was
"taller" than the target 16:10 (e.g. a 0.80-ratio portrait-oriented
photo) still rendered at their own native height instead of the
`aspect-ratio: 16/10`-constrained one, while images at or wider than
16:10 rendered correctly. Root cause: `.plate-cover` is a grid item
(inside `.plate-lead.plate-with-cover`/`.plate-standard.plate-with-cover`'s
`grid-template-columns: 1fr var(--plate-cover-width)`), and grid/flex
items get an implicit `min-height: auto` by default — meaning the browser
won't shrink the item below its content's own intrinsic minimum size,
even when `aspect-ratio` on the same element says it should be shorter.
The `<img>` inside, sized via `height: auto` at that point in the fix,
still carried its own native-ratio height as "content," and for
taller-than-16:10 images that content height exceeded what `aspect-ratio`
implied, so the grid's auto-min-size protection kept the box tall instead
of letting it clip. Confirmed by comparing `.plate-cover`'s
`getBoundingClientRect()` across all 10 covers on the same page: exactly
the images with native ratio below 1.6 (i.e., taller than 16:10) were the
ones still showing their own uncropped height; every image at or above
1.6 coincidentally already satisfied `aspect-ratio` on its own and looked
fine, which is what made the bug easy to miss on a partial spot-check.

**Fix**: add `min-height: 0` explicitly to the grid-item selector
alongside `aspect-ratio`. **Generalized rule**: `aspect-ratio` on a
flex/grid item is not a hard guarantee by itself — it competes with
that item's automatic content-based minimum size, which wins whenever
the content (directly, or a child sized with `height: 100%`/`auto`
against it) is intrinsically taller/wider than the ratio would produce.
Always pair `aspect-ratio` with `min-height: 0` (row axis) and/or
`min-width: 0` (column axis) on grid/flex items, and verify across a
DATA SET with varied intrinsic sizes (not just one or two samples) —
a single test image that happens to already match the target ratio
will show a false pass.

## 2026-08-04 — An editing policy from the immediately-previous task can bleed into the next one when the next task's content looks similar but has the opposite rule [harvested 2026-08-05]

Tags: #content-editing #process

T-69 (same session) ran a humanizer pass removing narrative em/en dashes
from every site-authored prose file. T-70, immediately after, transcribed
3 finished personal essays the site owner handed over verbatim, with an
explicit decision already made (and stated back to the user) to preserve
the owner's own punctuation/voice exactly, not edit it. Despite that
explicit decision, the first draft of 2 of the 3 files still quietly
replaced several of the owner's own em dashes with commas/periods while
typing them out, the exact edit T-69 had just spent an entire task
applying everywhere else — a stale editing reflex from the task
immediately prior carried over into a task with the opposite rule,
without any conscious decision to break the stated policy.

Caught only by deliberately counting dash occurrences in the source
(read from the conversation's own tool-result content) and diffing
against `grep -o "—\|–" file | wc -l` on the written file — a plain
correctness read-through of the new files did not catch it, because the
altered sentences still read perfectly naturally (a removed em dash
becoming a comma rarely looks "wrong" on inspection, it just isn't what
the source said).

**Generalized rule**: when a task's content-handling policy is the
*opposite* of the immediately-preceding task's (edit vs. preserve-
verbatim, translate vs. keep-original, summarize vs. quote-exactly), do
not trust a normal proofread to catch policy bleed — the output can be
fluent and self-consistent while still silently disagreeing with the
source. Verify with an object comparison against the actual source
(character/substring counts, diff, or line-by-line match), not a
read-through, whenever the new task's rule is "preserve X exactly" and
the previous task's rule was "change X everywhere."
