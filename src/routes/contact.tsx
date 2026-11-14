import { createFileRoute } from '@tanstack/react-router'
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Facebook, Instagram } from '@/components/BrandIcons'
import { EnquiryForm } from '@/components/EnquiryForm'
import { PageHero } from '@/components/Section'
import { GoogleReviewCta } from '@/components/GoogleReviewCta'
import { site } from '@/data/site'
import { Route as RootRoute } from './__root'

import { createPageSeo } from '@/lib/seo'

export const Route = createFileRoute('/contact')({
  validateSearch: (s: Record<string, unknown>): { interest?: string } => ({
    interest: typeof s.interest === 'string' ? s.interest : undefined,
  }),
  head: () => createPageSeo({
    title: 'Contact & Free Enquiry | British Education Sangaria',
    description: 'Contact our Sangaria team for study visa counselling, IELTS/PTE coaching, PR guidance and a free profile evaluation.',
    path: '/contact',
  }),
  component: ContactPage,
})

function ContactPage() {
  const { interest } = Route.useSearch()
  const { settings } = RootRoute.useLoaderData()
  const rawWaDigits = (settings.phones[1] || settings.phones[0] || site.whatsapp)
    .replace(/\D/g, '')
    .replace(/^0+/, '')
  const waPhone = rawWaDigits.length === 10 ? `91${rawWaDigits}` : rawWaDigits
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let’s talk about <span className="text-coral-500">your plans.</span>
          </>
        }
        intro="Drop an enquiry, call, WhatsApp or walk into our Sangaria office — your first counselling session is free."
      />
      <section className="relative z-10 mx-auto mt-8 grid max-w-7xl gap-8 px-6 pb-24 lg:-mt-12 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-forest-900/10 md:p-10">
          <h2 className="text-3xl font-extrabold text-forest-900">Send an enquiry</h2>
          <p className="mt-1 mb-8 text-forest-900/60">We reply within one working day.</p>
          <EnquiryForm source="contact" defaultInterest={interest} />
        </div>
        <div className="space-y-5">
          <div className="rounded-[2rem] bg-forest-900 bg-grain p-8 text-white">
            <ul className="space-y-6">
              <li className="flex gap-4">
                <MapPin className="mt-1 size-5 shrink-0 text-coral-400" />
                <span>
                  <span className="block font-bold">Office</span>
                  <span className="text-forest-100/75">{site.address}</span>
                </span>
              </li>
              <li className="flex gap-4">
                <Phone className="mt-1 size-5 shrink-0 text-coral-400" />
                <span>
                  <span className="block font-bold">Call us</span>
                  {settings.phones.map((p) => (
                    <a key={p} href={`tel:${p.startsWith('+') ? p : '+91' + p}`} className="block text-forest-100/75 hover:text-white">
                      {p.startsWith('+') ? p : '+91 ' + p}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-4">
                <Clock className="mt-1 size-5 shrink-0 text-coral-400" />
                <span>
                  <span className="block font-bold">Hours</span>
                  <span className="text-forest-100/75">{settings.officeHours}</span>
                </span>
              </li>
              <li className="flex gap-4">
                <Mail className="mt-1 size-5 shrink-0 text-coral-400" />
                <span>
                  <span className="block font-bold">Email us</span>
                  {settings.emails.map((email) => (
                    <a
                      key={email}
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`}
                      target="_blank"
                      rel="noreferrer"
                      className="block break-all text-sm text-forest-100/75 hover:text-white"
                    >
                      {email}
                    </a>
                  ))}
                </span>
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold">
                <MessageCircle className="size-4" /> WhatsApp
              </a>
              <a href={site.mapUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full bg-coral-500 px-5 py-3 text-sm font-bold">
                <MapPin className="size-4" /> Get directions
              </a>
              <a href={site.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-bold hover:bg-coral-500">
                <Instagram className="size-4" /> Instagram
              </a>
              <a href={site.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-bold hover:bg-coral-500">
                <Facebook className="size-4" /> Facebook
              </a>
            </div>
          </div>
          <iframe
            title="Office location map"
            src={`https://www.google.com/maps?q=${site.latitude},${site.longitude}&z=17&output=embed`}
            className="h-72 w-full rounded-[2rem] border-0 ring-1 ring-forest-900/10"
            loading="lazy"
          />
        </div>
      </section>
      <GoogleReviewCta />
    </>
  )
}
