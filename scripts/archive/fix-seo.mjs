/**
 * Normalize SEO signals in public/YYYY snapshots to match the live site:
 * - no trailing slash (vercel.json strips them with 308)
 * - self-canonical on www.infolavelada.com/YYYY/...
 * - archive robots.txt point at their own sitemap
 * - 404 pages are noindex
 *
 * Usage: node scripts/archive/fix-seo.mjs [YYYY ...]
 */
import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const years = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['2024', '2025']

/** @param {string} year */
function stripArchiveTrailingSlash(input, year) {
  const re = new RegExp(
    `(https://www\\.infolavelada\\.com/${year}(?:/[^"'\\s<>#?]*)?)/(?=["'\\s<>#?]|$)`,
    'g',
  )
  return input.replace(re, '$1')
}

/** @param {string} input @param {string} year */
function stripPrefixedHrefTrailingSlash(input, year) {
  // href="/2024/foo/" or href='/2024/' → without trailing slash (keep asset paths)
  const re = new RegExp(
    `(href=["']/${year}(?:/[^"'#?]*?)?)/(["'#?])`,
    'g',
  )
  return input.replace(re, (_, pathPart, end) => {
    if (/\.[a-zA-Z0-9]+$/.test(pathPart)) return `${pathPart}/${end}`
    return `${pathPart}${end}`
  })
}

/** @param {string} html @param {string} year */
function fixHtml(html, year) {
  let out = html
  out = stripArchiveTrailingSlash(out, year)
  out = stripPrefixedHrefTrailingSlash(out, year)

  // 2025 404 incorrectly canonicalized to the current-site /404
  if (year === '2025') {
    out = out.replaceAll(
      'https://www.infolavelada.com/404',
      `https://www.infolavelada.com/${year}/404`,
    )
  }

  const is404 = /<title>[^<]*404|Página no encontrada/i.test(out)
  if (is404) {
    if (/name=["']robots["']/.test(out)) {
      out = out.replace(
        /<meta\s+name=["']robots["']\s+content=["'][^"']*["']\s*\/?>/i,
        '<meta name="robots" content="noindex, follow">',
      )
    } else {
      out = out.replace(
        /<link rel=["']canonical["']/i,
        '<meta name="robots" content="noindex, follow"><link rel="canonical"',
      )
    }
  } else if (!/name=["']robots["']/.test(out)) {
    out = out.replace(
      /<link rel=["']canonical["']/i,
      '<meta name="robots" content="index, follow"><link rel="canonical"',
    )
  }

  return out
}

/** @param {string} xml @param {string} year */
function fixSitemap(xml, year) {
  return stripArchiveTrailingSlash(xml, year)
}

/** @param {string} year */
function archiveRobots(year) {
  return `User-agent: *
Allow: /

# Este archivo es secundario: Google usa /robots.txt del dominio.
# Se mantiene por si un crawler pide /${year}/robots.txt
Sitemap: https://www.infolavelada.com/${year}/sitemap-index.xml
`
}

async function walkHtml(dir) {
  /** @type {string[]} */
  const files = []
  async function walk(d) {
    for (const entry of await fs.readdir(d, { withFileTypes: true })) {
      const p = path.join(d, entry.name)
      if (entry.isDirectory()) await walk(p)
      else if (entry.name.endsWith('.html')) files.push(p)
    }
  }
  await walk(dir)
  return files
}

let changed = 0
for (const year of years) {
  const base = path.join(root, 'public', year)
  const htmlFiles = await walkHtml(base)
  for (const file of htmlFiles) {
    const before = await fs.readFile(file, 'utf8')
    const after = fixHtml(before, year)
    if (after !== before) {
      await fs.writeFile(file, after)
      changed++
    }
  }

  for (const name of ['sitemap-0.xml', 'sitemap-index.xml']) {
    const file = path.join(base, name)
    try {
      const before = await fs.readFile(file, 'utf8')
      const after = fixSitemap(before, year)
      if (after !== before) {
        await fs.writeFile(file, after)
        changed++
      }
    } catch {
      // optional
    }
  }

  await fs.writeFile(path.join(base, 'robots.txt'), archiveRobots(year))
  changed++
  console.log(`✓ ${year}: ${htmlFiles.length} HTML revisados`)
}

console.log(`Done. Archivos tocados: ${changed}`)
