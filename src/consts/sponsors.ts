interface Sponsors {
	id: string
	name: string
	url: string
	image: {
		width: number | string
		height: number | string
	}
}

export const SPONSORS: Sponsors[] = [
	{
		id: "vicio",
		name: "Vicio",
		url: "https://www.ganasdevicio.com/",
		image: {
			width: 128,
			height: 70,
		},
	},
	{
		id: "revolut",
		name: "Revolut",
		url: "https://revolut.com/",
		image: {
			width: 128,
			height: 70,
		},
	},
	{
		id: "prime",
		name: "Prime",
		url: "https://drinkprime.com/",
		image: {
			width: 128,
			height: 70,
		},
	},
	{
		id: "alsa",
		name: "Alsa",
		url: "https://alsa.es/",
		image: {
			width: 128,
			height: 70,
		},
	},
	{
		id: "spotify",
		name: "Spotify",
		url: "https://spotify.com/",
		image: {
			width: 128,
			height: 70,
		},
	},
	{
		id: "cerave",
		name: "Cerave",
		url: "https://cerave.es/",
		image: {
			width: 128,
			height: 70,
		},
	},
	{
		id: "el-pozo",
		name: "El Pozo",
		url: "https://elpozo.com/",
		image: {
			width: 128,
			height: 70,
		},
	},
	{
		id: "grefusa",
		name: "Grefusa",
		url: "https://grefusa.com/",
		image: {
			width: 128,
			height: 70,
		},
	},
	{
		id: "maxibon",
		name: "Maxibon",
		url: "https://maxibon.es/",
		image: {
			width: 128,
			height: 70,
		},
	},
] as const
