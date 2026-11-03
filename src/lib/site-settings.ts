import { faqs as fixtureFaqs } from '@/data/fixtures'
import { site } from '@/data/site'
import type { SiteFaq, SiteSettings, SiteTrustStat } from '@/lib/content-types'

export type PublicSiteSettings = Pick<SiteSettings, 'phones' | 'emails' | 'officeHours' | 'faqs' | 'trustStats'>

export const defaultSiteSettings: SiteSettings = {
  popupEnabled: true,
  popupDelaySeconds: 8,
  whatsappEnabled: true,
  approvalsMarqueeEnabled: true,
  phones: [...site.phones],
  emails: [...site.emails],
  officeHours: site.hours,
  faqs: fixtureFaqs.map((item) => ({ q: item.q, a: item.a })),
  trustStats: [
    { value: '2,500+', label: 'Visas approved' },
    { value: '98%', label: 'Success ratio' },
    { value: 'Multiple', label: 'Study destinations' },
    { value: '7.0', label: 'Avg. IELTS band' },
  ],
}

function cleanStrings(value: unknown, maxCount: number, maxLength: number) {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim().slice(0, maxLength))
    .filter(Boolean)
    .slice(0, maxCount)
}

function normalizeTrustStat(stat: SiteTrustStat): SiteTrustStat {
  const label = stat.label.trim().toLowerCase()
  if (label === 'reported visa approvals') return { ...stat, label: 'Visas approved' }
  if (label === 'reported success ratio') return { ...stat, label: 'Success ratio' }
  if (label === 'destinations' && stat.value.trim() === '7') return { ...stat, value: 'Multiple', label: 'Study destinations' }
  if (label === 'reported ielts avg.') return { ...stat, label: 'Avg. IELTS band' }
  return stat
}

export function mapPublicSiteSettings(raw: unknown): PublicSiteSettings {
  let parsed = raw
  if (typeof parsed === 'string') {
    try { parsed = JSON.parse(parsed) as unknown } catch { parsed = null }
  }
  const input = parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : {}
  const phones = cleanStrings(input.phones, 3, 24)
  const emails = cleanStrings(input.emails, 3, 190)
  const hours = typeof input.officeHours === 'string' ? input.officeHours.trim().slice(0, 120) : ''
  const faqs = Array.isArray(input.faqs)
    ? input.faqs
        .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
        .map((item) => ({ q: typeof item.q === 'string' ? item.q.trim().slice(0, 220) : '', a: typeof item.a === 'string' ? item.a.trim().slice(0, 1200) : '' }))
        .filter((item) => item.q && item.a)
        .slice(0, 20)
    : []
  const trustStats = Array.isArray(input.trustStats)
    ? input.trustStats
        .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
        .map((item) => ({ value: typeof item.value === 'string' ? item.value.trim().slice(0, 40) : '', label: typeof item.label === 'string' ? item.label.trim().slice(0, 80) : '' }))
        .filter((item) => item.value && item.label)
        .slice(0, 6)
        .map(normalizeTrustStat)
    : []
  return {
    phones: phones.length ? phones : defaultSiteSettings.phones,
    emails: emails.length ? emails : defaultSiteSettings.emails,
    officeHours: hours || defaultSiteSettings.officeHours,
    faqs: faqs.length ? faqs : defaultSiteSettings.faqs,
    trustStats: trustStats.length ? trustStats : defaultSiteSettings.trustStats,
  }
}

export function readSiteSettings(row?: Record<string, unknown>): SiteSettings {
  const publicSettings = mapPublicSiteSettings(row?.public_settings_json)
  return {
    ...publicSettings,
    popupEnabled: row ? Boolean(row.popup_enabled) : defaultSiteSettings.popupEnabled,
    popupDelaySeconds: row ? Math.min(60, Math.max(3, Number(row.popup_delay_seconds) || 8)) : defaultSiteSettings.popupDelaySeconds,
    whatsappEnabled: row ? Boolean(row.whatsapp_enabled) : defaultSiteSettings.whatsappEnabled,
    approvalsMarqueeEnabled: row ? Boolean(row.approvals_marquee_enabled) : defaultSiteSettings.approvalsMarqueeEnabled,
  }
}

export function asFaqList(value: unknown): SiteFaq[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is SiteFaq => !!item && typeof item === 'object' && typeof (item as SiteFaq).q === 'string' && typeof (item as SiteFaq).a === 'string')
}

export function asTrustStatList(value: unknown): SiteTrustStat[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is SiteTrustStat => !!item && typeof item === 'object' && typeof (item as SiteTrustStat).value === 'string' && typeof (item as SiteTrustStat).label === 'string')
}
