USE robodynamics_db;
SELECT CASE
  WHEN question_code LIKE 'APG11PCM_%' THEN 'PCM'
  WHEN question_code LIKE 'APG11PCB_%' THEN 'PCB'
  WHEN question_code LIKE 'APG11COM_%' THEN 'COMMERCE'
  WHEN question_code LIKE 'APG11HUM_%' THEN 'HUMANITIES'
  ELSE 'UNKNOWN'
END AS stream, COUNT(*)
FROM rd_ci_question_bank
WHERE module_code='APTIPATH' AND assessment_version='v3' AND grade_level='GRADE_11_12' AND status='ACTIVE'
GROUP BY stream
ORDER BY stream;
SELECT 'TOTAL', COUNT(*)
FROM rd_ci_question_bank
WHERE module_code='APTIPATH' AND assessment_version='v3' AND grade_level='GRADE_11_12' AND status='ACTIVE';
SELECT 'ARCHIVED_THIS_BATCH', COUNT(*)
FROM rd_ci_question_bank
WHERE module_code='APTIPATH' AND assessment_version='v3' AND status='ARCHIVED' AND archive_batch='20260302_grade_11_12_refresh';
