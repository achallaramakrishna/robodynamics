mysql -uroot -pJatni@752050 -D robodynamics_db -N -s <<'SQL'
SELECT career_code, plan_tier, section_type, item_order, title, LEFT(detail_text,120) FROM rd_ci_career_roadmap WHERE status='ACTIVE' ORDER BY career_code, plan_tier, section_type, item_order LIMIT 30;
SQL
