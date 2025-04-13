// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import auth from 'auth-astro';
import vercel from '@astrojs/vercel'
import sitemap from '@astrojs/sitemap'


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

  integrations: [sitemap(), auth()],

  site: 'https://www.infolavelada.com/',
})