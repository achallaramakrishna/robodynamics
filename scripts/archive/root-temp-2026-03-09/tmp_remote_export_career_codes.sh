mysql -uroot -pJatni@752050 -D robodynamics_db -N -s <<'SQL'
SELECT career_code, career_name, cluster_name
FROM rd_ci_career_catalog
WHERE module_code='APTIPATH' AND status='ACTIVE'
ORDER BY career_code;
SQL
