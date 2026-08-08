# Archivos de ediciones anteriores

Las ediciones pasadas se sirven como **snapshots estáticos** bajo el mismo dominio:

| URL | Edición | Origen |
|-----|---------|--------|
| `https://www.infolavelada.com/` | Actual (VI / 2026) | rama `main` (app viva) |
| `https://www.infolavelada.com/2025/` | Velada V | snapshot en `public/2025/` |
| `https://www.infolavelada.com/2024/` | Velada IV | snapshot en `public/2024/` |

Los subdominios `2024.infolavelada.com` y `2025.infolavelada.com` deben hacer **301** hacia las rutas con path (ver `vercel.json` con `has: host`, o el proyecto Vercel de cada subdominio).

En **dev** (`astro dev`), Vite no resuelve `public/YYYY/` → `index.html`. El plugin `scripts/archive/vite-plugin-archive-indexes.mjs` (cargado en `astro.config.mjs`) reescribe esas URLs. En producción, `vercel.json` tiene rewrites equivalentes.

## Principios

1. **La home (`/`) es siempre la edición actual.** No se mueve a `/2026/`.
2. **El pasado es estático.** No hay auth, APIs ni SSR en el archivo.
3. **Un solo dominio canónico:** `www.infolavelada.com`.
4. **Al cerrar un año se archiva una vez** y casi no se toca.

## Ritual anual (cuando empiece la siguiente edición)

Ejemplo: cerrar la Velada VI (2026) al empezar la VII.

### 1. Congelar la edición actual

```bash
git tag velada-vi-final
git push origin velada-vi-final
# Opcional: rama de archivo legible
git branch archive/2026 velada-vi-final
git push origin archive/2026
```

### 2. Worktree + modo archivo

```bash
git worktree add ../archives-build/2026 archive/2026   # o el tag
cd ../archives-build/2026
```

Aplicar **modo archivo** en esa copia:

- `astro.config`: `output: 'static'`, `base: '/2026/'`, `site: 'https://www.infolavelada.com'`
- Quitar adapter de Vercel SSR (o no usarlo en static)
- Quitar integraciones que exijan runtime (auth, APIs)
- Páginas dinámicas (`prerender = false`) → estáticas o mensaje “archivado”
- Borrar o no exportar `src/pages/api/**`
- Canónicos y OG a `https://www.infolavelada.com/2026/...`
- Enlaces internos con prefijo `/2026/` (o `import.meta.env.BASE_URL`)
- **No** prefijar imports de filesystem (`public/...`) ni URLs de CDN externas

### 3. Build y publicar en main

```bash
pnpm install --ignore-scripts
pnpm build   # o el script de build de esa edición

cd /ruta/al/repo/main
rm -rf public/2026
mkdir -p public/2026
rsync -a --exclude='*.map' ../archives-build/2026/dist/ public/2026/
```

### 4. Cablear SEO y redirects en main

- Footer: añadir `{ year: '2026', url: '/2026/' }` en `PREVIOUS_EDITIONS`
- `public/robots.txt`: añadir  
  `Sitemap: https://www.infolavelada.com/2026/sitemap-index.xml`
- `vercel.json`:
  - **No** redirigir `/2026` a un subdominio
  - Redirect host `2026.infolavelada.com` → `https://www.infolavelada.com/2026/:path*`
  - Cache headers opcionales para `/2026/(.*)`

### 5. Subdominio (importante para SEO)

Dos opciones (elige una):

**A (recomendada).** Añadir `2026.infolavelada.com` al **mismo** proyecto Vercel de `www` y dejar el redirect por `has: host` de `vercel.json`.

**B.** En el proyecto Vercel del subdominio, un único redirect 301:

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "destination": "https://www.infolavelada.com/2026/:path*",
      "permanent": true
    }
  ]
}
```

### 6. Search Console

- Solicitar indexación de `https://www.infolavelada.com/2026/`
- Comprobar que los 301 del subdominio llegan al path (una sola redirección)
- Enviar / revisar sitemaps en `robots.txt`

### 7. Seguir solo en main

La nueva edición se desarrolla en `/` como siempre. El snapshot en `public/2026/` no se vuelve a tocar salvo hotfix crítico.

## Rebuild de 2024 / 2025

Los snapshots actuales se generaron desde las ramas `la-velada-iv` y `la-velada-v` con modo archivo (static + `base`).

Worktrees de referencia (locales, no en el repo):

```text
../archives-build/2024  → la-velada-iv (+ parches archivo)
../archives-build/2025  → la-velada-v  (+ parches archivo)
```

Para regenerar:

```bash
# desde el worktree ya parcheado
pnpm build
rsync -a --exclude='*.map' dist/ /ruta/main/public/YYYY/
cd /ruta/main
node scripts/archive/fix-seo.mjs YYYY
```

Si el worktree se perdió, repetir el ritual desde `la-velada-iv` / `la-velada-v` (o tags `velada-*-final` si existen).

## SEO (obligatorio al publicar un archivo)

La edición actual y los archivos comparten dominio. Hay que evitar señales contradictorias.

### Forma canónica de URL

- Dominio: `https://www.infolavelada.com`
- Path de archivo: `/YYYY/...`
- **Sin trailing slash** (igual que el resto del site; `vercel.json` hace 308 de `/foo/` → `/foo`)
- Tras copiar un `dist/` a `public/YYYY/`, ejecutar:

```bash
node scripts/archive/fix-seo.mjs YYYY
```

Ese script alinea canónicos, `og:url`, enlaces internos, sitemaps y `robots.txt` del snapshot, y pone `noindex` en los 404.

### Redirects

| Origen | Destino | Código |
|--------|---------|--------|
| `https://YYYY.infolavelada.com/:path*` | `https://www.infolavelada.com/YYYY/:path*` | 301 |
| `https://www.infolavelada.com/YYYY/:path*/` | `https://www.infolavelada.com/YYYY/:path*` | 308 (regla global) |

**Nunca** redirigir `/YYYY` → subdominio (contenido duplicado + pérdida de señales).

Los host-redirects de `vercel.json` solo aplican si `YYYY.infolavelada.com` está en el **mismo** proyecto Vercel que `www`. Si el subdominio sigue en otro proyecto, configura allí el 301 al path.

### robots + sitemaps

- Solo cuenta de verdad `https://www.infolavelada.com/robots.txt` (debe listar los tres sitemaps).
- Cada archivo tiene `public/YYYY/sitemap-index.xml` con locs en `https://www.infolavelada.com/YYYY/...` (sin slash final).
- No uses hreflang entre ediciones.

### Checklist Search Console

1. Desplegar main con snapshots + `vercel.json` correcto.
2. Confirmar: `curl -sI https://www.infolavelada.com/2024` → **200** (no 308 al subdominio).
3. Confirmar: `curl -sI https://2024.infolavelada.com/` → **301** a `https://www.infolavelada.com/2024`.
4. Pedir indexación de `/2024` y `/2025`.
5. Revisar sitemaps en GSC; vigilar “Página con redirección” en URLs de archivo.

## Qué no hacer

- No fusionar el código de años viejos en `src/` de main
- No usar hreflang entre ediciones (no son traducciones)
- No mantener auth/DB de años pasados en producción “por si acaso”
- No dejar redirects path → subdominio (rompe el modelo canónico)

## Tamaños orientativos

| Edición | `public/YYYY` (aprox.) |
|---------|-------------------------|
| 2024    | ~5 MB                   |
| 2025    | ~10 MB                  |

Tras el build estático conviene pasar un pass de optimización (imágenes + CSS):

1. Borrar assets no referenciados en el HTML.
2. Redimensionar/recomprimir raster (galerías max ~1200px, quality ~72).
3. Externalizar CSS inline repetido a un único `public/YYYY/_astro/archive.*.css`.

Sin eso, 2025 puede superar fácilmente los 25 MB (imágenes a resolución de archivo).
