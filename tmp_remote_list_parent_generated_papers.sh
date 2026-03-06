#!/bin/bash
set -euo pipefail
mysql -uroot -pJatni@752050 robodynamics_db -Nse "
SELECT p.exam_paper_id, p.title, d.course_session_detail_id, d.creation_date,
       COUNT(esq.id) AS q_count,
       SUM(CASE WHEN qq.question_image IS NOT NULL AND TRIM(qq.question_image)<>'' THEN 1 ELSE 0 END) AS img_q_count
FROM rd_exam_papers p
JOIN rd_course_session_details d ON d.course_session_detail_id=p.course_session_detail_id
LEFT JOIN rd_exam_sections es ON es.exam_paper_id=p.exam_paper_id
LEFT JOIN rd_exam_section_questions esq ON esq.section_id=es.section_id
LEFT JOIN rd_quiz_questions qq ON qq.question_id=esq.question_id
WHERE d.course_session_id=2715
GROUP BY p.exam_paper_id, p.title, d.course_session_detail_id, d.creation_date
ORDER BY p.created_at DESC;
"
