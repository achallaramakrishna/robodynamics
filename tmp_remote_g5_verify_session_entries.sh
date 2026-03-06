#!/bin/bash
set -euo pipefail
mysql -uroot -pJatni@752050 robodynamics_db -Nse "
SELECT s.course_session_id, s.session_title, COUNT(d.course_session_detail_id) AS exampaper_details
FROM rd_course_sessions s
LEFT JOIN rd_course_session_details d ON d.course_session_id=s.course_session_id AND d.type='exampaper'
WHERE s.course_id=34 AND LOWER(s.session_title)='exam papers - parent generated'
GROUP BY s.course_session_id, s.session_title;

SELECT d.course_session_detail_id, d.topic, d.type, d.creation_date
FROM rd_course_session_details d
JOIN rd_course_sessions s ON s.course_session_id=d.course_session_id
WHERE s.course_id=34
  AND LOWER(s.session_title)='exam papers - parent generated'
  AND d.course_session_detail_id IN (4555,4556)
ORDER BY d.course_session_detail_id;
"
