# Attendance date filters, employee statements and salary ledger — 17 November 2026

## Usage

Daily Logs now has persistent Today, This Week, This Month and All Dates buttons plus the independent date picker. Weeks start Monday in IST. All Dates means the loaded report period, not an unbounded whole-database query; change the report month to browse older data. The snapshot includes the preceding six days for weeks crossing month boundaries. Date presets apply to table/timeline; calendar cells show the portion within the selected calendar month.

Open Attendance → Employee Statement & Payments. Choose an employee and inclusive From/To dates (up to 366 days, through today). Use selected payroll cycle copies that employee's cycle boundaries from the selected report month, capped at today. The daily sheet includes missing/no-punch dates, IN/OUT in IST, net minutes, merged break/absence minutes, payable fractions, estimated daily salary and notes/evidence intervals. Excel contains Salary Summary, Daily Attendance and Payments sheets.

## Salary rules

The existing calculation helper accepts an optional reporting window. Only earned/payable dates and log counts are clipped; the full payroll-cycle working-day denominator remains unchanged. Historical effective policies, weekly offs/holidays, joining/leaving bounds, no overtime, zero off-day pay, unapproved automatic OUT and incomplete/short shifts retain existing rules. Daily estimates are rounded individually; range totals are summed from rounded cycle subtotals, so daily rounded columns may differ slightly from the range total.

Complete finalized-cycle amounts use their preserved salary snapshots. A range cutting through a finalized cycle is explicitly labeled an estimate. Cycle-boundary policy changes creating gaps/overlaps fail with an explanatory error instead of silently dropping/double-counting days.

## Payments

Salary given records an already-made payment; it does not transfer money. Store employee, integer paise, actual payment date, paid-for From/To period, method, reference, mandatory note and actor. A unique request key and employee row lock make retries/double submissions idempotent. Payload changes with the same key are rejected. Mistakes are reversed with mandatory reason and actor/timestamp; original rows are retained.

Selected-range paid totals include only active payments whose complete allocated salary period falls inside the selected range. Partly overlapping payment periods are not prorated and trigger an allocation warning; pending is displayed as requiring review. Till-date pending uses all active payments made through today against earnings since the earliest recorded employment/attendance/report baseline. Overpayments appear as advance, not negative pending. Past payments not entered into this ledger are not guessed: enter genuine historical payment records before relying on the pending balance. Missing/under-review shifts make earnings provisional.

Super Admin middleware protects every report, export, payment and reversal endpoint. Payment history stays out of the employee portal. The salary_payments table is added idempotently in attendance reliability initialization. Full encrypted database backup automatically includes all base tables, including payments. Authorized employee permanent deletion removes its payment rows in the same transaction; archiving preserves them.

## Verification

Pure tests cover cross-month employee cycles, one-day report denominators, missing OUT, invalid cycle transitions and week/leap-year boundaries. MySQL regression covers daily report, Excel contents, partial payments, duplicate requests, altered retry payload, invalid amount, role restrictions, reversal history, overpaid balance and employee deletion cleanup. Existing migration/backup/payroll suites remain required in preview CI. Local typecheck, unit/server tests and isolated-output build passed before push. Auth/OAuth files are unchanged. Browser/device visual checks are not claimed.
