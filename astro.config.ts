import db from "@astrojs/db"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import vercel from "@astrojs/vercel/serverless"
import { defineConfig } from "astro/config"
import auth from "auth-astro"
import { VitePWA } from "vite-plugin-pwa"

// Helper imports
import { manifest, seoConfig } from "./src/utils/seoConfig"

// https://astro.build/config
export default defineConfig({
	prefetch: true,
	devToolbar: {
		enabled: false,
	},
	integrations: [tailwind(), sitemap(), auth(), db()],
	adapter: vercel({
		webAnalytics: {
			enabled: true,
		},
	}),
	build: {
		inlineStylesheets: "always",
	},
	output: "server",
	site: seoConfig.baseURL,
	vite: {
		build: {
			cssMinify: "lightningcss",
		},
		ssr: {
			noExternal: ["path-to-regexp"],
		},
		plugins: [
			VitePWA({
				registerType: "autoUpdate",
				manifest,
				workbox: {
					globDirectory: ".vercel/output/static",
					globPatterns: [
						"**/*.{html,js,css,svg,avif,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}",
					],
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
