set -e
mysql -uroot -pJatni@752050 -D robodynamics_db -e "SHOW TABLES LIKE 'rd_blog%'; SHOW TABLES LIKE '%blog%';"
