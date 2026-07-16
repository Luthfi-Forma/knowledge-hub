# Project Rules — knowledge-hub

- Updated: 2026-07-16

This project follows Claude Engineering OS standards by default (see
`CLAUDE.md`, "Standards in force"). **This file records only the deltas** —
where this project deliberately deviates from an OS standard, and why.

<!-- Empty table = full OS compliance. That is the ideal state.
     A deviation that changes architecture or tooling also needs an ADR. -->

## Deviations from OS standards

| OS rule (file + rule) | This project does | Why / ADR |
|---|---|---|
| `standards/architecture/technology-selection.md` — web-app default Next.js | Astro + content collections (Tailwind & Vercel tetap default) | [ADR-001](decisions/ADR-001-astro-over-nextjs.md) |
| `CLAUDE.md` — "Standards in force" menunjuk `knowledge/react-nextjs.md` | Tidak berlaku penuh (bukan Next.js); gotcha Astro dicatat di `docs/memory/LESSONS.md` | ADR-001, Consequences |

## Project-specific conventions

<!-- Rules that exist ONLY here because of this project's domain (e.g., "all
     timestamps in WIB", "station IDs follow GTFS stop_id"). Keep short. -->

- Konten publik (post, halaman) berbahasa **English**; dokumen `docs/` Bahasa
  Indonesia.
- Tags: lowercase, vocabulary terkontrol — topic dan technology dilebur ke satu
  field `tags` (mis. `gis`, `python`, `urban-planning`); tanpa field `year`
  atau `status` selain `draft` (lihat content model di `docs/ARCHITECTURE.md`).
- Aturan *content-first*: tiap milestone wajib menambah konten nyata, bukan
  hanya fitur.
