mysql -uroot -p'Jatni@752050' -D robodynamics_db -t <<'SQL'
SHOW COLUMNS FROM rd_ci_career_catalog;
SELECT ci_career_catalog_id, career_code, career_name, status
FROM rd_ci_career_catalog
WHERE career_code='AP3_CAR_0077'
LIMIT 5;
SQL
