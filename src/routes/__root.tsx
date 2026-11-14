import { HeadContent, Link, Scripts, createRootRoute, useRouterState } from '@tanstack/react-router'
import { useEffect, type ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { EnquiryPopup } from '@/components/EnquiryPopup'
import { getPublicContent, getPublicCountryCatalogue } from '@/lib/public-functions'
import { countries as fixtureCountries, getCurrentCountry } from '@/data/fixtures'
import { defaultSiteSettings } from '@/lib/site-settings'
import appCss from '../styles.css?url'

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'British Education and Immigration',
  alternateName: 'British Education Sangaria',
  description: 'Premier Study Visa Consultant & IELTS / PTE Coaching Institute in Sangaria, Hanumangarh, Rajasthan. Expert visa guidance for Canada, UK, Australia, USA, NZ & Europe.',
  url: 'https://www.britisheducationandimmigration.com',
  logo: 'https://www.britisheducationandimmigration.com/img/logo.png',
  image: 'https://www.britisheducationandimmigration.com/img/hero.webp',
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

function businessTime(hour: string, minute: string | undefined, meridiem: string) {
  const value = Number(hour) % 12 + (meridiem.toUpperCase() === 'PM' ? 12 : 0)
  return String(value).padStart(2, '0') + ':' + (minute || '00')
}

function schemaOpeningHours(label: string) {
  const match = label.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\s*[–-]\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i)
  if (!match) return localBusinessSchema.openingHoursSpecification
  return {
    ...localBusinessSchema.openingHoursSpecification,
    opens: businessTime(match[1], match[2], match[3]),
    closes: businessTime(match[4], match[5], match[6]),
  }
}

export const Route = createRootRoute({
  loader: async () => {
    try {
      const [content, countryPages] = await Promise.all([getPublicContent(), getPublicCountryCatalogue()])
      return { settings: content.settings, countries: countryPages.map((entry) => entry.country) }
    } catch {
      return { settings: defaultSiteSettings, countries: fixtureCountries.map(getCurrentCountry) }
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        name: 'keywords',
        content:
          'study visa Sangaria, IELTS coaching Sangaria, PTE coaching Sangaria, immigration consultant Sangaria, Canada visa Hanumangarh, study abroad Rajasthan',
      },
      { name: 'theme-color', content: '#123752' },

      // Local Geo Tags for Google Maps & Local Search Ranking
      { name: 'geo.region', content: 'IN-RJ' },
      { name: 'geo.placename', content: 'Sangaria' },
      { name: 'geo.position', content: '29.798547;74.464214' },
      { name: 'ICBM', content: '29.798547, 74.464214' },

      // OpenGraph for WhatsApp & Social Media Rich Previews (Fast 76KB WebP)
      { property: 'og:site_name', content: 'British Education and Immigration' },
      { property: 'og:image', content: 'https://www.britisheducationandimmigration.com/img/hero.webp' },
      { property: 'og:locale', content: 'en_IN' },

      // Twitter Card Preview
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://www.britisheducationandimmigration.com/img/hero.webp' },
    ],
   links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      // ✅ Local Logo & Favicon
      { rel: 'icon', href: '/img/logo.png' },
      { rel: 'apple-touch-icon', href: '/img/logo.png' },
      // ✅ Preload style taaki font download hone tak page block na ho
      {
        rel: 'preload',
        as: 'style',
        href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Figtree:wght@400;600;700&display=swap',
      },
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
        children: JSON.stringify({
          ...localBusinessSchema,
          telephone: (loaderData?.settings.phones ?? defaultSiteSettings.phones).map((phone) => phone.startsWith('+') ? phone : '+91' + phone),
          email: (loaderData?.settings.emails ?? defaultSiteSettings.emails)[0],
          openingHoursSpecification: schemaOpeningHours(loaderData?.settings.officeHours ?? defaultSiteSettings.officeHours),
        }),
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})
function RootDocument({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const isAdmin = pathname.startsWith('/admin')
  const isPortal = isAdmin || pathname.startsWith('/attendance')
  const { settings, countries } = Route.useLoaderData()

  // ⚡ Non-blocking GTM: Page load hone ke turant baad background me chalega (Speed boost)
  useEffect(() => {
    if (isPortal || typeof window === 'undefined') return

    const loadGTM = () => {
      if ((window as any).__gtmLoaded) return
      ;(window as any).__gtmLoaded = true
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-N6H564DV'
      document.head.appendChild(script)
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
    }

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadGTM, { timeout: 2000 })
    } else {
      window.setTimeout(loadGTM, 1500)
    }
  }, [isAdmin])

 useEffect(() => {
    if (isPortal || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
    const main = document.querySelector('main')
    if (!main) return

    const sections = Array.from(main.querySelectorAll<HTMLElement>('section'))
    if (!sections.length) return
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const section = entry.target as HTMLElement
        section.classList.add('is-scroll-visible')
        observer.unobserve(section)
      }
    }, { threshold: 0.01 })

    sections.forEach((section) => {
      section.classList.add('scroll-reveal')
      const rect = section.getBoundingClientRect()
      const alreadyVisible = section.getClientRects().length > 0 && rect.top < window.innerHeight && rect.bottom > 0
      if (alreadyVisible) {
        section.classList.add('is-scroll-visible')
      } else {
        observer.observe(section)
      }
      section.querySelectorAll<HTMLElement>('.grid > article, .grid > a').forEach((item, index) => {
        item.classList.add('scroll-reveal-item')
        item.style.setProperty('--scroll-reveal-order', String(Math.min(index, 5)))
      })
    })

    return () => {
      observer.disconnect()
      sections.forEach((section) => {
        section.classList.remove('scroll-reveal', 'is-scroll-visible')
        section.querySelectorAll<HTMLElement>('.scroll-reveal-item').forEach((item) => {
          item.classList.remove('scroll-reveal-item')
          item.style.removeProperty('--scroll-reveal-order')
        })
      })
    }
  }, [isAdmin, pathname])

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {!isPortal && <SiteHeader settings={settings} />}
        <main className={isAdmin ? 'admin-main' : isPortal ? 'attendance-main' : 'public-main'}>{children}</main>
        {!isPortal && <SiteFooter settings={settings} countries={countries} />}
        {!isPortal && <WhatsAppButton />}
        {!isPortal && <EnquiryPopup />}
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
