import '@tanstack/react-start/server-only'

import crypto from 'node:crypto'
import { site } from '@/data/site'
import { execute, getDb, queryRows } from './db.server'
import type {
   AttendanceBreakRecord,
  AttendanceEditHistoryRecord,
  AttendanceLogRecord,
  AttendanceSettings,
  AttendanceStatus,
  EmployeeCycleSummary,
  EmployeeRecord,
} from './content-types'

export const defaultAttendanceSettings: AttendanceSettings = {
  officeName: 'British Education & Immigration, Sangaria',
  officeLat: site.latitude,
  officeLng: site.longitude,
  allowedRadiusM: 250,
  maxAccuracyM: 200,
  blockVpnOrForeignIp: true,
  officeWifiIp: '',
  requireOfficeWifiIp: false,
  requireSelfie: true,
}

let attendanceSchemaPromise: Promise<void> | null = null

async function ensureCol(table: string, column: string, definition: string) {
  const rows = await queryRows(
    'SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ? LIMIT 1',
    [table, column],
  )
  if (rows.length === 0) {
    try {
      await execute(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message.toLowerCase() : ''
      if (!msg.includes('duplicate column')) throw err
    }
  }
}

export async function ensureAttendanceSchema() {
  if (!attendanceSchemaPromise) {
    attendanceSchemaPromise = (async () => {
      const db = await getDb()
      if (!db) throw new Error('Database is not configured')

      await ensureCol('site_settings', 'attendance_settings_json', 'LONGTEXT NULL')

      await execute(`
        CREATE TABLE IF NOT EXISTS employees (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(140) NOT NULL,
          designation VARCHAR(120) NOT NULL DEFAULT '',
          phone VARCHAR(40) NOT NULL DEFAULT '',
          email VARCHAR(190) NOT NULL DEFAULT '',
          access_token VARCHAR(64) NOT NULL UNIQUE,
          pin_hash VARCHAR(255) NOT NULL DEFAULT '',
          bound_device_hash VARCHAR(64) NOT NULL DEFAULT '',
          cycle_start_day TINYINT UNSIGNED NOT NULL DEFAULT 1,
          monthly_salary INT UNSIGNED NOT NULL DEFAULT 0,
          expected_in_time VARCHAR(5) NOT NULL DEFAULT '09:30',
          expected_out_time VARCHAR(5) NOT NULL DEFAULT '19:30',
          office_only BOOLEAN NOT NULL DEFAULT TRUE,
          active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `)
      await ensureCol('employees', 'bound_device_hash', "VARCHAR(64) NOT NULL DEFAULT ''")
      await ensureCol('employees', 'monthly_salary', 'INT UNSIGNED NOT NULL DEFAULT 0')

      await execute(`
        CREATE TABLE IF NOT EXISTS attendance_logs (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          employee_id BIGINT UNSIGNED NOT NULL,
          work_date VARCHAR(10) NOT NULL,
          check_in_at TIMESTAMP NULL,
          check_out_at TIMESTAMP NULL,
          in_lat DOUBLE NULL,
          in_lng DOUBLE NULL,
          in_accuracy_m INT NULL,
          in_distance_m INT NULL,
          in_ip VARCHAR(64) NOT NULL DEFAULT '',
          in_ip_city VARCHAR(120) NOT NULL DEFAULT '',
          in_ip_country VARCHAR(16) NOT NULL DEFAULT '',
          in_flags_json TEXT NULL,
          in_photo_data MEDIUMBLOB NULL,
          out_lat DOUBLE NULL,
          out_lng DOUBLE NULL,
          out_accuracy_m INT NULL,
          out_distance_m INT NULL,
          out_ip VARCHAR(64) NOT NULL DEFAULT '',
          out_ip_city VARCHAR(120) NOT NULL DEFAULT '',
          out_ip_country VARCHAR(16) NOT NULL DEFAULT '',
          out_flags_json TEXT NULL,
          out_photo_data MEDIUMBLOB NULL,
          media_version BIGINT UNSIGNED NOT NULL DEFAULT 0,
          status VARCHAR(24) NOT NULL DEFAULT 'Present',
          work_minutes INT NOT NULL DEFAULT 0,
          is_late BOOLEAN NOT NULL DEFAULT FALSE,
          edited_by VARCHAR(190) NOT NULL DEFAULT '',
          edit_note VARCHAR(500) NOT NULL DEFAULT '',
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY attendance_emp_day_uq (employee_id, work_date),
          INDEX attendance_work_date_idx (work_date)
        )
      `)
      await ensureCol('attendance_logs', 'in_photo_data', 'MEDIUMBLOB NULL')
      await ensureCol('attendance_logs', 'out_photo_data', 'MEDIUMBLOB NULL')
      await ensureCol('attendance_logs', 'media_version', 'BIGINT UNSIGNED NOT NULL DEFAULT 0')
      await ensureCol('attendance_logs', 'breaks_json', 'TEXT NULL')
      await ensureCol('attendance_logs', 'break_minutes', 'INT NOT NULL DEFAULT 0')
      await execute(`
        CREATE TABLE IF NOT EXISTS attendance_edit_history (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          attendance_log_id BIGINT UNSIGNED NOT NULL,
          employee_id BIGINT UNSIGNED NOT NULL,
          work_date VARCHAR(10) NOT NULL,
          editor_name VARCHAR(160) NOT NULL DEFAULT '',
          editor_email VARCHAR(190) NOT NULL DEFAULT '',
          action VARCHAR(16) NOT NULL DEFAULT 'edit',
          changes_summary VARCHAR(600) NOT NULL DEFAULT '',
          reason VARCHAR(500) NOT NULL DEFAULT '',
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          INDEX attendance_history_log_idx (attendance_log_id, created_at)
        )
      `)
    })().catch((error) => {
      attendanceSchemaPromise = null
      throw error
    })
  }
  await attendanceSchemaPromise
}

export function generateEmployeeToken(): string {
  return crypto.randomBytes(18).toString('base64url')
}

export function hashDeviceKey(deviceKey: string): string {
  const clean = deviceKey.trim()
  if (!clean) return ''
  const secret = (process.env.SESSION_SECRET ?? 'bei-attendance-device-salt').trim()
  return crypto.createHmac('sha256', secret).update(clean).digest('hex')
}

export function hashEmployeePin(pin: string): string {
  const clean = pin.trim()
  if (!clean) return ''
  const salt = crypto.randomBytes(12).toString('hex')
  const derived = crypto.scryptSync(clean, salt, 32).toString('hex')
  return `${salt}:${derived}`
}

export function verifyEmployeePin(pin: string, stored: string): boolean {
  if (!stored) return true
  if (!pin || !stored.includes(':')) return false
  try {
    const [salt, expectedHex] = stored.split(':')
    if (!salt || !expectedHex) return false
    const actual = crypto.scryptSync(pin.trim(), salt, 32)
    const expected = Buffer.from(expectedHex, 'hex')
    return actual.length === expected.length && crypto.timingSafeEqual(actual, expected)
  } catch {
    return false
  }
}

export function todayIstDate(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  const get = (type: string) => parts.find((item) => item.type === type)?.value ?? ''
  return `${get('year')}-${get('month')}-${get('day')}`
}

export function currentIstMonth(now = new Date()): string {
  return todayIstDate(now).slice(0, 7)
}

export function istTimeHHMM(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '00:00'
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)
  const get = (type: string) => parts.find((item) => item.type === type)?.value ?? '00'
  const hour = get('hour') === '24' ? '00' : get('hour')
  return `${hour}:${get('minute')}`
}

export function getEmployeeCycleRange(selectedMonth: string, cycleStartDay: number) {
  const [yearNum, monthNum] = selectedMonth.split('-').map(Number)
  const year = yearNum || new Date().getUTCFullYear()
  const month = monthNum || new Date().getUTCMonth() + 1
  const safeDay = Math.max(1, Math.min(28, Math.floor(cycleStartDay || 1)))

  if (safeDay === 1) {
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate()
    const mm = String(month).padStart(2, '0')
    return {
      startDate: `${year}-${mm}-01`,
      endDate: `${year}-${mm}-${String(lastDay).padStart(2, '0')}`,
      totalDays: lastDay,
    }
  }

  const startUtc = new Date(Date.UTC(year, month - 1, safeDay))
  const nextMonthStartUtc = new Date(Date.UTC(year, month, safeDay))
  const endUtc = new Date(nextMonthStartUtc.getTime() - 86_400_000)
  const totalDays = Math.round((endUtc.getTime() - startUtc.getTime()) / 86_400_000) + 1
  return {
    startDate: startUtc.toISOString().slice(0, 10),
    endDate: endUtc.toISOString().slice(0, 10),
    totalDays,
  }
}

export function countSundaysInRange(startDate: string, endDate: string): number {
  let count = 0
  let cursor = new Date(`${startDate}T00:00:00Z`).getTime()
  const end = new Date(`${endDate}T00:00:00Z`).getTime()
  while (cursor <= end) {
    if (new Date(cursor).getUTCDay() === 0) count += 1
    cursor += 86_400_000
  }
  return count
}

export function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const R = 6_371_000
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function readClientNetworkInfo(headers: Headers) {
  const rawForwarded = headers.get('x-forwarded-for') ?? ''
  const clientIp = (headers.get('x-real-ip') || rawForwarded.split(',')[0] || '').trim().slice(0, 64)
  const ipCountry = (headers.get('x-vercel-ip-country') || '').trim().toUpperCase().slice(0, 16)
  const rawCity = headers.get('x-vercel-ip-city') || ''
  let ipCity = rawCity
  try {
    ipCity = decodeURIComponent(rawCity)
  } catch {
    ipCity = rawCity
  }
  const ipLat = Number(headers.get('x-vercel-ip-latitude') ?? '')
  const ipLng = Number(headers.get('x-vercel-ip-longitude') ?? '')
  return {
    clientIp,
    ipCountry,
    ipCity: ipCity.trim().slice(0, 120),
    ipLat: Number.isFinite(ipLat) ? ipLat : null,
    ipLng: Number.isFinite(ipLng) ? ipLng : null,
  }
}

export function verifyAttendanceLocation(params: {
  lat: number
  lng: number
  accuracyM: number
  headers: Headers
  settings: AttendanceSettings
  officeOnly: boolean
}) {
  const { lat, lng, accuracyM, headers, settings, officeOnly } = params
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw new Error('Valid GPS location is required to mark attendance.')
  }
  if (Math.abs(lat) < 0.0001 && Math.abs(lng) < 0.0001) {
    throw new Error('Could not read a real GPS coordinate. Turn on device location and retry.')
  }

  const safeAccuracy = Math.max(0, Math.round(Number.isFinite(accuracyM) ? accuracyM : 9999))
  if (safeAccuracy > settings.maxAccuracyM) {
    throw new Error(`GPS accuracy is too weak (${safeAccuracy}m). Enable Precise Location and try again.`)
  }

  const net = readClientNetworkInfo(headers)
  const distanceM = Math.round(haversineMeters(lat, lng, settings.officeLat, settings.officeLng))
  const flags: string[] = []

  if (safeAccuracy <= 1) flags.push('LOW_OR_MOCK_ACCURACY')
  if (net.ipCountry && net.ipCountry !== 'IN') {
    flags.push(`FOREIGN_IP_${net.ipCountry}`)
    if (settings.blockVpnOrForeignIp) {
      throw new Error('VPN or foreign network detected. Turn off VPN and use Indian network.')
    }
  }

  if (net.ipLat !== null && net.ipLng !== null) {
    const ipVsGpsKm = Math.round(haversineMeters(lat, lng, net.ipLat, net.ipLng) / 1000)
    if (ipVsGpsKm > 750) flags.push(`VPN_OR_IP_MISMATCH_${ipVsGpsKm}KM`)
  }

  if (settings.requireOfficeWifiIp && settings.officeWifiIp.trim()) {
    if (!net.clientIp || net.clientIp !== settings.officeWifiIp.trim()) {
      throw new Error('Please connect to the Sangaria Office Wi-Fi to mark attendance.')
    }
  }

  if (distanceM > settings.allowedRadiusM) {
    flags.push(`OUT_OF_OFFICE_${distanceM}M`)
    if (officeOnly) {
      throw new Error(`You are ${distanceM}m away from ${settings.officeName}. Move within ${settings.allowedRadiusM}m.`)
    }
  }

  return {
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
    accuracyM: safeAccuracy,
    distanceM,
    ip: net.clientIp,
    ipCity: net.ipCity,
    ipCountry: net.ipCountry,
    flags,
  }
}
export function parseBreaksJson(value: unknown): AttendanceBreakRecord[] {
  if (Array.isArray(value)) return value as AttendanceBreakRecord[]
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value) as unknown
      return Array.isArray(parsed) ? (parsed as AttendanceBreakRecord[]) : []
    } catch {
      return []
    }
  }
  return []
}

export async function autoCloseOpenCheckIns() {
  await ensureAttendanceSchema()
  const now = new Date()
  const today = todayIstDate(now)
  const nowHHMM = istTimeHHMM(now)
  const pastTenPm = nowHHMM >= '22:00'

  const openRows = await queryRows(
    `SELECT id, work_date, check_in_at, out_flags_json, breaks_json, break_minutes
     FROM attendance_logs
     WHERE check_in_at IS NOT NULL AND check_out_at IS NULL
       AND (work_date < ? OR (? = 1 AND work_date = ?))
     LIMIT 100`,
    [today, pastTenPm ? 1 : 0, today],
  )

  for (const row of openRows) {
    const workDate = String(row.work_date)
    const inDate = new Date(String(row.check_in_at))
    const autoOutTarget = new Date(`${workDate}T22:00:00+05:30`)
    const outDate = autoOutTarget.getTime() > inDate.getTime() ? autoOutTarget : inDate
    const breaks = parseBreaksJson(row.breaks_json)

    for (const br of breaks) {
      if (br.outAt && !br.inAt) {
        br.inAt = outDate.toISOString()
        br.note = br.note ? `${br.note} (Auto-closed 10 PM)` : 'Auto-closed 10 PM'
      }
    }

    const totalBreakMins = breaks.reduce((sum, br) => {
      if (!br.outAt || !br.inAt) return sum
      return sum + Math.max(0, Math.round((new Date(br.inAt).getTime() - new Date(br.outAt).getTime()) / 60_000))
    }, 0)

    const grossMins = Math.max(0, Math.round((outDate.getTime() - inDate.getTime()) / 60_000))
    const netWorkMins = Math.max(0, grossMins - totalBreakMins)
    const status = netWorkMins < 300 ? 'Half Day' : 'Present'
    const outFlags = [...parseFlags(row.out_flags_json), 'AUTO_CHECKOUT_10PM']

    await execute(
      `UPDATE attendance_logs
       SET check_out_at = ?, out_flags_json = ?, breaks_json = ?, break_minutes = ?, work_minutes = ?, status = ?
       WHERE id = ? AND check_out_at IS NULL`,
      [outDate, JSON.stringify(outFlags), JSON.stringify(breaks), totalBreakMins, netWorkMins, status, Number(row.id)],
    )
  }
}
export async function readAttendanceSettings(): Promise<AttendanceSettings> {
  await ensureAttendanceSchema()
  const rows = await queryRows('SELECT attendance_settings_json FROM site_settings WHERE id = 1 LIMIT 1')
  const raw = rows[0]?.attendance_settings_json
  if (typeof raw !== 'string' || !raw.trim()) return defaultAttendanceSettings
  try {
    const parsed = JSON.parse(raw) as Partial<AttendanceSettings>
    return {
      officeName: String(parsed.officeName || defaultAttendanceSettings.officeName).slice(0, 140),
      officeLat: Number.isFinite(Number(parsed.officeLat)) ? Number(parsed.officeLat) : defaultAttendanceSettings.officeLat,
      officeLng: Number.isFinite(Number(parsed.officeLng)) ? Number(parsed.officeLng) : defaultAttendanceSettings.officeLng,
      allowedRadiusM: Math.max(30, Math.min(5000, Number(parsed.allowedRadiusM) || defaultAttendanceSettings.allowedRadiusM)),
      maxAccuracyM: Math.max(20, Math.min(2000, Number(parsed.maxAccuracyM) || defaultAttendanceSettings.maxAccuracyM)),
      blockVpnOrForeignIp: parsed.blockVpnOrForeignIp ?? defaultAttendanceSettings.blockVpnOrForeignIp,
      officeWifiIp: String(parsed.officeWifiIp || '').trim().slice(0, 64),
      requireOfficeWifiIp: Boolean(parsed.requireOfficeWifiIp),
      requireSelfie: parsed.requireSelfie ?? defaultAttendanceSettings.requireSelfie,
    }
  } catch {
    return defaultAttendanceSettings
  }
}

export function mapEmployeeRow(row: Record<string, unknown>): EmployeeRecord {
  return {
    id: Number(row.id),
    name: String(row.name),
    designation: String(row.designation ?? ''),
    phone: String(row.phone ?? ''),
    email: String(row.email ?? ''),
    accessToken: String(row.access_token),
    hasPin: Boolean(String(row.pin_hash ?? '').trim()),
    deviceBound: Boolean(String(row.bound_device_hash ?? '').trim()),
    cycleStartDay: Math.max(1, Math.min(28, Number(row.cycle_start_day ?? 1))),
    monthlySalary: Math.max(0, Number(row.monthly_salary ?? 0)),
    expectedInTime: String(row.expected_in_time || '09:30'),
    expectedOutTime: String(row.expected_out_time || '19:30'),
    officeOnly: Boolean(row.office_only),
    active: Boolean(row.active),
    createdAt: new Date(String(row.created_at)).toISOString(),
  }
}

export function mapEditHistoryRow(row: Record<string, unknown>): AttendanceEditHistoryRecord {
  return {
    id: Number(row.id),
    attendanceLogId: Number(row.attendance_log_id),
    employeeId: Number(row.employee_id),
    workDate: String(row.work_date),
    editorName: String(row.editor_name ?? ''),
    editorEmail: String(row.editor_email ?? ''),
    action: (String(row.action) === 'create' ? 'create' : 'edit'),
    changesSummary: String(row.changes_summary ?? ''),
    reason: String(row.reason ?? ''),
    createdAt: new Date(String(row.created_at)).toISOString(),
  }
}

function parseFlags(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value) as unknown
      return Array.isArray(parsed) ? parsed.map(String) : []
    } catch {
      return []
    }
  }
  return []
}

export function mapAttendanceRow(
  row: Record<string, unknown>,
  editHistory: AttendanceEditHistoryRecord[] = [],
): AttendanceLogRecord {
  const id = Number(row.id)
  const v = Number(row.media_version ?? 0)
  return {
    id,
    employeeId: Number(row.employee_id),
    employeeName: String(row.employee_name ?? ''),
    designation: String(row.designation ?? ''),
    workDate: String(row.work_date),
    checkInAt: row.check_in_at ? new Date(String(row.check_in_at)).toISOString() : '',
    checkOutAt: row.check_out_at ? new Date(String(row.check_out_at)).toISOString() : '',
    inLat: row.in_lat !== null && row.in_lat !== undefined ? Number(row.in_lat) : null,
    inLng: row.in_lng !== null && row.in_lng !== undefined ? Number(row.in_lng) : null,
    inAccuracyM: row.in_accuracy_m !== null && row.in_accuracy_m !== undefined ? Number(row.in_accuracy_m) : null,
    inDistanceM: row.in_distance_m !== null && row.in_distance_m !== undefined ? Number(row.in_distance_m) : null,
    inIp: String(row.in_ip ?? ''),
    inIpCity: String(row.in_ip_city ?? ''),
    inIpCountry: String(row.in_ip_country ?? ''),
    inFlags: parseFlags(row.in_flags_json),
    inPhotoSrc: Boolean(row.has_in_photo) ? `/attendance/photo/${id}?type=in&v=${v}` : '',
    outLat: row.out_lat !== null && row.out_lat !== undefined ? Number(row.out_lat) : null,
    outLng: row.out_lng !== null && row.out_lng !== undefined ? Number(row.out_lng) : null,
    outAccuracyM: row.out_accuracy_m !== null && row.out_accuracy_m !== undefined ? Number(row.out_accuracy_m) : null,
    outDistanceM: row.out_distance_m !== null && row.out_distance_m !== undefined ? Number(row.out_distance_m) : null,
    outIp: String(row.out_ip ?? ''),
    outIpCity: String(row.out_ip_city ?? ''),
    outIpCountry: String(row.out_ip_country ?? ''),
    outFlags: parseFlags(row.out_flags_json),
    outPhotoSrc: Boolean(row.has_out_photo) ? `/attendance/photo/${id}?type=out&v=${v}` : '',
    status: String(row.status || 'Present') as AttendanceStatus,
    workMinutes: Number(row.work_minutes ?? 0),
    breakMinutes: Number(row.break_minutes ?? 0),
    breaks: parseBreaksJson(row.breaks_json),
    isLate: Boolean(row.is_late),
    editedBy: String(row.edited_by ?? ''),
    editNote: String(row.edit_note ?? ''),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
    editHistory,
  }
}

export function buildEmployeeCycleSummaries(
  employees: EmployeeRecord[],
  logs: AttendanceLogRecord[],
  selectedMonth: string,
  todayIst: string,
): EmployeeCycleSummary[] {
  return employees.map((employee) => {
    const { startDate, endDate, totalDays } = getEmployeeCycleRange(selectedMonth, employee.cycleStartDay)
    const sundaysCount = countSundaysInRange(startDate, endDate)
    const workingDays = Math.max(1, totalDays - sundaysCount)

    const empLogs = logs.filter(
      (log) => log.employeeId === employee.id && log.workDate >= startDate && log.workDate <= endDate,
    )
    const presentDays = empLogs.filter((log) => log.status === 'Present').length
    const halfDays = empLogs.filter((log) => log.status === 'Half Day').length
    const leaveDays = empLogs.filter((log) => log.status === 'Leave').length
    const explicitAbsent = empLogs.filter((log) => log.status === 'Absent').length

    // Count elapsed non-Sunday days up to todayIst without a log as unmarked/absent
    const effectiveEnd = endDate < todayIst ? endDate : todayIst
    let unmarkedWorkingDays = 0
    if (effectiveEnd >= startDate) {
      const logDates = new Set(empLogs.map((l) => l.workDate))
      let cursor = new Date(`${startDate}T00:00:00Z`).getTime()
      const endMs = new Date(`${effectiveEnd}T00:00:00Z`).getTime()
      while (cursor <= endMs) {
        const dt = new Date(cursor)
        const iso = dt.toISOString().slice(0, 10)
        if (dt.getUTCDay() !== 0 && !logDates.has(iso)) unmarkedWorkingDays += 1
        cursor += 86_400_000
      }
    }

    const payableDays = presentDays + halfDays * 0.5
    const perDaySalary = employee.monthlySalary > 0 ? Math.round(employee.monthlySalary / workingDays) : 0
    const earnedSalary = employee.monthlySalary > 0 ? Math.round((employee.monthlySalary * payableDays) / workingDays) : 0

    return {
      employee,
      cycleStartDate: startDate,
      cycleEndDate: endDate,
      totalDays,
      sundaysCount,
      workingDays,
      presentDays,
      halfDays,
      leaveDays,
      absentDays: explicitAbsent + unmarkedWorkingDays,
      payableDays,
      perDaySalary,
      earnedSalary,
      lateCount: empLogs.filter((log) => log.isLate).length,
      flaggedCount: empLogs.filter((log) => log.inFlags.length > 0 || log.outFlags.length > 0).length,
      missedCheckOutCount: empLogs.filter((log) => log.checkInAt && !log.checkOutAt && log.workDate < todayIst).length,
      totalWorkMinutes: empLogs.reduce((sum, log) => sum + (log.workMinutes || 0), 0),
    }
  })
}