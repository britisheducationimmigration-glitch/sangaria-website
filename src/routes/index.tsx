import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRight, Award, BadgeCheck, CheckCircle2, ChevronRight, Globe2, GraduationCap, Headphones, MapPin, Sparkles, Star, Timer } from 'lucide-react'
import { useState, type FormEvent } from 'react'
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
  { value: '2,500+', label: 'Visas approved', icon: Award },
  { value: '98%', label: 'Success ratio', icon: BadgeCheck },
  { value: '7', label: 'Destinations', icon: Globe2 },
  { value: '7.0', label: 'Avg. IELTS band', icon: Star },
]

const steps = [
  { n: '01', title: 'Free counselling', text: 'Visit our Sangaria office or call — we assess your profile honestly.' },
  { n: '02', title: 'Test preparation', text: 'IELTS or PTE coaching in small batches until you hit your target score.' },
  { n: '03', title: 'Admission & file', text: 'University offers, SOP, funds and a complete, embassy-ready visa file.' },
  { n: '04', title: 'Visa & departure', text: 'Biometrics, interview prep, forex, tickets and pre-departure briefing.' },
]

function Home() {
  const { approvals, posts, testimonials, settings } = Route.useLoaderData()
  const navigate = useNavigate()

  // Interactive State for Country Spotlight (Style 1 Feature)
  const [activeCountrySlug, setActiveCountrySlug] = useState('canada')
  const activeCountry = countries.find((c) => c.slug === activeCountrySlug) || countries[0]

  // Hero Quick Matcher State
  const [quickCountry, setQuickCountry] = useState('Canada')
  const [quickVisa, setQuickVisa] = useState('Study Visa')

  function handleQuickMatch(e: FormEvent) {
    e.preventDefault()
    void navigate({ to: '/eligibility' })
  }

  return (
    <div className="min-h-screen bg-sand/30 text-forest-900 selection:bg-coral-500 selection:text-white">
      {/* 1. HERO SECTION (EdTech Modern Split with Interactive Matcher) */}
      <section className="relative overflow-hidden bg-forest-900 bg-grain text-white pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-coral-400 ring-1 ring-white/15 backdrop-blur">
                <Sparkles className="size-3.5" /> Sangaria & Hanumangarh's Most Trusted Visa Centre
              </div>

              <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl sm:leading-[0.98] xl:text-[4.8rem]">
                Your Global Future.
                <br />
                <span className="text-coral-500">Made in Sangaria.</span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-relaxed text-forest-100/80 sm:text-lg">
                Study visas, PR, work permits and IELTS / PTE coaching for Canada, UK, Australia, USA, New Zealand & Europe.
              </p>

              {/* LIVE QUICK MATCHER (LeapScholar Style Widget) */}
              <form onSubmit={handleQuickMatch} className="mt-8 rounded-2xl bg-white/10 p-3 ring-1 ring-white/20 backdrop-blur-md sm:rounded-full sm:p-2 sm:pl-5">
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
                  <div className="flex-1">
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-coral-400">Target Country</span>
                    <select
                      value={quickCountry}
                      onChange={(e) => setQuickCountry(e.target.value)}
                      className="w-full bg-transparent text-sm font-bold text-white focus:outline-none [&>option]:bg-forest-900 [&>option]:text-white cursor-pointer"
                    >
                      <option>Canada 🇨🇦</option>
                      <option>United Kingdom 🇬🇧</option>
                      <option>Australia 🇦🇺</option>
                      <option>United States 🇺🇸</option>
                      <option>New Zealand 🇳🇿</option>
                      <option>Germany 🇩🇪</option>
                    </select>
                  </div>
                  <div className="h-6 w-px bg-white/20 hidden sm:block" />
                  <div className="flex-1">
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-coral-400">Service</span>
                    <select
                      value={quickVisa}
                      onChange={(e) => setQuickVisa(e.target.value)}
                      className="w-full bg-transparent text-sm font-bold text-white focus:outline-none [&>option]:bg-forest-900 [&>option]:text-white cursor-pointer"
                    >
                      <option>Study Visa</option>
                      <option>IELTS / PTE Coaching</option>
                      <option>Permanent Residency (PR)</option>
                      <option>Spouse / Dependent</option>
                      <option>Tourist Visa</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-xl bg-coral-500 px-6 py-3.5 text-xs font-bold text-white shadow-lg transition hover:bg-coral-600 sm:rounded-full sm:text-sm"
                  >
                    Check Eligibility <ArrowRight className="size-4" />
                  </button>
                </div>
              </form>

              {/* STATS TICKER */}
              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {stats.map(({ value, label, icon: Icon }) => (
                  <div key={label} className="rounded-2xl bg-white/5 p-3.5 ring-1 ring-white/10 backdrop-blur-xs">
                    <Icon className="size-4 text-coral-400 mb-1" />
                    <span className="font-display text-2xl font-extrabold text-white sm:text-3xl">{value}</span>
                    <span className="block text-[10px] uppercase tracking-wider text-forest-100/60">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* HERO RIGHT: FLOATING GLASS CARDS (Zero Collision, Modern Floating Badges) */}
            <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">
              <div className="relative overflow-hidden rounded-[2.5rem] ring-1 ring-white/15 shadow-2xl">
                <img
                  src={img('/img/hero.webp', 720, 860)}
                  alt="Student with passport and acceptance letter"
                  width={720}
                  height={860}
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent" />
              </div>

              {/* Floating Glass Badge 1 (Top Left) */}
              <div className="absolute -top-3 -left-3 sm:-top-5 sm:-left-5 rounded-2xl bg-forest-950/85 p-3 sm:p-4 text-white shadow-2xl ring-1 ring-white/20 backdrop-blur-md animate-bounce duration-1000">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-9 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold sm:text-sm">Visa Approved 🎉</p>
                    <p className="text-[10px] text-forest-100/70">Canada · Sept Intake</p>
                  </div>
                </div>
              </div>

              {/* Floating Glass Badge 2 (Bottom Right) */}
              <div className="absolute -bottom-4 -right-2 sm:-bottom-5 sm:-right-4 rounded-2xl bg-forest-950/85 p-3 sm:p-4 text-white shadow-2xl ring-1 ring-white/20 backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-9 place-items-center rounded-xl bg-coral-500/20 text-coral-400 ring-1 ring-coral-500/40">
                    <Star className="size-5 fill-coral-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold sm:text-sm">PTE Score: 79+ / 90</p>
                    <p className="text-[10px] text-forest-100/70">Sangaria Computer Lab</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* APPROVALS MARQUEE TICKER */}
      {settings.approvalsMarqueeEnabled && (
        <div className="overflow-hidden border-b border-forest-900/10 bg-coral-500 py-3 text-white">
          <div className="flex w-max animate-marquee gap-8 whitespace-nowrap font-display text-sm font-bold sm:text-base">
            {[...approvals, ...approvals].map((a, i) => (
              <span key={i} className="flex items-center gap-2">
                <CountryFlag flag={a.flag} country={a.country} className="inline-block h-3.5 w-5 shrink-0" /> {a.name} — {a.visa} approved <span className="text-white/40">✦</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 2. INTERACTIVE COUNTRY SPOTLIGHT (Replaces 8 giant cards with 1 interactive screen!) */}
      <section id="destinations" className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <Eyebrow>Top Study Destinations</Eyebrow>
            <h2 className="mt-2.5 text-3xl font-extrabold sm:text-4xl text-forest-900">Explore Countries & Work Rights</h2>
            <p className="mt-2 text-sm text-forest-900/60">Tap any country to instantly view post-study work permits, fee estimates and top intakes.</p>
          </div>

          {/* Country Tabs Selector */}
          <div className="mt-8 flex gap-2 overflow-x-auto pb-2 justify-start sm:justify-center no-scrollbar">
            {countries.map((c) => (
              <button
                type="button"
                key={c.slug}
                onClick={() => setActiveCountrySlug(c.slug)}
                className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition whitespace-nowrap ${
                  activeCountrySlug === c.slug
                    ? 'bg-forest-900 text-white shadow-md'
                    : 'bg-white text-forest-900/80 ring-1 ring-forest-900/10 hover:bg-forest-50'
                }`}
              >
                <CountryFlag code={c.code} flag={c.flag} country={c.name} className="h-4 w-5 shrink-0" />
                <span>{c.name}</span>
              </button>
            ))}
          </div>

          {/* The Interactive Spotlight Card */}
          <div className="mt-6 rounded-3xl bg-white p-6 sm:p-10 shadow-sm ring-1 ring-forest-900/10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <div className="flex items-center gap-3">
                <CountryFlag code={activeCountry.code} flag={activeCountry.flag} country={activeCountry.name} className="h-8 w-12 shrink-0 shadow-xs" />
                <div>
                  <h3 className="text-2xl font-extrabold text-forest-900 sm:text-3xl">{activeCountry.name}</h3>
                  <p className="text-xs font-semibold text-coral-600">{activeCountry.headline}</p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-forest-900/70">{activeCountry.intro}</p>

              {/* Key Specs Grid */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {activeCountry.stats.map((st) => (
                  <div key={st.label} className="rounded-2xl bg-forest-50/60 p-3.5 border border-forest-900/5">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-forest-900/50">{st.label}</span>
                    <span className="font-bold text-sm text-forest-900">{st.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/countries/$slug"
                  params={{ slug: activeCountry.slug }}
                  className="rounded-full bg-forest-900 px-6 py-3 text-xs font-bold text-white transition hover:bg-forest-800"
                >
                  Full {activeCountry.name} Visa Guide →
                </Link>
                <Link
                  to="/eligibility"
                  className="rounded-full bg-coral-500 px-6 py-3 text-xs font-bold text-white transition hover:bg-coral-600"
                >
                  Check Free Eligibility
                </Link>
              </div>
            </div>

            {/* Quick Highlights Box */}
            <div className="rounded-2xl bg-sand/40 p-6 border border-forest-900/10">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-forest-900/60">Highlights & Requirements</h4>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-2.5 text-xs text-forest-900/80">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><b>Intakes:</b> {activeCountry.intakes.join(', ')}</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-forest-900/80">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><b>English Criteria:</b> {activeCountry.english}</span>
                </li>
                {activeCountry.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-xs text-forest-900/80">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES GRID */}
      <section id="services" className="bg-white py-14 sm:py-20 border-y border-forest-900/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <Eyebrow>Comprehensive Visa Solutions</Eyebrow>
              <h2 className="mt-2 text-3xl font-extrabold text-forest-900 sm:text-4xl">Every Visa Type, One Team</h2>
            </div>
            <Link to="/visas" className="text-sm font-bold text-coral-600 hover:underline">
              Browse all 6 services →
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visaServices.map((s, i) => (
              <Link
                key={s.slug}
                to="/visas"
                hash={s.slug}
                className="group relative flex flex-col justify-between rounded-2xl bg-cream p-5 ring-1 ring-forest-900/10 transition hover:-translate-y-1 hover:bg-forest-900 hover:text-white"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-xl bg-forest-900 text-white group-hover:bg-coral-500 transition">
                      <ServiceIcon name={s.icon} className="size-5" />
                    </span>
                    <span className="font-mono text-xs opacity-40">0{i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold sm:text-xl">{s.title}</h3>
                  <p className="mt-1 text-xs opacity-70 line-clamp-2">{s.summary}</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-coral-600 group-hover:text-coral-400">
                  <span>Requirements & Process</span>
                  <ChevronRight className="size-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COACHING & LAB SECTION */}
      <section id="coaching" className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 grid gap-10 lg:grid-cols-2 items-center">
          <div className="relative">
            <img
              src={img('/img/coaching.webp', 760, 560)}
              alt="IELTS and PTE coaching lab Sangaria"
              width={760}
              height={560}
              className="aspect-[16/11] w-full rounded-3xl object-cover shadow-lg"
            />
            <div className="absolute -bottom-4 right-4 rounded-2xl bg-forest-900 p-4 text-white shadow-xl">
              <span className="font-display text-3xl font-extrabold text-coral-500">79+</span>
              <span className="block text-[10px] uppercase tracking-wider text-forest-100/70">Top PTE Score This Month</span>
            </div>
          </div>
          <div>
            <Eyebrow>In-House Computer Lab</Eyebrow>
            <h2 className="mt-2 text-3xl font-extrabold text-forest-900 sm:text-4xl">IELTS & PTE Coaching in Sangaria</h2>
            <p className="mt-3 text-sm text-forest-900/70 leading-relaxed">
              Dedicated test software, headphone labs, daily speaking interviews, and small batches of 15 students to ensure target band scores.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { icon: Headphones, t: 'Real-Exam PTE Lab' },
                { icon: Timer, t: 'Weekly Timed Mock Tests' },
                { icon: Award, t: 'Certified Master Trainers' },
                { icon: BadgeCheck, t: 'Free 2-Day Demo Class' },
              ].map(({ icon: Icon, t }) => (
                <div key={t} className="flex items-center gap-2.5 rounded-2xl bg-white p-3.5 text-xs font-bold text-forest-900 ring-1 ring-forest-900/10">
                  <Icon className="size-4 text-coral-500 shrink-0" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
            <div className="mt-7 flex items-center gap-4">
              <Link to="/coaching" className="rounded-full bg-forest-900 px-6 py-3.5 text-xs font-bold text-white transition hover:bg-forest-800">
                View Batches & Timings →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROCESS TIMELINE */}
      <section className="bg-forest-900 bg-grain py-14 sm:py-20 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center max-w-xl mx-auto">
            <Eyebrow light>How It Works</Eyebrow>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Your Visa Roadmap</h2>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                <span className="font-display text-4xl font-extrabold text-coral-500">{s.n}</span>
                <h3 className="mt-3 text-base font-bold">{s.title}</h3>
                <p className="mt-1 text-xs text-forest-100/70 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. RECENT APPROVALS & REVIEWS */}
      <section id="approvals" className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <Eyebrow>Proven Track Record</Eyebrow>
              <h2 className="mt-2 text-3xl font-extrabold text-forest-900 sm:text-4xl">Recent Visa Approvals</h2>
            </div>
            <Link to="/success-stories" className="text-sm font-bold text-coral-600 hover:underline">
              See all reviews & stories →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {approvals.slice(0, 4).map((a, i) => (
              <ApprovalCard key={a.name} a={a} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section id="testimonials" className="bg-sand/60 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Eyebrow>Student Feedback</Eyebrow>
          <h2 className="mt-2 text-3xl font-extrabold text-forest-900 sm:text-4xl">What Sangaria Students Say</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.slice(0, 3).map((t, i) => (
              <TestimonialCard key={t.name} t={t} featured={i === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ + QUICK ENQUIRY */}
      <section id="enquiry" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 grid gap-8 lg:grid-cols-[1fr_1.1fr] items-start">
        <div>
          <Eyebrow>Got Questions?</Eyebrow>
          <h2 className="mt-2 text-3xl font-extrabold text-forest-900">Frequently Asked Questions</h2>
          <div className="mt-6 divide-y divide-forest-900/10 rounded-2xl bg-white ring-1 ring-forest-900/10">
            {faqs.map((f) => (
              <details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-bold text-forest-900">
                  {f.q}
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-forest-50 text-coral-600 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-xs leading-relaxed text-forest-900/70">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs text-forest-900/60">
            <MapPin className="size-4 shrink-0 text-coral-500" /> {site.address}
          </p>
        </div>

        <div className="rounded-3xl bg-forest-900 bg-grain p-6 sm:p-8 text-white shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-coral-400">Fast Assessment</span>
          <h3 className="mt-1 text-2xl font-extrabold">Free Profile Evaluation</h3>
          <p className="mt-1 mb-6 text-xs text-forest-100/70">Fill details — our counsellor calls you or chats on WhatsApp.</p>
          <EnquiryForm source="home-style1" dark />
        </div>
      </section>
    </div>
  )
}
