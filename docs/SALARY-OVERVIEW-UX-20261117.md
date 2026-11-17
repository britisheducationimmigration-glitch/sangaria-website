# Salary overview layout — 17 November 2026

The salary workspace now leads with the selected employee's till-date Earned, Paid, Pending and Advance cards. Attendance/date-range report, Record salary given and Payment history are keyboard-accessible native details/summary sections closed by default. Report dates, range totals and Excel actions are inside the report section; daily attendance remains a nested on-demand view. History shows its record count without exposing all rows initially.

Changing employees closes their disclosure sections and clears payment drafts only after an unsaved-data warning. The selected employee and allocated salary period remain explicit inside the payment form. Same-employee report refresh keeps disclosures mounted, preserving date-input focus; stale/mismatched reports cannot submit payments. Default dates are valid even if the parent month selector points to a future month.

No database, payroll formula, authorization, payment history or export rules changed. Validation uses typecheck, fresh production build and existing full preview CI. Browser visual verification is not claimed.
