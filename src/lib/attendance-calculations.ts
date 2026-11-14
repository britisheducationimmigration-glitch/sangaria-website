import type { AttendanceBreakRecord, AttendanceLogRecord, EmployeeCycleSummary, EmployeeRecord } from './content-types'

export type EmployeePolicyHistory = { employeeId: number; effectiveDate: string; policy: Partial<EmployeeRecord> }

export function getEmployeeCycleRange(selectedMonth: string, cycleStartDay: number) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(selectedMonth)) throw new Error('Invalid report month')
  const [year, month] = selectedMonth.split('-').map(Number)
  const day = Math.max(1, Math.min(31, Math.floor(cycleStartDay || 1)))
  const boundary = (m: number) => new Date(Date.UTC(year, m - 1, Math.min(day, new Date(Date.UTC(year, m, 0)).getUTCDate())))
  const start = boundary(month)
  const end = new Date(boundary(month + 1).getTime() - 86_400_000)
  return { startDate: start.toISOString().slice(0, 10), endDate: end.toISOString().slice(0, 10), totalDays: Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1 }
}

export function countSundaysInRange(startDate: string, endDate: string) {
  let count = 0
  for (let cursor = Date.parse(`${startDate}T00:00:00Z`); cursor <= Date.parse(`${endDate}T00:00:00Z`); cursor += 86_400_000) if (new Date(cursor).getUTCDay() === 0) count++
  return count
}

/** Intersect and merge break intervals so malformed/overlapping breaks cannot double-deduct. */
export function calculateWorkMinutes(checkIn: string | Date, checkOut: string | Date, breaks: AttendanceBreakRecord[] = []) {
  const start = new Date(checkIn).getTime(), end = new Date(checkOut).getTime()
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0
  const intervals = breaks.map(b => [Math.max(start, Date.parse(b.outAt)), Math.min(end, b.inAt ? Date.parse(b.inAt) : end)])
    .filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b) && b > a).sort((a, b) => a[0] - b[0])
  let deducted = 0, mergedStart = 0, mergedEnd = 0
  for (const [a, b] of intervals) {
    if (a > mergedEnd) { deducted += mergedEnd - mergedStart; mergedStart = a; mergedEnd = b } else mergedEnd = Math.max(mergedEnd, b)
  }
  deducted += mergedEnd - mergedStart
  return Math.max(0, Math.round((end - start - deducted) / 60_000))
}

export function resolveEmployeePolicy(employee: EmployeeRecord, history: EmployeePolicyHistory[], date: string): EmployeeRecord {
  const employeeHistory = history.filter(p => p.employeeId === employee.id).sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate))
  const record = employeeHistory.filter(p => p.effectiveDate <= date).at(-1) ?? employeeHistory[0]
  return record ? { ...employee, ...record.policy, id: employee.id } : employee
}

export function buildEmployeeCycleSummaries(employees: EmployeeRecord[], logs: AttendanceLogRecord[], selectedMonth: string, todayIst: string, policies: EmployeePolicyHistory[] = []): EmployeeCycleSummary[] {
  return employees.map(current => {
    // Cycle selection uses the policy effective at the beginning of the selected month.
    const employee = resolveEmployeePolicy(current, policies, `${selectedMonth}-01`)
    const { startDate, endDate, totalDays } = getEmployeeCycleRange(selectedMonth, employee.cycleStartDay)
    const empLogs = logs.filter(l => l.employeeId === employee.id && l.workDate >= startDate && l.workDate <= endDate)
    const byDate = new Map(empLogs.map(l => [l.workDate, l]))
    let workingDays = 0, payableDays = 0, earnedSalary = 0, absentDays = 0, offDayWorkMinutes = 0
    const eligible = (date: string, policy: EmployeeRecord) => (!policy.joiningDate || date >= policy.joiningDate) && (!policy.leavingDate || date <= policy.leavingDate)
    const isWorkDay = (date: string, policy: EmployeeRecord) => !(policy.weeklyOffDays ?? [0]).includes(new Date(`${date}T00:00:00Z`).getUTCDay()) && !(policy.holidayDates ?? []).includes(date)
    const scheduled = new Map<string, number>()
    for (let cursor = Date.parse(`${startDate}T00:00:00Z`); cursor <= Date.parse(`${endDate}T00:00:00Z`); cursor += 86_400_000) {
      const date = new Date(cursor).toISOString().slice(0, 10)
      const policy = resolveEmployeePolicy(employee, policies, date)
      if (isWorkDay(date, policy)) { workingDays++; scheduled.set(date, policy.monthlySalary) }
    }
    for (const [date, salary] of scheduled) {
      const policy = resolveEmployeePolicy(employee, policies, date)
      if (!eligible(date, policy) || date > todayIst) continue
      const log = byDate.get(date)
      // Today's unmarked shift is pending, not an absence. Missing punches are review-only.
      if (!log) { if (date < todayIst) absentDays++; continue }
      if (log.status === 'Absent' || log.status === 'Leave' || log.status === 'Unpaid Leave') { absentDays++; continue }
      const complete = Boolean(log.checkInAt && log.checkOutAt) && (!log.outFlags.includes('AUTO_CHECKOUT_10PM') || log.outFlags.includes('ADMIN_REVIEW_APPROVED'))
      const fraction = log.status === 'Paid Leave' ? 1 : complete ? log.status === 'Half Day' ? 0.5 : log.status === 'Present' ? 1 : 0 : 0
      payableDays += fraction
      earnedSalary += workingDays ? salary * fraction / workingDays : 0
    }
    for (const log of empLogs) if (!scheduled.has(log.workDate)) offDayWorkMinutes += log.workMinutes || 0
    const completeLogs = empLogs.filter(l => l.checkInAt && l.checkOutAt && (!l.outFlags.includes('AUTO_CHECKOUT_10PM') || l.outFlags.includes('ADMIN_REVIEW_APPROVED')) && eligible(l.workDate, resolveEmployeePolicy(employee, policies, l.workDate)))
    return {
      employee, cycleStartDate: startDate, cycleEndDate: endDate, totalDays,
      sundaysCount: countSundaysInRange(startDate, endDate), workingDays,
      presentDays: completeLogs.filter(l => l.status === 'Present').length,
      halfDays: completeLogs.filter(l => l.status === 'Half Day').length,
      leaveDays: empLogs.filter(l => ['Leave', 'Paid Leave', 'Unpaid Leave'].includes(l.status)).length,
      absentDays, payableDays, perDaySalary: workingDays ? Math.round(employee.monthlySalary / workingDays) : 0,
      earnedSalary: Math.round(earnedSalary), lateCount: empLogs.filter(l => l.isLate).length,
      flaggedCount: empLogs.filter(l => l.inFlags.length || l.outFlags.length).length,
      missedCheckOutCount: empLogs.filter(l => l.checkInAt && !l.checkOutAt && l.workDate < todayIst).length,
      totalWorkMinutes: completeLogs.reduce((sum, l) => sum + (l.workMinutes || 0), 0), offDayWorkMinutes,
    }
  })
}
