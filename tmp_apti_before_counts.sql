SELECT 'Q_BEFORE' AS label, assessment_version, COUNT(1) AS cnt
FROM rd_ci_question_bank
WHERE module_code='APTIPATH' AND status='ACTIVE'
GROUP BY assessment_version;

SELECT 'CAREER_BEFORE' AS label, assessment_version, COUNT(1) AS cnt
FROM rd_ci_career_catalog
WHERE module_code='APTIPATH' AND status='ACTIVE'
GROUP BY assessment_version;

SELECT 'ADJ_BEFORE' AS label, assessment_version, COUNT(1) AS cnt
FROM rd_ci_career_adjustment
WHERE module_code='APTIPATH' AND status='ACTIVE'
GROUP BY assessment_version;
