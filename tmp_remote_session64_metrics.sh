mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -s <<'SQL'
SELECT 'SCORE_INDEX', aptitude_score, interest_score, overall_fit_score, exam_readiness_index, ai_readiness_index, alignment_index, wellbeing_risk_index
FROM rd_ci_score_index
WHERE ci_assessment_session_id=64;
SELECT 'TOP1', JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.topCareerMatches[0].careerName')), JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.topCareerMatches[0].fitScore'))
FROM rd_ci_recommendation_snapshot WHERE ci_assessment_session_id=64 ORDER BY ci_recommendation_snapshot_id DESC LIMIT 1;
SELECT 'STREAM',
JSON_UNQUOTE(JSON_EXTRACT(stream_fit_json,'$.iit')),
JSON_UNQUOTE(JSON_EXTRACT(stream_fit_json,'$.ai_systems')),
JSON_UNQUOTE(JSON_EXTRACT(stream_fit_json,'$.robotics'))
FROM rd_ci_recommendation_snapshot WHERE ci_assessment_session_id=64 ORDER BY ci_recommendation_snapshot_id DESC LIMIT 1;
SQL
