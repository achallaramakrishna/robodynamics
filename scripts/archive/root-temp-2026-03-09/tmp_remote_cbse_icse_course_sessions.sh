mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT c.course_id,
       c.course_name,
       c.course_level,
       c.grade_range,
       c.category,
       SUM(CASE WHEN s.session_type='session' THEN 1 ELSE 0 END) AS chapter_count,
       SUM(CASE WHEN s.session_type='unit' THEN 1 ELSE 0 END) AS unit_count
FROM rd_courses c
LEFT JOIN rd_course_sessions s ON s.course_id = c.course_id
WHERE (
  LOWER(COALESCE(c.course_name,'')) LIKE '%cbse%'
  OR LOWER(COALESCE(c.course_name,'')) LIKE '%icse%'
  OR LOWER(COALESCE(c.grade_range,'')) LIKE '%cbse%'
  OR LOWER(COALESCE(c.grade_range,'')) LIKE '%icse%'
  OR LOWER(COALESCE(c.category,'')) LIKE '%cbse%'
  OR LOWER(COALESCE(c.category,'')) LIKE '%icse%'
)
GROUP BY c.course_id, c.course_name, c.course_level, c.grade_range, c.category
ORDER BY c.course_id;"