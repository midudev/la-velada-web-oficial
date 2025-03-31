import type { Attribute } from "@/types/g_attribute";
import type { Skill } from "@/types/g_skill";

// Valores base para los atributos
export const BASE_ATTRIBUTES: Attribute[] = [
  { name: 'carisma', value: 0, description: 'El carisma es la capacidad para atraer o fascinar.<br>Para el cálculo de carisma se ha utilizado la siguiente fórmula'+
    '<br><b>Nivel:</b> Suma de todos los seguidores en las distintas redes sociales del luchador, dividido entre 999.999'
    , maxValue: 10 },
  { name: 'fuerza', value: 0, description: 'Capacidad física para golpear', maxValue: 10 },
  { name: 'resistencia', value: 0, description: 'Capacidad para soportar daño', maxValue: 10 },
];

// Valores base para las habilidades
export const BASE_SKILLS: Skill[] = [
  { name: 'reflejos', level: 0, description: 'Velocidad de reacción', maxLevel: 5 },
  { name: 'velocidad', level: 0, description: 'Capacidad para moverse rápido', maxLevel: 5 },
  { name: 'potencia de golpe', level: 0, description: 'Fuerza en los golpes', maxLevel: 5 },
  { name: 'resistencia física', level: 0, description: 'Capacidad para mantener el esfuerzo', maxLevel: 5 },
];