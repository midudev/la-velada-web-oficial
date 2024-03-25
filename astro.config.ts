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
	integrations: [tailwind(), sitemap(), auth()],
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
						"**/*.{js,css,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}",
					],
					runtimeCaching: [
						{
							urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
							handler: "CacheFirst",
							options: {
								cacheName: "images",
								expiration: {
									maxEntries: 50,
									maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
								},
							},
						},
						{
							urlPattern: /^https?.*/,
							handler: "CacheFirst",
							options: {
								cacheName: "others",
								expiration: {
									maxEntries: 100,
									maxAgeSeconds: 7 * 24 * 60 * 60, // 7 días
								},
							},
						},
						{
							urlPattern: /^https:\/\/la-velada-preview.vercel.app\//,
							handler: "NetworkFirst",
							options: {
								cacheName: "api-responses",
								networkTimeoutSeconds: 3,
								expiration: {
									maxEntries: 50,
									maxAgeSeconds: 24 * 60 * 60, // 1 día
								},
								cacheableResponse: {
									statuses: [0, 200],
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
