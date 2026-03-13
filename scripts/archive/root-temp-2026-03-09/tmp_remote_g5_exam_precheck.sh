#!/bin/bash
set -euo pipefail
mysql -uroot -pJatni@752050 robodynamics_db -Nse "
SELECT course_session_id, session_title FROM rd_course_sessions WHERE course_id=34 AND LOWER(session_title)='exam papers - parent generated';
SELECT COUNT(*) FROM rd_course_session_details d JOIN rd_course_sessions s ON s.course_session_id=d.course_session_id WHERE s.course_id=34 AND LOWER(s.session_title)='exam papers - parent generated' AND d.type='exampaper';
"
