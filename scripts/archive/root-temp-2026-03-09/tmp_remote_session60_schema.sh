mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -s <<'SQL'
SHOW TABLES LIKE 'rd_ci_assessment_response';
SHOW TABLES LIKE 'rd_ci_question_bank';
DESCRIBE rd_ci_assessment_response;
DESCRIBE rd_ci_question_bank;
SQL
