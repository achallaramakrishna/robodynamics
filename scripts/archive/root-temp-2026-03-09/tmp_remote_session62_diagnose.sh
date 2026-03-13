mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -s <<'SQL'
SELECT 'SESSION', s.ci_assessment_session_id, u.user_name, s.status, s.assessment_version
FROM rd_ci_assessment_session s
JOIN rd_users u ON u.user_id=s.student_user_id
WHERE s.ci_assessment_session_id=62;

SELECT 'SCORE_INDEX', aptitude_score, interest_score, parent_context_score, overall_fit_score,
       exam_readiness_index, ai_readiness_index, alignment_index, wellbeing_risk_index
FROM rd_ci_score_index
WHERE ci_assessment_session_id=62;

SELECT 'INTENTS',
       JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.selectedCareerIntents[0]')),
       JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.selectedCareerIntents[1]')),
       JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.selectedCareerIntents[2]'))
FROM rd_ci_recommendation_snapshot
WHERE ci_assessment_session_id=62
ORDER BY ci_recommendation_snapshot_id DESC LIMIT 1;

SELECT 'STREAM_FITS',
       JSON_UNQUOTE(JSON_EXTRACT(stream_fit_json,'$.iit')),
       JSON_UNQUOTE(JSON_EXTRACT(stream_fit_json,'$.neet')),
       JSON_UNQUOTE(JSON_EXTRACT(stream_fit_json,'$.cat')),
       JSON_UNQUOTE(JSON_EXTRACT(stream_fit_json,'$.law')),
       JSON_UNQUOTE(JSON_EXTRACT(stream_fit_json,'$.robotics')),
       JSON_UNQUOTE(JSON_EXTRACT(stream_fit_json,'$.ai_systems'))
FROM rd_ci_recommendation_snapshot
WHERE ci_assessment_session_id=62
ORDER BY ci_recommendation_snapshot_id DESC LIMIT 1;

SELECT 'TOP1', JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.topCareerMatches[0].careerName')),
              JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.topCareerMatches[0].cluster')),
              JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.topCareerMatches[0].fitScore'))
FROM rd_ci_recommendation_snapshot
WHERE ci_assessment_session_id=62 ORDER BY ci_recommendation_snapshot_id DESC LIMIT 1;
SELECT 'TOP2', JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.topCareerMatches[1].careerName')),
              JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.topCareerMatches[1].cluster')),
              JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.topCareerMatches[1].fitScore'))
FROM rd_ci_recommendation_snapshot
WHERE ci_assessment_session_id=62 ORDER BY ci_recommendation_snapshot_id DESC LIMIT 1;
SELECT 'TOP3', JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.topCareerMatches[2].careerName')),
              JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.topCareerMatches[2].cluster')),
              JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.topCareerMatches[2].fitScore'))
FROM rd_ci_recommendation_snapshot
WHERE ci_assessment_session_id=62 ORDER BY ci_recommendation_snapshot_id DESC LIMIT 1;

SELECT 'HAS_AIML_IN_TOP20',
       JSON_SEARCH(career_clusters_json, 'one', '%AI/ML Engineer%', NULL, '$.topCareerMatches[*].careerName') IS NOT NULL
FROM rd_ci_recommendation_snapshot
WHERE ci_assessment_session_id=62
ORDER BY ci_recommendation_snapshot_id DESC LIMIT 1;
SQL
