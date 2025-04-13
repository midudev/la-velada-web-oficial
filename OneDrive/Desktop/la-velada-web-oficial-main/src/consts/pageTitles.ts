export const fixedTitle: string = 'La Velada del Año V Web Oficial - Evento de boxeo de Ibai Llanos con creadores de contenido'

export const porra: string = `La Porra - ${fixedTitle}`

export const combates: string = `Combates - ${fixedTitle}`

export const combate = (fighter1: string | undefined, fighter2: string | undefined): string => `${fighter1} vs ${fighter2} - ${fixedTitle}`

export const entradas: string = `Entradas - ${fixedTitle}`