#!/usr/bin/env bash
set -euo pipefail
mysql -uroot -p'Jatni@752050' -Nse "SELECT COUNT(*) FROM robodynamics_db.rd_ci_subscription WHERE module_code='APTIPATH';"
mysql -uroot -p'Jatni@752050' -Nse "SELECT ci_subscription_id,status,plan_key,parent_user_id,student_user_id FROM robodynamics_db.rd_ci_subscription WHERE module_code='APTIPATH' ORDER BY ci_subscription_id DESC LIMIT 20;"
