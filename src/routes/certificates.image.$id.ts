import { createFileRoute } from '@tanstack/react-router'
import { queryRows } from '@/lib/db.server'
import { ensureAdminRecord, getAdminRole, getSessionUser } from '@/lib/auth.server'

export const Route = createFileRoute('/certificates/image/$id')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const id = Number(params.id)
        if (!Number.isSafeInteger(id) || id <= 0) return new Response('Not found', { status: 404 })
        try {
          const rows = await queryRows('SELECT image_data, image_mime_type, published FROM certificate_items WHERE id = ? LIMIT 1', [id])
          const row = rows[0]
          if (!row || !row.image_data) return new Response('Not found', { status: 404 })
          if (!Boolean(row.published)) {
            const user = await getSessionUser(request.headers)
            const allowed = user && (await ensureAdminRecord(user)) && ['super_admin', 'content_editor'].includes(await getAdminRole(user) || '')
            if (!allowed) return new Response('Not found', { status: 404 })
          }
          const mimeType = ['image/webp', 'image/jpeg', 'image/png'].includes(String(row.image_mime_type)) ? String(row.image_mime_type) : 'application/octet-stream'
          const bytes = Buffer.isBuffer(row.image_data) ? row.image_data : Buffer.from(row.image_data as Uint8Array)
          return new Response(bytes, {
            headers: {
              'Content-Type': mimeType,
              'Cache-Control': Boolean(row.published) ? 'public, max-age=60, s-maxage=60' : 'private, no-store',
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
