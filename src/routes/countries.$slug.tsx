import { createFileRoute, notFound } from '@tanstack/react-router'
import { getPublicPolicyNotices, getPublicCountryPage } from '@/lib/public-functions'
import { CountryPageView } from '@/components/CountryPageView'

import { createPageSeo } from '@/lib/seo'

export const Route = createFileRoute('/countries/$slug')({
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
