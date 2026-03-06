#!/bin/bash
set -euo pipefail
DB='robodynamics_db'
USER_NAME='krishvi'
WORK='tmp_krishvi_sessions_delete'

USER_ID=$(mysql -uroot -p'Jatni@752050' -D "$DB" -N -s -e "SELECT user_id FROM rd_users WHERE user_name='${USER_NAME}' ORDER BY user_id DESC LIMIT 1;")
if [ -z "${USER_ID}" ]; then
  echo "USER_NOT_FOUND:${USER_NAME}"
  exit 1
fi

echo "USER_ID=${USER_ID}"

mysql -uroot -p'Jatni@752050' -D "$DB" -e "DROP TABLE IF EXISTS ${WORK}; CREATE TABLE ${WORK} (ci_assessment_session_id BIGINT PRIMARY KEY) ENGINE=InnoDB; INSERT INTO ${WORK} SELECT s.ci_assessment_session_id FROM rd_ci_assessment_session s JOIN rd_ci_subscription sub ON sub.ci_subscription_id=s.ci_subscription_id WHERE s.student_user_id=${USER_ID} AND UPPER(IFNULL(sub.module_code,''))='APTIPATH';"

mysql -uroot -p'Jatni@752050' -D "$DB" -N -s -e "SELECT CONCAT('SESSIONS_BEFORE=', COUNT(*)) FROM ${WORK};"

TABLES=$(mysql -uroot -p'Jatni@752050' -D "$DB" -N -s -e "SELECT DISTINCT table_name FROM information_schema.columns WHERE table_schema='${DB}' AND column_name='ci_assessment_session_id' AND table_name LIKE 'rd_ci_%' AND table_name <> 'rd_ci_assessment_session' ORDER BY table_name;")

for T in ${TABLES}; do
  mysql -uroot -p'Jatni@752050' -D "$DB" -e "DELETE FROM ${T} WHERE ci_assessment_session_id IN (SELECT ci_assessment_session_id FROM ${WORK});"
  echo "DELETED_FROM=${T}"
done

mysql -uroot -p'Jatni@752050' -D "$DB" -e "DELETE FROM rd_ci_assessment_session WHERE ci_assessment_session_id IN (SELECT ci_assessment_session_id FROM ${WORK});"
mysql -uroot -p'Jatni@752050' -D "$DB" -e "DROP TABLE IF EXISTS ${WORK};"

echo "KRISHVI_APTIPATH_SESSIONS_DELETED"

mysql -uroot -p'Jatni@752050' -D "$DB" -t -e "
SELECT COUNT(*) AS remaining_sessions
FROM rd_ci_assessment_session s
JOIN rd_ci_subscription sub ON sub.ci_subscription_id=s.ci_subscription_id
WHERE s.student_user_id=${USER_ID} AND UPPER(IFNULL(sub.module_code,''))='APTIPATH';
"
