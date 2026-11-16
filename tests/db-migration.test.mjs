import test from 'node:test'
import assert from 'node:assert/strict'
import mysql from 'mysql2/promise'
import { attendanceRuntime } from './attendance-runtime.mjs'
test('existing sites receive migrations without reseeding; enquiry transactions roll back', {skip:!process.env.TEST_DATABASE_URL}, async t=>{
  const uri=process.env.TEST_DATABASE_URL
  if(!/^\/attendance_test(?:_[a-z0-9]+)?$/.test(new URL(uri).pathname)) throw Error('Test database only')
  const pool=mysql.createPool({uri,connectionLimit:5,timezone:'Z'})
  t.after(()=>pool.end())
  await pool.query('CREATE TABLE IF NOT EXISTS site_settings (id TINYINT UNSIGNED PRIMARY KEY, popup_enabled BOOLEAN DEFAULT TRUE, popup_delay_seconds INT UNSIGNED DEFAULT 8, whatsapp_enabled BOOLEAN DEFAULT TRUE, approvals_marquee_enabled BOOLEAN DEFAULT TRUE, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)')
  await pool.query('INSERT IGNORE INTO site_settings (id) VALUES (1)')
  const runtime=await attendanceRuntime(pool,{realDb:true})
  await runtime.database.getDb()
  const [cols]=await pool.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='site_settings'")
  assert.ok(cols.some(c=>c.COLUMN_NAME==='country_catalog_json'))
  assert.equal((await pool.query('SELECT version FROM app_schema_migrations'))[0].length,1)
  assert.equal((await pool.query('SELECT id FROM content_posts'))[0].length,0,'Existing empty content must not be repopulated')
  const [lead]=await pool.query("INSERT INTO enquiries (name,phone,message,summary,notes) VALUES ('Test','1234567890','','','')")
  await pool.query("INSERT INTO enquiry_activities (enquiry_id,body) VALUES (?, 'Preserve me')",[lead.insertId])
  await assert.rejects(runtime.database.databaseTransaction(async connection=>{
    await connection.execute('DELETE FROM enquiry_activities WHERE enquiry_id=?',[lead.insertId])
    await connection.execute('DELETE FROM enquiries_missing_for_test WHERE id=?',[lead.insertId])
  }),/doesn't exist/)
  assert.equal((await pool.query('SELECT id FROM enquiry_activities WHERE enquiry_id=?',[lead.insertId]))[0].length,1)
  await runtime.database.databaseTransaction(async connection=>{
    await connection.execute('DELETE FROM enquiry_activities WHERE enquiry_id=?',[lead.insertId])
    await connection.execute('DELETE FROM enquiries WHERE id=?',[lead.insertId])
  })
  const restarted=await attendanceRuntime(pool,{realDb:true})
  await restarted.database.getDb()
  assert.equal((await pool.query('SELECT version FROM app_schema_migrations'))[0].length,1)
})
