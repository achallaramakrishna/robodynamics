-- =============================================================================
-- MindSutra Vedic Math G4–G8 LMS Seed
-- Generated: 2026-03-16
-- Run as: mysql -u root -pachalla robodynamics_db < this_file.sql
-- =============================================================================

USE robodynamics_db;
SET SQL_SAFE_UPDATES = 0;

-- =============================================================================
-- STEP 0: Check and add course_type column if missing
-- =============================================================================
SET @col_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'robodynamics_db'
    AND TABLE_NAME   = 'rd_courses'
    AND COLUMN_NAME  = 'course_type'
);

-- Use a prepared statement to conditionally ALTER
SET @alter_sql := IF(
  @col_exists = 0,
  'ALTER TABLE rd_courses ADD COLUMN course_type VARCHAR(80) NULL COMMENT ''AI-tutor engine course ID, e.g. vedic_math_g5'' AFTER course_name',
  'SELECT ''course_type column already exists'' AS info'
);
PREPARE alter_stmt FROM @alter_sql;
EXECUTE alter_stmt;
DEALLOCATE PREPARE alter_stmt;

SELECT 'STEP_0_DONE: course_type column ensured' AS status;

-- =============================================================================
-- STEP 1: Show existing users (for enrollment decisions)
-- =============================================================================
SELECT
  u.user_id,
  u.username,
  u.email,
  u.first_name,
  u.last_name,
  u.role_id,
  u.is_active,
  u.created_at
FROM rd_users u
ORDER BY u.created_at DESC
LIMIT 50;

-- =============================================================================
-- STEP 2: Insert the 5 MindSutra Vedic Math courses
-- =============================================================================

-- Grade 4
INSERT INTO rd_courses (
  course_category_id, course_name, course_type, course_description,
  shortDescription, course_level, course_status, grade_range, category,
  is_featured, tier_level, tier_order, reviews_count, is_active
)
SELECT
  1,
  'MindSutra Vedic Maths — Grade 4',
  'vedic_math_g4',
  'AI-powered Vedic Mathematics tutor for CBSE Grade 4. Covers Puranapuranabhyam, Nikhilam basics, doubling tricks, 11x trick, digit sums, and quick division. Animated avatar coach with adaptive practice.',
  'Vedic Maths AI Tutor for Grade 4 — CBSE aligned, 8 chapters.',
  '4',
  'ACTIVE',
  'GRADE_4',
  'Vedic Maths',
  1,
  'beginner',
  1,
  0,
  1
WHERE NOT EXISTS (
  SELECT 1 FROM rd_courses WHERE course_type = 'vedic_math_g4'
);

-- Grade 5
INSERT INTO rd_courses (
  course_category_id, course_name, course_type, course_description,
  shortDescription, course_level, course_status, grade_range, category,
  is_featured, tier_level, tier_order, reviews_count, is_active
)
SELECT
  1,
  'MindSutra Vedic Maths — Grade 5',
  'vedic_math_g5',
  'AI-powered Vedic Mathematics tutor for CBSE Grade 5. Covers Nikhilam near-100 multiplication, digit sums, criss-cross method, squaring near 50, percentage shortcuts, HCF, and flag division. Adaptive AI coach.',
  'Vedic Maths AI Tutor for Grade 5 — CBSE aligned, 8 chapters.',
  '5',
  'ACTIVE',
  'GRADE_5',
  'Vedic Maths',
  1,
  'beginner',
  2,
  0,
  1
WHERE NOT EXISTS (
  SELECT 1 FROM rd_courses WHERE course_type = 'vedic_math_g5'
);

-- Grade 6
INSERT INTO rd_courses (
  course_category_id, course_name, course_type, course_description,
  shortDescription, course_level, course_status, grade_range, category,
  is_featured, tier_level, tier_order, reviews_count, is_active
)
SELECT
  1,
  'MindSutra Vedic Maths — Grade 6',
  'vedic_math_g6',
  'AI-powered Vedic Mathematics tutor for CBSE Grade 6. Covers Nikhilam near-1000, 3-digit criss-cross, squaring near a base, difference of squares, advanced divisibility, Paravartya division, and simultaneous equations.',
  'Vedic Maths AI Tutor for Grade 6 — CBSE aligned, 8 chapters.',
  '6',
  'ACTIVE',
  'GRADE_6',
  'Vedic Maths',
  1,
  'intermediate',
  3,
  0,
  1
WHERE NOT EXISTS (
  SELECT 1 FROM rd_courses WHERE course_type = 'vedic_math_g6'
);

-- Grade 7
INSERT INTO rd_courses (
  course_category_id, course_name, course_type, course_description,
  shortDescription, course_level, course_status, grade_range, category,
  is_featured, tier_level, tier_order, reviews_count, is_active
)
SELECT
  1,
  'MindSutra Vedic Maths — Grade 7',
  'vedic_math_g7',
  'AI-powered Vedic Mathematics tutor for CBSE Grade 7. Covers large-number Nikhilam, 4-digit criss-cross, algebraic identities, triangle and area sutras, exponent patterns, advanced HCF/LCM, and fraction shortcuts.',
  'Vedic Maths AI Tutor for Grade 7 — CBSE aligned, 8 chapters.',
  '7',
  'ACTIVE',
  'GRADE_7',
  'Vedic Maths',
  1,
  'intermediate',
  4,
  0,
  1
WHERE NOT EXISTS (
  SELECT 1 FROM rd_courses WHERE course_type = 'vedic_math_g7'
);

-- Grade 8
INSERT INTO rd_courses (
  course_category_id, course_name, course_type, course_description,
  shortDescription, course_level, course_status, grade_range, category,
  is_featured, tier_level, tier_order, reviews_count, is_active
)
SELECT
  1,
  'MindSutra Vedic Maths — Grade 8',
  'vedic_math_g8',
  'AI-powered Vedic Mathematics tutor for CBSE Grade 8. Covers large-number Nikhilam, Vilokanam inspection division, algebraic Paravartya, Pythagorean proofs, Vedic square roots, cube roots, and quadratic solving.',
  'Vedic Maths AI Tutor for Grade 8 — CBSE aligned, 8 chapters.',
  '8',
  'ACTIVE',
  'GRADE_8',
  'Vedic Maths',
  1,
  'advanced',
  5,
  0,
  1
WHERE NOT EXISTS (
  SELECT 1 FROM rd_courses WHERE course_type = 'vedic_math_g8'
);

SELECT 'STEP_2_DONE: Vedic Math G4-G8 courses inserted' AS status;

-- Show inserted courses
SELECT course_id, course_name, course_type, course_level, grade_range, is_active
FROM rd_courses
WHERE course_type IN ('vedic_math_g4','vedic_math_g5','vedic_math_g6','vedic_math_g7','vedic_math_g8')
ORDER BY course_id;

-- =============================================================================
-- STEP 3: Insert active course offerings (1 per grade, ₹1,999/year)
-- =============================================================================
INSERT INTO rd_course_offerings (
  start_date,
  end_date,
  course_offering_name,
  fee_amount,
  reminder_needed,
  is_active,
  course_id,
  sessions_per_week,
  days_of_week
)
SELECT
  CURDATE(),
  DATE_ADD(CURDATE(), INTERVAL 365 DAY),
  CONCAT(c.course_name, ' - AI Tutor Annual'),
  1999.00,
  0,
  1,
  c.course_id,
  0,
  ''
FROM rd_courses c
WHERE c.course_type IN ('vedic_math_g4','vedic_math_g5','vedic_math_g6','vedic_math_g7','vedic_math_g8')
  AND NOT EXISTS (
    SELECT 1 FROM rd_course_offerings o
    WHERE o.course_id = c.course_id AND o.is_active = 1
  );

SELECT 'STEP_3_DONE: Course offerings created' AS status;

-- Show offerings
SELECT
  o.course_offering_id,
  c.course_name,
  c.course_type,
  o.course_offering_name,
  o.fee_amount,
  o.start_date,
  o.end_date,
  o.is_active
FROM rd_course_offerings o
JOIN rd_courses c ON c.course_id = o.course_id
WHERE c.course_type IN ('vedic_math_g4','vedic_math_g5','vedic_math_g6','vedic_math_g7','vedic_math_g8')
ORDER BY c.course_id;

-- =============================================================================
-- STEP 4: List all users with their roles
-- =============================================================================
SELECT 'STEP_4: Current users in rd_users' AS status;

SELECT
  u.user_id,
  u.username,
  u.email,
  u.first_name,
  u.last_name,
  u.is_active,
  u.created_at,
  COALESCE(
    (SELECT GROUP_CONCAT(r.role_name) FROM rd_user_roles ur
     JOIN rd_roles r ON r.role_id = ur.role_id
     WHERE ur.user_id = u.user_id),
    'no_role'
  ) AS roles,
  (SELECT COUNT(*) FROM rd_student_enrollments se WHERE se.student_id = u.user_id AND se.status = 1) AS active_enrollments
FROM rd_users u
WHERE u.is_active = 1
ORDER BY u.created_at DESC
LIMIT 100;

-- =============================================================================
-- STEP 5: Enroll all STUDENT-role users in ALL 5 Vedic Math courses
-- (idempotent — won't duplicate if already enrolled)
-- =============================================================================
-- Find students (adjust role check to match your rd_roles table)
DROP TEMPORARY TABLE IF EXISTS tmp_vedic_students;
CREATE TEMPORARY TABLE tmp_vedic_students AS
SELECT DISTINCT u.user_id AS student_id
FROM rd_users u
WHERE u.is_active = 1
  AND (
    -- Try common patterns for student role
    EXISTS (
      SELECT 1 FROM rd_user_roles ur
      JOIN rd_roles r ON r.role_id = ur.role_id
      WHERE ur.user_id = u.user_id
        AND LOWER(r.role_name) IN ('student', 'learner', 'user')
    )
    OR
    -- Fallback: users who have been enrolled before (any course)
    EXISTS (
      SELECT 1 FROM rd_student_enrollments se WHERE se.student_id = u.user_id
    )
  );

-- Enroll each student in all 5 Vedic Math offerings
INSERT INTO rd_student_enrollments (
  course_offering_id,
  student_id,
  parent_id,
  enrollment_date,
  discount_percent,
  discount_reason,
  final_fee,
  status,
  progress
)
SELECT
  o.course_offering_id,
  s.student_id,
  NULL,        -- parent_id: set later via registration flow
  NOW(),
  100,
  'Demo/Admin Enrollment — MindSutra G4-G8 Seed',
  0.00,
  1,
  0
FROM tmp_vedic_students s
CROSS JOIN rd_course_offerings o
JOIN rd_courses c ON c.course_id = o.course_id
WHERE c.course_type IN ('vedic_math_g4','vedic_math_g5','vedic_math_g6','vedic_math_g7','vedic_math_g8')
  AND o.is_active = 1
  AND NOT EXISTS (
    SELECT 1 FROM rd_student_enrollments e
    WHERE e.course_offering_id = o.course_offering_id
      AND e.student_id = s.student_id
      AND e.status = 1
  );

SELECT 'STEP_5_DONE: Students enrolled in Vedic Math G4-G8' AS status;

-- Show enrollment summary
SELECT
  u.user_id,
  u.username,
  u.first_name,
  c.course_name,
  c.course_type,
  se.enrollment_date,
  se.status,
  se.progress
FROM rd_student_enrollments se
JOIN rd_users u ON u.user_id = se.student_id
JOIN rd_course_offerings o ON o.course_offering_id = se.course_offering_id
JOIN rd_courses c ON c.course_id = o.course_id
WHERE c.course_type IN ('vedic_math_g4','vedic_math_g5','vedic_math_g6','vedic_math_g7','vedic_math_g8')
ORDER BY u.user_id, c.course_type;

-- =============================================================================
-- FINAL SUMMARY
-- =============================================================================
SELECT
  c.course_type,
  c.course_name,
  c.is_active,
  COUNT(DISTINCT o.course_offering_id) AS offerings,
  COUNT(DISTINCT se.enrollment_id) AS enrollments
FROM rd_courses c
LEFT JOIN rd_course_offerings o ON o.course_id = c.course_id AND o.is_active = 1
LEFT JOIN rd_student_enrollments se ON se.course_offering_id = o.course_offering_id AND se.status = 1
WHERE c.course_type IN ('vedic_math_g4','vedic_math_g5','vedic_math_g6','vedic_math_g7','vedic_math_g8')
GROUP BY c.course_id, c.course_type, c.course_name, c.is_active
ORDER BY c.course_type;

SELECT 'ALL_DONE: MindSutra Vedic Math G4-G8 seeded successfully' AS final_status;
