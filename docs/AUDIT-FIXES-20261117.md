# Audit implementation and verification — 17 November 2026

Branch: `preview/admin-theme-attendance-20261114`.

## Verification evidence

GitHub Actions run [44015409307](https://github.com/britisheducationimmigration-glitch/sangaria-website/actions/runs/44015409307) passed every step at commit `c37a8cf6658c93288580e8d7f891dc272ffaca5a`.

| Command | Result |
|---|---|
| pnpm run typecheck | Passed |
| pnpm run test:attendance | 11 passed, 0 failed, 0 skipped |
| pnpm run test:attendance:server | 10 passed, 0 failed, 0 skipped |
| pnpm run test:site | 5 passed, 0 failed, 0 skipped |
| pnpm run test:database:migration | 1 passed, 0 failed, 0 skipped |
| pnpm run test:database:backup | 1 passed, 0 failed, 0 skipped |
| pnpm run test:attendance:mysql | 25 TAP tests including parent groups, 0 failed, 0 skipped |
| pnpm run build | Passed |
| pnpm run test:http | 19 routes passed |
| pnpm run audit:source | Passed; inventory attached to CI run |

MySQL tests use the disposable `attendance_test` database only. No production records, photos, or employee profiles were deleted or altered during testing. Local npm equivalents also passed typecheck, unit/server tests, isolated-output production build and HTTP smoke. The default local output folder was locked by Windows; `PREVIEW_BUILD_DIR` selected a separate output directory.

Before fixes, executable regression tests failed for automatic-checkout finalization, invalid holiday handling, and multiple office IPs. Other findings were verified against current source and covered by post-change tests where relevant; a pre-fix executable reproduction was not recorded for every visual issue.

## Per-issue changes

Paths below are relative to the repository. A source review is not a claim of live browser verification.

| Issue | Reproduction / finding | Changed files | Verification |
|---|---|---|---|
| 01 | Same-month polling replaced empty date filter | AttendancePanel.tsx | Month ref preserves filters; typecheck/build |
| 02 | Modal reused employee save error | AttendancePanel.tsx | Add/Edit/Close clear error; typecheck |
| 03 | Future policy overwrote current fields | attendance-functions.ts | MySQL scheduled salary/current profile/historical reports pass |
| 04 | Admin OUT left open break interval | attendance-functions.ts | MySQL verifies closed break and net minutes |
| 05 | Leave retained shift breaks | attendance-functions.ts | MySQL verifies empty breaks and zero break minutes |
| 06 | Punch break totals summed overlapping intervals | attendance-calculations.ts, attendance-functions.ts, attendance.server.ts | Merged intervals regression and MySQL absence/OUT pass |
| 07 | Working statuses accepted missing times | attendance-functions.ts, AttendancePanel.tsx | Validators and MySQL pass; open shifts show In Progress/Missing OUT, earn zero; past existing open shift permits absence note only |
| 08 | Automatic checkout omitted from review count | attendance-calculations.ts | Test failed before fix; now approval removes blocker |
| 09 | Zero minimum half-day threshold unclear | AttendanceModals.tsx | Helper explains approval and zero pay; build |
| 10 | Next-day punch/correction accepted | attendance-functions.ts, AttendanceModals.tsx, attendance.$token.tsx, tests | Daytime server rejection and previous-missing-OUT portal tests pass; pure interval arithmetic remains general |
| 11 | Employee IN did not inspect admin shifts ending after now | attendance-functions.ts | Server overlap query; existing concurrent punch/MySQL suite pass |
| 12 | Single Wi-Fi IP, fractional GPS accuracy, no timeout retry | attendance.server.ts, attendance-functions.ts, attendance.$token.tsx | Multi-IP regression pass; rounded UI, one timeout retry using recent fix; physical GPS remains unverified |
| 13 | Invalid holidays discarded; blur-dependent input | AttendanceModals.tsx, attendance-functions.ts | Controlled textarea, all entries validated; invalid/impossible tests pass |
| 14 | CSV invoked another server function | attendance-functions.ts | Shared plain snapshot builder; MySQL CSV test pass |
| 15 | UTC enquiry date boundaries | admin-functions.ts, admin.tsx | MySQL verifies 00:30 IST belongs to correct date |
| 16 | Lists/queue/charts depended on latest 150 | admin-functions.ts, content-types.ts, TailAdminDashboard.tsx, admin.tsx | MySQL 260 leads / 205 New verifies page 5, aggregates and overdue query; Review Queue uses paginated New/Overdue requests |
| 17 | Follow-up DATETIME converted through Node timezone | admin-functions.ts | SQL formatted local follow-up preserved in MySQL test |
| 18 | Jump target hidden under header; duplicate boarding ID | index.tsx, CertificateCarousel.tsx, BoardingPassGenerator.tsx | Scroll margins and useId-based unique IDs; build; visual positioning pending |
| 19 | Nested Escape closed competing dialogs | EnquiryPopup.tsx, EnquiryForm.tsx | Parent suspends keyboard handler while share prompt open; child closes and completes; build; browser interaction pending |
| 20 | Phone pattern limited formatted input | EnquiryForm.tsx | 10–20 characters with escaped HTML pattern punctuation; build |
| 21 | Concurrent policy read/modify/write lost updates | policy-watch.server.ts, admin-functions.ts | All notice/review writers share transaction lock; scanner fetches first then merges; concurrent MySQL save/delete test pass; URL parsed strictly |
| 22 | Custom destination retained old fields; invalid date; raw duplicate slug error | StoryEditor.tsx, Cards.tsx, admin-functions.ts | Custom reset, date guards, duplicate lookup; typecheck/build |
| 23 | Comparison bar overlapped floating WhatsApp | countries.index.tsx | Raised sm+ bar; build; 390/640/768/1280 visual check pending |
| 24 | Boarding dialog semantics/keyboard/focus; opener access | BoardingPassGenerator.tsx, FamilyCashflowPlanner.tsx | Dialog roles, focus restore/trap, Escape ownership, no opener on share/print; build; browser interaction pending |
| 25 | Rate-limit secret setup unclear | README.md | Documents private SESSION_SECRET >=32 chars and fail-closed behavior |
| 26 | Cashflow edits lacked navigation guard/schema validation | admin.tsx, admin-functions.ts | Parent dirty state, beforeunload, nested server validation; malformed payload test pass |
| 27 | Batch dirty state not visible to parent | admin.tsx | Parent guard wired to BatchPanel; typecheck/build |
| 28 | Super Admin could downgrade own account | admin-functions.ts | Self-demotion rejected before DB; boundary test pass |
| 29 | New certificate order zero conflicted with UI minimum | admin-functions.ts, CertificatePanel.tsx | Transactional ordered insert at 1, UI draft uses 1; build |
| 30 | Missing overdue pill and formatted tel targets | admin.tsx, SiteHeader.tsx, SiteFooter.tsx, contact.tsx | Overdue pill and digits/plus-only tel targets; typecheck/build |
| 31 | Workbook width lists short; CSV filter filename absent | attendance-functions.ts | Widths padded to 19; filtered CSV filename MySQL test pass |
| 32 | Extra finalization request per panel load | AttendancePanel.tsx | Uses snapshot summary.finalized; typecheck/build |
| 33 | Archive labels/default employee selection | AttendanceModals.tsx, AttendancePanel.tsx | Archived option labels and active manual-entry default; typecheck/build |
| 34 | No manual cleanup fallback / missing check-in count | attendance-functions.ts, AttendancePanel.tsx | Super Admin middleware, count preview, explicit confirmation, bounded 2000-record photo-only cleanup; no live cleanup executed; current-month count |
| 35 | Hero preload ran on every route | __root.tsx, index.tsx | Preload moved into homepage head; build |
| 36 | Cron string comparison / seed and rewrite checks | cron-secret.server.ts, both cron routes, tests | Timing-safe comparison tests pass; existing DB migration avoids seed invocation, deleted samples stay deleted; built server routes pass. Live Vercel rewrite verification pending |

## Remaining environment verification

Browser access to the built local site timed out (`ERR_CONNECTION_TIMED_OUT`). The Vercel deployment overview redirected the separate test browser to login, preventing discovery/verification of that preview URL in that session. Therefore mobile 390x844 and desktop 1280x800 screenshots, zero-console-error claims, authenticated admin interactions, real camera/GPS behavior and live Vercel rewrite behavior are **not verified**. CI/build success must not be described as proof of those checks.

Auth/OAuth source files were excluded from these edits. Final branch and full baseline diff are checked before completion. Main was not merged or pushed.
