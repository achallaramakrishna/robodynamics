mysql -uroot -pJatni@752050 -D robodynamics_db -N -s -e "
SELECT 'VERIFY_LATEST_SESSION', MAX(s.ci_assessment_session_id)
FROM rd_ci_assessment_session s
JOIN rd_ci_subscription sub ON sub.ci_subscription_id=s.ci_subscription_id
JOIN rd_users u ON u.user_id=s.student_user_id
WHERE sub.module_code='APTIPATH' AND u.user_name='sashank_1';
SELECT 'VERIFY_ANSWER_COUNT', COUNT(*)
FROM rd_ci_assessment_response r
WHERE r.ci_assessment_session_id=(
  SELECT MAX(s.ci_assessment_session_id)
  FROM rd_ci_assessment_session s
  JOIN rd_ci_subscription sub ON sub.ci_subscription_id=s.ci_subscription_id
  JOIN rd_users u ON u.user_id=s.student_user_id
  WHERE sub.module_code='APTIPATH' AND u.user_name='sashank_1'
);
SELECT 'VERIFY_DISTINCT_Q', COUNT(DISTINCT r.question_code)
FROM rd_ci_assessment_response r
WHERE r.ci_assessment_session_id=(
  SELECT MAX(s.ci_assessment_session_id)
  FROM rd_ci_assessment_session s
  JOIN rd_ci_subscription sub ON sub.ci_subscription_id=s.ci_subscription_id
  JOIN rd_users u ON u.user_id=s.student_user_id
  WHERE sub.module_code='APTIPATH' AND u.user_name='sashank_1'
);
" 
