set -e
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT course_id,course_name,course_category_id,course_level,grade_range,category,is_active FROM rd_courses WHERE course_id=163;"
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT COUNT(*) AS sessions, SUM(CASE WHEN LOWER(COALESCE(session_type,''))='session' THEN 1 ELSE 0 END) AS session_type_rows FROM rd_course_sessions WHERE course_id=163;"
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT COUNT(*) FROM rd_course_session_details WHERE course_id=163 AND LOWER(COALESCE(type,''))='pdf';"
ls -1 /opt/robodynamics/session_materials/163 | sed -n '1,20p'
