#!/bin/bash
set -euo pipefail
mysql -t robodynamics_db <<'SQL'
SET @student_id := (SELECT user_id FROM rd_users WHERE user_name='sashank' AND profile_id=5 LIMIT 1);
SET @parent_id := (SELECT COALESCE(mom_user_id, dad_user_id) FROM rd_users WHERE user_id=@student_id LIMIT 1);

SET @offer_physics := (
  SELECT o.course_offering_id
  FROM rd_course_offerings o
  JOIN rd_courses c ON c.course_id=o.course_id
  WHERE o.is_active=1 AND lower(c.course_name) LIKE '%neet physics%'
  ORDER BY o.course_offering_id DESC
  LIMIT 1
);

SET @offer_chem := (
  SELECT o.course_offering_id
  FROM rd_course_offerings o
  JOIN rd_courses c ON c.course_id=o.course_id
  WHERE o.is_active=1 AND lower(c.course_name) LIKE '%neet chemistry%'
  ORDER BY o.course_offering_id DESC
  LIMIT 1
);

SET @offer_bio := (
  SELECT o.course_offering_id
  FROM rd_course_offerings o
  JOIN rd_courses c ON c.course_id=o.course_id
  WHERE o.is_active=1 AND lower(c.course_name) LIKE '%neet biology%'
  ORDER BY o.course_offering_id DESC
  LIMIT 1
);

INSERT INTO rd_student_enrollments (course_offering_id, student_id, enrollment_date, final_fee, parent_id, status, discount_percent, discount_reason, progress)
SELECT @offer_physics, @student_id, CURDATE(), 0.00, @parent_id, 1, 0.00, NULL, 0.00
WHERE @student_id IS NOT NULL AND @parent_id IS NOT NULL AND @offer_physics IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM rd_student_enrollments e WHERE e.student_id=@student_id AND e.course_offering_id=@offer_physics
  );

INSERT INTO rd_student_enrollments (course_offering_id, student_id, enrollment_date, final_fee, parent_id, status, discount_percent, discount_reason, progress)
SELECT @offer_chem, @student_id, CURDATE(), 0.00, @parent_id, 1, 0.00, NULL, 0.00
WHERE @student_id IS NOT NULL AND @parent_id IS NOT NULL AND @offer_chem IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM rd_student_enrollments e WHERE e.student_id=@student_id AND e.course_offering_id=@offer_chem
  );

INSERT INTO rd_student_enrollments (course_offering_id, student_id, enrollment_date, final_fee, parent_id, status, discount_percent, discount_reason, progress)
SELECT @offer_bio, @student_id, CURDATE(), 0.00, @parent_id, 1, 0.00, NULL, 0.00
WHERE @student_id IS NOT NULL AND @parent_id IS NOT NULL AND @offer_bio IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM rd_student_enrollments e WHERE e.student_id=@student_id AND e.course_offering_id=@offer_bio
  );

SELECT @student_id AS student_id, @parent_id AS parent_id, @offer_physics AS offer_physics, @offer_chem AS offer_chem, @offer_bio AS offer_bio;

SELECT e.enrollment_id, e.student_id, u.user_name, e.parent_id, e.course_offering_id, o.course_offering_name, c.course_id, c.course_name, e.status, e.enrollment_date
FROM rd_student_enrollments e
JOIN rd_users u ON u.user_id=e.student_id
JOIN rd_course_offerings o ON o.course_offering_id=e.course_offering_id
JOIN rd_courses c ON c.course_id=o.course_id
WHERE e.student_id=@student_id
  AND (lower(c.course_name) LIKE '%neet physics%' OR lower(c.course_name) LIKE '%neet chemistry%' OR lower(c.course_name) LIKE '%neet biology%')
ORDER BY e.course_offering_id;
SQL
