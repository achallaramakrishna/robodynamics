set +e
mysql -uroot -p'Jatni@752050' -N -s -D robodynamics_db -e "SELECT NOW(), DATABASE();" && echo MYSQL_OK || echo MYSQL_FAIL
mysql -uroot -p'Jatni@752050' -N -s -D robodynamics_db -e "SELECT ROUND(SUM(data_length+index_length)/1024/1024,2) FROM information_schema.tables WHERE table_schema='robodynamics_db';" || true
