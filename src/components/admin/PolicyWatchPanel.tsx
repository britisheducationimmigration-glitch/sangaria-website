// src/components/admin/PolicyWatchPanel.tsx
import { useEffect, useState } from 'react'
import {
  deletePolicyNotice,
  getAdminPolicyWatch,
  markPolicySourceReview,
  savePolicyNotice,
  scanPolicySourcesNow,
} from '@/lib/admin-functions'
import { getPolicyWatchStatus, type PolicyNotice, type PolicySourceReview, type PolicyWatchItem } from '@/data/policy-watch'
import { AlertCircle, CheckCircle2, ExternalLink, Globe2, Plus, RefreshCw, ShieldAlert, Trash2 } from 'lucide-react'

type PanelData = {
  items: PolicyWatchItem[]
  notices: PolicyNotice[]
  reviews: Record<string, PolicySourceReview>
  countries: { slug: string; name: string }[]
}

const blankNotice = (): PolicyNotice => ({
  id: '',
  countrySlug: 'uk',
  title: '',
  message: '',
  showFrom: '',
  expiresOn: '',
  sourceLabel: '',
  sourceUrl: '',
  status: 'draft',
  sourceVerified: false,
})

function displayDate(value?: string) {
  if (!value) return 'Not checked yet'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(date)
}

export function PolicyWatchPanel() {
  const [data, setData] = useState<PanelData | null>(null)
  const [form, setForm] = useState<PolicyNotice>(blankNotice())
  const [formOpen, setFormOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function reload() {
    try {
      setError('')
      setData(await getAdminPolicyWatch())
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load policy notices.')
    }
  }

  useEffect(() => { void reload() }, [])

  function startNewNotice() {
    setForm(blankNotice())
    setFormOpen(true)
    setError('')
    setMessage('')
  }

  function editNotice(notice: PolicyNotice) {
    setForm({ ...notice })
    setFormOpen(true)
    setError('')
    setMessage('')
    window.setTimeout(() => document.getElementById('country-notices')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  async function saveNotice(status: 'draft' | 'published') {
    setBusy(true)
    setError('')
    setMessage('')
    try {
      await savePolicyNotice({ data: { ...form, status } })
      setForm(blankNotice())
      setFormOpen(false)
      setMessage(status === 'published' ? 'Notice published. It will hide automatically on its expiry date.' : 'Draft saved.')
      await reload()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save this notice.')
    } finally {
      setBusy(false)
    }
  }

  async function removeNotice(notice: PolicyNotice) {
    if (!window.confirm('Delete this policy notice?')) return
    setBusy(true)
    setError('')
    try {
      await deletePolicyNotice({ data: { id: notice.id } })
      setMessage('Notice removed.')
      await reload()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not remove this notice.')
    } finally {
      setBusy(false)
    }
  }

  async function markReview(item: PolicyWatchItem, action: 'checked' | 'guidance-updated') {
    setBusy(true)
    setError('')
    setMessage('')
    try {
      await markPolicySourceReview({ data: { itemId: item.id, action } })
      setMessage(action === 'checked' ? 'Official source marked as reviewed.' : 'Website guidance marked as updated.')
      await reload()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save the review status.')
    } finally {
      setBusy(false)
    }
  }

  async function scanSources() {
    setScanning(true)
    setError('')
    setMessage('')
    try {
      const result = await scanPolicySourcesNow()
      setMessage(`Checked ${result.checked} official pages; ${result.changed} change alert(s) added as drafts; ${result.baselined} source(s) saved for the first comparison.`)
      await reload()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not check official sources.')
    } finally {
      setScanning(false)
    }
  }

  const notices = [...(data?.notices ?? [])].sort((left, right) => {
    if (left.status !== right.status) return left.status === 'draft' ? -1 : 1
    return left.expiresOn.localeCompare(right.expiresOn)
  })

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-[#ECF3FF] text-[#465FFF]">
              <ShieldAlert className="size-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#465FFF]">Compliance & Rules</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#1D2939]">Visa Policy Watch</h2>
          <p className="mt-0.5 text-xs text-[#667085]">
            Track official immigration shifts, publish dated alert banners, and maintain website compliance.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void scanSources()}
          disabled={scanning || busy}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#E4E7EC] bg-white px-4 py-2 text-xs font-semibold text-[#344054] shadow-2xs hover:bg-[#F9FAFB] disabled:opacity-60"
        >
          <RefreshCw className={`size-3.5 text-[#465FFF] ${scanning ? 'animate-spin' : ''}`} />
          {scanning ? 'Checking official sources…' : 'Scan official sources now'}
        </button>
      </div>

      {message && (
        <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800">
          <CheckCircle2 className="size-4 shrink-0" /> {message}
        </div>
      )}
      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800">
          <AlertCircle className="size-4 shrink-0" /> {error}
        </div>
      )}

      {/* Country Notices Section */}
      <div id="country-notices" className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F2F4F7] pb-3">
        <div>
          <h3 className="text-base font-bold text-[#1D2939]">Active Country Notices</h3>
          <p className="text-xs text-[#667085]">Published notices display on the corresponding country guidance pages.</p>
        </div>
        <button
          type="button"
          onClick={startNewNotice}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-[#465FFF] px-3.5 text-xs font-semibold text-white shadow-xs hover:bg-[#3b52d4]"
        >
          <Plus className="size-3.5" /> New notice
        </button>
      </div>

      {formOpen && (
        <form onSubmit={(event) => event.preventDefault()} className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#F2F4F7] pb-3">
            <h3 className="text-sm font-bold text-[#1D2939]">{form.id ? 'Edit Policy Notice' : 'Create Policy Notice'}</h3>
            <button type="button" onClick={() => { setFormOpen(false); setForm(blankNotice()) }} className="text-xs font-semibold text-[#667085] hover:text-[#1D2939]">Close</button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-[#344054]">Show on Country Page
              <select value={form.countrySlug} onChange={(event) => setForm({ ...form, countrySlug: event.currentTarget.value })} className="mt-1.5 block h-10 w-full rounded-xl border border-[#E4E7EC] bg-white px-3 text-xs text-[#1D2939] focus:border-[#465FFF] focus:outline-none">
                {(data?.countries ?? []).map((country) => <option key={country.slug} value={country.slug}>{country.name}</option>)}
                <option value="all">All country pages</option>
              </select>
            </label>
            <label className="block text-xs font-semibold text-[#344054]">Notice Title *
              <input required maxLength={180} value={form.title} placeholder="e.g. IRCC increases living fund requirements for 2026" onChange={(event) => setForm({ ...form, title: event.currentTarget.value })} className="mt-1.5 block h-10 w-full rounded-xl border border-[#E4E7EC] px-3 text-xs text-[#1D2939] placeholder:text-[#98A2B3] focus:border-[#465FFF] focus:outline-none" />
            </label>
          </div>

          <label className="block text-xs font-semibold text-[#344054]">Detailed Advisory Message *
            <textarea required maxLength={1400} rows={3} value={form.message} placeholder="Full advisory text for prospective students and applicants…" onChange={(event) => setForm({ ...form, message: event.currentTarget.value })} className="mt-1.5 block w-full rounded-xl border border-[#E4E7EC] p-3 text-xs leading-relaxed text-[#1D2939] placeholder:text-[#98A2B3] focus:border-[#465FFF] focus:outline-none" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-[#344054]">Show From Date
              <input type="date" value={form.showFrom} onChange={(event) => setForm({ ...form, showFrom: event.currentTarget.value })} className="mt-1.5 block h-10 w-full rounded-xl border border-[#E4E7EC] px-3 text-xs text-[#1D2939] focus:border-[#465FFF] focus:outline-none" />
            </label>
            <label className="block text-xs font-semibold text-[#344054]">Hide On / Expiry Date
              <input type="date" value={form.expiresOn} onChange={(event) => setForm({ ...form, expiresOn: event.currentTarget.value })} className="mt-1.5 block h-10 w-full rounded-xl border border-[#E4E7EC] px-3 text-xs text-[#1D2939] focus:border-[#465FFF] focus:outline-none" />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-[#344054]">Official Source Label
              <input maxLength={180} value={form.sourceLabel} placeholder="e.g. Official IRCC Gazette" onChange={(event) => setForm({ ...form, sourceLabel: event.currentTarget.value })} className="mt-1.5 block h-10 w-full rounded-xl border border-[#E4E7EC] px-3 text-xs text-[#1D2939] focus:border-[#465FFF] focus:outline-none" />
            </label>
            <label className="block text-xs font-semibold text-[#344054]">Official Source URL
              <input type="url" maxLength={500} value={form.sourceUrl} placeholder="https://..." onChange={(event) => setForm({ ...form, sourceUrl: event.currentTarget.value })} className="mt-1.5 block h-10 w-full rounded-xl border border-[#E4E7EC] px-3 text-xs text-[#1D2939] focus:border-[#465FFF] focus:outline-none" />
            </label>
          </div>

          <label className="flex items-start gap-2.5 rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-3 text-xs text-[#344054]">
            <input type="checkbox" checked={form.sourceVerified} onChange={(event) => setForm({ ...form, sourceVerified: event.currentTarget.checked })} className="mt-0.5 size-4 rounded border-[#D0D5DD] text-[#465FFF]" />
            <span>I have verified this advisory against the official government portal.</span>
          </label>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F2F4F7]">
            <button type="button" disabled={busy} onClick={() => void saveNotice('draft')} className="min-h-9 rounded-xl border border-[#E4E7EC] bg-white px-3.5 text-xs font-semibold text-[#344054] hover:bg-[#F9FAFB] disabled:opacity-50">Save draft</button>
            <button type="button" disabled={busy} onClick={() => void saveNotice('published')} className="min-h-9 rounded-xl bg-[#465FFF] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[#3b52d4] disabled:opacity-50">{busy ? 'Saving…' : 'Save & Publish Live'}</button>
          </div>
        </form>
      )}

      {/* Notices List */}
      <div className="space-y-3">
        {notices.map((notice) => (
          <article key={notice.id} className="rounded-2xl border border-[#E4E7EC] bg-white p-4.5 transition hover:border-[#D0D5DD]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <span className="rounded-md bg-[#ECF3FF] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#465FFF]">
                  {notice.countrySlug === 'all' ? 'All Destinations' : notice.countrySlug.toUpperCase()}
                </span>
                <h4 className="mt-1.5 text-sm font-bold text-[#1D2939]">{notice.title}</h4>
                <p className="mt-1 text-xs leading-relaxed text-[#667085]">{notice.message}</p>
              </div>
              <span className={`inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${notice.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {notice.status === 'published' ? 'Live on Site' : 'Private Draft'}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#F2F4F7] pt-2.5 text-[11px] text-[#667085]">
              <span>Active: {notice.showFrom || 'Immediate'} → Expires: {notice.expiresOn || 'Indefinite'}</span>
              <div className="flex items-center gap-2">
                {notice.sourceUrl && (
                  <a href={notice.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-[#465FFF] hover:underline">
                    {notice.sourceLabel || 'Official source'} <ExternalLink className="size-3" />
                  </a>
                )}
                <button type="button" onClick={() => editNotice(notice)} className="font-semibold text-[#344054] hover:text-[#1D2939]">Edit</button>
                <button type="button" onClick={() => void removeNotice(notice)} disabled={busy} className="font-semibold text-rose-600 hover:text-rose-700">Delete</button>
              </div>
            </div>
          </article>
        ))}
        {!notices.length && (
          <p className="rounded-2xl border border-[#E4E7EC] bg-white p-8 text-center text-xs text-[#667085]">
            No country notices right now. Click "New notice" to broadcast official embassy updates.
          </p>
        )}
      </div>

      {/* Official Sources Checklist */}
      <div className="pt-4">
        <h3 className="text-base font-bold text-[#1D2939]">Monitored Official Sources</h3>
        <p className="mt-0.5 text-xs text-[#667085]">Verified government domains scanned for policy alterations.</p>
        <div className="mt-3.5 space-y-3">
          {(data?.items ?? []).map((item) => {
            const review = data?.reviews[item.id] ?? {}
            const status = getPolicyWatchStatus(item)
            return (
              <article key={item.id} className="rounded-2xl border border-[#E4E7EC] bg-white p-4 transition hover:border-[#D0D5DD]">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#465FFF]">{item.destination}</span>
                    <h4 className="mt-0.5 text-sm font-bold text-[#1D2939]">{item.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-[#667085]">{item.summary}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center rounded-md bg-[#F2F4F7] px-2 py-0.5 text-[10px] font-semibold text-[#475467]">
                    {review.sourceChangePending ? 'Review Required' : review.guidanceUpdatedAt ? 'Guidance Updated' : review.checkedAt ? 'Checked' : status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#F2F4F7] pt-2.5 text-xs">
                  <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-[#465FFF] hover:underline">
                    {item.sourceLabel} <ExternalLink className="size-3" />
                  </a>
                  <div className="flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void markReview(item, 'checked')} className="rounded-lg border border-[#E4E7EC] bg-white px-2.5 py-1 text-xs font-semibold text-[#344054] hover:bg-[#F9FAFB] disabled:opacity-50">Mark checked</button>
                    <button type="button" disabled={busy || !review.checkedAt} onClick={() => void markReview(item, 'guidance-updated')} className="rounded-lg bg-[#465FFF] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#3b52d4] disabled:opacity-40">Mark updated</button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}