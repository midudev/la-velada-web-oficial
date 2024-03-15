import { COMBATS } from "@/consts/combats"
import type { APIRoute } from "astro"

export const GET: APIRoute = ({ params, request }) => {
	const { boxerId } = params
	console.log(boxerId)
	const combat = COMBATS.find((combat) => combat.boxers.includes(boxerId as string))
	if (combat) {
		return new Response(JSON.stringify(combat), {
			headers: {
				"content-type": "application/json",
			},
		})
	} else {
		return new Response("Not found", { status: 404 })
	}
}
