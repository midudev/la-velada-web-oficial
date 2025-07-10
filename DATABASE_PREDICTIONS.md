# Base de Datos de Predicciones - La Velada del Año V

Esta documentación describe la configuración y uso de la base de datos de predicciones para La Velada del Año V.

## Configuración

La base de datos utiliza **Turso** (SQLite en la nube) y requiere las siguientes variables de entorno:

```env
TURSO_DATABASE_URL=libsql://your-database-url
TURSO_AUTH_TOKEN=your-auth-token
```

## Estructura de la Base de Datos

### Tabla `predictions`

Almacena el conteo de votos por combate y luchador.

```sql
CREATE TABLE predictions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  combat_id TEXT NOT NULL,
  fighter_id TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(combat_id, fighter_id)
);
```

**Campos:**

- `id`: Identificador único autoincremental
- `combat_id`: ID del combate (ej: `1-peereira-vs-rivaldios`)
- `fighter_id`: ID del luchador (ej: `peereira`)
- `votes`: Número total de votos para este luchador en este combate
- `created_at`: Fecha de creación del registro
- `updated_at`: Fecha de última actualización

### Tabla `user_votes`

Almacena los votos individuales de cada usuario para evitar duplicados.

```sql
CREATE TABLE user_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  combat_id TEXT NOT NULL,
  fighter_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(combat_id, user_id)
);
```

**Campos:**

- `id`: Identificador único autoincremental
- `combat_id`: ID del combate
- `fighter_id`: ID del luchador votado
- `user_id`: ID del usuario que votó
- `created_at`: Fecha del voto

**Restricción:** Un usuario solo puede votar una vez por combate (UNIQUE en `combat_id, user_id`)

## Inicialización

### Primera vez

Para crear las tablas e inicializar los registros por primera vez:

```bash
pnpm db:init
```

Este comando:

1. Crea las tablas `predictions` y `user_votes`
2. Inserta registros iniciales para todos los combates con 0 votos
3. Muestra un resumen de lo que se ha creado

### Verificar estado

Para verificar el estado actual de la base de datos:

```bash
pnpm db:check
```

Este comando muestra:

- Estadísticas generales de las tablas
- Predicciones por combate con porcentajes
- Top combates y luchadores por votos
- Estado de la integridad de datos

## Combates Disponibles

| ID                        | Combate                  | Luchadores          |
| ------------------------- | ------------------------ | ------------------- |
| `1-peereira-vs-rivaldios` | Peereira7 vs Rivaldios   | peereira, rivaldios |
| `2-perxitaa-vs-gaspi`     | Perxitaa vs Gaspi        | perxitaa, gaspi     |
| `3-abby-vs-roro`          | Abby vs Roro             | abby, roro          |
| `4-andoni-vs-carlos`      | Andoni vs Carlos Belcast | andoni, carlos      |
| `5-alana-vs-arigeli`      | Alana vs Ari Geli        | alana, arigeli      |
| `6-viruzz-vs-tomas`       | Viruzz vs Tomas Mazza    | viruzz, tomas       |
| `7-grefg-vs-westcol`      | The Grefg vs Westcol     | grefg, westcol      |

## Luchadores Disponibles

| ID         | Nombre    | ID          | Nombre         |
| ---------- | --------- | ----------- | -------------- |
| `peereira` | Peereira7 | `rivaldios` | Rivaldios      |
| `perxitaa` | Perxitaa  | `gaspi`     | Gaspi          |
| `abby`     | Abby      | `roro`      | Roro           |
| `andoni`   | Andoni    | `carlos`    | Carlos Belcast |
| `alana`    | Alana     | `arigeli`   | Ari Geli       |
| `viruzz`   | Viruzz    | `tomas`     | Tomas Mazza    |
| `grefg`    | The Grefg | `westcol`   | Westcol        |

## API Endpoints

### GET /api/predictions

Obtiene todas las predicciones o las de un combate específico.

**Parámetros:**

- `combat_id` (opcional): ID del combate específico

**Ejemplos:**

```bash
# Todas las predicciones
GET /api/predictions

# Predicciones de un combate específico
GET /api/predictions?combat_id=1-peereira-vs-rivaldios
```

### POST /api/predictions

Registra un voto para un luchador en un combate.

**Cuerpo:**

```json
{
  "combat_id": "1-peereira-vs-rivaldios",
  "fighter_id": "peereira"
}
```

**Requisitos:**

- Usuario autenticado (sesión requerida)
- `combat_id` y `fighter_id` válidos

## Funcionalidades

### Control de Votos Únicos

- Cada usuario puede votar **una sola vez** por combate
- Si intenta votar por el mismo luchador, recibe confirmación
- Si cambia su voto, se actualiza automáticamente el conteo

### Integridad de Datos

- Los votos se mantienen sincronizados entre `predictions` y `user_votes`
- Al cambiar un voto, se decrementa el contador del luchador anterior
- Garantiza que los totales sean siempre precisos

### Privacidad

- El sistema no expone información de usuarios en las respuestas GET
- Los votos se asocian automáticamente con el usuario autenticado

## Mantenimiento

### Backup

```bash
# Exportar datos de predicciones
sqlite3 your-database.db ".dump predictions user_votes" > backup.sql
```

### Limpieza

```bash
# Eliminar votos de usuarios inactivos (ejemplo)
DELETE FROM user_votes WHERE created_at < datetime('now', '-30 days');
```

### Estadísticas

```sql
-- Total de votos por combate
SELECT combat_id, SUM(votes) as total_votes
FROM predictions
GROUP BY combat_id
ORDER BY total_votes DESC;

-- Usuarios más activos
SELECT user_id, COUNT(*) as votes_count
FROM user_votes
GROUP BY user_id
ORDER BY votes_count DESC
LIMIT 10;
```

## Troubleshooting

### Error: "Tabla no existe"

```bash
pnpm db:init
```

### Error: "Usuario no autenticado"

Verificar que el usuario tenga una sesión válida en auth-astro.

### Error: "Combate no encontrado"

Verificar que el `combat_id` esté en la lista de combates disponibles.

### Error: "Luchador no encontrado"

Verificar que el `fighter_id` esté en la lista de luchadores disponibles.

## Desarrollo

### Agregar un nuevo combate

1. Agregar el combate en `src/consts/combats.ts`
2. Ejecutar `pnpm db:init` para crear los registros iniciales

### Agregar un nuevo luchador

1. Agregar el luchador en `src/consts/fighters.ts`
2. Actualizar los combates que lo incluyan
3. Ejecutar `pnpm db:init` para crear los registros iniciales
