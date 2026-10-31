import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { PageHero } from '@/components/Section'
import { CountryFlag } from '@/components/CountryFlag'
import { countries } from '@/data/fixtures'
import { visaGuidance } from '@/data/visa-guidance'

import { createPageSeo } from '@/lib/seo'

export const Route = createFileRoute('/countries/')({
  head: () => createPageSeo({
    title: 'Study Destinations & Visa Fees | British Education Sangaria',
    description: 'Compare study destinations, visa guidance, tuition ranges, living funds and intakes for international students.',
    path: '/countries',
  }),
  component: CountriesPage,
})

function CountriesPage() {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [compareNotice, setCompareNotice] = useState('')
  const selectedCountries = countries.filter((country) => selectedSlugs.includes(country.slug))

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
            Seven destinations. <span className="text-coral-500">One team</span> that knows them all.
          </>
        }
        intro="Compare post-study work rights, costs and intakes — then let us build the strongest possible file for the country you choose."
      />
      <section className="mx-auto mt-8 max-w-7xl px-6 pb-40 md:mt-10" aria-label="Compare destinations">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <p className="max-w-2xl text-sm text-forest-900/65">Choose two or three destinations to compare their existing fee snapshots, intakes and English guidance.</p>
          <p className="rounded-full bg-forest-50 px-3 py-1.5 font-mono text-xs font-bold text-forest-700" aria-live="polite">{selectedSlugs.length} / 3 selected</p>
        </div>
        {compareNotice && <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900" role="status">{compareNotice}</p>}
        <div className="grid gap-6 md:grid-cols-2">
          {countries.map((country) => {
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
                  <button
                    type="button"
                    aria-pressed={selected}
                    aria-label={(selected ? 'Remove ' : 'Add ') + country.name + (selected ? ' from comparison' : ' to comparison')}
                    onClick={() => toggleCompare(country.slug, country.name)}
                    className={'flex min-h-11 w-fit self-start items-center justify-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500 lg:w-full lg:self-stretch ' + (selected ? 'border-forest-900 bg-forest-900 text-white hover:bg-forest-800' : 'border-forest-900/15 bg-white text-forest-900 hover:border-coral-500 hover:bg-coral-50')}
                  >
                    {selected ? <><Check aria-hidden="true" className="size-4" /> Selected</> : '＋ Compare'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        {showComparison && selectedCountries.length >= 2 && (
          <section id="country-comparison" aria-labelledby="country-comparison-title" className="mt-12 scroll-mt-28 rounded-[2rem] bg-forest-900 bg-grain p-5 text-white md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-coral-400">Side-by-side guide</p>
                <h2 id="country-comparison-title" className="mt-2 text-2xl font-extrabold md:text-3xl">Compare destinations</h2>
                <p className="mt-2 max-w-2xl text-sm text-forest-100/70">Uses the country details and fee snapshots already on this site. Figures can vary by route and circumstances.</p>
              </div>
              <button type="button" onClick={() => setShowComparison(false)} className="min-h-11 rounded-full border border-white/25 px-4 py-2 text-xs font-bold text-white hover:bg-white/10">Close comparison</button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {selectedCountries.map((country) => {
                const guidance = visaGuidance[country.slug]
                return (
                  <article key={country.slug} className="rounded-2xl bg-white p-5 text-forest-900 ring-1 ring-white/20">
                    <div className="flex items-center gap-3 border-b border-forest-900/10 pb-4">
                      <CountryFlag code={country.code} flag={country.flag} country={country.name} className="h-8 w-12 shrink-0 shadow-sm" />
                      <div><h3 className="font-display text-xl font-extrabold">{country.name}</h3><p className="text-xs text-forest-900/55">{country.headline}</p></div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900/55">Intakes</h4>
                      <div className="mt-2 flex flex-wrap gap-2">{country.intakes.map((intake) => <span key={intake} className="rounded-full bg-forest-50 px-3 py-1 text-xs font-semibold text-forest-700">{intake}</span>)}</div>
                    </div>
                    <div className="mt-4 rounded-xl bg-cream p-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900/55">English guidance</h4>
                      <p className="mt-1 text-sm leading-relaxed text-forest-900/80">{country.english}</p>
                    </div>
                    <div className="mt-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900/55">Fee snapshot</h4>
                        {guidance?.lastVerified && <span className="text-[10px] text-forest-900/50">Verified {guidance.lastVerified}</span>}
                      </div>
                      {guidance?.feeRows?.length ? (
                        <dl className="mt-2 divide-y divide-forest-900/10">
                          {guidance.feeRows.map((fee) => <div key={fee.label} className="flex items-start justify-between gap-3 py-2 text-xs"><dt className="text-forest-900/65">{fee.label}</dt><dd className="text-right font-bold text-forest-900">{fee.value}</dd></div>)}
                        </dl>
                      ) : (
                        <p className="mt-2 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">A fee snapshot is not listed for this destination yet. Check its official source before relying on a cost estimate.</p>
                      )}
                      {guidance?.sources?.[0] && <a href={guidance.sources[0].url} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs font-bold text-coral-600 underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500">{guidance.sources[0].label} <ArrowRight aria-hidden="true" className="size-3" /></a>}
                    </div>
                  </article>
                )
              })}
            </div>
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
