#!/bin/bash
set -euo pipefail

mysql -uroot -pJatni@752050 robodynamics_db -Nse "
SELECT 'UNMATCHED_BEFORE', COUNT(*)
FROM rd_exam_section_questions esq
JOIN rd_exam_sections es ON es.section_id=esq.section_id
JOIN rd_quiz_questions g ON g.question_id=esq.question_id
LEFT JOIN (
  SELECT question_text, MIN(question_image) AS img
  FROM rd_quiz_questions
  WHERE course_session_id=1085
    AND question_image IS NOT NULL
    AND TRIM(question_image)<>''
  GROUP BY question_text
) src ON src.question_text=g.question_text
WHERE es.exam_paper_id IN (49,50)
  AND src.img IS NULL;

UPDATE rd_quiz_questions g
JOIN rd_exam_section_questions esq ON esq.question_id=g.question_id
JOIN rd_exam_sections es ON es.section_id=esq.section_id
JOIN (
  SELECT question_text, MIN(question_image) AS img
  FROM rd_quiz_questions
  WHERE course_session_id=1085
    AND question_image IS NOT NULL
    AND TRIM(question_image)<>''
  GROUP BY question_text
) src ON src.question_text=g.question_text
SET g.question_image=src.img
WHERE es.exam_paper_id IN (49,50)
  AND (g.question_image IS NULL OR TRIM(g.question_image)='');

SELECT 'UPDATED_ROWS', ROW_COUNT();

SELECT ep.exam_paper_id, ep.title,
       COUNT(esq.id) AS total_q,
       SUM(CASE WHEN qq.question_image IS NOT NULL AND TRIM(qq.question_image)<>'' THEN 1 ELSE 0 END) AS with_img
FROM rd_exam_papers ep
JOIN rd_exam_sections es ON es.exam_paper_id=ep.exam_paper_id
JOIN rd_exam_section_questions esq ON esq.section_id=es.section_id
JOIN rd_quiz_questions qq ON qq.question_id=esq.question_id
WHERE ep.exam_paper_id IN (49,50)
GROUP BY ep.exam_paper_id, ep.title
ORDER BY ep.exam_paper_id;
"
