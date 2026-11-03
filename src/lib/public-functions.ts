import { createServerFn } from '@tanstack/react-start'
import { execute, jsonArray, queryRows } from './db.server'
import type { PublicContent, PublicCoachingContent, PublicCertificate } from './content-types'
import { getSupportedVideoEmbedUrl } from './video'
import { defaultCertificates } from '@/data/certificates'
import { readSiteSettings } from './site-settings'
import { approvals as fixtureApprovals, coachingSchedule as fixtureCoachingSchedule, posts as fixturePosts, testimonials as fixtureTestimonials } from '@/data/fixtures'
import { defaultCashflowData, mergeNewCashflowDestinations, type CountryCashflow } from '@/data/cashflow'
import { isBatchExpired } from '@/lib/batch-dates'

let publicContentCache: { expiresAt: number; data: PublicContent } | null = null

export function invalidatePublicContentCache() {
  publicContentCache = null
}

function stringValue(value: unknown, max = 5000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function validateEnquiry(data: unknown) {
  const input = (data ?? {}) as Record<string, unknown>
  const result = {
    name: stringValue(input.name, 120),
    phone: stringValue(input.phone, 40),
    email: stringValue(input.email, 190),
    city: stringValue(input.city, 120),
    interest: stringValue(input.interest, 160),
    country: stringValue(input.country, 120),
    message: stringValue(input.message, 5000),
    source: stringValue(input.source, 160),
    summary: stringValue(input.summary, 5000),
  }
  if (result.name.length < 2) throw new Error('Please enter your name')
  if (result.phone.replace(/\D/g, '').length < 10) throw new Error('Please enter a valid phone number')
  if (result.email && !/^\S+@\S+\.\S+$/.test(result.email)) throw new Error('Please enter a valid email')
  return result
}

export const submitEnquiry = createServerFn({ method: 'POST' })
  .validator(validateEnquiry)
  .handler(async ({ data }) => {
    const result = await execute(
      `INSERT INTO enquiries (name, phone, email, city, interest, country, message, source, summary, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'New', '')`,
      [data.name, data.phone, data.email, data.city, data.interest, data.country, data.message, data.source, data.summary],
    )
    return { ok: true, id: Number(result.insertId) }
  })

function dateOnly(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  const text = String(value ?? '')
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10)
  const parsed = new Date(text)
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10)
}

const legacyReviewedPosts: Record<string, { title: string; excerpt: string; body: string[] }> = {
  'canada-study-permit-cap-2027': {
    title: 'Canada study permit cap for 2027: what Rajasthan & Punjab students should know',
    excerpt: 'IRCC has announced its allocation for next year. Here is how the provincial attestation letter (PAL) affects your application.',
    body: [
      'Canada continues to manage the number of new study permits through a national cap and a provincial attestation letter (PAL) requirement for most college and undergraduate programs.',
      'Masters and PhD students at public institutions remain exempt from the PAL requirement, which makes postgraduate programs a strong option for graduates.',
      'Our advice: apply early, keep your funds documentation clean, and choose programs aligned with your previous education. Book a free counselling session to check your profile.',
    ],
  },
  'uk-graduate-route-update': {
    title: 'UK Graduate Route: the latest on post-study work duration',
    excerpt: 'Changes to the Graduate Route mean students should plan their career timeline carefully. We break it down.',
    body: [
      'The UK Graduate Route allows international students to stay and work after their studies. Recent policy updates have adjusted the duration for new applicants.',
      'Students starting in January and May intakes should confirm the rules that apply on their visa application date.',
      'Our counsellors can help you choose universities with strong employability records.',
    ],
  },
}

// Published posts are database-backed; only replace the exact legacy copy so later admin edits remain authoritative.
function applyEditorialReview(post: PublicContent['posts'][number]): PublicContent['posts'][number] {
  const reviewed = fixturePosts.find((candidate) => candidate.slug === post.slug)
  if (!reviewed?.lastReviewed || !reviewed.sources?.length) return post

  const legacy = legacyReviewedPosts[post.slug]
  const isLegacyCopy =
    !!legacy &&
    post.title === legacy.title &&
    post.excerpt === legacy.excerpt &&
    JSON.stringify(post.body) === JSON.stringify(legacy.body)
  const isReviewedCopy =
    post.title === reviewed.title &&
    post.excerpt === reviewed.excerpt &&
    JSON.stringify(post.body) === JSON.stringify(reviewed.body)

  if (!isLegacyCopy && !isReviewedCopy) return post

  if (isLegacyCopy) {
    return {
      ...post,
      title: reviewed.title,
      excerpt: reviewed.excerpt,
      readMins: reviewed.readMins,
      body: reviewed.body,
      lastReviewed: reviewed.lastReviewed,
      sources: reviewed.sources,
    }
  }

  return { ...post, lastReviewed: reviewed.lastReviewed, sources: reviewed.sources }
}

export const getPublicContent = createServerFn({ method: 'GET' }).handler(async (): Promise<PublicContent> => {
  if (publicContentCache && publicContentCache.expiresAt > Date.now()) return publicContentCache.data
  const postRows = await queryRows('SELECT slug, title, category, publish_date, excerpt, read_mins, body_json FROM content_posts WHERE published = 1 ORDER BY publish_date DESC, id DESC')
  const storyRows = await queryRows('SELECT id, kind, name, city, country, visa, quote, rating, initials, flag, story_date, note, photo_data IS NOT NULL AS has_photo, video_url, media_alt, media_version, homepage_featured FROM success_stories WHERE published = 1 ORDER BY story_date DESC, id DESC')
  const settingsRows = await queryRows('SELECT popup_enabled, popup_delay_seconds, whatsapp_enabled, approvals_marquee_enabled, public_settings_json FROM site_settings WHERE id = 1 LIMIT 1')
  const certificateRows = await queryRows('SELECT id, title, issuer, category, credential_date, alt_text, image_path, image_data IS NOT NULL AS has_database_image, image_version, homepage_featured, published, sort_order FROM certificate_items WHERE collection = \'certificates\' AND published = 1 ORDER BY sort_order ASC, id ASC')
  const posts = postRows.length
    ? postRows.map((row) =>
        applyEditorialReview({
          slug: String(row.slug),
          title: String(row.title),
          category: String(row.category) as PublicContent['posts'][number]['category'],
          date: dateOnly(row.publish_date),
          excerpt: String(row.excerpt),
          readMins: Number(row.read_mins),
          body: jsonArray(row.body_json).map(String),
        }),
      )
    : fixturePosts
  const approvals = storyRows.length
    ? storyRows.filter((row) => row.kind === 'approval').map((row) => ({
        name: String(row.name), country: String(row.country), flag: String(row.flag), visa: String(row.visa), date: dateOnly(row.story_date), note: String(row.note ?? '') || undefined,
        photoSrc: Boolean(row.has_photo) ? '/success-stories/media/' + Number(row.id) + '?v=' + Number(row.media_version ?? 0) : undefined,
        videoUrl: getSupportedVideoEmbedUrl(String(row.video_url ?? '')) ? String(row.video_url ?? '') : undefined,
        mediaAlt: String(row.media_alt ?? '') || undefined,
        homepageFeatured: Boolean(row.homepage_featured),
      }))
    : fixtureApprovals
  const testimonials = storyRows.length
    ? storyRows.filter((row) => row.kind === 'testimonial').map((row) => ({
        name: String(row.name), city: String(row.city), country: String(row.country), visa: String(row.visa), quote: String(row.quote), rating: Number(row.rating), initials: String(row.initials), homepageFeatured: Boolean(row.homepage_featured),
      }))
    : fixtureTestimonials
  const certificates: PublicCertificate[] = certificateRows.length
    ? certificateRows.map((row) => {
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
        }
      })
    : settingsRows.length ? [] : defaultCertificates.map((item, index) => ({
        id: index + 1,
        title: item.title,
        issuer: item.issuer,
        category: item.category,
        credentialDate: item.credentialDate,
        altText: item.altText,
        imageSrc: item.imagePath,
        homepageFeatured: item.homepageFeatured,
        published: item.published,
        sortOrder: item.sortOrder,
      }))
  const data = { posts, approvals, testimonials, certificates, settings: readSiteSettings(settingsRows[0]) }
  publicContentCache = { data, expiresAt: Date.now() + 8_000 }
  return data
})

export const getPublicCashflow = createServerFn({ method: 'GET' }).handler(async (): Promise<CountryCashflow[]> => {
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

let coachingCache: { expiresAt: number; data: PublicCoachingContent } | null = null

export function invalidateCoachingCache() {
  coachingCache = null
}

export const getCoachingContent = createServerFn({ method: 'GET' }).handler(async (): Promise<PublicCoachingContent> => {
  if (coachingCache && coachingCache.expiresAt > Date.now()) return coachingCache.data
  const rows = await queryRows('SELECT id, program, batch_name, time_slot, seats, starts, published FROM coaching_batches WHERE published = 1 ORDER BY id ASC')
  const batches = rows.length
    ? rows.map((row) => ({ id: Number(row.id), program: String(row.program), batch: String(row.batch_name), time: String(row.time_slot), seats: Number(row.seats), starts: String(row.starts), published: Boolean(row.published) }))
    : fixtureCoachingSchedule.map((batch, index) => ({ id: index + 1, program: batch.batch.includes('IELTS') ? 'IELTS' : 'PTE', batch: batch.batch, time: batch.time, seats: batch.seats, starts: batch.starts, published: true }))
  const data = { batches: batches.filter((batch) => !isBatchExpired(batch.starts)) }
  coachingCache = { data, expiresAt: Date.now() + 8_000 }
  return data
})
