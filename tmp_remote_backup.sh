#!/bin/sh
set -e
ts=$(date +%Y%m%d_%H%M%S)
mysql -uroot -p'Jatni@752050' -Nse "SHOW TABLES LIKE 'rd_ci_question_bank';" robodynamics_db >/dev/null
if command -v mysqldump >/dev/null 2>&1; then
  mysqldump -uroot -p'Jatni@752050' robodynamics_db rd_ci_question_bank rd_ci_career_catalog rd_ci_career_adjustment > /tmp/aptipath_content_backup_${ts}.sql
  ls -lh /tmp/aptipath_content_backup_${ts}.sql
else
  echo "BACKUP_SKIPPED_NO_MYSQLDUMP"
fi
