import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EnquiryForm } from '@/components/EnquiryForm'
import { CountryFlag } from '@/components/CountryFlag'
import { Eyebrow } from '@/components/Section'
import { eligibilityRules as rules, type Goal } from '@/data/eligibility-rules'
import { evaluate, factorsFor, type Answers } from '@/lib/eligibility'
import { cn } from '@/lib/utils'

import { createPageSeo } from '@/lib/seo'

export const Route = createFileRoute('/eligibility')({
  head: () => createPageSeo({
    title: 'Free Visa Profile Check | British Education Sangaria',
    description: 'Take a quick preliminary visa profile check. Results are general guidance, not an immigration decision or approval guarantee.',
    path: '/eligibility',
  }),
  component: EligibilityPage,
})

const toneCls = {
  great: 'text-forest-600',
  good: 'text-forest-600',
  fair: 'text-coral-500',
  low: 'text-coral-600',
}

function EligibilityPage() {
  const [goal, setGoal] = useState<Goal | null>(null)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})

  const factors = goal ? factorsFor(rules, goal) : []
  const done = goal !== null && step >= factors.length
  const result = useMemo(() => (goal && done ? evaluate(rules, goal, answers) : null), [goal, done, answers])
  const progress = goal ? Math.round((Math.min(step, factors.length) / factors.length) * 100) : 0

  function reset() {
    setGoal(null)
    setStep(0)
    setAnswers({})
  }

  return (
    <section className="relative min-h-[80vh] overflow-hidden bg-forest-900 bg-grain py-16 text-white md:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Eyebrow light>Preliminary profile check</Eyebrow>
          <h1 className="mt-6 text-5xl font-extrabold leading-[0.95] md:text-6xl">
            Where might your <span className="text-coral-500">profile</span> fit?
          </h1>
          <p className="mt-6 max-w-md text-lg text-forest-100/75">
            Answer a few quick questions for a preliminary profile checklist across Canada, UK, Australia, USA, New Zealand, Germany and Europe. It compares only the selected factors shown here; it does not assess every legal requirement for a visa route.
          </p>
          <p className="mt-8 font-mono text-xs text-forest-100/50">Checklist framework reviewed · {rules.updatedAt}</p>
          {goal && (
            <div className="mt-10">
              <div className="flex justify-between text-xs uppercase tracking-widest text-forest-100/60">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-coral-500 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="rounded-[2rem] bg-cream p-6 text-forest-900 shadow-2xl md:p-10">
          {!goal && (
            <div key="goal" className="animate-rise">
              <p className="font-mono text-xs uppercase tracking-widest text-coral-600">Step 1</p>
              <h2 className="mt-2 text-3xl font-extrabold">What’s your goal?</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {rules.goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      setGoal(g.id)
                      setStep(0)
                    }}
                    className="rounded-2xl bg-white p-6 text-left ring-1 ring-forest-900/10 transition hover:-translate-y-1 hover:ring-2 hover:ring-coral-500"
                  >
                    <span className="block font-display text-xl font-bold">{g.label}</span>
                    <span className="mt-1 block text-sm text-forest-900/60">{g.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {goal && !done && (
            <div key={factors[step].id} className="animate-rise">
              <p className="font-mono text-xs uppercase tracking-widest text-coral-600">
                Question {step + 1} of {factors.length}
              </p>
              <h2 className="mt-2 text-3xl font-extrabold">{factors[step].label}</h2>
              {factors[step].help && <p className="mt-1 text-forest-900/60">{factors[step].help}</p>}
              <div className="mt-8 grid gap-3">
                {factors[step].options.map((o) => {
                  const active = answers[factors[step].id] === o.value
                  return (
                    <button
                      key={o.value}
                      onClick={() => {
                        setAnswers((a) => ({ ...a, [factors[step].id]: o.value }))
                        setStep((s) => s + 1)
                      }}
                      className={cn(
                        'flex items-center justify-between rounded-2xl px-6 py-4 text-left font-semibold ring-1 transition',
                        active ? 'bg-forest-900 text-white ring-forest-900' : 'bg-white ring-forest-900/10 hover:ring-2 hover:ring-coral-500',
                      )}
                    >
                      {o.label}
                      <ArrowRight className="size-4 opacity-40" />
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => (step === 0 ? reset() : setStep((s) => s - 1))}
                className="mt-8 flex items-center gap-2 text-sm font-bold text-forest-900/60 hover:text-forest-900"
              >
                <ArrowLeft className="size-4" /> Back
              </button>
            </div>
          )}

          {result && goal && (
            <div className="animate-rise">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <ScoreRing score={result.score} />
                <div>
                  <p className={cn('font-display text-2xl font-extrabold', toneCls[result.band.tone])}>{result.band.label}</p>
                  <p className="mt-2 text-forest-900/70">{result.band.message}</p>
                </div>
              </div>
              <h3 className="mt-10 mb-4 font-display text-lg font-bold">
                Preliminary profile matches for {rules.goals.find((g) => g.id === goal)?.label.toLowerCase()}
              </h3>
              <p className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-forest-900/75">This is general guidance based on your answers and selected factors. It does not determine legal eligibility, assess every requirement for a visa route, predict an application outcome or guarantee approval. The score and thresholds are internal to this site, not government criteria or visa points. Requirements change; review each destination’s official sources and get a case-specific assessment before applying.</p>
              <ul className="grid gap-3">
                {result.countries.map((c) => (
                  <li
                    key={c.slug}
                    className={cn('flex items-center gap-4 rounded-2xl p-4 ring-1', c.matchesChecklist ? 'bg-forest-50 ring-forest-600/30' : 'bg-white ring-forest-900/10')}
                  >
                    <CountryFlag flag={c.flag} country={c.name} className="h-7 w-10 shrink-0 shadow-sm" />
                    <div className="flex-1">
                      <p className="font-bold">{c.name}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-forest-900/60">
                        {c.matchesChecklist ? 'Preliminary profile match' : 'Further review needed'}
                      </p>
                      <p className="mt-1 text-sm text-forest-900/60">
                        {c.matchesChecklist
                          ? 'More of this site’s selected profile factors align with its internal checklist.'
                          : c.unmet.length
                            ? `Selected internal checklist thresholds were not met for: ${c.unmet.join(', ')}.`
                            : 'This site’s internal checklist score did not reach its screening threshold.'}
                      </p>
                      <Link to="/countries/$slug" params={{ slug: c.slug }} className="mt-2 inline-block text-sm font-bold text-coral-600 hover:underline">
                        Review destination guidance & official sources →
                      </Link>
                    </div>
                    {c.matchesChecklist ? <CheckCircle2 aria-hidden="true" className="size-6 shrink-0 text-forest-600" /> : <XCircle aria-hidden="true" className="size-6 shrink-0 text-coral-500/70" />}
                  </li>
                ))}
              </ul>
              <div className="mt-10 rounded-2xl bg-white p-6 ring-1 ring-forest-900/10">
                <h3 className="font-display text-xl font-bold">Send this result to a counsellor</h3>
                <p className="mb-5 text-sm text-forest-900/60">We’ll call with a detailed, personalised plan — free.</p>
                <EnquiryForm
                  source="eligibility"
                  compact
                  summary={`Goal: ${goal} | Profile checklist score: ${result.score}% | Preliminary matches: ${
                    result.countries
                      .filter((c) => c.matchesChecklist)
                      .map((c) => c.name)
                      .join(', ') || 'none from this checklist'
                  } | Answers: ${Object.entries(answers)
                    .map(([k, v]) => `${k}=${v}`)
                    .join(', ')}`}
                />
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <button onClick={reset} className="flex items-center gap-2 text-sm font-bold text-forest-900/60 hover:text-forest-900">
                  <RotateCcw className="size-4" /> Start again
                </button>
                <Link to="/coaching" className="text-sm font-bold text-coral-600">
                  Explore IELTS / PTE coaching →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function ScoreRing({ score }: { score: number }) {
  const r = 52
  const c = 2 * Math.PI * r
  return (
    <div className="relative size-36 shrink-0">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="12" className="text-forest-900/10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (score / 100) * c}
          className="text-coral-500 transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <span>
          <span className="block font-display text-4xl font-extrabold">{score}</span>
          <span className="text-[10px] uppercase tracking-widest text-forest-900/50">Site checklist score</span>
        </span>
      </div>
    </div>
  )
}
