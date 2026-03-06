mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -s <<'SQL'
SELECT s.ci_assessment_session_id, s.assessment_version, s.student_user_id, u.user_name, s.status, DATE_FORMAT(s.started_at,'%Y-%m-%d %H:%i:%s'), DATE_FORMAT(s.completed_at,'%Y-%m-%d %H:%i:%s')
FROM rd_ci_assessment_session s
LEFT JOIN rd_users u ON u.user_id=s.student_user_id
WHERE s.ci_assessment_session_id=60;

SELECT COUNT(*) AS total_responses,
       SUM(CASE WHEN COALESCE(is_correct,0)=1 THEN 1 ELSE 0 END) AS correct_count,
       SUM(CASE WHEN COALESCE(is_correct,0)<>1 THEN 1 ELSE 0 END) AS incorrect_count,
       ROUND(100*SUM(CASE WHEN COALESCE(is_correct,0)=1 THEN 1 ELSE 0 END)/COUNT(*),2) AS pct_correct
FROM rd_ci_assessment_response
WHERE ci_assessment_session_id=60;

SELECT r.ci_assessment_response_id,
       r.question_code,
       COALESCE(r.selected_option,'') AS selected_option,
       COALESCE(q.correct_option,'') AS correct_option,
       COALESCE(r.is_correct,0) AS is_correct
FROM rd_ci_assessment_response r
LEFT JOIN (
  SELECT qb.question_code, qb.correct_option
  FROM rd_ci_question_bank qb
  JOIN (
     SELECT question_code, MAX(ci_question_id) AS max_qid
     FROM rd_ci_question_bank
     WHERE module_code='APTIPATH' AND assessment_version='v3' AND status='ACTIVE'
     GROUP BY question_code
  ) x ON x.question_code=qb.question_code AND x.max_qid=qb.ci_question_id
) q ON q.question_code=r.question_code
WHERE r.ci_assessment_session_id=60
  AND COALESCE(r.is_correct,0)<>1
ORDER BY r.ci_assessment_response_id;
SQL
