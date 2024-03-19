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

export interface Sponsors {
	id: SponsorId
	name: SponsorName
	url: string
	image: {
		width: number
		height: number
	}
}
