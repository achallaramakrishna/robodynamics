#!/bin/bash
set -euo pipefail
mysql -uroot -p'Jatni@752050' -D robodynamics_db <<'SQL'
SELECT c.course_id, c.course_name,
       SUM(CASE WHEN cs.session_type='session' THEN 1 ELSE 0 END) AS session_count
FROM rd_courses c
LEFT JOIN rd_course_sessions cs ON cs.course_id = c.course_id
WHERE c.course_name LIKE '%NEET%'
GROUP BY c.course_id, c.course_name
ORDER BY c.course_id;
SQL