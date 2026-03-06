set -e
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT DISTINCT course_level,grade_range FROM rd_courses WHERE course_level IN ('9','10','11','12') ORDER BY course_level,grade_range;"
