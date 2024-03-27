import { column, defineDb } from "astro:db"

const VoteSelections = {
	columns: {
		id: column.text({ primaryKey: true }),
	},
}

const Votes = {
	columns: {
		id: column.text({ primaryKey: true }), // `userId-combatId`
		combatId: column.text(),
		userId: column.text(),
		voteId: column.text({ references: () => VoteSelections.columns.id }),
		votedAt: column.date(),
	},
}

// https://astro.build/db/config
export default defineDb({
	tables: {
		VoteSelections,
		Votes,
	},
})
