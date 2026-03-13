mysql -uroot -p'Jatni@752050' -D robodynamics_db -t <<'SQL'
SELECT career_code, plan_tier, COUNT(*) cnt, MAX(created_at) latest
FROM rd_ci_career_roadmap
WHERE module_code='APTIPATH' AND assessment_version='v3'
  AND career_code IN ('AP3_CAR_0021','AP3_CAR_0042','AP3_CAR_0077','AP3_CAR_0369','AP3_CAR_0265')
GROUP BY career_code, plan_tier
ORDER BY career_code, plan_tier;
SQL
