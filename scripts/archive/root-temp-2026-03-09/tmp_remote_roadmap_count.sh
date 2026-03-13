mysql -uroot -pJatni@752050 -D robodynamics_db -N -s <<'SQL'
SELECT 'active_rows', COUNT(*) FROM rd_ci_career_roadmap WHERE status='ACTIVE';
SELECT 'distinct_careers', COUNT(DISTINCT career_code) FROM rd_ci_career_roadmap WHERE status='ACTIVE';
SQL
