import { Link } from '@tanstack/react-router'
import { CalendarDays, Check, Languages, Wallet } from 'lucide-react'
import { EnquiryForm } from '@/components/EnquiryForm'
import { Eyebrow } from '@/components/Section'
import { CountryFlag } from '@/components/CountryFlag'
import type { Country } from '@/data/fixtures'
import type { VisaGuidance } from '@/data/visa-guidance'

type PolicyNotice = {
  id: string
  title: string
  message: string
  sourceLabel: string
  sourceUrl: string
}

export function CountryPageView({
  country: c,
  guidance,
  notices = [],
  preview = false,
}: {
  country: Country
  guidance: VisaGuidance
  notices?: PolicyNotice[]
  preview?: boolean
}) {
  return (
    <div inert={preview ? true : undefined}>
    <>
      <section className="relative overflow-hidden bg-forest-900 bg-aurora-live text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-1/2 h-[380px] w-[380px] -translate-y-1/2 opacity-35 md:right-10 md:h-[460px] md:w-[460px] md:opacity-65">
          <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-spin [animation-duration:36s]" />
          <div className="absolute inset-12 rounded-full border border-coral-400/30 animate-spin [animation-duration:24s] [animation-direction:reverse]" />
          <div className="absolute inset-24 rounded-full border border-amber-300/25 animate-pulse" />
        </div>
        <span className="pointer-events-none absolute -top-10 right-0 font-display text-[16rem] leading-none font-extrabold text-white/[0.04] md:text-[22rem]">
          {c.code}
        </span>
        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-24">
          <Link to="/countries" className="text-sm text-forest-100/60 hover:text-white">
            ← All destinations
          </Link>
          <div className="mt-6 animate-rise"><CountryFlag code={c.code} flag={c.flag} country={c.name} className="h-14 w-20 shadow-md" /></div>
          <h1 className="mt-4 animate-rise text-5xl font-extrabold md:text-7xl">{c.name}</h1>
          <p className="mt-3 animate-rise text-2xl font-display text-coral-400">{c.headline}</p>
          <p className="mt-6 max-w-2xl text-lg text-forest-100/80">{c.intro}</p>
          <dl className="mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            {c.stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <dt className="text-xs uppercase tracking-widest text-forest-100/60">{s.label}</dt>
                <dd className="mt-1 font-display text-2xl font-bold">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-10">
          <div>
            <Eyebrow>Visa types we handle</Eyebrow>
            <div className="mt-5 flex flex-wrap gap-3">
              {c.visas.map((v) => (
                <span key={v} className="rounded-2xl bg-white px-5 py-3 font-display font-bold text-forest-900 ring-1 ring-forest-900/10">
                  {v}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-7 ring-1 ring-forest-900/10">
              <CalendarDays className="size-6 text-coral-500" />
              <h3 className="mt-4 text-lg font-bold text-forest-900">Intakes</h3>
              <ul className="mt-3 space-y-1.5 text-forest-900/70">
                {c.intakes.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-white p-7 ring-1 ring-forest-900/10">
              <Languages className="size-6 text-coral-500" />
              <h3 className="mt-4 text-lg font-bold text-forest-900">English requirement</h3>
              <p className="mt-3 text-forest-900/70">{c.english}</p>
              <Link to="/coaching" className="mt-3 inline-block text-sm font-bold text-coral-600">
                Prepare with us →
              </Link>
            </div>
          </div>
          {notices.map((notice) => (
            <aside key={notice.id} role="status" className="mb-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-forest-900/80">
              <strong className="block text-amber-900">{notice.title}</strong>
              <p className="mt-1">{notice.message}</p>
              <a href={notice.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex min-h-10 items-center font-bold text-coral-700 underline underline-offset-2">{notice.sourceLabel} ↗</a>
            </aside>
          ))}
                    <div className="rounded-3xl bg-forest-50 p-8">
            <Wallet className="size-6 text-forest-700" />
            <h3 className="mt-4 text-lg font-bold text-forest-900">Official fee snapshot</h3>
            <table className="mt-4 w-full text-left">
              <tbody>
                {guidance.feeRows.map((k) => (
                  <tr key={k.label} className="border-b border-forest-900/10 last:border-0">
                    <td className="py-3 text-forest-900/70">{k.label}</td>
                    <td className="py-3 text-right font-display font-bold text-forest-900">{k.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-forest-900/50">Last verified {guidance.lastVerified}. This is an indicative snapshot; fees and requirements vary by route, nationality, application location, family composition and date. Confirm the linked official source before applying. This page is general information, not an eligibility decision or guarantee of visa approval.</p>
            <p className="mt-3 text-sm leading-relaxed text-forest-900/70">{guidance.feeSummary}</p>
          </div>
          <div className="rounded-3xl bg-white p-8 ring-1 ring-forest-900/10">
            <Eyebrow>Before you apply</Eyebrow>
            <h3 className="mt-3 text-2xl font-extrabold text-forest-900">Core requirements</h3>
            <ul className="mt-5 space-y-4">
              {guidance.requirements.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-forest-900/75">
                  <Check className="mt-0.5 size-4 shrink-0 text-coral-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-2xl bg-coral-50 p-4 text-sm leading-relaxed text-forest-900/75"><strong className="text-coral-700">Important:</strong> {guidance.caveat}</p>
            <div className="mt-6 border-t border-forest-900/10 pt-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-forest-900/50">Official sources</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                {guidance.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-coral-600 hover:underline">{source.label}</a>)}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-forest-900">Why {c.name}?</h3>
            <ul className="mt-5 space-y-3">
              {c.highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 text-lg text-forest-900/80">
                  <span className="grid size-7 place-items-center rounded-full bg-coral-500 text-white">
                    <Check className="size-4" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <aside className="h-fit rounded-[2rem] bg-white p-8 ring-1 ring-forest-900/10 lg:sticky lg:top-32">
          <h2 className="text-2xl font-extrabold text-forest-900">Planning for {c.name}?</h2>
          <p className="mt-2 mb-6 text-forest-900/65">Get a free profile check from our {c.name} specialist.</p>
          {c.studyPlan && (
            <>
              <Link
                to="/study-plan/$slug"
                params={{ slug: c.slug }}
                className="mb-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-coral-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-coral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500"
              >
                View complete study plan <span aria-hidden="true">→</span>
              </Link>
              <Link
                to="/study-plan/$slug"
                params={{ slug: c.slug }}
                hash="loan-eligibility"
                hashScrollIntoView={false}
                resetScroll={false}
                className="mb-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-forest-900/15 bg-white px-5 py-3 text-sm font-bold text-forest-900 transition hover:bg-forest-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-900"
              >
                Explore loan options <span aria-hidden="true">→</span>
              </Link>
            </>
          )}
          {preview ? (
            <div className="rounded-2xl border border-dashed border-forest-900/20 bg-forest-50 p-5 text-sm text-forest-900/70">
              <h3 className="font-bold text-forest-900">Enquiry form</h3>
              <p className="mt-2 leading-relaxed">This is where the live enquiry form appears. It is inactive in the admin preview.</p>
            </div>
          ) : (
            <EnquiryForm source={`country-${c.slug}`} defaultCountry={c.name} compact />
          )}
        </aside>
      </section>
    </>
    </div>
  )
}
