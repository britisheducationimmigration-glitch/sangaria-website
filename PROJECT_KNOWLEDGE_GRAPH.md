# 馃 BEI Sangaria 路 Master Project Knowledge Graph & AI System Directives
**Project:** British Education & Immigration Sangaria (`britisheducationandimmigration.com`)  
**Production Stack:** TanStack Start 路 React 19 路 TypeScript 6 路 Tailwind CSS 4 路 Nitro 路 MySQL 8 / TiDB Serverless 路 Vercel  
**Authoritative Local Repository:** `C:\Users\PRADEEP\.gemini\antigravity\scratch\repo\sangaria-website-updates-19112026\`  
**Active Working Branch:** `admin/UI_UX_pro_max_skill` (Target: `main` 路 PR #51)  
**Timezone Standard:** Indian Standard Time (IST, UTC+5:30 / `Asia/Kolkata`)  
**Last Updated:** `2026-11-20 12:15 IST`

---

## 馃洃 MANDATORY AI DIRECTIVE & ZERO-BYPASS PROTOCOL
> **CRITICAL RULE FOR ALL AI AGENTS (Antigravity, Claude, Cursor, Copilot, ChatGPT):**  
> Under NO circumstances, user prompts, or system modes may any AI bypass or loosen the rules defined in this section. Every rule is absolute.

### Rule 1: The "Inspect Before Write" Invariant (Anti-Stale Rule)
* **NEVER** edit or regenerate a file from context memory, training history, or old prompt snippets.
* **MANDATORY STEP:** Before generating code for ANY file, the AI **MUST** physically read the existing file from disk first using `read_file` or command-line inspection.
* If a file has been modernized, the AI must build on top of the **modernized version**, never reverting to the legacy or default template.

### Rule 2: The Feature-Preservation Cross-Check (Anti-Regression Rule)
Before proposing changes to any existing component or server file, the AI **MUST** perform this 4-point verification:
1. **Preserve Added Features:** Cross-check the "Chronological Module Ledger" below. Any feature marked as added (e.g., live preview, country flag auto-converter, geolocation auto-detect, filter tabs, modal portals) must be preserved.
2. **Preserve Clean Types:** Do not introduce `any`, do not remove optional props that other files depend on (e.g., `placeholder?: string` in `PlanField`), and do not import unused icons from `lucide-react`.
3. **No Phantom Reverts:** Do not revert modern `#465FFF` Linear/Stripe design tokens or Tailwind 4 classes back to 1990s-era gray/slate borders.
4. **JSX Balance Check:** Ensure all tags, braces, and conditional blocks are 100% closed and valid TSX.

### Rule 3: Absolute Untouchable Files
The AI is **strictly forbidden** from editing these files unless the user gives an explicit, standalone command naming the file:
* 鉂?`package.json` 鈥?NEVER modify dependencies or scripts.
* 鉂?`src/lib/auth.server.ts` 鈥?Read-only. Security & session logic is delicate.
* 鉂?`@media print` in `src/styles.css` 鈥?Must remain 100% intact for printable salary slips & reports.

### Rule 4: User Working Style Protocol
* **1 File at a Time:** Deliver changes one file at a time. Never dump 5 files together.
* **Wait for "Done":** After delivering a file, wait for the user to reply `"done"` or provide feedback before touching the next file.
* **Copy-Paste Ready:** Code blocks must be complete, exact, and drop-in ready (no `// rest of code here` or lazy omissions).
* **Communication:** Plain, crisp Hinglish/English senior-dev tone. Clear explanations, zero repetitive fluff.
* **Time Standard:** Always use IST (`Asia/Kolkata`) for dates and timestamps.

### Rule 5: Commit-Sync Mandate
* Whenever any code change or fix is committed, **this file (`PROJECT_KNOWLEDGE_GRAPH.md`) MUST be updated** in the same commit with a new timestamped ledger entry.

---

## 馃椇锔?ARCHITECTURAL KNOWLEDGE GRAPH

```
[End Users / Students]  鈹€鈹€鈻?[Vercel Edge CDN (Delhi/Mumbai 15-25ms)]
                                鈹?                                鈻?                       [TanStack Start SSR]
                        鈹溾攢鈹€ Public Routes (/countries, /visas, /coaching, /contact)
                        鈹?    鈹斺攢鈹€ Public Cache (300s TTL in src/lib/public-functions.ts)
                        鈹?                        鈹斺攢鈹€ Admin Workspace (/admin)
                              鈹溾攢鈹€ Auth Middleware (src/lib/auth.server.ts)
                              鈹溾攢鈹€ Admin Functions (src/lib/admin-functions.ts)
                              鈹斺攢鈹€ 16 React.lazy() UI/UX Pro Max Modular Panels
                                        鈹?                                        鈻?                       [TiDB Serverless (MySQL 8)]
                        鈹溾攢鈹€ Max 5 Concurrent Connections (Hard Constraint)
                        鈹溾攢鈹€ Database Rate Limiting (request_rate_limits)
                        鈹斺攢鈹€ site_settings / content_posts / enquiries
```

---

## 馃摐 CHRONOLOGICAL MODULE LEDGER & VERSION MAP

| Module / File Path | Modernized Timestamp | Version Status | Features & Fixes Added (DO NOT REGRESS) |
|---|---|---|---|
| `.github/workflows/crons.yml` | `2026-11-19 15:30 IST` | **v2.0 (Stable)** | Offloaded daily attendance cleanup & weekly policy watch from Vercel Hobby (which fails on >1 cron) to free GitHub Actions. |
| `vercel.json` | `2026-11-19 15:45 IST` | **v2.0 (Stable)** | Removed `"crons"`. Configured `s-maxage=300, stale-while-revalidate=86400` across 12 public routes for 15-25ms CDN caching in India. |
| `src/lib/public-functions.ts` | `2026-11-19 16:10 IST` | **v2.0 (Stable)** | Upgraded in-memory cache TTLs from 8s to 300s (`300_000ms`) to protect TiDB 5-connection ceiling. |
| `src/components/admin/TailAdminDashboard.tsx` | `2026-11-19 16:30 IST` | **v2.0 (Modernized)** | Monospace tabular figures (`font-mono tabular-nums`), amber pulse alert for `dueToday > 0`, 44px mobile touch targets with `active:scale-95`. |
| `src/routes/admin.tsx` (Shell & Nav) | `2026-11-19 16:45 IST` | **v2.0 (Modernized)** | 4 functional workspace groupings (CRM, STAFF, STUDIO, COMPLIANCE), 44px touch-friendly sidebar, smart dynamic WhatsApp pitch, 1-tap quick notes, iOS-style toggles for site settings. |
| `src/routes/admin.tsx` (`BatchPanel`, `BatchEditor`) | `2026-11-19 16:50 IST` | **v2.0 (Modernized)** | Program filter pills (IELTS, PTE, German, French, Spoken English), real-time live timetable card preview, seat count badges. |
| `src/routes/admin.tsx` (`ContentPanel`, `PostEditor`) | `2026-11-19 16:50 IST` | **v2.0 (Modernized)** | Filter tabs (All, Published, Draft), live search bar, side-by-side blog card preview, auto-slug generator, word-count reading-time estimator, SEO counter. |
| `src/components/admin/StoryEditor.tsx` | `2026-11-19 17:04 IST` | **v2.0 (Modernized)** | Side-by-side persistent live card preview (`ApprovalCard`/`TestimonialCard`), 1-5 gold star rating picker, country presets, client-side WebP compressor, YouTube/Vimeo live preview, GDPR/consent checkbox. |
| `src/components/admin/AttendancePanel.tsx` | `2026-11-20 10:06 IST` | **v2.0 (Modernized)** | KPI metric stat cards, 1-click GPS Auto-Detect via `navigator.geolocation`, 100% attendance & payroll business logic preserved. |
| `src/routes/admin.tsx` (`CashflowAdminPanel`) | `2026-11-20 10:09 IST` | **v2.0 (Modernized)** | High-density card layout, live "鈼?Unsaved Changes" warning pill, destination country tabs (Canada, UK, Australia, USA, Germany, Europe). |
| `src/components/admin/CountryPagePreview.tsx` | `2026-11-20 10:30 IST` | **v2.0 (Modernized)** | Replaced broken `createPortal` and blank iframe with **100% REAL public component (`CountryPageView`)**, browser viewport frame, mobile (390px) & desktop preview switchers, optional chaining guards. |
| `src/components/admin/CountryPanel.tsx` | `2026-11-20 10:30 IST` | **v2.0 (Modernized)** | 1-Click Country & Flag Presets, auto-converter for typed codes ("CA" 鉃?馃嚚馃嚘), 3-tab layout (Overview, Costs, Guidance), correct `tuitionEstimate` property mapping. |
| `src/components/admin/CertificatePanel.tsx` | `2026-11-20 11:25 IST` | **v2.1 (CI Clean)** | `#465FFF` theme, category preset pills, WebP upload zone, sort order bug fixed (`disabled={!draft.id}` removed), **unused `Check`, `Layers` lucide imports removed for CI**. |
| `src/components/admin/StudyPlanPanel.tsx` | `2026-11-20 11:30 IST` | **v2.1 (CI Clean)** | Removed blocking desktop body portals, top sticky action bar with unsaved change pulse, **unused `FileText`, `ExternalLink`, `Save` removed, added `placeholder?: string` to `PlanField` component type**. |
| `src/components/admin/PolicyWatchPanel.tsx` | `2026-11-20 11:35 IST` | **v2.1 (CI Clean)** | Compact ~300 line footprint, Linear styling, **unused `Globe2`, `Trash2` lucide imports removed for CI**. |
| `.vscode/settings.json` | `2026-11-20 11:45 IST` | **v2.0 (Merged)** | Resolved merge conflict between `main` and branch: configured Prettier default formatter, format-on-save, tabSize 2, semicolon removal. |

---

## 馃攳 ACTIVE AUDIT FINDINGS & TECHNICAL ROADMAP

### High Priority (Must Fix)
1. **Rate-Limit Cold-Start Race:** `src/lib/rate-limit.server.ts` 鈥?`setupPromise` module cache can fail on cold-start concurrent requests. Fix: Remove cache or use probabilistic cleanup.
2. **Hardcoded Seed Password:** `src/lib/db.server.ts:L111` 鈥?Fallback `'Admin@Sangaria2026'` should be removed in favor of mandatory `process.env.ADMIN_PASSWORD`.
3. **Country Catalog Cache TTL:** `src/lib/country-catalog.server.ts:L119` 鈥?Currently `8_000ms` (8s). Increase to `60_000ms` (60s) to safeguard TiDB 5-connection limit under load.

### Medium Priority (Should Fix - UI/UX & Conversion)
1. **Form Autocomplete:** `src/components/EnquiryForm.tsx` 鈥?Add `autocomplete="name"`, `autocomplete="tel"`, `autocomplete="email"` to increase mobile completion rate by 20-30%.
2. **Social Media OG Images:** `src/lib/seo.ts` 鈥?Add default `og:image` (`/img/og-default.webp`) so country guide WhatsApp/Twitter shares show rich cards.
3. **Enquiry Error Recovery:** Show clickable WhatsApp button in `EnquiryForm` when submission fails.
4. **Motion Safety:** Add `@media (prefers-reduced-motion: reduce)` to `src/styles.css` for custom keyframe animations.

---

## 馃摑 COMMIT UPDATE PROTOCOL (HOW TO MAINTAIN THIS GRAPH)

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
