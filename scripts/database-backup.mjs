import mysql from 'mysql2/promise'
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'
import { createGzip, createGunzip } from 'node:zlib'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { createReadStream, createWriteStream } from 'node:fs'
import { appendFile, mkdtemp, open, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createInterface } from 'node:readline'

const magic=Buffer.from('BEI-BACKUP-v1\n')
const quote=name=>'`'+name.replaceAll('`','``')+'`'
function keyBytes(key) {
  const bytes=Buffer.from(key||'','base64')
  if(bytes.length!==32) throw Error('BACKUP_ENCRYPTION_KEY must be 32 random bytes encoded as base64')
  return bytes
}
function encode(value) {
  if(Buffer.isBuffer(value)) return {$binary:value.toString('base64')}
  if(value instanceof Date) return {$date:value.toISOString()}
  if(value && typeof value==='object') return {$json:value}
  return value
}
function decode(value) {
  if(value && typeof value==='object') {
    if('$binary' in value) return Buffer.from(value.$binary,'base64')
    if('$date' in value) return new Date(value.$date)
    if('$json' in value) return JSON.stringify(value.$json)
  }
  return value
}
const connect=uri=>mysql.createConnection({uri,timezone:'Z',supportBigNumbers:true,bigNumberStrings:true})

export async function backupDatabase({uri,key,file}) {
  if(!uri) throw Error('BACKUP_DATABASE_URL is required')
  const keyData=keyBytes(key),iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',keyData,iv)
  const connection=await connect(uri)
  try {
    await connection.query('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ')
    await connection.query('START TRANSACTION WITH CONSISTENT SNAPSHOT')
    async function* rows() {
      yield JSON.stringify({type:'meta',version:1,createdAt:new Date().toISOString()})+'\n'
      const [tables]=await connection.query("SHOW FULL TABLES WHERE Table_type = 'BASE TABLE'")
      for(const tableRow of tables) {
        const name=String(Object.values(tableRow)[0])
        const [ddl]=await connection.query('SHOW CREATE TABLE '+quote(name))
        const [keys]=await connection.query("SHOW KEYS FROM "+quote(name)+" WHERE Key_name = 'PRIMARY'")
        if(!keys.length) throw Error('A primary key is required for consistent export: '+name)
        const order=keys.sort((a,b)=>a.Seq_in_index-b.Seq_in_index).map(k=>quote(k.Column_name)).join(',')
        yield JSON.stringify({type:'table',name,schema:ddl[0]['Create Table']})+'\n'
        for(let offset=0;;offset+=500) {
          const [batch]=await connection.query('SELECT * FROM '+quote(name)+' ORDER BY '+order+' LIMIT 500 OFFSET '+offset)
          for(const row of batch) yield JSON.stringify({type:'row',table:name,row:Object.fromEntries(Object.entries(row).map(([k,v])=>[k,encode(v)]))})+'\n'
          if(batch.length<500) break
        }
      }
    }
    // Exclusive creation prevents replacing a known-good backup.
    await pipeline(Readable.from([Buffer.concat([magic,iv])]),createWriteStream(file,{flags:'wx',mode:0o600}))
    await pipeline(Readable.from(rows()),createGzip(),cipher,createWriteStream(file,{flags:'a',mode:0o600}))
    await appendFile(file,cipher.getAuthTag())
    await connection.commit()
    return {file,bytes:(await stat(file)).size}
  } catch(error) {await connection.rollback();throw error}
  finally {await connection.end()}
}

export async function restoreDatabase({uri,key,file}) {
  if(!uri) throw Error('RESTORE_DATABASE_URL must identify a new empty database')
  const keyData=keyBytes(key),connection=await connect(uri)
  const directory=await mkdtemp(join(tmpdir(),'bei-restore-'))
  const plaintext=join(directory,'verified.jsonl')
  try {
    const [existing]=await connection.query('SHOW TABLES')
    if(existing.length) throw Error('Restore refused: destination database must be empty')
    const size=(await stat(file)).size
    const handle=await open(file,'r')
    const prefix=Buffer.alloc(magic.length+12),tag=Buffer.alloc(16)
    try {await handle.read(prefix,0,prefix.length,0);await handle.read(tag,0,16,Math.max(0,size-16))}
    finally {await handle.close()}
    if(size<magic.length+28||!prefix.subarray(0,magic.length).equals(magic)) throw Error('Invalid backup header')
    const decipher=createDecipheriv('aes-256-gcm',keyData,prefix.subarray(magic.length))
    decipher.setAuthTag(tag)
    // Authenticate the entire file before executing any SQL.
    await pipeline(createReadStream(file,{start:magic.length+12,end:size-17}),decipher,createGunzip(),createWriteStream(plaintext,{flags:'wx',mode:0o600}))
    let table='',batch=[],columns=[]
    const flush=async()=>{
      if(!batch.length) return
      await connection.query('INSERT INTO '+quote(table)+' ('+columns.map(quote).join(',')+') VALUES ?',[batch])
      batch=[]
    }
    await connection.query('SET FOREIGN_KEY_CHECKS=0')
    try {
      for await(const line of createInterface({input:createReadStream(plaintext),crlfDelay:Infinity})) {
        const record=JSON.parse(line)
        if(record.type==='meta') {if(record.version!==1) throw Error('Unsupported backup version');continue}
        if(record.type==='table') {
          await flush();table=record.name;columns=[]
          if(typeof table!=='string'||!/^CREATE TABLE\s/i.test(record.schema)) throw Error('Invalid table definition')
          await connection.query(record.schema)
        } else if(record.type==='row') {
          if(record.table!==table) throw Error('Invalid row order')
          columns=Object.keys(record.row)
          batch.push(columns.map(name=>decode(record.row[name])))
          if(batch.length>=500) await flush()
        } else throw Error('Invalid backup record')
      }
      await flush()
    } finally {await connection.query('SET FOREIGN_KEY_CHECKS=1')}
  } finally {await connection.end();await rm(directory,{recursive:true,force:true})}
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  const command=process.argv[2],file=process.argv[3]
  if(!file||!['backup','restore'].includes(command)) throw Error('Usage: node scripts/database-backup.mjs backup|restore FILE')
  if(command==='backup') console.log(JSON.stringify(await backupDatabase({uri:process.env.BACKUP_DATABASE_URL,key:process.env.BACKUP_ENCRYPTION_KEY,file})))
  else {await restoreDatabase({uri:process.env.RESTORE_DATABASE_URL,key:process.env.BACKUP_ENCRYPTION_KEY,file});console.log('Restore completed into empty database')}
}
