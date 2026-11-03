import '@tanstack/react-start/server-only'

import { createHash } from 'node:crypto'
import { defaultPolicyWatchState, policyWatchItems, type PolicyNotice, type PolicySourceReview, type PolicyWatchState } from '@/data/policy-watch'
import { execute, queryRows } from './db.server'

function parseWatchState(value: unknown): PolicyWatchState {
  let parsed = value
  if (typeof parsed === 'string') {
    try { parsed = JSON.parse(parsed) as unknown } catch { parsed = null }
  }
  if (!parsed || typeof parsed !== 'object') return defaultPolicyWatchState()
  const input = parsed as Record<string, unknown>
  return {
    notices: Array.isArray(input.notices) ? input.notices as PolicyNotice[] : defaultPolicyWatchState().notices,
    reviews: input.reviews && typeof input.reviews === 'object' ? input.reviews as Record<string, PolicySourceReview> : {},
  }
}

export async function readPolicyWatchState(): Promise<PolicyWatchState> {
  const rows = await queryRows('SELECT policy_watch_json FROM site_settings WHERE id = 1 LIMIT 1')
  return parseWatchState(rows[0]?.policy_watch_json)
}

export async function writePolicyWatchState(state: PolicyWatchState) {
  await execute('UPDATE site_settings SET policy_watch_json = ? WHERE id = 1', [JSON.stringify(state)])
}

function destinationSlug(destination: string) {
  const slugs: Record<string, string> = {
    'Canada': 'canada',
    'United Kingdom': 'uk',
    'Australia': 'australia',
    'United States': 'usa',
    'New Zealand': 'new-zealand',
    'Germany': 'germany',
    'Europe / Schengen': 'europe',
  }
  return slugs[destination] ?? 'all'
}

export function isTrustedPolicySourceUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && isTrustedOfficialHost(url.hostname)
  } catch {
    return false
  }
}

function isTrustedOfficialHost(hostname: string) {
  const allowed = [
    'gov.uk',
    'canada.ca',
    'immigration.govt.nz',
    'homeaffairs.gov.au',
    'state.gov',
    'dhs.gov',
    'make-it-in-germany.com',
    'auswaertiges-amt.de',
    'europa.eu',
  ]
  return allowed.some((domain) => hostname === domain || hostname.endsWith('.' + domain))
}

function normalizedPageText(html: string) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 400_000)
}

export async function scanOfficialPolicySources() {
  const state = await readPolicyWatchState()
  const checkedAt = new Date().toISOString()
  const results = await Promise.all(policyWatchItems.map(async (item) => {
    try {
      const url = new URL(item.sourceUrl)
      if (url.protocol !== 'https:' || !isTrustedOfficialHost(url.hostname)) {
        return { id: item.id, status: 'skipped' as const }
      }
      const response = await fetch(url, {
        headers: { accept: 'text/html,application/xhtml+xml' },
        signal: AbortSignal.timeout(6_000),
      })
      if (!response.ok) return { id: item.id, status: 'unavailable' as const, detail: String(response.status) }
      const text = normalizedPageText(await response.text())
      if (!text) return { id: item.id, status: 'unavailable' as const, detail: 'Empty page' }
      const sourceHash = createHash('sha256').update(text).digest('hex')
      const previous = state.reviews[item.id] ?? {}
      let status: 'baselined' | 'unchanged' | 'changed' | 'already-pending' = 'unchanged'
      if (!previous.sourceHash) {
        status = 'baselined'
      } else if (previous.sourceHash !== sourceHash && !previous.sourceChangePending) {
        status = 'changed'
        const noticeId = 'source-change-' + item.id + '-' + sourceHash.slice(0, 12)
        state.notices.unshift({
          id: noticeId,
          countrySlug: destinationSlug(item.destination),
          title: item.destination + ': official immigration source changed',
          message: 'The monitored government page changed since the previous scan. This automatic alert does not identify a new rule or verify what changed. Compare the source, update the relevant guidance if needed, then mark the review complete.',
          showFrom: '',
          expiresOn: '',
          sourceLabel: item.sourceLabel,
          sourceUrl: item.sourceUrl,
          status: 'draft',
          sourceVerified: false,
          sourceItemId: item.id,
        })
        state.reviews[item.id] = {
          ...previous,
          sourceHash,
          sourceCheckedAt: checkedAt,
          sourceChangePending: true,
          pendingDraftId: noticeId,
        }
      } else if (previous.sourceHash !== sourceHash && previous.sourceChangePending) {
        status = 'already-pending'
        state.reviews[item.id] = { ...previous, sourceHash, sourceCheckedAt: checkedAt }
      } else {
        state.reviews[item.id] = { ...previous, sourceCheckedAt: checkedAt }
      }
      if (status === 'baselined') state.reviews[item.id] = { ...previous, sourceHash, sourceCheckedAt: checkedAt }
      return { id: item.id, status }
    } catch (error) {
      return { id: item.id, status: 'unavailable' as const, detail: error instanceof Error ? error.message.slice(0, 120) : 'Request failed' }
    }
  }))
  await writePolicyWatchState(state)
  return {
    checkedAt,
    checked: results.filter((item) => item.status !== 'unavailable' && item.status !== 'skipped').length,
    changed: results.filter((item) => item.status === 'changed').length,
    baselined: results.filter((item) => item.status === 'baselined').length,
    unavailable: results.filter((item) => item.status === 'unavailable' || item.status === 'skipped'),
  }
}
