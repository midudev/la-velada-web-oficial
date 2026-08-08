/**
 * Reference Astro config for rebuilding the 2024 static archive.
 * Applied on a worktree of `la-velada-iv` (or tag) before `astro build`.
 * Output is published to `public/2024/` via `scripts/archive/publish-dist.sh`.
 */
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'

export default defineConfig({
  base: '/2024/',
  site: 'https://www.infolavelada.com',
  output: 'static',
  build: {
    inlineStylesheets: 'always',
  },
  compressHTML: true,
  prefetch: true,
  devToolbar: {
    enabled: false,
  },
  integrations: [tailwind(), sitemap()],
  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
  },
})
