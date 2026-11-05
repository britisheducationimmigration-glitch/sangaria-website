import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ApprovalCard, TestimonialCard } from '@/components/Cards'
import { GoogleReviewCta } from '@/components/GoogleReviewCta'
import { Eyebrow, PageHero } from '@/components/Section'
import { cn, img } from '@/lib/utils'
import { getPublicContent } from '@/lib/public-functions'

import { createPageSeo } from '@/lib/seo'

export const Route = createFileRoute('/success-stories')({
  loader: () => getPublicContent(),
  head: () => createPageSeo({
    title: 'Visa Success Stories | British Education Sangaria',
    description: 'Read recent student and family visa stories from British Education and Immigration clients in Sangaria and nearby towns.',
    path: '/success-stories',
  }),
  component: SuccessPage,
})

function SuccessPage() {
  const { approvals, testimonials } = Route.useLoaderData()
  const all = ['All', ...Array.from(new Set(approvals.map((a) => a.country)))]
  const [filter, setFilter] = useState('All')
  const shown = filter === 'All' ? approvals : approvals.filter((a) => a.country === filter)

  return (
    <>
      <PageHero
        eyebrow="Success stories"
        title={
          <>
            Stamped, approved, <span className="text-coral-500">on their way.</span>
          </>
        }
        intro="Every week, students and families from Sangaria, Hanumangarh and nearby towns receive their visas with us. Here are some of the latest."
      />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>Visa approvals</Eyebrow>
            <h2 className="mt-4 text-4xl font-extrabold text-forest-900">Recent approvals</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {all.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-bold transition',
                  filter === c ? 'bg-forest-900 text-white' : 'bg-white text-forest-900 ring-1 ring-forest-900/10 hover:ring-forest-900',
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((a, i) => (
            <ApprovalCard key={a.name + a.date} a={a} i={i} />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <img src={img('/img/family.webp', 1600, 640)} alt="Family travelling abroad" loading="lazy" className="h-[28rem] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/90 via-forest-950/50 to-transparent" />
        <div className="absolute inset-0 mx-auto flex max-w-7xl items-center px-6">
          <p className="max-w-lg font-display text-4xl font-extrabold text-white md:text-5xl">
            2,500+ families trusted us with their <span className="text-coral-500">biggest move.</span>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <Eyebrow>Testimonials</Eyebrow>
        <h2 className="mt-4 text-4xl font-extrabold text-forest-900">In their own words</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} t={t} featured={i === 0 || i === 4} />
          ))}
        </div>
      </section>
      <GoogleReviewCta />
    </>
  )
}
