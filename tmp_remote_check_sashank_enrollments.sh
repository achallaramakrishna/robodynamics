#!/bin/bash
set -euo pipefail
mysql -t robodynamics_db <<'SQL'
SELECT e.enrollment_id, e.student_id, u.user_name, e.parent_id, e.course_offering_id, o.course_offering_name, c.course_id, c.course_name, e.status, e.enrollment_date
FROM rd_student_enrollments e
JOIN rd_users u ON u.user_id=e.student_id
JOIN rd_course_offerings o ON o.course_offering_id=e.course_offering_id
JOIN rd_courses c ON c.course_id=o.course_id
WHERE e.student_id IN (347,421)
ORDER BY e.student_id, e.course_offering_id;
SQL
