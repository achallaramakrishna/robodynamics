mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT cs.course_session_id, cs.session_title,
       COUNT(qq.question_id) AS total_questions,
       SUM(CASE WHEN qq.question_id IS NOT NULL AND qq.question_type='multiple_choice' THEN 1 ELSE 0 END) AS mcq,
       SUM(CASE WHEN qq.question_id IS NOT NULL AND qq.question_type='short_answer' THEN 1 ELSE 0 END) AS short_answer,
       SUM(CASE WHEN qq.question_id IS NOT NULL AND qq.question_type='long_answer' THEN 1 ELSE 0 END) AS long_answer,
       SUM(CASE WHEN qq.question_id IS NOT NULL AND qq.question_type='fill_in_blank' THEN 1 ELSE 0 END) AS fill_in_blank,
       SUM(CASE WHEN qq.question_id IS NOT NULL AND (qq.question_type IS NULL OR TRIM(qq.question_type)='' OR qq.question_type NOT IN ('multiple_choice','short_answer','long_answer','fill_in_blank')) THEN 1 ELSE 0 END) AS other_type,
       SUM(CASE WHEN qq.question_id IS NOT NULL AND qq.correct_answer IS NOT NULL AND TRIM(qq.correct_answer) <> '' THEN 1 ELSE 0 END) AS with_correct_answer,
       SUM(CASE WHEN qq.question_id IS NOT NULL AND qq.additional_info IS NOT NULL AND TRIM(qq.additional_info) <> '' THEN 1 ELSE 0 END) AS with_additional_info,
       SUM(CASE WHEN qq.question_id IS NOT NULL AND qq.difficulty_level IN ('Easy','Medium','Hard','Expert','Master') THEN 1 ELSE 0 END) AS with_valid_difficulty
FROM rd_course_sessions cs
LEFT JOIN rd_quiz_questions qq
  ON qq.course_session_id = cs.course_session_id
WHERE cs.course_id = 34
  AND LOWER(TRIM(cs.session_type)) = 'session'
  AND cs.session_title LIKE 'Lesson %'
GROUP BY cs.course_session_id, cs.session_title
ORDER BY cs.course_session_id;
" 
