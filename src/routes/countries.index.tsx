import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/Section'
import { CountryFlag } from '@/components/CountryFlag'
import { countries } from '@/data/fixtures'

export const Route = createFileRoute('/countries/')({
  head: () => ({ meta: [{ title: 'Study & Visa Destinations · British Education and Immigration' }] }),
  component: CountriesPage,
})

function CountriesPage() {
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
      <section className="mx-auto mt-8 max-w-7xl px-6 pb-24 md:mt-10">
        <div className="grid gap-6 md:grid-cols-2">
          {countries.map((c) => (
            <Link
              key={c.slug}
              to="/countries/$slug"
              params={{ slug: c.slug }}
              className="group grid overflow-hidden rounded-3xl bg-white ring-1 ring-forest-900/10 transition hover:-translate-y-1 hover:shadow-[8px_8px_0_0] hover:shadow-forest-900 sm:grid-cols-[1fr_auto]"
            >
              <div className="p-8">
                <CountryFlag code={c.code} flag={c.flag} country={c.name} className="h-10 w-14 shrink-0 shadow-sm" />
                <h2 className="mt-5 text-3xl font-extrabold text-forest-900">{c.name}</h2>
                <p className="mt-2 text-forest-900/65">{c.headline}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {c.visas.slice(0, 4).map((v) => (
                    <span key={v} className="rounded-full bg-forest-50 px-3 py-1 text-xs font-semibold text-forest-700">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-row justify-between gap-4 border-t-2 border-dashed border-forest-900/10 bg-cream p-6 sm:w-48 sm:flex-col sm:border-t-0 sm:border-l-2">
                {c.stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-[10px] uppercase tracking-widest text-forest-900/50">{s.label}</p>
                    <p className="font-display font-bold text-forest-900">{s.value}</p>
                  </div>
                ))}
                <ArrowRight className="hidden size-6 text-coral-500 transition group-hover:translate-x-1 sm:block" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
