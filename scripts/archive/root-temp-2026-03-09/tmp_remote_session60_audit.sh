mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -s <<'SQL'
SHOW TABLES LIKE 'rd_user%';
DESCRIBE rd_user;
DESCRIBE rd_users;
SELECT ci_assessment_session_id, assessment_version, student_user_id, status, started_at, completed_at FROM rd_ci_assessment_session WHERE ci_assessment_session_id=60;
SELECT COUNT(*) AS total_responses, SUM(CASE WHEN is_correct=1 THEN 1 ELSE 0 END) AS correct_count, ROUND(100*SUM(CASE WHEN is_correct=1 THEN 1 ELSE 0 END)/COUNT(*),2) AS pct_correct FROM rd_ci_assessment_response WHERE ci_assessment_session_id=60;
SELECT r.question_code, r.selected_option, q.correct_option, r.is_correct
FROM rd_ci_assessment_response r
JOIN rd_ci_question_bank q ON q.question_code=r.question_code AND q.module_code='APTIPATH' AND q.assessment_version='v3'
WHERE r.ci_assessment_session_id=60 AND COALESCE(r.is_correct,0)<>1
ORDER BY r.ci_assessment_response_id;
SQL
