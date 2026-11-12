import { createFileRoute, notFound } from '@tanstack/react-router'
import { getPublicPolicyNotices, getPublicCountryPage } from '@/lib/public-functions'
import { CountryPageView } from '@/components/CountryPageView'
import { createPageSeo } from '@/lib/seo'

function CountryPageSkeleton() {
  return (
    <div className="min-h-screen bg-forest-900 text-white animate-pulse">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-20">
        <div className="h-4 w-32 bg-white/20 rounded-md" />
        <div className="mt-6 h-12 w-20 bg-white/20 rounded-lg" />
        <div className="mt-4 h-14 w-3/4 max-w-lg bg-white/20 rounded-2xl" />
        <div className="mt-4 h-6 w-1/2 max-w-md bg-white/20 rounded-md" />
        <div className="mt-6 h-20 w-full max-w-2xl bg-white/10 rounded-2xl" />
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
          <div className="h-24 bg-white/10 rounded-2xl" />
          <div className="h-24 bg-white/10 rounded-2xl" />
          <div className="h-24 bg-white/10 rounded-2xl" />
        </div>
      </div>
      <div className="bg-cream py-16 px-6">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-6">
            <div className="h-32 bg-slate-200/80 rounded-3xl" />
            <div className="h-64 bg-slate-200/80 rounded-3xl" />
          </div>
          <div className="h-96 bg-slate-200/80 rounded-3xl" />
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/countries/$slug')({
  pendingComponent: CountryPageSkeleton,
  loader: async ({ params }) => {
    const content = await getPublicCountryPage({ data: { slug: params.slug } })
    if (!content) throw notFound()
    const notices = await getPublicPolicyNotices()
    return {
      country: content.country,
      guidance: content.guidance,
      notices: notices.filter((notice) => notice.countrySlug === 'all' || notice.countrySlug === content.country.slug),
    }
  },
  head: ({ loaderData }) => {
    const isEuropeGuide = loaderData.country.slug === 'europe'
    return createPageSeo({
      title: isEuropeGuide
        ? 'Europe / Schengen Visitor Visa & Costs | British Education'
        : `${loaderData.country.name} Study Visa & Costs | British Education`,
      description: isEuropeGuide
        ? 'Find Schengen short-stay visitor visa fees and guidance for tourism, family visits and business travel. For study plans, review the destination country’s study visa requirements.'
        : `Review ${loaderData.country.name} visa fees, study costs, intakes and guidance from official sources. Get free counselling in Sangaria.`,
      path: `/countries/${loaderData.country.slug}`,
    })
  },
  component: CountryPage,
})

function CountryPage() {
  const { country, guidance, notices } = Route.useLoaderData()
  return <CountryPageView country={country} guidance={guidance} notices={notices} />
}
