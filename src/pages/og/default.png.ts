import type { APIRoute } from 'astro';
import { renderOgImage } from '../../lib/og-image';

export const GET: APIRoute = async () => {
  const png = await renderOgImage({
    eyebrow: 'Afreza Hernanda',
    title: "I read regions through their data.",
    meta: 'Urban & Regional Planner',
  });

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
