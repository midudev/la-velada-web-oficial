# API de Predicciones - La Velada del Año V

Esta API permite gestionar las predicciones de los combates de La Velada del Año V usando Turso como base de datos. Incluye tracking de usuarios para evitar votos duplicados y permitir cambios de voto. El `user_id` se obtiene automáticamente de la sesión del usuario autenticado. La validación de combates se realiza usando los datos locales para mayor eficiencia.

## Endpoints

### GET /api/get-predictions

Recupera las predicciones de los combates.

#### Parámetros de consulta (opcionales)

- `combat_id`: ID del combate específico (ej: `1-peereira-vs-rivaldios`)

#### Ejemplos de uso

**Obtener todas las predicciones:**

```bash
GET /api/get-predictions
```

**Obtener predicciones de un combate específico:**

```bash
GET /api/get-predictions?combat_id=1-peereira-vs-rivaldios
```

#### Respuesta

**Para todas las predicciones:**

```json
{
  "predictions": [
    {
      "combat_id": "1-peereira-vs-rivaldios",
      "fighter1": {
        "id": "peereira",
        "name": "Peereira7",
        "votes": 150,
        "percentage": 60
      },
      "fighter2": {
        "id": "rivaldios",
        "name": "Rivaldios",
        "votes": 100,
        "percentage": 40
      },
      "total_votes": 250
    }
  ]
}
```

**Para un combate específico:**

```json
{
  "combat_id": "1-peereira-vs-rivaldios",
  "predictions": [
    {
      "fighter_id": "peereira",
      "votes": 150,
      "percentage": 60
    },
    {
      "fighter_id": "rivaldios",
      "votes": 100,
      "percentage": 40
    }
  ],
  "total_votes": 250
}
```

### POST /api/get-predictions

Registra un voto para un luchador en un combate específico.

#### Cuerpo de la petición

```json
{
  "combat_id": "1-peereira-vs-rivaldios",
  "fighter_id": "peereira"
}
```

**Nota:** El `user_id` se obtiene automáticamente de la sesión del usuario autenticado.

#### Ejemplo de uso

```bash
curl -X POST /api/get-predictions \
  -H "Content-Type: application/json" \
  -d '{
    "combat_id": "1-peereira-vs-rivaldios",
    "fighter_id": "peereira"
  }'
```

#### Respuesta

**Voto nuevo:**

```json
{
  "message": "Voto registrado correctamente",
  "combat_id": "1-peereira-vs-rivaldios",
  "fighter_id": "peereira",
  "votes": 1
}
```

**Voto actualizado:**

```json
{
  "message": "Voto actualizado correctamente",
  "combat_id": "1-peereira-vs-rivaldios",
  "fighter_id": "peereira",
  "votes": 151
}
```

**Cambio de voto:**

```json
{
  "message": "Voto cambiado correctamente",
  "combat_id": "1-peereira-vs-rivaldios",
  "fighter_id": "rivaldios",
  "votes": 101
}
```

**Voto duplicado:**

```json
{
  "message": "Ya has votado por este luchador en este combate",
  "combat_id": "1-peereira-vs-rivaldios",
  "fighter_id": "peereira"
}
```

## Códigos de estado HTTP

- `200`: OK - Petición exitosa
- `201`: Created - Voto creado exitosamente
- `400`: Bad Request - Datos faltantes o inválidos (combat_id, fighter_id requeridos)
- `401`: Unauthorized - Usuario no autenticado
- `404`: Not Found - Combate no encontrado
- `500`: Internal Server Error - Error interno del servidor

## Estructura de la base de datos

Se requieren dos tablas para el funcionamiento completo:

### Tabla `predictions`

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

### Tabla `user_votes`

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

## IDs de combates disponibles

- `1-peereira-vs-rivaldios`
- `2-perxitaa-vs-gaspi`
- `3-abby-vs-roro`
- `4-andoni-vs-carlos`
- `5-alana-vs-arigeli`
- `6-viruzz-vs-tomas`
- `7-grefg-vs-westcol`

## IDs de luchadores disponibles

- `peereira`, `rivaldios`
- `perxitaa`, `gaspi`
- `abby`, `roro`
- `andoni`, `carlos`
- `alana`, `arigeli`
- `viruzz`, `tomas`
- `grefg`, `westcol`

## Funcionalidades de Usuario

### Control de Votos Únicos

- Cada usuario puede votar **una sola vez** por combate
- Si intenta votar por el mismo luchador, recibe un mensaje de confirmación
- Si cambia su voto, se actualiza automáticamente el conteo

### Verificación de Votos

- El sistema mantiene privacidad al no exponer información de usuarios en las respuestas GET
- Los votos se asocian automáticamente con el usuario autenticado
- Facilita la implementación de botones de voto interactivos

### Integridad de Datos

- Los votos se mantienen sincronizados entre `predictions` y `user_votes`
- Al cambiar un voto, se decrementa el contador del luchador anterior
- Garantiza que los totales sean siempre precisos
- La validación de combates se realiza usando datos locales para mayor velocidad
