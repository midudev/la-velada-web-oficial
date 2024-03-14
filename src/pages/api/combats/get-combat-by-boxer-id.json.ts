import { COMBATS } from "@/consts/combats"
import type { APIRoute } from "astro"

export const prerender = false

export const GET: APIRoute = ({ url }) => {
	const boxerId = url.searchParams.get("id")

	const combat = COMBATS.find((combat) => combat.boxers.includes(boxerId as string))

	if (!combat) {
		return new Response(JSON.stringify("Not found"), { status: 404 })
	}
	return new Response(JSON.stringify(combat), {
		headers: {
			"content-type": "application/json",
		},
	})
}
