import { Link, createFileRoute } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { PageHero } from '@/components/Section'
import { ServiceIcon } from '@/components/ServiceIcon'
import { CountryFlag } from '@/components/CountryFlag'
import { countries, visaServices } from '@/data/fixtures'

export const Route = createFileRoute('/visas')({
  head: () => ({ meta: [{ title: 'Visa Services · British Education and Immigration' }] }),
  component: VisasPage,
})

function VisasPage() {
  return (
    <>
      <PageHero
        eyebrow="Visa services"
        title={
          <>
            Study, visit, work or <span className="text-coral-500">settle</span> — we file it right.
          </>
        }
        intro="Every application is prepared by an experienced counsellor, double-checked, and tracked until the decision."
      >
        <div className="mt-10 flex flex-wrap gap-2">
          {visaServices.map((s) => (
            <a key={s.slug} href={`#${s.slug}`} className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white hover:text-forest-900">
              {s.title}
            </a>
          ))}
        </div>
      </PageHero>
      <section className="mx-auto max-w-7xl space-y-6 px-6 py-20">
        {visaServices.map((s, i) => (
          <article
            key={s.slug}
            id={s.slug}
            className="grid scroll-mt-32 gap-8 rounded-[2rem] bg-white p-8 ring-1 ring-forest-900/10 md:grid-cols-[auto_1fr_1fr] md:p-10"
          >
            <span className={'grid size-16 place-items-center rounded-2xl ' + (i % 2 ? 'bg-forest-900 text-white' : 'bg-coral-500 text-white')}>
              <ServiceIcon name={s.icon} className="size-7" />
            </span>
            <div>
              <h2 className="text-3xl font-extrabold text-forest-900">{s.title}</h2>
              <p className="mt-3 text-lg text-forest-900/70">{s.summary}</p>
              <Link to="/contact" search={{ interest: s.title }} className="mt-6 inline-flex rounded-full bg-forest-900 px-6 py-3 text-sm font-bold text-white hover:bg-forest-700">
                Enquire about {s.title.toLowerCase()} →
              </Link>
            </div>
            <ul className="grid content-start gap-3">
              {s.points.map((p) => (
                <li key={p} className="flex items-center gap-3 rounded-xl bg-cream px-4 py-3 font-medium text-forest-900">
                  <Check className="size-4 text-coral-500" /> {p}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      <section className="bg-sand/60 py-16">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-6">
          {countries.map((c) => (
            <Link
              key={c.slug}
              to="/countries/$slug"
              params={{ slug: c.slug }}
              className="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-3 font-display font-bold text-forest-900 ring-1 ring-forest-900/10 hover:bg-forest-900 hover:text-white"
            >
              <CountryFlag flag={c.flag} code={c.code} country={c.name} className="h-4 w-6 shrink-0" />
              <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
