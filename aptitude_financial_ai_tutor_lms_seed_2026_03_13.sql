-- Aptitude/Reasoning + Financial Literacy AI Tutor LMS seed
-- Generated on 2026-03-13
-- Creates LMS course rows, active AI Tutor offerings, optional enrollments, and starter sessions.

USE robodynamics_db;
SET SQL_SAFE_UPDATES=0;
START TRANSACTION;

-- ---------------------------
-- 1) Configure course metadata
-- ---------------------------
SET @aptitude_course_category_id := 18;  -- Olympiad / competitive prep
SET @financial_course_category_id := 19; -- Social Science / life-skills closest fit
SET @aptitude_course_name := 'Aptitude and Reasoning';
SET @financial_course_name := 'Financial Literacy';
SET @student_user_id := NULL; -- Example: 347
SET @parent_user_id := NULL;  -- Example: 120
SET @import_tag := 'ai_tutor_seed_2026_03_13';

INSERT INTO rd_courses (
  course_category_id,
  course_name,
  course_description,
  shortDescription,
  course_level,
  course_status,
  grade_range,
  category,
  is_featured,
  tier_level,
  tier_order,
  reviews_count,
  is_active
)
SELECT
  @aptitude_course_category_id,
  @aptitude_course_name,
  'AI Tutor course for aptitude, quantitative reasoning, logical reasoning, and exam readiness.',
  'Adaptive tutor for aptitude and reasoning practice.',
  '8-12',
  'ACTIVE',
  'HIGH_SCHOOL_10_12',
  'Aptitude',
  0,
  'beginner',
  1,
  0,
  1
WHERE NOT EXISTS (
  SELECT 1 FROM rd_courses WHERE course_name = @aptitude_course_name
);

INSERT INTO rd_courses (
  course_category_id,
  course_name,
  course_description,
  shortDescription,
  course_level,
  course_status,
  grade_range,
  category,
  is_featured,
  tier_level,
  tier_order,
  reviews_count,
  is_active
)
SELECT
  @financial_course_category_id,
  @financial_course_name,
  'AI Tutor course for money basics, budgeting, savings, banking, digital payments, and financial decisions.',
  'Adaptive tutor for financial literacy and money skills.',
  '8-12',
  'ACTIVE',
  'HIGH_SCHOOL_10_12',
  'Life Skills',
  0,
  'beginner',
  1,
  0,
  1
WHERE NOT EXISTS (
  SELECT 1 FROM rd_courses WHERE course_name = @financial_course_name
);

SET @aptitude_course_id := (
  SELECT course_id FROM rd_courses WHERE course_name = @aptitude_course_name ORDER BY course_id DESC LIMIT 1
);
SET @financial_course_id := (
  SELECT course_id FROM rd_courses WHERE course_name = @financial_course_name ORDER BY course_id DESC LIMIT 1
);

DROP TEMPORARY TABLE IF EXISTS tmp_new_tutor_units;
CREATE TEMPORARY TABLE tmp_new_tutor_units (
  module_code VARCHAR(32) NOT NULL,
  course_id INT NOT NULL,
  unit_no INT NOT NULL,
  unit_title VARCHAR(255) NOT NULL,
  unit_desc VARCHAR(1000) NULL,
  grade_label VARCHAR(32) NOT NULL
);

INSERT INTO tmp_new_tutor_units (module_code, course_id, unit_no, unit_title, unit_desc, grade_label) VALUES
('APTITUDE_REASONING', @aptitude_course_id, 1, 'Number Patterns and Series', 'Number series, missing terms, and pattern spotting drills.', '8-12'),
('APTITUDE_REASONING', @aptitude_course_id, 2, 'Arithmetic Reasoning', 'Ratios, percentages, averages, and quick quantitative reasoning.', '8-12'),
('APTITUDE_REASONING', @aptitude_course_id, 3, 'Logical Reasoning Basics', 'Analogies, classification, odd-one-out, and elimination methods.', '8-12'),
('APTITUDE_REASONING', @aptitude_course_id, 4, 'Seating and Arrangement Intro', 'Simple arrangement logic, ordering, and position-based inference.', '8-12'),
('APTITUDE_REASONING', @aptitude_course_id, 5, 'Data Interpretation Foundations', 'Tables, charts, comparisons, and extracting decisions from data.', '8-12'),
('APTITUDE_REASONING', @aptitude_course_id, 6, 'Exam Strategy and Mixed Practice', 'Timed mixed practice, shortcuts, and error review patterns.', '8-12'),
('FINANCIAL_LITERACY', @financial_course_id, 1, 'Money Basics and Budgeting', 'Income, expenses, needs vs wants, and simple monthly budgeting.', '8-12'),
('FINANCIAL_LITERACY', @financial_course_id, 2, 'Saving, Goals, and Emergency Funds', 'Savings habits, short-term goals, and emergency fund thinking.', '8-12'),
('FINANCIAL_LITERACY', @financial_course_id, 3, 'Banking and Digital Payments', 'Bank accounts, UPI, cards, safe payments, and transaction awareness.', '8-12'),
('FINANCIAL_LITERACY', @financial_course_id, 4, 'Interest, Borrowing, and Debt', 'Simple interest, responsible borrowing, and debt red flags.', '8-12'),
('FINANCIAL_LITERACY', @financial_course_id, 5, 'Consumer Decisions and Scams', 'Comparing offers, reading terms, and spotting common fraud/scam patterns.', '8-12'),
('FINANCIAL_LITERACY', @financial_course_id, 6, 'Planning for Smart Money Choices', 'Goal planning, basic investing awareness, and long-term money habits.', '8-12');

-- ---------------------------
-- 2) Ensure active offerings
-- ---------------------------
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
  CONCAT(c.course_name, ' - AI Tutor Offering'),
  0.0,
  0,
  1,
  c.course_id,
  0,
  ''
FROM (
  SELECT DISTINCT course_id FROM tmp_new_tutor_units
) n
JOIN rd_courses c ON c.course_id = n.course_id
LEFT JOIN rd_course_offerings o
  ON o.course_id = c.course_id
 AND o.is_active = 1
 AND o.course_offering_name = CONCAT(c.course_name, ' - AI Tutor Offering')
WHERE o.course_offering_id IS NULL;

DROP TEMPORARY TABLE IF EXISTS tmp_new_tutor_offerings;
CREATE TEMPORARY TABLE tmp_new_tutor_offerings AS
SELECT
  o.course_id,
  MAX(o.course_offering_id) AS course_offering_id
FROM rd_course_offerings o
JOIN (
  SELECT DISTINCT course_id FROM tmp_new_tutor_units
) n ON n.course_id = o.course_id
WHERE o.is_active = 1
GROUP BY o.course_id;

-- ---------------------------
-- 3) Optional enrollment seed
-- ---------------------------
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
  @student_user_id,
  @parent_user_id,
  NOW(),
  0,
  'AI Tutor new-course seed',
  0,
  1,
  0
FROM tmp_new_tutor_offerings o
WHERE @student_user_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM rd_student_enrollments e
    WHERE e.course_offering_id = o.course_offering_id
      AND e.student_id = @student_user_id
      AND e.status = 1
  );

-- ---------------------------
-- 4) Seed starter sessions
-- ---------------------------
INSERT INTO rd_course_sessions (
  session_id,
  course_id,
  parent_session_id,
  session_type,
  tier_level,
  tier_order,
  session_title,
  creation_date,
  version,
  progress,
  grade,
  session_description
)
SELECT
  COALESCE(mx.max_session_id, 0) + ROW_NUMBER() OVER (PARTITION BY u.course_id ORDER BY u.unit_no) AS session_id,
  u.course_id,
  NULL AS parent_session_id,
  'session' AS session_type,
  'BEGINNER' AS tier_level,
  u.unit_no AS tier_order,
  CONCAT('Unit ', LPAD(u.unit_no, 2, '0'), ': ', u.unit_title) AS session_title,
  NOW() AS creation_date,
  1 AS version,
  0 AS progress,
  u.grade_label AS grade,
  CONCAT(@import_tag, ' | ', u.unit_desc) AS session_description
FROM tmp_new_tutor_units u
LEFT JOIN (
  SELECT course_id, MAX(session_id) AS max_session_id
  FROM rd_course_sessions
  GROUP BY course_id
) mx ON mx.course_id = u.course_id
LEFT JOIN rd_course_sessions ex
  ON ex.course_id = u.course_id
 AND ex.session_title = CONCAT('Unit ', LPAD(u.unit_no, 2, '0'), ': ', u.unit_title)
WHERE ex.course_session_id IS NULL;

UPDATE rd_course_sessions cs
JOIN tmp_new_tutor_units u
  ON u.course_id = cs.course_id
 AND cs.session_title = CONCAT('Unit ', LPAD(u.unit_no, 2, '0'), ': ', u.unit_title)
SET
  cs.session_type = 'session',
  cs.tier_level = COALESCE(NULLIF(cs.tier_level, ''), 'BEGINNER'),
  cs.tier_order = u.unit_no,
  cs.grade = COALESCE(NULLIF(cs.grade, ''), u.grade_label),
  cs.session_description = CONCAT(@import_tag, ' | ', u.unit_desc),
  cs.version = GREATEST(COALESCE(cs.version, 0), 1),
  cs.creation_date = COALESCE(cs.creation_date, NOW());

-- ---------------------------
-- 5) Verification snapshot
-- ---------------------------
SELECT 'SEEDED_COURSES' AS tag, c.course_id, c.course_name, c.course_level, c.grade_range, c.category
FROM rd_courses c
WHERE c.course_id IN (@aptitude_course_id, @financial_course_id)
ORDER BY c.course_id;

SELECT 'SEEDED_OFFERS' AS tag, o.course_id, o.course_offering_id
FROM tmp_new_tutor_offerings o
ORDER BY o.course_id;

SELECT 'SEEDED_SESSIONS' AS tag, cs.course_id, COUNT(*) AS session_count
FROM rd_course_sessions cs
WHERE cs.course_id IN (@aptitude_course_id, @financial_course_id)
  AND cs.session_type = 'session'
GROUP BY cs.course_id
ORDER BY cs.course_id;

DROP TEMPORARY TABLE IF EXISTS tmp_new_tutor_offerings;
DROP TEMPORARY TABLE IF EXISTS tmp_new_tutor_units;

COMMIT;




