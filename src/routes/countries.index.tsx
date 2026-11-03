import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { PageHero } from '@/components/Section'
import { CountryFlag } from '@/components/CountryFlag'
import { getPublicCountryCatalogue } from '@/lib/public-functions'

import { createPageSeo } from '@/lib/seo'

export const Route = createFileRoute('/countries/')({
  loader: async () => ({ countryPages: await getPublicCountryCatalogue() }),
  head: () => createPageSeo({
    title: 'Study Destinations & Visa Fees | British Education Sangaria',
    description: 'Compare study destinations, visa guidance, tuition ranges, living funds and intakes for international students.',
    path: '/countries',
  }),
  component: CountriesPage,
})

function CountriesPage() {
  const { countryPages } = Route.useLoaderData()
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [compareNotice, setCompareNotice] = useState('')
  const currentCountries = countryPages.map((entry) => entry.country)
  const studyDestinations = currentCountries.filter((country) => country.studyGuide)
  const selectedCountries = studyDestinations.filter((country) => selectedSlugs.includes(country.slug))

  function toggleCompare(slug: string, name: string) {
    if (selectedSlugs.includes(slug)) {
      const next = selectedSlugs.filter((item) => item !== slug)
      setSelectedSlugs(next)
      setCompareNotice('')
      if (next.length < 2) setShowComparison(false)
      return
    }
    if (selectedSlugs.length >= 3) {
      setCompareNotice('Compare up to three destinations at a time. Remove one to add another.')
      return
    }
    setSelectedSlugs([...selectedSlugs, slug])
    setCompareNotice(name + ' added to your comparison.')
  }

  function openComparison() {
    if (selectedSlugs.length < 2) return
    setShowComparison(true)
    window.setTimeout(() => document.getElementById('country-comparison')?.scrollIntoView({ block: 'start' }), 0)
  }

  return (
    <>
      <PageHero
        eyebrow="Destinations"
        title={
          <>
            Study abroad with a plan. <span className="text-coral-500">One team</span> to guide your next step.
          </>
        }
        intro="Explore destination guides, compare a shortlist, and talk with our team about the country you have in mind."
      />
      <section className="mx-auto mt-8 max-w-7xl px-6 pb-40 md:mt-10" aria-label="Compare study destinations">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <p className="max-w-2xl text-sm text-forest-900/65">Build a shortlist of two or three destinations. Compare cost estimates, visa funds and route conditions side by side.</p>
          <p className="rounded-full bg-forest-50 px-3 py-1.5 font-mono text-xs font-bold text-forest-700" aria-live="polite">{selectedSlugs.length} / 3 selected</p>
        </div>
        {compareNotice && <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900" role="status">{compareNotice}</p>}
        <div className="grid gap-6 md:grid-cols-2">
          {currentCountries.map((country) => {
            const selected = selectedSlugs.includes(country.slug)
            return (
              <article key={country.slug} className="group grid overflow-hidden rounded-3xl bg-white ring-1 ring-forest-900/10 transition hover:-translate-y-1 hover:shadow-[8px_8px_0_0] hover:shadow-forest-900 lg:grid-cols-[1fr_auto]">
                <Link to="/countries/$slug" params={{ slug: country.slug }} className="block p-5 focus-visible:z-10 sm:p-8">
                  <CountryFlag code={country.code} flag={country.flag} country={country.name} className="h-8 w-12 shrink-0 shadow-sm sm:h-10 sm:w-14" />
                  <h2 className="mt-4 text-2xl font-extrabold text-forest-900 sm:mt-5 sm:text-3xl">{country.name}</h2>
                  <p className="mt-1 text-sm text-forest-900/65 sm:mt-2 sm:text-base">{country.headline}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5 sm:mt-6 sm:gap-2">
                    {country.visas.slice(0, 2).map((visa, index) => (
                      <span key={'mobile-' + index} className="max-w-full rounded-full bg-forest-50 px-2.5 py-1 text-[10px] font-semibold leading-tight text-forest-700 sm:hidden">{visa}</span>
                    ))}
                    {country.visas.length > 2 && (
                      <span className="rounded-full bg-forest-50 px-2.5 py-1 text-[10px] font-semibold leading-tight text-forest-700 sm:hidden">+{country.visas.length - 2} more</span>
                    )}
                    {country.visas.slice(0, 4).map((visa, index) => (
                      <span key={'desktop-' + index} className="hidden max-w-full rounded-full bg-forest-50 px-3 py-1 text-xs font-semibold leading-tight text-forest-700 sm:inline-flex">{visa}</span>
                    ))}
                  </div>
                  <span className="mt-4 inline-flex min-h-11 items-center gap-2 text-xs font-bold text-coral-600 sm:mt-5 sm:text-sm">View destination guide <ArrowRight aria-hidden="true" className="size-4 transition group-hover:translate-x-1" /></span>
                </Link>
                <div className="flex flex-col gap-4 border-t-2 border-dashed border-forest-900/10 bg-cream p-4 lg:w-56 lg:border-t-0 lg:border-l-2 lg:p-6">
                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                    {country.stats.map((stat) => (
                      <div key={stat.label}>
                        <p className="text-[10px] uppercase tracking-widest text-forest-900/50">{stat.label}</p>
                        <p className="font-display font-bold text-forest-900">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  {country.studyGuide ? (
                    <button
                      type="button"
                      aria-pressed={selected}
                      aria-label={(selected ? 'Remove ' : 'Add ') + country.name + (selected ? ' from study comparison' : ' to study comparison')}
                      onClick={() => toggleCompare(country.slug, country.name)}
                      className={'flex min-h-11 w-fit self-start items-center justify-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500 lg:w-full lg:self-stretch ' + (selected ? 'border-forest-900 bg-forest-900 text-white hover:bg-forest-800' : 'border-forest-900/15 bg-white text-forest-900 hover:border-coral-500 hover:bg-coral-50')}
                    >
                      {selected ? <><Check aria-hidden="true" className="size-4" /> Selected</> : '＋ Compare study'}
                    </button>
                  ) : (
                    <p className="max-w-48 text-xs leading-relaxed text-forest-900/60">Visitor guide · study over 90 days uses a country-specific route.</p>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-forest-900/10 bg-cream px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-base font-extrabold text-forest-900">Looking at another study destination?</h2>
            <p className="mt-1 text-sm text-forest-900/65">We guide students on study routes beyond the guides shown here. Tell us which country you’re considering.</p>
          </div>
          <Link to="/contact" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-forest-900 px-5 py-3 text-xs font-bold text-white transition hover:bg-forest-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500">
            Ask our team <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        {showComparison && selectedCountries.length >= 2 && (
          <section id="country-comparison" aria-labelledby="country-comparison-title" className="mt-12 scroll-mt-28 rounded-[2rem] bg-forest-900 bg-grain p-5 text-white md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-coral-400">Study guide · side by side</p>
                <h2 id="country-comparison-title" className="mt-2 text-2xl font-extrabold md:text-3xl">Compare your shortlist</h2>
                <p className="mt-2 max-w-2xl text-sm text-forest-100/70">Compare tuition estimates, student visa charges, proof of funds, admissions and English requirements, work conditions, post-study routes and common intake windows. Each item links to official guidance.</p>
              </div>
              <button type="button" onClick={() => setShowComparison(false)} className="min-h-11 rounded-full border border-white/25 px-4 py-2 text-xs font-bold text-white hover:bg-white/10">Close comparison</button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {selectedCountries.map((country) => {
                const guide = country.studyGuide
                if (!guide) return null
                const facts = [
                  { label: 'Tuition estimate', value: guide.tuitionEstimate },
                  { label: 'Student visa fee', value: guide.studentVisaFee },
                  { label: 'Proof of funds', value: guide.proofOfFunds },
                  { label: 'Admission & English', value: guide.admissionAndEnglish },
                  { label: 'Work while studying', value: guide.workWhileStudying },
                  { label: 'Post-study option', value: guide.postStudyOption },
                ]
                return (
                  <article key={country.slug} className="rounded-2xl bg-white p-5 text-forest-900 ring-1 ring-white/20">
                    <div className="flex items-center gap-3 border-b border-forest-900/10 pb-4">
                      <CountryFlag code={country.code} flag={country.flag} country={country.name} className="h-8 w-12 shrink-0 shadow-sm" />
                      <div><h3 className="font-display text-xl font-extrabold">{country.name}</h3><p className="text-xs text-forest-900/55">Study destination · checked {guide.lastVerified}</p></div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900/55">Common intake windows</h4>
                      <div className="mt-2 flex flex-wrap gap-2">{country.intakes.map((intake) => <span key={intake} className="rounded-full bg-forest-50 px-3 py-1 text-xs font-semibold text-forest-700">{intake}</span>)}</div>
                      <p className="mt-2 text-xs leading-relaxed text-forest-900/60">{guide.intakesNote}</p>
                    </div>
                    <dl className="mt-4 space-y-3">
                      {facts.map((fact) => (
                        <div key={fact.label} className="rounded-xl bg-cream p-3">
                          <dt className="text-xs font-bold uppercase tracking-wider text-forest-900/55">{fact.label}</dt>
                          <dd className="mt-1 text-sm leading-relaxed text-forest-900/80">{fact.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-4 border-t border-forest-900/10 pt-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900/55">Official sources</h4>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                        {guide.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1 text-xs font-bold text-coral-600 underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500">{source.label} <ArrowRight aria-hidden="true" className="size-3" /></a>)}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
            <p className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-forest-100/75">Tuition estimates are for planning and vary by provider, programme and location. Proof-of-funds figures are visa evidence amounts, separate from tuition and actual living costs. Work and post-study routes depend on your visa, course and personal eligibility. Check linked official rules before making an application.</p>
          </section>
        )}
      </section>

      {selectedSlugs.length > 0 && (
        <div className="fixed inset-x-3 bottom-20 z-40 mx-auto flex max-w-xl items-center justify-between gap-3 rounded-2xl bg-forest-950 p-3 text-white shadow-xl ring-1 ring-white/15 sm:inset-x-6">
          <div aria-live="polite"><p className="font-mono text-[10px] font-bold uppercase tracking-wider text-coral-300">{selectedSlugs.length} / 3 selected</p><p className="text-xs text-white/75">{selectedSlugs.length < 2 ? 'Choose one more' : 'Ready to compare'}</p></div>
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" onClick={() => { setSelectedSlugs([]); setShowComparison(false); setCompareNotice('') }} className="min-h-11 rounded-full px-3 py-2 text-xs font-bold text-white/80 hover:bg-white/10">Clear</button>
            <button type="button" disabled={selectedSlugs.length < 2} onClick={openComparison} className="min-h-11 rounded-full bg-coral-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-coral-600 disabled:cursor-not-allowed disabled:opacity-50">Compare {selectedSlugs.length} <ArrowRight aria-hidden="true" className="ml-1 inline size-3.5" /></button>
          </div>
        </div>
      )}
    </>
  )
}
