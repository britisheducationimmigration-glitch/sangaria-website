# Archive or permanently delete an employee

Open Admin > Attendance > Employees. Both active and archived profiles have two separate actions:

- Archive: disables the attendance link and preserves attendance, selfies, salary reports and audit history.
- Permanently Delete: type the employee's exact full name in the confirmation prompt. This removes the selected employee, attendance/photos/breaks/GPS stored in those logs, original punch evidence/events, correction history, policy history/audit and finalized salary snapshots from the application database. Matching names are checked again on the server. The prompt also identifies the employee ID for duplicate names.

Permanent deletion is restricted to Super Admin and runs in one database transaction using the same employee lock as attendance writes. A failed SQL operation rolls the entire deletion back. Other employees' data is preserved. The old attendance link stops working. This feature does not delete an employee until an administrator uses the confirmation action.

There is no application undo. Previously downloaded reports, external copies and existing encrypted/provider backups are independent copies and are not erased by this operation; they follow their own retention policy. Restoring an older full backup can restore deleted records.

Regression coverage includes editor rejection, wrong-name refusal, partial-failure rollback, finalized-report removal, complete evidence/policy cleanup, unrelated employee preservation, expired portal link and repeated-deletion refusal. Production data is not used in these tests.
