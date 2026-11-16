import test from 'node:test'
import assert from 'node:assert/strict'
import mysql from 'mysql2/promise'
import { randomBytes } from 'node:crypto'
import { mkdtemp, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { backupDatabase, restoreDatabase } from '../scripts/database-backup.mjs'
test('encrypted backup restores 502 binary/JSON/UTC rows; wrong keys and nonempty targets are refused', {skip:!process.env.TEST_ADMIN_DATABASE_URL}, async()=>{
  const url=new URL(process.env.TEST_ADMIN_DATABASE_URL)
  if(!['127.0.0.1','localhost'].includes(url.hostname)||url.pathname!=='/attendance_test') throw Error('Isolated local CI database required')
  const admin=await mysql.createConnection({uri:url.toString(),timezone:'Z'})
  const sourceName='attendance_test_backup',targetName='attendance_test_restore'
  let sourceCreated=false,targetCreated=false
  const dir=await mkdtemp(join(tmpdir(),'bei-backup-test-'))
  try {
    await admin.query('CREATE DATABASE '+sourceName);sourceCreated=true
    await admin.query('CREATE DATABASE '+targetName);targetCreated=true
    const source=new URL(url);source.pathname='/'+sourceName
    const target=new URL(url);target.pathname='/'+targetName
    const sourceDb=await mysql.createConnection({uri:source.toString(),timezone:'Z'})
    try {
      await sourceDb.query('CREATE TABLE evidence (id BIGINT PRIMARY KEY, payload JSON, photo MEDIUMBLOB, punched TIMESTAMP NULL)')
      await sourceDb.execute('INSERT INTO evidence VALUES (?, ?, ?, ?)',[1,JSON.stringify({name:'Test employee',breaks:[1,2]}),Buffer.from([0,1,2,255]),new Date('2026-11-16T04:00:00Z')])
      for(let id=2;id<=502;id++) await sourceDb.execute('INSERT INTO evidence (id) VALUES (?)',[id])
    } finally {await sourceDb.end()}
    const key=randomBytes(32).toString('base64'),file=join(dir,'database.bin')
    assert.ok((await backupDatabase({uri:source.toString(),key,file})).bytes>0)
    await assert.rejects(restoreDatabase({uri:target.toString(),key:randomBytes(32).toString('base64'),file}))
    assert.equal((await admin.query('SHOW TABLES FROM '+targetName))[0].length,0)
    await restoreDatabase({uri:target.toString(),key,file})
    const [rows]=await admin.query('SELECT * FROM '+targetName+'.evidence WHERE id=1')
    assert.deepEqual(rows[0].photo,Buffer.from([0,1,2,255]))
    assert.equal(rows[0].payload.name,'Test employee')
    assert.equal(rows[0].punched.toISOString(),'2026-11-16T04:00:00.000Z')
    assert.equal((await admin.query('SELECT COUNT(*) AS n FROM '+targetName+'.evidence'))[0][0].n,502)
    await assert.rejects(restoreDatabase({uri:target.toString(),key,file}),/must be empty/)
  } finally {
    if(sourceCreated) await admin.query('DROP DATABASE '+sourceName)
    if(targetCreated) await admin.query('DROP DATABASE '+targetName)
    await admin.end();await rm(dir,{recursive:true,force:true})
  }
})
