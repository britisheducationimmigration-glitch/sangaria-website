import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Award, BadgeCheck, CheckCircle2, ChevronRight, Globe2, Headphones, MapPin, Sparkles, Star, Timer } from 'lucide-react'
import { useState } from 'react'
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

  // Interactive Country State (Works for ALL countries: Canada, UK, Australia, USA, NZ, Germany, Europe)
  const [activeCountrySlug, setActiveCountrySlug] = useState('canada')
  const activeCountry = countries.find((c) => c.slug === activeCountrySlug) || countries[0]

  // Expandable Testimonials State
  const [showAllReviews, setShowAllReviews] = useState(false)
  const visibleTestimonials = showAllReviews ? testimonials : testimonials.slice(0, 3)

  return (
    <div className="min-h-screen bg-sand/30 text-forest-900">
      {/* 1. HERO SECTION (Clean, Premium, Zero Awkward Dropdown) */}
      <section className="relative overflow-hidden bg-forest-900 bg-grain text-white pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-coral-400 ring-1 ring-white/15 backdrop-blur">
                <Sparkles className="size-3.5" /> Sangaria · Hanumangarh · Since Day One
              </div>

              <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl sm:leading-[0.98] xl:text-[4.8rem]">
                Pack your bags.
                <br />
                <span className="text-coral-500">We’ll handle the visa.</span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-forest-100/80 sm:text-lg">
                Study visas, PR, work permits, tourist visas and IELTS / PTE coaching for Canada, UK, Australia, USA, New Zealand, Germany and Europe.
              </p>

              {/* CLEAN 2-BUTTON HERO CTA (No Awkward Clunky Dropdowns) */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/eligibility"
                  className="flex items-center gap-2 rounded-full bg-coral-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/30 transition hover:-translate-y-0.5"
                >
                  Check My Eligibility <ArrowRight className="size-4" />
                </Link>
                <Link
                  to="/contact"
                  className="rounded-full border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white hover:text-forest-900"
                >
                  Talk to a Counsellor
                </Link>
              </div>

              {/* 4 STATS BOXES */}
              <div className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4">
                {stats.map(({ value, label, icon: Icon }) => (
                  <div key={label} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10 backdrop-blur-xs">
                    <Icon className="size-3.5 text-coral-400 mb-1" />
                    <span className="font-display text-xl font-extrabold text-white sm:text-3xl">{value}</span>
                    <span className="block text-[9px] uppercase tracking-wider text-forest-100/60 sm:text-[10px]">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* HERO PHOTO (Zero Collision: Stamp at Top-Right, Boarding Pass at Bottom) */}
            <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none mb-6 sm:mb-8 lg:mb-0">
              <div className="relative overflow-hidden rounded-[2.2rem] ring-1 ring-white/15 shadow-2xl">
                <img
                  src={img('/img/hero.webp', 720, 860)}
                  alt="Student with passport and acceptance letter"
                  width={720}
                  height={860}
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent" />
              </div>

              {/* STAMP BADGE (Locked at TOP-RIGHT, safely away from boarding pass) */}
              <div className="absolute top-4 right-4 z-10 grid size-20 sm:size-28 place-items-center rounded-full border-[2.5px] border-dashed border-coral-500 bg-forest-950/90 text-center font-mono text-[9px] sm:text-[11px] font-bold uppercase leading-tight tracking-widest text-coral-400 backdrop-blur shadow-xl">
                Visa
                <br />
                Approved
                <br />✓
              </div>

              {/* BOARDING PASS (Centered at BOTTOM, separated from stamp) */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-10 w-[90%] sm:w-[80%] rounded-2xl bg-cream p-3 sm:p-4 text-forest-900 shadow-2xl ring-1 ring-black/10">
                <div className="flex items-center justify-between font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-forest-900/60">
                  <span>Boarding pass</span>
                  <span>BEI · 2026</span>
                </div>
                <div className="mt-1 flex items-center justify-between font-display">
                  <div>
                    <p className="text-lg font-extrabold sm:text-2xl text-forest-900">SNG</p>
                    <p className="text-[8px] sm:text-[9px] text-forest-900/60">Sangaria</p>
                  </div>
                  <div className="px-2 text-center text-xs font-bold text-coral-500">- - ✈ - -</div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold sm:text-2xl text-forest-900">YYZ</p>
                    <p className="text-[8px] sm:text-[9px] text-forest-900/60">Toronto</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* APPROVALS MARQUEE */}
      {settings.approvalsMarqueeEnabled && (
        <div className="overflow-hidden border-b border-forest-900/10 bg-coral-500 py-2.5 text-white">
          <div className="flex w-max animate-marquee gap-8 whitespace-nowrap font-display text-xs font-bold sm:text-sm">
            {[...approvals, ...approvals].map((a, i) => (
              <span key={i} className="flex items-center gap-2">
                <CountryFlag flag={a.flag} country={a.country} className="inline-block h-3.5 w-5 shrink-0" /> {a.name} — {a.visa} approved <span className="text-white/40">✦</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 2. COUNTRY SPOTLIGHT (Fixed 48x32px Size for ALL Countries) */}
      <section id="destinations" className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <Eyebrow>Top Study Destinations</Eyebrow>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-4xl text-forest-900">Explore Countries & Work Rights</h2>
            <p className="mt-1.5 text-xs text-forest-900/60">Tap any country to view work permits, fee estimates and top intakes.</p>
          </div>

          {/* Country Tabs */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2 justify-start sm:justify-center no-scrollbar">
            {countries.map((c) => (
              <button
                type="button"
                key={c.slug}
                onClick={() => setActiveCountrySlug(c.slug)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition whitespace-nowrap ${
                  activeCountrySlug === c.slug
                    ? 'bg-forest-900 text-white shadow-md'
                    : 'bg-white text-forest-900/80 ring-1 ring-forest-900/10 hover:bg-forest-50'
                }`}
              >
                <CountryFlag code={c.code} flag={c.flag} country={c.name} className="h-3.5 w-5 shrink-0" />
                <span>{c.name}</span>
              </button>
            ))}
          </div>

          {/* Spotlight Card with STRICTLY LOCKED Flag Size for all countries */}
          <div className="mt-5 rounded-2xl bg-white p-5 sm:p-8 shadow-sm ring-1 ring-forest-900/10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-start">
            <div>
              {/* Flag + Country Header: Strict 48x32px container so NO flag ever blows up! */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 shrink-0 min-w-[48px] max-w-[48px] overflow-hidden rounded shadow-xs border border-forest-900/10 flex items-center justify-center bg-forest-50">
                  <CountryFlag code={activeCountry.code} flag={activeCountry.flag} country={activeCountry.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-extrabold text-forest-900 sm:text-2xl">{activeCountry.name}</h3>
                  <p className="text-xs font-bold text-coral-600 truncate">{activeCountry.headline}</p>
                </div>
              </div>

              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-forest-900/70">{activeCountry.intro}</p>

              {/* 3 Key Specs */}
              <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                {activeCountry.stats.map((st) => (
                  <div key={st.label} className="rounded-xl bg-forest-50/70 p-2.5 sm:p-3 border border-forest-900/5 text-center">
                    <span className="block text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-forest-900/50">{st.label}</span>
                    <span className="font-bold text-xs sm:text-sm text-forest-900">{st.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <Link
                  to="/countries/$slug"
                  params={{ slug: activeCountry.slug }}
                  className="rounded-full bg-forest-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-forest-800"
                >
                  Full {activeCountry.name} Guide →
                </Link>
                <Link
                  to="/eligibility"
                  className="rounded-full bg-coral-500 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-coral-600"
                >
                  Check Eligibility
                </Link>
              </div>
            </div>

            {/* Quick Requirements Box */}
            <div className="rounded-xl bg-sand/40 p-4 sm:p-5 border border-forest-900/10">
              <h4 className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-forest-900/60">Quick Requirements</h4>
              <ul className="mt-3 space-y-2 text-xs text-forest-900/80">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><b>Intakes:</b> {activeCountry.intakes.join(', ')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><b>Language Test:</b> {activeCountry.english}</span>
                </li>
                {activeCountry.highlights.slice(0, 2).map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES (Compact 2-Cols on Mobile, 3-Cols on Desktop) */}
      <section id="services" className="bg-white py-12 sm:py-16 border-y border-forest-900/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-2 md:flex-row md:items-end">
            <div>
              <Eyebrow>Comprehensive Visa Solutions</Eyebrow>
              <h2 className="mt-2 text-2xl font-extrabold text-forest-900 sm:text-3xl">Every Visa Type, Handled by Experts</h2>
            </div>
            <Link to="/visas" className="text-xs font-bold text-coral-600 hover:underline">
              All 6 Services →
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {visaServices.map((s, i) => (
              <Link
                key={s.slug}
                to="/visas"
                hash={s.slug}
                className="group relative flex flex-col justify-between rounded-xl bg-cream p-4 ring-1 ring-forest-900/10 transition hover:-translate-y-1 hover:bg-forest-900 hover:text-white"
              >
                <div>
                  <span className="grid size-9 place-items-center rounded-lg bg-forest-900 text-white group-hover:bg-coral-500 transition">
                    <ServiceIcon name={s.icon} className="size-4" />
                  </span>
                  <h3 className="mt-3 text-sm font-bold sm:text-lg">{s.title}</h3>
                  <p className="mt-1 text-[11px] opacity-70 line-clamp-2">{s.summary}</p>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-coral-600 group-hover:text-coral-400">
                  <span>View Details</span>
                  <ChevronRight className="size-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COACHING (Proper Breathing Room: PTE Badge Never Overlaps Text) */}
      <section id="coaching" className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 grid gap-8 lg:grid-cols-2 items-center">
          <div className="relative mb-6 sm:mb-8 lg:mb-0">
            <img
              src={img('/img/coaching.webp', 760, 560)}
              alt="IELTS and PTE coaching lab Sangaria"
              width={760}
              height={560}
              className="aspect-[16/11] w-full rounded-2xl object-cover shadow-md"
            />
            <div className="absolute -bottom-3 right-3 rounded-xl bg-forest-900 p-3 text-white shadow-xl">
              <span className="font-display text-2xl font-extrabold text-coral-500">79+</span>
              <span className="block text-[8px] uppercase tracking-wider text-forest-100/70">Top PTE Score</span>
            </div>
          </div>
          <div className="pt-2 sm:pt-0">
            <Eyebrow>In-House Computer Lab</Eyebrow>
            <h2 className="mt-2 text-2xl font-extrabold text-forest-900 sm:text-3xl">IELTS & PTE Coaching in Sangaria</h2>
            <p className="mt-2 text-xs sm:text-sm text-forest-900/70 leading-relaxed">
              Dedicated test software, headphone labs, daily speaking interviews, and small batches of 15 students.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {[
                { icon: Headphones, t: 'Real PTE Lab' },
                { icon: Timer, t: 'Timed Mock Tests' },
                { icon: Award, t: 'Certified Trainers' },
                { icon: BadgeCheck, t: 'Free 2-Day Demo' },
              ].map(({ icon: Icon, t }) => (
                <div key={t} className="flex items-center gap-2 rounded-xl bg-white p-2.5 text-xs font-bold text-forest-900 ring-1 ring-forest-900/10">
                  <Icon className="size-3.5 text-coral-500 shrink-0" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <Link to="/coaching" className="rounded-full bg-forest-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-forest-800">
                View Batches & Fees →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROCESS ROADMAP (Compact 2x2 Grid) */}
      <section className="bg-forest-900 bg-grain py-12 sm:py-16 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center max-w-xl mx-auto">
            <Eyebrow light>How It Works</Eyebrow>
            <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">Four Steps to Your Visa</h2>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <span className="font-display text-2xl sm:text-4xl font-extrabold text-coral-500">{s.n}</span>
                <h3 className="mt-1 text-sm font-bold">{s.title}</h3>
                <p className="mt-0.5 text-[11px] text-forest-100/70 leading-snug">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. RECENT APPROVALS */}
      <section id="approvals" className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex justify-between items-end">
            <div>
              <Eyebrow>Proven Results</Eyebrow>
              <h2 className="mt-1 text-2xl font-extrabold text-forest-900 sm:text-3xl">Recent Visa Approvals</h2>
            </div>
            <Link to="/success-stories" className="text-xs font-bold text-coral-600 hover:underline">
              All Stories →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {approvals.slice(0, 4).map((a, i) => (
              <ApprovalCard key={a.name} a={a} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. STUDENT REVIEWS WITH "SHOW MORE" BUTTON */}
      <section id="testimonials" className="bg-sand/60 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center max-w-xl mx-auto">
            <Eyebrow>Student Feedback</Eyebrow>
            <h2 className="mt-1 text-2xl font-extrabold text-forest-900 sm:text-3xl">What Sangaria Students Say</h2>
          </div>
          
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {visibleTestimonials.map((t, i) => (
              <TestimonialCard key={t.name} t={t} featured={i === 1 && !showAllReviews} />
            ))}
          </div>

          {/* DYNAMIC SHOW MORE BUTTON */}
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            {testimonials.length > 3 && (
              <button
                type="button"
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="rounded-full border border-forest-900/20 bg-white px-6 py-2.5 text-xs font-bold text-forest-900 shadow-sm transition hover:bg-forest-900 hover:text-white"
              >
                {showAllReviews ? 'Show Fewer Reviews ↑' : `Show More Reviews (${testimonials.length - 3}+ और देखें) ↓`}
              </button>
            )}
            <Link to="/success-stories" className="text-xs font-bold text-coral-600 hover:underline">
              View All Approvals & Stories →
            </Link>
          </div>
        </div>
      </section>

      {/* 8. NEWS & BLOG SECTION (Restored with clean cards) */}
      <section className="bg-white py-12 sm:py-16 border-t border-forest-900/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex justify-between items-end">
            <div>
              <Eyebrow>News & Blog</Eyebrow>
              <h2 className="mt-1 text-2xl font-extrabold text-forest-900 sm:text-3xl">Latest Visa News & Updates</h2>
            </div>
            <Link to="/updates" className="text-xs font-bold text-coral-600 hover:underline">
              All Articles →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {posts.slice(0, 3).map((p) => (
              <PostCard key={p.slug} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ + FREE PROFILE EVALUATION */}
      <section id="enquiry" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 grid gap-8 lg:grid-cols-[1fr_1.1fr] items-start">
        <div>
          <Eyebrow>Got Questions?</Eyebrow>
          <h2 className="mt-1 text-2xl font-extrabold text-forest-900">Frequently Asked Questions</h2>
          <div className="mt-5 divide-y divide-forest-900/10 rounded-2xl bg-white ring-1 ring-forest-900/10">
            {faqs.map((f) => (
              <details key={f.q} className="group p-4 sm:p-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-bold text-forest-900">
                  {f.q}
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-forest-50 text-coral-600 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-xs leading-relaxed text-forest-900/70">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-forest-900/60">
            <MapPin className="size-4 shrink-0 text-coral-500" /> {site.address}
          </p>
        </div>

        <div className="rounded-3xl bg-forest-900 bg-grain p-6 sm:p-8 text-white shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-coral-400">Fast Assessment</span>
          <h3 className="mt-1 text-2xl font-extrabold">Free Profile Evaluation</h3>
          <p className="mt-1 mb-5 text-xs text-forest-100/70">Fill details — our counsellor will call or WhatsApp you.</p>
          <EnquiryForm source="home" dark />
        </div>
      </section>
    </div>
  )
}
