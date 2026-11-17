import test from 'node:test'
import assert from 'node:assert/strict'
import { getEmployeeCycleRange, calculateWorkMinutes, buildEmployeeCycleSummaries, classifyShift } from './attendance-calculations.ts'

const employee = { id: 1, name: 'Test', cycleStartDay: 1, monthlySalary: 26000, halfDayMinutes: 480, minimumHalfDayMinutes: 240 }
const log = (date, status = 'Present', complete = true) => ({ employeeId: 1, workDate: date, status, checkInAt: `${date}T04:00:00Z`, checkOutAt: complete ? `${date}T12:00:00Z` : '', workMinutes: complete ? 480 : 0, inFlags: [], outFlags: [] })

test('31st cycles clamp February and remain contiguous across leap years', () => {
  assert.deepEqual(getEmployeeCycleRange('2026-01', 31), { startDate: '2026-01-31', endDate: '2026-02-27', totalDays: 28 })
  assert.equal(getEmployeeCycleRange('2026-02', 31).startDate, '2026-02-28')
  assert.equal(getEmployeeCycleRange('2028-02', 31).startDate, '2028-02-29')
  assert.equal(getEmployeeCycleRange('2026-12', 31).endDate, '2027-01-30')
  assert.throws(() => getEmployeeCycleRange('2026-13', 1))
})
test('net hours merge overlapping breaks and clip out-of-shift intervals', () => {
  const br = (outAt, inAt) => ({ outAt, inAt })
  assert.equal(calculateWorkMinutes('2026-11-02T09:00Z', '2026-11-02T18:00Z', [br('2026-11-02T12:00Z','2026-11-02T13:00Z'),br('2026-11-02T12:30Z','2026-11-02T13:30Z')]), 450)
  assert.equal(calculateWorkMinutes('2026-11-02T22:00Z', '2026-11-03T06:00Z', [br('2026-11-03T02:00Z','2026-11-03T03:00Z')]),420)
})
test('Sunday attendance is separate and cannot inflate salary', () => {
  const logs = Array.from({ length: 30 }, (_, i) => log(`2026-11-${String(i+1).padStart(2,'0')}`))
  const summary = buildEmployeeCycleSummaries([employee], logs, '2026-11', '2026-12-01')[0]
  assert.equal(summary.earnedSalary, 26000)
  assert.equal(summary.payableDays, 25)
  assert.equal(summary.offDayWorkMinutes, 5 * 480)
})
test('missing OUT and current unmarked day never fabricate pay or absence', () => {
  const s = buildEmployeeCycleSummaries([employee], [log('2026-11-02','Present',false)], '2026-11', '2026-11-03')[0]
  assert.equal(s.earnedSalary, 0)
  assert.equal(s.absentDays, 0)
  assert.equal(s.missedCheckOutCount, 1)
})
test('joining date and paid leave are respected', () => {
  const s = buildEmployeeCycleSummaries([{ ...employee, joiningDate: '2026-11-10' }], [log('2026-11-09'),log('2026-11-10','Paid Leave',false),log('2026-11-11','Half Day')], '2026-11', '2026-11-12')[0]
  assert.equal(s.payableDays, 1.5)
  assert.equal(s.absentDays, 0)
  assert.equal(s.earnedSalary, 1560)
})
test('dated salary policy keeps prior dates at original terms', () => {
  const policies = [{ employeeId: 1, effectiveDate: '1900-01-01', policy: { monthlySalary: 25000 } },{ employeeId: 1, effectiveDate: '2026-11-10', policy: { monthlySalary: 50000 } }]
  const s = buildEmployeeCycleSummaries([employee], [log('2026-11-09'),log('2026-11-10')], '2026-11', '2026-11-11', policies)[0]
  assert.equal(s.earnedSalary, 3000)
})
test('cycle policy changes do not rewrite historical report boundaries', () => {
  const policies = [{ employeeId: 1, effectiveDate: '1900-01-01', policy: { cycleStartDay: 5, monthlySalary: 25000 } },{ employeeId: 1, effectiveDate: '2026-12-01', policy: { cycleStartDay: 31, monthlySalary: 50000 } }]
  const current = { ...employee, cycleStartDay: 31, monthlySalary: 50000 }
  const old = buildEmployeeCycleSummaries([current], [], '2026-10', '2027-01-01', policies)[0]
  assert.equal(old.cycleStartDate, '2026-10-05')
  assert.equal(old.cycleEndDate, '2026-11-04')
  assert.equal(old.employee.monthlySalary, 25000)
})
test('legacy automatic checkout is unpaid until reviewed', () => {
  const entry = { ...log('2026-11-02'), outFlags: ['AUTO_CHECKOUT_10PM'] }
  assert.equal(buildEmployeeCycleSummaries([employee], [entry], '2026-11', '2026-12-01')[0].earnedSalary, 0)
  entry.outFlags.push('ADMIN_REVIEW_APPROVED')
  assert.equal(buildEmployeeCycleSummaries([employee], [entry], '2026-11', '2026-12-01')[0].earnedSalary, 1040)
})
test('configured holidays and weekly offs do not count absence or duplicate pay', () => {
  const configured = { ...employee, weeklyOffDays: [0, 6], holidayDates: ['2026-11-02'] }
  const s = buildEmployeeCycleSummaries([configured], [log('2026-11-02')], '2026-11', '2026-11-03')[0]
  assert.equal(s.workingDays, 20)
  assert.equal(s.absentDays, 0)
  assert.equal(s.payableDays, 0)
  assert.equal(s.offDayWorkMinutes, 480)
})

test('short shifts cannot automatically earn half-day pay', () => {
  for (const minutes of [0, 1, 239]) assert.equal(classifyShift(minutes, employee), 'Review Required')
  assert.equal(classifyShift(240, employee), 'Half Day')
  assert.equal(classifyShift(480, employee), 'Present')
  assert.equal(classifyShift(480, employee, true), 'Half Day')
  assert.equal(classifyShift(300, { halfDayMinutes: 480 }), 'Review Required')
  const short = { ...log('2026-11-02', 'Half Day'), workMinutes: 1 }
  const summary = buildEmployeeCycleSummaries([employee], [short], '2026-11', '2026-12-01')[0]
  assert.equal(summary.payableDays, 0)
  assert.equal(summary.reviewRequiredCount, 1)
  short.outFlags.push('ADMIN_REVIEW_APPROVED')
  assert.equal(buildEmployeeCycleSummaries([employee], [short], '2026-11', '2026-12-01')[0].payableDays, 0.5)
})

test('automatic checkout remains a finalization blocker until approved', () => {
  const entry = { ...log('2026-11-02'), outFlags: ['AUTO_CHECKOUT_10PM'] }
  assert.equal(buildEmployeeCycleSummaries([employee], [entry], '2026-11', '2026-12-01')[0].reviewRequiredCount, 1)
  entry.outFlags.push('ADMIN_REVIEW_APPROVED')
  assert.equal(buildEmployeeCycleSummaries([employee], [entry], '2026-11', '2026-12-01')[0].reviewRequiredCount, 0)
})

test('half-day review uses the policy effective on the work date', () => {
  for (const [minimum, minutes, approved, expected] of [[0,240,false,1],[240,239,false,1],[240,240,false,0],[0,60,true,0]]) {
    const entry = { ...log('2026-11-02','Half Day'), workMinutes:minutes, outFlags:approved ? ['ADMIN_REVIEW_APPROVED'] : [] }
    const policies = [{employeeId:1,effectiveDate:'2026-01-01',policy:{minimumHalfDayMinutes:minimum}},{employeeId:1,effectiveDate:'2026-12-01',policy:{minimumHalfDayMinutes:600}}]
    assert.equal(buildEmployeeCycleSummaries([employee],[entry],'2026-11','2026-12-01',policies)[0].reviewRequiredCount,expected)
  }
})
