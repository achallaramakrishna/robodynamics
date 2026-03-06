mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -s <<'SQL'
SHOW COLUMNS FROM rd_ci_assessment_response;
SHOW COLUMNS FROM rd_ci_recommendation_snapshot;
SQL
