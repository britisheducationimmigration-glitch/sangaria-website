import { spawn } from 'node:child_process'
import assert from 'node:assert/strict'
import { once } from 'node:events'

const port = 3198
const env = { ...process.env, PORT: String(port), HOST: '127.0.0.1' }
delete env.DATABASE_URL
delete env.CRON_SECRET
const server = spawn(process.execPath, [process.env.SMOKE_SERVER_ENTRY || '.output/server/index.mjs'], { env, stdio: ['ignore','pipe','pipe'] })
let output = ''
server.stdout.on('data', b => { output += b.toString() })
server.stderr.on('data', b => { output += b.toString() })
try {
  for (let attempts=0; attempts<100 && !output.includes('Listening on:'); attempts++) {
    if (server.exitCode !== null) throw new Error(output)
    await new Promise(resolve => setTimeout(resolve,100))
  }
  const cases = [ ['/',200], ['/countries',200], ['/coaching',200], ['/contact',200], ['/admin',200], ['/sitemap.xml',200], ['/robots.txt',200], ['/attendance/invalid-link',200], ['/attendance/photo/1',404], ['/api/cron/attendance-cleanup',503] ]
  for (const [path,status] of cases) {
    const response = await fetch(`http://127.0.0.1:${port}${path}`, { signal: AbortSignal.timeout(20000) })
    const body = await response.text()
    assert.equal(response.status,status,path)
    if (path==='/') {
      assert.match(body,/<title>[^<]+<\/title>/)
      assert.match(body,/rel="canonical"/)
      assert.match(body,/name="description"/)
      assert.match(body,/<h1(?:\s|>)/)
    }
    if (path==='/sitemap.xml') { assert.match(body,/<urlset/); assert.doesNotMatch(body,/<loc>[^<]*\/(admin|attendance)/) }
    if (path==='/robots.txt') assert.match(body,/Disallow: \/attendance\//)
    if (path==='/attendance/invalid-link') assert.match(body,/noindex/)
    console.log(`PASS ${path}: ${response.status}`)
  }
} finally {
  server.kill('SIGTERM')
  if(server.exitCode===null) await Promise.race([once(server,'exit'),new Promise(resolve=>setTimeout(resolve,3000))])
}
