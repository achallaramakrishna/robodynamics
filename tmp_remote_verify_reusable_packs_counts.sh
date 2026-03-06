#!/bin/bash
set -euo pipefail
mysql -uroot -pJatni@752050 robodynamics_db -Nse "
SELECT q.course_session_id,
       COUNT(*) AS q_count,
       SUM(CASE WHEN q.question_image IS NOT NULL AND TRIM(q.question_image)<>'' THEN 1 ELSE 0 END) AS with_img
FROM rd_quiz_questions q
WHERE q.course_session_id IN (1085,1163,482,483,484,485,486,487,567,571,572,831,833,835,836,1131,1132,1133,1134,1135,1136,1137,1138,1139,1140,1141,1158,1159,1161,1162,1097,1098,1099,1100,1101,1102)
GROUP BY q.course_session_id
ORDER BY q.course_session_id;
"
for c in 34 35 39 43 66 68 74; do
  cnt=$(find "/opt/robodynamics/session_materials/${c}/images" -maxdepth 1 -type f -name '*.svg' 2>/dev/null | wc -l)
  echo "COURSE_${c}_SVG_FILES=${cnt}"
done
