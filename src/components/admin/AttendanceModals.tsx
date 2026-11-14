import type { FormEvent } from 'react'
import type { AttendanceStatus } from '@/lib/content-types'

export type EmployeeDraft = {
  id: number
  name: string
  designation: string
  phone: string
  email: string
  pin: string
  clearPin: boolean
  cycleStartDay: number
  expectedInTime: string
  expectedOutTime: string
  officeOnly: boolean
  active: boolean
}

export type LogDraft = {
  employeeId: number
  employeeName: string
  workDate: string
  status: AttendanceStatus
  checkInTime: string
  checkOutTime: string
  isLate: boolean
  editNote: string
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
          <button type="button" onClick={onClose} className="text-sm font-bold text-[#667085] hover:text-[#1D2939]">✕</button>
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

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-xs font-semibold text-[#1D2939]">
            Cycle Start Day (1–28) *
            <input
              type="number"
              min={1}
              max={28}
              required
              value={draft.cycleStartDay}
              onChange={(e) => onChange({ ...draft, cycleStartDay: Math.max(1, Math.min(28, Number(e.target.value) || 1)) })}
              className="field mt-1"
            />
          </label>
          <label className="text-xs font-semibold text-[#1D2939]">
            Shift In Time
            <input type="time" required value={draft.expectedInTime} onChange={(e) => onChange({ ...draft, expectedInTime: e.target.value })} className="field mt-1" />
          </label>
          <label className="text-xs font-semibold text-[#1D2939]">
            Shift Out Time
            <input type="time" required value={draft.expectedOutTime} onChange={(e) => onChange({ ...draft, expectedOutTime: e.target.value })} className="field mt-1" />
          </label>
        </div>

        <label className="block text-xs font-semibold text-[#1D2939]">
          {draft.id ? 'New 4–8 Digit PIN (leave blank to keep old PIN)' : '4–8 Digit PIN (recommended)'}
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
            {busy ? 'Saving…' : 'Save Employee'}
          </button>
        </div>
      </form>
    </div>
  )
}

export function AttendanceEditModal({
  draft,
  busy,
  onChange,
  onClose,
  onSubmit,
}: {
  draft: LogDraft
  busy: boolean
  onChange: (next: LogDraft) => void
  onClose: () => void
  onSubmit: (e: FormEvent) => void
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-xs" role="dialog" aria-modal="true">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-[#E4E7EC] bg-white p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-3">
          <div>
            <h3 className="text-lg font-bold text-[#1D2939]">Edit Attendance</h3>
            <p className="text-xs text-[#667085]">{draft.employeeName} · {draft.workDate}</p>
          </div>
          <button type="button" onClick={onClose} className="text-sm font-bold text-[#667085] hover:text-[#1D2939]">✕</button>
        </div>

        <label className="block text-xs font-semibold text-[#1D2939]">
          Status
          <select value={draft.status} onChange={(e) => onChange({ ...draft, status: e.target.value as AttendanceStatus })} className="field mt-1">
            <option>Present</option>
            <option>Half Day</option>
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
          <input type="checkbox" checked={draft.isLate} onChange={(e) => onChange({ ...draft, isLate: e.target.checked })} />
          Mark as Late arrival
        </label>

        <label className="block text-xs font-semibold text-[#1D2939]">
          Edit Note / Reason
          <input value={draft.editNote} onChange={(e) => onChange({ ...draft, editNote: e.target.value })} className="field mt-1" placeholder="e.g. Field visit / forgot to check out" />
        </label>

        <div className="flex justify-end gap-2 border-t border-[#E4E7EC] pt-3">
          <button type="button" onClick={onClose} className="rounded-xl border border-[#E4E7EC] px-4 py-2 text-xs font-bold text-[#1D2939]">Cancel</button>
          <button type="submit" disabled={busy} className="rounded-xl bg-[#465FFF] px-5 py-2 text-xs font-bold text-white disabled:opacity-50">
            {busy ? 'Saving…' : 'Save Attendance'}
          </button>
        </div>
      </form>
    </div>
  )
}