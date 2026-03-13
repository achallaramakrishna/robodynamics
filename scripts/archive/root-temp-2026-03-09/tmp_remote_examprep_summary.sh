mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT 'COURSE34_QBANK',
       COUNT(*) AS total_questions,
       SUM(CASE WHEN correct_answer IS NOT NULL AND TRIM(correct_answer) <> '' THEN 1 ELSE 0 END) AS with_correct_answer,
       SUM(CASE WHEN explanation IS NOT NULL AND TRIM(explanation) <> '' THEN 1 ELSE 0 END) AS with_explanation
FROM rd_quiz_questions qq
JOIN rd_course_sessions cs ON cs.course_session_id = qq.course_session_id
WHERE cs.course_id = 34;

SELECT 'COURSE34_RECENT_EXAMS', ep.exam_paper_id, ep.title, ep.total_marks, ep.created_at
FROM rd_exam_papers ep
JOIN rd_course_session_details d ON d.course_session_detail_id = ep.course_session_detail_id
JOIN rd_course_sessions cs ON cs.course_session_id = d.course_session_id
WHERE cs.course_id = 34 AND ep.exam_type='FINAL_EXAM'
ORDER BY ep.exam_paper_id DESC
LIMIT 10;"
