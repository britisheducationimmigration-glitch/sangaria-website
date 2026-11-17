# Verified simplifications — 17 November 2026

- Shared the existing dateOnly algorithm across admin mapping, public mapping and sitemap without changing date-prefix/UTC semantics. Added regression cases.
- Removed the pass-through img wrapper and six ignored size-argument calls. Public asset URLs, image elements, alt text, loading and layout remain the same.
- Resolve dated policy once per eligible half-day review instead of repeating the filter/sort. Added threshold and approval cases using historical policy dates.

This is maintainability cleanup with one small reduction in repeated policy work. No measured speed, transfer-size or database-load improvement is claimed. Dependencies and generated output were not removed. Payroll formulas, auth, evidence and backup protections were not changed.

Local validation: typecheck, production build to isolated PREVIEW_BUILD_DIR, 19 HTTP smoke routes, calculation/site and server-boundary tests. Full MySQL/migration/backup regression checks run in preview CI using a disposable test database.

Branch cleanup review and exact eligible head SHAs: BRANCH-CLEANUP-20261117.md. No branch deletion was executed because Git write authentication is unavailable; the GitHub connector supports source commits but no delete-ref action.
