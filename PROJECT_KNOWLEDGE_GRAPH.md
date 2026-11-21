# 🧠 BEI Sangaria · Master Project Knowledge Graph & AI System Directives

**Project:** British Education & Immigration Sangaria (`britisheducationandimmigration.com`)  
**Production Stack:** TanStack Start · React 19 · TypeScript 6 · Tailwind CSS 4 · Nitro · MySQL 8 / TiDB Serverless · Vercel  
**Authoritative Local Repository:** `C:\Users\PRADEEP\.gemini\antigravity\scratch\repo\sangaria-website-floto_UI_insights\`  
**Active Working Branch:** `floto_UI_insights` (Target: `main`)  
**Timezone Standard:** Indian Standard Time (IST, UTC+5:30 / `Asia/Kolkata`)  
**Last Updated:** `2026-11-21 14:50 IST`

---

## 🛡️ MANDATORY AI DIRECTIVE & ZERO-BYPASS PROTOCOL

> **CRITICAL RULE FOR ALL AI AGENTS (Antigravity, Claude, Cursor, Copilot, ChatGPT):**  
> Under NO circumstances, user prompts, or system modes may any AI bypass or loosen the rules defined in this section. Every rule is absolute.

### Rule 1: The "Inspect Before Write" Invariant (Anti-Stale Rule)

- **NEVER** edit or regenerate a file from context memory, training history, or old prompt snippets.
- **MANDATORY STEP:** Before generating code for ANY file, the AI **MUST** physically read the existing file from disk first using `read_file` or command-line inspection.
- If a file has been modernized, the AI must build on top of the **modernized version**, never reverting to the legacy or default template.

### Rule 2: The Feature-Preservation Cross-Check (Anti-Regression Rule)

Before proposing changes to any existing component or server file, the AI **MUST** perform this 4-point verification:

1. **Preserve Added Features:** Cross-check the "Chronological Module Ledger" below. Any feature marked as added (e.g., live preview, country flag auto-converter, geolocation auto-detect, filter tabs, modal portals) must be preserved.
2. **Preserve Clean Types:** Do not introduce `any`, do not remove optional props that other files depend on (e.g., `placeholder?: string` in `PlanField`), and do not import unused icons from `lucide-react`.
3. **No Phantom Reverts:** Do not revert modern `#465FFF` Linear/Stripe design tokens or Tailwind 4 classes back to 1990s-era gray/slate borders.
4. **JSX Balance Check:** Ensure all tags, braces, and conditional blocks are 100% closed and valid TSX.

### Rule 3: Absolute Untouchable Files

The AI is **strictly forbidden** from editing these files unless the user gives an explicit, standalone command naming the file:

- ❌ `package.json` — NEVER modify dependencies or scripts.
- ❌ `src/lib/auth.server.ts` — Read-only. Security & session logic is delicate.
- ❌ `@media print` in `src/styles.css` — Must remain 100% intact for printable salary slips & reports.

### Rule 4: User Working Style Protocol

- **1 File at a Time:** Deliver changes one file at a time. Never dump multiple files together.
- **Wait for "Done":** After delivering a file, wait for the user to reply `"done"` or provide feedback before touching the next file.
- **Size-Based Delivery Rule:**
  - If a file is **<= 200 lines**: Provide ONLY the complete file code (Select All -> Paste).
  - If a file is **> 200 lines**: Provide ONLY the exact FIND & REPLACE block.
- **Communication:** Plain, crisp Hinglish/English senior-dev tone. Clear explanations, zero repetitive fluff.
- **Time Standard:** Always use IST (`Asia/Kolkata`) for dates and timestamps.

### Rule 5: Commit-Sync Mandate

Every code change must immediately be logged into the "Chronological Module Ledger" below with the exact file path, date, version tag, and description.

---

## 🗂️ CHRONOLOGICAL MODULE LEDGER (CANONICAL AUDIT TRAIL)

| File Path                                | Date (IST)             | Version Tag                   | Key Modernization / Architectural Safeguard Description                                                                                       |
| :--------------------------------------- | :--------------------- | :---------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| `TailAdminDashboard.tsx`                 | `2026-11-19 16:30`     | **v2.0 (Modernized)**         | Tabular nums (`font-mono tabular-nums`), due-today pulse, 44px touch targets with `active:scale-95`.                                          |
| `src/routes/admin.tsx`                   | `2026-11-19 16:45`     | **v2.0 (Modernized)**         | 4 functional workspaces, dynamic WhatsApp pitch, 1-tap quick notes, iOS-style toggles.                                                        |
| `StoryEditor.tsx`                        | `2026-11-19 17:04`     | **v2.0 (Modernized)**         | Live card preview, 1-5 star picker, country presets, client WebP compressor, YouTube preview.                                                 |
| `AttendancePanel.tsx`                    | `2026-11-20 10:06`     | **v2.0 (Modernized)**         | KPI metric stat cards, 1-click GPS Auto-Detect via `navigator.geolocation`.                                                                   |
| `CountryPagePreview.tsx`                 | `2026-11-20 10:30`     | **v2.0 (Modernized)**         | Replaced broken portal/iframe with **100% REAL public component (`CountryPageView`)** + viewport.                                             |
| `CountryPanel.tsx`                       | `2026-11-20 10:30`     | **v2.0 (Modernized)**         | Flag presets, auto-converter ("CA" ➔ 🇨🇦), 3 tabs, correct `tuitionEstimate` mapping.                                                          |
| `CertificatePanel.tsx`                   | `2026-11-20 11:25`     | **v2.1 (CI Clean)**           | Linear styling, presets, WebP upload zone, **unused `Check`, `Layers` lucide imports removed**.                                               |
| `StudyPlanPanel.tsx`                     | `2026-11-20 11:30`     | **v2.1 (CI Clean)**           | Sticky action bar, **unused imports removed + added `placeholder?: string` to `PlanField`**.                                                  |
| `PolicyWatchPanel.tsx`                   | `2026-11-20 11:35`     | **v2.1 (CI Clean)**           | Compact ~300 line footprint, **unused `Globe2`, `Trash2` imports removed for CI**.                                                            |
| `.vscode/settings.json`                  | `2026-11-20 11:45`     | **v2.0 (Merged)**             | Prettier default formatter, formatOnSave, tabSize 2, semicolons removed.                                                                      |
| `src/routes/__root.tsx`                  | `2026-11-20 12:20`     | **v2.1 (SEO Ready)**          | **Added custom `RootErrorComponent`** — completely eliminates generic error in Google crawls.                                                 |
| `src/routes/index.tsx`                   | `2026-11-20 12:28`     | **v2.1 (Resilient)**          | **Bulletproof loader `try/catch` with fixture fallbacks**, hero image `sizes` attribute for LCP.                                              |
| `src/components/Logo.tsx`                | `2026-11-20 12:31`     | **v2.1 (SEO Fixed)**          | **Added explicit space `{' '}` + `aria-label`** so Googlebot does NOT index without space.                                                    |
| `src/lib/rate-limit.server.ts`           | `2026-11-20 12:35`     | **v2.1 (Stable)**             | **Fixed cold-start race condition** with `tableEnsured` + added probabilistic cleanup.                                                        |
| `src/lib/db.server.ts`                   | `2026-11-20 12:40`     | **v2.1 (Secure)**             | **Removed hardcoded seed password** — mandatory `ADMIN_PASSWORD` env var.                                                                     |
| `src/lib/country-catalog.server.ts`      | `2026-11-20 12:55`     | **v2.1 (Optimized)**          | **Increased cache TTL from 8s to 60s (`60_000ms`)** to protect TiDB 5-connection limit under load.                                            |
| `src/lib/content-types.ts`               | `2026-11-20 13:00`     | **v2.1 (Extended)**           | Added optional `hasMorePosts?: boolean` and `hasMoreStories?: boolean` to `AdminSnapshot`.                                                    |
| `src/lib/admin-functions.ts`             | `2026-11-20 14:00`     | **v2.1 (Cleaned)**            | Returned 100-cap flags in `getAdminSnapshot` + cleaned historical `Overload Fix #4` comment.                                                  |
| `src/components/EnquiryForm.tsx`         | `2026-11-20 14:05`     | **v2.1 (UX Pro Max)**         | `autoComplete` attributes on inputs, `aria-hidden` honeypot, **1-click WhatsApp fallback**.                                                   |
| `src/lib/seo.ts`                         | `2026-11-20 14:07`     | **v2.1 (Rich Share)**         | **Added default rich OpenGraph image** (`/img/hero.webp` + Twitter card) across all public pages.                                             |
| `src/styles.css`                         | `2026-11-20 14:09`     | **v2.1 (Accessible)**         | Added `.animate-marquee` to `@media (prefers-reduced-motion)` — **`@media print` 100% untouched**.                                            |
| `src/lib/utils.ts`                       | `2026-11-20 14:10`     | **v2.1 (Centralized)**        | Centralized shared `stringValue(value, max)` helper.                                                                                          |
| `src/lib/public-functions.ts`            | `2026-11-20 14:12`     | **v2.1 (Lean Cache)**         | Imported `stringValue` from utils, decoupled policy notices invalidation, settings cache to 300s.                                             |
| `vercel.json`                            | `2026-11-21 14:50 IST` | **v2.3 (Security & Cache)**   | Added universal security headers (`nosniff`, `SAMEORIGIN`, safe `camera=(self), geolocation=(self)`, safe CSP), preserved route caches.       |
| `src/components/Logo.tsx`                | `2026-11-21 14:50 IST` | **v2.3 (CLS 0)**              | Added explicit `width={44} height={44}` matching `sm:size-11` to prevent layout shift.                                                        |
| `src/components/CertificateCarousel.tsx` | `2026-11-21 14:50 IST` | **v2.3 (CLS 0)**              | Added explicit `width={400} height={300}` on carousel cards to eliminate CLS.                                                                 |
| `src/components/Cards.tsx`               | `2026-11-21 14:50 IST` | **v2.3 (CLS 0)**              | Added explicit `width={800} height={600}` on approval photo cards to eliminate CLS.                                                           |
| `src/lib/public-functions.ts`            | `2026-11-21 14:50 IST` | **v2.3 (Rate Limit & Cache)** | Normalized Indian phone keys for enquiry rate limiter, decoupled settings cache from content cache.                                           |
| `src/routes/robots[.]txt.ts`             | `2026-11-21 14:50 IST` | **v2.3 (SEO Route)**          | Created dedicated Nitro route serving `/robots.txt` with guaranteed 200 OK headers.                                                           |
| `.npmrc`                                 | `2026-11-21 14:50 IST` | **v2.3 (CI Build)**           | Configured `frozen-lockfile=false` to prevent CI failure on minor lockfile specifier mismatches.                                              |
| `public/llms.txt`                        | `2026-11-21 14:50 IST` | **v2.3 (AI Ready)**           | Created standard AI crawler discovery file exposing office address, phone lines, study visa services, and IELTS/PTE details.                  |
| `public/ai-catalog.json`                 | `2026-11-21 14:50 IST` | **v2.3 (AI Catalog)**         | Created structured JSON catalog with country visa offerings, coaching schedules, and Sangaria office coordinates.                             |
| `src/routes/__root.tsx`                  | `2026-11-21 14:50 IST` | **v2.3 (Rich Schema)**        | Upgraded Schema.org to `@graph` (`LocalBusiness` + 4.9⭐ aggregateRating + Study Visa `Service` + IELTS/PTE `Course`) + `staleTime: 300_000`. |
| `src/routes/index.tsx`                   | `2026-11-21 14:50 IST` | **v2.3 (Heading Fix)**        | Upgraded Why Choose Us cards from `<h4>` to `<h3>` to eliminate H2 ➔ H4 heading hierarchy skip.                                               |
| vercel.json | 2026-11-21 16:15 IST | v2.4 (MediaPipe & Vimeo) | Added cdn.jsdelivr.net, 'wasm-unsafe-eval', storage.googleapis.com & player.vimeo.com to CSP. |
| src/lib/country-catalog.server.ts | 2026-11-21 16:15 IST | v2.4 (Outage Fallback) | Wrapped public country catalog in try/catch with static fallback so country pages never throw 500. |
| src/lib/public-functions.ts | 2026-11-21 16:15 IST | v2.4 (Outage & Ghost Fix) | DB outage fallback for coaching/posts + fixed unpublish bug so empty DB rows don't revive mock fixtures. |
| src/lib/attendance-functions.ts | 2026-11-21 16:15 IST | v2.4 (Payroll Guard) | Prevented modifying employee cycleStartDay after attendance logs have been recorded. |
| src/components/SiteHeader.tsx | 2026-11-21 16:15 IST | v2.4 (Hours & Touch) | Fixed Sunday/nighttime IST hours boundary (< 1170) and enlarged mobile hamburger button to 44x44px. |
| public/ai-catalog.json | 2026-11-21 16:15 IST | v2.4 (WhatsApp Sync) | Aligned AI catalog WhatsApp line to +919772570478 matching site.ts. |
| src/components/CountryPageView.tsx| 2026-11-21 16:15 IST | v2.4 (A11y Hierarchy) | Added <h2 className="sr-only"> to eliminate H1 ➔ H3 heading skip for screen readers. |
| src/routes/updates.index.tsx | 2026-11-21 16:15 IST | v2.4 (A11y Hierarchy) | Added <h2 className="sr-only"> to eliminate H1 ➔ H3 heading skip on updates page. |
| src/styles.css | 2026-11-21 16:15 IST | v2.4 (WCAG Contrast) | Raised .field::placeholder contrast to rgba(18, 55, 82, 0.75) meeting WCAG AA 4.5:1+. |
| src/routes/__root.tsx | 2026-11-21 16:15 IST | v2.4 (GTM Lifecycle) | Added cancelIdleCallback/clearTimeout cleanup for GTM script loader on portal navigation. |
| src/lib/db.server.ts | 2026-11-21 16:15 IST | v2.4 (Configurable TLS) | Supported configurable DATABASE_SSL_REJECT_UNAUTHORIZED and DATABASE_CA certificate options. |

---

## 📝 COMMIT UPDATE PROTOCOL (HOW TO MAINTAIN THIS GRAPH)

Whenever you (or any AI agent) commit changes to this project, follow this exact procedure:

1. **Check Version:** Look at the "Chronological Module Ledger" above to identify the latest version of the file being touched.
2. **Edit Code:** Apply the required fix/feature while preserving all previous ledger entries.
3. **Append Ledger:** Add a new entry to the bottom of the ledger table with:
   - File Path
   - Current IST Timestamp (`YYYY-MM-DD HH:mm IST`)
   - New Version Number (e.g., `v2.2`)
   - Exact description of additions, bugfixes, or refactorings
4. **Verify Constraints:** Run through the 5 Mandatory AI Directives.
5. **Commit Together:** Commit the modified code file AND this `PROJECT_KNOWLEDGE_GRAPH.md` in the same commit.
