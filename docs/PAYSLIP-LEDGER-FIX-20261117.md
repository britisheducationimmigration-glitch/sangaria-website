# Payslip and salary ledger consistency

Changes are based on main `25dcf5c` and prepared on `preview/admin-theme-attendance-20261114`.

## Behavior

- Issued slips contribute their net bonus/deduction (`netPay - earnedSalary`) to the salary balance, range statement and Excel workbook. Attendance earnings stay separate from these adjustments. Voided slips no longer contribute. Reissued slips contribute once.
- Adjustment effective date is the IST issue date, bounded to the slip's cycle. Old snapshots use their creation timestamp. Future-cycle adjustments do not count before their cycle begins. Daily attendance earnings remain attendance-only; Excel has a separate Slip Adjustments sheet explaining the difference.
- The optional paid field is the **total already paid for that cycle**, not a new payment amount. If 100 is already recorded and 600 is entered, only an additional 500 is saved to payment history. Leave it blank to derive the total from existing active payments.
- Additional payment and payslip save share the same employee lock and database transaction. Duplicate issuance is rejected. A failed save rolls back both. A method is required for an additional payment; date defaults to today if omitted. Payment period ends at today for a current cycle. Future-cycle manual payments are rejected.
- A lower paid total is rejected; correct an incorrect recorded payment through its existing reversal flow. Voiding a payslip does not reverse money actually paid. The UI explains this and warns against deducting an already recorded advance again.
- Payments straddling cycle boundaries block issuance until their allocation is corrected, so a manual total cannot silently duplicate an overlapping payment.
- Impossible dates, future payment dates, negative/nonfinite/oversized amounts and amounts with more than two decimal places are rejected server-side. Valid leap dates use the existing date helper.

## Historical data

Existing issued-slip bonuses/deductions are included automatically. Previously typed paid amounts that were never entered in payment history are not silently treated as proof of a payment. Review those records against receipts; void/reissue with the correct total or use Record salary given. Reissuing records only any difference from existing payments. No production records are rewritten by this change.

## Verification

- Local typecheck and calculation, boundary and site tests pass (33 tests, including a new payslip validation/authorization case).
- MySQL integration regression covers existing payment + additional payment, adjustment/date allocation, lower-total rejection, required method, duplicate issuance, void/reissue without duplicated payments, Excel and permanent employee cleanup.
- Local disposable MySQL is unavailable; the integration case must pass the branch's existing GitHub CI before merge. Fresh build/HTTP checks and CI results are recorded in the task response.

This change does not address the separate official-slip completion/finalization lifecycle finding from the audit.
