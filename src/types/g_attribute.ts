export interface Attribute {
    name: string; // Nombre del atributo (ej. "carisma", "fuerza")
    value: number; // Valor del atributo
    description?: string; // Descripción opcional del atributo
    maxValue?: number; // Valor máximo opcional
  }