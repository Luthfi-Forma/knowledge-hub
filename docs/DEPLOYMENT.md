# Deployment — knowledge-hub

- Updated: 2026-07-16

## Environments

| Env | Where | URL | Deploys via |
|---|---|---|---|
| dev | local | `http://localhost:4321` | `npm run dev` |
| preview | Vercel | per-branch/PR URL (auto) | push to any branch |
| prod | Vercel | https://knowledge-hub-inky.vercel.app | push to `main` |

## Prerequisites

- GitHub account with push access to `github.com/Luthfi-Forma/knowledge-hub`.
- Vercel account (`luthfi-forma`), project `knowledge-hub` already linked to
  the GitHub repo — this gives every push to `main` an automatic production
  deploy. No manual `vercel` CLI step needed for normal work.

## Deploy steps

Normal flow — just push:

1. `git push origin main` (or merge a PR into `main`).
2. Vercel's GitHub integration builds and deploys automatically. Watch it at
   the project's Vercel dashboard, or `npx vercel ls` from this repo.

Manual one-off deploy (bypasses git, e.g. to test before pushing):

1. `npx vercel --prod` from the repo root (requires being logged in — `npx
   vercel whoami` to check).

## Verify after deploy

- `curl -I https://knowledge-hub-inky.vercel.app` → `200`.
- Home shows the current post count in Featured Projects / Latest Posts.
- `curl -I https://knowledge-hub-inky.vercel.app/some-bad-path` → `404`
  (custom 404 page, not Vercel's default).
- No console errors on `/`, `/explore`, and one `/posts/[slug]` page.

## Rollback

Vercel keeps every deployment. To roll back:

1. `npx vercel ls` to find the previous good deployment URL.
2. `npx vercel promote <deployment-url>` to make it production again.

Or, from the Vercel dashboard: Deployments → pick a prior one → "Promote to
Production".

## Configuration

No environment variables — the site is fully static with no backend, no
API keys, no database.

| Variable | Purpose | dev | prod |
|---|---|---|---|
| — | none needed | — | — |
