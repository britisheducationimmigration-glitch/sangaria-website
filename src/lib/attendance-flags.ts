import type { AttendanceLogRecord } from './content-types'

/** Location evidence only: approval and payroll flags are not GPS/VPN warnings. */
export function isAttendanceLocationFlag(flag: string) {
  return /^(LOW_OR_MOCK_ACCURACY$|FOREIGN_IP_|VPN_OR_IP_MISMATCH_|OUT_OF_OFFICE_)/.test(flag)
}

export function attendanceFlagLabel(flag: string) {
  if (flag === 'ADMIN_REVIEW_APPROVED') return 'Reviewed by admin'
  if (flag === 'HALF_DAY_OUT') return 'Half-day checkout'
  if (flag === 'LOW_OR_MOCK_ACCURACY') return 'Unusually precise GPS reading; verify location'
  if (flag === 'AUTO_CHECKOUT_10PM') return 'Automatic checkout; review required'
  if (flag.includes('MISSING_OUT')) return 'Missing checkout; review required'
  if (flag === 'INSUFFICIENT_HOURS_REVIEW_REQUIRED') return 'Short shift; review required'
  if (flag.startsWith('FOREIGN_IP_')) return 'Network country: ' + flag.slice('FOREIGN_IP_'.length)
  if (flag.startsWith('VPN_OR_IP_MISMATCH_')) return 'GPS/network location mismatch (' + flag.slice('VPN_OR_IP_MISMATCH_'.length).toLowerCase() + '); verify network'
  if (flag.startsWith('OUT_OF_OFFICE_')) return 'Outside office radius (' + flag.slice('OUT_OF_OFFICE_'.length).toLowerCase() + ')'
  return flag.replaceAll('_', ' ')
}

export function attendanceNeedsReview(log: Pick<AttendanceLogRecord, 'status' | 'workDate' | 'checkInAt' | 'checkOutAt' | 'inFlags' | 'outFlags'>, today: string) {
  if (log.status === 'Review Required' || (log.checkInAt && !log.checkOutAt && log.workDate < today)) return true
  const flags = [...log.inFlags, ...log.outFlags]
  if (flags.some(isAttendanceLocationFlag)) return true
  return !log.outFlags.includes('ADMIN_REVIEW_APPROVED') && flags.some(flag => /MISSING|AUTO_CHECKOUT|REVIEW_REQUIRED/.test(flag))
}
