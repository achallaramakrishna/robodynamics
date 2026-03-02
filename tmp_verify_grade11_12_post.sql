USE robodynamics_db;
SELECT grade_level, COUNT(*) FROM rd_ci_question_bank WHERE module_code='APTIPATH' AND assessment_version='v3' AND status='ACTIVE' AND grade_level='GRADE_11_12' GROUP BY grade_level;
SELECT COUNT(*) FROM rd_ci_question_bank WHERE module_code='APTIPATH' AND assessment_version='v3' AND status='ACTIVE' AND question_code LIKE 'APG11%';
