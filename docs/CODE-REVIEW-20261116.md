# Code review — 16 November 2026

Reviewed baseline: `05cc86e3414177fd2038e95dde63e520b3b17c51`, branch `preview/admin-theme-attendance-20261114`.

Scope: attendance server handlers, payroll calculations, schema/bootstrap, admin refresh/navigation, public-content caching, enquiry deletion, photo serving and test workflow. This is a focused source review of critical paths, not a claim that every line or every business scenario is verified. Existing admin password/login/security changes remain excluded.

## Priority findings

### P1 — A very short shift can earn half-day salary
Locations: src/lib/attendance-functions.ts:311; src/lib/attendance-calculations.ts:65.
Employee OUT classifies any duration below halfDayMinutes as Half Day, including a one-minute shift. Payroll awards every completed Half Day 0.5 payable days. Reproduction on the existing calculation function: November 2026, monthlySalary=25000, a one-minute completed Half Day => payableDays=0.5, earnedSalary=500.
Recommendation: define separate minimum half-day and full-day thresholds, and mark insufficient hours for admin review or zero pay according to an explicitly agreed policy. Cover below-minimum, exact-boundary, zero-duration and explicit half_out cases. Do not silently invent the business thresholds.

### P1 — Open manual shifts are checked as a one-millisecond interval
Location: src/lib/attendance-functions.ts:556.
When manual IN has no OUT, overlap detection uses checkIn + 1 millisecond as the new interval end. A newly inserted earlier open shift can therefore pass even when a later completed shift already exists. For example, an open 09:00 shift on one date can overlap an existing 09:00–18:00 shift the following date.
Recommendation: reject creating an open shift before another later shift, or compare it as an open-ended interval. Test both insertion orders and midnight boundaries.

### P1 — Overnight correction history omits the changed date
Locations: src/lib/attendance-functions.ts:581–588.
Correction summary compares only HH:MM strings. Toggling next-day OUT while retaining the same clock time can add 24 hours but report “Record re-saved”. The original snapshot preserves the first record, but intermediate corrections are not fully represented by the human-readable audit.
Recommendation: store before/after UTC timestamps, net/break minutes and next-day changes per correction; display the local date and time.

### P1 — General database bootstrap skips migrations on existing databases
Location: src/lib/db.server.ts:128–132.
Finding site_settings immediately returns before subsequent column/table migrations. Existing deployments can miss new schema even though a fresh database works. Attendance has its own migration path, which does not repair the general bootstrap.
Recommendation: use a versioned migration table or run required idempotent schema upgrades independently of the “database exists” check. Add a legacy-schema fixture test for the real db.server path; current attendance tests substitute the general DB adapter.

### P2 — Auto-refresh repeatedly fetches a wide date range and all policy history
Locations: src/components/admin/AttendancePanel.tsx:49–99; src/lib/attendance-functions.ts:342–368; src/lib/attendance.server.ts:331–348.
Each eligible refresh loads employees, several months of logs, correction histories and all employee policies, plus a separate finalization call. Snapshot GET also invokes the global missing-OUT scan. This is unnecessary work for five employees and grows with history; on TiDB it consumes reads/RUs.
Recommendation: keep 30-second visible-page polling, but return lightweight current-day changes/summary; load employee/config/history on demand, paginate daily logs and filter policy history by employee/date. Move global maintenance to the existing authenticated cron. Measure actual RU consumption before adding caching or streaming infrastructure.

### P2 — Enquiry deletion is not atomic
Location: src/lib/admin-functions.ts:485–489.
Activities are deleted before the enquiry in separate database calls. If the second call fails, the lead remains without its history.
Recommendation: wrap both statements in one transaction, preserving the current Super Admin permission check.

### P2 — Payroll policy edits have no separate change audit
Location: src/lib/attendance-functions.ts:432.
Saving an existing effective date replaces policy_json in place. Finalized snapshots remain frozen, but earlier draft calculations and policy decisions can change without a before/after actor/reason record.
Recommendation: add a narrow policy-change audit and reason for retrospective changes; retain effective-date selection.

### Operational gap — off-site backup is not configured
The cleanup cron deletes old photo bytes; it is not a database backup. Excel/CSV are reports, not complete restorable backups. Configure an independent encrypted database export, retention and a restore drill separately. Do not place employee backups in the public GitHub repository.

## Applied selfie improvement
Both IN/OUT thumbnails and the full-image view display horizontally mirrored, matching the front-camera preview. Stored image bytes remain unchanged. The full mirrored view reuses the existing Super Admin photo authorization and private no-store responses. HTTP smoke now covers unauthenticated mirrored-view rejection.

## Suggested sequence
1. Agree the paid half/full-day minimum-hours policy and fix payroll/overlap regression cases.
2. Record complete before/after correction and policy evidence.
3. Repair general migration handling and atomic enquiry deletion.
4. Reduce attendance refresh query payloads and measure actual TiDB RU usage.
5. Configure off-site backups and test a restore.
6. Split large admin files only when modifying the relevant component; preserve working functions and avoid a framework rewrite for this scope.

## Verification boundary
The one-minute payroll example was executed against the current calculation code. Other findings are source-level analyses with explicit triggers above. Existing CI covers MySQL 8, not a real TiDB Cloud deployment or physical-device GPS/camera authenticity. The selfie update is validated by the normal preview type-check/build/server/HTTP checks; no real browser screenshot is claimed.
