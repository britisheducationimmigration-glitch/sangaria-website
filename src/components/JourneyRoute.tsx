import { Link } from '@tanstack/react-router'
import { Plane } from 'lucide-react'

const journeySteps = [
  { number: '01', title: 'Plan', detail: 'Choose a destination', to: '/countries' },
  { number: '02', title: 'Prepare', detail: 'Check your profile', to: '/eligibility' },
  { number: '03', title: 'Apply', detail: 'Explore visa options', to: '/visas' },
  { number: '04', title: 'Fly', detail: 'Talk with our team', to: '/contact' },
] as const

export function JourneyRoute({ destination = 'your next destination', destinationCode = 'WORLD', activeStep = 0 }: { destination?: string; destinationCode?: string; activeStep?: number }) {
  return (
    <section className="bg-sand/60 px-5 py-10 md:px-6 md:py-14" aria-label="Your journey from Sangaria">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2rem] bg-forest-900 bg-grain p-5 text-white shadow-xl md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-coral-400">Your journey · Sangaria to the world</p>
              <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">From Sangaria to {destination}</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-forest-100/75">One clear route, with a team beside you at every step.</p>
            </div>
            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-dashed border-white/25 bg-white/5 px-4 py-3 font-mono text-xs font-bold tracking-widest text-coral-300" aria-label={'Route from Sangaria to ' + destination}>
              <span>SNG</span>
              <span className="flex items-center gap-2 text-white/55" aria-hidden="true"><span className="w-6 border-t border-dashed border-white/50 sm:w-10" /><Plane className="size-4 text-coral-400" /><span className="w-6 border-t border-dashed border-white/50 sm:w-10" /></span>
              <span>{destinationCode}</span>
            </div>
          </div>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {journeySteps.map((step, index) => {
              const active = index === activeStep
              return (
                <li key={step.number}>
                  <Link to={step.to} aria-current={active ? 'step' : undefined} className={'group flex h-full items-start gap-3 rounded-2xl border p-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-400 ' + (active ? 'border-coral-400/70 bg-white/10' : 'border-white/10 bg-white/[0.04] hover:border-white/30 hover:bg-white/[0.08]')}>
                    <span className={'grid size-9 shrink-0 place-items-center rounded-full border font-mono text-xs font-bold ' + (active ? 'border-coral-400 bg-coral-500 text-white' : 'border-white/20 text-forest-100/75')}>{step.number}</span>
                    <span>
                      <span className={'block font-display font-bold ' + (active ? 'text-white' : 'text-white/90')}>{step.title}{active && <span className="ml-2 text-[10px] font-mono font-normal uppercase tracking-wider text-coral-300">Start here</span>}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-forest-100/65">{step.detail}</span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
