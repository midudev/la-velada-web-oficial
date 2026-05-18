import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const stage = path.join(root, '.pr-assets-staging')
const pr = path.join(root, 'docs', 'pr', 'nav-patch')

const map = [
  ['before/screenshots/01-header-context.png', 'before-header-context.png'],
  ['after/screenshots/01-header-context.png', 'after-header-context.png'],
  ['before/screenshots/03-logo-hover-framed.png', 'before-logo-hover.png'],
  ['after/screenshots/03-logo-hover-framed.png', 'after-logo-hover.png'],
  ['before/screenshots/04-header-nav-hover.png', 'before-header-nav.png'],
  ['after/screenshots/04-header-nav-hover.png', 'after-header-nav.png'],
  ['after/screenshots/05-mobile-menu-open.png', 'after-mobile-menu-open.png'],
  ['after/screenshots/06-mobile-header-logo.png', 'after-mobile-header-logo.png'],
  ['before/videos/logo-hover.webm', 'before-logo-hover.webm'],
  ['after/videos/logo-hover.webm', 'after-logo-hover.webm'],
  ['before/videos/nav-underline-hover.webm', 'before-nav-hover.webm'],
  ['after/videos/nav-underline-hover.webm', 'after-nav-hover.webm'],
]

fs.rmSync(stage, { recursive: true, force: true })
fs.mkdirSync(stage, { recursive: true })

for (const [rel, name] of map) {
  const src = path.join(pr, rel)
  if (!fs.existsSync(src)) {
    console.warn(`skip (missing): ${rel}`)
    continue
  }
  fs.copyFileSync(src, path.join(stage, name))
  console.log(name)
}

console.log(`\nStaged ${fs.readdirSync(stage).length} files → .pr-assets-staging/`)
