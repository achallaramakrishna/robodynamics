mysql -uroot -pJatni@752050 -D robodynamics_db -N -s <<'SQL'
SHOW COLUMNS FROM rd_ci_career_roadmap;
SELECT career_code, career_name_key, plan_tier, section_key, LEFT(detail_text,120) FROM rd_ci_career_roadmap WHERE status='ACTIVE' ORDER BY career_code, plan_tier LIMIT 25;
SQL
