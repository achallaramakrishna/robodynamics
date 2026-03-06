mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -s <<'SQL'
SELECT JSON_LENGTH(career_clusters_json, '$.topCareerMatches')
FROM rd_ci_recommendation_snapshot
WHERE ci_assessment_session_id=65
ORDER BY ci_recommendation_snapshot_id DESC
LIMIT 1;
SELECT JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json, CONCAT('$.topCareerMatches[', n.n, '].careerName')))
FROM (
  SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
  UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
  UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14
  UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19
) n
JOIN rd_ci_recommendation_snapshot rs ON rs.ci_assessment_session_id=65
WHERE rs.ci_assessment_session_id=65
  AND rs.ci_recommendation_snapshot_id=(SELECT MAX(ci_recommendation_snapshot_id) FROM rd_ci_recommendation_snapshot WHERE ci_assessment_session_id=65)
ORDER BY n.n;
SQL
