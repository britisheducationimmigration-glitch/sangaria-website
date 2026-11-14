import { useMemo, useState } from 'react'
import { ArrowUpRight, FileCheck2, Users } from 'lucide-react'
import { CountryFlag } from '@/components/CountryFlag'
import type { AdminSnapshot } from '@/lib/content-types'

export function TailAdminDashboard({
  snapshot,
  onOpenEnquiries,
  onOpenAttendance,
  canOpenAttendance,
}: {
  snapshot: AdminSnapshot
  onOpenEnquiries: () => void
  onOpenAttendance: () => void
  canOpenAttendance: boolean
}) {
  const [breakdownMode, setBreakdownMode] = useState<'stage' | 'source'>('stage')
  const { enquiries, enquiryStats: stats } = snapshot

  const conversionRate = stats.total ? Math.round((stats.converted / stats.total) * 100) : 0

  const monthlyCounts = useMemo(() => {
    const months: Array<{ key: string; label: string; count: number }> = []
    const now = new Date()
    for (let offset = 5; offset >= 0; offset -= 1) {
      const dt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1))
      const key = dt.toISOString().slice(0, 7)
      const label = dt.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
      months.push({ key, label, count: 0 })
    }
    for (const item of enquiries) {
      const m = item.createdAt.slice(0, 7)
      const hit = months.find((entry) => entry.key === m)
      if (hit) hit.count += 1
    }
    return months
  }, [enquiries])

  const maxMonthly = Math.max(1, ...monthlyCounts.map((m) => m.count))

  const countryBreakdown = useMemo(() => {
    const map = new Map<string, number>()
    for (const item of enquiries) {
      const key = item.country.trim() || 'Not decided'
      map.set(key, (map.get(key) ?? 0) + 1)
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([country, count]) => ({
        country,
        count,
        pct: enquiries.length ? Math.round((count / enquiries.length) * 100) : 0,
      }))
  }, [enquiries])

  const breakdownRows = useMemo(() => {
    const sourceObj = breakdownMode === 'stage' ? stats.byStatus : stats.bySource
    return Object.entries(sourceObj).sort((a, b) => b[1] - a[1])
  }, [breakdownMode, stats.bySource, stats.byStatus])

  const gaugeRadius = 86
  const semiCircumference = Math.PI * gaugeRadius
  const gaugeOffset = semiCircumference * (1 - Math.min(100, conversionRate) / 100)

  const badgeTone = (status: string) => {
    if (status === 'Converted' || status === 'Applied') return 'bg-[#ECFDF3] text-[#12B76A]'
    if (status === 'Follow-up' || status === 'Documents Pending') return 'bg-[#FFFAEB] text-[#F79009]'
    if (status === 'Closed') return 'bg-[#FEF3F2] text-[#F04438]'
    return 'bg-[#ECF3FF] text-[#465FFF]'
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Top Left (7 columns) */}
        <div className="space-y-6 lg:col-span-7">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#E4E7EC] bg-white p-6">
              <div className="grid size-12 place-items-center rounded-xl bg-[#F9FAFB] text-[#1D2939]">
                <Users className="size-5" />
              </div>
              <p className="mt-4 text-sm text-[#667085]">Total Leads</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="text-3xl font-bold text-[#1D2939]">{stats.total}</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF3] px-2.5 py-1 text-xs font-semibold text-[#12B76A]">
                  <ArrowUpRight className="size-3.5" />+{stats.newLast7Days} (7d)
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E4E7EC] bg-white p-6">
              <div className="grid size-12 place-items-center rounded-xl bg-[#F9FAFB] text-[#1D2939]">
                <FileCheck2 className="size-5" />
              </div>
              <p className="mt-4 text-sm text-[#667085]">Active Pipeline</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="text-3xl font-bold text-[#1D2939]">{stats.followUps}</p>
                <span className="inline-flex items-center rounded-full bg-[#FFFAEB] px-2.5 py-1 text-xs font-semibold text-[#F79009]">
                  {stats.dueToday} due today
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E4E7EC] bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[#1D2939]">Monthly Enquiries</h2>
                <p className="text-xs text-[#667085]">Recent 6 months from saved website leads</p>
              </div>
              {canOpenAttendance && (
                <button
                  type="button"
                  onClick={onOpenAttendance}
                  className="rounded-lg border border-[#E4E7EC] px-3 py-1.5 text-xs font-semibold text-[#465FFF] hover:bg-[#ECF3FF]"
                >
                  Open Attendance →
                </button>
              )}
            </div>
            <div className="mt-6 grid h-48 grid-cols-6 items-end gap-3 border-b border-[#E4E7EC] pb-2">
              {monthlyCounts.map((m) => {
                const heightPct = Math.max(8, Math.round((m.count / maxMonthly) * 100))
                return (
                  <div key={m.key} className="flex h-full flex-col items-center justify-end gap-2">
                    <span className="text-[11px] font-semibold text-[#667085]">{m.count}</span>
                    <div className="flex w-full max-w-10 flex-1 items-end">
                      <div
                        className="w-full rounded-t-lg bg-[#465FFF] transition-all"
                        style={{ height: `${heightPct}%` }}
                        title={`${m.label}: ${m.count} leads`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-2 grid grid-cols-6 gap-3 text-center text-xs font-medium text-[#667085]">
              {monthlyCounts.map((m) => (
                <span key={m.key}>{m.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Top Right (5 columns): Conversion Target Gauge */}
        <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white lg:col-span-5">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-[#1D2939]">Lead Conversion Rate</h2>
            <p className="mt-1 text-xs text-[#667085]">Converted leads vs total saved enquiries</p>

            <div className="relative mx-auto mt-6 flex max-w-[230px] flex-col items-center">
              <svg viewBox="0 0 220 125" className="w-full overflow-visible" aria-hidden="true">
                <path
                  d="M 24 110 A 86 86 0 0 1 196 110"
                  fill="none"
                  stroke="#E4E7EC"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d="M 24 110 A 86 86 0 0 1 196 110"
                  fill="none"
                  stroke="#465FFF"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray={semiCircumference}
                  strokeDashoffset={gaugeOffset}
                />
              </svg>
              <div className="-mt-12 text-center">
                <p className="text-4xl font-bold text-[#1D2939]">{conversionRate}%</p>
                <span className="mt-1 inline-block rounded-full bg-[#ECFDF3] px-3 py-0.5 text-xs font-semibold text-[#12B76A]">
                  {stats.converted} Converted
                </span>
              </div>
            </div>

            <p className="mt-6 text-center text-xs leading-relaxed text-[#667085]">
              {stats.newCount} new enquiry(s) waiting for first response and {stats.demoRequests} IELTS/PTE demo request(s).
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-[#E4E7EC] bg-[#F9FAFB] py-4 text-center">
            <div>
              <p className="text-xs text-[#667085]">New Leads</p>
              <p className="mt-1 text-lg font-bold text-[#1D2939]">{stats.newCount}</p>
            </div>
            <div>
              <p className="text-xs text-[#667085]">Demo Req.</p>
              <p className="mt-1 text-lg font-bold text-[#1D2939]">{stats.demoRequests}</p>
            </div>
            <div>
              <p className="text-xs text-[#667085]">Due Today</p>
              <p className="mt-1 text-lg font-bold text-[#F79009]">{stats.dueToday}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Full-Width Breakdown */}
      <div className="rounded-2xl border border-[#E4E7EC] bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#1D2939]">Pipeline &amp; Source Statistics</h2>
            <p className="text-xs text-[#667085]">Live distribution of enquiries</p>
          </div>
          <div className="inline-flex rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setBreakdownMode('stage')}
              className={`rounded-lg px-3 py-1.5 ${breakdownMode === 'stage' ? 'bg-white text-[#1D2939] shadow-xs' : 'text-[#667085]'}`}
            >
              By Stage
            </button>
            <button
              type="button"
              onClick={() => setBreakdownMode('source')}
              className={`rounded-lg px-3 py-1.5 ${breakdownMode === 'source' ? 'bg-white text-[#1D2939] shadow-xs' : 'text-[#667085]'}`}
            >
              By Source
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {breakdownRows.map(([label, count]) => {
            const pct = stats.total ? Math.round((count / stats.total) * 100) : 0
            return (
              <div key={label} className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-[#1D2939]">
                  <span className="truncate">{label}</span>
                  <span>{count}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E4E7EC]">
                  <div className="h-full rounded-full bg-[#465FFF]" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-1.5 text-[11px] text-[#667085]">{pct}% of all leads</p>
              </div>
            )
          })}
          {breakdownRows.length === 0 && <p className="text-sm text-[#667085]">No enquiry data yet.</p>}
        </div>
      </div>

      {/* Bottom Row: Destination Breakdown (5 cols) + Recent Enquiries (7 cols) */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-[#E4E7EC] bg-white p-6 lg:col-span-5">
          <h2 className="text-lg font-semibold text-[#1D2939]">Enquiries by Destination</h2>
          <p className="mt-1 text-xs text-[#667085]">Top preferred countries from recent leads</p>
          <div className="mt-5 space-y-4">
            {countryBreakdown.map((row) => (
              <div key={row.country} className="flex items-center gap-3">
                <CountryFlag country={row.country} className="h-6 w-9 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#1D2939]">
                    <span className="truncate">{row.country}</span>
                    <span>{row.count} ({row.pct}%)</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#E4E7EC]">
                    <div className="h-full rounded-full bg-[#465FFF]" style={{ width: `${row.pct}%` }} />
                  </div>
                </div>
              </div>
            ))}
            {countryBreakdown.length === 0 && <p className="text-sm text-[#667085]">No destination data yet.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E4E7EC] bg-white p-6 lg:col-span-7">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#1D2939]">Recent Enquiries</h2>
            <button
              type="button"
              onClick={onOpenEnquiries}
              className="rounded-lg border border-[#E4E7EC] px-3 py-1.5 text-xs font-semibold text-[#1D2939] hover:bg-[#F9FAFB]"
            >
              See all
            </button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[460px] text-left text-xs">
              <thead className="border-b border-[#E4E7EC] text-[#667085]">
                <tr>
                  <th className="py-2.5 font-medium">Student / Client</th>
                  <th className="py-2.5 font-medium">Interest &amp; Country</th>
                  <th className="py-2.5 font-medium">Date (IST)</th>
                  <th className="py-2.5 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EC]">
                {enquiries.slice(0, 6).map((item) => (
                  <tr key={item.id} className="hover:bg-[#F9FAFB]">
                    <td className="py-3 pr-2">
                      <p className="font-semibold text-[#1D2939]">{item.name}</p>
                      <p className="text-[#667085]">{item.phone}</p>
                    </td>
                    <td className="py-3 pr-2 text-[#667085]">
                      {item.interest || 'Counselling'}
                      {item.country ? ` · ${item.country}` : ''}
                    </td>
                    <td className="py-3 pr-2 text-[#667085]">
                      {new Date(item.createdAt).toLocaleDateString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </td>
                    <td className="py-3 text-right">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badgeTone(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {enquiries.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-[#667085]">
                      No enquiries yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}