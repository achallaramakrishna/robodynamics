#!/bin/bash
set -euo pipefail
mysql -t robodynamics_db <<'SQL'
SELECT course_id, course_name, is_active
FROM rd_courses
WHERE course_id IN (131,132,134,135,136,138,155,156,157)
   OR lower(course_name) LIKE '%ai tutor%'
ORDER BY course_id;

SELECT course_offering_id, course_id, course_offering_name, is_active, start_date, end_date
FROM rd_course_offerings
WHERE course_id IN (131,132,134,135,136,138,155,156,157)
ORDER BY course_offering_id;
SQL

for cid in 131 132 134 135 136 138 155 156 157; do
  if [ -d "/opt/robodynamics/$cid" ]; then
    ccount=$(find "/opt/robodynamics/$cid" -maxdepth 2 -type f | wc -l)
    echo "DIR_PRESENT course=$cid files=$ccount"
    find "/opt/robodynamics/$cid" -maxdepth 2 -type f | sed 's#^#  #g' | head -n 8 || true
  else
    echo "DIR_MISSING course=$cid"
  fi
done