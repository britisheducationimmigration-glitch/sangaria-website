import test from 'node:test'
import assert from 'node:assert/strict'
import mysql from 'mysql2/promise'
import { inflateRawSync } from 'node:zlib'
import { attendanceRuntime } from './attendance-runtime.mjs'

const uri = process.env.TEST_DATABASE_URL
function workbookEntries(base64) {
  const zip=Buffer.from(base64,'base64'), files=new Map()
  for(let offset=0;offset+30<zip.length && zip.readUInt32LE(offset)===0x04034b50;) {
    const method=zip.readUInt16LE(offset+8), size=zip.readUInt32LE(offset+18)
    const nameLength=zip.readUInt16LE(offset+26), extra=zip.readUInt16LE(offset+28)
    const start=offset+30+nameLength+extra
    const name=zip.subarray(offset+30,offset+30+nameLength).toString('utf8')
    const data=zip.subarray(start,start+size)
    files.set(name,(method===8?inflateRawSync(data):data).toString('utf8'))
    offset=start+size
  }
  return files
}
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
  const save = data => api.saveEmployee({ data: { name:'Integration Test', pin:'1234', monthlySalary:25000, effectiveDate:'2026-01-01', joiningDate:'2026-01-01', cycleStartDay:1, policyReason:'Integration policy update', expectedInTime:'09:30', expectedOutTime:'18:00', ...data } })
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
  await t.test('audit failure rolls back attendance mutation in the same transaction', async () => {
    await pool.query('RENAME TABLE attendance_edit_history TO attendance_edit_history_test_backup')
    try {
      await assert.rejects(manual({mode:'edit',workDate:'2026-11-16',checkInTime:'09:30',checkOutTime:'19:30',editNote:'Must roll back'}),/doesn't exist/)
    } finally { await pool.query('RENAME TABLE attendance_edit_history_test_backup TO attendance_edit_history') }
    const [rows]=await pool.query('SELECT work_minutes FROM attendance_logs WHERE employee_id=? AND work_date=?',[employee.id,'2026-11-16'])
    assert.equal(rows[0].work_minutes,480)
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
    const workbook=workbookEntries(excel.base64)
    const manifest=workbook.get('xl/workbook.xml')
    for(const name of ['Salary &amp; Cycle Summary','Daily Logs &amp; GPS','Break Details','Correction History','Original Punch Evidence']) assert.ok(manifest.includes(name),name)
    const summaryXml=workbook.get('xl/worksheets/sheet1.xml')
    assert.ok(summaryXml.includes('Integration Test'))
    assert.ok(summaryXml.includes(`<v>${before.earnedSalary}</v>`))
    assert.ok(summaryXml.includes('<v>25000</v>'))
    const csv=await api.exportAttendanceCsv({data:{month:'2026-10',employeeId:employee.id}})
    assert.ok(Buffer.from(csv.base64,'base64').toString().includes('Integration Test'))
  })
  await t.test('simultaneous correction and finalization preserve one consistent report', async () => {
    await manual({workDate:'2026-09-07'})
    const results=await Promise.allSettled([
      manual({mode:'edit',workDate:'2026-09-07',checkOutTime:'19:00',editNote:'Concurrent correction'}),
      api.finalizeAttendanceCycle({data:{month:'2026-09',employeeId:employee.id}}),
    ])
    assert.equal(results[1].status,'fulfilled')
    const [snapshots]=await pool.query('SELECT snapshot_json FROM attendance_cycle_snapshots WHERE employee_id=? AND selected_month=?',[employee.id,'2026-09'])
    const saved=JSON.parse(snapshots[0].snapshot_json)
    const [logs]=await pool.query('SELECT work_minutes FROM attendance_logs WHERE employee_id=? AND work_date=?',[employee.id,'2026-09-07'])
    assert.equal(saved.logs[0].workMinutes,logs[0].work_minutes)
    await assert.rejects(manual({mode:'edit',workDate:'2026-09-07',editNote:'Locked now'}),/finalized/)
  })
  await t.test('an existing migrated schema restarts without erasing records', async () => {
    const second=await attendanceRuntime(pool)
    await second.server.ensureAttendanceSchema()
    const report=await second.api.getAdminAttendanceSnapshot({data:{month:'2026-10'}})
    assert.equal(report.employees.length,1)
    assert.ok(report.summaries[0].earnedSalary>0)
  })
  await t.test('open manual shifts reject future overlaps in both insertion orders', async () => {
    await manual({workDate:'2026-08-04'})
    await assert.rejects(manual({workDate:'2026-08-03',checkOutTime:''}),/overlap/)
    await manual({workDate:'2026-11-19',checkOutTime:''})
    await assert.rejects(manual({workDate:'2026-11-20'}),/overlap/)
    await manual({mode:'edit',workDate:'2026-11-19',status:'Absent',checkInTime:'',checkOutTime:'',editNote:'Close test record'})
  })
  await t.test('overnight correction history records complete dates and net hours', async () => {
    await manual({workDate:'2026-08-05',checkInTime:'05:00',checkOutTime:'06:00'})
    const edited=await manual({mode:'edit',workDate:'2026-08-05',checkInTime:'22:00',checkOutTime:'06:00',checkOutNextDay:true,editNote:'Correct overnight shift'})
    const history=await api.getAttendanceRecordHistory({data:{employeeId:employee.id,workDate:'2026-08-05'}})
    assert.equal(edited.workMinutes,480)
    assert.ok(history[0].after.checkOutAt.startsWith('2026-08-06'))
    assert.ok(history[0].changesSummary.includes('2026-08-06'))
    const [audit]=await pool.query('SELECT * FROM employee_policy_audit WHERE employee_id=?',[employee.id])
    assert.ok(audit.length>0)
    assert.equal(audit[0].actor_email,'admin@example.test')
    assert.ok(audit[0].before_json.includes('25000'))
  })
  await t.test('overnight OUT works and archive keeps history while revoking link', async () => {
    state.now='2026-11-17T16:30:00Z';await punch('in')
    state.now='2026-11-18T00:30:00Z';await punch('out')
    const [rows]=await pool.query('SELECT work_minutes FROM attendance_logs WHERE employee_id=? AND work_date=?',[employee.id,'2026-11-17'])
    assert.equal(rows[0].work_minutes,480)
    await api.resetEmployeeDevice({data:{id:employee.id}})
    const oldToken=employee.accessToken
    const replacement=await api.regenerateEmployeeToken({data:{id:employee.id}})
    employee.accessToken=replacement.accessToken
    await assert.rejects(api.getEmployeePortalData({data:{token:oldToken}}),/not found/)
    const [beforeArchive]=await pool.query('SELECT id FROM attendance_logs WHERE employee_id=?',[employee.id])
    await api.deleteEmployee({data:{id:employee.id}})
    await assert.rejects(api.getEmployeePortalData({data:{token:employee.accessToken}}),/not found|deactivated/)
    const [logs]=await pool.query('SELECT id FROM attendance_logs WHERE employee_id=?',[employee.id])
    assert.equal(logs.length,beforeArchive.length)
  })
  await t.test('one-minute OUT is held for review; explicit admin approval is audited', async () => {
    employee=await save({name:'Short shift test'})
    state.now='2026-10-06T04:00:00Z';await punch('in')
    state.now='2026-10-06T04:01:00Z';await punch('out')
    const [rows]=await pool.query('SELECT status FROM attendance_logs WHERE employee_id=?',[employee.id])
    assert.equal(rows[0].status,'Review Required')
    state.now='2026-11-16T04:00:00Z'
    await assert.rejects(api.finalizeAttendanceCycle({data:{month:'2026-10',employeeId:employee.id}}),/insufficient-hours/)
    await manual({mode:'edit',workDate:'2026-10-06',status:'Half Day',checkInTime:'09:30',checkOutTime:'09:31',editNote:'Explicit exceptional half-day approval'})
    const report=await api.getAdminAttendanceSnapshot({data:{month:'2026-10'}})
    assert.equal(report.summaries.find(s=>s.employee.id===employee.id).payableDays,0.5)
  })
  await t.test('permanent deletion confirms name, rolls back failures and removes only the selected employee', async () => {
    await api.finalizeAttendanceCycle({data:{month:'2026-10',employeeId:employee.id}})
    await save({id:employee.id,name:employee.name,monthlySalary:30000,effectiveDate:'2026-11-01'})
    const [logs]=await pool.query('SELECT id FROM attendance_logs WHERE employee_id=?',[employee.id])
    const logIds=logs.map(log=>log.id)
    const [otherLogs]=await pool.query('SELECT id FROM attendance_logs WHERE employee_id<>? ORDER BY id',[employee.id])
    assert.ok(logIds.length>0);assert.ok(otherLogs.length>0)
    const deletion={id:employee.id,confirmationName:employee.name}
    await assert.rejects(api.permanentlyDeleteEmployee({data:{...deletion,confirmationName:'Wrong name'}}),/does not match/)
    // Fail after evidence/log deletes to prove the whole transaction rolls back.
    await pool.query('RENAME TABLE employee_policy_audit TO employee_policy_audit_delete_test')
    try { await assert.rejects(api.permanentlyDeleteEmployee({data:deletion}),/doesn't exist/) }
    finally { await pool.query('RENAME TABLE employee_policy_audit_delete_test TO employee_policy_audit') }
    assert.equal((await pool.query('SELECT id FROM attendance_logs WHERE employee_id=?',[employee.id]))[0].length,logIds.length)
    assert.ok((await pool.query('SELECT log_id FROM attendance_original_punches WHERE log_id IN (?)',[logIds]))[0].length>0)
    await api.permanentlyDeleteEmployee({data:deletion})
    for(const table of ['attendance_logs','attendance_edit_history','attendance_cycle_snapshots','employee_policy_history','employee_policy_audit']) {
      assert.equal((await pool.query('SELECT COUNT(*) AS n FROM '+table+' WHERE employee_id=?',[employee.id]))[0][0].n,0,table)
    }
    for(const table of ['attendance_original_punches','attendance_punch_events']) {
      assert.equal((await pool.query('SELECT COUNT(*) AS n FROM '+table+' WHERE log_id IN (?)',[logIds]))[0][0].n,0,table)
    }
    assert.equal((await pool.query('SELECT id FROM employees WHERE id=?',[employee.id]))[0].length,0)
    assert.deepEqual((await pool.query('SELECT id FROM attendance_logs WHERE employee_id<>? ORDER BY id',[employee.id]))[0],otherLogs)
    await assert.rejects(api.getEmployeePortalData({data:{token:employee.accessToken}}),/not found/)
    await assert.rejects(api.permanentlyDeleteEmployee({data:deletion}),/not found/)
  })
})
