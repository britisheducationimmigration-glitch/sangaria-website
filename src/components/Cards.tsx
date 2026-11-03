import { Link } from '@tanstack/react-router'
import { Quote, Star } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Approval, Post, Testimonial } from '@/data/fixtures'
import { CountryFlag } from './CountryFlag'
import { cn } from '@/lib/utils'
import { getSupportedVideoEmbedUrl } from '@/lib/video'

export function formatDate(d: string) {
  return new Date(`${d}T12:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })
}

export function ApprovalCard({ a, i = 0 }: { a: Approval; i?: number }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-forest-900/20 bg-white p-5">
      {a.photoSrc && (
        <div className="-mx-5 -mt-5 mb-4 flex max-h-80 min-h-48 items-center justify-center overflow-hidden bg-forest-50">
          <img src={a.photoSrc} alt={a.mediaAlt || 'Student visa approval'} loading="lazy" decoding="async" className="max-h-80 w-full object-contain" />
        </div>
      )}
      {a.videoUrl && <ApprovalVideo url={a.videoUrl} title={a.name} />}
      <div className="flex items-start justify-between">
        <CountryFlag flag={a.flag} country={a.country} className="h-7 w-10 shrink-0" />
        <span
          className={cn(
            'rounded-md border-2 px-2 py-1 font-mono text-[10px] font-bold tracking-widest uppercase',
            i % 2 ? 'border-forest-600 text-forest-600 rotate-[6deg]' : 'border-coral-500 text-coral-600 rotate-[-8deg]',
          )}
        >
          Approved
        </span>
      </div>
      <p className="mt-4 font-display text-lg font-bold text-forest-900">{a.name}</p>
      <p className="text-sm text-forest-900/70">
        {a.country} · {a.visa}
      </p>
      {a.note && <p className="mt-1 text-xs text-forest-900/50">{a.note}</p>}
      <p className="mt-4 border-t border-forest-900/10 pt-3 font-mono text-[11px] text-forest-900/50">{formatDate(a.date)}</p>
    </div>
  )
}

export function TestimonialCard({ t, featured }: { t: Testimonial; featured?: boolean }) {
  return (
    <figure
      className={cn(
        'flex h-full flex-col rounded-3xl p-7',
        featured ? 'bg-coral-500 text-white' : 'bg-white text-forest-900 ring-1 ring-forest-900/10',
      )}
    >
      <Quote className={cn('size-8', featured ? 'text-white/60' : 'text-coral-500')} />
      <blockquote className="mt-4 flex-1 text-[16.5px] leading-relaxed">“{t.quote}”</blockquote>
      <div className="mt-5 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <figcaption className="mt-5 border-t border-forest-900/10 pt-4">
        <p className="font-display font-bold">{t.name}</p>
        <p className={cn('text-xs', featured ? 'text-white/70' : 'text-forest-900/60')}>
          {t.city} · {t.country} ({t.visa})
        </p>
      </figcaption>
    </figure>
  )
}

export function PostCard({ p }: { p: Post }) {
  return (
    <article className="group flex flex-col rounded-3xl bg-white p-7 ring-1 ring-forest-900/10 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between text-xs text-forest-900/50 font-mono">
        <span className="rounded-full bg-forest-50 px-3 py-1 font-bold text-forest-700">{p.category}</span>
        <span>{p.readMins} min read</span>
      </div>
      <h3 className="mt-4 font-display text-xl font-bold text-forest-900 group-hover:text-coral-600 transition">
        <Link to="/updates/$slug" params={{ slug: p.slug }}>
          {p.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm text-forest-900/70 leading-relaxed">{p.excerpt}</p>
      <div className="mt-6 flex items-center justify-between border-t border-forest-900/10 pt-4 text-xs text-forest-900/50">
        <span>{formatDate(p.date)}</span>
        <span className="font-bold text-coral-600 group-hover:translate-x-1 transition">Read article →</span>
      </div>
    </article>
  )
}

function ApprovalVideo({ url, title }: { url: string; title: string }) {
  const embedUrl = getSupportedVideoEmbedUrl(url)
  const containerRef = useRef<HTMLDivElement>(null)
  const [nearViewport, setNearViewport] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (!('IntersectionObserver' in window)) {
      setNearViewport(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => setNearViewport(entry.isIntersecting),
      { rootMargin: '180px 0px' },
    )
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  if (!embedUrl) return null
  return (
    <div ref={containerRef} className="-mx-5 -mt-5 mb-4 aspect-video overflow-hidden bg-gradient-to-br from-forest-950 to-forest-700">
      {nearViewport ? (
        <iframe
          src={embedUrl}
          title={title + ' visa approval video'}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full border-0"
        />
      ) : (
        <div className="grid h-full place-items-center px-4 text-center text-xs font-semibold text-white/80" aria-label={title + ' visa approval video'}>
          Student success video
        </div>
      )}
    </div>
  )
}
