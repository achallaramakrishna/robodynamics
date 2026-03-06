set -e
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT course_id,course_name,course_category_id,is_active FROM rd_courses WHERE LOWER(course_name) LIKE '%grade 9%' AND LOWER(course_name) LIKE '%math%' ORDER BY course_id;"
