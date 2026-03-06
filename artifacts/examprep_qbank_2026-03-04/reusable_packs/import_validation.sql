-- Reusable Packs Import Validation SQL
-- Generated on 2026-03-04

DROP TEMPORARY TABLE IF EXISTS tmp_reusable_pack_targets;
CREATE TEMPORARY TABLE tmp_reusable_pack_targets (course_id INT NOT NULL, course_session_id INT NOT NULL, course_name VARCHAR(255), session_title VARCHAR(255), expected_questions INT NOT NULL, PRIMARY KEY (course_id, course_session_id));

INSERT INTO tmp_reusable_pack_targets (course_id, course_session_id, course_name, session_title, expected_questions) VALUES
(34, 1085, 'CBSE Grade 5 Mathematics - Exam Prep', 'Mid-Term Exam Prep', 4),
(34, 1163, 'CBSE Grade 5 Mathematics - Exam Prep', 'GIIS Mid-Term Exam Prep', 4),
(35, 482, 'CBSE Grade 6 Mathematics - Exam Prep', 'Session 12: Understanding Elementary Shapes', 11),
(35, 483, 'CBSE Grade 6 Mathematics - Exam Prep', 'Session 13: Three-Dimensional Shapes', 11),
(35, 484, 'CBSE Grade 6 Mathematics - Exam Prep', 'Session 14: Constructions', 11),
(35, 485, 'CBSE Grade 6 Mathematics - Exam Prep', 'Session 15: Symmetry', 11),
(35, 486, 'CBSE Grade 6 Mathematics - Exam Prep', 'Session 16: Perimeter and Area', 11),
(35, 487, 'CBSE Grade 6 Mathematics - Exam Prep', 'Session 17: Data Handling', 11),
(39, 567, 'CBSE Grade 6 Mathematics (Living Maths) - Exam Prep', 'Chapter 5: Understanding Elementary Shapes', 11),
(39, 571, 'CBSE Grade 6 Mathematics (Living Maths) - Exam Prep', 'Chapter 9: Data Handling', 11),
(39, 572, 'CBSE Grade 6 Mathematics (Living Maths) - Exam Prep', 'Chapter 10: Mensuration', 11),
(43, 831, 'CBSE Grade 6 Mathematics (RD Sharma) - Exam Prep', 'Chapter 5: Data Handling and Presentation', 11),
(43, 833, 'CBSE Grade 6 Mathematics (RD Sharma) - Exam Prep', 'Chapter 7: Perimeter and Area', 11),
(43, 835, 'CBSE Grade 6 Mathematics (RD Sharma) - Exam Prep', 'Chapter 9: Playing with Constructions', 11),
(43, 836, 'CBSE Grade 6 Mathematics (RD Sharma) - Exam Prep', 'Chapter 10: Symmetry', 11),
(66, 1131, 'ICSE Mathematics Grade 5 - Exam Prep', 'Chapter 1: Roman Numerals', 4),
(66, 1132, 'ICSE Mathematics Grade 5 - Exam Prep', 'Chapter 2: Large Numbers', 4),
(66, 1133, 'ICSE Mathematics Grade 5 - Exam Prep', 'Chapter 3: Operations on Large Numbers', 4),
(66, 1134, 'ICSE Mathematics Grade 5 - Exam Prep', 'Chapter 4: Fractions', 4),
(66, 1135, 'ICSE Mathematics Grade 5 - Exam Prep', 'Chapter 5: Decimals', 4),
(66, 1136, 'ICSE Mathematics Grade 5 - Exam Prep', 'Chapter 6: Integers', 4),
(66, 1137, 'ICSE Mathematics Grade 5 - Exam Prep', 'Chapter 7: HCF and LCM', 4),
(66, 1138, 'ICSE Mathematics Grade 5 - Exam Prep', 'Chapter 8: Angles and Triangles', 11),
(66, 1139, 'ICSE Mathematics Grade 5 - Exam Prep', 'Chapter 9: Symmetry and Nets', 11),
(66, 1140, 'ICSE Mathematics Grade 5 - Exam Prep', 'Chapter 10: Measurement - Length, Mass and Capacity', 4),
(66, 1141, 'ICSE Mathematics Grade 5 - Exam Prep', 'Chapter 11: Perimeter and Area', 11),
(68, 1158, 'CBSE Grade 6 Math Divine', 'Chapter 4: Data Handling and Presentation', 11),
(68, 1159, 'CBSE Grade 6 Math Divine', 'Chapter 6: Perimeter and Area', 11),
(68, 1161, 'CBSE Grade 6 Math Divine', 'Chapter 8: Playing with Constructions', 11),
(68, 1162, 'CBSE Grade 6 Math Divine', 'Chapter 9: Symmetry', 11),
(74, 1097, 'Grade 6 CBSE New Enjoying Mathematics', 'Chapter 12: Understanding Elementary Shapes', 11),
(74, 1098, 'Grade 6 CBSE New Enjoying Mathematics', 'Chapter 13: Three-Dimensional Shapes', 11),
(74, 1099, 'Grade 6 CBSE New Enjoying Mathematics', 'Chapter 14: Constructions', 11),
(74, 1100, 'Grade 6 CBSE New Enjoying Mathematics', 'Chapter 15: Symmetry', 11),
(74, 1101, 'Grade 6 CBSE New Enjoying Mathematics', 'Chapter 16: Perimeter and Area', 11),
(74, 1102, 'Grade 6 CBSE New Enjoying Mathematics', 'Chapter 17: Data Handling', 11);

-- Current question counts for target sessions
SELECT t.course_id, t.course_name, t.course_session_id, t.session_title, t.expected_questions, COALESCE(COUNT(q.question_id), 0) AS current_questions FROM tmp_reusable_pack_targets t LEFT JOIN rd_quiz_questions q ON q.course_session_id = t.course_session_id GROUP BY t.course_id, t.course_name, t.course_session_id, t.session_title, t.expected_questions ORDER BY t.course_id, t.course_session_id;

-- Image coverage in imported questions
SELECT t.course_id, t.course_session_id, SUM(CASE WHEN q.question_image IS NOT NULL AND TRIM(q.question_image) <> '' THEN 1 ELSE 0 END) AS with_image, COUNT(q.question_id) AS total_questions FROM tmp_reusable_pack_targets t LEFT JOIN rd_quiz_questions q ON q.course_session_id = t.course_session_id GROUP BY t.course_id, t.course_session_id ORDER BY t.course_id, t.course_session_id;

-- Optional cleanup (UNCOMMENT ONLY IF YOU WANT REIMPORT)
-- DELETE FROM rd_quiz_options WHERE question_id IN (
--   SELECT q.question_id FROM rd_quiz_questions q
--   JOIN tmp_reusable_pack_targets t ON t.course_session_id = q.course_session_id
-- );
-- DELETE FROM rd_quiz_questions WHERE course_session_id IN (
--   SELECT course_session_id FROM tmp_reusable_pack_targets
-- );
