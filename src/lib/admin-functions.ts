import { createMiddleware, createServerFn } from '@tanstack/react-start'
import { execute, jsonArray, queryRows } from './db.server'
import type { AdminPost, AdminRole, AdminSnapshot, AdminStory, CoachingBatch, Enquiry, EnquiryActivity, EnquiryStatus, SiteSettings } from './content-types'
import { defaultCashflowData, mergeNewCashflowDestinations, type CountryCashflow } from '@/data/cashflow'
import { isValidBatchStartDate } from '@/lib/batch-dates'

function stringValue(value: unknown, max = 5000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function numberValue(value: unknown, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const defaultSettings: SiteSettings = { popupEnabled: true, popupDelaySeconds: 8, whatsappEnabled: true, approvalsMarqueeEnabled: true }

const adminMiddleware = createMiddleware().server(async ({ next, request }) => {
  const { ensureAdminRecord, getAdminRole, getSessionUser } = await import('./auth.server')
  const user = await getSessionUser(request.headers)
  if (!user || !(await ensureAdminRecord(user))) throw new Error('Unauthorized')
  const role = await getAdminRole(user)
  if (!role) throw new Error('Forbidden')
  return next({ context: { user, role } })
})

type Capability = 'enquiries' | 'content' | 'settings' | 'users'
function assertCapability(role: AdminRole, capability: Capability) {
  const allowed = role === 'super_admin' || (role === 'content_editor' && capability === 'content') || (role === 'enquiry_manager' && capability === 'enquiries')
  if (!allowed) throw new Error('You do not have permission for this section')
}

function mapSettings(row?: Record<string, unknown>): SiteSettings {
  return {
    popupEnabled: row ? Boolean(row.popup_enabled) : defaultSettings.popupEnabled,
    popupDelaySeconds: row ? Math.min(60, Math.max(3, Number(row.popup_delay_seconds) || 8)) : defaultSettings.popupDelaySeconds,
    whatsappEnabled: row ? Boolean(row.whatsapp_enabled) : defaultSettings.whatsappEnabled,
    approvalsMarqueeEnabled: row ? Boolean(row.approvals_marquee_enabled) : defaultSettings.approvalsMarqueeEnabled,
  }
}

function dateOnly(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  const text = String(value ?? '')
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10)
  const parsed = new Date(text)
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10)
}

function mapActivity(row: Record<string, unknown>): EnquiryActivity {
  return { id: Number(row.id), enquiryId: Number(row.enquiry_id), authorName: String(row.author_name), authorEmail: String(row.author_email), body: String(row.body), createdAt: new Date(String(row.created_at)).toISOString(), updatedAt: new Date(String(row.updated_at)).toISOString(), editedBy: String(row.edited_by ?? '') }
}
function mapEnquiry(row: Record<string, unknown>, activities: EnquiryActivity[] = []): Enquiry {
  return { id: Number(row.id), name: String(row.name), phone: String(row.phone), email: String(row.email), city: String(row.city), interest: String(row.interest), country: String(row.country), message: String(row.message), source: String(row.source), summary: String(row.summary), status: String(row.status) as EnquiryStatus, notes: String(row.notes), activities, assignedTo: String(row.assigned_to ?? ''), nextFollowUpAt: row.next_follow_up_at ? new Date(String(row.next_follow_up_at)).toISOString() : '', createdAt: new Date(String(row.created_at)).toISOString(), updatedAt: new Date(String(row.updated_at)).toISOString() }
}
function mapAdminPost(row: Record<string, unknown>): AdminPost {
  return { id: Number(row.id), slug: String(row.slug), title: String(row.title), category: String(row.category) as AdminPost['category'], date: dateOnly(row.publish_date), excerpt: String(row.excerpt), readMins: Number(row.read_mins), body: jsonArray(row.body_json).map(String), published: Boolean(row.published) }
}
function mapAdminStory(row: Record<string, unknown>): AdminStory {
  return { id: Number(row.id), kind: String(row.kind) as AdminStory['kind'], name: String(row.name), city: String(row.city), country: String(row.country), visa: String(row.visa), quote: String(row.quote), rating: Number(row.rating), initials: String(row.initials), flag: String(row.flag), date: dateOnly(row.story_date), note: String(row.note), published: Boolean(row.published) }
}
function mapBatch(row: Record<string, unknown>): CoachingBatch {
  return { id: Number(row.id), program: String(row.program), batch: String(row.batch_name), time: String(row.time_slot), seats: Number(row.seats), starts: String(row.starts), published: Boolean(row.published) }
}

export const getAdminSnapshot = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async ({ context }): Promise<AdminSnapshot> => {
    const [enquiryRows, postRows, storyRows, settingsRows, userRows, statRows, batchRows] = await Promise.all([
      context.role === 'content_editor' ? Promise.resolve([]) : queryRows('SELECT id, name, phone, email, city, interest, country, message, source, summary, status, notes, assigned_to, next_follow_up_at, created_at, updated_at FROM enquiries ORDER BY created_at DESC LIMIT 150'),
      context.role === 'enquiry_manager' ? Promise.resolve([]) : queryRows('SELECT * FROM content_posts ORDER BY publish_date DESC, id DESC LIMIT 100'),
      context.role === 'enquiry_manager' ? Promise.resolve([]) : queryRows('SELECT * FROM success_stories ORDER BY story_date DESC, id DESC LIMIT 100'),
      context.role === 'super_admin' ? queryRows('SELECT popup_enabled, popup_delay_seconds, whatsapp_enabled, approvals_marquee_enabled FROM site_settings WHERE id = 1 LIMIT 1') : Promise.resolve([]),
      context.role === 'super_admin' ? queryRows('SELECT * FROM admin_users ORDER BY email ASC') : Promise.resolve([]),
      context.role === 'content_editor' ? Promise.resolve([]) : queryRows(`SELECT COUNT(*) AS total, SUM(status = 'New') AS new_count, SUM(status IN ('Follow-up', 'Documents Pending', 'Applied')) AS follow_ups, SUM(status = 'Converted') AS converted, SUM(next_follow_up_at IS NOT NULL AND DATE(next_follow_up_at) = CURRENT_DATE() AND status NOT IN ('Converted', 'Closed')) AS due_today FROM enquiries`),
      context.role === 'enquiry_manager' ? Promise.resolve([]) : queryRows('SELECT id, program, batch_name, time_slot, seats, starts, published FROM coaching_batches ORDER BY id ASC'),
    ])
    const activityRows = enquiryRows.length
      ? await queryRows(
          `SELECT id, enquiry_id, author_name, author_email, body, edited_by, created_at, updated_at
           FROM enquiry_activities
           WHERE enquiry_id IN (${enquiryRows.map(() => '?').join(',')})
           ORDER BY created_at ASC, id ASC`,
          enquiryRows.map((row) => Number(row.id)),
        )
      : []
    const activitiesByEnquiry = new Map<number, EnquiryActivity[]>()
    for (const row of activityRows) {
      const activity = mapActivity(row)
      const existing = activitiesByEnquiry.get(activity.enquiryId) ?? []
      existing.push(activity)
      activitiesByEnquiry.set(activity.enquiryId, existing)
    }
    const stats = statRows[0] ?? {}
    return {
      user: { name: context.user.name, email: context.user.email, role: context.role },
      enquiries: enquiryRows.map((row) => mapEnquiry(row, activitiesByEnquiry.get(Number(row.id)) ?? [])), posts: postRows.map(mapAdminPost), stories: storyRows.map(mapAdminStory), settings: mapSettings(settingsRows[0]),
      users: userRows.map((row) => ({ openId: String(row.open_id || row.id || row.email), email: String(row.email), name: String(row.name || row.email), role: (row.role === 'admin' ? 'super_admin' : String(row.role)) as AdminRole })),
      enquiryStats: { total: Number(stats.total ?? 0), newCount: Number(stats.new_count ?? 0), followUps: Number(stats.follow_ups ?? 0), dueToday: Number(stats.due_today ?? 0), converted: Number(stats.converted ?? 0) },
      batches: batchRows.map(mapBatch),
    }
  })

export const updateEnquiry = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => {
  const input = (data ?? {}) as Record<string, unknown>
  const status = stringValue(input.status, 24) as EnquiryStatus
  if (!['New', 'Contacted', 'Follow-up', 'Documents Pending', 'Applied', 'Converted', 'Closed'].includes(status)) throw new Error('Invalid enquiry status')
  const followUp = stringValue(input.nextFollowUpAt, 32)
  if (followUp && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(followUp)) throw new Error('Invalid follow-up date')
  return { id: numberValue(input.id), status, assignedTo: stringValue(input.assignedTo, 190), nextFollowUpAt: followUp ? followUp.replace('T', ' ') : null }
}).handler(async ({ data, context }) => {
  assertCapability(context.role, 'enquiries')
  await execute('UPDATE enquiries SET status = ?, assigned_to = ?, next_follow_up_at = ? WHERE id = ?', [data.status, data.assignedTo, data.nextFollowUpAt, data.id])
  return { ok: true }
})

export const addEnquiryActivity = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => {
  const input = (data ?? {}) as Record<string, unknown>
  const enquiryId = numberValue(input.enquiryId)
  const body = stringValue(input.body, 5000)
  if (enquiryId <= 0 || !body) throw new Error('Lead and comment are required')
  return { enquiryId, body }
}).handler(async ({ data, context }) => {
  assertCapability(context.role, 'enquiries')
  const lead = await queryRows('SELECT id FROM enquiries WHERE id = ? LIMIT 1', [data.enquiryId])
  if (!lead.length) throw new Error('Lead not found')
  await execute(
    'INSERT INTO enquiry_activities (enquiry_id, author_name, author_email, body) VALUES (?, ?, ?, ?)',
    [data.enquiryId, context.user.name, context.user.email, data.body],
  )
  return { ok: true }
})

export const updateEnquiryActivity = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => {
  const input = (data ?? {}) as Record<string, unknown>
  const id = numberValue(input.id)
  const body = stringValue(input.body, 5000)
  if (id <= 0 || !body) throw new Error('Comment and text are required')
  return { id, body }
}).handler(async ({ data, context }) => {
  if (context.role !== 'super_admin') throw new Error('Only a super admin can edit lead comments')
  const result = await execute(
    'UPDATE enquiry_activities SET body = ?, edited_by = ? WHERE id = ?',
    [data.body, context.user.email, data.id],
  )
  if (result.affectedRows === 0) throw new Error('Comment not found')
  return { ok: true }
})

export const deleteEnquiryActivity = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => ({
  id: numberValue((data as Record<string, unknown>)?.id),
})).handler(async ({ data, context }) => {
  if (context.role !== 'super_admin') throw new Error('Only a super admin can delete lead comments')
  const result = await execute('DELETE FROM enquiry_activities WHERE id = ?', [data.id])
  if (result.affectedRows === 0) throw new Error('Comment not found')
  return { ok: true }
})

export const deleteEnquiry = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => ({ id: numberValue((data as Record<string, unknown>)?.id) })).handler(async ({ data, context }) => {
  if (context.role !== 'super_admin') throw new Error('Only a super admin can delete enquiries')
  await execute('DELETE FROM enquiry_activities WHERE enquiry_id = ?', [data.id])
  await execute('DELETE FROM enquiries WHERE id = ?', [data.id])
  return { ok: true }
})

export const exportEnquiries = createServerFn({ method: 'GET' }).middleware([adminMiddleware]).validator((data: unknown) => {
  const input = (data ?? {}) as Record<string, unknown>
  const status = stringValue(input.status, 24)
  const from = stringValue(input.from, 10)
  const to = stringValue(input.to, 10)
  if (from && !/^\d{4}-\d{2}-\d{2}$/.test(from)) throw new Error('Invalid start date')
  if (to && !/^\d{4}-\d{2}-\d{2}$/.test(to)) throw new Error('Invalid end date')
  return { query: stringValue(input.query, 120), status, from, to }
}).handler(async ({ context, data }) => {
  assertCapability(context.role, 'enquiries')
  const clauses: string[] = []
  const values: unknown[] = []
  if (data.query) {
    clauses.push('(name LIKE ? OR phone LIKE ? OR email LIKE ? OR city LIKE ? OR interest LIKE ? OR country LIKE ? OR status LIKE ?)')
    for (let index = 0; index < 7; index += 1) values.push(`%${data.query}%`)
  }
  if (data.status) { clauses.push('status = ?'); values.push(data.status) }
  if (data.from) { clauses.push('created_at >= ?'); values.push(`${data.from} 00:00:00`) }
  if (data.to) { clauses.push('created_at < DATE_ADD(?, INTERVAL 1 DAY)'); values.push(`${data.to} 00:00:00`) }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
  const rows = await queryRows(`SELECT id, name, phone, email, city, interest, country, message, source, status, notes, assigned_to, next_follow_up_at, created_at FROM enquiries ${where} ORDER BY created_at DESC LIMIT 5000`, values)
  const { createLeadsWorkbook } = await import('./xlsx.server')
  const cleanDate = (value: unknown) => value ? new Date(String(value)).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : ''
  const leads = rows.map((row) => [Number(row.id), row.name, row.phone, row.email, row.city, row.interest, row.country, row.status, row.assigned_to, cleanDate(row.next_follow_up_at), row.source, row.message, row.notes, cleanDate(row.created_at)])
  const statusCounts = new Map<string, number>()
  for (const row of rows) statusCounts.set(String(row.status), (statusCounts.get(String(row.status)) ?? 0) + 1)
  const summary = [['Status', 'Lead count'], ...Array.from(statusCounts.entries()).map(([leadStatus, count]) => [leadStatus, count]), ['Total', rows.length]]
  const followUps = rows.filter((row) => row.next_follow_up_at).map((row) => [cleanDate(row.next_follow_up_at), row.name, row.phone, row.country, row.interest, row.status, row.assigned_to, row.notes])
  const baseName = data.status ? data.status.toLowerCase().replaceAll(' ', '-') : 'all'
  return {
    filename: `bei-leads-${baseName}-${new Date().toISOString().slice(0, 10)}.xlsx`,
    base64: createLeadsWorkbook([
      { name: 'Leads', rows: [['ID', 'Name', 'Phone', 'Email', 'City', 'Interest', 'Country', 'Status', 'Assigned to', 'Next follow-up', 'Source', 'Message', 'Notes', 'Created at'], ...leads], widths: [8, 22, 16, 28, 18, 22, 18, 20, 22, 22, 16, 42, 42, 22], headerRows: [1], filter: `A1:N${Math.max(1, leads.length + 1)}` },
      { name: 'Summary', rows: [['Lead pipeline', 'Count'], ...summary.slice(1)], widths: [28, 14], headerRows: [1] },
      { name: 'Follow-ups', rows: [['Follow-up at', 'Name', 'Phone', 'Country', 'Interest', 'Status', 'Assigned to', 'Notes'], ...followUps], widths: [22, 22, 16, 18, 22, 20, 22, 42], headerRows: [1], filter: `A1:H${Math.max(1, followUps.length + 1)}` },
    ]),
  }
})

export const savePost = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => {
  const input = (data ?? {}) as Record<string, unknown>
  const title = stringValue(input.title, 220)
  const slug = stringValue(input.slug, 190).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  if (!title || !slug) throw new Error('Title and slug are required')
  const body = Array.isArray(input.body) ? input.body.map((item) => stringValue(item, 5000)).filter(Boolean) : stringValue(input.body, 20000).split('\n').map((item) => item.trim()).filter(Boolean)
  return { id: numberValue(input.id), slug, title, category: stringValue(input.category, 80) || 'Visa News', date: stringValue(input.date, 10) || new Date().toISOString().slice(0, 10), excerpt: stringValue(input.excerpt, 5000), readMins: Math.max(1, Math.min(60, numberValue(input.readMins, 4))), body, published: Boolean(input.published) }
}).handler(async ({ data, context }) => {
  assertCapability(context.role, 'content')
  if (data.id) await execute('UPDATE content_posts SET slug = ?, title = ?, category = ?, publish_date = ?, excerpt = ?, read_mins = ?, body_json = ?, published = ? WHERE id = ?', [data.slug, data.title, data.category, data.date, data.excerpt, data.readMins, JSON.stringify(data.body), data.published ? 1 : 0, data.id])
  else await execute('INSERT INTO content_posts (slug, title, category, publish_date, excerpt, read_mins, body_json, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [data.slug, data.title, data.category, data.date, data.excerpt, data.readMins, JSON.stringify(data.body), data.published ? 1 : 0])
  return { ok: true }
})

export const deletePost = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => ({ id: numberValue((data as Record<string, unknown>)?.id) })).handler(async ({ data, context }) => {
  assertCapability(context.role, 'content')
  await execute('DELETE FROM content_posts WHERE id = ?', [data.id])
  return { ok: true }
})

export const saveStory = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => {
  const input = (data ?? {}) as Record<string, unknown>
  const kind = stringValue(input.kind, 20) as AdminStory['kind']
  if (kind !== 'approval' && kind !== 'testimonial') throw new Error('Choose a story type')
  const name = stringValue(input.name, 160)
  if (!name) throw new Error('Name is required')
  return { id: numberValue(input.id), kind, name, city: stringValue(input.city, 120), country: stringValue(input.country, 120), visa: stringValue(input.visa, 160), quote: stringValue(input.quote, 10000), rating: Math.max(1, Math.min(5, numberValue(input.rating, 5))), initials: stringValue(input.initials, 10), flag: stringValue(input.flag, 10), date: stringValue(input.date, 10) || new Date().toISOString().slice(0, 10), note: stringValue(input.note, 220), published: Boolean(input.published) }
}).handler(async ({ data, context }) => {
  assertCapability(context.role, 'content')
  if (data.id) await execute('UPDATE success_stories SET kind = ?, name = ?, city = ?, country = ?, visa = ?, quote = ?, rating = ?, initials = ?, flag = ?, story_date = ?, note = ?, published = ? WHERE id = ?', [data.kind, data.name, data.city, data.country, data.visa, data.quote, data.rating, data.initials, data.flag, data.date, data.note, data.published ? 1 : 0, data.id])
  else await execute('INSERT INTO success_stories (kind, name, city, country, visa, quote, rating, initials, flag, story_date, note, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [data.kind, data.name, data.city, data.country, data.visa, data.quote, data.rating, data.initials, data.flag, data.date, data.note, data.published ? 1 : 0])
  return { ok: true }
})

export const deleteStory = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => ({ id: numberValue((data as Record<string, unknown>)?.id) })).handler(async ({ data, context }) => {
  assertCapability(context.role, 'content')
  await execute('DELETE FROM success_stories WHERE id = ?', [data.id])
  return { ok: true }
})

export const saveBatch = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => {
  const input = (data ?? {}) as Record<string, unknown>
  const program = stringValue(input.program, 80)
  const batch = stringValue(input.batch, 160)
  const starts = stringValue(input.starts, 80)
  if (!program || !batch) throw new Error('Program and batch name are required')
  if (!isValidBatchStartDate(starts)) throw new Error('Choose a valid full batch start date')
  return { id: numberValue(input.id), program, batch, time: stringValue(input.time, 160), seats: Math.max(0, Math.min(999, numberValue(input.seats, 0))), starts, published: Boolean(input.published) }
}).handler(async ({ data, context }) => {
  assertCapability(context.role, 'content')
  if (data.id) await execute('UPDATE coaching_batches SET program = ?, batch_name = ?, time_slot = ?, seats = ?, starts = ?, published = ? WHERE id = ?', [data.program, data.batch, data.time, data.seats, data.starts, data.published ? 1 : 0, data.id])
  else await execute('INSERT INTO coaching_batches (program, batch_name, time_slot, seats, starts, published) VALUES (?, ?, ?, ?, ?, ?)', [data.program, data.batch, data.time, data.seats, data.starts, data.published ? 1 : 0])
  return { ok: true }
})

export const deleteBatch = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => ({ id: numberValue((data as Record<string, unknown>)?.id) })).handler(async ({ data, context }) => {
  assertCapability(context.role, 'content')
  await execute('DELETE FROM coaching_batches WHERE id = ?', [data.id])
  return { ok: true }
})

export const updateSettings = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => {
  const input = (data ?? {}) as Record<string, unknown>
  return { popupEnabled: Boolean(input.popupEnabled), popupDelaySeconds: Math.min(60, Math.max(3, numberValue(input.popupDelaySeconds, 8))), whatsappEnabled: Boolean(input.whatsappEnabled), approvalsMarqueeEnabled: Boolean(input.approvalsMarqueeEnabled) }
}).handler(async ({ data, context }) => {
  assertCapability(context.role, 'settings')
  await execute('UPDATE site_settings SET popup_enabled = ?, popup_delay_seconds = ?, whatsapp_enabled = ?, approvals_marquee_enabled = ? WHERE id = 1', [data.popupEnabled ? 1 : 0, data.popupDelaySeconds, data.whatsappEnabled ? 1 : 0, data.approvalsMarqueeEnabled ? 1 : 0])
  return { ok: true }
})

export const saveCashflow = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => {
  const input = (data ?? {}) as Record<string, unknown>
  if (!Array.isArray(input.cashflowData) || input.cashflowData.length === 0) throw new Error('Cashflow data is required')
  const cashflowJson = JSON.stringify(input.cashflowData)
  if (cashflowJson.length > 500_000) throw new Error('Cashflow data is too large')
  return { cashflowJson }
}).handler(async ({ data, context }) => {
  if (context.role !== 'super_admin') throw new Error('Only a super admin can update cashflow')
  await execute('UPDATE site_settings SET cashflow_json = ? WHERE id = 1', [data.cashflowJson])
  return { ok: true }
})

export const getAdminCashflow = createServerFn({ method: 'GET' }).middleware([adminMiddleware]).handler(async ({ context }): Promise<CountryCashflow[]> => {
  if (context.role !== 'super_admin') throw new Error('Only a super admin can view cashflow settings')
  const rows = await queryRows('SELECT cashflow_json FROM site_settings WHERE id = 1 LIMIT 1')
  const raw = rows[0]?.cashflow_json
  if (typeof raw !== 'string' || !raw.trim()) return defaultCashflowData
  try {
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) && parsed.length > 0 ? mergeNewCashflowDestinations(parsed as CountryCashflow[]) : defaultCashflowData
  } catch {
    return defaultCashflowData
  }
})

export const saveAdminUser = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => {
  const input = (data ?? {}) as Record<string, unknown>
  const email = stringValue(input.email, 190).toLowerCase()
  const role = stringValue(input.role, 30) as AdminRole
  const password = stringValue(input.password, 200)
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Enter a valid email')
  if (!['super_admin', 'content_editor', 'enquiry_manager'].includes(role)) throw new Error('Choose a valid role')
  return { email, role, name: stringValue(input.name, 160) || email, password }
}).handler(async ({ data, context }) => {
  assertCapability(context.role, 'users')
  const { hashPassword } = await import('./auth.server')
  const passHash = data.password ? hashPassword(data.password) : null

  const existing = await queryRows('SELECT * FROM admin_users WHERE LOWER(email) = ? LIMIT 1', [data.email])
  if (existing.length > 0) {
    if (passHash) {
      await execute('UPDATE admin_users SET name = ?, role = ?, password_hash = ? WHERE LOWER(email) = ?', [data.name, data.role, passHash, data.email])
    } else {
      await execute('UPDATE admin_users SET name = ?, role = ? WHERE LOWER(email) = ?', [data.name, data.role, data.email])
    }
  } else {
    if (!passHash) throw new Error('Password is required for new staff account')
    try {
      await execute('INSERT INTO admin_users (open_id, email, name, role, password_hash) VALUES (?, ?, ?, ?, ?)', [`email:${data.email}`, data.email, data.name, data.role, passHash])
    } catch {
      await execute('INSERT INTO admin_users (email, name, role, password_hash) VALUES (?, ?, ?, ?)', [data.email, data.name, data.role, passHash])
    }
  }
  return { ok: true }
})

export const deleteAdminUser = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => ({ openId: stringValue((data as Record<string, unknown>)?.openId, 190) })).handler(async ({ data, context }) => {
  assertCapability(context.role, 'users')
  if (data.openId === context.user.openId || data.openId === `email:${context.user.email}`) throw new Error('You cannot remove your own active account')
  try {
    await execute('DELETE FROM admin_users WHERE open_id = ? OR LOWER(email) = ?', [data.openId, data.openId.replace('email:', '').toLowerCase()])
  } catch {
    await execute('DELETE FROM admin_users WHERE LOWER(email) = ?', [data.openId.replace('email:', '').toLowerCase()])
  }
  return { ok: true }
})
