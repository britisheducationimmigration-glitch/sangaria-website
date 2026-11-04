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

function HeroBackgroundVisual({ eyebrow }: { eyebrow: string }) {
  const key = eyebrow.toLowerCase()

  // 1. /visas — Floating Visa Stamps & Animated Flight Path
  if (key.includes('visa')) {
    return (
      <div aria-hidden="true" className="pointer-events-none select-none absolute inset-0 overflow-hidden">
        <svg
          viewBox="0 0 600 400"
          className="absolute -right-12 top-1/2 h-[360px] w-[520px] -translate-y-1/2 opacity-30 md:right-4 md:h-[420px] md:w-[600px] md:opacity-55"
          fill="none"
        >
          <path
            d="M 40 320 Q 260 60 540 110"
            stroke="#fb7185"
            strokeWidth="2.5"
            strokeDasharray="7 7"
          />
          <circle cx="40" cy="320" r="6" fill="#fde047" />
          <circle cx="540" cy="110" r="7" fill="#fb7185" className="animate-ping" />
          <circle cx="540" cy="110" r="6" fill="#fb7185" />
          <text x="295" y="168" fill="#ffffff" fontSize="22" className="animate-pulse">
            ✈
          </text>
        </svg>

        <div className="hidden md:block absolute right-12 top-10 rotate-[-8deg] rounded-2xl border-2 border-dashed border-coral-400/50 bg-forest-950/60 px-4 py-2 font-mono text-xs font-extrabold uppercase tracking-widest text-coral-300 backdrop-blur-sm animate-bounce [animation-duration:4.5s]">
          ✓ STUDY VISA APPROVED
        </div>
        <div className="hidden md:block absolute right-52 bottom-10 rotate-[6deg] rounded-2xl border-2 border-dashed border-amber-300/45 bg-forest-950/60 px-4 py-2 font-mono text-xs font-extrabold uppercase tracking-widest text-amber-200 backdrop-blur-sm animate-pulse">
          ★ PR & WORK PERMIT
        </div>
        <div className="hidden lg:block absolute right-10 bottom-16 rotate-[-4deg] rounded-2xl border border-white/20 bg-white/5 px-3.5 py-1.5 font-mono text-[11px] font-bold text-white/80 backdrop-blur-sm">
          🛂 EMBASSY READY FILE
        </div>
      </div>
    )
  }

  // 2. /countries — Spinning World Compass & Airport Radar Rings
  if (key.includes('destination')) {
    return (
      <div aria-hidden="true" className="pointer-events-none select-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 top-1/2 h-[380px] w-[380px] -translate-y-1/2 opacity-30 md:right-8 md:h-[440px] md:w-[440px] md:opacity-65">
          <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-spin [animation-duration:38s]" />
          <div className="absolute inset-10 rounded-full border border-coral-400/30 animate-spin [animation-duration:26s] [animation-direction:reverse]" />
          <div className="absolute inset-20 rounded-full border border-dashed border-amber-300/30 animate-pulse" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid size-20 place-items-center rounded-full bg-coral-500/20 border border-coral-400/50 font-mono text-xs font-extrabold text-amber-300 shadow-lg backdrop-blur-sm">
              SNG ✈
            </div>
          </div>
          <span className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-forest-950/80 border border-white/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-coral-300">
            🇨🇦 YYZ
          </span>
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-forest-950/80 border border-white/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-sky-300">
            🇬🇧 LHR
          </span>
          <span className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-forest-950/80 border border-white/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-300">
            🇦🇺 MEL
          </span>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-forest-950/80 border border-white/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
            🇩🇪 BER
          </span>
        </div>
      </div>
    )
  }

  // 3. /coaching — Live Audio Soundwave Equalizer & Floating Score Badges (IELTS & PTE)
  if (key.includes('ielts') || key.includes('pte') || key.includes('coaching')) {
    const barHeights = [32, 64, 45, 88, 54, 96, 40, 76, 60, 92, 48, 70, 36, 82, 52, 66]
    return (
      <div aria-hidden="true" className="pointer-events-none select-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-8 top-1/2 flex -translate-y-1/2 items-center gap-2 opacity-25 md:right-14 md:opacity-60">
          {barHeights.map((h, i) => (
            <div
              key={i}
              className="w-2.5 rounded-full bg-gradient-to-t from-coral-500 via-coral-400 to-amber-300 animate-pulse"
              style={{
                height: `${h * 1.7}px`,
                animationDelay: `${i * 120}ms`,
                animationDuration: `${1.2 + (i % 4) * 0.35}s`,
              }}
            />
          ))}
        </div>
        <div className="hidden md:block absolute right-16 top-10 rounded-2xl border border-amber-300/40 bg-forest-950/75 px-4 py-2 font-display text-sm font-extrabold text-amber-300 shadow-xl backdrop-blur-md animate-bounce [animation-duration:4s]">
          🎯 IELTS Band 7.5 – 8.5
        </div>
        <div className="hidden md:block absolute right-48 bottom-12 rounded-2xl border border-coral-400/40 bg-forest-950/75 px-4 py-2 font-display text-sm font-extrabold text-coral-300 shadow-xl backdrop-blur-md animate-pulse">
          🎧 PTE 79+ Computer Lab
        </div>
      </div>
    )
  }

  // 4. /certificates — Golden Shield Seal & Rotating Rings
  if (key.includes('credential') || key.includes('certificate')) {
    return (
      <div aria-hidden="true" className="pointer-events-none select-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 top-1/2 h-[340px] w-[340px] -translate-y-1/2 opacity-30 md:right-14 md:h-[380px] md:w-[380px] md:opacity-65">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-300/40 animate-spin [animation-duration:32s]" />
          <div className="absolute inset-8 rounded-full border border-coral-400/35 animate-spin [animation-duration:22s] [animation-direction:reverse]" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid size-28 place-items-center rounded-3xl rotate-12 border border-amber-300/50 bg-gradient-to-br from-amber-300/20 to-coral-500/20 text-center shadow-2xl backdrop-blur-md">
              <div className="-rotate-12">
                <span className="block text-3xl">🏅</span>
                <span className="mt-1 block font-mono text-[9px] font-extrabold uppercase tracking-widest text-amber-200">
                  VERIFIED PARTNER
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 5. /success-stories — Floating Approval Boarding Passes
  if (key.includes('success') || key.includes('stories')) {
    return (
      <div aria-hidden="true" className="pointer-events-none select-none absolute inset-0 overflow-hidden">
        <div className="hidden md:block absolute right-12 top-10 w-60 rotate-[6deg] rounded-2xl border border-white/20 bg-white/8 p-4 backdrop-blur-md shadow-2xl animate-bounce [animation-duration:5s]">
          <div className="flex items-center justify-between font-mono text-[10px] font-bold text-amber-300">
            <span>SNG ➔ YYZ</span>
            <span className="rounded bg-emerald-500/30 px-1.5 py-0.5 text-emerald-200">APPROVED ✓</span>
          </div>
          <p className="mt-2 font-display text-sm font-extrabold text-white">Canada Study Permit</p>
          <p className="text-[11px] text-white/65">Sangaria Student Batch</p>
        </div>

        <div className="hidden lg:block absolute right-48 bottom-10 w-56 rotate-[-6deg] rounded-2xl border border-coral-400/35 bg-forest-950/70 p-3.5 backdrop-blur-md shadow-2xl animate-pulse">
          <div className="flex items-center justify-between font-mono text-[10px] font-bold text-coral-300">
            <span>SNG ➔ LHR</span>
            <span className="rounded bg-coral-500/30 px-1.5 py-0.5 text-white">STAMPED ✓</span>
          </div>
          <p className="mt-1.5 font-display text-xs font-extrabold text-white">UK & Australia Visas</p>
        </div>
      </div>
    )
  }

  // 6. /updates — Live Policy Broadcast Radar Waves
  if (key.includes('news') || key.includes('blog') || key.includes('update')) {
    return (
      <div aria-hidden="true" className="pointer-events-none select-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 top-1/2 h-[340px] w-[340px] -translate-y-1/2 opacity-30 md:right-16 md:h-[380px] md:w-[380px] md:opacity-65">
          <div className="absolute inset-4 rounded-full border border-coral-400/35 animate-ping [animation-duration:3.5s]" />
          <div className="absolute inset-12 rounded-full border border-amber-300/30 animate-ping [animation-duration:4.5s]" />
          <div className="absolute inset-20 rounded-full border border-white/25" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="rounded-2xl border border-white/20 bg-forest-950/85 px-4 py-2.5 text-center shadow-2xl backdrop-blur-md">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-extrabold uppercase tracking-widest text-coral-400">
                <span className="size-2 rounded-full bg-coral-500 animate-ping" />
                LIVE POLICY RADAR
              </span>
              <p className="mt-1 font-display text-xs font-bold text-white">IRCC · UKVI · DHA Updates</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 7. /contact (or default) — Sangaria Location Pin Radar & Connection Ripples
  return (
    <div aria-hidden="true" className="pointer-events-none select-none absolute inset-0 overflow-hidden">
      <div className="absolute -right-16 top-1/2 h-[340px] w-[340px] -translate-y-1/2 opacity-30 md:right-16 md:h-[380px] md:w-[380px] md:opacity-65">
        <div className="absolute inset-6 rounded-full border border-dashed border-white/20 animate-spin [animation-duration:30s]" />
        <div className="absolute inset-16 rounded-full border border-coral-400/35 animate-ping [animation-duration:3.8s]" />
        <div className="absolute inset-0 grid place-items-center">
          <div className="rounded-2xl border border-white/20 bg-forest-950/85 px-4 py-3 text-center shadow-2xl backdrop-blur-md">
            <span className="text-2xl">📍</span>
            <p className="mt-1 font-display text-xs font-extrabold text-white">Sangaria Office Hub</p>
            <p className="font-mono text-[10px] text-amber-300">29.7985° N · 74.4642° E</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: ReactNode; intro?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-forest-900 bg-aurora-live text-white">
      <HeroBackgroundVisual eyebrow={eyebrow} />
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-28">
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
