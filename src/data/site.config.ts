interface SiteConfig {
	author: string
	title: string
	shortDescription: string
	description: string
	lang: string
	ogLocale: string
	shareMessage: string
	paginationSize: number
}

export const siteConfig: SiteConfig = {
	author: "@ibai", // Site author
	title: "La Velada 4", // Site title.
	shortDescription: "Evento de Boxeo de Ibai LLanos",
	description: "Evento de boxeo entre streamers y creadores de contenido, organizado por Ibai Llanos", // Description to display in the meta tags
	lang: "es-ES",
	ogLocale: "es_ES",
	shareMessage: "Share this post", // Message to share a post on social media
	paginationSize: 6, // Number of posts per page
}
