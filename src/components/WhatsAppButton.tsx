import { MessageCircle } from 'lucide-react'
import { site } from '@/data/site'

import type { SiteSettings } from '@/lib/content-types'

export function WhatsAppButton({ settings }: { settings: Pick<SiteSettings, 'whatsappEnabled'> }) {
  if (!settings.whatsappEnabled) return null
  const text = encodeURIComponent('Hello British Education and Immigration, I would like to know more about visas.')
  return (
    <a
      href={`https://wa.me/${site.whatsapp}?text=${text}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-5 bottom-20 sm:bottom-5 z-40 hidden sm:flex items-center gap-2 rounded-full bg-[#25D366] py-3.5 pr-5 pl-4 font-bold text-white shadow-xl shadow-black/20 transition hover:scale-105 cursor-pointer"
    >
      <MessageCircle className="size-5" />
      <span className="hidden sm:inline">WhatsApp us</span>
    </a>
  )
}
