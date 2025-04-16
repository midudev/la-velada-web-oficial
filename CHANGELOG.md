# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto sigue [Versionado Semántico](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Actualización de Astro a la versión 5.8.0 - Abril 2025

#### Cambios

- **Actualización:** Astro actualizado a la versión 5.8.0
- **Actualización:** @astrojs/sitemap actualizado a la versión 3.5.0
- **Actualización:** @astrojs/vercel actualizado a la versión 8.2.3

#### Mejoras

- Eliminada la configuración experimental para SVG, ya que ahora es una característica estable en Astro 5.8.0
- Añadido soporte mejorado para imágenes con formatos WebP y AVIF

#### Notas para desarrolladores

- La configuración `experimental.svg` ha sido reemplazada por la configuración estable en `image.formats`
