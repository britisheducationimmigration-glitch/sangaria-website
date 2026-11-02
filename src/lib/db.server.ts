import '@tanstack/react-start/server-only'

import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from 'mysql2/promise'
import { approvals as fixtureApprovals, coachingSchedule as fixtureCoachingSchedule, posts as fixturePosts, testimonials as fixtureTestimonials } from '@/data/fixtures'
import { hashPassword } from './auth.server'

let pool: Pool | null = null
let schemaPromise: Promise<Pool | null> | null = null

type DbRow = RowDataPacket & Record<string, unknown>

function getPool() {
  if (pool) return pool
  const url = process.env.DATABASE_URL
  if (!url) return null
  pool = mysql.createPool({
    uri: url,
    waitForConnections: true,
    connectionLimit: 5,
    maxIdle: 5,
    idleTimeout: 60000,
    enableKeepAlive: true,
    ssl: process.env.DATABASE_SSL === 'false' ? undefined : { rejectUnauthorized: false },
  })
  return pool
}

async function ensureColumn(poolInstance: Pool, table: string, column: string, definition: string) {
  const [rows] = await poolInstance.query<DbRow[]>(
    'SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ? LIMIT 1',
    [table, column],
  )
  if (rows.length === 0) await poolInstance.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`)
}

async function seed(poolInstance: Pool) {
  const [settingsRows] = await poolInstance.query<DbRow[]>('SELECT id FROM site_settings WHERE id = 1 LIMIT 1')
  if (settingsRows.length === 0) {
    await poolInstance.query(
      `INSERT INTO site_settings (id, popup_enabled, popup_delay_seconds, whatsapp_enabled, approvals_marquee_enabled)
       VALUES (1, 1, 8, 1, 1)`,
    )
  }

  const [postRows] = await poolInstance.query<DbRow[]>('SELECT id FROM content_posts LIMIT 1')
  if (postRows.length === 0) {
    for (const post of fixturePosts) {
      await poolInstance.query(
        `INSERT INTO content_posts (slug, title, category, publish_date, excerpt, read_mins, body_json, published)
         VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
        [post.slug, post.title, post.category, post.date, post.excerpt, post.readMins, JSON.stringify(post.body)],
      )
    }
  }

  const [approvalRows] = await poolInstance.query<DbRow[]>("SELECT id FROM success_stories WHERE kind = 'approval' LIMIT 1")
  if (approvalRows.length === 0) {
    for (const approval of fixtureApprovals) {
      await poolInstance.query(
        `INSERT INTO success_stories (kind, name, city, country, visa, quote, rating, initials, flag, story_date, note, published)
         VALUES ('approval', ?, '', ?, ?, '', 5, '', ?, ?, ?, 1)`,
        [approval.name, approval.country, approval.visa, approval.flag, approval.date, approval.note ?? ''],
      )
    }
  }
  const [testimonialRows] = await poolInstance.query<DbRow[]>("SELECT id FROM success_stories WHERE kind = 'testimonial' LIMIT 1")
  if (testimonialRows.length === 0) {
    for (const testimonial of fixtureTestimonials) {
      await poolInstance.query(
        `INSERT INTO success_stories (kind, name, city, country, visa, quote, rating, initials, flag, story_date, note, published)
         VALUES ('testimonial', ?, ?, ?, ?, ?, ?, ?, '', CURRENT_DATE, '', 1)`,
        [testimonial.name, testimonial.city, testimonial.country, testimonial.visa, testimonial.quote, testimonial.rating, testimonial.initials],
      )
    }
  }

  const [batchRows] = await poolInstance.query<DbRow[]>('SELECT id FROM coaching_batches LIMIT 1')
  if (batchRows.length === 0) {
    for (const batch of fixtureCoachingSchedule) {
      const program = batch.batch.includes('IELTS') ? 'IELTS' : 'PTE'
      await poolInstance.query(
        'INSERT INTO coaching_batches (program, batch_name, time_slot, seats, starts, published) VALUES (?, ?, ?, ?, ?, 1)',
        [program, batch.batch, batch.time, batch.seats, batch.starts],
      )
    }
  }

  const [adminRows] = await poolInstance.query<DbRow[]>('SELECT open_id FROM admin_users LIMIT 1')
  if (adminRows.length === 0) {
    const initialEmail = (process.env.ADMIN_EMAIL || 'admin@britisheducationandimmigration.com').toLowerCase()
    const initialPass = process.env.ADMIN_PASSWORD || 'Admin@Sangaria2026'
    const passwordHash = hashPassword(initialPass)
    await poolInstance.query(
      `INSERT INTO admin_users (open_id, email, name, role, password_hash)
       VALUES (?, ?, ?, 'super_admin', ?)`,
      ['admin-owner', initialEmail, 'Owner / Admin', passwordHash],
    )
  }
}

export async function getDb() {
  const poolInstance = getPool()
  if (!poolInstance) return null
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await poolInstance.query(`
        CREATE TABLE IF NOT EXISTS site_settings (
          id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
          popup_enabled BOOLEAN NOT NULL DEFAULT TRUE,
          popup_delay_seconds INT UNSIGNED NOT NULL DEFAULT 8,
          whatsapp_enabled BOOLEAN NOT NULL DEFAULT TRUE,
          approvals_marquee_enabled BOOLEAN NOT NULL DEFAULT TRUE,
          cashflow_json LONGTEXT NULL,
          public_settings_json LONGTEXT NULL,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `)
      await ensureColumn(poolInstance, 'site_settings', 'cashflow_json', 'LONGTEXT NULL')
      await ensureColumn(poolInstance, 'site_settings', 'public_settings_json', 'LONGTEXT NULL')
      await poolInstance.query(`
        CREATE TABLE IF NOT EXISTS enquiries (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(120) NOT NULL,
          phone VARCHAR(40) NOT NULL,
          email VARCHAR(190) NOT NULL DEFAULT '',
          city VARCHAR(120) NOT NULL DEFAULT '',
          interest VARCHAR(160) NOT NULL DEFAULT '',
          country VARCHAR(120) NOT NULL DEFAULT '',
          message TEXT NOT NULL,
          source VARCHAR(160) NOT NULL DEFAULT '',
          summary TEXT NOT NULL,
          status VARCHAR(24) NOT NULL DEFAULT 'New',
          notes TEXT NOT NULL,
          assigned_to VARCHAR(190) NOT NULL DEFAULT '',
          next_follow_up_at DATETIME NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX enquiries_created_at_idx (created_at),
          INDEX enquiries_status_idx (status)
        )
      `)
      await ensureColumn(poolInstance, 'enquiries', 'assigned_to', "VARCHAR(190) NOT NULL DEFAULT ''")
      await ensureColumn(poolInstance, 'enquiries', 'next_follow_up_at', 'DATETIME NULL')
      await poolInstance.query(`
        CREATE TABLE IF NOT EXISTS enquiry_activities (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          enquiry_id BIGINT UNSIGNED NOT NULL,
          author_name VARCHAR(160) NOT NULL DEFAULT '',
          author_email VARCHAR(190) NOT NULL DEFAULT '',
          body TEXT NOT NULL,
          edited_by VARCHAR(190) NOT NULL DEFAULT '',
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX enquiry_activities_timeline_idx (enquiry_id, created_at, id)
        )
      `)
      await poolInstance.query(`
        CREATE TABLE IF NOT EXISTS coaching_batches (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          program VARCHAR(80) NOT NULL,
          batch_name VARCHAR(160) NOT NULL,
          time_slot VARCHAR(160) NOT NULL,
          seats INT UNSIGNED NOT NULL DEFAULT 0,
          starts VARCHAR(80) NOT NULL DEFAULT '',
          published BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX coaching_published_idx (published),
          INDEX coaching_program_idx (program)
        )
      `)
      await poolInstance.query(`
        CREATE TABLE IF NOT EXISTS content_posts (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          slug VARCHAR(190) NOT NULL UNIQUE,
          title VARCHAR(220) NOT NULL,
          category VARCHAR(80) NOT NULL,
          publish_date DATE NOT NULL,
          excerpt TEXT NOT NULL,
          read_mins INT UNSIGNED NOT NULL DEFAULT 4,
          body_json JSON NOT NULL,
          published BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `)
      await poolInstance.query(`
        CREATE TABLE IF NOT EXISTS success_stories (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          kind VARCHAR(20) NOT NULL,
          name VARCHAR(160) NOT NULL,
          city VARCHAR(120) NOT NULL DEFAULT '',
          country VARCHAR(120) NOT NULL DEFAULT '',
          visa VARCHAR(160) NOT NULL DEFAULT '',
          quote TEXT NOT NULL,
          rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
          initials VARCHAR(10) NOT NULL DEFAULT '',
          flag VARCHAR(10) NOT NULL DEFAULT '',
          story_date DATE NOT NULL,
          note VARCHAR(220) NOT NULL DEFAULT '',
          published BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX success_kind_idx (kind),
          INDEX success_date_idx (story_date)
        )
      `)
      await poolInstance.query(`
        CREATE TABLE IF NOT EXISTS admin_users (
          open_id VARCHAR(190) NOT NULL PRIMARY KEY,
          email VARCHAR(190) NOT NULL DEFAULT '',
          name VARCHAR(160) NOT NULL DEFAULT '',
          role VARCHAR(30) NOT NULL DEFAULT 'super_admin',
          password_hash VARCHAR(255) NOT NULL DEFAULT '',
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `)
      await ensureColumn(poolInstance, 'admin_users', 'password_hash', "VARCHAR(255) NOT NULL DEFAULT ''")
      await seed(poolInstance)
      return poolInstance
    })().catch((error) => {
      schemaPromise = null
      throw error
    })
  }
  return schemaPromise
}

export async function queryRows<T extends DbRow = DbRow>(sql: string, values: unknown[] = []) {
  const database = await getDb()
  if (!database) return [] as T[]
  const [rows] = await database.query<T[]>(sql, values)
  return rows
}

export async function execute(sql: string, values: Array<string | number | boolean | bigint | Date | null | Buffer | Uint8Array> = []) {
  const database = await getDb()
  if (!database) throw new Error('Database is not configured')
  const [result] = await database.execute<ResultSetHeader>(sql, values)
  return result
}

export function jsonArray(value: unknown) {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}
