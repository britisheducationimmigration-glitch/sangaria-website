import type { FormEvent } from 'react'
import type { AttendanceEditHistoryRecord, AttendanceStatus, EmployeeRecord } from '@/lib/content-types'

export type EmployeeDraft = {
  id: number
  name: string
  designation: string
  phone: string
  email: string
  pin: string
  clearPin: boolean
  cycleStartDay: number
  monthlySalary: number
  expectedInTime: string
  expectedOutTime: string
  officeOnly: boolean
  active: boolean
  joiningDate: string
  leavingDate: string
  halfDayMinutes: number
  lateGraceMinutes: number
  weeklyOffDays: number[]
  holidayDates: string[]
  effectiveDate: string
}

export type LogDraft = {
  mode: 'create' | 'edit'
  employeeId: number
  employeeName: string
  workDate: string
  status: AttendanceStatus
  checkInTime: string
  checkOutTime: string
  checkOutNextDay?: boolean
  isLate: boolean
  editNote: string
  editHistory: AttendanceEditHistoryRecord[]
}

function formatIstHistoryTime(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export function EmployeeFormModal({
  draft,
  busy,
  onChange,
  onClose,
  onSubmit,
}: {
  draft: EmployeeDraft
  busy: boolean
  onChange: (next: EmployeeDraft) => void
  onClose: () => void
  onSubmit: (e: FormEvent) => void
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-xs" role="dialog" aria-modal="true">
      <form
        onSubmit={onSubmit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#E4E7EC] bg-white p-6 shadow-xl space-y-4"
      >
        <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-3">
          <h3 className="text-lg font-bold text-[#1D2939]">{draft.id ? 'Edit Employee' : 'Add Employee'}</h3>
          <button type="button" onClick={onClose} className="text-sm font-bold text-[#667085] hover:text-[#1D2939]">?</button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold text-[#1D2939]">
            Full Name *
            <input required value={draft.name} onChange={(e) => onChange({ ...draft, name: e.target.value })} className="field mt-1" placeholder="Staff name" />
          </label>
          <label className="text-xs font-semibold text-[#1D2939]">
            Role / Designation
            <input value={draft.designation} onChange={(e) => onChange({ ...draft, designation: e.target.value })} className="field mt-1" placeholder="Counsellor / Trainer" />
          </label>
          <label className="text-xs font-semibold text-[#1D2939]">
            Phone
            <input value={draft.phone} onChange={(e) => onChange({ ...draft, phone: e.target.value })} className="field mt-1" placeholder="10-digit mobile" />
          </label>
          <label className="text-xs font-semibold text-[#1D2939]">
            Email
            <input type="email" value={draft.email} onChange={(e) => onChange({ ...draft, email: e.target.value })} className="field mt-1" placeholder="Optional" />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold text-[#1D2939]">
            Monthly Salary (INR)
            <input
              type="number"
              min={0}
              max={10000000}
              value={draft.monthlySalary}
              onChange={(e) => onChange({ ...draft, monthlySalary: Math.max(0, Number(e.target.value) || 0) })}
              className="field mt-1"
              placeholder="e.g. 15000"
            />
          </label>
          <label className="text-xs font-semibold text-[#1D2939]">
            Salary Cycle Start Day (1-31) *
            <input
              type="number"
              min={1}
              max={31}
              required
              value={draft.cycleStartDay}
              onChange={(e) => onChange({ ...draft, cycleStartDay: Math.max(1, Math.min(31, Number(e.target.value) || 1)) })}
              className="field mt-1"
            />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold text-[#1D2939]">
            Shift In Time
            <input type="time" required value={draft.expectedInTime} onChange={(e) => onChange({ ...draft, expectedInTime: e.target.value })} className="field mt-1" />
          </label>
          <label className="text-xs font-semibold text-[#1D2939]">
            Shift Out Time
            <input type="time" required value={draft.expectedOutTime} onChange={(e) => onChange({ ...draft, expectedOutTime: e.target.value })} className="field mt-1" />
          </label>
        </div>

        <fieldset className="space-y-3 rounded-xl border border-[#E4E7EC] p-3">
          <legend className="px-1 text-xs font-bold">Attendance &amp; payroll policy</legend>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold">Joining date<input type="date" value={draft.joiningDate} onChange={(e) => onChange({ ...draft, joiningDate: e.target.value })} className="field mt-1" /></label>
            <label className="text-xs font-semibold">Last working date<input type="date" min={draft.joiningDate || undefined} value={draft.leavingDate} onChange={(e) => onChange({ ...draft, leavingDate: e.target.value })} className="field mt-1" /></label>
            <label className="text-xs font-semibold">Full-day minimum (minutes)<input type="number" min={1} max={1440} value={draft.halfDayMinutes} onChange={(e) => onChange({ ...draft, halfDayMinutes: Number(e.target.value) })} className="field mt-1" /></label>
            <label className="text-xs font-semibold">Late grace (minutes)<input type="number" min={0} max={240} value={draft.lateGraceMinutes} onChange={(e) => onChange({ ...draft, lateGraceMinutes: Number(e.target.value) })} className="field mt-1" /></label>
          </div>
          <label className="block text-xs font-semibold">Policy effective from<input type="date" required value={draft.effectiveDate} onChange={(e) => onChange({ ...draft, effectiveDate: e.target.value })} className="field mt-1" /><span className="mt-1 block font-normal text-[#667085]">Salary, cycle and policy changes use this date. Finalized reports stay locked.</span></label>
          <div className="text-xs font-semibold">Weekly off<div className="mt-2 flex flex-wrap gap-3">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label, day) => <label key={day} className="flex items-center gap-1"><input type="checkbox" checked={draft.weeklyOffDays.includes(day)} onChange={(e) => onChange({ ...draft, weeklyOffDays: e.target.checked ? [...draft.weeklyOffDays, day].sort() : draft.weeklyOffDays.filter((d) => d !== day) })} />{label}</label>)}</div></div>
          <label className="block text-xs font-semibold">Paid holidays (one YYYY-MM-DD date per line)<textarea defaultValue={draft.holidayDates.join('\n')} onBlur={(e) => onChange({ ...draft, holidayDates: e.target.value.split(/\s+/).filter(Boolean) })} rows={3} className="field mt-1" placeholder="2026-12-25" /></label>
        </fieldset>

        <label className="block text-xs font-semibold text-[#1D2939]">
          {draft.id ? 'New 4-8 Digit PIN (leave blank to keep old PIN)' : '4-8 Digit PIN (recommended)'}
          <input
            type="password"
            inputMode="numeric"
            maxLength={8}
            value={draft.pin}
            onChange={(e) => onChange({ ...draft, pin: e.target.value.replace(/\D/g, ''), clearPin: false })}
            className="field mt-1"
            placeholder="e.g. 1234"
          />
        </label>

        {draft.id > 0 && (
          <label className="flex items-center gap-2 text-xs font-semibold text-[#667085]">
            <input type="checkbox" checked={draft.clearPin} onChange={(e) => onChange({ ...draft, clearPin: e.target.checked, pin: '' })} />
            Remove PIN requirement for this employee
          </label>
        )}

        <div className="grid gap-2 rounded-xl bg-[#F9FAFB] p-3 text-xs font-semibold text-[#1D2939]">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={draft.officeOnly} onChange={(e) => onChange({ ...draft, officeOnly: e.target.checked })} />
            Must be inside Office GPS radius to mark attendance
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={draft.active} onChange={(e) => onChange({ ...draft, active: e.target.checked })} />
            Active (attendance link enabled)
          </label>
        </div>

        <div className="flex justify-end gap-2 border-t border-[#E4E7EC] pt-3">
          <button type="button" onClick={onClose} className="rounded-xl border border-[#E4E7EC] px-4 py-2 text-xs font-bold text-[#1D2939]">Cancel</button>
          <button type="submit" disabled={busy} className="rounded-xl bg-[#465FFF] px-5 py-2 text-xs font-bold text-white disabled:opacity-50">
            {busy ? 'Saving.' : 'Save Employee'}
          </button>
        </div>
      </form>
    </div>
  )
}

export function AttendanceEditModal({
  draft,
  employees,
  busy,
  onChange,
  onClose,
  onSubmit,
}: {
  draft: LogDraft
  employees: EmployeeRecord[]
  busy: boolean
  onChange: (next: LogDraft) => void
  onClose: () => void
  onSubmit: (e: FormEvent) => void
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-xs" role="dialog" aria-modal="true">
      <form onSubmit={onSubmit} className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[#E4E7EC] bg-white p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-3">
          <div>
            <h3 className="text-lg font-bold text-[#1D2939]">
              {draft.mode === 'create' ? 'Add Manual Attendance' : 'Edit Attendance'}
            </h3>
            {draft.mode === 'edit' && <p className="text-xs text-[#667085]">{draft.employeeName} � {draft.workDate}</p>}
          </div>
          <button type="button" onClick={onClose} className="text-sm font-bold text-[#667085] hover:text-[#1D2939]">?</button>
        </div>

        {draft.mode === 'create' && (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#1D2939]">
              Select Employee *
              <select
                required
                value={draft.employeeId}
                onChange={(e) => {
                  const emp = employees.find((item) => item.id === Number(e.target.value))
                  if (!emp) return
                  onChange({
                    ...draft,
                    employeeId: emp.id,
                    employeeName: emp.name,
                    checkInTime: emp.expectedInTime,
                    checkOutTime: emp.expectedOutTime,
                    checkOutNextDay: emp.expectedOutTime <= emp.expectedInTime,
                  })
                }}
                className="field mt-1"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-semibold text-[#1D2939]">
              Date *
              <input
                type="date"
                required
                value={draft.workDate}
                onChange={(e) => onChange({ ...draft, workDate: e.target.value })}
                className="field mt-1"
              />
            </label>
          </div>
        )}

        <label className="block text-xs font-semibold text-[#1D2939]">
          Status
          <select value={draft.status} onChange={(e) => { const status = e.target.value as AttendanceStatus; onChange({ ...draft, status, ...(['Leave', 'Paid Leave', 'Unpaid Leave', 'Absent'].includes(status) ? { checkInTime: '', checkOutTime: '', checkOutNextDay: false, isLate: false } : {}) }) }} className="field mt-1">
            <option>Present</option>
            <option>Half Day</option>
            <option>Paid Leave</option>
            <option>Unpaid Leave</option>
            <option>Leave</option>
            <option>Absent</option>
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs font-semibold text-[#1D2939]">
            Check In (IST)
            <input type="time" value={draft.checkInTime} onChange={(e) => onChange({ ...draft, checkInTime: e.target.value })} className="field mt-1" />
          </label>
          <label className="text-xs font-semibold text-[#1D2939]">
            Check Out (IST)
            <input type="time" value={draft.checkOutTime} onChange={(e) => onChange({ ...draft, checkOutTime: e.target.value })} className="field mt-1" />
          </label>
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-[#1D2939]">
          <input type="checkbox" checked={draft.checkOutNextDay ?? false} onChange={(e) => onChange({ ...draft, checkOutNextDay: e.target.checked })} />
          OUT on following day
        </label>

        <label className="flex items-center gap-2 text-xs font-semibold text-[#1D2939]">
          <input type="checkbox" checked={draft.isLate} onChange={(e) => onChange({ ...draft, isLate: e.target.checked })} />
          Mark as Late arrival
        </label>

        <label className="block text-xs font-semibold text-[#1D2939]">
          Reason / Edit Note {draft.mode === 'edit' ? '*' : ''}
          <input
            required={draft.mode === 'edit'}
            value={draft.editNote}
            onChange={(e) => onChange({ ...draft, editNote: e.target.value })}
            className="field mt-1"
            placeholder="e.g. Field visit / forgot to check out"
          />
        </label>

        {draft.editHistory.length > 0 && (
          <div className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-3">
            <p className="text-xs font-bold text-[#1D2939]">Edit History ({draft.editHistory.length})</p>
            <ul className="mt-2 max-h-40 space-y-2 overflow-y-auto text-[11px]">
              {draft.editHistory.map((h) => (
                <li key={h.id} className="rounded-lg bg-white p-2 ring-1 ring-[#E4E7EC]">
                  <p className="font-semibold text-[#1D2939]">
                    {h.editorName || h.editorEmail} � <span className="font-normal text-[#667085]">{formatIstHistoryTime(h.createdAt)}</span>
                  </p>
                  <p className="mt-0.5 text-[#465FFF]">{h.changesSummary}</p>
                  {h.reason && <p className="mt-0.5 text-[#667085]">Reason: {h.reason}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-[#E4E7EC] pt-3">
          <button type="button" onClick={onClose} className="rounded-xl border border-[#E4E7EC] px-4 py-2 text-xs font-bold text-[#1D2939]">Cancel</button>
          <button type="submit" disabled={busy} className="rounded-xl bg-[#465FFF] px-5 py-2 text-xs font-bold text-white disabled:opacity-50">
            {busy ? 'Saving.' : 'Save Attendance'}
          </button>
        </div>
      </form>
    </div>
  )
}