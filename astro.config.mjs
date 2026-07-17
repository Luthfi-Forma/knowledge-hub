// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Used to build absolute URLs (og:image, canonical, sitemap, RSS). Update
  // if/when T-20 (custom domain) lands.
  site: 'https://knowledge-hub-inky.vercel.app',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    mdx(),
    sitemap({
      // OG images are PNG endpoints, not pages; 404 shouldn't be indexed.
      filter: (page) => !page.includes('/og/') && !page.endsWith('/404'),
    }),
  ]
});