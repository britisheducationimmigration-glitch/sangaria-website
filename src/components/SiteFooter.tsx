import { Link } from '@tanstack/react-router'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Facebook, Instagram } from './BrandIcons'
import { CountryFlag } from './CountryFlag'
import type { Country } from '@/data/fixtures'
import { googleReviewUrl } from '@/data/google-review'
import { navLinks, site } from '@/data/site'
import type { SiteSettings } from '@/lib/content-types'
import { Logo } from './Logo'

export function SiteFooter({ settings, countries }: { settings: SiteSettings; countries: Country[] }) {
  return (
    <footer className="bg-forest-950 bg-grain text-forest-100">
      <div className="mx-auto max-w-7xl px-5 pt-12 pb-24 sm:pb-8 md:px-6 md:pt-20 md:pb-10">
        <div className="mb-10 flex flex-col items-start justify-between gap-5 border-b border-white/10 pb-10 md:mb-16 md:gap-8 md:pb-16 md:flex-row md:items-end">
          <h2 className="max-w-2xl text-3xl font-extrabold leading-tight text-white md:text-6xl">
            Your visa story <span className="text-coral-500">starts here.</span>
          </h2>
          <Link
            to="/contact"
            className="rounded-full bg-coral-500 px-7 py-4 font-bold text-white shadow-[4px_4px_0_0] shadow-black/40 transition hover:-translate-y-1"
          >
            Book free counselling →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-[1.4fr_1fr_1fr_1.3fr] md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Logo light />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-forest-100/70">{site.tagline}</p>
            <div className="mt-4 flex gap-3 md:mt-6">
              <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-coral-500">
                <Instagram className="size-4" />
              </a>
              <a href={site.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-coral-500">
                <Facebook className="size-4" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-coral-400 md:mb-4">Explore</h3>
            <ul className="space-y-1.5 text-xs md:space-y-2.5 md:text-sm">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="block py-1 transition-colors hover:text-white md:py-0">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li><Link to="/certificates" className="block py-1 transition-colors hover:text-white md:py-0">Certificates & partnerships</Link></li>
              <li><a href={googleReviewUrl} target="_blank" rel="noopener noreferrer" aria-label="Write a Google review" className="block py-1 transition-colors hover:text-white md:py-0">Google reviews ↗</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-coral-400 md:mb-4">Destinations</h3>
            <ul className="space-y-1.5 text-xs md:space-y-2.5 md:text-sm">
              {countries.map((c) => (
                <li key={c.slug}>
                  <Link to="/countries/$slug" params={{ slug: c.slug }} className="flex min-h-8 items-center py-1 transition-colors hover:text-white">
                    <CountryFlag flag={c.flag} code={c.code} country={c.name} className="mr-2.5 h-3.5 w-5 shrink-0" />
                    <span>{c.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-coral-400 md:mb-4">Visit our office</h3>
            <p className="flex gap-3 text-xs leading-relaxed md:text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0 text-coral-400" />
              {site.address}
            </p>
            {settings.phones.map((p) => (
              <a key={p} href={`tel:${p.startsWith('+') ? p : '+91' + p}`} className="mt-2 flex min-h-8 items-center gap-3 text-xs transition-colors hover:text-white md:mt-3 md:text-sm">
                <Phone className="size-4 text-coral-400" /> {p.startsWith('+') ? p : '+91 ' + p}
              </a>
            ))}
            {settings.emails.map((email) => (
              <a
                key={email}
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex min-h-8 items-start gap-3 break-all text-xs transition-colors hover:text-white md:mt-3 md:text-sm"
              >
                <Mail className="mt-0.5 size-4 shrink-0 text-coral-400" /> {email}
              </a>
            ))}
            <p className="mt-2 text-xs text-forest-100/60 md:mt-3 md:text-sm">{settings.officeHours}</p>
          </div>
        </div>
        <p className="mt-10 border-t border-white/10 pt-5 text-[10px] leading-relaxed text-forest-100/50 md:mt-16 md:pt-6 md:text-xs">
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {site.name}. Visa decisions are made solely by the respective embassies and immigration authorities.
        </p>
      </div>
    </footer>
  )
}
