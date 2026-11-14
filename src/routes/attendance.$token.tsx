import { useCallback, useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CalendarDays, CheckCircle2, Clock, Lock, MapPin, RefreshCw, ShieldAlert } from 'lucide-react'
import { getEmployeePortalData, markEmployeeAttendance } from '@/lib/attendance-functions'

type PortalSuccess = Awaited<ReturnType<typeof getEmployeePortalData>>
type PortalLoaderResult =
  | { ok: true; data: PortalSuccess }
  | { ok: false; errorMessage: string }

export const Route = createFileRoute('/attendance/$token')({
  loader: async ({ params }): Promise<PortalLoaderResult> => {
    try {
      const data = await getEmployeePortalData({ data: { token: params.token } })
      return { ok: true, data }
    } catch (cause) {
      return {
        ok: false,
        errorMessage: cause instanceof Error ? cause.message : 'Could not open this attendance link.',
      }
    }
  },
  head: () => ({
    meta: [
      { title: 'Staff Attendance · British Education & Immigration' },
      { name: 'robots', content: 'noindex,nofollow,noarchive' },
    ],
  }),
  component: EmployeeAttendancePage,
})

function distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const R = 6_371_000
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

function formatIstTime(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function formatHours(minutes: number) {
  if (!minutes) return '0h 0m'
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}

function EmployeeAttendancePage() {
  const loaderResult = Route.useLoaderData()
  const { token } = Route.useParams()

  if (!loaderResult.ok) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F9FAFB] px-5 py-12">
        <div className="w-full max-w-md rounded-2xl border border-[#E4E7EC] bg-white p-6 text-center shadow-sm">
          <ShieldAlert className="mx-auto size-12 text-[#F04438]" />
          <h1 className="mt-4 text-xl font-bold text-[#1D2939]">Attendance Link Unavailable</h1>
          <p className="mt-2 text-sm text-[#667085]">{loaderResult.errorMessage}</p>
        </div>
      </div>
    )
  }

  return <EmployeeAttendanceView initial={loaderResult.data} token={token} />
}

function EmployeeAttendanceView({ initial, token }: { initial: PortalSuccess; token: string }) {
  const [portal, setPortal] = useState<PortalSuccess>(initial)
  const [pin, setPin] = useState('')
  const [gps, setGps] = useState<{ lat: number; lng: number; accuracyM: number } | null>(null)
  const [gpsState, setGpsState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [gpsError, setGpsError] = useState('')
  const [busy, setBusy] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ text: string; tone: 'success' | 'error' } | null>(null)
  const [liveTime, setLiveTime] = useState('')

  useEffect(() => {
    const updateClock = () => {
      setLiveTime(
        new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }),
      )
    }
    updateClock()
    const id = window.setInterval(updateClock, 1000)
    return () => window.clearInterval(id)
  }, [])

  const fetchLocation = useCallback((): Promise<{ lat: number; lng: number; accuracyM: number }> => {
    return new Promise((resolve, reject) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        const msg = 'GPS location is not supported on this browser.'
        setGpsState('error')
        setGpsError(msg)
        reject(new Error(msg))
        return
      }
      setGpsState('loading')
      setGpsError('')
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const next = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracyM: Math.round(pos.coords.accuracy || 0),
          }
          setGps(next)
          setGpsState('ready')
          resolve(next)
        },
        (err) => {
          const msg =
            err.code === 1
              ? 'Location permission denied. Enable Location for this website to mark attendance.'
              : err.code === 2
                ? 'GPS signal unavailable. Turn on device Location / GPS and try again.'
                : 'Location request timed out. Move near a window and tap Refresh GPS.'
          setGpsState('error')
          setGpsError(msg)
          reject(new Error(msg))
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
      )
    })
  }, [])

  useEffect(() => {
    void fetchLocation().catch(() => undefined)
  }, [fetchLocation])

  async function submitAction(action: 'in' | 'out') {
    setBusy(true)
    setStatusMessage(null)
    try {
      const freshGps = await fetchLocation()
      const res = await markEmployeeAttendance({
        data: {
          token,
          action,
          pin,
          lat: freshGps.lat,
          lng: freshGps.lng,
          accuracyM: freshGps.accuracyM,
        },
      })
      const refreshed = await getEmployeePortalData({ data: { token } })
      setPortal(refreshed)
      setPin('')
      setStatusMessage({
        text:
          action === 'in'
            ? `Check In recorded (${res.distanceM}m from office).`
            : `Check Out recorded (${res.distanceM}m from office).`,
        tone: 'success',
      })
    } catch (cause) {
      setStatusMessage({
        text: cause instanceof Error ? cause.message : 'Could not mark attendance.',
        tone: 'error',
      })
    } finally {
      setBusy(false)
    }
  }

  const { employee, settings, todayIst, todayLog, recentLogs, summary } = portal
  const currentDistM = gps
    ? distanceMeters(gps.lat, gps.lng, settings.officeLat, settings.officeLng)
    : null
  const inRange = currentDistM !== null && currentDistM <= settings.allowedRadiusM
  const hasCheckedIn = Boolean(todayLog?.checkInAt)
  const hasCheckedOut = Boolean(todayLog?.checkOutAt)

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-4 py-6 text-[#1D2939] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-lg space-y-5">
        <header className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#465FFF]">
                British Education &amp; Immigration
              </p>
              <h1 className="mt-1 text-2xl font-bold text-[#1D2939]">{employee.name}</h1>
              {employee.designation && <p className="text-sm text-[#667085]">{employee.designation}</p>}
            </div>
            <span className="rounded-full bg-[#ECF3FF] px-3 py-1 text-xs font-semibold text-[#465FFF]">
              {todayIst}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#E4E7EC] pt-3 text-xs text-[#667085]">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Clock className="size-3.5 text-[#465FFF]" />
              IST: <strong className="text-[#1D2939]">{liveTime || '—'}</strong>
            </span>
            <span>
              Shift: {employee.expectedInTime} – {employee.expectedOutTime}
            </span>
          </div>
        </header>

        {/* GPS Location Card */}
        <section className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-sm font-bold text-[#1D2939]">
              <MapPin className="size-4 text-[#465FFF]" />
              Live GPS Location (Required)
            </h2>
            <button
              type="button"
              onClick={() => void fetchLocation().catch(() => undefined)}
              disabled={gpsState === 'loading' || busy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E7EC] px-3 py-1.5 text-xs font-semibold text-[#1D2939] hover:bg-[#F9FAFB] disabled:opacity-50"
            >
              <RefreshCw className={`size-3.5 ${gpsState === 'loading' ? 'animate-spin' : ''}`} />
              Refresh GPS
            </button>
          </div>

          {gpsState === 'loading' && (
            <p className="mt-3 text-xs text-[#667085]">Reading accurate GPS coordinates…</p>
          )}

          {gpsState === 'error' && (
            <p className="mt-3 rounded-xl bg-[#FEF3F2] p-3 text-xs font-medium text-[#F04438]">
              {gpsError}
            </p>
          )}

          {gps && (
            <div className="mt-3 grid grid-cols-2 gap-2.5 text-xs">
              <div className="rounded-xl bg-[#F9FAFB] p-3">
                <p className="text-[#667085]">Distance from Office</p>
                <p className={`mt-1 text-sm font-bold ${inRange ? 'text-[#12B76A]' : 'text-[#F79009]'}`}>
                  {currentDistM}m {inRange ? '· Inside Range ✓' : `(Max ${settings.allowedRadiusM}m)`}
                </p>
              </div>
              <div className="rounded-xl bg-[#F9FAFB] p-3">
                <p className="text-[#667085]">GPS Accuracy</p>
                <p className="mt-1 text-sm font-bold text-[#1D2939]">±{gps.accuracyM}m</p>
              </div>
            </div>
          )}

          {settings.requireOfficeWifiIp && (
            <p className="mt-3 text-[11px] font-medium text-[#667085]">
              Office Wi-Fi IP check is active for this workplace.
            </p>
          )}
        </section>

        {/* Check In / Out Box */}
        <section className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-xs space-y-4">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-3">
              <p className="text-[11px] font-medium text-[#667085]">Today Check In</p>
              <p className="mt-1 text-lg font-bold text-[#1D2939]">{formatIstTime(todayLog?.checkInAt ?? '')}</p>
            </div>
            <div className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-3">
              <p className="text-[11px] font-medium text-[#667085]">Today Check Out</p>
              <p className="mt-1 text-lg font-bold text-[#1D2939]">{formatIstTime(todayLog?.checkOutAt ?? '')}</p>
            </div>
          </div>

          {statusMessage && (
            <p
              role="status"
              className={`rounded-xl p-3 text-xs font-semibold ${
                statusMessage.tone === 'success'
                  ? 'bg-[#ECFDF3] text-[#12B76A]'
                  : 'bg-[#FEF3F2] text-[#F04438]'
              }`}
            >
              {statusMessage.text}
            </p>
          )}

          {!hasCheckedOut && employee.hasPin && (
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#1D2939]">
                <Lock className="size-3.5 text-[#465FFF]" />
                Enter your PIN
              </span>
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.currentTarget.value.replace(/\D/g, ''))}
                placeholder="4-digit PIN"
                className="min-h-11 w-full rounded-xl border border-[#E4E7EC] px-3.5 text-sm font-semibold text-[#1D2939] outline-none focus:border-[#465FFF]"
              />
            </label>
          )}

          {!hasCheckedIn ? (
            <button
              type="button"
              disabled={busy || gpsState !== 'ready' || (employee.hasPin && pin.length < 4)}
              onClick={() => void submitAction('in')}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#465FFF] px-5 py-3 text-sm font-bold text-white shadow-xs transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle2 className="size-4" />
              {busy ? 'Marking Check In…' : 'Mark Check In'}
            </button>
          ) : !hasCheckedOut ? (
            <button
              type="button"
              disabled={busy || gpsState !== 'ready' || (employee.hasPin && pin.length < 4)}
              onClick={() => void submitAction('out')}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1D2939] px-5 py-3 text-sm font-bold text-white shadow-xs transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Clock className="size-4" />
              {busy ? 'Marking Check Out…' : 'Mark Check Out'}
            </button>
          ) : (
            <div className="rounded-xl bg-[#ECFDF3] p-4 text-center text-sm font-bold text-[#12B76A]">
              Today&apos;s attendance is complete · Worked {formatHours(todayLog?.workMinutes ?? 0)}
            </div>
          )}
        </section>

        {/* Current Cycle Summary */}
        <section className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-bold text-[#1D2939]">
              <CalendarDays className="size-4 text-[#465FFF]" />
              Your Current Month Cycle
            </h2>
            <span className="text-[11px] font-medium text-[#667085]">
              {summary.cycleStartDate} → {summary.cycleEndDate}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
            <div className="rounded-xl bg-[#ECFDF3] p-2.5">
              <p className="text-[10px] font-medium text-[#667085]">Present</p>
              <p className="mt-1 text-base font-bold text-[#12B76A]">{summary.presentDays}</p>
            </div>
            <div className="rounded-xl bg-[#FFFAEB] p-2.5">
              <p className="text-[10px] font-medium text-[#667085]">Half / Leave</p>
              <p className="mt-1 text-base font-bold text-[#F79009]">
                {summary.halfDays + summary.leaveDays}
              </p>
            </div>
            <div className="rounded-xl bg-[#FEF3F2] p-2.5">
              <p className="text-[10px] font-medium text-[#667085]">Late</p>
              <p className="mt-1 text-base font-bold text-[#F04438]">{summary.lateCount}</p>
            </div>
            <div className="rounded-xl bg-[#ECF3FF] p-2.5">
              <p className="text-[10px] font-medium text-[#667085]">Hours</p>
              <p className="mt-1 text-base font-bold text-[#465FFF]">{Math.floor(summary.totalWorkMinutes / 60)}h</p>
            </div>
          </div>
        </section>

        {/* Recent History */}
        <section className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-xs">
          <h2 className="text-sm font-bold text-[#1D2939]">Recent Days</h2>
          <div className="mt-3 divide-y divide-[#E4E7EC] text-xs">
            {recentLogs.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 py-2.5">
                <div>
                  <p className="font-semibold text-[#1D2939]">{item.workDate}</p>
                  <p className="text-[#667085]">
                    In {formatIstTime(item.checkInAt)} · Out {formatIstTime(item.checkOutAt)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    item.status === 'Present'
                      ? 'bg-[#ECFDF3] text-[#12B76A]'
                      : item.status === 'Half Day'
                        ? 'bg-[#FFFAEB] text-[#F79009]'
                        : 'bg-[#FEF3F2] text-[#F04438]'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
            {recentLogs.length === 0 && (
              <p className="py-4 text-center text-[#667085]">No attendance logs recorded yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}