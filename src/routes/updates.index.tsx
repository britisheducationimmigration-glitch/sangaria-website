import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PostCard } from '@/components/Cards'
import { PageHero } from '@/components/Section'
import type { Post } from '@/data/fixtures'
import { cn } from '@/lib/utils'
import { getPublicContent } from '@/lib/public-functions'

import { createPageSeo } from '@/lib/seo'

export const Route = createFileRoute('/updates/')({
  loader: () => getPublicContent(),
  head: () => createPageSeo({
    title: 'Visa & Study Abroad Updates | British Education Sangaria',
    description: 'Browse visa policy updates, study abroad guides and IELTS/PTE articles from the British Education and Immigration team.',
    path: '/updates',
  }),
  component: UpdatesPage,
})

const categories: ('All' | Post['category'])[] = ['All', 'Visa News', 'Study Abroad', 'IELTS & PTE', 'Immigration']

function UpdatesPage() {
  const { posts } = Route.useLoaderData()
  const [cat, setCat] = useState<(typeof categories)[number]>('All')
  const shown = cat === 'All' ? posts : posts.filter((p) => p.category === cat)
  return (
    <>
      <PageHero
        eyebrow="News & Blog"
        title={
          <>
            Visa rules change. <span className="text-coral-500">We keep you posted.</span>
          </>
        }
        intro="Policy updates, study-abroad guides and IELTS/PTE tips from our counsellors."
      />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-bold transition',
                cat === c ? 'bg-coral-500 text-white' : 'bg-white text-forest-900 ring-1 ring-forest-900/10 hover:ring-forest-900',
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <PostCard key={p.slug} p={p} />
          ))}
        </div>
        {shown.length === 0 && <p className="mt-10 text-forest-900/60">No articles in this category yet.</p>}
      </section>
    </>
  )
}
