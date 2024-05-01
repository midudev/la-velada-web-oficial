import { VoteSelections, db } from "astro:db"

import { COMBATS } from "@/consts/combats"

export default async function seed() {
	const teams = COMBATS.flatMap(({ boxers, teams }) => teams ?? boxers).map((id) => ({ id }))
	await db.insert(VoteSelections).values(teams)
}

// -> .map()
// [["agustin-51", "carreraaa"], ["guanyar", "la-cobra"], ["zeling-nissaxter", "alana-ama-blitz"]]

// -> .flatMap()
// ["agustin-51", "carreraaa", "guanyar", "la-cobra", "zeling-nissaxter", "alana-ama-blitz"]

// finalmente
// [{ id: "agustin-51" }, { id: "carreraaa" }, { id: "guanyar" }, { id: "la-cobra" }, { id: "zeling-nissaxter" }, { id: "alana-ama-blitz" }]
