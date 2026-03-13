mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT d.course_session_detail_id,
       d.session_id,
       d.type,
       d.topic,
       d.exam_paper_id,
       ep.title,
       ep.exam_type,
       ep.created_at
FROM rd_course_session_details d
LEFT JOIN rd_exam_papers ep ON ep.exam_paper_id = d.exam_paper_id
WHERE d.course_id = 34
  AND LOWER(TRIM(d.type)) = 'exampaper'
ORDER BY d.course_session_detail_id DESC
LIMIT 20;"
