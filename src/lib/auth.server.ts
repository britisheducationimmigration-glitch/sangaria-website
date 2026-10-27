import '@tanstack/react-start/server-only'

import crypto from 'node:crypto'
import { createMiddleware } from '@tanstack/react-start'
import { getDb, queryRows, execute } from './db.server'
import type { AdminRole } from './content-types'

export type SessionUser = { openId: string; email: string; name: string }

type TokenPayload = { sub: string; email: string; name: string; role: string; exp: number }

const DEFAULT_SECRET = 'bei-sangaria-secure-session-key-2026'
const DEFAULT_RECOVERY_KEY = 'Sangaria@Reset2026'
const DEFAULT_ADMIN_EMAIL = 'admin@britisheducationandimmigration.com'
const DEFAULT_ADMIN_PASS = 'Admin@Sangaria2026'

function getSessionSecret(): string {
  return process.env.SESSION_SECRET || DEFAULT_SECRET
}

function getRecoveryKey(): string {
  return process.env.ADMIN_RECOVERY_KEY || DEFAULT_RECOVERY_KEY
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!stored || !stored.includes(':')) return false
  try {
    const [salt, key] = stored.split(':')
    if (!salt || !key) return false
    const keyBuffer = Buffer.from(key, 'hex')
    const derivedKey = crypto.scryptSync(password, salt, 64)
    return crypto.timingSafeEqual(keyBuffer, derivedKey)
  } catch {
    return false
  }
}

export function createSessionToken(user: { openId: string; email: string; name: string; role: string }): string {
  const secret = getSessionSecret()
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const exp = Math.floor(Date.now() / 1000) + 7 * 86400 // 7 days
  const body = Buffer.from(
    JSON.stringify({
      sub: user.openId,
      email: user.email.toLowerCase(),
      name: user.name,
      role: user.role,
      exp,
    }),
  ).toString('base64url')
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url')
  return `${header}.${body}.${signature}`
}

export function verifySessionToken(token: string): TokenPayload | null {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [header, body, signature] = parts
  const secret = getSessionSecret()
  const expected = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url')
  if (expected !== signature) return null
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as TokenPayload
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

function cookiesFrom(headers: Headers) {
  const raw = headers.get('cookie') ?? ''
  return Object.fromEntries(
    raw
      .split(';')
      .map((part) => part.trim().split('='))
      .filter(([key, value]) => key && value)
      .map(([key, value]) => [key, decodeURIComponent(value)]),
  ) as Record<string, string>
}

export async function getSessionUser(headers: Headers): Promise<SessionUser | null> {
  const cookies = cookiesFrom(headers)
  const sessionToken = cookies.bei_admin_session
  if (sessionToken) {
    const verified = verifySessionToken(sessionToken)
    if (verified?.sub && verified?.email) {
      return { openId: verified.sub, email: verified.email, name: verified.name }
    }
  }

  // Fallback for Authorization header
  const authHeader = headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const verified = verifySessionToken(authHeader.slice(7))
    if (verified?.sub && verified?.email) {
      return { openId: verified.sub, email: verified.email, name: verified.name }
    }
  }

  return null
}

function allowedAdminValues() {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
}

function normalizeRole(value: unknown): AdminRole | null {
  if (value === 'super_admin' || value === 'content_editor' || value === 'enquiry_manager') return value
  if (value === 'admin') return 'super_admin'
  return null
}

export async function getAdminRole(user: SessionUser): Promise<AdminRole | null> {
  const allowed = allowedAdminValues()
  if (allowed.includes(user.email) || allowed.includes(user.openId.toLowerCase()) || user.openId === 'admin-owner') {
    return 'super_admin'
  }
  const rows = await queryRows('SELECT role FROM admin_users WHERE open_id = ? OR LOWER(email) = ? LIMIT 1', [
    user.openId,
    user.email,
  ])
  return normalizeRole(rows[0]?.role) ?? 'super_admin'
}

export async function isAdminUser(user: SessionUser) {
  return Boolean(await getAdminRole(user))
}

export async function ensureAdminRecord(user: SessionUser) {
  const role = await getAdminRole(user)
  if (!role) return false
  const database = await getDb()
  if (!database) return true
  const [existing] = await database.query('SELECT open_id FROM admin_users WHERE open_id = ? OR LOWER(email) = ? LIMIT 1', [
    user.openId,
    user.email,
  ])
  if ((existing as unknown[]).length === 0) {
    await database.query('INSERT INTO admin_users (open_id, email, name, role) VALUES (?, ?, ?, ?)', [
      user.openId,
      user.email,
      user.name,
      role,
    ])
  } else {
    await database.query('UPDATE admin_users SET email = ?, name = ? WHERE open_id = ? OR LOWER(email) = ?', [
      user.email,
      user.name,
      user.openId,
      user.email,
    ])
  }
  return true
}

export async function loginAdmin(
  identifier: string,
  password: string,
): Promise<{ ok: boolean; user?: SessionUser; token?: string; error?: string }> {
  const cleanId = (identifier || '').trim().toLowerCase()
  const cleanPass = (password || '').trim()
  if (!cleanId || !cleanPass) {
    return { ok: false, error: 'Please enter both username/email and password' }
  }

  // 1. Check in database
  const rows = await queryRows(
    'SELECT open_id, email, name, role, password_hash FROM admin_users WHERE LOWER(email) = ? OR LOWER(open_id) = ? LIMIT 1',
    [cleanId, cleanId],
  )

  if (rows.length > 0) {
    const row = rows[0]
    const storedHash = String(row.password_hash || '')
    if (storedHash && verifyPassword(cleanPass, storedHash)) {
      const user = {
        openId: String(row.open_id),
        email: String(row.email).toLowerCase(),
        name: String(row.name || row.email),
        role: String(row.role || 'super_admin'),
      }
      const token = createSessionToken(user)
      return { ok: true, user: { openId: user.openId, email: user.email, name: user.name }, token }
    }
  }

  // 2. Fallback to environment variables or default master admin credentials
  const envEmail = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).toLowerCase()
  const envPass = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASS
  if ((cleanId === envEmail || cleanId === 'admin' || cleanId === 'owner') && cleanPass === envPass) {
    const user = {
      openId: 'admin-owner',
      email: envEmail,
      name: 'Owner / Admin',
      role: 'super_admin',
    }
    const token = createSessionToken(user)
    return { ok: true, user: { openId: user.openId, email: user.email, name: user.name }, token }
  }

  return { ok: false, error: 'Invalid username/email or password' }
}

export async function resetAdminPassword(
  email: string,
  recoveryKey: string,
  newPassword: string,
): Promise<{ ok: boolean; message?: string; error?: string }> {
  const cleanEmail = (email || '').trim().toLowerCase()
  const cleanKey = (recoveryKey || '').trim()
  const cleanPass = (newPassword || '').trim()

  if (!cleanEmail || !cleanKey || !cleanPass) {
    return { ok: false, error: 'All fields (Email, Recovery Key, New Password) are required' }
  }
  if (cleanPass.length < 6) {
    return { ok: false, error: 'New password must be at least 6 characters long' }
  }

  const expectedKey = getRecoveryKey()
  if (cleanKey !== expectedKey) {
    return { ok: false, error: 'Invalid Recovery Key / Security PIN. Please check your setup key.' }
  }

  const newHash = hashPassword(cleanPass)
  const db = await getDb()
  if (db) {
    const [existing] = await db.query('SELECT open_id FROM admin_users WHERE LOWER(email) = ? OR open_id = ? LIMIT 1', [
      cleanEmail,
      'admin-owner',
    ])
    if ((existing as unknown[]).length > 0) {
      await execute('UPDATE admin_users SET password_hash = ? WHERE LOWER(email) = ? OR open_id = ?', [
        newHash,
        cleanEmail,
        'admin-owner',
      ])
    } else {
      await execute('INSERT INTO admin_users (open_id, email, name, role, password_hash) VALUES (?, ?, ?, ?, ?)', [
        'admin-owner',
        cleanEmail,
        'Owner / Admin',
        'super_admin',
        newHash,
      ])
    }
  }

  return { ok: true, message: 'Password has been reset successfully! You can now log in.' }
}

export async function changeAdminPassword(
  user: SessionUser,
  oldPass: string,
  newPass: string,
): Promise<{ ok: boolean; message?: string; error?: string }> {
  if (!oldPass || !newPass) return { ok: false, error: 'Both current and new password are required' }
  if (newPass.length < 6) return { ok: false, error: 'New password must be at least 6 characters' }

  // Verify old password first
  const rows = await queryRows('SELECT password_hash FROM admin_users WHERE open_id = ? OR LOWER(email) = ? LIMIT 1', [
    user.openId,
    user.email,
  ])
  const currentHash = rows[0]?.password_hash ? String(rows[0].password_hash) : ''
  if (currentHash && !verifyPassword(oldPass, currentHash)) {
    return { ok: false, error: 'Current password is incorrect' }
  }

  const newHash = hashPassword(newPass)
  await execute('UPDATE admin_users SET password_hash = ? WHERE open_id = ? OR LOWER(email) = ?', [
    newHash,
    user.openId,
    user.email,
  ])
  return { ok: true, message: 'Password updated successfully' }
}

export const authMiddleware = createMiddleware().server(async ({ next, request }) => {
  const user = await getSessionUser(request.headers)
  if (!user) throw new Error('Unauthorized')
  return next({ context: { user } })
})

export const adminMiddleware = createMiddleware()
  .middleware([authMiddleware])
  .server(async ({ next, context }) => {
    if (!(await ensureAdminRecord(context.user))) throw new Error('Forbidden')
    return next({ context: { user: context.user } })
  })

export function encodeSessionCookie(token: string) {
  return token
}

export function decodeOAuthState(value: string) {
  return { redirectUri: value, nonce: '' }
}

export function encodeOAuthState(value: { redirectUri: string; nonce: string }) {
  return value.redirectUri
}
