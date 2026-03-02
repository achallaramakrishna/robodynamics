mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT 'TOTAL_LESSON_Q', COUNT(*)
FROM rd_quiz_questions q
JOIN rd_course_sessions cs ON cs.course_session_id=q.course_session_id
WHERE cs.course_id=34 AND LOWER(TRIM(cs.session_type))='session' AND cs.session_title LIKE 'Lesson %';

SELECT cs.course_session_id, cs.session_title, COUNT(q.question_id) AS total_q
FROM rd_course_sessions cs
LEFT JOIN rd_quiz_questions q ON q.course_session_id=cs.course_session_id
WHERE cs.course_id=34 AND LOWER(TRIM(cs.session_type))='session' AND cs.session_title LIKE 'Lesson %'
GROUP BY cs.course_session_id, cs.session_title
ORDER BY cs.course_session_id;"