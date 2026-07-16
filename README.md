# knowledge-hub

> Personal knowledge hub that connects all projects, writing, and research into one explorable ecosystem

<!-- The README is the front door: what it is, how to run it, where the docs
     are. Depth lives in docs/, not here. -->

## Quickstart

```
npm install
npm run dev
```

Full setup: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)

## Status

Live at [knowledge-hub-inky.vercel.app](https://knowledge-hub-inky.vercel.app).
M1 and M2 done: Home, Explore (with tag filter and client-side search),
post detail with related posts, project hub pages, tag pages, a real About
page, and 7 real posts (3 software project case studies + 4 GIS/planning
research write-ups). M3 (Identitas & polish) not yet scoped — see
[docs/TASK.md](docs/TASK.md).

## Structure

```
src/content/posts/  # MDX posts, frontmatter validated by src/content.config.ts
src/pages/           # routes: /, /explore(/[type]), /posts/[slug], /tags(/[tag]),
                     #   /projects(/[name]), /about, /404
src/components/       # Header, Footer, PostCard, PostListItem, EmptyState, RelatedPosts, etc.
src/layouts/           # BaseLayout (shared shell)
src/lib/                 # posts.ts — content collection query helpers
docs/                     # project docs (see table below)
```

## Documentation

| Doc | What it answers |
|---|---|
| [docs/PROJECT_BRIEF.md](docs/PROJECT_BRIEF.md) | Why this exists |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | How it is built |
| [docs/TASK.md](docs/TASK.md) | What is being worked on |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | Setup, run, troubleshoot |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | How to ship and roll back |

---
Scaffolded 2026-07-16 from Claude Engineering OS.
