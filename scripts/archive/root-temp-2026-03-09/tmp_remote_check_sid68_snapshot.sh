mysql -uroot -p'Jatni@752050' -D robodynamics_db -t <<'SQL'
SELECT ci_recommendation_snapshot_id,
JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.topCareerMatches[0].careerCode')) AS top_code,
JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.topCareerMatches[0].careerName')) AS top_name
FROM rd_ci_recommendation_snapshot
WHERE ci_assessment_session_id=68
ORDER BY ci_recommendation_snapshot_id DESC
LIMIT 5;
SQL
