import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const WIDTH = 1200;
const HEIGHT = 630;

const COLOR = {
  paper: '#f5efe1',
  ink: '#18140f',
  inkMuted: '#6b6152',
  line: '#ddd3bc',
  accent: '#38523a',
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

const fonts = [
  { name: 'Bodoni Moda', data: loadFont('bodoni-800.ttf'), weight: 800 as const, style: 'normal' as const },
  { name: 'Karla', data: loadFont('karla-400.ttf'), weight: 400 as const, style: 'normal' as const },
  { name: 'Karla', data: loadFont('karla-600.ttf'), weight: 600 as const, style: 'normal' as const },
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
          fontFamily: 'Karla',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                fontSize: '22px',
                fontWeight: 600,
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
                fontFamily: 'Bodoni Moda',
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
