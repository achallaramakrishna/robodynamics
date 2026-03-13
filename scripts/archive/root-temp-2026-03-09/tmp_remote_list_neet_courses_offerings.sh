#!/bin/bash
set -euo pipefail
mysql -t robodynamics_db <<'SQL'
SELECT course_id, course_name, is_active
FROM rd_courses
WHERE lower(course_name) LIKE '%neet physics%'
   OR lower(course_name) LIKE '%neet chemistry%'
   OR lower(course_name) LIKE '%neet biology%'
ORDER BY course_id;

SELECT course_offering_id, course_id, course_offering_name, is_active, instructor_id, start_date, end_date
FROM rd_course_offerings
WHERE course_id IN (
  SELECT course_id FROM rd_courses
  WHERE lower(course_name) LIKE '%neet physics%'
     OR lower(course_name) LIKE '%neet chemistry%'
     OR lower(course_name) LIKE '%neet biology%'
)
ORDER BY course_offering_id;
SQL
