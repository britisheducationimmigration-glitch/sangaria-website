# Attendance implementation and verification

Updated: 16 November 2026. Target branch: `preview/admin-theme-attendance-20261114`. Main branch and existing admin login/default password are outside these changes.

## What is implemented

The existing admin editors remain inside the TailAdmin-style shell. Attendance uses separate employee links, PIN verification when configured, location-required server validation, optional selfie evidence, browser registration, and optional office public-IP enforcement. Payroll and correction APIs require Super Admin on the server. Employee responses omit salary/contact/network/location audit fields.

| Data | Storage and behavior |
| --- | --- |
| Employee profile | `employees`; archive deactivates/revokes link, retains history |
| Effective payroll settings | `employee_policy_history`; dated salary, schedule, grace, weekly offs, holidays and employment dates |
| Attendance | `attendance_logs`; one employee/work-date record, UTC timestamps, GPS/IP and photo evidence |
| Breaks | Time and location events in `breaks_json`; overlapping intervals are merged/clipped for net hours |
| Original evidence | `attendance_original_punches` and append-only `attendance_punch_events`; admin corrections do not overwrite these |
| Corrections | `attendance_edit_history`; actor, time, change summary and reason, committed atomically with correction |
| Final payroll | `attendance_cycle_snapshots`; frozen summary and daily records, period locked against later punches/corrections |

Every mutation for a given employee serializes on the employee row in a database transaction. This includes punches, break updates, corrections and finalization. Single-row archive/token/device updates obtain the same row lock. An audit failure rolls back its attendance correction.

## Payroll rules

Cycles support 1–31; February and other short months clamp the boundary without overlaps. Once attendance exists, changing that employee's cycle day is blocked pending a separate reviewed transition. Joining/leaving dates limit eligibility. Weekly offs and holidays are excluded from scheduled working days. Off-day work is reported separately; it is not automatically paid as overtime. Paid Leave earns one scheduled day; Half Day earns half; Leave/Unpaid Leave do not earn pay. Salary changes use their effective date. Future unmarked days are not absences.

Missing OUT never invents a timestamp or hours. Legacy automatic 10 PM records require reasoned approval before payroll. Overnight employee shifts can close within 24 hours; older open shifts need admin correction. Manual overnight corrections have an explicit next-day OUT checkbox. Finalization is permitted only after the cycle ends and unresolved checkouts are corrected.

## Automated scenarios

| Suite | Scenarios |
| --- | --- |
| Pure calculations | Leap/short months, 31st boundary continuity, overnight hours, overlapping/clipped breaks, Sunday/off-day salary cap, incomplete punches, joining dates, paid leave, effective salary/cycle history, old automatic OUT, holidays |
| Server boundaries | Missing/invalid coordinates, nonpositive/weak accuracy, out-of-office rejection, foreign IP, exact office public IP, salted PIN verification, non-Super-Admin rejection for all admin APIs, impossible dates and invalid times |
| Actual MySQL | Fresh schema/idempotent startup, invalid punch rollback, selfie requirement, wrong PIN/device, duplicate/concurrent IN and breaks, net hours, sanitized employee response, original evidence, correction rollback on audit failure, finalized locks, salary stability, parallel finalization/correction, existing schema restart, overnight OUT, token regeneration and archival |
| Exports | Excel ZIP/XML structure and five worksheets; employee/salary/earned-pay values from the frozen snapshot; CSV content; breaks, corrections and original evidence exported |
| Production HTTP smoke | Home/countries/coaching/contact/admin, sitemap, robots, invalid employee link; unauthenticated photo rejection; unconfigured cleanup rejection; homepage title/description/canonical/H1; private URLs excluded from sitemap |

Run `pnpm run typecheck`, `pnpm run test:attendance`, `pnpm run test:attendance:server`, `pnpm run test:attendance:mysql`, `pnpm run build`, and `pnpm run test:http`.

The MySQL suite uses a disposable MySQL 8 CI service. It accepts only `TEST_DATABASE_URL` pointing to a database named `attendance_test` (optional suffix), never `DATABASE_URL`. Actual SQL, transactions, migrations, calculations and export code run unchanged; TanStack request transport, the clock and identity adapter are controlled test adapters. Thus it tests server behavior without changing real employee records. Tests are finite scenario coverage, not proof of every possible input.

## Deployment and limitations

The Saturday upload's encoding/escaped-quote corruption was repaired using exact file bytes. The repair's GitHub type-check/build and Vercel status passed. The first expanded run (`00560fd`) passed calculations, server boundaries, actual MySQL integration and production build with no skipped scenarios. Later additions must pass the same workflow plus HTTP smoke before acceptance; use the latest successful GitHub run as the authoritative status.

Live browser automation could not attach to the available browser. Physical phone camera/GPS permission flows, accuracy at the real office, accessibility interaction and visual layout are therefore not claimed as device-verified. Office coordinates/public IP must be configured for the real workplace. The cleanup route is CRON_SECRET-authenticated; verify that secret and production scheduler execution in the hosting account. Preview cron execution is not demonstrated by a successful preview build.

Browser location can be spoofed, the localStorage device key can be copied, and a camera image is not biometric identity/liveness proof. Foreign-IP and mismatch checks cannot detect every Indian VPN exit. Original evidence, exact trusted office IP and admin review improve auditability; they do not provide hardware attestation.

Photos are removed after 60 days by a bounded daily cleanup; attendance and original textual audit events remain. Ensure database backups and the configured host proxy headers before operational payroll use. No real payroll payment is initiated by this application.
