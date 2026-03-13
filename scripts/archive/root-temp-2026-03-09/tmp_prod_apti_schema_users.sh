#!/usr/bin/env bash
set -euo pipefail
mysql -uroot -p'Jatni@752050' -Nse "DESCRIBE robodynamics_db.rd_ci_subscription;"
mysql -uroot -p'Jatni@752050' -Nse "DESCRIBE robodynamics_db.rd_users;"
mysql -uroot -p'Jatni@752050' -Nse "SELECT user_id,user_name,password,profile_id,status FROM robodynamics_db.rd_users WHERE user_name LIKE 'parenttest%' OR user_name LIKE 'studenttest%' OR user_name LIKE '%apti%' OR user_name LIKE '%test%' ORDER BY user_id DESC LIMIT 80;"
