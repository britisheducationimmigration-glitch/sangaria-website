import { HeadContent, Link, Scripts, createRootRoute, useRouterState } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { EnquiryPopup } from '@/components/EnquiryPopup'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Study Visa & IELTS Coaching in Sangaria | British Education' },
      { name: 'keywords', content: 'study visa Sangaria, IELTS coaching Sangaria, PTE coaching Sangaria, immigration consultant Sangaria' },
      {
        name: 'description',
        content:
          'Study visa, PR, tourist visa and IELTS/PTE coaching for Canada, UK, Australia, USA, New Zealand, Germany and Europe. Visit us in Sangaria, Hanumangarh.',
      },
      { name: 'theme-color', content: '#0b3326' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap',
      },
      { rel: 'stylesheet', href: appCss },
      { rel: 'manifest', href: '/manifest.json' },
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
