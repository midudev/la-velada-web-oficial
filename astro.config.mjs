// @ts-check
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

export default defineConfig({
  output: 'server',

  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    inlineStylesheets: 'always',
  },

  experimental: {
    svg: true,
  },

  adapter: vercel(),

  integrations: [sitemap()],

  site: 'https://www.infolavelada.com/',
})
