mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -s <<'SQL'
SHOW COLUMNS FROM rd_ci_subscription;
SHOW COLUMNS FROM rd_ci_assessment_session;
SQL
