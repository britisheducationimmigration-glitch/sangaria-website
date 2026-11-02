import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { PublicCertificate } from '@/lib/content-types'
import { Eyebrow } from '@/components/Section'

export function CertificateCarousel({ certificates, id }: { certificates: PublicCertificate[]; id: string }) {
  const featured = useMemo(
    () => certificates.filter((item) => item.published && item.homepageFeatured).sort((a, b) => a.sortOrder - b.sortOrder),
    [certificates],
  )
  const [visibleCount, setVisibleCount] = useState(1)
  const [pageIndex, setPageIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const update = () => setVisibleCount(media.matches ? 3 : 1)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const pages: PublicCertificate[][] = []
  for (let index = 0; index < featured.length; index += visibleCount) {
    pages.push(featured.slice(index, index + visibleCount))
  }

  useEffect(() => {
    setPageIndex(0)
  }, [visibleCount])

  useEffect(() => {
    if (reducedMotion || paused || pages.length < 2) return
    const timer = window.setInterval(() => setPageIndex((current) => (current + 1) % pages.length), 7000)
    return () => window.clearInterval(timer)
  }, [pages.length, paused, reducedMotion])

  if (!featured.length) return null
  const currentPage = Math.min(pageIndex, pages.length - 1)
  const visible = pages[currentPage] ?? pages[0]
  const changePage = (direction: number) => setPageIndex((current) => (current + direction + pages.length) % pages.length)

  return (
    <section id={id} aria-label="Our certificates and training" aria-roledescription="carousel" className="border-b border-forest-900/10 bg-sand/60 px-5 py-14 md:py-20">
      <div
        className="mx-auto max-w-7xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false)
        }}
      >
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4 md:mb-10">
          <div>
            <Eyebrow>Our credentials</Eyebrow>
            <h2 className="mt-3 text-2xl font-extrabold text-forest-900 md:text-4xl">Partners, training & recognition.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-forest-900/65">A selection of our partner authorisations, professional training and recognitions.</p>
          </div>
          <Link to="/certificates" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-coral-600 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500">
            View all certificates <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3" aria-live={paused ? 'polite' : 'off'}>
          {visible.map((item) => (
            <Link
              key={item.id}
              to="/certificates"
              aria-label={`View ${item.title} in the certificates gallery`}
              className="block min-w-0 rounded-2xl bg-white p-3 ring-1 ring-forest-900/10 transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700 sm:p-4"
            >
              <div className="grid aspect-[4/3] min-h-0 w-full place-items-center overflow-hidden rounded-xl bg-cream p-3">
                <img src={item.imageSrc} alt={item.altText} loading="lazy" decoding="async" className="block h-full w-full min-h-0 min-w-0 object-contain" />
              </div>
              <div className="px-1 pb-1 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-coral-600">{item.category}</p>
                <h3 className="mt-1 font-display text-base font-bold leading-snug text-forest-900">{item.title}</h3>
                <p className="mt-1 text-xs text-forest-900/60">{item.issuer}</p>
              </div>
            </Link>
          ))}
        </div>

        {pages.length > 1 && (
          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="text-xs text-forest-900/60" aria-live="polite">Showing {currentPage + 1} of {pages.length} certificate groups</p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => changePage(-1)} aria-label="Show previous certificates" className="grid size-11 place-items-center rounded-full border border-forest-900/20 bg-white text-forest-900 hover:bg-forest-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500">
                <ArrowLeft aria-hidden="true" className="size-4" />
              </button>
              {!reducedMotion && (
                <button type="button" onClick={() => setPaused((current) => !current)} aria-label={paused ? 'Resume certificate rotation' : 'Pause certificate rotation'} className="grid size-11 place-items-center rounded-full border border-forest-900/20 bg-white text-forest-900 hover:bg-forest-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500">
                  {paused ? <Play aria-hidden="true" className="size-4" /> : <Pause aria-hidden="true" className="size-4" />}
                </button>
              )}
              <button type="button" onClick={() => changePage(1)} aria-label="Show next certificates" className="grid size-11 place-items-center rounded-full border border-forest-900/20 bg-white text-forest-900 hover:bg-forest-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500">
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
