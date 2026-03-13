#!/bin/bash
set -e
mysql -uroot -pJatni@752050 -D robodynamics_db -t -e "
DESCRIBE rd_ci_question_bank;

SELECT COUNT(*) AS duplicate_question_texts
FROM (
  SELECT question_text
  FROM rd_ci_question_bank
  WHERE module_code='APTIPATH' AND assessment_version='v3' AND status='ACTIVE'
  GROUP BY question_text
  HAVING COUNT(*) > 1
) d;

SELECT question_code, sequence_no, section_code
FROM rd_ci_question_bank
WHERE module_code='APTIPATH' AND assessment_version='v3' AND status='ACTIVE'
  AND question_code LIKE 'AP_G10_%'
ORDER BY sequence_no;
"
