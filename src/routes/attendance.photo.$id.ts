import { Buffer } from 'node:buffer'
import { createFileRoute } from '@tanstack/react-router'
import { ensureAttendanceSchema } from '@/lib/attendance.server'
import { ensureAdminRecord, getAdminRole, getSessionUser } from '@/lib/auth.server'
import { queryRows } from '@/lib/db.server'

export const Route = createFileRoute('/attendance/photo/$id')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const id = Number(params.id)
        if (!Number.isSafeInteger(id) || id <= 0) return new Response('Not found', { status: 404 })

        const user = await getSessionUser(request.headers)
        const isSuperAdmin =
          user && (await ensureAdminRecord(user)) && (await getAdminRole(user)) === 'super_admin'
        if (!isSuperAdmin) return new Response('Not found', { status: 404 })

        const url = new URL(request.url)
        const type = url.searchParams.get('type') === 'out' ? 'out' : 'in'
        const col = type === 'out' ? 'out_photo_data' : 'in_photo_data'

        try {
          await ensureAttendanceSchema()
          const rows = await queryRows(`SELECT ${col} AS photo_blob FROM attendance_logs WHERE id = ? LIMIT 1`, [id])
          const blob = rows[0]?.photo_blob
          if (!blob) return new Response('Not found', { status: 404 })

          const bytes = Buffer.isBuffer(blob) ? blob : Buffer.from(blob as Uint8Array)
          const body = new ArrayBuffer(bytes.byteLength)
          new Uint8Array(body).set(bytes)
          return new Response(body, {
            headers: {
              'Content-Type': 'image/webp',
              'Cache-Control': 'private, no-store',
              'X-Content-Type-Options': 'nosniff',
            },
          })
        } catch {
          return new Response('Not found', { status: 404 })
        }
      },
    },
  },
})