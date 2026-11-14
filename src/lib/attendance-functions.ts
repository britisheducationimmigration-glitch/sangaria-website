import { Buffer } from 'node:buffer'
import { createMiddleware, createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { execute, queryRows } from './db.server'
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
  readAttendanceSettings,
  todayIstDate,
  verifyAttendanceLocation,
  verifyEmployeePin,
} from './attendance.server'
import type {
  AdminAttendanceSnapshot,
  AttendanceEditHistoryRecord,
  AttendanceLogRecord,
  AttendanceSettings,
  AttendanceStatus,
  EmployeeRecord,
} from './content-types'

const LOG_COLS = `
  l.id, l.employee_id, l.work_date, l.check_in_at, l.check_out_at,
  l.in_lat, l.in_lng, l.in_accuracy_m, l.in_distance_m, l.in_ip, l.in_ip_city, l.in_ip_country, l.in_flags_json,
  l.in_photo_data IS NOT NULL AS has_in_photo,
  l.out_lat, l.out_lng, l.out_accuracy_m, l.out_distance_m, l.out_ip, l.out_ip_city, l.out_ip_country, l.out_flags_json,
  l.out_photo_data IS NOT NULL AS has_out_photo,
  l.media_version, l.status, l.work_minutes, l.is_late, l.edited_by, l.edit_note, l.updated_at,
  e.name AS employee_name, e.designation
`

let photoCleanupCounter = 0

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
    const empRows = await queryRows('SELECT * FROM employees WHERE access_token = ? LIMIT 1', [data.token])
    if (empRows.length === 0) throw new Error('Attendance link not found')
    const employee = mapEmployeeRow(empRows[0])
    if (!employee.active) throw new Error('This employee attendance link has been deactivated. Contact admin.')

    const today = todayIstDate()
    const currentMonth = currentIstMonth()
    const [settings, todayRows, cycleLogRows] = await Promise.all([
      readAttendanceSettings(),
      queryRows(`SELECT ${LOG_COLS} FROM attendance_logs l JOIN employees e ON e.id = l.employee_id WHERE l.employee_id = ? AND l.work_date = ? LIMIT 1`, [employee.id, today]),
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

    const summary = buildEmployeeCycleSummaries([employee], logs, activeCycle.startDate.slice(0, 7), today)[0]

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
      todayLog,
      recentLogs: logs.slice(0, 10),
      summary,
    }
  })

export const markEmployeeAttendance = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const input = (data ?? {}) as Record<string, unknown>
    const token = stringValue(input.token, 64)
    const action = stringValue(input.action, 8)
    const pin = stringValue(input.pin, 12)
    const deviceKey = stringValue(input.deviceKey, 120)
    const photoBase64 = typeof input.photoBase64 === 'string' ? input.photoBase64.trim() : ''
    const lat = Number(input.lat)
    const lng = Number(input.lng)
    const accuracyM = Number(input.accuracyM)
    if (!/^[A-Za-z0-9_-]{12,64}$/.test(token)) throw new Error('Invalid attendance link')
    if (action !== 'in' && action !== 'out') throw new Error('Invalid attendance action')
    if (deviceKey.length < 12) throw new Error('Could not verify your device. Please reload and try again.')
    if (photoBase64 && (photoBase64.length > 500_000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(photoBase64))) {
      throw new Error('Selfie image is invalid or too large.')
    }
    return { token, action: action as 'in' | 'out', pin, deviceKey, photoBase64, lat, lng, accuracyM }
  })
  .handler(async ({ data }) => {
    await ensureAttendanceSchema()
    if (!(await checkRateLimit('attendance-mark', data.token, 20, 900))) {
      throw new Error('Too many attempts. Please wait a few minutes and try again.')
    }

    const empRows = await queryRows('SELECT * FROM employees WHERE access_token = ? LIMIT 1', [data.token])
    if (empRows.length === 0) throw new Error('Attendance link not found')
    const empRaw = empRows[0]
    const employee = mapEmployeeRow(empRaw)
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

    const settings = await readAttendanceSettings()
    let photoBuffer: Buffer | null = null
    if (settings.requireSelfie && !data.photoBase64) {
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
      officeOnly: employee.officeOnly,
    })

    if (!storedDeviceHash) {
      await execute('UPDATE employees SET bound_device_hash = ? WHERE id = ?', [incomingDeviceHash, employee.id])
    }

    const today = todayIstDate()
    const now = new Date()
    const existingRows = await queryRows('SELECT id, check_in_at, check_out_at FROM attendance_logs WHERE employee_id = ? AND work_date = ? LIMIT 1', [employee.id, today])
    const existing = existingRows[0]

    if (data.action === 'in') {
      if (existing?.check_in_at) throw new Error('You have already checked in today.')
      const isLate = istTimeHHMM(now) > employee.expectedInTime ? 1 : 0
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
    } else {
      if (!existing || !existing.check_in_at) throw new Error('Please mark Check In first before checking out.')
      if (existing.check_out_at) throw new Error('You have already checked out today.')
      const workMinutes = Math.max(0, Math.round((now.getTime() - new Date(String(existing.check_in_at)).getTime()) / 60_000))
      await execute(
        `UPDATE attendance_logs SET check_out_at = ?, out_lat = ?, out_lng = ?, out_accuracy_m = ?, out_distance_m = ?,
         out_ip = ?, out_ip_city = ?, out_ip_country = ?, out_flags_json = ?, out_photo_data = ?, media_version = ?, work_minutes = ? WHERE id = ?`,
        [now, loc.lat, loc.lng, loc.accuracyM, loc.distanceM, loc.ip, loc.ipCity, loc.ipCountry, JSON.stringify(loc.flags), photoBuffer, Date.now(), workMinutes, Number(existing.id)],
      )
    }

    photoCleanupCounter += 1
    if (photoCleanupCounter >= 50) {
      photoCleanupCounter = 0
      try {
        await execute('UPDATE attendance_logs SET in_photo_data = NULL, out_photo_data = NULL WHERE work_date < DATE_SUB(CURRENT_DATE(), INTERVAL 60 DAY) AND (in_photo_data IS NOT NULL OR out_photo_data IS NOT NULL) LIMIT 200')
      } catch {
        // Non-blocking cleanup
      }
    }

    const updatedRows = await queryRows(`SELECT ${LOG_COLS} FROM attendance_logs l JOIN employees e ON e.id = l.employee_id WHERE l.employee_id = ? AND l.work_date = ? LIMIT 1`, [employee.id, today])
    return { ok: true, log: updatedRows[0] ? mapAttendanceRow(updatedRows[0]) : null, flags: loc.flags, distanceM: loc.distanceM }
  })

export const getAdminAttendanceSnapshot = createServerFn({ method: 'GET' })
  .middleware([superAdminMiddleware])
  .validator((data: unknown) => {
    const rawMonth = stringValue((data as Record<string, unknown>)?.month, 7)
    return { selectedMonth: /^\d{4}-\d{2}$/.test(rawMonth) ? rawMonth : currentIstMonth() }
  })
  .handler(async ({ data }): Promise<AdminAttendanceSnapshot & { currentRequestIp: string }> => {
    await ensureAttendanceSchema()
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
    const summaries = buildEmployeeCycleSummaries(employees, logs, data.selectedMonth, todayIst)
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
    const cycleStartDay = Math.max(1, Math.min(28, Math.floor(numberValue(input.cycleStartDay, 1))))
    const monthlySalary = Math.max(0, Math.min(10_000_000, Math.round(numberValue(input.monthlySalary, 0))))
    const expectedInTime = stringValue(input.expectedInTime, 5) || '09:30'
    const expectedOutTime = stringValue(input.expectedOutTime, 5) || '19:30'
    const officeOnly = input.officeOnly === undefined ? true : Boolean(input.officeOnly)
    const active = input.active === undefined ? true : Boolean(input.active)

    if (!name) throw new Error('Employee name is required')
    if (pin && !/^\d{4,8}$/.test(pin)) throw new Error('Employee PIN must be 4 to 8 digits')
    if (!/^\d{2}:\d{2}$/.test(expectedInTime) || !/^\d{2}:\d{2}$/.test(expectedOutTime)) throw new Error('Shift times must be HH:MM')
    return { id, name, designation, phone, email, pin, clearPin, cycleStartDay, monthlySalary, expectedInTime, expectedOutTime, officeOnly, active }
  })
  .handler(async ({ data }): Promise<EmployeeRecord> => {
    await ensureAttendanceSchema()
    if (data.id > 0) {
      const common = [data.name, data.designation, data.phone, data.email]
      const tail = [data.cycleStartDay, data.monthlySalary, data.expectedInTime, data.expectedOutTime, data.officeOnly ? 1 : 0, data.active ? 1 : 0, data.id]
      if (data.clearPin) {
        await execute(`UPDATE employees SET name = ?, designation = ?, phone = ?, email = ?, pin_hash = '', cycle_start_day = ?, monthly_salary = ?, expected_in_time = ?, expected_out_time = ?, office_only = ?, active = ? WHERE id = ?`, [...common, ...tail])
      } else if (data.pin) {
        await execute(`UPDATE employees SET name = ?, designation = ?, phone = ?, email = ?, pin_hash = ?, cycle_start_day = ?, monthly_salary = ?, expected_in_time = ?, expected_out_time = ?, office_only = ?, active = ? WHERE id = ?`, [...common, hashEmployeePin(data.pin), ...tail])
      } else {
        await execute(`UPDATE employees SET name = ?, designation = ?, phone = ?, email = ?, cycle_start_day = ?, monthly_salary = ?, expected_in_time = ?, expected_out_time = ?, office_only = ?, active = ? WHERE id = ?`, [...common, ...tail])
      }
      const rows = await queryRows('SELECT * FROM employees WHERE id = ? LIMIT 1', [data.id])
      if (!rows.length) throw new Error('Employee not found')
      return mapEmployeeRow(rows[0])
    }

    const token = generateEmployeeToken()
    const result = await execute(
      `INSERT INTO employees (name, designation, phone, email, access_token, pin_hash, cycle_start_day, monthly_salary, expected_in_time, expected_out_time, office_only, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [data.name, data.designation, data.phone, data.email, token, data.pin ? hashEmployeePin(data.pin) : '', data.cycleStartDay, data.monthlySalary, data.expectedInTime, data.expectedOutTime, data.officeOnly ? 1 : 0, data.active ? 1 : 0],
    )
    const rows = await queryRows('SELECT * FROM employees WHERE id = ? LIMIT 1', [Number(result.insertId)])
    return mapEmployeeRow(rows[0])
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
    await execute('DELETE FROM attendance_edit_history WHERE employee_id = ?', [data.id])
    await execute('DELETE FROM attendance_logs WHERE employee_id = ?', [data.id])
    await execute('DELETE FROM employees WHERE id = ?', [data.id])
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
    const editNote = stringValue(input.editNote, 500)

    if (employeeId <= 0) throw new Error('Employee is required')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(workDate)) throw new Error('Valid date (YYYY-MM-DD) is required')
    if (!['Present', 'Half Day', 'Leave', 'Absent'].includes(status)) throw new Error('Invalid status')
    if (checkInTime && !/^\d{2}:\d{2}$/.test(checkInTime)) throw new Error('Check-in time must be HH:MM')
    if (checkOutTime && !/^\d{2}:\d{2}$/.test(checkOutTime)) throw new Error('Check-out time must be HH:MM')
    if (checkOutTime && !checkInTime) throw new Error('Check-in time is required when Check-out time is entered')
    if (mode === 'edit' && !editNote) throw new Error('Please enter a reason for editing this attendance entry')

    return { mode: mode as 'create' | 'edit', employeeId, workDate, status, checkInTime, checkOutTime, isLate, editNote }
  })
  .handler(async ({ data, context }): Promise<AttendanceLogRecord> => {
    await ensureAttendanceSchema()
    const checkInDate = data.checkInTime ? new Date(`${data.workDate}T${data.checkInTime}:00+05:30`) : null
    const checkOutDate = data.checkOutTime ? new Date(`${data.workDate}T${data.checkOutTime}:00+05:30`) : null
    if (checkInDate && Number.isNaN(checkInDate.getTime())) throw new Error('Invalid check-in time')
    if (checkOutDate && Number.isNaN(checkOutDate.getTime())) throw new Error('Invalid check-out time')
    if (checkInDate && checkOutDate && checkOutDate.getTime() <= checkInDate.getTime()) {
      throw new Error('Check-out time must be after Check-in time (no overlapping times).')
    }

    const workMinutes = checkInDate && checkOutDate ? Math.round((checkOutDate.getTime() - checkInDate.getTime()) / 60_000) : 0
    const existingRows = await queryRows('SELECT id, status, check_in_at, check_out_at, is_late FROM attendance_logs WHERE employee_id = ? AND work_date = ? LIMIT 1', [data.employeeId, data.workDate])
    const prev = existingRows[0]

    if (data.mode === 'create' && prev) {
      throw new Error(`Attendance already exists for ${data.workDate}. Edit the existing row instead of creating an overlapping entry.`)
    }

    let logId = 0
    let summaryText = ''
    if (prev) {
      logId = Number(prev.id)
      const oldIn = prev.check_in_at ? istTimeHHMM(String(prev.check_in_at)) : '—'
      const oldOut = prev.check_out_at ? istTimeHHMM(String(prev.check_out_at)) : '—'
      const parts = [
        String(prev.status) !== data.status ? `Status: ${prev.status} → ${data.status}` : '',
        oldIn !== (data.checkInTime || '—') ? `In: ${oldIn} → ${data.checkInTime || '—'}` : '',
        oldOut !== (data.checkOutTime || '—') ? `Out: ${oldOut} → ${data.checkOutTime || '—'}` : '',
        Boolean(prev.is_late) !== data.isLate ? `Late: ${Boolean(prev.is_late) ? 'Yes' : 'No'} → ${data.isLate ? 'Yes' : 'No'}` : '',
      ].filter(Boolean)
      summaryText = parts.join(' | ') || 'Record re-saved'

      await execute(
        'UPDATE attendance_logs SET check_in_at = ?, check_out_at = ?, status = ?, work_minutes = ?, is_late = ?, edited_by = ?, edit_note = ? WHERE id = ?',
        [checkInDate, checkOutDate, data.status, workMinutes, data.isLate ? 1 : 0, `${context.user.name} (${context.user.email})`, data.editNote, logId],
      )
    } else {
      summaryText = `Status: ${data.status} | In: ${data.checkInTime || '—'} | Out: ${data.checkOutTime || '—'}`
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

export const exportAttendanceExcel = createServerFn({ method: 'GET' })
  .middleware([superAdminMiddleware])
  .validator((data: unknown) => {
    const input = (data ?? {}) as Record<string, unknown>
    const rawMonth = stringValue(input.month, 7)
    return { selectedMonth: /^\d{4}-\d{2}$/.test(rawMonth) ? rawMonth : currentIstMonth(), employeeId: Math.max(0, Math.floor(numberValue(input.employeeId, 0))) }
  })
  .handler(async ({ data }) => {
    await ensureAttendanceSchema()
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
    const logs = logRows.map((r) => mapAttendanceRow(r))
    const summaries = buildEmployeeCycleSummaries(employees, logs, data.selectedMonth, todayIstDate())
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
      [...log.inFlags, ...log.outFlags].join(', '), log.editedBy, log.editNote,
    ])

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
            ['Date', 'Employee', 'Role', 'Status', 'Check In', 'Check Out', 'Worked', 'Punctuality', 'In Distance', 'In Map Link', 'In Network', 'Out Distance', 'Out Map Link', 'Flags', 'Edited By', 'Edit Reason'],
            ...detailRows,
          ],
          widths: [13, 20, 16, 12, 12, 12, 12, 12, 12, 34, 24, 12, 34, 24, 26, 30],
          headerRows: [1],
          filter: `A1:P${Math.max(1, detailRows.length + 1)}`,
        },
      ]),
    }
  })