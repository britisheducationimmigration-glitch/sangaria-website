import { validCronAuthorization } from '@/lib/cron-secret.server'
import { createFileRoute } from '@tanstack/react-router'
import { ensureAttendanceSchema, autoCloseOpenCheckIns, todayIstDate } from '@/lib/attendance.server'
import { execute } from '@/lib/db.server'

export const Route = createFileRoute('/api/cron/attendance-cleanup')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const secret = process.env.CRON_SECRET
        if (!secret) return Response.json({ ok: false, error: 'Cleanup is not configured.' }, { status: 503 })
        if (!validCronAuthorization(request.headers.get('authorization'), secret)) return new Response('Unauthorized', { status: 401 })
        await ensureAttendanceSchema()
        await autoCloseOpenCheckIns()
        const cutoff = new Date(Date.parse(todayIstDate() + 'T00:00:00Z') - 60 * 86_400_000).toISOString().slice(0, 10)
        const result = await execute(
          `UPDATE attendance_logs SET in_photo_data = NULL, out_photo_data = NULL
           WHERE work_date < ?
           AND (in_photo_data IS NOT NULL OR out_photo_data IS NOT NULL) LIMIT 2000`,
          [cutoff],
        )
        return Response.json({ ok: true, cutoff, cleared: result.affectedRows }, { headers: { 'Cache-Control': 'no-store' } })
      },
    },
  },
})