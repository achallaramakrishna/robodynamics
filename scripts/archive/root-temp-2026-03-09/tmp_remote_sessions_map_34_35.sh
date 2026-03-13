#!/bin/bash
set -euo pipefail
mysql -uroot -pJatni@752050 robodynamics_db -Nse "
SELECT s.course_id, s.course_session_id, s.session_type, s.session_title,
       COUNT(d.course_session_detail_id) AS detail_count,
       SUM(CASE WHEN LOWER(IFNULL(d.type,'')) IN ('question','quiz','questionbank','qbank') THEN 1 ELSE 0 END) AS qdetail_like,
       SUM(CASE WHEN LOWER(IFNULL(d.type,''))='exampaper' THEN 1 ELSE 0 END) AS exampaper_details
FROM rd_course_sessions s
LEFT JOIN rd_course_session_details d ON d.course_session_id=s.course_session_id
WHERE s.course_id IN (34,35)
GROUP BY s.course_id, s.course_session_id, s.session_type, s.session_title
ORDER BY s.course_id, s.course_session_id;

SELECT s.course_id, s.course_session_id, s.session_title, d.course_session_detail_id, d.type, d.topic,
       COUNT(q.question_id) q_count,
       SUM(CASE WHEN q.question_id IS NOT NULL AND q.question_image IS NOT NULL AND TRIM(q.question_image)<>'' THEN 1 ELSE 0 END) img_count
FROM rd_course_sessions s
JOIN rd_course_session_details d ON d.course_session_id=s.course_session_id
LEFT JOIN rd_quiz_questions q ON q.course_session_detail_id=d.course_session_detail_id
WHERE s.course_id IN (34,35)
GROUP BY s.course_id, s.course_session_id, s.session_title, d.course_session_detail_id, d.type, d.topic
HAVING COUNT(q.question_id) > 0
ORDER BY s.course_id, s.course_session_id, d.course_session_detail_id;
"
