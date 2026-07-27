// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import vercel from '@astrojs/vercel'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  output: 'server',

  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    inlineStylesheets: 'auto',
  },

  // imageService: las pocas imágenes de astro:assets (artistas) se optimizan
  // vía Vercel Image Optimization en lugar de sharp, que pesaba ~16 MB dentro
  // de la función serverless solo para el endpoint runtime /_image que ninguna
  // ruta usa (todas las páginas con imágenes locales son prerender).
  adapter: vercel({ imageService: true }),

  integrations: [sitemap()],

  site: 'https://www.infolavelada.com/',
})
