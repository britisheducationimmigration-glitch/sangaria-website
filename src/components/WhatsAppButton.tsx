import { MessageCircle, Phone } from 'lucide-react'
import { useLoaderData, useRouterState } from '@tanstack/react-router'
import { site } from '@/data/site'

const countryNames: Record<string, string> = {
  canada: 'Canada',
  uk: 'UK',
  australia: 'Australia',
  usa: 'USA',
  'new-zealand': 'New Zealand',
  germany: 'Germany',
  europe: 'Europe / Schengen',
}

function getContextualMessage(pathname: string, countries: Array<{ slug: string; name: string }>): string {
  if (pathname.startsWith('/countries/')) {
    const slug = pathname.replace('/countries/', '').replace(/\/$/, '')
    const name =
      countryNames[slug] ||
      countries.find((c) => c.slug === slug)?.name ||
      (slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Abroad')
    return `Hello British Education Sangaria, I want to know more about ${name} Study Visa.`
  }
  if (pathname.startsWith('/study-plan/')) {
    const slug = pathname.replace('/study-plan/', '').replace(/\/$/, '')
    const name =
      countryNames[slug] ||
      countries.find((c) => c.slug === slug)?.name ||
      'Study'
    return `Hello British Education Sangaria, I am reviewing the ${name} Study Plan checklist and need guidance.`
  }
  if (pathname === '/coaching') {
    return 'Hello British Education Sangaria, I want to book a free IELTS / PTE demo batch.'
  }
  if (pathname === '/eligibility') {
    return 'Hello British Education Sangaria, I checked my visa eligibility on your website and want to discuss my profile.'
  }
  if (pathname === '/visas') {
    return 'Hello British Education Sangaria, I have an enquiry about your visa and immigration services.'
  }
  if (pathname === '/success-stories') {
    return 'Hello British Education Sangaria, I saw recent visa approvals on your website and want to evaluate my profile.'
  }
  if (pathname === '/certificates') {
    return 'Hello British Education Sangaria, I saw your official education partner authorisations and want to apply.'
  }
  return 'Hello British Education Sangaria, I would like to know more about study visas and IELTS/PTE coaching.'
}

export function WhatsAppButton() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const rootData = useLoaderData({ from: '__root__' })
  const settings = rootData?.settings
  const countries = rootData?.countries ?? []

  if (settings?.whatsappEnabled === false || pathname.startsWith('/admin') || pathname.startsWith('/attendance')) return null

  const rawPhone = (settings?.phones?.[1] || settings?.phones?.[0] || site.whatsapp).trim()
  const rawDigits = rawPhone.replace(/\D/g, '').replace(/^0+/, '')
  const waPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits
  const telHref = `tel:${rawPhone.startsWith('+') ? rawPhone.replace(/[^\d+]/g, '') : `+${waPhone}`}`
  const messageText = getContextualMessage(pathname, countries)
  const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(messageText)}`

  return (
    <>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed right-5 bottom-5 z-40 hidden sm:flex items-center gap-2.5 rounded-full bg-[#25D366] py-3.5 pr-5 pl-4 font-bold text-white shadow-xl shadow-black/25 transition hover:scale-105 active:scale-95 cursor-pointer"
      >
        <MessageCircle className="size-5 fill-current" />
        <span>WhatsApp us</span>
      </a>

      <div className="fixed right-0 bottom-0 left-0 z-40 flex items-center gap-3 border-t border-white/15 bg-forest-950/95 px-4 py-3 shadow-2xl backdrop-blur-md sm:hidden">
        <a
          href={telHref}
          className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 py-2.5 text-xs font-bold text-white transition hover:bg-white/20 active:scale-95"
        >
          <Phone aria-hidden="true" className="size-4" />
          <span>Call Now</span>
        </a>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 text-xs font-bold text-white shadow-md transition hover:brightness-105 active:scale-95"
        >
          <MessageCircle aria-hidden="true" className="size-4 fill-current" />
          <span>WhatsApp</span>
        </a>
      </div>
    </>
  )
}