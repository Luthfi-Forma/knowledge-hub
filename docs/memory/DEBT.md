# Technical Debt — knowledge-hub

<!-- APPEND-ONLY register. Add a row the moment a shortcut is consciously
     taken (CLAUDE.md, Session protocol) — not weeks later from memory.
     Severity: high = risks correctness/security, med = slows work,
     low = cosmetic. Close by filling "Closed by" (commit or ADR), keep the row. -->

| # | Date | Debt item | Severity | Why taken | Cost to fix | Closed by |
|---|---|---|---|---|---|---|
| 1 | 2026-07-17 | Pagefind search UI (`/explore`) uses its default CSS, not the site's design tokens (zinc palette, Plus Jakarta Sans/Manrope) | low | T-12 scoped explicitly to "search works," not visual polish — restyling was flagged in-prompt as a possible follow-up, not attempted | Small — override `pagefind-ui.css` custom properties or restyle the component UI | T-60 (2026-07-30) |
| 2 | 2026-07-17 | Project titles on `/projects` use a manual override map (`getProjectTitle` in `src/lib/posts.ts`) for names that don't naively title-case correctly (e.g. "CDMP-Jabodetabek"), instead of a general solution | low | Only 3 real projects exist; a hardcoded map was simpler and more honest than a fragile acronym-detection heuristic | Small per new project (add one map entry) — revisit if the project list grows past a handful and this becomes tedious | |
| 3 | 2026-08-04 | 3 Tanggamus photo source files (`tanggamus-boat/pier/wave-cover.jpg`) are 15-20MB each (~55MB total) in `src/content/posts/` — Astro re-optimizes them into responsive `.webp` at build time, but the oversized source still costs repo weight and build time | low | Found in passing during T-66 (cover art SOP work) while measuring cover geometry; outside that task's scope (T-66 is about generated project covers, not photo posts) — `docs/design/COVER_ART.md` §8 now sets a ~5MB source-file ceiling going forward, but resizing these 3 existing files is a separate task | Small-medium — resize/re-compress the 3 source JPGs (e.g. cap the long edge, re-export at a sane JPEG quality) and re-verify the photo pages still render correctly | |
