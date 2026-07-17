// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // Used to build absolute URLs (og:image, canonical). Update if/when T-20
  // (custom domain) lands.
  site: 'https://knowledge-hub-inky.vercel.app',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx()]
});