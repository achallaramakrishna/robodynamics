mysql -uroot -p'"'"'Jatni@752050'"'"' -D robodynamics_db -N -s <<'"'"'SQL'"'"'
SELECT CASE
  WHEN metadata_json LIKE '%OPENAI_BATCH_TOPSET_V2%' THEN 'OPENAI_BATCH_TOPSET_V2'
  WHEN metadata_json LIKE '%OPENAI_BATCH_TOPSET_V1%' THEN 'OPENAI_BATCH_TOPSET_V1'
  WHEN metadata_json LIKE '%OPENAI_BATCH_RANKED_V1%' THEN 'OPENAI_BATCH_RANKED_V1'
  WHEN metadata_json LIKE '%PY_AGENTIC_BACKFILL_V1%' THEN 'PY_AGENTIC_BACKFILL_V1'
  WHEN metadata_json LIKE '%OPENAI_AUTOFILL%' THEN 'OPENAI_AUTOFILL'
  ELSE 'OTHER'
END AS src,
COUNT(*) AS cnt,
COUNT(DISTINCT career_code) AS careers,
DATE_FORMAT(MAX(updated_at),'%Y-%m-%d %H:%i:%s') AS latest
FROM rd_ci_career_roadmap
WHERE module_code='APTIPATH' AND assessment_version='v3' AND status='ACTIVE'
GROUP BY src
ORDER BY cnt DESC;

SELECT 'TOTAL' AS src,
COUNT(*) AS cnt,
COUNT(DISTINCT career_code) AS careers,
DATE_FORMAT(MAX(updated_at),'%Y-%m-%d %H:%i:%s') AS latest
FROM rd_ci_career_roadmap
WHERE module_code='APTIPATH' AND assessment_version='v3' AND status='ACTIVE';
SQL