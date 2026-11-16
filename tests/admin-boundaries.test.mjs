import test from 'node:test'
import assert from 'node:assert/strict'
import { attendanceRuntime } from './attendance-runtime.mjs'
const calls = []
const runtime = await attendanceRuntime({query(sql, values) {calls.push({sql,values}); return [[{total:260}]]}})
const api = await runtime.loadAdmin()
test('admin validators reject malformed cashflow, invalid URLs and self-demotion', async () => {
  await assert.rejects(api.saveCashflow({data:{cashflowData:[{slug:'canada'}]}}), /Invalid cashflow/)
  await assert.rejects(api.saveAdminUser({data:{email:'ADMIN@example.test',role:'content_editor'}}), /downgrade/)
  await assert.rejects(api.savePolicyNotice({data:{countrySlug:'all',title:'Test',message:'Test',status:'published',sourceVerified:true,showFrom:'2026-11-16',expiresOn:'2026-12-01',sourceLabel:'Official',sourceUrl:'https://'}}), /HTTPS/)
  assert.equal(calls.length,0)
})
test('enquiry paging denies content editors and rejects impossible dates', async () => {
  runtime.state.role = 'content_editor'
  await assert.rejects(api.getEnquiriesPage({data:{page:1}}), /permission/)
  runtime.state.role = 'super_admin'
  await assert.rejects(api.getEnquiriesPage({data:{from:'2026-02-30'}}), /Invalid enquiry date/)
})
