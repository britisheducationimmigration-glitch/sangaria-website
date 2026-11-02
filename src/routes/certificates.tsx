import { useState } from 'react'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'
import { PageHero, Eyebrow } from '@/components/Section'
import { getPublicContent } from '@/lib/public-functions'
import { createPageSeo } from '@/lib/seo'

export const Route = createFileRoute('/certificates')({
  loader: () => getPublicContent(),
  head: () => createPageSeo({
    title: 'Certificates & Partnerships | British Education Sangaria',
    description: 'View our education partner authorisations, professional training and recognitions.',
    path: '/certificates',
  }),
  component: CertificatesPage,
})

function CertificatesPage() {
  const { certificates } = Route.useLoaderData()
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const categories = Array.from(new Set(certificates.filter((item) => item.published).map((item) => item.category))).sort()
  const visibleCertificates = certificates
    .filter((item) => item.published && (activeCategory === 'All' || item.category === activeCategory))
    .sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <>
      <PageHero
        eyebrow="Our credentials"
        title={<>Partnerships, training & <span className="text-coral-400">recognition.</span></>}
        intro="Explore the partner authorisations, professional training and recognitions that support our work. Tap any image to open it at full size."
      />
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:py-16" aria-label="Certificates and recognitions">
        <div className="mb-8 flex flex-wrap gap-2" aria-label="Filter certificates">
          <button type="button" aria-pressed={activeCategory === 'All'} onClick={() => setActiveCategory('All')} className={'min-h-11 rounded-full border px-4 py-2 text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500 ' + (activeCategory === 'All' ? 'border-forest-900 bg-forest-900 text-white' : 'border-forest-900/15 bg-white text-forest-900 hover:bg-forest-50')}>All credentials</button>
          {categories.map((category) => (
            <button key={category} type="button" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)} className={'min-h-11 rounded-full border px-4 py-2 text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500 ' + (activeCategory === category ? 'border-forest-900 bg-forest-900 text-white' : 'border-forest-900/15 bg-white text-forest-900 hover:bg-forest-50')}>
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCertificates.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-3xl bg-white p-4 ring-1 ring-forest-900/10 transition hover:shadow-lg">
              <a href={item.imageSrc} target="_blank" rel="noreferrer" aria-label={'Open full size image: ' + item.title} className="group block rounded-2xl bg-cream p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500">
                <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-white">
                  <img src={item.imageSrc} alt={item.altText} loading="lazy" decoding="async" className="max-h-full max-w-full object-contain transition group-hover:scale-[1.02]" />
                </div>
              </a>
              <div className="flex min-h-32 flex-col px-1 pb-1 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-coral-600">{item.category}</p>
                <h2 className="mt-1 font-display text-lg font-extrabold leading-snug text-forest-900">{item.title}</h2>
                <p className="mt-1 text-sm text-forest-900/60">{item.issuer}</p>
                {item.credentialDate && <p className="mt-2 text-xs text-forest-900/50">{item.credentialDate}</p>}
                <a href={item.imageSrc} target="_blank" rel="noreferrer" className="mt-auto inline-flex min-h-11 items-center gap-2 pt-3 text-xs font-bold text-coral-600 underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500">
                  View full size <ExternalLink aria-hidden="true" className="size-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
        {visibleCertificates.length === 0 && <p className="rounded-2xl bg-cream p-8 text-center text-sm text-forest-900/60">No credentials in this category yet.</p>}
      </section>
    </>
  )
}
