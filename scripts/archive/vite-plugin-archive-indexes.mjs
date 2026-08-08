import fs from 'node:fs'
import path from 'node:path'

const ARCHIVE_YEARS = new Set(['2024', '2025'])

/**
 * Astro SSR + Vite sirven archivos de `public/` por ruta exacta, pero no
 * resuelven directorios a `index.html`. Sin esto, `/2024/` cae en el 404
 * de la app viva en lugar del snapshot estático.
 */
export function archiveDirectoryIndexPlugin(publicDir = 'public') {
  /**
   * @param {string | undefined} url
   * @returns {string | null}
   */
  function rewriteArchiveUrl(url) {
    if (!url) return null

    const q = url.indexOf('?')
    const pathname = q === -1 ? url : url.slice(0, q)
    const search = q === -1 ? '' : url.slice(q)

    const segments = pathname.split('/').filter(Boolean)
    if (segments.length === 0 || !ARCHIVE_YEARS.has(segments[0])) return null

    const last = segments[segments.length - 1]
    if (last.includes('.')) return null

    const abs = path.join(process.cwd(), publicDir, ...segments, 'index.html')
    if (!fs.existsSync(abs)) return null

    return `/${segments.join('/')}/index.html${search}`
  }

  /** @param {{ use: Function }} middlewares */
  function attach(middlewares) {
    middlewares.use((req, _res, next) => {
      const rewritten = rewriteArchiveUrl(req.url)
      if (rewritten) req.url = rewritten
      next()
    })
  }

  return {
    name: 'archive-directory-index',
    configureServer(server) {
      attach(server.middlewares)
    },
    configurePreviewServer(server) {
      attach(server.middlewares)
    },
  }
}
