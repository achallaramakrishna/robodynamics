#!/bin/bash
set -euo pipefail
mysql -t robodynamics_db <<'SQL'
SELECT c.course_id,
       c.course_name,
       SUM(CASE WHEN cs.session_type='Session' OR cs.session_type='session' OR cs.session_type IS NULL OR cs.session_type='' THEN 1 ELSE 0 END) AS sessions,
       COUNT(DISTINCT d.course_session_detail_id) AS details,
       COUNT(DISTINCT CASE WHEN lower(COALESCE(d.type,'')) IN ('pdf','notes') THEN d.course_session_detail_id END) AS pdf_assets,
       COUNT(DISTINCT CASE WHEN lower(COALESCE(d.type,'')) IN ('quiz','exampaper','exam_paper','exam-paper') THEN d.course_session_detail_id END) AS quiz_like_assets
FROM rd_courses c
LEFT JOIN rd_course_sessions cs ON cs.course_id=c.course_id
LEFT JOIN rd_course_session_details d ON d.course_session_id=cs.course_session_id
WHERE c.course_id IN (131,132,134,135,136,138)
GROUP BY c.course_id,c.course_name
ORDER BY c.course_id;

SELECT cs.course_id, cs.course_session_id, cs.session_id, cs.session_title, cs.session_type,
       COUNT(d.course_session_detail_id) AS detail_count
FROM rd_course_sessions cs
LEFT JOIN rd_course_session_details d ON d.course_session_id=cs.course_session_id
WHERE cs.course_id IN (131,132,134,135,136,138)
GROUP BY cs.course_id, cs.course_session_id, cs.session_id, cs.session_title, cs.session_type
ORDER BY cs.course_id, cs.session_id, cs.course_session_id
LIMIT 120;
SQL