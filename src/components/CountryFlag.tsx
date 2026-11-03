import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type CountryFlagProps = HTMLAttributes<HTMLSpanElement> & {
  code?: string
  flag?: string
  country?: string
  className?: string
  aspect?: 'video' | 'square' | 'wide'
}

const EMOJI_TO_CODE: Record<string, string> = {
  '🇨🇦': 'CA',
  '🇬🇧': 'UK',
  '🇦🇺': 'AU',
  '🇺🇸': 'US',
  '🇳🇿': 'NZ',
  '🇩🇪': 'DE',
  '🇪🇺': 'EU',
  '🇮🇳': 'IN',
}

const NAME_TO_CODE: Record<string, string> = {
  canada: 'CA',
  uk: 'UK',
  'united kingdom': 'UK',
  britain: 'UK',
  australia: 'AU',
  usa: 'US',
  'united states': 'US',
  us: 'US',
  'new zealand': 'NZ',
  germany: 'DE',
  europe: 'EU',
  schengen: 'EU',
  'europe / schengen': 'EU',
  france: 'FR',
  italy: 'IT',
  india: 'IN',
}

export function resolveCountryCode(input?: string): string {
  if (!input) return ''
  const trimmed = input.trim()
  if (EMOJI_TO_CODE[trimmed]) return EMOJI_TO_CODE[trimmed]
  
  const lower = trimmed.toLowerCase()
  if (NAME_TO_CODE[lower]) return NAME_TO_CODE[lower]
  if (trimmed.length === 2 && /^[a-zA-Z]{2}$/.test(trimmed)) return trimmed.toUpperCase()

  // Fuzzy match: Database me "Canada · Study Permit" hone par bhi asli flag hi aayega
  if (lower.includes('canad') || lower === 'ca') return 'CA'
  if (lower.includes('uk') || lower.includes('brit') || lower.includes('kingdom') || lower.includes('england')) return 'UK'
  if (lower.includes('aus')) return 'AU'
  if (lower.includes('usa') || lower.includes('united states') || lower.includes('america') || lower === 'us') return 'US'
  if (lower.includes('zeal') || lower === 'nz') return 'NZ'
  if (lower.includes('germ') || lower.includes('deutsch') || lower === 'de') return 'DE'
  if (lower.includes('eur') || lower.includes('schen') || lower === 'eu') return 'EU'
  if (lower.includes('ind')) return 'IN'
  if (lower.includes('fran') || lower.includes('ital')) return 'EU'

  return ''
}

export function CountryFlag({ code, flag, country, className, ...props }: CountryFlagProps) {
  const resolved = (code || resolveCountryCode(flag) || resolveCountryCode(country) || '').toUpperCase()

  if (resolved === 'CA') {
    return (
      <span className={cn('inline-block overflow-hidden rounded-[3px] shadow-sm align-middle', className)} title={country || 'Canada'} {...props}>
        <svg viewBox="0 0 640 480" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
          <path fill="#d80027" d="M0 0h160v480H0zm480 0h160v480H480z" />
          <path fill="#f0f0f0" d="M160 0h320v480H160z" />
          <path fill="#d80027" d="m320 75 19 46 41-11-20 44 48 10-38 31 16 43-44-12-14 39-8-2-8 2-14-39-44 12 16-43-38-31 48-10-20-44 41 11 19-46 6 120h6z" />
        </svg>
      </span>
    )
  }

  if (resolved === 'UK' || resolved === 'GB') {
    return (
      <span className={cn('inline-block overflow-hidden rounded-[3px] shadow-sm align-middle', className)} title={country || 'United Kingdom'} {...props}>
        <svg viewBox="0 0 640 480" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
          <path fill="#012169" d="M0 0h640v480H0z" />
          <path stroke="#fff" strokeWidth="60" d="m0 0 640 480M640 0 0 480" />
          <path stroke="#c8102e" strokeWidth="40" d="m0 0 640 480M640 0 0 480" />
          <path stroke="#fff" strokeWidth="100" d="M320 0v480M0 240h640" />
          <path stroke="#c8102e" strokeWidth="60" d="M320 0v480M0 240h640" />
        </svg>
      </span>
    )
  }

  if (resolved === 'AU') {
    return (
      <span className={cn('inline-block overflow-hidden rounded-[3px] shadow-sm align-middle', className)} title={country || 'Australia'} {...props}>
        <svg viewBox="0 0 640 480" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
          <path fill="#00008b" d="M0 0h640v480H0z" />
          <g>
            <path fill="#012169" d="M0 0h320v240H0z" />
            <path stroke="#fff" strokeWidth="30" d="m0 0 320 240M320 0 0 240" />
            <path stroke="#c8102e" strokeWidth="20" d="m0 0 320 240M320 0 0 240" />
            <path stroke="#fff" strokeWidth="50" d="M160 0v240M0 120h320" />
            <path stroke="#c8102e" strokeWidth="30" d="M160 0v240M0 120h320" />
          </g>
          <circle cx="160" cy="360" r="32" fill="#fff" />
          <circle cx="480" cy="90" r="14" fill="#fff" />
          <circle cx="540" cy="180" r="14" fill="#fff" />
          <circle cx="480" cy="390" r="16" fill="#fff" />
          <circle cx="420" cy="220" r="14" fill="#fff" />
          <circle cx="510" cy="260" r="10" fill="#fff" />
        </svg>
      </span>
    )
  }

  if (resolved === 'US' || resolved === 'USA') {
    return (
      <span className={cn('inline-block overflow-hidden rounded-[3px] shadow-sm align-middle', className)} title={country || 'United States'} {...props}>
        <svg viewBox="0 0 640 480" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
          <path fill="#b22234" d="M0 0h640v480H0z" />
          <path fill="#fff" d="M0 37h640v37H0zm0 74h640v37H0zm0 74h640v37H0zm0 74h640v37H0zm0 74h640v37H0zm0 74h640v37H0z" />
          <path fill="#3c3b6e" d="M0 0h260v259H0z" />
          <g fill="#fff">
            <circle cx="40" cy="40" r="8" />
            <circle cx="90" cy="40" r="8" />
            <circle cx="140" cy="40" r="8" />
            <circle cx="190" cy="40" r="8" />
            <circle cx="230" cy="40" r="8" />
            <circle cx="65" cy="80" r="8" />
            <circle cx="115" cy="80" r="8" />
            <circle cx="165" cy="80" r="8" />
            <circle cx="210" cy="80" r="8" />
            <circle cx="40" cy="120" r="8" />
            <circle cx="90" cy="120" r="8" />
            <circle cx="140" cy="120" r="8" />
            <circle cx="190" cy="120" r="8" />
            <circle cx="230" cy="120" r="8" />
            <circle cx="65" cy="160" r="8" />
            <circle cx="115" cy="160" r="8" />
            <circle cx="165" cy="160" r="8" />
            <circle cx="210" cy="160" r="8" />
            <circle cx="40" cy="200" r="8" />
            <circle cx="90" cy="200" r="8" />
            <circle cx="140" cy="200" r="8" />
            <circle cx="190" cy="200" r="8" />
            <circle cx="230" cy="200" r="8" />
          </g>
        </svg>
      </span>
    )
  }

  if (resolved === 'NZ') {
    return (
      <span className={cn('inline-block overflow-hidden rounded-[3px] shadow-sm align-middle', className)} title={country || 'New Zealand'} {...props}>
        <svg viewBox="0 0 640 480" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
          <path fill="#00247d" d="M0 0h640v480H0z" />
          <g>
            <path fill="#012169" d="M0 0h320v240H0z" />
            <path stroke="#fff" strokeWidth="30" d="m0 0 320 240M320 0 0 240" />
            <path stroke="#c8102e" strokeWidth="20" d="m0 0 320 240M320 0 0 240" />
            <path stroke="#fff" strokeWidth="50" d="M160 0v240M0 120h320" />
            <path stroke="#c8102e" strokeWidth="30" d="M160 0v240M0 120h320" />
          </g>
          <circle cx="480" cy="100" r="16" fill="#fff" />
          <circle cx="480" cy="100" r="12" fill="#cc142b" />
          <circle cx="550" cy="190" r="14" fill="#fff" />
          <circle cx="550" cy="190" r="10" fill="#cc142b" />
          <circle cx="480" cy="380" r="18" fill="#fff" />
          <circle cx="480" cy="380" r="14" fill="#cc142b" />
          <circle cx="410" cy="230" r="14" fill="#fff" />
          <circle cx="410" cy="230" r="10" fill="#cc142b" />
        </svg>
      </span>
    )
  }

  if (resolved === 'DE') {
    return (
      <span className={cn('inline-block overflow-hidden rounded-[3px] shadow-sm align-middle', className)} title={country || 'Germany'} {...props}>
        <svg viewBox="0 0 640 480" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
          <path fill="#000" d="M0 0h640v160H0z" />
          <path fill="#dd0000" d="M0 160h640v160H0z" />
          <path fill="#ffce00" d="M0 320h640v160H0z" />
        </svg>
      </span>
    )
  }

  if (resolved === 'EU') {
    return (
      <span className={cn('inline-block overflow-hidden rounded-[3px] shadow-sm align-middle', className)} title={country || 'Europe / Schengen'} {...props}>
        <svg viewBox="0 0 640 480" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
          <path fill="#003399" d="M0 0h640v480H0z" />
          <g fill="#ffcc00">
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180
              const cx = 320 + 130 * Math.sin(angle)
              const cy = 240 - 130 * Math.cos(angle)
              return <circle key={i} cx={cx} cy={cy} r="12" />
            })}
          </g>
        </svg>
      </span>
    )
  }

  if (resolved === 'IN') {
    return (
      <span className={cn('inline-block overflow-hidden rounded-[3px] shadow-sm align-middle', className)} title={country || 'India'} {...props}>
        <svg viewBox="0 0 640 480" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
          <path fill="#ff9933" d="M0 0h640v160H0z" />
          <path fill="#fff" d="M0 160h640v160H0z" />
          <path fill="#138808" d="M0 320h640v160H0z" />
          <circle cx="320" cy="240" r="45" fill="none" stroke="#000080" strokeWidth="7" />
          <circle cx="320" cy="240" r="10" fill="#000080" />
        </svg>
      </span>
    )
  }

  return (
    <span
      className={cn('inline-flex items-center justify-center overflow-hidden rounded bg-forest-900/10 text-forest-900 align-middle', className)}
      style={{ fontSize: 'clamp(0.75rem, 4vw, 2rem)' }}
      title={country || undefined}
      {...props}
    >
      {flag || country || code || '🌐'}
    </span>
  )
}
