import { buildEmployeeCycleSummaries, type EmployeePolicyHistory } from './attendance-calculations.ts'
import type { AttendanceLogRecord, EmployeeRecord } from './content-types'

export function buildPayrollRange(employee: EmployeeRecord, logs: AttendanceLogRecord[], policies: EmployeePolicyHistory[], from: string, to: string, today: string, includeDays = true) {
  const empPolicies = policies.filter(p => p.employeeId === employee.id).sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate))
  const policyOn = (date: string): EmployeeRecord => {
    if (!empPolicies.length) return employee
    let matched = empPolicies[0]
    for (const entry of empPolicies) {
      if (entry.effectiveDate <= date) matched = entry
      else break
    }
    return { ...employee, ...matched.policy, id: employee.id }
  }
  const months = new Set<string>()
  const start = new Date(from + 'T00:00:00Z')
  start.setUTCMonth(start.getUTCMonth() - 1, 1)
  for (let cursor = start; cursor.toISOString().slice(0, 7) <= to.slice(0, 7); cursor = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1))) months.add(cursor.toISOString().slice(0, 7))
  const dayBreakdown = includeDays ? new Map<string, { payableDays: number; earned: number }>() : undefined
  const summaries = [...months].map(month => buildEmployeeCycleSummaries([employee], logs, month, today, empPolicies, { start: from, end: to }, dayBreakdown)[0]).filter(s => s.cycleEndDate >= from && s.cycleStartDate <= to)
  for (let i = 1; i < summaries.length; i++) if (summaries[i].cycleStartDate <= summaries[i - 1].cycleEndDate) throw new Error('Payroll cycles overlap after a cycle-day change. Correct the policy before calculating a range report.')
  for (let i = 1; i < summaries.length; i++) if (Date.parse(summaries[i].cycleStartDate) - Date.parse(summaries[i - 1].cycleEndDate) > 86400000) throw new Error('Payroll cycle change leaves uncovered dates; review the policy before reporting')
  const days: Array<{ date: string; status: string; checkIn: string; checkOut: string; workMinutes: number; deductedMinutes: number; payableDays: number; earned: number; note: string }> = []
  if (includeDays) {
    const logsByDate = new Map(logs.map(l => [l.workDate, l]))
    for (let timestamp = Date.parse(from + 'T00:00:00Z'); timestamp <= Date.parse(to + 'T00:00:00Z'); timestamp += 86400000) {
      const date = new Date(timestamp).toISOString().slice(0, 10), log = logsByDate.get(date), policy = policyOn(date)
      if (!summaries.some(s => date >= s.cycleStartDate && date <= s.cycleEndDate)) throw new Error('Payroll cycle change leaves uncovered dates. Correct the policy before calculating this report.')
      const value = dayBreakdown?.get(date) ?? { payableDays: 0, earned: 0 }
      const eligible = (!policy.joiningDate || date >= policy.joiningDate) && (!policy.leavingDate || date <= policy.leavingDate)
      const off = (policy.weeklyOffDays ?? [0]).includes(new Date(date + 'T00:00Z').getUTCDay()) || (policy.holidayDates ?? []).includes(date)
      const status = !eligible ? 'Outside employment' : date > today ? 'Future' : off ? 'Weekly off / holiday' : log?.checkInAt && !log.checkOutAt ? date < today ? 'Missing OUT' : 'In Progress' : log?.status ?? (date < today ? 'Absent' : 'Not checked in')
      days.push({ date, status, checkIn: log?.checkInAt ?? '', checkOut: log?.checkOutAt ?? '', workMinutes: log?.workMinutes ?? 0, deductedMinutes: log?.breakMinutes ?? 0, payableDays: value.payableDays, earned: value.earned, note: [log?.editNote, ...(log?.breaks ?? []).map(interval => `${interval.outAt} to ${interval.inAt || 'open'} (UTC): ${interval.note}`)].filter(Boolean).join(' | ') })
    }
  }
  return { from, to, days, earned: summaries.reduce((n, s) => n + s.earnedSalary, 0), payableDays: summaries.reduce((n, s) => n + s.payableDays, 0), workMinutes: summaries.reduce((n, s) => n + s.totalWorkMinutes, 0), missingOut: summaries.reduce((n, s) => n + s.missedCheckOutCount, 0), reviewRequired: summaries.reduce((n, s) => n + (s.reviewRequiredCount ?? 0), 0), cycles: summaries }
}