import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Award, BadgeCheck, Headphones, MapPin, Sparkles, Timer } from 'lucide-react'
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
      {/* HERO */}
      <section className="relative overflow-hidden bg-forest-900 bg-grain text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pt-12 pb-20 sm:gap-14 sm:pt-16 sm:pb-24 lg:grid-cols-[1.15fr_1fr] lg:pt-24">
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
            <p className="mt-6 max-w-xl animate-rise text-base leading-relaxed text-forest-100/80 [animation-delay:160ms] sm:text-lg">
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
            <dl className="mt-10 grid max-w-xl grid-cols-2 gap-4 sm:mt-14 sm:grid-cols-4 sm:gap-6">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/5 p-3 sm:bg-transparent sm:p-0">
                  <dt className="font-display text-2xl font-extrabold text-white sm:text-3xl">{s.value}</dt>
                  <dd className="mt-0.5 text-[11px] uppercase tracking-wider text-forest-100/60 sm:text-xs">{s.label}</dd>
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
            <div className="absolute -bottom-8 -left-3 w-[84%] rounded-2xl bg-cream p-3.5 text-forest-900 shadow-2xl sm:-bottom-10 sm:-left-12 sm:w-[78%] sm:p-4">
              <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-forest-900/60 sm:text-[10px]">
                <span>Boarding pass</span>
                <span>BEI · 2026</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between font-display">
                <div>
                  <p className="text-2xl font-extrabold sm:text-3xl">SNG</p>
                  <p className="text-[10px] text-forest-900/60 sm:text-[11px]">Sangaria</p>
                </div>
                <div className="flex-1 px-2 text-center text-xs font-bold text-coral-500 sm:text-sm">- - ✈ - -</div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold sm:text-3xl">YYZ</p>
                  <p className="text-[10px] text-forest-900/60 sm:text-[11px]">Toronto</p>
                </div>
              </div>
            </div>
            <div className="absolute top-4 -right-2 grid size-24 animate-stamp place-items-center rounded-full border-[3px] border-dashed border-coral-500 bg-forest-950/80 text-center font-mono text-[10px] font-bold uppercase leading-tight tracking-widest text-coral-400 backdrop-blur [animation-delay:600ms] sm:top-6 sm:-right-6 sm:size-28 sm:text-[11px]">
              Visa
              <br />
              Approved
              <br />✓
            </div>
          </div>
        </div>
      </section>

      {/* QUICK JUMP PILLS BAR (Mobile Friendly Sticky Jump) */}
      <nav className="sticky top-0 z-30 border-y border-forest-900/10 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto whitespace-nowrap text-xs font-bold no-scrollbar">
          <span className="hidden text-[10px] font-extrabold uppercase tracking-widest text-forest-900/40 sm:inline">Jump to:</span>
          <a href="#services" className="rounded-full bg-forest-50 px-3.5 py-1.5 text-forest-900 transition hover:bg-forest-900 hover:text-white">✈️ Services</a>
          <a href="#destinations" className="rounded-full bg-forest-50 px-3.5 py-1.5 text-forest-900 transition hover:bg-forest-900 hover:text-white">🌍 Countries</a>
          <a href="#coaching" className="rounded-full bg-forest-50 px-3.5 py-1.5 text-forest-900 transition hover:bg-forest-900 hover:text-white">📚 IELTS & PTE</a>
          <a href="#approvals" className="rounded-full bg-forest-50 px-3.5 py-1.5 text-forest-900 transition hover:bg-forest-900 hover:text-white">🎉 Recent Visas</a>
          <a href="#testimonials" className="rounded-full bg-forest-50 px-3.5 py-1.5 text-forest-900 transition hover:bg-forest-900 hover:text-white">⭐ Reviews</a>
          <a href="#enquiry" className="rounded-full bg-coral-500 px-4 py-1.5 text-white shadow-sm transition hover:bg-coral-600">📝 Free Enquiry</a>
        </div>
      </nav>

      {/* APPROVALS MARQUEE */}
      {settings.approvalsMarqueeEnabled && (
        <section className="overflow-hidden border-b border-forest-900/10 bg-coral-500 py-3 text-white sm:py-4">
          <div className="flex w-max animate-marquee gap-8 whitespace-nowrap font-display text-base font-bold sm:gap-10 sm:text-lg">
            {[...approvals, ...approvals].map((a, i) => (
              <span key={i} className="flex items-center gap-2.5">
                <CountryFlag flag={a.flag} country={a.country} className="inline-block h-3.5 w-5 shrink-0 sm:h-4 sm:w-6" /> {a.name} — {a.visa} approved <span className="text-white/50">✦</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* SERVICES */}
      <section id="services" className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Eyebrow>What we do</Eyebrow>
            <h2 className="mt-3 max-w-2xl text-3xl font-extrabold text-forest-900 sm:text-4xl md:text-5xl">Every kind of visa, handled by one trusted team.</h2>
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
              <p className={'mt-2.5 text-sm sm:text-base ' + (i === 0 ? 'text-forest-100/75' : 'text-forest-900/65')}>{s.summary}</p>
              <span className="absolute top-6 right-6 font-mono text-xs opacity-40 sm:top-8 sm:right-8">0{i + 1}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* COUNTRIES (Swipeable Carousel on Mobile, Grid on Desktop) */}
      <section id="destinations" className="bg-sand/60 bg-dots py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <Eyebrow>Destinations</Eyebrow>
              <h2 className="mt-3 max-w-3xl text-3xl font-extrabold text-forest-900 sm:text-4xl md:text-5xl">Choose where your next chapter begins.</h2>
            </div>
            <span className="text-xs font-bold text-coral-600 sm:hidden">Swipe ➔</span>
          </div>
          
          <div className="mt-8 flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:pb-0 lg:grid-cols-4 no-scrollbar">
            {countries.map((c) => (
              <Link
                key={c.slug}
                to="/countries/$slug"
                params={{ slug: c.slug }}
                className="group relative flex w-[78vw] shrink-0 snap-center flex-col rounded-3xl bg-cream p-6 ring-1 ring-forest-900/10 transition hover:-translate-y-1 hover:bg-forest-900 hover:text-white sm:w-auto sm:shrink"
              >
                <div className="flex items-center justify-between">
                  <CountryFlag code={c.code} flag={c.flag} country={c.name} className="h-9 w-12 shrink-0 shadow-sm sm:h-10 sm:w-14" />
                  <span className="font-mono text-xl font-bold text-forest-900/20 group-hover:text-white/20 sm:text-2xl">{c.code}</span>
                </div>
                <h3 className="mt-5 text-xl font-bold sm:text-2xl">{c.name}</h3>
                <p className="mt-1 text-xs opacity-70 sm:text-sm">{c.headline}</p>
                <div className="my-4 border-t-2 border-dashed border-forest-900/15 group-hover:border-white/20 sm:my-5" />
                <div className="flex items-end justify-between text-xs sm:text-sm">
                  <span>
                    <span className="block text-[9px] uppercase tracking-widest opacity-60 sm:text-[10px]">{c.stats[0].label}</span>
                    <span className="font-bold">{c.stats[0].value}</span>
                  </span>
                  <ArrowRight className="size-4 text-coral-500 transition group-hover:translate-x-1 sm:size-5" />
                </div>
              </Link>
            ))}
            <Link to="/eligibility" className="flex w-[78vw] shrink-0 snap-center flex-col justify-between rounded-3xl bg-coral-500 p-6 text-white transition hover:-translate-y-1 sm:w-auto sm:shrink">
              <span className="font-mono text-xs uppercase tracking-widest">Not sure?</span>
              <span className="mt-4 font-display text-xl font-extrabold leading-tight sm:mt-6 sm:text-2xl">Find the country that fits your profile in 60 seconds →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* COACHING */}
      <section id="coaching" className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 sm:gap-14 sm:py-24 lg:grid-cols-2">
        <div className="relative">
          <img
            src={img('/img/coaching.webp', 760, 560)}
            alt="IELTS and PTE coaching classroom in Sangaria"
            width={760}
            height={560}
            loading="lazy"
            className="aspect-[19/14] w-full rounded-[2rem] object-cover"
          />
          <div className="absolute -bottom-4 right-2 rounded-2xl bg-forest-900 p-4 text-white shadow-xl sm:-bottom-6 sm:-right-4 sm:p-5">
            <p className="font-display text-3xl font-extrabold text-coral-500 sm:text-4xl">79+</p>
            <p className="text-[11px] uppercase tracking-wider text-forest-100/70 sm:text-xs">Top PTE score this month</p>
          </div>
        </div>
        <div>
          <Eyebrow>IELTS & PTE Coaching</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold text-forest-900 sm:text-4xl md:text-5xl">Your score is your passport. Let’s raise it.</h2>
          <p className="mt-4 text-base text-forest-900/70 sm:text-lg">
            Small batches, experienced trainers, a dedicated PTE computer lab and weekly mock tests — right here in Sangaria.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4">
            {[
              { icon: Headphones, t: 'Real PTE lab' },
              { icon: Timer, t: 'Timed mocks' },
              { icon: Award, t: 'Band feedback' },
              { icon: BadgeCheck, t: 'Free demo class' },
            ].map(({ icon: Icon, t }) => (
              <li key={t} className="flex items-center gap-2.5 rounded-2xl bg-white p-3.5 text-xs font-semibold text-forest-900 ring-1 ring-forest-900/10 sm:p-4 sm:text-sm">
                <Icon className="size-4 text-coral-500 sm:size-5" /> {t}
              </li>
            ))}
          </ul>
          <Link to="/coaching" className="mt-7 inline-flex rounded-full bg-forest-900 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-forest-700 sm:mt-8 sm:px-7 sm:py-4 sm:text-base">
            View batches & fees →
          </Link>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-forest-900 bg-grain py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Eyebrow light>How it works</Eyebrow>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold sm:text-4xl md:text-5xl">Four steps from Sangaria to your dream destination.</h2>
          <ol className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6 md:grid-cols-4">
            {steps.map((s) => (
              <li key={s.n} className="relative rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
                <span className="font-display text-5xl font-extrabold text-coral-500/90 sm:text-6xl">{s.n}</span>
                <h3 className="mt-3 text-lg font-bold sm:mt-4 sm:text-xl">{s.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-forest-100/70 sm:mt-2 sm:text-sm">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* RECENT APPROVALS (Swipeable on Mobile) */}
      <section id="approvals" className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <div className="flex items-end justify-between">
          <div>
            <Eyebrow>Fresh approvals</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold text-forest-900 sm:text-4xl md:text-5xl">Visas that landed this month.</h2>
          </div>
          <Link to="/success-stories" className="text-sm font-bold text-coral-600 hover:underline">
            All stories →
          </Link>
        </div>
        <div className="mt-8 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:pb-0 lg:grid-cols-4 no-scrollbar">
          {approvals.slice(0, 4).map((a, i) => (
            <div key={a.name} className="w-[75vw] shrink-0 snap-center sm:w-auto sm:shrink">
              <ApprovalCard a={a} i={i} />
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS (Swipeable on Mobile) */}
      <section id="testimonials" className="bg-sand/60 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Eyebrow>Testimonials</Eyebrow>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold text-forest-900 sm:text-4xl md:text-5xl">Real students. Real families. Real visas.</h2>
          <div className="mt-8 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory sm:mt-12 md:grid md:grid-cols-3 sm:overflow-visible sm:pb-0 no-scrollbar">
            {testimonials.slice(0, 3).map((t, i) => (
              <div key={t.name} className="w-[82vw] shrink-0 snap-center md:w-auto md:shrink">
                <TestimonialCard t={t} featured={i === 1} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UPDATES / BLOG */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <div className="flex items-end justify-between">
          <div>
            <Eyebrow>News & Blog</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold text-forest-900 sm:text-4xl md:text-5xl">Latest visa updates.</h2>
          </div>
          <Link to="/updates" className="text-sm font-bold text-coral-600 hover:underline">
            All articles →
          </Link>
        </div>
        <div className="mt-8 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory sm:mt-12 md:grid md:grid-cols-3 sm:overflow-visible sm:pb-0 no-scrollbar">
          {posts.slice(0, 3).map((p) => (
            <div key={p.slug} className="w-[80vw] shrink-0 snap-center md:w-auto md:shrink">
              <PostCard p={p} />
            </div>
          ))}
        </div>
      </section>

      {/* FAQ + ENQUIRY */}
      <section id="enquiry" className="mx-auto grid max-w-7xl gap-10 px-6 pb-24 sm:gap-12 sm:pb-28 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Eyebrow>FAQs</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold text-forest-900 sm:text-4xl">Questions we hear every day.</h2>
          <div className="mt-6 divide-y divide-forest-900/10 rounded-3xl bg-white ring-1 ring-forest-900/10 sm:mt-8">
            {faqs.map((f) => (
              <details key={f.q} className="group p-5 sm:p-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-base font-bold text-forest-900 sm:text-lg">
                  {f.q}
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-forest-50 text-coral-600 transition group-open:rotate-45 sm:size-8">+</span>
                </summary>
                <p className="mt-2.5 text-xs text-forest-900/70 sm:mt-3 sm:text-sm">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs text-forest-900/60 sm:mt-6 sm:text-sm">
            <MapPin className="size-4 shrink-0 text-coral-500" /> {site.address}
          </p>
        </div>
        <div className="rounded-[2rem] bg-forest-900 bg-grain p-6 text-white sm:p-8 md:p-10">
          <div className="flex items-center gap-2 text-coral-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="size-4" /> Quick Enquiry
          </div>
          <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">Get a free profile evaluation</h2>
          <p className="mt-2 mb-6 text-xs text-forest-100/70 sm:mb-8 sm:text-sm">Share your details — our counsellor will contact you on WhatsApp or call.</p>
          <EnquiryForm source="home" dark />
        </div>
      </section>
    </>
  )
}
