import test from 'node:test'
import assert from 'node:assert/strict'
import mysql from 'mysql2/promise'
import { attendanceRuntime } from './attendance-runtime.mjs'
const uri=process.env.TEST_DATABASE_URL
test('admin pagination, IST dates, aggregates and policy transactions on MySQL', {skip:!uri}, async t=>{
  if(!/^\/attendance_test(?:_[a-z0-9]+)?$/.test(new URL(uri).pathname)) throw Error('Test database only')
  const pool=mysql.createPool({uri,connectionLimit:8,timezone:'Z'})
  t.after(()=>pool.end())
  const runtime=await attendanceRuntime(pool)
  const api=await runtime.loadAdmin()
  const prefix='audit-pagination-'
  for(let i=0;i<260;i++) await pool.query("INSERT INTO enquiries (name,phone,email,message,summary,notes,status,country,created_at,next_follow_up_at) VALUES (?, '9876543210', '', '', '', '', ?, 'Canada', ?, ?)",[prefix+i,i<205?'New':'Closed',i===0?'2026-11-15 19:00:00':'2026-11-14 10:00:00',i===0?'2026-11-16 09:00:00':null])
  await t.test('all leads beyond 150 and 200 are accessible with exact totals',async()=>{
    const first=await api.getEnquiriesPage({data:{query:prefix,status:'New'}})
    const last=await api.getEnquiriesPage({data:{query:prefix,status:'New',page:5}})
    assert.equal(first.total,205);assert.equal(first.items.length,50)
    assert.equal(last.items.length,5);assert.equal(last.page,5)
    assert.equal(new Set([...first.items,...last.items].map(i=>i.id)).size,55)
  })
  await t.test('IST date boundary and local follow-up time survive SQL mapping',async()=>{
    const page=await api.getEnquiriesPage({data:{query:prefix,from:'2026-11-16',to:'2026-11-16'}})
    assert.equal(page.total,1);assert.equal(page.items[0].nextFollowUpAt,'2026-11-16T09:00')
    const overdue=await api.getEnquiriesPage({data:{query:prefix,overdueOnly:true}})
    assert.equal(overdue.total,1)
  })
  await t.test('dashboard aggregates cover all enquiries',async()=>{
    const snapshot=await api.getAdminSnapshot()
    assert.equal(snapshot.enquiryStats.byMonth['2026-11'],260)
    assert.equal(snapshot.enquiryStats.topCountries.find(c=>c.country==='Canada').count,260)
  })
  await t.test('concurrent policy notice saves preserve both edits',async()=>{
    const notice={countrySlug:'all',title:'Audit notice',message:'Test only',status:'draft'}
    await Promise.all([api.savePolicyNotice({data:{...notice,id:'audit-one'}}),api.savePolicyNotice({data:{...notice,id:'audit-two'}})])
    const watch=await api.getAdminPolicyWatch()
    assert.ok(watch.notices.some(n=>n.id==='audit-one'));assert.ok(watch.notices.some(n=>n.id==='audit-two'))
    await Promise.all([api.deletePolicyNotice({data:{id:'audit-one'}}),api.savePolicyNotice({data:{...notice,id:'audit-three'}})])
    const after=await api.getAdminPolicyWatch()
    assert.ok(!after.notices.some(n=>n.id==='audit-one'));assert.ok(after.notices.some(n=>n.id==='audit-two'));assert.ok(after.notices.some(n=>n.id==='audit-three'))
  })
  await t.test('updateSettings updates controls without overwriting contact details',async()=>{
    await api.saveContactDetails({data:{phones:['+91 9658018000'],emails:['admissions@britisheducationandimmigration.com'],officeHours:'Mon – Sat · 9:30 AM – 7:30 PM'}})
    await api.updateSettings({data:{popupEnabled:false,popupDelaySeconds:25,whatsappEnabled:true,approvalsMarqueeEnabled:false,phones:['+91 1111111111'],emails:['stale@example.test'],officeHours:'Stale'}})
    const snapshot=await api.getAdminSnapshot()
    assert.equal(snapshot.settings.popupEnabled,false)
    assert.equal(snapshot.settings.popupDelaySeconds,25)
    assert.equal(snapshot.settings.approvalsMarqueeEnabled,false)
    assert.deepEqual(snapshot.settings.phones,['+91 9658018000'])
    assert.equal(snapshot.settings.officeHours,'Mon – Sat · 9:30 AM – 7:30 PM')
    await api.updateSettings({data:{popupEnabled:true,popupDelaySeconds:25,whatsappEnabled:true,approvalsMarqueeEnabled:true}})
  })
  await pool.query('DELETE FROM enquiries WHERE name LIKE ?', [prefix+'%'])
})