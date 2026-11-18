Architecture diagram
 

AGENTS.md — British Education & Immigration (Sangaria) Knowledge Graph & Agent Rules

Read this file completely before reading or changing any code. This file is the single source of truth for the repository (https://www.britisheducationandimmigration.com). Mandatory rule: Whenever you add, rename, delete, or materially change a route, component, server function, database table, cron job, or business rule, you MUST update this AGENTS.md in the same PR/step so it never goes stale.

1. Operating Mode: Lazy Senior Dev (No Compromise, Zero Bloat)

Every AI agent working on this repo MUST follow these rules:

Smallest complete change: Solve the exact problem with the minimum diff. Never refactor working code, never rename symbols just for style, never invent abstractions or new helper files unless genuinely needed.
Never assume — verify first: Read the target file and its callers before proposing any edit. Never guess MySQL column names, route shapes, or existing behaviors.
Owner workflow (Zero-coding / GitHub Web UI):
Unless the owner says they are running locally, guide strictly 1 file at a time and wait for confirmation before the next file.
Give complete full-file copy-paste for small/medium files (<250 lines) and exact full-block before/after for large files (admin.tsx, fixtures.ts, attendance-functions.ts, styles.css).
Always explain in plain English / Hinglish exactly what changes and confirm what is NOT deleted or broken.
Hard guardrails (NEVER violate unless explicitly asked):
Do NOT touch package.json when edits are made via GitHub Web UI — CI runs pnpm install --frozen-lockfile and will fail without regenerating pnpm-lock.yaml.
Do NOT touch print CSS (@media print in src/styles.css) unless specifically fixing printing.
Do NOT add new npm dependencies if native browser/Node/existing library code solves it cleanly.
CI hygiene on every JSX edit: Every <img> MUST have an alt attribute; every <a target="_blank"> MUST have rel="noopener noreferrer"; every .json file MUST be valid JSON (scripts/audit-source.mjs checks these); tsconfig.json enforces noUnusedLocals and noUnusedParameters.
Honest close-out: End every coding reply with a 1-line *Skipped / risk note: ...* stating what you intentionally deferred or any edge case to watch.
2. Stack, Hosting & Live Baseline (Post Rounds 1–4)
Site: British Education and Immigration, Sangaria, Hanumangarh, Rajasthan
Live URL: https://www.britisheducationandimmigration.com
Stack: TanStack Start (@tanstack/react-start), React 19, TypeScript 6, Vite 8, Tailwind CSS 4, Nitro, MySQL 8 (mysql2/promise), Vercel.
Timezone: All business dates, attendance days, payroll cycles, Excel filenames, cron photo cutoffs, and default post/story dates use IST (Asia/Kolkata). Never use new Date().toISOString().slice(0, 10) for Indian business dates (drifts between 00:00 and 05:30 IST).
Live DB vs Fixtures: Production & Preview read live content from MySQL (site_settings, content_posts, success_stories, coaching_batches, certificate_items). src/data/fixtures.ts is only a fallback/initial seed when DB tables are empty — editing fixtures.ts alone does NOT overwrite existing MySQL rows.
3. Architecture Knowledge Graph
4. Key File Map & Recent Upgrades (Baseline)
Public UI & SEO
File	Owns	Current State / Invariants
src/routes/__root.tsx	Root HTML shell, EducationalOrganization JSON-LD, GTM loader	sameAs, hasMap, og:image:alt, admissions@ fallback; no duplicate font preload.
src/routes/index.tsx	Homepage	Hero Finder routes by both visa & country; Approvals & Certificates placed higher; no duplicate mobile sticky bar.
src/routes/countries.$slug.tsx	Country guide page	Parallel Promise.all loader + BreadcrumbList JSON-LD schema.
src/routes/study-plan.$slug.tsx	Printable study plan & checklist	Tracks loadedKey so switching countries never overwrites another country's localStorage checklist.
src/routes/updates.$slug.tsx	Blog post page	Article JSON-LD schema in head(); rel="noopener noreferrer" on external sources.
src/routes/contact.tsx	Contact page + map	Standard mailto: links + ?country= URL param pre-fill.
src/routes/coaching.tsx	IELTS & PTE batches	Expired-batch fallback UI (src/lib/batch-dates.ts) + Lucide Clock icon.
src/components/BoardingPassGenerator.tsx	Virtual flight boarding pass	Uses canonical https://www.britisheducationandimmigration.com in WhatsApp share text.
src/components/EnquiryForm.tsx	Shared lead form	Client-side IST minDemoDate (no hydration mismatch), "Send another enquiry" reset button, reactive selectedInterest.
src/components/EnquiryPopup.tsx	Timed lead popup	Suppressed on /contact, /eligibility, /study-plan, /attendance; backdrop click closes; 25s default delay.
src/components/WhatsAppButton.tsx	Floating WA + Mobile Call/WA bar	Renders mobile Call + WhatsApp sticky bar across all public pages (hidden on /admin, /attendance).
src/components/GyanDhanLoanSection.tsx	GyanDhan loan widget	Deduplicates <script> injection and cleans up on unmount.
src/components/InteractiveFlightGlobe.tsx	Hero 3D canvas globe	Uses selectedCountryRef so changing country doesn't reset the canvas animation.
src/components/FamilyCashflowPlanner.tsx	Budget planner + PDF	Uses escapeHtml() before print HTML generation; Print / Save PDF + Share on WhatsApp.
src/components/Cards.tsx	Approval, Testimonial, Post cards	Entire blog card & "Read article →" clickable; real t.rating stars; non-resetting ApprovalVideo.
src/routes/certificates.image.$id.ts	DB-backed certificate images	Sends immutable cache header ONLY when ?v= query param is present.
Admin & Server Functions
File	Owns	Current State / Invariants
src/routes/admin.tsx	Admin shell & tabs	Heavy tabs (AttendancePanel, CountryPanel, StudyPlanPanel, PolicyWatchPanel, CertificatePanel, StoryEditor) lazy-loaded via React.lazy + Suspense; fresh IST dates via makeBlankPost() / makeBlankStory(); styled ReviewQueuePanel buttons.
src/components/admin/TailAdminDashboard.tsx	Admin overview	Fixed 0-lead month bar height, fixed grammar, 1-tap Call/WhatsApp + click-to-open on Recent Enquiries.
src/lib/public-functions.ts	Public read APIs	getPublicContent runs 4 queries via Promise.all; 8s in-memory cache for content, settings, cashflow, and policy notices (invalidatePublicContentCache() clears all).
src/lib/admin-functions.ts	Admin CRUD + Excel export	Uses todayIst() helper for Excel filenames & default dates; updateSettings updates only the 4 control columns (never overwrites public_settings_json); saveCashflow, savePolicyNotice, and deletePolicyNotice invalidate public cache.
src/lib/country-catalog.server.ts	Country overrides in site_settings	Uses databaseTransaction + SELECT ... FOR UPDATE to prevent concurrent admin overwrites.
src/lib/db.server.ts	MySQL pool & migrations	Seeds fresh DB with popup_delay_seconds = 25 to match site-settings.ts.
Attendance & Payroll
File	Owns	Current State / Invariants
src/routes/attendance.$token.tsx	Staff self-service punch portal	URL supports /attendance/<slug>~<token> or /attendance/<token>. Captures GPS + front-camera blink selfie + localStorage device key. Shows Admin leave/absent card without starting camera, skips camera when missedPreviousOutDate blocks punches, auto-restarts killed camera tracks & refreshes overnight IST rollovers on visibilitychange, confirms Check Out while on open break, and shows Missing OUT/In Progress badges in Recent Days.
src/lib/face-challenge.ts	Browser blink check	Loads MediaPipe FaceLandmarker from jsDelivr + Google Storage (15s blink window). Evidence only, not hardware identity proof.
src/lib/attendance-calculations.ts	Pure payroll & shift math	Tested by src/lib/attendance-calculations.test.mjs. Handles shift classification, cycle clamping (days 1–31), break interval merging, effective-dated policies, weekly offs/holidays.
src/lib/payroll-range.ts	Custom date-range payroll	Sums per-cycle denominators; throws if cycle-day policy changes create gaps/overlaps.
src/lib/attendance.server.ts	Schema, GPS/IP verification, PIN/device hashing	Haversine distance, accuracy check, Indian IP/VPN heuristic, optional Office Wi-Fi IP lock, autoCloseOpenCheckIns() (SQL skips already-flagged rows; flags missing OUT without inventing 10 PM checkout).
src/lib/attendance-reliability.server.ts	Transactions, CSV formula escaping, ledger tables	attendanceTransaction(), csvText() (prefixes =+@- with ').
src/lib/attendance-functions.ts	All attendance & salary server fns	Employee CRUD (only inserts employee_policy_history when payroll policy actually changed; blocks cycleStartDay edits on/before finalized cycles), punches (in/out/half_out/break_out/break_in), admin edits, Excel/CSV exports, cycle finalization, payments, official & manual salary slips (single-pass JSON parse in range reports), 60-day photo cleanup.
src/routes/api.cron.attendance-cleanup.ts	Daily attendance cleanup cron	Runs autoCloseOpenCheckIns() and clears selfie blobs older than todayIstDate() minus 60 days (matching Admin preview).
src/components/admin/AttendancePanel.tsx	Admin attendance UI	30s background auto-refresh runs silently without flicker and preserves editHistory badges; Calendar view shows full month (logs) and day click switches datePreset to 'date' for Timeline.
src/components/admin/PayrollLedger.tsx & ManualSalarySlips.tsx	Employee statement, payments, printable payslips	Auto-syncs from/to dates and new-slip form month when month prop changes.
5. MySQL Tables Map

Core Site (src/lib/db.server.ts, versioned via app_schema_migrations):

site_settings (single row id = 1: toggles + JSON blobs cashflow_json, public_settings_json, policy_watch_json, country_catalog_json, attendance_settings_json)
enquiries & enquiry_activities
coaching_batches
certificate_items (supports static image_path or DB image_data BLOB + image_version)
content_posts
success_stories (kind = 'approval' | 'testimonial', optional photo_data BLOB / video_url)
admin_users

Attendance & Payroll (src/lib/attendance.server.ts & src/lib/attendance-reliability.server.ts):

employees (profile, access_token, pin_hash, bound_device_hash, current policy fields)
employee_policy_history ((employee_id, effective_date) unique — effective-dated salary/shift/off/holiday snapshots)
employee_policy_audit (before/after audit log of policy edits)
attendance_logs ((employee_id, work_date) unique — IN/OUT times, GPS, IP, flags, in_photo_data/out_photo_data MEDIUMBLOB, breaks_json, work_minutes, break_minutes, status)
attendance_edit_history (every admin create/edit with before/after JSON & reason)
attendance_original_punches (immutable first punch snapshot — NEVER overwrite)
attendance_punch_events (append-only log of every punch event)
attendance_cycle_snapshots (finalized/locked monthly cycle reports — blocks punches & edits in locked dates)
salary_payments (cash/UPI/bank records with idempotent request_key and soft-void fields)
salary_slips (official BEI-YYYYMM-... and manual BEI-M-... slips with snapshot_json and soft-void)
6. Critical Business Invariants (Do Not Break)
Missing Check-Out: Never invent a synthetic 10 PM checkout. Past shifts without check_out_at earn ₹0, block new check-ins until Super Admin corrects them, and block cycle finalization / official salary slips.
Half-Day Rule: Default minimumHalfDayMinutes = 0 means half-day punches go to Review Required (₹0) until Super Admin approves (ADMIN_REVIEW_APPROVED). Setting 180 or 240 auto-approves eligible half days.
Breaks & Unapproved Absences: Both are stored in breaks_json (admin unapproved absences use prefix 'Admin - unapproved absence: '). Overlapping intervals are merged and deducted once (calculateWorkMinutes).
Weekly Offs & Holidays: Excluded from scheduled workingDays. Working on an off-day is tracked in offDayWorkMinutes separately and does not add overtime pay.
Finalized Cycles: Once a completed cycle is in attendance_cycle_snapshots, assertCycleUnlocked() blocks any punch or edit inside [cycle_start_date, cycle_end_date].
Caching & Crons (vercel.json):
Public HTML routes: s-maxage=60, stale-while-revalidate=300.
/img/* & /certificates/:file.webp: 7-day cache; /assets/*: 1-year immutable.
/admin/* & /attendance/*: strictly private, no-store, noindex.
Crons (require CRON_SECRET): /api/cron/policy-watch (0 8 * * 1, Mon 08:00 UTC) and /api/cron/attendance-cleanup (0 0 * * *, daily 00:00 UTC / 05:30 IST).
7. CI & Verification Commands

Before merging any PR, GitHub Actions (.github/workflows/preview-checks.yml) runs:

pnpm run typecheck
pnpm run test:attendance
pnpm run test:attendance:server
pnpm run test:site
pnpm run test:database:migration
pnpm run test:database:backup
pnpm run test:attendance:mysql
pnpm run build
pnpm run audit:source
pnpm run test:http
8. Verified Audit Backlog (Checked 2026-11-18)

Track fixes here as they are shipped (mark [x] once merged):

 Round 3 (Attendance & Payroll): saveEmployee policy history & finalized-cycle guard, AttendancePanel calendar & silent refresh history preservation, attendance.$token.tsx mobile leave/camera/rollover/break-confirm/badges fixes.
 Round 4 (/ponytail-audit fixes):
src/routes/study-plan.$slug.tsx: loadedKey prevents cross-country localStorage overwrite.
src/lib/admin-functions.ts: updateSettings updates only the 4 control columns; policy notice mutations invalidate public cache.
src/routes/api.cron.attendance-cleanup.ts: 60-day cutoff now uses todayIstDate() (matches Admin preview).
src/components/admin/ManualSalarySlips.tsx: form key syncs with selected month.
src/lib/public-functions.ts: 8s in-memory cache added to getPublicPolicyNotices().
src/lib/attendance.server.ts: autoCloseOpenCheckIns() SQL filters out already-flagged rows.
src/lib/attendance-functions.ts: single-pass .flatMap() JSON parse for slip adjustments.
src/lib/db.server.ts: fresh DB default popup_delay_seconds aligned to 25.
src/components/BoardingPassGenerator.tsx: canonical www. share URL.
Dead code removed: deleted app.config.ts and unused exports (writeCountryCatalogState, isTrustedPolicySourceUrl, certificateCategories, asFaqList, asTrustStatList).
Added MySQL CI tests in tests/admin-mysql.test.mjs and tests/attendance-mysql.test.mjs.
 Local / Codespace-only Housekeeping (do NOT run via GitHub Web UI):
Remove tracked stale .output/ folder (68 files, 3.49 MB): git rm -r --cached .output
Remove unused packages (updates pnpm-lock.yaml cleanly): pnpm remove jose @netlify/vite-plugin-tanstack-start
