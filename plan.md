# British Education and Immigration — implementation plan

## Scope

Use the supplied editable TanStack Start/React website as the visual and content baseline. Keep the current public routes and brand direction, then add a persistent enquiry workflow, a reliable enquiry popup, owner-only admin access, editable News/Updates and Success Stories, feature toggles, and a lightweight SEO/performance pass.

## Architecture

- **Frontend:** React 19, TanStack Router/Start, Tailwind CSS v4, current source components and fixtures as the migration baseline.
- **Server:** TanStack Start server handlers/API routes for enquiry creation, admin session checks, content CRUD, settings, and health checks.
- **Database:** Managed MySQL-compatible database. Add additive migrations for `admin_users`/roles, `enquiries`, `content_posts`, `success_stories`, and `site_settings`; seed current fixtures once without overwriting later edits.
- **Authentication:** Manus OAuth for the owner/staff login, with a server-side allowlist/role check before any admin data or mutation route. Never expose enquiries in public HTML.
- **Public content:** Read published posts/stories from the database with fixture fallback while migration/seed is being completed. Keep existing static country/visa/eligibility content stable for this milestone.
- **Assets:** Keep the supplied optimized image assets. Leave the logo slot configurable so the supplied PNG can replace the temporary mark later.

## User-facing behavior

1. Enquiry forms on contact, home, country, coaching, blog, and eligibility contexts validate on the client and server, persist full details plus source and eligibility summary, and show clear success/error states.
2. A dismissible enquiry modal opens once per browser session after a short delay, is accessible, does not cover the mobile viewport excessively, and can be disabled or retimed from Site Settings.
3. `/admin` provides dashboard counters, enquiry search/filter/status/notes/delete/export, and CRUD editors for News/Updates and Success Stories. Publish/unpublish changes are reflected on public routes without code edits.
4. Feature flags in Site Settings can enable/disable the enquiry popup, WhatsApp button, approvals marquee, and selected public sections without deleting data.
5. The admin area is responsive and is never indexed; public pages keep meaningful route content, metadata, canonical handling when a real domain is configured, sitemap, robots, and no private data in HTML.

## Performance and SEO decisions

- Preserve route-level meaningful content and metadata.
- Lazy-load below-the-fold images, provide dimensions/alt text, and avoid shipping admin code to public pages.
- Avoid large new dependencies; reuse existing icons and utilities.
- Add route manifest, robots/sitemap support, social metadata, 404 behavior, and noindex for admin.
- Use compact mobile type scales and prevent horizontal overflow.

## Delivery workflow

Copy source into the managed project, install with the pinned pnpm toolchain, add the schema/migrations and server handlers, migrate existing components to live data, implement admin and popup, run typecheck/build, start Preview, inspect representative desktop/mobile routes, fix confirmed issues, then checkpoint. Keep nameservers and email DNS outside application code; deployment DNS will be documented separately after the app is stable.
