import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const WIDTH = 1200;
const HEIGHT = 630;

// Atlas tokens (M6/T-48, docs/design/atlas/README.md), not read from
// global.css: this file runs at build time under satori/resvg, outside any
// CSS cascade, so the values are duplicated here by hand — same tradeoff
// the self-hosted TTF fonts below already make.
const COLOR = {
  paper: '#f2ebda',
  ink: '#171512',
  inkMuted: '#4a4238',
  line: '#c9bfa6',
  accent: '#2c4630',
};

/*
 * Read from a path relative to process.cwd() (the project root), not
 * import.meta.url — Vite bundles this module into dist/.prerender/chunks/
 * at build time, which breaks import.meta.url-relative paths but leaves
 * the on-disk source tree (and the build's working directory) untouched.
 */
function loadFont(filename: string): Buffer {
  return readFileSync(join(process.cwd(), 'src/lib/og-fonts', filename));
}

// Static per-weight TTF cuts (fontsource.org), not the self-hosted variable
// Archivo the live site uses (public/fonts/archivo-variable-latin.woff2) —
// satori/resvg's font handling doesn't support that file's woff2 compression
// or its wdth axis (same constraint that made the original Bodoni Moda/Karla
// cuts weight-specific TTFs, not a variable font). IBM Plex Mono here is a
// second, separate download from public/fonts/ibm-plex-mono-400-latin.woff2
// for the same reason — the site's copy is woff2-only.
const fonts = [
  { name: 'Archivo', data: loadFont('archivo-800.ttf'), weight: 800 as const, style: 'normal' as const },
  { name: 'Archivo', data: loadFont('archivo-600.ttf'), weight: 600 as const, style: 'normal' as const },
  { name: 'Archivo', data: loadFont('archivo-400.ttf'), weight: 400 as const, style: 'normal' as const },
  { name: 'IBM Plex Mono', data: loadFont('ibm-plex-mono-400.ttf'), weight: 400 as const, style: 'normal' as const },
];

interface OgImageProps {
  eyebrow: string;
  title: string;
  meta: string;
}

export async function renderOgImage({ eyebrow, title, meta }: OgImageProps): Promise<Buffer> {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: `${WIDTH}px`,
          height: `${HEIGHT}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: COLOR.paper,
          padding: '64px 72px',
          fontFamily: 'Archivo',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'IBM Plex Mono',
                fontSize: '22px',
                fontWeight: 400,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: COLOR.accent,
              },
              children: eyebrow,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                fontFamily: 'Archivo',
                fontWeight: 800,
                fontSize: title.length > 70 ? '58px' : '68px',
                lineHeight: 1.12,
                color: COLOR.ink,
                maxWidth: '1000px',
              },
              children: title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                borderTop: `2px solid ${COLOR.line}`,
                paddingTop: '28px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', fontSize: '24px', color: COLOR.inkMuted, marginBottom: '10px' },
                    children: meta,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', fontSize: '24px', fontWeight: 600, color: COLOR.ink },
                    children: 'Afreza Hernanda — knowledge hub',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    { width: WIDTH, height: HEIGHT, fonts },
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } });
  return resvg.render().asPng();
}
