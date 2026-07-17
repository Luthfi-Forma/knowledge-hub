# Changelog — knowledge-hub

All notable changes to this project. Format follows
[Keep a Changelog](https://keepachangelog.com/); versions follow SemVer once
the project starts tagging releases.

<!-- Rules:
     - Add entries under Unreleased as you work (same commit as the change).
     - On release: rename Unreleased to the version + date, start a new
       Unreleased section above it.
     - Categories: Added / Changed / Fixed / Removed / Security. -->

## [Unreleased]

### Added

- Project scaffolded from Claude Engineering OS (2026-07-16).
- Astro 7 + Tailwind CSS v4 + MDX site: content collection `posts` with a
  zod-validated schema (T-01, T-02).
- Home, Explore (with type filter), post detail, About placeholder, 404
  (T-03, T-04).
- Three real project case studies: Jabodetabek-Connect, Jakarta Transit
  Heritage Explorer, CDMP-Jabodetabek (T-05–T-07).
- Deployed to Vercel, connected to GitHub for auto-deploy on push (T-08).
- Tag filtering (`/tags`, `/tags/[tag]`) (T-09).
- Related posts on post detail pages, scored by shared tags/project (T-10).
- Project hub pages (`/projects`, `/projects/[name]`) (T-11).
- Client-side search on Explore via Pagefind (T-12).
- Real About page content (bio, education, expertise, experience,
  documents) and four GIS/urban-planning research case studies migrated
  from the previous portfolio site (T-13).
- Static table of contents and computed reading time on post detail pages
  (T-14).
- Interactive experience timeline on the About page — expandable entries
  (native `<details>`) with role descriptions sourced from the old
  portfolio's content deck, translated and condensed (T-15).
- Branded OG image per post (Satori + resvg, generated at build time) plus
  a site-wide default; full `og:*`/`twitter:*` meta tags and `<link
  rel="canonical">` on every page (T-16).

### Changed

- Final visual identity applied site-wide, replacing the M1 provisional
  zinc/Plus Jakarta Sans tokens: cream paper palette, Bodoni Moda (display +
  article body) paired with Karla (UI/meta), sharp/minimal corner radii in
  place of pill/rounded-lg defaults (T-14).

### Fixed

- Post detail pages now render their `cover` image (was silently unused).
- Project titles on `/projects` respect real acronyms (e.g.
  "CDMP-Jabodetabek") instead of naively title-casing the URL slug.
