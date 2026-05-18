import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { capturePhase } from './capture-nav-pr-media.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const worktreePath = path.resolve(root, '..', 'la-velada-nav-before')
const beforeCommit = '30adca4e'

function run(command, args, options = {}) {
  const useShell = options.shell ?? process.platform === 'win32'
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? root,
      stdio: 'inherit',
      shell: useShell,
      ...options,
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${args.join(' ')} exited ${code}`))
    })
  })
}

function waitForUrl(url, timeoutMs = 120_000) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(url)
        if (res.ok) return resolve()
      } catch {
        // retry
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Timed out waiting for ${url}`))
        return
      }
      setTimeout(tick, 500)
    }
    tick()
  })
}

async function ensureBeforeWorktree() {
  if (!fs.existsSync(path.join(worktreePath, '.git'))) {
    console.log(`Creating worktree at ${beforeCommit} → ${worktreePath}`)
    await run('git', ['worktree', 'add', worktreePath, beforeCommit])
  }

  if (!fs.existsSync(path.join(worktreePath, 'node_modules', 'astro'))) {
    console.log('Installing dependencies in before worktree…')
    await run('pnpm', ['install'], { cwd: worktreePath, shell: true })
  }
}

async function main() {
  fs.mkdirSync(path.join(root, 'docs', 'pr', 'nav-patch'), { recursive: true })

  await ensureBeforeWorktree()

  const beforeProc = spawn(
    'pnpm',
    ['exec', 'astro', 'dev', '--port', '4334', '--host'],
    { cwd: worktreePath, stdio: 'ignore', detached: true, shell: true },
  )
  beforeProc.unref()

  const afterProc = spawn('pnpm', ['run', 'dev:nav'], {
    cwd: root,
    stdio: 'ignore',
    detached: true,
    shell: true,
  })
  afterProc.unref()

  try {
    console.log('Starting dev servers (before :4334, after :4333)…')
    await new Promise((resolve) => setTimeout(resolve, 12_000))
    await waitForUrl('http://localhost:4334/')
    await waitForUrl('http://localhost:4333/')

    try {
      await capturePhase('before', 'http://localhost:4334')
    } catch (error) {
      console.warn('Before capture failed:', error.message)
    }

    await capturePhase('after', 'http://localhost:4333')
  } finally {
    if (beforeProc.pid) spawn('taskkill', ['/pid', String(beforeProc.pid), '/t', '/f'], { shell: true })
    if (afterProc.pid) spawn('taskkill', ['/pid', String(afterProc.pid), '/t', '/f'], { shell: true })
  }

  console.log('\nDone. Assets in docs/pr/nav-patch/{before,after}/')
  console.log('Upload: gh release upload pr-nav-patch-visuals .pr-assets-staging/* --repo tonyblu331/la-velada-web-oficial --clobber')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
