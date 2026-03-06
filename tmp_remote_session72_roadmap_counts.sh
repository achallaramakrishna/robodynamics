mysql -uroot -p'Jatni@752050' -D robodynamics_db -t <<'SQL'
SELECT career_code, plan_tier, grade_stage, section_type, COUNT(*) AS cnt
FROM rd_ci_career_roadmap
WHERE module_code='APTIPATH' AND assessment_version='v3' AND status='ACTIVE'
  AND career_code IN ('AP3_CAR_0082','AP3_CAR_0482','AP3_CAR_0102','AP3_CAR_0124','AP3_CAR_0305')
GROUP BY career_code, plan_tier, grade_stage, section_type
ORDER BY career_code, plan_tier, grade_stage, section_type;
SQL