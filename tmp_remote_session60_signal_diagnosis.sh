mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -s <<'SQL'
SELECT
  si.aptitude_score,
  si.interest_score,
  si.parent_context_score,
  si.overall_fit_score,
  si.pressure_index,
  si.exploration_index,
  si.exam_readiness_index,
  si.ai_readiness_index,
  si.alignment_index,
  si.wellbeing_risk_index,
  si.scoring_version
FROM rd_ci_score_index si
WHERE si.ci_assessment_session_id=60;

SELECT recommendation_version,
       JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.selectedCareerIntents[0]')),
       JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.selectedCareerIntents[1]')),
       JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.subjectAffinitySignals.math')),
       JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.subjectAffinitySignals.physics')),
       JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.subjectAffinitySignals.biology')),
       JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.streamFitIndices.IIT')),
       JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.streamFitIndices.NEET')),
       JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.streamFitIndices.CAT')),
       JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.streamFitIndices.LAW'))
FROM rd_ci_recommendation_snapshot
WHERE ci_assessment_session_id=60
ORDER BY ci_recommendation_snapshot_id DESC
LIMIT 1;

SELECT q.section_code,
       COUNT(*) total,
       SUM(CASE WHEN COALESCE(r.is_correct,0)=1 THEN 1 ELSE 0 END) correct,
       ROUND(100*SUM(CASE WHEN COALESCE(r.is_correct,0)=1 THEN 1 ELSE 0 END)/COUNT(*),2) pct
FROM rd_ci_assessment_response r
JOIN rd_ci_question_bank q
  ON q.question_code=r.question_code
 AND q.module_code='APTIPATH' AND q.assessment_version='v3' AND q.status='ACTIVE'
WHERE r.ci_assessment_session_id=60
GROUP BY q.section_code
ORDER BY pct DESC, q.section_code;
SQL
