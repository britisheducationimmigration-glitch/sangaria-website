import { PayrollLedger } from './PayrollLedger'
import { attendanceDateWindow, type AttendancePreset } from '@/lib/attendance-date-filters'
import { SavedAbsences } from './SavedAbsences'
import { attendanceFlagLabel, attendanceNeedsReview, isAttendanceLocationFlag } from '@/lib/attendance-flags'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CalendarDays, Check, Copy, Download, ExternalLink, History, MapPin, Pencil, Plus, RefreshCw, Smartphone, Trash2, Users } from 'lucide-react'
import { getAttendancePhotoCleanupPreview, cleanOldAttendancePhotos, deleteEmployee, permanentlyDeleteEmployee, exportAttendanceCsv, exportAttendanceExcel, finalizeAttendanceCycle, getAdminAttendanceSnapshot, getAttendanceRecordHistory, regenerateEmployeeToken, resetEmployeeDevice, saveAttendanceSettings, saveEmployee, updateAttendanceRecord } from '@/lib/attendance-functions'
import type { AdminAttendanceSnapshot, AttendanceLogRecord, AttendanceSettings, EmployeeRecord } from '@/lib/content-types'
import { AttendanceEditModal, EmployeeFormModal, type EmployeeDraft, type LogDraft } from './AttendanceModals'

type SubTab = 'logs' | 'monthly' | 'employees' | 'payments'

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
const fmtInr = (amount: number) => `\u20b9${Math.round(amount).toLocaleString('en-IN')}`
const mapHref = (lat: number | null, lng: number | null) => (lat !== null && lng !== null ? `https://maps.google.com/?q=${lat},${lng}` : '')

export function AttendancePanel({ onNotice }: { onNotice: (msg: string) => void }) {
  const [month, setMonth] = useState(currentIstMonth)
  const [subTab, setSubTab] = useState<SubTab>('logs')
  const [snapshot, setSnapshot] = useState<(AdminAttendanceSnapshot & { currentRequestIp: string }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [datePreset, setDatePreset] = useState<AttendancePreset>('date')
  const [filterDate, setFilterDate] = useState('')
  const [filterEmpId, setFilterEmpId] = useState(0)
  const [reviewOnly, setReviewOnly] = useState(false)
  const [logView, setLogView] = useState<'table' | 'calendar' | 'timeline'>('table')
  const [employeeSaveError, setEmployeeSaveError] = useState('')
  const [empDraft, setEmpDraft] = useState<EmployeeDraft | null>(null)
  const [logDraft, setLogDraft] = useState<LogDraft | null>(null)
  const [settingsDraft, setSettingsDraft] = useState<AttendanceSettings | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const lastLoadedMonthRef = useRef('')
  const loadSequence = useRef(0)
  const refreshInFlight = useRef(false)
  const [lastUpdated, setLastUpdated] = useState('')

      async function load(targetMonth = month, background = false) {
    const request = ++loadSequence.current
    if (!background) setLoading(true)
    setError('')
    try {
      const next = await getAdminAttendanceSnapshot({ data: { month: targetMonth, lightweight: background } })
      if (request !== loadSequence.current) return
      setSnapshot((current) => {
        if (!background || !current) return next
        const prevHistory = new Map(current.logs.map((l) => [l.id, l.editHistory]))
        return {
          ...next,
          logs: next.logs.map((l) => (l.editHistory.length ? l : { ...l, editHistory: prevHistory.get(l.id) ?? [] })),
        }
      })
      if (!background) setSettingsDraft(next.settings)
      setLastUpdated(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }))
      if (lastLoadedMonthRef.current !== targetMonth) {
        setFilterDate(previous => datePreset === 'date' && previous.startsWith(targetMonth) ? previous : next.todayIst.startsWith(targetMonth) ? next.todayIst : `${targetMonth}-01`)
        lastLoadedMonthRef.current = targetMonth
      }
    } catch (cause) {
      if (request !== loadSequence.current) return
      setError(cause instanceof Error ? cause.message : 'Could not load attendance.')
    } finally {
      if (request === loadSequence.current && !background) setLoading(false)
    }
  }

  useEffect(() => {
    void load(month)
    return () => { loadSequence.current++ }
  }, [month])

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem('bei-attendance-subtab')
      if (saved === 'logs' || saved === 'monthly' || saved === 'employees' || saved === 'payments') setSubTab(saved)
    } catch { /* Browser storage is optional. */ }
  }, [])

  useEffect(() => {
    const refresh = async () => {
      if (document.visibilityState !== 'visible' || busy || empDraft || logDraft || (subTab === 'employees' || subTab === 'payments') || refreshInFlight.current) return
      refreshInFlight.current = true
      try { await load(month, true) } finally { refreshInFlight.current = false }
    }
    const onVisible = () => { void refresh() }
    const timer = window.setInterval(onVisible, 30_000)
    window.addEventListener('focus', onVisible)
    window.addEventListener('online', onVisible)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', onVisible)
      window.removeEventListener('online', onVisible)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [month, busy, empDraft, logDraft, subTab])

  async function cleanupPhotos() {
    setBusy(true)
    try {
      const preview = await getAttendancePhotoCleanupPreview()
      if (!preview.photos) { onNotice('No selfies older than 60 days.'); return }
      if (!window.confirm(`Permanently delete old selfies before ${preview.cutoff}? ${preview.photos} photos across ${preview.records} records qualify; at most 2,000 records are cleaned per run. Attendance, salary and audit records are kept.`)) return
      const result = await cleanOldAttendancePhotos({ data: { cutoff: preview.cutoff, confirmed: true } })
      await load(month)
      onNotice(`Old selfies cleared from ${result.cleared} attendance records.`)
    } catch (cause) { onNotice(cause instanceof Error ? cause.message : 'Cleanup failed') }
    finally { setBusy(false) }
  }

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

  async function downloadCsv(employeeId = 0) {
    setBusy(true)
    try {
      const result = await exportAttendanceCsv({ data: { month, employeeId } })
      const bytes = Uint8Array.from(atob(result.base64), (c) => c.charCodeAt(0))
      const url = URL.createObjectURL(new Blob([bytes], { type: 'text/csv;charset=utf-8' }))
      const link = document.createElement('a'); link.href = url; link.download = result.filename; link.click()
      URL.revokeObjectURL(url)
      onNotice('Attendance CSV exported.')
    } catch (cause) { onNotice(cause instanceof Error ? cause.message : 'CSV export failed.') }
    finally { setBusy(false) }
  }

  async function finalizeCycle(employeeId: number) {
    if (!window.confirm('Finalize this completed employee cycle? Its report will be preserved and attendance corrections in the cycle will be locked.')) return
    setBusy(true)
    try {
      await finalizeAttendanceCycle({ data: { month, employeeId } })
      await load(month)
      onNotice('Cycle finalized and report preserved.')
    } catch (cause) { onNotice(cause instanceof Error ? cause.message : 'Could not finalize cycle.') }
    finally { setBusy(false) }
  }

  async function handleSaveEmployee(e: FormEvent) {
    e.preventDefault()
    if (!empDraft) return
    setEmployeeSaveError('')
    setBusy(true)
    try {
      await saveEmployee({ data: empDraft })
      setEmpDraft(null)
      await load(month)
      onNotice('Employee saved.')
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Could not save employee.'
      setEmployeeSaveError(message)
      onNotice(message)
    } finally {
      setBusy(false)
    }
  }

  async function handleSaveLog(e: FormEvent) {
    e.preventDefault()
    if (!logDraft) return
    setBusy(true)
    try {
      const saved = await updateAttendanceRecord({ data: logDraft })
      setSnapshot(current => current ? { ...current, logs: [...current.logs.filter(log => log.id !== saved.id), saved] } : current)
      setLogDraft(null)
      await load(month)
      onNotice(logDraft.absenceStart ? `Unapproved absence recorded. Net working time: ${fmtHours(saved.workMinutes)}. Status: ${saved.status}. Overlapping intervals are deducted once.` : 'Attendance record saved with audit history.')
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
    if (!window.confirm(`Reset browser registration for ${emp.name}? The next successful punch with their link and PIN registers that browser.`)) return
    setBusy(true)
    try {
      await resetEmployeeDevice({ data: { id: emp.id } })
      await load(month)
      onNotice(`Browser registration refreshed for ${emp.name}.`)
    } catch (cause) {
      onNotice(cause instanceof Error ? cause.message : 'Could not reset browser registration.')
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
    } catch (cause) {
      onNotice(cause instanceof Error ? cause.message : 'Could not regenerate link.')
    } finally {
      setBusy(false)
    }
  }

  async function handleDeleteEmp(emp: EmployeeRecord) {
    if (!window.confirm(`Archive ${emp.name}? Their attendance records and audit history will be preserved.`)) return
    setBusy(true)
    try {
      await deleteEmployee({ data: { id: emp.id } })
      await load(month)
      onNotice('Employee archived; attendance records preserved.')
    } catch (cause) {
      onNotice(cause instanceof Error ? cause.message : 'Could not archive employee.')
    } finally {
      setBusy(false)
    }
  }

  async function handlePermanentDeleteEmp(emp: EmployeeRecord) {
    const confirmationName = window.prompt(`Permanently delete ${emp.name} (ID ${emp.id})? This removes all attendance, selfies, correction history, policies and finalized salary reports from this website. This cannot be undone here. Type the employee's full name to continue:`)
    if (confirmationName === null) return
    if (confirmationName.trim() !== emp.name.trim()) { onNotice('Name did not match. Nothing was deleted.'); return }
    setBusy(true)
    try {
      await permanentlyDeleteEmployee({ data: { id: emp.id, confirmationName } })
      if (filterEmpId === emp.id) setFilterEmpId(0)
      await load(month)
      onNotice('Employee and all associated website records permanently deleted.')
    } catch (cause) { onNotice(cause instanceof Error ? cause.message : 'Could not permanently delete employee.') }
    finally { setBusy(false) }
  }

  function portalUrl(emp: EmployeeRecord) {
    const name = emp.name.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu, '-').replace(/^-|-$/g, '')
    const path = '/attendance/' + (name ? name + '~' : '') + emp.accessToken
    return typeof window === 'undefined' ? path : window.location.origin + path
  }

  async function copyLink(emp: EmployeeRecord) {
    try {
      await navigator.clipboard.writeText(portalUrl(emp))
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
      checkOutNextDay: false,
      isLate: log.isLate,
      editNote: '',
      editHistory: log.editHistory,
      savedBreaks: log.breaks,
    })
    void getAttendanceRecordHistory({ data: { employeeId: log.employeeId, workDate: log.workDate } })
      .then(editHistory => setLogDraft(current => current?.employeeId === log.employeeId && current.workDate === log.workDate ? { ...current, editHistory } : current))
      .catch(cause => onNotice(cause instanceof Error ? cause.message : 'Could not load correction history.'))

  }

  if (loading && !snapshot) return <div className="rounded-2xl border border-[#E4E7EC] bg-white p-8 text-sm text-[#667085]">Loading attendance…</div>
  if (error && !snapshot) return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">{error}</div>
  if (!snapshot) return null

  const { employees, logs, summaries, todayIst, currentRequestIp } = snapshot
  const todayLogs = logs.filter((l) => l.workDate === todayIst)
  const displayStatus = (log: AttendanceLogRecord) => log.checkInAt && !log.checkOutAt ? log.workDate < todayIst ? 'Missing OUT' : 'In Progress' : log.status
  const requiresReview = (log: AttendanceLogRecord) => attendanceNeedsReview(log, todayIst)
  const dateWindow = attendanceDateWindow(datePreset,todayIst,month,filterDate)
  const visibleLogs = logs.filter((l) => (!dateWindow.from || l.workDate >= dateWindow.from) && (!dateWindow.to || l.workDate <= dateWindow.to) && (!filterEmpId || l.employeeId === filterEmpId) && (!reviewOnly || requiresReview(l)))
   const calendarLogs = logs.filter((l) => l.workDate.startsWith(month) && (!filterEmpId || l.employeeId === filterEmpId) && (!reviewOnly || requiresReview(l)))
  const calendarStart = new Date(month + '-01T00:00:00Z')
  const calendarDays = new Date(Date.UTC(calendarStart.getUTCFullYear(), calendarStart.getUTCMonth() + 1, 0)).getUTCDate()
  const selectedEmployee = employees.find((employee) => employee.id === filterEmpId && employee.active) ?? employees.find(employee => employee.active) ?? employees[0]

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#465FFF]">Super Admin Only</p>
          <h2 className="mt-1 text-2xl font-bold text-[#1D2939] sm:text-3xl">Staff Attendance &amp; Salary</h2>
          <p className="mt-1 text-sm text-[#667085]">GPS and camera evidence, browser registration, correction history and employee payroll cycles.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input type="month" value={month} onChange={(e) => { if (e.currentTarget.value) { setMonth(e.currentTarget.value); setFilterDate(''); setDatePreset('month') } }} aria-label="Select month" className="min-h-10 rounded-xl border border-[#E4E7EC] bg-white px-3 text-sm font-semibold text-[#1D2939]" />
          <button type="button" disabled={busy} onClick={() => void downloadExcel(0)} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#465FFF] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50">
            <Download className="size-4" /> Export Excel
          </button>
          <button type="button" disabled={busy} onClick={() => void downloadCsv(filterEmpId)} className="min-h-10 rounded-xl border border-[#E4E7EC] bg-white px-4 text-sm font-semibold text-[#465FFF] disabled:opacity-50">Export CSV</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#667085]">
                <span role="status">{loading ? 'Updating attendance…' : lastUpdated ? 'Updated ' + lastUpdated + ' IST' : ''}{subTab !== 'employees' && subTab !== 'payments' && ' · Auto-refresh every 30 seconds while visible'}</span>
        <button type="button" disabled={loading || busy || Boolean(empDraft) || Boolean(logDraft)} onClick={() => void load(month, true)} className="inline-flex items-center gap-1 rounded-lg border border-[#E4E7EC] bg-white px-3 py-2 font-semibold text-[#465FFF] disabled:opacity-50"><RefreshCw className={loading ? 'size-3.5 animate-spin' : 'size-3.5'} />Refresh now</button>
      </div>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#E4E7EC] bg-white p-5"><p className="text-xs font-medium text-[#667085]">Active Staff</p><p className="mt-2 text-3xl font-bold text-[#1D2939]">{employees.filter((e) => e.active).length}</p></div>
        <div className="rounded-2xl border border-[#E4E7EC] bg-white p-5"><p className="text-xs font-medium text-[#667085]">Checked In Today</p><p className="mt-2 text-3xl font-bold text-[#12B76A]">{todayLogs.filter((l) => l.checkInAt).length}</p></div>
        <div className="rounded-2xl border border-[#E4E7EC] bg-white p-5"><p className="text-xs font-medium text-[#667085]">Late Today</p><p className="mt-2 text-3xl font-bold text-[#F79009]">{todayLogs.filter((l) => l.isLate).length}</p></div>
        <div className="rounded-2xl border border-[#E4E7EC] bg-white p-5"><p className="text-xs font-medium text-[#667085]">Location checks today</p><p className="mt-2 text-3xl font-bold text-[#F04438]">{todayLogs.filter((l) => [...l.inFlags, ...l.outFlags].some(isAttendanceLocationFlag)).length}</p><p className="mt-1 text-xs text-[#667085]">GPS/network indicators; not proof of VPN use.</p></div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-[#E4E7EC] pb-3">
        {([
          ['logs', 'Daily Logs, Selfie & History', MapPin],
          ['monthly', 'Monthly Cycle & Salary', CalendarDays],
          ['payments', 'Employee Statement & Payments', Download],
          ['employees', 'Employees & Office GPS', Users],
        ] as const).map(([id, label, Icon]) => (
          <button key={id} type="button" onClick={() => { setSubTab(id); try { window.sessionStorage.setItem('bei-attendance-subtab', id) } catch { /* Optional UI state. */ } }} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${subTab === id ? 'bg-[#ECF3FF] text-[#465FFF]' : 'bg-white text-[#667085] border border-[#E4E7EC] hover:bg-[#F9FAFB]'}`}>
            <Icon className="size-4" /> {label}
          </button>
        ))}
      </div>

      {subTab === 'payments' && <PayrollLedger key={month} employees={employees} cycles={summaries} month={month} today={todayIst} onNotice={onNotice} />}
      {subTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E4E7EC] bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <input type="date" value={filterDate} onChange={(e) => { setFilterDate(e.currentTarget.value); setDatePreset('date'); if(e.currentTarget.value) setMonth(e.currentTarget.value.slice(0,7)) }} aria-label="Filter date" className="min-h-10 rounded-xl border border-[#E4E7EC] px-3 text-xs font-semibold" />
              {([['today','Today'],['week','This Week'],['month','This Month'],['all','All Dates']] as const).map(([preset,label])=><button type="button" key={preset} aria-pressed={datePreset===preset} onClick={()=>{setDatePreset(preset);setFilterDate('');if(preset!=='all')setMonth(todayIst.slice(0,7))}} className={`min-h-10 rounded-xl border px-3 py-2 text-xs font-semibold ${datePreset===preset?'border-[#465FFF] bg-[#ECF3FF] text-[#465FFF]':'border-[#E4E7EC] text-[#667085]'}`}>{label}</button>)}
              <select value={filterEmpId} onChange={(e) => setFilterEmpId(Number(e.currentTarget.value))} aria-label="Filter employee" className="min-h-10 rounded-xl border border-[#E4E7EC] px-3 text-xs font-semibold">
                <option value={0}>All Employees</option>
                {employees.map((e) => <option key={e.id} value={e.id}>{e.name}{!e.active ? ' (Archived)' : ''}</option>)}
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-2 rounded-lg border border-[#E4E7EC] px-3 py-2 text-xs font-semibold"><input type="checkbox" checked={reviewOnly} onChange={(e) => { setReviewOnly(e.target.checked); if (e.target.checked) { setFilterDate(''); setDatePreset('all') } }} />Needs correction</label>
              {(['table', 'calendar', 'timeline'] as const).map((view) => <button type="button" key={view} aria-pressed={logView === view} onClick={() => setLogView(view)} className={`rounded-lg border px-3 py-2 text-xs font-semibold capitalize ${logView === view ? 'border-[#465FFF] bg-[#ECF3FF] text-[#465FFF]' : 'border-[#E4E7EC]'}`}>{view}</button>)}
            </div>
            {employees.length > 0 && (
              <button
                type="button"
                onClick={() => setLogDraft({ mode: 'create', employeeId: selectedEmployee.id, employeeName: selectedEmployee.name, workDate: filterDate || todayIst, status: 'Present', checkInTime: selectedEmployee.expectedInTime, checkOutTime: selectedEmployee.expectedOutTime, checkOutNextDay: false, isLate: false, editNote: '', editHistory: [] })}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] px-3.5 py-2 text-xs font-bold text-[#1D2939] hover:bg-[#ECF3FF]"
              >
                <Plus className="size-3.5 text-[#465FFF]" /> Leave / Manual Entry
              </button>
            )}
          </div>

          <p className="text-xs text-[#667085]">{datePreset==='all'?'All dates in the loaded payroll report period. Change report month for older records.':`Showing ${dateWindow.from || '-'} to ${dateWindow.to || '-'} (IST; week starts Monday).`} Export any employee/date range from Employee Statement &amp; Payments.</p>
          {logView === 'table' && <div className="overflow-x-auto rounded-2xl border border-[#E4E7EC] bg-white">
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
                  const flags = [...new Set([...log.inFlags, ...log.outFlags])]
                  const hasAbsence = log.breaks.some(interval => interval.note.startsWith('Admin - unapproved absence: '))
                  return (
                    <tr key={log.id} className="hover:bg-[#F9FAFB]">
                      <td className="px-4 py-3">
                        <p className="font-bold text-[#1D2939]">{log.employeeName}</p>
                        <p className="text-[#667085]">{log.workDate} · {fmtHours(log.workMinutes)}</p>
                        <SavedAbsences breaks={log.breaks} /><p className="mt-1 text-[11px] text-[#667085]">Net work: {fmtHours(log.workMinutes)}{log.breakMinutes > 0 ? ` · Break/absence deducted: ${fmtHours(log.breakMinutes)}` : ''}</p>
                      </td>
                     <td className="px-4 py-3">
                        <p className="font-semibold text-[#1D2939]">In: {fmtIstTime(log.checkInAt)} {log.isLate && <span className="ml-1 rounded bg-[#FFFAEB] px-1.5 py-0.5 text-[11px] text-[#F79009]">Late</span>}</p>
                        <p className="text-[#667085]">Out: {fmtIstTime(log.checkOutAt)}</p>
                        {log.breaks.some(interval => !interval.note.startsWith('Admin - unapproved absence: ')) && (
                          <div className="mt-1.5 space-y-1">
                            {log.breaks.filter(interval => !interval.note.startsWith('Admin - unapproved absence: ')).map((br, idx) => (
                              <div key={idx} className={`rounded-lg px-2 py-1 text-[11px] ${br.inAt ? 'bg-[#ECF3FF] text-[#465FFF]' : 'bg-[#FFFAEB] font-semibold text-[#F79009]'}`}>
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
                              <p className="text-[11px] font-semibold text-[#667085]">Total break/absence deduction: {fmtHours(log.breakMinutes)}</p>
                            )}
                          </div>
                        )}
                      </td>
                     <td className="px-4 py-3">
                        {log.inLat !== null || log.inPhotoSrc ? (
                          <div className="flex items-center gap-2.5">
                            {log.inPhotoSrc && (
                              <a href={log.inPhotoSrc + '&view=mirror'} target="_blank" rel="noreferrer" title="Open full In selfie" className="shrink-0">
                                <img src={log.inPhotoSrc} alt={`${log.employeeName} in selfie`} className="size-11 rounded-lg border border-[#E4E7EC] object-cover shadow-xs scale-x-[-1]" />
                              </a>
                            )}
                            <div className="space-y-0.5">
                              {log.inLat !== null && <a href={mapHref(log.inLat, log.inLng)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-[#465FFF] hover:underline">{log.inDistanceM ?? 0}m <ExternalLink className="size-3" /></a>}
                              <p className="text-[11px] text-[#667085]">{log.inIpCity || log.inIpCountry || 'IN'} · {log.inIp}</p>
                            </div>
                          </div>
                        ) : <span className="text-[#98A2B3]">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {log.outLat !== null || log.outPhotoSrc ? (
                          <div className="flex items-center gap-2.5">
                            {log.outPhotoSrc && (
                              <a href={log.outPhotoSrc + '&view=mirror'} target="_blank" rel="noreferrer" title="Open full Out selfie" className="shrink-0">
                                <img src={log.outPhotoSrc} alt={`${log.employeeName} out selfie`} className="size-11 rounded-lg border border-[#E4E7EC] object-cover shadow-xs scale-x-[-1]" />
                              </a>
                            )}
                            <div className="space-y-0.5">
                              {log.outLat !== null && <a href={mapHref(log.outLat, log.outLng)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-[#465FFF] hover:underline">{log.outDistanceM ?? 0}m <ExternalLink className="size-3" /></a>}
                              <p className="text-[11px] text-[#667085]">{log.outIpCity || log.outIpCountry || 'IN'} · {log.outIp}</p>
                            </div>
                          </div>
                        ) : <span className="text-[#98A2B3]">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${log.checkInAt && !log.checkOutAt ? 'bg-[#FFFAEB] text-[#F79009]' : log.status === 'Present' ? 'bg-[#ECFDF3] text-[#12B76A]' : log.status === 'Half Day' ? 'bg-[#FFFAEB] text-[#F79009]' : 'bg-[#FEF3F2] text-[#F04438]'}`}>{displayStatus(log)}</span>{hasAbsence && <span className="ml-1 inline-block rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-900">Unapproved absence</span>}
                        {flags.length > 0 && <div className="mt-2 flex max-w-sm flex-wrap gap-1">{flags.map(flag => <span key={flag} className={`rounded-md px-2 py-1 text-[11px] font-medium ${flag === 'ADMIN_REVIEW_APPROVED' ? 'bg-emerald-50 text-emerald-700' : flag === 'HALF_DAY_OUT' ? 'bg-slate-100 text-slate-700' : 'bg-amber-50 text-amber-800'}`}>{attendanceFlagLabel(flag)}</span>)}</div>}
                        {log.editedBy && <p className="mt-0.5 text-[11px] text-[#667085]">By {log.editedBy} · {log.editNote}</p>}
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
          </div>}
          {logView === 'calendar' && (
            <div className="rounded-2xl border border-[#E4E7EC] bg-white p-4">
              <h3 className="mb-3 text-sm font-bold">{month} · select a day to open its timeline</h3>
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <p key={day} className="py-2 text-center text-[11px] font-semibold text-[#667085]">{day}</p>)}
                {Array.from({ length: calendarStart.getUTCDay() }, (_, i) => <div key={'empty-' + i} />)}
                {Array.from({ length: calendarDays }, (_, i) => {
                  const date = month + '-' + String(i + 1).padStart(2, '0')
                  const dayLogs = calendarLogs.filter((log) => log.workDate === date)
                  const pending = dayLogs.filter(requiresReview).length
                                   return <button type="button" key={date} onClick={() => { setDatePreset('date'); setFilterDate(date); setLogView('timeline') }} className={`min-h-20 rounded-lg border p-1 text-left sm:p-2 ${date === filterDate ? 'border-[#465FFF] bg-[#ECF3FF]' : 'border-[#E4E7EC] hover:bg-[#F9FAFB]'}`}><span className="text-xs font-bold">{i + 1}</span><span className="mt-2 block text-[11px] text-[#667085]">{dayLogs.length} entries</span>{pending > 0 && <span className="block text-[11px] font-semibold text-[#F04438]">{pending} review</span>}</button>
                })}
              </div>
            </div>
          )}
          {logView === 'timeline' && (
            <div className="space-y-3">
              {visibleLogs.map((log) => {
                const events = [
                  ...(log.checkInAt ? [{ at: log.checkInAt, label: 'Check in', lat: log.inLat, lng: log.inLng }] : []),
                  ...log.breaks.flatMap((br) => [{ at: br.outAt, label: 'Break out' + (br.note ? ': ' + br.note : ''), lat: br.outLat, lng: br.outLng }, ...(br.inAt ? [{ at: br.inAt, label: 'Returned', lat: br.inLat, lng: br.inLng }] : [])]),
                  ...(log.checkOutAt ? [{ at: log.checkOutAt, label: 'Check out', lat: log.outLat, lng: log.outLng }] : []),
                ].sort((a, b) => a.at.localeCompare(b.at))
                return <article key={log.id} className="rounded-2xl border border-[#E4E7EC] bg-white p-5"><div className="mb-4 flex items-start justify-between gap-3"><div><h3 className="font-bold">{log.employeeName}</h3><p className="text-xs text-[#667085]">{log.workDate} · {displayStatus(log)} · {fmtHours(log.workMinutes)} net</p>{requiresReview(log) && <p className="mt-1 text-xs font-semibold text-[#F04438]">Missing or automatic OUT needs review</p>}</div><button type="button" onClick={() => openEditLog(log)} className="rounded-lg border border-[#E4E7EC] px-3 py-2 text-xs font-semibold text-[#465FFF]">Review / history</button></div><ol className="space-y-3 border-l-2 border-[#E4E7EC] pl-4">{events.map((event, i) => <li key={i} className="text-xs"><p className="font-semibold">{fmtIstTime(event.at)} · {event.label}</p>{event.lat !== null && event.lng !== null && <a href={mapHref(event.lat, event.lng)} target="_blank" rel="noreferrer" className="text-[#465FFF] underline">View location</a>}</li>)}{!log.checkOutAt && log.checkInAt && <li className="text-xs font-semibold text-[#F79009]">OUT not recorded · hours pending</li>}</ol></article>
              })}
              {visibleLogs.length === 0 && <p className="rounded-xl bg-white p-6 text-center text-sm text-[#667085]">No entries match this date and employee.</p>}
            </div>
          )}

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
                  <p className="mt-0.5 text-[11px] font-medium text-[#465FFF]">{s.totalDays} cycle days; {s.workingDays} scheduled working days (weekly offs and holidays excluded)</p>
                </div>
                <button type="button" disabled={busy} onClick={() => void downloadExcel(s.employee.id)} className="inline-flex items-center gap-1 rounded-lg border border-[#E4E7EC] px-3 py-1.5 text-xs font-semibold text-[#465FFF] hover:bg-[#ECF3FF]">
                  <Download className="size-3.5" /> Excel
                </button>
                <button type="button" disabled={busy} onClick={() => void downloadCsv(s.employee.id)} className="rounded-lg border border-[#E4E7EC] px-3 py-1.5 text-xs font-semibold text-[#465FFF] disabled:opacity-50">CSV</button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E4E7EC] p-3 text-xs">
                {s.finalized ? <span className="font-semibold text-[#12B76A]">Finalized · report locked</span> : <><span className="text-[#667085]">Draft · {s.missedCheckOutCount} missing OUT · {s.reviewRequiredCount ?? 0} short shifts to review</span><button type="button" disabled={busy || s.cycleEndDate >= todayIst || s.missedCheckOutCount > 0 || (s.reviewRequiredCount ?? 0) > 0} onClick={() => void finalizeCycle(s.employee.id)} className="rounded-lg bg-[#465FFF] px-3 py-2 font-semibold text-white disabled:opacity-40">Finalize completed cycle</button></>}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs sm:grid-cols-6">
                <div className="rounded-xl bg-[#ECFDF3] p-2"><p className="text-[11px] text-[#667085]">Present</p><p className="font-bold text-[#12B76A]">{s.presentDays}</p></div>
                <div className="rounded-xl bg-[#FFFAEB] p-2"><p className="text-[11px] text-[#667085]">Half</p><p className="font-bold text-[#F79009]">{s.halfDays}</p></div>
                <div className="rounded-xl bg-[#F9FAFB] p-2"><p className="text-[11px] text-[#667085]">Leave</p><p className="font-bold text-[#1D2939]">{s.leaveDays}</p></div>
                <div className="rounded-xl bg-[#FEF3F2] p-2"><p className="text-[11px] text-[#667085]">Absent</p><p className="font-bold text-[#F04438]">{s.absentDays}</p></div>
                <div className="rounded-xl bg-[#FFFAEB] p-2"><p className="text-[11px] text-[#667085]">Late</p><p className="font-bold text-[#F79009]">{s.lateCount}</p></div>
                <div className="rounded-xl bg-[#ECF3FF] p-2"><p className="text-[11px] text-[#667085]">Hours</p><p className="font-bold text-[#465FFF]">{Math.floor(s.totalWorkMinutes / 60)}h</p></div>
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
              <button type="button" onClick={() => { setEmployeeSaveError(''); setEmpDraft({ id: 0, name: '', designation: '', phone: '', email: '', pin: '', clearPin: false, cycleStartDay: 1, monthlySalary: 0, expectedInTime: '09:30', expectedOutTime: '19:30', officeOnly: true, active: true, joiningDate: todayIst, leavingDate: '', halfDayMinutes: 300, minimumHalfDayMinutes: 0, policyReason: '', lateGraceMinutes: 0, weeklyOffDays: [0], holidayDates: [], effectiveDate: todayIst }); }} className="inline-flex items-center gap-1.5 rounded-xl bg-[#465FFF] px-4 py-2 text-xs font-bold text-white">
                <Plus className="size-4" /> Add Employee
              </button>
            </div>
            {employees.map((emp) => (
              <article key={emp.id} className="rounded-2xl border border-[#E4E7EC] bg-white p-4 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-[#1D2939]">
                      {emp.name}
                      {!emp.active && <span className="ml-2 rounded-full bg-[#FEF3F2] px-2 py-0.5 text-[11px] text-[#F04438]">Inactive</span>}
                      <span className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${emp.deviceBound ? 'bg-[#ECFDF3] text-[#12B76A]' : 'bg-[#F2F4F7] text-[#667085]'}`}>
                        {emp.deviceBound ? 'Browser Registered' : 'Awaiting Registration'}
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
                    <button type="button" onClick={() => { setEmployeeSaveError(''); setEmpDraft({ id: emp.id, name: emp.name, designation: emp.designation, phone: emp.phone, email: emp.email, pin: '', clearPin: false, cycleStartDay: emp.cycleStartDay, monthlySalary: emp.monthlySalary, expectedInTime: emp.expectedInTime, expectedOutTime: emp.expectedOutTime, officeOnly: emp.officeOnly, active: emp.active, joiningDate: emp.joiningDate ?? '', leavingDate: emp.leavingDate ?? '', halfDayMinutes: emp.halfDayMinutes ?? 300, minimumHalfDayMinutes: emp.minimumHalfDayMinutes ?? 0, policyReason: '', lateGraceMinutes: emp.lateGraceMinutes ?? 0, weeklyOffDays: emp.weeklyOffDays ?? [0], holidayDates: emp.holidayDates ?? [], effectiveDate: todayIst }); }} className="rounded-lg border border-[#E4E7EC] p-2 text-[#1D2939] hover:bg-[#F9FAFB]" aria-label="Edit employee"><Pencil className="size-3.5" /></button>
                    <button type="button" disabled={busy} onClick={() => void handleRegenerate(emp)} className="rounded-lg border border-[#E4E7EC] p-2 text-[#1D2939] hover:bg-[#F9FAFB]" title="New link" aria-label="Regenerate link"><RefreshCw className="size-3.5" /></button>
                    <button type="button" disabled={busy} onClick={() => void handleDeleteEmp(emp)} className="rounded-lg border border-[#E4E7EC] px-2 py-1.5 text-xs font-semibold text-[#667085] hover:bg-[#F9FAFB]">Archive</button>
                    <button type="button" disabled={busy} onClick={() => void handlePermanentDeleteEmp(emp)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2 py-1.5 text-xs font-semibold text-[#F04438] hover:bg-red-50"><Trash2 className="size-3.5" /> Permanently Delete</button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#F9FAFB] p-2.5 text-xs">
                  <code className="flex-1 truncate text-[#667085]">{portalUrl(emp)}</code>
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
              <h3 className="text-base font-bold text-[#1D2939]">Office GPS, Camera &amp; Network Checks</h3>
              <label className="block text-xs font-semibold text-[#1D2939]">Office Name<input value={settingsDraft.officeName} onChange={(e) => setSettingsDraft({ ...settingsDraft, officeName: e.target.value })} className="field mt-1" /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-semibold text-[#1D2939]">Latitude<input type="number" step="any" value={settingsDraft.officeLat} onChange={(e) => setSettingsDraft({ ...settingsDraft, officeLat: Number(e.target.value) })} className="field mt-1" /></label>
                <label className="text-xs font-semibold text-[#1D2939]">Longitude<input type="number" step="any" value={settingsDraft.officeLng} onChange={(e) => setSettingsDraft({ ...settingsDraft, officeLng: Number(e.target.value) })} className="field mt-1" /></label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-semibold text-[#1D2939]">Radius (meters)<input type="number" min={30} max={5000} value={settingsDraft.allowedRadiusM} onChange={(e) => setSettingsDraft({ ...settingsDraft, allowedRadiusM: Number(e.target.value) })} className="field mt-1" /></label>
                <label className="text-xs font-semibold text-[#1D2939]">Max GPS Accuracy (m)<input type="number" min={20} max={2000} value={settingsDraft.maxAccuracyM} onChange={(e) => setSettingsDraft({ ...settingsDraft, maxAccuracyM: Number(e.target.value) })} className="field mt-1" /></label>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#1D2939]"><input type="checkbox" checked={settingsDraft.requireSelfie} onChange={(e) => setSettingsDraft({ ...settingsDraft, requireSelfie: e.target.checked })} />Require front-camera selfie</label>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#1D2939]"><input type="checkbox" checked={settingsDraft.blockVpnOrForeignIp} onChange={(e) => setSettingsDraft({ ...settingsDraft, blockVpnOrForeignIp: e.target.checked })} />Block detected foreign IP addresses</label>
              <div className="rounded-xl bg-[#F9FAFB] p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#1D2939]">Office Wi-Fi Public IP</span>
                  {currentRequestIp && <button type="button" onClick={() => setSettingsDraft({ ...settingsDraft, officeWifiIp: currentRequestIp })} className="text-[11px] font-bold text-[#465FFF] hover:underline">Use My IP ({currentRequestIp})</button>}
                </div>
                <input value={settingsDraft.officeWifiIp} onChange={(e) => setSettingsDraft({ ...settingsDraft, officeWifiIp: e.target.value })} placeholder="Optional Office Wi-Fi IP" className="field" />
                <label className="flex items-center gap-2 text-xs font-semibold text-[#1D2939]"><input type="checkbox" checked={settingsDraft.requireOfficeWifiIp} onChange={(e) => setSettingsDraft({ ...settingsDraft, requireOfficeWifiIp: e.target.checked })} />Require Office Wi-Fi IP to mark attendance</label>
              </div>
              <p className="text-[11px] leading-relaxed text-[#667085]">Browser registration and camera images provide evidence. They do not guarantee device identity, liveness or fake-GPS/VPN detection. Office network checks require trusted hosting headers.</p>
              <button type="submit" disabled={busy} className="w-full rounded-xl bg-[#465FFF] py-2.5 text-xs font-bold text-white disabled:opacity-50">Save GPS Settings</button>
            </form>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 text-xs">{month === todayIst.slice(0, 7) && <span>Not Checked In Today: {employees.filter(emp => emp.active && !logs.some(log => log.employeeId === emp.id && log.workDate === todayIst)).length}</span>}<button type="button" disabled={busy} onClick={() => void cleanupPhotos()} className="rounded-lg border px-3 py-2">Clean &gt;60d Selfies</button></div>
      {empDraft && <EmployeeFormModal draft={empDraft} error={employeeSaveError} busy={busy} onChange={setEmpDraft} onClose={() => { setEmployeeSaveError(''); setEmpDraft(null) }} onSubmit={handleSaveEmployee} />}
      {logDraft && <AttendanceEditModal draft={logDraft} employees={employees} busy={busy} onChange={setLogDraft} onClose={() => setLogDraft(null)} onSubmit={handleSaveLog} />}
    </section>
  )
}
