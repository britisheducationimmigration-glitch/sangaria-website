import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Award, BadgeCheck, Headphones, MapPin, Timer } from 'lucide-react'
import { ApprovalCard, PostCard, TestimonialCard } from '@/components/Cards'
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
      {/* HERO */}
      <section className="relative overflow-hidden bg-forest-900 bg-grain text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 pt-16 pb-24 lg:grid-cols-[1.15fr_1fr] lg:pt-24">
          <div>
            <div className="animate-rise">
              <Eyebrow light>Sangaria · Hanumangarh · Since day one</Eyebrow>
            </div>
            <h1 className="mt-7 animate-rise text-[3.4rem] font-extrabold leading-[0.92] [animation-delay:80ms] sm:text-7xl xl:text-[5.6rem]">
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
            <p className="mt-8 max-w-xl animate-rise text-lg leading-relaxed text-forest-100/80 [animation-delay:160ms]">
              Study visas, PR, work permits, tourist visas and IELTS / PTE coaching for Canada, UK, Australia, USA, New Zealand, Germany and Europe —
              all under one roof at {site.name}.
            </p>
            <div className="mt-10 flex animate-rise flex-wrap gap-3 [animation-delay:240ms]">
              <Link
                to="/eligibility"
                className="flex items-center gap-2 rounded-full bg-coral-500 px-7 py-4 font-bold shadow-[4px_4px_0_0] shadow-black/40 transition hover:-translate-y-1"
              >
                Check my eligibility <ArrowRight className="size-4" />
              </Link>
              <Link to="/contact" className="rounded-full border border-white/25 px-7 py-4 font-bold transition hover:bg-white hover:text-forest-900">
                Talk to a counsellor
              </Link>
            </div>
            <dl className="mt-14 grid max-w-xl grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-3xl font-extrabold text-white">{s.value}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-wider text-forest-100/60">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -inset-4 rotate-3 rounded-[2.5rem] bg-coral-500/90" />
            <img
              src={img('/img/hero.webp', 720, 860)}
              alt="Student holding passport and university acceptance letter at the airport"
              width={720}
              height={860}
              className="relative aspect-[6/7] w-full rounded-[2rem] object-cover shadow-2xl"
            />
            {/* boarding pass */}
            <div className="absolute -bottom-10 -left-4 w-[78%] rounded-2xl bg-cream p-4 text-forest-900 shadow-2xl sm:-left-12">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-forest-900/60">
                <span>Boarding pass</span>
                <span>BEI · 2026</span>
              </div>
              <div className="mt-2 flex items-center justify-between font-display">
                <div>
                  <p className="text-3xl font-extrabold">SNG</p>
                  <p className="text-[11px] text-forest-900/60">Sangaria</p>
                </div>
                <div className="flex-1 px-3 text-center text-coral-500">- - ✈ - -</div>
                <div className="text-right">
                  <p className="text-3xl font-extrabold">YYZ</p>
                  <p className="text-[11px] text-forest-900/60">Toronto</p>
                </div>
              </div>
            </div>
            <div className="absolute top-6 -right-3 grid size-28 animate-stamp place-items-center rounded-full border-[3px] border-dashed border-coral-500 bg-forest-950/80 text-center font-mono text-[11px] font-bold uppercase leading-tight tracking-widest text-coral-400 backdrop-blur [animation-delay:600ms] sm:-right-6">
              Visa
              <br />
              Approved
              <br />✓
            </div>
          </div>
        </div>
      </section>

      {/* APPROVALS MARQUEE */}
      {settings.approvalsMarqueeEnabled && <section className="overflow-hidden border-y border-forest-900/10 bg-coral-500 py-4 text-white">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-lg font-bold">
          {[...approvals, ...approvals].map((a, i) => (
            <span key={i} className="flex items-center gap-3">
              {a.flag} {a.name} — {a.visa} approved <span className="text-white/50">✦</span>
            </span>
          ))}
        </div>
      </section>}

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>What we do</Eyebrow>
            <h2 className="mt-4 max-w-2xl text-4xl font-extrabold text-forest-900 md:text-5xl">Every kind of visa, handled by one trusted team.</h2>
          </div>
          <Link to="/visas" className="font-bold text-coral-600 hover:underline">
            All visa services →
          </Link>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visaServices.map((s, i) => (
            <Link
              key={s.slug}
              to="/visas"
              hash={s.slug}
              className={
                'group relative overflow-hidden rounded-3xl p-8 transition hover:-translate-y-1 ' +
                (i === 0 ? 'bg-forest-900 text-white' : 'bg-white ring-1 ring-forest-900/10 hover:ring-forest-900')
              }
            >
              <span className={'grid size-14 place-items-center rounded-2xl ' + (i === 0 ? 'bg-coral-500' : 'bg-forest-50 text-forest-700')}>
                <ServiceIcon name={s.icon} className="size-6" />
              </span>
              <h3 className="mt-6 text-2xl font-bold">{s.title}</h3>
              <p className={'mt-3 ' + (i === 0 ? 'text-forest-100/75' : 'text-forest-900/65')}>{s.summary}</p>
              <span className="absolute top-8 right-8 font-mono text-xs opacity-40">0{i + 1}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* COUNTRIES as tickets */}
      <section className="bg-sand/60 bg-dots py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Eyebrow>Destinations</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-4xl font-extrabold text-forest-900 md:text-5xl">Choose where your next chapter begins.</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {countries.map((c) => (
              <Link
                key={c.slug}
                to="/countries/$slug"
                params={{ slug: c.slug }}
                className="group relative flex flex-col rounded-3xl bg-cream p-6 ring-1 ring-forest-900/10 transition hover:-translate-y-1 hover:bg-forest-900 hover:text-white"
              >
                <div className="flex items-center justify-between">
                  <span className="text-5xl">{c.flag}</span>
                  <span className="font-mono text-2xl font-bold text-forest-900/20 group-hover:text-white/20">{c.code}</span>
                </div>
                <h3 className="mt-6 text-2xl font-bold">{c.name}</h3>
                <p className="mt-1 text-sm opacity-70">{c.headline}</p>
                <div className="my-5 border-t-2 border-dashed border-forest-900/15 group-hover:border-white/20" />
                <div className="flex items-end justify-between text-sm">
                  <span>
                    <span className="block text-[10px] uppercase tracking-widest opacity-60">{c.stats[0].label}</span>
                    <span className="font-bold">{c.stats[0].value}</span>
                  </span>
                  <ArrowRight className="size-5 text-coral-500 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
            <Link to="/eligibility" className="flex flex-col justify-between rounded-3xl bg-coral-500 p-6 text-white transition hover:-translate-y-1">
              <span className="font-mono text-xs uppercase tracking-widest">Not sure?</span>
              <span className="mt-6 font-display text-2xl font-extrabold leading-tight">Find the country that fits your profile in 60 seconds →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* COACHING */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2">
        <div className="relative">
          <img
            src={img('/img/coaching.webp', 760, 560)}
            alt="IELTS and PTE coaching classroom"
            width={760}
            height={560}
            loading="lazy"
            className="aspect-[19/14] w-full rounded-[2rem] object-cover"
          />
          <div className="absolute -right-4 -bottom-6 rounded-2xl bg-forest-900 p-5 text-white shadow-xl">
            <p className="font-display text-4xl font-extrabold text-coral-500">79+</p>
            <p className="text-xs uppercase tracking-wider text-forest-100/70">Top PTE score this month</p>
          </div>
        </div>
        <div>
          <Eyebrow>IELTS & PTE Coaching</Eyebrow>
          <h2 className="mt-4 text-4xl font-extrabold text-forest-900 md:text-5xl">Your score is your passport. Let’s raise it.</h2>
          <p className="mt-5 text-lg text-forest-900/70">
            Small batches, experienced trainers, a dedicated PTE computer lab and weekly mock tests — right here in Sangaria.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              { icon: Headphones, t: 'Real-exam PTE lab' },
              { icon: Timer, t: 'Weekly timed mocks' },
              { icon: Award, t: 'Band-score feedback' },
              { icon: BadgeCheck, t: 'Free demo class' },
            ].map(({ icon: Icon, t }) => (
              <li key={t} className="flex items-center gap-3 rounded-2xl bg-white p-4 font-semibold ring-1 ring-forest-900/10">
                <Icon className="size-5 text-coral-500" /> {t}
              </li>
            ))}
          </ul>
          <Link to="/coaching" className="mt-8 inline-flex rounded-full bg-forest-900 px-7 py-4 font-bold text-white transition hover:bg-forest-700">
            View batches & fees →
          </Link>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-forest-900 bg-grain py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <Eyebrow light>How it works</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-4xl font-extrabold md:text-5xl">Four steps from Sangaria to your dream destination.</h2>
          <ol className="mt-14 grid gap-6 md:grid-cols-4">
            {steps.map((s) => (
              <li key={s.n} className="relative rounded-3xl border border-white/10 bg-white/5 p-7">
                <span className="font-display text-6xl font-extrabold text-coral-500/90">{s.n}</span>
                <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-forest-100/70">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* RECENT APPROVALS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>Fresh approvals</Eyebrow>
            <h2 className="mt-4 text-4xl font-extrabold text-forest-900 md:text-5xl">Visas that landed this month.</h2>
          </div>
          <Link to="/success-stories" className="font-bold text-coral-600 hover:underline">
            See all success stories →
          </Link>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {approvals.slice(0, 4).map((a, i) => (
            <ApprovalCard key={a.name} a={a} i={i} />
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-sand/60 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Eyebrow>Testimonials</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-4xl font-extrabold text-forest-900 md:text-5xl">Real students. Real families. Real visas.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t, i) => (
              <TestimonialCard key={t.name} t={t} featured={i === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* UPDATES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>News & Blog</Eyebrow>
            <h2 className="mt-4 text-4xl font-extrabold text-forest-900 md:text-5xl">Latest visa updates.</h2>
          </div>
          <Link to="/updates" className="font-bold text-coral-600 hover:underline">
            All articles →
          </Link>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {posts.slice(0, 3).map((p) => (
            <PostCard key={p.slug} p={p} />
          ))}
        </div>
      </section>

      {/* FAQ + ENQUIRY */}
      <section id="enquiry" className="mx-auto grid max-w-7xl gap-12 px-6 pb-28 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Eyebrow>FAQs</Eyebrow>
          <h2 className="mt-4 text-4xl font-extrabold text-forest-900">Questions we hear every day.</h2>
          <div className="mt-8 divide-y divide-forest-900/10 rounded-3xl bg-white ring-1 ring-forest-900/10">
            {faqs.map((f) => (
              <details key={f.q} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-lg font-bold text-forest-900">
                  {f.q}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-forest-50 text-coral-600 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-forest-900/70">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-forest-900/60">
            <MapPin className="size-4 text-coral-500" /> {site.address}
          </p>
        </div>
        <div className="rounded-[2rem] bg-forest-900 bg-grain p-8 text-white md:p-10">
          <h2 className="text-3xl font-extrabold">Get a free profile evaluation</h2>
          <p className="mt-2 mb-8 text-forest-100/70">Share a few details — a counsellor calls you back within one working day.</p>
          <EnquiryForm source="home" dark />
        </div>
      </section>
    </>
  )
}
