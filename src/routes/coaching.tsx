import { createFileRoute } from '@tanstack/react-router'
import { BookOpen, Check, Headphones, Mic, PenLine } from 'lucide-react'
import { EnquiryForm } from '@/components/EnquiryForm'
import { Eyebrow, PageHero } from '@/components/Section'
import { bandScoreTable, coachingCourses } from '@/data/fixtures'
import { getCoachingContent } from '@/lib/public-functions'
import { img } from '@/lib/utils'

export const Route = createFileRoute('/coaching')({
  head: () => ({ meta: [{ title: 'IELTS & PTE Coaching in Sangaria · British Education and Immigration' }] }),
  loader: () => getCoachingContent(),
  component: CoachingPage,
})

const modules = [
  { icon: Headphones, name: 'Listening', tip: 'Note-completion & map tasks with real accents' },
  { icon: BookOpen, name: 'Reading', tip: 'Skimming, scanning & True/False/Not Given' },
  { icon: PenLine, name: 'Writing', tip: 'Task 1 reports, Task 2 essays, PTE summaries' },
  { icon: Mic, name: 'Speaking', tip: 'Cue cards, Read Aloud & Describe Image' },
]

function CoachingPage() {
  const { batches } = Route.useLoaderData()
  return (
    <>
      <PageHero
        eyebrow="IELTS & PTE Preparation"
        title={
          <>
            Score higher. <span className="text-coral-500">Fly sooner.</span>
          </>
        }
        intro="Expert-led IELTS and PTE coaching in Sangaria with small batches, a real-exam computer lab and weekly mock tests."
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <a href="#batches" className="rounded-full bg-coral-500 px-7 py-4 font-bold shadow-[4px_4px_0_0] shadow-black/40">
            See upcoming batches
          </a>
          <a href="#demo" className="rounded-full border border-white/25 px-7 py-4 font-bold hover:bg-white hover:text-forest-900">
            Book a free demo
          </a>
        </div>
      </PageHero>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-20 md:grid-cols-2">
        {coachingCourses.map((c, i) => (
          <article key={c.test} className={'rounded-[2rem] p-10 ' + (i === 0 ? 'bg-white ring-1 ring-forest-900/10' : 'bg-forest-900 text-white')}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-6xl font-extrabold">{c.test}</h2>
                <p className={i === 0 ? 'text-forest-900/60' : 'text-forest-100/70'}>{c.tagline}</p>
              </div>
              <span className="rounded-full bg-coral-500 px-4 py-1.5 text-sm font-bold text-white">{c.duration}</span>
            </div>
            <ul className="mt-8 space-y-3">
              {c.features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <Check className="size-5 shrink-0 text-coral-500" /> {f}
                </li>
              ))}
            </ul>
            <div className={'mt-8 flex flex-wrap justify-between gap-3 border-t-2 border-dashed pt-6 text-sm ' + (i === 0 ? 'border-forest-900/10' : 'border-white/15')}>
              <span>🕘 {c.batch}</span>
              <span className="font-bold text-coral-500">{c.target}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="bg-sand/60 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Eyebrow>All four modules</Eyebrow>
          <h2 className="mt-4 text-4xl font-extrabold text-forest-900">What you’ll master</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map(({ icon: Icon, name, tip }) => (
              <div key={name} className="rounded-3xl bg-cream p-7 ring-1 ring-forest-900/10">
                <Icon className="size-8 text-coral-500" />
                <h3 className="mt-5 text-xl font-bold text-forest-900">{name}</h3>
                <p className="mt-2 text-sm text-forest-900/65">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="batches" className="mx-auto grid max-w-7xl scroll-mt-28 gap-12 px-6 py-20 lg:grid-cols-2">
        <div>
          <Eyebrow>Upcoming batches</Eyebrow>
          <h2 className="mt-4 text-4xl font-extrabold text-forest-900">Pick a time that suits you</h2>
          <div className="mt-8 overflow-hidden rounded-3xl bg-white ring-1 ring-forest-900/10">
            {batches.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-4 border-b border-forest-900/10 px-6 py-5 last:border-0">
                <div>
                  <p className="font-display font-bold text-forest-900">{b.batch} <span className="ml-2 rounded-full bg-forest-50 px-2 py-1 text-[10px] uppercase tracking-wide text-forest-700">{b.program}</span></p>
                  <p className="text-sm text-forest-900/60">
                    {b.time} · starts {b.starts}
                  </p>
                </div>
                <span className={'rounded-full px-3 py-1 text-xs font-bold ' + (b.seats <= 4 ? 'bg-coral-100 text-coral-600' : 'bg-forest-50 text-forest-700')}>
                  {b.seats} seats left
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Eyebrow>Score converter</Eyebrow>
          <h2 className="mt-4 text-4xl font-extrabold text-forest-900">IELTS ⇄ PTE ⇄ CLB</h2>
          <table className="mt-8 w-full overflow-hidden rounded-3xl bg-white text-left ring-1 ring-forest-900/10">
            <thead className="bg-forest-900 text-white">
              <tr>
                <th className="px-6 py-4 font-display">IELTS</th>
                <th className="px-6 py-4 font-display">PTE</th>
                <th className="px-6 py-4 font-display">Canada CLB</th>
              </tr>
            </thead>
            <tbody>
              {bandScoreTable.map((r) => (
                <tr key={r.ielts} className="border-b border-forest-900/10 last:border-0">
                  <td className="px-6 py-3.5 font-bold text-forest-900">{r.ielts}</td>
                  <td className="px-6 py-3.5">{r.pte}</td>
                  <td className="px-6 py-3.5 text-forest-900/70">{r.clb}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-forest-900/50">Approximate equivalence for guidance only.</p>
        </div>
      </section>

      <section id="demo" className="mx-auto max-w-7xl scroll-mt-28 px-6 pb-24">
        <div className="grid overflow-hidden rounded-[2rem] bg-forest-900 text-white lg:grid-cols-2">
          <img src={img('/img/coaching.webp', 800, 700)} alt="Students in coaching class" loading="lazy" className="h-full min-h-64 w-full object-cover" />
          <div className="bg-grain p-8 md:p-12">
            <h2 className="text-3xl font-extrabold">Book a free demo class</h2>
            <p className="mt-2 mb-8 text-forest-100/70">Try a class and take a free diagnostic mock test.</p>
            <EnquiryForm source="coaching" defaultInterest="IELTS Coaching" dark compact />
          </div>
        </div>
      </section>
    </>
  )
}
