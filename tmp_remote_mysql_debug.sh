set -x
mysql --version
mysql -uroot -pJatni@752050 -D robodynamics_db -N -s -e "SHOW TABLES LIKE '%vida%';"
echo EXIT_CODE:$?
