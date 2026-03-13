#!/bin/bash
set -euo pipefail
mysql -uroot -pJatni@752050 robodynamics_db -Nse "
DELETE FROM rd_course_sessions
WHERE course_session_id=2791
  AND course_id=35
  AND session_title='Exam Paoer Geneated by Parent'
  AND course_session_id NOT IN (SELECT DISTINCT course_session_id FROM rd_course_session_details);
SELECT 'DELETED_2791', ROW_COUNT();
SELECT s.course_session_id, s.session_title, COUNT(d.course_session_detail_id) AS details
FROM rd_course_sessions s
LEFT JOIN rd_course_session_details d ON d.course_session_id=s.course_session_id AND d.type='exampaper'
WHERE s.course_id=35 AND s.session_title='Exam Paoer Geneated by Parent'
GROUP BY s.course_session_id, s.session_title;
"
