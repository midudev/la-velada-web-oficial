export interface Skill {
    name: string; // Nombre de la habilidad (ej. "reflejos", "velocidad")
    level: number; // Nivel de la habilidad
    description?: string; // Descripción opcional de la habilidad
    maxLevel?: number; // Nivel máximo opcional
  }