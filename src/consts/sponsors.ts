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

interface Sponsors {
	id: SponsorId
	name: SponsorName
	url: string
	image: {
		width: number
		height: number
	}
}

export const SPONSORS: Array<Sponsors> = [
	{
		id: "vicio",
		name: "Vicio",
		url: "https://www.ganasdevicio.com/",
		image: {
			width: 164,
			height: 35,
		},
	},
	{
		id: "revolut",
		name: "Revolut",
		url: "https://revolut.com/",
		image: {
			width: 177,
			height: 32,
		},
	},
	{
		id: "prime",
		name: "Prime",
		url: "https://drinkprime.com/",
		image: {
			width: 144,
			height: 49,
		},
	},
	{
		id: "alsa",
		name: "Alsa",
		url: "https://alsa.es/",
		image: {
			width: 133,
			height: 38,
		},
	},
	{
		id: "spotify",
		name: "Spotify",
		url: "https://spotify.com/",
		image: {
			width: 207,
			height: 52,
		},
	},
	{
		id: "cerave",
		name: "Cerave",
		url: "https://cerave.es/",
		image: {
			width: 180,
			height: 53,
		},
	},
	{
		id: "el-pozo",
		name: "ElPozo",
		url: "https://elpozo.com/",
		image: {
			width: 134,
			height: 72,
		},
	},
	{
		id: "grefusa",
		name: "Grefusa",
		url: "https://grefusa.com/",
		image: {
			width: 144,
			height: 69,
		},
	},
	{
		id: "maxibon",
		name: "Maxibon",
		url: "https://maxibon.es/",
		image: {
			width: 176,
			height: 73,
		},
	},
	{
		id: "infojobs",
		name: "InfoJobs",
		url: "https://infojobs.net",
		image: {
			width: 140,
			height: 77,
		},
	},
] as const
