mysql -uroot -pJatni@752050 -D robodynamics_db --batch --raw -e "
SELECT
  t.course_id,
  t.course_name,
  t.subject_bucket,
  t.course_session_id,
  t.session_order,
  t.session_title,
  t.pdf_count,
  COALESCE(t.sample_pdf,'') AS sample_pdf,
  t.question_count,
  t.active_question_count
FROM (
  SELECT
    s.course_id,
    c.course_name,
    CASE
      WHEN LOWER(c.course_name) REGEXP 'math|mathematics|algebra|geometry|mensuration|trigonometry' THEN 'MATH'
      WHEN LOWER(c.course_name) REGEXP 'physics' THEN 'PHYSICS'
      WHEN LOWER(c.course_name) REGEXP 'chemistry' THEN 'CHEMISTRY'
      WHEN LOWER(c.course_name) REGEXP 'biology' THEN 'BIOLOGY'
      WHEN LOWER(c.course_name) REGEXP 'science' THEN 'SCIENCE'
      WHEN LOWER(c.course_name) REGEXP 'hindi' THEN 'HINDI'
      WHEN LOWER(c.course_name) REGEXP 'english' THEN 'ENGLISH'
      WHEN LOWER(c.course_name) REGEXP 'social|history|geography|civics|economics|political' THEN 'SOCIAL'
      WHEN LOWER(c.course_name) REGEXP 'computer|coding|java|python|program' THEN 'COMPUTER'
      ELSE 'OTHER'
    END AS subject_bucket,
    s.course_session_id,
    COALESCE(s.session_id,'') AS session_order,
    COALESCE(s.session_title,'') AS session_title,
    COUNT(DISTINCT CASE WHEN LOWER(COALESCE(d.type,''))='pdf' THEN d.course_session_detail_id END) AS pdf_count,
    MIN(CASE WHEN LOWER(COALESCE(d.type,''))='pdf' THEN d.file END) AS sample_pdf,
    COUNT(DISTINCT q.question_id) AS question_count,
    COUNT(DISTINCT CASE WHEN q.is_active=1 THEN q.question_id END) AS active_question_count
  FROM rd_course_sessions s
  JOIN rd_courses c ON c.course_id = s.course_id
  LEFT JOIN rd_course_session_details d ON d.course_session_id = s.course_session_id
  LEFT JOIN rd_quiz_questions q ON q.course_session_id = s.course_session_id
  WHERE c.is_active = 1
    AND s.session_type='session'
    AND LOWER(COALESCE(c.course_name,'')) REGEXP '(cbse|icse)'
    AND LOWER(COALESCE(c.course_name,'')) REGEXP '(grade|class)'
  GROUP BY s.course_id, c.course_name, s.course_session_id, s.session_id, s.session_title
) t
WHERE t.pdf_count > 0 AND t.question_count = 0
ORDER BY t.subject_bucket, t.course_id, t.course_session_id;
"
