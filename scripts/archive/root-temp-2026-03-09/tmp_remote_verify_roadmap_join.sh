mysql -uroot -pJatni@752050 -D robodynamics_db -N -s <<'SQL'
SELECT career_code, career_name FROM rd_ci_career_catalog WHERE career_name IN ('AI/ML Engineer','Robotics Maintenance Technician') ORDER BY career_name;
SELECT career_code, plan_tier, COUNT(*) FROM rd_ci_career_roadmap WHERE status='ACTIVE' AND career_code IN (
  SELECT career_code FROM rd_ci_career_catalog WHERE career_name IN ('AI/ML Engineer','Robotics Maintenance Technician')
) GROUP BY career_code, plan_tier ORDER BY career_code, plan_tier;
SQL
