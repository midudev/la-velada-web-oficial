type SponsorId =
	| "vicio"
	| "revolut"
	| "prime"
	| "alsa"
	| "spotify"
	| "cerave"
	| "grefusa"
	| "el-pozo"
	| "maxibon"
	| "infojobs"
	| "coca-cola"
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
