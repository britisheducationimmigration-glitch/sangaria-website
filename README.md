# British Education & Immigration

The public website and lead-management application for **British Education & Immigration**, based in Sangaria, Hanumangarh, Rajasthan. It provides study destination guidance, visa-service information, IELTS/PTE coaching details, and enquiry workflows backed by a MySQL database.

## Public website

| Route | What visitors can do |
| --- | --- |
| `/` | Explore services and destinations, use the visa finder and family cashflow planner, view featured certificates, approvals, testimonials, updates and FAQs, and send an enquiry. |
| `/countries` | Browse study destinations and build a side-by-side comparison of up to three destinations. |
| `/countries/:slug` | Read a destination guide with study costs, intake and English guidance, visa-fee information, official links and review notes where available. |
| `/visas` | Browse study, visitor, work, spouse and permanent-residence service information. |
| `/eligibility` | Complete a preliminary profile checklist and request counselling. Results are general guidance based on site-defined factors; they are not government criteria, an immigration decision or a promise of approval. |
| `/coaching` | Explore IELTS and PTE preparation, published batch times, the score converter and free-demo booking. |
| `/certificates` | Browse and filter published partner authorisations, training certificates and recognitions; open an image at full size. |
| `/success-stories` | Read published approval updates and client testimonials. |
| `/updates` and `/updates/:slug` | Browse published articles and read their source links where supplied. |
| `/contact` | Find contact details and send an enquiry. |
| `/sitemap.xml` | View the XML sitemap, including destination routes and published article URLs. |

### Enquiry experience

The shared enquiry form validates and submits visitor details to the server-backed lead workflow. After a successful submission, visitors see a confirmation and can choose to share the pre-filled enquiry through WhatsApp or finish without sharing.

## Admin workspace

The private dashboard is available at `/admin`. Sign-in is restricted to authorised accounts, with role-based access enforced by server functions.

- **Lead management:** Search and filter enquiries by stage and date; assign a lead, schedule a follow-up, update its pipeline stage, and review its activity timeline.
- **Lead history:** Team members can add timestamped comments. Super admins can edit or remove comments, keeping each lead's follow-up history together.
- **Demo requests:** Review IELTS/PTE demo enquiries and follow-up status.
- **Review queue and reports:** Surface new leads and unpublished articles; view lead totals by pipeline stage and source.
- **Excel export:** Download filtered leads as an XLSX workbook with lead, summary and follow-up sheets.
- **Content management:** Create and edit updates, success stories, testimonials and visa approval records.
- **Visa approval media:** Add an optional compressed student photo or a hosted YouTube/Vimeo video. Publishing media requires confirming student consent; hosted videos autoplay muted when visible and lazy-load near the viewport; visitors can pause or unmute them.
- **Certificates:** Upload certificate images, edit their details, publish or hide them, and choose which ones appear in the homepage carousel. Pale scans receive a mild display-only contrast and colour boost.
- **Coaching batches:** Manage the public IELTS/PTE batch schedule.
- **Cashflow planner:** Edit destination budget estimates and payment stages used by the public planner.
- **Visa policy watch:** Super Admins can review confirmed effective dates and pending official announcements with direct source links. Exact scheduled values (currently the UK Student maintenance increase) switch across public country guidance and cashflow when their effective date arrives; proposals do not overwrite current rules.
- **Website settings:** Manage public phone numbers, email addresses, office hours, homepage FAQs and trust figures, plus the enquiry-popup, WhatsApp-button and approvals-strip controls.
- **User management:** Create staff accounts, set their initial password, change roles, reset passwords and remove access.

The application defines three admin roles: **Super Admin**, **Content Editor** and **Enquiry Manager**. Available dashboard sections depend on the signed-in user's role.

## Data and editing

The site is **partly database-managed**. Public defaults and frequently updated operational content have different sources of truth:

| Information | Source and update path |
| --- | --- |
| Enquiries and timestamped lead activity | MySQL tables managed through the admin lead workflow. |
| Updates, success stories, testimonials and approvals | MySQL-backed admin editors; fixture records can seed an empty database. |
| Coaching batches, certificates and visa approval media | MySQL-backed admin editors. Compressed certificate and approval photos are stored with their records; video playback uses a validated external YouTube/Vimeo link rather than a video blob in MySQL. |
| Public site settings and cashflow budgets | MySQL-backed settings, editable from the admin dashboard. |
| Country profiles, destination summaries and service copy | Source files, primarily `src/data/fixtures.ts`. These are not general-purpose admin editors. |
| Visa fees, requirements, official source links and `lastVerified` dates | `src/data/visa-guidance.ts`; update in code after checking the official government source. |
| Confirmed rule changes and announced policy watch items | `src/data/policy-watch.ts`; only exact official values with a published effective date are applied automatically. Other announcements stay marked as monitoring or pending detail. |
| Preliminary eligibility factors and scoring rules | `src/data/eligibility-rules.ts`; update in code and keep the user-facing disclaimer intact. |
| Business identity, branding and defaults | `src/data/site.ts` and other source defaults. |

Some database tables are populated from fixtures when first initialised; after that, admin-managed records are authoritative. Changing country guidance or eligibility rules therefore requires a reviewed code change, even though many other parts of the site can be edited in the dashboard. Scheduled official policy overlays are applied when public database-backed cashflow is read, so existing saved cashflow does not block a verified effective-date update.

Use the [visa guidance maintenance checklist](./VISA-GUIDANCE-MAINTENANCE.md) for the monthly official-source review process, source/date recording and preview checks.

## Technology

- React 19, TanStack Start and TanStack Router
- TypeScript, Vite and Tailwind CSS v4
- Nitro server runtime for server-rendered routes and server functions
- MySQL via mysql2 for enquiries, admin accounts and editable content
- jose for signed admin session tokens

## Repository layout

| Path | Purpose |
| --- | --- |
| `src/routes/` | Public pages, admin route and server endpoints. |
| `src/components/` | Shared site, form, planner, carousel and admin UI components. |
| `src/components/admin/` | Admin content panels, including certificates. |
| `src/lib/` | Database access, authentication, server functions, SEO helpers and shared types. |
| `src/data/` | Destination guidance, visa sources, eligibility rules and fixture/default content. |
| `public/` | Public images, certificate defaults, site icons and static assets. |
| `VISA-GUIDANCE-MAINTENANCE.md` | Review checklist for country visa guidance. |

## Local development

### Requirements

- Node.js 22.13+ (22.x), 24.x or 26+
- pnpm 9.15.4

### Start the app

~~~bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
~~~

The development server listens on port 3000. For database-backed enquiries, admin login and editable content, configure a reachable MySQL database and the environment variables below before using those features.

### Environment variables

Create a local environment file such as .env.local and keep it out of version control. Set the corresponding values in both preview and production hosting environments.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | MySQL connection URL. Required for persistent enquiries, admin access and database-managed content. |
| `DATABASE_SSL` | Optional. TLS is enabled by default; set to false only when the database provider requires a non-TLS connection. |
| `SESSION_SECRET` | Long, unique secret used to sign admin sessions. |
| `ADMIN_EMAIL` | Initial owner account email used when the database creates its first admin record. |
| `ADMIN_PASSWORD` | Initial owner account password. Set a strong value before the database is first initialised. |
| `ADMIN_EMAILS` | Optional comma-separated allowlist for super-admin email addresses. |
| `RESEND_API_KEY` | Resend API key used to send admin password-reset OTP emails. |
| `ADMIN_RECOVERY_KEY` | Secret used by the admin recovery-key reset option. |

Do not place live passwords, API keys or database credentials in this README, source control, or client-side code.

### Useful commands

~~~bash
pnpm dev
pnpm typecheck
pnpm build
pnpm start
~~~

Run `pnpm start` after a successful production build.

## Deployment

Page responses revalidate on visits, while fingerprinted build assets remain safely cached; uploaded certificate and approval photos use versioned URLs. The repository includes a Vercel rewrite configuration and is built as a server-capable application. Deploy it to a Node.js hosting platform that can reach the configured MySQL database; a static-only host such as GitHub Pages cannot run the admin and enquiry server functions.

The application initialises its database schema from `src/lib/db.server.ts`. The database user must be allowed to create tables and apply the small schema updates used by the app. Configure environment variables separately for preview and production, and use an isolated or non-production database for preview deployments.

Recommended release flow:

1. Create a feature branch and deploy a preview.
2. Check the affected public pages on desktop and mobile, then verify the relevant admin/database flow.
3. Merge to `main` only after the preview is accepted.
4. Keep a database backup and tested restore process with the database provider.

## Visa-guidance and eligibility notes

Visa fees and requirements can depend on visa stream, applicant location, nationality, family members, exemptions and additional charges. Treat published amounts as guidance, verify them against official government sources, and retain the source links and review date.

The eligibility checklist uses site-defined profile factors. It must always be presented as preliminary guidance and must not be described as a government eligibility decision or a guarantee of visa approval.
