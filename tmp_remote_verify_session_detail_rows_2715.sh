#!/bin/bash
set -euo pipefail
mysql -uroot -pJatni@752050 robodynamics_db -Nse "
SELECT course_session_detail_id, course_session_id, type, topic, exam_paper_id, creation_date
FROM rd_course_session_details
WHERE course_session_id=2715 AND LOWER(TRIM(type))='exampaper'
ORDER BY course_session_detail_id;
"
