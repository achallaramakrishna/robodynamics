#!/bin/bash
set -euo pipefail
mysql -uroot -pJatni@752050 robodynamics_db -Nse "
SELECT c.course_id, c.course_name
FROM rd_courses c
WHERE c.course_id IN (34,35);

SELECT s.course_id, s.course_session_id, s.session_title,
       COUNT(q.question_id) AS q_total,
       SUM(CASE WHEN q.question_image IS NOT NULL AND TRIM(q.question_image)<>'' THEN 1 ELSE 0 END) AS q_img,
       SUM(CASE WHEN q.question_image IS NULL OR TRIM(q.question_image)='' THEN 1 ELSE 0 END) AS q_noimg
FROM rd_course_sessions s
LEFT JOIN rd_course_session_details d ON d.course_session_id=s.course_session_id
LEFT JOIN rd_quiz_questions q ON q.course_session_detail_id=d.course_session_detail_id
WHERE s.course_id IN (34,35)
  AND s.session_type='session'
  AND (LOWER(s.session_title) NOT LIKE '%parent%generated%')
GROUP BY s.course_id, s.course_session_id, s.session_title
HAVING COUNT(q.question_id) > 0
ORDER BY s.course_id, s.course_session_id;

SELECT s.course_id,
       SUM(CASE WHEN q.question_image IS NOT NULL AND TRIM(q.question_image)<>'' THEN 1 ELSE 0 END) AS total_img,
       SUM(CASE WHEN q.question_image IS NULL OR TRIM(q.question_image)='' THEN 1 ELSE 0 END) AS total_noimg,
       COUNT(q.question_id) AS total_q
FROM rd_course_sessions s
JOIN rd_course_session_details d ON d.course_session_id=s.course_session_id
JOIN rd_quiz_questions q ON q.course_session_detail_id=d.course_session_detail_id
WHERE s.course_id IN (34,35)
  AND s.session_type='session'
  AND (LOWER(s.session_title) NOT LIKE '%parent%generated%')
GROUP BY s.course_id
ORDER BY s.course_id;
"
