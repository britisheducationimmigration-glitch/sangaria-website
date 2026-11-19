import { useEffect, useState, useRef, lazy, Suspense, type CSSProperties } from 'react'
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

const rotatingWords: Array<{ text: string; icon?: string; flagCode?: string }> = [
  { text: 'the visa.', icon: '✈️' },
  { text: 'Canada PR.', flagCode: 'CA' },
  { text: 'Study Permits.', icon: '🎓' },
  { text: 'UK Degrees.', flagCode: 'UK' },
  { text: 'IELTS 7.5+.', icon: '📚' },
]

const heroFlightDestinations: Record<string, { code: string; city: string; flagCode: string }> = {
  canada: { code: 'YYZ', city: 'Toronto', flagCode: 'CA' },
  uk: { code: 'LHR', city: 'London', flagCode: 'UK' },
  australia: { code: 'MEL', city: 'Melbourne', flagCode: 'AU' },
  usa: { code: 'JFK', city: 'New York', flagCode: 'US' },
  germany: { code: 'BER', city: 'Berlin', flagCode: 'DE' },
  'new-zealand': { code: 'AKL', city: 'Auckland', flagCode: 'NZ' },
  europe: { code: 'CDG', city: 'Paris · EU', flagCode: 'EU' },
}

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

  const current = rotatingWords[wordIndex]

  return (
    <span
      className={
        'inline-flex items-center gap-2.5 lg:gap-3.5 transition-all duration-300 transform ' +
        (fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2')
      }
    >
      <span className="text-white">{current.text}</span>
      {current.flagCode ? (
        <CountryFlag
          code={current.flagCode}
          className="h-7 w-10 shrink-0 rounded-md shadow-md ring-1 ring-white/25 sm:h-9 sm:w-13 lg:h-10 lg:w-14"
        />
      ) : (
        <span aria-hidden="true" className="inline-block text-2xl lg:text-4xl xl:text-5xl">
          {current.icon}
        </span>
      )}
    </span>
  )
}

function CountUpStat({ value }: { value: string }) {
  const [display, setDisplay] = useState(value)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const match = value.trim().match(/^(\d[\d,]*(?:\.\d+)?)(.*)$/)
    if (!match) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rawNum = match[1]
    const suffix = match[2] ?? ''
    const target = Number(rawNum.replaceAll(',', ''))
    if (!Number.isFinite(target) || target <= 0) return
    const decimals = rawNum.includes('.') ? rawNum.split('.')[1].length : 0
    const hasComma = rawNum.includes(',')
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    let frameId = 0
    let started = false
    const observer = new IntersectionObserver(
      (entries) => {
        if (started || !entries[0]?.isIntersecting) return
        started = true
        observer.disconnect()
        const duration = 1100
        const startTime = performance.now()
        const tick = (now: number) => {
          const progress = Math.min(1, (now - startTime) / duration)
          const eased = 1 - Math.pow(1 - progress, 3)
          const current = target * eased
          const formatted = decimals > 0
            ? current.toFixed(decimals)
            : hasComma
              ? Math.round(current).toLocaleString('en-US')
              : String(Math.round(current))
          setDisplay(`${formatted}${suffix}`)
          if (progress < 1) frameId = window.requestAnimationFrame(tick)
          else setDisplay(value)
        }
        frameId = window.requestAnimationFrame(tick)
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      if (frameId) window.cancelAnimationFrame(frameId)
    }
  }, [value])

  return <span ref={ref}>{display}</span>
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
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const [isSticky, setIsSticky] = useState(false)
  const [headerOffset, setHeaderOffset] = useState(68)
  const [jumpHeight, setJumpHeight] = useState(50)
  const jumpWrapRef = useRef<HTMLDivElement>(null)
  const jumpBarRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const root = pageRef.current
    if (!root || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-reveal', 'visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -36px 0px' },
    )
    for (const el of nodes) {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.92) {
        el.setAttribute('data-reveal', 'hidden')
        observer.observe(el)
      } else {
        el.setAttribute('data-reveal', 'visible')
      }
    }
    return () => observer.disconnect()
  }, [])

  const visibleJumpSections = homeJumpSections.filter((section) => {
    if (section.id === 'approvals') return homepageApprovals.length > 0
    if (section.id === 'certificates') return certificates.some((certificate) => certificate.published && certificate.homepageFeatured)
    if (section.id === 'reviews') return homepageTestimonials.length > 0
    return true
  })

  const visibleTestimonials = showAllTestimonials ? homepageTestimonials : homepageTestimonials.slice(0, 3)
  const selectedCountryObj = countries.find((c) => c.slug === selectedCountry)
  const selectedCountryName = selectedCountryObj?.name ?? 'Country'
  const selectedVisaTitle = visaInterestMap[selectedVisa]
  const activeFlight = heroFlightDestinations[selectedCountry] ?? {
    code: (selectedCountryObj?.code || 'INT').toUpperCase(),
    city: selectedCountryObj?.name || 'Worldwide',
    flagCode: selectedCountryObj?.code || '',
  }
  const primaryCtaClass =
    'group cta-shimmer inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-coral-500 px-4 py-3 text-xs font-extrabold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-coral-600 active:scale-[0.98] lg:text-sm'

  return (
    <div ref={pageRef} className="bg-cream text-forest-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-forest-900 bg-aurora-live text-white">
        <div aria-hidden="true" className="hero-grid-lines pointer-events-none absolute inset-0 z-0" />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-5 pt-8 pb-14 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:px-6 lg:pt-24 lg:pb-20">
          <div className="relative isolate">
            <InteractiveFlightGlobe
              selectedCountry={selectedCountry}
              className="hero-globe-mask pointer-events-none absolute -top-8 -right-14 z-0 h-[320px] w-[320px] opacity-45 sm:h-[360px] sm:w-[360px] lg:-top-20 lg:-right-8 lg:h-[440px] lg:w-[440px] lg:opacity-65 xl:-right-4 xl:h-[480px] xl:w-[480px]"
            />
            <div className="relative z-10">
              <div className="animate-rise">
                <Eyebrow light>Sangaria · Hanumangarh · Since day one</Eyebrow>
              </div>

              <h1 className="mt-5 text-[2.6rem] font-extrabold leading-[1.03] tracking-tight sm:text-6xl lg:mt-7 lg:text-[4.2rem] lg:leading-[1.08] xl:text-[4.8rem]">
                <span className="block overflow-hidden pb-0.5">
                  <span className="kinetic-line [animation-delay:40ms]">Pack your bags.</span>
                </span>
                <span className="block overflow-visible pb-2.5">
                  <span className="kinetic-line relative inline-block [animation-delay:120ms]">
                    <span className="bg-gradient-to-r from-amber-300 via-amber-100 to-coral-400 bg-clip-text text-transparent [-webkit-background-clip:text] font-extrabold">
                      We’ll handle
                    </span>
                    <svg viewBox="0 0 300 20" className="absolute -bottom-2 left-0 w-full overflow-visible lg:-bottom-2.5" aria-hidden="true">
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
                </span>
                <span className="inline-flex min-h-[1.2em] items-center gap-2 overflow-visible pb-1 lg:whitespace-nowrap lg:gap-3">
                  <HeroRotatingWord />
                </span>
              </h1>

              <p className="mt-3 max-w-xl animate-rise text-sm leading-relaxed text-forest-100/85 lg:mt-6 lg:text-lg lg:text-forest-100/80 [animation-delay:180ms]">
                Study visas, PR, work permits, tourist visas and IELTS / PTE coaching for Canada, UK, Australia, USA, New Zealand, Germany and Europe —
                all under one roof at {site.name}.
              </p>

              {/* QUICK COUNTRY & VISA FINDER */}
              <div className="mt-7 max-w-xl animate-rise overflow-hidden rounded-3xl border border-white/20 bg-forest-950/75 p-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.65)] ring-1 ring-white/10 backdrop-blur-xl sm:p-6 [animation-delay:240ms]">
                <div className="mb-3 flex items-center justify-between gap-3 lg:mb-4">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-coral-400 lg:text-xs">Visa & Country Finder</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[9px] font-semibold text-white/85 lg:px-3 lg:py-1 lg:text-[10px]">
                    <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden="true" /> Free Check
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="min-w-0">
                    <label htmlFor="home-finder-country" className="mb-1 block text-[10px] font-bold text-white/80 lg:text-xs">Country</label>
                    <div className="relative">
                      <span aria-hidden="true" className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center">
                        {selectedCountryObj ? (
                          <CountryFlag
                            code={selectedCountryObj.code}
                            flag={selectedCountryObj.flag}
                            country={selectedCountryObj.name}
                            className="h-3.5 w-5 rounded-[2px] shadow-xs lg:h-4 lg:w-6"
                          />
                        ) : (
                          <span className="text-xs lg:text-sm">🌐</span>
                        )}
                      </span>
                      <select
                        id="home-finder-country"
                        aria-label="Select Country"
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="w-full appearance-none truncate rounded-xl border border-forest-900/15 bg-white py-2.5 pl-9 pr-7 text-xs font-bold text-forest-900 shadow-sm outline-none lg:py-3 lg:pl-11 lg:pr-8 lg:text-sm"
                      >
                        {countries.map((c) => (
                          <option key={c.slug} value={c.slug}>{c.name}</option>
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
                    <Link to="/coaching" className={primaryCtaClass}>
                      <span className="truncate">Explore IELTS &amp; PTE Coaching</span>
                      <ArrowRight aria-hidden="true" className="size-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-1 lg:size-4" />
                    </Link>
                  ) : selectedVisaTitle && selectedCountry ? (
                    <Link to="/contact" search={{ interest: `${selectedCountryName} ${selectedVisaTitle}`.trim() }} className={primaryCtaClass}>
                      <span className="truncate">Enquire: {selectedCountryName} {selectedVisaTitle}</span>
                      <ArrowRight aria-hidden="true" className="size-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-1 lg:size-4" />
                    </Link>
                  ) : selectedVisa !== 'study' ? (
                    <Link to="/visas" hash={selectedVisa} className={primaryCtaClass}>
                      <span className="truncate">Explore {selectedVisaTitle || 'Visa Services'}</span>
                      <ArrowRight aria-hidden="true" className="size-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-1 lg:size-4" />
                    </Link>
                  ) : selectedCountry ? (
                    <Link to="/countries/$slug" params={{ slug: selectedCountry }} className={primaryCtaClass}>
                      <span className="truncate">Explore {selectedCountryName} Study Guide</span>
                      <ArrowRight aria-hidden="true" className="size-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-1 lg:size-4" />
                    </Link>
                  ) : (
                    <Link to="/countries" className={primaryCtaClass}>
                      <span className="truncate">Browse destinations</span>
                      <ArrowRight aria-hidden="true" className="size-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-1 lg:size-4" />
                    </Link>
                  )}
                  <div className="flex gap-2">
                    <Link to="/eligibility" className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-3 py-2.5 text-center text-xs font-bold text-white transition hover:bg-white/20 active:scale-[0.98] lg:px-4 lg:text-sm">
                      Eligibility Check
                    </Link>
                    <Link to="/contact" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-3.5 py-2.5 text-center text-xs font-bold text-white transition hover:bg-white/20 active:scale-[0.98] lg:px-4 lg:text-sm">
                      Contact
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-md lg:max-w-none">
            <div className="hidden lg:block absolute -inset-4 rotate-3 rounded-[2.5rem] bg-gradient-to-br from-coral-500/90 via-coral-600/80 to-amber-300/30 transition-transform duration-700 hover:rotate-2" />
            <img
              src="/img/hero.webp"
              alt="Student holding passport and university acceptance letter at the airport"
              width={720}
              height={860}
              fetchPriority="high"
              decoding="sync"
              className="relative aspect-[4/3] w-full rounded-2xl border border-white/15 object-cover shadow-2xl lg:aspect-[6/7] lg:rounded-[2rem] lg:border-0"
            />
            <div className="hero-card-float absolute bottom-0 inset-x-0 border-t border-forest-900/10 bg-cream/95 p-3.5 text-forest-900 backdrop-blur-md lg:inset-x-auto lg:-bottom-10 lg:-left-4 lg:w-[82%] lg:rounded-2xl lg:border lg:border-white/70 lg:p-4 lg:shadow-2xl xl:-left-12">
              <div className="flex items-center justify-between gap-2 font-mono text-[9px] uppercase tracking-wider text-forest-900/60 lg:text-[10px] lg:tracking-widest">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  BOARDING PASS
                </span>
                <span className="inline-flex items-center gap-1.5">
                  {activeFlight.flagCode && (
                    <CountryFlag code={activeFlight.flagCode} country={activeFlight.city} className="h-3 w-4.5 rounded-[2px] shadow-xs" />
                  )}
                  BEI · SANGARIA
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-2 font-display text-sm font-extrabold lg:mt-2">
                <div>
                  <span className="lg:text-3xl">SNG</span>
                  <span className="ml-1 text-[10px] font-normal text-forest-900/60 lg:ml-0 lg:block lg:text-[11px]">Sangaria</span>
                </div>
                <div className="relative flex flex-1 items-center justify-center px-2">
                  <div className="w-full border-b border-dashed border-coral-500/45" />
                  <span aria-hidden="true" className="flight-glide absolute text-sm text-coral-500 lg:text-base">✈</span>
                </div>
                <div key={activeFlight.code} className="animate-rise text-right [animation-duration:350ms]">
                  <span className="lg:text-3xl">{activeFlight.code}</span>
                  <span className="ml-1 text-[10px] font-normal text-forest-900/60 lg:ml-0 lg:block lg:text-[11px]">{activeFlight.city}</span>
                </div>
              </div>
            </div>
            {/* Rotating Editorial Circular Approval Seal */}
            <div className="stamp-float absolute top-3 right-3 grid size-[74px] place-items-center rounded-full border border-coral-400/50 bg-forest-950/88 text-coral-300 shadow-2xl backdrop-blur-md lg:top-5 lg:-right-4 lg:size-[116px] xl:-right-7">
              <svg viewBox="0 0 100 100" aria-hidden="true" className="seal-spin absolute inset-1 size-[calc(100%-8px)]">
                <defs>
                  <path id="hero-seal-path" d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
                </defs>
                <text fill="currentColor" fontSize="8.3" fontWeight="700" letterSpacing="2.35" className="font-mono uppercase">
                  <textPath href="#hero-seal-path">• VISA APPROVED • SANGARIA • BEI </textPath>
                </text>
              </svg>
              <span className="relative z-10 flex flex-col items-center leading-none">
                <span className="text-base font-black text-amber-200 lg:text-2xl">✓</span>
                <span className="mt-0.5 font-mono text-[7px] font-bold uppercase tracking-widest text-white/85 lg:text-[9px]">Verified</span>
              </span>
            </div>
          </div>
        </div>

        {/* UNIFIED DARK-GLASS BENTO STAT RIBBON */}
        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-12 lg:mt-4 lg:px-6 lg:pb-16">
          <dl className="grid grid-cols-2 divide-x divide-y divide-white/10 overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] shadow-2xl backdrop-blur-md sm:grid-cols-4 sm:divide-y-0">
            {settings.trustStats.map((s) => (
              <div
                key={s.label}
                className="group p-4 text-center transition-colors duration-300 hover:bg-white/[0.06] sm:p-5 lg:px-7 lg:py-6 lg:text-left"
              >
                <dt className="font-display text-2xl font-extrabold tabular-nums text-white lg:text-4xl">
                  <CountUpStat value={s.value} />
                </dt>
                <dd className="mt-1.5 flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-forest-100/75 lg:justify-start lg:text-xs">
                  <span className="size-1.5 rounded-full bg-coral-400 transition-transform duration-300 group-hover:scale-125" aria-hidden="true" />
                  <span>{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* WHY CHOOSE US TRUST STRIP */}
      <section className="border-b border-forest-900/10 bg-sand px-5 py-8 lg:px-6 lg:py-12">
        <div data-reveal="" className="mx-auto flex max-w-7xl flex-col justify-between gap-5 rounded-3xl border border-forest-900/10 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:gap-8 lg:rounded-[2.5rem] lg:p-8">
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

      {/* OBSIDIAN KINETIC APPROVALS MARQUEE */}
      {settings.approvalsMarqueeEnabled && homepageApprovals.length > 0 && (
        <section className="marquee-pause overflow-hidden border-b border-white/10 bg-forest-950 py-3.5 text-white lg:py-4">
          <div className="flex w-max animate-marquee gap-8 whitespace-nowrap font-display text-sm font-bold lg:gap-10 lg:text-base">
            {[...homepageApprovals, ...homepageApprovals].map((a, i) => (
              <span key={`${a.name}-${a.date}-${i}`} className="inline-flex items-center gap-2.5 lg:gap-3">
                <CountryFlag
                  flag={a.flag}
                  country={a.country}
                  className="h-[16px] w-[24px] shrink-0 rounded-[2px] ring-1 ring-white/20 lg:h-[18px] lg:w-[27px]"
                />
                <span className="text-white">{a.name}</span>
                <span className="rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-amber-200 lg:text-xs">
                  {a.visa} Approved
                </span>
                <span aria-hidden="true" className="text-coral-400/70">✦</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* SERVICES — ASYMMETRIC AWWWARDS BENTO GRID */}
      <section id="services" className="scroll-mt-36 lg:scroll-mt-44 border-b border-forest-900/10 bg-white px-5 py-20 lg:border-0 lg:bg-transparent lg:py-24">
        <div className="mx-auto max-w-7xl lg:px-1">
          <div data-reveal="" className="mb-8 flex items-end justify-between gap-4 lg:mb-12">
            <div>
              <Eyebrow>What we do</Eyebrow>
              <h2 className="mt-2 max-w-2xl text-2xl font-extrabold text-forest-900 lg:mt-4 lg:text-5xl">Every kind of visa, handled by one trusted team.</h2>
            </div>
            <Link to="/visas" className="shrink-0 text-xs font-bold text-coral-600 hover:underline lg:text-base">
              All visa services →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-12 lg:gap-5">
            {visaServices.map((s, i) => {
              const spanClass =
                i === 0
                  ? 'col-span-2 lg:col-span-7 bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800 text-white shadow-xl'
                  : i === 1
                    ? 'col-span-1 lg:col-span-5 border border-forest-900/10 bg-sand/70 text-forest-900 hover:border-coral-400/50'
                    : i === 2 || i === 3
                      ? 'col-span-1 lg:col-span-6 border border-forest-900/10 bg-white text-forest-900 hover:border-coral-400/50'
                      : i === 4
                        ? 'col-span-2 sm:col-span-1 lg:col-span-5 border border-forest-900/10 bg-white text-forest-900 hover:border-coral-400/50'
                        : 'col-span-2 lg:col-span-7 border border-coral-400/35 bg-gradient-to-br from-coral-100/75 via-white to-cream text-forest-900 hover:border-coral-500/60'
              const isDark = i === 0
              const isSpotlight = i === 5
              return (
                <Link
                  key={s.slug}
                  to="/visas"
                  hash={s.slug}
                  data-reveal=""
                  style={{ '--reveal-delay': `${i * 55}ms` } as CSSProperties}
                  className={
                    'group relative flex flex-col justify-between overflow-hidden rounded-3xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl active:scale-[0.98] lg:rounded-[2.25rem] lg:p-8 ' +
                    spanClass
                  }
                >
                  <span
                    aria-hidden="true"
                    className={'pointer-events-none absolute -right-2 -bottom-4 font-display text-7xl font-black leading-none select-none lg:text-8xl ' + (isDark ? 'text-white/[0.05]' : 'text-forest-900/[0.04]')}
                  >
                    0{i + 1}
                  </span>
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={'grid size-10 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110 lg:size-13 ' + (isDark ? 'bg-coral-500 text-white shadow-lg' : isSpotlight ? 'bg-coral-500/15 text-coral-600' : 'bg-forest-50 text-forest-700')}>
                        <ServiceIcon name={s.icon} className="size-4.5 lg:size-6" />
                      </span>
                      <span className={'font-mono text-[11px] font-bold ' + (isDark ? 'text-white/45' : isSpotlight ? 'rounded-full bg-coral-500/15 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-coral-600' : 'text-forest-900/35')}>
                        {isSpotlight ? 'Specialist Desk' : `0${i + 1}`}
                      </span>
                    </div>
                    <h3 className={'mt-4 text-base font-extrabold leading-snug lg:mt-6 lg:text-2xl ' + (isDark ? '!text-white' : 'text-forest-900')}>{s.title}</h3>
                    <p className={'mt-2 text-xs leading-relaxed lg:mt-3 lg:text-sm ' + (isDark ? 'text-forest-100/80' : 'text-forest-900/65')}>
                      {s.summary}
                    </p>
                  </div>
                  {isDark ? (
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                      <div className="flex flex-wrap gap-1.5">
                        {['Canada', 'UK', 'Australia', 'Germany'].map((tag) => (
                          <span key={tag} className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-white/90">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-coral-300">
                        Explore <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </div>
                  ) : (
                    <div className="mt-4 flex items-center justify-between pt-2 text-xs font-bold text-coral-600">
                      <span>Learn more</span>
                      <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* DESTINATIONS — SWIPE-SNAP PASSPORT CARDS ON MOBILE + EDITORIAL GRID ON PC */}
      <section id="destinations" className="scroll-mt-36 lg:scroll-mt-44 border-b border-forest-900/10 bg-sand/60 bg-dots px-5 py-20 lg:border-0 lg:py-24">
        <div data-reveal="" className="mx-auto max-w-7xl lg:px-1">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3 lg:mb-12">
            <div>
              <Eyebrow>Destinations</Eyebrow>
              <h2 className="mt-2 max-w-3xl text-2xl font-extrabold text-forest-900 lg:mt-4 lg:text-5xl">Choose where your next chapter begins.</h2>
              <p className="mt-2 text-xs text-forest-900/70 lg:hidden">Explore listed study destinations or ask us about others. Europe / Schengen is visitor guidance.</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-forest-900/15 bg-white px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-forest-900/70 lg:hidden">
              Swipe cards →
            </span>
          </div>
          <div className="mobile-snap-row -mx-5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-5 pb-3 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
            {countries.map((c) => (
              <Link
                key={c.slug}
                to="/countries/$slug"
                params={{ slug: c.slug }}
                className="group relative flex w-[76vw] max-w-[290px] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-3xl border border-forest-900/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:bg-forest-900 hover:text-white hover:shadow-xl active:scale-[0.98] lg:w-auto lg:max-w-none lg:rounded-[2.25rem] lg:border-0 lg:bg-cream lg:p-6 lg:ring-1 lg:ring-forest-900/10"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <CountryFlag
                      code={c.code}
                      flag={c.flag}
                      country={c.name}
                      className="h-7 w-10 shrink-0 rounded-md shadow-sm transition-transform duration-300 group-hover:scale-110 lg:h-8 lg:w-12"
                    />
                    <span className="rounded-full bg-forest-50 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-forest-800/70 transition-colors group-hover:bg-white/15 group-hover:!text-white/90">
                      {c.code}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-extrabold leading-tight text-forest-900 group-hover:!text-white lg:mt-6 lg:text-2xl">{c.name}</h3>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-forest-900/65 group-hover:!text-white/80 lg:line-clamp-none lg:text-sm lg:text-forest-900/70">{c.headline}</p>
                </div>
                <div className="mt-4 flex items-end justify-between border-t border-dashed border-forest-900/15 pt-3 text-xs group-hover:border-white/20 lg:mt-5 lg:pt-4 lg:text-sm">
                  <span className="text-forest-900 group-hover:!text-white">
                    <span className="block text-[10px] uppercase tracking-widest text-forest-900/55 group-hover:!text-white/60">{c.stats[0]?.label}</span>
                    <span className="font-bold text-coral-600 group-hover:!text-amber-200 lg:text-forest-900 lg:group-hover:!text-amber-200">{c.stats[0]?.value}</span>
                  </span>
                  <ArrowRight aria-hidden="true" className="size-4 text-coral-500 transition-transform duration-200 group-hover:translate-x-1 lg:size-5" />
                </div>
              </Link>
            ))}
            <Link to="/eligibility" className="cta-shimmer flex w-[76vw] max-w-[290px] shrink-0 snap-center flex-col justify-between rounded-3xl bg-coral-500 p-5 text-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:bg-coral-600 hover:shadow-xl active:scale-[0.98] lg:w-auto lg:max-w-none lg:rounded-[2.25rem] lg:p-6">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white/85">Not sure?</span>
                <h3 className="mt-3 text-lg font-extrabold !text-white leading-tight lg:mt-6 lg:text-2xl">
                  Find the country that fits your profile in 60 seconds →
                </h3>
                <p className="mt-2 text-xs text-white/85 lg:hidden">Free 60-second profile assessment</p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3 text-xs font-bold">
                <span>Start free check</span>
                <ArrowRight aria-hidden="true" className="size-4" />
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

      {/* COACHING — DUAL FLOATING GLASS PILLS */}
      <section id="coaching" className="scroll-mt-36 lg:scroll-mt-44 mx-auto grid max-w-7xl items-center gap-8 px-5 py-20 lg:grid-cols-2 lg:gap-14 lg:px-6 lg:py-24">
        <div data-reveal="" className="relative">
          <img
            src="/img/coaching.webp"
            alt="IELTS and PTE coaching classroom"
            width={760}
            height={560}
            loading="lazy"
            className="aspect-[16/10] w-full rounded-3xl object-cover shadow-lg lg:aspect-[19/14] lg:rounded-[2.5rem] lg:shadow-2xl"
          />
          <div className="hero-card-float-slow absolute left-3 top-3 rounded-2xl border border-white/25 bg-forest-950/85 px-3.5 py-2 text-white shadow-xl backdrop-blur-md lg:-left-5 lg:top-6 lg:px-4 lg:py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-amber-200 lg:text-[10px]">IELTS Target</span>
              <span className="font-display text-xs font-extrabold text-white lg:text-sm">7.5+ Band</span>
            </div>
            <div className="mt-1.5 h-1.5 w-28 overflow-hidden rounded-full bg-white/15 lg:w-36">
              <div className="band-meter-fill h-full w-full rounded-full bg-gradient-to-r from-amber-300 to-coral-400" />
            </div>
          </div>
          <div className="hero-card-float absolute right-3 bottom-3 rounded-2xl border border-white/15 bg-forest-900/92 px-3.5 py-1.5 text-white shadow-xl backdrop-blur-md lg:-right-4 lg:-bottom-6 lg:rounded-3xl lg:bg-forest-900 lg:p-5">
            <span className="font-display text-lg font-extrabold text-coral-400 lg:block lg:text-4xl lg:text-coral-500">79+</span>
            <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider text-forest-100/80 lg:ml-0 lg:block lg:text-xs lg:text-forest-100/70">Top PTE score</span>
          </div>
        </div>
        <div data-reveal="" style={{ '--reveal-delay': '100ms' } as CSSProperties}>
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
              <li key={t} className="flex items-center gap-2 rounded-2xl border border-forest-900/10 bg-forest-50/70 p-3 text-xs font-semibold text-forest-900 shadow-sm transition hover:-translate-y-0.5 hover:border-coral-400/40 lg:gap-3 lg:bg-white lg:p-4 lg:text-base">
                <Icon className="size-4 shrink-0 text-coral-500 lg:size-5" />
                <span className="truncate">{t}</span>
              </li>
            ))}
          </ul>
          <Link to="/coaching" className="cta-shimmer mt-8 block w-full rounded-full bg-forest-900 py-4 text-center text-xs font-bold text-white shadow-md transition hover:bg-forest-700 active:scale-[0.98] lg:inline-flex lg:w-auto lg:px-7 lg:text-base">
            View batches &amp; timings →
          </Link>
        </div>
      </section>

      {/* PROCESS — CONNECTED FLIGHT-PATH TIMELINE */}
      <section className="relative overflow-hidden bg-forest-900 bg-grain px-5 py-20 text-white lg:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div data-reveal="" className="mb-8 lg:mb-14">
            <Eyebrow light>How it works</Eyebrow>
            <h2 className="mt-2 max-w-2xl text-2xl font-extrabold !text-white lg:mt-4 lg:text-5xl">Four steps from Sangaria to your dream destination.</h2>
          </div>
          <div className="relative">
            <div aria-hidden="true" className="pointer-events-none hidden md:block absolute top-11 left-[12%] right-[12%] border-t-2 border-dashed border-coral-400/35" />
            <ol className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-4 lg:gap-6">
              {steps.map((s, i) => {
                const checkpoints = ['SNG Office', 'Test Prep', 'Offer & File', 'Fly Abroad']
                return (
                  <li
                    key={s.n}
                    data-reveal=""
                    style={{ '--reveal-delay': `${i * 85}ms` } as CSSProperties}
                    className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-forest-950/45 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-coral-400/50 hover:bg-white/10 lg:rounded-[2.25rem] lg:p-7 lg:shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-grid size-9 place-items-center rounded-full border border-coral-400/50 bg-coral-500/20 font-mono text-xs font-extrabold text-coral-300 lg:size-11 lg:text-sm">
                          {s.n}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-amber-200/90 lg:px-2.5 lg:text-[10px]">
                          {checkpoints[i]}
                        </span>
                      </div>
                      <h3 className="mt-4 text-sm font-bold !text-white leading-tight lg:mt-6 lg:text-xl">{s.title}</h3>
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed text-forest-100/75 lg:text-sm">{s.text}</p>
                  </li>
                )
              })}
            </ol>
          </div>
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

      {/* FAQ + ENQUIRY — SMOOTH ACCORDION & CONCIERGE LOUNGE */}
      <section id="enquiry" className="scroll-mt-36 lg:scroll-mt-44 mx-auto grid max-w-7xl gap-10 px-5 pb-32 sm:pb-24 lg:grid-cols-[1fr_1.1fr] lg:gap-12 lg:px-6 lg:pb-28">
        <div data-reveal="">
          <Eyebrow>FAQs</Eyebrow>
          <h2 className="mt-2 text-2xl font-extrabold text-forest-900 lg:mt-4 lg:text-4xl">Questions we hear every day.</h2>
          <div className="mt-6 divide-y divide-forest-900/10 rounded-3xl bg-white ring-1 ring-forest-900/10 shadow-sm lg:mt-8">
            {settings.faqs.map((f, i) => {
              const isOpen = openFaq === i
              return (
                <div key={`${f.q}-${i}`} className="p-5 lg:p-6">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 text-left font-display text-[15px] font-bold text-forest-900 lg:text-lg"
                  >
                    <span>{f.q}</span>
                    <span
                      aria-hidden="true"
                      className={'grid size-8 shrink-0 place-items-center rounded-full bg-forest-50 text-coral-600 transition-transform duration-300 ' + (isOpen ? 'rotate-45 bg-coral-500/15' : '')}
                    >
                      +
                    </span>
                  </button>
                  <div className="faq-panel" data-open={isOpen ? 'true' : 'false'}>
                    <div>
                      <p className="pt-3 text-xs leading-relaxed text-forest-900/75 lg:text-base lg:text-forest-900/70">{f.a}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="mt-6 flex items-center gap-2 text-xs text-forest-900/60 lg:text-sm">
            <MapPin className="size-4 shrink-0 text-coral-500" /> {site.address}
          </p>
        </div>
        <div data-reveal="" style={{ '--reveal-delay': '100ms' } as CSSProperties} className="rounded-3xl border border-white/10 bg-forest-900 bg-grain p-6 text-white shadow-xl lg:rounded-[2.5rem] lg:p-10 lg:shadow-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            Counsellor replies within 1 working day
          </span>
          <h2 className="mt-4 text-xl font-extrabold !text-white lg:text-3xl">Get a free profile evaluation</h2>
          <p className="mt-1.5 mb-6 text-xs text-forest-100/75 lg:mt-2 lg:mb-8 lg:text-base">Share a few details — honest guidance from our Sangaria desk.</p>
          <EnquiryForm source="home" dark />
        </div>
      </section>
    </div>
  )
}
