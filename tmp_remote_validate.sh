#!/bin/sh
set -e
mysql -uroot -p'Jatni@752050' -Nse "
SELECT 'QUESTION_TYPES', question_type, COUNT(1) FROM rd_ci_question_bank WHERE module_code='APTIPATH' AND assessment_version='v3' AND status='ACTIVE' GROUP BY question_type ORDER BY COUNT(1) DESC;
SELECT 'SECTION_COUNTS', section_code, COUNT(1) FROM rd_ci_question_bank WHERE module_code='APTIPATH' AND assessment_version='v3' AND status='ACTIVE' GROUP BY section_code ORDER BY COUNT(1) DESC;
SELECT 'QUESTION_NULLS',
SUM(CASE WHEN section_code IS NULL OR TRIM(section_code)='' THEN 1 ELSE 0 END),
SUM(CASE WHEN question_text IS NULL OR TRIM(question_text)='' THEN 1 ELSE 0 END),
SUM(CASE WHEN question_type IS NULL OR TRIM(question_type)='' THEN 1 ELSE 0 END),
SUM(CASE WHEN options_json IS NULL OR TRIM(options_json)='' THEN 1 ELSE 0 END)
FROM rd_ci_question_bank WHERE module_code='APTIPATH' AND assessment_version='v3' AND status='ACTIVE';
SELECT 'CAREER_PHASE', COALESCE(NULLIF(TRIM(target_phase),''),'BLANK'), COUNT(1) FROM rd_ci_career_catalog WHERE module_code='APTIPATH' AND assessment_version='v3' AND status='ACTIVE' GROUP BY COALESCE(NULLIF(TRIM(target_phase),''),'BLANK') ORDER BY COUNT(1) DESC;
SELECT 'CAREER_CLUSTER', cluster_name, COUNT(1) FROM rd_ci_career_catalog WHERE module_code='APTIPATH' AND assessment_version='v3' AND status='ACTIVE' GROUP BY cluster_name ORDER BY COUNT(1) DESC;
SELECT 'PRIMARY_65',
SUM(CASE WHEN CAST(SUBSTRING_INDEX(career_code, '_', -1) AS UNSIGNED) BETWEEN 1 AND 65 THEN 1 ELSE 0 END),
SUM(CASE WHEN CAST(SUBSTRING_INDEX(career_code, '_', -1) AS UNSIGNED) > 65 THEN 1 ELSE 0 END),
COUNT(1)
FROM rd_ci_career_catalog WHERE module_code='APTIPATH' AND assessment_version='v3' AND status='ACTIVE';
SELECT 'ORPHAN_ADJUSTMENT', COUNT(1)
FROM rd_ci_career_adjustment a
LEFT JOIN rd_ci_career_catalog c ON c.module_code=a.module_code AND c.assessment_version=a.assessment_version AND c.cluster_name=a.cluster_name AND c.status='ACTIVE'
WHERE a.module_code='APTIPATH' AND a.assessment_version='v3' AND a.status='ACTIVE' AND c.ci_career_catalog_id IS NULL;
SELECT 'CLUSTER_WITHOUT_ADJ', COUNT(1)
FROM (
  SELECT c.cluster_name
  FROM rd_ci_career_catalog c
  LEFT JOIN rd_ci_career_adjustment a ON a.module_code=c.module_code AND a.assessment_version=c.assessment_version AND a.cluster_name=c.cluster_name AND a.status='ACTIVE'
  WHERE c.module_code='APTIPATH' AND c.assessment_version='v3' AND c.status='ACTIVE'
  GROUP BY c.cluster_name
  HAVING SUM(CASE WHEN a.ci_career_adjustment_id IS NOT NULL THEN 1 ELSE 0 END)=0
) x;
" robodynamics_db

for p in / /login /platform/modules /aptipath/parent/home /aptipath/student/home ; do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8080$p)
  echo "HTTP:$p:$code"
done
