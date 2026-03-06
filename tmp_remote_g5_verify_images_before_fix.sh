#!/bin/bash
set -euo pipefail
mysql -uroot -pJatni@752050 robodynamics_db -Nse "
SELECT ep.exam_paper_id, ep.title, COUNT(esq.id) AS total_q, SUM(CASE WHEN qq.question_image IS NOT NULL AND TRIM(qq.question_image)<>'' THEN 1 ELSE 0 END) AS with_img
FROM rd_exam_papers ep
JOIN rd_exam_sections es ON es.exam_paper_id=ep.exam_paper_id
JOIN rd_exam_section_questions esq ON esq.section_id=es.section_id
JOIN rd_quiz_questions qq ON qq.question_id=esq.question_id
WHERE ep.exam_paper_id IN (49,50)
GROUP BY ep.exam_paper_id, ep.title
ORDER BY ep.exam_paper_id;
"
