mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -s <<'SQL'
SELECT
  JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.topCareerMatches[0].careerName')),
  JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.topCareerMatches[1].careerName')),
  JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.topCareerMatches[2].careerName'))
FROM rd_ci_recommendation_snapshot
WHERE ci_assessment_session_id=66
ORDER BY ci_recommendation_snapshot_id DESC
LIMIT 1;
SELECT JSON_SEARCH(career_clusters_json,'one','AI/ML Engineer',NULL,'$.topCareerMatches[*].careerName')
FROM rd_ci_recommendation_snapshot
WHERE ci_assessment_session_id=66
ORDER BY ci_recommendation_snapshot_id DESC
LIMIT 1;
SQL
