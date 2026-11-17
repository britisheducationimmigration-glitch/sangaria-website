# Employee editing

An employee may be created with salary 0 and edited later to enter the agreed salary. Save no longer requires a separate payroll-change reason; a supplied note is retained, otherwise an automatic administrator-edit reason is recorded with actor and before/after policy values in the same transaction.

All employee form fields remain editable, including salary, name/contact, role, shift times, joining/leaving dates, hour thresholds, holidays/weekly offs, PIN, office restriction, active state and cycle start day. A cycle-day change no longer forces archiving the employee merely because punches exist. Policy effective date determines when payroll changes apply; historical dated policies and already finalized reports remain preserved. Overlapping finalized cycles still cannot be finalized again.

When an initial salary entered later should apply from joining, select the joining date in Policy effective from. Choose the actual change date for a subsequent salary revision. Save failures appear inside the employee modal so they cannot be hidden behind it. Existing date, PIN and numeric validation remains enforced.

SQL regression creates a zero-salary employee, edits all form fields without a reason, verifies stored values/PIN/audit, changes cycle after a punch while preserving the historical cycle, clears PIN and changes active state.
