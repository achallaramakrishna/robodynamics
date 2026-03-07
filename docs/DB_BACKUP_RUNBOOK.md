# Production MySQL Backup Runbook

## Scope
- Database: `robodynamics_db`
- Backup includes: structure + data + routines + triggers + events
- Backup location (prod): `/opt/robodynamics/docs/db_backups`

## Current Setup
- Backup script: `/usr/local/bin/rd_db_backup.sh`
- Secure MySQL client config: `/root/.my.cnf` (`chmod 600`)
- Cron schedule: `20 2 */2 * *` (every 2 days at 02:20 server time)
- Cron command:
  - `/usr/local/bin/rd_db_backup.sh >> /var/log/rd_db_backup.log 2>&1`

## Manual Backup
```bash
sudo /usr/local/bin/rd_db_backup.sh
```

Expected output:
```bash
BACKUP_OK /opt/robodynamics/docs/db_backups/robodynamics_db_YYYYMMDD_HHMMSS.sql.gz
```

## Verify Backup
```bash
ls -1t /opt/robodynamics/docs/db_backups | head
zcat /opt/robodynamics/docs/db_backups/robodynamics_db_YYYYMMDD_HHMMSS.sql.gz | head
sha256sum -c /opt/robodynamics/docs/db_backups/robodynamics_db_YYYYMMDD_HHMMSS.sql.gz.sha256
```

## Restore Backup (Careful)
```bash
gunzip -c /opt/robodynamics/docs/db_backups/robodynamics_db_YYYYMMDD_HHMMSS.sql.gz | mysql --defaults-file=/root/.my.cnf robodynamics_db
```

## Retention
- Current script retention: 30 days (`find ... -mtime +30 -delete`)
- Adjust in `/usr/local/bin/rd_db_backup.sh` by changing `RETENTION_DAYS`.

## Health Checks
```bash
crontab -l | grep rd_db_backup
tail -n 100 /var/log/rd_db_backup.log
```

## Off-Server Mirror (Local Docs Folder)

Use the local sync script to copy the latest prod backup into repo docs:
- [sync_prod_db_backup_to_docs.ps1](C:\roboworkspace\robodynamics\scripts\sync_prod_db_backup_to_docs.ps1)
- [run_sync_prod_db_backup_to_docs.ps1](C:\roboworkspace\robodynamics\scripts\run_sync_prod_db_backup_to_docs.ps1)

Target local folder:
- `docs/db_backups_prod`

Manual run (PowerShell):
```powershell
$env:RD_PROD_ROOT_PASSWORD = "YOUR_ROOT_PASSWORD"
powershell -ExecutionPolicy Bypass -File .\scripts\sync_prod_db_backup_to_docs.ps1
```

Schedule every 2 days (Task Scheduler):
- Program/script: `powershell.exe`
- Arguments:
```text
-ExecutionPolicy Bypass -File C:\roboworkspace\robodynamics\scripts\run_sync_prod_db_backup_to_docs.ps1
```
- Trigger: Daily, repeat every 2 days.
- Set environment variable `RD_PROD_ROOT_PASSWORD` for the task account.

Current registered task:
- Task Name: `\RoboDynamics\SyncProdDbBackupToDocs`
- Next Run: every 2 days at `03:10`
- Local log: `docs/db_backups_prod/sync.log`

Manual trigger:
```powershell
schtasks /Run /TN "\RoboDynamics\SyncProdDbBackupToDocs"
```
