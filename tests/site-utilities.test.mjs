import { attendanceDateWindow } from '../src/lib/attendance-date-filters.ts'
import { dateOnly } from '../src/lib/date-only.ts'
import { validCronAuthorization } from '../src/lib/cron-secret.server.ts'
import test from 'node:test'
import assert from 'node:assert/strict'
import { getSupportedVideoEmbedUrl } from '../src/lib/video.ts'
import { getBatchDateStatus, isValidBatchStartDate } from '../src/lib/batch-dates.ts'
import { createPageSeo } from '../src/lib/seo.ts'
import { evaluate } from '../src/lib/eligibility.ts'
test('video hosts reject lookalikes and credentials',()=>{
  for(const url of ['javascript:alert(1)','http://youtube.com/watch?v=dQw4w9WgXcQ','https://youtube.com.evil.test/watch?v=dQw4w9WgXcQ','https://user:pass@youtube.com/watch?v=dQw4w9WgXcQ']) assert.equal(getSupportedVideoEmbedUrl(url),'')
  assert.ok(getSupportedVideoEmbedUrl('https://youtu.be/dQw4w9WgXcQ').startsWith('https://www.youtube-nocookie.com/embed/'))
  assert.ok(getSupportedVideoEmbedUrl('https://vimeo.com/12345678/abc123').includes('h=abc123'))
})
test('batch dates obey IST and reject impossible dates',()=>{
  assert.equal(isValidBatchStartDate('2026-02-30'),false)
  assert.equal(isValidBatchStartDate('2028-02-29'),true)
  assert.equal(getBatchDateStatus('2026-11-16',new Date('2026-11-16T19:00:00Z')),'expired')
  assert.equal(getBatchDateStatus('2026-11-17',new Date('2026-11-16T19:00:00Z')),'upcoming')
})
test('SEO canonical URLs and descriptions are normalized',()=>{
  const seo=createPageSeo({title:'Test',description:'Example   '.repeat(60),path:'/countries/canada/'})
  assert.equal(seo.links[0].href,'https://www.britisheducationandimmigration.com/countries/canada')
  assert.ok(seo.meta.find(m=>m.name==='description').content.length<=160)
})
test('eligibility scores respect required factors',()=>{
  const rules={factors:[{id:'language',label:'Language',goals:['study'],options:[{value:'yes',points:10},{value:'no',points:0}]}],bands:[{min:0,label:'Test'}],countries:[{name:'Test',minScore:{study:50},minFactor:{language:10}}]}
  assert.equal(evaluate(rules,'study',{language:'yes'}).score,100)
  assert.equal(evaluate(rules,'study',{language:'no'}).countries[0].matchesChecklist,false)
})

test('cron authorization fails closed for absent, wrong and unequal-length values', () => {
  assert.equal(validCronAuthorization('Bearer secret', 'secret'), true)
  for (const value of [null, '', 'secret', 'Bearer secrex', 'Bearer secret-extra']) assert.equal(validCronAuthorization(value, 'secret'), false)
  assert.equal(validCronAuthorization('Bearer ', ''), false)
})

// Preserve database date-prefix behavior, including invalid/non-date inputs.

test('shared date-only conversion preserves existing content and sitemap semantics',()=>{
  for(const [value, expected] of [[new Date('2026-11-17T23:30:00Z'),'2026-11-17'],['2026-11-17','2026-11-17'],['2026-11-17T00:30:00+05:30','2026-11-17'],['invalid',''],[null,''],[undefined,'']]) assert.equal(dateOnly(value),expected)
})
import { attendanceFlagLabel, attendanceNeedsReview, isAttendanceLocationFlag } from '../src/lib/attendance-flags.ts'
test('admin approval is informational and does not fabricate a location warning',()=>{
  assert.equal(isAttendanceLocationFlag('ADMIN_REVIEW_APPROVED'),false)
  assert.equal(isAttendanceLocationFlag('HALF_DAY_OUT'),false)
  for(const flag of ['LOW_OR_MOCK_ACCURACY','FOREIGN_IP_US','VPN_OR_IP_MISMATCH_800KM','OUT_OF_OFFICE_400M']) assert.equal(isAttendanceLocationFlag(flag),true)
  const log={status:'Present',workDate:'2026-11-17',checkInAt:'2026-11-17T04:00Z',checkOutAt:'2026-11-17T12:00Z',inFlags:[],outFlags:['AUTO_CHECKOUT_10PM','ADMIN_REVIEW_APPROVED']}
  assert.equal(attendanceNeedsReview(log,'2026-11-17'),false)
  assert.equal(attendanceNeedsReview({...log,inFlags:['FOREIGN_IP_US']},'2026-11-17'),true)
  assert.equal(attendanceNeedsReview({...log,checkOutAt:''},'2026-11-18'),true)
  assert.equal(attendanceFlagLabel('ADMIN_REVIEW_APPROVED'),'Reviewed by admin')
})

test('date presets preserve all-dates and handle IST week/month boundaries',()=>{
  assert.deepEqual(attendanceDateWindow('all','2026-12-01','2026-12',''),{from:'',to:''})
  assert.deepEqual(attendanceDateWindow('week','2026-12-01','2026-12',''),{from:'2026-11-30',to:'2026-12-01'})
  assert.deepEqual(attendanceDateWindow('month','2028-02-29','2028-02',''),{from:'2028-02-01',to:'2028-02-29'})
})
