mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
WITH per_session AS (
  SELECT s.course_id,
         s.course_session_id,
         COUNT(DISTINCT q.question_id) AS question_count,
         COUNT(DISTINCT CASE WHEN LOWER(COALESCE(d.type,''))='pdf' THEN d.course_session_detail_id END) AS pdf_count
  FROM rd_course_sessions s
  LEFT JOIN rd_quiz_questions q ON q.course_session_id = s.course_session_id
  LEFT JOIN rd_course_session_details d ON d.course_session_id = s.course_session_id
  WHERE s.session_type='session'
  GROUP BY s.course_id, s.course_session_id
)
SELECT c.course_id,
       c.course_name,
       GROUP_CONCAT(ps.course_session_id ORDER BY ps.course_session_id SEPARATOR ',') AS session_ids,
       COUNT(*) AS total_sessions,
       SUM(CASE WHEN ps.pdf_count > 0 THEN 1 ELSE 0 END) AS sessions_with_pdf,
       SUM(CASE WHEN ps.question_count > 0 THEN 1 ELSE 0 END) AS sessions_with_questions,
       SUM(CASE WHEN ps.question_count = 0 THEN 1 ELSE 0 END) AS sessions_without_questions,
       SUM(ps.question_count) AS total_questions
FROM per_session ps
JOIN rd_courses c ON c.course_id = ps.course_id
WHERE c.is_active = 1
  AND LOWER(COALESCE(c.course_name,'')) REGEXP '(cbse|icse)'
  AND LOWER(COALESCE(c.course_name,'')) REGEXP '(grade|class)'
  AND LOWER(COALESCE(c.course_name,'')) REGEXP '(math|mathematics)'
GROUP BY c.course_id, c.course_name
ORDER BY c.course_id;"