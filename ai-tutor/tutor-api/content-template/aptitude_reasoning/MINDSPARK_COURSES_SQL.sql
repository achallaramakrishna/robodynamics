-- ============================================================
-- MindSpark AI Tutor — rd_courses SQL Insert Script
-- Run against robodynamics Java LMS database (rd_courses table)
-- Each grade is a separate course entry
-- ============================================================

-- ----- School Grades G4–G10 -----

INSERT INTO rd_courses (course_id, course_name, course_type, description, is_active, created_at)
VALUES
  ('aptitude_reasoning_g4',  'MindSpark Grade 4 — Aptitude & Reasoning',   'AI_TUTOR', 'Pattern recognition, shapes, simple analogies and directions for Grade 4.', 1, NOW()),
  ('aptitude_reasoning_g5',  'MindSpark Grade 5 — Aptitude & Reasoning',   'AI_TUTOR', 'Number series, letter coding, calendar basics, spatial reasoning for Grade 5.', 1, NOW()),
  ('aptitude_reasoning_g6',  'MindSpark Grade 6 — Aptitude & Reasoning',   'AI_TUTOR', 'Series, coding-decoding, analogies, Venn diagrams, clocks, data tables for Grade 6.', 1, NOW()),
  ('aptitude_reasoning_g7',  'MindSpark Grade 7 — Aptitude & Reasoning',   'AI_TUTOR', 'Logical sequences, blood relations, direction, age problems, data graphs for Grade 7.', 1, NOW()),
  ('aptitude_reasoning_g8',  'MindSpark Grade 8 — Aptitude & Reasoning',   'AI_TUTOR', 'Number analogies, syllogisms, DI (bar/pie), matrix reasoning, seating arrangements for Grade 8.', 1, NOW()),
  ('aptitude_reasoning_g9',  'MindSpark Grade 9 — Aptitude & Reasoning',   'AI_TUTOR', 'Critical reasoning, syllogisms, data sufficiency, verbal analogies, DI mixed for Grade 9.', 1, NOW()),
  ('aptitude_reasoning_g10', 'MindSpark Grade 10 — Aptitude & Reasoning',  'AI_TUTOR', 'Advanced DI, decision making, assertion-reason, verbal reasoning, hard puzzles for Grade 10.', 1, NOW());

-- ----- Plus 2 / Pre-University -----

INSERT INTO rd_courses (course_id, course_name, course_type, description, is_active, created_at)
VALUES
  ('aptitude_reasoning_g11', 'MindSpark Grade 11 — Aptitude & Reasoning',  'AI_TUTOR', 'QA foundations — percentages, profit/loss, ratios, time-work for Grade 11.', 1, NOW()),
  ('aptitude_reasoning_g12', 'MindSpark Grade 12 — Aptitude & Reasoning',  'AI_TUTOR', 'Advanced QA — speed-distance, probability, permutations, DI sets for Grade 12.', 1, NOW());

-- ----- Campus Placement Tiers -----

INSERT INTO rd_courses (course_id, course_name, course_type, description, is_active, created_at)
VALUES
  ('aptitude_campus_foundation', 'MindSpark Campus Foundation — Aptitude & Reasoning', 'AI_TUTOR', 'Full QA + Logical Reasoning + Verbal Ability basics for Engineering Year 1–2.', 1, NOW()),
  ('aptitude_campus_pro',        'MindSpark Campus Pro — Placement Aptitude',           'AI_TUTOR', 'Company-pattern mocks — TCS NQT, Infosys, Wipro, Accenture, Cognizant — Year 3–4.', 1, NOW()),
  ('aptitude_campus_elite',      'MindSpark Campus Elite — Dream Company Prep',         'AI_TUTOR', 'Amazon, Microsoft, Google aptitude + Advanced puzzles + AMCAT/eLitmus patterns.', 1, NOW());

-- ============================================================
-- Verify inserts
-- ============================================================
SELECT course_id, course_name, is_active FROM rd_courses
WHERE course_id LIKE 'aptitude_%'
ORDER BY course_id;

-- ============================================================
-- NOTES:
-- 1. Each student enrolled in a grade gets the matching courseId
--    from JWT: e.g., child in Grade 6 → courseId = aptitude_reasoning_g6
-- 2. Content is loaded from:
--    tutor-api/content-template/aptitude_reasoning/grade_6/chapter/
-- 3. The AI Tutor backend resolves aptitude_reasoning_g6 →
--    content-template/aptitude_reasoning/grade_6/ automatically
--    (see CourseScriptLoader._grade_match logic)
-- 4. Campus courses map to:
--    content-template/aptitude_reasoning/campus_pro/ etc.
-- ============================================================
