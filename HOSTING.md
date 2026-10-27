# Free hosting guide

This site is not a purely static brochure site. The enquiry form writes to a database and `/admin` needs a server-side session, so uploading only `dist/client` to GitHub Pages will not preserve leads or make the admin panel work.

## Option A — keep the current managed stack

The least risky path is to keep the project on the current managed Webdev runtime with its server and managed database enabled. The application already uses those capabilities for enquiries, admin access, content editing, and the Excel export. Before the first production publish, configure the admin allowlist secret `ADMIN_EMAILS` with the owner/staff email addresses through the protected project settings surface. Do not place those values in Git or `.env` files.

## Option B — external $0 stack

For a genuinely external free deployment, use **Cloudflare Pages + Pages Functions + D1**. Cloudflare Pages can host the frontend, Pages Functions can expose the enquiry/admin API, and D1 can store leads. The current Cloudflare Free quotas are 100,000 Worker requests per day, 5 million D1 rows read per day, 100,000 rows written per day, and 5 GB total D1 storage. Static asset requests are free and unlimited. See the official [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/), and [Pages Functions pricing](https://developers.cloudflare.com/pages/functions/pricing/) pages.

This option needs a migration rather than a drag-and-drop upload:

1. Replace the current `mysql2` data layer with a D1/Workers data layer.
2. Replace Manus OAuth with an external admin authentication provider, such as Supabase Auth, or another provider chosen by the owner.
3. Move the schema and existing lead data into the new database.
4. Add the Cloudflare Pages project variables and deploy from GitHub.
5. Use the free `pages.dev` URL first; a custom domain normally costs money even when hosting is free.

Supabase is another practical free database/auth option. Its current Free plan includes 500 MB database storage, 50,000 monthly active users, 1 GB file storage, and 5 GB egress, but inactive free projects can be paused. See [Supabase pricing](https://supabase.com/pricing) and [Supabase Auth](https://supabase.com/docs/guides/auth).

## What not to use for this business site

Vercel Hobby is free, but its official terms restrict the plan to personal, non-commercial use. For a consultancy website, Cloudflare or the current managed stack is a safer choice. See the [Vercel Hobby plan](https://vercel.com/docs/plans/hobby).

## Recommended order

Start with the current managed stack so enquiries are not lost. Use the improved admin pipeline and Excel export there, confirm the owner login and database backup process, and only then plan the Cloudflare/Supabase migration if an external free host is still required.
