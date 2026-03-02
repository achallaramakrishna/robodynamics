mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT LOWER(TRIM(type)) AS type_norm, COUNT(*)
FROM rd_course_session_details
WHERE course_id = 34
GROUP BY LOWER(TRIM(type))
ORDER BY COUNT(*) DESC;

SELECT course_session_detail_id, type, topic, exam_paper_id, course_session_id
FROM rd_course_session_details
WHERE course_id = 34 AND exam_paper_id IS NOT NULL
ORDER BY course_session_detail_id DESC
LIMIT 20;"
