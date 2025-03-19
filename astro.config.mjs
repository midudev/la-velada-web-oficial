// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react({
      include: ["**/*.tsx", "**/*.jsx"],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  experimental: {
    svg: {
      mode: "sprite",
    },
  },
});
