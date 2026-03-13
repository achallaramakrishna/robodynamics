#!/bin/bash
set -euo pipefail
mysql -uroot -pJatni@752050 robodynamics_db -Nse "
START TRANSACTION;
SELECT 'BEFORE', course_session_detail_id, course_session_id, type, topic, exam_paper_id
FROM rd_course_session_details
WHERE course_session_detail_id=4468;

UPDATE rd_course_session_details
SET type='archive_exampaper',
    topic=CONCAT('[Archived] ', topic)
WHERE course_session_detail_id=4468
  AND LOWER(TRIM(type))='exampaper';

SELECT 'UPDATED_ROWS', ROW_COUNT();

SELECT 'AFTER', course_session_detail_id, course_session_id, type, topic, exam_paper_id
FROM rd_course_session_details
WHERE course_session_detail_id=4468;
COMMIT;

SELECT 'VISIBLE_EXAMPAPERS', COUNT(*)
FROM rd_course_session_details
WHERE course_session_id=2715 AND LOWER(TRIM(type))='exampaper';

SELECT course_session_detail_id, type, topic, exam_paper_id
FROM rd_course_session_details
WHERE course_session_id=2715
ORDER BY course_session_detail_id;
"
