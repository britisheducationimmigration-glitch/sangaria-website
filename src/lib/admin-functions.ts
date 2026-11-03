import { createMiddleware, createServerFn } from '@tanstack/react-start'
import { execute, jsonArray, queryRows } from './db.server'
import type { AdminCertificate, AdminPost, AdminRole, AdminSnapshot, AdminStory, CoachingBatch, Enquiry, EnquiryActivity, EnquiryStatus } from './content-types'
import { Buffer } from 'node:buffer'
import { asFaqList, asTrustStatList, readSiteSettings } from './site-settings'
import { defaultCashflowData, mergeNewCashflowDestinations, type CountryCashflow } from '@/data/cashflow'
import { applyScheduledCashflowPolicy, policyWatchItems, type PolicyNotice } from '@/data/policy-watch'
import { readPolicyWatchState, scanOfficialPolicySources, writePolicyWatchState } from './policy-watch.server'
import { isValidBatchStartDate } from '@/lib/batch-dates'
import { getSupportedVideoEmbedUrl } from './video'
import { invalidateCoachingCache, invalidatePublicContentCache } from './public-functions'
import { discardCountryDraft, getAdminCountryCatalog, getPublicCountryCatalog, revertCountryToDefault, saveCountryDraft, type CountryPageContent } from './country-catalog.server'
import type { Country, StudyGuide } from '@/data/fixtures'
import type { VisaGuidance } from '@/data/visa-guidance'

function stringValue(value: unknown, max = 5000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function numberValue(value: unknown, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

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
  const photoSrc = Boolean(row.has_photo) ? '/success-stories/media/' + Number(row.id) + '?v=' + Number(row.media_version ?? 0) : ''
  const videoUrl = String(row.video_url ?? '')
  const mediaType: AdminStory['mediaType'] = photoSrc ? 'photo' : getSupportedVideoEmbedUrl(videoUrl) ? 'video' : 'none'
  return { id: Number(row.id), kind: String(row.kind) as AdminStory['kind'], name: String(row.name), city: String(row.city), country: String(row.country), visa: String(row.visa), quote: String(row.quote), rating: Number(row.rating), initials: String(row.initials), flag: String(row.flag), date: dateOnly(row.story_date), note: String(row.note), mediaType, photoSrc, videoUrl: mediaType === 'video' ? videoUrl : '', mediaAlt: String(row.media_alt ?? ''), mediaConsent: Boolean(row.media_consent), homepageFeatured: Boolean(row.homepage_featured), published: Boolean(row.published) }
}
function mapBatch(row: Record<string, unknown>): CoachingBatch {
  return { id: Number(row.id), program: String(row.program), batch: String(row.batch_name), time: String(row.time_slot), seats: Number(row.seats), starts: String(row.starts), published: Boolean(row.published) }
}

function mapCertificate(row: Record<string, unknown>): AdminCertificate {
  const id = Number(row.id)
  const hasDatabaseImage = Boolean(row.has_database_image)
  return {
    id,
    title: String(row.title),
    issuer: String(row.issuer),
    category: String(row.category),
    credentialDate: String(row.credential_date ?? ''),
    altText: String(row.alt_text),
    imageSrc: hasDatabaseImage ? '/certificates/image/' + id + '?v=' + Number(row.image_version ?? 0) : String(row.image_path ?? ''),
    homepageFeatured: Boolean(row.homepage_featured),
    published: Boolean(row.published),
    sortOrder: Number(row.sort_order),
    collection: String(row.collection ?? 'certificates'),
    hasDatabaseImage,
  }
}

export const getAdminSnapshot = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async ({ context }): Promise<AdminSnapshot> => {
    const [enquiryRows, postRows, storyRows, settingsRows, userRows, statRows, batchRows, statusRows, sourceRows, certificateRows] = await Promise.all([
      context.role === 'content_editor' ? Promise.resolve([]) : queryRows('SELECT id, name, phone, email, city, interest, country, message, source, summary, status, notes, assigned_to, next_follow_up_at, created_at, updated_at FROM enquiries ORDER BY created_at DESC LIMIT 150'),
      context.role === 'enquiry_manager' ? Promise.resolve([]) : queryRows('SELECT * FROM content_posts ORDER BY publish_date DESC, id DESC LIMIT 100'),
      context.role === 'enquiry_manager' ? Promise.resolve([]) : queryRows('SELECT id, kind, name, city, country, visa, quote, rating, initials, flag, story_date, note, photo_data IS NOT NULL AS has_photo, video_url, media_alt, media_consent, media_version, homepage_featured, published FROM success_stories ORDER BY story_date DESC, id DESC LIMIT 100'),
      context.role === 'super_admin' ? queryRows('SELECT popup_enabled, popup_delay_seconds, whatsapp_enabled, approvals_marquee_enabled, public_settings_json FROM site_settings WHERE id = 1 LIMIT 1') : Promise.resolve([]),
      context.role === 'super_admin' ? queryRows('SELECT * FROM admin_users ORDER BY email ASC') : Promise.resolve([]),
      context.role === 'content_editor' ? Promise.resolve([]) : queryRows(`SELECT COUNT(*) AS total, SUM(status = 'New') AS new_count, SUM(status IN ('Follow-up', 'Documents Pending', 'Applied')) AS follow_ups, SUM(status = 'Converted') AS converted, SUM(created_at >= CURRENT_DATE - INTERVAL 6 DAY) AS new_last_7_days, SUM(source = 'coaching') AS demo_requests, SUM(next_follow_up_at IS NOT NULL AND DATE(next_follow_up_at) = CURRENT_DATE() AND status NOT IN ('Converted', 'Closed')) AS due_today FROM enquiries`),
      context.role === 'enquiry_manager' ? Promise.resolve([]) : queryRows('SELECT id, program, batch_name, time_slot, seats, starts, published FROM coaching_batches ORDER BY id ASC'),
      context.role === 'content_editor' ? Promise.resolve([]) : queryRows('SELECT status, COUNT(*) AS count FROM enquiries GROUP BY status'),
      context.role === 'content_editor' ? Promise.resolve([]) : queryRows('SELECT source, COUNT(*) AS count FROM enquiries GROUP BY source'),
      context.role === 'enquiry_manager' ? Promise.resolve([]) : queryRows('SELECT id, collection, title, issuer, category, credential_date, alt_text, image_path, image_data IS NOT NULL AS has_database_image, image_version, homepage_featured, published, sort_order FROM certificate_items WHERE collection = \'certificates\' ORDER BY sort_order ASC, id ASC'),
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
    const byStatus = Object.fromEntries(statusRows.map((row) => [String(row.status), Number(row.count ?? 0)]))
    const bySource = Object.fromEntries(sourceRows.map((row) => [String(row.source || 'unknown'), Number(row.count ?? 0)]))
    return {
      user: { name: context.user.name, email: context.user.email, role: context.role },
      enquiries: enquiryRows.map((row) => mapEnquiry(row, activitiesByEnquiry.get(Number(row.id)) ?? [])), posts: postRows.map(mapAdminPost), stories: storyRows.map(mapAdminStory), settings: readSiteSettings(settingsRows[0]),
      users: userRows.map((row) => ({ openId: String(row.open_id || row.id || row.email), email: String(row.email), name: String(row.name || row.email), role: (row.role === 'admin' ? 'super_admin' : String(row.role)) as AdminRole })),
      enquiryStats: { total: Number(stats.total ?? 0), newCount: Number(stats.new_count ?? 0), followUps: Number(stats.follow_ups ?? 0), dueToday: Number(stats.due_today ?? 0), converted: Number(stats.converted ?? 0), newLast7Days: Number(stats.new_last_7_days ?? 0), demoRequests: Number(stats.demo_requests ?? 0), byStatus, bySource },
      batches: batchRows.map(mapBatch),
      certificates: certificateRows.map(mapCertificate),
    }
  })

export const getAdminPolicyWatch = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async ({ context }) => {
    if (context.role !== 'super_admin') throw new Error('Only a super admin can manage policy notices')
    const [state, countryPages] = await Promise.all([readPolicyWatchState(), getPublicCountryCatalog()])
    return { items: policyWatchItems, notices: state.notices, reviews: state.reviews, countries: countryPages.map((entry) => ({ slug: entry.country.slug, name: entry.country.name })) }
  })

export const savePolicyNotice = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => {
  const input = (data ?? {}) as Record<string, unknown>
  const id = stringValue(input.id, 120)
  const countrySlug = stringValue(input.countrySlug, 40)
  const title = stringValue(input.title, 180)
  const message = stringValue(input.message, 1400)
  const showFrom = stringValue(input.showFrom, 10)
  const expiresOn = stringValue(input.expiresOn, 10)
  const sourceLabel = stringValue(input.sourceLabel, 180)
  const sourceUrl = stringValue(input.sourceUrl, 500)
  const status = stringValue(input.status, 20)
  const sourceVerified = Boolean(input.sourceVerified)
  if (countrySlug !== 'all' && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(countrySlug)) throw new Error('Choose a valid destination')
  if (!title || !message) throw new Error('Add a title and notice text')
  if (!['draft', 'published'].includes(status)) throw new Error('Choose draft or published')
  if (status === 'published') {
    if (!sourceVerified) throw new Error('Check the official source before publishing')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(showFrom) || !/^\d{4}-\d{2}-\d{2}$/.test(expiresOn) || expiresOn <= showFrom) throw new Error('Set a valid start date and a later hide date before publishing')
    if (!sourceUrl.startsWith('https://') || !sourceLabel) throw new Error('Published notices need an official HTTPS source link')
  }
  return { id, countrySlug, title, message, showFrom, expiresOn, sourceLabel, sourceUrl, status: status as 'draft' | 'published', sourceVerified }
}).handler(async ({ data, context }): Promise<PolicyNotice> => {
  if (context.role !== 'super_admin') throw new Error('Only a super admin can manage policy notices')
  if (data.countrySlug !== 'all') {
    const countryPages = await getPublicCountryCatalog()
    if (!countryPages.some((entry) => entry.country.slug === data.countrySlug)) throw new Error('Choose a published destination')
  }
  const state = await readPolicyWatchState()
  const id = data.id || 'notice-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
  const previous = state.notices.find((item) => item.id === id)
  const notice: PolicyNotice = {
    ...previous,
    ...data,
    id,
    status: data.status,
    sourceVerified: data.status === 'published' && data.sourceVerified,
    guidanceUpdatedAt: previous?.guidanceUpdatedAt,
    guidanceUpdatedBy: previous?.guidanceUpdatedBy,
    sourceItemId: previous?.sourceItemId,
  }
  const index = state.notices.findIndex((item) => item.id === id)
  if (index < 0) state.notices.unshift(notice)
  else state.notices[index] = notice
  await writePolicyWatchState(state)
  return notice
})

export const deletePolicyNotice = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => ({
  id: stringValue((data as Record<string, unknown>)?.id, 120),
})).handler(async ({ data, context }) => {
  if (context.role !== 'super_admin') throw new Error('Only a super admin can remove policy notices')
  const state = await readPolicyWatchState()
  state.notices = state.notices.filter((item) => item.id !== data.id)
  for (const review of Object.values(state.reviews)) {
    if (review.pendingDraftId === data.id) {
      review.sourceChangePending = false
      delete review.pendingDraftId
    }
  }
  await writePolicyWatchState(state)
  return { ok: true }
})

export const markPolicySourceReview = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => {
  const input = (data ?? {}) as Record<string, unknown>
  const itemId = stringValue(input.itemId, 120)
  const action = stringValue(input.action, 30)
  if (!policyWatchItems.some((item) => item.id === itemId) || !['checked', 'guidance-updated'].includes(action)) throw new Error('Invalid policy review action')
  return { itemId, action: action as 'checked' | 'guidance-updated' }
}).handler(async ({ data, context }) => {
  if (context.role !== 'super_admin') throw new Error('Only a super admin can mark policy reviews')
  const state = await readPolicyWatchState()
  const previous = state.reviews[data.itemId] ?? {}
  const now = new Date().toISOString()
  state.reviews[data.itemId] = data.action === 'checked'
    ? { ...previous, checkedAt: now, checkedBy: context.user.email, sourceChangePending: false, pendingDraftId: undefined }
    : { ...previous, guidanceUpdatedAt: now, guidanceUpdatedBy: context.user.email }
  await writePolicyWatchState(state)
  return { ok: true, review: state.reviews[data.itemId] }
})

export const scanPolicySourcesNow = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).handler(async ({ context }) => {
  if (context.role !== 'super_admin') throw new Error('Only a super admin can scan policy sources')
  return scanOfficialPolicySources()
})

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {}
}

function cleanStringList(value: unknown, maxItems = 24, maxLength = 600): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string').map((item) => item.trim().slice(0, maxLength)).filter(Boolean).slice(0, maxItems)
}

function cleanCountryRows(value: unknown, maxItems = 20): { label: string; value: string }[] {
  if (!Array.isArray(value)) return []
  return value.filter((item) => !!item && typeof item === 'object').map((item) => {
    const row = item as Record<string, unknown>
    return { label: stringValue(row.label, 140), value: stringValue(row.value, 1200) }
  }).filter((row) => row.label || row.value).slice(0, maxItems)
}

function cleanCountrySources(value: unknown): { label: string; url: string }[] {
  if (!Array.isArray(value)) return []
  return value.filter((item) => !!item && typeof item === 'object').map((item) => {
    const row = item as Record<string, unknown>
    return { label: stringValue(row.label, 180), url: stringValue(row.url, 500) }
  }).filter((row) => row.label || row.url).slice(0, 30)
}

function normalizeCountryPageContent(value: unknown): CountryPageContent {
  const input = objectValue(value)
  const countryInput = objectValue(input.country)
  const guidanceInput = objectValue(input.guidance)
  const guideInput = objectValue(countryInput.studyGuide)
  const stats = cleanCountryRows(countryInput.stats, 6)
  const costs = cleanCountryRows(countryInput.costs, 24)
  const feeRows = cleanCountryRows(guidanceInput.feeRows, 30)
  const guideSources = cleanCountrySources(guideInput.sources)
  const sources = cleanCountrySources(guidanceInput.sources)
  const hasStudyGuide = Object.values(guideInput).some((item) => typeof item === 'string' && item.trim()) || guideSources.length > 0
  const studyGuide: StudyGuide | undefined = hasStudyGuide ? {
    tuitionEstimate: stringValue(guideInput.tuitionEstimate, 1800),
    studentVisaFee: stringValue(guideInput.studentVisaFee, 1200),
    proofOfFunds: stringValue(guideInput.proofOfFunds, 1800),
    admissionAndEnglish: stringValue(guideInput.admissionAndEnglish, 1800),
    workWhileStudying: stringValue(guideInput.workWhileStudying, 1800),
    postStudyOption: stringValue(guideInput.postStudyOption, 1800),
    intakesNote: stringValue(guideInput.intakesNote, 1200),
    lastVerified: stringValue(guideInput.lastVerified, 80),
    sources: guideSources,
  } : undefined
  const country: Country = {
    slug: stringValue(countryInput.slug, 80).toLowerCase(),
    name: stringValue(countryInput.name, 100),
    flag: stringValue(countryInput.flag, 24),
    code: stringValue(countryInput.code, 2).toUpperCase(),
    headline: stringValue(countryInput.headline, 180),
    intro: stringValue(countryInput.intro, 1800),
    stats,
    intakes: cleanStringList(countryInput.intakes, 24, 100),
    visas: cleanStringList(countryInput.visas, 24, 120),
    highlights: cleanStringList(countryInput.highlights, 16, 400),
    costs,
    english: stringValue(countryInput.english, 1200),
    studyGuide,
  }
  const guidance: VisaGuidance = {
    lastVerified: stringValue(guidanceInput.lastVerified, 80),
    feeRows,
    feeSummary: stringValue(guidanceInput.feeSummary, 1800),
    requirements: cleanStringList(guidanceInput.requirements, 24, 1800),
    caveat: stringValue(guidanceInput.caveat, 1800),
    sources,
  }
  return { country, guidance }
}

function validateCountryPageForPublish(content: CountryPageContent) {
  const { country, guidance } = content
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(country.slug)) throw new Error('Use a lowercase URL slug such as japan or south-korea')
  if (!country.name || !country.flag || !/^[A-Z]{2}$/.test(country.code)) throw new Error('Add a country name, flag emoji and two-letter country code')
  if (!country.headline || !country.intro || !country.english) throw new Error('Complete the page headline, introduction and English/admission guidance')
  if (!country.visas.length || !country.highlights.length || !country.costs.length) throw new Error('Add visa types, highlights and destination costs')
  if (!guidance.lastVerified || !guidance.feeRows.length || !guidance.feeSummary || !guidance.requirements.length || !guidance.caveat || !guidance.sources.length) {
    throw new Error('Complete the visa fees, core requirements, caution, last-verified date and official sources')
  }
  for (const source of [...guidance.sources, ...(country.studyGuide?.sources ?? [])]) {
    if (!source.label || !source.url.startsWith('https://')) throw new Error('Every published source needs a label and HTTPS link')
  }
  if (country.slug !== 'europe' && !country.studyGuide) throw new Error('Study destinations also need their study guide and admission details')
  if (country.studyGuide) {
    const guide = country.studyGuide
    if (!guide.tuitionEstimate || !guide.studentVisaFee || !guide.proofOfFunds || !guide.admissionAndEnglish || !guide.workWhileStudying || !guide.postStudyOption || !guide.intakesNote || !guide.lastVerified || !guide.sources.length) {
      throw new Error('Complete all study guide fields, verification date and sources')
    }
  }
}

export const getAdminCountryPages = createServerFn({ method: 'GET' }).middleware([adminMiddleware]).handler(async ({ context }) => {
  if (context.role !== 'super_admin') throw new Error('Only a super admin can manage country pages')
  return getAdminCountryCatalog()
})

export const saveCountryPage = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => {
  const input = objectValue(data)
  const content = normalizeCountryPageContent(input.content)
  const status = stringValue(input.status, 20)
  const isNew = Boolean(input.isNew)
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(content.country.slug)) throw new Error('Add a URL slug before saving')
  if (!content.country.name) throw new Error('Add a destination name before saving')
  if (!['draft', 'published'].includes(status)) throw new Error('Choose save draft or publish')
  if (status === 'published') validateCountryPageForPublish(content)
  return { content, status: status as 'draft' | 'published', isNew }
}).handler(async ({ data, context }) => {
  if (context.role !== 'super_admin') throw new Error('Only a super admin can manage country pages')
  if (data.isNew) {
    const current = await getAdminCountryCatalog()
    if (current.countries.some((entry) => entry.country.slug === data.content.country.slug)) throw new Error('That country URL is already in use')
  }
  await saveCountryDraft(data.content, data.status)
  return { ok: true }
})

export const discardCountryPageDraft = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => {
  const slug = stringValue(objectValue(data).slug, 80).toLowerCase()
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Invalid country slug')
  return { slug }
}).handler(async ({ data, context }) => {
  if (context.role !== 'super_admin') throw new Error('Only a super admin can manage country pages')
  await discardCountryDraft(data.slug)
  return { ok: true }
})

export const resetCountryPage = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => {
  const slug = stringValue(objectValue(data).slug, 80).toLowerCase()
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Invalid country slug')
  return { slug }
}).handler(async ({ data, context }) => {
  if (context.role !== 'super_admin') throw new Error('Only a super admin can manage country pages')
  await revertCountryToDefault(data.slug)
  return { ok: true }
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
  invalidatePublicContentCache()
  return { ok: true }
})

export const deletePost = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => ({ id: numberValue((data as Record<string, unknown>)?.id) })).handler(async ({ data, context }) => {
  assertCapability(context.role, 'content')
  await execute('DELETE FROM content_posts WHERE id = ?', [data.id])
  invalidatePublicContentCache()
  return { ok: true }
})

export const saveStory = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => {
  const input = (data ?? {}) as Record<string, unknown>
  const kind = stringValue(input.kind, 20) as AdminStory['kind']
  if (kind !== 'approval' && kind !== 'testimonial') throw new Error('Choose a story type')
  const name = stringValue(input.name, 160)
  if (!name) throw new Error('Name is required')
  const mediaType = kind === 'approval' ? stringValue(input.mediaType, 10) as AdminStory['mediaType'] : 'none'
  if (!['none', 'photo', 'video'].includes(mediaType)) throw new Error('Choose a valid approval media type')
  const photoBase64 = typeof input.photoBase64 === 'string' ? input.photoBase64 : ''
  if (photoBase64.length > 2_200_000 || (photoBase64 && !/^[A-Za-z0-9+/]+={0,2}$/.test(photoBase64))) throw new Error('Choose a smaller student photo')
  const photoMimeType = stringValue(input.photoMimeType, 40)
  const videoUrl = stringValue(input.videoUrl, 500)
  const mediaAlt = stringValue(input.mediaAlt, 500)
  const mediaConsent = Boolean(input.mediaConsent)
  const published = Boolean(input.published)
  if (mediaType === 'photo' && !mediaAlt) throw new Error('Add a photo description for accessibility')
  if (mediaType === 'video' && !getSupportedVideoEmbedUrl(videoUrl)) throw new Error('Use a valid HTTPS YouTube or Vimeo link')
  if (photoBase64 && (mediaType !== 'photo' || photoMimeType !== 'image/webp')) throw new Error('Select a photo in JPG, PNG or WebP format')
  if (published && mediaType !== 'none' && !mediaConsent) throw new Error('Confirm the student agreed to publish this media')
  return {
    id: numberValue(input.id),
    kind,
    name,
    city: stringValue(input.city, 120),
    country: stringValue(input.country, 120),
    visa: stringValue(input.visa, 160),
    quote: stringValue(input.quote, 10000),
    rating: Math.max(1, Math.min(5, numberValue(input.rating, 5))),
    initials: stringValue(input.initials, 10),
    flag: stringValue(input.flag, 10),
    date: stringValue(input.date, 10) || new Date().toISOString().slice(0, 10),
    note: stringValue(input.note, 220),
    mediaType,
    photoBase64,
    photoMimeType,
    videoUrl,
    mediaAlt,
    mediaConsent,
    homepageFeatured: input.homepageFeatured === undefined ? true : Boolean(input.homepageFeatured),
    published,
  }
}).handler(async ({ data, context }) => {
  assertCapability(context.role, 'content')
  let photo: Buffer | null = null
  if (data.photoBase64) {
    photo = Buffer.from(data.photoBase64, 'base64')
    if (!photo.length || photo.length > 1.5 * 1024 * 1024) throw new Error('Choose a smaller student photo (maximum 1.5 MB after compression)')
    const webp = photo.toString('ascii', 0, 4) === 'RIFF' && photo.toString('ascii', 8, 12) === 'WEBP'
    if (!webp) throw new Error('The selected photo is not a valid WebP image')
  }

  let existingHasPhoto = false
  if (data.id && data.mediaType === 'photo' && !photo) {
    const existingRows = await queryRows('SELECT photo_data IS NOT NULL AS has_photo FROM success_stories WHERE id = ? LIMIT 1', [data.id])
    existingHasPhoto = Boolean(existingRows[0]?.has_photo)
    if (!existingHasPhoto) throw new Error('Choose a student photo before saving this approval')
  }

  const mediaType = data.kind === 'approval' ? data.mediaType : 'none'
  const mediaConsent = mediaType !== 'none' && data.mediaConsent ? 1 : 0
  const base = [data.kind, data.name, data.city, data.country, data.visa, data.quote, data.rating, data.initials, data.flag, data.date, data.note, data.homepageFeatured ? 1 : 0, data.published ? 1 : 0]
  if (data.id) {
    if (mediaType === 'photo' && photo) {
      await execute(
        'UPDATE success_stories SET kind = ?, name = ?, city = ?, country = ?, visa = ?, quote = ?, rating = ?, initials = ?, flag = ?, story_date = ?, note = ?, homepage_featured = ?, published = ?, photo_mime_type = ?, photo_data = ?, video_url = NULL, media_alt = ?, media_consent = ?, media_version = ? WHERE id = ?',
        [...base, data.photoMimeType, photo, data.mediaAlt, mediaConsent, Date.now(), data.id],
      )
    } else if (mediaType === 'photo') {
      await execute(
        'UPDATE success_stories SET kind = ?, name = ?, city = ?, country = ?, visa = ?, quote = ?, rating = ?, initials = ?, flag = ?, story_date = ?, note = ?, homepage_featured = ?, published = ?, video_url = NULL, media_alt = ?, media_consent = ?, media_version = ? WHERE id = ?',
        [...base, data.mediaAlt, mediaConsent, Date.now(), data.id],
      )
    } else if (mediaType === 'video') {
      await execute(
        'UPDATE success_stories SET kind = ?, name = ?, city = ?, country = ?, visa = ?, quote = ?, rating = ?, initials = ?, flag = ?, story_date = ?, note = ?, homepage_featured = ?, published = ?, photo_mime_type = NULL, photo_data = NULL, video_url = ?, media_alt = ?, media_consent = ?, media_version = ? WHERE id = ?',
        [...base, data.videoUrl, '', mediaConsent, Date.now(), data.id],
      )
    } else {
      await execute(
        'UPDATE success_stories SET kind = ?, name = ?, city = ?, country = ?, visa = ?, quote = ?, rating = ?, initials = ?, flag = ?, story_date = ?, note = ?, homepage_featured = ?, published = ?, photo_mime_type = NULL, photo_data = NULL, video_url = NULL, media_alt = ?, media_consent = ?, media_version = ? WHERE id = ?',
        [...base, '', 0, Date.now(), data.id],
      )
    }
  } else {
    const photoMimeType = mediaType === 'photo' ? data.photoMimeType : null
    const photoData = mediaType === 'photo' ? photo : null
    if (mediaType === 'photo' && !photoData) throw new Error('Choose a student photo before saving this approval')
    const videoUrl = mediaType === 'video' ? data.videoUrl : null
    const mediaAlt = mediaType === 'photo' ? data.mediaAlt : ''
    await execute(
      'INSERT INTO success_stories (kind, name, city, country, visa, quote, rating, initials, flag, story_date, note, photo_mime_type, photo_data, video_url, media_alt, media_consent, media_version, homepage_featured, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [data.kind, data.name, data.city, data.country, data.visa, data.quote, data.rating, data.initials, data.flag, data.date, data.note, photoMimeType, photoData, videoUrl, mediaAlt, mediaConsent, photoData ? Date.now() : 0, data.homepageFeatured ? 1 : 0, data.published ? 1 : 0],
    )
  }
  invalidatePublicContentCache()
  return { ok: true }
})

export const deleteStory = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => ({ id: numberValue((data as Record<string, unknown>)?.id) })).handler(async ({ data, context }) => {
  assertCapability(context.role, 'content')
  await execute('DELETE FROM success_stories WHERE id = ?', [data.id])
  invalidatePublicContentCache()
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
  invalidateCoachingCache()
  return { ok: true }
})

export const deleteBatch = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => ({ id: numberValue((data as Record<string, unknown>)?.id) })).handler(async ({ data, context }) => {
  assertCapability(context.role, 'content')
  await execute('DELETE FROM coaching_batches WHERE id = ?', [data.id])
  invalidateCoachingCache()
  return { ok: true }
})

const certificateInput = (data: unknown) => {
  const input = (data ?? {}) as Record<string, unknown>
  const id = numberValue(input.id)
  const title = stringValue(input.title, 220)
  const issuer = stringValue(input.issuer, 180)
  const category = stringValue(input.category, 100)
  const credentialDate = stringValue(input.credentialDate, 80)
  const altText = stringValue(input.altText, 500)
  const rawImageBase64 = typeof input.imageBase64 === 'string' ? input.imageBase64 : ''
  if (rawImageBase64.length > 4_200_000) throw new Error('Choose a smaller image (maximum 3 MB after compression)')
  const imageBase64 = stringValue(rawImageBase64, 4_200_000)
  const imageMimeType = stringValue(input.imageMimeType, 40)
  const published = Boolean(input.published)
  const homepageFeatured = Boolean(input.homepageFeatured)
  const sortOrder = Math.max(0, Math.min(9999, numberValue(input.sortOrder)))
  if (id < 0 || !title || !category || !altText) throw new Error('Title, category and image description are required')
  if (!id && !imageBase64) throw new Error('Choose a certificate photo before saving')
  if (imageBase64 && (!/^[A-Za-z0-9+/]+={0,2}$/.test(imageBase64) || imageBase64.length > 4_200_000)) throw new Error('Choose a smaller image (maximum 3 MB after compression)')
  if (imageBase64 && !['image/webp', 'image/jpeg', 'image/png'].includes(imageMimeType)) throw new Error('Use a WebP, JPEG or PNG image')
  return { id, title, issuer, category, credentialDate, altText, imageBase64, imageMimeType, published, homepageFeatured, sortOrder }
}

export const saveCertificate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(certificateInput)
  .handler(async ({ data, context }) => {
    assertCapability(context.role, 'content')
    let image: Buffer | null = null
    if (data.imageBase64) {
      image = Buffer.from(data.imageBase64, 'base64')
      if (!image.length || image.length > 3 * 1024 * 1024) throw new Error('Choose a smaller image (maximum 3 MB after compression)')
      const webp = image.toString('ascii', 0, 4) === 'RIFF' && image.toString('ascii', 8, 12) === 'WEBP'
      const png = image.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      const jpeg = image[0] === 255 && image[1] === 216 && image[2] === 255
      if ((data.imageMimeType === 'image/webp' && !webp) || (data.imageMimeType === 'image/png' && !png) || (data.imageMimeType === 'image/jpeg' && !jpeg)) throw new Error('The selected file is not a valid image')
    }
    if (data.id) {
      if (image) {
        await execute(
          'UPDATE certificate_items SET title = ?, issuer = ?, category = ?, credential_date = ?, alt_text = ?, image_path = NULL, image_mime_type = ?, image_data = ?, image_version = ?, homepage_featured = ?, published = ?, sort_order = ? WHERE id = ? AND collection = \'certificates\'',
          [data.title, data.issuer, data.category, data.credentialDate, data.altText, data.imageMimeType, image, Date.now(), data.homepageFeatured ? 1 : 0, data.published ? 1 : 0, data.sortOrder, data.id],
        )
      } else {
        await execute(
          'UPDATE certificate_items SET title = ?, issuer = ?, category = ?, credential_date = ?, alt_text = ?, homepage_featured = ?, published = ?, sort_order = ? WHERE id = ? AND collection = \'certificates\'',
          [data.title, data.issuer, data.category, data.credentialDate, data.altText, data.homepageFeatured ? 1 : 0, data.published ? 1 : 0, data.sortOrder, data.id],
        )
      }
    } else {
      await execute(
        'INSERT INTO certificate_items (collection, title, issuer, category, credential_date, alt_text, image_mime_type, image_data, image_version, homepage_featured, published, sort_order) VALUES (\'certificates\', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [data.title, data.issuer, data.category, data.credentialDate, data.altText, data.imageMimeType, image, image ? Date.now() : 0, data.homepageFeatured ? 1 : 0, data.published ? 1 : 0, data.sortOrder],
      )
    }
    invalidatePublicContentCache()
    return { ok: true }
  })

export const deleteCertificate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator((data: unknown) => ({ id: numberValue((data as Record<string, unknown>)?.id) }))
  .handler(async ({ data, context }) => {
    assertCapability(context.role, 'content')
    await execute('DELETE FROM certificate_items WHERE id = ? AND collection = \'certificates\'', [data.id])
    invalidatePublicContentCache()
    return { ok: true }
  })


export const updateSettings = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => {
  const input = (data ?? {}) as Record<string, unknown>
  const phones = Array.isArray(input.phones) ? input.phones.map((item) => stringValue(item, 24)).filter(Boolean).slice(0, 3) : []
  const emails = Array.isArray(input.emails) ? input.emails.map((item) => stringValue(item, 190).toLowerCase()).filter(Boolean).slice(0, 3) : []
  const officeHours = stringValue(input.officeHours, 120)
  const faqs = asFaqList(input.faqs).map((item) => ({ q: stringValue(item.q, 220), a: stringValue(item.a, 1200) })).filter((item) => item.q && item.a).slice(0, 20)
  const trustStats = asTrustStatList(input.trustStats).map((item) => ({ value: stringValue(item.value, 40), label: stringValue(item.label, 80) })).filter((item) => item.value && item.label).slice(0, 6)
  if (!phones.length || phones.some((phone) => !/^[0-9+() -]{7,24}$/.test(phone))) throw new Error('Add at least one valid phone number.')
  if (!emails.length || emails.some((email) => !/^\S+@\S+\.\S+$/.test(email))) throw new Error('Add at least one valid email address.')
  if (!officeHours) throw new Error('Office hours cannot be empty.')
  if (!faqs.length || !trustStats.length) throw new Error('Keep at least one FAQ and one homepage trust statistic.')
  const publicSettings = { phones, emails, officeHours, faqs, trustStats }
  return { popupEnabled: Boolean(input.popupEnabled), popupDelaySeconds: Math.min(60, Math.max(3, numberValue(input.popupDelaySeconds, 8))), whatsappEnabled: Boolean(input.whatsappEnabled), approvalsMarqueeEnabled: Boolean(input.approvalsMarqueeEnabled), publicSettingsJson: JSON.stringify(publicSettings) }
}).handler(async ({ data, context }) => {
  assertCapability(context.role, 'settings')
  await execute('UPDATE site_settings SET popup_enabled = ?, popup_delay_seconds = ?, whatsapp_enabled = ?, approvals_marquee_enabled = ?, public_settings_json = ? WHERE id = 1', [data.popupEnabled ? 1 : 0, data.popupDelaySeconds, data.whatsappEnabled ? 1 : 0, data.approvalsMarqueeEnabled ? 1 : 0, data.publicSettingsJson])
  invalidatePublicContentCache()
  return { ok: true }
})

export const saveContactDetails = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => {
  const input = (data ?? {}) as Record<string, unknown>
  const phones = Array.isArray(input.phones) ? input.phones.map((item) => stringValue(item, 24)).filter(Boolean).slice(0, 3) : []
  const emails = Array.isArray(input.emails) ? input.emails.map((item) => stringValue(item, 190).toLowerCase()).filter(Boolean).slice(0, 3) : []
  const officeHours = stringValue(input.officeHours, 120)
  if (!phones.length || phones.some((phone) => !/^[0-9+() -]{7,24}$/.test(phone))) throw new Error('Add at least one valid phone number.')
  if (!emails.length || emails.some((email) => !/^\S+@\S+\.\S+$/.test(email))) throw new Error('Add at least one valid email address.')
  if (!officeHours) throw new Error('Office hours cannot be empty.')
  return { phones, emails, officeHours }
}).handler(async ({ data, context }) => {
  assertCapability(context.role, 'settings')
  const rows = await queryRows('SELECT public_settings_json FROM site_settings WHERE id = 1 LIMIT 1')
  const current = readSiteSettings(rows[0])
  const publicSettings = { phones: data.phones, emails: data.emails, officeHours: data.officeHours, faqs: current.faqs, trustStats: current.trustStats }
  await execute('UPDATE site_settings SET public_settings_json = ? WHERE id = 1', [JSON.stringify(publicSettings)])
  invalidatePublicContentCache()
  return { phones: data.phones, emails: data.emails, officeHours: data.officeHours }
})

export const saveTrustStat = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => {
  const input = (data ?? {}) as Record<string, unknown>
  const action = stringValue(input.action, 12)
  const index = numberValue(input.index, -1)
  if (!['save', 'remove'].includes(action) || !Number.isInteger(index) || index < 0 || index > 5) throw new Error('Invalid trust number action.')
  const statInput = (input.trustStat ?? {}) as Record<string, unknown>
  const trustStat = { value: stringValue(statInput.value, 40), label: stringValue(statInput.label, 80) }
  if (action === 'save' && (!trustStat.value || !trustStat.label)) throw new Error('Enter both a trust number and its label before saving.')
  return { action: action as 'save' | 'remove', index, trustStat }
}).handler(async ({ data, context }) => {
  assertCapability(context.role, 'settings')
  const rows = await queryRows('SELECT public_settings_json FROM site_settings WHERE id = 1 LIMIT 1')
  const current = readSiteSettings(rows[0])
  const trustStats = [...current.trustStats]
  if (data.action === 'save') {
    if (data.index > trustStats.length) throw new Error('The trust numbers changed. Reload settings and try again.')
    if (data.index === trustStats.length) {
      if (trustStats.length >= 6) throw new Error('You can show up to six homepage trust numbers.')
      trustStats.push(data.trustStat)
    } else {
      trustStats[data.index] = data.trustStat
    }
  } else {
    if (data.index >= trustStats.length) throw new Error('This trust number is no longer available. Reload settings and try again.')
    if (trustStats.length <= 1) throw new Error('Keep at least one homepage trust number.')
    trustStats.splice(data.index, 1)
  }
  const publicSettings = { phones: current.phones, emails: current.emails, officeHours: current.officeHours, faqs: current.faqs, trustStats }
  await execute('UPDATE site_settings SET public_settings_json = ? WHERE id = 1', [JSON.stringify(publicSettings)])
  invalidatePublicContentCache()
  return { trustStats }
})

export const saveFaq = createServerFn({ method: 'POST' }).middleware([adminMiddleware]).validator((data: unknown) => {
  const input = (data ?? {}) as Record<string, unknown>
  const action = stringValue(input.action, 12)
  const index = numberValue(input.index, -1)
  if (!['save', 'remove'].includes(action) || !Number.isInteger(index) || index < 0 || index > 19) throw new Error('Invalid FAQ action.')
  const faqInput = (input.faq ?? {}) as Record<string, unknown>
  const faq = { q: stringValue(faqInput.q, 220), a: stringValue(faqInput.a, 1200) }
  if (action === 'save' && (!faq.q || !faq.a)) throw new Error('Enter both a question and an answer before saving.')
  return { action: action as 'save' | 'remove', index, faq }
}).handler(async ({ data, context }) => {
  assertCapability(context.role, 'settings')
  const rows = await queryRows('SELECT public_settings_json FROM site_settings WHERE id = 1 LIMIT 1')
  const current = readSiteSettings(rows[0])
  const faqs = [...current.faqs]
  if (data.action === 'save') {
    if (data.index > faqs.length) throw new Error('This FAQ list changed. Reload the settings and try again.')
    if (data.index === faqs.length) faqs.push(data.faq)
    else faqs[data.index] = data.faq
  } else {
    if (data.index >= faqs.length) throw new Error('This FAQ is no longer available. Reload the settings and try again.')
    if (faqs.length <= 1) throw new Error('Keep at least one homepage FAQ.')
    faqs.splice(data.index, 1)
  }
  const publicSettings = { phones: current.phones, emails: current.emails, officeHours: current.officeHours, faqs, trustStats: current.trustStats }
  await execute('UPDATE site_settings SET public_settings_json = ? WHERE id = 1', [JSON.stringify(publicSettings)])
  invalidatePublicContentCache()
  return { faqs }
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
  if (typeof raw !== 'string' || !raw.trim()) return defaultCashflowData.map((country) => applyScheduledCashflowPolicy(country))
  try {
    const parsed = JSON.parse(raw) as unknown
    return (Array.isArray(parsed) && parsed.length > 0 ? mergeNewCashflowDestinations(parsed as CountryCashflow[]) : defaultCashflowData).map((country) => applyScheduledCashflowPolicy(country))
  } catch {
    return defaultCashflowData.map((country) => applyScheduledCashflowPolicy(country))
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
