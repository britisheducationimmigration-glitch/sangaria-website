import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/oauth/logout')({
  server: {
    handlers: {
      GET: async () => {
        const headers = new Headers({ Location: '/admin' })
        headers.append('Set-Cookie', 'webdev_app_session=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/')
        headers.append('Set-Cookie', 'bei_admin_session=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/')
        return new Response(null, { status: 302, headers })
      },
      POST: async () => {
        const headers = new Headers({
          'Content-Type': 'application/json',
          'Set-Cookie': 'bei_admin_session=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/',
        })
        return new Response(JSON.stringify({ ok: true }), { status: 200, headers })
      },
    },
  },
})
