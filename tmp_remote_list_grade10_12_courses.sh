set -e
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT course_id,course_name,course_category_id,course_level,grade_range,category,tier_level,tier_order,is_active FROM rd_courses WHERE course_name LIKE 'CBSE Grade 10%' OR course_name LIKE 'CBSE Grade 12%' ORDER BY course_id;"
