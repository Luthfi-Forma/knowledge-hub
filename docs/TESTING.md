# Testing — knowledge-hub

- Updated: 2026-07-17
- Baseline: `C:\Users\Luthfi\Documents\Claude Code\Claude Engineering OS\standards\testing.md` (this doc records the
  project-specific plan, not the general rules)

## How to run

```
npm run build
```

There is no separate test command — `astro build` doubles as the
correctness check for this project (see "What we test" below).

## What we test, per layer

| Layer | Tool | What is covered | Target |
|---|---|---|---|
| schema validation | zod (`src/content.config.ts`), runs on every build | Every post's frontmatter — build fails loudly on an invalid field, bad date, wrong `type` enum, non-kebab-case tag, etc. | 100% of content |
| type check | `astro build` (TypeScript under the hood) | Compile-time errors across `.astro`/`.ts` files | 100% of source |
| manual browser verification | Claude Code's Browser pane, done at the end of every task this project has shipped | Rendered output, heading order, focus states, contrast, responsive breakpoints (375/768/1024/1440), console errors, and — after deploy — the live production URL | Every page touched in a session |

## Test data

Content is real, not fixture data — every post in `src/content/posts/` is
either the site owner's own real project or a real personal case study
(see docs/RULES.md's content-first rule). There is no separate test dataset.

## Known gaps

- No automated unit/integration/e2e test suite. Coverage today comes from
  build-time schema/type validation plus manual browser verification each
  session — acceptable for a solo-maintained static content site at this
  stage, but a real gap if the project grows client-side interactivity
  beyond the current zero-JS-by-default islands (ADR-001).
- No automated accessibility or Lighthouse check wired into CI — both are
  checked manually per session (see docs/PROJECT_BRIEF.md's Lighthouse ≥ 90
  success criterion) but nothing fails a build if they regress.
