#!/bin/bash
set -euo pipefail
DB='robodynamics_db'

echo '=== ACTIVE CAREERS ==='
mysql -uroot -p'Jatni@752050' -D "$DB" -t -e "
SELECT COUNT(*) AS active_career_codes
FROM rd_ci_career_catalog
WHERE module_code='APTIPATH' AND assessment_version='v3' AND status='ACTIVE';
"

echo '=== MISSING COVERAGE (BASIC ANY) ==='
mysql -uroot -p'Jatni@752050' -D "$DB" -t -e "
SELECT COUNT(*) AS missing_basic_any
FROM (
  SELECT c.career_code,
         SUM(CASE WHEN r.section_type='OVERVIEW' THEN 1 ELSE 0 END) overview_cnt,
         SUM(CASE WHEN r.section_type='WHAT_TO_STUDY' THEN 1 ELSE 0 END) what_to_study_cnt,
         SUM(CASE WHEN r.section_type='SKILLS' THEN 1 ELSE 0 END) skills_cnt,
         SUM(CASE WHEN r.section_type='PROJECTS' THEN 1 ELSE 0 END) projects_cnt,
         SUM(CASE WHEN r.section_type='WHERE_TO_STUDY' THEN 1 ELSE 0 END) where_to_study_cnt,
         SUM(CASE WHEN r.section_type='ACTION_90' THEN 1 ELSE 0 END) action90_cnt,
         SUM(CASE WHEN r.section_type='MILESTONE' THEN 1 ELSE 0 END) milestone_cnt,
         SUM(CASE WHEN r.section_type='UPGRADE' THEN 1 ELSE 0 END) upgrade_cnt
  FROM rd_ci_career_catalog c
  LEFT JOIN rd_ci_career_roadmap r
    ON r.module_code=c.module_code
   AND r.assessment_version=c.assessment_version
   AND r.career_code=c.career_code
   AND r.plan_tier='BASIC'
   AND r.grade_stage='ANY'
   AND r.status='ACTIVE'
  WHERE c.module_code='APTIPATH' AND c.assessment_version='v3' AND c.status='ACTIVE'
  GROUP BY c.career_code
) t
WHERE overview_cnt < 1
   OR what_to_study_cnt < 1
   OR skills_cnt < 1
   OR projects_cnt < 1
   OR where_to_study_cnt < 1
   OR action90_cnt < 3
   OR milestone_cnt < 2
   OR upgrade_cnt < 1;
"

echo '=== MISSING COVERAGE (PRO ANY) ==='
mysql -uroot -p'Jatni@752050' -D "$DB" -t -e "
SELECT COUNT(*) AS missing_pro_any
FROM (
  SELECT c.career_code,
         SUM(CASE WHEN r.section_type='OVERVIEW' THEN 1 ELSE 0 END) overview_cnt,
         SUM(CASE WHEN r.section_type='WHAT_TO_STUDY' THEN 1 ELSE 0 END) what_to_study_cnt,
         SUM(CASE WHEN r.section_type='SKILLS' THEN 1 ELSE 0 END) skills_cnt,
         SUM(CASE WHEN r.section_type='PROJECTS' THEN 1 ELSE 0 END) projects_cnt,
         SUM(CASE WHEN r.section_type='WHERE_TO_STUDY' THEN 1 ELSE 0 END) where_to_study_cnt,
         SUM(CASE WHEN r.section_type='ACTION_90' THEN 1 ELSE 0 END) action90_cnt,
         SUM(CASE WHEN r.section_type='MILESTONE' THEN 1 ELSE 0 END) milestone_cnt,
         SUM(CASE WHEN r.section_type='UPGRADE' THEN 1 ELSE 0 END) upgrade_cnt
  FROM rd_ci_career_catalog c
  LEFT JOIN rd_ci_career_roadmap r
    ON r.module_code=c.module_code
   AND r.assessment_version=c.assessment_version
   AND r.career_code=c.career_code
   AND r.plan_tier='PRO'
   AND r.grade_stage='ANY'
   AND r.status='ACTIVE'
  WHERE c.module_code='APTIPATH' AND c.assessment_version='v3' AND c.status='ACTIVE'
  GROUP BY c.career_code
) t
WHERE overview_cnt < 1
   OR what_to_study_cnt < 1
   OR skills_cnt < 1
   OR projects_cnt < 1
   OR where_to_study_cnt < 1
   OR action90_cnt < 3
   OR milestone_cnt < 3
   OR upgrade_cnt < 1;
"

echo '=== TOP 15 MOST FREQUENT MISSING BASIC CAREERS IN SNAPSHOTS ==='
mysql -uroot -p'Jatni@752050' -D "$DB" -t -e "
WITH missing_basic AS (
  SELECT c.career_code
  FROM rd_ci_career_catalog c
  LEFT JOIN rd_ci_career_roadmap r
    ON r.module_code=c.module_code
   AND r.assessment_version=c.assessment_version
   AND r.career_code=c.career_code
   AND r.plan_tier='BASIC'
   AND r.grade_stage='ANY'
   AND r.status='ACTIVE'
  WHERE c.module_code='APTIPATH' AND c.assessment_version='v3' AND c.status='ACTIVE'
  GROUP BY c.career_code
  HAVING SUM(CASE WHEN r.section_type='OVERVIEW' THEN 1 ELSE 0 END) < 1
      OR SUM(CASE WHEN r.section_type='WHAT_TO_STUDY' THEN 1 ELSE 0 END) < 1
      OR SUM(CASE WHEN r.section_type='SKILLS' THEN 1 ELSE 0 END) < 1
      OR SUM(CASE WHEN r.section_type='PROJECTS' THEN 1 ELSE 0 END) < 1
      OR SUM(CASE WHEN r.section_type='WHERE_TO_STUDY' THEN 1 ELSE 0 END) < 1
      OR SUM(CASE WHEN r.section_type='ACTION_90' THEN 1 ELSE 0 END) < 3
      OR SUM(CASE WHEN r.section_type='MILESTONE' THEN 1 ELSE 0 END) < 2
      OR SUM(CASE WHEN r.section_type='UPGRADE' THEN 1 ELSE 0 END) < 1
), freq AS (
  SELECT career_code, COUNT(*) AS freq
  FROM (
    SELECT JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[0].careerCode')) AS career_code FROM rd_ci_recommendation_snapshot rs
    UNION ALL SELECT JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[1].careerCode')) FROM rd_ci_recommendation_snapshot rs
    UNION ALL SELECT JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[2].careerCode')) FROM rd_ci_recommendation_snapshot rs
    UNION ALL SELECT JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[3].careerCode')) FROM rd_ci_recommendation_snapshot rs
    UNION ALL SELECT JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[4].careerCode')) FROM rd_ci_recommendation_snapshot rs
  ) x
  WHERE career_code IS NOT NULL AND career_code <> ''
  GROUP BY career_code
)
SELECT m.career_code,
       IFNULL(f.freq,0) AS snapshot_freq,
       c.career_name
FROM missing_basic m
LEFT JOIN freq f ON f.career_code=m.career_code
LEFT JOIN rd_ci_career_catalog c
  ON c.module_code='APTIPATH' AND c.assessment_version='v3' AND c.career_code=m.career_code
ORDER BY snapshot_freq DESC, m.career_code
LIMIT 15;
"