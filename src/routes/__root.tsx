import { HeadContent, Link, Scripts, createRootRoute, useRouterState } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { EnquiryPopup } from '@/components/EnquiryPopup'
import appCss from '../styles.css?url'

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'British Education and Immigration',
  alternateName: 'British Education Sangaria',
  description: 'Premier Study Visa Consultant & IELTS / PTE Coaching Institute in Sangaria, Hanumangarh, Rajasthan. Expert visa guidance for Canada, UK, Australia, USA, NZ & Europe.',
  url: 'https://britisheducationandimmigration.com',
  logo: 'https://britisheducationandimmigration.com/img/logo.png',
  image: 'https://britisheducationandimmigration.com/img/hero.webp',
  telephone: ['+919772570478', '+919658018000'],
  email: 'admin@britisheducationandimmigration.com',
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Near Open Book Library, Bhagatpura Road',
    addressLocality: 'Sangaria',
    addressRegion: 'Rajasthan',
    postalCode: '335063',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 29.798547,
    longitude: 74.464214,
  },
  areaServed: [
    { '@type': 'City', name: 'Sangaria' },
    { '@type': 'City', name: 'Hanumangarh' },
    { '@type': 'City', name: 'Sri Ganganagar' },
    { '@type': 'City', name: 'Mandi Dabwali' },
    { '@type': 'State', name: 'Rajasthan' },
    { '@type': 'State', name: 'Punjab' },
  ],
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '09:30',
    closes: '19:30',
  },
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Study Visa & IELTS Coaching in Sangaria | British Education' },
      {
        name: 'keywords',
        content:
          'study visa Sangaria, IELTS coaching Sangaria, PTE coaching Sangaria, immigration consultant Sangaria, Canada visa Hanumangarh, study abroad Rajasthan',
      },
      {
        name: 'description',
        content:
          'Trusted study visa consultant and IELTS/PTE coaching in Sangaria, Hanumangarh. 2,500+ visas approved for Canada, UK, Australia, USA, New Zealand & Europe. Visit Bhagatpura Road office.',
      },
      { name: 'theme-color', content: '#123752' },

      // Local Geo Tags for Google Maps & Local Search Ranking
      { name: 'geo.region', content: 'IN-RJ' },
      { name: 'geo.placename', content: 'Sangaria' },
      { name: 'geo.position', content: '29.798547;74.464214' },
      { name: 'ICBM', content: '29.798547, 74.464214' },

      // OpenGraph for WhatsApp & Social Media Rich Previews (Fast 76KB WebP)
      { property: 'og:site_name', content: 'British Education and Immigration' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://britisheducationandimmigration.com' },
      { property: 'og:title', content: 'Study Visa & IELTS Coaching in Sangaria | British Education' },
      {
        property: 'og:description',
        content:
          '2,500+ visas approved for Canada, UK, Australia, USA & Europe. IELTS & PTE coaching with dedicated computer lab in Sangaria, Hanumangarh.',
      },
      { property: 'og:image', content: 'https://britisheducationandimmigration.com/img/hero.webp' },
      { property: 'og:locale', content: 'en_IN' },

      // Twitter Card Preview
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Study Visa & IELTS Coaching in Sangaria | British Education' },
      { name: 'twitter:description', content: 'Trusted visa consultancy and IELTS/PTE coaching in Sangaria, Hanumangarh.' },
      { name: 'twitter:image', content: 'https://britisheducationandimmigration.com/img/hero.webp' },
    ],
    links: [
      { rel: 'canonical', href: 'https://britisheducationandimmigration.com/' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'icon', href: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519664045228795/VqtFGwaGtbWyvcCS' },
      { rel: 'apple-touch-icon', href: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519664045228795/VqtFGwaGtbWyvcCS' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Figtree:wght@400;600;700&display=swap',
      },
      { rel: 'stylesheet', href: appCss },
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'preload', as: 'image', href: '/img/hero.webp', type: 'image/webp' },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(localBusinessSchema),
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const isAdmin = pathname.startsWith('/admin')
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {!isAdmin && <SiteHeader />}
        <main>{children}</main>
        {!isAdmin && <SiteFooter />}
        {!isAdmin && <WhatsAppButton />}
        {!isAdmin && <EnquiryPopup />}
        <Analytics />
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <section className="mx-auto grid max-w-3xl place-items-center px-6 py-32 text-center">
      <p className="font-mono text-sm text-coral-600">ERROR 404 · PAGE NOT FOUND</p>
      <h1 className="mt-4 text-5xl font-extrabold text-forest-900">This page missed its flight.</h1>
      <Link to="/" className="mt-8 rounded-full bg-forest-900 px-6 py-3 font-bold text-white">
        Back to home
      </Link>
    </section>
  )
}
