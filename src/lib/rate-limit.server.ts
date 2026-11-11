import '@tanstack/react-start/server-only'

import crypto from 'node:crypto'
import { execute, queryRows } from './db.server'

let setupPromise: Promise<void> | null = null
let cleanupCounter = 0

async function ensureRateLimitTable() {
  if (!setupPromise) {
    setupPromise = execute(`
      CREATE TABLE IF NOT EXISTS request_rate_limits (
        bucket_hash CHAR(64) NOT NULL PRIMARY KEY,
        hit_count INT UNSIGNED NOT NULL DEFAULT 0,
        reset_at TIMESTAMP NOT NULL,
        INDEX request_rate_limits_reset_at_idx (reset_at)
      )
    `).then(() => undefined).catch((error) => {
      setupPromise = null
      throw error
    })
  }
  await setupPromise
}

/**
 * Shared, database-backed throttling so limits apply across serverless instances.
 * Only a keyed hash of each identity is persisted; raw emails, phones and IPs are not stored.
 */
export async function checkRateLimit(
  scope: string,
  identity: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  const secret = (process.env.SESSION_SECRET ?? '').trim()
  if (secret.length < 32) throw new Error('Request protection is not configured')

  const safeLimit = Math.max(1, Math.min(10000, Math.floor(limit)))
  const safeWindow = Math.max(1, Math.min(86400, Math.floor(windowSeconds)))
  const bucketHash = crypto
    .createHmac('sha256', secret)
    .update(scope + ':' + identity.trim().toLowerCase())
    .digest('hex')

  await ensureRateLimitTable()
  const insertSql =
    'INSERT INTO request_rate_limits (bucket_hash, hit_count, reset_at) VALUES (?, 1, DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL ' +
    safeWindow +
    ' SECOND)) ON DUPLICATE KEY UPDATE hit_count = IF(reset_at <= CURRENT_TIMESTAMP(), 1, hit_count + 1), reset_at = IF(reset_at <= CURRENT_TIMESTAMP(), DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL ' +
    safeWindow +
    ' SECOND), reset_at)'
  await execute(insertSql, [bucketHash])

  const rows = await queryRows('SELECT hit_count FROM request_rate_limits WHERE bucket_hash = ? LIMIT 1', [bucketHash])
  if (rows.length === 0) throw new Error('Request protection is unavailable')
  const count = Number(rows[0].hit_count)
  cleanupCounter += 1
  if (cleanupCounter >= 100) {
    cleanupCounter = 0
    try {
      await execute('DELETE FROM request_rate_limits WHERE reset_at < DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 DAY) LIMIT 500')
    } catch {
      // Old buckets are harmless if periodic cleanup is temporarily unavailable.
    }
  }
  return count <= safeLimit
}
