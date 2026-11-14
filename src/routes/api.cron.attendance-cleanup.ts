import { createFileRoute } from '@tanstack/react-router'
import { ensureAttendanceSchema, autoCloseOpenCheckIns } from '@/lib/attendance.server'
import { execute } from '@/lib/db.server'

export const Route = createFileRoute('/api/cron/attendance-cleanup')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const secret = process.env.CRON_SECRET
        if (!secret) return Response.json({ ok: false, error: 'Cleanup is not configured.' }, { status: 503 })
        if (request.headers.get('authorization') !== `Bearer ${secret}`) return new Response('Unauthorized', { status: 401 })
        await ensureAttendanceSchema()
        await autoCloseOpenCheckIns()
        const result = await execute(`UPDATE attendance_logs SET in_photo_data = NULL, out_photo_data = NULL
          WHERE work_date < DATE_FORMAT(DATE_SUB(UTC_TIMESTAMP(), INTERVAL 60 DAY), '%Y-%m-%d')
          AND (in_photo_data IS NOT NULL OR out_photo_data IS NOT NULL) LIMIT 2000`)
        return Response.json({ ok: true, cleared: result.affectedRows }, { headers: { 'Cache-Control': 'no-store' } })
      },
    },
  },
})
