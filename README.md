# British Education and Immigration — Website

Public website for **British Education and Immigration**, Sangaria (Hanumangarh, Rajasthan): study visas, PR, work, spouse and tourist visas for Canada, UK, Australia, USA, New Zealand, Germany and Europe/Schengen, plus IELTS & PTE coaching.

## Pages
- `/` Home · `/countries` and `/countries/:slug` · `/visas` · `/eligibility` (preliminary profile checklist) · `/coaching` (IELTS & PTE) · `/success-stories` (visa approvals + testimonials) · `/updates` and `/updates/:slug` (news & blog) · `/contact`

## Tech
- TanStack Start (React 19, file-based routing) + Tailwind CSS v4, deployed on a server-capable runtime
- Managed server/database enquiry workflow with an owner-only admin inbox; Netlify form attributes remain as a fallback for compatible static deployments
- Netlify Image CDN for optimised images (`/.netlify/images`)

## Run locally
```bash
pnpm install
netlify dev   # or: pnpm dev
```

## Editing content (for now)
- Business details: `src/data/site.ts`
- Countries, visa services, blog posts, testimonials, approvals, coaching batches, FAQs: `src/data/fixtures.ts`
- Profile checklist rules (site-defined factors and thresholds; not government visa criteria): `src/data/eligibility-rules.ts`
- Country visa details and official sources: `src/data/visa-guidance.ts`; follow the monthly review checklist in [`VISA-GUIDANCE-MAINTENANCE.md`](./VISA-GUIDANCE-MAINTENANCE.md).

## Admin lead workflow
- `/admin` supports search, stage filters, date filters, assignee, next follow-up time, counsellor notes, WhatsApp action, and role-based access.
- Lead stages: New → Contacted → Follow-up → Documents Pending → Applied → Converted / Closed.
- `Download Excel` exports a real `.xlsx` workbook with Leads, Summary, and Follow-ups sheets. The export respects the active search, status, and date filters.
- Configure the owner/staff allowlist through the protected `ADMIN_EMAILS` project secret before login.

## Hosting
See [HOSTING.md](./HOSTING.md) for the safest managed deployment and the external free Cloudflare Pages + D1 migration path. Because enquiries and `/admin` require a server and database, this is not a GitHub Pages-only site.

## Roadmap
The admin panel, enquiry management, Excel export, content editors, and site settings are implemented. Remaining production setup is the owner allowlist, a database backup routine, and the final hosting choice.
