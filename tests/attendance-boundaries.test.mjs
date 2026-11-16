import test from 'node:test'
import assert from 'node:assert/strict'
import { attendanceRuntime } from './attendance-runtime.mjs'

const { api, server, state } = await attendanceRuntime({ query() { throw new Error('Unexpected database access') } })
const settings = { ...server.defaultAttendanceSettings, officeLat: 29.8, officeLng: 74.5, allowedRadiusM: 100, maxAccuracyM: 50 }
const verify = (change = {}) => server.verifyAttendanceLocation({ lat: 29.8, lng: 74.5, accuracyM: 10, headers: new Headers(), settings, officeOnly: true, ...change })

test('location: valid office, missing headers, invalid coordinates and accuracy', () => {
  assert.equal(verify().distanceM, 0)
  assert.equal(verify().flags.length, 0)
  for (const [lat, lng] of [[NaN,74.5],[91,74.5],[29.8,181],[0,0]]) assert.throws(() => verify({ lat, lng }))
  assert.throws(() => verify({ accuracyM: 51 }), /accuracy/)
  for (const accuracyM of [0,-10,NaN]) assert.throws(() => verify({accuracyM}), /accuracy/)
  assert.throws(() => verify({ lat: 30 }), /away/)
  assert.ok(verify({ lat: 30, officeOnly: false }).flags.some(f => f.startsWith('OUT_OF_OFFICE')))
})
test('network: foreign IP and approved office public IP are enforced', () => {
  assert.throws(() => verify({ headers: new Headers({ 'x-vercel-ip-country': 'US' }) }), /VPN|foreign/)
  assert.throws(() => verify({ settings: { ...settings, requireOfficeWifiIp: true, officeWifiIp: '203.0.113.1' } }), /Wi-Fi/)
  assert.equal(verify({ settings: { ...settings, requireOfficeWifiIp: true, officeWifiIp: '203.0.113.1' }, headers: new Headers({ 'x-real-ip': '203.0.113.1' }) }).ip, '203.0.113.1')
})
test('employee PIN is salted, verified and compared correctly', () => {
  const first = server.hashEmployeePin('1234'), second = server.hashEmployeePin('1234')
  assert.notEqual(first, second)
  assert.equal(server.verifyEmployeePin('1234', first), true)
  assert.equal(server.verifyEmployeePin('0000', first), false)
  assert.equal(server.verifyEmployeePin('', first), false)
})
test('server rejects employee/editor access to every administrative operation', async () => {
  state.role = 'editor'
  const calls = [ ['getAdminAttendanceSnapshot',{month:'2026-11'}],['saveEmployee',{name:'Test'}],['resetEmployeeDevice',{id:1}],['regenerateEmployeeToken',{id:1}],['deleteEmployee',{id:1}],['saveAttendanceSettings',settings],['updateAttendanceRecord',{employeeId:1,workDate:'2026-11-16',status:'Present',mode:'create'}],['exportAttendanceExcel',{month:'2026-11'}],['exportAttendanceCsv',{month:'2026-11'}],['getAttendanceCycleFinalizations',{month:'2026-11'}],['finalizeAttendanceCycle',{month:'2026-11',employeeId:1}] ]
  for (const [name,data] of calls) await assert.rejects(api[name]({data}), /Forbidden/)
  state.signedIn = false
  await assert.rejects(api.getAdminAttendanceSnapshot({data:{month:'2026-11'}}), /Unauthorized/)
  state.signedIn = true; state.role = 'super_admin'
})
test('validators reject impossible dates and invalid times before SQL', async () => {
  for (const workDate of ['2026-02-30','2026-13-01','wrong']) await assert.rejects(api.updateAttendanceRecord({data:{mode:'create',employeeId:1,workDate,status:'Present'}}), /date/)
  await assert.rejects(api.updateAttendanceRecord({data:{mode:'create',employeeId:1,workDate:'2026-11-16',status:'Present',checkInTime:'25:00'}}), /HH:MM/)
  await assert.rejects(api.saveEmployee({data:{name:'Test',effectiveDate:'2026-02-30'}}), /date/)
})
