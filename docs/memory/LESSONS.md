# Lessons Learned — knowledge-hub

<!-- APPEND-ONLY, newest first. Write an entry after: a bug with a non-obvious
     cause, a milestone retro, or whenever something cost more than an hour to
     learn. Tag with topics (#python #gis #fastapi ...) so /harvest-lessons can
     classify. Mark entries worth generalizing to the OS with [harvest-candidate];
     after harvesting they get marked [harvested YYYY-MM-DD]. -->

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
