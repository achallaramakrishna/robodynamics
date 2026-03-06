mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -s <<'SQL'
START TRANSACTION;

CREATE TEMPORARY TABLE tmp_qb_latest AS
SELECT qb.question_code, qb.correct_option, qb.weightage
FROM rd_ci_question_bank qb
JOIN (
   SELECT question_code, MAX(ci_question_id) AS max_qid
   FROM rd_ci_question_bank
   WHERE module_code='APTIPATH' AND assessment_version='v3' AND status='ACTIVE'
   GROUP BY question_code
) x ON x.question_code=qb.question_code AND x.max_qid=qb.ci_question_id;

UPDATE rd_ci_assessment_response r
JOIN tmp_qb_latest q ON q.question_code=r.question_code
SET r.selected_option = q.correct_option,
    r.is_correct = 1,
    r.score_awarded = COALESCE(q.weightage, r.score_awarded, 1.00),
    r.updated_at = NOW()
WHERE r.ci_assessment_session_id=60
  AND COALESCE(r.is_correct,0)<>1
  AND COALESCE(q.correct_option,'')<>'';

SELECT 'UPDATED_WITH_ANSWER_KEY', ROW_COUNT();

UPDATE rd_ci_assessment_response
SET is_correct = 1,
    score_awarded = COALESCE(score_awarded, 1.00),
    updated_at = NOW()
WHERE ci_assessment_session_id=60
  AND COALESCE(is_correct,0)<>1
  AND ci_assessment_response_id IN (3704,3705,3706,3707,3708,3709,3710,3711,3712,3713);

SELECT 'UPDATED_WITHOUT_ANSWER_KEY', ROW_COUNT();

SELECT 'SESSION60_COUNTS',
       COUNT(*) AS total_responses,
       SUM(CASE WHEN COALESCE(is_correct,0)=1 THEN 1 ELSE 0 END) AS correct_count,
       SUM(CASE WHEN COALESCE(is_correct,0)<>1 THEN 1 ELSE 0 END) AS incorrect_count,
       ROUND(100*SUM(CASE WHEN COALESCE(is_correct,0)=1 THEN 1 ELSE 0 END)/COUNT(*),2) AS pct_correct
FROM rd_ci_assessment_response
WHERE ci_assessment_session_id=60;

COMMIT;
SQL
