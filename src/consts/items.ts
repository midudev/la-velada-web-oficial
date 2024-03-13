interface Item {
	imgSrc: string,
	imgAlt: string,
	title: string,
	description: string,
}

export const items : Item[] = [
	{
		imgSrc: "/img/event/evento.webp",
		imgAlt: "Evento",
		title: "EL EVENTO",
		description: "Lugar y agenda del evento",
	},
	{
		imgSrc: "/img/event/entradas.webp",
		imgAlt: "Entradas",
		title: "ENTRADAS",
		description: "A la venta próximamente",
	},
	{
		imgSrc: "/img/event/combates.webp",
		imgAlt: "Combates",
		title: "COMBATES",
		description: "Información de los contrincantes",
	},
	{
		imgSrc: "/img/event/pronosticos.webp",
		imgAlt: "Pronóstico",
		title: "PRONÓSTICOS",
		description: "Predicciones de victoria",
	},
] as const 