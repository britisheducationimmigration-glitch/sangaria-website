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
    await assert.rejects(punch('in',{photoBase64:'aGVsbG8='}), /face and blink/)
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
    await assert.rejects(manual({workDate:'2026-08-03',checkOutTime:''}),/Check-out/)
    state.now='2026-11-19T04:00:00Z'
    await manual({workDate:'2026-11-19',checkOutTime:''})
    await assert.rejects(manual({workDate:'2026-11-20'}),/overlap/)
    await manual({mode:'edit',workDate:'2026-11-19',status:'Absent',checkInTime:'',checkOutTime:'',editNote:'Close test record'})
  })
  await t.test('daytime corrections retain full timestamp history and reject overnight shifts', async () => {
    await manual({workDate:'2026-08-05',checkInTime:'05:00',checkOutTime:'06:00'})
    await assert.rejects(manual({mode:'edit',workDate:'2026-08-05',checkInTime:'22:00',checkOutTime:'06:00',checkOutNextDay:true}),/same-day/)
    const edited=await manual({mode:'edit',workDate:'2026-08-05',checkInTime:'09:00',checkOutTime:'17:00',editNote:'Correct daytime shift'})
    const history=await api.getAttendanceRecordHistory({data:{employeeId:employee.id,workDate:'2026-08-05'}})
    assert.equal(edited.workMinutes,480)
    assert.ok(history[0].after.checkOutAt.startsWith('2026-08-05'))
    assert.ok(history[0].changesSummary.includes('2026-08-05'))
    const [audit]=await pool.query('SELECT * FROM employee_policy_audit WHERE employee_id=?',[employee.id])
    assert.ok(audit.length>0)
    assert.equal(audit[0].actor_email,'admin@example.test')
    assert.ok(audit[0].before_json.includes('25000'))
  })
  await t.test('overnight punches are blocked and archive preserves history', async () => {
    state.now='2026-11-17T16:30:00Z';await punch('in')
    state.now='2026-11-18T00:30:00Z';await assert.rejects(punch('out'),/Previous shift/)
    assert.equal((await api.getEmployeePortalData({data:{token:employee.accessToken}})).missedPreviousOutDate,'2026-11-17')
    await manual({mode:'edit',workDate:'2026-11-17',checkInTime:'09:30',checkOutTime:'17:30'})
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
  await t.test('admin leave stays approved and unapproved absence deducts net time only once', async () => {
    await save({id:employee.id,name:employee.name,minimumHalfDayMinutes:240,halfDayMinutes:480,effectiveDate:'2026-01-01'})
    for(const [date,status] of [['2026-07-07','Paid Leave'],['2026-07-08','Unpaid Leave'],['2026-07-09','Absent']]) {
      await manual({workDate:date,status,checkInTime:'',checkOutTime:'',editNote:'Approved by admin'})
    }
    state.now='2026-07-07T04:00:00Z'
    await assert.rejects(punch('in'),/Admin has marked leave/)
    const leaveReport=await api.getAdminAttendanceSnapshot({data:{month:'2026-07'}})
    assert.equal(leaveReport.summaries.find(s=>s.employee.id===employee.id).payableDays,1)
    state.now='2026-11-16T04:00:00Z'
    await manual({workDate:'2026-07-06'})
    const adjusted=await manual({mode:'edit',workDate:'2026-07-06',absenceStart:'2026-07-06T12:00',absenceEnd:'2026-07-06T15:00',editNote:'Left without informing'})
    assert.equal(adjusted.workMinutes,360);assert.equal(adjusted.breakMinutes,180);assert.equal(adjusted.status,'Half Day')
    const overlap=await manual({mode:'edit',workDate:'2026-07-06',absenceStart:'2026-07-06T13:00',absenceEnd:'2026-07-06T14:00',editNote:'Overlapping observation'})
    assert.equal(overlap.workMinutes,360)
    // Re-read through the same snapshot used by admin, not just the mutation response.
    const refreshed=await api.getAdminAttendanceSnapshot({data:{month:'2026-07'}})
    const persisted=refreshed.logs.find(log=>log.id===adjusted.id)
    assert.equal(persisted.breaks.filter(br=>br.note.startsWith('Admin - unapproved absence: ')).length,2)
    assert.equal(persisted.workMinutes,360);assert.equal(persisted.breakMinutes,180)
    await manual({mode:'edit',workDate:'2026-07-06',status:persisted.status,editNote:'Save without adding another absence'})
    const reread=await api.getAdminAttendanceSnapshot({data:{month:'2026-07'}})
    assert.equal(reread.logs.find(log=>log.id===adjusted.id).breaks.length,persisted.breaks.length)
    await assert.rejects(manual({mode:'edit',workDate:'2026-07-06',absenceStart:'2026-07-06T08:00',absenceEnd:'2026-07-06T10:00'}),/within the recorded shift/)
    await assert.rejects(manual({mode:'edit',workDate:'2026-07-06',absenceStart:'2026-07-06T15:00',absenceEnd:'2026-07-06T12:00'}),/Invalid unapproved/)
    state.now='2026-11-20T04:00:00Z';await punch('in')
    state.now='2026-11-20T06:00:00Z'
    await manual({mode:'edit',workDate:'2026-11-20',checkInTime:'09:30',checkOutTime:'',absenceStart:'2026-11-20T10:00',absenceEnd:'2026-11-20T11:00',editNote:'Returned before final checkout'})
    state.now='2026-11-20T12:00:00Z';await punch('out')
    const [rows]=await pool.query('SELECT work_minutes,status FROM attendance_logs WHERE employee_id=? AND work_date=?',[employee.id,'2026-11-20'])
    assert.equal(rows[0].work_minutes,420);assert.equal(rows[0].status,'Half Day')
    const history=await api.getAttendanceRecordHistory({data:{employeeId:employee.id,workDate:'2026-07-06'}})
    assert.ok(history.some(h=>h.after.absenceStart==='2026-07-06T12:00'))
    state.now='2026-11-16T04:00:00Z'
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
  await t.test('zero salary profiles save all edits without requiring a policy reason', async () => {
    const original=await api.saveEmployee({data:{name:'Initial profile',monthlySalary:0,effectiveDate:'2026-11-14',joiningDate:'2026-11-14'}})
    const changed={id:original.id,name:'Updated profile',designation:'Trainer',phone:'9876543210',email:'trainer@example.test',monthlySalary:22000,cycleStartDay:1,expectedInTime:'10:00',expectedOutTime:'18:30',officeOnly:false,active:true,joiningDate:'2026-11-14',leavingDate:'2027-12-31',halfDayMinutes:480,minimumHalfDayMinutes:240,lateGraceMinutes:15,weeklyOffDays:[0,6],holidayDates:['2026-12-25'],effectiveDate:'2026-11-14',pin:'5678'}
    const saved=await api.saveEmployee({data:changed})
    for(const key of ['name','designation','phone','email','monthlySalary','cycleStartDay','expectedInTime','expectedOutTime','officeOnly','active','joiningDate','leavingDate','halfDayMinutes','minimumHalfDayMinutes','lateGraceMinutes','weeklyOffDays','holidayDates']) assert.deepEqual(JSON.parse(JSON.stringify(saved[key])),changed[key],key)
    const [rows]=await pool.query('SELECT pin_hash FROM employees WHERE id=?',[saved.id])
    assert.ok(server.verifyEmployeePin('5678',rows[0].pin_hash))
    const [audit]=await pool.query('SELECT reason,before_json,after_json FROM employee_policy_audit WHERE employee_id=?',[saved.id])
    assert.equal(audit.length,1);assert.ok(audit[0].reason);assert.equal(JSON.parse(audit[0].before_json).monthlySalary,0);assert.equal(JSON.parse(audit[0].after_json).monthlySalary,22000)
    await api.updateAttendanceRecord({data:{employeeId:saved.id,mode:'create',workDate:'2026-11-16',status:'Present',checkInTime:'10:00',checkOutTime:'18:30',editNote:'Test shift'}})
    await assert.rejects(api.saveEmployee({data:{...changed,cycleStartDay:5,effectiveDate:'2026-12-01',clearPin:true,pin:''}}), /after attendance logs/)
    const pinCleared=await api.saveEmployee({data:{...changed,effectiveDate:'2026-12-01',clearPin:true,pin:''}})
    assert.equal(pinCleared.cycleStartDay,1);assert.equal(pinCleared.hasPin,false)
    const report=await api.getAdminAttendanceSnapshot({data:{month:'2026-11'}})
    assert.equal(report.summaries.find(s=>s.employee.id===saved.id).cycleStartDate,'2026-11-01')
    const inactive=await api.saveEmployee({data:{...changed,effectiveDate:'2026-12-01',active:false}})
    assert.equal(inactive.active,false)
  })
  await t.test('future salary stays scheduled while old reports show current employee settings', async () => {
    state.now='2026-11-16T04:00:00Z'
    const emp = await save({name:'Scheduled salary test', monthlySalary:22000})
    const result = await save({id:emp.id,name:emp.name,monthlySalary:33000,effectiveDate:'2026-12-01'})
    assert.equal(result.monthlySalary,22000)
    const before = await api.getAdminAttendanceSnapshot({data:{month:'2026-07'}})
    assert.equal(before.employees.find(e=>e.id===emp.id).monthlySalary,22000)
    state.now='2026-12-02T04:00:00Z'
    const after = await api.getAdminAttendanceSnapshot({data:{month:'2026-07'}})
    assert.equal(after.employees.find(e=>e.id===emp.id).monthlySalary,33000)
    assert.equal(after.summaries.find(e=>e.employee.id===emp.id).employee.monthlySalary,22000)
    state.now='2026-11-16T04:00:00Z'
  })
  await t.test('admin OUT closes breaks, merged absence is deducted once and leave clears intervals', async () => {
    employee = await save({name:'Break correction test'})
    state.now='2026-11-16T04:00:00Z'; await punch('in')
    state.now='2026-11-16T06:30:00Z'; await punch('break_out')
    state.now='2026-11-16T12:30:00Z'
    const closed = await manual({mode:'edit',workDate:'2026-11-16',checkInTime:'09:30',checkOutTime:'18:00'})
    assert.ok(closed.breaks.every(br=>br.inAt))
    assert.equal(closed.breakMinutes,360);assert.equal(closed.workMinutes,150)
    const leave = await manual({mode:'edit',workDate:'2026-11-16',status:'Paid Leave',checkInTime:'',checkOutTime:''})
    assert.equal(leave.breaks.length,0);assert.equal(leave.breakMinutes,0)
    state.now='2026-11-17T04:00:00Z';await punch('in')
    state.now='2026-11-17T06:30:00Z';await punch('break_out')
    state.now='2026-11-17T07:30:00Z';await punch('break_in')
    await manual({mode:'edit',workDate:'2026-11-17',checkInTime:'09:30',checkOutTime:'',absenceStart:'2026-11-17T12:30',absenceEnd:'2026-11-17T13:00'})
    state.now='2026-11-17T12:30:00Z';await punch('out')
    const [rows]=await pool.query('SELECT work_minutes,break_minutes FROM attendance_logs WHERE employee_id=? AND work_date=?',[employee.id,'2026-11-17'])
    assert.equal(rows[0].break_minutes,60);assert.equal(rows[0].work_minutes,450)
    const csv=await api.exportAttendanceCsv({data:{month:'2026-11',employeeId:employee.id}})
    assert.ok(csv.filename.endsWith('-emp-'+employee.id+'.csv'))
    state.now='2026-11-16T04:00:00Z'
  })

  await t.test('payslip adjustments, manual paid totals and void/reissue reconcile with the ledger', async () => {
    state.now='2026-11-16T12:30:00Z'
    const emp=await save({name:'Slip reconciliation test',monthlySalary:25000,joiningDate:'2026-11-01'})
    await api.updateAttendanceRecord({data:{employeeId:emp.id,mode:'create',workDate:'2026-11-02',status:'Present',checkInTime:'09:00',checkOutTime:'18:00',editNote:'Payslip fixture'}})
    const range={employeeId:emp.id,from:'2026-11-01',to:'2026-11-16'}
    await api.recordSalaryPayment({data:{...range,amount:100,paidOn:'2026-11-15',method:'Cash',reference:'existing',note:'Previously paid',requestKey:'payslip-existing-payment-0001'}})
    const input={employeeId:emp.id,month:'2026-11',allowanceAmount:500,deductionAmount:100,paidAmount:600,paymentMethod:'UPI',paidOn:'2026-11-16',paymentRef:'slip-ref'}
    await assert.rejects(api.issueSalarySlip({data:{...input,paidAmount:50}}),/lower than recorded/)
    await assert.rejects(api.issueSalarySlip({data:{...input,paymentMethod:''}}),/payment method/)
    const first=await api.issueSalarySlip({data:input})
    assert.equal(first.netPay,1400);assert.equal(first.snapshot.paidAmount,600)
    const after=await api.getEmployeeRangeReport({data:range})
    assert.equal(after.report.earned,1400);assert.equal(after.report.adjustmentTotal,400)
    assert.equal(after.throughToday.earned,1400);assert.equal(after.throughToday.paid,600);assert.equal(after.throughToday.pending,800)
    assert.equal(after.payments.length,2);assert.equal(after.payments.find(p=>p.reference==='slip-ref').amount,500)
    const earlier=await api.getEmployeeRangeReport({data:{...range,to:'2026-11-15'}})
    assert.equal(earlier.report.adjustmentTotal,0);assert.equal(earlier.report.earned,1000)
    await assert.rejects(api.issueSalarySlip({data:input}),/already exists/)
    assert.equal((await api.getEmployeeRangeReport({data:range})).payments.length,2)
    const workbook=await api.exportEmployeeRangeReport({data:range})
    assert.ok([...workbookEntries(workbook.base64).values()].some(text=>text.includes('Slip Adjustments')))
    await api.voidSalarySlip({data:{id:first.id,reason:'Correcting payslip, payment was actually made'}})
    const voided=await api.getEmployeeRangeReport({data:range})
    assert.equal(voided.throughToday.earned,1000);assert.equal(voided.throughToday.paid,600);assert.equal(voided.throughToday.pending,400)
    const reissued=await api.issueSalarySlip({data:{...input,paidAmount:undefined}})
    assert.equal(reissued.snapshot.paidAmount,600)
    const final=await api.getEmployeeRangeReport({data:range})
    assert.equal(final.throughToday.earned,1400);assert.equal(final.throughToday.paid,600);assert.equal(final.payments.length,2)
    await api.voidSalarySlip({data:{id:reissued.id,reason:'Testing payment allocation guard'}})
    await api.recordSalaryPayment({data:{...range,from:'2026-10-31',amount:10,paidOn:'2026-11-16',method:'Cash',reference:'overlap',note:'Allocation test',requestKey:'payslip-overlapping-payment-0001'}})
    await assert.rejects(api.issueSalarySlip({data:input}),/overlaps this salary cycle/)
    await api.permanentlyDeleteEmployee({data:{id:emp.id,confirmationName:emp.name}})
    assert.equal((await pool.query('SELECT * FROM salary_slips WHERE employee_id=?',[emp.id]))[0].length,0)
    state.now='2026-11-16T04:00:00Z'
  })

  await t.test('manual slips save and edit independently of attendance and payments',async()=>{
    const emp=await save({name:'Manual slip employee',monthlySalary:0})
    const input={employeeId:emp.id,requestKey:'6cd02816-e0bd-4eb3-b27f-1188d14b28b0',paymentMethod:'UPI',paymentRef:'manual-test',month:'2026-11',presentDays:20,workingDays:26,earnedSalary:20000,allowanceAmount:500,deductionAmount:100,paidAmount:15000}
    const first=await api.saveManualSalarySlip({data:input})
    assert.equal(first.snapshot.paymentMethod,'UPI')
    assert.equal(first.snapshot.paymentRef,'manual-test')
    assert.equal((await api.saveManualSalarySlip({data:input})).id,first.id)
    await assert.rejects(api.saveManualSalarySlip({data:{...input,requestKey:undefined}}),/already exists/)
    assert.equal(first.netPay,20400);assert.equal(first.snapshot.presentDays,20);assert.equal(first.snapshot.manual,true)
    const second=await api.saveManualSalarySlip({data:{...input,id:first.id,presentDays:22,earnedSalary:22000}})
    assert.equal(second.id,first.id);assert.equal(second.snapshot.presentDays,22);assert.equal(second.netPay,22400)
    const report=await api.getEmployeeRangeReport({data:{employeeId:emp.id,from:'2026-11-01',to:'2026-11-16'}})
    assert.equal(report.throughToday.earned,0);assert.equal(report.throughToday.paid,0)
    assert.equal((await pool.query('SELECT * FROM attendance_logs WHERE employee_id=?',[emp.id]))[0].length,0)
    await assert.rejects(api.saveManualSalarySlip({data:{...input,earnedSalary:-1}}),/valid/)
    state.role='enquiry_manager';await assert.rejects(api.saveManualSalarySlip({data:input}),/Forbidden/);state.role='super_admin'
    await api.permanentlyDeleteEmployee({data:{id:emp.id,confirmationName:emp.name}})
  })

  await t.test('employee range workbook and salary ledger are isolated, idempotent and reversible',async()=>{
    state.now='2026-11-16T12:30:00Z'
    const emp=await save({name:'Payment ledger test',monthlySalary:25000,joiningDate:'2026-11-01'})
    await api.updateAttendanceRecord({data:{employeeId:emp.id,mode:'create',workDate:'2026-11-02',status:'Present',checkInTime:'09:00',checkOutTime:'18:00',editNote:'Salary report fixture'}})
    const range={employeeId:emp.id,from:'2026-11-01',to:'2026-11-16'}
    const before=await api.getEmployeeRangeReport({data:range});assert.equal(before.report.earned,1000);assert.equal(before.report.days.length,16)
    const payment={...range,amount:300.50,paidOn:'2026-11-16',method:'UPI',reference:'test-reference',note:'Salary already paid',requestKey:'test-ledger-request-0001'}
    const [first,second]=await Promise.all([api.recordSalaryPayment({data:payment}),api.recordSalaryPayment({data:payment})]);assert.equal(first.id,second.id)
    await assert.rejects(api.recordSalaryPayment({data:{...payment,amount:301}}),/request changed/)
    await assert.rejects(api.recordSalaryPayment({data:{...payment,requestKey:'test-ledger-request-0002',amount:0}}),/positive/)
    const after=await api.getEmployeeRangeReport({data:range});assert.equal(after.throughToday.paid,300.50);assert.equal(after.throughToday.pending,699.50);assert.equal(after.payments.length,1)
    const oneDay=await api.getEmployeeRangeReport({data:{...range,from:'2026-11-02',to:'2026-11-02'}});assert.equal(oneDay.allocatedPaid,0);assert.equal(oneDay.overlappingPayments,1)
    const workbook=await api.exportEmployeeRangeReport({data:range});assert.ok(workbook.filename.includes('2026-11-01-to-2026-11-16'));const files=workbookEntries(workbook.base64);assert.ok([...files.values()].some(text=>text.includes('Salary Summary')))
    state.role='enquiry_manager';await assert.rejects(api.getEmployeeRangeReport({data:range}),/Forbidden/);await assert.rejects(api.recordSalaryPayment({data:payment}),/Forbidden/);await assert.rejects(api.reverseSalaryPayment({data:{id:first.id,reason:'Wrong'}}),/Forbidden/);state.role='super_admin'
    await api.reverseSalaryPayment({data:{id:first.id,reason:'Incorrect amount; retain original evidence'}})
    const reversed=await api.getEmployeeRangeReport({data:range});assert.equal(reversed.throughToday.paid,0);assert.equal(reversed.throughToday.pending,1000);assert.equal(reversed.payments[0].voided,true)
    await api.recordSalaryPayment({data:{...payment,amount:1200,requestKey:'test-ledger-request-0003'}})
     const advance=await api.getEmployeeRangeReport({data:range});assert.equal(advance.throughToday.pending,0);assert.equal(advance.throughToday.advance,200)
    await api.permanentlyDeleteEmployee({data:{id:emp.id,confirmationName:emp.name}});assert.equal((await pool.query('SELECT * FROM salary_payments WHERE employee_id=?',[emp.id]))[0].length,0)
    state.now='2026-11-16T04:00:00Z'
  })

  await t.test('IST photo cleanup cutoff and idempotent missing-out flagging', async () => {
    state.now = '2026-11-16T19:00:00Z'
    const emp = await save({ name: 'Cleanup & MissingOut Test', joiningDate: '2026-09-01' })
    const fakePhoto = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10])
    await pool.query(
      "INSERT INTO attendance_logs (employee_id, work_date, check_in_at, in_photo_data, status) VALUES (?, '2026-09-17', '2026-09-17 04:00:00', ?, 'Present'), (?, '2026-09-18', '2026-09-18 04:00:00', ?, 'Present')",
      [emp.id, fakePhoto, emp.id, fakePhoto],
    )
    const preview = await api.getAttendancePhotoCleanupPreview()
    assert.equal(preview.cutoff, '2026-09-18')
    assert.ok(preview.records >= 1 && preview.photos >= 1)
    const cleaned = await api.cleanOldAttendancePhotos({ data: { cutoff: preview.cutoff, confirmed: true } })
    assert.ok(cleaned.cleared >= 1)
    const [remaining] = await pool.query('SELECT work_date, in_photo_data IS NOT NULL AS has_photo FROM attendance_logs WHERE employee_id = ? ORDER BY work_date', [emp.id])
    assert.equal(Number(remaining[0].has_photo), 0)
    assert.equal(Number(remaining[1].has_photo), 1)
    await server.autoCloseOpenCheckIns()
    await server.autoCloseOpenCheckIns()
    const [flagged] = await pool.query('SELECT out_flags_json FROM attendance_logs WHERE employee_id = ? ORDER BY work_date', [emp.id])
    assert.deepEqual(JSON.parse(String(flagged[0].out_flags_json)), ['MISSING_OUT_REVIEW_REQUIRED'])
    await api.permanentlyDeleteEmployee({ data: { id: emp.id, confirmationName: emp.name } })
    state.now = '2026-11-16T04:00:00Z'
  })

})
