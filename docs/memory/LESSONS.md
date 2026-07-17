# Lessons Learned — knowledge-hub

## 2026-07-17 — Verifying computed style right after a same-tick DOM mutation gives a stale read [harvest-candidate]

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

## 2026-07-17 — Prefer plain scoped CSS over deeply-stacked Tailwind v4 arbitrary variants for state-based selectors [harvest-candidate]

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

## 2026-07-17 — Tailwind v4: unlayered custom CSS always beats `@layer utilities`, regardless of specificity [harvest-candidate]

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

## 2026-07-17 — Recovering a Workflow (multi-agent) run after a host crash [harvest-candidate]

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

## 2026-07-16 — `vercel whoami` can silently complete a device-auth login

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

## 2026-07-16 — Astro trims newline whitespace around inline elements [harvest-candidate]

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

## 2026-07-16 — Tailwind v4 `focus-visible:outline-*` needs the bare `outline` class [harvest-candidate]

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

## 2026-07-16 — Astro scaffolding gotchas

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
