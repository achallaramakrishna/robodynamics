set -e
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT course_category_id,category_name FROM rd_course_categories ORDER BY course_category_id;"
