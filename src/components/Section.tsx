import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Eyebrow({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11.5px] font-bold uppercase tracking-[0.18em]',
        light ? 'border-white/20 text-coral-400' : 'border-forest-900/15 text-coral-600',
      )}
    >
      <span className="size-1.5 rounded-full bg-coral-500" />
      {children}
    </span>
  )
}

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: ReactNode; intro?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-forest-900 bg-grain text-white">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-28">
        <div className="animate-rise">
          <Eyebrow light>{eyebrow}</Eyebrow>
        </div>
        <h1 className="mt-6 max-w-4xl animate-rise text-5xl font-extrabold leading-[0.95] [animation-delay:80ms] md:text-7xl">{title}</h1>
        {intro && <p className="mt-6 max-w-2xl animate-rise text-lg text-forest-100/80 [animation-delay:160ms]">{intro}</p>}
        {children}
      </div>
    </section>
  )
}
