import type { Sponsors } from "@/types/Sponsors"

import Alsa from "@/assets/sponsors/Alsa.svg"
import Cerave from "@/assets/sponsors/Cerave.svg"
import CocaCola from "@/assets/sponsors/CocaCola.svg"
import ElPozo from "@/assets/sponsors/ElPozo.svg"
import Grefusa from "@/assets/sponsors/Grefusa.svg"
import GShock from "@/assets/sponsors/GShock.svg"
import InfoJobs from "@/assets/sponsors/Infojobs.svg"
import Mahou from "@/assets/sponsors/Mahou.svg"
import Maxibon from "@/assets/sponsors/Maxibon.svg"
import Nothing from "@/assets/sponsors/Nothing.svg"
import Prime from "@/assets/sponsors/PrimeH.svg"
import Revolut from "@/assets/sponsors/Revolut.svg"
import Spotify from "@/assets/sponsors/Spotify.svg"
import Vicio from "@/assets/sponsors/Vicio.svg"

export const SPONSORS: Array<Sponsors> = [
	{
		id: "alsa",
		name: "Alsa",
		icon: Alsa,
		url: "https://alsa.es/",
		image: {
			width: 133 * 0.7 * 0.65,
			height: 38 * 0.7 * 0.65,
		},
	},
	{
		id: "spotify",
		name: "Spotify",
		icon: Spotify,
		url: "https://spotify.com/",
		image: {
			name: "spotify-3",
			width: 207 * 0.5 * 0.65,
			height: 52 * 0.5 * 0.65,
		},
	},
	{
		id: "revolut",
		name: "Revolut",
		icon: Revolut,
		url: "https://revolut.com/",
		image: {
			width: 177 * 0.75 * 0.65,
			height: 32 * 0.75 * 0.65,
		},
	},
	{
		id: "vicio",
		name: "Vicio",
		icon: Vicio,
		url: "https://www.ganasdevicio.com/",
		image: {
			width: 164 * 0.6 * 0.65,
			height: 35 * 0.6 * 0.65,
		},
	},
	{
		id: "coca-cola",
		name: "Coca-Cola",
		icon: CocaCola,
		url: "https://www.coca-cola.com/es/es",
		image: {
			width: 220 * 0.4 * 0.65,
			height: 94 * 0.4 * 0.65,
		},
	},
	{
		id: "infojobs",
		name: "InfoJobs",
		icon: InfoJobs,
		url: "https://infojobs.net",
		image: {
			width: 140 * 0.65 * 0.65,
			height: 77 * 0.65 * 0.65,
		},
	},

	{
		id: "grefusa",
		name: "Grefusa",
		icon: Grefusa,
		url: "https://grefusa.com/",
		image: {
			width: 144 * 0.55 * 0.65,
			height: 69 * 0.55 * 0.65,
		},
	},
	{
		id: "nothing",
		name: "Nothing",
		icon: Nothing,
		url: "https://intl.nothing.tech/",
		image: {
			width: 144 * 0.7 * 0.65,
			height: 69 * 0.7 * 0.65,
		},
	},
	{
		id: "cerave",
		name: "Cerave",
		icon: Cerave,
		url: "https://cerave.es/",
		image: {
			width: 180 * 0.55 * 0.65,
			height: 53 * 0.55 * 0.65,
		},
	},
	{
		id: "mahou",
		name: "Mahou",
		icon: Mahou,
		url: "https://www.mahou.es/",
		image: {
			width: 200 * 0.35 * 0.65,
			height: 100 * 0.35 * 0.65,
		},
	},
	{
		id: "maxibon",
		name: "Maxibon",
		icon: Maxibon,
		url: "https://maxibon.es/",
		image: {
			width: 176 * 0.45 * 0.65,
			height: 73 * 0.45 * 0.65,
		},
	},
	{
		id: "prime-h",
		name: "Prime",
		icon: Prime,
		url: "https://drinkprime.com/",
		image: {
			width: 200 * 0.65,
			height: 49 * 0.65,
		},
	},
	{
		id: "el-pozo",
		name: "ElPozo",
		icon: ElPozo,
		url: "https://elpozo.com/",
		image: {
			width: 134 * 0.65,
			height: 72 * 0.65,
		},
	},
	{
		id: "g-shock",
		name: "G-Shock",
		icon: GShock,
		url: "https://gshock.casio.com/es/",
		image: {
			width: 200 * 0.65,
			height: 69 * 0.65,
		},
	},
] as const
