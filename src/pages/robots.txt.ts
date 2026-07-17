import type { APIContext } from 'astro';

export function GET({ site }: APIContext) {
  const sitemapURL = new URL('sitemap-index.xml', site);

  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${sitemapURL}\n`,
    { headers: { 'Content-Type': 'text/plain' } },
  );
}
