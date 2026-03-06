#!/bin/bash
set -euo pipefail
mysql -uroot -pJatni@752050 robodynamics_db -Nse "
SELECT s.course_session_id, s.session_id, s.session_title, s.session_type,
       COUNT(q.question_id) AS q_count,
       SUM(CASE WHEN q.question_image IS NOT NULL AND TRIM(q.question_image)<>'' THEN 1 ELSE 0 END) AS img_q_count
FROM rd_course_sessions s
LEFT JOIN rd_quiz_questions q ON q.course_session_id=s.course_session_id
WHERE s.course_id=35
GROUP BY s.course_session_id, s.session_id, s.session_title, s.session_type
ORDER BY s.course_session_id;

SELECT s.course_session_id, s.session_title
FROM rd_course_sessions s
WHERE s.course_id=35 AND LOWER(s.session_title) LIKE '%parent%generated%';
" 
