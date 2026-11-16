# Encrypted off-site database backup

Status: code supplied; production backups are NOT active. No private bucket, production backup credentials or encryption key have been supplied. Excel/CSV exports are useful reference copies, not full database backups.

## Coverage

The backup command exports base-table definitions and rows from one repeatable-read consistent snapshot, ordered by primary key in pages of 500. Attendance, database-stored photos, original evidence, corrections, policy audit, finalized payroll, enquiries and site settings are included. Tables without primary keys fail explicitly. Output is gzip-compressed and AES-256-GCM encrypted with a fresh nonce. The encryption key is stored independently.

Only successful exports are uploaded by the workflow to private S3 storage with server-side encryption. Application data is never uploaded as a GitHub artifact or committed to source. External image URLs, deployment secrets/provider settings, database accounts/grants, triggers/routines/views require separate preservation. Avoid concurrent schema deployments during export; row snapshots do not snapshot concurrent DDL.

## Activation

1. Create a private bucket, block public access and enable versioning. Restrict the upload identity to the database/ prefix; use a separate recovery identity for downloads. Configure lifecycle retention according to the business policy (for example 30 daily copies). Monthly archives need a separate archive/lifecycle arrangement; the workflow does not create them.
2. Create GitHub environment database-backup. Add secrets BACKUP_DATABASE_URL, BACKUP_ENCRYPTION_KEY, BACKUP_AWS_ACCESS_KEY_ID and BACKUP_AWS_SECRET_ACCESS_KEY. Grant the source database identity only the read/metadata permissions needed for export. Configure the database provider's runner network access and TLS connection options.
3. Generate 32 random bytes encoded as base64 in a trusted terminal, using Node crypto.randomBytes(32).toString('base64'). Store the value in the secret store/password manager and retain an independent recovery copy. Never commit it or print it in workflow logs. Losing the key makes backups unreadable; retain old keys after rotation.
4. Set variables BACKUP_BUCKET, BACKUP_AWS_REGION and DATABASE_BACKUP_ENABLED=true.
5. This work stays on preview/admin-theme-attendance-20261114. GitHub schedules run on the default branch; adding this file to preview does NOT activate scheduled backups. Normal workflow dispatch discovery also requires the workflow to exist on the default branch. An authorized default-branch merge or an external scheduler is required. No main-branch change was made.
6. After activation, run a real export, check the private object exists and perform the empty-target restore drill below. Enable failure notifications and monitor last-success age. The schedule is 21:00 UTC / 02:30 IST next day; scheduled jobs may be delayed. Daily backups can lose roughly a day of changes, longer after failed jobs. Configure provider point-in-time recovery if that is insufficient.

## Manual commands

Install locked dependencies. Set BACKUP_DATABASE_URL and BACKUP_ENCRYPTION_KEY securely in the process environment. Run npm run backup:database -- PATH/bei-20261116.bin using a NEW filename outside the source checkout. Copy only successful encrypted output to private off-site storage. A failed local export can leave an incomplete file; never treat it as a backup.

For restore, download a successful object and retrieve its matching key separately. Create a NEW EMPTY compatible database. Set RESTORE_DATABASE_URL to that new database and BACKUP_ENCRYPTION_KEY to the matching key, then run npm run restore:database -- PATH/bei-20261116.bin.

The tool refuses a nonempty target and authenticates the entire encrypted file before executing SQL. Recovery uses temporary plaintext on the recovery machine, removed on completion: use a trusted encrypted disk. A schema/SQL failure can leave this NEW database partially restored because MySQL DDL is not transactional; recreate the new destination before retrying. Never restore over live data.

Verify employee/log counts, photo bytes, original punch evidence, correction/policy records, finalized salary cycles, enquiries and public content. Compare a known employee's report. Test a private staging deployment against the recovered database before switching production; preserve the failed source for investigation.

CI exercises 502 rows across the pagination boundary, binary photo bytes, JSON, UTC timestamps, wrong-key rejection before table creation, and nonempty-target refusal. A real TiDB/provider recovery drill is still required. Compatibility reference: https://docs.pingcap.com/tidb/stable/sql-statement-start-transaction/.
