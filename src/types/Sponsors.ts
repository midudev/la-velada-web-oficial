type SponsorId =
	| "vicio"
	| "revolut"
	| "prime-h"
	| "alsa"
	| "spotify"
	| "cerave"
	| "grefusa"
	| "el-pozo"
	| "maxibon"
	| "infojobs"
	| "coca-cola"
	| "mahou"
	| "g-shock"

type SponsorName =
	| "Vicio"
	| "Revolut"
	| "Prime"
	| "Alsa"
	| "Spotify"
	| "Cerave"
	| "Grefusa"
	| "ElPozo"
	| "Maxibon"
	| "InfoJobs"
	| "Coca-Cola"
	| "Mahou"
	| "G-Shock"

export interface Sponsors {
	id: SponsorId
	name: SponsorName
	url: string
	image: {
		name?: string
		width: number
		height: number
	}
}
