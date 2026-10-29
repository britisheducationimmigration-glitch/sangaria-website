import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Award, BadgeCheck, Headphones, MapPin, Timer } from 'lucide-react'
import { ApprovalCard, PostCard, TestimonialCard } from '@/components/Cards'
import { CountryFlag } from '@/components/CountryFlag'
import { EnquiryForm } from '@/components/EnquiryForm'
import { Eyebrow } from '@/components/Section'
import { ServiceIcon } from '@/components/ServiceIcon'
import { countries, faqs, visaServices } from '@/data/fixtures'
import { site } from '@/data/site'
import { img } from '@/lib/utils'
import { getPublicContent } from '@/lib/public-functions'

export const Route = createFileRoute('/')({ loader: () => getPublicContent(), component: Home })

const stats = [
  { value: '2,500+', label: 'Visas approved' },
  { value: '98%', label: 'Success ratio' },
  { value: '7', label: 'Destinations' },
  { value: '7.0', label: 'Avg. IELTS band' },
]

const steps = [
  { n: '01', title: 'Free counselling', text: 'Visit our Sangaria office or call — we assess your profile honestly.' },
  { n: '02', title: 'Test preparation', text: 'IELTS or PTE coaching in small batches until you hit your target score.' },
  { n: '03', title: 'Admission & file', text: 'University offers, SOP, funds and a complete, embassy-ready visa file.' },
  { n: '04', title: 'Visa & departure', text: 'Biometrics, interview prep, forex, tickets and pre-departure briefing.' },
]

function Home() {
  const { approvals, posts, testimonials, settings } = Route.useLoaderData()
  return (
    <>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-forest-900 bg-grain text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pt-12 pb-16 sm:gap-14 sm:px-6 sm:pt-16 sm:pb-24 lg:grid-cols-[1.15fr_1fr] lg:pt-20">
          <div>
            <div className="animate-rise">
              <Eyebrow light>Sangaria · Hanumangarh · Since day one</Eyebrow>
            </div>
            <h1 className="mt-5 animate-rise text-4xl font-extrabold leading-[1.05] tracking-tight [animation-delay:80ms] sm:text-6xl sm:leading-[0.95] xl:text-[5.2rem]">
              Pack your bags.
              <br />
              <span className="relative inline-block text-coral-500">
                We’ll handle
                <svg viewBox="0 0 300 20" className="absolute -bottom-2 left-0 w-full" aria-hidden>
                  <path d="M2 15 Q 75 2 150 10 T 298 6" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
              <br />
              the visa.
            </h1>
            <p className="mt-6 max-w-xl animate-rise text-sm leading-relaxed text-forest-100/80 [animation-delay:160ms] sm:text-lg">
              Study visas, PR, work permits, tourist visas and IELTS / PTE coaching for Canada, UK, Australia, USA, New Zealand, Germany and Europe —
              all under one roof at {site.name}.
            </p>
            <div className="mt-8 flex animate-rise flex-wrap gap-3 [animation-delay:240ms]">
              <Link
                to="/eligibility"
                className="flex items-center gap-2 rounded-full bg-coral-500 px-6 py-3.5 text-sm font-bold shadow-[4px_4px_0_0] shadow-black/40 transition hover:-translate-y-0.5 sm:px-7 sm:py-4 sm:text-base"
              >
                Check my eligibility <ArrowRight className="size-4" />
              </Link>
              <Link to="/contact" className="rounded-full border border-white/25 px-6 py-3.5 text-sm font-bold transition hover:bg-white hover:text-forest-900 sm:px-7 sm:py-4 sm:text-base">
                Talk to a counsellor
              </Link>
            </div>
            <dl className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-4 sm:gap-6">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/5 p-3 sm:bg-transparent sm:p-0">
                  <dt className="font-display text-2xl font-extrabold text-white sm:text-3xl">{s.value}</dt>
                  <dd className="mt-0.5 text-[10px] uppercase tracking-wider text-forest-100/60 sm:text-xs">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">
            <div className="absolute -inset-3 rotate-2 rounded-[2.5rem] bg-coral-500/90 sm:-inset-4 sm:rotate-3" />
            <img
              src={img('/img/hero.webp', 720, 860)}
              alt="Student holding passport and university acceptance letter at the airport"
              width={720}
              height={860}
              className="relative aspect-[6/7] w-full rounded-[2rem] object-cover shadow-2xl"
            />
            {/* boarding pass */}
            <div className="absolute -bottom-6 -left-2 w-[85%] rounded-2xl bg-cream p-3 text-forest-900 shadow-2xl sm:-bottom-10 sm:-left-10 sm:w-[78%] sm:p-4">
              <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-forest-900/60 sm:text-[10px]">
                <span>Boarding pass</span>
                <span>BEI · 2026</span>
              </div>
              <div className="mt-1 flex items-center justify-between font-display">
                <div>
                  <p className="text-xl font-extrabold sm:text-3xl">SNG</p>
                  <p className="text-[9px] text-forest-900/60 sm:text-[11px]">Sangaria</p>
                </div>
                <div className="flex-1 px-2 text-center text-xs font-bold text-coral-500 sm:text-sm">- - ✈ - -</div>
                <div className="text-right">
                  <p className="text-xl font-extrabold sm:text-3xl">YYZ</p>
                  <p className="text-[9px] text-forest-900/60 sm:text-[11px]">Toronto</p>
                </div>
              </div>
            </div>
            {/* stamp badge */}
            <div className="absolute -top-3 -right-2 grid size-20 animate-stamp place-items-center rounded-full border-[2.5px] border-dashed border-coral-500 bg-forest-950/90 text-center font-mono text-[9px] font-bold uppercase leading-tight tracking-widest text-coral-400 backdrop-blur [animation-delay:600ms] sm:top-6 sm:-right-6 sm:size-28 sm:border-[3px] sm:text-[11px]">
              Visa
              <br />
              Approved
              <br />✓
            </div>
          </div>
        </div>
      </section>

      {/* APPROVALS MARQUEE */}
      {settings.approvalsMarqueeEnabled && (
        <section className="overflow-hidden border-y border-forest-900/10 bg-coral-500 py-3 text-white sm:py-4">
          <div className="flex w-max animate-marquee gap-8 whitespace-nowrap font-display text-sm font-bold sm:gap-10 sm:text-lg">
            {[...approvals, ...approvals].map((a, i) => (
              <span key={i} className="flex items-center gap-2.5">
                <CountryFlag flag={a.flag} country={a.country} className="inline-block h-3.5 w-5 shrink-0 sm:h-4 sm:w-6" /> {a.name} — {a.visa} approved <span className="text-white/50">✦</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* SERVICES */}
      <section id="services" className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20 lg:py-24">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Eyebrow>What we do</Eyebrow>
            <h2 className="mt-3 max-w-2xl text-2xl font-extrabold text-forest-900 sm:text-4xl md:text-5xl">Every kind of visa, handled by one trusted team.</h2>
          </div>
          <Link to="/visas" className="font-bold text-coral-600 hover:underline">
            All visa services →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {visaServices.map((s, i) => (
            <Link
              key={s.slug}
              to="/visas"
              hash={s.slug}
              className={
                'group relative overflow-hidden rounded-3xl p-6 sm:p-8 transition hover:-translate-y-1 ' +
                (i === 0 ? 'bg-forest-900 text-white' : 'bg-white ring-1 ring-forest-900/10 hover:ring-forest-900')
              }
            >
              <span className={'grid size-12 sm:size-14 place-items-center rounded-2xl ' + (i === 0 ? 'bg-coral-500' : 'bg-forest-50 text-forest-700')}>
                <ServiceIcon name={s.icon} className="size-5 sm:size-6" />
              </span>
              <h3 className="mt-5 text-xl font-bold sm:text-2xl">{s.title}</h3>
              <p className={'mt-2 text-xs sm:text-base ' + (i === 0 ? 'text-forest-100/75' : 'text-forest-900/65')}>{s.summary}</p>
              <span className="absolute top-5 right-5 font-mono text-xs opacity-40 sm:top-8 sm:right-8">0{i + 1}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* DESTINATIONS / COUNTRIES (Flipkart Style: 2 Clean Columns on Mobile, 4 Columns on Desktop) */}
      <section id="destinations" className="bg-sand/60 bg-dots py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <Eyebrow>Destinations</Eyebrow>
          <h2 className="mt-3 max-w-3xl text-2xl font-extrabold text-forest-900 sm:text-4xl md:text-5xl">Choose where your next chapter begins.</h2>
          
          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-4">
            {countries.map((c) => (
              <Link
                key={c.slug}
                to="/countries/$slug"
                params={{ slug: c.slug }}
                className="group relative flex flex-col justify-between rounded-2xl bg-cream p-4 ring-1 ring-forest-900/10 transition hover:-translate-y-1 hover:bg-forest-900 hover:text-white sm:rounded-3xl sm:p-6"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <CountryFlag code={c.code} flag={c.flag} country={c.name} className="h-7 w-10 shrink-0 shadow-xs sm:h-10 sm:w-14" />
                    <span className="font-mono text-base font-bold text-forest-900/20 group-hover:text-white/20 sm:text-2xl">{c.code}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold sm:mt-6 sm:text-2xl">{c.name}</h3>
                  <p className="mt-1 text-[11px] leading-tight opacity-70 line-clamp-2 sm:text-sm">{c.headline}</p>
                </div>
                <div>
                  <div className="my-3 border-t border-dashed border-forest-900/15 group-hover:border-white/20 sm:my-5 sm:border-t-2" />
                  <div className="flex items-end justify-between text-xs sm:text-sm">
                    <div>
                      <span className="block text-[8px] uppercase tracking-widest opacity-60 sm:text-[10px]">{c.stats[0].label}</span>
                      <span className="font-bold text-xs sm:text-base">{c.stats[0].value}</span>
                    </div>
                    <ArrowRight className="size-4 text-coral-500 transition group-hover:translate-x-1 sm:size-5" />
                  </div>
                </div>
              </Link>
            ))}
            <Link to="/eligibility" className="col-span-2 sm:col-span-1 flex flex-col justify-between rounded-2xl bg-coral-500 p-5 text-white transition hover:-translate-y-1 sm:rounded-3xl sm:p-6">
              <span className="font-mono text-[10px] uppercase tracking-widest sm:text-xs">Not sure?</span>
              <span className="mt-3 font-display text-lg font-extrabold leading-tight sm:mt-6 sm:text-2xl">Find the country that fits your profile in 60 seconds →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* COACHING */}
      <section id="coaching" className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-6 sm:gap-14 sm:py-20 lg:grid-cols-2 lg:py-24">
        <div className="relative">
          <img
            src={img('/img/coaching.webp', 760, 560)}
            alt="IELTS and PTE coaching classroom in Sangaria"
            width={760}
            height={560}
            loading="lazy"
            className="aspect-[19/14] w-full rounded-[2rem] object-cover"
          />
          <div className="absolute -bottom-4 right-3 rounded-2xl bg-forest-900 p-3.5 text-white shadow-xl sm:-bottom-6 sm:-right-4 sm:p-5">
            <p className="font-display text-2xl font-extrabold text-coral-500 sm:text-4xl">79+</p>
            <p className="text-[10px] uppercase tracking-wider text-forest-100/70 sm:text-xs">Top PTE score this month</p>
          </div>
        </div>
        <div className="pt-2 sm:pt-0">
          <Eyebrow>IELTS & PTE Coaching</Eyebrow>
          <h2 className="mt-3 text-2xl font-extrabold text-forest-900 sm:text-4xl md:text-5xl">Your score is your passport. Let’s raise it.</h2>
          <p className="mt-3 text-sm text-forest-900/70 sm:mt-5 sm:text-lg">
            Small batches, experienced trainers, a dedicated PTE computer lab and weekly mock tests — right here in Sangaria.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-4">
            {[
              { icon: Headphones, t: 'Real PTE lab' },
              { icon: Timer, t: 'Timed mocks' },
              { icon: Award, t: 'Band feedback' },
              { icon: BadgeCheck, t: 'Free demo class' },
            ].map(({ icon: Icon, t }) => (
              <li key={t} className="flex items-center gap-2 rounded-xl bg-white p-3 text-xs font-semibold text-forest-900 ring-1 ring-forest-900/10 sm:gap-3 sm:rounded-2xl sm:p-4 sm:text-sm">
                <Icon className="size-4 shrink-0 text-coral-500 sm:size-5" /> {t}
              </li>
            ))}
          </ul>
          <Link to="/coaching" className="mt-6 inline-flex rounded-full bg-forest-900 px-6 py-3.5 text-xs font-bold text-white transition hover:bg-forest-700 sm:mt-8 sm:px-7 sm:py-4 sm:text-base">
            View batches & fees →
          </Link>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-forest-900 bg-grain py-14 text-white sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <Eyebrow light>How it works</Eyebrow>
          <h2 className="mt-3 max-w-2xl text-2xl font-extrabold sm:text-4xl md:text-5xl">Four steps from Sangaria to your dream destination.</h2>
          <ol className="mt-8 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6 md:grid-cols-4">
            {steps.map((s) => (
              <li key={s.n} className="relative rounded-2xl border border-white/10 bg-white/5 p-5 sm:rounded-3xl sm:p-7">
                <span className="font-display text-4xl font-extrabold text-coral-500/90 sm:text-6xl">{s.n}</span>
                <h3 className="mt-3 text-base font-bold sm:mt-4 sm:text-xl">{s.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-forest-100/70 sm:mt-2 sm:text-sm">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* RECENT APPROVALS */}
      <section id="approvals" className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20 lg:py-24">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Eyebrow>Fresh approvals</Eyebrow>
            <h2 className="mt-3 text-2xl font-extrabold text-forest-900 sm:text-4xl md:text-5xl">Visas that landed this month.</h2>
          </div>
          <Link to="/success-stories" className="font-bold text-coral-600 hover:underline">
            See all success stories →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {approvals.slice(0, 4).map((a, i) => (
            <ApprovalCard key={a.name} a={a} i={i} />
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="bg-sand/60 py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <Eyebrow>Testimonials</Eyebrow>
          <h2 className="mt-3 max-w-2xl text-2xl font-extrabold text-forest-900 sm:text-4xl md:text-5xl">Real students. Real families. Real visas.</h2>
          <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t, i) => (
              <TestimonialCard key={t.name} t={t} featured={i === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* UPDATES */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20 lg:py-24">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Eyebrow>News & Blog</Eyebrow>
            <h2 className="mt-3 text-2xl font-extrabold text-forest-900 sm:text-4xl md:text-5xl">Latest visa updates.</h2>
          </div>
          <Link to="/updates" className="font-bold text-coral-600 hover:underline">
            All articles →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-3">
          {posts.slice(0, 3).map((p) => (
            <PostCard key={p.slug} p={p} />
          ))}
        </div>
      </section>

      {/* FAQ + ENQUIRY */}
      <section id="enquiry" className="mx-auto grid max-w-7xl gap-8 px-5 pb-20 sm:gap-12 sm:px-6 sm:pb-28 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Eyebrow>FAQs</Eyebrow>
          <h2 className="mt-3 text-2xl font-extrabold text-forest-900 sm:text-4xl">Questions we hear every day.</h2>
          <div className="mt-6 divide-y divide-forest-900/10 rounded-2xl bg-white ring-1 ring-forest-900/10 sm:mt-8 sm:rounded-3xl">
            {faqs.map((f) => (
              <details key={f.q} className="group p-5 sm:p-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-base font-bold text-forest-900 sm:text-lg">
                  {f.q}
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-forest-50 text-coral-600 transition group-open:rotate-45 sm:size-8">+</span>
                </summary>
                <p className="mt-2 text-xs text-forest-900/70 sm:mt-3 sm:text-sm">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs text-forest-900/60 sm:mt-6 sm:text-sm">
            <MapPin className="size-4 shrink-0 text-coral-500" /> {site.address}
          </p>
        </div>
        <div className="rounded-[2rem] bg-forest-900 bg-grain p-6 text-white sm:p-8 md:p-10">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Get a free profile evaluation</h2>
          <p className="mt-2 mb-6 text-xs text-forest-100/70 sm:mb-8 sm:text-sm">Share a few details — a counsellor calls you back within one working day.</p>
          <EnquiryForm source="home" dark />
        </div>
      </section>
    </>
  )
}
