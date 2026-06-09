// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import vercel from '@astrojs/vercel'
import sitemap from '@astrojs/sitemap'

import auth from 'auth-astro'
import react from '@astrojs/react'

export default defineConfig({
  output: 'server',

  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    inlineStylesheets: 'always',
  },

  adapter: vercel(),

  integrations: [react(), sitemap(), auth()],

  site: 'https://www.infolavelada.com/',
})