# Lessons Learned — knowledge-hub

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
