mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT 'TOTAL_LESSON_Q', COUNT(*)
FROM rd_quiz_questions q
JOIN rd_course_sessions cs ON cs.course_session_id=q.course_session_id
WHERE cs.course_id=34 AND LOWER(TRIM(cs.session_type))='session' AND cs.session_title LIKE 'Lesson %';

SELECT 'TOTAL_LESSON_OPTIONS', COUNT(*)
FROM rd_quiz_options o
JOIN rd_quiz_questions q ON q.question_id=o.question_id
JOIN rd_course_sessions cs ON cs.course_session_id=q.course_session_id
WHERE cs.course_id=34 AND LOWER(TRIM(cs.session_type))='session' AND cs.session_title LIKE 'Lesson %';"