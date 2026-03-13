mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT c.course_id,
       c.course_name,
       c.is_active,
       SUM(CASE WHEN s.session_type='session' THEN 1 ELSE 0 END) AS chapter_count,
       SUM(CASE WHEN q.question_id IS NOT NULL THEN 1 ELSE 0 END) AS total_questions,
       SUM(CASE WHEN d.course_session_detail_id IS NOT NULL THEN 1 ELSE 0 END) AS pdf_rows
FROM rd_courses c
LEFT JOIN rd_course_sessions s ON s.course_id = c.course_id
LEFT JOIN rd_quiz_questions q ON q.course_session_id = s.course_session_id
LEFT JOIN rd_course_session_details d ON d.course_session_id = s.course_session_id AND LOWER(COALESCE(d.type,''))='pdf'
WHERE c.is_active = 1
  AND LOWER(COALESCE(c.course_name,'')) REGEXP '(cbse|icse)'
  AND LOWER(COALESCE(c.course_name,'')) REGEXP '(grade|class)'
  AND LOWER(COALESCE(c.course_name,'')) REGEXP '(math|mathematics)'
GROUP BY c.course_id, c.course_name, c.is_active
ORDER BY c.course_id;"