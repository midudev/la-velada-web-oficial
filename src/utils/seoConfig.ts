// Type imports
import type { ManifestOptions } from "vite-plugin-pwa"

/**
 * Defines the default SEO configuration for the website.
 */
export const seoConfig = {
	baseURL: "https://lavelada.es/", // Production URL.
	description:
		"Web Oficial de La Velada del Año IV, evento de boxeo entre streamers y creadores de contenido, organizado por Ibai Llanos.",
	type: "website",
	image: {
		url: "https://cdn.lavelada.dev/og.jpg",
		alt: "La Velada",
		width: 705,
		height: 606,
	},
	siteName: "La Velada",
	twitter: {
		card: "summary_large_image",
	},
}

/**
 * Defines the configuration for PWA webmanifest.
 */
export const manifest: Partial<ManifestOptions> = {
	name: "La Velada",
	short_name: "La Velada",
	description:
		"Web Oficial de La Velada del Año IV, evento de boxeo entre streamers y creadores de contenido, organizado por Ibai Llanos.",
	theme_color: "#d5ff00",
	background_color: "#d5ff00",
	display: "fullscreen",
	icons: [
		{
			src: "/img/icons/favicon-192x192.png",
			sizes: "192x192",
			type: "image/png",
		},
		{
			src: "/img/icons/favicon-512x512.png",
			sizes: "512x512",
			type: "image/png",
		},
		{
			src: "/img/icons/favicon-512x512.png",
			sizes: "512x512",
			type: "image/png",
			purpose: "any maskable",
		},
	],
	screenshots: [
		{
			src: "https://cdn.lavelada.dev/screenshots/desktop_1.jpg",
			type: "image/jpeg",
			sizes: "1024x964",
			form_factor: "wide",
		},
		{
			src: "https://cdn.lavelada.dev/screenshots/desktop_2.jpg",
			type: "image/jpeg",
			sizes: "1024x964",
			form_factor: "wide",
		},
		{
			src: "https://cdn.lavelada.dev/screenshots/mobile_1.jpg",
			type: "image/jpeg",
			sizes: "360x593",
			form_factor: "narrow",
		},
		{
			src: "https://cdn.lavelada.dev/screenshots/mobile_2.jpg",
			type: "image/jpeg",
			sizes: "360x593",
			form_factor: "narrow",
		},
	],
}
