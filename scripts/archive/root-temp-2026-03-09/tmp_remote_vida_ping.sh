set -x
mysql --version
mysql -uroot -pJatni@752050 -D robodynamics_db -N -s -e "SELECT 'PING';"
mysql -uroot -pJatni@752050 -D robodynamics_db -N -s -e "SELECT COUNT(*) FROM vida_path_question_bank;"
