mysql -uroot -p'Jatni@752050' -D robodynamics_db -t -e "
SELECT c.career_code, c.career_name,
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
GROUP BY c.career_code, c.career_name
HAVING overview_cnt < 1
    OR what_to_study_cnt < 1
    OR skills_cnt < 1
    OR projects_cnt < 1
    OR where_to_study_cnt < 1
    OR action90_cnt < 3
    OR milestone_cnt < 3
    OR upgrade_cnt < 1
ORDER BY c.career_code;
"