mysql -uroot -pJatni@752050 -D robodynamics_db --batch --raw -e "
SELECT
  c.course_id,
  c.course_name,
  COALESCE(c.course_level,'') AS course_level,
  COALESCE(c.grade_range,'') AS grade_range,
  COALESCE(c.category,'') AS category,
  c.is_active,
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
  COUNT(DISTINCT CASE WHEN s.session_type='session' THEN s.course_session_id END) AS chapter_count,
  COUNT(DISTINCT CASE WHEN s.session_type='session' AND LOWER(COALESCE(d.type,''))='pdf' THEN s.course_session_id END) AS chapters_with_pdf,
  COUNT(DISTINCT CASE WHEN s.session_type='session' AND q.question_id IS NOT NULL THEN s.course_session_id END) AS chapters_with_questions,
  COUNT(DISTINCT q.question_id) AS total_questions,
  COUNT(DISTINCT CASE WHEN q.is_active=1 THEN q.question_id END) AS active_questions
FROM rd_courses c
LEFT JOIN rd_course_sessions s ON s.course_id = c.course_id
LEFT JOIN rd_course_session_details d ON d.course_session_id = s.course_session_id
LEFT JOIN rd_quiz_questions q ON q.course_session_id = s.course_session_id
WHERE c.is_active = 1
  AND LOWER(COALESCE(c.course_name,'')) REGEXP '(cbse|icse)'
  AND LOWER(COALESCE(c.course_name,'')) REGEXP '(grade|class)'
GROUP BY c.course_id, c.course_name, c.course_level, c.grade_range, c.category, c.is_active
ORDER BY subject_bucket, c.course_id;
"
