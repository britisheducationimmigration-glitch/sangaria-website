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
  const exp = Math.floor(Date.now() / 1000) + 30 * 86400 // 30 days session
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
      .map(([key, value]) => {
        try {
          return [key, decodeURIComponent(value)]
        } catch {
          return [key, value]
        }
      }),
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
  try {
    const rows = await queryRows('SELECT role FROM admin_users WHERE LOWER(email) = ? LIMIT 1', [
      user.email.toLowerCase(),
    ])
    return normalizeRole(rows[0]?.role) ?? 'super_admin'
  } catch {
    return 'super_admin'
  }
}

export async function isAdminUser(user: SessionUser) {
  return Boolean(await getAdminRole(user))
}

export async function ensureAdminRecord(user: SessionUser) {
  const role = await getAdminRole(user)
  if (!role) return false
  const database = await getDb()
  if (!database) return true
  try {
    const rows = await queryRows('SELECT * FROM admin_users WHERE LOWER(email) = ? LIMIT 1', [
      user.email.toLowerCase(),
    ])
    if (rows.length === 0) {
      await execute('INSERT INTO admin_users (email, name, role) VALUES (?, ?, ?)', [
        user.email.toLowerCase(),
        user.name,
        role,
      ])
    }
  } catch (err) {
    console.error('ensureAdminRecord error:', err)
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

  // 1. Check in database (SELECT * safe query, works with any columns)
  try {
    const rows = await queryRows(
      'SELECT * FROM admin_users WHERE LOWER(email) = ? LIMIT 1',
      [cleanId],
    )

    if (rows.length > 0) {
      const row = rows[0]
      const storedHash = String(row.password_hash || '')
      if (storedHash && verifyPassword(cleanPass, storedHash)) {
        const user = {
          openId: String(row.open_id || row.id || row.email),
          email: String(row.email).toLowerCase(),
          name: String(row.name || row.email),
          role: String(row.role || 'super_admin'),
        }
        const token = createSessionToken(user)
        return { ok: true, user: { openId: user.openId, email: user.email, name: user.name }, token }
      }
    }
  } catch (err) {
    console.error('Database query error in loginAdmin:', err)
  }

  // 2. Fallback to master owner credentials
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

// Resend Email Sender
async function sendEmailViaResend({ to, subject, html }: { to: string; subject: string; html: string }): Promise<void> {
  const apiKey = (process.env.RESEND_API_KEY || '').trim()
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set in Vercel settings.')
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
     from: 'British Education & Immigration <otp@send.britisheducationandimmigration.com>',
      to: [to],
      subject,
      html,
    }),
  })

  const data: any = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to send email via Resend')
  }
}

// 1. Send OTP to any user's email
export async function sendResetOtp(emailInput: string): Promise<{ ok: boolean; message?: string; error?: string }> {
  const email = emailInput.trim().toLowerCase()
  if (!email || !email.includes('@')) {
    return { ok: false, error: 'Please enter a valid email address' }
  }

  // Check if user exists
  const masterEmail = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).toLowerCase()
  const rows = await queryRows('SELECT * FROM admin_users WHERE LOWER(email) = ? LIMIT 1', [email])
  if (email !== masterEmail && rows.length === 0) {
    return { ok: false, error: 'No admin account found with this email' }
  }

  // Ensure table exists
  await execute(`
    CREATE TABLE IF NOT EXISTS admin_password_resets (
      email VARCHAR(255) PRIMARY KEY,
      otp VARCHAR(10) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 6-digit OTP (10 mins valid)
  const otp = String(Math.floor(100000 + Math.random() * 900000))
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  await execute(
    'INSERT INTO admin_password_resets (email, otp, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp = VALUES(otp), expires_at = VALUES(expires_at)',
    [email, otp, expiresAt],
  )

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
      <h2 style="color: #0b3326; margin: 0 0 6px 0; font-size: 22px;">British Education & Immigration</h2>
      <p style="color: #64748b; font-size: 13px; margin: 0;">Sangaria, Rajasthan · Admin Security</p>
      <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
      <p style="color: #1e293b; font-size: 15px; margin: 0 0 16px 0;">Hello,</p>
      <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
        You requested a password reset for your admin dashboard account. Use the following 6-digit OTP code to reset your password:
      </p>
      <div style="background: #0b3326; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 18px; border-radius: 14px; margin-bottom: 24px;">
        ${otp}
      </div>
      <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0;">
        ⏰ This OTP is valid for <strong>10 minutes</strong>. If you did not request this, you can safely ignore this email.
      </p>
    </div>
  `

  try {
    await sendEmailViaResend({
      to: email,
      subject: `Your OTP is ${otp} · British Education & Immigration`,
      html,
    })
    return { ok: true, message: `OTP sent to ${email}. Check your inbox or spam folder.` }
  } catch (err: any) {
    console.error('Resend OTP error:', err)
    return { ok: false, error: err.message || 'Failed to send OTP email. Please check your RESEND_API_KEY.' }
  }
}

// 2. Verify OTP and Reset Password
export async function verifyOtpAndResetPassword(
  emailInput: string,
  otpInput: string,
  newPassword: string,
): Promise<{ ok: boolean; message?: string; error?: string }> {
  const email = emailInput.trim().toLowerCase()
  const otp = otpInput.trim()
  const cleanPass = newPassword.trim()

  if (!email || !otp || !cleanPass) {
    return { ok: false, error: 'Email, OTP, and New Password are required' }
  }
  if (cleanPass.length < 6) {
    return { ok: false, error: 'New password must be at least 6 characters' }
  }

  try {
    const rows = await queryRows(
      'SELECT * FROM admin_password_resets WHERE LOWER(email) = ? AND expires_at > CURRENT_TIMESTAMP() LIMIT 1',
      [email],
    )

    if (rows.length === 0 || String(rows[0].otp).trim() !== otp) {
      return { ok: false, error: 'Invalid or expired OTP. Please try again.' }
    }

    const newHash = hashPassword(cleanPass)
    await execute('UPDATE admin_users SET password_hash = ? WHERE LOWER(email) = ?', [newHash, email])
    await execute('DELETE FROM admin_password_resets WHERE LOWER(email) = ?', [email])

    return { ok: true, message: 'Password reset successful! You can now log in.' }
  } catch (err: any) {
    console.error('Verify OTP error:', err)
    return { ok: false, error: 'Failed to verify OTP' }
  }
}

// Fallback: Master Recovery Key reset
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
    return { ok: false, error: 'Invalid Master Recovery Key (Security PIN)' }
  }

  const newHash = hashPassword(cleanPass)
  try {
    await execute('UPDATE admin_users SET password_hash = ? WHERE LOWER(email) = ?', [
      newHash,
      cleanEmail,
    ])
  } catch (err) {
    console.error('Reset password error:', err)
  }

  return { ok: true, message: 'Password reset successfully!' }
}

export async function changeAdminPassword(
  user: SessionUser,
  oldPass: string,
  newPass: string,
): Promise<{ ok: boolean; message?: string; error?: string }> {
  if (!oldPass || !newPass) return { ok: false, error: 'Both current and new password are required' }
  if (newPass.length < 6) return { ok: false, error: 'New password must be at least 6 characters' }

  try {
    const rows = await queryRows('SELECT * FROM admin_users WHERE LOWER(email) = ? LIMIT 1', [
      user.email.toLowerCase(),
    ])
    const currentHash = rows[0]?.password_hash ? String(rows[0].password_hash) : ''
    if (currentHash && !verifyPassword(oldPass, currentHash)) {
      return { ok: false, error: 'Current password is incorrect' }
    }
  } catch {}

  const newHash = hashPassword(newPass)
  try {
    await execute('UPDATE admin_users SET password_hash = ? WHERE LOWER(email) = ?', [
      newHash,
      user.email.toLowerCase(),
    ])
  } catch (err) {
    return { ok: false, error: 'Failed to update password in database' }
  }
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
