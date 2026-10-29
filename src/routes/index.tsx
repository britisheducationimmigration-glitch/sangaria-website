import { useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Award, BadgeCheck, Headphones, MapPin, Timer } from 'lucide-react'
import { ApprovalCard, PostCard, TestimonialCard } from '@/components/Cards'
import { CountryFlag } from '@/components/CountryFlag'
import { BoardingPassGenerator } from '@/components/BoardingPassGenerator'
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

const rotatingWords = [
  { text: 'the visa.', icon: '✈️' },
  { text: 'Canada PR.', icon: '🇨🇦' },
  { text: 'Study Permits.', icon: '🎓' },
  { text: 'UK Degrees.', icon: '🇬🇧' },
  { text: 'IELTS 7.5+.', icon: '📚' },
]

function Home() {
  const { approvals, posts, testimonials, settings } = Route.useLoaderData()
  const [selectedCountry, setSelectedCountry] = useState('canada')
  const [selectedVisa, setSelectedVisa] = useState('study')
  const [showAllTestimonials, setShowAllTestimonials] = useState(false)
  const [showAllTestimonialsMobile, setShowAllTestimonialsMobile] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % rotatingWords.length)
        setFade(true)
      }, 250)
    }, 2800)
    return () => clearInterval(timer)
  }, [])

  const visibleTestimonialsDesktop = showAllTestimonials ? testimonials : testimonials.slice(0, 3)
  const visibleTestimonialsMobile = showAllTestimonialsMobile ? testimonials : testimonials.slice(0, 2)

  return (
    <>
      {/* ========================================================================= */}
      {/* MOBILE-ONLY VIEW (Phones / Small screens: visible on md:hidden)          */}
      {/* ========================================================================= */}
      <div className="block md:hidden">
        {/* MOBILE HERO */}
        <section className="relative overflow-hidden bg-forest-900 bg-grain text-white px-5 pt-8 pb-16">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-950/80 border border-white/20 px-3.5 py-1 text-[11px] font-bold text-coral-400 shadow-sm">
              📍 Sangaria · Hanumangarh · Since Day 1
            </span>

            {/* 3-in-1 Animated Headline (Mobile) */}
            <h1 className="mt-5 text-[2.75rem] font-extrabold leading-[1.03] tracking-tight">
              <span className="inline-block animate-rise">Pack your bags.</span>
              <br />
              <span className="relative inline-block animate-rise [animation-delay:100ms]">
                <span className="bg-gradient-to-r from-amber-300 via-amber-100 to-coral-400 bg-clip-text text-transparent font-extrabold">
                  We’ll handle
                </span>
                <svg viewBox="0 0 300 20" className="absolute -bottom-2 left-0 w-full overflow-visible" aria-hidden>
                  <path
                    d="M2 15 Q 75 2 150 10 T 298 6"
                    fill="none"
                    stroke="#c4515d"
                    strokeWidth="5"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: 320,
                      strokeDashoffset: 0,
                      animation: 'penDraw 1.3s cubic-bezier(0.2, 0.7, 0.2, 1) forwards',
                    }}
                  />
                </svg>
              </span>
              <br />
              <span className="inline-flex items-center gap-2 h-[1.15em] overflow-hidden">
                <span
                  className={
                    'inline-flex items-center gap-2 transition-all duration-300 transform ' +
                    (fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2')
                  }
                >
                  <span className="text-white">{rotatingWords[wordIndex].text}</span>
                  <span className="inline-block text-2xl animate-bounce">
                    {rotatingWords[wordIndex].icon}
                  </span>
                </span>
              </span>
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-forest-100/85">
              Study visas, PR, work permits, tourist visas & IELTS/PTE coaching for Canada, UK, Australia, USA, NZ & Europe — right here in Sangaria.
            </p>

            {/* QUICK COUNTRY & VISA FINDER */}
            <div className="mt-7 rounded-2xl bg-forest-950/90 border border-white/20 p-4 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-coral-400">
                  Visa & Country Finder
                </span>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[9px] font-semibold text-white/70">
                  Free Check
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="min-w-0">
                  <label htmlFor="mobile-country" className="block text-[10px] font-bold text-white/80 mb-1">Country</label>
                  <div className="relative">
                    <select
                      id="mobile-country"
                      aria-label="Select Country"
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full rounded-xl bg-white text-forest-900 text-xs font-bold py-2.5 pl-2.5 pr-7 shadow-sm outline-none border border-forest-900/15 appearance-none truncate"
                    >
                      <option value="canada">🇨🇦 Canada</option>
                      <option value="uk">🇬🇧 UK</option>
                      <option value="australia">🇦🇺 Australia</option>
                      <option value="usa">🇺🇸 USA</option>
                      <option value="new-zealand">🇳🇿 NZ</option>
                      <option value="germany">🇩🇪 Germany</option>
                      <option value="europe">🇪🇺 Europe</option>
                      <option value="">Other</option>
                    </select>
                    <span className="pointer-events-none absolute right-2.5 top-2.5 text-[10px] text-forest-900/60">▼</span>
                  </div>
                </div>

                <div className="min-w-0">
                  <label htmlFor="mobile-visa" className="block text-[10px] font-bold text-white/80 mb-1">Visa Type</label>
                  <div className="relative">
                    <select
                      id="mobile-visa"
                      aria-label="Select Visa Type"
                      value={selectedVisa}
                      onChange={(e) => setSelectedVisa(e.target.value)}
                      className="w-full rounded-xl bg-white text-forest-900 text-xs font-bold py-2.5 pl-2.5 pr-7 shadow-sm outline-none border border-forest-900/15 appearance-none truncate"
                    >
                      <option value="study">Study Visa</option>
                      <option value="pr">Permanent Residency</option>
                      <option value="work">Work Permit</option>
                      <option value="tourist">Tourist Visa</option>
                      <option value="spouse">Spouse Visa</option>
                    </select>
                    <span className="pointer-events-none absolute right-2.5 top-2.5 text-[10px] text-forest-900/60">▼</span>
                  </div>
                </div>
              </div>

              <Link
                to={selectedCountry ? `/destinations/${selectedCountry}` : `/services/${selectedVisa}`}
                className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl bg-coral-500 py-3 text-xs font-bold text-white shadow-md active:bg-coral-600 transition"
              >
                <span>Check Eligibility & Requirements</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {/* Quick CTAs */}
            <div className="mt-6 flex flex-col gap-3">
              <Link
                to="/eligibility"
                className="flex items-center justify-center gap-2 rounded-full bg-coral-500 py-3.5 text-center text-xs font-bold text-white shadow-lg active:bg-coral-600 transition"
              >
                <span>Check Your Eligibility (Free)</span>
                <ArrowRight className="size-4" />
              </Link>
              <a
                href={site.phoneHref}
                className="rounded-full border border-white/20 bg-forest-950/60 py-3 text-center text-xs font-bold text-white active:bg-white/10 transition"
              >
                Call Sangaria Office: {site.phone}
              </a>
            </div>

            {/* Stats Grid */}
            <div className="mt-8 grid grid-cols-2 gap-3 pt-6 border-t border-white/15">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl bg-forest-950/50 border border-white/10 p-3">
                  <p className="font-display text-2xl font-extrabold text-coral-400">{s.value}</p>
                  <p className="text-[11px] text-forest-100/70 font-medium mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Sangaria Office Card */}
            <div className="mt-4 rounded-xl border border-white/15 bg-forest-950/80 p-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-coral-400">📍 Sangaria Office</span>
                <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 font-bold">Open Today</span>
              </div>
              <p className="mt-1 text-[11px] text-forest-100/70">{site.address}</p>
              <p className="text-[10px] text-white/50 mt-0.5">{site.openingHours}</p>
            </div>
          </div>
        </section>

        {/* MOBILE APPROVALS MARQUEE */}
        {settings.approvalsMarqueeEnabled && (
          <section className="overflow-hidden border-b border-forest-900/10 bg-coral-500 py-3 text-white">
            <div className="flex w-max animate-marquee gap-8 whitespace-nowrap text-xs font-bold">
              {[...approvals, ...approvals].map((a, i) => (
                <span key={i} className="flex items-center gap-2">
                  <CountryFlag
                    flag={a.flag}
                    country={a.country}
                    className="shrink-0 inline-block rounded-[2px]"
                    style={{ width: '22px', height: '14px', minWidth: '22px', maxWidth: '22px' }}
                  />
                  {a.name} — {a.visa} <span className="text-white/50">✦</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* MOBILE SERVICES */}
        <section id="services-m" className="px-5 py-20 border-b border-forest-900/10 bg-white">
          <Eyebrow>What we do</Eyebrow>
          <h2 className="mt-2 text-2xl font-extrabold text-forest-900">Visa services we handle</h2>
          <p className="mt-2 text-xs leading-relaxed text-forest-900/70">
            From initial counselling to your flight departure — complete assistance under one roof in Sangaria.
          </p>

          <div className="mt-6 flex flex-col gap-3.5">
            {visaServices.map((v) => (
              <Link
                key={v.slug}
                to={`/services/${v.slug}`}
                className="group flex items-center justify-between rounded-2xl border border-forest-900/10 bg-sand/30 p-4 transition active:bg-sand/60 shadow-sm"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-forest-900 text-coral-400 shadow-sm">
                    <ServiceIcon name={v.icon} className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-extrabold text-forest-900 truncate">{v.title}</h3>
                    <p className="text-[11px] text-forest-900/60 truncate mt-0.5">{v.tagline}</p>
                  </div>
                </div>
                <ArrowRight className="size-4 shrink-0 text-coral-500 transition group-active:translate-x-1 ml-2" />
              </Link>
            ))}
          </div>
        </section>

        {/* MOBILE DESTINATIONS */}
        <section id="destinations-m" className="bg-sand/60 bg-dots px-5 py-20 border-b border-forest-900/10">
          <Eyebrow>Destinations</Eyebrow>
          <h2 className="mt-2 text-2xl font-extrabold text-forest-900">Where would you like to go?</h2>
          <p className="mt-2 text-xs leading-relaxed text-forest-900/70">
            Click any country for eligibility, intake timelines, top universities and visa requirements.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {countries.map((c) => (
              <Link
                key={c.slug}
                to={`/destinations/${c.slug}`}
                className="group flex flex-col justify-between rounded-2xl bg-white p-4 shadow-sm border border-forest-900/10 transition active:scale-[0.98] overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <CountryFlag
                      flag={c.flag}
                      country={c.slug}
                      className="shrink-0 inline-block rounded-[3px]"
                      style={{ width: '32px', height: '21px', minWidth: '32px', maxWidth: '32px' }}
                    />
                    <span className="font-mono text-[9px] font-bold text-coral-600 bg-coral-50 px-1.5 py-0.5 rounded">
                      {c.popularIntakes?.split(',')[0] || 'Open'}
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-extrabold text-forest-900">{c.name}</h3>
                  <p className="mt-0.5 text-[10px] text-forest-900/60 line-clamp-1">{c.popularFor}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-forest-900/5 flex items-center justify-between text-[11px] font-bold text-forest-900">
                  <span>Explore</span>
                  <ArrowRight className="size-3 text-coral-500 group-active:translate-x-0.5 transition" />
                </div>
              </Link>
            ))}

            {/* 8th Slot: NOT SURE? Card */}
            <Link
              to="/eligibility"
              className="flex flex-col justify-between rounded-2xl bg-coral-500 p-4 text-white shadow-md active:bg-coral-600 transition overflow-hidden"
            >
              <div>
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-white/80">NOT SURE?</span>
                <h3 className="mt-2 text-sm font-extrabold leading-tight">Find Your Fit</h3>
                <p className="mt-1 text-[11px] text-white/85 leading-tight">Free 60-second profile assessment</p>
              </div>
              <div className="mt-3.5 pt-2 border-t border-white/20 flex items-center justify-between font-bold text-xs">
                <span>Check now</span>
                <ArrowRight className="size-3.5" />
              </div>
            </Link>
          </div>
        </section>

        {/* 🎫 VIRTUAL BOARDING PASS (Mobile) */}
        <BoardingPassGenerator />

        {/* COACHING SECTION (MOBILE) */}
        <section id="coaching-m" className="px-5 py-20 border-b border-forest-900/10 bg-white">
          <div className="relative overflow-hidden rounded-2xl shadow-lg mb-8">
            <img
              src={img('/img/coaching.webp', 640, 420)}
              alt="IELTS and PTE coaching classroom"
              width={640}
              height={420}
              loading="lazy"
              className="aspect-[16/10] w-full object-cover"
            />
            <div className="absolute bottom-3 right-3 rounded-xl bg-forest-900/90 backdrop-blur-md px-3.5 py-1.5 text-white shadow-md">
              <span className="font-display text-lg font-extrabold text-coral-400">79+</span>
              <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider text-forest-100/80">PTE Score</span>
            </div>
          </div>

          <div>
            <Eyebrow>IELTS & PTE Coaching</Eyebrow>
            <h2 className="mt-2 text-2xl font-extrabold text-forest-900">Your score is your passport. Let’s raise it.</h2>
            <p className="mt-3 text-xs leading-relaxed text-forest-900/70">
              Small batches, experienced trainers, a dedicated PTE computer lab and weekly mock tests — right here in Sangaria.
            </p>

            <ul className="mt-6 grid grid-cols-2 gap-3.5">
              {[
                { icon: Headphones, t: 'Real PTE lab' },
                { icon: Timer, t: 'Timed mocks' },
                { icon: Award, t: 'Band feedback' },
                { icon: BadgeCheck, t: 'Free demo class' },
              ].map(({ icon: Icon, t }) => (
                <li key={t} className="flex items-center gap-2 rounded-xl bg-forest-50/70 p-3 text-xs font-semibold text-forest-900 shadow-sm border border-forest-900/10">
                  <Icon className="size-4 shrink-0 text-coral-500" />
                  <span className="truncate">{t}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/coaching"
              className="mt-8 block w-full rounded-full bg-forest-900 py-4 text-center text-xs font-bold text-white transition active:bg-forest-800 shadow-md"
            >
              Coaching batches & fees →
            </Link>
          </div>
        </section>

        {/* 4-STEP PROCESS (MOBILE) */}
        <section className="bg-forest-900 bg-grain px-5 py-20 text-white">
          <Eyebrow light>How it works</Eyebrow>
          <h2 className="mt-2 text-2xl font-extrabold">Sangaria to your campus: 4 steps</h2>
          <div className="mt-8 flex flex-col gap-6">
            {steps.map((st) => (
              <div key={st.n} className="flex items-start gap-4">
                <span className="font-display text-2xl font-extrabold text-coral-400 shrink-0">{st.n}</span>
                <div>
                  <h3 className="text-sm font-extrabold text-white">{st.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-forest-100/75">{st.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RECENT VISAS (MOBILE) */}
        <section id="approvals-m" className="px-5 py-20 border-b border-forest-900/10 bg-white">
          <div className="flex items-end justify-between">
            <div>
              <Eyebrow>Recent Approvals</Eyebrow>
              <h2 className="mt-2 text-2xl font-extrabold text-forest-900">From our Sangaria office</h2>
            </div>
            <Link to="/approvals" className="text-xs font-bold text-coral-500">View all →</Link>
          </div>
          <div className="mt-6 flex flex-col gap-4">
            {approvals.slice(0, 3).map((a) => (
              <ApprovalCard key={a.id} approval={a} />
            ))}
          </div>
        </section>

        {/* REVIEWS (MOBILE) */}
        <section id="reviews-m" className="bg-sand/60 px-5 py-20 border-b border-forest-900/10">
          <div className="text-center">
            <Eyebrow>Testimonials</Eyebrow>
            <h2 className="mt-2 text-2xl font-extrabold text-forest-900">Loved by students & parents</h2>
            <div className="mt-3 flex items-center justify-center gap-1 text-amber-500 text-lg">
              ★★★★★ <span className="ml-1 text-xs font-bold text-forest-900">4.9 / 5.0 (200+ Reviews)</span>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-4">
            {visibleTestimonialsMobile.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
          {testimonials.length > 2 && (
            <button
              type="button"
              onClick={() => setShowAllTestimonialsMobile(!showAllTestimonialsMobile)}
              className="mt-6 w-full rounded-full border border-forest-900/20 bg-white py-3 text-center text-xs font-bold text-forest-900 shadow-sm transition active:bg-sand/50"
            >
              {showAllTestimonialsMobile ? 'Show less reviews' : `Show all ${testimonials.length} reviews ↓`}
            </button>
          )}
        </section>

        {/* BLOG / NEWS (MOBILE) */}
        <section className="px-5 py-20 border-b border-forest-900/10 bg-white">
          <div className="flex items-end justify-between">
            <div>
              <Eyebrow>Latest Updates</Eyebrow>
              <h2 className="mt-2 text-2xl font-extrabold text-forest-900">News & Guides</h2>
            </div>
            <Link to="/blog" className="text-xs font-bold text-coral-500">Read all →</Link>
          </div>
          <div className="mt-6 flex flex-col gap-4">
            {posts.slice(0, 2).map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>

        {/* ENQUIRY (MOBILE) */}
        <section id="enquiry-m" className="px-5 py-20 bg-forest-900 text-white">
          <Eyebrow light>Free Counselling</Eyebrow>
          <h2 className="mt-2 text-2xl font-extrabold">Book your free profile assessment</h2>
          <p className="mt-2 text-xs leading-relaxed text-forest-100/75">
            Visit our office at Sangaria or request a callback. We reply within 2 business hours.
          </p>
          <div className="mt-6">
            <EnquiryForm source="home-mobile" dark />
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP-ONLY VIEW (Laptops / Desktops: visible on hidden md:block)       */}
      {/* ========================================================================= */}
      <div className="hidden md:block">
        {/* DESKTOP HERO */}
        <section className="relative overflow-hidden bg-forest-900 bg-grain text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 pt-16 pb-24 lg:grid-cols-[1.15fr_1fr] lg:pt-24">
            <div>
              <div className="animate-rise">
                <Eyebrow light>Sangaria · Hanumangarh · Since day one</Eyebrow>
              </div>
              <h1 className="mt-7 animate-rise text-4xl sm:text-6xl lg:text-[4.2rem] xl:text-[4.8rem] font-extrabold leading-[1.08] [animation-delay:80ms]">
                <span className="inline-block">Pack your bags.</span>
                <br />
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-coral-400 via-amber-200 to-coral-400 bg-clip-text text-transparent">
                    We’ll handle
                  </span>
                  <svg viewBox="0 0 300 20" className="absolute -bottom-2.5 left-0 w-full animate-pulse" aria-hidden>
                    <path d="M2 15 Q 75 2 150 10 T 298 6" fill="none" stroke="#c4515d" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </span>
                <br />
                <span className="inline-flex items-center gap-3 whitespace-nowrap min-h-[1.25em] pb-1 overflow-visible">
                  <span
                    className={
                      'inline-flex items-center gap-3 transition-all duration-300 transform ' +
                      (fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2')
                    }
                  >
                    <span className="text-white">{rotatingWords[wordIndex].text}</span>
                    <span className="inline-block text-3xl lg:text-4xl xl:text-5xl animate-bounce">
                      {rotatingWords[wordIndex].icon}
                    </span>
                  </span>
                </span>
              </h1>
              <p className="mt-8 animate-rise text-lg leading-relaxed text-forest-100/85 [animation-delay:160ms]">
                Study visas, PR, work permits, tourist visas & IELTS/PTE coaching for Canada, UK, Australia, USA, NZ & Europe — with honest guidance and zero false promises, right here in Sangaria.
              </p>

              {/* DESKTOP QUICK FINDER */}
              <div className="mt-8 rounded-2xl bg-forest-950/90 border border-white/20 p-5 shadow-2xl backdrop-blur">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-coral-400">
                    ⚡ Quick Visa & Country Finder
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80">
                    Free Profile Check
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="desktop-country" className="block text-xs font-semibold text-white/80 mb-1">Target Country</label>
                    <div className="relative">
                      <select
                        id="desktop-country"
                        aria-label="Select Country"
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="w-full rounded-xl bg-white text-forest-900 text-sm font-bold py-2.5 pl-3 pr-8 shadow-sm outline-none border border-forest-900/15 appearance-none cursor-pointer"
                      >
                        <option value="canada">🇨🇦 Canada</option>
                        <option value="uk">🇬🇧 United Kingdom</option>
                        <option value="australia">🇦🇺 Australia</option>
                        <option value="usa">🇺🇸 United States</option>
                        <option value="new-zealand">🇳🇿 New Zealand</option>
                        <option value="germany">🇩🇪 Germany</option>
                        <option value="europe">🇪🇺 Europe / Schengen</option>
                        <option value="">Other</option>
                      </select>
                      <span className="pointer-events-none absolute right-3 top-3 text-xs text-forest-900/60">▼</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="desktop-visa" className="block text-xs font-semibold text-white/80 mb-1">Visa Category</label>
                    <div className="relative">
                      <select
                        id="desktop-visa"
                        aria-label="Select Visa Category"
                        value={selectedVisa}
                        onChange={(e) => setSelectedVisa(e.target.value)}
                        className="w-full rounded-xl bg-white text-forest-900 text-sm font-bold py-2.5 pl-3 pr-8 shadow-sm outline-none border border-forest-900/15 appearance-none cursor-pointer"
                      >
                        <option value="study">Study Visa / Permit</option>
                        <option value="pr">Permanent Residency (PR)</option>
                        <option value="work">Work Permit / LMIA</option>
                        <option value="tourist">Tourist / Visitor Visa</option>
                        <option value="spouse">Spouse Open Work Permit</option>
                      </select>
                      <span className="pointer-events-none absolute right-3 top-3 text-xs text-forest-900/60">▼</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <Link
                    to={selectedCountry ? `/destinations/${selectedCountry}` : `/services/${selectedVisa}`}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-coral-500 py-3 text-xs font-bold text-white shadow-md hover:bg-coral-600 transition"
                  >
                    <span>Check Intake Deadlines & Requirements</span>
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    to="/eligibility"
                    className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-bold text-white hover:bg-white/20 transition whitespace-nowrap"
                  >
                    60-Sec Evaluation →
                  </Link>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-4 animate-rise [animation-delay:240ms]">
                <Link
                  to="/eligibility"
                  className="rounded-full bg-coral-500 px-8 py-4 font-bold text-white shadow-lg transition hover:bg-coral-600 active:scale-95"
                >
                  Check Your Visa Eligibility (Free) →
                </Link>
                <a
                  href={site.phoneHref}
                  className="rounded-full border border-white/20 bg-forest-950/50 px-6 py-4 font-bold text-white transition hover:bg-white/10"
                >
                  Call: {site.phone}
                </a>
              </div>

              {/* Stats Bar */}
              <div className="mt-14 grid grid-cols-4 gap-6 border-t border-white/10 pt-8 animate-rise [animation-delay:320ms]">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-4xl font-extrabold text-coral-400">{s.value}</p>
                    <p className="mt-1 text-xs text-forest-100/70">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Hero Visual */}
            <div className="relative animate-rise [animation-delay:200ms]">
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/5 p-4 backdrop-blur-sm shadow-2xl">
                <img
                  src={img('/img/hero.webp', 1200, 900)}
                  alt="Students holding visa approvals from Sangaria"
                  width={600}
                  height={450}
                  loading="eager"
                  className="aspect-[4/3] w-full rounded-[2rem] object-cover"
                />
              </div>

              {/* Floating Boarding Pass Badge */}
              <div className="absolute -bottom-6 -left-6 rounded-2xl border border-forest-900/10 bg-white p-5 text-forest-900 shadow-2xl">
                <div className="flex items-center justify-between gap-6 font-mono text-[11px] uppercase tracking-wider text-forest-900/60">
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

        {/* DESKTOP JUMP TO BAR */}
        <div className="border-b border-forest-900/10 bg-forest-950 py-3.5 text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-sm">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-coral-400">JUMP TO:</span>
            <div className="flex items-center gap-7 font-semibold">
              <a href="#services-desktop" className="hover:text-coral-400 transition">✈️ Services</a>
              <a href="#destinations-desktop" className="hover:text-coral-400 transition">🌍 Countries</a>
              <a href="#coaching-desktop" className="hover:text-coral-400 transition">📚 IELTS & PTE</a>
              <a href="#approvals-desktop" className="hover:text-coral-400 transition">🎉 Recent Visas</a>
              <a href="#reviews-desktop" className="hover:text-coral-400 transition">⭐ Reviews</a>
            </div>
            <Link to="/contact" className="rounded-full bg-coral-500 px-5 py-2 text-xs font-bold text-white hover:bg-coral-600 transition shadow-sm">
              🔴 Free Enquiry
            </Link>
          </div>
        </div>

        {/* DESKTOP APPROVALS MARQUEE */}
        {settings.approvalsMarqueeEnabled && (
          <section className="overflow-hidden border-y border-forest-900/10 bg-coral-500 py-4 text-white">
            <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-lg font-bold">
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
        <section id="services-desktop" className="mx-auto max-w-7xl px-6 py-24">
          <div className="flex items-end justify-between">
            <div>
              <Eyebrow>What we do</Eyebrow>
              <h2 className="mt-3 font-display text-4xl font-extrabold text-forest-900">
                End-to-end visa services
              </h2>
            </div>
            <Link to="/services" className="font-bold text-coral-500 hover:underline">
              View all services →
            </Link>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visaServices.map((v) => (
              <Link
                key={v.slug}
                to={`/services/${v.slug}`}
                className="group flex flex-col justify-between rounded-3xl border border-forest-900/10 bg-sand/30 p-8 transition hover:-translate-y-1 hover:border-coral-500 hover:bg-sand/60 hover:shadow-lg"
              >
                <div>
                  <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-forest-900 text-coral-400">
                    <ServiceIcon name={v.icon} className="size-7" />
                  </span>
                  <h3 className="mt-6 font-display text-xl font-extrabold text-forest-900">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-forest-900/70">{v.tagline}</p>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-coral-500">
                  Learn more <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* DESKTOP DESTINATIONS */}
        <section id="destinations-desktop" className="bg-sand/60 bg-dots py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-end justify-between">
              <div>
                <Eyebrow>Destinations</Eyebrow>
                <h2 className="mt-3 font-display text-4xl font-extrabold text-forest-900">
                  Where would you like to study?
                </h2>
              </div>
              <Link to="/destinations" className="font-bold text-coral-500 hover:underline">
                View all countries →
              </Link>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {countries.map((c) => (
                <Link
                  key={c.slug}
                  to={`/destinations/${c.slug}`}
                  className="group flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <CountryFlag
                        flag={c.flag}
                        country={c.slug}
                        className="shrink-0 inline-block rounded-[3px]"
                        style={{ width: '36px', height: '24px', minWidth: '36px', maxWidth: '36px' }}
                      />
                      <span className="font-mono text-xs font-bold text-coral-600 bg-coral-50 px-2 py-0.5 rounded">
                        {c.popularIntakes?.split(',')[0] || 'Open'}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-xl font-extrabold text-forest-900">{c.name}</h3>
                    <p className="mt-1 text-xs text-forest-900/60 line-clamp-1">{c.popularFor}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-forest-900/5 text-xs font-bold text-forest-900">
                    <span>Explore programs</span>
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

        {/* 🎫 VIRTUAL BOARDING PASS (Desktop) */}
        <BoardingPassGenerator />

        {/* DESKTOP COACHING */}
        <section id="coaching-desktop" className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2">
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
            <h2 className="mt-3 font-display text-4xl font-extrabold text-forest-900">
              Your score is your passport. Let’s raise it.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-forest-900/70">
              Small batches, certified trainers, a dedicated PTE lab and weekly full-length mock tests — right here in Sangaria.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-4">
              {[
                { icon: Headphones, t: 'Real PTE lab' },
                { icon: Timer, t: 'Timed mock tests' },
                { icon: Award, t: 'Band-wise feedback' },
                { icon: BadgeCheck, t: 'Free demo class' },
              ].map(({ icon: Icon, t }) => (
                <li key={t} className="flex items-center gap-3 rounded-2xl bg-forest-50 p-4 text-sm font-semibold text-forest-900">
                  <Icon className="size-5 text-coral-500 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex items-center gap-4">
              <Link
                to="/coaching"
                className="rounded-full bg-forest-900 px-8 py-4 font-bold text-white transition hover:bg-forest-800"
              >
                View batches & fees →
              </Link>
              <a
                href={site.phoneHref}
                className="rounded-full border border-forest-900/20 px-6 py-4 font-bold text-forest-900 transition hover:bg-sand"
              >
                Book free demo: {site.phone}
              </a>
            </div>
          </div>
        </section>

        {/* 4-STEP PROCESS (DESKTOP) */}
        <section className="bg-forest-900 bg-grain py-24 text-white">
          <div className="mx-auto max-w-7xl px-6">
            <Eyebrow light>How it works</Eyebrow>
            <h2 className="mt-3 font-display text-4xl font-extrabold">Sangaria to your campus: 4 steps</h2>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((st) => (
                <div key={st.n} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <span className="font-display text-4xl font-extrabold text-coral-400">{st.n}</span>
                  <h3 className="mt-4 font-display text-xl font-bold">{st.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-forest-100/75">{st.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RECENT VISAS (DESKTOP) */}
        <section id="approvals-desktop" className="mx-auto max-w-7xl px-6 py-24">
          <div className="flex items-end justify-between">
            <div>
              <Eyebrow>Real outcomes</Eyebrow>
              <h2 className="mt-3 font-display text-4xl font-extrabold text-forest-900">Recent approvals</h2>
            </div>
            <Link to="/approvals" className="font-bold text-coral-500 hover:underline">
              View all 2,500+ approvals →
            </Link>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {approvals.slice(0, 3).map((a) => (
              <ApprovalCard key={a.id} approval={a} />
            ))}
          </div>
        </section>

        {/* REVIEWS (DESKTOP) */}
        <section id="reviews-desktop" className="bg-sand/60 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-end justify-between">
              <div>
                <Eyebrow>Testimonials</Eyebrow>
                <h2 className="mt-3 font-display text-4xl font-extrabold text-forest-900">
                  What students & parents say
                </h2>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-amber-500">★★★★★</div>
                <p className="text-xs text-forest-900/60">4.9 / 5.0 on Google Reviews (200+)</p>
              </div>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleTestimonialsDesktop.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
            {testimonials.length > 3 && (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={() => setShowAllTestimonials(!showAllTestimonials)}
                  className="rounded-full border border-forest-900/20 bg-white px-8 py-3.5 text-sm font-bold text-forest-900 shadow-sm transition hover:bg-forest-900 hover:text-white"
                >
                  {showAllTestimonials ? 'Show less testimonials' : `Show all ${testimonials.length} testimonials ↓`}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* BLOG / NEWS (DESKTOP) */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="flex items-end justify-between">
            <div>
              <Eyebrow>From the blog</Eyebrow>
              <h2 className="mt-3 font-display text-4xl font-extrabold text-forest-900">Visa updates & advice</h2>
            </div>
            <Link to="/blog" className="font-bold text-coral-500 hover:underline">
              Read all articles →
            </Link>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>

        {/* ENQUIRY (DESKTOP) */}
        <section id="enquiry" className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-2">
          <div>
            <Eyebrow>Free counselling</Eyebrow>
            <h2 className="mt-3 font-display text-4xl font-extrabold text-forest-900">
              Your global journey starts with a conversation.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-forest-900/70">
              Walk into our Sangaria office or send an enquiry. We review your profile, recommend realistic courses & countries, and never charge for first counselling.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-forest-900 text-coral-400">
                  <MapPin className="size-5" />
                </span>
                <div>
                  <p className="font-bold text-forest-900">Sangaria Office</p>
                  <p className="text-sm text-forest-900/70">{site.address}</p>
                  <p className="text-xs text-forest-900/50 mt-0.5">{site.openingHours}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-forest-900/10 bg-sand/40 p-8">
            <EnquiryForm source="home-desktop" />
          </div>
        </section>
      </div>
    </>
  )
}
