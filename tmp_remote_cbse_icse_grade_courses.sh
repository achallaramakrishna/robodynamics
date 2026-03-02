mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT c.course_id,
       c.course_name,
       c.course_level,
       c.grade_range,
       c.category,
       c.is_active,
       SUM(CASE WHEN s.session_type='session' THEN 1 ELSE 0 END) AS chapter_count
FROM rd_courses c
LEFT JOIN rd_course_sessions s ON s.course_id = c.course_id
WHERE c.is_active = 1
  AND LOWER(COALESCE(c.course_name,'')) REGEXP '(cbse|icse)'
  AND LOWER(COALESCE(c.course_name,'')) REGEXP '(grade|class)'
GROUP BY c.course_id, c.course_name, c.course_level, c.grade_range, c.category, c.is_active
ORDER BY c.course_id;"