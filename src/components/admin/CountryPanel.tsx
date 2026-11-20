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
  studyPlan: Country['studyPlan']
  guideTuition: string
  guideVisaFee: string
  guideFunds: string
  guideAdmission: string
  guideWork: string
  guidePostStudy: string
  guideIntakes: string
  guideVerified: string
  guideSources: string
  visaVerified: string
  visaFees: string
  visaFeeSummary: string
  visaRequirements: string
  visaCaveat: string
  visaSources: string
}

function emptyEditor(): Editor {
  return {
    originalSlug: '',
    slug: '',
    name: '',
    code: '',
    flag: '',
    headline: '',
    intro: '',
    stats: '',
    intakes: '',
    visas: '',
    highlights: '',
    costs: '',
    english: '',
    studyPlan: undefined,
    guideTuition: '',
    guideVisaFee: '',
    guideFunds: '',
    guideAdmission: '',
    guideWork: '',
    guidePostStudy: '',
    guideIntakes: '',
    guideVerified: '',
    guideSources: '',
    visaVerified: '',
    visaFees: '',
    visaFeeSummary: '',
    visaRequirements: '',
    visaCaveat: '',
    visaSources: '',
  }
}

function fromContent(content: CountryPageContent): Editor {
  const { country, guidance } = content
  return {
    originalSlug: country.slug,
    slug: country.slug,
    name: country.name,
    code: country.code,
    flag: country.flag,
    headline: country.headline,
    intro: country.intro,
    stats: (country.stats ?? []).map((row) => `${row.label} | ${row.value}`).join('\n'),
    intakes: (country.intakes ?? []).join('\n'),
    visas: (country.visas ?? []).join('\n'),
    highlights: (country.highlights ?? []).join('\n'),
    costs: (country.costs ?? []).map((row) => `${row.label} | ${row.value}`).join('\n'),
    english: country.english,
    studyPlan: country.studyPlan,
    guideTuition: country.studyGuide?.annualTuition ?? '',
    guideVisaFee: country.studyGuide?.visaFee ?? '',
    guideFunds: country.studyGuide?.livingCost ?? '',
    guideAdmission: country.studyGuide?.admissionRoute ?? '',
    guideWork: country.studyGuide?.workWhileStudying ?? '',
    guidePostStudy: country.studyGuide?.postStudyOption ?? '',
    guideIntakes: country.studyGuide?.intakesNote ?? '',
    guideVerified: country.studyGuide?.lastVerified ?? '',
    guideSources: (country.studyGuide?.sources ?? []).map((row) => `${row.label} | ${row.url}`).join('\n'),
    visaVerified: guidance.lastVerified ?? '',
    visaFees: (guidance.feeRows ?? []).map((row) => `${row.label} | ${row.value}`).join('\n'),
    visaFeeSummary: guidance.feeSummary ?? '',
    visaRequirements: (guidance.requirements ?? []).join('\n'),
    visaCaveat: guidance.caveat ?? '',
    visaSources: (guidance.sources ?? []).map((row) => `${row.label} | ${row.url}`).join('\n'),
  }
}

function parsePairs(text: string) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split('|')
      return { label: label.trim(), value: rest.join('|').trim() }
    })
    .filter((row) => row.label && row.value)
}

function parseSources(text: string) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split('|')
      return { label: label.trim(), url: rest.join('|').trim() }
    })
    .filter((row) => row.label && row.url)
}

function textLines(text: string) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function toContent(editor: Editor): CountryPageContent {
  const studyGuide = !editor.guideTuition && !editor.guideVisaFee && !editor.guideFunds
    ? undefined
    : {
        annualTuition: editor.guideTuition,
        visaFee: editor.guideVisaFee,
        livingCost: editor.guideFunds,
        admissionRoute: editor.guideAdmission,
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
    studyPlan: editor.studyPlan,
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
    <label className="block min-w-0 space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#1D2939]">{label}{required ? ' *' : ''}</span>
        {hint && <span className="text-[11px] text-[#667085] truncate max-w-[200px]" title={hint}>{hint}</span>}
      </div>
      {textarea ? (
        <textarea required={required} rows={rows} value={value} onChange={(event) => onChange(event.currentTarget.value)} className="field text-xs leading-relaxed" />
      ) : (
        <input required={required} disabled={disabled} value={value} onChange={(event) => onChange(event.currentTarget.value)} className="field text-xs" />
      )}
    </label>
  )
}

const countryPresets = [
  { name: 'Canada', code: 'CA', flag: '🇨🇦', slug: 'canada' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', slug: 'uk' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺', slug: 'australia' },
  { name: 'United States', code: 'US', flag: '🇺🇸', slug: 'usa' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪', slug: 'germany' },
  { name: 'New Zealand', code: 'NZ', flag: '🇳🇿', slug: 'new-zealand' },
  { name: 'Ireland', code: 'IE', flag: '🇮🇪', slug: 'ireland' },
  { name: 'France', code: 'FR', flag: '🇫🇷', slug: 'france' },
]

export function CountryPanel() {
  const [editorTab, setEditorTab] = useState<'overview' | 'study' | 'visa'>('overview')
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
    setEditorTab('overview')
  }

  function newCountry() {
    setForm(emptyEditor())
    setError('')
    setMessage('')
    setEditorTab('overview')
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
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#465FFF]">Destination Studio</p>
          </div>
          <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#1D2939]">Country Destination Guides</h2>
          <p className="mt-1 text-xs sm:text-sm text-[#667085]">
            Manage study abroad destination pages, admission requirements, living costs, and official visa guidance.
          </p>
        </div>
        <button
          type="button"
          onClick={newCountry}
          className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#465FFF] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:opacity-95"
        >
          + Add Destination
        </button>
      </div>

      {message && <p role="status" className="rounded-xl bg-emerald-100 px-4 py-3 text-xs font-bold text-emerald-900">{message}</p>}
      {error && <p role="alert" className="rounded-xl bg-red-100 px-4 py-3 text-xs font-bold text-red-900">{error}</p>}

      {form && (
        <form onSubmit={(event) => event.preventDefault()} className="grid min-w-0 gap-6 rounded-3xl border border-[#E4E7EC] bg-white p-5 shadow-xs sm:p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between lg:col-span-2 border-b border-[#E4E7EC] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#465FFF]">Country Studio</p>
              </div>
              <h3 className="mt-0.5 text-xl font-extrabold text-[#1D2939]">{form.name ? 'Edit ' + form.name : 'Add New Destination'}</h3>
              <p className="mt-1 text-xs text-[#667085]">Drafts are private. Publishing updates the public country directory and comparison guide.</p>
            </div>
            <button type="button" onClick={() => setForm(null)} className="rounded-xl border border-[#E4E7EC] px-3.5 py-2 text-xs font-bold text-[#667085] hover:bg-[#F9FAFB]">
              ✕ Close editor
            </button>
          </div>

          {/* Left Column: 3 Organized Form Tabs */}
          <div className="min-w-0 space-y-5 lg:col-start-1">
            {/* Quick Country Presets Bar */}
            <div className="rounded-2xl border border-[#D0E1FD] bg-[#F4F8FF] p-3">
              <span className="text-[11px] font-bold text-[#465FFF] block mb-1.5">⚡ 1-Click Country &amp; Flag Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {countryPresets.map((p) => (
                  <button
                    key={p.code}
                    type="button"
                    onClick={() => update({ name: p.name, code: p.code, flag: p.flag, slug: form.originalSlug ? form.slug : p.slug })}
                    className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-xs font-semibold text-[#1D2939] border border-[#D0E1FD] hover:border-[#465FFF] hover:bg-white shadow-2xs"
                  >
                    <span>{p.flag}</span>
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Segmented Form Tabs */}
            <div className="flex rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setEditorTab('overview')}
                className={'flex-1 rounded-lg py-2 transition ' + (editorTab === 'overview' ? 'bg-white text-[#465FFF] shadow-2xs font-bold' : 'text-[#667085] hover:text-[#1D2939]')}
              >
                1. Overview &amp; Hero
              </button>
              <button
                type="button"
                onClick={() => setEditorTab('study')}
                className={'flex-1 rounded-lg py-2 transition ' + (editorTab === 'study' ? 'bg-white text-[#465FFF] shadow-2xs font-bold' : 'text-[#667085] hover:text-[#1D2939]')}
              >
                2. Study &amp; Living Costs
              </button>
              <button
                type="button"
                onClick={() => setEditorTab('visa')}
                className={'flex-1 rounded-lg py-2 transition ' + (editorTab === 'visa' ? 'bg-white text-[#465FFF] shadow-2xs font-bold' : 'text-[#667085] hover:text-[#1D2939]')}
              >
                3. Visa &amp; Embassy Rules
              </button>
            </div>

            {/* Tab 1: Overview */}
            {editorTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Destination name" value={form.name} required onChange={(value) => update({ name: value })} />
                  <Field label="URL slug" value={form.slug} required disabled={!!form.originalSlug} hint="e.g. canada" onChange={(value) => update({ slug: value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} />
                  <Field label="ISO Country Code" value={form.code} required hint="e.g. CA, GB" onChange={(value) => update({ code: value.toUpperCase().slice(0, 2) })} />
                  <Field label="Flag Emoji" value={form.flag} required hint="e.g. 🇨🇦 (use preset above)" onChange={(value) => update({ flag: value.slice(0, 8) })} />
                </div>
                <Field label="Page Headline" value={form.headline} required hint="Catchy title shown in hero" onChange={(value) => update({ headline: value })} />
                <Field label="English / Admission Target" value={form.english} required textarea rows={2} hint="e.g. IELTS 6.0 / PTE 58 overall" onChange={(value) => update({ english: value })} />
                <Field label="Introduction" value={form.intro} required textarea rows={3} hint="Overview paragraph shown below headline" onChange={(value) => update({ intro: value })} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Quick Stats" value={form.stats} textarea rows={3} hint="Label | Value per line" onChange={(value) => update({ stats: value })} />
                  <Field label="Common Intakes" value={form.intakes} textarea rows={3} hint="One intake per line" onChange={(value) => update({ intakes: value })} />
                </div>
              </div>
            )}

            {/* Tab 2: Study Guide & Comparison */}
            {editorTab === 'study' && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Annual Tuition Estimate" value={form.guideTuition} textarea rows={2} hint="e.g. CAD 15,000 – 25,000 / year" onChange={(value) => update({ guideTuition: value })} />
                  <Field label="Living Funds / GIC" value={form.guideFunds} textarea rows={2} hint="e.g. CAD 20,635 minimum GIC" onChange={(value) => update({ guideFunds: value })} />
                  <Field label="Work Rights While Studying" value={form.guideWork} textarea rows={2} hint="e.g. 20 hours / week off-campus" onChange={(value) => update({ guideWork: value })} />
                  <Field label="Post-Study Work Options (PGWP)" value={form.guidePostStudy} textarea rows={2} hint="e.g. Up to 3 years PGWP" onChange={(value) => update({ guidePostStudy: value })} />
                  <Field label="Admission &amp; English Route" value={form.guideAdmission} textarea rows={2} hint="Acceptable scores &amp; conditional offer" onChange={(value) => update({ guideAdmission: value })} />
                  <Field label="Student Visa Fee" value={form.guideVisaFee} textarea rows={2} hint="Embassy fee summary" onChange={(value) => update({ guideVisaFee: value })} />
                </div>
                <Field label="Destination Highlights" value={form.highlights} textarea rows={3} required hint="One key highlight per line" onChange={(value) => update({ highlights: value })} />
                <Field label="Study Guide Sources" value={form.guideSources} textarea rows={3} hint="Source Name | https://link per line" onChange={(value) => update({ guideSources: value })} />
              </div>
            )}

            {/* Tab 3: Visa Guidance & Embassy */}
            {editorTab === 'visa' && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Visa Last Verified Date" value={form.visaVerified} required hint="e.g. November 2026" onChange={(value) => update({ visaVerified: value })} />
                  <Field label="Visa Types Handled" value={form.visas} textarea rows={2} required hint="One visa subclass per line" onChange={(value) => update({ visas: value })} />
                </div>
                <Field label="Visa Fee Summary" value={form.visaFeeSummary} textarea rows={2} required hint="Embassy fee details &amp; biometrics" onChange={(value) => update({ visaFeeSummary: value })} />
                <Field label="Core Embassy Requirements" value={form.visaRequirements} textarea rows={5} required hint="One requirement per line" onChange={(value) => update({ visaRequirements: value })} />
                <Field label="Important Policy Caveat / Note" value={form.visaCaveat} textarea rows={3} required hint="Crucial warnings for students" onChange={(value) => update({ visaCaveat: value })} />
                <Field label="Official Embassy Sources" value={form.visaSources} textarea rows={3} required hint="Label | https://official-embassy-link per line" onChange={(value) => update({ visaSources: value })} />
              </div>
            )}

            {/* Form Footer Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-[#E4E7EC] pt-4">
              <button
                type="button"
                disabled={busy}
                onClick={() => void save('draft')}
                className="rounded-xl border border-[#E4E7EC] bg-white px-4 py-2.5 text-xs font-semibold text-[#1D2939] hover:bg-[#F9FAFB] disabled:opacity-50"
              >
                Save Private Draft
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void save('published')}
                className="rounded-xl bg-[#465FFF] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:opacity-95 disabled:opacity-50"
              >
                {busy ? 'Saving…' : 'Save &amp; Publish Guide'}
              </button>
            </div>
          </div>

          {/* Right Column: Live Sticky Card Preview */}
          <div className="min-w-0 lg:col-start-2">
            <CountryPagePreview content={toContent(form)} />
          </div>
        </form>
      )}

      {/* Published Countries List */}
      <div className="space-y-3">
        <h3 className="text-lg font-extrabold text-[#1D2939]">Published Destination Guides ({countries.length})</h3>
        <div className="space-y-2.5">
          {countries.map((entry) => {
            const draft = draftsBySlug.get(entry.country.slug)
            const isCustom = data?.customSlugs.includes(entry.country.slug) ?? false
            return (
              <article key={entry.country.slug} className="flex min-w-0 flex-col gap-3 rounded-2xl border border-[#E4E7EC] bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <CountryFlag code={entry.country.code} flag={entry.country.flag} country={entry.country.name} className="h-8 w-12 shrink-0 rounded shadow-xs" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-[#1D2939]">{entry.country.name}</h4>
                    <p className="text-xs text-[#667085]">/countries/{entry.country.slug}{draft ? ' · unpublished changes waiting' : isCustom ? ' · custom added' : ''}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {draft && <button type="button" onClick={() => edit(draft)} className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100">Edit draft</button>}
                  <button type="button" onClick={() => edit(entry)} className="rounded-xl border border-[#E4E7EC] px-3.5 py-1.5 text-xs font-semibold text-[#1D2939] hover:bg-[#F9FAFB]">Edit Guide</button>
                  {isCustom && <button type="button" disabled={busy} onClick={() => void resetCountry(entry.country.slug, entry.country.name)} className="rounded-xl px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50 disabled:opacity-60">Remove</button>}
                  {!isCustom && data?.overrideSlugs.includes(entry.country.slug) && (
                    <button type="button" disabled={busy} onClick={() => void resetCountry(entry.country.slug, entry.country.name)} className="rounded-xl px-3 py-1.5 text-xs font-semibold text-[#667085] hover:bg-gray-100 disabled:opacity-60">Revert to default</button>
                  )}
                </div>
              </article>
            )
          })}
          {!countries.length && <p className="rounded-2xl border border-dashed border-[#E4E7EC] bg-white p-8 text-center text-xs text-[#667085]">No published destination guides yet.</p>}
        </div>
      </div>

      {/* Unpublished Drafts */}
      {drafts.length > 0 && (
        <div className="space-y-3 border-t border-[#E4E7EC] pt-5">
          <h3 className="text-lg font-extrabold text-[#1D2939]">Unpublished Drafts ({drafts.length})</h3>
          <div className="space-y-2.5">
            {drafts.map((draft) => (
              <article key={draft.country.slug} className="flex min-w-0 flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <span className="rounded-md bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-amber-800">Draft</span>
                  <h4 className="mt-1 font-bold text-sm text-[#1D2939]">{draft.country.name}</h4>
                  <p className="text-xs text-[#667085]">/countries/{draft.country.slug}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" onClick={() => edit(draft)} className="rounded-xl border border-amber-300 bg-white px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-50">Edit draft</button>
                  <button type="button" disabled={busy} onClick={() => void saveCountryPage({ data: { content: draft, status: 'published', isNew: !countries.some((entry) => entry.country.slug === draft.country.slug) } }).then(() => { setMessage(draft.country.name + ' page published.'); return reload() }).catch((cause) => setError(cause instanceof Error ? cause.message : 'Could not publish country page.'))} className="rounded-xl bg-[#465FFF] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:opacity-95 disabled:opacity-50">Publish</button>
                  <button type="button" disabled={busy} onClick={() => void discardDraft(draft.country.slug)} className="rounded-xl border border-red-200 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50 disabled:opacity-50">Delete draft</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}