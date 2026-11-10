import { useEffect, useMemo, useState } from 'react'
import { CountryFlag } from '@/components/CountryFlag'
import { CountryPagePreview } from '@/components/admin/CountryPagePreview'
import type { Country } from '@/data/fixtures'
import type { VisaGuidance } from '@/data/visa-guidance'
import {
  discardCountryPageDraft,
  getAdminCountryPages,
  resetCountryPage,
  saveCountryPage,
} from '@/lib/admin-functions'
import type { CountryPageContent } from '@/lib/country-catalog.server'

type PanelData = {
  countries: CountryPageContent[]
  drafts: CountryPageContent[]
  customSlugs: string[]
  overrideSlugs: string[]
}

type Editor = {
  originalSlug: string
  slug: string
  name: string
  code: string
  flag: string
  headline: string
  intro: string
  stats: string
  intakes: string
  visas: string
  highlights: string
  costs: string
  english: string
  guideTuition: string
  guideVisaFee: string
  guideFunds: string
  guideAdmission: string
  guideWork: string
  guidePostStudy: string
  guideIntakes: string
  guideVerified: string
  guideSources: string
  studyPlanEnabled: boolean
  studyPlanVerified: string
  studyPlanSummary: string
  studyPlanChecklist: string
  studyPlanTimeline: string
  studyPlanSources: string
  visaVerified: string
  visaFees: string
  visaFeeSummary: string
  visaRequirements: string
  visaCaveat: string
  visaSources: string
}

const emptyEditor = (): Editor => ({
  originalSlug: '', slug: '', name: '', code: '', flag: '', headline: '', intro: '', stats: '', intakes: '', visas: '', highlights: '', costs: '', english: '',
  guideTuition: '', guideVisaFee: '', guideFunds: '', guideAdmission: '', guideWork: '', guidePostStudy: '', guideIntakes: '', guideVerified: '', guideSources: '',
  studyPlanEnabled: false, studyPlanVerified: '', studyPlanSummary: '', studyPlanChecklist: '', studyPlanTimeline: '', studyPlanSources: '',
  visaVerified: '', visaFees: '', visaFeeSummary: '', visaRequirements: '', visaCaveat: '', visaSources: '',
})

function textLines(value: string) {
  return value.split('\n').map((line) => line.trim()).filter(Boolean)
}

function parsePairs(value: string) {
  return textLines(value).map((line) => {
    const index = line.indexOf('|')
    return index < 0 ? { label: line, value: '' } : { label: line.slice(0, index).trim(), value: line.slice(index + 1).trim() }
  })
}

function parseSources(value: string) {
  return parsePairs(value).map((item) => ({ label: item.label, url: item.value }))
}

function parseStudyChecklist(value: string) {
  const allowed = ['Required', 'Usually required', 'Recommended', 'If applicable', 'After submission']
  return textLines(value).map((line, index) => {
    const [category = '', title = '', status = 'If applicable', ...detailParts] = line.split('|').map((part) => part.trim())
    const safeStatus = allowed.includes(status) ? status : 'If applicable'
    const id = (category + '-' + title).toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + (index + 1)
    return { id, category, title, status: safeStatus as 'Required' | 'Usually required' | 'Recommended' | 'If applicable' | 'After submission', detail: detailParts.join(' | ') }
  })
}

function parseStudyTimeline(value: string) {
  return textLines(value).map((line) => {
    const [months = '', title = '', ...detailParts] = line.split('|').map((part) => part.trim())
    return { monthsBeforeIntake: Number(months), title, detail: detailParts.join(' | ') }
  })
}

function fromContent(content: CountryPageContent): Editor {
  const country = content.country
  const guide = country.studyGuide
  const plan = country.studyPlan
  const visa = content.guidance
  return {
    originalSlug: country.slug, slug: country.slug, name: country.name, code: country.code, flag: country.flag, headline: country.headline, intro: country.intro,
    stats: country.stats.map((item) => item.label + ' | ' + item.value).join('\n'),
    intakes: country.intakes.join('\n'), visas: country.visas.join('\n'), highlights: country.highlights.join('\n'),
    costs: country.costs.map((item) => item.label + ' | ' + item.value).join('\n'), english: country.english,
    guideTuition: guide?.tuitionEstimate ?? '', guideVisaFee: guide?.studentVisaFee ?? '', guideFunds: guide?.proofOfFunds ?? '',
    guideAdmission: guide?.admissionAndEnglish ?? '', guideWork: guide?.workWhileStudying ?? '', guidePostStudy: guide?.postStudyOption ?? '',
    guideIntakes: guide?.intakesNote ?? '', guideVerified: guide?.lastVerified ?? '',
    guideSources: (guide?.sources ?? []).map((item) => item.label + ' | ' + item.url).join('\n'),
    studyPlanEnabled: !!plan,
    studyPlanVerified: plan?.lastVerified ?? '',
    studyPlanSummary: plan?.summary ?? '',
    studyPlanChecklist: (plan?.checklist ?? []).map((item) => [item.category, item.title, item.status, item.detail].join(' | ')).join('\n'),
    studyPlanTimeline: (plan?.timeline ?? []).map((item) => [item.monthsBeforeIntake, item.title, item.detail].join(' | ')).join('\n'),
    studyPlanSources: (plan?.sources ?? []).map((item) => item.label + ' | ' + item.url).join('\n'),
    visaVerified: visa.lastVerified, visaFees: visa.feeRows.map((item) => item.label + ' | ' + item.value).join('\n'),
    visaFeeSummary: visa.feeSummary, visaRequirements: visa.requirements.join('\n'), visaCaveat: visa.caveat,
    visaSources: visa.sources.map((item) => item.label + ' | ' + item.url).join('\n'),
  }
}

function toContent(editor: Editor): CountryPageContent {
  const studyPlan = editor.studyPlanEnabled
    ? {
        lastVerified: editor.studyPlanVerified.trim(),
        summary: editor.studyPlanSummary.trim(),
        checklist: parseStudyChecklist(editor.studyPlanChecklist),
        timeline: parseStudyTimeline(editor.studyPlanTimeline),
        sources: parseSources(editor.studyPlanSources),
      }
    : editor.originalSlug ? null : undefined
  const studyGuide = editor.slug === 'europe' && !editor.guideTuition.trim() && !editor.guideAdmission.trim()
    ? undefined
    : {
        tuitionEstimate: editor.guideTuition,
        studentVisaFee: editor.guideVisaFee,
        proofOfFunds: editor.guideFunds,
        admissionAndEnglish: editor.guideAdmission,
        workWhileStudying: editor.guideWork,
        postStudyOption: editor.guidePostStudy,
        intakesNote: editor.guideIntakes,
        lastVerified: editor.guideVerified,
        sources: parseSources(editor.guideSources),
      }
  const country: Country = {
    slug: editor.slug.trim().toLowerCase(),
    name: editor.name.trim(),
    code: editor.code.trim().toUpperCase(),
    flag: editor.flag.trim(),
    headline: editor.headline.trim(),
    intro: editor.intro.trim(),
    stats: parsePairs(editor.stats),
    intakes: textLines(editor.intakes),
    visas: textLines(editor.visas),
    highlights: textLines(editor.highlights),
    costs: parsePairs(editor.costs),
    english: editor.english.trim(),
    studyGuide,
    studyPlan,
  }
  const guidance: VisaGuidance = {
    lastVerified: editor.visaVerified.trim(),
    feeRows: parsePairs(editor.visaFees),
    feeSummary: editor.visaFeeSummary.trim(),
    requirements: textLines(editor.visaRequirements),
    caveat: editor.visaCaveat.trim(),
    sources: parseSources(editor.visaSources),
  }
  return { country, guidance }
}

function Field({ label, value, onChange, textarea = false, rows = 3, required = false, disabled = false, hint }: {
  label: string
  value: string
  onChange: (value: string) => void
  textarea?: boolean
  rows?: number
  required?: boolean
  disabled?: boolean
  hint?: string
}) {
  return (
    <label className="block min-w-0 text-sm font-semibold text-forest-900">
      {label}{required ? ' *' : ''}
      {textarea ? (
        <textarea required={required} rows={rows} value={value} onChange={(event) => onChange(event.currentTarget.value)} className="mt-1 block min-h-11 w-full min-w-0 rounded-xl border border-forest-900/15 bg-white p-3 font-normal leading-relaxed" />
      ) : (
        <input required={required} disabled={disabled} value={value} onChange={(event) => onChange(event.currentTarget.value)} className="mt-1 block min-h-11 w-full min-w-0 rounded-xl border border-forest-900/15 bg-white px-3 font-normal" />
      )}
      {hint && <span className="mt-1 block text-xs font-normal leading-relaxed text-forest-900/60">{hint}</span>}
    </label>
  )
}

export function CountryPanel() {
  const [data, setData] = useState<PanelData | null>(null)
  const [form, setForm] = useState<Editor | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function reload() {
    try {
      setError('')
      setData(await getAdminCountryPages())
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load country pages.')
    }
  }

  useEffect(() => { void reload() }, [])

  const draftsBySlug = useMemo(() => new Map<string, CountryPageContent>((data?.drafts ?? []).map((item) => [item.country.slug, item] as const)), [data?.drafts])

  function edit(content: CountryPageContent) {
    setForm(fromContent(content))
    setError('')
    setMessage('')
  }

  function newCountry() {
    setForm(emptyEditor())
    setError('')
    setMessage('')
  }

  function update(patch: Partial<Editor>) {
    setForm((current) => current ? { ...current, ...patch } : current)
  }

  async function save(status: 'draft' | 'published') {
    if (!form) return
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const content = toContent(form)
      await saveCountryPage({ data: { content, status, isNew: !form.originalSlug } })
      setForm(null)
      setMessage(status === 'published' ? content.country.name + ' page published.' : 'Draft saved. Public content has not changed.')
      await reload()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save this country page.')
    } finally {
      setBusy(false)
    }
  }

  async function discardDraft(slug: string) {
    if (!window.confirm('Delete this unpublished country draft?')) return
    setBusy(true)
    setError('')
    try {
      await discardCountryPageDraft({ data: { slug } })
      setMessage('Draft deleted.')
      await reload()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not delete this draft.')
    } finally {
      setBusy(false)
    }
  }

  async function resetCountry(slug: string, name: string) {
    if (!window.confirm('Remove the published override for ' + name + ' and restore the current code-managed page?')) return
    setBusy(true)
    setError('')
    try {
      await resetCountryPage({ data: { slug } })
      setMessage(name + ' restored to the current website version.')
      await reload()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not restore this country page.')
    } finally {
      setBusy(false)
    }
  }

  const countries = data?.countries ?? []
  const drafts = data?.drafts ?? []

  return (
    <section className="max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-coral-600">Destination content</p>
          <h2 className="mt-1 text-3xl font-extrabold">Countries</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-forest-900/65">
            Edit the content fields used by each destination page. Existing page layout, colors and responsive sizing stay in the shared template.
          </p>
        </div>
        <button type="button" onClick={newCountry} className="min-h-11 rounded-xl bg-forest-900 px-4 py-2 text-sm font-bold text-white hover:bg-forest-800">+ Add destination</button>
      </div>

      <div className="mb-5 rounded-2xl border border-forest-900/10 bg-white p-4 text-sm leading-relaxed text-forest-900/75">
        English/admission targets are editable per destination. Where schools set different scores, describe them as indicative and course-dependent rather than a national visa minimum. Use one item per line; paired rows and sources use <strong>Label | Value</strong> or <strong>Label | HTTPS link</strong>. Flag uses an emoji plus the two-letter country code.
      </div>

      {message && <p role="status" className="mb-4 rounded-xl bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-900">{message}</p>}
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-100 px-4 py-3 text-sm font-bold text-red-900">{error}</p>}

      {form && (
        <form onSubmit={(event) => event.preventDefault()} className="mb-8 grid min-w-0 gap-6 rounded-2xl border border-forest-900/15 bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between lg:col-span-2">
            <div>
              <h3 className="text-lg font-extrabold">{form.name ? 'Edit ' + form.name : 'Add a destination'}</h3>
              <p className="mt-1 text-sm text-forest-900/65">Save a private draft first. Publishing updates this preview's country directory and public guide.</p>
            </div>
            <button type="button" onClick={() => setForm(null)} className="min-h-10 rounded-lg border border-forest-900/15 px-3 text-sm font-bold hover:bg-forest-50">Close editor</button>
          </div>

          <div className="order-first lg:order-none lg:col-start-2 lg:row-start-2">
            <CountryPagePreview content={toContent(form)} />
          </div>
          <div className="min-w-0 space-y-6 lg:col-start-1 lg:row-start-2">
            <div>
            <h4 className="mb-3 font-extrabold">Country page</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Destination name" value={form.name} required onChange={(value) => update({ name: value })} />
              <Field label="URL slug" value={form.slug} required disabled={!!form.originalSlug} hint="Lowercase letters and hyphens, for example south-korea. Existing page URLs stay locked to protect links." onChange={(value) => update({ slug: value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} />
              <Field label="Two-letter country code" value={form.code} required hint="ISO code, for example JP." onChange={(value) => update({ code: value.toUpperCase().slice(0, 2) })} />
              <Field label="Flag emoji" value={form.flag} required hint="Use one flag emoji, for example 🇯🇵." onChange={(value) => update({ flag: value.slice(0, 8) })} />
              <Field label="Page headline" value={form.headline} required onChange={(value) => update({ headline: value })} />
              <Field label="English / admission target" value={form.english} required textarea rows={3} hint="State if it is provider-specific; don't present an indicative score as a visa rule." onChange={(value) => update({ english: value })} />
              <div className="sm:col-span-2"><Field label="Introduction" value={form.intro} required textarea rows={4} onChange={(value) => update({ intro: value })} /></div>
              <Field label="Quick stats" value={form.stats} textarea rows={4} hint="One per line: label | value" onChange={(value) => update({ stats: value })} />
              <Field label="Common intakes" value={form.intakes} textarea rows={4} hint="One intake per line" onChange={(value) => update({ intakes: value })} />
              <Field label="Visa types handled" value={form.visas} textarea rows={4} required hint="One per line" onChange={(value) => update({ visas: value })} />
              <Field label="Destination highlights" value={form.highlights} textarea rows={4} required hint="One per line" onChange={(value) => update({ highlights: value })} />
              <Field label="Cost snapshot" value={form.costs} textarea rows={5} required hint="One per line: label | value" onChange={(value) => update({ costs: value })} />
            </div>
          </div>

          <div className="border-t border-forest-900/10 pt-5">
            <h4 className="mb-3 font-extrabold">Study guide for comparison</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tuition estimate" value={form.guideTuition} textarea rows={3} onChange={(value) => update({ guideTuition: value })} />
              <Field label="Student visa fee" value={form.guideVisaFee} textarea rows={3} onChange={(value) => update({ guideVisaFee: value })} />
              <Field label="Proof of funds" value={form.guideFunds} textarea rows={3} onChange={(value) => update({ guideFunds: value })} />
              <Field label="Admission and English route" value={form.guideAdmission} textarea rows={3} onChange={(value) => update({ guideAdmission: value })} />
              <Field label="Work while studying" value={form.guideWork} textarea rows={3} onChange={(value) => update({ guideWork: value })} />
              <Field label="Post-study options" value={form.guidePostStudy} textarea rows={3} onChange={(value) => update({ guidePostStudy: value })} />
              <Field label="Intake note" value={form.guideIntakes} textarea rows={3} onChange={(value) => update({ guideIntakes: value })} />
              <Field label="Study guide last verified" value={form.guideVerified} onChange={(value) => update({ guideVerified: value })} />
              <div className="sm:col-span-2"><Field label="Study guide sources" value={form.guideSources} textarea rows={4} hint="One per line: source label | HTTPS link" onChange={(value) => update({ guideSources: value })} /></div>
            </div>
          </div>

          <div className="border-t border-forest-900/10 pt-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h4 className="font-extrabold">Study plan, document checklist and timeline</h4>
                <p className="mt-1 max-w-2xl text-xs leading-relaxed text-forest-900/60">This creates a country-specific planning page. Cashflow is read from the existing Cashflow Budget data. Publish only after checking every requirement and source for this destination.</p>
              </div>
              <label className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-forest-900/15 px-3 text-sm font-bold">
                <input type="checkbox" checked={form.studyPlanEnabled} onChange={(event) => update({ studyPlanEnabled: event.currentTarget.checked })} className="size-4 accent-coral-600" />
                Enable study plan
              </label>
            </div>
            {form.studyPlanEnabled && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Study plan summary" value={form.studyPlanSummary} required textarea rows={3} onChange={(value) => update({ studyPlanSummary: value })} />
                <Field label="Study plan last verified" value={form.studyPlanVerified} required hint="For example, 10 November 2026" onChange={(value) => update({ studyPlanVerified: value })} />
                <div className="sm:col-span-2"><Field label="Document checklist" value={form.studyPlanChecklist} required textarea rows={12} hint="One item per line: Category | Document title | Status | Explanation. Status: Required, Usually required, Recommended, If applicable, After submission." onChange={(value) => update({ studyPlanChecklist: value })} /></div>
                <div className="sm:col-span-2"><Field label="Intake preparation timeline" value={form.studyPlanTimeline} required textarea rows={8} hint="One item per line: months before intake | checkpoint title | explanation. Months must be from 0 to 36." onChange={(value) => update({ studyPlanTimeline: value })} /></div>
                <div className="sm:col-span-2"><Field label="Official study-plan sources" value={form.studyPlanSources} required textarea rows={5} hint="One per line: source label | HTTPS link. Link to official government or school sources." onChange={(value) => update({ studyPlanSources: value })} /></div>
              </div>
            )}
          </div>

          <div className="border-t border-forest-900/10 pt-5">
            <h4 className="mb-3 font-extrabold">Visa snapshot and requirements</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Visa guidance last verified" value={form.visaVerified} required onChange={(value) => update({ visaVerified: value })} />
              <Field label="Visa fee rows" value={form.visaFees} textarea rows={4} required hint="One per line: label | value" onChange={(value) => update({ visaFees: value })} />
              <Field label="Fee explanation" value={form.visaFeeSummary} textarea rows={4} required onChange={(value) => update({ visaFeeSummary: value })} />
              <Field label="Core requirements" value={form.visaRequirements} textarea rows={7} required hint="One requirement per line" onChange={(value) => update({ visaRequirements: value })} />
              <Field label="Important caveat" value={form.visaCaveat} textarea rows={4} required onChange={(value) => update({ visaCaveat: value })} />
              <Field label="Official sources" value={form.visaSources} textarea rows={5} required hint="One per line: source label | HTTPS link" onChange={(value) => update({ visaSources: value })} />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" disabled={busy} onClick={() => void save('draft')} className="min-h-11 rounded-xl border border-forest-900/15 bg-white px-4 py-2 text-sm font-bold disabled:opacity-60">Save draft</button>
            <button type="button" disabled={busy} onClick={() => void save('published')} className="min-h-11 rounded-xl bg-coral-500 px-4 py-2 text-sm font-bold text-white hover:bg-coral-600 disabled:opacity-60">{busy ? 'Saving…' : 'Save & publish'}</button>
          </div>
          </div>
        </form>
      )}

      <div className="mb-8">
        <h3 className="mb-3 text-xl font-extrabold">Published country pages</h3>
        <div className="space-y-3">
          {countries.map((entry) => {
            const draft = draftsBySlug.get(entry.country.slug)
            const isCustom = data?.customSlugs.includes(entry.country.slug) ?? false
            return (
              <article key={entry.country.slug} className="flex min-w-0 flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-forest-900/10 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="flex min-w-0 items-center gap-3">
                  <CountryFlag code={entry.country.code} flag={entry.country.flag} country={entry.country.name} className="h-8 w-12 shrink-0" />
                  <div className="min-w-0">
                    <h4 className="break-words font-extrabold">{entry.country.name}</h4>
                    <p className="break-all text-xs text-forest-900/60">/countries/{entry.country.slug}{draft ? ' · unpublished changes waiting' : isCustom ? ' · admin-added' : ''}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {draft && <button type="button" onClick={() => edit(draft)} className="min-h-10 rounded-lg border border-amber-300 px-3 text-sm font-bold text-amber-900 hover:bg-amber-50">Edit draft</button>}
                  <button type="button" onClick={() => edit(entry)} className="min-h-10 rounded-lg border border-forest-900/15 px-3 text-sm font-bold hover:bg-forest-50">Edit page</button>
                  {isCustom && <button type="button" disabled={busy} onClick={() => void resetCountry(entry.country.slug, entry.country.name)} className="min-h-10 rounded-lg px-3 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-60">Remove country</button>}
                  {!isCustom && data?.overrideSlugs.includes(entry.country.slug) && (
                    <button type="button" disabled={busy} onClick={() => void resetCountry(entry.country.slug, entry.country.name)} className="min-h-10 rounded-lg px-3 text-sm font-bold text-forest-900/60 hover:bg-forest-50 disabled:opacity-60">Revert to website version</button>
                  )}
                </div>
              </article>
            )
          })}
          {!countries.length && <p className="rounded-xl bg-white p-5 text-sm text-forest-900/65">No published countries yet.</p>}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xl font-extrabold">Unpublished drafts</h3>
        <div className="space-y-3">
          {drafts.map((draft) => (
            <article key={draft.country.slug} className="flex min-w-0 flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-900">Draft</p>
                <h4 className="break-words font-extrabold">{draft.country.name}</h4>
                <p className="break-all text-xs text-forest-900/60">/countries/{draft.country.slug}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => edit(draft)} className="min-h-10 rounded-lg border border-amber-300 px-3 text-sm font-bold text-amber-900 hover:bg-white">Edit draft</button>
                <button type="button" disabled={busy} onClick={() => void saveCountryPage({ data: { content: draft, status: 'published', isNew: !countries.some((entry) => entry.country.slug === draft.country.slug) } }).then(() => { setMessage(draft.country.name + ' page published.'); return reload() }).catch((cause) => setError(cause instanceof Error ? cause.message : 'Could not publish country page.'))} className="min-h-10 rounded-lg bg-forest-900 px-3 text-sm font-bold text-white hover:bg-forest-800 disabled:opacity-60">Publish draft</button>
                <button type="button" disabled={busy} onClick={() => void discardDraft(draft.country.slug)} className="min-h-10 rounded-lg border border-red-300 px-3 text-sm font-bold text-red-700 hover:bg-white disabled:opacity-60">Delete draft</button>
              </div>
            </article>
          ))}
          {!drafts.length && <p className="rounded-xl bg-white p-5 text-sm text-forest-900/65">No drafts yet.</p>}
        </div>
      </div>
    </section>
  )
}
