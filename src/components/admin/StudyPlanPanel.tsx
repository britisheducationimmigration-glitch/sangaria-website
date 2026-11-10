import { useEffect, useMemo, useState } from 'react'
import { getAdminCountryPages, saveCountryPage } from '@/lib/admin-functions'
import type { StudyPlan, StudyPlanChecklistItem, StudyPlanTimelineStep } from '@/data/fixtures'
import type { CountryPageContent } from '@/lib/country-catalog.server'

type PanelData = {
  countries: CountryPageContent[]
  drafts: CountryPageContent[]
  customSlugs: string[]
  overrideSlugs: string[]
}

type Props = {
  onDirtyChange?: (dirty: boolean) => void
}

const categories = ['Admission', 'Identity', 'Education', 'Funds', 'Application', 'Additional checks', 'After submission']
const statuses: StudyPlanChecklistItem['status'][] = ['Required', 'Usually required', 'Recommended', 'If applicable', 'After submission']
const blankPlan = (): StudyPlan => ({ lastVerified: '', summary: '', checklist: [], timeline: [], sources: [] })

function PlanField({ label, value, onChange, hint, required, multiline = false }: {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  required?: boolean
  multiline?: boolean
}) {
  return (
    <label className="block min-w-0 text-sm font-semibold text-forest-900">
      {label}{required ? ' *' : ''}
      {multiline ? (
        <textarea required={required} rows={2} value={value} onChange={(event) => onChange(event.currentTarget.value)} className="mt-1 block min-h-11 w-full min-w-0 rounded-xl border border-forest-900/15 bg-white p-3 font-normal leading-relaxed" />
      ) : (
        <input required={required} value={value} onChange={(event) => onChange(event.currentTarget.value)} className="mt-1 block min-h-11 w-full min-w-0 rounded-xl border border-forest-900/15 bg-white px-3 font-normal" />
      )}
      {hint && <span className="mt-1 block text-xs font-normal leading-relaxed text-forest-900/60">{hint}</span>}
    </label>
  )
}

function DocumentCards({ items, onChange }: {
  items: StudyPlanChecklistItem[]
  onChange: (items: StudyPlanChecklistItem[]) => void
}) {
  function update(index: number, patch: Partial<StudyPlanChecklistItem>) {
    onChange(items.map((item, i) => i === index ? { ...item, ...patch } : item))
  }
  return (
    <section className="rounded-2xl border border-forest-900/10 bg-forest-50/50 p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div><h3 className="font-bold">Documents <span className="text-xs font-normal text-forest-900/60">({items.length})</span></h3><p className="mt-1 text-xs text-forest-900/60">Use the approved country checklist. One document per card.</p></div>
        <button type="button" onClick={() => onChange([...items, { id: 'study-item-' + Date.now(), category: 'Admission', title: '', detail: '', status: 'Usually required' }])} className="min-h-10 rounded-lg border border-forest-900/15 bg-white px-3 text-sm font-bold">+ Add document</button>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item, index) => (
          <details key={item.id} className="rounded-xl border border-forest-900/10 bg-white">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 truncate text-sm font-bold">{index + 1}. {item.title || 'New document'}</span>
              <span className="shrink-0 rounded-full bg-forest-50 px-2 py-1 text-[10px] font-bold text-forest-700">{item.status}</span>
            </summary>
            <div className="grid gap-3 border-t border-forest-900/10 p-3">
              <PlanField label="Document name" value={item.title} required hint="Example: Parents’ ITRs — past 2 years" onChange={(title) => update(index, { title })} />
              <PlanField label="What should the student collect?" value={item.detail} required multiline hint="Short note naming the records, who provides them and any date range." onChange={(detail) => update(index, { detail })} />
              <details className="rounded-lg bg-forest-50/70 px-3 py-2">
                <summary className="cursor-pointer text-xs font-bold text-forest-800">Optional display settings</summary>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm font-semibold">Group
                    <select value={item.category} onChange={(event) => update(index, { category: event.currentTarget.value })} className="mt-1 block min-h-11 w-full rounded-xl border border-forest-900/15 bg-white px-3 font-normal">
                      {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                      {!categories.includes(item.category) && <option value={item.category}>{item.category}</option>}
                    </select>
                  </label>
                  <label className="block text-sm font-semibold">Requirement type
                    <select value={item.status} onChange={(event) => update(index, { status: event.currentTarget.value as StudyPlanChecklistItem['status'] })} className="mt-1 block min-h-11 w-full rounded-xl border border-forest-900/15 bg-white px-3 font-normal">
                      {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </label>
                </div>
              </details>
              <div className="flex justify-end"><button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))} className="min-h-10 rounded-lg px-3 text-sm font-bold text-red-700 hover:bg-red-50">Remove</button></div>
            </div>
          </details>
        ))}
        {!items.length && <p className="rounded-xl border border-dashed border-forest-900/20 bg-white p-4 text-sm text-forest-900/60">No documents yet. Add approved items before publishing.</p>}
      </div>
    </section>
  )
}

function TimelineCards({ items, onChange }: {
  items: StudyPlanTimelineStep[]
  onChange: (items: StudyPlanTimelineStep[]) => void
}) {
  function update(index: number, patch: Partial<StudyPlanTimelineStep>) {
    onChange(items.map((item, i) => {
      if (i !== index) return item
      const weeksFromStart = patch.weeksFromStart ?? item.weeksFromStart
      return { ...item, ...patch, weeksFromStart, weeks: 'Week ' + (weeksFromStart + 1) }
    }))
  }
  return (
    <section className="rounded-2xl border border-forest-900/10 bg-forest-50/50 p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div><h3 className="font-bold">Preparation steps <span className="text-xs font-normal text-forest-900/60">({items.length})</span></h3><p className="mt-1 text-xs text-forest-900/60">Set when a task starts. Tasks can overlap.</p></div>
        <button type="button" onClick={() => {
          const weeksFromStart = Math.min(9, items.length * 2)
          onChange([...items, { weeks: 'Week ' + (weeksFromStart + 1), weeksFromStart, title: '', detail: '' }])
        }} className="min-h-10 rounded-lg border border-forest-900/15 bg-white px-3 text-sm font-bold">+ Add step</button>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item, index) => (
          <details key={index} className="rounded-xl border border-forest-900/10 bg-white">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 px-3 py-2 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 truncate text-sm font-bold">{item.weeks}: {item.title || 'New step'}</span>
            </summary>
            <div className="grid gap-3 border-t border-forest-900/10 p-3">
              <label className="block text-sm font-semibold">Start around
                <select value={item.weeksFromStart} onChange={(event) => update(index, { weeksFromStart: Number(event.currentTarget.value) })} className="mt-1 block min-h-11 w-full rounded-xl border border-forest-900/15 bg-white px-3 font-normal">
                  {Array.from({ length: 10 }, (_, week) => <option key={week} value={week}>{week === 0 ? 'This week' : 'In ' + week + (week === 1 ? ' week' : ' weeks')}</option>)}
                </select>
              </label>
              <PlanField label="Step name" value={item.title} required hint="Example: Apply to colleges" onChange={(title) => update(index, { title })} />
              <PlanField label="What should the student do?" value={item.detail} required multiline hint="Use a short action note. Mention work that can happen together." onChange={(detail) => update(index, { detail })} />
              <div className="flex justify-end"><button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))} className="min-h-10 rounded-lg px-3 text-sm font-bold text-red-700 hover:bg-red-50">Remove</button></div>
            </div>
          </details>
        ))}
        {!items.length && <p className="rounded-xl border border-dashed border-forest-900/20 bg-white p-4 text-sm text-forest-900/60">No steps yet. Add the main tasks from admission to application submission.</p>}
      </div>
    </section>
  )
}

function SourceCards({ items, onChange }: {
  items: { label: string; url: string }[]
  onChange: (items: { label: string; url: string }[]) => void
}) {
  return (
    <section className="rounded-2xl border border-forest-900/10 bg-forest-50/50 p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div><h3 className="font-bold">Official links <span className="text-xs font-normal text-forest-900/60">({items.length})</span></h3><p className="mt-1 text-xs text-forest-900/60">Add the sources the reviewer checked.</p></div>
        <button type="button" onClick={() => onChange([...items, { label: '', url: '' }])} className="min-h-10 rounded-lg border border-forest-900/15 bg-white px-3 text-sm font-bold">+ Add link</button>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item, index) => (
          <details key={index} className="rounded-xl border border-forest-900/10 bg-white">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 truncate text-sm font-bold">{item.label || 'New official link'}</span>
              <span className="shrink-0 text-xs text-forest-900/60">Edit</span>
            </summary>
            <div className="grid gap-3 border-t border-forest-900/10 p-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)_auto] sm:items-end">
              <PlanField label="Page name" value={item.label} required onChange={(label) => onChange(items.map((source, i) => i === index ? { ...source, label } : source))} />
              <PlanField label="Official link" value={item.url} required hint="Paste the full government or school URL." onChange={(url) => onChange(items.map((source, i) => i === index ? { ...source, url } : source))} />
              <button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))} className="min-h-10 rounded-lg px-3 text-sm font-bold text-red-700 hover:bg-red-50">Remove</button>
            </div>
          </details>
        ))}
        {!items.length && <p className="rounded-xl border border-dashed border-forest-900/20 bg-white p-4 text-sm text-forest-900/60">Add at least one official link before publishing.</p>}
      </div>
    </section>
  )
}

function withoutStudyPlan(entry: CountryPageContent) {
  const country = { ...entry.country }
  delete country.studyPlan
  return JSON.stringify({ country, guidance: entry.guidance })
}

export function StudyPlanPanel({ onDirtyChange }: Props) {
  const [data, setData] = useState<PanelData | null>(null)
  const [selectedSlug, setSelectedSlug] = useState('')
  const [content, setContent] = useState<CountryPageContent | null>(null)
  const [busy, setBusy] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const countryBySlug = useMemo(() => new Map((data?.countries ?? []).map((item) => [item.country.slug, item] as const)), [data?.countries])
  const draftBySlug = useMemo(() => new Map((data?.drafts ?? []).map((item) => [item.country.slug, item] as const)), [data?.drafts])
  const options = useMemo(() => {
    const rows = new Map<string, CountryPageContent>()
    for (const item of data?.countries ?? []) rows.set(item.country.slug, item)
    for (const item of data?.drafts ?? []) if (!rows.has(item.country.slug)) rows.set(item.country.slug, item)
    return Array.from(rows.values()).sort((a, b) => a.country.name.localeCompare(b.country.name))
  }, [data?.countries, data?.drafts])

  async function reload(preferredSlug = selectedSlug) {
    setLoading(true)
    setError('')
    try {
      const next = await getAdminCountryPages()
      setData(next)
      const slug = preferredSlug || next.countries[0]?.country.slug || next.drafts[0]?.country.slug || ''
      const selected = next.drafts.find((item) => item.country.slug === slug) ?? next.countries.find((item) => item.country.slug === slug) ?? null
      setSelectedSlug(selected?.country.slug ?? '')
      setContent(selected)
      setDirty(false)
      onDirtyChange?.(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load study plans.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void reload('') }, [])

  function markDirty() {
    setDirty(true)
    onDirtyChange?.(true)
    setMessage('')
  }

  function chooseCountry(slug: string) {
    if (dirty && !window.confirm('You have unsaved Study Plan changes. Discard them and switch countries?')) return
    const selected = draftBySlug.get(slug) ?? countryBySlug.get(slug) ?? null
    setSelectedSlug(slug)
    setContent(selected)
    setDirty(false)
    onDirtyChange?.(false)
    setMessage('')
    setError('')
  }

  function updatePlan(patch: Partial<StudyPlan>) {
    setContent((current) => current ? ({
      ...current,
      country: {
        ...current.country,
        studyPlan: { ...(current.country.studyPlan ?? blankPlan()), ...patch },
      },
    }) : current)
    markDirty()
  }

  function togglePlan(enabled: boolean) {
    setContent((current) => current ? ({
      ...current,
      country: { ...current.country, studyPlan: enabled ? (current.country.studyPlan ?? blankPlan()) : null },
    }) : current)
    markDirty()
  }

  async function save(status: 'draft' | 'published') {
    if (!content) return
    const published = countryBySlug.get(selectedSlug)
    const draft = draftBySlug.get(selectedSlug)
    if (status === 'published' && !published) {
      setError('Publish this destination’s basic page from Countries first. This tab only manages its study plan.')
      return
    }
    if (status === 'published' && draft && published && withoutStudyPlan(draft) !== withoutStudyPlan(published)) {
      setError('This destination has other unpublished changes. Review and publish them in Countries first; this prevents unrelated edits from being published here.')
      return
    }
    setBusy(true)
    setError('')
    setMessage('')
    try {
      await saveCountryPage({ data: { content, status, isNew: !published } })
      setMessage(status === 'published' ? 'Study plan published.' : 'Study plan draft saved. The live page has not changed.')
      await reload(selectedSlug)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save this study plan.')
    } finally {
      setBusy(false)
    }
  }

  function discardChanges() {
    if (!content) return
    if (!window.confirm('Discard your unsaved Study Plan changes?')) return
    const original = draftBySlug.get(selectedSlug) ?? countryBySlug.get(selectedSlug) ?? null
    setContent(original)
    setDirty(false)
    onDirtyChange?.(false)
    setError('')
    setMessage('Changes discarded.')
  }

  const plan = content?.country.studyPlan ?? null
  const published = countryBySlug.get(selectedSlug)
  const draft = draftBySlug.get(selectedSlug)
  const hasOtherDraftChanges = !!(draft && published && withoutStudyPlan(draft) !== withoutStudyPlan(published))
  const canPublish = !!published && !hasOtherDraftChanges

  return (
    <section className="max-w-6xl">
      <div className="mb-5">
        <p className="font-mono text-xs font-bold uppercase tracking-wider text-coral-600">Country content</p>
        <h2 className="mt-1 text-3xl font-extrabold">Study Plans</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-forest-900/65">This tab edits only the checklist, preparation steps and official links. It reads fees, visa guidance, English/admission details and cashflow from their existing Countries and Cashflow Budget records.</p>
      </div>

      <div className="mb-5 rounded-xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
        <strong>Simple process:</strong> a reviewer checks the official country sources and supplies approved notes. Add those notes as short cards here, save a draft for review, then publish when approved. The site does not find new rules automatically.
      </div>

      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</p>}
      {message && <p role="status" className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">{message}</p>}

      {loading ? <div className="rounded-2xl bg-white p-6 text-sm text-forest-900/60">Loading destinations…</div> : !options.length ? (
        <div className="rounded-2xl bg-white p-6 text-sm text-forest-900/70">Add the destination basics in Countries first. It will appear here after its country draft is saved.</div>
      ) : (
        <>
          <div className="mb-5 grid gap-3 rounded-2xl border border-forest-900/10 bg-white p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <label className="block text-sm font-semibold">Destination
              <select value={selectedSlug} onChange={(event) => chooseCountry(event.currentTarget.value)} className="mt-1 block min-h-12 w-full rounded-xl border border-forest-900/15 bg-white px-3 font-normal">
                {options.map((item) => <option key={item.country.slug} value={item.country.slug}>{item.country.flag} {item.country.name}{draftBySlug.has(item.country.slug) ? ' · Draft' : ''}</option>)}
              </select>
            </label>
            <span className="text-xs font-semibold text-forest-900/60">{draft ? 'Editing saved draft' : published ? 'Editing published country data' : 'New destination draft'}</span>
          </div>

          {content && (
            <>
              <div className="mb-5 rounded-2xl bg-white p-4 ring-1 ring-forest-900/10 sm:p-5">
                <label className="inline-flex min-h-11 items-center gap-3 text-sm font-bold">
                  <input type="checkbox" checked={!!plan} onChange={(event) => togglePlan(event.currentTarget.checked)} className="size-4 accent-coral-600" />
                  Show a study plan for {content.country.name}
                </label>
                {!plan && <p className="mt-2 text-xs text-forest-900/60">Turn this on to add a destination-specific study plan.</p>}
              </div>

              {plan && (
                <div className="space-y-5">
                  <div className="grid gap-4 rounded-2xl bg-white p-4 ring-1 ring-forest-900/10 sm:grid-cols-2 sm:p-5">
                    <PlanField label="Short introduction" value={plan.summary} required multiline hint="One or two simple sentences for students." onChange={(summary) => updatePlan({ summary })} />
                    <PlanField label="Last checked against official sources" value={plan.lastVerified} required hint="For example: 10 November 2026" onChange={(lastVerified) => updatePlan({ lastVerified })} />
                  </div>
                  <DocumentCards items={plan.checklist} onChange={(checklist) => updatePlan({ checklist })} />
                  <TimelineCards items={plan.timeline} onChange={(timeline) => updatePlan({ timeline })} />
                  <SourceCards items={plan.sources} onChange={(sources) => updatePlan({ sources })} />

                  {hasOtherDraftChanges && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-950">This country also has unpublished edits to other fields. You can save the study plan draft here; publish the full country page from Countries after reviewing those edits.</p>}
                  {!published && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-950">Publish the destination basics from Countries first. This tab does not create or publish country pages.</p>}

                  <div className="flex flex-col-reverse gap-2 rounded-2xl bg-white p-4 sm:flex-row sm:justify-end">
                    <button type="button" disabled={!dirty || busy} onClick={discardChanges} className="min-h-11 rounded-xl border border-forest-900/15 px-4 text-sm font-bold disabled:opacity-50">Discard changes</button>
                    <button type="button" disabled={!dirty || busy} onClick={() => void save('draft')} className="min-h-11 rounded-xl border border-forest-900/15 px-4 text-sm font-bold disabled:opacity-50">{busy ? 'Saving…' : 'Save draft'}</button>
                    <button type="button" disabled={!dirty || busy || !canPublish} onClick={() => void save('published')} className="min-h-11 rounded-xl bg-coral-500 px-5 text-sm font-bold text-white disabled:opacity-50">{busy ? 'Saving…' : 'Publish study plan'}</button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  )
}
