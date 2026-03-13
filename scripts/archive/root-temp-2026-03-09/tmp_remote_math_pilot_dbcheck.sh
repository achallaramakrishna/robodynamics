mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT q.course_session_id, COUNT(*) AS questions,
SUM(CASE WHEN LOWER(COALESCE(q.question_type,''))='multiple_choice' THEN 1 ELSE 0 END) AS mcq
FROM rd_quiz_questions q
WHERE q.course_session_id IN (782,783,784,785,786)
GROUP BY q.course_session_id
ORDER BY q.course_session_id;

SELECT q.course_session_id, COUNT(o.option_id) AS options_cnt
FROM rd_quiz_questions q
LEFT JOIN rd_quiz_options o ON o.question_id=q.question_id
WHERE q.course_session_id IN (782,783,784,785,786)
GROUP BY q.course_session_id
ORDER BY q.course_session_id;"