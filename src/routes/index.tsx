import { useState } from 'react'
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
  const [mobileCountry, setMobileCountry] = useState('canada')
  const [mobileVisa, setMobileVisa] = useState('study')
  const [showAllTestimonials, setShowAllTestimonials] = useState(false)
  const [showAllTestimonialsMobile, setShowAllTestimonialsMobile] = useState(false)

  const visibleTestimonialsDesktop = showAllTestimonials ? testimonials : testimonials.slice(0, 3)
  const visibleTestimonialsMobile = showAllTestimonialsMobile ? testimonials : testimonials.slice(0, 2)

  return (
    <>
      {/* ========================================================================= */}
      {/* MOBILE-ONLY VIEW (Phones / Small screens: visible on md:hidden)          */}
      {/* 100% optimized for vertical screens: clean gaps, zero overlapping elements */}
      {/* ========================================================================= */}
      <div className="block min-w-0 overflow-x-clip pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:hidden">
        {/* MOBILE HERO */}
        <section className="relative overflow-hidden bg-forest-900 bg-grain text-white px-4 pt-7 pb-10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-950/70 border border-white/15 px-3 py-1 text-[11px] font-bold text-coral-400">
              📍 Sangaria · Hanumangarh · Since Day 1
            </span>

            <h1 className="mt-4 max-w-[12ch] text-[clamp(2.35rem,11vw,3.25rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
              Pack your bags.
              <br />
              <span className="relative inline-block text-coral-500">
                We’ll handle
                <svg viewBox="0 0 300 20" className="absolute -bottom-1.5 left-0 w-full" aria-hidden>
                  <path d="M2 15 Q 75 2 150 10 T 298 6" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
              <br />
              the visa.
            </h1>

            <p className="mt-4 max-w-[42rem] text-[clamp(0.875rem,3.7vw,1rem)] leading-7 text-forest-100/80">
              Study visas, PR, work permits, tourist visas & IELTS/PTE coaching for Canada, UK, Australia, USA, NZ & Europe — right here in Sangaria.
            </p>

            {/* QUICK COUNTRY & VISA FINDER (Mobile Optimized - No overlap, clear gaps) */}
            <div className="mt-5 rounded-2xl bg-forest-950/80 border border-white/15 p-4 shadow-xl">
              <div className="flex items-center justify-between mb-2.5">
                <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-coral-400">
                  Quick Visa & Country Finder
                </span>
                <span className="text-[10px] text-white/60">Free Evaluation</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-white/70 mb-1">Select Country</label>
                  <div className="relative">
                    <select
                      value={mobileCountry}
                      onChange={(e) => setMobileCountry(e.target.value)}
                      className="min-h-11 w-full rounded-xl bg-white text-forest-900 text-xs font-bold py-2.5 pl-2.5 pr-7 shadow-sm outline-none border border-forest-900/10 appearance-none focus-visible:ring-2 focus-visible:ring-coral-400"
                    >
                      <option value="canada">🇨🇦 Canada</option>
                      <option value="uk">🇬🇧 UK</option>
                      <option value="australia">🇦🇺 Australia</option>
                      <option value="usa">🇺🇸 USA</option>
                      <option value="new-zealand">🇳🇿 New Zealand</option>
                      <option value="germany">🇩🇪 Germany</option>
                      <option value="europe">🇪🇺 Europe</option>
                    </select>
                    <span className="pointer-events-none absolute right-2 top-2.5 text-[10px] text-forest-900/60">▼</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/70 mb-1">Select Visa</label>
                  <div className="relative">
                    <select
                      value={mobileVisa}
                      onChange={(e) => setMobileVisa(e.target.value)}
                      className="min-h-11 w-full rounded-xl bg-white text-forest-900 text-xs font-bold py-2.5 pl-2.5 pr-7 shadow-sm outline-none border border-forest-900/10 appearance-none focus-visible:ring-2 focus-visible:ring-coral-400"
                    >
                      <option value="study">🎓 Study Visa</option>
                      <option value="pr">🏛️ PR / Immigration</option>
                      <option value="work">💼 Work Permit</option>
                      <option value="tourist">✈️ Tourist Visa</option>
                      <option value="coaching">📚 IELTS / PTE</option>
                    </select>
                    <span className="pointer-events-none absolute right-2 top-2.5 text-[10px] text-forest-900/60">▼</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <Link
                  to="/countries/$slug"
                  params={{ slug: mobileCountry }}
                  className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-coral-500 px-3 py-2.5 text-center text-xs font-extrabold text-white shadow-md transition active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-300 focus-visible:ring-offset-2 focus-visible:ring-offset-forest-950"
                >
                  View {countries.find((c) => c.slug === mobileCountry)?.name ?? 'Country'} Guide <ArrowRight className="size-3.5" />
                </Link>
                <Link
                  to="/eligibility"
                  className="flex min-h-11 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-3 py-2.5 text-center text-xs font-bold text-white transition active:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-300"
                >
                  Eligibility
                </Link>
              </div>
            </div>

            {/* 2x2 STATS (Crisp, clean mobile grid) */}
            <dl className="mt-5 grid grid-cols-2 gap-2">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                  <dt className="font-display text-2xl font-extrabold text-white">{s.value}</dt>
                  <dd className="mt-0.5 text-[10px] uppercase tracking-wider text-forest-100/70">{s.label}</dd>
                </div>
              ))}
            </dl>

            {/* MOBILE HERO IMAGE WITH PROPERLY DOCKED BADGES */}
            <div className="relative mt-6 w-full overflow-hidden rounded-2xl border border-white/15 shadow-2xl">
              <img
                src={img('/img/hero.webp', 640, 720)}
                alt="Student holding passport and university acceptance letter"
                width={640}
                height={720}
                className="aspect-[4/3] w-full object-cover"
              />

              {/* Stamp safely locked at top-right with margin */}
              <div className="absolute top-3 right-3 grid size-16 place-items-center rounded-full border-2 border-dashed border-coral-400 bg-forest-950/90 text-center font-mono text-[9px] font-bold uppercase leading-tight tracking-wider text-coral-300 backdrop-blur shadow-lg">
                Visa
                <br />
                Approved
                <br />✓
              </div>

              {/* Boarding pass docked neatly at bottom with no overlap */}
              <div className="absolute bottom-0 inset-x-0 bg-cream/95 backdrop-blur-md p-3 text-forest-900 border-t border-forest-900/10">
                <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-forest-900/60">
                  <span>BOARDING PASS</span>
                  <span>BEI · SANGARIA</span>
                </div>
                <div className="mt-1 flex items-center justify-between font-display text-sm font-extrabold">
                  <span>SNG <span className="text-[10px] font-normal text-forest-900/60">Sangaria</span></span>
                  <span className="text-coral-500 font-mono text-xs">- - ✈ - -</span>
                  <span>YYZ <span className="text-[10px] font-normal text-forest-900/60">Toronto</span></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MOBILE JUMP TO BAR (Touch scrollable, strict gaps, zero squishing) */}
        <div className="sticky top-[61px] z-30 overflow-x-auto border-y border-white/10 bg-forest-950/95 px-4 py-2.5 pb-[calc(.625rem+env(safe-area-inset-bottom))] scrollbar-none backdrop-blur-md supports-[backdrop-filter]:bg-forest-950/80">
          <div className="flex items-center gap-2 w-max">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-coral-400 shrink-0">JUMP:</span>
            <a href="#services-m" className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white active:bg-coral-500">✈️ Services</a>
            <a href="#destinations-m" className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white active:bg-coral-500">🌍 Countries</a>
            <a href="#coaching-m" className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white active:bg-coral-500">📚 IELTS & PTE</a>
            <a href="#approvals-m" className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white active:bg-coral-500">🎉 Visas</a>
            <a href="#reviews-m" className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white active:bg-coral-500">⭐ Reviews</a>
            <a href="#enquiry-m" className="shrink-0 rounded-full bg-coral-500 px-3 py-1 text-xs font-bold text-white shadow-sm">🔴 Free Enquiry</a>
          </div>
        </div>

        {/* APPROVALS MARQUEE (MOBILE) */}
        {settings.approvalsMarqueeEnabled && (
          <section className="overflow-hidden border-b border-forest-900/10 bg-coral-500 py-2.5 text-white">
            <div className="flex w-max motion-safe:animate-marquee gap-8 whitespace-nowrap font-display text-sm font-bold">
              {[...approvals, ...approvals].map((a, i) => (
                <span key={i} className="flex items-center gap-2">
                  <CountryFlag
                    flag={a.flag}
                    country={a.country}
                    className="shrink-0 inline-block rounded-[2px]"
                    style={{ width: '24px', height: '16px', minWidth: '24px', maxWidth: '24px' }}
                  />
                  <span>{a.name} — {a.visa}</span>
                  <span className="text-white/50">✦</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* SERVICES (MOBILE: Clean 2-column tiles) */}
        <section id="services-m" className="scroll-mt-28 px-4 py-12">
          <div className="flex items-end justify-between">
            <div>
              <Eyebrow>What we do</Eyebrow>
              <h2 className="mt-2 max-w-[22ch] text-2xl font-extrabold leading-tight tracking-tight text-forest-900">Every visa handled by one team.</h2>
            </div>
            <Link to="/visas" className="text-xs font-bold text-coral-600 hover:underline shrink-0">
              All visas →
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            {visaServices.map((s, i) => (
              <Link
                key={s.slug}
                to="/visas"
                hash={s.slug}
                className={
                  'flex flex-col justify-between rounded-2xl p-3.5 transition ' +
                  (i === 0
                    ? 'bg-forest-900 text-white shadow-md'
                    : 'bg-white ring-1 ring-forest-900/10 text-forest-900 active:bg-forest-50')
                }
              >
                <div>
                  <span className={'grid size-9 place-items-center rounded-xl ' + (i === 0 ? 'bg-coral-500 text-white' : 'bg-forest-50 text-forest-700')}>
                    <ServiceIcon name={s.icon} className="size-4" />
                  </span>
                  <h3 className="mt-3 text-sm font-extrabold leading-tight">{s.title}</h3>
                  <p className={'mt-1 text-[11px] leading-tight line-clamp-2 ' + (i === 0 ? 'text-forest-100/75' : 'text-forest-900/65')}>
                    {s.summary}
                  </p>
                </div>
                <div className="mt-3 text-right font-mono text-[10px] opacity-40">0{i + 1}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* DESTINATIONS (MOBILE: Clean 2-column grid, NO overlaps, strict flag sizes) */}
        <section id="destinations-m" className="scroll-mt-28 bg-sand/60 bg-dots px-4 py-12">
          <Eyebrow>Destinations</Eyebrow>
          <h2 className="mt-2 max-w-[22ch] text-2xl font-extrabold leading-tight tracking-tight text-forest-900">Choose where your next chapter begins.</h2>
          <p className="mt-1 text-xs text-forest-900/70">Top study abroad countries with full guidance in Sangaria.</p>

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            {countries.map((c) => (
              <Link
                key={c.slug}
                to="/countries/$slug"
                params={{ slug: c.slug }}
                className="group flex min-w-0 flex-col justify-between overflow-hidden rounded-2xl bg-cream p-3.5 shadow-sm ring-1 ring-forest-900/10 transition active:bg-forest-900 active:text-white"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <CountryFlag
                      code={c.code}
                      flag={c.flag}
                      country={c.name}
                      className="rounded shadow-sm shrink-0"
                      style={{ width: '36px', height: '24px', minWidth: '36px', maxWidth: '36px' }}
                    />
                    <span className="font-mono text-xs font-bold text-forest-900/40 group-active:text-white/40">{c.code}</span>
                  </div>
                  <h3 className="mt-2 text-[15px] font-extrabold text-forest-900 group-active:text-white leading-tight">{c.name}</h3>
                  <p className="mt-0.5 text-[11px] text-forest-900/65 group-active:text-white/70 line-clamp-2 leading-tight">{c.headline}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-forest-900/10 group-active:border-white/15 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-coral-600 group-active:text-coral-300">{c.stats[0].value}</span>
                  <ArrowRight className="size-3.5 text-coral-500 group-active:text-coral-300" />
                </div>
              </Link>
            ))}

            {/* 8th Slot: NOT SURE? Card */}
            <Link
              to="/eligibility"
              className="flex flex-col justify-between rounded-2xl bg-coral-500 p-3.5 text-white shadow-sm active:bg-coral-600 transition"
            >
              <div>
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-white/80">NOT SURE?</span>
                <h3 className="mt-2 text-[15px] font-extrabold leading-tight">Find Your Fit</h3>
                <p className="mt-0.5 text-[11px] text-white/85 leading-tight">Free 60-second profile assessment</p>
              </div>
              <div className="mt-3 pt-2 border-t border-white/20 flex items-center justify-between font-bold text-xs">
                <span>Check now</span>
                <ArrowRight className="size-3.5" />
              </div>
            </Link>
          </div>
        </section>

        {/* COACHING (MOBILE: Image with neatly contained badge, 2x2 features) */}
        <section id="coaching-m" className="scroll-mt-28 px-4 py-12">
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <img
              src={img('/img/coaching.webp', 640, 420)}
              alt="IELTS and PTE coaching classroom"
              width={640}
              height={420}
              loading="lazy"
              className="aspect-[16/10] w-full object-cover"
            />
            {/* PTE 79+ badge locked inside photo corner with backdrop blur */}
            <div className="absolute bottom-2.5 right-2.5 rounded-xl bg-forest-900/90 backdrop-blur-md px-3 py-1.5 text-white shadow-md">
              <span className="font-display text-lg font-extrabold text-coral-400">79+</span>
              <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider text-forest-100/80">PTE Score</span>
            </div>
          </div>

          <div className="mt-5">
            <Eyebrow>IELTS & PTE Coaching</Eyebrow>
            <h2 className="mt-2 max-w-[22ch] text-2xl font-extrabold leading-tight tracking-tight text-forest-900">Your score is your passport. Let’s raise it.</h2>
            <p className="mt-2 text-xs leading-relaxed text-forest-900/70">
              Small batches, experienced trainers, a dedicated PTE computer lab and weekly mock tests — right here in Sangaria.
            </p>

            <ul className="mt-4 grid grid-cols-2 gap-2">
              {[
                { icon: Headphones, t: 'Real PTE lab' },
                { icon: Timer, t: 'Timed mocks' },
                { icon: Award, t: 'Band feedback' },
                { icon: BadgeCheck, t: 'Free demo class' },
              ].map(({ icon: Icon, t }) => (
                <li key={t} className="flex items-center gap-2 rounded-xl bg-white p-2.5 text-xs font-semibold text-forest-900 ring-1 ring-forest-900/10">
                  <Icon className="size-4 shrink-0 text-coral-500" />
                  <span className="truncate">{t}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/coaching"
              className="mt-5 block w-full rounded-full bg-forest-900 py-3 text-center text-xs font-bold text-white transition active:bg-forest-800"
            >
              View batches & fees →
            </Link>
          </div>
        </section>

        {/* PROCESS (MOBILE: 2x2 grid of 4 steps) */}
        <section className="bg-forest-900 bg-grain px-4 py-12 text-white">
          <Eyebrow light>How it works</Eyebrow>
          <h2 className="mt-2 max-w-[22ch] text-2xl font-extrabold leading-tight tracking-tight">Four steps to your destination.</h2>

          <ol className="mt-5 grid grid-cols-2 gap-2.5">
            {steps.map((s) => (
              <li key={s.n} className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                <span className="font-display text-2xl font-extrabold text-coral-400">{s.n}</span>
                <h3 className="mt-1 text-sm font-bold text-white">{s.title}</h3>
                <p className="mt-1 text-[11px] leading-tight text-forest-100/70">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* RECENT APPROVALS (MOBILE) */}
        <section id="approvals-m" className="scroll-mt-28 px-4 py-12">
          <div className="flex items-end justify-between">
            <div>
              <Eyebrow>Fresh approvals</Eyebrow>
              <h2 className="mt-2 max-w-[22ch] text-2xl font-extrabold leading-tight tracking-tight text-forest-900">Visas that landed this month.</h2>
            </div>
            <Link to="/success-stories" className="text-xs font-bold text-coral-600 hover:underline shrink-0">
              See all →
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            {approvals.slice(0, 4).map((a, i) => (
              <ApprovalCard key={a.name} a={a} i={i} />
            ))}
          </div>
        </section>

        {/* TESTIMONIALS (MOBILE: Clean cards + Show More Reviews Button) */}
        <section id="reviews-m" className="scroll-mt-28 bg-sand/60 px-4 py-12">
          <Eyebrow>Testimonials</Eyebrow>
          <h2 className="mt-2 max-w-[22ch] text-2xl font-extrabold leading-tight tracking-tight text-forest-900">Real students. Real visas.</h2>

          <div className="mt-5 grid gap-3">
            {visibleTestimonialsMobile.map((t, i) => (
              <TestimonialCard key={t.name} t={t} featured={i === 0} />
            ))}
          </div>

          {testimonials.length > 2 && (
            <button
              type="button"
              onClick={() => setShowAllTestimonialsMobile(!showAllTestimonialsMobile)}
              className="mt-4 w-full rounded-full border border-forest-900/15 bg-white py-3 text-xs font-bold text-forest-900 shadow-sm active:bg-forest-50 transition"
            >
              {showAllTestimonialsMobile
                ? 'Show Fewer Reviews ↑'
                : `Show More Reviews (${testimonials.length - 2}+ और देखें) ↓`}
            </button>
          )}
        </section>

        {/* NEWS & BLOG (MOBILE: 3 articles + All updates link) */}
        <section className="px-4 py-12">
          <div className="flex items-end justify-between">
            <div>
              <Eyebrow>News & Blog</Eyebrow>
              <h2 className="mt-2 max-w-[22ch] text-2xl font-extrabold leading-tight tracking-tight text-forest-900">Latest visa updates.</h2>
            </div>
            <Link to="/updates" className="text-xs font-bold text-coral-600 hover:underline shrink-0">
              All articles →
            </Link>
          </div>

          <div className="mt-5 grid gap-3">
            {posts.slice(0, 3).map((p) => (
              <PostCard key={p.slug} p={p} />
            ))}
          </div>
        </section>

        {/* FAQ + ENQUIRY (MOBILE) */}
        <section id="enquiry-m" className="scroll-mt-28 px-4 pb-20">
          <div>
            <Eyebrow>FAQs</Eyebrow>
            <h2 className="mt-2 max-w-[22ch] text-2xl font-extrabold leading-tight tracking-tight text-forest-900">Questions we hear every day.</h2>
            <div className="mt-4 divide-y divide-forest-900/10 rounded-2xl bg-white ring-1 ring-forest-900/10">
              {faqs.map((f) => (
                <details key={f.q} className="group p-4 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 font-display text-sm font-bold text-forest-900">
                    {f.q}
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-forest-50 text-coral-600 transition group-open:rotate-45 text-xs">+</span>
                  </summary>
                  <p className="mt-2 text-xs leading-relaxed text-forest-900/70">{f.a}</p>
                </details>
              ))}
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-forest-900/60">
              <MapPin className="size-3.5 text-coral-500 shrink-0" /> {site.address}
            </p>
          </div>

          <div className="mt-8 rounded-2xl bg-forest-900 bg-grain p-5 text-white shadow-xl">
            <h2 className="text-xl font-extrabold">Free Profile Evaluation</h2>
            <p className="mt-1 mb-5 text-xs text-forest-100/70">Share details — a counsellor calls you back within one working day.</p>
            <EnquiryForm source="home-mobile" dark />
          </div>
        </section>

        {/* MOBILE CONVERSION BAR: thumb-friendly, safe-area aware */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-forest-950/95 px-3 py-2.5 shadow-[0_-8px_30px_rgba(0,0,0,.18)] backdrop-blur-md supports-[backdrop-filter]:bg-forest-950/80 [padding-bottom:calc(.625rem+env(safe-area-inset-bottom))] md:hidden">
          <div className="mx-auto flex max-w-lg items-center gap-2">
            <Link to="/contact" className="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-white/20 px-3 text-xs font-bold text-white transition active:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-300">
              Talk to counsellor
            </Link>
            <Link to="/eligibility" className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-coral-500 px-3 text-xs font-extrabold text-white shadow-lg transition active:bg-coral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-300 focus-visible:ring-offset-2 focus-visible:ring-offset-forest-950">
              Check eligibility <ArrowRight className="ml-1 size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP-ONLY VIEW (Laptops / Desktops: visible on hidden md:block)       */}
      {/* Spacious 3- and 4-column layout that user confirmed is working great on PC */}
      {/* ========================================================================= */}
      <div className="hidden min-w-0 overflow-x-clip md:block">
        {/* DESKTOP HERO */}
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
              <div className="absolute top-6 -right-3 grid size-28 motion-safe:animate-stamp place-items-center rounded-full border-[3px] border-dashed border-coral-500 bg-forest-950/80 text-center font-mono text-[11px] font-bold uppercase leading-tight tracking-widest text-coral-400 backdrop-blur [animation-delay:600ms] sm:-right-6">
                Visa
                <br />
                Approved
                <br />✓
              </div>
            </div>
          </div>
        </section>

        {/* DESKTOP JUMP TO BAR */}
        <div className="border-b border-forest-900/10 bg-forest-950 py-3 text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-sm">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-coral-400">JUMP TO:</span>
            <div className="flex items-center gap-6 font-semibold">
              <a href="#services-desktop" className="hover:text-coral-400 transition">✈️ Services</a>
              <a href="#destinations-desktop" className="hover:text-coral-400 transition">🌍 Countries</a>
              <a href="#coaching-desktop" className="hover:text-coral-400 transition">📚 IELTS & PTE</a>
              <a href="#approvals-desktop" className="hover:text-coral-400 transition">🎉 Recent Visas</a>
              <a href="#reviews-desktop" className="hover:text-coral-400 transition">⭐ Reviews</a>
            </div>
            <Link to="/contact" className="rounded-full bg-coral-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-coral-600 transition">
              🔴 Free Enquiry
            </Link>
          </div>
        </div>

        {/* DESKTOP APPROVALS MARQUEE */}
        {settings.approvalsMarqueeEnabled && (
          <section className="overflow-hidden border-y border-forest-900/10 bg-coral-500 py-4 text-white">
            <div className="flex w-max motion-safe:animate-marquee gap-10 whitespace-nowrap font-display text-lg font-bold">
              {[...approvals, ...approvals].map((a, i) => (
                <span key={i} className="flex items-center gap-3">
                  <CountryFlag
                    flag={a.flag}
                    country={a.country}
                    className="shrink-0 inline-block rounded-[3px]"
                    style={{ width: '28px', height: '18px', minWidth: '28px', maxWidth: '28px' }}
                  />
                  {a.name} — {a.visa} approved <span className="text-white/50">✦</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* DESKTOP SERVICES */}
        <section id="services-desktop" className="scroll-mt-24 mx-auto max-w-7xl px-6 py-24">
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

        {/* DESKTOP COUNTRIES */}
        <section id="destinations-desktop" className="scroll-mt-24 bg-sand/60 bg-dots py-24">
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
                    <CountryFlag
                      code={c.code}
                      flag={c.flag}
                      country={c.name}
                      className="rounded shadow-sm shrink-0"
                      style={{ width: '48px', height: '32px', minWidth: '48px', maxWidth: '48px' }}
                    />
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

        {/* DESKTOP COACHING */}
        <section id="coaching-desktop" className="scroll-mt-24 mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2">
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

        {/* DESKTOP PROCESS */}
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

        {/* DESKTOP RECENT APPROVALS */}
        <section id="approvals-desktop" className="scroll-mt-24 mx-auto max-w-7xl px-6 py-24">
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

        {/* DESKTOP TESTIMONIALS */}
        <section id="reviews-desktop" className="scroll-mt-24 bg-sand/60 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <Eyebrow>Testimonials</Eyebrow>
            <h2 className="mt-4 max-w-2xl text-4xl font-extrabold text-forest-900 md:text-5xl">Real students. Real families. Real visas.</h2>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {visibleTestimonialsDesktop.map((t, i) => (
                <TestimonialCard key={t.name} t={t} featured={i === 1} />
              ))}
            </div>

            {testimonials.length > 3 && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => setShowAllTestimonials(!showAllTestimonials)}
                  className="rounded-full border border-forest-900/20 bg-white px-7 py-3.5 font-bold text-forest-900 shadow-sm transition hover:bg-forest-900 hover:text-white"
                >
                  {showAllTestimonials ? 'Show Fewer Reviews ↑' : `Show More Reviews (${testimonials.length - 3}+ और देखें) ↓`}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* DESKTOP UPDATES (News & Blog) */}
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

        {/* DESKTOP FAQ + ENQUIRY */}
        <section id="enquiry" className="scroll-mt-24 mx-auto grid max-w-7xl gap-12 px-6 pb-28 lg:grid-cols-[1fr_1.1fr]">
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
      </div>
    </>
  )
}
