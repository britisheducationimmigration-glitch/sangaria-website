import { Link } from '@tanstack/react-router'
import { Menu, Phone, X } from 'lucide-react'
import { useState } from 'react'
import { navLinks, site } from '@/data/site'
import { Logo } from './Logo'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50">
      <div className="hidden bg-forest-950 text-[13px] text-forest-100 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
          <span>📍 Sangaria, Hanumangarh · {site.hours}</span>
          <span className="flex gap-5">
            {site.phones.map((p) => (
              <a key={p} href={`tel:+91${p}`} className="hover:text-coral-400">
                +91 {p}
              </a>
            ))}
          </span>
        </div>
      </div>
      <div className="border-b border-forest-900/10 bg-cream/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3.5 sm:gap-4 sm:px-6">
          <Link to="/" onClick={() => setOpen(false)}>
            <Logo />
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-full px-3.5 py-2 text-[14.5px] font-medium text-forest-900/80 transition hover:bg-forest-900/5 hover:text-forest-900"
                activeProps={{ className: '!bg-forest-900 !text-white' }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={`tel:+91${site.phones[0]}`}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-forest-900/15 text-forest-900 transition hover:bg-forest-900 hover:text-white sm:size-11"
              aria-label="Call us"
            >
              <Phone className="size-4" />
            </a>
            <Link
              to="/contact"
              className="shrink-0 rounded-full bg-coral-500 px-3 py-2 text-xs font-bold text-white shadow-[3px_3px_0_0] shadow-forest-950 transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0] sm:px-5 sm:py-2.5 sm:text-sm"
            >
              Free Enquiry
            </Link>
            <button
              className="grid size-10 shrink-0 place-items-center rounded-full bg-forest-900 text-white lg:hidden sm:size-11"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="grid gap-1 border-t border-forest-900/10 px-6 py-4 lg:hidden">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 font-display text-lg font-semibold text-forest-900 hover:bg-forest-900/5"
              >
                {l.label}
              </Link>
            ))}
            <Link to="/contact" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-display text-lg font-semibold text-coral-600">
              Contact us
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
