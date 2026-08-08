/**
 * Optimize a published archive under public/YYYY:
 * - delete unreferenced assets
 * - resize/recompress images
 * - externalize CSS into a single archive.*.css bundle
 *
 * Usage: node scripts/archive/optimize-snapshot.mjs 2025
 */
import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { execSync } from 'node:child_process'

const year = process.argv[2]
if (!/^\d{4}$/.test(year || '')) {
  console.error('Usage: node scripts/archive/optimize-snapshot.mjs YYYY')
  process.exit(1)
}

const root = process.cwd()
const base = path.join(root, 'public', year)

async function listFiles(dir) {
  const out = []
  async function walk(d) {
    for (const ent of await fs.readdir(d, { withFileTypes: true })) {
      const p = path.join(d, ent.name)
      if (ent.isDirectory()) await walk(p)
      else out.push(p)
    }
  }
  await walk(dir)
  return out
}

async function textBlob() {
  let blob = ''
  for (const f of await listFiles(base)) {
    const ext = path.extname(f).toLowerCase()
    if (['.html', '.js', '.css', '.xml', '.webmanifest', '.json', '.svg'].includes(ext)) {
      blob += (await fs.readFile(f, 'utf8')) + '\n'
    }
  }
  return blob
}

const blob = await textBlob()
let deleted = 0
for (const file of await listFiles(base)) {
  const ext = path.extname(file).toLowerCase()
  if (['.html', '.xml'].includes(ext)) continue
  const rel = path.relative(base, file).split(path.sep).join('/')
  if (rel === 'robots.txt') continue
  const name = path.basename(file)
  const used = [`/${year}/${rel}`, rel, `/${rel}`, name].some((c) => c && blob.includes(c))
  if (!used) {
    await fs.unlink(file)
    deleted++
    console.log('rm', rel)
  }
}
console.log('deleted', deleted)

function policy(rel) {
  if (rel.includes('/gallery/')) return { max: 1200, q: 72 }
  if (rel.includes('/combat/')) return { max: 1200, q: 72 }
  if (rel.includes('/artists/')) return { max: 900, q: 72 }
  if (rel.includes('/big/')) return { max: 1400, q: 75 }
  if (rel.includes('/workoutThumbnails/')) return { max: 640, q: 70 }
  if (rel.includes('/cards/')) return { max: 400, q: 75 }
  if (rel.includes('/text/')) return { max: 800, q: 75 }
  if (rel.includes('hero')) return { max: 1920, q: 70 }
  return { max: 1400, q: 75 }
}

let recompressed = 0
for (const file of await listFiles(base)) {
  const ext = path.extname(file).toLowerCase()
  if (!['.webp', '.png', '.jpg', '.jpeg', '.avif'].includes(ext)) continue
  const rel = path.relative(base, file).split(path.sep).join('/')
  const before = (await fs.stat(file)).size
  if (ext === '.png' && before < 20_000) continue
  const { max, q } = policy(rel)
  try {
    const meta = await sharp(file, { failOn: 'none' }).metadata()
    const w = meta.width || 0
    const h = meta.height || 0
    let pipe = sharp(file, { failOn: 'none' })
    if (Math.max(w, h) > max) {
      pipe = w >= h ? pipe.resize({ width: max, withoutEnlargement: true }) : pipe.resize({ height: max, withoutEnlargement: true })
    }
    let buf
    if (ext === '.avif') buf = await pipe.avif({ quality: Math.min(q, 55) }).toBuffer()
    else if (ext === '.png') buf = await pipe.png({ compressionLevel: 9 }).toBuffer()
    else if (ext === '.jpg' || ext === '.jpeg') buf = await pipe.jpeg({ quality: q, mozjpeg: true }).toBuffer()
    else buf = await pipe.webp({ quality: q, effort: 6 }).toBuffer()
    if (buf.length < before * 0.98) {
      await fs.writeFile(file, buf)
      recompressed++
    }
  } catch (e) {
    console.warn('skip', rel, e.message)
  }
}
console.log('recompressed', recompressed)

// Externalize styles → one bundle
const htmlFiles = (await listFiles(base)).filter((f) => f.endsWith('.html'))
const cssMap = new Map()
for (const file of htmlFiles) {
  let html = await fs.readFile(file, 'utf8')
  const links = []
  html = html.replace(/<style(\s[^>]*)?>([\s\S]*?)<\/style>/gi, (full, _a, css) => {
    const trimmed = css.trim()
    if (trimmed.length < 1200) return full
    const h = crypto.createHash('sha1').update(trimmed).digest('hex').slice(0, 12)
    cssMap.set(h, trimmed)
    links.push(h)
    return ''
  })
  // strip prior archive bundles and fragment links
  html = html.replace(new RegExp(`<link\\s+rel="stylesheet"\\s+href="/${year}/_astro/(?:s\\.[a-f0-9]+|archive[^"]*)\\.css">`, 'g'), '')
  if (links.length) {
    // placeholder replaced after bundle name known
    html = html.replace('</head>', `%%ARCHIVE_CSS%%</head>`)
  }
  await fs.writeFile(file + '.tmp', JSON.stringify({ html, links }))
}

const parts = [...cssMap.values()]
const bundleCss = parts
  .join('\n')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{}:;,])\s*/g, '$1')
  .replace(/;}/g, '}')
  .trim()
const bundleName = `archive.${crypto.createHash('sha1').update(bundleCss).digest('hex').slice(0, 10)}.css`
const astroDir = path.join(base, '_astro')
await fs.mkdir(astroDir, { recursive: true })
// remove old archive css
for (const n of await fs.readdir(astroDir)) {
  if (n.startsWith('archive') && n.endsWith('.css')) await fs.unlink(path.join(astroDir, n))
  if (n.startsWith('s.') && n.endsWith('.css')) await fs.unlink(path.join(astroDir, n))
}
await fs.writeFile(path.join(astroDir, bundleName), bundleCss)
const bundleUrl = `/${year}/_astro/${bundleName}`

for (const file of htmlFiles) {
  const tmp = file + '.tmp'
  try {
    const { html } = JSON.parse(await fs.readFile(tmp, 'utf8'))
    let out = html.replace('%%ARCHIVE_CSS%%', `<link rel="stylesheet" href="${bundleUrl}">`)
    if (!out.includes(bundleUrl) && out.includes('</head>')) {
      out = out.replace('</head>', `<link rel="stylesheet" href="${bundleUrl}"></head>`)
    }
    await fs.writeFile(file, out)
    await fs.unlink(tmp)
  } catch {
    // no tmp
  }
}

execSync(`find ${base} -type d -empty -delete || true`)
console.log('bundle', bundleUrl, `${(bundleCss.length / 1024).toFixed(1)} KB`)
console.log(execSync(`du -sh ${base}`, { encoding: 'utf8' }))
