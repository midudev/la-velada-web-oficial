export async function GET({ params, request }) {
	return new Response(
		JSON.stringify({
			name: "Astro",
			url: "https://astro.build/",
		})
	)
}
