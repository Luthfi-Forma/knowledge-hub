# Lessons from CDMP-Jabodetabek

> Valuable technical insights & debt from Jabodetabek city development map showcase (archived 2026-07-19)

## Project Overview

**CDMP-Jabodetabek** was an interactive map of Jabodetabek's infrastructure development over time (inspired by Cuberto's city timeline design). Single-page app built with Next.js + MapLibre GL, GeoJSON-based static data, timeline slider to filter projects per year.

- **Status:** M2 (animation + deploy) — T-04 (animation) complete, T-05 (verify + deploy) pending
- **Stack:** Next.js, TypeScript, MapLibre GL, Tailwind CSS, static GeoJSON
- **Scope:** Interactive peta gelap Jabodetabek dengan timeline slider, 10–15 contoh proyek (MRT, LRT, tol, kawasan)
- **Decisions:** Static data (no DB), free basemap, Vercel deploy

## Lessons Learned

### 1. Next.js `.next` build directory collision between dev & production builds

**Tags:** #nextjs #tooling **[harvest-candidate]**

Running `npm run build` while `next dev` is running destroys the dev server's state:
- Both share the `.next/` directory
- `npm run build` overwrites dev artifacts
- HTML still serves (200) but references CSS/chunks that no longer exist (404)
- Page renders unstyled; maps get stuck in "Loading map…" state
- Dev logs show misleading symptoms: module count drops, no clear error message

**Solution:**
- Stop dev server before building
- OR use `--experimental-build-mode` / separate distDir for parallel builds

**Takeaway:** Never run `next build` while dev server is live.

---

### 2. MapLibre render loop halts in hidden browser tabs (affects automation & headless testing)

**Tags:** #gis #maplibre #testing #browser-automation **[harvest-candidate]**

When browser tab is hidden (`document.hidden === true`), `requestAnimationFrame` stops ticking:
- MapLibre render loop freezes
- `map.on("load")` never fires (style JSON loaded, but `isStyleLoaded()` stays false)
- No error in console — only screenshot timeouts
- Symptoms look like fetch/CSP failures, but network is healthy (sprite fetch 200)
- Shimming rAF to setTimeout from console doesn't help (background tab throttles timers)

**Gotcha:** Only happens in automation/headless browsers or Claude Code's Browser pane when not in focus. Real Chrome/Safari work fine.

**Solution:**
- Always verify visual things (WebGL/rAF-based) in a VISIBLE tab
- Check `document.visibilityState` FIRST before debugging "map not loading"
- For testing MapLibre state without rendering, use a dev-only hook (e.g., `window.__map`) to inspect internals from console/automation

**Takeaway:** MapLibre visibility dependency is easy to miss; document it in test setup.

---

### 3. Data-driven paint properties in MapLibre don't respond to `*-transition`

**Tags:** #gis #maplibre #animation

MapLibre ignores `*-opacity-transition` for paint properties that use data-driven expressions (e.g., `["get", "opacity"]`).

**Pattern that works — manual tweening:**
1. Tween a fractional "animation year" via rAF (e.g., 2024.5)
2. Each frame, re-set opacity expression: clamp `(animationYear - year_start) / year_range`
3. Ramp over ~0.75 years so fractional years fade in/out; whole years collapse to same state as filter
4. Loosen the layer filter during tween (so fading-out features still render)
5. Tighten filter when animation settles (so click hit-testing remains accurate)
6. Respect `prefers-reduced-motion`: jump without tween

**Visual result:** Smooth fade-in/fade-out per feature as timeline slides, no jank.

**Takeaway:** MapLibre animation = manual tweening + filter trickery. Document this pattern.

---

## Technical Debt (Reference)

These were noted but not critical for v1:

| Item | Severity | Context | Cost to fix |
|------|----------|---------|-------------|
| postcss XSS advisory (GHSA-qx2v-qp2m-jg93) | low | Bundled into Next.js; awaiting Next patch | Next.js update |
| projects.geojson validation not in CI | low | One-off Python script; no automated test suite yet | Add unit test per OS standards |
| T-04 animation not visually verified | med | Browser automation hidden → rAF suspended; manual verif pending at deploy | Verify at T-05 when tab is visible |

---

## References

- **Design inspiration:** Cuberto's City Development Map Timeline (Dribbble 6127089)
- **Similar projects:** Jakarta Transit Heritage Explorer, mini-jakarta-3d (patterns for MapLibre + static GeoJSON)
- **Data sources:** OpenStreetMap, MRT Jakarta / LRT Jabodebek official releases

---

**Why archived:** Project was a portfolio showcase / proof-of-concept for mapping + timeline animation. Goal achieved (M1 complete, M2 animation polished); repurposing scope/time to core platform projects (knowledge-hub, Jabodetabek-Connect, etc.).
