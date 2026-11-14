import '@tanstack/react-start/server-only'
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { execute, getDb } from './db.server'

let schema: Promise<void> | undefined
export async function ensureAttendanceReliabilitySchema() {
  schema ??= (async () => {
    await execute(`CREATE TABLE IF NOT EXISTS attendance_original_punches (
      log_id BIGINT UNSIGNED PRIMARY KEY, snapshot_json LONGTEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`)
    await execute(`CREATE TABLE IF NOT EXISTS attendance_punch_events (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, log_id BIGINT UNSIGNED NOT NULL,
      action VARCHAR(16) NOT NULL, snapshot_json LONGTEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX log_event (log_id, created_at)
    )`)
    await execute(`CREATE TABLE IF NOT EXISTS attendance_cycle_snapshots (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, employee_id BIGINT UNSIGNED NOT NULL,
      selected_month VARCHAR(7) NOT NULL, cycle_start_date VARCHAR(10) NOT NULL,
      cycle_end_date VARCHAR(10) NOT NULL, snapshot_json LONGTEXT NOT NULL,
      finalized_by VARCHAR(190) NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY employee_month (employee_id, selected_month)
    )`)
  })().catch((error) => { schema = undefined; throw error })
  await schema
}

export async function attendanceTransaction<T>(action: (db: {
  queryRows: (sql: string, values?: unknown[]) => Promise<(RowDataPacket & Record<string, unknown>)[]>
  execute: (sql: string, values?: Parameters<typeof execute>[1]) => Promise<ResultSetHeader>
}) => Promise<T>): Promise<T> {
  const pool = await getDb()
  if (!pool) throw new Error('Database is not configured')
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const result = await action({
      queryRows: async (sql, values = []) => {
        const [rows] = await connection.query<(RowDataPacket & Record<string, unknown>)[]>(sql, values)
        return rows
      },
      execute: async (sql, values = []) => {
        const [result] = await connection.execute<ResultSetHeader>(sql, values)
        return result
      },
    })
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    throw error
  } finally { connection.release() }
}

export function csvText(rows: unknown[][]) {
  return '\uFEFF' + rows.map((row) => row.map((value) => {
    let cell = String(value ?? '')
    // Spreadsheet programs can execute formulas even inside quoted CSV cells.
    if (/^[=+@\-\t\r]/.test(cell)) cell = "'" + cell
    return '"' + cell.replace(/"/g, '""') + '"'
  }).join(',')).join('\r\n')
}
