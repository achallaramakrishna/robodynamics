mysql -uroot -pJatni@752050 -Nse "SELECT TABLE_NAME, COLUMN_NAME
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA='robodynamics_db' AND COLUMN_NAME IN ('exam_paper_id','course_session_detail_id','section_id','submission_id')
ORDER BY TABLE_NAME, COLUMN_NAME;"