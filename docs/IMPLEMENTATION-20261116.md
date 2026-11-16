# Attendance changes and whole-site audit

Branch: preview/admin-theme-attendance-20261114. This implements the eight findings from CODE-REVIEW-20261116.md. Existing administrator authentication/password settings remain outside this change.

| Finding | Result |
| --- | --- |
| One-minute shifts earning half-day salary | Separate configurable minimum half-day minutes. Default 0 requires review for short shifts; it does not award a zero-minute half-day. Review rows earn no automatic salary and block finalization. Explicit Super Admin Half Day approval remains possible with audit evidence. |
| Open manual shifts overlapping later shifts | Unbounded-end overlap comparison under the employee transaction lock. Both insertion orders have regressions. Completed manual shifts over 24 hours are rejected. |
| Missing overnight correction dates | Before/after UTC timestamps, status, net/break minutes and late flag saved for every correction. Complete dates appear in the summary, modal and workbook. |
| Existing schema skipping migrations | Versioned migrations add missing columns on existing installations without repopulating empty content. Repeated startup and duplicate-column races are handled. |
| Heavy polling | Selected and next month fetched instead of four months; lightweight background polls omit correction history and duplicate finalization request. Record history loads on demand; policies filter by employee/range. Read handlers no longer scan all missing OUT records. |
| Partial enquiry deletion | Enquiry and activity deletion use one database transaction. |
| Lost policy-change evidence | Policy audit appends actor, reason, effective date and before/after values in the same transaction. Changes require a reason. Dated effective-policy behavior remains intact. |
| No off-site recovery | Encrypted consistent-snapshot export, private-upload workflow and empty-target restoration utility. Activation is pending private credentials/storage and a production-compatible restore drill. |

Employee Settings now accepts the business's agreed minimum half-day minutes, effective date and policy-change reason. Existing unapproved short Half Day rows require review; finalized saved reports retain their values. Full-day and Paid Leave behavior remain intact. Half Day OUT caps the result according to configured thresholds.

Previous selfie display mirroring, persisted admin/attendance tabs and 30-second background refresh are retained. Physical camera/GPS and real browser interaction are not proven by source checks.

## Coverage

npm run audit:source inventories all tracked and unignored files. It records every JavaScript/TypeScript SourceFile/Block line range and file SHA-256 in AUDIT-INVENTORY.csv; generated outputs are explicitly labelled. All blocks receive syntax scanning. Configuration, styles and assets receive inventory and applicable build/runtime checks. AUDIT-STATIC-FLAGS.csv lists selected JSX accessibility/link/injection checks. Both CSVs are downloadable in the source-audit artifact of each successful Preview checks run.

This is complete STATIC inventory, not a claim that every block received manual semantic review or that every possible scenario is bug-free. Manual critical-path review covered attendance/punches/breaks/payroll/finalization/evidence, migrations/transactions, admin/public content handlers, policy ingestion, country catalog, settings defaults, media URL validation, spreadsheet output, enquiry submission/deletion and refresh integration. Other components/routes receive type/build/static and applicable HTTP checks. Physical devices, production load, live external integrations and full accessibility testing remain separate.

New public utility regressions cover hostile video host lookalikes/credentials, IST/leap-date boundaries, canonical paths/description lengths and eligibility score/checklist behavior. Database regressions cover overlap insertion order, overnight history, short-shift approval, migration restart, rollback, export and encrypted recovery. See VERIFICATION-20261116.md for actual outcomes.

## Further improvements found

| Priority | Area | Follow-up |
| --- | --- | --- |
| High / operations | Backups | Configure private storage/secrets, scheduler and a production-compatible recovery drill; see BACKUP-SETUP.md. Code presence alone provides no automatic backup protection. |
| Medium | Policy Watch | Lock/serialize concurrent notice-state updates to avoid read-modify-write conflicts between ingestion and admin edits; add a focused concurrency regression. |
| Medium | TiDB usage | Measure actual query/read units and media usage before estimating a free-tier monthly allowance. Employee count alone does not determine total-site consumption. |
| Medium | Browser coverage | Add actual browser regressions for refresh/tab persistence, modal keyboard/focus, mobile navigation and permission recovery. |
| Low | Repository maintenance | Separate tracked generated deployment output from source after validating the deployment pipeline. Existing generated artifacts were retained. |
