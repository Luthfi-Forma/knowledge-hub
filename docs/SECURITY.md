# Security — knowledge-hub

- Updated: 2026-07-16
- Baseline: `C:\Users\Luthfi\Documents\Claude Code\Claude Engineering OS\standards\security.md` (this doc records only what is
  specific to this project)

## Auth model

<!-- Who can do what, and how identity is established. "None — public read-only
     app" is a valid answer; write it explicitly. -->

## Secrets inventory

<!-- Every secret the project uses. Names and storage location only — NEVER
     values. If a value ever lands in git, rotate it immediately. -->

| Secret | Used for | Stored in |
|---|---|---|
| | | `.env` (gitignored) |

## Data sensitivity

<!-- What personal or sensitive data the system touches, where it is stored,
     and retention. "None" is a valid, explicit answer. -->

## Threat notes

<!-- Project-specific risks worth naming (e.g., scraping, abuse of a public
     API, injection via user content) + the mitigation for each. -->

## Pre-release check

Run `C:\Users\Luthfi\Documents\Claude Code\Claude Engineering OS\checklists\security.md` before every release.
