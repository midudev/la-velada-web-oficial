// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import vercel from '@astrojs/vercel'
import auth from 'auth-astro';
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

    svg: true
   },

  adapter: vercel(),

  integrations: [sitemap(), auth(), react()],

  site: 'https://www.infolavelada.com/',
})