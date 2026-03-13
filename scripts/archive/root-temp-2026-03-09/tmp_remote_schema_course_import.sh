set -e
echo '=== DESCRIBE rd_courses ==='
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; DESCRIBE rd_courses;"
echo '=== DESCRIBE rd_course_sessions ==='
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; DESCRIBE rd_course_sessions;"
echo '=== DESCRIBE rd_course_session_details ==='
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; DESCRIBE rd_course_session_details;"
echo '=== COURSE CATEGORIES ==='
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT course_category_id,course_category_name FROM rd_course_categories ORDER BY course_category_id;"
echo '=== EXISTING CBSE/ICSE COURSES ==='
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT course_id,course_name,course_level,grade_range,category,is_active,course_category_id FROM rd_courses WHERE LOWER(COALESCE(course_name,'')) REGEXP '(cbse|icse|grade|class)' ORDER BY course_id;"
echo '=== SAMPLE COURSE SESSIONS (course_id=34 if exists) ==='
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT course_session_id,course_id,session_id,session_title,session_type,parent_session_id,tier_order FROM rd_course_sessions WHERE course_id=34 ORDER BY session_id,course_session_id LIMIT 100;"
echo '=== SAMPLE SESSION DETAILS (course_id=34) ==='
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT d.course_session_detail_id,d.course_session_id,d.course_id,d.session_detail_id,d.type,LEFT(COALESCE(d.topic,''),80),LEFT(COALESCE(d.file,''),120) FROM rd_course_session_details d WHERE d.course_id=34 ORDER BY d.course_session_id,d.session_detail_id,d.course_session_detail_id LIMIT 200;"
