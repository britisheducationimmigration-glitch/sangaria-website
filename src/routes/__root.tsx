import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { EnquiryPopup } from "@/components/EnquiryPopup";
import {
  getPublicCountryCatalogue,
  getPublicSettings,
} from "@/lib/public-functions";
import {
  countries as fixtureCountries,
  getCurrentCountry,
} from "@/data/fixtures";
import { site } from "@/data/site";
import { defaultSiteSettings } from "@/lib/site-settings";
import appCss from "../styles.css?url";

function businessTime(
  hour: string,
  minute: string | undefined,
  meridiem: string,
) {
  const value =
    (Number(hour) % 12) + (meridiem.toUpperCase() === "PM" ? 12 : 0);
  return String(value).padStart(2, "0") + ":" + (minute || "00");
}

const defaultOpeningHours = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  opens: "09:30",
  closes: "19:30",
};

function schemaOpeningHours(label: string) {
  const match = label.match(
    /(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\s*[–-]\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i,
  );
  if (!match) return defaultOpeningHours;
  return {
    ...defaultOpeningHours,
    opens: businessTime(match[1], match[2], match[3]),
    closes: businessTime(match[4], match[5], match[6]),
  };
}

function buildSchemaGraph(settings?: {
  phones?: string[];
  emails?: string[];
  officeHours?: string;
}) {
  const phones = (settings?.phones ?? defaultSiteSettings.phones).map((p) =>
    p.startsWith("+") ? p : "+91" + p,
  );
  const email =
    (settings?.emails ?? defaultSiteSettings.emails)[0] ??
    "admissions@britisheducationandimmigration.com";
  const hours = schemaOpeningHours(
    settings?.officeHours ?? defaultSiteSettings.officeHours,
  );

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["EducationalOrganization", "LocalBusiness"],
        "@id": "https://www.britisheducationandimmigration.com/#organization",
        name: "British Education and Immigration",
        alternateName: "British Education Sangaria",
        description:
          "Premier Study Visa Consultant & IELTS / PTE Coaching Institute in Sangaria, Hanumangarh, Rajasthan. Expert visa guidance for Canada, UK, Australia, USA, NZ & Europe.",
        url: "https://www.britisheducationandimmigration.com",
        logo: "https://www.britisheducationandimmigration.com/img/logo.png",
        image: "https://www.britisheducationandimmigration.com/img/hero.webp",
        telephone: phones,
        email: email,
        hasMap: site.mapUrl,
        sameAs: [site.instagram, site.facebook],
        priceRange: "₹₹",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Near Open Book Library, Bhagatpura Road",
          addressLocality: "Sangaria",
          addressRegion: "Rajasthan",
          postalCode: "335063",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 29.798547,
          longitude: 74.464214,
        },
        areaServed: [
          { "@type": "City", name: "Sangaria" },
          { "@type": "City", name: "Hanumangarh" },
          { "@type": "City", name: "Sri Ganganagar" },
          { "@type": "City", name: "Mandi Dabwali" },
          { "@type": "State", name: "Rajasthan" },
          { "@type": "State", name: "Punjab" },
        ],
        openingHoursSpecification: hours,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "48",
          bestRating: "5",
          worstRating: "1",
        },
      },
      {
        "@type": "Service",
        "@id": "https://www.britisheducationandimmigration.com/#service-visa",
        name: "Study Visa Consulting Services",
        serviceType: "Immigration & Study Visa Consulting",
        provider: {
          "@id": "https://www.britisheducationandimmigration.com/#organization",
        },
        areaServed: {
          "@type": "Country",
          name: "India",
        },
        description:
          "Comprehensive student visa guidance, university selection, PAL application, CAS assistance, and visa filing for Canada, UK, Australia, USA, NZ and Europe.",
      },
      {
        "@type": "Course",
        "@id": "https://www.britisheducationandimmigration.com/#course-ielts",
        name: "IELTS Coaching (Academic & General)",
        description:
          "Intensive IELTS preparation classes targeting Band 7.5+ with daily 1-on-1 speaking practice, certified trainers, and weekly mock examinations in Sangaria.",
        provider: {
          "@id": "https://www.britisheducationandimmigration.com/#organization",
        },
      },
      {
        "@type": "Course",
        "@id": "https://www.britisheducationandimmigration.com/#course-pte",
        name: "PTE Academic Coaching",
        description:
          "Computer-based PTE Academic training with automated AI scoring feedback, individual lab terminals, and score booster mock tests targeting 65+ to 79+.",
        provider: {
          "@id": "https://www.britisheducationandimmigration.com/#organization",
        },
      },
    ],
  };
}

export const Route = createRootRoute({
  staleTime: 300_000,
  loader: async () => {
    try {
      const [settings, countryPages] = await Promise.all([
        getPublicSettings(),
        getPublicCountryCatalogue(),
      ]);
      return {
        settings,
        countries: countryPages.map((entry) => entry.country),
      };
    } catch {
      return {
        settings: defaultSiteSettings,
        countries: fixtureCountries.map(getCurrentCountry),
      };
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "keywords",
        content:
          "study visa Sangaria, IELTS coaching Sangaria, PTE coaching Sangaria, immigration consultant Sangaria, Canada visa Hanumangarh, study abroad Rajasthan",
      },
      { name: "theme-color", content: "#123752" },

      // Local Geo Tags for Google Maps & Local Search Ranking
      { name: "geo.region", content: "IN-RJ" },
      { name: "geo.placename", content: "Sangaria" },
      { name: "geo.position", content: "29.798547;74.464214" },
      { name: "ICBM", content: "29.798547, 74.464214" },

      // OpenGraph for WhatsApp & Social Media Rich Previews
      {
        property: "og:site_name",
        content: "British Education and Immigration",
      },
      {
        property: "og:image",
        content: "https://www.britisheducationandimmigration.com/img/hero.webp",
      },
      {
        property: "og:image:alt",
        content:
          "British Education and Immigration — Study Visas & IELTS/PTE Coaching in Sangaria",
      },
      { property: "og:locale", content: "en_IN" },

      // Twitter Card Preview
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:image",
        content: "https://www.britisheducationandimmigration.com/img/hero.webp",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      { rel: "icon", href: "/img/logo.png" },
      { rel: "apple-touch-icon", href: "/img/logo.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Figtree:wght@400;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildSchemaGraph(loaderData?.settings)),
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
  errorComponent: RootErrorComponent,
});

function RootDocument({ children }: { children: ReactNode }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isAdmin = pathname.startsWith("/admin");
  const isPortal = isAdmin || pathname.startsWith("/attendance");
  const { settings, countries } = Route.useLoaderData();

  // Non-blocking GTM after initial paint with portal boundary cleanup
  useEffect(() => {
    if (isPortal || typeof window === "undefined") return;
    let idleId: number | null = null;
    let timerId: ReturnType<typeof setTimeout> | null = null;
    const loadGTM = () => {
      if (window.location.pathname.startsWith("/admin") || window.location.pathname.startsWith("/attendance")) return;
      if ((window as any).__gtmLoaded) return;
      (window as any).__gtmLoaded = true;
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtm.js?id=GTM-N6H564DV";
      document.head.appendChild(script);
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
      });
    };
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(loadGTM, { timeout: 2000 });
    } else {
      timerId = setTimeout(loadGTM, 1500);
    }
    return () => {
      if (idleId !== null && "cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      if (timerId !== null) clearTimeout(timerId);
    };
  }, [isPortal]);

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {!isPortal && <SiteHeader settings={settings} />}
        <main
          className={
            isAdmin
              ? "admin-main"
              : isPortal
                ? "attendance-main"
                : "public-main"
          }
        >
          {children}
        </main>
        {!isPortal && <SiteFooter settings={settings} countries={countries} />}
        {!isPortal && <WhatsAppButton />}
        {!isPortal && <EnquiryPopup />}
        {!isPortal && <Analytics />}
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <section className="mx-auto grid max-w-3xl place-items-center px-6 py-32 text-center">
      <p className="font-mono text-sm text-coral-600">
        ERROR 404 · PAGE NOT FOUND
      </p>
      <h1 className="mt-4 text-5xl font-extrabold text-forest-900">
        This page missed its flight.
      </h1>
      <Link
        to="/"
        className="mt-8 rounded-full bg-forest-900 px-6 py-3 font-bold text-white"
      >
        Back to home
      </Link>
    </section>
  );
}

function RootErrorComponent() {
  const rawDigits = site.whatsapp.replace(/\D/g, "");
  const waPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;

  return (
    <section className="mx-auto grid max-w-3xl place-items-center px-6 py-24 text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-coral-50 px-4 py-1.5 font-mono text-xs font-bold text-coral-600">
        TEMPORARY NOTICE
      </span>
      <h1 className="mt-4 text-3xl font-extrabold text-forest-900 sm:text-4xl">
        British Education &amp; Immigration
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-forest-900/70">
        We are updating our live information. Please refresh in a moment, or
        connect with our Sangaria team directly.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <a
          href={`https://wa.me/${waPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#25D366] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:brightness-105 active:scale-95"
        >
          WhatsApp Us
        </a>
        {site.phones[0] && (
          <a
            href={`tel:${site.phones[0].replace(/\s+/g, "")}`}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-forest-900/15 bg-white px-6 py-2.5 text-xs font-bold text-forest-900 shadow-sm transition hover:bg-forest-50 active:scale-95"
          >
            Call: {site.phones[0]}
          </a>
        )}
        <Link
          to="/"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest-900 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-forest-800 active:scale-95"
        >
          Reload Homepage
        </Link>
      </div>
    </section>
  );
}
