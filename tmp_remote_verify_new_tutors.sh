mysql -uroot -pJatni@752050 <<'SQL'
USE robodynamics_db;
SELECT 'COURSE' AS tag, course_id, course_name, course_category_id, category
FROM rd_courses
WHERE LOWER(course_name) IN ('aptitude and reasoning','financial literacy')
ORDER BY course_id;
SELECT 'OFFER' AS tag, o.course_id, o.course_offering_id, c.course_name
FROM rd_course_offerings o
JOIN rd_courses c ON c.course_id = o.course_id
WHERE LOWER(c.course_name) IN ('aptitude and reasoning','financial literacy')
  AND o.is_active = 1
ORDER BY o.course_id, o.course_offering_id;
SELECT 'SESSION' AS tag, cs.course_id, COUNT(*) AS session_count
FROM rd_course_sessions cs
WHERE cs.course_id IN (
  SELECT course_id FROM rd_courses WHERE LOWER(course_name) IN ('aptitude and reasoning','financial literacy')
)
  AND cs.session_type = 'session'
GROUP BY cs.course_id
ORDER BY cs.course_id;
SQL
