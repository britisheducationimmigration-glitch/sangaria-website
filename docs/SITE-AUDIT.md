# Website source audit

Date: 16 November 2026. Scope: current preview branch source, production build and HTTP smoke; not a measured Lighthouse or real-device audit.

| Area | Evidence/status | Follow-up |
| --- | --- | --- |
| Admin theme | Existing editors reused in TailAdmin-style sidebar/header; responsive utility classes | Device/browser visual review remains unverified because browser attachment failed |
| Technology | React 19, TanStack Start/Router, TypeScript, Vite, Tailwind 4, Nitro, MySQL | Retain current framework for this task; no rewrite needed for attendance |
| Type correctness | Existing country-preview null guard, cashflow source type, Close handler and root timer errors corrected | CI now checks clean Linux checkout as well as local code |
| Attendance reliability | Transactions, row locks, audit rollback, history/snapshots and isolated MySQL tests | Live workplace setup and physical sensor checks remain operational prerequisites |
| SEO | Per-page canonical/title/description/OpenGraph, dynamic sitemap, structured data, robots | HTTP checks validate representative markup; no search ranking/indexation claim |
| Private pages | Attendance noindex and referrer/cache rules; robots excludes employee links; analytics disabled in admin/attendance shell | Verify final hosting headers against the deployed environment |
| Accessibility | Focus-visible/reduced-motion CSS exists; attendance dialogs now have names, focus containment, Escape and focus restoration | Automated source/HTTP checks do not replace screen-reader/keyboard browser testing |
| Performance | Production build passes; hashed assets, route chunks, hero preload and font display=swap | Measure real LCP/CLS/INP; hero preload currently global and should be scoped if measurements show waste |
| Database lifecycle | Idempotent attendance migration, effective policy history, soft archive | Existing general database bootstrap early-return and TLS configuration were not changed under the admin-security exclusion |
| Hosting | Preview CI and Vercel statuses available; cleanup route scheduled in config | Confirm CRON_SECRET/scheduler activity in hosting account; do not infer production cron execution from preview success |
| Build hygiene | New ignore rules prevent new dependency/build artifacts from being added | Legacy tracked `.output` remains in repository; remove from tracking in a separately reviewed cleanup |
| Tests/docs | Calculation, server permission/location, MySQL and HTTP suites plus attendance operating notes | Expand browser regression coverage when an accessible browser runner is available |

Priorities after this delivery: (1) real-office phone/GPS/camera test and deployment configuration verification; (2) browser layout/keyboard audit at narrow and wide widths; (3) measured asset/font/hero optimization; (4) cleanup of legacy committed generated outputs; (5) review dated visa/cashflow content with official sources as a separate content-maintenance task. This source audit does not certify immigration information as current.
