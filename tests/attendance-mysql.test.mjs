import test from 'node:test'
import assert from 'node:assert/strict'
import mysql from 'mysql2/promise'
import { attendanceRuntime } from './attendance-runtime.mjs'

const uri = process.env.TEST_DATABASE_URL
test('actual MySQL schema, punches, concurrency, corrections and frozen reports', { skip: !uri, timeout: 120000 }, async t => {
  // This suite never accepts DATABASE_URL and cannot connect to a production-named DB.
  const url = new URL(uri)
  if (!/^\/attendance_test(?:_[a-z0-9]+)?$/.test(url.pathname)) throw new Error('TEST_DATABASE_URL must target attendance_test only')
  const pool = mysql.createPool({ uri, connectionLimit: 8, timezone: 'Z', dateStrings: false })
  t.after(() => pool.end())
  await pool.query('CREATE TABLE IF NOT EXISTS site_settings (id INT PRIMARY KEY)')
  await pool.query('INSERT IGNORE INTO site_settings (id) VALUES (1)')
  const { api, server, state } = await attendanceRuntime(pool)
  const settings = { ...server.defaultAttendanceSettings, officeLat: 29.8, officeLng: 74.5, requireSelfie: false, requireOfficeWifiIp: false }
  let employee
  const save = data => api.saveEmployee({ data: { name:'Integration Test', pin:'1234', monthlySalary:25000, effectiveDate:'2026-01-01', joiningDate:'2026-01-01', cycleStartDay:1, expectedInTime:'09:30', expectedOutTime:'18:00', ...data } })
  const punch = (action, change = {}) => api.markEmployeeAttendance({ data: { token:employee.accessToken, pin:'1234', deviceKey:'test-device-identifier-1234', lat:29.8, lng:74.5, accuracyM:10, action, ...change } })
  const manual = data => api.updateAttendanceRecord({ data: { mode:'create', employeeId:employee.id, workDate:'2026-10-05', status:'Present', checkInTime:'09:00', checkOutTime:'18:00', editNote:'Test evidence', ...data } })
  await t.test('fresh migrations and repeated startup are idempotent', async () => {
    await server.ensureAttendanceSchema(); await server.ensureAttendanceSchema()
    const snapshot = await api.getAdminAttendanceSnapshot({data:{month:'2026-11'}})
    assert.equal(snapshot.employees.length, 0)
    await api.saveAttendanceSettings({data:settings})
    employee = await save({})
  })
  await t.test('invalid location, PIN, OUT before IN and selfie fail without binding', async () => {
    await assert.rejects(punch('in',{lat:undefined}), /GPS|location/)
    await assert.rejects(punch('in',{lat:31}), /away/)
    await assert.rejects(punch('in',{pin:'0000'}), /PIN/)
    await assert.rejects(punch('out'), /Check In/)
    await api.saveAttendanceSettings({data:{...settings,requireSelfie:true}})
    await assert.rejects(punch('in'), /selfie/)
    await api.saveAttendanceSettings({data:settings})
    const [rows] = await pool.query('SELECT bound_device_hash FROM employees WHERE id=?',[employee.id])
    assert.equal(rows[0].bound_device_hash,'')
  })
  await t.test('simultaneous IN produces one record and locks the device', async () => {
    const results = await Promise.allSettled([punch('in'),punch('in')])
    assert.equal(results.filter(r=>r.status==='fulfilled').length,1)
    const [rows] = await pool.query('SELECT * FROM attendance_logs WHERE employee_id=?',[employee.id])
    assert.equal(rows.length,1)
    await assert.rejects(punch('break_out',{deviceKey:'other-device-identifier-1234'}), /another registered/)
  })
  await t.test('breaks, duplicate requests and completed OUT calculate net minutes', async () => {
    state.now='2026-11-16T05:30:00Z'
    const results=await Promise.allSettled([punch('break_out'),punch('break_out')])
    assert.equal(results.filter(r=>r.status==='fulfilled').length,1)
    state.now='2026-11-16T06:30:00Z'; await punch('break_in')
    state.now='2026-11-16T12:30:00Z'; await punch('out')
    await assert.rejects(punch('out'),/already checked out/)
    const [rows]=await pool.query('SELECT work_minutes,break_minutes FROM attendance_logs WHERE employee_id=?',[employee.id])
    assert.equal(rows[0].work_minutes,450); assert.equal(rows[0].break_minutes,60)
  })
  await t.test('portal excludes salary, contact, network and GPS audit evidence', async () => {
    const portal=await api.getEmployeePortalData({data:{token:employee.accessToken}})
    const json=JSON.stringify(portal)
    for(const key of ['monthlySalary','earnedSalary','accessToken','inLat','inIp','phone','email','editedBy']) assert.equal(json.includes('"'+key+'"'),false,key)
  })
  await t.test('admin correction deducts existing breaks and preserves original evidence', async () => {
    await manual({mode:'edit',workDate:'2026-11-16',checkInTime:'09:30',checkOutTime:'18:30',editNote:'Correct end time'})
    const [rows]=await pool.query('SELECT work_minutes,break_minutes FROM attendance_logs WHERE employee_id=? AND work_date=?',[employee.id,'2026-11-16'])
    assert.equal(rows[0].work_minutes,480);assert.equal(rows[0].break_minutes,60)
    const [original]=await pool.query('SELECT * FROM attendance_original_punches')
    const [events]=await pool.query('SELECT * FROM attendance_punch_events')
    assert.equal(original.length,1);assert.equal(events.length,4)
  })
  await t.test('finalized reports freeze payroll, block edits and export XLSX/CSV', async () => {
    await manual({})
    await api.finalizeAttendanceCycle({data:{month:'2026-10',employeeId:employee.id}})
    const before=(await api.getAdminAttendanceSnapshot({data:{month:'2026-10'}})).summaries[0]
    await assert.rejects(manual({mode:'edit',editNote:'After finalization'}),/finalized/)
    await save({id:employee.id,monthlySalary:50000,effectiveDate:'2026-11-01'})
    const after=(await api.getAdminAttendanceSnapshot({data:{month:'2026-10'}})).summaries[0]
    assert.equal(before.earnedSalary,after.earnedSalary)
    const excel=await api.exportAttendanceExcel({data:{month:'2026-10',employeeId:employee.id}})
    assert.equal(Buffer.from(excel.base64,'base64').subarray(0,2).toString(),'PK')
    const csv=await api.exportAttendanceCsv({data:{month:'2026-10',employeeId:employee.id}})
    assert.ok(Buffer.from(csv.base64,'base64').toString().includes('Integration Test'))
  })
  await t.test('overnight OUT works and archive keeps history while revoking link', async () => {
    state.now='2026-11-17T16:30:00Z';await punch('in')
    state.now='2026-11-18T00:30:00Z';await punch('out')
    const [rows]=await pool.query('SELECT work_minutes FROM attendance_logs WHERE employee_id=? AND work_date=?',[employee.id,'2026-11-17'])
    assert.equal(rows[0].work_minutes,480)
    await api.deleteEmployee({data:{id:employee.id}})
    await assert.rejects(api.getEmployeePortalData({data:{token:employee.accessToken}}),/not found|deactivated/)
    const [logs]=await pool.query('SELECT id FROM attendance_logs WHERE employee_id=?',[employee.id])
    assert.equal(logs.length,3)
  })
})
