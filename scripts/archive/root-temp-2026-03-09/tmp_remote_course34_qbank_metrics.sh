mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT 'SESSIONS', cs.course_session_id, cs.session_title
FROM rd_course_sessions cs
WHERE cs.course_id = 34 AND LOWER(TRIM(cs.session_type)) = 'session'
ORDER BY cs.course_session_id;

SELECT 'TYPE_COUNT', cs.course_session_id, cs.session_title,
       COALESCE(qq.question_type,'(null)') AS question_type,
       COUNT(*) AS cnt
FROM rd_course_sessions cs
LEFT JOIN rd_quiz_questions qq
  ON qq.course_session_id = cs.course_session_id
WHERE cs.course_id = 34 AND LOWER(TRIM(cs.session_type)) = 'session'
GROUP BY cs.course_session_id, cs.session_title, COALESCE(qq.question_type,'(null)')
ORDER BY cs.course_session_id, question_type;

SELECT 'QUALITY', cs.course_session_id, cs.session_title,
       COUNT(*) AS total_q,
       SUM(CASE WHEN qq.correct_answer IS NOT NULL AND TRIM(qq.correct_answer) <> '' THEN 1 ELSE 0 END) AS with_correct_answer,
       SUM(CASE WHEN qq.additional_info IS NOT NULL AND TRIM(qq.additional_info) <> '' THEN 1 ELSE 0 END) AS with_additional_info,
       SUM(CASE WHEN qq.difficulty_level IS NOT NULL THEN 1 ELSE 0 END) AS with_difficulty,
       SUM(CASE WHEN qq.question_type IN ('multiple_choice','short_answer','long_answer','fill_in_blank') THEN 1 ELSE 0 END) AS normalized_type
FROM rd_course_sessions cs
LEFT JOIN rd_quiz_questions qq
  ON qq.course_session_id = cs.course_session_id
WHERE cs.course_id = 34 AND LOWER(TRIM(cs.session_type)) = 'session'
GROUP BY cs.course_session_id, cs.session_title
ORDER BY cs.course_session_id;
" 
