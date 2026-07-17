# Security — knowledge-hub

- Updated: 2026-07-17
- Baseline: `C:\Users\Luthfi\Documents\Claude Code\Claude Engineering OS\standards\security.md` (this doc records only what is
  specific to this project)

## Auth model

None — public read-only static site. No accounts, no login, no
authenticated routes. Content is edited by committing MDX files to the
repo, not through any in-app interface.

## Secrets inventory

None. The site has no backend, no API calls at runtime, and no `.env` file
(there is nothing to configure — see docs/DEPLOYMENT.md's Configuration
table). Search (Pagefind) runs entirely client-side against a static index
generated at build time.

## Data sensitivity

None. No user data is collected, stored, or processed — no forms, no
analytics currently wired up, no cookies beyond what Vercel's platform sets.
Contact happens via `mailto:`/external LinkedIn links, not an in-site form.

## Threat notes

- Content injection: all post content is authored by the site owner via
  MDX files in the repo (not user-submitted), so XSS-via-content isn't a
  live risk today. If a public contribution/comment path is ever added
  (out of scope through M2, see docs/ROADMAP.md icebox), revisit this.
- Dependency supply chain: standard `npm audit` hygiene applies; no
  project-specific mitigation beyond that yet.

## Pre-release check

Run `C:\Users\Luthfi\Documents\Claude Code\Claude Engineering OS\checklists\security.md` before every release.
