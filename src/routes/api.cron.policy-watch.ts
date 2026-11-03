import { createFileRoute } from '@tanstack/react-router'
import { scanOfficialPolicySources } from '@/lib/policy-watch.server'

export const Route = createFileRoute('/api/cron/policy-watch')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const secret = process.env.CRON_SECRET
        if (!secret) return Response.json({ ok: false, error: 'Scheduled policy scan is not configured.' }, { status: 503 })
        if (request.headers.get('authorization') !== `Bearer ${secret}`) {
          return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
        }
        try {
          const result = await scanOfficialPolicySources()
          return Response.json({ ok: true, ...result })
        } catch (error) {
          return Response.json({ ok: false, error: error instanceof Error ? error.message : 'Policy scan failed' }, { status: 500 })
        }
      },
    },
  },
})
