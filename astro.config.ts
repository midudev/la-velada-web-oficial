import db from "@astrojs/db"
import sitemap from "@astrojs/sitemap"
import vercel from "@astrojs/vercel"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import { VitePWA } from "vite-plugin-pwa"

// Helper imports
import { manifest, seoConfig } from "./src/utils/seoConfig"

// https://astro.build/config
export default defineConfig({
	build: {
		inlineStylesheets: "always",
	},
	compressHTML: true,
	prefetch: true,
	devToolbar: {
		enabled: false,
	},
	integrations: [sitemap(), /* auth(), */ db()],
	adapter: vercel({
		webAnalytics: {
			enabled: true,
		},
	}),
	output: "server",
	site: seoConfig.baseURL,
	vite: {
		ssr: {
			noExternal: ["path-to-regexp"],
		},
		plugins: [
			tailwindcss(),
			VitePWA({
				registerType: "autoUpdate",
				manifest,
				workbox: {
					globDirectory: ".vercel/output/static",
					globPatterns: ["**/*.{html,js,css,woff,woff2,ttf,eot,ico}"],
					runtimeCaching: [
						{
							urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
							handler: "CacheFirst",
							options: {
								cacheName: "images",
								expiration: {
									maxEntries: 100,
									maxAgeSeconds: 30 * 24 * 60 * 60,
								},
							},
						},
						{
							urlPattern: /\.(?:woff|woff2|ttf|eot|ico)$/,
							handler: "CacheFirst",
							options: {
								cacheName: "fonts",
								expiration: {
									maxEntries: 10,
									maxAgeSeconds: 30 * 24 * 60 * 60,
								},
							},
						},
					],
					navigateFallback: null,
				},
			}),
		],
	},
})
