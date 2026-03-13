set -x
mysql -uroot -pJatni@752050 robodynamics_db < /tmp/VIDAPATH_GRADE_BASED_REFRESH_2026_02_28.sql 2>&1
echo MYSQL_RC:$?
