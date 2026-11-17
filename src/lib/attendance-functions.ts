import { buildPayrollRange } from './payroll-range'
import { Buffer } from 'node:buffer'
import { createMiddleware, createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { execute, queryRows } from './db.server'
import { attendanceTransaction, csvText, ensureAttendanceReliabilitySchema } from './attendance-reliability.server'
import { checkRateLimit } from './rate-limit.server'
import {
  buildEmployeeCycleSummaries,
  currentIstMonth,
  ensureAttendanceSchema,
  generateEmployeeToken,
  getEmployeeCycleRange,
  hashDeviceKey,
  hashEmployeePin,
  istTimeHHMM,
  mapAttendanceRow,
  mapEditHistoryRow,
  mapEmployeeRow,
  parseBreaksJson,
  readEmployeePolicies,
  resolveEmployeePolicy,
  calculateWorkMinutes,
  calculateMergedBreakMinutes,
  classifyShift,
  readAttendanceSettings,
  todayIstDate,
  verifyAttendanceLocation,
  verifyEmployeePin,
} from './attendance.server'
import { site } from '@/data/site'
import { readSiteSettings } from './site-settings'
import type {
  AdminAttendanceSnapshot,
  AttendanceBreakRecord,
  AttendanceEditHistoryRecord,
  AttendanceLogRecord,
  AttendanceSettings,
  AttendanceStatus,
  EmployeeRecord,
  EmployeeCycleSummary,
  SalarySlipRecord,
  SalarySlipSnapshot,
} from './content-types'

const LOG_COLS = `
  l.id, l.employee_id, l.work_date, l.check_in_at, l.check_out_at,
  l.in_lat, l.in_lng, l.in_accuracy_m, l.in_distance_m, l.in_ip, l.in_ip_city, l.in_ip_country, l.in_flags_json,
  l.in_photo_data IS NOT NULL AS has_in_photo,
  l.out_lat, l.out_lng, l.out_accuracy_m, l.out_distance_m, l.out_ip, l.out_ip_city, l.out_ip_country, l.out_flags_json,
  l.out_photo_data IS NOT NULL AS has_out_photo,
  l.media_version, l.status, l.work_minutes, l.break_minutes, l.breaks_json, l.is_late, l.edited_by, l.edit_note, l.updated_at,
  e.name AS employee_name, e.designation
`

async function assertCycleUnlocked(query: (sql: string, values?: unknown[]) => Promise<Record<string, unknown>[]>, employeeId: number, workDate: string) {
  const locked = await query('SELECT id FROM attendance_cycle_snapshots WHERE employee_id = ? AND cycle_start_date <= ? AND cycle_end_date >= ? LIMIT 1', [employeeId, workDate, workDate])
  if (locked.length) throw new Error('This attendance cycle has been finalized. Its records cannot be changed.')
}
function portalLog(log: AttendanceLogRecord | null) {
  if (!log) return null
  return { id: log.id, workDate: log.workDate, checkInAt: log.checkInAt, checkOutAt: log.checkOutAt, status: log.status, workMinutes: log.workMinutes, breaks: log.breaks.map(({ outAt, inAt, note }) => ({ outAt, inAt, note })) }
}

function payrollPolicy(employee: EmployeeRecord) {
  const { cycleStartDay, monthlySalary, expectedInTime, expectedOutTime, joiningDate, leavingDate, halfDayMinutes, minimumHalfDayMinutes = 0, lateGraceMinutes, weeklyOffDays, holidayDates } = employee
  return { cycleStartDay, monthlySalary, expectedInTime, expectedOutTime, joiningDate, leavingDate, halfDayMinutes, minimumHalfDayMinutes, lateGraceMinutes, weeklyOffDays, holidayDates }
}

function stringValue(value: unknown, max = 500) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function numberValue(value: unknown, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function readHeadersFromRequest() {
  const headers = new Headers()
  for (const name of ['x-real-ip', 'x-forwarded-for', 'x-vercel-ip-country', 'x-vercel-ip-city', 'x-vercel-ip-latitude', 'x-vercel-ip-longitude']) {
    const val = getRequestHeader(name)
    if (val) headers.set(name, val)
  }
  return headers
}

const superAdminMiddleware = createMiddleware().server(async ({ next, request }) => {
  const { ensureAdminRecord, getAdminRole, getSessionUser } = await import('./auth.server')
  const user = await getSessionUser(request.headers)
  if (!user || !(await ensureAdminRecord(user))) throw new Error('Unauthorized')
  const role = await getAdminRole(user)
  if (role !== 'super_admin') throw new Error('Forbidden: Super Admin access required')
  return next({ context: { user, role } })
})

export const getEmployeePortalData = createServerFn({ method: 'GET' })
  .validator((data: unknown) => {
    const token = stringValue((data as Record<string, unknown>)?.token, 64)
    if (!/^[A-Za-z0-9_-]{12,64}$/.test(token)) throw new Error('Invalid attendance link')
    return { token }
  })
  .handler(async ({ data }) => {
    await ensureAttendanceSchema()
    await ensureAttendanceReliabilitySchema()
    const empRows = await queryRows('SELECT * FROM employees WHERE access_token = ? LIMIT 1', [data.token])
    if (empRows.length === 0) throw new Error('Attendance link not found')
    const policies = await readEmployeePolicies(Number(empRows[0].id))
    const employee = resolveEmployeePolicy(mapEmployeeRow(empRows[0]), policies, todayIstDate())
    if (!employee.active) throw new Error('This employee attendance link has been deactivated. Contact admin.')

   const today = todayIstDate()
    const currentMonth = currentIstMonth()
    const [settings, cycleLogRows, missedRows] = await Promise.all([
      readAttendanceSettings(),
      queryRows(`SELECT ${LOG_COLS} FROM attendance_logs l JOIN employees e ON e.id = l.employee_id WHERE l.employee_id = ? AND l.work_date <= ? ORDER BY l.work_date DESC LIMIT 45`, [employee.id, today]),
      queryRows('SELECT work_date FROM attendance_logs WHERE employee_id = ? AND work_date < ? AND check_in_at IS NOT NULL AND check_out_at IS NULL ORDER BY work_date ASC LIMIT 1', [employee.id, today]),
    ])

    const logs = cycleLogRows.map((r) => mapAttendanceRow(r))
    const todayLog = logs.find((l) => l.workDate === today) ?? null
    const { startDate, endDate } = getEmployeeCycleRange(currentMonth, employee.cycleStartDay)
    const activeCycle = today >= startDate && today <= endDate
      ? { startDate, endDate }
      : (() => {
          const [y, m] = currentMonth.split('-').map(Number)
          const prev = new Date(Date.UTC(y, m - 2, 1))
          return getEmployeeCycleRange(`${prev.getUTCFullYear()}-${String(prev.getUTCMonth() + 1).padStart(2, '0')}`, employee.cycleStartDay)
        })()

    const summary = buildEmployeeCycleSummaries([employee], logs, activeCycle.startDate.slice(0, 7), today, policies)[0]

    return {
      employee: {
        id: employee.id,
        name: employee.name,
        designation: employee.designation,
        hasPin: employee.hasPin,
        deviceBound: employee.deviceBound,
        cycleStartDay: employee.cycleStartDay,
        expectedInTime: employee.expectedInTime,
        expectedOutTime: employee.expectedOutTime,
        officeOnly: employee.officeOnly,
      },
      settings: {
        officeName: settings.officeName,
        officeLat: settings.officeLat,
        officeLng: settings.officeLng,
        allowedRadiusM: settings.allowedRadiusM,
        requireOfficeWifiIp: settings.requireOfficeWifiIp,
        requireSelfie: settings.requireSelfie,
      },
      missedPreviousOutDate: missedRows[0] ? String(missedRows[0].work_date) : '',
      todayIst: today,
      todayLog: portalLog(todayLog),
      recentLogs: logs.slice(0, 10).map((log) => portalLog(log)!),
      summary: {
        cycleStartDate: summary.cycleStartDate, cycleEndDate: summary.cycleEndDate,
        presentDays: summary.presentDays, halfDays: summary.halfDays, leaveDays: summary.leaveDays,
        lateCount: summary.lateCount, totalWorkMinutes: summary.totalWorkMinutes,
      },
    }
  })

type EmployeeMarkAction = 'in' | 'out' | 'half_out' | 'break_out' | 'break_in'

export const markEmployeeAttendance = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const input = (data ?? {}) as Record<string, unknown>
    const token = stringValue(input.token, 64)
    const action = stringValue(input.action, 16)
    const pin = stringValue(input.pin, 12)
    const note = stringValue(input.note, 160)
    const deviceKey = stringValue(input.deviceKey, 120)
    const photoBase64 = typeof input.photoBase64 === 'string' ? input.photoBase64.trim() : ''
    if (typeof input.lat !== 'number' || typeof input.lng !== 'number' || typeof input.accuracyM !== 'number') throw new Error('Valid GPS coordinates and accuracy are required')
    const lat = Number(input.lat)
    const lng = Number(input.lng)
    const accuracyM = Number(input.accuracyM)
    if (!/^[A-Za-z0-9_-]{12,64}$/.test(token)) throw new Error('Invalid attendance link')
    if (!['in', 'out', 'half_out', 'break_out', 'break_in'].includes(action)) throw new Error('Invalid attendance action')
    if (deviceKey.length < 12) throw new Error('Could not verify your device. Please reload and try again.')
    if (photoBase64 && (photoBase64.length > 500_000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(photoBase64))) {
      throw new Error('Selfie image is invalid or too large.')
    }
    return { token, action: action as EmployeeMarkAction, pin, note, deviceKey, photoBase64, lat, lng, accuracyM }
  })
  .handler(async ({ data }) => {
    await ensureAttendanceSchema()
    if (!(await checkRateLimit('attendance-mark', data.token, 30, 900))) {
      throw new Error('Too many attempts. Please wait a few minutes and try again.')
    }

    await ensureAttendanceReliabilitySchema()
    const settings = await readAttendanceSettings()
    return attendanceTransaction(async ({ queryRows, execute }) => {
    const empRows = await queryRows('SELECT * FROM employees WHERE access_token = ? LIMIT 1 FOR UPDATE', [data.token])
    if (empRows.length === 0) throw new Error('Attendance link not found')
    const empRaw = empRows[0]
    const policyRows = await queryRows('SELECT employee_id, effective_date, policy_json FROM employee_policy_history WHERE employee_id = ?', [Number(empRaw.id)])
    const history = policyRows.map((row) => ({ employeeId: Number(row.employee_id), effectiveDate: String(row.effective_date), policy: JSON.parse(String(row.policy_json)) as Partial<EmployeeRecord> }))
    const employee = resolveEmployeePolicy(mapEmployeeRow(empRaw), history, todayIstDate())
    if (!employee.active) throw new Error('This attendance link is deactivated. Contact admin.')

    const storedPinHash = String(empRaw.pin_hash ?? '')
    if (storedPinHash && !verifyEmployeePin(data.pin, storedPinHash)) {
      throw new Error('Incorrect PIN. Enter your valid PIN.')
    }

    const incomingDeviceHash = hashDeviceKey(data.deviceKey)
    const storedDeviceHash = String(empRaw.bound_device_hash ?? '').trim()
    if (storedDeviceHash && storedDeviceHash !== incomingDeviceHash) {
      throw new Error('This link is locked to another registered phone. Ask Super Admin to reset Device Lock.')
    }

    const needsSelfie = ['in', 'out', 'half_out'].includes(data.action)
    let photoBuffer: Buffer | null = null
    if (settings.requireSelfie && needsSelfie && !data.photoBase64) {
      throw new Error('Live camera selfie is required to mark attendance.')
    }
    if (data.photoBase64) {
      photoBuffer = Buffer.from(data.photoBase64, 'base64')
      const isWebp = photoBuffer.length > 12 && photoBuffer.toString('ascii', 0, 4) === 'RIFF' && photoBuffer.toString('ascii', 8, 12) === 'WEBP'
      const isJpeg = photoBuffer.length > 4 && photoBuffer[0] === 0xff && photoBuffer[1] === 0xd8 && photoBuffer[2] === 0xff
      if ((!isWebp && !isJpeg) || photoBuffer.length > 350_000) {
        throw new Error('Invalid live selfie format.')
      }
    }

    const headers = readHeadersFromRequest()
    const loc = verifyAttendanceLocation({
      lat: data.lat,
      lng: data.lng,
      accuracyM: data.accuracyM,
      headers,
      settings,
      officeOnly: data.action === 'break_out' ? false : employee.officeOnly,
    })

    if (!storedDeviceHash) {
      await execute('UPDATE employees SET bound_device_hash = ? WHERE id = ?', [incomingDeviceHash, employee.id])
    }

    const today = todayIstDate()
    const now = new Date()
    const existingRows = await queryRows('SELECT id, status, check_in_at, check_out_at, breaks_json FROM attendance_logs WHERE employee_id = ? AND work_date = ? LIMIT 1 FOR UPDATE', [employee.id, today])
    const existing = existingRows[0]
    const openRows = await queryRows('SELECT id, work_date, check_in_at, check_out_at, breaks_json FROM attendance_logs WHERE employee_id = ? AND check_in_at IS NOT NULL AND check_out_at IS NULL ORDER BY work_date DESC LIMIT 1 FOR UPDATE', [employee.id])
    const open = openRows[0]
    if (open && String(open.work_date) < today) throw new Error('Previous shift is missing Check Out. Contact Super Admin before further punches.')
    if (employee.joiningDate && today < employee.joiningDate) throw new Error('Attendance is not enabled before your joining date')
    if (employee.leavingDate && today > employee.leavingDate) throw new Error('Your attendance period has ended. Contact admin.')
    await assertCycleUnlocked(queryRows, employee.id, today)

    if (data.action === 'in') {
      if (existing && ['Leave', 'Paid Leave', 'Unpaid Leave', 'Absent'].includes(String(existing.status))) throw new Error('Admin has marked leave or absence for today. Contact admin to change it before checking in.')
      const overlap = await queryRows('SELECT id FROM attendance_logs WHERE employee_id = ? AND check_out_at > ? LIMIT 1', [employee.id, now])
      if (overlap.length) throw new Error('Attendance times overlap another shift for this employee')

      if (existing?.check_in_at) throw new Error('You have already checked in today.')
      const isLate = (Number(istTimeHHMM(now).slice(0, 2)) * 60 + Number(istTimeHHMM(now).slice(3))) > (Number(employee.expectedInTime.slice(0, 2)) * 60 + Number(employee.expectedInTime.slice(3)) + (employee.lateGraceMinutes ?? 0)) ? 1 : 0
      if (existing) {
        await execute(
          `UPDATE attendance_logs SET check_in_at = ?, in_lat = ?, in_lng = ?, in_accuracy_m = ?, in_distance_m = ?,
           in_ip = ?, in_ip_city = ?, in_ip_country = ?, in_flags_json = ?, in_photo_data = ?, media_version = ?, status = 'Present', is_late = ? WHERE id = ?`,
          [now, loc.lat, loc.lng, loc.accuracyM, loc.distanceM, loc.ip, loc.ipCity, loc.ipCountry, JSON.stringify(loc.flags), photoBuffer, Date.now(), isLate, Number(existing.id)],
        )
      } else {
        await execute(
          `INSERT INTO attendance_logs (employee_id, work_date, check_in_at, in_lat, in_lng, in_accuracy_m, in_distance_m, in_ip, in_ip_city, in_ip_country, in_flags_json, in_photo_data, media_version, status, is_late)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Present', ?)`,
          [employee.id, today, now, loc.lat, loc.lng, loc.accuracyM, loc.distanceM, loc.ip, loc.ipCity, loc.ipCountry, JSON.stringify(loc.flags), photoBuffer, Date.now(), isLate],
        )
      }
    } else if (data.action === 'break_out' || data.action === 'break_in') {
      if (!existing || !existing.check_in_at) throw new Error('Please mark Check In first.')
      if (existing.check_out_at) throw new Error('Attendance is already checked out for today.')
      const breaks: AttendanceBreakRecord[] = parseBreaksJson(existing.breaks_json)
      const openBreak = breaks.find((b) => b.outAt && !b.inAt)
      if (data.action === 'break_out') {
        if (openBreak) throw new Error('You are already stepped out. Tap Back in Office when you return.')
        breaks.push({
          outAt: now.toISOString(),
          inAt: '',
          outLat: loc.lat,
          outLng: loc.lng,
          outDistanceM: loc.distanceM,
          inLat: null,
          inLng: null,
          inDistanceM: null,
          note: data.note || 'Stepped out',
        })
      } else {
        if (!openBreak) throw new Error('No active break to close.')
        openBreak.inAt = now.toISOString()
        openBreak.inLat = loc.lat
        openBreak.inLng = loc.lng
        openBreak.inDistanceM = loc.distanceM
      }
      const breakMinutes = calculateMergedBreakMinutes(new Date(String(existing.check_in_at)), now, breaks)
      await execute('UPDATE attendance_logs SET breaks_json = ?, break_minutes = ? WHERE id = ?', [JSON.stringify(breaks), breakMinutes, Number(existing.id)])
    } else {
      if (!existing || !existing.check_in_at) throw new Error('Please mark Check In first before checking out.')
      if (existing.check_out_at) throw new Error('You have already checked out today.')
      const breaks: AttendanceBreakRecord[] = parseBreaksJson(existing.breaks_json)
      for (const br of breaks) {
        if (br.outAt && !br.inAt) br.inAt = now.toISOString()
      }
      const breakMinutes = calculateMergedBreakMinutes(new Date(String(existing.check_in_at)), now, breaks)
        const workMinutes = calculateWorkMinutes(new Date(String(existing.check_in_at)), now, breaks)
      const finalStatus: AttendanceStatus = classifyShift(workMinutes, employee, data.action === 'half_out')
      const finalFlags = finalStatus === 'Review Required' ? [...loc.flags, 'INSUFFICIENT_HOURS_REVIEW_REQUIRED'] : finalStatus === 'Half Day' ? [...loc.flags, 'HALF_DAY_OUT'] : loc.flags
      await execute(
        `UPDATE attendance_logs SET check_out_at = ?, out_lat = ?, out_lng = ?, out_accuracy_m = ?, out_distance_m = ?,
         out_ip = ?, out_ip_city = ?, out_ip_country = ?, out_flags_json = ?, out_photo_data = ?, media_version = ?,
         breaks_json = ?, break_minutes = ?, work_minutes = ?, status = ? WHERE id = ?`,
        [now, loc.lat, loc.lng, loc.accuracyM, loc.distanceM, loc.ip, loc.ipCity, loc.ipCountry, JSON.stringify(finalFlags), photoBuffer, Date.now(), JSON.stringify(breaks), breakMinutes, workMinutes, finalStatus, Number(existing.id)],
      )
    }

    const updatedRows = await queryRows(`SELECT ${LOG_COLS} FROM attendance_logs l JOIN employees e ON e.id = l.employee_id WHERE l.employee_id = ? AND l.work_date = ? LIMIT 1`, [employee.id, today])
    // First successful evidence is immutable; later admin corrections never overwrite it.
    if (updatedRows[0]) {
      await execute('INSERT IGNORE INTO attendance_original_punches (log_id, snapshot_json) VALUES (?, ?)', [Number(updatedRows[0].id), JSON.stringify(updatedRows[0])])
      await execute('INSERT INTO attendance_punch_events (log_id, action, snapshot_json) VALUES (?, ?, ?)', [Number(updatedRows[0].id), data.action, JSON.stringify(updatedRows[0])])
    }
    return { ok: true, flags: loc.flags, distanceM: loc.distanceM }
    })
  })

export const getAdminAttendanceSnapshot = createServerFn({ method: 'GET' })
  .middleware([superAdminMiddleware])
  .validator((data: unknown) => {
    const rawMonth = stringValue((data as Record<string, unknown>)?.month, 7)
    return { selectedMonth: /^\d{4}-(?:0[1-9]|1[0-2])$/.test(rawMonth) ? rawMonth : currentIstMonth(), lightweight: Boolean((data as Record<string, unknown>)?.lightweight) }
  })
  .handler(async ({ data }): Promise<AdminAttendanceSnapshot & { currentRequestIp: string }> => {
    return buildAdminAttendanceSnapshot(data.selectedMonth, data.lightweight)
  })

async function buildAdminAttendanceSnapshot(selectedMonth: string, lightweight = false): Promise<AdminAttendanceSnapshot & { currentRequestIp: string }> {
    await ensureAttendanceSchema()
    await ensureAttendanceReliabilitySchema()
    const [year, month] = selectedMonth.split('-').map(Number)
    const rangeStart = new Date(Date.UTC(year, month - 1, 1) - 6 * 86_400_000).toISOString().slice(0, 10)
    const rangeEnd = new Date(Date.UTC(year, month + 1, 0)).toISOString().slice(0, 10)

   const todayIst = todayIstDate()
    const policyStart = rangeStart < todayIst ? rangeStart : todayIst
    const policyEnd = rangeEnd > todayIst ? rangeEnd : todayIst

    const [settings, empRows, logRows, policies] = await Promise.all([
      readAttendanceSettings(),
      queryRows('SELECT * FROM employees ORDER BY active DESC, name ASC'),
      queryRows(`SELECT ${LOG_COLS} FROM attendance_logs l JOIN employees e ON e.id = l.employee_id WHERE l.work_date >= ? AND l.work_date <= ? ORDER BY l.work_date DESC, e.name ASC`, [rangeStart, rangeEnd]),
      readEmployeePolicies(undefined, policyStart, policyEnd),
    ])

    const logIds = logRows.map((r) => Number(r.id))
    const historyRows = !lightweight && logIds.length
      ? await queryRows(`SELECT * FROM attendance_edit_history WHERE attendance_log_id IN (${logIds.map(() => '?').join(',')}) ORDER BY created_at DESC, id DESC`, logIds)
      : []

    const historyByLog = new Map<number, AttendanceEditHistoryRecord[]>()
    for (const hRow of historyRows) {
      const mapped = mapEditHistoryRow(hRow)
      const list = historyByLog.get(mapped.attendanceLogId) ?? []
      list.push(mapped)
      historyByLog.set(mapped.attendanceLogId, list)
    }

    const employees = empRows.map(row => resolveEmployeePolicy(mapEmployeeRow(row), policies, todayIst))
    const logs = logRows.map((r) => mapAttendanceRow(r, historyByLog.get(Number(r.id)) ?? []))
    let summaries = buildEmployeeCycleSummaries(employees, logs, selectedMonth, todayIst, policies)
    summaries = await applyFinalizedSummaries(summaries, selectedMonth)
    const headers = readHeadersFromRequest()
    const currentRequestIp = (headers.get('x-real-ip') || (headers.get('x-forwarded-for') ?? '').split(',')[0] || '').trim()

    return { settings, employees, logs, summaries, selectedMonth: selectedMonth, todayIst, currentRequestIp }
}

export const getAttendanceRecordHistory = createServerFn({ method: 'GET' })
  .middleware([superAdminMiddleware])
  .validator((data: unknown) => {
    const input = (data ?? {}) as Record<string, unknown>
    const employeeId = Math.floor(numberValue(input.employeeId, 0))
    const workDate = stringValue(input.workDate, 10)
    if (employeeId <= 0 || !/^\d{4}-\d{2}-\d{2}$/.test(workDate)) throw new Error('Valid attendance record is required')
    return { employeeId, workDate }
  })
  .handler(async ({ data }) => {
    await ensureAttendanceSchema()
    const rows = await queryRows('SELECT * FROM attendance_edit_history WHERE employee_id = ? AND work_date = ? ORDER BY created_at DESC, id DESC', [data.employeeId, data.workDate])
    return rows.map(mapEditHistoryRow)
  })

export const saveEmployee = createServerFn({ method: 'POST' })
  .middleware([superAdminMiddleware])
  .validator((data: unknown) => {
    const input = (data ?? {}) as Record<string, unknown>
    const id = Math.max(0, Math.floor(numberValue(input.id, 0)))
    const name = stringValue(input.name, 140)
    const designation = stringValue(input.designation, 120)
    const phone = stringValue(input.phone, 40)
    const email = stringValue(input.email, 190).toLowerCase()
    const pin = stringValue(input.pin, 12)
    const clearPin = Boolean(input.clearPin)
    const cycleStartDay = Math.max(1, Math.min(31, Math.floor(numberValue(input.cycleStartDay, 1))))
    const monthlySalary = Math.max(0, Math.min(10_000_000, Math.round(numberValue(input.monthlySalary, 0))))
    const expectedInTime = stringValue(input.expectedInTime, 5) || '09:30'
    const expectedOutTime = stringValue(input.expectedOutTime, 5) || '19:30'
    const officeOnly = input.officeOnly === undefined ? true : Boolean(input.officeOnly)
    const active = input.active === undefined ? true : Boolean(input.active)
    const effectiveDate = stringValue(input.effectiveDate, 10) || todayIstDate()
    const joiningDate = stringValue(input.joiningDate, 10)
    const leavingDate = stringValue(input.leavingDate, 10)
    const halfDayMinutes = Math.max(1, Math.min(1440, Math.round(numberValue(input.halfDayMinutes, 300))))
    const minimumHalfDayMinutes = Math.max(0, Math.min(halfDayMinutes, Math.round(numberValue(input.minimumHalfDayMinutes, 0))))
    const policyReason = stringValue(input.policyReason, 500)
    const lateGraceMinutes = Math.max(0, Math.min(240, Math.round(numberValue(input.lateGraceMinutes, 0))))
    const weeklyOffDays = Array.isArray(input.weeklyOffDays) ? [...new Set(input.weeklyOffDays.map(Number).filter((n) => Number.isInteger(n) && n >= 0 && n <= 6))] : [0]
    const holidayDates = Array.isArray(input.holidayDates) ? input.holidayDates.map(value => String(value).trim()) : []
    for (const date of holidayDates) {
      const parsed = new Date(date + 'T00:00:00Z')
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) throw new Error('Invalid holiday date: ' + date)
    }
    for (const date of [effectiveDate, joiningDate, leavingDate].filter(Boolean)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(new Date(date + 'T00:00:00Z').getTime()) || new Date(date + 'T00:00:00Z').toISOString().slice(0, 10) !== date) throw new Error('Valid effective/joining/leaving date is required')
    }
    if (joiningDate && leavingDate && leavingDate < joiningDate) throw new Error('Leaving date must be on or after joining date')

    if (!name) throw new Error('Employee name is required')
    if (pin && !/^\d{4,8}$/.test(pin)) throw new Error('Employee PIN must be 4 to 8 digits')
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(expectedInTime) || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(expectedOutTime)) throw new Error('Shift times must be HH:MM')
    return { id, name, designation, phone, email, pin, clearPin, cycleStartDay, monthlySalary, expectedInTime, expectedOutTime, officeOnly, active, effectiveDate, joiningDate, leavingDate, halfDayMinutes, minimumHalfDayMinutes, lateGraceMinutes, weeklyOffDays, holidayDates, policyReason }
  })
  .handler(async ({ data, context }): Promise<EmployeeRecord> => {
    await ensureAttendanceSchema()
    return attendanceTransaction(async ({ queryRows, execute }) => {
    if (data.id > 0) {
      const previous = await queryRows('SELECT * FROM employees WHERE id = ? FOR UPDATE', [data.id])
      if (!previous.length) throw new Error('Employee not found')
      const policies = await queryRows('SELECT employee_id, effective_date, policy_json FROM employee_policy_history WHERE employee_id = ?', [data.id])
      const beforePolicy = payrollPolicy(resolveEmployeePolicy(mapEmployeeRow(previous[0]), policies.map(row => ({ employeeId: Number(row.employee_id), effectiveDate: String(row.effective_date), policy: JSON.parse(String(row.policy_json)) })), data.effectiveDate))
      const afterPolicy = payrollPolicy({ ...mapEmployeeRow(previous[0]), ...data })
      if (JSON.stringify(beforePolicy) !== JSON.stringify(afterPolicy)) {
        await execute('INSERT INTO employee_policy_audit (employee_id, effective_date, actor_email, reason, before_json, after_json) VALUES (?, ?, ?, ?, ?, ?)', [data.id, data.effectiveDate, context.user.email, data.policyReason || 'Employee profile updated by admin', JSON.stringify(beforePolicy), JSON.stringify(afterPolicy)])
      }
      if (!policies.length) {
        await execute('INSERT INTO employee_policy_history (employee_id, effective_date, policy_json) VALUES (?, ?, ?)', [data.id, '1900-01-01', JSON.stringify(payrollPolicy(mapEmployeeRow(previous[0])))])
      }
      const currentHistory = policies.map(row => ({ employeeId: Number(row.employee_id), effectiveDate: String(row.effective_date), policy: JSON.parse(String(row.policy_json)) }))
      if (!currentHistory.length) currentHistory.push({ employeeId: data.id, effectiveDate: '1900-01-01', policy: payrollPolicy(mapEmployeeRow(previous[0])) })
      const currentPolicy = resolveEmployeePolicy(mapEmployeeRow(previous[0]), [...currentHistory.filter(p => p.effectiveDate !== data.effectiveDate), { employeeId: data.id, effectiveDate: data.effectiveDate, policy: afterPolicy }], todayIstDate())
      const common = [data.name, data.designation, data.phone, data.email]
      const tail = [currentPolicy.cycleStartDay, currentPolicy.monthlySalary, currentPolicy.expectedInTime, currentPolicy.expectedOutTime, data.officeOnly ? 1 : 0, data.active ? 1 : 0, data.id]
      if (data.clearPin) {
        await execute(`UPDATE employees SET name = ?, designation = ?, phone = ?, email = ?, pin_hash = '', cycle_start_day = ?, monthly_salary = ?, expected_in_time = ?, expected_out_time = ?, office_only = ?, active = ? WHERE id = ?`, [...common, ...tail])
      } else if (data.pin) {
        await execute(`UPDATE employees SET name = ?, designation = ?, phone = ?, email = ?, pin_hash = ?, cycle_start_day = ?, monthly_salary = ?, expected_in_time = ?, expected_out_time = ?, office_only = ?, active = ? WHERE id = ?`, [...common, hashEmployeePin(data.pin), ...tail])
      } else {
        await execute(`UPDATE employees SET name = ?, designation = ?, phone = ?, email = ?, cycle_start_day = ?, monthly_salary = ?, expected_in_time = ?, expected_out_time = ?, office_only = ?, active = ? WHERE id = ?`, [...common, ...tail])
      }
      await execute('INSERT INTO employee_policy_history (employee_id, effective_date, policy_json) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE policy_json = VALUES(policy_json)', [data.id, data.effectiveDate, JSON.stringify({ cycleStartDay: data.cycleStartDay, monthlySalary: data.monthlySalary, expectedInTime: data.expectedInTime, expectedOutTime: data.expectedOutTime, joiningDate: data.joiningDate, leavingDate: data.leavingDate, halfDayMinutes: data.halfDayMinutes, minimumHalfDayMinutes: data.minimumHalfDayMinutes, lateGraceMinutes: data.lateGraceMinutes, weeklyOffDays: data.weeklyOffDays, holidayDates: data.holidayDates })])
      await execute('UPDATE employees SET joining_date = ?, leaving_date = ?, half_day_minutes = ?, minimum_half_day_minutes = ?, late_grace_minutes = ?, weekly_off_days_json = ?, holiday_dates_json = ? WHERE id = ?', [currentPolicy.joiningDate || '', currentPolicy.leavingDate || '', currentPolicy.halfDayMinutes ?? 300, currentPolicy.minimumHalfDayMinutes ?? 0, currentPolicy.lateGraceMinutes ?? 0, JSON.stringify(currentPolicy.weeklyOffDays), JSON.stringify(currentPolicy.holidayDates), data.id])
      const rows = await queryRows('SELECT * FROM employees WHERE id = ? LIMIT 1', [data.id])
      if (!rows.length) throw new Error('Employee not found')
      return mapEmployeeRow(rows[0])
    }

    data.joiningDate ||= data.effectiveDate
    const token = generateEmployeeToken()
    const result = await execute(
      `INSERT INTO employees (name, designation, phone, email, access_token, pin_hash, cycle_start_day, monthly_salary, expected_in_time, expected_out_time, office_only, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [data.name, data.designation, data.phone, data.email, token, data.pin ? hashEmployeePin(data.pin) : '', data.cycleStartDay, data.monthlySalary, data.expectedInTime, data.expectedOutTime, data.officeOnly ? 1 : 0, data.active ? 1 : 0],
    )
    data.id = Number(result.insertId)
      await execute('INSERT INTO employee_policy_history (employee_id, effective_date, policy_json) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE policy_json = VALUES(policy_json)', [data.id, data.effectiveDate, JSON.stringify({ cycleStartDay: data.cycleStartDay, monthlySalary: data.monthlySalary, expectedInTime: data.expectedInTime, expectedOutTime: data.expectedOutTime, joiningDate: data.joiningDate, leavingDate: data.leavingDate, halfDayMinutes: data.halfDayMinutes, minimumHalfDayMinutes: data.minimumHalfDayMinutes, lateGraceMinutes: data.lateGraceMinutes, weeklyOffDays: data.weeklyOffDays, holidayDates: data.holidayDates })])
      await execute('UPDATE employees SET joining_date = ?, leaving_date = ?, half_day_minutes = ?, minimum_half_day_minutes = ?, late_grace_minutes = ?, weekly_off_days_json = ?, holiday_dates_json = ? WHERE id = ?', [data.joiningDate || '', data.leavingDate || '', data.halfDayMinutes, data.minimumHalfDayMinutes, data.lateGraceMinutes, JSON.stringify(data.weeklyOffDays), JSON.stringify(data.holidayDates), data.id])

    const rows = await queryRows('SELECT * FROM employees WHERE id = ? LIMIT 1', [data.id])
    return mapEmployeeRow(rows[0])
    })
  })

export const resetEmployeeDevice = createServerFn({ method: 'POST' })
  .middleware([superAdminMiddleware])
  .validator((data: unknown) => ({ id: Math.floor(numberValue((data as Record<string, unknown>)?.id, 0)) }))
  .handler(async ({ data }) => {
    await ensureAttendanceSchema()
    if (data.id <= 0) throw new Error('Invalid employee')
    await execute("UPDATE employees SET bound_device_hash = '' WHERE id = ?", [data.id])
    return { ok: true }
  })

export const regenerateEmployeeToken = createServerFn({ method: 'POST' })
  .middleware([superAdminMiddleware])
  .validator((data: unknown) => ({ id: Math.floor(numberValue((data as Record<string, unknown>)?.id, 0)) }))
  .handler(async ({ data }) => {
    await ensureAttendanceSchema()
    if (data.id <= 0) throw new Error('Invalid employee')
    const token = generateEmployeeToken()
    await execute("UPDATE employees SET access_token = ?, bound_device_hash = '' WHERE id = ?", [token, data.id])
    return { ok: true, accessToken: token }
  })

export const deleteEmployee = createServerFn({ method: 'POST' })
  .middleware([superAdminMiddleware])
  .validator((data: unknown) => ({ id: Math.floor(numberValue((data as Record<string, unknown>)?.id, 0)) }))
  .handler(async ({ data }) => {
    await ensureAttendanceSchema()
    if (data.id <= 0) throw new Error('Invalid employee')
    await execute("UPDATE employees SET active = 0, access_token = ?, bound_device_hash = '' WHERE id = ?", [generateEmployeeToken(), data.id])
    return { ok: true }
  })

export const permanentlyDeleteEmployee = createServerFn({ method: 'POST' })
  .middleware([superAdminMiddleware])
  .validator((data: unknown) => {
    const input = (data ?? {}) as Record<string, unknown>
    const id = Math.floor(numberValue(input.id, 0))
    const confirmationName = stringValue(input.confirmationName, 140)
    if (id <= 0 || !confirmationName) throw new Error('Employee ID and confirmation name are required')
    return { id, confirmationName }
  })
  .handler(async ({ data }) => {
    await ensureAttendanceSchema()
    await ensureAttendanceReliabilitySchema()
    return attendanceTransaction(async ({ queryRows, execute }) => {
      // Same parent lock as punches/corrections/finalization: deletion is atomic.
      const employees = await queryRows('SELECT id, name FROM employees WHERE id = ? FOR UPDATE', [data.id])
      if (!employees.length) throw new Error('Employee not found')
      if (String(employees[0].name).trim() !== data.confirmationName) throw new Error('Employee name does not match. Nothing was deleted.')
      await execute('DELETE p FROM attendance_punch_events p JOIN attendance_logs l ON l.id = p.log_id WHERE l.employee_id = ?', [data.id])
      await execute('DELETE p FROM attendance_original_punches p JOIN attendance_logs l ON l.id = p.log_id WHERE l.employee_id = ?', [data.id])
      await execute('DELETE FROM attendance_edit_history WHERE employee_id = ?', [data.id])
      await execute('DELETE FROM attendance_logs WHERE employee_id = ?', [data.id])
      await execute('DELETE FROM attendance_cycle_snapshots WHERE employee_id = ?', [data.id])
      await execute('DELETE FROM employee_policy_audit WHERE employee_id = ?', [data.id])
      await execute('DELETE FROM employee_policy_history WHERE employee_id = ?', [data.id])
      await execute('DELETE FROM salary_payments WHERE employee_id = ?', [data.id])
      await execute('DELETE FROM salary_slips WHERE employee_id = ?', [data.id])
      await execute('DELETE FROM employees WHERE id = ?', [data.id])
      return { ok: true }
    })
  })

export const saveAttendanceSettings = createServerFn({ method: 'POST' })
  .middleware([superAdminMiddleware])
  .validator((data: unknown): AttendanceSettings => {
    const input = (data ?? {}) as Record<string, unknown>
    const officeName = stringValue(input.officeName, 140) || 'Sangaria Office'
    const officeLat = Number(input.officeLat)
    const officeLng = Number(input.officeLng)
    const allowedRadiusM = Math.max(30, Math.min(5000, Math.round(numberValue(input.allowedRadiusM, 250))))
    const maxAccuracyM = Math.max(20, Math.min(2000, Math.round(numberValue(input.maxAccuracyM, 200))))
    const blockVpnOrForeignIp = Boolean(input.blockVpnOrForeignIp)
    const officeWifiIp = stringValue(input.officeWifiIp, 255)
    const requireOfficeWifiIp = Boolean(input.requireOfficeWifiIp)
    const requireSelfie = input.requireSelfie === undefined ? true : Boolean(input.requireSelfie)

    if (!Number.isFinite(officeLat) || officeLat < -90 || officeLat > 90) throw new Error('Valid office latitude is required')
    if (!Number.isFinite(officeLng) || officeLng < -180 || officeLng > 180) throw new Error('Valid office longitude is required')
    if (requireOfficeWifiIp && !officeWifiIp) throw new Error('Enter Office Wi-Fi IP before enabling Wi-Fi IP lock')

    return { officeName, officeLat, officeLng, allowedRadiusM, maxAccuracyM, blockVpnOrForeignIp, officeWifiIp, requireOfficeWifiIp, requireSelfie }
  })
  .handler(async ({ data }) => {
    await ensureAttendanceSchema()
    await execute('UPDATE site_settings SET attendance_settings_json = ? WHERE id = 1', [JSON.stringify(data)])
    return data
  })

export const updateAttendanceRecord = createServerFn({ method: 'POST' })
  .middleware([superAdminMiddleware])
  .validator((data: unknown) => {
    const input = (data ?? {}) as Record<string, unknown>
    const mode = stringValue(input.mode, 10) === 'create' ? 'create' : 'edit'
    const employeeId = Math.floor(numberValue(input.employeeId, 0))
    const workDate = stringValue(input.workDate, 10)
    const status = stringValue(input.status, 24) as AttendanceStatus
    const checkInTime = stringValue(input.checkInTime, 5)
    const checkOutTime = stringValue(input.checkOutTime, 5)
    const isLate = Boolean(input.isLate)
    const checkOutNextDay = Boolean(input.checkOutNextDay)
    const editNote = stringValue(input.editNote, 500)
    const absenceStart = stringValue(input.absenceStart, 16)
    const absenceEnd = stringValue(input.absenceEnd, 16)
    if (absenceStart || absenceEnd) {
      if (!absenceStart || !absenceEnd || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(absenceStart) || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(absenceEnd)) throw new Error('Enter both unapproved absence date/times')
      if (!editNote) throw new Error('A reason is required for unapproved absence')
    }

    if (employeeId <= 0) throw new Error('Employee is required')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(workDate) || !Number.isFinite(new Date(workDate + 'T00:00:00Z').getTime()) || new Date(workDate + 'T00:00:00Z').toISOString().slice(0, 10) !== workDate) throw new Error('Valid date (YYYY-MM-DD) is required')
    if (!['Present', 'Half Day', 'Review Required', 'Leave', 'Paid Leave', 'Unpaid Leave', 'Absent'].includes(status)) throw new Error('Invalid status')
    if (checkInTime && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(checkInTime)) throw new Error('Check-in time must be HH:MM')
    if (checkOutTime && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(checkOutTime)) throw new Error('Check-out time must be HH:MM')
    if (checkOutNextDay) throw new Error('Only same-day IST shifts are allowed')
    if (['Present', 'Half Day'].includes(status) && !checkInTime) throw new Error('Check-in time is required for a working shift')
    if (status === 'Half Day' && !checkOutTime) throw new Error('Check-out time is required for a completed Half Day')
    if (checkOutTime && !checkInTime) throw new Error('Check-in time is required when Check-out time is entered')
    if ((mode === 'edit' || ['Leave', 'Paid Leave', 'Unpaid Leave', 'Absent'].includes(status)) && !editNote) throw new Error('Please enter a reason for editing attendance or approving leave/absence')
    if (['Leave', 'Paid Leave', 'Unpaid Leave', 'Absent'].includes(status) && (checkInTime || checkOutTime || absenceStart)) throw new Error('Full-day leave/absence cannot include shift times or an absence interval')

    return { mode: mode as 'create' | 'edit', employeeId, workDate, status, checkInTime, checkOutTime, checkOutNextDay, isLate, editNote, absenceStart, absenceEnd }
  })
  .handler(async ({ data, context }): Promise<AttendanceLogRecord> => {
    await ensureAttendanceSchema()
    await ensureAttendanceReliabilitySchema()
    return attendanceTransaction(async ({ queryRows, execute }) => {
    const checkInDate = data.checkInTime ? new Date(`${data.workDate}T${data.checkInTime}:00+05:30`) : null
    const checkOutDate = data.checkOutTime ? new Date(`${data.workDate}T${data.checkOutTime}:00+05:30`) : null
    if (checkInDate && Number.isNaN(checkInDate.getTime())) throw new Error('Invalid check-in time')
    if (checkOutDate && Number.isNaN(checkOutDate.getTime())) throw new Error('Invalid check-out time')
    if (checkInDate && checkOutDate && checkOutDate.getTime() <= checkInDate.getTime()) {
      throw new Error('Check-out time must be after Check-in time (no overlapping times).')
    }

    if (checkInDate && checkOutDate && checkOutDate.getTime() - checkInDate.getTime() > 86_400_000) throw new Error('A single attendance shift cannot exceed 24 hours')

    const employees = await queryRows('SELECT * FROM employees WHERE id = ? FOR UPDATE', [data.employeeId])
    if (!employees.length) throw new Error('Employee not found')
    await assertCycleUnlocked(queryRows, data.employeeId, data.workDate)
    const existingRows = await queryRows('SELECT * FROM attendance_logs WHERE employee_id = ? AND work_date = ? LIMIT 1 FOR UPDATE', [data.employeeId, data.workDate])
    const prev = existingRows[0]
    if (checkInDate && !checkOutDate && data.workDate !== todayIstDate() && !(data.absenceStart && prev?.check_in_at && !prev.check_out_at && data.workDate < todayIstDate())) throw new Error('Check-out time is required outside today; only an absence note on an existing past open shift may stay pending')
    if (data.mode === 'edit' && !prev) throw new Error('Attendance record no longer exists. Refresh and retry.')
    if (checkInDate) {
      const overlap = await queryRows('SELECT id FROM attendance_logs WHERE employee_id = ? AND id <> ? AND check_in_at IS NOT NULL AND (? IS NULL OR check_in_at < ?) AND (check_out_at IS NULL OR check_out_at > ?) LIMIT 1', [data.employeeId, Number(prev?.id ?? 0), checkOutDate, checkOutDate, checkInDate])
      if (overlap.length) throw new Error('Attendance times overlap another shift for this employee')
    }
    const preservedBreaks = parseBreaksJson(prev?.breaks_json)
    if (['Leave', 'Paid Leave', 'Unpaid Leave', 'Absent'].includes(data.status)) preservedBreaks.length = 0
    if (checkOutDate) for (const br of preservedBreaks) if (br.outAt && !br.inAt) br.inAt = checkOutDate.toISOString()
    if (data.absenceStart) {
      const start = new Date(data.absenceStart + ':00+05:30'), end = new Date(data.absenceEnd + ':00+05:30')
      const localValue = (date: Date) => new Date(date.getTime() + 19_800_000).toISOString().slice(0, 16)
      if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || localValue(start) !== data.absenceStart || localValue(end) !== data.absenceEnd || end <= start) throw new Error('Invalid unapproved absence interval')
      if (!checkInDate || start < checkInDate || end > (checkOutDate ?? new Date()) || end > new Date()) throw new Error('Unapproved absence must be within the recorded shift and cannot be in the future')
      if (preservedBreaks.length >= 100) throw new Error('Too many intervals; contact support')
      preservedBreaks.push({outAt:start.toISOString(),inAt:end.toISOString(),outLat:null,outLng:null,outDistanceM:null,inLat:null,inLng:null,inDistanceM:null,note:'Admin - unapproved absence: ' + data.editNote})
    }
    const workMinutes = checkInDate && checkOutDate ? calculateWorkMinutes(checkInDate, checkOutDate, preservedBreaks) : 0
    const breakMinutes = checkInDate && checkOutDate ? calculateMergedBreakMinutes(checkInDate, checkOutDate, preservedBreaks) : 0
    if (data.absenceStart && checkOutDate) {
      const policies = await queryRows('SELECT employee_id, effective_date, policy_json FROM employee_policy_history WHERE employee_id = ?', [data.employeeId])
      const employee = resolveEmployeePolicy(mapEmployeeRow(employees[0]), policies.map(row => ({employeeId:Number(row.employee_id),effectiveDate:String(row.effective_date),policy:JSON.parse(String(row.policy_json))})), data.workDate)
      data.status = classifyShift(workMinutes, employee)
    }
    if (prev) {
      // Exclude image bytes; images and GPS columns are left unchanged by corrections.
      const { in_photo_data: _inPhoto, out_photo_data: _outPhoto, ...original } = prev
      await execute('INSERT IGNORE INTO attendance_original_punches (log_id, snapshot_json) VALUES (?, ?)', [Number(prev.id), JSON.stringify(original)])
    }

    if (data.mode === 'create' && prev) {
      throw new Error(`Attendance already exists for ${data.workDate}. Edit the existing row instead of creating an overlapping entry.`)
    }

    let logId = 0
    let summaryText = ''
    if (prev) {
      let flags: string[] = []
      try { flags = JSON.parse(String(prev.out_flags_json || '[]')) as string[] } catch { /* legacy empty flags */ }
      const approvedFlags = [...new Set([...flags.filter((flag) => !checkOutDate || !flag.startsWith('MISSING_OUT')), 'ADMIN_REVIEW_APPROVED'])]
      await execute('UPDATE attendance_logs SET out_flags_json = ? WHERE id = ?', [JSON.stringify(approvedFlags), Number(prev.id)])
      logId = Number(prev.id)
      const oldIn = prev.check_in_at ? new Date(String(prev.check_in_at)).toISOString() : '-'
      const oldOut = prev.check_out_at ? new Date(String(prev.check_out_at)).toISOString() : '-'
      const newIn = checkInDate?.toISOString() || '-'
      const newOut = checkOutDate?.toISOString() || '-'
      const parts = [
        String(prev.status) !== data.status ? `Status: ${prev.status} -> ${data.status}` : '',
        oldIn !== newIn ? `In (UTC): ${oldIn} -> ${newIn}` : '',
        oldOut !== newOut ? `Out (UTC): ${oldOut} -> ${newOut}` : '',
        Number(prev.work_minutes) !== workMinutes ? `Net minutes: ${prev.work_minutes} -> ${workMinutes}` : '',
        Number(prev.break_minutes) !== breakMinutes ? `Break minutes: ${prev.break_minutes} -> ${breakMinutes}` : '',
        Boolean(prev.is_late) !== data.isLate ? `Late: ${Boolean(prev.is_late)} -> ${data.isLate}` : '',
      ].filter(Boolean)
      summaryText = parts.join(' | ') || 'Record re-saved'

      await execute(
        'UPDATE attendance_logs SET check_in_at = ?, check_out_at = ?, status = ?, work_minutes = ?, break_minutes = ?, is_late = ?, edited_by = ?, edit_note = ? WHERE id = ?',
        [checkInDate, checkOutDate, data.status, workMinutes, breakMinutes, data.isLate ? 1 : 0, `${context.user.name} (${context.user.email})`, data.editNote, logId],
      )
    } else {
      summaryText = `Status: ${data.status} | In: ${data.checkInTime || '—'} | Out: ${data.checkOutTime || '—'}`
      const res = await execute(
        `INSERT INTO attendance_logs (employee_id, work_date, check_in_at, check_out_at, status, work_minutes, is_late, edited_by, edit_note, out_flags_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.employeeId, data.workDate, checkInDate, checkOutDate, data.status, workMinutes, data.isLate ? 1 : 0, `${context.user.name} (${context.user.email})`, data.editNote || 'Manual entry by Super Admin', JSON.stringify(['ADMIN_REVIEW_APPROVED'])],
      )
      logId = Number(res.insertId)
    }

    await execute('UPDATE attendance_logs SET breaks_json = ?, break_minutes = ? WHERE id = ?', [JSON.stringify(preservedBreaks), breakMinutes, logId])
    if (data.absenceStart) {
      summaryText += ` | Unapproved absence (IST): ${data.absenceStart} to ${data.absenceEnd}`
    }

    await execute(
      `INSERT INTO attendance_edit_history (attendance_log_id, employee_id, work_date, editor_name, editor_email, action, changes_summary, reason, before_json, after_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [logId, data.employeeId, data.workDate, context.user.name, context.user.email, prev ? 'edit' : 'create', summaryText, data.editNote || 'Manual entry', prev ? JSON.stringify({ checkInAt: prev.check_in_at, checkOutAt: prev.check_out_at, status: prev.status, workMinutes: prev.work_minutes, breakMinutes: prev.break_minutes, isLate: Boolean(prev.is_late) }) : null, JSON.stringify({ checkInAt: checkInDate, checkOutAt: checkOutDate, status: data.status, workMinutes, breakMinutes, isLate: data.isLate, ...(data.absenceStart ? {absenceStart:data.absenceStart,absenceEnd:data.absenceEnd} : {}) })],
    )

    const [rows, historyRows] = await Promise.all([
      queryRows(`SELECT ${LOG_COLS} FROM attendance_logs l JOIN employees e ON e.id = l.employee_id WHERE l.id = ? LIMIT 1`, [logId]),
      queryRows('SELECT * FROM attendance_edit_history WHERE attendance_log_id = ? ORDER BY created_at DESC, id DESC', [logId]),
    ])
    return mapAttendanceRow(rows[0], historyRows.map(mapEditHistoryRow))
    })
  })

export const exportAttendanceExcel = createServerFn({ method: 'GET' })
  .middleware([superAdminMiddleware])
  .validator((data: unknown) => {
    const input = (data ?? {}) as Record<string, unknown>
    const rawMonth = stringValue(input.month, 7)
    return { selectedMonth: /^\d{4}-(?:0[1-9]|1[0-2])$/.test(rawMonth) ? rawMonth : currentIstMonth(), employeeId: Math.max(0, Math.floor(numberValue(input.employeeId, 0))) }
  })
  .handler(async ({ data }) => {
    await ensureAttendanceSchema()
    await ensureAttendanceReliabilitySchema()
    const [year, month] = data.selectedMonth.split('-').map(Number)
    const rangeStart = new Date(Date.UTC(year, month - 2, 1)).toISOString().slice(0, 10)
    const rangeEnd = new Date(Date.UTC(year, month + 1, 28)).toISOString().slice(0, 10)

    const [empRows, logRows] = await Promise.all([
      data.employeeId > 0 ? queryRows('SELECT * FROM employees WHERE id = ? ORDER BY name ASC', [data.employeeId]) : queryRows('SELECT * FROM employees ORDER BY active DESC, name ASC'),
      data.employeeId > 0
        ? queryRows(`SELECT ${LOG_COLS} FROM attendance_logs l JOIN employees e ON e.id = l.employee_id WHERE l.employee_id = ? AND l.work_date >= ? AND l.work_date <= ? ORDER BY l.work_date ASC`, [data.employeeId, rangeStart, rangeEnd])
        : queryRows(`SELECT ${LOG_COLS} FROM attendance_logs l JOIN employees e ON e.id = l.employee_id WHERE l.work_date >= ? AND l.work_date <= ? ORDER BY e.name ASC, l.work_date ASC`, [rangeStart, rangeEnd]),
    ])

   const employees = empRows.map(mapEmployeeRow)
    let logs = logRows.map((r) => mapAttendanceRow(r))
    const [frozenRows, policies] = await Promise.all([
      data.employeeId > 0
        ? queryRows('SELECT employee_id, snapshot_json FROM attendance_cycle_snapshots WHERE selected_month = ? AND employee_id = ?', [data.selectedMonth, data.employeeId])
        : queryRows('SELECT employee_id, snapshot_json FROM attendance_cycle_snapshots WHERE selected_month = ?', [data.selectedMonth]),
      readEmployeePolicies(data.employeeId || undefined),
    ])
    const frozenByEmp = new Map<number, EmployeeCycleSummary>()
    for (const frozen of frozenRows) {
      const saved = parseSnapshot(frozen.snapshot_json)
      frozenByEmp.set(Number(frozen.employee_id), saved.summary)
      logs = logs.filter((log) => log.employeeId !== Number(frozen.employee_id) || log.workDate < saved.summary.cycleStartDate || log.workDate > saved.summary.cycleEndDate).concat(saved.logs)
    }
    const summaries = buildEmployeeCycleSummaries(employees, logs, data.selectedMonth, todayIstDate(), policies)
      .map((summary) => frozenByEmp.has(summary.employee.id) ? { ...frozenByEmp.get(summary.employee.id)!, finalized: true } : summary)
    const formatIst = (iso: string) => (iso ? new Date(iso).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }) : '')
    const mapUrl = (lat: number | null, lng: number | null) => (lat !== null && lng !== null ? `https://maps.google.com/?q=${lat},${lng}` : '')
    const fmtHrs = (mins: number) => `${Math.floor(mins / 60)}h ${mins % 60}m`

    const summaryRows = summaries.map((s) => [
      s.employee.name, s.employee.designation || '-', `Day ${s.employee.cycleStartDay}`, `${s.cycleStartDate} to ${s.cycleEndDate}`,
      s.totalDays, s.sundaysCount, s.workingDays, s.presentDays, s.halfDays, s.leaveDays, s.absentDays,
      s.payableDays, s.employee.monthlySalary, s.perDaySalary, s.earnedSalary, s.lateCount, s.flaggedCount, fmtHrs(s.totalWorkMinutes), fmtHrs(s.offDayWorkMinutes ?? 0),
    ])

    const filteredLogs = logs.filter((log) => {
      const s = summaries.find((item) => item.employee.id === log.employeeId)
      return s ? log.workDate >= s.cycleStartDate && log.workDate <= s.cycleEndDate : false
    })

    const detailRows = filteredLogs.map((log) => [
      log.workDate, log.employeeName, log.designation || '-', log.status, formatIst(log.checkInAt), formatIst(log.checkOutAt),
      fmtHrs(log.workMinutes), log.isLate ? 'Late' : 'On time', log.inDistanceM !== null ? `${log.inDistanceM}m` : '', mapUrl(log.inLat, log.inLng),
      log.inIp ? `${log.inIp} (${log.inIpCity || log.inIpCountry || 'IN'})` : '', log.outDistanceM !== null ? `${log.outDistanceM}m` : '', mapUrl(log.outLat, log.outLng),
      [...log.inFlags, ...log.outFlags].join(', '), log.editedBy, log.editNote, log.breakMinutes, log.checkInAt && !log.checkOutAt ? 'Missing OUT / review' : '', log.editedBy ? 'Admin corrected/manual' : 'Employee punch',
    ])

    const ids = filteredLogs.map((log) => log.id)
    const histories = ids.length ? await queryRows(`SELECT h.*, e.name AS employee_name FROM attendance_edit_history h JOIN employees e ON e.id = h.employee_id WHERE h.attendance_log_id IN (${ids.map(() => '?').join(',')}) ORDER BY h.created_at`, ids) : []
    const evidence = ids.length ? await queryRows(`SELECT log_id, action, snapshot_json, created_at FROM attendance_punch_events WHERE log_id IN (${ids.map(() => '?').join(',')}) UNION ALL SELECT log_id, 'original-baseline' AS action, snapshot_json, created_at FROM attendance_original_punches WHERE log_id IN (${ids.map(() => '?').join(',')}) ORDER BY created_at`, [...ids, ...ids]) : []
    const breakRows = filteredLogs.flatMap((log) => log.breaks.map((br) => [log.workDate, log.employeeName, br.outAt, br.inAt || 'Open', br.note, mapUrl(br.outLat, br.outLng), mapUrl(br.inLat, br.inLng)]))
    const historyRows = histories.map((h) => [String(h.work_date), String(h.employee_name), String(h.editor_name), String(h.editor_email), String(h.action), String(h.changes_summary), String(h.reason), new Date(String(h.created_at)).toISOString(), h.before_json ? String(h.before_json) : '', h.after_json ? String(h.after_json) : ''])
    const evidenceRows = evidence.map((row) => [Number(row.log_id), String(row.action), new Date(String(row.created_at)).toISOString(), String(row.snapshot_json)])
    const { createLeadsWorkbook } = await import('./xlsx.server')
    return {
      filename: `bei-attendance-salary-${data.selectedMonth}${data.employeeId ? `-emp-${data.employeeId}` : ''}.xlsx`,
      base64: createLeadsWorkbook([
        {
          name: 'Salary & Cycle Summary',
          rows: [
            ['Employee', 'Role', 'Cycle Day', 'Cycle Period', 'Cycle Days', 'Sundays', 'Working Days', 'Present', 'Half Day', 'Leave', 'Absent', 'Payable Days', 'Monthly Salary (INR)', 'Per Working Day (INR)', 'Calculated Salary (INR)', 'Late', 'Flags', 'Total Hours', 'Off-day Hours (separate)'],
            ...summaryRows,
          ],
          widths: [20, 16, 10, 24, 11, 10, 12, 10, 10, 10, 10, 12, 18, 18, 20, 8, 8, 12, 18],
          headerRows: [1],
          filter: `A1:S${Math.max(1, summaryRows.length + 1)}`,
        },
        {
          name: 'Daily Logs & GPS',
          rows: [
            ['Date', 'Employee', 'Role', 'Status', 'Check In', 'Check Out', 'Worked', 'Punctuality', 'In Distance', 'In Map Link', 'In Network', 'Out Distance', 'Out Map Link', 'Flags', 'Edited By', 'Edit Reason', 'Break Minutes', 'Review', 'Source'],
            ...detailRows,
          ],
          widths: [13, 20, 16, 12, 12, 12, 12, 12, 12, 34, 24, 12, 34, 24, 26, 30, 16, 16, 18],
          headerRows: [1],
          filter: `A1:S${Math.max(1, detailRows.length + 1)}`,
        },
        { name: 'Break Details', rows: [['Work Date', 'Employee', 'Out (UTC)', 'Return (UTC)', 'Reason', 'Out Map', 'Return Map'], ...breakRows], headerRows: [1], widths: [13, 22, 26, 26, 35, 35, 35] },
        { name: 'Correction History', rows: [['Date', 'Employee', 'Editor', 'Editor Email', 'Action', 'Changes', 'Reason', 'Saved (UTC)', 'Before JSON (UTC)', 'After JSON (UTC)'], ...historyRows], headerRows: [1], widths: [13, 22, 22, 30, 12, 60, 45, 26, 80, 80] },
        { name: 'Original Punch Evidence', rows: [['Log ID', 'Action', 'Saved (UTC)', 'Immutable Evidence JSON'], ...evidenceRows], headerRows: [1], widths: [12, 16, 26, 100] },
      ]),
    }
  })

function parseSnapshot(value: unknown): { summary: EmployeeCycleSummary; logs: AttendanceLogRecord[] } {
  return JSON.parse(String(value)) as { summary: EmployeeCycleSummary; logs: AttendanceLogRecord[] }
}
async function applyFinalizedSummaries(summaries: EmployeeCycleSummary[], month: string) {
  const rows = await queryRows('SELECT employee_id, snapshot_json FROM attendance_cycle_snapshots WHERE selected_month = ?', [month])
  const finalized = new Map(rows.map((row) => [Number(row.employee_id), parseSnapshot(row.snapshot_json).summary]))
  return summaries.map((summary) => finalized.has(summary.employee.id) ? { ...finalized.get(summary.employee.id)!, finalized: true } : summary)
}
const reportInput = (data: unknown) => {
  const input = (data ?? {}) as Record<string, unknown>
  const month = stringValue(input.month, 7)
  if (!/^\d{4}-(?:0[1-9]|1[0-2])$/.test(month)) throw new Error('Valid report month is required')
  return { month, employeeId: Math.max(0, Math.floor(numberValue(input.employeeId, 0))) }
}

export const getAttendanceCycleFinalizations = createServerFn({ method: 'GET' })
  .middleware([superAdminMiddleware])
  .validator(reportInput)
  .handler(async ({ data }) => {
    await ensureAttendanceReliabilitySchema()
    const rows = await queryRows('SELECT employee_id, selected_month, finalized_by, created_at FROM attendance_cycle_snapshots WHERE selected_month = ?', [data.month])
    return rows.map((row) => ({ employeeId: Number(row.employee_id), selectedMonth: String(row.selected_month), finalizedBy: String(row.finalized_by), finalizedAt: new Date(String(row.created_at)).toISOString() }))
  })

export const finalizeAttendanceCycle = createServerFn({ method: 'POST' })
  .middleware([superAdminMiddleware])
  .validator(reportInput)
  .handler(async ({ data, context }) => {
    if (!data.employeeId) throw new Error('Select an employee to finalize')
    await ensureAttendanceSchema()
    await ensureAttendanceReliabilitySchema()
    return attendanceTransaction(async ({ queryRows, execute }) => {
      // Same employee lock as punches and corrections prevents a report/punch race.
      const empRows = await queryRows('SELECT * FROM employees WHERE id = ? FOR UPDATE', [data.employeeId])
      if (!empRows.length) throw new Error('Employee not found')
      const policyRows = await queryRows('SELECT employee_id, effective_date, policy_json FROM employee_policy_history WHERE employee_id = ?', [data.employeeId])
      const policies = policyRows.map((row) => ({ employeeId: Number(row.employee_id), effectiveDate: String(row.effective_date), policy: JSON.parse(String(row.policy_json)) as Partial<EmployeeRecord> }))
      const employee = mapEmployeeRow(empRows[0])
      const resolved = resolveEmployeePolicy(employee, policies, data.month + '-01')
      const range = getEmployeeCycleRange(data.month, resolved.cycleStartDay)
      if (range.endDate >= todayIstDate()) throw new Error('Only completed cycles can be finalized')
      const logRows = await queryRows(`SELECT ${LOG_COLS} FROM attendance_logs l JOIN employees e ON e.id = l.employee_id WHERE l.employee_id = ? AND l.work_date BETWEEN ? AND ? ORDER BY l.work_date`, [employee.id, range.startDate, range.endDate])
      const logs = logRows.map((row) => mapAttendanceRow(row))
      if (logs.some((log) => (log.checkInAt && !log.checkOutAt) || (log.outFlags.includes('AUTO_CHECKOUT_10PM') && !log.outFlags.includes('ADMIN_REVIEW_APPROVED')))) throw new Error('Resolve missing or automatic check-outs before finalizing')
      const overlap = await queryRows('SELECT id FROM attendance_cycle_snapshots WHERE employee_id = ? AND cycle_start_date <= ? AND cycle_end_date >= ? LIMIT 1', [employee.id, range.endDate, range.startDate])
      if (overlap.length) throw new Error('This cycle overlaps an already finalized report')
      const summary = buildEmployeeCycleSummaries([employee], logs, data.month, todayIstDate(), policies)[0]
      if ((summary.reviewRequiredCount ?? 0) > 0) throw new Error('Resolve insufficient-hours attendance before finalizing')
      await execute('INSERT INTO attendance_cycle_snapshots (employee_id, selected_month, cycle_start_date, cycle_end_date, snapshot_json, finalized_by) VALUES (?, ?, ?, ?, ?, ?)', [employee.id, data.month, summary.cycleStartDate, summary.cycleEndDate, JSON.stringify({ summary, logs }), context.user.email])
      return { ok: true }
    })
  })

export const exportAttendanceCsv = createServerFn({ method: 'GET' })
  .middleware([superAdminMiddleware])
  .validator(reportInput)
  .handler(async ({ data }) => {
    const snapshot = await buildAdminAttendanceSnapshot(data.month, true)
    const summaries = snapshot.summaries.filter((summary) => !data.employeeId || summary.employee.id === data.employeeId)
    const rows: unknown[][] = [['Employee', 'Cycle Start', 'Cycle End', 'Present', 'Half Day', 'Leave', 'Absent', 'Missing OUT', 'Payable Days', 'Monthly Salary INR', 'Calculated Salary INR', 'Work Minutes', 'Off-day Work Minutes (separate)']]
    for (const summary of summaries) rows.push([summary.employee.name, summary.cycleStartDate, summary.cycleEndDate, summary.presentDays, summary.halfDays, summary.leaveDays, summary.absentDays, summary.missedCheckOutCount, summary.payableDays, summary.employee.monthlySalary, summary.earnedSalary, summary.totalWorkMinutes, summary.offDayWorkMinutes ?? 0])
    return { filename: `bei-attendance-salary-${data.month}${data.employeeId ? `-emp-${data.employeeId}` : ''}.csv`, base64: Buffer.from(csvText(rows), 'utf8').toString('base64') }
  })

export const getAttendancePhotoCleanupPreview = createServerFn({ method: 'GET' })
  .middleware([superAdminMiddleware])
  .handler(async () => {
    await ensureAttendanceSchema()
    const cutoff = new Date(Date.parse(todayIstDate() + 'T00:00:00Z') - 60 * 86_400_000).toISOString().slice(0, 10)
    const rows = await queryRows('SELECT COUNT(*) AS records, COALESCE(SUM(in_photo_data IS NOT NULL) + SUM(out_photo_data IS NOT NULL), 0) AS photos FROM attendance_logs WHERE work_date < ? AND (in_photo_data IS NOT NULL OR out_photo_data IS NOT NULL)', [cutoff])
    return { cutoff, records: Number(rows[0]?.records ?? 0), photos: Number(rows[0]?.photos ?? 0) }
  })

export const cleanOldAttendancePhotos = createServerFn({ method: 'POST' })
  .middleware([superAdminMiddleware])
  .validator((raw: unknown) => {
    const data = (raw ?? {}) as Record<string, unknown>
    const cutoff = stringValue(data.cutoff, 10)
    const latest = new Date(Date.parse(todayIstDate() + 'T00:00:00Z') - 60 * 86_400_000).toISOString().slice(0, 10)
    if (data.confirmed !== true || !/^\d{4}-\d{2}-\d{2}$/.test(cutoff) || cutoff > latest) throw new Error('Confirm the photo cleanup preview first')
    return { cutoff }
  })
  .handler(async ({ data }) => {
    await ensureAttendanceSchema()
    const result = await execute('UPDATE attendance_logs SET in_photo_data = NULL, out_photo_data = NULL WHERE work_date < ? AND (in_photo_data IS NOT NULL OR out_photo_data IS NOT NULL) LIMIT 2000', [data.cutoff])
    return { cleared: result.affectedRows }
  })
function validPayrollDate(value: unknown) {
  const date = stringValue(value, 10), parsed = new Date(date + 'T00:00:00Z')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0,10) !== date) throw new Error('Valid payroll date is required')
  return date
}
const rangeReportInput = (raw: unknown) => {
  const input=(raw??{}) as Record<string,unknown>, employeeId=Math.floor(numberValue(input.employeeId)), from=validPayrollDate(input.from), to=validPayrollDate(input.to)
  if (employeeId<=0 || to<from || to>todayIstDate() || Date.parse(to)-Date.parse(from)>366*86400000) throw new Error('Select one employee and a past/current date range of up to 366 days')
  return {employeeId,from,to}
}

async function buildEmployeeRangeReport(data: ReturnType<typeof rangeReportInput>) {
  await ensureAttendanceSchema(); await ensureAttendanceReliabilitySchema()
  const employees=await queryRows('SELECT * FROM employees WHERE id = ? LIMIT 1',[data.employeeId])
  if (!employees.length) throw new Error('Employee not found')
  const employee=mapEmployeeRow(employees[0]), policies=await readEmployeePolicies(employee.id)
  const logRows=await queryRows(`SELECT ${LOG_COLS} FROM attendance_logs l JOIN employees e ON e.id=l.employee_id WHERE l.employee_id=? AND l.work_date<=? ORDER BY l.work_date`,[employee.id,todayIstDate()])
  const logs=logRows.map(row=>mapAttendanceRow(row))
  const snapshots=await queryRows('SELECT cycle_start_date, cycle_end_date, snapshot_json FROM attendance_cycle_snapshots WHERE employee_id=?',[employee.id])
  const slipRows = await queryRows("SELECT slip_number, cycle_start_date, cycle_end_date, snapshot_json, created_at FROM salary_slips WHERE employee_id = ? AND status = 'issued'", [employee.id])
  // A slip is the audited source for its adjustments. Voiding it removes those
  // adjustments; actual salary payments remain independent cash records.
  const adjustments = slipRows.map(row => {
    const saved = JSON.parse(String(row.snapshot_json)) as SalarySlipSnapshot
    const issuedOn = saved.adjustmentDate || new Date(String(row.created_at)).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
    const start = String(row.cycle_start_date), end = String(row.cycle_end_date)
    const date = issuedOn < start ? start : issuedOn > end ? end : issuedOn
    return { slipNumber: String(row.slip_number), date, amount: Math.round((saved.netPay - saved.earnedSalary) * 100) / 100 }
  }).filter(item => item.amount !== 0)
  const calculate=(from:string,to:string,includeDays:boolean) => {
    const report=buildPayrollRange(employee,logs,policies,from,to,todayIstDate(),includeDays)
    let partialFinalized=false
    for (const row of snapshots) {
      const start=String(row.cycle_start_date),end=String(row.cycle_end_date)
      if (end<from||start>to) continue
      if (start>=from&&end<=to) {
        const stored=parseSnapshot(row.snapshot_json).summary
        const live=report.cycles.find(c=>c.cycleStartDate===start&&c.cycleEndDate===end)
        if (!live) throw new Error('Finalized cycle conflicts with current payroll boundaries; review the policy before reporting')
        report.earned+=stored.earnedSalary-live.earnedSalary
      } else partialFinalized=true
    }
    const appliedAdjustments = adjustments.filter(item => item.date >= from && item.date <= to)
    const adjustmentTotal = appliedAdjustments.reduce((sum, item) => sum + Math.round(item.amount * 100), 0) / 100
    return {...report,earned:Math.round((report.earned + adjustmentTotal) * 100) / 100,attendanceEarned:report.earned,adjustmentTotal,adjustments:appliedAdjustments,partialFinalized}
  }
  const report=calculate(data.from,data.to,true)
  const baseline=[employee.joiningDate,logs[0]?.workDate,data.from].filter(Boolean).sort()[0]!
  const throughToday=calculate(baseline,todayIstDate(),false)
  const paymentRows=await queryRows('SELECT * FROM salary_payments WHERE employee_id=? ORDER BY paid_on DESC,id DESC',[employee.id])
  const payments=paymentRows.map(row=>({id:Number(row.id),amount:Number(row.amount_paise)/100,paidOn:String(row.paid_on),from:String(row.period_from),to:String(row.period_to),method:String(row.method),reference:String(row.reference_text),note:String(row.note),recordedBy:String(row.recorded_by),voided:Boolean(row.voided_at),voidReason:String(row.void_reason)}))
  const active=payments.filter(p=>!p.voided&&p.paidOn<=todayIstDate())
  const paid=active.reduce((n,p)=>n+Math.round(p.amount*100),0)/100
  const allocated=active.filter(p=>p.from>=data.from&&p.to<=data.to).reduce((n,p)=>n+Math.round(p.amount*100),0)/100
  const overlappingPayments=active.filter(p=>p.from<=data.to&&p.to>=data.from&&!(p.from>=data.from&&p.to<=data.to)).length
  return {employee:{id:employee.id,name:employee.name},report,baseline,throughToday:{earned:throughToday.earned,paid,pending:Math.max(0,throughToday.earned-paid),advance:Math.max(0,paid-throughToday.earned),missingOut:throughToday.missingOut,reviewRequired:throughToday.reviewRequired},allocatedPaid:allocated,rangePending:Math.max(0,report.earned-allocated),overlappingPayments,payments}
}

export const getEmployeeRangeReport = createServerFn({method:'GET'}).middleware([superAdminMiddleware]).validator(rangeReportInput).handler(async({data})=>buildEmployeeRangeReport(data))

export const recordSalaryPayment = createServerFn({method:'POST'}).middleware([superAdminMiddleware]).validator((raw:unknown)=>{
  const input=(raw??{}) as Record<string,unknown>, employeeId=Math.floor(numberValue(input.employeeId)), amount=Number(input.amount), paidOn=validPayrollDate(input.paidOn), from=validPayrollDate(input.from), to=validPayrollDate(input.to)
  const method=stringValue(input.method,30), reference=stringValue(input.reference,190), note=stringValue(input.note,500), requestKey=stringValue(input.requestKey,64)
  if(employeeId<=0||!Number.isFinite(amount)||amount<=0||amount>10000000||Math.abs(amount*100-Math.round(amount*100))>0.00001) throw new Error('Enter a positive payment amount with up to two decimals')
  if(to<from||paidOn>todayIstDate()||to>todayIstDate()) throw new Error('Payment and salary period must not be in the future')
  if(!['Cash','Bank transfer','UPI','Cheque','Other'].includes(method)||!note||! /^[a-zA-Z0-9-]{16,64}$/.test(requestKey)) throw new Error('Payment method, note and request ID are required')
  return {employeeId,amountPaise:Math.round(amount*100),paidOn,from,to,method,reference,note,requestKey}
}).handler(async({data,context})=>{
  await ensureAttendanceSchema();await ensureAttendanceReliabilitySchema()
  return attendanceTransaction(async({queryRows,execute})=>{
    const employees=await queryRows('SELECT id FROM employees WHERE id=? FOR UPDATE',[data.employeeId]);if(!employees.length) throw new Error('Employee not found')
    const existing=await queryRows('SELECT * FROM salary_payments WHERE request_key=?',[data.requestKey])
    if(existing.length){const previous=existing[0];if(Number(previous.employee_id)!==data.employeeId||Number(previous.amount_paise)!==data.amountPaise||String(previous.paid_on)!==data.paidOn||String(previous.period_from)!==data.from||String(previous.period_to)!==data.to||String(previous.method)!==data.method||String(previous.reference_text)!==data.reference||String(previous.note)!==data.note) throw new Error('Payment request changed; reload and retry');return {id:Number(previous.id)}}
    const result=await execute('INSERT INTO salary_payments (employee_id,request_key,amount_paise,paid_on,period_from,period_to,method,reference_text,note,recorded_by) VALUES (?,?,?,?,?,?,?,?,?,?)',[data.employeeId,data.requestKey,data.amountPaise,data.paidOn,data.from,data.to,data.method,data.reference,data.note,context.user.email]);return {id:Number(result.insertId)}
  })
})

export const reverseSalaryPayment = createServerFn({method:'POST'}).middleware([superAdminMiddleware]).validator((raw:unknown)=>{
  const input=(raw??{}) as Record<string,unknown>,id=Math.floor(numberValue(input.id)),reason=stringValue(input.reason,500)
  if(id<=0||!reason) throw new Error('Payment and reversal reason are required');return {id,reason}
}).handler(async({data,context})=>{
  await ensureAttendanceReliabilitySchema()
  return attendanceTransaction(async({queryRows,execute})=>{
    const payment=await queryRows('SELECT employee_id FROM salary_payments WHERE id=?',[data.id]);if(!payment.length)throw new Error('Payment not found')
    await queryRows('SELECT id FROM employees WHERE id=? FOR UPDATE',[Number(payment[0].employee_id)])
    await execute("UPDATE salary_payments SET voided_by=?,void_reason=?,voided_at=UTC_TIMESTAMP() WHERE id=? AND voided_at IS NULL",[context.user.email,data.reason,data.id]);return {ok:true}
  })
})

export const exportEmployeeRangeReport = createServerFn({method:'GET'}).middleware([superAdminMiddleware]).validator(rangeReportInput).handler(async({data})=>{
  const value=await buildEmployeeRangeReport(data),{createLeadsWorkbook}=await import('./xlsx.server')
  const time=(iso:string)=>iso?new Date(iso).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}):''
  return {filename:`bei-attendance-emp-${data.employeeId}-${data.from}-to-${data.to}.xlsx`,base64:createLeadsWorkbook([
    {name:'Salary Summary',rows:[['Employee',value.employee.name],['From',data.from],['To',data.to],['Earned INR',value.report.earned],['Payable days',value.report.payableDays],['Net work minutes',value.report.workMinutes],['Payments fully allocated to range INR',value.allocatedPaid],['Range pending INR',value.overlappingPayments?'Review overlapping payment periods':value.rangePending],['Partially overlapping payments (not apportioned)',value.overlappingPayments],['Till-date earned INR',value.throughToday.earned],['Till-date paid INR',value.throughToday.paid],['Till-date pending INR',value.throughToday.pending],['Advance / overpaid INR',value.throughToday.advance],['Ledger baseline',value.baseline],['Missing OUT',value.report.missingOut],['Review required',value.report.reviewRequired],['Partial finalized cycle estimate',value.report.partialFinalized?'Yes':'No'],['Note','Day estimates are rounded; range total is calculated per full payroll-cycle denominator. No overtime pay.']],widths:[48,85]},
    {name:'Daily Attendance',rows:[['Date','Status','IN IST','OUT IST','Net minutes','Break/absence minutes','Payable days','Estimated earned INR','Note'],...value.report.days.map(d=>[d.date,d.status,time(d.checkIn),time(d.checkOut),d.workMinutes,d.deductedMinutes,d.payableDays,d.earned,d.note])],headerRows:[1],widths:[14,28,25,25,16,24,16,24,50]},
    {name:'Payments',rows:[['ID','Paid on','Amount INR','Period from','Period to','Method','Reference','Note','Recorded by','Reversed','Reversal reason'],...value.payments.map(p=>[p.id,p.paidOn,p.amount,p.from,p.to,p.method,p.reference,p.note,p.recordedBy,p.voided?'Yes':'No',p.voidReason])],headerRows:[1],widths:[10,14,18,14,14,20,30,45,35,12,45]},
    {name:'Slip Adjustments',rows:[['Slip','Effective date','Net adjustment INR'],...value.report.adjustments.map(item=>[item.slipNumber,item.date,item.amount])],headerRows:[1],widths:[32,18,24]}
  ])}
})
function twoDigitsToWords(n: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  if (n < 20) return ones[n]
  return `${tens[Math.floor(n / 10)]}${n % 10 ? ' ' + ones[n % 10] : ''}`
}

function integerToIndianWords(n: number): string {
  if (n === 0) return 'Zero'
  const parts: string[] = []
  const crore = Math.floor(n / 10_000_000)
  if (crore) { parts.push(`${integerToIndianWords(crore)} Crore`); n %= 10_000_000 }
  const lakh = Math.floor(n / 100_000)
  if (lakh) { parts.push(`${twoDigitsToWords(lakh)} Lakh`); n %= 100_000 }
  const thousand = Math.floor(n / 1_000)
  if (thousand) { parts.push(`${twoDigitsToWords(thousand)} Thousand`); n %= 1_000 }
  const hundred = Math.floor(n / 100)
  if (hundred) { parts.push(`${twoDigitsToWords(hundred)} Hundred`); n %= 100 }
  if (n > 0) parts.push(twoDigitsToWords(n))
  return parts.join(' ')
}

function amountInWordsInr(amount: number): string {
  const totalPaise = Math.max(0, Math.round(amount * 100))
  const rupees = Math.floor(totalPaise / 100)
  const paise = totalPaise % 100
  return paise > 0
    ? `Indian Rupees ${integerToIndianWords(rupees)} and ${twoDigitsToWords(paise)} Paise Only`
    : `Indian Rupees ${integerToIndianWords(rupees)} Only`
}

function formatSlipMonthLabel(month: string): string {
  const [y, m] = month.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-IN', { month: 'long', year: 'numeric', timeZone: 'UTC' })
}

function mapSalarySlipRow(row: Record<string, unknown>): SalarySlipRecord {
  return {
    id: Number(row.id),
    slipNumber: String(row.slip_number),
    employeeId: Number(row.employee_id),
    employeeName: String(row.employee_name ?? ''),
    selectedMonth: String(row.selected_month),
    cycleStartDate: String(row.cycle_start_date),
    cycleEndDate: String(row.cycle_end_date),
    netPay: Number(row.net_pay_paise) / 100,
    status: String(row.status) === 'voided' ? 'voided' : 'issued',
    issuedBy: String(row.issued_by),
    issuedAt: new Date(String(row.created_at)).toISOString(),
    voidedBy: String(row.voided_by ?? ''),
    voidReason: String(row.void_reason ?? ''),
    voidedAt: row.voided_at ? new Date(String(row.voided_at)).toISOString() : '',
    snapshot: JSON.parse(String(row.snapshot_json)) as SalarySlipSnapshot,
  }
}

export const listSalarySlips = createServerFn({ method: 'GET' })
  .middleware([superAdminMiddleware])
  .validator((raw: unknown) => ({
    employeeId: Math.max(0, Math.floor(numberValue((raw as Record<string, unknown>)?.employeeId, 0))),
  }))
  .handler(async ({ data }): Promise<SalarySlipRecord[]> => {
    await ensureAttendanceSchema()
    await ensureAttendanceReliabilitySchema()
    const rows = data.employeeId > 0
      ? await queryRows('SELECT s.*, e.name AS employee_name FROM salary_slips s JOIN employees e ON e.id = s.employee_id WHERE s.employee_id = ? ORDER BY s.selected_month DESC, s.id DESC', [data.employeeId])
      : await queryRows('SELECT s.*, e.name AS employee_name FROM salary_slips s JOIN employees e ON e.id = s.employee_id ORDER BY s.selected_month DESC, s.id DESC LIMIT 200')
    return rows.map(mapSalarySlipRow)
  })

function salarySlipAmount(value: unknown, label: string): number {
  const amount = Number(value ?? 0)
  if (!Number.isFinite(amount) || amount < 0 || amount > 10_000_000 || Math.abs(amount * 100 - Math.round(amount * 100)) > 0.00001) throw new Error(`Enter a valid ${label} with up to two decimals`)
  return Math.round(amount * 100) / 100
}

export const issueSalarySlip = createServerFn({ method: 'POST' })
  .middleware([superAdminMiddleware])
  .validator((raw: unknown) => {
    const input = (raw ?? {}) as Record<string, unknown>
    const employeeId = Math.floor(numberValue(input.employeeId, 0))
    const month = stringValue(input.month, 7)
    const allowanceLabel = stringValue(input.allowanceLabel, 80) || 'Bonus / Allowance'
    const allowanceAmount = salarySlipAmount(input.allowanceAmount, 'allowance')
    const deductionLabel = stringValue(input.deductionLabel, 80) || 'Advance / Other Deduction'
    const deductionAmount = salarySlipAmount(input.deductionAmount, 'deduction')
   const hasCustomPaid = input.paidAmount !== undefined && input.paidAmount !== null && input.paidAmount !== ''
    const rawPaid = hasCustomPaid ? Number(input.paidAmount) : null
    if (rawPaid !== null) salarySlipAmount(rawPaid, 'paid amount')
    const paidAmountOverride = rawPaid !== null ? Math.round(rawPaid * 100) / 100 : null
    const paymentMethod = stringValue(input.paymentMethod, 30)
    const paymentRef = stringValue(input.paymentRef, 190)
    const paidOn = input.paidOn ? validPayrollDate(input.paidOn) : ''
    const notes = stringValue(input.notes, 500)
    if (employeeId <= 0 || !/^\d{4}-(?:0[1-9]|1[0-2])$/.test(month)) throw new Error('Select a valid employee and salary month')
    if (paidOn && paidOn > todayIstDate()) throw new Error('Payment date must not be in the future')
    if (paymentMethod && !['Cash', 'Bank transfer', 'UPI', 'Cheque', 'Other'].includes(paymentMethod)) throw new Error('Invalid payment method')
    return { employeeId, month, allowanceLabel, allowanceAmount, deductionLabel, deductionAmount, paidAmountOverride, paymentMethod, paymentRef, paidOn, notes }
  })
  .handler(async ({ data, context }): Promise<SalarySlipRecord> => {
    await ensureAttendanceSchema()
    await ensureAttendanceReliabilitySchema()
    return attendanceTransaction(async ({ queryRows, execute }) => {
      const empRows = await queryRows('SELECT * FROM employees WHERE id = ? FOR UPDATE', [data.employeeId])
      if (!empRows.length) throw new Error('Employee not found')
      const existingIssued = await queryRows("SELECT id FROM salary_slips WHERE employee_id = ? AND selected_month = ? AND status = 'issued' LIMIT 1", [data.employeeId, data.month])
      if (existingIssued.length) throw new Error('An official salary slip already exists for this month. Void it first if you need to re-issue.')

      const employee = mapEmployeeRow(empRows[0])
      const today = todayIstDate()
      const policyRows = await queryRows('SELECT employee_id, effective_date, policy_json FROM employee_policy_history WHERE employee_id = ? ORDER BY effective_date ASC', [employee.id])
      const policies = policyRows.map((row) => ({ employeeId: Number(row.employee_id), effectiveDate: String(row.effective_date), policy: JSON.parse(String(row.policy_json)) as Partial<EmployeeRecord> }))
      const currentEmp = resolveEmployeePolicy(employee, policies, today)

      const frozenRows = await queryRows('SELECT snapshot_json FROM attendance_cycle_snapshots WHERE employee_id = ? AND selected_month = ? LIMIT 1', [employee.id, data.month])
      let summary: EmployeeCycleSummary
      let cycleLogs: AttendanceLogRecord[]
      if (frozenRows.length) {
        const saved = parseSnapshot(frozenRows[0].snapshot_json)
        summary = { ...saved.summary, finalized: true }
        cycleLogs = saved.logs
      } else {
        const monthStartPolicy = resolveEmployeePolicy(employee, policies, `${data.month}-01`)
        const range = getEmployeeCycleRange(data.month, monthStartPolicy.cycleStartDay)
        const logRows = await queryRows(`SELECT ${LOG_COLS} FROM attendance_logs l JOIN employees e ON e.id = l.employee_id WHERE l.employee_id = ? AND l.work_date BETWEEN ? AND ? ORDER BY l.work_date ASC`, [employee.id, range.startDate, range.endDate])
        cycleLogs = logRows.map((row) => mapAttendanceRow(row))
        summary = buildEmployeeCycleSummaries([employee], cycleLogs, data.month, today, policies)[0]
      }

      if (summary.missedCheckOutCount > 0 || (summary.reviewRequiredCount ?? 0) > 0) {
        throw new Error('Resolve missing check-outs or pending shift reviews for this cycle before issuing an official salary slip.')
      }

      const [paymentRows, settingsRows, priorRows] = await Promise.all([
        queryRows('SELECT amount_paise, paid_on, method, reference_text FROM salary_payments WHERE employee_id = ? AND voided_at IS NULL AND period_from >= ? AND period_to <= ? ORDER BY paid_on DESC, id DESC', [employee.id, summary.cycleStartDate, summary.cycleEndDate]),
        queryRows('SELECT public_settings_json FROM site_settings WHERE id = 1 LIMIT 1'),
        queryRows('SELECT COUNT(*) AS cnt FROM salary_slips WHERE employee_id = ? AND selected_month = ?', [employee.id, data.month]),
      ])

      const siteSettings = readSiteSettings(settingsRows[0])
      const supportEmail = siteSettings.emails.find((e) => e.toLowerCase().startsWith('support@')) ?? siteSettings.emails[1] ?? siteSettings.emails[0] ?? ''
      const ledgerPaidAmount = paymentRows.reduce((sum, row) => sum + Number(row.amount_paise), 0) / 100
      const paidAmount = data.paidAmountOverride ?? ledgerPaidAmount
      const additionalPaidPaise = Math.round(paidAmount * 100) - Math.round(ledgerPaidAmount * 100)
      if (additionalPaidPaise < 0) throw new Error('Paid total cannot be lower than recorded cycle payments. Reverse an incorrect payment in payment history first.')
      if (additionalPaidPaise > 0 && !data.paymentMethod) throw new Error('Select a payment method to record the additional salary paid')
      if (additionalPaidPaise > 0 && summary.cycleStartDate > today) throw new Error('Cannot record payment for a future salary cycle')
      const latestPayment = paymentRows[0]
      const paidLeaveDays = cycleLogs.filter((l) => l.status === 'Paid Leave').length
      const grossEarnings = Math.round((summary.earnedSalary + data.allowanceAmount) * 100) / 100
      const totalDeductions = Math.round(data.deductionAmount * 100) / 100
      const netPay = Math.max(0, Math.round((grossEarnings - totalDeductions) * 100) / 100)
      const netPayPaise = Math.round(netPay * 100)
      const seq = Number(priorRows[0]?.cnt ?? 0) + 1
      const slipNumber = `BEI-${data.month.replace('-', '')}-E${String(employee.id).padStart(3, '0')}-${String(seq).padStart(2, '0')}`
      if (additionalPaidPaise > 0) {
        await execute('INSERT INTO salary_payments (employee_id, request_key, amount_paise, paid_on, period_from, period_to, method, reference_text, note, recorded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [employee.id, `slip-${slipNumber}`, additionalPaidPaise, data.paidOn || today, summary.cycleStartDate, summary.cycleEndDate < today ? summary.cycleEndDate : today, data.paymentMethod, data.paymentRef, `Additional salary payment recorded with ${slipNumber}. ${data.notes}`.trim().slice(0, 500), context.user.email])
      }

      const snapshot: SalarySlipSnapshot = {
        adjustmentDate: today,
        companyName: site.name,
        companyAddress: site.address,
        companyPhone: siteSettings.phones[0] ? (siteSettings.phones[0].startsWith('+') ? siteSettings.phones[0] : `+91 ${siteSettings.phones[0]}`) : '',
        companyEmail: supportEmail,
        employeeCode: `BEI-EMP-${String(employee.id).padStart(3, '0')}`,
        employeeName: currentEmp.name,
        designation: currentEmp.designation || 'Staff',
        employeeEmail: currentEmp.email,
        employeePhone: currentEmp.phone,
        joiningDate: currentEmp.joiningDate || '',
        cycleStartDay: summary.employee.cycleStartDay,
        shiftTime: `${summary.employee.expectedInTime}–${summary.employee.expectedOutTime}`,
        monthLabel: formatSlipMonthLabel(data.month),
        cycleStartDate: summary.cycleStartDate,
        cycleEndDate: summary.cycleEndDate,
        totalDays: summary.totalDays,
        workingDays: summary.workingDays,
        weeklyOffsAndHolidays: Math.max(0, summary.totalDays - summary.workingDays),
        presentDays: summary.presentDays,
        halfDays: summary.halfDays,
        paidLeaveDays,
        unpaidAndAbsentDays: summary.absentDays,
        payableDays: summary.payableDays,
        totalWorkMinutes: summary.totalWorkMinutes,
        monthlyBaseSalary: summary.employee.monthlySalary,
        earnedSalary: summary.earnedSalary,
        allowanceLabel: data.allowanceLabel,
        allowanceAmount: Math.round(data.allowanceAmount * 100) / 100,
        grossEarnings,
        deductionLabel: data.deductionLabel,
        deductionAmount: totalDeductions,
        totalDeductions,
        netPay,
        netPayWords: amountInWordsInr(netPay),
        paidAmount,
        paymentMethod: data.paymentMethod || (latestPayment ? String(latestPayment.method) : ''),
        paymentRef: data.paymentRef || (latestPayment ? String(latestPayment.reference_text) : ''),
        paidOn: data.paidOn || (additionalPaidPaise > 0 ? today : latestPayment ? String(latestPayment.paid_on) : ''),
        notes: data.notes,
      }

      const result = await execute(
        'INSERT INTO salary_slips (slip_number, employee_id, selected_month, cycle_start_date, cycle_end_date, net_pay_paise, status, snapshot_json, issued_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [slipNumber, employee.id, data.month, summary.cycleStartDate, summary.cycleEndDate, netPayPaise, 'issued', JSON.stringify(snapshot), context.user.email],
      )
      const inserted = await queryRows('SELECT s.*, e.name AS employee_name FROM salary_slips s JOIN employees e ON e.id = s.employee_id WHERE s.id = ? LIMIT 1', [Number(result.insertId)])
      return mapSalarySlipRow(inserted[0])
    })
  })

export const voidSalarySlip = createServerFn({ method: 'POST' })
  .middleware([superAdminMiddleware])
  .validator((raw: unknown) => {
    const input = (raw ?? {}) as Record<string, unknown>
    const id = Math.floor(numberValue(input.id, 0))
    const reason = stringValue(input.reason, 500)
    if (id <= 0 || !reason) throw new Error('Salary slip ID and void reason are required')
    return { id, reason }
  })
  .handler(async ({ data, context }) => {
    await ensureAttendanceReliabilitySchema()
    return attendanceTransaction(async ({ queryRows, execute }) => {
      const slips = await queryRows('SELECT employee_id FROM salary_slips WHERE id = ? LIMIT 1', [data.id])
      if (!slips.length) throw new Error('Salary slip not found')
      await queryRows('SELECT id FROM employees WHERE id = ? FOR UPDATE', [Number(slips[0].employee_id)])
      await execute("UPDATE salary_slips SET status = 'voided', voided_by = ?, void_reason = ?, voided_at = UTC_TIMESTAMP() WHERE id = ? AND status = 'issued'", [context.user.email, data.reason, data.id])
      return { ok: true }
    })
  })
