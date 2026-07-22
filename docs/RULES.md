# Project Rules — knowledge-hub

- Updated: 2026-07-22

This project follows Claude Engineering OS standards by default (see
`CLAUDE.md`, "Standards in force"). **This file records only the deltas** —
where this project deliberately deviates from an OS standard, and why.

<!-- Empty table = full OS compliance. That is the ideal state.
     A deviation that changes architecture or tooling also needs an ADR. -->

## Deviations from OS standards

| OS rule (file + rule) | This project does | Why / ADR |
|---|---|---|
| `hooks/profiles/standard.json` — OS's default profile also includes `data_validation_check.py` and (in `strict`) `perf_reminder.py` | Only `commit_message_gate.py` + `code_quality_reminder.py` wired | No JSON/GeoJSON data files exist anywhere in this project, and no map/render-sensitive components exist (this is a content blog, not a map app) — those two hooks would never fire, so they're omitted rather than wired inert. |

## Known limitation (not a deviation to fix ad-hoc)

`code_quality_reminder.py`'s file pattern covers `.ts/.tsx/.js/.jsx/.py`
but **not `.astro` or `.mdx`** — the two extensions that make up most of
this project's source (27 `.astro` + 11 `.mdx` vs. 7 `.ts` + 5 `.tsx`).
The hook still fires correctly on the project's TS/TSX files (islands,
`src/lib/scrollytelling/*.tsx`), just not on Astro components or content
pages. Extending the shared hook script's pattern is an OS-level change
(affects all projects), not a per-project fix — noted here as a
harvest-lessons candidate rather than patched silently mid-migration.
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
