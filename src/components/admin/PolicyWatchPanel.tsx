import { useEffect, useState } from 'react'
import {
  deletePolicyNotice,
  getAdminPolicyWatch,
  markPolicySourceReview,
  savePolicyNotice,
  scanPolicySourcesNow,
} from '@/lib/admin-functions'
import { getPolicyWatchStatus, type PolicyNotice, type PolicySourceReview, type PolicyWatchItem } from '@/data/policy-watch'

type PanelData = {
  items: PolicyWatchItem[]
  notices: PolicyNotice[]
  reviews: Record<string, PolicySourceReview>
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
    <section className="max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-coral-600">Official source tracker</p>
          <h2 className="mt-1 text-3xl font-extrabold">Visa policy watch</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-forest-900/65">
            Publish dated notices for country pages, review official changes, and mark when website guidance has been updated.
          </p>
        </div>
        <button type="button" onClick={() => void scanSources()} disabled={scanning || busy} className="min-h-11 rounded-xl border border-forest-900/15 bg-white px-4 py-2 text-sm font-bold text-forest-900 hover:bg-forest-50 disabled:opacity-60">
          {scanning ? 'Checking sources…' : 'Check official sources now'}
        </button>
      </div>

      <div className="mb-5 rounded-2xl border border-forest-900/10 bg-white p-4 text-sm leading-relaxed text-forest-900/75">
        The weekly checker looks for changes on the official pages below. A changed page becomes a <strong>draft review alert</strong>; it does not decide what the law changed to or publish it. Verify the source, update the relevant guidance, then mark the review complete. A first scan records the baseline and may not create alerts.
      </div>

      {message && <p role="status" className="mb-4 rounded-xl bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-900">{message}</p>}
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-100 px-4 py-3 text-sm font-bold text-red-900">{error}</p>}

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-extrabold">Country notices</h3>
        <button type="button" onClick={startNewNotice} className="min-h-11 rounded-xl bg-forest-900 px-4 py-2 text-sm font-bold text-white hover:bg-forest-800">+ New notice</button>
      </div>

      {formOpen && (
        <form onSubmit={(event) => event.preventDefault()} className="mb-6 space-y-4 rounded-2xl border border-forest-900/15 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-extrabold">{form.id ? 'Edit notice' : 'Create notice'}</h3>
              <p className="mt-1 text-sm text-forest-900/65">Saved drafts stay private. Published notices appear on the selected country page only while the date window is active.</p>
            </div>
            <button type="button" onClick={() => { setFormOpen(false); setForm(blankNotice()) }} className="min-h-10 rounded-lg px-3 text-sm font-bold text-forest-900/70 hover:bg-forest-50">Close editor</button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">Show on
              <select value={form.countrySlug} onChange={(event) => setForm({ ...form, countrySlug: event.currentTarget.value })} className="mt-1 min-h-11 w-full rounded-xl border border-forest-900/15 bg-white px-3">
                <option value="uk">United Kingdom</option>
                <option value="canada">Canada</option>
                <option value="australia">Australia</option>
                <option value="usa">United States</option>
                <option value="new-zealand">New Zealand</option>
                <option value="germany">Germany</option>
                <option value="europe">Europe / Schengen</option>
                <option value="all">All country pages</option>
              </select>
            </label>
            <label className="text-sm font-semibold">Notice title
              <input required maxLength={180} value={form.title} onChange={(event) => setForm({ ...form, title: event.currentTarget.value })} className="mt-1 min-h-11 w-full rounded-xl border border-forest-900/15 px-3" />
            </label>
          </div>

          <label className="block text-sm font-semibold">Message
            <textarea required maxLength={1400} rows={4} value={form.message} onChange={(event) => setForm({ ...form, message: event.currentTarget.value })} className="mt-1 w-full rounded-xl border border-forest-900/15 p-3" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">Show from
              <input type="date" value={form.showFrom} onChange={(event) => setForm({ ...form, showFrom: event.currentTarget.value })} className="mt-1 min-h-11 w-full rounded-xl border border-forest-900/15 px-3" />
            </label>
            <label className="text-sm font-semibold">Hide on/after
              <input type="date" value={form.expiresOn} onChange={(event) => setForm({ ...form, expiresOn: event.currentTarget.value })} className="mt-1 min-h-11 w-full rounded-xl border border-forest-900/15 px-3" />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">Official source label
              <input maxLength={180} value={form.sourceLabel} onChange={(event) => setForm({ ...form, sourceLabel: event.currentTarget.value })} className="mt-1 min-h-11 w-full rounded-xl border border-forest-900/15 px-3" />
            </label>
            <label className="text-sm font-semibold">Official source link
              <input type="url" maxLength={500} value={form.sourceUrl} onChange={(event) => setForm({ ...form, sourceUrl: event.currentTarget.value })} className="mt-1 min-h-11 w-full rounded-xl border border-forest-900/15 px-3" />
            </label>
          </div>

          <label className="flex items-start gap-3 rounded-xl bg-cream p-3 text-sm leading-relaxed">
            <input type="checkbox" checked={form.sourceVerified} onChange={(event) => setForm({ ...form, sourceVerified: event.currentTarget.checked })} className="mt-1 size-4 shrink-0" />
            <span>I checked this notice against the linked official source. Publishing is blocked until this is checked and the source/date fields are valid.</span>
          </label>

          {form.title && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
              <p className="font-bold text-amber-900">Public notice preview</p>
              <p className="mt-2 font-extrabold text-forest-900">{form.title}</p>
              <p className="mt-1 leading-relaxed text-forest-900/75">{form.message}</p>
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" disabled={busy} onClick={() => void saveNotice('draft')} className="min-h-11 rounded-xl border border-forest-900/15 bg-white px-4 py-2 text-sm font-bold disabled:opacity-60">Save draft</button>
            <button type="button" disabled={busy} onClick={() => void saveNotice('published')} className="min-h-11 rounded-xl bg-coral-500 px-4 py-2 text-sm font-bold text-white hover:bg-coral-600 disabled:opacity-60">{busy ? 'Saving…' : 'Save & publish'}</button>
          </div>
        </form>
      )}

      <div className="mb-10 space-y-3">
        {notices.map((notice) => (
          <article key={notice.id} className="rounded-2xl bg-white p-4 ring-1 ring-forest-900/10 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-coral-600">{notice.countrySlug === 'all' ? 'All destinations' : notice.countrySlug.replace('-', ' ')}</p>
                <h4 className="mt-1 text-lg font-extrabold">{notice.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-forest-900/70">{notice.message}</p>
              </div>
              <span className={`inline-flex min-h-8 shrink-0 items-center rounded-full px-3 py-1 text-xs font-bold ${notice.status === 'published' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>{notice.status === 'published' ? 'Published' : 'Draft'}</span>
            </div>
            <p className="mt-3 text-xs font-semibold text-forest-900/65">Visible {notice.showFrom || 'after scheduling'} · hides on/after {notice.expiresOn || 'expiry date'}{notice.guidanceUpdatedAt ? ' · website guidance marked updated' : ''}</p>
            {notice.sourceUrl && <a href={notice.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-10 items-center text-sm font-bold text-coral-600 underline underline-offset-2">{notice.sourceLabel || 'Open official source'} ↗</a>}
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => editNotice(notice)} className="min-h-10 rounded-lg border border-forest-900/15 px-3 text-sm font-bold hover:bg-forest-50">Edit</button>
              {notice.status === 'published' && <button type="button" onClick={() => void savePolicyNotice({ data: { ...notice, status: 'draft', sourceVerified: false } }).then(() => reload()).catch((cause) => setError(cause instanceof Error ? cause.message : 'Could not unpublish notice.'))} className="min-h-10 rounded-lg border border-forest-900/15 px-3 text-sm font-bold hover:bg-forest-50">Unpublish</button>}
              <button type="button" onClick={() => void removeNotice(notice)} disabled={busy} className="min-h-10 rounded-lg px-3 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-60">Delete</button>
            </div>
          </article>
        ))}
        {!notices.length && <p className="rounded-xl bg-white p-5 text-sm text-forest-900/65">No notices yet. Create one as a draft and publish it after verifying its source.</p>}
      </div>

      <h3 className="mb-3 text-xl font-extrabold">Official sources and website review</h3>
      <div className="space-y-3">
        {(data?.items ?? []).map((item) => {
          const review = data?.reviews[item.id] ?? {}
          const status = getPolicyWatchStatus(item)
          return (
            <article key={item.id} className="rounded-2xl bg-white p-4 ring-1 ring-forest-900/10 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-coral-600">{item.destination}</p>
                  <h4 className="mt-1 text-lg font-extrabold text-forest-900">{item.title}</h4>
                </div>
                <span className="inline-flex min-h-8 shrink-0 items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{review.sourceChangePending ? 'Source changed · review needed' : review.guidanceUpdatedAt ? 'Website guidance updated' : review.checkedAt ? 'Source checked' : status}</span>
              </div>
              {item.effectiveDate && <p className="mt-2 text-xs font-semibold text-forest-900/65">Effective: {displayDate(item.effectiveDate)} · source scan: {displayDate(review.sourceCheckedAt)}</p>}
              <p className="mt-3 text-sm leading-relaxed text-forest-900/75">{item.summary}</p>
              <p className="mt-2 rounded-xl bg-cream p-3 text-sm leading-relaxed text-forest-900/75"><strong>Review action:</strong> {item.action}</p>
              <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-10 items-center text-sm font-bold text-coral-600 underline underline-offset-2">{item.sourceLabel} ↗</a>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" disabled={busy} onClick={() => void markReview(item, 'checked')} className="min-h-10 rounded-lg border border-forest-900/15 px-3 text-sm font-bold hover:bg-forest-50 disabled:opacity-60">Mark source checked</button>
                <button type="button" disabled={busy || !review.checkedAt} onClick={() => void markReview(item, 'guidance-updated')} className="min-h-10 rounded-lg bg-forest-900 px-3 text-sm font-bold text-white hover:bg-forest-800 disabled:opacity-40">Mark website updated</button>
              </div>
              {review.guidanceUpdatedAt && <p className="mt-2 text-xs text-forest-900/60">Updated {displayDate(review.guidanceUpdatedAt)}{review.guidanceUpdatedBy ? ` by ${review.guidanceUpdatedBy}` : ''}</p>}
            </article>
          )
        })}
      </div>
    </section>
  )
}
