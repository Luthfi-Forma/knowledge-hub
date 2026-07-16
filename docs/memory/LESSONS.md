# Lessons Learned — knowledge-hub

<!-- APPEND-ONLY, newest first. Write an entry after: a bug with a non-obvious
     cause, a milestone retro, or whenever something cost more than an hour to
     learn. Tag with topics (#python #gis #fastapi ...) so /harvest-lessons can
     classify. Mark entries worth generalizing to the OS with [harvest-candidate];
     after harvesting they get marked [harvested YYYY-MM-DD]. -->

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

## 2026-07-16 — Project scaffolded

Tags: #meta

Project created from Claude Engineering OS templates. (Replace this with real
lessons — delete once the first real entry lands.)
