import { Buffer } from 'node:buffer'
import { createMiddleware, createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { execute, queryRows } from './db.server'
import { attendanceTransaction, csvText, ensureAttendanceReliabilitySchema } from './attendance-reliability.server'
import { checkRateLimit } from './rate-limit.server'
import {
  autoCloseOpenCheckIns,
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
  readAttendanceSettings,
  todayIstDate,
  verifyAttendanceLocation,
  verifyEmployeePin,
} from './attendance.server'
import type {
  AdminAttendanceSnapshot,
  AttendanceBreakRecord,
  AttendanceEditHistoryRecord,
  AttendanceLogRecord,
  AttendanceSettings,
  AttendanceStatus,
  EmployeeRecord,
  EmployeeCycleSummary,
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
  const { cycleStartDay, monthlySalary, expectedInTime, expectedOutTime, joiningDate, leavingDate, halfDayMinutes, lateGraceMinutes, weeklyOffDays, holidayDates } = employee
  return { cycleStartDay, monthlySalary, expectedInTime, expectedOutTime, joiningDate, leavingDate, halfDayMinutes, lateGraceMinutes, weeklyOffDays, holidayDates }
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
    await autoCloseOpenCheckIns()
    await ensureAttendanceReliabilitySchema()
    const empRows = await queryRows('SELECT * FROM employees WHERE access_token = ? LIMIT 1', [data.token])
    if (empRows.length === 0) throw new Error('Attendance link not found')
    const policies = await readEmployeePolicies()
    const employee = resolveEmployeePolicy(mapEmployeeRow(empRows[0]), policies, todayIstDate())
    if (!employee.active) throw new Error('This employee attendance link has been deactivated. Contact admin.')

    const today = todayIstDate()
    const currentMonth = currentIstMonth()
    const [settings, todayRows, cycleLogRows] = await Promise.all([
      readAttendanceSettings(),
      queryRows(`SELECT ${LOG_COLS} FROM attendance_logs l JOIN employees e ON e.id = l.employee_id WHERE l.employee_id = ? AND (l.work_date = ? OR (l.check_in_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 24 HOUR) AND l.check_out_at IS NULL)) ORDER BY l.work_date DESC LIMIT 1`, [employee.id, today]),
      queryRows(`SELECT ${LOG_COLS} FROM attendance_logs l JOIN employees e ON e.id = l.employee_id WHERE l.employee_id = ? ORDER BY l.work_date DESC LIMIT 45`, [employee.id]),
    ])

    const logs = cycleLogRows.map((r) => mapAttendanceRow(r))
    const todayLog = todayRows[0] ? mapAttendanceRow(todayRows[0]) : null
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

    let today = todayIstDate()
    const now = new Date()
    const existingRows = await queryRows('SELECT id, check_in_at, check_out_at, breaks_json FROM attendance_logs WHERE employee_id = ? AND work_date = ? LIMIT 1 FOR UPDATE', [employee.id, today])
    let existing = existingRows[0]
    const openRows = await queryRows('SELECT id, work_date, check_in_at, check_out_at, breaks_json FROM attendance_logs WHERE employee_id = ? AND check_in_at IS NOT NULL AND check_out_at IS NULL ORDER BY work_date DESC LIMIT 1 FOR UPDATE', [employee.id])
    const open = openRows[0]
    if (data.action === 'in' && open && String(open.work_date) !== today) throw new Error('A previous shift is missing Check Out. Contact admin before starting another shift.')
    if (data.action !== 'in' && open && String(open.work_date) !== today) {
      if (now.getTime() - new Date(String(open.check_in_at)).getTime() > 24 * 60 * 60_000) throw new Error('Previous shift needs admin review before further punches.')
      today = String(open.work_date)
      existing = open
    }
    if (employee.joiningDate && today < employee.joiningDate) throw new Error('Attendance is not enabled before your joining date')
    if (employee.leavingDate && today > employee.leavingDate) throw new Error('Your attendance period has ended. Contact admin.')
    await assertCycleUnlocked(queryRows, employee.id, today)

    if (data.action === 'in') {
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
      const breakMinutes = breaks.reduce((sum, br) => {
        if (!br.outAt || !br.inAt) return sum
        return sum + Math.max(0, Math.round((new Date(br.inAt).getTime() - new Date(br.outAt).getTime()) / 60_000))
      }, 0)
      await execute('UPDATE attendance_logs SET breaks_json = ?, break_minutes = ? WHERE id = ?', [JSON.stringify(breaks), breakMinutes, Number(existing.id)])
    } else {
      if (!existing || !existing.check_in_at) throw new Error('Please mark Check In first before checking out.')
      if (existing.check_out_at) throw new Error('You have already checked out today.')
      const breaks: AttendanceBreakRecord[] = parseBreaksJson(existing.breaks_json)
      for (const br of breaks) {
        if (br.outAt && !br.inAt) br.inAt = now.toISOString()
      }
      const breakMinutes = breaks.reduce((sum, br) => {
        if (!br.outAt || !br.inAt) return sum
        return sum + Math.max(0, Math.round((new Date(br.inAt).getTime() - new Date(br.outAt).getTime()) / 60_000))
      }, 0)
        const workMinutes = calculateWorkMinutes(new Date(String(existing.check_in_at)), now, breaks)
      const isHalfDay = data.action === 'half_out' || workMinutes < (employee.halfDayMinutes ?? 300)
      const finalFlags = isHalfDay ? [...loc.flags, 'HALF_DAY_OUT'] : loc.flags
      const finalStatus: AttendanceStatus = isHalfDay ? 'Half Day' : 'Present'
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
    return { selectedMonth: /^\d{4}-(?:0[1-9]|1[0-2])$/.test(rawMonth) ? rawMonth : currentIstMonth() }
  })
  .handler(async ({ data }): Promise<AdminAttendanceSnapshot & { currentRequestIp: string }> => {
    await autoCloseOpenCheckIns()
    await ensureAttendanceReliabilitySchema()
    const [year, month] = data.selectedMonth.split('-').map(Number)
    const rangeStart = new Date(Date.UTC(year, month - 2, 1)).toISOString().slice(0, 10)
    const rangeEnd = new Date(Date.UTC(year, month + 1, 28)).toISOString().slice(0, 10)

    const [settings, empRows, logRows] = await Promise.all([
      readAttendanceSettings(),
      queryRows('SELECT * FROM employees ORDER BY active DESC, name ASC'),
      queryRows(`SELECT ${LOG_COLS} FROM attendance_logs l JOIN employees e ON e.id = l.employee_id WHERE l.work_date >= ? AND l.work_date <= ? ORDER BY l.work_date DESC, e.name ASC`, [rangeStart, rangeEnd]),
    ])

    const logIds = logRows.map((r) => Number(r.id))
    const historyRows = logIds.length
      ? await queryRows(`SELECT * FROM attendance_edit_history WHERE attendance_log_id IN (${logIds.map(() => '?').join(',')}) ORDER BY created_at DESC, id DESC`, logIds)
      : []

    const historyByLog = new Map<number, AttendanceEditHistoryRecord[]>()
    for (const hRow of historyRows) {
      const mapped = mapEditHistoryRow(hRow)
      const list = historyByLog.get(mapped.attendanceLogId) ?? []
      list.push(mapped)
      historyByLog.set(mapped.attendanceLogId, list)
    }

    const employees = empRows.map(mapEmployeeRow)
    const logs = logRows.map((r) => mapAttendanceRow(r, historyByLog.get(Number(r.id)) ?? []))
    const todayIst = todayIstDate()
    let summaries = buildEmployeeCycleSummaries(employees, logs, data.selectedMonth, todayIst, await readEmployeePolicies())
    summaries = await applyFinalizedSummaries(summaries, data.selectedMonth)
    const headers = readHeadersFromRequest()
    const currentRequestIp = (headers.get('x-real-ip') || (headers.get('x-forwarded-for') ?? '').split(',')[0] || '').trim()

    return { settings, employees, logs, summaries, selectedMonth: data.selectedMonth, todayIst, currentRequestIp }
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
    const lateGraceMinutes = Math.max(0, Math.min(240, Math.round(numberValue(input.lateGraceMinutes, 0))))
    const weeklyOffDays = Array.isArray(input.weeklyOffDays) ? [...new Set(input.weeklyOffDays.map(Number).filter((n) => Number.isInteger(n) && n >= 0 && n <= 6))] : [0]
    const holidayDates = Array.isArray(input.holidayDates) ? input.holidayDates.map(String).filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date)) : []
    for (const date of [effectiveDate, joiningDate, leavingDate].filter(Boolean)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(new Date(date + 'T00:00:00Z').getTime()) || new Date(date + 'T00:00:00Z').toISOString().slice(0, 10) !== date) throw new Error('Valid effective/joining/leaving date is required')
    }
    if (joiningDate && leavingDate && leavingDate < joiningDate) throw new Error('Leaving date must be on or after joining date')

    if (!name) throw new Error('Employee name is required')
    if (pin && !/^\d{4,8}$/.test(pin)) throw new Error('Employee PIN must be 4 to 8 digits')
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(expectedInTime) || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(expectedOutTime)) throw new Error('Shift times must be HH:MM')
    return { id, name, designation, phone, email, pin, clearPin, cycleStartDay, monthlySalary, expectedInTime, expectedOutTime, officeOnly, active, effectiveDate, joiningDate, leavingDate, halfDayMinutes, lateGraceMinutes, weeklyOffDays, holidayDates }
  })
  .handler(async ({ data }): Promise<EmployeeRecord> => {
    await ensureAttendanceSchema()
    return attendanceTransaction(async ({ queryRows, execute }) => {
    if (data.id > 0) {
      const previous = await queryRows('SELECT * FROM employees WHERE id = ? FOR UPDATE', [data.id])
      if (!previous.length) throw new Error('Employee not found')
      if (Number(previous[0].cycle_start_day) !== data.cycleStartDay) {
        const attendance = await queryRows('SELECT id FROM attendance_logs WHERE employee_id = ? LIMIT 1', [data.id])
        if (attendance.length) throw new Error('Cycle start day cannot change after attendance exists. Archive this profile and create a new employment profile for a new cycle.')
      }
      const policies = await queryRows('SELECT id FROM employee_policy_history WHERE employee_id = ? LIMIT 1', [data.id])
      if (!policies.length) {
        await execute('INSERT INTO employee_policy_history (employee_id, effective_date, policy_json) VALUES (?, ?, ?)', [data.id, '1900-01-01', JSON.stringify(payrollPolicy(mapEmployeeRow(previous[0])))])
      }
      const common = [data.name, data.designation, data.phone, data.email]
      const tail = [data.cycleStartDay, data.monthlySalary, data.expectedInTime, data.expectedOutTime, data.officeOnly ? 1 : 0, data.active ? 1 : 0, data.id]
      if (data.clearPin) {
        await execute(`UPDATE employees SET name = ?, designation = ?, phone = ?, email = ?, pin_hash = '', cycle_start_day = ?, monthly_salary = ?, expected_in_time = ?, expected_out_time = ?, office_only = ?, active = ? WHERE id = ?`, [...common, ...tail])
      } else if (data.pin) {
        await execute(`UPDATE employees SET name = ?, designation = ?, phone = ?, email = ?, pin_hash = ?, cycle_start_day = ?, monthly_salary = ?, expected_in_time = ?, expected_out_time = ?, office_only = ?, active = ? WHERE id = ?`, [...common, hashEmployeePin(data.pin), ...tail])
      } else {
        await execute(`UPDATE employees SET name = ?, designation = ?, phone = ?, email = ?, cycle_start_day = ?, monthly_salary = ?, expected_in_time = ?, expected_out_time = ?, office_only = ?, active = ? WHERE id = ?`, [...common, ...tail])
      }
      await execute('INSERT INTO employee_policy_history (employee_id, effective_date, policy_json) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE policy_json = VALUES(policy_json)', [data.id, data.effectiveDate, JSON.stringify({ cycleStartDay: data.cycleStartDay, monthlySalary: data.monthlySalary, expectedInTime: data.expectedInTime, expectedOutTime: data.expectedOutTime, joiningDate: data.joiningDate, leavingDate: data.leavingDate, halfDayMinutes: data.halfDayMinutes, lateGraceMinutes: data.lateGraceMinutes, weeklyOffDays: data.weeklyOffDays, holidayDates: data.holidayDates })])
      await execute('UPDATE employees SET joining_date = ?, leaving_date = ?, half_day_minutes = ?, late_grace_minutes = ?, weekly_off_days_json = ?, holiday_dates_json = ? WHERE id = ?', [data.joiningDate || '', data.leavingDate || '', data.halfDayMinutes, data.lateGraceMinutes, JSON.stringify(data.weeklyOffDays), JSON.stringify(data.holidayDates), data.id])
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
      await execute('INSERT INTO employee_policy_history (employee_id, effective_date, policy_json) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE policy_json = VALUES(policy_json)', [data.id, data.effectiveDate, JSON.stringify({ cycleStartDay: data.cycleStartDay, monthlySalary: data.monthlySalary, expectedInTime: data.expectedInTime, expectedOutTime: data.expectedOutTime, joiningDate: data.joiningDate, leavingDate: data.leavingDate, halfDayMinutes: data.halfDayMinutes, lateGraceMinutes: data.lateGraceMinutes, weeklyOffDays: data.weeklyOffDays, holidayDates: data.holidayDates })])
      await execute('UPDATE employees SET joining_date = ?, leaving_date = ?, half_day_minutes = ?, late_grace_minutes = ?, weekly_off_days_json = ?, holiday_dates_json = ? WHERE id = ?', [data.joiningDate || '', data.leavingDate || '', data.halfDayMinutes, data.lateGraceMinutes, JSON.stringify(data.weeklyOffDays), JSON.stringify(data.holidayDates), data.id])

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
    const officeWifiIp = stringValue(input.officeWifiIp, 64)
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

    if (employeeId <= 0) throw new Error('Employee is required')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(workDate) || !Number.isFinite(new Date(workDate + 'T00:00:00Z').getTime()) || new Date(workDate + 'T00:00:00Z').toISOString().slice(0, 10) !== workDate) throw new Error('Valid date (YYYY-MM-DD) is required')
    if (!['Present', 'Half Day', 'Leave', 'Paid Leave', 'Unpaid Leave', 'Absent'].includes(status)) throw new Error('Invalid status')
    if (checkInTime && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(checkInTime)) throw new Error('Check-in time must be HH:MM')
    if (checkOutTime && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(checkOutTime)) throw new Error('Check-out time must be HH:MM')
    if (checkOutTime && !checkInTime) throw new Error('Check-in time is required when Check-out time is entered')
    if (mode === 'edit' && !editNote) throw new Error('Please enter a reason for editing this attendance entry')

    return { mode: mode as 'create' | 'edit', employeeId, workDate, status, checkInTime, checkOutTime, checkOutNextDay, isLate, editNote }
  })
  .handler(async ({ data, context }): Promise<AttendanceLogRecord> => {
    await ensureAttendanceSchema()
    await ensureAttendanceReliabilitySchema()
    return attendanceTransaction(async ({ queryRows, execute }) => {
    const checkInDate = data.checkInTime ? new Date(`${data.workDate}T${data.checkInTime}:00+05:30`) : null
    const checkOutDate = data.checkOutTime ? new Date(`${data.workDate}T${data.checkOutTime}:00+05:30`) : null
    if (checkOutDate && data.checkOutNextDay) checkOutDate.setUTCDate(checkOutDate.getUTCDate() + 1)
    if (checkInDate && Number.isNaN(checkInDate.getTime())) throw new Error('Invalid check-in time')
    if (checkOutDate && Number.isNaN(checkOutDate.getTime())) throw new Error('Invalid check-out time')
    if (checkInDate && checkOutDate && checkOutDate.getTime() <= checkInDate.getTime()) {
      throw new Error('Check-out time must be after Check-in time (no overlapping times).')
    }

    const employees = await queryRows('SELECT id FROM employees WHERE id = ? FOR UPDATE', [data.employeeId])
    if (!employees.length) throw new Error('Employee not found')
    await assertCycleUnlocked(queryRows, data.employeeId, data.workDate)
    const existingRows = await queryRows('SELECT * FROM attendance_logs WHERE employee_id = ? AND work_date = ? LIMIT 1 FOR UPDATE', [data.employeeId, data.workDate])
    const prev = existingRows[0]
    if (data.mode === 'edit' && !prev) throw new Error('Attendance record no longer exists. Refresh and retry.')
    if (checkInDate) {
      const overlap = await queryRows('SELECT id FROM attendance_logs WHERE employee_id = ? AND id <> ? AND check_in_at IS NOT NULL AND check_in_at < ? AND (check_out_at IS NULL OR check_out_at > ?) LIMIT 1', [data.employeeId, Number(prev?.id ?? 0), checkOutDate ?? new Date(checkInDate.getTime() + 1), checkInDate])
      if (overlap.length) throw new Error('Attendance times overlap another shift for this employee')
    }
    const preservedBreaks = parseBreaksJson(prev?.breaks_json)
    const workMinutes = checkInDate && checkOutDate ? calculateWorkMinutes(checkInDate, checkOutDate, preservedBreaks) : 0
    const breakMinutes = checkInDate && checkOutDate ? Math.max(0, Math.round((checkOutDate.getTime() - checkInDate.getTime()) / 60_000) - workMinutes) : 0
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
      const oldIn = prev.check_in_at ? istTimeHHMM(String(prev.check_in_at)) : '-'
      const oldOut = prev.check_out_at ? istTimeHHMM(String(prev.check_out_at)) : '-'
      const parts = [
        String(prev.status) !== data.status ? `Status: ${prev.status}  ${data.status}` : '',
        oldIn !== (data.checkInTime || '-') ? `In: ${oldIn}  ${data.checkInTime || '-'}` : '',
        oldOut !== (data.checkOutTime || '-') ? `Out: ${oldOut}  ${data.checkOutTime || '-'}` : '',
        Boolean(prev.is_late) !== data.isLate ? `Late: ${Boolean(prev.is_late) ? 'Yes' : 'No'}  ${data.isLate ? 'Yes' : 'No'}` : '',
      ].filter(Boolean)
      summaryText = parts.join(' | ') || 'Record re-saved'

      await execute(
        'UPDATE attendance_logs SET check_in_at = ?, check_out_at = ?, status = ?, work_minutes = ?, break_minutes = ?, is_late = ?, edited_by = ?, edit_note = ? WHERE id = ?',
        [checkInDate, checkOutDate, data.status, workMinutes, breakMinutes, data.isLate ? 1 : 0, `${context.user.name} (${context.user.email})`, data.editNote, logId],
      )
    } else {
      summaryText = `Status: ${data.status} | In: ${data.checkInTime || '-'} | Out: ${data.checkOutTime || '-'}`
      const res = await execute(
        `INSERT INTO attendance_logs (employee_id, work_date, check_in_at, check_out_at, status, work_minutes, is_late, edited_by, edit_note)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.employeeId, data.workDate, checkInDate, checkOutDate, data.status, workMinutes, data.isLate ? 1 : 0, `${context.user.name} (${context.user.email})`, data.editNote || 'Manual entry by Super Admin'],
      )
      logId = Number(res.insertId)
    }

    await execute(
      `INSERT INTO attendance_edit_history (attendance_log_id, employee_id, work_date, editor_name, editor_email, action, changes_summary, reason)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [logId, data.employeeId, data.workDate, context.user.name, context.user.email, prev ? 'edit' : 'create', summaryText, data.editNote || 'Manual entry'],
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
    const frozenRows = await queryRows('SELECT employee_id, snapshot_json FROM attendance_cycle_snapshots WHERE selected_month = ?', [data.selectedMonth])
    for (const frozen of frozenRows) {
      const saved = parseSnapshot(frozen.snapshot_json)
      logs = logs.filter((log) => log.employeeId !== Number(frozen.employee_id) || log.workDate < saved.summary.cycleStartDate || log.workDate > saved.summary.cycleEndDate).concat(saved.logs)
    }
    let summaries = buildEmployeeCycleSummaries(employees, logs, data.selectedMonth, todayIstDate(), await readEmployeePolicies())
    summaries = await applyFinalizedSummaries(summaries, data.selectedMonth)
    const formatIst = (iso: string) => (iso ? new Date(iso).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }) : '')
    const mapUrl = (lat: number | null, lng: number | null) => (lat !== null && lng !== null ? `https://maps.google.com/?q=${lat},${lng}` : '')
    const fmtHrs = (mins: number) => `${Math.floor(mins / 60)}h ${mins % 60}m`

    const summaryRows = summaries.map((s) => [
      s.employee.name, s.employee.designation || '-', `Day ${s.employee.cycleStartDay}`, `${s.cycleStartDate} to ${s.cycleEndDate}`,
      s.totalDays, s.sundaysCount, s.workingDays, s.presentDays, s.halfDays, s.leaveDays, s.absentDays,
      s.payableDays, s.employee.monthlySalary, s.perDaySalary, s.earnedSalary, s.lateCount, s.flaggedCount, fmtHrs(s.totalWorkMinutes),
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
    const historyRows = histories.map((h) => [String(h.work_date), String(h.employee_name), String(h.editor_name), String(h.editor_email), String(h.action), String(h.changes_summary), String(h.reason), new Date(String(h.created_at)).toISOString()])
    const evidenceRows = evidence.map((row) => [Number(row.log_id), String(row.action), new Date(String(row.created_at)).toISOString(), String(row.snapshot_json)])
    const { createLeadsWorkbook } = await import('./xlsx.server')
    return {
      filename: `bei-attendance-salary-${data.selectedMonth}${data.employeeId ? `-emp-${data.employeeId}` : ''}.xlsx`,
      base64: createLeadsWorkbook([
        {
          name: 'Salary & Cycle Summary',
          rows: [
            ['Employee', 'Role', 'Cycle Day', 'Cycle Period', 'Cycle Days', 'Sundays', 'Working Days', 'Present', 'Half Day', 'Leave', 'Absent', 'Payable Days', 'Monthly Salary (INR)', 'Per Working Day (INR)', 'Calculated Salary (INR)', 'Late', 'Flags', 'Total Hours'],
            ...summaryRows,
          ],
          widths: [20, 16, 10, 24, 11, 10, 12, 10, 10, 10, 10, 12, 18, 18, 20, 8, 8, 12],
          headerRows: [1],
          filter: `A1:R${Math.max(1, summaryRows.length + 1)}`,
        },
        {
          name: 'Daily Logs & GPS',
          rows: [
            ['Date', 'Employee', 'Role', 'Status', 'Check In', 'Check Out', 'Worked', 'Punctuality', 'In Distance', 'In Map Link', 'In Network', 'Out Distance', 'Out Map Link', 'Flags', 'Edited By', 'Edit Reason', 'Break Minutes', 'Review', 'Source'],
            ...detailRows,
          ],
          widths: [13, 20, 16, 12, 12, 12, 12, 12, 12, 34, 24, 12, 34, 24, 26, 30],
          headerRows: [1],
          filter: `A1:S${Math.max(1, detailRows.length + 1)}`,
        },
        { name: 'Break Details', rows: [['Work Date', 'Employee', 'Out (UTC)', 'Return (UTC)', 'Reason', 'Out Map', 'Return Map'], ...breakRows], headerRows: [1], widths: [13, 22, 26, 26, 35, 35, 35] },
        { name: 'Correction History', rows: [['Date', 'Employee', 'Editor', 'Editor Email', 'Action', 'Changes', 'Reason', 'Saved (UTC)'], ...historyRows], headerRows: [1], widths: [13, 22, 22, 30, 12, 60, 45, 26] },
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
  return summaries.map((summary) => finalized.get(summary.employee.id) ?? summary)
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
      await execute('INSERT INTO attendance_cycle_snapshots (employee_id, selected_month, cycle_start_date, cycle_end_date, snapshot_json, finalized_by) VALUES (?, ?, ?, ?, ?, ?)', [employee.id, data.month, summary.cycleStartDate, summary.cycleEndDate, JSON.stringify({ summary, logs }), context.user.email])
      return { ok: true }
    })
  })

export const exportAttendanceCsv = createServerFn({ method: 'GET' })
  .middleware([superAdminMiddleware])
  .validator(reportInput)
  .handler(async ({ data }) => {
    const snapshot = await getAdminAttendanceSnapshot({ data: { month: data.month } })
    const summaries = snapshot.summaries.filter((summary) => !data.employeeId || summary.employee.id === data.employeeId)
    const rows: unknown[][] = [['Employee', 'Cycle Start', 'Cycle End', 'Present', 'Half Day', 'Leave', 'Absent', 'Missing OUT', 'Payable Days', 'Monthly Salary INR', 'Calculated Salary INR', 'Work Minutes']]
    for (const summary of summaries) rows.push([summary.employee.name, summary.cycleStartDate, summary.cycleEndDate, summary.presentDays, summary.halfDays, summary.leaveDays, summary.absentDays, summary.missedCheckOutCount, summary.payableDays, summary.employee.monthlySalary, summary.earnedSalary, summary.totalWorkMinutes])
    return { filename: `bei-attendance-salary-${data.month}.csv`, base64: Buffer.from(csvText(rows), 'utf8').toString('base64') }
  })
