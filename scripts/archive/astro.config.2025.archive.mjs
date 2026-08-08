/**
 * Reference Astro config for rebuilding the 2025 static archive.
 * Applied on a worktree of `la-velada-v` (or tag) before `astro build`.
 * Output is published to `public/2025/` via `scripts/archive/publish-dist.sh`.
 *
 * Also required on that worktree:
 * - Remove `src/pages/api/**` (no SSR APIs in static mode)
 * - Make `porra.astro` prerendered without auth
 * - Prefix internal links with `/2025/` (not filesystem `public/` imports or CDN hosts)
 */
// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  base: '/2025/',
  site: 'https://www.infolavelada.com',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'always',
  },
  integrations: [sitemap()],
})
