import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CANONICAL_URL, SITE_BASE } from './site.config.ts'

// Static <head>, per-route HTML, sitemap and friends are written after the
// build by scripts/prerender.ts — this file only picks the base.
export default defineConfig({
  base: SITE_BASE,
  define: {
    __CANONICAL_URL__: JSON.stringify(CANONICAL_URL),
  },
  plugins: [react(), tailwindcss()],
})
