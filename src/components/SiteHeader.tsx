import { Link } from "@tanstack/react-router";
import {
  MapPin,
  Menu,
  Phone,
  X,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { navLinks, site } from "@/data/site";
import type { SiteSettings } from "@/lib/content-types";
import { Logo } from "./Logo";

const headerLinks = [
  ...navLinks,
  { to: "/certificates", label: "Certificates" },
] as const;

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const [phoneMenuOpen, setPhoneMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState<boolean | null>(null);
  const [headerHeight, setHeaderHeight] = useState(76);
  const headerRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  const primaryPhone = settings.phones?.[0] || site.phones[0];
  const waDigits = (
    settings.phones?.[1] ||
    settings.phones?.[0] ||
    site.whatsapp
  ).replace(/\D/g, "");
  const waPhone = waDigits.length === 10 ? `91${waDigits}` : waDigits;

  // Live IST Office Hours Status with 60s boundary check
  useEffect(() => {
    const checkOpen = () => {
      try {
        const now = new Date();
        const istDay = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kolkata",
          weekday: "short",
        }).format(now);
        const istHour = Number(
          new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Kolkata",
            hour: "numeric",
            hour12: false,
          }).format(now),
        );
        const istMin = Number(
          new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Kolkata",
            minute: "numeric",
          }).format(now),
        );
        const minutes = istHour * 60 + istMin;
        const isSunday = istDay === "Sun";
        setIsOpenNow(!isSunday && minutes >= 570 && minutes < 1170);
      } catch {
        setIsOpenNow(null);
      }
    };
    checkOpen();
    const interval = window.setInterval(checkOpen, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  // Dynamic Height Observer
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const updateHeight = () => setHeaderHeight(header.offsetHeight + 16);
    updateHeight();
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateHeight);
    observer?.observe(header);
    window.addEventListener("resize", updateHeight);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [open, scrolled]);

  // Scroll Direction: Shrink on scroll, hide on fast scroll-down, reveal on scroll-up
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setScrolled(currentY > 40);
          if (currentY > 140 && currentY > lastScrollY.current + 8) {
            setHidden(true);
            setPhoneMenuOpen(false);
          } else if (currentY < lastScrollY.current - 6 || currentY <= 40) {
            setHidden(false);
          }
          lastScrollY.current = Math.max(0, currentY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on Escape or click-outside
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setPhoneMenuOpen(false);
      }
    };
    const onClickOutside = (event: MouseEvent) => {
      if (
        phoneRef.current &&
        !phoneRef.current.contains(event.target as Node)
      ) {
        setPhoneMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  return (
    <>
      {/* Spacer so floating fixed header never overlaps hero content */}
      <div
        style={{ height: `${headerHeight}px` }}
        aria-hidden="true"
        className="shrink-0"
      />

      <header
        id="site-main-header"
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-out px-3 pt-2.5 sm:px-6 sm:pt-3.5 ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div
          className={`mx-auto max-w-7xl rounded-full border transition-all duration-300 ${
            scrolled
              ? "border-forest-900/15 bg-white/92 shadow-xl shadow-forest-950/8 backdrop-blur-xl py-2 px-3.5 sm:px-5"
              : "border-forest-900/10 bg-cream/95 shadow-md shadow-forest-950/4 backdrop-blur-lg py-2.5 px-4 sm:px-6"
          }`}
        >
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: Brand Logo & Concierge Office Hours Status */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <Link to="/" onClick={() => setOpen(false)} className="shrink-0">
                <Logo />
              </Link>
              <div className="hidden 2xl:flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-white/80 px-2.5 py-1 text-xs font-semibold text-forest-900/80 shadow-xs">
                <span
                  className={`size-2 rounded-full ${isOpenNow === null ? "bg-forest-900/40" : isOpenNow ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}
                />
                <span>
                  {isOpenNow === null ? "Hours" : isOpenNow ? "Open Now" : "Closed"} · {settings.officeHours}
                </span>
              </div>
            </div>

            {/* Middle: Desktop Capsule Nav */}
            <nav
              className="hidden items-center gap-0.5 lg:flex xl:gap-1"
              aria-label="Main navigation"
            >
              {headerLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13px] font-medium text-forest-900/80 transition-all hover:bg-forest-900/5 hover:text-forest-900 active:scale-95 xl:px-3.5 xl:text-[14px]"
                  activeProps={{
                    className:
                      "!bg-forest-900 !text-white !font-semibold shadow-xs",
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Right: Phone Dropdown, Free Enquiry Pill & Mobile Hamburger */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Desktop Phone Dropdown */}
              <div ref={phoneRef} className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setPhoneMenuOpen((v) => !v)}
                  className="group flex items-center gap-1.5 rounded-full border border-forest-900/15 px-3 py-1.5 text-xs font-semibold text-forest-900 transition hover:border-coral-500 hover:bg-coral-50/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral-500"
                  aria-expanded={phoneMenuOpen}
                  aria-label="Call Sangaria office"
                >
                  <Phone className="size-3.5 text-coral-600 transition-transform group-hover:scale-110" />
                  <span className="font-mono text-xs font-semibold tracking-tight">
                    {primaryPhone}
                  </span>
                  <ChevronDown
                    className={`size-3 text-forest-900/50 transition-transform duration-200 ${phoneMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {phoneMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-forest-900/12 bg-white p-3 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 z-50">
                    <p className="px-2 pb-2 text-xs font-bold uppercase tracking-wider text-forest-900/60">
                      Direct Office Lines
                    </p>
                    <div className="space-y-1">
                      {settings.phones.map((p) => (
                        <a
                          key={p}
                          href={`tel:${(p.startsWith("+") ? p : "+91" + p).replace(/[^\d+]/g, "")}`}
                          className="flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium text-forest-900 transition hover:bg-forest-900/5 hover:text-coral-600"
                        >
                          <span className="font-mono">
                            {p.startsWith("+") ? p : "+91 " + p}
                          </span>
                          <span className="rounded-md bg-forest-900/5 px-2 py-0.5 text-xs font-bold text-forest-900/75">
                            Call
                          </span>
                        </a>
                      ))}
                      <a
                        href={`https://wa.me/${waPhone}?text=${encodeURIComponent("Hello British Education, I would like to enquire about study visas.")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-xl bg-emerald-50 px-2.5 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
                      >
                        <span className="flex items-center gap-1.5">
                          <MessageCircle className="size-3.5 text-emerald-600" />{" "}
                          WhatsApp Line
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                          Chat
                        </span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Free Enquiry Magnetic Shimmer CTA */}
              <Link
                to="/contact"
                className="cta-shimmer relative inline-flex min-h-11 items-center shrink-0 whitespace-nowrap rounded-full bg-coral-500 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-coral-600 hover:shadow-md active:scale-95"
              >
                Free Enquiry
              </Link>

              {/* Mobile Drawer Toggle */}
              <button
                type="button"
                className="grid size-11 shrink-0 place-items-center rounded-full bg-forest-900 text-white lg:hidden transition active:scale-95"
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle navigation menu"
                aria-expanded={open}
                aria-controls="mobile-site-nav"
              >
                {open ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Departure Board Menu */}
      {open && (
        <div
          id="mobile-site-nav"
          className="fixed inset-x-3 top-[76px] max-h-[calc(100dvh-160px)] z-50 overflow-y-auto overscroll-contain rounded-3xl border border-white/15 bg-forest-950/98 p-5 sm:p-6 text-white shadow-2xl backdrop-blur-2xl lg:hidden animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-forest-100/75">
              <span
                className={`size-2 rounded-full ${isOpenNow === null ? "bg-forest-900/40" : isOpenNow ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}
              />
              <span>
                {isOpenNow === null ? "Hours" : isOpenNow ? "Open Now · Sangaria" : "Closed"} ·{" "}
                {settings.officeHours}
              </span>
            </span>
            <span className="font-mono text-xs font-bold uppercase text-coral-400">
              BEI Terminal
            </span>
          </div>

          <nav className="mt-5 grid gap-1.5" aria-label="Mobile navigation">
            {headerLinks.map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3 font-display text-xl font-bold tracking-tight text-white transition hover:bg-white/10 active:scale-[0.98]"
              >
                <span>{l.label}</span>
                <span className="font-mono text-xs font-normal text-forest-100/40">
                  0{i + 1}
                </span>
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-between rounded-2xl bg-coral-500 px-4 py-3.5 font-display text-lg font-extrabold text-white shadow-lg transition active:scale-[0.98]"
            >
              <span>Book Free Consultation</span>
              <span>→</span>
            </Link>
          </nav>

          <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between text-xs text-forest-100/70">
            <span className="flex items-center gap-1">
              <MapPin className="size-3 text-coral-400" /> Sangaria, Rajasthan
            </span>
            <span className="font-mono text-xs text-forest-100/80">
              {settings.officeHours}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
