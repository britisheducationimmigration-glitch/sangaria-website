import '@tanstack/react-start/server-only'

import crypto from 'node:crypto'
import { createMiddleware } from '@tanstack/react-start'
import { getDb, queryRows, execute } from './db.server'
import type { AdminRole } from './content-types'

export type SessionUser = { openId: string; email: string; name: string }

type TokenPayload = { sub: string; email: string; name: string; role: string; exp: number }

function getSessionSecret(): string | null {
  const secret = (process.env.SESSION_SECRET ?? '').trim()
  return secret.length >= 32 ? secret : null
}

function getRecoveryKey(): string | null {
  return (process.env.ADMIN_RECOVERY_KEY ?? '').trim() || null
}

function getConfiguredAdminEmail(): string {
  return (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase()
}

function safeTextEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left, 'utf8')
  const rightBuffer = Buffer.from(right, 'utf8')
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer)
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
  if (!secret) throw new Error('Admin authentication is not configured')

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const exp = Math.floor(Date.now() / 1000) + 30 * 86400
  const body = Buffer.from(
    JSON.stringify({
      sub: user.openId,
      email: user.email.toLowerCase(),
      name: user.name,
      role: user.role,
      exp,
    }),
  ).toString('base64url')
  const signature = crypto.createHmac('sha256', secret).update(header + '.' + body).digest('base64url')
  return header + '.' + body + '.' + signature
}

export function verifySessionToken(token: string): TokenPayload | null {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [header, body, signature] = parts
  const secret = getSessionSecret()
  if (!secret) return null

  const expected = crypto.createHmac('sha256', secret).update(header + '.' + body).digest('base64url')
  if (!safeTextEqual(expected, signature)) return null

  try {
    const parsedHeader = JSON.parse(Buffer.from(header, 'base64url').toString('utf8'))
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as TokenPayload
    if (parsedHeader.alg !== 'HS256') return null
    if (typeof payload.exp !== 'number' || payload.exp <= Math.floor(Date.now() / 1000)) return null
    if (!payload.sub || !payload.email || typeof payload.name !== 'string') return null
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
  return [...(process.env.ADMIN_EMAILS ?? '').split(','), getConfiguredAdminEmail()]
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
}

function normalizeRole(value: unknown): AdminRole | null {
  if (value === 'super_admin' || value === 'content_editor' || value === 'enquiry_manager') return value
  if (value === 'admin') return 'super_admin'
  return null
}

export async function getAdminRole(user: SessionUser): Promise<AdminRole | null> {
  const email = user.email.trim().toLowerCase()
  if (!email) return null

  const allowed = allowedAdminValues()
  if (allowed.includes(email)) return 'super_admin'

  try {
    const rows = await queryRows('SELECT role FROM admin_users WHERE LOWER(email) = ? LIMIT 1', [email])
    return normalizeRole(rows[0]?.role)
  } catch {
    return null
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
      await execute('INSERT INTO admin_users (open_id, email, name, role) VALUES (?, ?, ?, ?)', [
        user.openId,
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
  if (!getSessionSecret()) {
    return { ok: false, error: 'Invalid username/email or password' }
  }

  try {
    const rows = await queryRows('SELECT * FROM admin_users WHERE LOWER(email) = ? LIMIT 1', [cleanId])
    if (rows.length > 0) {
      const row = rows[0]
      const storedHash = String(row.password_hash || '')
      const role = normalizeRole(row.role)
      if (storedHash && role && verifyPassword(cleanPass, storedHash)) {
        const user = {
          openId: String(row.open_id || row.id || row.email),
          email: String(row.email).toLowerCase(),
          name: String(row.name || row.email),
          role,
        }
        const token = createSessionToken(user)
        return { ok: true, user: { openId: user.openId, email: user.email, name: user.name }, token }
      }
    }
  } catch (err) {
    console.error('Database query error in loginAdmin:', err)
  }

  const envEmail = getConfiguredAdminEmail()
  const envPass = process.env.ADMIN_PASSWORD || ''
  const isOwnerIdentifier = cleanId === envEmail || cleanId === 'admin' || cleanId === 'owner'
  if (envEmail && envPass && isOwnerIdentifier && safeTextEqual(cleanPass, envPass)) {
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


const resetOtpMessage = 'If an admin account exists for this email, a reset code will be sent.'

let passwordResetSetupPromise: Promise<void> | null = null

async function ensurePasswordResetTable() {
  if (!passwordResetSetupPromise) {
    passwordResetSetupPromise = (async () => {
      await execute(`
        CREATE TABLE IF NOT EXISTS admin_password_resets (
          email VARCHAR(255) PRIMARY KEY,
          otp VARCHAR(64) NOT NULL,
          attempts INT NOT NULL DEFAULT 0,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)
      await execute('ALTER TABLE admin_password_resets MODIFY COLUMN otp VARCHAR(64) NOT NULL')
      try {
        await execute('ALTER TABLE admin_password_resets ADD COLUMN attempts INT NOT NULL DEFAULT 0')
      } catch (cause) {
        const err = cause as { code?: string; errno?: number; message?: string }
        if (
          err.code !== 'ER_DUP_FIELDNAME' &&
          err.errno !== 1060 &&
          !String(err.message || '').toLowerCase().includes('duplicate column')
        ) {
          throw cause
        }
      }
    })().catch((error) => {
      passwordResetSetupPromise = null
      throw error
    })
  }
  await passwordResetSetupPromise
}

function resetOtpDigest(email: string, otp: string, secret: string) {
  return crypto.createHmac('sha256', secret).update(email + ':' + otp).digest('hex')
}

function safeDigestEqual(left: string, right: string) {
  if (!/^[a-f0-9]{64}$/i.test(left) || !/^[a-f0-9]{64}$/i.test(right)) return false
  return crypto.timingSafeEqual(Buffer.from(left, 'hex'), Buffer.from(right, 'hex'))
}

// Send reset codes only to known admin accounts. The response does not confirm whether an email is registered.
export async function sendResetOtp(emailInput: string): Promise<{ ok: boolean; message?: string; error?: string }> {
  const email = (emailInput || '').trim().toLowerCase()
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return { ok: false, error: 'Please enter a valid email address' }
  }

  const secret = getSessionSecret()
  if (!secret) return { ok: true, message: resetOtpMessage }

  try {
    const rows = await queryRows('SELECT * FROM admin_users WHERE LOWER(email) = ? LIMIT 1', [email])
    const masterEmail = getConfiguredAdminEmail()
    if (rows.length === 0 && email !== masterEmail) {
      return { ok: true, message: resetOtpMessage }
    }

    if (rows.length === 0 && email === masterEmail) {
      await ensureAdminRecord({ openId: 'admin-owner', email, name: 'Owner / Admin' })
      const ownerRows = await queryRows('SELECT * FROM admin_users WHERE LOWER(email) = ? LIMIT 1', [email])
      if (ownerRows.length === 0) return { ok: true, message: resetOtpMessage }
    }

    await ensurePasswordResetTable()
    const otp = String(crypto.randomInt(100000, 1000000))
    const otpHash = resetOtpDigest(email, otp, secret)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await execute(
      'INSERT INTO admin_password_resets (email, otp, attempts, expires_at) VALUES (?, ?, 0, ?) ON DUPLICATE KEY UPDATE otp = VALUES(otp), attempts = 0, expires_at = VALUES(expires_at)',
      [email, otpHash, expiresAt],
    )

    const html = [
      '<div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:28px;border:1px solid #e2e8f0;border-radius:20px;background:#fff">',
      '<h2 style="color:#0b3326;font-size:22px">British Education &amp; Immigration</h2>',
      '<p style="color:#64748b">Sangaria, Rajasthan · Admin Security</p>',
      '<p style="color:#334155;line-height:1.6">Use this 6-digit code to reset your admin password:</p>',
      '<div style="background:#0b3326;color:#fff;font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;padding:18px;border-radius:14px">' + otp + '</div>',
      '<p style="color:#64748b;font-size:12px">This code expires in 10 minutes. If you did not request it, ignore this email.</p>',
      '</div>',
    ].join('')

    await sendEmailViaResend({
      to: email,
      subject: 'Admin password reset code · British Education & Immigration',
      html,
    })
  } catch (err) {
    console.error('Admin password reset request could not be completed:', err)
  }

  return { ok: true, message: resetOtpMessage }
}

// Verify OTP and reset the stored admin password. A code permits at most five attempts.
export async function verifyOtpAndResetPassword(
  emailInput: string,
  otpInput: string,
  newPassword: string,
): Promise<{ ok: boolean; message?: string; error?: string }> {
  const email = (emailInput || '').trim().toLowerCase()
  const otp = (otpInput || '').trim()
  const cleanPass = (newPassword || '').trim()

  if (!email || !/^\S+@\S+\.\S+$/.test(email) || !/^\d{6}$/.test(otp) || !cleanPass) {
    return { ok: false, error: 'Invalid or expired OTP. Please try again.' }
  }
  if (cleanPass.length < 6) {
    return { ok: false, error: 'New password must be at least 6 characters' }
  }

  const secret = getSessionSecret()
  if (!secret) return { ok: false, error: 'Invalid or expired OTP. Please try again.' }

  try {
    await ensurePasswordResetTable()
    const rows = await queryRows(
      'SELECT * FROM admin_password_resets WHERE LOWER(email) = ? AND expires_at > CURRENT_TIMESTAMP() LIMIT 1',
      [email],
    )
    if (rows.length === 0) return { ok: false, error: 'Invalid or expired OTP. Please try again.' }

    const row = rows[0]
    const attempts = Number(row.attempts || 0)
    if (attempts >= 5) {
      await execute('DELETE FROM admin_password_resets WHERE LOWER(email) = ?', [email])
      return { ok: false, error: 'Invalid or expired OTP. Please try again.' }
    }

    const expected = resetOtpDigest(email, otp, secret)
    if (!safeDigestEqual(String(row.otp || ''), expected)) {
      if (attempts + 1 >= 5) {
        await execute('DELETE FROM admin_password_resets WHERE LOWER(email) = ?', [email])
      } else {
        await execute('UPDATE admin_password_resets SET attempts = attempts + 1 WHERE LOWER(email) = ?', [email])
      }
      return { ok: false, error: 'Invalid or expired OTP. Please try again.' }
    }

    const newHash = hashPassword(cleanPass)
    const update = await execute('UPDATE admin_users SET password_hash = ? WHERE LOWER(email) = ?', [newHash, email])
    await execute('DELETE FROM admin_password_resets WHERE LOWER(email) = ?', [email])
    if (!update.affectedRows) return { ok: false, error: 'Invalid or expired OTP. Please try again.' }

    return { ok: true, message: 'Password reset successful! You can now log in.' }
  } catch (err) {
    console.error('Verify OTP reset failed')
    return { ok: false, error: 'Invalid or expired OTP. Please try again.' }
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
    return { ok: false, error: 'Email, recovery key, and new password are required' }
  }
  if (cleanPass.length < 6) {
    return { ok: false, error: 'New password must be at least 6 characters long' }
  }

  const expectedKey = getRecoveryKey()
  if (!expectedKey || !safeTextEqual(cleanKey, expectedKey)) {
    return { ok: false, error: 'Invalid email or recovery key' }
  }

  try {
    let rows = await queryRows('SELECT * FROM admin_users WHERE LOWER(email) = ? LIMIT 1', [cleanEmail])
    if (rows.length === 0 && cleanEmail === getConfiguredAdminEmail()) {
      await ensureAdminRecord({ openId: 'admin-owner', email: cleanEmail, name: 'Owner / Admin' })
      rows = await queryRows('SELECT * FROM admin_users WHERE LOWER(email) = ? LIMIT 1', [cleanEmail])
    }
    if (rows.length === 0) return { ok: false, error: 'Invalid email or recovery key' }

    const newHash = hashPassword(cleanPass)
    const update = await execute('UPDATE admin_users SET password_hash = ? WHERE LOWER(email) = ?', [newHash, cleanEmail])
    if (!update.affectedRows) return { ok: false, error: 'Unable to reset password. Check the account details.' }
    await execute('DELETE FROM admin_password_resets WHERE LOWER(email) = ?', [cleanEmail])
    return { ok: true, message: 'Password reset successfully!' }
  } catch {
    return { ok: false, error: 'Unable to reset password. Check the account details.' }
  }
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
