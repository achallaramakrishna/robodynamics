#!/bin/bash
set -euo pipefail
mysql -uroot -pJatni@752050 robodynamics_db -Nse "
SELECT 'COURSE', c.course_id, c.course_name FROM rd_courses c WHERE c.course_id IN (34,35);

SELECT 'SESS', s.course_id, s.course_session_id, s.session_title, COUNT(d.course_session_detail_id) AS detail_count
FROM rd_course_sessions s
LEFT JOIN rd_course_session_details d ON d.course_session_id=s.course_session_id AND d.type='exampaper'
WHERE s.course_id IN (34,35)
  AND LOWER(s.session_title) LIKE '%parent%'
GROUP BY s.course_id, s.course_session_id, s.session_title
ORDER BY s.course_id, s.course_session_id;

SELECT 'PAPER', s.course_id, p.exam_paper_id, p.title,
       COUNT(esq.id) AS total_q,
       SUM(CASE WHEN qq.question_image IS NOT NULL AND TRIM(qq.question_image)<>'' THEN 1 ELSE 0 END) AS img_q,
       SUM(CASE WHEN qq.question_image IS NULL OR TRIM(qq.question_image)='' THEN 1 ELSE 0 END) AS noimg_q
FROM rd_exam_papers p
JOIN rd_course_session_details d ON d.course_session_detail_id=p.course_session_detail_id
JOIN rd_course_sessions s ON s.course_session_id=d.course_session_id
LEFT JOIN rd_exam_sections es ON es.exam_paper_id=p.exam_paper_id
LEFT JOIN rd_exam_section_questions esq ON esq.section_id=es.section_id
LEFT JOIN rd_quiz_questions qq ON qq.question_id=esq.question_id
WHERE s.course_id IN (34,35)
  AND LOWER(s.session_title) LIKE '%parent%'
GROUP BY s.course_id, p.exam_paper_id, p.title
ORDER BY s.course_id, p.exam_paper_id;
"
