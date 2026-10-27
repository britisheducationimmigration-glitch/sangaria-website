import { Link } from '@tanstack/react-router'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Facebook, Instagram } from './BrandIcons'
import { CountryFlag } from './CountryFlag'
import { countries } from '@/data/fixtures'
import { navLinks, site } from '@/data/site'
import { Logo } from './Logo'

export function SiteFooter() {
  return (
    <footer className="bg-forest-950 bg-grain text-forest-100">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-10">
        <div className="mb-16 flex flex-col items-start justify-between gap-8 border-b border-white/10 pb-16 md:flex-row md:items-end">
          <h2 className="max-w-2xl text-4xl font-extrabold text-white md:text-6xl">
            Your visa story <span className="text-coral-500">starts here.</span>
          </h2>
          <a
            href="/contact"
            className="rounded-full bg-coral-500 px-7 py-4 font-bold text-white shadow-[4px_4px_0_0] shadow-black/40 transition hover:-translate-y-1"
          >
            Book free counselling →
          </a>
        </div>
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-forest-100/70">{site.tagline}</p>
            <div className="mt-6 flex gap-3">
              <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-coral-500">
                <Instagram className="size-4" />
              </a>
              <a href={site.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-coral-500">
                <Facebook className="size-4" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-coral-400">Explore</h3>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-coral-400">Destinations</h3>
            <ul className="space-y-2.5 text-sm">
              {countries.map((c) => (
                <li key={c.slug}>
                  <Link to="/countries/$slug" params={{ slug: c.slug }} className="hover:text-white flex items-center">
                    <CountryFlag flag={c.flag} code={c.code} country={c.name} className="mr-2.5 h-3.5 w-5 shrink-0" />
                    <span>{c.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-coral-400">Visit our office</h3>
            <p className="flex gap-3 text-sm leading-relaxed">
              <MapPin className="mt-0.5 size-4 shrink-0 text-coral-400" />
              {site.address}
            </p>
            {site.phones.map((p) => (
              <a key={p} href={`tel:+91${p}`} className="mt-3 flex items-center gap-3 text-sm hover:text-white">
                <Phone className="size-4 text-coral-400" /> +91 {p}
              </a>
            ))}
            {site.emails.map((email) => (
              <a key={email} href={`mailto:${email}`} className="mt-3 flex items-start gap-3 break-all text-sm hover:text-white">
                <Mail className="mt-0.5 size-4 shrink-0 text-coral-400" /> {email}
              </a>
            ))}
            <p className="mt-3 text-sm text-forest-100/60">{site.hours}</p>
          </div>
        </div>
        <p className="mt-16 border-t border-white/10 pt-6 text-xs text-forest-100/50">
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {site.name}. Visa decisions are made solely by the respective embassies and immigration authorities.
        </p>
      </div>
    </footer>
  )
}
