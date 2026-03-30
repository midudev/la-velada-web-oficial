// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import vercel from '@astrojs/vercel'
import sitemap from '@astrojs/sitemap'
import fs from 'node:fs'

import auth from 'auth-astro';

const useHttps = process.env.NO_HTTPS !== '1' && fs.existsSync('./certs/localhost.pem')
const httpsConfig = useHttps
  ? {
      key: fs.readFileSync('./certs/localhost-key.pem'),
      cert: fs.readFileSync('./certs/localhost.pem'),
    }
  : undefined

export default defineConfig({
  output: 'server',

  vite: {
    plugins: [tailwindcss()],
    server: httpsConfig ? { https: httpsConfig } : undefined,
  },

  build: {
    inlineStylesheets: 'always',
  },

  adapter: vercel(),

  integrations: [sitemap(), auth()],

  site: 'https://www.infolavelada.com/',
})