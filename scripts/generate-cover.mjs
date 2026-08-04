#!/usr/bin/env node
// Cover art generator (M8/T-66) — regenerates the site's Atlas-palette
// project covers. Reuses the exact satori + @resvg/resvg-js pipeline and
// TTF font set already proven by src/lib/og-image.ts (same fonts, same
// "satori shapes text into vector paths, resvg only rasterizes" split —
// resvg is never asked to resolve a font by name itself, which sidesteps
// the fact that these TTFs' internal name-table strings are inconsistent
// fontsource exports, e.g. "Archivo SemiBold ExtraBold" for the 800
// weight — not simply "Archivo").
//
// T-33 (M5) built the first version of this generator, used it once, then
// deleted it — "one-off ... no auto-chart system" was the right call for
// a system that renders data, but a *cover art* generator is meant to be
// re-run (new posts, palette migrations like the one that motivated this
// file: 2 of the 3 M5 covers were still on the dead Reading-Mode cream
// #f5efe1, and one was still on the dead Immersive-Mode near-black
// #18140f — both pre-date Atlas/ADR-004). Kept this time, per
// docs/design/COVER_ART.md.
//
// Usage:
//   node scripts/generate-cover.mjs                 # regenerate all posts below
//   node scripts/generate-cover.mjs jabodetabek-connect   # regenerate one
//
// Each post's motif is bespoke, hand-drawn vector geometry (no icon
// library, no auto-chart system) that encodes a real fact from its own
// post — see docs/design/COVER_ART.md for the rule this follows.

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const WIDTH = 1600;
const HEIGHT = 1000;

// Atlas tokens (docs/design/atlas/README.md) — duplicated by hand because
// this script runs under Node/satori/resvg, outside any CSS cascade,
// exactly the tradeoff src/lib/og-image.ts's own COLOR const already
// makes. Keep both in sync by hand if a token value ever changes.
const COLOR = {
  paper: '#f2ebda',
  line: '#c9bfa6',
  lineStrong: '#8e836a',
  ink: '#171512',
  inkMuted: '#4a4238',
  research: '#2c4630',
  project: '#2f5670',
};

function loadFont(filename) {
  return readFileSync(join(process.cwd(), 'src/lib/og-fonts', filename));
}

const fonts = [
  { name: 'Archivo', data: loadFont('archivo-800.ttf'), weight: 800, style: 'normal' },
  { name: 'Archivo', data: loadFont('archivo-600.ttf'), weight: 600, style: 'normal' },
  { name: 'Archivo', data: loadFont('archivo-400.ttf'), weight: 400, style: 'normal' },
  { name: 'IBM Plex Mono', data: loadFont('ibm-plex-mono-400.ttf'), weight: 400, style: 'normal' },
];

/** Faint background graticule — the same repeating-grid language as
 * SheetIndex's `.sheet-field::before` (T-55), so the 3 covers read as
 * part of the site's own system instead of unrelated illustrations. */
function graticule(step = 80) {
  const lines = [];
  for (let x = step; x < WIDTH; x += step) {
    lines.push({ type: 'line', props: { x1: x, y1: 0, x2: x, y2: HEIGHT, stroke: COLOR.line, strokeWidth: 1 } });
  }
  for (let y = step; y < HEIGHT; y += step) {
    lines.push({ type: 'line', props: { x1: 0, y1: y, x2: WIDTH, y2: y, stroke: COLOR.line, strokeWidth: 1 } });
  }
  return {
    type: 'svg',
    props: {
      width: WIDTH,
      height: HEIGHT,
      viewBox: `0 0 ${WIDTH} ${HEIGHT}`,
      style: { position: 'absolute', top: 0, left: 0, opacity: 0.6 },
      children: lines,
    },
  };
}

/** Bottom-left stamp: 1-2 real facts (label + value), stacked, in the
 * same mono-label / bold-value language as Plate's own notation row —
 * deliberately not a caption restating the title, a measurement. */
function statStamp(stats) {
  return {
    type: 'div',
    props: {
      style: {
        position: 'absolute',
        left: 80,
        bottom: 72,
        display: 'flex',
        gap: '56px',
      },
      children: stats.map((s) => ({
        type: 'div',
        props: {
          style: { display: 'flex', flexDirection: 'column' },
          children: [
            {
              type: 'div',
              props: {
                style: { display: 'flex', fontFamily: 'Archivo', fontWeight: 800, fontSize: '72px', color: COLOR.ink, lineHeight: 1 },
                children: s.value,
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  marginTop: '10px',
                  fontFamily: 'IBM Plex Mono',
                  fontSize: '20px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: COLOR.inkMuted,
                },
                children: s.label,
              },
            },
          ],
        },
      })),
    },
  };
}

function svgOverlay(children) {
  return {
    type: 'svg',
    props: {
      width: WIDTH,
      height: HEIGHT,
      viewBox: `0 0 ${WIDTH} ${HEIGHT}`,
      style: { position: 'absolute', top: 0, left: 0 },
      children,
    },
  };
}

// --- Per-post motifs -------------------------------------------------
// Bespoke vector geometry, not a generic chart — same "no auto-chart
// system" convention already used by src/lib/scrollytelling/*.tsx.

/** jabodetabek-connect — an abstract octilinear transit diagram (the
 * post's own subject): 5 zigzag lines at 45deg/90deg turns, alternating
 * ink/project-blue, with station-dot and interchange-capsule markers,
 * encoding "128 stations · 13 lines". */
function motifJabodetabekConnect() {
  const lineDefs = [
    { d: 'M 200 720 L 460 720 L 620 560 L 900 560 L 1060 400 L 1420 400', color: COLOR.project },
    { d: 'M 260 320 L 520 320 L 680 480 L 940 480 L 1100 640 L 1360 640', color: COLOR.ink },
    { d: 'M 200 480 L 620 480', color: COLOR.project },
    { d: 'M 780 260 L 780 720', color: COLOR.ink },
    { d: 'M 1060 240 L 1060 640', color: COLOR.project },
  ];
  const paths = lineDefs.map((l) => ({
    type: 'path',
    props: { d: l.d, stroke: l.color, strokeWidth: 10, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' },
  }));
  const stations = [
    [200, 720], [460, 720], [620, 560], [900, 560], [1420, 400],
    [260, 320], [520, 320], [940, 480], [1360, 640],
    [200, 480], [780, 260], [780, 720], [1060, 240], [1060, 640],
  ].map(([cx, cy]) => ({ type: 'circle', props: { cx, cy, r: 12, fill: COLOR.paper, stroke: COLOR.ink, strokeWidth: 6 } }));
  const interchanges = [
    [620, 480], [1060, 400], [780, 480],
  ].map(([cx, cy]) => ({ type: 'circle', props: { cx, cy, r: 20, fill: COLOR.ink } }));
  return svgOverlay([...paths, ...stations, ...interchanges]);
}

/** jakarta-transit-heritage-explorer — 3 dashed walking routes fanning
 * out from one shared transit hub to 3 heritage-site markers, encoding
 * "3 nodes". */
function motifJakartaTransitHeritage() {
  const hub = { x: 420, y: 500 };
  const sites = [
    { x: 1100, y: 260 },
    { x: 1260, y: 520 },
    { x: 1040, y: 760 },
  ];
  const routes = sites.map((s) => ({
    type: 'path',
    props: {
      d: `M ${hub.x} ${hub.y} Q ${(hub.x + s.x) / 2} ${hub.y - 60} ${s.x} ${s.y}`,
      stroke: COLOR.project,
      strokeWidth: 8,
      strokeDasharray: '2 26',
      strokeLinecap: 'round',
      fill: 'none',
    },
  }));
  const hubMarker = { type: 'circle', props: { cx: hub.x, cy: hub.y, r: 34, fill: COLOR.ink } };
  const hubRing = { type: 'circle', props: { cx: hub.x, cy: hub.y, r: 52, fill: 'none', stroke: COLOR.ink, strokeWidth: 4 } };
  const siteMarkers = sites.map((s) => ({
    type: 'path',
    props: {
      d: `M ${s.x} ${s.y - 30} L ${s.x + 26} ${s.y + 16} L ${s.x - 26} ${s.y + 16} Z`,
      fill: COLOR.paper,
      stroke: COLOR.project,
      strokeWidth: 7,
      strokeLinejoin: 'round',
    },
  }));
  return svgOverlay([...routes, hubRing, hubMarker, ...siteMarkers]);
}

/** cdmp-jabodetabek — a horizontal timeline track (1989-2027) with 14
 * project tick marks and one enlarged slider-handle marker, echoing the
 * actual product's timeline slider and encoding "14 projects mapped
 * across 1989-2027". */
function motifCdmpJabodetabek() {
  const trackY = 500;
  const startX = 200;
  const endX = 1400;
  const track = { type: 'line', props: { x1: startX, y1: trackY, x2: endX, y2: trackY, stroke: COLOR.lineStrong, strokeWidth: 6 } };
  const tickCount = 14;
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    // Deterministic, slightly irregular spacing (real projects don't land
    // on a perfectly even grid) rather than a uniform sequence.
    const t = (i + 0.5) / tickCount + (Math.sin(i * 2.4) * 0.015);
    const x = startX + t * (endX - startX);
    const h = i % 3 === 0 ? 38 : 24;
    return {
      type: 'line',
      props: { x1: x, y1: trackY - h, x2: x, y2: trackY + h, stroke: COLOR.ink, strokeWidth: 5, strokeLinecap: 'round' },
    };
  });
  const handleX = startX + 0.62 * (endX - startX);
  const handle = { type: 'circle', props: { cx: handleX, cy: trackY, r: 26, fill: COLOR.project, stroke: COLOR.paper, strokeWidth: 6 } };
  const handleRing = { type: 'circle', props: { cx: handleX, cy: trackY, r: 40, fill: 'none', stroke: COLOR.project, strokeWidth: 4 } };
  return svgOverlay([track, ...ticks, handleRing, handle]);
}

// --- Post registry -----------------------------------------------------
// Facts are copy-pasted from each post's own `impact` frontmatter
// (docs/design/COVER_ART.md rule: never invent a number here).
const POSTS = [
  {
    slug: 'jabodetabek-connect',
    motif: motifJabodetabekConnect,
    stats: [
      { value: '128', label: 'Stations' },
      { value: '13', label: 'Lines' },
    ],
  },
  {
    slug: 'jakarta-transit-heritage-explorer',
    motif: motifJakartaTransitHeritage,
    stats: [
      { value: '3', label: 'Nodes' },
      { value: '1,802 m', label: 'Reference route' },
    ],
  },
  {
    slug: 'cdmp-jabodetabek',
    motif: motifCdmpJabodetabek,
    stats: [
      { value: '14', label: 'Projects mapped' },
      { value: '1989–2027', label: 'Span' },
    ],
  },
];

async function renderCover({ motif, stats }) {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          position: 'relative',
          width: `${WIDTH}px`,
          height: `${HEIGHT}px`,
          display: 'flex',
          backgroundColor: COLOR.paper,
        },
        children: [graticule(), motif(), statStamp(stats)],
      },
    },
    { width: WIDTH, height: HEIGHT, fonts },
  );
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } });
  return resvg.render().asPng();
}

async function main() {
  const only = process.argv[2];
  const targets = only ? POSTS.filter((p) => p.slug === only) : POSTS;
  if (only && targets.length === 0) {
    console.error(`No cover config for slug "${only}". Known slugs: ${POSTS.map((p) => p.slug).join(', ')}`);
    process.exit(1);
  }
  for (const post of targets) {
    const png = await renderCover(post);
    const outPath = join(process.cwd(), 'src/content/posts', `${post.slug}-cover.png`);
    writeFileSync(outPath, png);
    console.log(`Wrote ${outPath} (${png.length} bytes)`);
  }
}

main();
