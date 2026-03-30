// Load test script using autocannon (Node.js HTTP benchmarking tool)
// Usage: node scripts/load-test.js [connections] [duration]
// Example: node scripts/load-test.js 10 30
//
// Requires: npx autocannon (auto-installed on first run)
// Server must be running: NO_HTTPS=1 pnpm dev

import { exec } from 'node:child_process'

const connections = process.argv[2] || '5'
const duration = process.argv[3] || '20'
const baseUrl = process.env.BASE_URL || 'http://localhost:4321'

const endpoints = [
  { path: '/api/predictions', label: 'API Predictions' },
  { path: '/', label: 'Landing Page' },
  { path: '/combates', label: 'Combates Overview' },
  { path: '/combates/10-grefg-vs-illojuan', label: 'Combat Detail' },
]

async function run(endpoint) {
  return new Promise((resolve) => {
    const cmd = `npx autocannon -c ${connections} -d ${duration} -p 1 -j ${baseUrl}${endpoint.path}`
    exec(cmd, (error, stdout) => {
      try {
        const result = JSON.parse(stdout)
        console.log(`\n${endpoint.label} (${baseUrl}${endpoint.path})`)
        console.log(`  Latency:  avg=${result.latency.average}ms  p50=${result.latency.p50}ms  p97.5=${result.latency.p97_5}ms  max=${result.latency.max}ms`)
        console.log(`  Req/sec:  avg=${result.requests.average}  total=${result.requests.total}`)
        console.log(`  Errors:   ${result.errors}`)
        resolve(result)
      } catch {
        console.log(`\n${endpoint.label}: Failed to parse results`)
        resolve(null)
      }
    })
  })
}

console.log(`Load test: ${connections} connections, ${duration}s per endpoint\n`)

for (const endpoint of endpoints) {
  await run(endpoint)
}

console.log('\nDone.')
