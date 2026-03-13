set -e
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; DESCRIBE rd_course_categories;"
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT * FROM rd_course_categories LIMIT 30;"
