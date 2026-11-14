import { useEffect, useState, type FormEvent } from 'react'
import { CalendarDays, Check, Copy, Download, ExternalLink, History, MapPin, Pencil, Plus, RefreshCw, Smartphone, Trash2, Users } from 'lucide-react'
import { deleteEmployee, exportAttendanceExcel, getAdminAttendanceSnapshot, regenerateEmployeeToken, resetEmployeeDevice, saveAttendanceSettings, saveEmployee, updateAttendanceRecord } from '@/lib/attendance-functions'
import type { AdminAttendanceSnapshot, AttendanceLogRecord, AttendanceSettings, EmployeeRecord } from '@/lib/content-types'
import { AttendanceEditModal, EmployeeFormModal, type EmployeeDraft, type LogDraft } from './AttendanceModals'

type SubTab = 'logs' | 'monthly' | 'employees'

function currentIstMonth() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit' }).formatToParts(new Date())
  return `${parts.find((p) => p.type === 'year')?.value ?? '2026'}-${parts.find((p) => p.type === 'month')?.value ?? '01'}`
}

const fmtIstTime = (iso: string) =>
  iso ? new Date(iso).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }) : '—'

function istHHMM(iso: string) {
  if (!iso) return ''
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date(iso))
  const h = parts.find((p) => p.type === 'hour')?.value ?? '00'
  const m = parts.find((p) => p.type === 'minute')?.value ?? '00'
  return `${h === '24' ? '00' : h}:${m}`
}

const fmtHours = (mins: number) => (mins ? `${Math.floor(mins / 60)}h ${mins % 60}m` : '0h 0m')
const fmtInr = (amount: number) => `₹${Math.round(amount).toLocaleString('en-IN')}`
const mapHref = (lat: number | null, lng: number | null) => (lat !== null && lng !== null ? `https://maps.google.com/?q=${lat},${lng}` : '')

export function AttendancePanel({ onNotice }: { onNotice: (msg: string) => void }) {
  const [month, setMonth] = useState(currentIstMonth)
  const [subTab, setSubTab] = useState<SubTab>('logs')
  const [snapshot, setSnapshot] = useState<(AdminAttendanceSnapshot & { currentRequestIp: string }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [filterDate, setFilterDate] = useState('')
  const [filterEmpId, setFilterEmpId] = useState(0)
  const [empDraft, setEmpDraft] = useState<EmployeeDraft | null>(null)
  const [logDraft, setLogDraft] = useState<LogDraft | null>(null)
  const [settingsDraft, setSettingsDraft] = useState<AttendanceSettings | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  async function load(targetMonth = month) {
    setLoading(true)
    setError('')
    try {
      const next = await getAdminAttendanceSnapshot({ data: { month: targetMonth } })
      setSnapshot(next)
      setSettingsDraft(next.settings)
      setFilterDate((prev) => prev || next.todayIst)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load attendance.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load(month)
  }, [month])

  async function downloadExcel(employeeId = 0) {
    setBusy(true)
    try {
      const result = await exportAttendanceExcel({ data: { month, employeeId } })
      const bytes = Uint8Array.from(atob(result.base64), (c) => c.charCodeAt(0))
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
      const link = document.createElement('a')
      link.href = url
      link.download = result.filename
      link.click()
      URL.revokeObjectURL(url)
      onNotice('Attendance & salary report exported to Excel.')
    } catch (cause) {
      onNotice(cause instanceof Error ? cause.message : 'Export failed.')
    } finally {
      setBusy(false)
    }
  }

  async function handleSaveEmployee(e: FormEvent) {
    e.preventDefault()
    if (!empDraft) return
    setBusy(true)
    try {
      await saveEmployee({ data: empDraft })
      setEmpDraft(null)
      await load(month)
      onNotice('Employee saved.')
    } catch (cause) {
      onNotice(cause instanceof Error ? cause.message : 'Could not save employee.')
    } finally {
      setBusy(false)
    }
  }

  async function handleSaveLog(e: FormEvent) {
    e.preventDefault()
    if (!logDraft) return
    setBusy(true)
    try {
      await updateAttendanceRecord({ data: logDraft })
      setLogDraft(null)
      await load(month)
      onNotice('Attendance record saved with audit history.')
    } catch (cause) {
      onNotice(cause instanceof Error ? cause.message : 'Could not save record.')
    } finally {
      setBusy(false)
    }
  }

  async function handleSaveSettings(e: FormEvent) {
    e.preventDefault()
    if (!settingsDraft) return
    setBusy(true)
    try {
      await saveAttendanceSettings({ data: settingsDraft })
      await load(month)
      onNotice('Office GPS & security settings saved.')
    } catch (cause) {
      onNotice(cause instanceof Error ? cause.message : 'Could not save settings.')
    } finally {
      setBusy(false)
    }
  }

  async function handleResetDevice(emp: EmployeeRecord) {
    if (!window.confirm(`Refresh device lock for ${emp.name}? Next phone that opens their link with PIN will become their bound device.`)) return
    setBusy(true)
    try {
      await resetEmployeeDevice({ data: { id: emp.id } })
      await load(month)
      onNotice(`Device lock refreshed for ${emp.name}.`)
    } finally {
      setBusy(false)
    }
  }

  async function handleRegenerate(emp: EmployeeRecord) {
    if (!window.confirm(`Generate new link for ${emp.name}? Old link will stop working.`)) return
    setBusy(true)
    try {
      await regenerateEmployeeToken({ data: { id: emp.id } })
      await load(month)
      onNotice(`New link created for ${emp.name}.`)
    } finally {
      setBusy(false)
    }
  }

  async function handleDeleteEmp(emp: EmployeeRecord) {
    if (!window.confirm(`Delete ${emp.name} and all their attendance records?`)) return
    setBusy(true)
    try {
      await deleteEmployee({ data: { id: emp.id } })
      await load(month)
      onNotice('Employee deleted.')
    } finally {
      setBusy(false)
    }
  }

  const portalUrl = (token: string) => (typeof window === 'undefined' ? `/attendance/${token}` : `${window.location.origin}/attendance/${token}`)

  async function copyLink(emp: EmployeeRecord) {
    try {
      await navigator.clipboard.writeText(portalUrl(emp.accessToken))
      setCopiedId(emp.id)
      window.setTimeout(() => setCopiedId(null), 2000)
      onNotice(`Copied link for ${emp.name}.`)
    } catch {
      onNotice('Could not copy automatically.')
    }
  }

  function openEditLog(log: AttendanceLogRecord) {
    setLogDraft({
      mode: 'edit',
      employeeId: log.employeeId,
      employeeName: log.employeeName,
      workDate: log.workDate,
      status: log.status,
      checkInTime: istHHMM(log.checkInAt),
      checkOutTime: istHHMM(log.checkOutAt),
      isLate: log.isLate,
      editNote: '',
      editHistory: log.editHistory,
    })
  }

  if (loading && !snapshot) return <div className="rounded-2xl border border-[#E4E7EC] bg-white p-8 text-sm text-[#667085]">Loading attendance…</div>
  if (error && !snapshot) return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">{error}</div>
  if (!snapshot) return null

  const { employees, logs, summaries, todayIst, currentRequestIp } = snapshot
  const todayLogs = logs.filter((l) => l.workDate === todayIst)
  const visibleLogs = logs.filter((l) => (!filterDate || l.workDate === filterDate) && (!filterEmpId || l.employeeId === filterEmpId))

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#465FFF]">Super Admin Only</p>
          <h2 className="mt-1 text-2xl font-bold text-[#1D2939] sm:text-3xl">Staff Attendance &amp; Salary</h2>
          <p className="mt-1 text-sm text-[#667085]">Device-locked GPS/selfie attendance, audit history, and Sunday-adjusted monthly salary.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input type="month" value={month} onChange={(e) => setMonth(e.currentTarget.value)} aria-label="Select month" className="min-h-10 rounded-xl border border-[#E4E7EC] bg-white px-3 text-sm font-semibold text-[#1D2939]" />
          <button type="button" disabled={busy} onClick={() => void downloadExcel(0)} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#465FFF] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50">
            <Download className="size-4" /> Export Excel
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#E4E7EC] bg-white p-5"><p className="text-xs font-medium text-[#667085]">Active Staff</p><p className="mt-2 text-3xl font-bold text-[#1D2939]">{employees.filter((e) => e.active).length}</p></div>
        <div className="rounded-2xl border border-[#E4E7EC] bg-white p-5"><p className="text-xs font-medium text-[#667085]">Checked In Today</p><p className="mt-2 text-3xl font-bold text-[#12B76A]">{todayLogs.filter((l) => l.checkInAt).length}</p></div>
        <div className="rounded-2xl border border-[#E4E7EC] bg-white p-5"><p className="text-xs font-medium text-[#667085]">Late Today</p><p className="mt-2 text-3xl font-bold text-[#F79009]">{todayLogs.filter((l) => l.isLate).length}</p></div>
        <div className="rounded-2xl border border-[#E4E7EC] bg-white p-5"><p className="text-xs font-medium text-[#667085]">GPS / VPN Flags Today</p><p className="mt-2 text-3xl font-bold text-[#F04438]">{todayLogs.filter((l) => l.inFlags.length > 0 || l.outFlags.length > 0).length}</p></div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-[#E4E7EC] pb-3">
        {([
          ['logs', 'Daily Logs, Selfie & History', MapPin],
          ['monthly', 'Monthly Cycle & Salary', CalendarDays],
          ['employees', 'Employees & Office GPS', Users],
        ] as const).map(([id, label, Icon]) => (
          <button key={id} type="button" onClick={() => setSubTab(id)} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${subTab === id ? 'bg-[#ECF3FF] text-[#465FFF]' : 'bg-white text-[#667085] border border-[#E4E7EC] hover:bg-[#F9FAFB]'}`}>
            <Icon className="size-4" /> {label}
          </button>
        ))}
      </div>

      {subTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E4E7EC] bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.currentTarget.value)} aria-label="Filter date" className="min-h-10 rounded-xl border border-[#E4E7EC] px-3 text-xs font-semibold" />
              {filterDate && <button type="button" onClick={() => setFilterDate('')} className="rounded-lg border border-[#E4E7EC] px-2.5 py-1.5 text-xs font-semibold text-[#667085]">All Dates</button>}
              <select value={filterEmpId} onChange={(e) => setFilterEmpId(Number(e.currentTarget.value))} aria-label="Filter employee" className="min-h-10 rounded-xl border border-[#E4E7EC] px-3 text-xs font-semibold">
                <option value={0}>All Employees</option>
                {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            {employees.length > 0 && (
              <button
                type="button"
                onClick={() => setLogDraft({ mode: 'create', employeeId: filterEmpId || employees[0].id, employeeName: employees[0].name, workDate: filterDate || todayIst, status: 'Present', checkInTime: employees[0].expectedInTime, checkOutTime: employees[0].expectedOutTime, isLate: false, editNote: '', editHistory: [] })}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] px-3.5 py-2 text-xs font-bold text-[#1D2939] hover:bg-[#ECF3FF]"
              >
                <Plus className="size-3.5 text-[#465FFF]" /> Manual Entry
              </button>
            )}
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#E4E7EC] bg-white">
            <table className="w-full min-w-[820px] text-left text-xs">
              <thead className="border-b border-[#E4E7EC] bg-[#F9FAFB] text-[11px] uppercase text-[#667085]">
                <tr>
                  <th className="px-4 py-3">Employee / Date</th>
                  <th className="px-4 py-3">In / Out (IST)</th>
                  <th className="px-4 py-3">In Proof (GPS / Selfie)</th>
                  <th className="px-4 py-3">Out Proof (GPS / Selfie)</th>
                  <th className="px-4 py-3">Status &amp; Audit</th>
                  <th className="px-4 py-3 text-right">Edit / History</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EC]">
                {visibleLogs.map((log) => {
                  const flags = [...log.inFlags, ...log.outFlags]
                  return (
                    <tr key={log.id} className="hover:bg-[#F9FAFB]">
                      <td className="px-4 py-3">
                        <p className="font-bold text-[#1D2939]">{log.employeeName}</p>
                        <p className="text-[#667085]">{log.workDate} · {fmtHours(log.workMinutes)}</p>
                      </td>
                     <td className="px-4 py-3">
                        <p className="font-semibold text-[#1D2939]">In: {fmtIstTime(log.checkInAt)} {log.isLate && <span className="ml-1 rounded bg-[#FFFAEB] px-1.5 py-0.5 text-[10px] text-[#F79009]">Late</span>}</p>
                        <p className="text-[#667085]">Out: {fmtIstTime(log.checkOutAt)}</p>
                        {log.breaks.length > 0 && (
                          <div className="mt-1.5 space-y-1">
                            {log.breaks.map((br, idx) => (
                              <div key={idx} className={`rounded-lg px-2 py-1 text-[10px] ${br.inAt ? 'bg-[#ECF3FF] text-[#465FFF]' : 'bg-[#FFFAEB] font-semibold text-[#F79009]'}`}>
                                <span>
                                  {br.inAt
                                    ? `Break: ${fmtIstTime(br.outAt)} → ${fmtIstTime(br.inAt)}`
                                    : `Out now since ${fmtIstTime(br.outAt)}`}
                                  {br.note ? ` · ${br.note}` : ''}
                                </span>
                                {br.outLat !== null && (
                                  <a href={mapHref(br.outLat, br.outLng)} target="_blank" rel="noreferrer" className="ml-1.5 underline">
                                    Out Map ({br.outDistanceM ?? 0}m)
                                  </a>
                                )}
                                {br.inLat !== null && (
                                  <a href={mapHref(br.inLat, br.inLng)} target="_blank" rel="noreferrer" className="ml-1.5 underline">
                                    Back Map ({br.inDistanceM ?? 0}m)
                                  </a>
                                )}
                              </div>
                            ))}
                            {log.breakMinutes > 0 && (
                              <p className="text-[10px] font-semibold text-[#667085]">Total Break: {fmtHours(log.breakMinutes)}</p>
                            )}
                          </div>
                        )}
                      </td>
                     <td className="px-4 py-3">
                        {log.inLat !== null || log.inPhotoSrc ? (
                          <div className="flex items-center gap-2.5">
                            {log.inPhotoSrc && (
                              <a href={log.inPhotoSrc} target="_blank" rel="noreferrer" title="Open full In selfie" className="shrink-0">
                                <img src={log.inPhotoSrc} alt={`${log.employeeName} in selfie`} className="size-11 rounded-lg border border-[#E4E7EC] object-cover shadow-xs" />
                              </a>
                            )}
                            <div className="space-y-0.5">
                              {log.inLat !== null && <a href={mapHref(log.inLat, log.inLng)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-[#465FFF] hover:underline">{log.inDistanceM ?? 0}m <ExternalLink className="size-3" /></a>}
                              <p className="text-[10px] text-[#667085]">{log.inIpCity || log.inIpCountry || 'IN'} · {log.inIp}</p>
                            </div>
                          </div>
                        ) : <span className="text-[#98A2B3]">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {log.outLat !== null || log.outPhotoSrc ? (
                          <div className="flex items-center gap-2.5">
                            {log.outPhotoSrc && (
                              <a href={log.outPhotoSrc} target="_blank" rel="noreferrer" title="Open full Out selfie" className="shrink-0">
                                <img src={log.outPhotoSrc} alt={`${log.employeeName} out selfie`} className="size-11 rounded-lg border border-[#E4E7EC] object-cover shadow-xs" />
                              </a>
                            )}
                            <div className="space-y-0.5">
                              {log.outLat !== null && <a href={mapHref(log.outLat, log.outLng)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-[#465FFF] hover:underline">{log.outDistanceM ?? 0}m <ExternalLink className="size-3" /></a>}
                              <p className="text-[10px] text-[#667085]">{log.outIpCity || log.outIpCountry || 'IN'} · {log.outIp}</p>
                            </div>
                          </div>
                        ) : <span className="text-[#98A2B3]">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${log.status === 'Present' ? 'bg-[#ECFDF3] text-[#12B76A]' : log.status === 'Half Day' ? 'bg-[#FFFAEB] text-[#F79009]' : 'bg-[#FEF3F2] text-[#F04438]'}`}>{log.status}</span>
                        {flags.length > 0 && <p className="mt-1 text-[10px] font-semibold text-[#F04438]">{flags.join(', ')}</p>}
                        {log.editedBy && <p className="mt-0.5 text-[10px] text-[#667085]">By {log.editedBy} · {log.editNote}</p>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button type="button" onClick={() => openEditLog(log)} className="inline-flex items-center gap-1 rounded-lg border border-[#E4E7EC] px-2.5 py-1.5 text-xs font-semibold text-[#1D2939] hover:bg-[#ECF3FF]">
                          {log.editHistory.length > 0 ? <History className="size-3 text-[#465FFF]" /> : <Pencil className="size-3" />}
                          {log.editHistory.length > 0 ? `Edit / History (${log.editHistory.length})` : 'Edit'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {visibleLogs.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-[#667085]">No attendance logs match this filter.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'monthly' && (
        <div className="grid gap-4 md:grid-cols-2">
          {summaries.map((s) => (
            <article key={s.employee.id} className="rounded-2xl border border-[#E4E7EC] bg-white p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#1D2939]">{s.employee.name}</h3>
                  <p className="text-xs text-[#667085]">Cycle Day {s.employee.cycleStartDay} · {s.cycleStartDate} → {s.cycleEndDate}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-[#465FFF]">{s.totalDays} days − {s.sundaysCount} Sundays = {s.workingDays} working days</p>
                </div>
                <button type="button" disabled={busy} onClick={() => void downloadExcel(s.employee.id)} className="inline-flex items-center gap-1 rounded-lg border border-[#E4E7EC] px-3 py-1.5 text-xs font-semibold text-[#465FFF] hover:bg-[#ECF3FF]">
                  <Download className="size-3.5" /> Excel
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs sm:grid-cols-6">
                <div className="rounded-xl bg-[#ECFDF3] p-2"><p className="text-[10px] text-[#667085]">Present</p><p className="font-bold text-[#12B76A]">{s.presentDays}</p></div>
                <div className="rounded-xl bg-[#FFFAEB] p-2"><p className="text-[10px] text-[#667085]">Half</p><p className="font-bold text-[#F79009]">{s.halfDays}</p></div>
                <div className="rounded-xl bg-[#F9FAFB] p-2"><p className="text-[10px] text-[#667085]">Leave</p><p className="font-bold text-[#1D2939]">{s.leaveDays}</p></div>
                <div className="rounded-xl bg-[#FEF3F2] p-2"><p className="text-[10px] text-[#667085]">Absent</p><p className="font-bold text-[#F04438]">{s.absentDays}</p></div>
                <div className="rounded-xl bg-[#FFFAEB] p-2"><p className="text-[10px] text-[#667085]">Late</p><p className="font-bold text-[#F79009]">{s.lateCount}</p></div>
                <div className="rounded-xl bg-[#ECF3FF] p-2"><p className="text-[10px] text-[#667085]">Hours</p><p className="font-bold text-[#465FFF]">{Math.floor(s.totalWorkMinutes / 60)}h</p></div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#F9FAFB] px-3.5 py-2.5 text-xs">
                <div>
                  <span className="text-[#667085]">Monthly: </span>
                  <strong className="text-[#1D2939]">{s.employee.monthlySalary > 0 ? fmtInr(s.employee.monthlySalary) : 'Not set'}</strong>
                  {s.perDaySalary > 0 && <span className="text-[#667085]"> ({fmtInr(s.perDaySalary)}/day · {s.payableDays} payable)</span>}
                </div>
                {s.employee.monthlySalary > 0 && (
                  <p className="text-sm font-bold text-[#12B76A]">Earned: {fmtInr(s.earnedSalary)}</p>
                )}
              </div>
            </article>
          ))}
          {summaries.length === 0 && <p className="rounded-2xl border border-[#E4E7EC] bg-white p-8 text-center text-sm text-[#667085] md:col-span-2">Add employees first to view monthly cycle &amp; salary reports.</p>}
        </div>
      )}

      {subTab === 'employees' && (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1D2939]">Employees ({employees.length})</h3>
              <button type="button" onClick={() => setEmpDraft({ id: 0, name: '', designation: '', phone: '', email: '', pin: '', clearPin: false, cycleStartDay: 1, monthlySalary: 0, expectedInTime: '09:30', expectedOutTime: '19:30', officeOnly: true, active: true })} className="inline-flex items-center gap-1.5 rounded-xl bg-[#465FFF] px-4 py-2 text-xs font-bold text-white">
                <Plus className="size-4" /> Add Employee
              </button>
            </div>
            {employees.map((emp) => (
              <article key={emp.id} className="rounded-2xl border border-[#E4E7EC] bg-white p-4 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-[#1D2939]">
                      {emp.name}
                      {!emp.active && <span className="ml-2 rounded-full bg-[#FEF3F2] px-2 py-0.5 text-[10px] text-[#F04438]">Inactive</span>}
                      <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${emp.deviceBound ? 'bg-[#ECFDF3] text-[#12B76A]' : 'bg-[#F2F4F7] text-[#667085]'}`}>
                        {emp.deviceBound ? 'Device Locked' : 'Ready for 1st Phone'}
                      </span>
                    </h4>
                    <p className="text-xs text-[#667085]">
                      {emp.designation || 'Staff'} · Salary {emp.monthlySalary > 0 ? fmtInr(emp.monthlySalary) : 'Not set'} · Cycle Day {emp.cycleStartDay} · {emp.expectedInTime}–{emp.expectedOutTime} · {emp.hasPin ? 'PIN Set' : 'No PIN'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {emp.deviceBound && (
                      <button type="button" disabled={busy} onClick={() => void handleResetDevice(emp)} className="inline-flex items-center gap-1 rounded-lg border border-[#E4E7EC] px-2.5 py-1.5 text-[11px] font-semibold text-[#465FFF] hover:bg-[#ECF3FF]" title="Refresh Device Lock">
                        <Smartphone className="size-3.5" /> Reset Device
                      </button>
                    )}
                    <button type="button" onClick={() => setEmpDraft({ id: emp.id, name: emp.name, designation: emp.designation, phone: emp.phone, email: emp.email, pin: '', clearPin: false, cycleStartDay: emp.cycleStartDay, monthlySalary: emp.monthlySalary, expectedInTime: emp.expectedInTime, expectedOutTime: emp.expectedOutTime, officeOnly: emp.officeOnly, active: emp.active })} className="rounded-lg border border-[#E4E7EC] p-2 text-[#1D2939] hover:bg-[#F9FAFB]" aria-label="Edit employee"><Pencil className="size-3.5" /></button>
                    <button type="button" disabled={busy} onClick={() => void handleRegenerate(emp)} className="rounded-lg border border-[#E4E7EC] p-2 text-[#1D2939] hover:bg-[#F9FAFB]" title="New link" aria-label="Regenerate link"><RefreshCw className="size-3.5" /></button>
                    <button type="button" disabled={busy} onClick={() => void handleDeleteEmp(emp)} className="rounded-lg border border-red-200 p-2 text-[#F04438] hover:bg-red-50" aria-label="Delete employee"><Trash2 className="size-3.5" /></button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#F9FAFB] p-2.5 text-xs">
                  <code className="flex-1 truncate text-[#667085]">{portalUrl(emp.accessToken)}</code>
                  <button type="button" onClick={() => void copyLink(emp)} className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 font-semibold text-[#465FFF] ring-1 ring-[#E4E7EC]">
                    {copiedId === emp.id ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    {copiedId === emp.id ? 'Copied' : 'Copy Link'}
                  </button>
                </div>
              </article>
            ))}
          </div>

          {settingsDraft && (
            <form onSubmit={handleSaveSettings} className="h-fit rounded-2xl border border-[#E4E7EC] bg-white p-5 space-y-4">
              <h3 className="text-base font-bold text-[#1D2939]">Office GPS, Selfie &amp; Anti-VPN</h3>
              <label className="block text-xs font-semibold text-[#1D2939]">Office Name<input value={settingsDraft.officeName} onChange={(e) => setSettingsDraft({ ...settingsDraft, officeName: e.target.value })} className="field mt-1" /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-semibold text-[#1D2939]">Latitude<input type="number" step="any" value={settingsDraft.officeLat} onChange={(e) => setSettingsDraft({ ...settingsDraft, officeLat: Number(e.target.value) })} className="field mt-1" /></label>
                <label className="text-xs font-semibold text-[#1D2939]">Longitude<input type="number" step="any" value={settingsDraft.officeLng} onChange={(e) => setSettingsDraft({ ...settingsDraft, officeLng: Number(e.target.value) })} className="field mt-1" /></label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-semibold text-[#1D2939]">Radius (meters)<input type="number" min={30} max={5000} value={settingsDraft.allowedRadiusM} onChange={(e) => setSettingsDraft({ ...settingsDraft, allowedRadiusM: Number(e.target.value) })} className="field mt-1" /></label>
                <label className="text-xs font-semibold text-[#1D2939]">Max GPS Accuracy (m)<input type="number" min={20} max={2000} value={settingsDraft.maxAccuracyM} onChange={(e) => setSettingsDraft({ ...settingsDraft, maxAccuracyM: Number(e.target.value) })} className="field mt-1" /></label>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#1D2939]"><input type="checkbox" checked={settingsDraft.requireSelfie} onChange={(e) => setSettingsDraft({ ...settingsDraft, requireSelfie: e.target.checked })} />Require Live Front-Camera Selfie (with motion check)</label>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#1D2939]"><input type="checkbox" checked={settingsDraft.blockVpnOrForeignIp} onChange={(e) => setSettingsDraft({ ...settingsDraft, blockVpnOrForeignIp: e.target.checked })} />Block foreign / VPN IP addresses</label>
              <div className="rounded-xl bg-[#F9FAFB] p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#1D2939]">Office Wi-Fi Public IP</span>
                  {currentRequestIp && <button type="button" onClick={() => setSettingsDraft({ ...settingsDraft, officeWifiIp: currentRequestIp })} className="text-[11px] font-bold text-[#465FFF] hover:underline">Use My IP ({currentRequestIp})</button>}
                </div>
                <input value={settingsDraft.officeWifiIp} onChange={(e) => setSettingsDraft({ ...settingsDraft, officeWifiIp: e.target.value })} placeholder="Optional Office Wi-Fi IP" className="field" />
                <label className="flex items-center gap-2 text-xs font-semibold text-[#1D2939]"><input type="checkbox" checked={settingsDraft.requireOfficeWifiIp} onChange={(e) => setSettingsDraft({ ...settingsDraft, requireOfficeWifiIp: e.target.checked })} />Require Office Wi-Fi IP to mark attendance</label>
              </div>
              <button type="submit" disabled={busy} className="w-full rounded-xl bg-[#465FFF] py-2.5 text-xs font-bold text-white disabled:opacity-50">Save GPS Settings</button>
            </form>
          )}
        </div>
      )}

      {empDraft && <EmployeeFormModal draft={empDraft} busy={busy} onChange={setEmpDraft} onClose={() => setEmpDraft(null)} onSubmit={handleSaveEmployee} />}
      {logDraft && <AttendanceEditModal draft={logDraft} employees={employees} busy={busy} onChange={setLogDraft} onClose={() => setLogDraft(null)} onSubmit={handleSaveLog} />}
    </section>
  )
}