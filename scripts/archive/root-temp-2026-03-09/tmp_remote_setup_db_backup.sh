set -euo pipefail

mkdir -p /opt/robodynamics/docs/db_backups

cat > /root/.my.cnf <<'EOF'
[client]
user=root
password=Jatni@752050
host=localhost
EOF
chmod 600 /root/.my.cnf

cat > /usr/local/bin/rd_db_backup.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/opt/robodynamics/docs/db_backups"
DB_NAME="robodynamics_db"
RETENTION_DAYS="30"
TS="$(date +%Y%m%d_%H%M%S)"
TMP_SQL="${BACKUP_DIR}/.${DB_NAME}_${TS}.sql"
OUT_GZ="${BACKUP_DIR}/${DB_NAME}_${TS}.sql.gz"

mkdir -p "$BACKUP_DIR"

mysqldump --defaults-file=/root/.my.cnf \
  --single-transaction \
  --quick \
  --routines \
  --triggers \
  --events \
  --hex-blob \
  --set-gtid-purged=OFF \
  "$DB_NAME" > "$TMP_SQL"

gzip -f "$TMP_SQL"
mv "${TMP_SQL}.gz" "$OUT_GZ"
sha256sum "$OUT_GZ" > "${OUT_GZ}.sha256"

find "$BACKUP_DIR" -type f -name "${DB_NAME}_*.sql.gz" -mtime +"$RETENTION_DAYS" -delete
find "$BACKUP_DIR" -type f -name "${DB_NAME}_*.sql.gz.sha256" -mtime +"$RETENTION_DAYS" -delete

echo "BACKUP_OK $OUT_GZ"
EOF

chmod 700 /usr/local/bin/rd_db_backup.sh
/usr/local/bin/rd_db_backup.sh

CRON_LINE='20 2 */2 * * /usr/local/bin/rd_db_backup.sh >> /var/log/rd_db_backup.log 2>&1'
( crontab -l 2>/dev/null | grep -v '/usr/local/bin/rd_db_backup.sh' || true; echo "$CRON_LINE" ) | crontab -

echo "CRON_SET"
crontab -l | grep rd_db_backup || true

echo "LATEST_BACKUPS"
ls -1t /opt/robodynamics/docs/db_backups | head -n 6 || true
