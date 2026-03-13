#!/bin/bash
set -euo pipefail

mysql -uroot -pJatni@752050 robodynamics_db -Nse "
SELECT 'GRADE_5_8_COURSES';
SELECT c.course_id,
       c.course_name,
       IFNULL(c.is_active,0) AS is_active,
       IFNULL(c.course_level,''),
       IFNULL(c.grade_range,''),
       IFNULL(c.category,'')
FROM rd_courses c
WHERE c.course_name REGEXP '^CBSE Grade (5|6|7|8)'
ORDER BY c.course_id;

SELECT 'GRADE_5_8_COURSE_STATUS';
SELECT c.course_id,
       c.course_name,
       IFNULL(s.total_sessions,0) AS total_sessions,
       IFNULL(s.active_sessions,0) AS active_sessions,
       IFNULL(sd.total_session_details,0) AS total_session_details,
       IFNULL(q.sessions_with_qbank,0) AS sessions_with_qbank,
       IFNULL(q.total_questions,0) AS total_questions,
       IFNULL(q.image_questions,0) AS image_questions
FROM rd_courses c
LEFT JOIN (
  SELECT cs.course_id,
         COUNT(*) AS total_sessions,
         SUM(CASE WHEN IFNULL(cs.is_active,0)=1 THEN 1 ELSE 0 END) AS active_sessions
  FROM rd_course_sessions cs
  GROUP BY cs.course_id
) s ON s.course_id = c.course_id
LEFT JOIN (
  SELECT d.course_id,
         COUNT(*) AS total_session_details
  FROM rd_course_session_details d
  GROUP BY d.course_id
) sd ON sd.course_id = c.course_id
LEFT JOIN (
  SELECT cs.course_id,
         COUNT(DISTINCT cs.course_session_id) AS sessions_with_qbank,
         COUNT(*) AS total_questions,
         SUM(CASE WHEN q.question_image IS NOT NULL AND TRIM(q.question_image)<>'' THEN 1 ELSE 0 END) AS image_questions
  FROM rd_course_sessions cs
  JOIN rd_quiz_questions q ON q.course_session_id = cs.course_session_id
  GROUP BY cs.course_id
) q ON q.course_id = c.course_id
WHERE c.course_name REGEXP '^CBSE Grade (5|6|7|8)'
ORDER BY c.course_id;

SELECT 'GRADE_5_8_GENERATED_PAPERS';
SELECT d.course_id,
       c.course_name,
       COUNT(*) AS total_exam_papers,
       MAX(DATE_FORMAT(p.created_at,'%Y-%m-%d %H:%i:%s')) AS last_paper_created_at
FROM rd_exam_papers p
JOIN rd_course_session_details d ON d.course_session_detail_id = p.course_session_detail_id
JOIN rd_courses c ON c.course_id = d.course_id
WHERE c.course_name REGEXP '^CBSE Grade (5|6|7|8)'
GROUP BY d.course_id, c.course_name
ORDER BY d.course_id;
"