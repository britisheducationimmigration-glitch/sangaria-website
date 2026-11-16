import vm from 'node:vm'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

// Execute the actual server source, replacing only transport/auth/environment adapters.
// SQL, transactions, validators, payroll, schema migrations and exports are unchanged.
export async function attendanceRuntime(database, { realDb = false } = {}) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const state = { now: '2026-11-16T04:00:00Z', role: 'super_admin', signedIn: true, headers: new Headers({ 'x-real-ip': '203.0.113.10', 'x-vercel-ip-country': 'IN' }) }
  const NativeDate = Date
  class Clock extends NativeDate {
    constructor(...args) { super(...(args.length ? args : [state.now])) }
    static now() { return new NativeDate(state.now).getTime() }
  }
  const context = vm.createContext({ console, Buffer, Date: Clock, Headers, Response, Request, URL, TextEncoder, TextDecoder, setTimeout, clearTimeout, process: { env: { SESSION_SECRET: 'attendance-test-only-secret-32-characters', DATABASE_URL: realDb ? 'mysql://test/attendance_test' : undefined } } })
  const cache = new Map()
  const db = {
    getDb: async () => database,
    queryRows: async (sql, values = []) => (await database.query(sql, values))[0],
    execute: async (sql, values = []) => (await database.execute(sql, values))[0],
  }
  const transport = {
    createMiddleware: () => ({ server: fn => fn }),
    createServerFn: () => {
      let validate = d => d, middleware = []
      const chain = {
        validator(fn) { validate = fn; return chain },
        middleware(list) { middleware = list; return chain },
        handler(fn) { return async ({ data } = {}) => {
          const validated = validate(data)
          const dispatch = (i, supplied = {}) => i === middleware.length ? fn({ data: validated, context: supplied }) : middleware[i]({ request: { headers: state.headers }, next: ({ context: more }) => dispatch(i + 1, { ...supplied, ...more }) })
          return dispatch(0)
        } },
      }
      return chain
    },
  }
  async function synthetic(id, exports) {
    if (cache.has(id)) return cache.get(id)
    const module = new vm.SyntheticModule(Object.keys(exports), function () { for (const [key, value] of Object.entries(exports)) this.setExport(key, value) }, { context, identifier: id })
    cache.set(id, module)
    return module
  }
  async function load(specifier, parent = path.join(root, 'src/lib/attendance-functions.ts')) {
    if (specifier === '@tanstack/react-start/server-only') return synthetic(specifier, {})
    if (specifier === '@tanstack/react-start') return synthetic(specifier, transport)
    if (specifier === '@tanstack/react-start/server') return synthetic(specifier, { getRequestHeader: name => state.headers.get(name) })
    if (specifier === '@/data/site') return synthetic(specifier, { site: { latitude: 29.8, longitude: 74.5 } })
    if (specifier === './db.server' && !realDb) return synthetic('test-db', db)
    if (specifier === 'mysql2/promise') return synthetic(specifier, { default: { createPool: () => database } })
    if (specifier === '@/data/fixtures') return synthetic(specifier, { approvals: [], coachingSchedule: [], posts: [], testimonials: [] })
    if (specifier === '@/data/certificates') return synthetic(specifier, { defaultCertificates: [] })
    if (specifier === './auth.server') return synthetic('test-auth', { getSessionUser: async () => state.signedIn ? { name: 'Test Admin', email: 'admin@example.test' } : null, ensureAdminRecord: async () => true, getAdminRole: async () => state.role, hashPassword: () => 'test-hash' })
    if (specifier.startsWith('node:')) return synthetic(specifier, await import(specifier))
    let filename = path.resolve(path.dirname(parent), specifier)
    if (!path.extname(filename) || filename.endsWith('.server')) filename += '.ts'
    if (cache.has(filename)) return cache.get(filename)
    const source = await fs.readFile(filename, 'utf8')
    const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText
    const module = new vm.SourceTextModule(code, { context, identifier: filename, importModuleDynamically: async (id) => { const dep = await load(id, filename); if (dep.status === 'unlinked') await dep.link((s, m) => load(s, m.identifier)); if (dep.status === 'linked') await dep.evaluate(); return dep } })
    cache.set(filename, module)
    return module
  }
  const module = await load('./attendance-functions')
  await module.link((specifier, parent) => load(specifier, parent.identifier))
  await module.evaluate()
  const server = await load('./attendance.server')
  const databaseModule = await load('./db.server')
  return { api: module.namespace, server: server.namespace, state, database: databaseModule.namespace }
}
