# Development Guide — knowledge-hub

- Updated: 2026-07-17

<!-- The "new machine to running app" document. Test it by following it
     literally — every command copy-pasteable on Windows (PowerShell). -->

## Setup (once)

1. `git clone https://github.com/Luthfi-Forma/knowledge-hub.git`
2. `npm install` (Node.js ≥ 22.12.0 required, per `package.json` `engines`)

No `.env` — the site has no secrets or backend.

## Run

```
npm run dev
```

Opens at `http://localhost:4321`. Claude Code can also start this via the
preview tools using the `knowledge-hub-dev` config in `.claude/launch.json`.

## Common tasks

### Add a new post

Create `src/content/posts/<slug>.mdx` with frontmatter matching the schema
in `src/content.config.ts` (see `docs/ARCHITECTURE.md` for the field list).
`npm run build` fails loudly if frontmatter is invalid. For `type: "photo"`,
`cover` is required (build fails without one) — co-locate the image file
next to its `.mdx`, same as every other post's cover.

### Build for production

```
npm run build
```

Static output goes to `dist/`. `npm run preview` serves that output locally.

### Run tests

No test suite yet — `npm run build` (which runs zod validation on every
post) is the current correctness check. See `docs/TESTING.md`.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `npm create astro@latest .` creates a sibling subfolder instead of scaffolding in place | Astro refuses to scaffold into a non-empty directory | Let it create the subfolder, then move the generated files up manually (see `docs/memory/LESSONS.md`) |
| Focus ring invisible on an interactive element | `focus-visible:outline-*` classes set width/color but not the bare `outline` (style) utility | Add `focus-visible:outline` alongside `outline-2`/`outline-offset-*`/`outline-{color}` |
| A space goes missing right after an inline `<a>`/`<span>` that wraps mid-sentence | Astro trims leading whitespace on a new source line inside markup | Keep the next word on the same line as the closing tag, or use `{' '}` |
