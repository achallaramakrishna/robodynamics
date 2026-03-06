set -e
mysql -uroot -pJatni@752050 -D robodynamics_db -N -s <<'SQL'
START TRANSACTION;
SET FOREIGN_KEY_CHECKS=0;
DELETE ar
FROM rd_ci_assessment_response ar
JOIN rd_ci_assessment_session s ON s.ci_assessment_session_id = ar.ci_assessment_session_id
JOIN rd_ci_subscription sub ON sub.ci_subscription_id = s.ci_subscription_id
WHERE sub.module_code='APTIPATH';
DELETE si
FROM rd_ci_score_index si
JOIN rd_ci_assessment_session s ON s.ci_assessment_session_id = si.ci_assessment_session_id
JOIN rd_ci_subscription sub ON sub.ci_subscription_id = s.ci_subscription_id
WHERE sub.module_code='APTIPATH';
DELETE rs
FROM rd_ci_recommendation_snapshot rs
JOIN rd_ci_assessment_session s ON s.ci_assessment_session_id = rs.ci_assessment_session_id
JOIN rd_ci_subscription sub ON sub.ci_subscription_id = s.ci_subscription_id
WHERE sub.module_code='APTIPATH';
DELETE s
FROM rd_ci_assessment_session s
JOIN rd_ci_subscription sub ON sub.ci_subscription_id = s.ci_subscription_id
WHERE sub.module_code='APTIPATH';
SET FOREIGN_KEY_CHECKS=1;
COMMIT;
SELECT 'sessions', COUNT(*) FROM rd_ci_assessment_session s JOIN rd_ci_subscription sub ON sub.ci_subscription_id=s.ci_subscription_id WHERE sub.module_code='APTIPATH';
SELECT 'responses', COUNT(*) FROM rd_ci_assessment_response ar JOIN rd_ci_assessment_session s ON s.ci_assessment_session_id=ar.ci_assessment_session_id JOIN rd_ci_subscription sub ON sub.ci_subscription_id=s.ci_subscription_id WHERE sub.module_code='APTIPATH';
SELECT 'scores', COUNT(*) FROM rd_ci_score_index si JOIN rd_ci_assessment_session s ON s.ci_assessment_session_id=si.ci_assessment_session_id JOIN rd_ci_subscription sub ON sub.ci_subscription_id=s.ci_subscription_id WHERE sub.module_code='APTIPATH';
SELECT 'snapshots', COUNT(*) FROM rd_ci_recommendation_snapshot rs JOIN rd_ci_assessment_session s ON s.ci_assessment_session_id=rs.ci_assessment_session_id JOIN rd_ci_subscription sub ON sub.ci_subscription_id=s.ci_subscription_id WHERE sub.module_code='APTIPATH';
SQL
