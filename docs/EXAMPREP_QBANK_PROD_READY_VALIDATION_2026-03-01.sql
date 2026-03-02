-- ExamPrep QBank Validation Queries (Production Ready)
-- Date: 2026-03-01
-- Usage:
--   1) Set @course_id to one target course.
--   2) Run query blocks chapter-wise or course-wise after each import batch.

USE robodynamics_db;

-- =============================
-- Parameters
-- =============================
SET @course_id = 65;

-- =============================
-- 1) Chapter coverage summary
-- =============================
SELECT
  s.course_id,
  s.course_session_id,
  s.session_id,
  s.session_title,
  COUNT(DISTINCT q.question_id) AS total_questions,
  SUM(CASE WHEN LOWER(COALESCE(q.question_type,''))='multiple_choice' THEN 1 ELSE 0 END) AS mcq_count,
  SUM(CASE WHEN LOWER(COALESCE(q.question_type,''))='short_answer' THEN 1 ELSE 0 END) AS short_count,
  SUM(CASE WHEN LOWER(COALESCE(q.question_type,''))='long_answer' THEN 1 ELSE 0 END) AS long_count,
  SUM(CASE WHEN LOWER(COALESCE(q.question_type,''))='fill_in_blank' THEN 1 ELSE 0 END) AS fill_count
FROM rd_course_sessions s
LEFT JOIN rd_quiz_questions q ON q.course_session_id = s.course_session_id
WHERE s.course_id = @course_id
  AND s.session_type = 'session'
GROUP BY s.course_id, s.course_session_id, s.session_id, s.session_title
ORDER BY s.course_session_id;

-- =============================
-- 2) Correct-answer completeness
-- =============================
SELECT
  s.course_session_id,
  s.session_title,
  COUNT(*) AS total_questions,
  SUM(CASE WHEN TRIM(COALESCE(q.correct_answer,'')) <> '' THEN 1 ELSE 0 END) AS with_correct_answer,
  ROUND(100 * SUM(CASE WHEN TRIM(COALESCE(q.correct_answer,'')) <> '' THEN 1 ELSE 0 END) / COUNT(*), 2) AS correct_answer_pct
FROM rd_course_sessions s
JOIN rd_quiz_questions q ON q.course_session_id = s.course_session_id
WHERE s.course_id = @course_id
  AND s.session_type = 'session'
GROUP BY s.course_session_id, s.session_title
ORDER BY correct_answer_pct ASC, s.course_session_id;

-- =============================
-- 3) Explanation completeness
-- =============================
SELECT
  s.course_session_id,
  s.session_title,
  SUM(CASE WHEN LOWER(COALESCE(q.question_type,'')) IN ('short_answer','long_answer') THEN 1 ELSE 0 END) AS descriptive_questions,
  SUM(CASE WHEN LOWER(COALESCE(q.question_type,'')) IN ('short_answer','long_answer')
             AND TRIM(COALESCE(q.explanation,'')) <> '' THEN 1 ELSE 0 END) AS descriptive_with_explanation,
  ROUND(
    100 * SUM(CASE WHEN LOWER(COALESCE(q.question_type,'')) IN ('short_answer','long_answer')
                     AND TRIM(COALESCE(q.explanation,'')) <> '' THEN 1 ELSE 0 END)
    / NULLIF(SUM(CASE WHEN LOWER(COALESCE(q.question_type,'')) IN ('short_answer','long_answer') THEN 1 ELSE 0 END), 0),
    2
  ) AS explanation_pct
FROM rd_course_sessions s
JOIN rd_quiz_questions q ON q.course_session_id = s.course_session_id
WHERE s.course_id = @course_id
  AND s.session_type = 'session'
GROUP BY s.course_session_id, s.session_title
ORDER BY explanation_pct ASC, s.course_session_id;

-- =============================
-- 4) MCQ option integrity
--    Rule: >=4 options and exactly 1 correct
-- =============================
SELECT
  s.course_session_id,
  s.session_title,
  q.question_id,
  LEFT(q.question_text, 140) AS question_text_snippet,
  COUNT(o.option_id) AS option_count,
  SUM(CASE WHEN o.is_correct = 1 THEN 1 ELSE 0 END) AS correct_option_count
FROM rd_course_sessions s
JOIN rd_quiz_questions q ON q.course_session_id = s.course_session_id
LEFT JOIN rd_quiz_options o ON o.question_id = q.question_id
WHERE s.course_id = @course_id
  AND s.session_type = 'session'
  AND LOWER(COALESCE(q.question_type,'')) = 'multiple_choice'
GROUP BY s.course_session_id, s.session_title, q.question_id, q.question_text
HAVING option_count < 4 OR correct_option_count <> 1
ORDER BY s.course_session_id, q.question_id;

-- =============================
-- 5) Duplicate normalized question text
-- =============================
SELECT
  t.course_session_id,
  s.session_title,
  t.norm_text,
  COUNT(*) AS duplicate_count
FROM (
  SELECT
    q.question_id,
    q.course_session_id,
    LOWER(TRIM(REPLACE(REPLACE(REPLACE(q.question_text, '\r', ' '), '\n', ' '), '\t', ' '))) AS norm_text
  FROM rd_quiz_questions q
) t
JOIN rd_course_sessions s ON s.course_session_id = t.course_session_id
WHERE s.course_id = @course_id
  AND s.session_type = 'session'
GROUP BY t.course_session_id, s.session_title, t.norm_text
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC, t.course_session_id;

-- =============================
-- 6) Image coverage per chapter
-- =============================
SELECT
  s.course_session_id,
  s.session_title,
  COUNT(*) AS total_questions,
  SUM(CASE WHEN TRIM(COALESCE(q.question_image,'')) <> '' THEN 1 ELSE 0 END) AS question_images,
  ROUND(100 * SUM(CASE WHEN TRIM(COALESCE(q.question_image,'')) <> '' THEN 1 ELSE 0 END) / COUNT(*), 2) AS question_image_pct
FROM rd_course_sessions s
JOIN rd_quiz_questions q ON q.course_session_id = s.course_session_id
WHERE s.course_id = @course_id
  AND s.session_type = 'session'
GROUP BY s.course_session_id, s.session_title
ORDER BY question_image_pct ASC, s.course_session_id;

-- =============================
-- 7) Broken image path probe (heuristic)
--    Finds values not starting with '/session_materials/'.
-- =============================
SELECT
  q.question_id,
  q.course_session_id,
  LEFT(q.question_text, 120) AS question_text_snippet,
  q.question_image
FROM rd_quiz_questions q
JOIN rd_course_sessions s ON s.course_session_id = q.course_session_id
WHERE s.course_id = @course_id
  AND s.session_type = 'session'
  AND TRIM(COALESCE(q.question_image,'')) <> ''
  AND q.question_image NOT LIKE '/session_materials/%'
ORDER BY q.course_session_id, q.question_id;

-- =============================
-- 8) Gap closure tracker
-- =============================
SELECT
  c.course_id,
  c.course_name,
  COUNT(DISTINCT CASE WHEN s.session_type='session' THEN s.course_session_id END) AS chapters,
  COUNT(DISTINCT CASE WHEN s.session_type='session' AND LOWER(COALESCE(d.type,''))='pdf' THEN s.course_session_id END) AS chapters_with_pdf,
  COUNT(DISTINCT CASE WHEN s.session_type='session' AND q.question_id IS NOT NULL THEN s.course_session_id END) AS chapters_with_questions,
  COUNT(DISTINCT CASE WHEN s.session_type='session' AND LOWER(COALESCE(d.type,''))='pdf' AND q.question_id IS NULL THEN s.course_session_id END) AS chapters_pdf_no_questions
FROM rd_courses c
LEFT JOIN rd_course_sessions s ON s.course_id = c.course_id
LEFT JOIN rd_course_session_details d ON d.course_session_id = s.course_session_id
LEFT JOIN rd_quiz_questions q ON q.course_session_id = s.course_session_id
WHERE c.course_id = @course_id
GROUP BY c.course_id, c.course_name;

