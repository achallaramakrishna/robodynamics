mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -s <<'SQL'
SELECT
  SUM(CASE WHEN COALESCE(r.is_correct,0)<>1 AND COALESCE(q.correct_option,'')<>'' THEN 1 ELSE 0 END) AS incorrect_with_answer_key,
  SUM(CASE WHEN COALESCE(r.is_correct,0)<>1 AND COALESCE(q.correct_option,'')='' THEN 1 ELSE 0 END) AS incorrect_without_answer_key
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
WHERE r.ci_assessment_session_id=60;
SQL
