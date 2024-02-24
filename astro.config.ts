import tailwind from "@astrojs/tailwind"
import vercel from "@astrojs/vercel/serverless"
import { defineConfig } from "astro/config"
import preact from "@astrojs/preact"

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind(), preact()],
	i18n: {
		defaultLocale: "es",
		locales: ["es", "en"],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	adapter: vercel({
		webAnalytics: { enabled: true },
	}),
	output: "hybrid",
	vite: {
		build: {
			cssMinify: "lightningcss",
		},
		ssr: {
			noExternal: ["path-to-regexp"],
		},
	},
})
