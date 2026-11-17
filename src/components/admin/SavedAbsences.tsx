import type { AttendanceBreakRecord } from '@/lib/content-types'

export function SavedAbsences({ breaks }: { breaks: AttendanceBreakRecord[] }) {
  const absences = breaks.filter(interval => interval.note.startsWith('Admin - unapproved absence: '))
  if (!absences.length) return null
  const time = (value: string) => new Date(value).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })
  return <section aria-label="Saved unapproved absences" className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
    <p className="font-bold">Unapproved absence recorded ({absences.length})</p>
    <ul className="mt-2 space-y-2">{absences.map((interval, index) => <li key={index}>
      <p className="font-semibold">{time(interval.outAt)} – {interval.inAt ? time(interval.inAt) : 'Return pending'} IST</p>
      <p className="mt-0.5 whitespace-pre-wrap break-words">{interval.note.slice('Admin - unapproved absence: '.length)}</p>
    </li>)}</ul>
    <p className="mt-2">Excluded from net working time. Overlapping breaks count once; attendance status follows the remaining hours.</p>
  </section>
}
