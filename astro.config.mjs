// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Pages that are user-data-dependent app shells (noindex). Keep them out of the
// sitemap so they don't dilute crawl/quality signals. The static, indexable
// example lives at /example-report/ instead.
const NOINDEX = ['/dashboard/', '/logbook/', '/report/'];

export default defineConfig({
  site: 'https://earnlog.xyz',
  integrations: [
    sitemap({
      filter: (page) => !NOINDEX.some((p) => page === `https://earnlog.xyz${p}`),
    }),
    react(),
  ],
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
