# Attendance operations

## Pause checkpoint - 14 November 2026

Work is paused at the user's request. Resume on Monday, 16 November, only when the user returns. Branch: `preview/admin-theme-attendance-20261114`; never merge/push `main` without explicit instruction.

Completed: attendance reliability fixes, employee payroll policies, archival, calendar/timeline/review views, Excel/CSV exports, finalization locks, scheduled cleanup route and preview CI. Final consolidated type-check, nine calculation tests, and production build passed. Admin login/default password unchanged.

Pending: preview deployment/CI outcome; test against preview MySQL (fresh and existing schema), simultaneous punches/corrections/finalization, real employee camera/GPS/network flows, sample Excel/CSV and finalized payroll comparisons. Browser verification could not complete because the preview browser did not attach. Check CRON_SECRET and hosting schedule activation. A full public-site SEO/performance/accessibility audit is still pending. Browser location/VPN/device checks remain evidence-based, not spoof-proof. Cycle changes after attendance exists require a separate reviewed transition, currently blocked.

Local checkout: `C:\Users\PRADEEP\Documents\ChatGPT\website\repo`. Run `pnpm run typecheck`, `pnpm run test:attendance`, `pnpm run build`; optional `PREVIEW_BUILD_DIR` for isolated output. Do not include legacy generated `.output` or local dependencies in the next commit.

Attendance is available under Super Admin. Employees receive a private attendance link and optional PIN. Each punch requires location; office radius, GPS accuracy, selfie and office public IP rules are enforced on the server according to workplace settings. The employee portal does not return salary, contact, network or GPS audit records.

## Reporting rules

- A missing OUT remains pending review: no synthetic 10 PM checkout or invented working hours.
- Existing automatic 10 PM checkouts require a reasoned Super Admin correction before payroll finalization.
- Net hours subtract the union of break intervals, clipped to the shift. Overnight shifts can be closed within 24 hours; older incomplete shifts require admin correction.
- Cycle starts support days 1-31. Short months clamp the boundary to the last date, and the next cycle starts at that boundary without overlap.
- Weekly offs and holidays are excluded from scheduled working days. Work on those days is shown separately and does not automatically increase salary. Paid leave is payable; legacy Leave and Unpaid Leave are unpaid.
- Joining/leaving dates limit eligible days. Salary, schedule, grace and leave policy changes have effective dates. Existing profiles get a baseline policy when first edited.
- Cycle day changes are blocked once attendance exists, preventing historical overlaps/gaps. A cycle transition would require a separately reviewed migration.
- Only completed cycles without unresolved OUTs can be finalized. Finalization preserves the summary and daily records and locks further punches/corrections in the period.
- Excel exports include summary, daily GPS logs, breaks, corrections and original punch events. CSV exports contain cycle/payroll summaries. Archived employees keep historical records.

## Setup and deployment

Schema extensions are idempotent and run on first attendance access. Preview should use a separate test database; do not point a test run at production attendance data. Tables added are `employee_policy_history`, `attendance_original_punches`, `attendance_punch_events`, and `attendance_cycle_snapshots`, alongside the existing employees/logs/history tables.

The daily `/api/cron/attendance-cleanup` job requires `CRON_SECRET`. It removes photo bytes older than 60 days in bounded batches while preserving attendance/audit records. This route is authenticated and scheduled in `vercel.json`; verify the host activates the schedule for the intended environment. A preview deployment alone does not prove scheduled jobs execute.

Browser device binding is a localStorage identifier and is not hardware attestation. Camera capture is evidence, not verified facial identity or liveness. Browser GPS can be spoofed; country/IP mismatch checks cannot reliably detect every VPN, especially Indian exit nodes. Trusted deployment proxy headers and the approved office public IP provide additional checks, not a spoof-proof guarantee. Existing admin login/default password behavior is unchanged.

## Validation

`pnpm run test:attendance`, `pnpm run typecheck`, and `pnpm run build` are enforced by preview CI. The calculation suite covers short/leap months, overnight/break hours, off-day pay, missing/automatic OUT review, joining/leaving policies and effective salary/cycle history. Live MySQL concurrency, mobile GPS/camera permission flows and payroll exports with real records still require testing against the configured preview database and physical devices.

`PREVIEW_BUILD_DIR` optionally isolates build output from the repository's legacy checked-in `.output` files. Normal deployment output is unchanged when the variable is absent.
