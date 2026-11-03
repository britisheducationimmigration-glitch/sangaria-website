import { useEffect, useState, useRef } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Award, BadgeCheck, Headphones, MapPin, Timer, ShieldCheck, Zap, HeartHandshake } from 'lucide-react'
import { ApprovalCard, PostCard, TestimonialCard } from '@/components/Cards'
import { CountryFlag } from '@/components/CountryFlag'
import { EnquiryForm } from '@/components/EnquiryForm'
import { Eyebrow } from '@/components/Section'
import { ServiceIcon } from '@/components/ServiceIcon'
import { countries, visaServices } from '@/data/fixtures'
import { site } from '@/data/site'
import { img } from '@/lib/utils'
import { getPublicContent } from '@/lib/public-functions'
import { BoardingPassGenerator } from '@/components/BoardingPassGenerator'
import { FamilyCashflowPlanner } from '@/components/FamilyCashflowPlanner'
import { CertificateCarousel } from '@/components/CertificateCarousel'

import { createPageSeo } from '@/lib/seo'

export const Route = createFileRoute('/')({
  loader: () => getPublicContent(),
  head: () => createPageSeo({
    title: 'Study Visas & IELTS Coaching in Sangaria | British Education',
    description: 'Get study visa guidance, IELTS/PTE coaching and free profile evaluation in Sangaria, Rajasthan. Compare destinations and explore next steps.',
    path: '/',
  }),
  component: Home,
})

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
  const { approvals, posts, testimonials, certificates, settings } = Route.useLoaderData()
  const [selectedCountry, setSelectedCountry] = useState('canada')
  const [selectedVisa, setSelectedVisa] = useState('study')
  const [showAllTestimonials, setShowAllTestimonials] = useState(false)
  const [showAllTestimonialsMobile, setShowAllTestimonialsMobile] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    let transitionTimer: number | undefined
    const rotationTimer = window.setInterval(() => {
      setFade(false)
      transitionTimer = window.setTimeout(() => {
        setWordIndex((current) => (current + 1) % rotatingWords.length)
        setFade(true)
      }, 250)
    }, 3000)

    return () => {
      window.clearInterval(rotationTimer)
      if (transitionTimer !== undefined) window.clearTimeout(transitionTimer)
    }
  }, [])
 // Sticky Jump bar state & refs (Dynamically attaches right under #site-main-header with 0 gap)
  const [isMobileSticky, setIsMobileSticky] = useState(false)
  const [isDesktopSticky, setIsDesktopSticky] = useState(false)
  const [headerOffset, setHeaderOffset] = useState(68)
  const mobileRef = useRef<HTMLDivElement>(null)
  const desktopRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const headerEl = document.getElementById('site-main-header')
      const h = headerEl ? headerEl.offsetHeight : 68
      setHeaderOffset(h)

      if (mobileRef.current) {
        const rect = mobileRef.current.getBoundingClientRect()
        setIsMobileSticky(rect.top <= h)
      }
      if (desktopRef.current) {
        const rect = desktopRef.current.getBoundingClientRect()
        setIsDesktopSticky(rect.top <= h)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])
  const visibleTestimonialsDesktop = showAllTestimonials ? testimonials : testimonials.slice(0, 3)
  const visibleTestimonialsMobile = showAllTestimonialsMobile ? testimonials : testimonials.slice(0, 2)

  return (
    <>
      {/* ========================================================================= */}
      {/* MOBILE-ONLY VIEW                                                          */}
      {/* ========================================================================= */}
      <div className="block md:hidden bg-cream text-forest-900">
        {/* MOBILE HERO */}
        <section className="relative overflow-hidden bg-forest-900 bg-grain text-white px-5 pt-8 pb-16">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-950/80 border border-white/20 px-3.5 py-1 text-[11px] font-bold text-coral-400 shadow-sm">
              📍 Sangaria · Hanumangarh · Since Day 1
            </span>

            <h1 className="mt-5 text-[2.75rem] font-extrabold leading-[1.03] tracking-tight">
              <span className="inline-block animate-rise">Pack your bags.</span>
              <br />
              <span className="relative inline-block animate-rise [animation-delay:100ms]">
                <span className="bg-gradient-to-r from-amber-300 via-amber-100 to-coral-400 bg-clip-text text-transparent [-webkit-background-clip:text] font-extrabold">
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

            {/* QUICK COUNTRY & VISA FINDER (Mobile) */}
            <div className="mt-7 rounded-3xl bg-forest-950/90 border border-white/20 p-4 shadow-2xl overflow-hidden">
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
                      <option value="study">🎓 Study Visa</option>
                      <option value="pr">🏛️ PR / Immig.</option>
                      <option value="work">💼 Work Permit</option>
                      <option value="tourist">✈️ Tourist Visa</option>
                      <option value="coaching">📚 IELTS / PTE</option>
                    </select>
                    <span className="pointer-events-none absolute right-2.5 top-2.5 text-[10px] text-forest-900/60">▼</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <Link
                  to="/countries/$slug"
                  params={{ slug: selectedCountry }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-coral-500 py-3 px-4 text-xs font-extrabold text-white shadow-lg active:scale-98 transition text-center"
                >
                  <span className="truncate">Explore {countries.find((c) => c.slug === selectedCountry)?.name ?? 'Country'} Guide</span>
                  <ArrowRight className="size-3.5 shrink-0" />
                </Link>
                <div className="flex gap-2">
                  <Link
                    to="/eligibility"
                    className="flex-1 rounded-xl border border-white/30 bg-white/10 py-2.5 px-3 text-xs font-bold text-white text-center active:bg-white/20 transition truncate"
                  >
                    Eligibility Check →
                  </Link>
                  <Link
                    to="/contact"
                    className="rounded-xl border border-white/30 bg-white/10 py-2.5 px-3.5 text-xs font-bold text-white text-center active:bg-white/20 transition"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>

            <dl className="mt-7 grid grid-cols-2 gap-3.5">
              {settings.trustStats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
                  <dt className="font-display text-2xl font-extrabold text-white">{s.value}</dt>
                  <dd className="mt-1 text-[10px] uppercase tracking-wider text-forest-100/70">{s.label}</dd>
                </div>
              ))}
            </dl>

            <div className="relative mt-8 w-full overflow-hidden rounded-2xl border border-white/15 shadow-2xl">
              <img
                src={img('/img/hero.webp', 640, 720)}
                alt="Student holding passport and university acceptance letter"
                width={640}
                height={720}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute top-3.5 right-3.5 grid size-16 place-items-center rounded-full border-2 border-dashed border-coral-400 bg-forest-950/90 text-center font-mono text-[9px] font-bold uppercase leading-tight tracking-wider text-coral-300 backdrop-blur shadow-lg">
                Visa
                <br />
                Approved
                <br />✓
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-cream/95 backdrop-blur-md p-3.5 text-forest-900 border-t border-forest-900/10">
                <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-forest-900/60">
                  <span>BOARDING PASS</span>
                  <span>BEI · SANGARIA</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between font-display text-sm font-extrabold">
                  <span>SNG <span className="text-[10px] font-normal text-forest-900/60">Sangaria</span></span>
                  <span className="text-coral-500 font-mono text-xs">- - ✈ - -</span>
                  <span>YYZ <span className="text-[10px] font-normal text-forest-900/60">Toronto</span></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 3: EDITORIAL "WHY CHOOSE US" TRUST STRIP (Mobile) */}
        <section className="bg-sand border-b border-forest-900/10 py-8 px-5">
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-forest-900/10">
            <span className="font-mono text-[10px] uppercase tracking-widest text-coral-600 font-bold block mb-2">Why Choose Us</span>
            <div className="grid grid-cols-1 gap-3.5 mt-3">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-forest-50 flex items-center justify-center text-forest-900 shrink-0">
                  <ShieldCheck className="size-4 text-coral-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-forest-900">Direct University Tie-ups</h4>
                  <p className="text-[11px] text-forest-900/65">Official representation across Canada, UK & Australia.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-forest-50 flex items-center justify-center text-forest-900 shrink-0">
                  <Zap className="size-4 text-coral-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-forest-900">100% Transparent Process</h4>
                  <p className="text-[11px] text-forest-900/65">No hidden charges, direct fee payment to colleges.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-forest-50 flex items-center justify-center text-forest-900 shrink-0">
                  <HeartHandshake className="size-4 text-coral-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-forest-900">Pre-Visa & Post-Arrival Support</h4>
                  <p className="text-[11px] text-forest-900/65">Assistance with accommodation, forex & airport pickup.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

    
       {/* MOBILE JUMP TO BAR */}
        <div ref={mobileRef} className="h-[46px]">
          <div
            style={isMobileSticky ? { top: `${headerOffset}px` } : undefined}
            className={`${
              isMobileSticky
                ? 'fixed left-0 right-0 z-40 shadow-xl bg-forest-950/95 backdrop-blur-md'
                : 'relative bg-forest-950'
            } overflow-x-auto py-2.5 px-4 scrollbar-none border-y border-white/10`}
          >
            <div className="flex items-center gap-2.5 w-max">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-coral-400 shrink-0">JUMP:</span>
              <a href="#services-m" className="shrink-0 rounded-full bg-forest-900 border border-white/20 px-3.5 py-1 text-xs font-semibold text-white shadow-sm active:bg-coral-500">✈️ Services</a>
              <a href="#destinations-m" className="shrink-0 rounded-full bg-forest-900 border border-white/20 px-3.5 py-1 text-xs font-semibold text-white shadow-sm active:bg-coral-500">🌍 Countries</a>
              <a href="#coaching-m" className="shrink-0 rounded-full bg-forest-900 border border-white/20 px-3.5 py-1 text-xs font-semibold text-white shadow-sm active:bg-coral-500">📚 IELTS & PTE</a>
              <a href="#approvals-m" className="shrink-0 rounded-full bg-forest-900 border border-white/20 px-3.5 py-1 text-xs font-semibold text-white shadow-sm active:bg-coral-500">🎉 Visas</a>
              <a href="#certificates-m" className="shrink-0 rounded-full bg-forest-900 border border-white/20 px-3.5 py-1 text-xs font-semibold text-white shadow-sm active:bg-coral-500">🏅 Certificates</a>
              <a href="#reviews-m" className="shrink-0 rounded-full bg-forest-900 border border-white/20 px-3.5 py-1 text-xs font-semibold text-white shadow-sm active:bg-coral-500">⭐ Reviews</a>
              <a href="#enquiry-m" className="shrink-0 rounded-full bg-coral-500 px-3.5 py-1 text-xs font-bold text-white shadow-md">🔴 Free Enquiry</a>
            </div>
          </div>
        </div>

        {/* APPROVALS MARQUEE (MOBILE) */}
        {settings.approvalsMarqueeEnabled && (
          <section className="overflow-hidden border-b border-forest-900/10 bg-coral-500 py-3.5 text-white">
            <div className="flex w-max animate-marquee gap-8 whitespace-nowrap font-display text-sm font-bold">
              {[...approvals, ...approvals].map((a, i) => (
                <span key={i} className="flex items-center gap-2">
                  <CountryFlag
                    flag={a.flag}
                    country={a.country}
                    className="shrink-0 inline-block rounded-[2px]"
                    style={{ width: '26px', height: '17px', minWidth: '26px', maxWidth: '26px' }}
                  />
                  <span>{a.name} — {a.visa}</span>
                  <span className="text-white/50">✦</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* SERVICES SECTION (MOBILE) */}
        <section id="services-m" className="px-5 py-20 border-b border-forest-900/10 bg-white">
          <div className="flex items-end justify-between mb-8">
            <div>
              <Eyebrow>What we do</Eyebrow>
              <h2 className="mt-2 text-2xl font-extrabold text-forest-900">Every visa handled by one team.</h2>
            </div>
            <Link to="/visas" className="text-xs font-bold text-coral-600 hover:underline shrink-0">
              All visas →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {visaServices.map((s, i) => (
              <Link
                key={s.slug}
                to="/visas"
                hash={s.slug}
                className={
                  'flex flex-col justify-between rounded-3xl p-4 shadow-sm border border-forest-900/10 transition overflow-hidden hover:shadow-md ' +
                  (i === 0
                    ? 'bg-gradient-to-br from-forest-900 to-forest-950 text-white shadow-md border-transparent'
                    : 'bg-white text-forest-900 active:bg-forest-50')
                }
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={'grid size-9 shrink-0 place-items-center rounded-2xl shadow-sm ' + (i === 0 ? 'bg-coral-500 text-white' : 'bg-forest-50 text-forest-700')}>
                      <ServiceIcon name={s.icon} className="size-4" />
                    </span>
                    <span className={'font-mono text-xs font-bold ' + (i === 0 ? 'text-white/40' : 'text-forest-900/30')}>0{i + 1}</span>
                  </div>
                  <h3 className="mt-3 text-sm font-extrabold leading-snug">{s.title}</h3>
                  <p className={'mt-1.5 text-[11px] leading-relaxed line-clamp-3 ' + (i === 0 ? 'text-forest-100/75' : 'text-forest-900/65')}>
                    {s.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* DESTINATIONS SECTION (MOBILE) */}
        <section id="destinations-m" className="bg-sand/60 bg-dots px-5 py-20 border-b border-forest-900/10">
          <div className="mb-8">
            <Eyebrow>Destinations</Eyebrow>
            <h2 className="mt-2 text-2xl font-extrabold text-forest-900">Choose where your next chapter begins.</h2>
            <p className="mt-2 text-xs text-forest-900/70">Explore listed study destinations or ask us about others. Europe / Schengen is visitor guidance.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {countries.map((c) => (
              <Link
                key={c.slug}
                to="/countries/$slug"
                params={{ slug: c.slug }}
                className="flex flex-col justify-between rounded-3xl bg-white p-4 shadow-sm border border-forest-900/10 active:bg-forest-900 active:text-white hover:bg-forest-900 hover:text-white transition group overflow-hidden hover:shadow-md"
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
                    <span className="font-mono text-xs font-bold text-forest-900/40 group-active:text-white/40 group-hover:text-white/40">{c.code}</span>
                  </div>
                  <h3 className="mt-2.5 text-sm font-extrabold text-forest-900 group-active:text-white group-hover:text-white leading-tight">{c.name}</h3>
                  <p className="mt-1 text-[11px] text-forest-900/65 group-active:text-white/70 group-hover:text-white/70 line-clamp-2 leading-tight">{c.headline}</p>
                </div>
                <div className="mt-3.5 pt-2 border-t border-forest-900/10 group-active:border-white/15 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-coral-600 group-active:text-coral-300">{c.stats[0].value}</span>
                  <ArrowRight className="size-3.5 text-coral-500 group-active:text-coral-300" />
                </div>
              </Link>
            ))}

            <Link
              to="/eligibility"
              className="flex flex-col justify-between rounded-3xl bg-coral-500 p-4 text-white shadow-md active:bg-coral-600 transition overflow-hidden"
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
          <div className="relative overflow-hidden rounded-3xl shadow-lg mb-8">
            <img
              src={img('/img/coaching.webp', 640, 420)}
              alt="IELTS and PTE coaching classroom"
              width={640}
              height={420}
              loading="lazy"
              className="aspect-[16/10] w-full object-cover"
            />
            <div className="absolute bottom-3 right-3 rounded-2xl bg-forest-900/90 backdrop-blur-md px-3.5 py-1.5 text-white shadow-md">
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
                <li key={t} className="flex items-center gap-2 rounded-2xl bg-forest-50/70 p-3 text-xs font-semibold text-forest-900 shadow-sm border border-forest-900/10">
                  <Icon className="size-4 shrink-0 text-coral-500" />
                  <span className="truncate">{t}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/coaching"
              className="mt-8 block w-full rounded-full bg-forest-900 py-4 text-center text-xs font-bold text-white transition active:bg-forest-800 shadow-md"
            >
              View batches & fees →
            </Link>
          </div>
        </section>

        {/* PROCESS SECTION (MOBILE) */}
        <section className="bg-forest-900 bg-grain px-5 py-20 text-white">
          <div className="mb-8">
            <Eyebrow light>How it works</Eyebrow>
            <h2 className="mt-2 text-2xl font-extrabold">Four steps to your destination.</h2>
          </div>

          <ol className="grid grid-cols-2 gap-4">
            {steps.map((s) => (
              <li key={s.n} className="rounded-3xl border border-white/15 bg-white/5 p-4 shadow-sm flex flex-col justify-between overflow-hidden">
                <div>
                  <span className="font-display text-2xl font-extrabold text-coral-400">{s.n}</span>
                  <h3 className="mt-1.5 text-sm font-bold text-white leading-tight">{s.title}</h3>
                </div>
                <p className="mt-2 text-[11px] leading-tight text-forest-100/70">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <FamilyCashflowPlanner />

        {/* RECENT APPROVALS (MOBILE) */}
        <section id="approvals-m" className="px-5 py-20 border-b border-forest-900/10 bg-white">
          <div className="flex items-end justify-between mb-8">
            <div>
              <Eyebrow>Fresh approvals</Eyebrow>
              <h2 className="mt-2 text-2xl font-extrabold text-forest-900">Visas that landed this month.</h2>
            </div>
            <Link to="/success-stories" className="text-xs font-bold text-coral-600 hover:underline shrink-0">
              See all →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {approvals.slice(0, 4).map((a, i) => (
              <ApprovalCard key={a.name} a={a} i={i} />
            ))}
          </div>
        </section>

        <CertificateCarousel certificates={certificates} id="certificates-m" />

        {/* TESTIMONIALS (MOBILE) */}
        <section id="reviews-m" className="bg-sand/60 px-5 py-20 border-b border-forest-900/10">
          <div className="mb-8">
            <Eyebrow>Testimonials</Eyebrow>
            <h2 className="mt-2 text-2xl font-extrabold text-forest-900">Real students. Real visas.</h2>
          </div>

          <div className="grid gap-5">
            {visibleTestimonialsMobile.map((t, i) => (
              <TestimonialCard key={t.name} t={t} featured={i === 0} />
            ))}
          </div>

          {testimonials.length > 2 && (
            <button
              type="button"
              onClick={() => setShowAllTestimonialsMobile(!showAllTestimonialsMobile)}
              className="mt-6 w-full rounded-full border border-forest-900/15 bg-white py-4 text-xs font-bold text-forest-900 shadow-sm active:bg-forest-50 transition"
            >
              {showAllTestimonialsMobile
                ? 'Show Fewer Reviews ↑'
                : `Show More Reviews (${testimonials.length - 2}+ और देखें) ↓`}
            </button>
          )}
        </section>

        {/* NEWS & BLOG (MOBILE) */}
        <section className="px-5 py-20 border-b border-forest-900/10 bg-white">
          <div className="flex items-end justify-between mb-8">
            <div>
              <Eyebrow>News & Blog</Eyebrow>
              <h2 className="mt-2 text-2xl font-extrabold text-forest-900">Latest visa updates.</h2>
            </div>
            <Link to="/updates" className="text-xs font-bold text-coral-600 hover:underline shrink-0">
              All articles →
            </Link>
          </div>

          <div className="grid gap-5">
            {posts.slice(0, 3).map((p) => (
              <PostCard key={p.slug} p={p} />
            ))}
          </div>
        </section>

        {/* FAQ + ENQUIRY (MOBILE) */}
        <section id="enquiry-m" className="px-5 py-20 pb-32">
          <div className="mb-10">
            <Eyebrow>FAQs</Eyebrow>
            <h2 className="mt-2 text-2xl font-extrabold text-forest-900">Questions we hear every day.</h2>
            <p className="mt-2 text-xs text-forest-900/70">Tap any question below to see full answer.</p>

            <div className="mt-6 space-y-3.5">
              {settings.faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-3xl bg-white p-5 shadow-sm border border-forest-900/10 transition [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-3 font-display text-[15px] font-bold text-forest-900 leading-snug">
                    <span>{f.q}</span>
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-forest-50 text-coral-600 transition group-open:rotate-45 text-sm font-bold shadow-xs">
                      +
                    </span>
                  </summary>
                  <p className="mt-3.5 border-t border-forest-900/10 pt-3 text-xs leading-relaxed text-forest-900/75">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>

            <p className="mt-6 flex items-center gap-2 text-xs text-forest-900/60">
              <MapPin className="size-3.5 text-coral-500 shrink-0" /> {site.address}
            </p>
          </div>

          <div className="rounded-3xl bg-forest-900 bg-grain p-6 text-white shadow-xl">
            <h2 className="text-xl font-extrabold">Free Profile Evaluation</h2>
            <p className="mt-1.5 mb-6 text-xs text-forest-100/70">Share details — a counsellor calls you back within one working day.</p>
            <EnquiryForm source="home-mobile" dark />
          </div>
        </section>

        {/* MOBILE STICKY BOTTOM CTA BAR */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-forest-950/95 backdrop-blur-md border-t border-white/15 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
          <a
            href="tel:+919772570478"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 py-2.5 text-xs font-bold text-white border border-white/15 active:scale-95 transition"
          >
            <span>📞</span>
            <span>Call Now</span>
          </a>
          
          <a
            href="https://wa.me/919772570478?text=Hi%20British%20Education%20Sangaria,%20I%20want%20to%20know%20more%20about%20Study%20Visas."
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] hover:brightness-105 py-2.5 text-xs font-bold text-white shadow-md active:scale-95 transition"
          >
            <span>💬</span>
            <span>WhatsApp</span>
          </a>

          <a
            href="#enquiry-m"
            className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-coral-500 hover:bg-coral-600 py-2.5 text-xs font-extrabold text-white shadow-md active:scale-95 transition"
          >
            <span>Free Enquiry ➔</span>
          </a>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP-ONLY VIEW                                                         */}
      {/* ========================================================================= */}
      <div className="hidden md:block bg-cream text-forest-900">
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

              <p className="mt-8 max-w-xl animate-rise text-lg leading-relaxed text-forest-100/80 [animation-delay:160ms]">
                Study visas, PR, work permits, tourist visas and IELTS / PTE coaching for Canada, UK, Australia, USA, New Zealand, Germany and Europe —
                all under one roof at {site.name}.
              </p>

              <div className="mt-7 max-w-xl rounded-3xl border border-white/15 bg-forest-950/85 p-5 shadow-xl sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="font-mono text-xs font-bold uppercase tracking-wide text-coral-400">Visa & Country Finder</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold text-white/75">Free Check</span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="min-w-0">
                    <label htmlFor="desktop-country" className="mb-1 block text-xs font-bold text-white/80">Country</label>
                    <div className="relative">
                      <select id="desktop-country" aria-label="Select Country" value={selectedCountry} onChange={(event) => setSelectedCountry(event.target.value)} className="w-full appearance-none truncate rounded-xl border border-forest-900/15 bg-white py-3 pl-3 pr-8 text-sm font-bold text-forest-900 shadow-sm">
                        <option value="canada">🇨🇦 Canada</option>
                        <option value="uk">🇬🇧 UK</option>
                        <option value="australia">🇦🇺 Australia</option>
                        <option value="usa">🇺🇸 USA</option>
                        <option value="new-zealand">🇳🇿 New Zealand</option>
                        <option value="germany">🇩🇪 Germany</option>
                        <option value="europe">🇪🇺 Europe</option>
                        <option value="">Other / not sure</option>
                      </select>
                      <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3.5 text-xs text-forest-900/60">▼</span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <label htmlFor="desktop-visa" className="mb-1 block text-xs font-bold text-white/80">Visa type</label>
                    <div className="relative">
                      <select id="desktop-visa" aria-label="Select Visa Type" value={selectedVisa} onChange={(event) => setSelectedVisa(event.target.value)} className="w-full appearance-none truncate rounded-xl border border-forest-900/15 bg-white py-3 pl-3 pr-8 text-sm font-bold text-forest-900 shadow-sm">
                        <option value="study">🎓 Study Visa</option>
                        <option value="pr">🏛️ PR / Immigration</option>
                        <option value="work">💼 Work Permit</option>
                        <option value="tourist">✈️ Tourist Visa</option>
                        <option value="coaching">📚 IELTS / PTE</option>
                      </select>
                      <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3.5 text-xs text-forest-900/60">▼</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedCountry ? (
                    <Link to="/countries/$slug" params={{ slug: selectedCountry }} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-coral-500 px-4 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-coral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-400">
                      Explore {countries.find((country) => country.slug === selectedCountry)?.name ?? 'Country'} Guide <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
                    </Link>
                  ) : (
                    <Link to="/countries" className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-coral-500 px-4 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-coral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-400">
                      Browse destinations <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
                    </Link>
                  )}
                  <Link to="/eligibility" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-400">Eligibility check</Link>
                  <Link to="/contact" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-400">Contact</Link>
                </div>
              </div>
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

          <dl className="mx-auto mt-12 grid max-w-7xl grid-cols-2 gap-6 px-6 pb-16 sm:grid-cols-4">
            {settings.trustStats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-3xl font-extrabold text-white">{s.value}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-forest-100/60">{s.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* STEP 3: EDITORIAL "WHY CHOOSE US" TRUST STRIP (Desktop) */}
        <section className="bg-sand border-b border-forest-900/10 py-12 px-6">
          <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-white p-8 shadow-sm border border-forest-900/10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-coral-600 font-bold block mb-1">Why Choose Us</span>
              <h3 className="text-2xl font-extrabold text-forest-900">Your future is safe with verified experts.</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 max-w-4xl">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-2xl bg-forest-50 flex items-center justify-center text-forest-900 shrink-0">
                  <ShieldCheck className="size-5 text-coral-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-forest-900">Direct University Tie-ups</h4>
                  <p className="text-xs text-forest-900/65 mt-0.5">Official representation across Canada, UK & Australia.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-2xl bg-forest-50 flex items-center justify-center text-forest-900 shrink-0">
                  <Zap className="size-5 text-coral-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-forest-900">100% Transparent Process</h4>
                  <p className="text-xs text-forest-900/65 mt-0.5">No hidden charges, direct fee payment to colleges.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-2xl bg-forest-50 flex items-center justify-center text-forest-900 shrink-0">
                  <HeartHandshake className="size-5 text-coral-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-forest-900">Pre-Visa & Post-Arrival</h4>
                  <p className="text-xs text-forest-900/65 mt-0.5">Assistance with accommodation, forex & airport pickup.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* DESKTOP FIXED HEADER + JUMP TO BAR COMBO */}
        {/* DESKTOP JUMP TO BAR */}
        <div ref={desktopRef} className="h-[52px]">
          <div
            style={isDesktopSticky ? { top: `${headerOffset}px` } : undefined}
            className={`${
              isDesktopSticky
                ? 'fixed left-0 right-0 z-40 shadow-xl bg-forest-950/95 backdrop-blur-md'
                : 'relative bg-forest-950'
            } border-b border-forest-900/10 py-3 text-white`}
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-sm">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-coral-400">JUMP TO:</span>
              <div className="flex items-center gap-7 font-semibold">
                <a href="#services-desktop" className="hover:text-coral-400 transition">✈️ Services</a>
                <a href="#destinations-desktop" className="hover:text-coral-400 transition">🌍 Countries</a>
                <a href="#coaching-desktop" className="hover:text-coral-400 transition">📚 IELTS & PTE</a>
                <a href="#approvals-desktop" className="hover:text-coral-400 transition">🎉 Recent Visas</a>
                <a href="#certificates-desktop" className="hover:text-coral-400 transition">🏅 Certificates</a>
              <a href="#reviews-desktop" className="hover:text-coral-400 transition">⭐ Reviews</a>
              </div>
              <Link to="/contact" className="rounded-full bg-coral-500 px-5 py-2 text-xs font-bold text-white hover:bg-coral-600 transition shadow-sm">
                🔴 Free Enquiry
              </Link>
            </div>
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

        {/* DESKTOP SERVICES (STEP 2: rounded-[2.5rem] & shadow) */}
        <section id="services-desktop" className="mx-auto max-w-7xl px-6 py-24">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Eyebrow>What we do</Eyebrow>
              <h2 className="mt-4 max-w-2xl text-4xl font-extrabold text-forest-900 md:text-5xl">Every kind of visa, handled by one trusted team.</h2>
            </div>
            <Link to="/visas" className="font-bold text-coral-600 hover:underline">
              All visa services →
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visaServices.map((s, i) => (
              <Link
                key={s.slug}
                to="/visas"
                hash={s.slug}
                className={
                  'group relative overflow-hidden rounded-[2.5rem] p-8 transition hover:-translate-y-1 ' +
                  (i === 0 ? 'bg-forest-900 text-white shadow-xl' : 'bg-white ring-1 ring-forest-900/10 hover:ring-forest-900 shadow-sm')
                }
              >
                <span className={'grid size-14 place-items-center rounded-2xl ' + (i === 0 ? 'bg-coral-500 text-white' : 'bg-forest-50 text-forest-700')}>
                  <ServiceIcon name={s.icon} className="size-6" />
                </span>
                <h3 className="mt-6 text-2xl font-bold">{s.title}</h3>
                <p className={'mt-3 ' + (i === 0 ? 'text-forest-100/75' : 'text-forest-900/65')}>{s.summary}</p>
                <span className="absolute top-8 right-8 font-mono text-xs opacity-40">0{i + 1}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* DESKTOP COUNTRIES (STEP 2: rounded-[2.5rem]) */}
        <section id="destinations-desktop" className="bg-sand/60 bg-dots py-24">
          <div className="mx-auto max-w-7xl px-6">
            <Eyebrow>Destinations</Eyebrow>
            <h2 className="mt-4 max-w-3xl text-4xl font-extrabold text-forest-900 md:text-5xl">Choose where your next chapter begins.</h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {countries.map((c) => (
                <Link
                  key={c.slug}
                  to="/countries/$slug"
                  params={{ slug: c.slug }}
                  className="group relative flex flex-col rounded-[2.5rem] bg-cream p-6 ring-1 ring-forest-900/10 transition hover:-translate-y-1 hover:bg-forest-900 hover:text-white shadow-sm"
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
                  <h3 className="mt-6 text-2xl font-bold text-forest-900 group-hover:!text-white">{c.name}</h3>
                  <p className="mt-1 text-sm text-forest-900/70 group-hover:!text-white/80">{c.headline}</p>
                  <div className="my-5 border-t-2 border-dashed border-forest-900/15 group-hover:border-white/20" />
                  <div className="flex items-end justify-between text-sm">
                    <span className="text-forest-900 group-hover:!text-white">
                      <span className="block text-[10px] uppercase tracking-widest text-forest-900/60 group-hover:!text-white/60">{c.stats[0].label}</span>
                      <span className="font-bold text-forest-900 group-hover:!text-white">{c.stats[0].value}</span>
                    </span>
                    <ArrowRight className="size-5 text-coral-500 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
              <Link to="/eligibility" className="flex flex-col justify-between rounded-[2.5rem] bg-coral-500 p-6 text-white transition hover:-translate-y-1 shadow-md">
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
              className="aspect-[19/14] w-full rounded-[2.5rem] object-cover shadow-2xl"
            />
            <div className="absolute -right-4 -bottom-6 rounded-3xl bg-forest-900 p-5 text-white shadow-xl">
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
                { icon: Award, t: 'Band feedback' },
                { icon: BadgeCheck, t: 'Free demo class' },
              ].map(({ icon: Icon, t }) => (
                <li key={t} className="flex items-center gap-3 rounded-2xl bg-white p-4 font-semibold ring-1 ring-forest-900/10 shadow-sm">
                  <Icon className="size-5 text-coral-500" /> {t}
                </li>
              ))}
            </ul>
            <Link to="/coaching" className="mt-8 inline-flex rounded-full bg-forest-900 px-7 py-4 font-bold text-white transition hover:bg-forest-700 shadow-md">
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
                <li key={s.n} className="relative rounded-[2.5rem] border border-white/10 bg-white/5 p-7 shadow-lg">
                  <span className="font-display text-6xl font-extrabold text-coral-500/90">{s.n}</span>
                  <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-forest-100/70">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <FamilyCashflowPlanner />

        {/* DESKTOP RECENT APPROVALS */}
        <section id="approvals-desktop" className="mx-auto max-w-7xl px-6 py-24">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Eyebrow>Fresh approvals</Eyebrow>
              <h2 className="mt-4 text-4xl font-extrabold text-forest-900 md:text-5xl">Visas that landed this month.</h2>
            </div>
            <Link to="/success-stories" className="font-bold text-coral-600 hover:underline">
              See all success stories →
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {approvals.slice(0, 4).map((a, i) => (
              <ApprovalCard key={a.name} a={a} i={i} />
            ))}
          </div>
        </section>

        <CertificateCarousel certificates={certificates} id="certificates-desktop" />

        {/* DESKTOP TESTIMONIALS */}
        <section id="reviews-desktop" className="bg-sand/60 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <Eyebrow>Testimonials</Eyebrow>
            <h2 className="mt-4 max-w-2xl text-4xl font-extrabold text-forest-900 md:text-5xl">Real students. Real families. Real visas.</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
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
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {posts.slice(0, 3).map((p) => (
              <PostCard key={p.slug} p={p} />
            ))}
          </div>
        </section>

        {/* DESKTOP FAQ + ENQUIRY */}
        <section id="enquiry" className="mx-auto grid max-w-7xl gap-12 px-6 pb-28 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Eyebrow>FAQs</Eyebrow>
            <h2 className="mt-4 text-4xl font-extrabold text-forest-900">Questions we hear every day.</h2>
            <div className="mt-8 divide-y divide-forest-900/10 rounded-3xl bg-white ring-1 ring-forest-900/10 shadow-sm">
              {settings.faqs.map((f) => (
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
          <div className="rounded-[2.5rem] bg-forest-900 bg-grain p-8 text-white md:p-10 shadow-2xl">
            <h2 className="text-3xl font-extrabold">Get a free profile evaluation</h2>
            <p className="mt-2 mb-8 text-forest-100/70">Share a few details — a counsellor calls you back within one working day.</p>
            <EnquiryForm source="home" dark />
          </div>
        </section>
      </div>
    </>
  )
}
