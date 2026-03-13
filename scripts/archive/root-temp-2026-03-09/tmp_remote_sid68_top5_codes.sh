mysql -uroot -p'Jatni@752050' -D robodynamics_db -t <<'SQL'
SELECT
  JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[0].careerCode')) c1,
  JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[1].careerCode')) c2,
  JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[2].careerCode')) c3,
  JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[3].careerCode')) c4,
  JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[4].careerCode')) c5
FROM rd_ci_recommendation_snapshot rs
WHERE rs.ci_assessment_session_id=68
ORDER BY rs.ci_recommendation_snapshot_id DESC LIMIT 1;
SQL
