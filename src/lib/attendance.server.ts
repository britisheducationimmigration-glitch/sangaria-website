import '@tanstack/react-start/server-only'

import crypto from 'node:crypto'
import { site } from '@/data/site'
import { execute, getDb, queryRows } from './db.server'
import type {
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
}

let attendanceSchemaPromise: Promise<void> | null = null

export async function ensureAttendanceSchema() {
  if (!attendanceSchemaPromise) {
    attendanceSchemaPromise = (async () => {
      const db = await getDb()
      if (!db) throw new Error('Database is not configured')

      try {
        const rows = await queryRows(
          "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'site_settings' AND COLUMN_NAME = 'attendance_settings_json' LIMIT 1",
        )
        if (rows.length === 0) {
          await execute('ALTER TABLE site_settings ADD COLUMN attendance_settings_json LONGTEXT NULL')
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message.toLowerCase() : ''
        if (!msg.includes('duplicate column')) throw err
      }

      await execute(`
        CREATE TABLE IF NOT EXISTS employees (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(140) NOT NULL,
          designation VARCHAR(120) NOT NULL DEFAULT '',
          phone VARCHAR(40) NOT NULL DEFAULT '',
          email VARCHAR(190) NOT NULL DEFAULT '',
          access_token VARCHAR(64) NOT NULL UNIQUE,
          pin_hash VARCHAR(255) NOT NULL DEFAULT '',
          cycle_start_day TINYINT UNSIGNED NOT NULL DEFAULT 1,
          expected_in_time VARCHAR(5) NOT NULL DEFAULT '09:30',
          expected_out_time VARCHAR(5) NOT NULL DEFAULT '19:30',
          office_only BOOLEAN NOT NULL DEFAULT TRUE,
          active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `)

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
          out_lat DOUBLE NULL,
          out_lng DOUBLE NULL,
          out_accuracy_m INT NULL,
          out_distance_m INT NULL,
          out_ip VARCHAR(64) NOT NULL DEFAULT '',
          out_ip_city VARCHAR(120) NOT NULL DEFAULT '',
          out_ip_country VARCHAR(16) NOT NULL DEFAULT '',
          out_flags_json TEXT NULL,
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

export function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const R = 6_371_000
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
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
    throw new Error(
      `GPS accuracy is too weak (${safeAccuracy}m). Enable High Accuracy / Precise Location and try again.`,
    )
  }

  const net = readClientNetworkInfo(headers)
  const distanceM = Math.round(haversineMeters(lat, lng, settings.officeLat, settings.officeLng))
  const flags: string[] = []

  if (safeAccuracy <= 1) flags.push('LOW_OR_MOCK_ACCURACY')
  if (net.ipCountry && net.ipCountry !== 'IN') {
    flags.push(`FOREIGN_IP_${net.ipCountry}`)
    if (settings.blockVpnOrForeignIp) {
      throw new Error('VPN or foreign network detected. Turn off VPN and use Indian mobile data or Office Wi-Fi.')
    }
  }

  if (net.ipLat !== null && net.ipLng !== null) {
    const ipVsGpsKm = Math.round(haversineMeters(lat, lng, net.ipLat, net.ipLng) / 1000)
    if (ipVsGpsKm > 750) {
      flags.push(`VPN_OR_IP_MISMATCH_${ipVsGpsKm}KM`)
    }
  }

  if (settings.requireOfficeWifiIp && settings.officeWifiIp.trim()) {
    if (!net.clientIp || net.clientIp !== settings.officeWifiIp.trim()) {
      throw new Error('Please connect to the Sangaria Office Wi-Fi to mark attendance.')
    }
  }

  if (distanceM > settings.allowedRadiusM) {
    flags.push(`OUT_OF_OFFICE_${distanceM}M`)
    if (officeOnly) {
      throw new Error(
        `You are ${distanceM}m away from ${settings.officeName}. Move within ${settings.allowedRadiusM}m of office.`,
      )
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
    cycleStartDay: Math.max(1, Math.min(28, Number(row.cycle_start_day ?? 1))),
    expectedInTime: String(row.expected_in_time || '09:30'),
    expectedOutTime: String(row.expected_out_time || '19:30'),
    officeOnly: Boolean(row.office_only),
    active: Boolean(row.active),
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

export function mapAttendanceRow(row: Record<string, unknown>): AttendanceLogRecord {
  return {
    id: Number(row.id),
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
    outLat: row.out_lat !== null && row.out_lat !== undefined ? Number(row.out_lat) : null,
    outLng: row.out_lng !== null && row.out_lng !== undefined ? Number(row.out_lng) : null,
    outAccuracyM: row.out_accuracy_m !== null && row.out_accuracy_m !== undefined ? Number(row.out_accuracy_m) : null,
    outDistanceM: row.out_distance_m !== null && row.out_distance_m !== undefined ? Number(row.out_distance_m) : null,
    outIp: String(row.out_ip ?? ''),
    outIpCity: String(row.out_ip_city ?? ''),
    outIpCountry: String(row.out_ip_country ?? ''),
    outFlags: parseFlags(row.out_flags_json),
    status: (String(row.status || 'Present') as AttendanceStatus),
    workMinutes: Number(row.work_minutes ?? 0),
    isLate: Boolean(row.is_late),
    editedBy: String(row.edited_by ?? ''),
    editNote: String(row.edit_note ?? ''),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
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
    const empLogs = logs.filter(
      (log) => log.employeeId === employee.id && log.workDate >= startDate && log.workDate <= endDate,
    )
    const presentDays = empLogs.filter((log) => log.status === 'Present').length
    const halfDays = empLogs.filter((log) => log.status === 'Half Day').length
    const leaveDays = empLogs.filter((log) => log.status === 'Leave').length
    const explicitAbsent = empLogs.filter((log) => log.status === 'Absent').length

    // Count elapsed days in cycle up to today (in IST) that have no record as unmarked/absent
    const effectiveEnd = endDate < todayIst ? endDate : todayIst
    let elapsedDays = 0
    if (effectiveEnd >= startDate) {
      const s = new Date(`${startDate}T00:00:00Z`).getTime()
      const e = new Date(`${effectiveEnd}T00:00:00Z`).getTime()
      elapsedDays = Math.floor((e - s) / 86_400_000) + 1
    }
    const recordedDays = empLogs.filter((log) => log.workDate <= effectiveEnd).length
    const unmarkedDays = Math.max(0, elapsedDays - recordedDays)

    return {
      employee,
      cycleStartDate: startDate,
      cycleEndDate: endDate,
      totalDays,
      presentDays,
      halfDays,
      leaveDays,
      absentDays: explicitAbsent + unmarkedDays,
      lateCount: empLogs.filter((log) => log.isLate).length,
      flaggedCount: empLogs.filter((log) => log.inFlags.length > 0 || log.outFlags.length > 0).length,
      missedCheckOutCount: empLogs.filter((log) => log.checkInAt && !log.checkOutAt && log.workDate < todayIst).length,
      totalWorkMinutes: empLogs.reduce((sum, log) => sum + (log.workMinutes || 0), 0),
    }
  })
}