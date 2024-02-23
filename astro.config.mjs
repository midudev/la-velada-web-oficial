import tailwind from "@astrojs/tailwind"
import vercel from "@astrojs/vercel/serverless"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  vite: {
    build: {
      assetsInlineLimit: 30000,
    },
  },
  output: "hybrid",
})
