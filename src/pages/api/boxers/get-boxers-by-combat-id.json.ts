import type { APIRoute } from "astro"
import { BOXERS } from "@/consts/boxers"
import { COMBATS } from "@/consts/combats"

export const prerender = false

export const GET: APIRoute = ({ url }) => {
	const combatId = url.searchParams.get("id")

	const combat = COMBATS.find((combat) => combat.id === (combatId as string))

	if (!combat) {
		return new Response(JSON.stringify("Not found"), { status: 404 })
	}

	const boxers = BOXERS.filter((boxer) => combat.boxers.includes(boxer.id))

	if (boxers.length === 0) {
		return new Response(JSON.stringify("Not found"), { status: 404 })
	}

	return new Response(JSON.stringify(boxers), {
		headers: {
			"content-type": "application/json",
		},
	})
}
