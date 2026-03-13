#!/bin/bash
set -euo pipefail
mysql -t robodynamics_db <<'SQL'
SELECT user_id, user_name, first_name, last_name, profile_id, active, grade, mom_user_id, dad_user_id
FROM rd_users
WHERE lower(user_name) LIKE '%sashank%'
   OR lower(first_name) LIKE '%sashank%'
   OR lower(last_name) LIKE '%sashank%';
SQL
