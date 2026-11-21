import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { Facebook, Instagram } from "./BrandIcons";
import { CountryFlag } from "./CountryFlag";
import type { Country } from "@/data/fixtures";
import { googleReviewUrl } from "@/data/google-review";
import { navLinks, site } from "@/data/site";
import type { SiteSettings } from "@/lib/content-types";
import { Logo } from "./Logo";

export function SiteFooter({
  settings,
  countries,
}: {
  settings: SiteSettings;
  countries: Country[];
}) {
  return (
    <footer className="relative overflow-hidden bg-forest-950 bg-grain text-forest-100">
      <div className="mx-auto max-w-7xl px-5 pt-14 pb-24 sm:pb-12 md:px-6 md:pt-20 md:pb-14">
        {/* Grand Departure Sign-off */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 border-b border-white/10 pb-12 lg:mb-16 lg:flex-row lg:items-end lg:pb-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-coral-400">
              <span className="size-1.5 rounded-full bg-coral-400 animate-ping" />
              Sangaria Terminal · Final Call
            </div>
            <h2 className="mt-3 text-3xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Your visa story <span className="text-foil">starts here.</span>
            </h2>
          </div>
          <Link
            to="/contact"
            className="cta-shimmer group relative inline-flex shrink-0 items-center gap-3 overflow-hidden rounded-full border border-coral-400/40 bg-coral-500 px-7 py-3.5 font-display text-sm font-bold text-white shadow-xl shadow-coral-500/20 transition-all duration-300 hover:bg-coral-600 hover:shadow-2xl active:scale-95 sm:px-8 sm:py-4"
          >
            <span>Book free counselling</span>
            <span className="grid size-6 place-items-center rounded-full bg-white/20 text-xs font-bold transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* 4-Column Aviation Layout with Hairline Grid */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-[1.4fr_1fr_1fr_1.3fr] md:gap-12">
          {/* Col 1: Brand story & Socials */}
          <div className="col-span-2 md:col-span-1">
            <Logo light />
            <p className="mt-5 max-w-xs text-xs leading-relaxed text-forest-100/70 sm:text-sm">
              {site.tagline}
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-coral-400 hover:bg-coral-500 hover:text-white"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-coral-400 hover:bg-coral-500 hover:text-white"
              >
                <Facebook className="size-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h3 className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-coral-400 md:mb-4">
              Explore
            </h3>
            <ul className="space-y-2 text-xs md:text-sm">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="inline-block py-0.5 text-forest-100/80 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/certificates"
                  className="inline-block py-0.5 text-forest-100/80 transition-colors hover:text-white"
                >
                  Certificates &amp; awards
                </Link>
              </li>
              <li>
                <a
                  href={googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Write a Google review"
                  className="inline-flex items-center gap-1 py-0.5 text-forest-100/80 transition-colors hover:text-white"
                >
                  <span>Google reviews</span>
                  <ArrowUpRight className="size-3 text-coral-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Destination Guides */}
          <div>
            <h3 className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-coral-400 md:mb-4">
              Destinations
            </h3>
            <ul className="space-y-2 text-xs md:text-sm">
              {countries.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/countries/$slug"
                    params={{ slug: c.slug }}
                    className="flex min-h-7 items-center py-0.5 text-forest-100/80 transition-colors hover:text-white"
                  >
                    <CountryFlag
                      flag={c.flag}
                      code={c.code}
                      country={c.name}
                      className="mr-2.5 h-3.5 w-5 shrink-0 rounded-xs"
                    />
                    <span>{c.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Sangaria Office Coordinates */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-coral-400 md:mb-4">
              Sangaria Office
            </h3>
            <a
              href={site.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-2.5 text-xs leading-relaxed text-forest-100/80 transition-colors hover:text-white md:text-sm"
            >
              <MapPin className="mt-0.5 size-4 shrink-0 text-coral-400" />
              <span>{site.address}</span>
            </a>
            <div className="mt-3 space-y-1.5">
              {settings.phones.map((p) => (
                <a
                  key={p}
                  href={`tel:${(p.startsWith("+") ? p : "+91" + p).replace(/[^\d+]/g, "")}`}
                  className="flex items-center gap-2.5 text-xs font-mono text-forest-100/80 transition-colors hover:text-white md:text-sm"
                >
                  <Phone className="size-3.5 text-coral-400" />{" "}
                  {p.startsWith("+") ? p : "+91 " + p}
                </a>
              ))}
            </div>
            <div className="mt-3 space-y-1.5">
              {settings.emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="flex items-start gap-2.5 break-all text-xs text-forest-100/80 transition-colors hover:text-white md:text-sm"
                >
                  <Mail className="mt-0.5 size-3.5 shrink-0 text-coral-400" />{" "}
                  {email}
                </a>
              ))}
            </div>
            <p className="mt-3 font-mono text-xs text-forest-100/70">
              Hours: {settings.officeHours}
            </p>
          </div>
        </div>

        {/* Flight Path Motif & Bottom Sign-off */}
        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs leading-relaxed text-forest-100/60 md:mt-16">
          <p>
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
            {site.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-2 font-mono text-xs text-forest-100/70">
            <span>SNG</span>
            <span className="w-12 border-t border-dashed border-coral-400/50" />
            <span className="text-amber-200">✈</span>
            <span className="w-12 border-t border-dashed border-coral-400/50" />
            <span>GLOBAL</span>
          </div>
          <p className="text-center sm:text-right">
            Visa decisions depend solely on embassy &amp; immigration laws.
          </p>
        </div>
      </div>
    </footer>
  );
}
