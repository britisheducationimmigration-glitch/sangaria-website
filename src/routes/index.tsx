import { useEffect, useState, useRef, lazy, Suspense } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Award, BadgeCheck, Headphones, MapPin, Timer, ShieldCheck, Zap, HeartHandshake } from 'lucide-react'
import { ApprovalCard, PostCard, TestimonialCard } from '@/components/Cards'
import { CountryFlag } from '@/components/CountryFlag'
import { EnquiryForm } from '@/components/EnquiryForm'
import { Eyebrow } from '@/components/Section'
import { InteractiveFlightGlobe } from '@/components/InteractiveFlightGlobe'
import { ServiceIcon } from '@/components/ServiceIcon'
import { visaServices } from '@/data/fixtures'
import { getPublicCashflow, getPublicContent } from '@/lib/public-functions'
import { site } from '@/data/site'
import { GoogleReviewCta } from '@/components/GoogleReviewCta'
import { createPageSeo } from '@/lib/seo'
import { Route as RootRoute } from './__root'

const BoardingPassGenerator = lazy(() =>
  import('@/components/BoardingPassGenerator').then((m) => ({ default: m.BoardingPassGenerator }))
)
const FamilyCashflowPlanner = lazy(() =>
  import('@/components/FamilyCashflowPlanner').then((m) => ({ default: m.FamilyCashflowPlanner }))
)
const CertificateCarousel = lazy(() =>
  import('@/components/CertificateCarousel').then((m) => ({ default: m.CertificateCarousel }))
)

export const Route = createFileRoute('/')({
  loader: async () => {
    const [content, cashflow] = await Promise.all([
      getPublicContent(),
      getPublicCashflow(),
    ])
    return { ...content, cashflow }
  },
  head: () => {
    const seo = createPageSeo({
      title: 'Study Visas & IELTS Coaching in Sangaria | British Education',
      description: 'Get study visa guidance, IELTS/PTE coaching and free profile evaluation in Sangaria, Rajasthan. Compare destinations and explore next steps.',
      path: '/',
    })
    return { ...seo, links: [...(seo.links ?? []), { rel: 'preload', as: 'image', href: '/img/hero.webp', type: 'image/webp' }] }
  },
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

const visaInterestMap: Record<string, string> = {
  pr: 'PR & Immigration',
  work: 'Work Permit',
  tourist: 'Tourist & Visitor Visa',
}

function HeroRotatingWord() {
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

  return (
    <span
      className={
        'inline-flex items-center gap-2 lg:gap-3 transition-all duration-300 transform ' +
        (fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2')
      }
    >
      <span className="text-white">{rotatingWords[wordIndex].text}</span>
      <span className="inline-block text-2xl lg:text-4xl xl:text-5xl">
        {rotatingWords[wordIndex].icon}
      </span>
    </span>
  )
}

const homeJumpSections = [
  { id: 'services', icon: '✈️', desktopLabel: 'Services', mobileLabel: 'Services' },
  { id: 'destinations', icon: '🌍', desktopLabel: 'Countries', mobileLabel: 'Countries' },
  { id: 'approvals', icon: '🎉', desktopLabel: 'Recent Visas', mobileLabel: 'Visas' },
  { id: 'certificates', icon: '🏅', desktopLabel: 'Certificates', mobileLabel: 'Certificates' },
  { id: 'coaching', icon: '📚', desktopLabel: 'IELTS & PTE', mobileLabel: 'IELTS & PTE' },
  { id: 'reviews', icon: '⭐', desktopLabel: 'Reviews', mobileLabel: 'Reviews' },
] as const

function Home() {
  const { approvals, posts, testimonials, certificates, settings, cashflow } = Route.useLoaderData()
  const { countries } = RootRoute.useLoaderData()
  const homepageApprovals = approvals.filter((story) => story.homepageFeatured !== false)
  const homepageTestimonials = testimonials.filter((story) => story.homepageFeatured !== false)
  const [selectedCountry, setSelectedCountry] = useState(() =>
    countries.some((c) => c.slug === 'canada') ? 'canada' : (countries[0]?.slug ?? ''),
  )
  const [selectedVisa, setSelectedVisa] = useState('study')
  const [showAllTestimonials, setShowAllTestimonials] = useState(false)

  const [isSticky, setIsSticky] = useState(false)
  const [headerOffset, setHeaderOffset] = useState(68)
  const [jumpHeight, setJumpHeight] = useState(50)
  const jumpWrapRef = useRef<HTMLDivElement>(null)
  const jumpBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const headerEl = document.getElementById('site-main-header')
      const h = headerEl ? headerEl.offsetHeight : 68
      setHeaderOffset(h)
      if (jumpWrapRef.current) {
        setIsSticky(jumpWrapRef.current.getBoundingClientRect().top <= h)
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

  useEffect(() => {
    const bar = jumpBarRef.current
    if (!bar) return
    const measure = () => setJumpHeight(Math.max(46, Math.ceil(bar.getBoundingClientRect().height)))
    measure()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    observer?.observe(bar)
    window.addEventListener('resize', measure)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const visibleJumpSections = homeJumpSections.filter((section) => {
    if (section.id === 'approvals') return homepageApprovals.length > 0
    if (section.id === 'certificates') return certificates.some((certificate) => certificate.published && certificate.homepageFeatured)
    if (section.id === 'reviews') return homepageTestimonials.length > 0
    return true
  })

  const visibleTestimonials = showAllTestimonials ? homepageTestimonials : homepageTestimonials.slice(0, 3)
  const selectedCountryName = countries.find((c) => c.slug === selectedCountry)?.name ?? 'Country'
  const selectedVisaTitle = visaInterestMap[selectedVisa]

  return (
    <div className="bg-cream text-forest-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-forest-900 bg-aurora-live text-white">
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-5 pt-8 pb-16 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:px-6 lg:pt-24 lg:pb-24">
          <div className="relative isolate">
            <InteractiveFlightGlobe
              selectedCountry={selectedCountry}
              className="pointer-events-none absolute -top-6 -right-12 z-0 h-[340px] w-[340px] opacity-55 sm:h-[360px] sm:w-[360px] lg:-top-16 lg:right-0 lg:h-[440px] lg:w-[440px] lg:opacity-75 xl:right-4 xl:h-[490px] xl:w-[490px]"
            />
            <div className="relative z-10">
              <div className="animate-rise">
                <Eyebrow light>Sangaria · Hanumangarh · Since day one</Eyebrow>
              </div>

              <h1 className="mt-5 animate-rise text-[2.6rem] font-extrabold leading-[1.03] tracking-tight sm:text-6xl lg:mt-7 lg:text-[4.2rem] lg:leading-[1.08] xl:text-[4.8rem] [animation-delay:80ms]">
                <span className="inline-block">Pack your bags.</span>
                <br />
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-amber-300 via-amber-100 to-coral-400 bg-clip-text text-transparent [-webkit-background-clip:text] font-extrabold">
                    We’ll handle
                  </span>
                  <svg viewBox="0 0 300 20" className="absolute -bottom-2 left-0 w-full overflow-visible lg:-bottom-2.5" aria-hidden>
                    <path
                      d="M2 15 Q 75 2 150 10 T 298 6"
                      fill="none"
                      stroke="#c4515d"
                      strokeWidth="5"
                      strokeLinecap="round"
                      style={{ strokeDasharray: 320, strokeDashoffset: 0, animation: 'penDraw 1.3s cubic-bezier(0.2, 0.7, 0.2, 1) forwards' }}
                    />
                  </svg>
                </span>
                <br />
                <span className="inline-flex min-h-[1.2em] items-center gap-2 overflow-visible pb-1 lg:whitespace-nowrap lg:gap-3">
                  <HeroRotatingWord />
                </span>
              </h1>

              <p className="mt-4 max-w-xl animate-rise text-sm leading-relaxed text-forest-100/85 lg:mt-8 lg:text-lg lg:text-forest-100/80 [animation-delay:160ms]">
                Study visas, PR, work permits, tourist visas and IELTS / PTE coaching for Canada, UK, Australia, USA, New Zealand, Germany and Europe —
                all under one roof at {site.name}.
              </p>

              {/* QUICK COUNTRY & VISA FINDER */}
              <div className="mt-7 max-w-xl overflow-hidden rounded-3xl border border-white/20 bg-forest-950/90 p-4 shadow-2xl sm:p-6">
                <div className="mb-3 flex items-center justify-between gap-3 lg:mb-4">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-coral-400 lg:text-xs">Visa & Country Finder</span>
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[9px] font-semibold text-white/75 lg:px-3 lg:py-1 lg:text-[10px]">Free Check</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="min-w-0">
                    <label htmlFor="home-finder-country" className="mb-1 block text-[10px] font-bold text-white/80 lg:text-xs">Country</label>
                    <div className="relative">
                      <select
                        id="home-finder-country"
                        aria-label="Select Country"
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="w-full appearance-none truncate rounded-xl border border-forest-900/15 bg-white py-2.5 pl-2.5 pr-7 text-xs font-bold text-forest-900 shadow-sm outline-none lg:py-3 lg:pl-3 lg:pr-8 lg:text-sm"
                      >
                        {countries.map((c) => (
                          <option key={c.slug} value={c.slug}>{c.flag} {c.name}</option>
                        ))}
                        <option value="">Other / not sure</option>
                      </select>
                      <span aria-hidden="true" className="pointer-events-none absolute right-2.5 top-2.5 text-[10px] text-forest-900/60 lg:right-3 lg:top-3.5 lg:text-xs">▼</span>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <label htmlFor="home-finder-visa" className="mb-1 block text-[10px] font-bold text-white/80 lg:text-xs">Visa Type</label>
                    <div className="relative">
                      <select
                        id="home-finder-visa"
                        aria-label="Select Visa Type"
                        value={selectedVisa}
                        onChange={(e) => setSelectedVisa(e.target.value)}
                        className="w-full appearance-none truncate rounded-xl border border-forest-900/15 bg-white py-2.5 pl-2.5 pr-7 text-xs font-bold text-forest-900 shadow-sm outline-none lg:py-3 lg:pl-3 lg:pr-8 lg:text-sm"
                      >
                        <option value="study">🎓 Study Visa</option>
                        <option value="pr">🏛️ PR / Immigration</option>
                        <option value="work">💼 Work Permit</option>
                        <option value="tourist">✈️ Tourist Visa</option>
                        <option value="coaching">📚 IELTS / PTE</option>
                      </select>
                      <span aria-hidden="true" className="pointer-events-none absolute right-2.5 top-2.5 text-[10px] text-forest-900/60 lg:right-3 lg:top-3.5 lg:text-xs">▼</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  {selectedVisa === 'coaching' ? (
                    <Link to="/coaching" className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-coral-500 px-4 py-3 text-xs font-extrabold text-white shadow-lg transition hover:bg-coral-600 lg:text-sm">
                      <span className="truncate">Explore IELTS &amp; PTE Coaching</span>
                      <ArrowRight aria-hidden="true" className="size-3.5 shrink-0 lg:size-4" />
                    </Link>
                  ) : selectedVisaTitle && selectedCountry ? (
                    <Link to="/contact" search={{ interest: selectedVisaTitle, country: selectedCountryName }} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-coral-500 px-4 py-3 text-xs font-extrabold text-white shadow-lg transition hover:bg-coral-600 lg:text-sm">
                      <span className="truncate">Enquire: {selectedCountryName} {selectedVisaTitle}</span>
                      <ArrowRight aria-hidden="true" className="size-3.5 shrink-0 lg:size-4" />
                    </Link>
                  ) : selectedVisa !== 'study' ? (
                    <Link to="/visas" hash={selectedVisa} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-coral-500 px-4 py-3 text-xs font-extrabold text-white shadow-lg transition hover:bg-coral-600 lg:text-sm">
                      <span className="truncate">Explore {selectedVisaTitle || 'Visa Services'}</span>
                      <ArrowRight aria-hidden="true" className="size-3.5 shrink-0 lg:size-4" />
                    </Link>
                  ) : selectedCountry ? (
                    <Link to="/countries/$slug" params={{ slug: selectedCountry }} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-coral-500 px-4 py-3 text-xs font-extrabold text-white shadow-lg transition hover:bg-coral-600 lg:text-sm">
                      <span className="truncate">Explore {selectedCountryName} Study Guide</span>
                      <ArrowRight aria-hidden="true" className="size-3.5 shrink-0 lg:size-4" />
                    </Link>
                  ) : (
                    <Link to="/countries" className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-coral-500 px-4 py-3 text-xs font-extrabold text-white shadow-lg transition hover:bg-coral-600 lg:text-sm">
                      <span className="truncate">Browse destinations</span>
                      <ArrowRight aria-hidden="true" className="size-3.5 shrink-0 lg:size-4" />
                    </Link>
                  )}
                  <div className="flex gap-2">
                    <Link to="/eligibility" className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-3 py-2.5 text-center text-xs font-bold text-white transition hover:bg-white/20 lg:px-4 lg:text-sm">
                      Eligibility Check
                    </Link>
                    <Link to="/contact" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-3.5 py-2.5 text-center text-xs font-bold text-white transition hover:bg-white/20 lg:px-4 lg:text-sm">
                      Contact
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-md lg:max-w-none">
            <div className="hidden lg:block absolute -inset-4 rotate-3 rounded-[2.5rem] bg-coral-500/90" />
            <img
              src="/img/hero.webp"
              alt="Student holding passport and university acceptance letter at the airport"
              width={720}
              height={860}
              className="relative aspect-[4/3] w-full rounded-2xl border border-white/15 object-cover shadow-2xl lg:aspect-[6/7] lg:rounded-[2rem] lg:border-0"
            />
            <div className="absolute bottom-0 inset-x-0 border-t border-forest-900/10 bg-cream/95 p-3.5 text-forest-900 backdrop-blur-md lg:inset-x-auto lg:-bottom-10 lg:-left-4 lg:w-[78%] lg:rounded-2xl lg:border-0 lg:p-4 lg:shadow-2xl xl:-left-12">
              <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-forest-900/60 lg:text-[10px] lg:tracking-widest">
                <span>BOARDING PASS</span>
                <span>BEI · SANGARIA</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between font-display text-sm font-extrabold lg:mt-2">
                <div>
                  <span className="lg:text-3xl">SNG</span>
                  <span className="ml-1 text-[10px] font-normal text-forest-900/60 lg:ml-0 lg:block lg:text-[11px]">Sangaria</span>
                </div>
                <span className="font-mono text-xs text-coral-500 lg:px-3">- - ✈ - -</span>
                <div className="text-right">
                  <span className="lg:text-3xl">YYZ</span>
                  <span className="ml-1 text-[10px] font-normal text-forest-900/60 lg:ml-0 lg:block lg:text-[11px]">Toronto</span>
                </div>
              </div>
            </div>
            <div className="absolute top-3.5 right-3.5 grid size-16 place-items-center rounded-full border-2 border-dashed border-coral-400 bg-forest-950/90 text-center font-mono text-[9px] font-bold uppercase leading-tight tracking-wider text-coral-300 backdrop-blur shadow-lg lg:top-6 lg:-right-3 lg:size-28 lg:animate-stamp lg:border-[3px] lg:border-coral-500 lg:bg-forest-950/80 lg:text-[11px] lg:tracking-widest lg:text-coral-400 lg:[animation-delay:600ms] xl:-right-6">
              Visa
              <br />
              Approved
              <br />✓
            </div>
          </div>
        </div>

        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-3.5 px-5 pb-12 sm:grid-cols-4 lg:mt-4 lg:gap-6 lg:px-6 lg:pb-16">
          {settings.trustStats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center lg:border-0 lg:bg-transparent lg:p-0 lg:text-left">
              <dt className="font-display text-2xl font-extrabold text-white lg:text-3xl">{s.value}</dt>
              <dd className="mt-1 text-[10px] uppercase tracking-wider text-forest-100/70 lg:text-xs lg:text-forest-100/60">{s.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* WHY CHOOSE US TRUST STRIP */}
      <section className="border-b border-forest-900/10 bg-sand px-5 py-8 lg:px-6 lg:py-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 rounded-3xl border border-forest-900/10 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:gap-8 lg:rounded-[2.5rem] lg:p-8">
          <div>
            <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-coral-600 lg:text-xs">Why Choose Us</span>
            <h3 className="hidden text-2xl font-extrabold text-forest-900 lg:block">Your future is safe with verified experts.</h3>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-3.5 md:grid-cols-3 lg:max-w-4xl lg:gap-6">
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-forest-50 text-forest-900 lg:size-10 lg:rounded-2xl">
                <ShieldCheck className="size-4 text-coral-500 lg:size-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-forest-900 lg:text-sm">Direct University Tie-ups</h4>
                <p className="mt-0.5 text-[11px] text-forest-900/65 lg:text-xs">Official representation across Canada, UK &amp; Australia.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-forest-50 text-forest-900 lg:size-10 lg:rounded-2xl">
                <Zap className="size-4 text-coral-500 lg:size-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-forest-900 lg:text-sm">100% Transparent Process</h4>
                <p className="mt-0.5 text-[11px] text-forest-900/65 lg:text-xs">No hidden charges, direct fee payment to colleges.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-forest-50 text-forest-900 lg:size-10 lg:rounded-2xl">
                <HeartHandshake className="size-4 text-coral-500 lg:size-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-forest-900 lg:text-sm">Pre-Visa &amp; Post-Arrival</h4>
                <p className="mt-0.5 text-[11px] text-forest-900/65 lg:text-xs">Assistance with accommodation, forex &amp; airport pickup.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STICKY JUMP BAR */}
      <div ref={jumpWrapRef} style={isSticky ? { height: `${jumpHeight}px` } : undefined} className="min-h-[46px] lg:min-h-[52px]">
        <div
          ref={jumpBarRef}
          style={isSticky ? { top: `${headerOffset}px` } : undefined}
          className={`${isSticky ? 'fixed left-0 right-0 z-40 shadow-xl bg-forest-950/95 backdrop-blur-md' : 'relative bg-forest-950'} overflow-x-auto border-y border-white/10 px-4 py-2.5 text-white scrollbar-none lg:overflow-visible`}
        >
          <div className="mx-auto flex w-max items-center gap-2.5 lg:w-full lg:max-w-7xl lg:flex-wrap lg:justify-between lg:gap-x-4 lg:gap-y-2 lg:px-2">
            <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-wider text-coral-400 lg:text-[11px] lg:tracking-widest">JUMP TO:</span>
            <div className="flex items-center gap-2.5 lg:flex-wrap lg:justify-center lg:gap-x-5 lg:gap-y-1">
              {visibleJumpSections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="shrink-0 whitespace-nowrap rounded-full border border-white/20 bg-forest-900 px-3.5 py-1 text-xs font-semibold text-white shadow-sm transition hover:text-coral-400 active:bg-coral-500 lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none xl:text-sm"
                >
                  {section.icon} <span className="lg:hidden">{section.mobileLabel}</span><span className="hidden lg:inline">{section.desktopLabel}</span>
                </a>
              ))}
            </div>
            <a href="#enquiry" className="shrink-0 whitespace-nowrap rounded-full bg-coral-500 px-3.5 py-1 text-xs font-bold text-white shadow-md transition hover:bg-coral-600 lg:px-5 lg:py-2">
              Free Enquiry →
            </a>
          </div>
        </div>
      </div>

      {/* APPROVALS MARQUEE */}
      {settings.approvalsMarqueeEnabled && homepageApprovals.length > 0 && (
        <section className="overflow-hidden border-b border-forest-900/10 bg-coral-500 py-3.5 text-white lg:py-4">
          <div className="flex w-max animate-marquee gap-8 whitespace-nowrap font-display text-sm font-bold lg:gap-10 lg:text-lg">
            {[...homepageApprovals, ...homepageApprovals].map((a, i) => (
              <span key={`${a.name}-${a.date}-${i}`} className="flex items-center gap-2 lg:gap-3">
                <CountryFlag
                  flag={a.flag}
                  country={a.country}
                  className="h-[17px] w-[26px] shrink-0 rounded-[2px] lg:h-[18px] lg:w-[28px] lg:rounded-[3px]"
                />
                <span>{a.name} — {a.visa} approved</span>
                <span className="text-white/50">✦</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* SERVICES */}
      <section id="services" className="scroll-mt-36 lg:scroll-mt-44 border-b border-forest-900/10 bg-white px-5 py-20 lg:border-0 lg:bg-transparent lg:py-24">
        <div className="mx-auto max-w-7xl lg:px-1">
          <div className="mb-8 flex items-end justify-between gap-4 lg:mb-12">
            <div>
              <Eyebrow>What we do</Eyebrow>
              <h2 className="mt-2 max-w-2xl text-2xl font-extrabold text-forest-900 lg:mt-4 lg:text-5xl">Every kind of visa, handled by one trusted team.</h2>
            </div>
            <Link to="/visas" className="shrink-0 text-xs font-bold text-coral-600 hover:underline lg:text-base">
              All visa services →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-3 lg:gap-6">
            {visaServices.map((s, i) => (
              <Link
                key={s.slug}
                to="/visas"
                hash={s.slug}
                className={
                  'group relative overflow-hidden rounded-3xl p-4 shadow-sm transition hover:-translate-y-1 lg:rounded-[2.5rem] lg:p-8 ' +
                  (i === 0 ? 'bg-forest-900 text-white shadow-xl' : 'border border-forest-900/10 bg-white text-forest-900 hover:shadow-md lg:ring-1 lg:ring-forest-900/10 lg:hover:ring-forest-900')
                }
              >
                <span className={'grid size-9 place-items-center rounded-2xl lg:size-14 ' + (i === 0 ? 'bg-coral-500 text-white' : 'bg-forest-50 text-forest-700')}>
                  <ServiceIcon name={s.icon} className="size-4 lg:size-6" />
                </span>
                <h3 className={'mt-3 text-sm font-extrabold leading-snug lg:mt-6 lg:text-2xl lg:font-bold ' + (i === 0 ? '!text-white' : 'text-forest-900')}>{s.title}</h3>
                <p className={'mt-1.5 text-[11px] leading-relaxed line-clamp-3 lg:mt-3 lg:text-base lg:line-clamp-none ' + (i === 0 ? 'text-forest-100/75' : 'text-forest-900/65')}>
                  {s.summary}
                </p>
                <span className={'absolute top-4 right-4 font-mono text-xs lg:top-8 lg:right-8 ' + (i === 0 ? 'text-white/40' : 'text-forest-900/35')}>0{i + 1}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section id="destinations" className="scroll-mt-36 lg:scroll-mt-44 border-b border-forest-900/10 bg-sand/60 bg-dots px-5 py-20 lg:border-0 lg:py-24">
        <div className="mx-auto max-w-7xl lg:px-1">
          <div className="mb-8 lg:mb-12">
            <Eyebrow>Destinations</Eyebrow>
            <h2 className="mt-2 max-w-3xl text-2xl font-extrabold text-forest-900 lg:mt-4 lg:text-5xl">Choose where your next chapter begins.</h2>
            <p className="mt-2 text-xs text-forest-900/70 lg:hidden">Explore listed study destinations or ask us about others. Europe / Schengen is visitor guidance.</p>
          </div>
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4 lg:gap-6">
            {countries.map((c) => (
              <Link
                key={c.slug}
                to="/countries/$slug"
                params={{ slug: c.slug }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-forest-900/10 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:bg-forest-900 hover:text-white hover:shadow-md lg:rounded-[2.5rem] lg:border-0 lg:bg-cream lg:p-6 lg:ring-1 lg:ring-forest-900/10"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <CountryFlag
                      code={c.code}
                      flag={c.flag}
                      country={c.name}
                      className="h-6 w-9 shrink-0 rounded shadow-sm lg:h-8 lg:w-12"
                    />
                    <span className="font-mono text-xs font-bold text-forest-900/35 group-hover:!text-white/40 lg:text-2xl lg:text-forest-900/20">{c.code}</span>
                  </div>
                  <h3 className="mt-2.5 text-sm font-extrabold leading-tight text-forest-900 group-hover:!text-white lg:mt-6 lg:text-2xl lg:font-bold">{c.name}</h3>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-tight text-forest-900/65 group-hover:!text-white/80 lg:line-clamp-none lg:text-sm lg:text-forest-900/70">{c.headline}</p>
                </div>
                <div className="mt-3.5 flex items-end justify-between border-t border-forest-900/10 pt-2 text-xs group-hover:border-white/20 lg:mt-5 lg:border-t-2 lg:border-dashed lg:pt-4 lg:text-sm">
                  <span className="text-forest-900 group-hover:!text-white">
                    <span className="hidden text-[10px] uppercase tracking-widest text-forest-900/60 group-hover:!text-white/60 lg:block">{c.stats[0].label}</span>
                    <span className="font-bold text-coral-600 group-hover:!text-coral-300 lg:text-forest-900 lg:group-hover:!text-white">{c.stats[0].value}</span>
                  </span>
                  <ArrowRight className="size-3.5 text-coral-500 transition group-hover:translate-x-1 lg:size-5" />
                </div>
              </Link>
            ))}
            <Link to="/eligibility" className="flex flex-col justify-between rounded-3xl bg-coral-500 p-4 text-white shadow-md transition hover:-translate-y-1 hover:bg-coral-600 lg:rounded-[2.5rem] lg:p-6">
              <div>
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-white/80 lg:text-xs lg:tracking-widest">Not sure?</span>
                <h3 className="mt-2 text-sm font-extrabold !text-white leading-tight lg:mt-6 lg:text-2xl">
                  <span className="lg:hidden">Find Your Fit</span>
                  <span className="hidden lg:inline">Find the country that fits your profile in 60 seconds →</span>
                </h3>
                <p className="mt-1 text-[11px] text-white/85 lg:hidden">Free 60-second profile assessment</p>
              </div>
              <div className="mt-3.5 flex items-center justify-between border-t border-white/20 pt-2 text-xs font-bold lg:hidden">
                <span>Check now</span>
                <ArrowRight className="size-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* RECENT APPROVALS */}
      {homepageApprovals.length > 0 && (
        <section id="approvals" className="scroll-mt-36 lg:scroll-mt-44 mx-auto max-w-7xl px-5 py-20 lg:px-6 lg:py-24">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end lg:mb-12">
            <div>
              <Eyebrow>Fresh approvals</Eyebrow>
              <h2 className="mt-2 text-2xl font-extrabold text-forest-900 lg:mt-4 lg:text-5xl">Visas that landed this month.</h2>
            </div>
            <Link to="/success-stories" className="hidden font-bold text-coral-600 hover:underline lg:inline-block">
              See all success stories →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4 lg:gap-6">
            {homepageApprovals.slice(0, 4).map((a, i) => (
              <ApprovalCard key={`${a.name}-${a.date}-${i}`} a={a} i={i} />
            ))}
          </div>
          <Link to="/success-stories" className="mt-6 flex min-h-12 w-full items-center justify-center rounded-full border border-forest-900/15 bg-white px-4 py-3 text-sm font-bold text-forest-900 hover-contrast-cta shadow-sm transition hover:bg-forest-900 hover:text-white lg:hidden">
            See all visa stories →
          </Link>
        </section>
      )}

      {/* CERTIFICATE CAROUSEL */}
      <Suspense fallback={null}>
        <CertificateCarousel certificates={certificates} id="certificates" />
      </Suspense>

      {/* VIRTUAL BOARDING PASS */}
      <Suspense fallback={<div className="my-8 h-40 animate-pulse rounded-3xl bg-forest-950/20" />}>
        <BoardingPassGenerator />
      </Suspense>

      {/* COACHING */}
      <section id="coaching" className="scroll-mt-36 lg:scroll-mt-44 mx-auto grid max-w-7xl items-center gap-8 px-5 py-20 lg:grid-cols-2 lg:gap-14 lg:px-6 lg:py-24">
        <div className="relative">
          <img
            src="/img/coaching.webp"
            alt="IELTS and PTE coaching classroom"
            width={760}
            height={560}
            loading="lazy"
            className="aspect-[16/10] w-full rounded-3xl object-cover shadow-lg lg:aspect-[19/14] lg:rounded-[2.5rem] lg:shadow-2xl"
          />
          <div className="absolute right-3 bottom-3 rounded-2xl bg-forest-900/90 px-3.5 py-1.5 text-white shadow-md backdrop-blur-md lg:-right-4 lg:-bottom-6 lg:rounded-3xl lg:bg-forest-900 lg:p-5 lg:shadow-xl">
            <span className="font-display text-lg font-extrabold text-coral-400 lg:block lg:text-4xl lg:text-coral-500">79+</span>
            <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider text-forest-100/80 lg:ml-0 lg:block lg:text-xs lg:text-forest-100/70">Top PTE score</span>
          </div>
        </div>
        <div>
          <Eyebrow>IELTS &amp; PTE Coaching</Eyebrow>
          <h2 className="mt-2 text-2xl font-extrabold text-forest-900 lg:mt-4 lg:text-5xl">Your score is your passport. Let’s raise it.</h2>
          <p className="mt-3 text-xs leading-relaxed text-forest-900/70 lg:mt-5 lg:text-lg">
            Small batches, experienced trainers, a dedicated PTE computer lab and weekly mock tests — right here in Sangaria.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-3 lg:mt-8 lg:gap-4">
            {[
              { icon: Headphones, t: 'Real-exam PTE lab' },
              { icon: Timer, t: 'Weekly timed mocks' },
              { icon: Award, t: 'Band feedback' },
              { icon: BadgeCheck, t: 'Free demo class' },
            ].map(({ icon: Icon, t }) => (
              <li key={t} className="flex items-center gap-2 rounded-2xl border border-forest-900/10 bg-forest-50/70 p-3 text-xs font-semibold text-forest-900 shadow-sm lg:gap-3 lg:bg-white lg:p-4 lg:text-base">
                <Icon className="size-4 shrink-0 text-coral-500 lg:size-5" />
                <span className="truncate">{t}</span>
              </li>
            ))}
          </ul>
          <Link to="/coaching" className="mt-8 block w-full rounded-full bg-forest-900 py-4 text-center text-xs font-bold text-white shadow-md transition hover:bg-forest-700 lg:inline-flex lg:w-auto lg:px-7 lg:text-base">
            View batches &amp; timings →
          </Link>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-forest-900 bg-grain px-5 py-20 text-white lg:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 lg:mb-14">
            <Eyebrow light>How it works</Eyebrow>
            <h2 className="mt-2 max-w-2xl text-2xl font-extrabold !text-white lg:mt-4 lg:text-5xl">Four steps from Sangaria to your dream destination.</h2>
          </div>
          <ol className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-4 lg:gap-6">
            {steps.map((s) => (
              <li key={s.n} className="flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-4 shadow-sm lg:rounded-[2.5rem] lg:border-white/10 lg:p-7 lg:shadow-lg">
                <div>
                  <span className="font-display text-2xl font-extrabold text-coral-400 lg:text-6xl lg:text-coral-500/90">{s.n}</span>
                  <h3 className="mt-1.5 text-sm font-bold !text-white leading-tight lg:mt-4 lg:text-xl">{s.title}</h3>
                </div>
                <p className="mt-2 text-[11px] leading-tight text-forest-100/70 lg:text-sm lg:leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAMILY CASHFLOW PLANNER */}
      <Suspense fallback={<div className="my-8 h-40 animate-pulse rounded-3xl bg-forest-900/20" />}>
        <FamilyCashflowPlanner initialData={cashflow} />
      </Suspense>

      {/* TESTIMONIALS */}
      {homepageTestimonials.length > 0 && (
        <section id="reviews" className="scroll-mt-36 lg:scroll-mt-44 border-b border-forest-900/10 bg-sand/60 px-5 py-12 lg:border-0 lg:px-6 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <Eyebrow>Testimonials</Eyebrow>
            <h2 className="mt-2 max-w-2xl text-2xl font-extrabold text-forest-900 lg:mt-4 lg:text-5xl">Real students. Real families. Real visas.</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:mt-12 lg:gap-6">
              {visibleTestimonials.map((t, i) => (
                <div key={`${t.name}-${t.city}-${i}`} className={!showAllTestimonials && i === 2 ? 'hidden md:block' : ''}>
                  <TestimonialCard t={t} featured={i === 1} />
                </div>
              ))}
            </div>
            {homepageTestimonials.length > 2 && (
              <div className="mt-6 text-center lg:mt-10">
                <button
                  type="button"
                  onClick={() => setShowAllTestimonials((v) => !v)}
                  className={'w-full rounded-full border border-forest-900/15 bg-white py-4 text-xs font-bold text-forest-900 hover-contrast-cta shadow-sm transition hover:bg-forest-900 hover:text-white lg:w-auto lg:px-7 lg:py-3.5 lg:text-base ' + (homepageTestimonials.length <= 3 ? 'md:hidden' : '')}
                >
                  {showAllTestimonials ? 'Show Fewer Reviews ↑' : `Show All Reviews (${homepageTestimonials.length}) ↓`}
                </button>
              </div>
            )}
            <div className="mt-3 text-center lg:mt-6">
              <Link to="/success-stories" className="flex min-h-12 w-full items-center justify-center rounded-full border border-forest-900/15 bg-white px-6 py-3 text-sm font-bold text-forest-900 hover-contrast-cta shadow-sm transition hover:bg-forest-900 hover:text-white lg:inline-flex lg:w-auto">
                View all testimonials →
              </Link>
            </div>
          </div>
        </section>
      )}

      <GoogleReviewCta />

      {/* NEWS & BLOG */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-6 lg:py-24">
        <div className="mb-8 flex items-end justify-between gap-4 lg:mb-12">
          <div>
            <Eyebrow>News &amp; Blog</Eyebrow>
            <h2 className="mt-2 text-2xl font-extrabold text-forest-900 lg:mt-4 lg:text-5xl">Latest visa updates.</h2>
          </div>
          <Link to="/updates" className="shrink-0 text-xs font-bold text-coral-600 hover:underline lg:text-base">
            All articles →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
          {posts.slice(0, 3).map((p) => (
            <PostCard key={p.slug} p={p} />
          ))}
        </div>
      </section>

      {/* FAQ + ENQUIRY */}
      <section id="enquiry" className="scroll-mt-36 lg:scroll-mt-44 mx-auto grid max-w-7xl gap-10 px-5 pb-32 sm:pb-24 lg:grid-cols-[1fr_1.1fr] lg:gap-12 lg:px-6 lg:pb-28">
        <div>
          <Eyebrow>FAQs</Eyebrow>
          <h2 className="mt-2 text-2xl font-extrabold text-forest-900 lg:mt-4 lg:text-4xl">Questions we hear every day.</h2>
          <div className="mt-6 divide-y divide-forest-900/10 rounded-3xl bg-white ring-1 ring-forest-900/10 shadow-sm lg:mt-8">
            {settings.faqs.map((f, i) => (
              <details key={`${f.q}-${i}`} className="group p-5 [&_summary::-webkit-details-marker]:hidden lg:p-6">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-[15px] font-bold text-forest-900 lg:text-lg">
                  <span>{f.q}</span>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-forest-50 text-coral-600 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-xs leading-relaxed text-forest-900/75 lg:text-base lg:text-forest-900/70">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 flex items-center gap-2 text-xs text-forest-900/60 lg:text-sm">
            <MapPin className="size-4 shrink-0 text-coral-500" /> {site.address}
          </p>
        </div>
        <div className="rounded-3xl bg-forest-900 bg-grain p-6 text-white shadow-xl lg:rounded-[2.5rem] lg:p-10 lg:shadow-2xl">
          <h2 className="text-xl font-extrabold !text-white lg:text-3xl">Get a free profile evaluation</h2>
          <p className="mt-1.5 mb-6 text-xs text-forest-100/70 lg:mt-2 lg:mb-8 lg:text-base">Share a few details — a counsellor calls you back within one working day.</p>
          <EnquiryForm source="home" dark />
        </div>
      </section>
    </div>
  )
}