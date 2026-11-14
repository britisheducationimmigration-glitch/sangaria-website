import { useCallback, useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CalendarDays, Camera, CheckCircle2, ChevronDown, Clock, Lock, MapPin, RefreshCw, ShieldAlert } from 'lucide-react'
import { getEmployeePortalData, markEmployeeAttendance } from '@/lib/attendance-functions'

type PortalSuccess = Awaited<ReturnType<typeof getEmployeePortalData>>
type PortalLoaderResult = { ok: true; data: PortalSuccess } | { ok: false; errorMessage: string }

export const Route = createFileRoute('/attendance/$token')({
  loader: async ({ params }): Promise<PortalLoaderResult> => {
    try {
      return { ok: true, data: await getEmployeePortalData({ data: { token: params.token } }) }
    } catch (cause) {
      return { ok: false, errorMessage: cause instanceof Error ? cause.message : 'Could not open this attendance link.' }
    }
  },
  head: () => ({
    meta: [{ title: 'Staff Attendance · British Education & Immigration' }, { name: 'robots', content: 'noindex,nofollow,noarchive' }],
  }),
  component: EmployeeAttendancePage,
})

function distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return Math.round(6_371_000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

const fmtIstTime = (iso: string) =>
  iso ? new Date(iso).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }) : '—'

const fmtHours = (mins: number) => (mins ? `${Math.floor(mins / 60)}h ${mins % 60}m` : '0h 0m')

function getOrCreateDeviceKey(): string {
  const storageKey = 'bei-staff-device-key-v1'
  try {
    const existing = window.localStorage.getItem(storageKey)
    if (existing && existing.length >= 16) return existing
    const fresh =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}-${Math.random().toString(36).slice(2, 10)}`
    window.localStorage.setItem(storageKey, fresh)
    return fresh
  } catch {
    return ''
  }
}

function EmployeeAttendancePage() {
  const res = Route.useLoaderData()
  const { token } = Route.useParams()
  if (!res.ok) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F9FAFB] px-5 py-12">
        <div className="w-full max-w-md rounded-2xl border border-[#E4E7EC] bg-white p-6 text-center shadow-sm">
          <ShieldAlert className="mx-auto size-12 text-[#F04438]" />
          <h1 className="mt-4 text-xl font-bold text-[#1D2939]">Attendance Link Unavailable</h1>
          <p className="mt-2 text-sm text-[#667085]">{res.errorMessage}</p>
        </div>
      </div>
    )
  }
  return <EmployeeAttendanceView initial={res.data} token={token} />
}

function EmployeeAttendanceView({ initial, token }: { initial: PortalSuccess; token: string }) {
  const [portal, setPortal] = useState<PortalSuccess>(initial)
  const [pin, setPin] = useState('')
  const [deviceKey, setDeviceKey] = useState('')
  const [gps, setGps] = useState<{ lat: number; lng: number; accuracyM: number } | null>(null)
  const [gpsState, setGpsState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [gpsError, setGpsError] = useState('')
  const [cameraState, setCameraState] = useState<'idle' | 'ready' | 'error'>('idle')
  const [cameraError, setCameraError] = useState('')
  const [busy, setBusy] = useState(false)
  const [stepLabel, setStepLabel] = useState('')
  const [showMore, setShowMore] = useState(false)
  const [breakNote, setBreakNote] = useState('')
  const [statusMsg, setStatusMsg] = useState<{ text: string; tone: 'success' | 'error' } | null>(null)
  const [liveTime, setLiveTime] = useState('')

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const { employee, settings, todayIst, todayLog, recentLogs, summary } = portal
  const hasCheckedIn = Boolean(todayLog?.checkInAt)
  const hasCheckedOut = Boolean(todayLog?.checkOutAt)

  useEffect(() => {
    setDeviceKey(getOrCreateDeviceKey())
    const tick = () => setLiveTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [])

  const startCamera = useCallback(async () => {
    if (!settings.requireSelfie || hasCheckedOut) return
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState('error')
      setCameraError('Live camera is not supported on this browser.')
      return
    }
    try {
      stopCamera()
      setCameraError('')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setCameraState('ready')
    } catch {
      setCameraState('error')
      setCameraError('Camera permission denied. Allow front camera access to mark attendance.')
    }
  }, [hasCheckedOut, settings.requireSelfie, stopCamera])

  useEffect(() => {
    if (settings.requireSelfie && !hasCheckedOut) void startCamera()
    return () => stopCamera()
  }, [hasCheckedOut, settings.requireSelfie, startCamera, stopCamera])

  const fetchLocation = useCallback((): Promise<{ lat: number; lng: number; accuracyM: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
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
          const next = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracyM: Math.round(pos.coords.accuracy || 0) }
          setGps(next)
          setGpsState('ready')
          resolve(next)
        },
        (err) => {
          const msg = err.code === 1 ? 'Location permission denied. Allow GPS to mark attendance.' : 'GPS signal unavailable. Turn on device Location and tap Refresh GPS.'
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

  async function captureLiveSelfie(): Promise<string> {
    if (!settings.requireSelfie) return ''
    const video = videoRef.current
    if (!video || !streamRef.current || video.videoWidth < 100) {
      throw new Error('Front camera is not ready. Tap Restart Camera and look into the frame.')
    }
   const canvas = document.createElement('canvas')
    const scale = Math.min(1, 360 / Math.max(video.videoWidth, video.videoHeight))
    const w = Math.max(160, Math.round(video.videoWidth * scale))
    const h = Math.max(160, Math.round(video.videoHeight * scale))
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not capture live selfie.')

    ctx.drawImage(video, 0, 0, w, h)
    const frame1 = ctx.getImageData(0, 0, w, h).data
    await new Promise((r) => window.setTimeout(r, 450))
    ctx.drawImage(video, 0, 0, w, h)
    const frame2 = ctx.getImageData(0, 0, w, h).data

    let diffSum = 0
    let samples = 0
    for (let i = 0; i < frame1.length; i += 48) {
      diffSum += Math.abs(frame1[i] - frame2[i]) + Math.abs(frame1[i + 1] - frame2[i + 1])
      samples += 2
    }
    const avgDiff = samples ? diffSum / samples : 0
    if (avgDiff < 0.7) {
      throw new Error('No live camera movement detected. Hold your phone naturally and blink or move slightly.')
    }

    let dataUrl = canvas.toDataURL('image/webp', 0.72)
    if (!dataUrl.startsWith('data:image/webp')) {
      dataUrl = canvas.toDataURL('image/jpeg', 0.75)
    }
    return dataUrl.split(',')[1] ?? ''
  }

  const hasOpenBreak = Boolean(todayLog?.breaks?.some((b) => b.outAt && !b.inAt))

  async function submitAction(action: 'in' | 'out' | 'half_out' | 'break_out' | 'break_in') {
    setBusy(true)
    setStatusMsg(null)
    try {
      let photoBase64 = ''
      if (action === 'in' || action === 'out' || action === 'half_out') {
        setStepLabel('Checking live selfie…')
        photoBase64 = await captureLiveSelfie()
      }
      setStepLabel('Verifying GPS location…')
      const freshGps = await fetchLocation()
      setStepLabel('Saving attendance…')
      const res = await markEmployeeAttendance({
        data: {
          token,
          action,
          pin,
          note: action === 'break_out' ? breakNote : '',
          deviceKey: deviceKey || getOrCreateDeviceKey(),
          photoBase64,
          lat: freshGps.lat,
          lng: freshGps.lng,
          accuracyM: freshGps.accuracyM,
        },
      })
      const refreshed = await getEmployeePortalData({ data: { token } })
      setPortal(refreshed)
      setPin('')
      if (action === 'break_out') setBreakNote('')
      if (action === 'out' || action === 'half_out') stopCamera()
      const msgMap: Record<typeof action, string> = {
        in: `Check In saved (${res.distanceM}m from office).`,
        out: `Check Out saved (${res.distanceM}m from office).`,
        half_out: `Half Day Check Out saved (${res.distanceM}m from office).`,
        break_out: `Stepped out recorded (${res.distanceM}m). Tap Back in Office when returning.`,
        break_in: `Back in Office recorded (${res.distanceM}m).`,
      }
      setStatusMsg({ text: msgMap[action], tone: 'success' })
    } catch (cause) {
      setStatusMsg({ text: cause instanceof Error ? cause.message : 'Could not mark attendance.', tone: 'error' })
    } finally {
      setStepLabel('')
      setBusy(false)
    }
  }
  const dist = gps ? distanceMeters(gps.lat, gps.lng, settings.officeLat, settings.officeLng) : null
  const inRange = dist !== null && dist <= settings.allowedRadiusM

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-4 py-6 text-[#1D2939] sm:px-6">
      <div className="mx-auto max-w-lg space-y-4">
        <header className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#465FFF]">British Education &amp; Immigration</p>
              <h1 className="mt-1 text-2xl font-bold text-[#1D2939]">{employee.name}</h1>
              {employee.designation && <p className="text-xs text-[#667085]">{employee.designation}</p>}
            </div>
            <span className="rounded-full bg-[#ECF3FF] px-3 py-1 text-xs font-semibold text-[#465FFF]">{todayIst}</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#E4E7EC] pt-3 text-xs text-[#667085]">
            <span className="inline-flex items-center gap-1.5 font-medium"><Clock className="size-3.5 text-[#465FFF]" /> IST: <strong className="text-[#1D2939]">{liveTime || '—'}</strong></span>
            <span>Shift: {employee.expectedInTime} – {employee.expectedOutTime}</span>
          </div>
        </header>

        {/* GPS Status */}
        <section className="rounded-2xl border border-[#E4E7EC] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#1D2939]"><MapPin className="size-4 text-[#465FFF]" /> GPS Location</h2>
            <button type="button" onClick={() => void fetchLocation().catch(() => undefined)} disabled={gpsState === 'loading' || busy} className="inline-flex items-center gap-1 rounded-lg border border-[#E4E7EC] px-2.5 py-1 text-xs font-semibold text-[#1D2939] hover:bg-[#F9FAFB]">
              <RefreshCw className={`size-3 ${gpsState === 'loading' ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
          {gpsState === 'error' && <p className="mt-2 rounded-xl bg-[#FEF3F2] p-2.5 text-xs font-medium text-[#F04438]">{gpsError}</p>}
          {gps && (
            <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl bg-[#F9FAFB] p-2.5"><p className="text-[#667085]">Distance</p><p className={`font-bold ${inRange ? 'text-[#12B76A]' : 'text-[#F79009]'}`}>{dist}m {inRange ? '· In Range ✓' : `(Max ${settings.allowedRadiusM}m)`}</p></div>
              <div className="rounded-xl bg-[#F9FAFB] p-2.5"><p className="text-[#667085]">Accuracy</p><p className="font-bold text-[#1D2939]">±{gps.accuracyM}m</p></div>
            </div>
          )}
        </section>

        {/* Today Check In / Out Card */}
        <section className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-xs space-y-4">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-3"><p className="text-[11px] font-medium text-[#667085]">Today Check In</p><p className="mt-1 text-lg font-bold text-[#1D2939]">{fmtIstTime(todayLog?.checkInAt ?? '')}</p></div>
            <div className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-3"><p className="text-[11px] font-medium text-[#667085]">Today Check Out</p><p className="mt-1 text-lg font-bold text-[#1D2939]">{fmtIstTime(todayLog?.checkOutAt ?? '')}</p></div>
          </div>

          {settings.requireSelfie && !hasCheckedOut && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#1D2939]"><Camera className="size-3.5 text-[#465FFF]" /> Live Camera Selfie</span>
                <button type="button" onClick={() => void startCamera()} className="text-[11px] font-semibold text-[#465FFF] hover:underline">Restart Camera</button>
              </div>
              {cameraState === 'error' ? (
                <p className="rounded-xl bg-[#FEF3F2] p-3 text-xs font-medium text-[#F04438]">{cameraError}</p>
              ) : (
                <div className="relative overflow-hidden rounded-xl border border-[#E4E7EC] bg-black aspect-[4/3]">
                  <video ref={videoRef} autoPlay playsInline muted className="size-full scale-x-[-1] object-cover" />
                </div>
              )}
            </div>
          )}

          {statusMsg && (
            <p role="status" className={`rounded-xl p-3 text-xs font-semibold ${statusMsg.tone === 'success' ? 'bg-[#ECFDF3] text-[#12B76A]' : 'bg-[#FEF3F2] text-[#F04438]'}`}>
              {statusMsg.text}
            </p>
          )}

          {!hasCheckedOut && employee.hasPin && (
            <label className="block">
              <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-[#1D2939]"><Lock className="size-3.5 text-[#465FFF]" /> Enter PIN</span>
              <input type="password" inputMode="numeric" maxLength={8} value={pin} onChange={(e) => setPin(e.currentTarget.value.replace(/\D/g, ''))} placeholder="4-digit PIN" className="field" />
            </label>
          )}

         {!hasCheckedIn ? (
            <button type="button" disabled={busy || gpsState !== 'ready' || (settings.requireSelfie && cameraState !== 'ready') || (employee.hasPin && pin.length < 4)} onClick={() => void submitAction('in')} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#465FFF] px-5 py-3 text-sm font-bold text-white shadow-xs disabled:opacity-50">
              <CheckCircle2 className="size-4" /> {busy ? stepLabel || 'Marking…' : 'Mark Check In'}
            </button>
          ) : !hasCheckedOut ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <button type="button" disabled={busy || gpsState !== 'ready' || (settings.requireSelfie && cameraState !== 'ready') || (employee.hasPin && pin.length < 4)} onClick={() => void submitAction('out')} className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-[#1D2939] px-3 py-3 text-xs font-bold text-white shadow-xs disabled:opacity-50 sm:text-sm">
                  <Clock className="size-4" /> {busy ? stepLabel || 'Saving…' : 'Check Out'}
                </button>
                <button type="button" disabled={busy || gpsState !== 'ready' || (settings.requireSelfie && cameraState !== 'ready') || (employee.hasPin && pin.length < 4)} onClick={() => void submitAction('half_out')} className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl border border-[#F79009] bg-[#FFFAEB] px-3 py-3 text-xs font-bold text-[#F79009] disabled:opacity-50 sm:text-sm">
                  Half Day Out
                </button>
              </div>

              <div className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-3 space-y-2">
                {hasOpenBreak ? (
                  <button type="button" disabled={busy || gpsState !== 'ready' || (employee.hasPin && pin.length < 4)} onClick={() => void submitAction('break_in')} className="flex min-h-10 w-full items-center justify-center rounded-xl bg-[#12B76A] px-4 py-2 text-xs font-bold text-white disabled:opacity-50">
                    {busy ? stepLabel || 'Saving…' : 'Back in Office (Resume Shift)'}
                  </button>
                ) : (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input value={breakNote} onChange={(e) => setBreakNote(e.target.value)} maxLength={120} placeholder="Reason if stepping out (e.g. Lunch / Bank)" className="field flex-1 !py-2 !text-xs" />
                    <button type="button" disabled={busy || gpsState !== 'ready' || (employee.hasPin && pin.length < 4)} onClick={() => void submitAction('break_out')} className="min-h-10 shrink-0 rounded-xl border border-[#E4E7EC] bg-white px-3.5 py-2 text-xs font-bold text-[#1D2939] hover:bg-[#ECF3FF] disabled:opacity-50">
                      Step Out / Break
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-[#ECFDF3] p-4 text-center text-sm font-bold text-[#12B76A]">
              Today&apos;s attendance complete ({todayLog?.status}) · Worked {fmtHours(todayLog?.workMinutes ?? 0)}
            </div>
          )}
        </section>

        {/* Show More Toggle (Hidden by default so page stays minimal) */}
        <button type="button" onClick={() => setShowMore((v) => !v)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E4E7EC] bg-white py-3 text-xs font-semibold text-[#667085] hover:bg-[#F9FAFB]">
          <span>{showMore ? 'Hide cycle summary & history' : 'Show my cycle summary & recent days'}</span>
          <ChevronDown className={`size-4 transition-transform ${showMore ? 'rotate-180' : ''}`} />
        </button>

        {showMore && (
          <div className="space-y-4">
            <section className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 text-sm font-bold text-[#1D2939]"><CalendarDays className="size-4 text-[#465FFF]" /> Current Cycle</h2>
                <span className="text-[11px] font-medium text-[#667085]">{summary.cycleStartDate} → {summary.cycleEndDate}</span>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                <div className="rounded-xl bg-[#ECFDF3] p-2"><p className="text-[10px] text-[#667085]">Present</p><p className="font-bold text-[#12B76A]">{summary.presentDays}</p></div>
                <div className="rounded-xl bg-[#FFFAEB] p-2"><p className="text-[10px] text-[#667085]">Half/Leave</p><p className="font-bold text-[#F79009]">{summary.halfDays + summary.leaveDays}</p></div>
                <div className="rounded-xl bg-[#FEF3F2] p-2"><p className="text-[10px] text-[#667085]">Late</p><p className="font-bold text-[#F04438]">{summary.lateCount}</p></div>
                <div className="rounded-xl bg-[#ECF3FF] p-2"><p className="text-[10px] text-[#667085]">Hours</p><p className="font-bold text-[#465FFF]">{Math.floor(summary.totalWorkMinutes / 60)}h</p></div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-xs">
              <h2 className="text-sm font-bold text-[#1D2939]">Recent Days</h2>
              <div className="mt-3 divide-y divide-[#E4E7EC] text-xs">
                {recentLogs.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div><p className="font-semibold text-[#1D2939]">{item.workDate}</p><p className="text-[#667085]">In {fmtIstTime(item.checkInAt)} · Out {fmtIstTime(item.checkOutAt)}</p></div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${item.status === 'Present' ? 'bg-[#ECFDF3] text-[#12B76A]' : item.status === 'Half Day' ? 'bg-[#FFFAEB] text-[#F79009]' : 'bg-[#FEF3F2] text-[#F04438]'}`}>{item.status}</span>
                  </div>
                ))}
                {recentLogs.length === 0 && <p className="py-4 text-center text-[#667085]">No logs yet.</p>}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}