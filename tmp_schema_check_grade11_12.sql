USE robodynamics_db;
SHOW COLUMNS FROM rd_ci_question_bank LIKE 'grade_level';
SHOW COLUMNS FROM rd_ci_question_bank LIKE 'archived_at';
SHOW COLUMNS FROM rd_ci_question_bank LIKE 'archive_reason';
SHOW COLUMNS FROM rd_ci_question_bank LIKE 'archive_batch';
SELECT COUNT(*) FROM rd_ci_question_bank WHERE question_code LIKE 'APG11%';
SELECT COUNT(*) FROM rd_ci_question_bank WHERE grade_level='GRADE_11_12';
