mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT s.course_id,
       c.course_name,
       s.course_session_id,
       s.session_id,
       COALESCE(s.session_title,'') AS session_title,
       COUNT(DISTINCT q.question_id) AS question_count,
       COUNT(DISTINCT CASE WHEN LOWER(COALESCE(d.type,''))='pdf' THEN d.course_session_detail_id END) AS pdf_count,
       MIN(CASE WHEN LOWER(COALESCE(d.type,''))='pdf' THEN d.file END) AS sample_pdf
FROM rd_course_sessions s
JOIN rd_courses c ON c.course_id = s.course_id
LEFT JOIN rd_quiz_questions q ON q.course_session_id = s.course_session_id
LEFT JOIN rd_course_session_details d ON d.course_session_id = s.course_session_id
WHERE c.is_active = 1
  AND s.session_type='session'
  AND LOWER(COALESCE(c.course_name,'')) REGEXP '(cbse|icse)'
  AND LOWER(COALESCE(c.course_name,'')) REGEXP '(grade|class)'
  AND LOWER(COALESCE(c.course_name,'')) REGEXP '(math|mathematics)'
GROUP BY s.course_id, c.course_name, s.course_session_id, s.session_id, s.session_title
ORDER BY s.course_id, s.course_session_id;"