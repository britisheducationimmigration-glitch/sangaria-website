export type BatchDateStatus = 'upcoming' | 'expired' | 'needs-date'

export function isValidBatchStartDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}

function todayInIndia(now: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  const part = (type: 'year' | 'month' | 'day') => parts.find((item) => item.type === type)?.value ?? ''
  return `${part('year')}-${part('month')}-${part('day')}`
}

export function getBatchDateStatus(starts: string, now = new Date()): BatchDateStatus {
  if (!isValidBatchStartDate(starts)) return 'needs-date'
  return starts < todayInIndia(now) ? 'expired' : 'upcoming'
}

export function isBatchExpired(starts: string, now = new Date()): boolean {
  return getBatchDateStatus(starts, now) === 'expired'
}

export function formatBatchStartDate(starts: string): string {
  if (!isValidBatchStartDate(starts)) return starts.trim() || 'Date to be confirmed'
  const [year, month, day] = starts.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}
