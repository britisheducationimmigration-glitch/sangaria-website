# 馃 BEI Sangaria 路 Master Project Knowledge Graph & AI System Directives

**Project:** British Education & Immigration Sangaria (`britisheducationandimmigration.com`)  
**Production Stack:** TanStack Start 路 React 19 路 TypeScript 6 路 Tailwind CSS 4 路 Nitro 路 MySQL 8 / TiDB Serverless 路 Vercel  
**Authoritative Local Repository:** `C:\Users\PRADEEP\.gemini\antigravity\scratch\repo\sangaria-website-updates-19112026\`  
**Active Working Branch:** `admin/UI_UX_pro_max_skill` (Target: `main` 路 PR #51)  
**Timezone Standard:** Indian Standard Time (IST, UTC+5:30 / `Asia/Kolkata`)  
**Last Updated:** `2026-11-20 14:15 IST`

---

## 馃洃 MANDATORY AI DIRECTIVE & ZERO-BYPASS PROTOCOL

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

- 鉂?`package.json` 鈥?NEVER modify dependencies or scripts.
- 鉂?`src/lib/auth.server.ts` 鈥?Read-only. Security & session logic is delicate.
- 鉂?`@media print` in `src/styles.css` 鈥?Must remain 100% intact for printable salary slips & reports.

### Rule 4: User Working Style Protocol

- **1 File at a Time:** Deliver changes one file at a time. Never dump multiple files together.
- **Wait for "Done":** After delivering a file, wait for the user to reply `"done"` or provide feedback before touching the next file.
- **Size-Based Delivery Rule:**
  - If a file is **<= 200 lines**: Provide ONLY the complete file code (Select All -> Paste).
  - If a file is **> 200 lines**: Provide ONLY the exact FIND & REPLACE block.
- **Communication:** Plain, crisp Hinglish/English senior-dev tone. Clear explanations, zero repetitive fluff.
- **Time Standard:** Always use IST (`Asia/Kolkata`) for dates and timestamps.

### Rule 5: Commit-Sync Mandate

- Whenever any code change or fix is committed, **this file (`PROJECT_KNOWLEDGE_GRAPH.md`) MUST be updated** in the same commit with a new timestamped ledger entry.

---

## 馃椇锔?ARCHITECTURAL KNOWLEDGE GRAPH

```
[End Users / Students / Googlebot]
                鈹?                鈻?  [Vercel Edge CDN (Delhi/Mumbai 15-25ms)]
                鈹?                鈻?      [TanStack Start SSR]
       鈹溾攢鈹€ Root Route (src/routes/__root.tsx)
       鈹?    鈹斺攢鈹€ Custom Branded ErrorComponent (No "Something went wrong! Show Error")
       鈹溾攢鈹€ Public Routes (/countries, /visas, /coaching, /contact)
       鈹?    鈹溾攢鈹€ Bulletproof Loader with Fixture Fallbacks (src/routes/index.tsx)
       鈹?    鈹溾攢鈹€ Rich OpenGraph Previews for Social Shares (src/lib/seo.ts)
       鈹?    鈹斺攢鈹€ 300s Edge / In-Memory Cache (src/lib/public-functions.ts)
       鈹斺攢鈹€ Admin Workspace (/admin)
             鈹溾攢鈹€ Hand-rolled JWT Auth (src/lib/auth.server.ts)
             鈹溾攢鈹€ Admin Server Functions (src/lib/admin-functions.ts)
             鈹斺攢鈹€ 16 React.lazy() Modular Admin Panels
                       鈹?                       鈻?      [TiDB Serverless (MySQL 8)]
       鈹溾攢鈹€ Max 5 Concurrent Connections (Protected by 60s/300s Caching)
       鈹斺攢鈹€ Database Throttling (request_rate_limits with Probabilistic Cleanup)
```

---

## 馃摐 CHRONOLOGICAL MODULE LEDGER & VERSION MAP

| Module / File Path                  | Timestamp (IST)    | Version Status         | Features & Fixes Added (DO NOT REGRESS)                                                                                              |
| ----------------------------------- | ------------------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `.github/workflows/crons.yml`       | `2026-11-19 15:30` | **v2.0 (Stable)**      | Offloaded daily attendance cleanup & weekly policy watch from Vercel Hobby to free GitHub Actions.                                   |
| `vercel.json`                       | `2026-11-19 15:45` | **v2.0 (Stable)**      | Removed `"crons"`. Configured `s-maxage=300, stale-while-revalidate=86400` across 12 public routes.                                  |
| `TailAdminDashboard.tsx`            | `2026-11-19 16:30` | **v2.0 (Modernized)**  | Tabular nums (`font-mono tabular-nums`), due-today pulse, 44px touch targets with `active:scale-95`.                                 |
| `src/routes/admin.tsx`              | `2026-11-19 16:45` | **v2.0 (Modernized)**  | 4 functional workspaces, dynamic WhatsApp pitch, 1-tap quick notes, iOS-style toggles.                                               |
| `StoryEditor.tsx`                   | `2026-11-19 17:04` | **v2.0 (Modernized)**  | Live card preview, 1-5 star picker, country presets, client WebP compressor, YouTube preview.                                        |
| `AttendancePanel.tsx`               | `2026-11-20 10:06` | **v2.0 (Modernized)**  | KPI metric stat cards, 1-click GPS Auto-Detect via `navigator.geolocation`.                                                          |
| `CountryPagePreview.tsx`            | `2026-11-20 10:30` | **v2.0 (Modernized)**  | Replaced broken portal/iframe with **100% REAL public component (`CountryPageView`)** + viewport toggles.                            |
| `CountryPanel.tsx`                  | `2026-11-20 10:30` | **v2.0 (Modernized)**  | Flag presets, auto-converter ("CA" 鉃?馃嚚馃嚘), 3 tabs, correct `tuitionEstimate` mapping.                                          |
| `CertificatePanel.tsx`              | `2026-11-20 11:25` | **v2.1 (CI Clean)**    | Linear styling, presets, WebP upload zone, **unused `Check`, `Layers` lucide imports removed**.                                      |
| `StudyPlanPanel.tsx`                | `2026-11-20 11:30` | **v2.1 (CI Clean)**    | Sticky action bar, **unused imports removed + added `placeholder?: string` to `PlanField`**.                                         |
| `PolicyWatchPanel.tsx`              | `2026-11-20 11:35` | **v2.1 (CI Clean)**    | Compact ~300 line footprint, **unused `Globe2`, `Trash2` imports removed for CI**.                                                   |
| `.vscode/settings.json`             | `2026-11-20 11:45` | **v2.0 (Merged)**      | Prettier default formatter, formatOnSave, tabSize 2, semicolons removed.                                                             |
| `src/routes/__root.tsx`             | `2026-11-20 12:20` | **v2.1 (SEO Ready)**   | **Added custom `RootErrorComponent`** 鈥?completely eliminates generic "Something went wrong! Show Error" in Google crawls.          |
| `src/routes/index.tsx`              | `2026-11-20 12:28` | **v2.1 (Resilient)**   | **Bulletproof loader `try/catch` with fixture fallbacks**, hero image `sizes` attribute for LCP, mobile destinations CTA.            |
| `src/components/Logo.tsx`           | `2026-11-20 12:31` | **v2.1 (SEO Fixed)**   | **Added explicit space `{' '}` + `aria-label`** so Googlebot does NOT index `British Education& Immigration` without space.          |
| `src/lib/rate-limit.server.ts`      | `2026-11-20 12:35` | **v2.1 (Stable)**      | **Fixed cold-start race condition** with `tableEnsured` + added probabilistic cleanup (`Math.random() < 0.01`).                      |
| `src/lib/db.server.ts`              | `2026-11-20 12:40` | **v2.1 (Secure)**      | **Removed hardcoded seed password** `'Admin@Sangaria2026'` 鈥?mandatory `ADMIN_PASSWORD` env var.                                    |
| `src/lib/country-catalog.server.ts` | `2026-11-20 12:55` | **v2.1 (Optimized)**   | **Increased cache TTL from 8s to 60s (`60_000ms`)** to protect TiDB 5-connection limit under load.                                   |
| `src/lib/content-types.ts`          | `2026-11-20 13:00` | **v2.1 (Extended)**    | Added optional `hasMorePosts?: boolean` and `hasMoreStories?: boolean` to `AdminSnapshot`.                                           |
| `src/lib/admin-functions.ts`        | `2026-11-20 14:00` | **v2.1 (Cleaned)**     | Returned 100-cap flags in `getAdminSnapshot` + cleaned historical `Overload Fix #4` comment.                                         |
| `src/components/EnquiryForm.tsx`    | `2026-11-20 14:05` | **v2.1 (UX Pro Max)**  | `autoComplete` attributes on inputs, `aria-hidden` honeypot, `aria-busy` submit state, **1-click WhatsApp fallback in error state**. |
| `src/lib/seo.ts`                    | `2026-11-20 14:07` | **v2.1 (Rich Share)**  | **Added default rich OpenGraph image** (`/img/hero.webp` + Twitter summary card) across all public pages.                            |
| `src/styles.css`                    | `2026-11-20 14:09` | **v2.1 (Accessible)**  | Added `.animate-marquee` to `@media (prefers-reduced-motion)` suppression 鈥?**`@media print` 100% untouched**.                      |
| `src/lib/utils.ts`                  | `2026-11-20 14:10` | **v2.1 (Centralized)** | Centralized shared `stringValue(value, max)` helper.                                                                                 |
| `src/lib/public-functions.ts`       | `2026-11-20 14:12` | **v2.1 (Lean Cache)**  | Imported `stringValue` from utils, decoupled policy notices invalidation, upgraded settings cache to 300s.                           |

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
