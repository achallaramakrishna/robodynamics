mysql -uroot -p'Jatni@752050' -D robodynamics_db -t -e "
SELECT career_code, plan_tier, COUNT(*) AS rows_cnt,
       MAX(updated_at) AS latest_update,
       SUM(CASE WHEN metadata_json LIKE '%OPENAI_BATCH_TOPSET_V1%' THEN 1 ELSE 0 END) AS ai_rows
FROM rd_ci_career_roadmap
WHERE module_code='APTIPATH' AND assessment_version='v3' AND grade_stage='ANY' AND status='ACTIVE'
  AND career_code IN ('AP3_CAR_0124','AP3_CAR_0446','AP3_CAR_0379','AP3_CAR_0462','AP3_CAR_0469','AP3_CAR_0482','AP3_CAR_0082','AP3_CAR_0084','AP3_CAR_0102','AP3_CAR_0305')
GROUP BY career_code, plan_tier
ORDER BY career_code, plan_tier;
"