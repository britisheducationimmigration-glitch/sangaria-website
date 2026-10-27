import { createFileRoute } from '@tanstack/react-router'
import { changeAdminPassword, getSessionUser, loginAdmin, resetAdminPassword } from '@/lib/auth.server'

export const Route = createFileRoute('/admin/oauth/start')({
  server: {
    handlers: {
      GET: async () => {
        return new Response(null, { status: 302, headers: { Location: '/admin' } })
      },
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as Record<string, unknown>
          const action = String(body.action || 'login')

          if (action === 'forgot') {
            const email = String(body.email || '')
            const recoveryKey = String(body.recoveryKey || '')
            const newPassword = String(body.newPassword || '')
            const result = await resetAdminPassword(email, recoveryKey, newPassword)
            return new Response(JSON.stringify(result), {
              status: result.ok ? 200 : 400,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          if (action === 'change') {
            const user = await getSessionUser(request.headers)
            if (!user) {
              return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
              })
            }
            const oldPassword = String(body.oldPassword || '')
            const newPassword = String(body.newPassword || '')
            const result = await changeAdminPassword(user, oldPassword, newPassword)
            return new Response(JSON.stringify(result), {
              status: result.ok ? 200 : 400,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          // Default: Login
          const identifier = String(body.identifier || '')
          const password = String(body.password || '')
          const result = await loginAdmin(identifier, password)

          if (!result.ok || !result.token) {
            return new Response(JSON.stringify({ ok: false, error: result.error || 'Invalid credentials' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          const headers = new Headers({
            'Content-Type': 'application/json',
            'Set-Cookie': `bei_admin_session=${result.token}; HttpOnly; Secure; SameSite=Lax; Max-Age=604800; Path=/`,
          })

          return new Response(JSON.stringify({ ok: true, user: result.user }), {
            status: 200,
            headers,
          })
        } catch (cause) {
          const message = cause instanceof Error ? cause.message : 'Server error occurred'
          return new Response(JSON.stringify({ ok: false, error: message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      },
    },
  },
})
