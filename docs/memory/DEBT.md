# Technical Debt — knowledge-hub

<!-- APPEND-ONLY register. Add a row the moment a shortcut is consciously
     taken (CLAUDE.md, Session protocol) — not weeks later from memory.
     Severity: high = risks correctness/security, med = slows work,
     low = cosmetic. Close by filling "Closed by" (commit or ADR), keep the row. -->

| # | Date | Debt item | Severity | Why taken | Cost to fix | Closed by |
|---|---|---|---|---|---|---|
| 1 | 2026-07-17 | Pagefind search UI (`/explore`) uses its default CSS, not the site's design tokens (zinc palette, Plus Jakarta Sans/Manrope) | low | T-12 scoped explicitly to "search works," not visual polish — restyling was flagged in-prompt as a possible follow-up, not attempted | Small — override `pagefind-ui.css` custom properties or restyle the component UI | |
| 2 | 2026-07-17 | Project titles on `/projects` use a manual override map (`getProjectTitle` in `src/lib/posts.ts`) for names that don't naively title-case correctly (e.g. "CDMP-Jabodetabek"), instead of a general solution | low | Only 3 real projects exist; a hardcoded map was simpler and more honest than a fragile acronym-detection heuristic | Small per new project (add one map entry) — revisit if the project list grows past a handful and this becomes tedious | |
