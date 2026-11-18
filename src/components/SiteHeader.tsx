import { Link } from '@tanstack/react-router'
import { MapPin, Menu, Phone, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { navLinks, site } from '@/data/site'
import type { SiteSettings } from '@/lib/content-types'
import { Logo } from './Logo'

const headerLinks = [...navLinks, { to: '/certificates', label: 'Certificates' }] as const

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const [headerHeight, setHeaderHeight] = useState(69)
  const primaryPhone = settings.phones?.[0] || site.phones[0]

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const updateHeight = () => setHeaderHeight(header.offsetHeight)
    updateHeight()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateHeight)
    observer?.observe(header)
    window.addEventListener('resize', updateHeight)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', updateHeight)
    }
  }, [open, settings.officeHours, settings.phones])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <>
      {/* Spacer so fixed header never overlaps top of page */}
      <div style={{ height: `${headerHeight}px` }} aria-hidden="true" />

      <header id="site-main-header" ref={headerRef} className="fixed top-0 left-0 right-0 z-50">
        <div className="hidden bg-forest-950 text-[13px] text-forest-100 md:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
            <span className="inline-flex items-center gap-1.5">
              <MapPin aria-hidden="true" className="size-3.5 text-coral-400" />
              <span>Sangaria, Hanumangarh · {settings.officeHours}</span>
            </span>
            <span className="flex gap-5">
              {settings.phones.map((p) => (
                <a key={p} href={`tel:${(p.startsWith('+') ? p : '+91' + p).replace(/[^\d+]/g, '')}`} className="hover:text-coral-400">
                  {p.startsWith('+') ? p : '+91 ' + p}
                </a>
              ))}
            </span>
          </div>
        </div>
        <div className="border-b border-forest-900/10 bg-cream/95 backdrop-blur-xl shadow-xs">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3.5 sm:gap-4 sm:px-6">
            <Link to="/" onClick={() => setOpen(false)} className="shrink-0">
              <Logo />
            </Link>
            <nav className="hidden items-center gap-0.5 lg:flex xl:gap-1" aria-label="Main navigation">
              {headerLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="whitespace-nowrap rounded-full px-2.5 py-2 text-[13px] font-medium text-forest-900/80 transition hover:bg-forest-900/5 hover:text-forest-900 xl:px-3.5 xl:text-[14.5px]"
                  activeProps={{ className: '!bg-forest-900 !text-white' }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <a
                href={`tel:${(primaryPhone.startsWith('+') ? primaryPhone : '+91' + primaryPhone).replace(/[^\d+]/g, '')}`}
                className="group grid size-10 shrink-0 place-items-center rounded-full border border-forest-900/15 text-forest-900 transition-colors hover:border-coral-500 hover:bg-coral-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500 active:bg-coral-600 sm:size-11"
                aria-label="Call us"
              >
                <Phone className="size-4 text-forest-900 transition-colors group-hover:text-white group-focus-visible:text-white group-active:text-white" />
              </a>
              <Link
                to="/contact"
                className="shrink-0 whitespace-nowrap rounded-full bg-coral-500 px-3 py-2 text-xs font-bold text-white shadow-[3px_3px_0_0] shadow-forest-950 transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0] sm:px-5 sm:py-2.5 sm:text-sm"
              >
                Free Enquiry
              </Link>
              <button
                type="button"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-forest-900 text-white lg:hidden sm:size-11"
                onClick={() => setOpen((v) => !v)}
                aria-label="Menu"
                aria-expanded={open}
                aria-controls="mobile-site-nav"
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
          {open && (
            <nav id="mobile-site-nav" className="grid gap-1 border-t border-forest-900/10 bg-cream px-6 py-4 shadow-xl lg:hidden">
              {headerLinks.map((l) => (
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
    </>
  )
}