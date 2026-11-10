import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronDown, ClipboardCheck, Download, ExternalLink, Share2, Wallet } from 'lucide-react'
import { CountryFlag } from '@/components/CountryFlag'
import { Eyebrow } from '@/components/Section'
import { getPublicCashflow, getPublicContent, getPublicCountryPage } from '@/lib/public-functions'
import { site } from '@/data/site'
import { createPageSeo } from '@/lib/seo'

export const Route = createFileRoute('/study-plan/$slug')({
  loader: async ({ params }) => {
    const [content, cashflowData, publicContent] = await Promise.all([
      getPublicCountryPage({ data: { slug: params.slug } }),
      getPublicCashflow(),
      getPublicContent(),
    ])
    if (!content?.country.studyPlan) throw notFound()
    return {
      country: content.country,
      guidance: content.guidance,
      cashflow: cashflowData.find((item) => item.slug === params.slug) ?? null,
      settings: publicContent.settings,
    }
  },
  head: ({ loaderData }) => createPageSeo({
    title: `${loaderData.country.name} Study Visa Checklist & Plan | British Education`,
    description: `View ${loaderData.country.name} study visa guidance, a document checklist, suggested intake timeline and family cashflow estimate with official sources.`,
    path: `/study-plan/${loaderData.country.slug}`,
  }),
  component: StudyPlanPage,
})

function localDateInputValue(date = new Date()) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-')
}

function dateFromInput(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return year && month && day ? new Date(year, month - 1, day) : null
}

function timelineDate(startDate: string, weeksFromStart: number) {
  const start = dateFromInput(startDate)
  if (!start) return `Week ${weeksFromStart + 1}`
  start.setDate(start.getDate() + weeksFromStart * 7)
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(start)
}

function intakeMonthLabel(value: string) {
  const date = dateFromInput(value ? value + '-01' : '')
  return date ? new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(date) : ''
}

function recommendedSubmissionDate(intakeMonth: string) {
  const firstDay = dateFromInput(intakeMonth ? intakeMonth + '-01' : '')
  if (!firstDay) return null
  firstDay.setMonth(firstDay.getMonth() - 3)
  return firstDay
}

function PrintContactFooter({ settings }: { settings: { phones: string[]; emails: string[]; officeHours: string } }) {
  const phones = settings.phones.map((phone) => phone.startsWith('+') ? phone : '+91 ' + phone).join(' · ')
  return (
    <footer className="study-plan-print-contact">
      <strong>{site.name}</strong>
      <span>{site.address}</span>
      <span>{phones}{settings.emails.length ? ' · ' + settings.emails.join(' · ') : ''}</span>
      <span>{settings.officeHours}</span>
    </footer>
  )
}

function MobilePlanSection({ title, hint, children, defaultOpen = false }: { title: string; hint: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)')
    const syncViewport = () => setOpen(desktop.matches || defaultOpen)
    syncViewport()
    desktop.addEventListener('change', syncViewport)
    return () => desktop.removeEventListener('change', syncViewport)
  }, [defaultOpen])

  return (
    <details open={open} onToggle={(event) => setOpen(event.currentTarget.open)} className="study-plan-mobile-disclosure mt-10">
      <summary className="study-plan-mobile-summary flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-forest-900/10">
        <span className="min-w-0"><strong className="block text-sm font-extrabold text-forest-900">{title}</strong><small className="mt-1 block text-xs leading-relaxed text-forest-900/60">{hint}</small></span>
        <ChevronDown aria-hidden="true" className="size-5 shrink-0 text-forest-800 transition-transform" />
      </summary>
      <div className="study-plan-mobile-disclosure-content">{children}</div>
    </details>
  )
}

function StudyPlanPage() {
  const { country, guidance, cashflow, settings } = Route.useLoaderData()
  const plan = country.studyPlan!
  const guide = country.studyGuide
  const storageKey = `study-plan-checklist:${country.slug}`
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const [storageReady, setStorageReady] = useState(false)
  const [intakeMonth, setIntakeMonth] = useState('')
  const [planStartDate, setPlanStartDate] = useState('')
  const [notice, setNotice] = useState('')
  const sourceList = useMemo(() => {
    const allSources = [...plan.sources, ...(guide?.sources ?? []), ...guidance.sources]
    return allSources.filter((source, index) => source.label && source.url.startsWith('https://') && allSources.findIndex((item) => item.url === source.url) === index)
  }, [guidance.sources, guide?.sources, plan.sources])
  const totalItems = plan.checklist.length
  const completedCount = checkedItems.length
  const progress = totalItems ? Math.round((completedCount / totalItems) * 100) : 0
  const submissionDue = recommendedSubmissionDate(intakeMonth)
  const lastPrepWeek = plan.timeline.reduce((latest, step) => Math.max(latest, step.weeksFromStart), 0)
  const plannedSubmitDate = dateFromInput(planStartDate)
  if (plannedSubmitDate) plannedSubmitDate.setDate(plannedSubmitDate.getDate() + lastPrepWeek * 7)
  const intakeNeedsEarlierSubmission = !!(submissionDue && plannedSubmitDate && plannedSubmitDate > submissionDue)

  useEffect(() => {
    setPlanStartDate(localDateInputValue())
  }, [])

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey)
      if (saved) {
        const parsed: unknown = JSON.parse(saved)
        if (Array.isArray(parsed)) setCheckedItems(parsed.filter((item): item is string => typeof item === 'string' && plan.checklist.some((entry) => entry.id === item)))
      }
    } catch {
      // The planner remains usable if browser storage is unavailable.
    } finally {
      setStorageReady(true)
    }
  }, [storageKey])

  useEffect(() => {
    if (!storageReady) return
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(checkedItems))
    } catch {
      // Keep checklist state in memory if storage is disabled or full.
    }
  }, [checkedItems, storageKey, storageReady])

  function toggleItem(id: string) {
    setCheckedItems((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  function downloadPlan() {
    window.print()
  }

  async function sharePlan() {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: `${country.name} Study Visa Plan`, text: `Study visa checklist and planning guide for ${country.name}.`, url })
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
        setNotice('Study plan link copied. You can paste it into WhatsApp or any message.')
      } else {
        window.prompt('Copy this study plan link:', url)
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') setNotice('Could not open the share menu. You can copy the page link from your browser.')
    }
  }

  const checklistGroups = [...new Set(plan.checklist.map((item) => item.category))]

  return (
    <main id="study-plan-document" className="study-plan-document mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pt-10 lg:px-8">
      <div className="print-hidden mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link to="/countries/$slug" params={{ slug: country.slug }} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-forest-700 hover:text-coral-600">
          <ArrowLeft aria-hidden="true" className="size-4" /> Back to {country.name} guide
        </Link>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={downloadPlan} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-forest-900/15 bg-white px-4 py-2 text-sm font-bold text-forest-900 transition hover:bg-forest-50">
            <Download aria-hidden="true" className="size-4" /> Print / save as PDF (2 pages)
          </button>
          <button type="button" onClick={() => void sharePlan()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-forest-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-forest-800">
            <Share2 aria-hidden="true" className="size-4" /> Share plan
          </button>
        </div>
      </div>

      {notice && <p role="status" className="print-hidden mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">{notice}</p>}

      <div className="study-plan-print-only" aria-hidden="true">
        <section className="study-plan-print-page">
          <div className="study-plan-print-watermark" aria-hidden="true"><img src="/img/logo.png" alt="" /></div>
          <header className="study-plan-print-header">
            <p>BRITISH EDUCATION & IMMIGRATION · STUDY PLANNING GUIDE</p>
            <h1>{country.flag} {country.name} study plan</h1>
            <p>{plan.summary}</p>
            <div>Reviewed {plan.lastVerified}{intakeMonth ? ' · Target intake: ' + intakeMonthLabel(intakeMonth) : ''}{planStartDate ? ' · Plan starts: ' + new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(dateFromInput(planStartDate)!) : ''}</div>
          </header>

          <div className="study-plan-print-snapshot">
            <div><strong>Tuition estimate</strong><span>{guide?.tuitionEstimate || 'Confirm with the institution'}</span></div>
            <div><strong>Student visa fee</strong><span>{guide?.studentVisaFee || guidance.feeSummary || 'Check current official fee'}</span></div>
            <div><strong>Proof of funds</strong><span>{guide?.proofOfFunds || 'Use current official financial evidence rules'}</span></div>
            <div><strong>Intakes</strong><span>{country.intakes.join(' · ')}</span></div>
          </div>

          <section className="study-plan-print-section">
            <h2>10-week preparation plan · tasks run in parallel</h2>
            <ol className="study-plan-print-timeline">
              {plan.timeline.map((step, index) => (
                <li key={step.weeksFromStart + '-' + index}>
                  <p><strong>{step.weeks}</strong> · {timelineDate(planStartDate, step.weeksFromStart)}</p>
                  <h3>{step.title}</h3>
                  <span>{step.detail}</span>
                </li>
              ))}
            </ol>
            {intakeNeedsEarlierSubmission && <p className="study-plan-print-alert">The selected intake is close for this 10-week preparation plan. Confirm your exact school start/travel date and current processing times.</p>}
          </section>

          {cashflow && (
            <section className="study-plan-print-section">
              <h2>Family cashflow snapshot · existing planner data</h2>
              <p><strong>Estimated first-year total: {cashflow.totalEstimateINR}</strong> · {cashflow.officialRuleNote}</p>
              <div className="study-plan-print-cashflow">
                {cashflow.stages.map((stage) => <div key={stage.stageNumber}><strong>{stage.stageNumber}. {stage.title}</strong><span>{stage.timeline} · {stage.inrEstimate}</span></div>)}
              </div>
            </section>
          )}

          <p className="study-plan-print-footnote">Dates start from today and move forward only. This 10-week plan prepares a complete file; it does not predict a decision date. IRCC New Delhi recommends applying at least 3 months before planned travel. Other countries and visa offices may publish different local instructions; re-check the official sources listed on page 2.</p>
          <PrintContactFooter settings={settings} />
        </section>

        <section className="study-plan-print-page study-plan-print-page-break">
          <div className="study-plan-print-watermark" aria-hidden="true"><img src="/img/logo.png" alt="" /></div>
          <header className="study-plan-print-page-heading">
            <p>{country.name} · {intakeMonth ? intakeMonthLabel(intakeMonth) + ' intake' : 'study permit'}</p>
            <h2>Documents to prepare</h2>
            <p>Use your current country checklist. Funding documents are options; you do not need every option listed here. “If applicable” items depend on your route.</p>
          </header>
          <div className="study-plan-print-checklist">
            {plan.checklist.map((item) => (
              <article key={item.id}>
                <span className="study-plan-print-checkbox" aria-hidden="true" />
                <div><p><strong>{item.title}</strong> <small>{item.status}</small></p><span>{item.detail}</span></div>
              </article>
            ))}
          </div>

          <div className="study-plan-print-lower">
            <section>
              <h3>Route notes</h3>
              <p><strong>Admission & English:</strong> {guide?.admissionAndEnglish || country.english}</p>
              <p><strong>Work/post-study:</strong> {guide?.workWhileStudying || 'Check current permit conditions.'} {guide?.postStudyOption || 'Post-study eligibility depends on current route rules.'}</p>
              <p><strong>Visa requirements:</strong> {guidance.requirements.join(' · ')}</p>
            </section>
            <section>
              <h3>Official sources to re-check</h3>
              <ul>{plan.sources.map((source) => <li key={source.url}><strong>{source.label}</strong><span>{source.url}</span></li>)}</ul>
            </section>
          </div>
          <p className="study-plan-print-disclaimer">General guidance, not legal advice or an eligibility decision. Document needs vary by applicant, school, province and visa office. No approval is guaranteed. Final decisions are made by the relevant immigration authority.</p>
          <PrintContactFooter settings={settings} />
        </section>
      </div>

      <header className="rounded-[2rem] bg-forest-900 bg-grain p-6 text-white sm:p-9 lg:p-12">
        <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <Link to="/countries" className="print-hidden inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-forest-100/70 hover:text-white"><ArrowLeft aria-hidden="true" className="size-4" /> All destinations</Link>
            <div className="mt-4 flex items-center gap-3"><CountryFlag code={country.code} flag={country.flag} country={country.name} className="h-10 w-14 shrink-0 rounded-lg" /><Eyebrow>Personal planning guide</Eyebrow></div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">Your {country.name} study plan</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-forest-100/80 sm:text-base">{plan.summary}</p>
            <p className="mt-4 text-xs font-semibold text-forest-100/60">Official guidance reviewed {plan.lastVerified}</p>
          </div>
          <div className="print-hidden rounded-2xl border border-white/15 bg-white/5 p-4 sm:max-w-xs">
            <label htmlFor="study-plan-intake" className="flex items-center gap-2 text-sm font-bold"><CalendarDays aria-hidden="true" className="size-4 text-coral-400" /> Target intake month</label>
            <input id="study-plan-intake" type="month" min={planStartDate ? planStartDate.slice(0, 7) : undefined} value={intakeMonth} onChange={(event) => setIntakeMonth(event.currentTarget.value)} className="mt-3 min-h-11 w-full rounded-xl border border-white/20 bg-white px-3 text-sm font-semibold text-forest-900" />
            <p className="mt-2 text-xs leading-relaxed text-forest-100/65">Choose an intake to see suggested calendar months. Dates are planning checkpoints, not visa processing estimates.</p>
          </div>
        </div>
      </header>

      <section aria-label="Study route overview" className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Tuition estimate', guide?.tuitionEstimate || 'Confirm with the institution'],
          ['Student visa fee', guide?.studentVisaFee || guidance.feeSummary || 'Check the official fee page'],
          ['Proof of funds', guide?.proofOfFunds || 'Review current official financial evidence requirements'],
          ['Common intakes', country.intakes.join(' · ')],
        ].map(([label, value]) => <article key={label} className="min-w-0 rounded-2xl bg-white p-4 ring-1 ring-forest-900/10 sm:p-5"><p className="text-xs font-bold uppercase tracking-wider text-forest-900/50">{label}</p><p className="mt-2 break-words text-sm font-semibold leading-relaxed text-forest-900">{value}</p></article>)}
      </section>

      <MobilePlanSection title="Suggested timeline" hint="10-week preparation steps that can run side by side" defaultOpen>
        <section aria-labelledby="timeline-title" className="rounded-[2rem] bg-white p-5 ring-1 ring-forest-900/10 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-coral-600">Plan around your intake</p><h2 id="timeline-title" className="mt-2 text-2xl font-extrabold text-forest-900 sm:text-3xl">Suggested timeline</h2></div>
          {intakeMonth && <p className="rounded-full bg-forest-50 px-3 py-2 text-xs font-bold text-forest-800">Target: {intakeMonthLabel(intakeMonth)}</p>}
        </div>
        <ol className="mt-6 grid gap-3 md:grid-cols-2">
          {plan.timeline.map((step, index) => (
            <li key={`${step.weeksFromStart}-${step.title}`} className="relative min-w-0 rounded-2xl border border-forest-900/10 bg-cream p-4 sm:p-5">
              <div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-forest-900 font-mono text-xs font-bold text-white">{String(index + 1).padStart(2, '0')}</span><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wide text-coral-700">{step.weeks} · {timelineDate(planStartDate, step.weeksFromStart)}</p><h3 className="mt-1 text-base font-extrabold text-forest-900">{step.title}</h3><p className="mt-2 text-sm leading-relaxed text-forest-900/70">{step.detail}</p></div></div>
            </li>
          ))}
        </ol>
        {intakeNeedsEarlierSubmission && (
          <p role="status" className="mt-4 rounded-xl bg-amber-50 p-4 text-xs leading-relaxed text-amber-950">This intake is close for the 10-week plan. The projected submission date may be later than 3 months before the selected intake month. Check the exact school start/travel date and current processing times; consider an earlier start or the next intake.</p>
        )}
      </section>
      </MobilePlanSection>

      <MobilePlanSection title="Document checklist" hint="Country-specific records and your saved progress">
        <section aria-labelledby="checklist-title" className="rounded-[2rem] bg-white p-5 ring-1 ring-forest-900/10 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-coral-600">Save your progress on this device</p><h2 id="checklist-title" className="mt-2 text-2xl font-extrabold text-forest-900 sm:text-3xl">Document checklist</h2></div>
          <div className="min-w-40 rounded-xl bg-forest-50 p-3 sm:w-52"><div className="flex justify-between text-xs font-bold text-forest-800"><span>{completedCount} of {totalItems} ready</span><span>{progress}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-forest-900/10"><div className="h-full rounded-full bg-coral-500 transition-[width]" style={{ width: `${progress}%` }} /></div></div>
        </div>
        <div className="mt-6 space-y-6">
          {checklistGroups.map((category) => (
            <div key={category}>
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-forest-900/55">{category}</h3>
              <ul className="mt-3 grid gap-3 lg:grid-cols-2">
                {plan.checklist.filter((item) => item.category === category).map((item) => {
                  const checked = checkedItems.includes(item.id)
                  return (
                    <li key={item.id} className={`min-w-0 rounded-2xl border p-4 transition-colors ${checked ? 'border-emerald-300 bg-emerald-50/70' : 'border-forest-900/10 bg-white'}`}>
                      <label className="flex cursor-pointer items-start gap-3">
                        <input type="checkbox" checked={checked} onChange={() => toggleItem(item.id)} className="mt-1 size-5 shrink-0 accent-emerald-600" />
                        <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2"><span className={`text-sm font-extrabold ${checked ? 'text-emerald-900' : 'text-forest-900'}`}>{item.title}</span><span className="rounded-full bg-forest-50 px-2 py-1 text-[10px] font-bold text-forest-700">{item.status}</span></span><span className="mt-2 block text-sm leading-relaxed text-forest-900/70">{item.detail}</span></span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs leading-relaxed text-forest-900/55">Your checked items stay in this browser on this device. For funds, choose evidence that matches the real source; GIC, loan and CA summary are not universal requirements. This preparation list does not replace your current application-country checklist.</p>
      </section>
      </MobilePlanSection>

      <MobilePlanSection title="Family cashflow planner" hint="Existing fee stages; optional when no budget record exists">
        <section aria-labelledby="cashflow-title" className="rounded-[2rem] bg-forest-900 bg-aurora p-5 text-white sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-coral-300">Existing cashflow data</p><h2 id="cashflow-title" className="mt-2 flex items-center gap-2 text-2xl font-extrabold sm:text-3xl"><Wallet aria-hidden="true" className="size-6" /> Family cashflow planner</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-forest-100/75">This estimate is loaded from the same country cashflow data used by the website’s existing planner.</p></div>
          {cashflow && <div className="rounded-2xl border border-white/15 bg-white/5 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-coral-300">Estimated first-year planning total</p><p className="mt-1 text-2xl font-black">{cashflow.totalEstimateINR}</p></div>}
        </div>
        {cashflow ? (
          <>
            <p className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-forest-100/80">{cashflow.officialRuleNote}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {cashflow.stages.map((stage) => <article key={stage.stageNumber} className="flex min-w-0 flex-col rounded-2xl border border-white/10 bg-white/10 p-4"><div className="flex items-start justify-between gap-2"><span className="font-mono text-xs font-extrabold text-coral-300">STAGE {String(stage.stageNumber).padStart(2, '0')}</span><span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-semibold text-white/75">{stage.timeline}</span></div><h3 className="mt-3 text-sm font-extrabold leading-snug">{stage.title}</h3><p className="mt-2 flex-1 text-xs leading-relaxed text-forest-100/65">{stage.description}</p><div className="mt-4 border-t border-white/10 pt-3"><p className="font-bold text-coral-200">{stage.inrEstimate}</p><p className="mt-1 text-xs text-white/60">{stage.officialCost}</p><p className="mt-2 text-[11px] leading-relaxed text-emerald-300">{stage.refundableInfo}</p></div></article>)}
            </div>
          </>
        ) : <p className="mt-4 rounded-xl bg-white/10 p-4 text-sm text-forest-100/75">No cashflow estimate is configured for this destination yet. Add its stages in the existing Admin → Cashflow Budget section.</p>}
      </section>
      </MobilePlanSection>

      <MobilePlanSection title="Study route and visa requirements" hint="Admission, funds, work and post-study conditions">
        <section aria-labelledby="route-guidance-title" className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[2rem] bg-white p-5 ring-1 ring-forest-900/10 sm:p-7"><Eyebrow>Study route</Eyebrow><h2 id="route-guidance-title" className="mt-3 text-xl font-extrabold text-forest-900">Admission, English and study conditions</h2><dl className="mt-4 space-y-3">{[
          ['Admission and English', guide?.admissionAndEnglish || country.english],
          ['Work while studying', guide?.workWhileStudying || 'Check the current visa conditions and permitted work rules for your route.'],
          ['Post-study options', guide?.postStudyOption || 'Post-study eligibility depends on the qualification, institution and immigration rules in force.'],
          ['Intake note', guide?.intakesNote || country.intakes.join(' · ')],
        ].map(([label, value]) => <div key={label} className="rounded-xl bg-cream p-3"><dt className="text-xs font-bold uppercase tracking-wide text-forest-900/55">{label}</dt><dd className="mt-1 text-sm leading-relaxed text-forest-900/75">{value}</dd></div>)}</dl></article>
        <article className="rounded-[2rem] bg-white p-5 ring-1 ring-forest-900/10 sm:p-7"><Eyebrow>Visa application</Eyebrow><h2 className="mt-3 text-xl font-extrabold text-forest-900">Core requirements to review</h2><ul className="mt-4 space-y-3">{guidance.requirements.map((item) => <li key={item} className="flex gap-2 text-sm leading-relaxed text-forest-900/75"><Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-coral-600" /><span>{item}</span></li>)}</ul><p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-950">{guidance.caveat}</p></article>
      </section>
      </MobilePlanSection>

      <MobilePlanSection title="Official sources" hint="Official links and application notes">
        <section aria-labelledby="sources-title" className="rounded-[2rem] bg-white p-5 ring-1 ring-forest-900/10 sm:p-8">
        <div className="flex items-center gap-2"><ClipboardCheck aria-hidden="true" className="size-5 text-coral-600" /><h2 id="sources-title" className="text-xl font-extrabold text-forest-900">Official sources</h2></div>
        <p className="mt-2 text-sm text-forest-900/65">Check these sources again before applying. Rules and document requirements can change.</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {sourceList.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 w-full items-center justify-between gap-3 rounded-xl bg-cream px-4 py-3 text-sm font-bold text-forest-800 underline decoration-forest-800/30 underline-offset-4 hover:text-coral-700"><span className="min-w-0">{source.label}</span><ExternalLink aria-hidden="true" className="size-4 shrink-0" /></a></li>)}
        </ul>
        <p className="mt-5 border-t border-forest-900/10 pt-4 text-xs leading-relaxed text-forest-900/55">This is general planning guidance, not legal advice or an eligibility decision. Document needs depend on route, nationality, school, province, application location and personal circumstances. It cannot guarantee a visa approval. Final decisions are made by the relevant government authority.</p>
      </section>
      </MobilePlanSection>

      <div className="print-hidden mt-8 flex flex-col gap-3 rounded-2xl bg-cream p-5 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="font-extrabold text-forest-900">Want help reviewing your plan?</h2><p className="mt-1 text-sm text-forest-900/65">Talk through your course, documents and next steps with our team.</p></div>
        <Link to="/contact" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-coral-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-coral-600">Free counselling <ArrowRight aria-hidden="true" className="size-4" /></Link>
      </div>
    </main>
  )
}

