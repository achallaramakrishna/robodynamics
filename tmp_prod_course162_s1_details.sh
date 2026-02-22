#!/usr/bin/env bash
mysql -uroot -p'Jatni@752050' -D robodynamics_db -e "
SELECT course_session_detail_id, session_detail_id, type, topic, file, exam_paper_id, quiz_id
FROM rd_course_session_details
WHERE course_id=162 AND course_session_id=2669
ORDER BY type, course_session_detail_id;
"
