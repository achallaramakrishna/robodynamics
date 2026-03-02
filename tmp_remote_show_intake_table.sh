set -e
mysql -uroot -p'Jatni@752050' -D robodynamics_db -e "SHOW CREATE TABLE rd_ci_intake_response\\G"
