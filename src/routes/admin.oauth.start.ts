import { createFileRoute } from '@tanstack/react-router'
import {
  changeAdminPassword,
  getSessionUser,
  loginAdmin,
  resetAdminPassword,
  sendResetOtp,
  verifyOtpAndResetPassword,
} from '@/lib/auth.server'

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

          // 1. Send 6-Digit OTP to Email via Resend
          if (action === 'send-otp') {
            const email = String(body.email || '').trim()
            const result = await sendResetOtp(email)
            return new Response(JSON.stringify(result), {
              status: result.ok ? 200 : 400,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          // 2. Verify OTP & Set New Password
          if (action === 'verify-otp') {
            const email = String(body.email || '').trim()
            const otp = String(body.otp || '').trim()
            const newPassword = String(body.newPassword || '').trim()
            const result = await verifyOtpAndResetPassword(email, otp, newPassword)
            return new Response(JSON.stringify(result), {
              status: result.ok ? 200 : 400,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          // 3. Fallback: Master Recovery PIN
          if (action === 'forgot') {
            const email = String(body.email || '').trim()
            const recoveryKey = String(body.recoveryKey || '').trim()
            const newPassword = String(body.newPassword || '').trim()
            const result = await resetAdminPassword(email, recoveryKey, newPassword)
            return new Response(JSON.stringify(result), {
              status: result.ok ? 200 : 400,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          // 4. Change Password for Logged-in Staff
          if (action === 'change') {
            const user = await getSessionUser(request.headers)
            if (!user) {
              return new Response(JSON.stringify({ ok: false, error: 'Unauthorized: Session expired' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
              })
            }
            const oldPassword = String(body.oldPassword || '').trim()
            const newPassword = String(body.newPassword || '').trim()
            const result = await changeAdminPassword(user, oldPassword, newPassword)
            return new Response(JSON.stringify(result), {
              status: result.ok ? 200 : 400,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          // 5. Default: Login
          const identifier = String(body.identifier || body.email || '').trim()
          const password = String(body.password || '').trim()
          const result = await loginAdmin(identifier, password)

          if (!result || !result.ok || !result.token) {
            return new Response(JSON.stringify({ ok: false, error: result?.error || 'Invalid credentials' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          const headers = new Headers({
            'Content-Type': 'application/json',
            'Set-Cookie': `bei_admin_session=${result.token}; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000; Path=/`,
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
