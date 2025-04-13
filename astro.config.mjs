// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import auth from 'auth-astro';

import vercel from '@astrojs/vercel/serverless';
import sitemap from '@astrojs/sitemap'
import react from '@astrojs/react'

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


  integrations: [react(), sitemap(), auth()],

  site: 'https://www.infolavelada.com/',

  adapter: vercel({
    edgeMiddleware: true,
    include: ['@auth/core/providers/twitch']
  })
});
