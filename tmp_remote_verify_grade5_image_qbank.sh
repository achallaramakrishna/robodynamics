#!/bin/bash
set -euo pipefail
mysql -uroot -pJatni@752050 robodynamics_db -Nse "SELECT COUNT(*) AS total_questions FROM rd_quiz_questions WHERE course_session_id=1085; SELECT SUM(CASE WHEN question_image LIKE '/session_materials/34/images/g5_math_img_q%.svg' THEN 1 ELSE 0 END) AS image_matched FROM rd_quiz_questions WHERE course_session_id=1085; SELECT COUNT(*) AS total_options FROM rd_quiz_options qo JOIN rd_quiz_questions qq ON qq.question_id=qo.question_id WHERE qq.course_session_id=1085;"
find /opt/robodynamics/session_materials/34/images -maxdepth 1 -type f -name 'g5_math_img_q*.svg' | wc -l
