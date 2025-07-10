# 🥊 Sistema de Predicciones - La Velada del Año V

Este documento te guía paso a paso para configurar y usar el sistema de predicciones para La Velada del Año V.

## 🚀 Configuración Inicial

### 1. Variables de Entorno

Asegúrate de tener configuradas las variables de entorno para Turso:

```env
TURSO_DATABASE_URL=libsql://your-database-url
TURSO_AUTH_TOKEN=your-auth-token
```

### 2. Crear las Tablas

Ejecuta el comando para crear las tablas e inicializar los datos:

```bash
pnpm db:init
```

Este comando:

- ✅ Crea la tabla `predictions` para almacenar el conteo de votos
- ✅ Crea la tabla `user_votes` para tracking de usuarios
- ✅ Inserta registros iniciales para todos los combates con 0 votos
- ✅ Muestra un resumen de lo creado

### 3. Verificar la Configuración

Comprueba que todo esté funcionando correctamente:

```bash
pnpm db:check
```

Este comando muestra:

- 📊 Estadísticas de las tablas
- 🥊 Predicciones por combate
- 👑 Top luchadores y combates
- 🔍 Estado de integridad de datos

## 🧪 Probar el Sistema

### Simular Votos de Prueba

Para probar la funcionalidad completa:

```bash
pnpm db:test
```

Este script simula:

- 👥 5 usuarios votando en diferentes combates
- 🔄 Cambios de voto
- 📊 Cálculo de porcentajes
- ✅ Verificación de integridad

## 📋 Combates Disponibles

| ID                        | Combate                  | Luchadores          |
| ------------------------- | ------------------------ | ------------------- |
| `1-peereira-vs-rivaldios` | Peereira7 vs Rivaldios   | peereira, rivaldios |
| `2-perxitaa-vs-gaspi`     | Perxitaa vs Gaspi        | perxitaa, gaspi     |
| `3-abby-vs-roro`          | Abby vs Roro             | abby, roro          |
| `4-andoni-vs-carlos`      | Andoni vs Carlos Belcast | andoni, carlos      |
| `5-alana-vs-arigeli`      | Alana vs Ari Geli        | alana, arigeli      |
| `6-viruzz-vs-tomas`       | Viruzz vs Tomas Mazza    | viruzz, tomas       |
| `7-grefg-vs-westcol`      | The Grefg vs Westcol     | grefg, westcol      |

## 🔌 API Endpoints

### Obtener Predicciones

```bash
# Todas las predicciones
GET /api/predictions

# Predicciones de un combate específico
GET /api/predictions?combat_id=1-peereira-vs-rivaldios
```

**Respuesta:**

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

### Registrar Voto

```bash
POST /api/predictions
Content-Type: application/json

{
  "combat_id": "1-peereira-vs-rivaldios",
  "fighter_id": "peereira"
}
```

**Requisitos:**

- 🔐 Usuario autenticado (sesión requerida)
- ✅ `combat_id` y `fighter_id` válidos

**Respuesta:**

```json
{
  "message": "Voto registrado correctamente",
  "combat_id": "1-peereira-vs-rivaldios",
  "fighter_id": "peereira",
  "votes": 151
}
```

## 🎯 Funcionalidades

### Control de Votos Únicos

- 👤 Cada usuario puede votar **una sola vez** por combate
- 🔄 Si cambia su voto, se actualiza automáticamente el conteo
- ⚠️ Si vota por el mismo luchador, recibe confirmación

### Integridad de Datos

- 🔗 Los votos se mantienen sincronizados entre tablas
- 📊 Al cambiar un voto, se decrementa el contador anterior
- ✅ Garantiza que los totales sean siempre precisos

### Privacidad

- 🔒 No expone información de usuarios en respuestas GET
- 👤 Los votos se asocian automáticamente con el usuario autenticado

## 🛠️ Comandos Disponibles

| Comando         | Descripción                          |
| --------------- | ------------------------------------ |
| `pnpm db:init`  | Crear tablas e inicializar datos     |
| `pnpm db:check` | Verificar estado de la base de datos |
| `pnpm db:test`  | Simular votos de prueba              |

## 📊 Estructura de la Base de Datos

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

## 🔧 Mantenimiento

### Backup de Datos

```bash
# Exportar predicciones
sqlite3 your-database.db ".dump predictions user_votes" > backup.sql
```

### Estadísticas Útiles

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

## 🚨 Troubleshooting

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

## 📈 Próximos Pasos

1. **Configurar autenticación** con auth-astro
2. **Crear componentes de UI** para mostrar predicciones
3. **Implementar botones de voto** interactivos
4. **Agregar notificaciones** de cambios de voto
5. **Crear dashboard** de estadísticas en tiempo real

## 📞 Soporte

Si encuentras algún problema:

1. Ejecuta `pnpm db:check` para diagnosticar
2. Revisa los logs del servidor
3. Verifica las variables de entorno
4. Consulta la documentación completa en `DATABASE_PREDICTIONS.md`

---

¡El sistema de predicciones está listo para La Velada del Año V! 🥊✨
