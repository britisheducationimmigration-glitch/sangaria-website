import { Buffer } from 'node:buffer'
import { createFileRoute } from '@tanstack/react-router'
import { queryRows } from '@/lib/db.server'
import { ensureAdminRecord, getAdminRole, getSessionUser } from '@/lib/auth.server'

export const Route = createFileRoute('/success-stories/media/$id')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const id = Number(params.id)
        if (!Number.isSafeInteger(id) || id <= 0) return new Response('Not found', { status: 404 })
        try {
          const rows = await queryRows('SELECT photo_data, photo_mime_type, published, kind FROM success_stories WHERE id = ? LIMIT 1', [id])
          const row = rows[0]
          if (!row || row.kind !== 'approval' || !row.photo_data) return new Response('Not found', { status: 404 })
          if (!Boolean(row.published)) {
            const user = await getSessionUser(request.headers)
            const allowed = user && (await ensureAdminRecord(user)) && ['super_admin', 'content_editor'].includes(await getAdminRole(user) || '')
            if (!allowed) return new Response('Not found', { status: 404 })
          }
          const mimeType = ['image/webp', 'image/jpeg', 'image/png'].includes(String(row.photo_mime_type)) ? String(row.photo_mime_type) : 'application/octet-stream'
          const bytes = Buffer.isBuffer(row.photo_data) ? row.photo_data : Buffer.from(row.photo_data as Uint8Array)
          const body = new ArrayBuffer(bytes.byteLength)
          new Uint8Array(body).set(bytes)
          return new Response(body, {
            headers: {
              'Content-Type': mimeType,
              'Cache-Control': Boolean(row.published) ? 'public, max-age=300, must-revalidate' : 'private, no-store',
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
