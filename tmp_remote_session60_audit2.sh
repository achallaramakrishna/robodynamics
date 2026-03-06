mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -s <<'SQL'
DESCRIBE rd_users;
SELECT s.ci_assessment_session_id, s.assessment_version, s.student_user_id, u.userName, s.status, DATE_FORMAT(s.started_at,'%Y-%m-%d %H:%i:%s'), DATE_FORMAT(s.completed_at,'%Y-%m-%d %H:%i:%s')
FROM rd_ci_assessment_session s
LEFT JOIN rd_users u ON u.userID=s.student_user_id
WHERE s.ci_assessment_session_id=60;
SELECT COUNT(*) AS total_responses, SUM(CASE WHEN is_correct=1 THEN 1 ELSE 0 END) AS correct_count, ROUND(100*SUM(CASE WHEN is_correct=1 THEN 1 ELSE 0 END)/COUNT(*),2) AS pct_correct
FROM rd_ci_assessment_response
WHERE ci_assessment_session_id=60;
SELECT r.ci_assessment_response_id, r.question_code, COALESCE(r.selected_option,''), COALESCE(q.correct_option,''), COALESCE(r.is_correct,0)
FROM rd_ci_assessment_response r
LEFT JOIN rd_ci_question_bank q
  ON q.question_code=r.question_code
 AND q.module_code='APTIPATH'
 AND q.assessment_version='v3'
 AND q.status='ACTIVE'
WHERE r.ci_assessment_session_id=60
  AND COALESCE(r.is_correct,0)<>1
ORDER BY r.ci_assessment_response_id;
SQL
