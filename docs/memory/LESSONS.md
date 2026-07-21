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
