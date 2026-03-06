#!/bin/bash
set -euo pipefail
python3 - <<'PY'
import subprocess
DB='robodynamics_db'
MYSQL=['mysql','-uroot','-pJatni@752050','-D',DB,'-N','-B']

def run_sql(sql):
    out=subprocess.check_output(MYSQL+['-e',sql],text=True)
    return [line.split('\t') for line in out.splitlines() if line.strip()]

def esc(s):
    return (s or '').replace('\\','\\\\').replace("'","\\'").replace('\n',' ').replace('\r',' ').strip()

def compact(s):
    return ' '.join((s or '').split())

rows = run_sql("""
SELECT c.career_code, IFNULL(c.career_name,''), IFNULL(c.cluster_name,''), IFNULL(c.required_subjects_csv,''), IFNULL(c.entrance_exams_csv,''), IFNULL(c.pathway_hint,'')
FROM rd_ci_career_catalog c
LEFT JOIN rd_ci_career_roadmap r
  ON r.module_code=c.module_code
 AND r.assessment_version=c.assessment_version
 AND r.career_code=c.career_code
 AND r.plan_tier='PRO'
 AND r.grade_stage='ANY'
 AND r.status='ACTIVE'
WHERE c.module_code='APTIPATH' AND c.assessment_version='v3' AND c.status='ACTIVE'
GROUP BY c.career_code, c.career_name, c.cluster_name, c.required_subjects_csv, c.entrance_exams_csv, c.pathway_hint
HAVING SUM(CASE WHEN r.section_type='OVERVIEW' THEN 1 ELSE 0 END) < 1
    OR SUM(CASE WHEN r.section_type='WHAT_TO_STUDY' THEN 1 ELSE 0 END) < 1
    OR SUM(CASE WHEN r.section_type='SKILLS' THEN 1 ELSE 0 END) < 1
    OR SUM(CASE WHEN r.section_type='PROJECTS' THEN 1 ELSE 0 END) < 1
    OR SUM(CASE WHEN r.section_type='WHERE_TO_STUDY' THEN 1 ELSE 0 END) < 1
    OR SUM(CASE WHEN r.section_type='ACTION_90' THEN 1 ELSE 0 END) < 3
    OR SUM(CASE WHEN r.section_type='MILESTONE' THEN 1 ELSE 0 END) < 3
    OR SUM(CASE WHEN r.section_type='UPGRADE' THEN 1 ELSE 0 END) < 1
""")

if not rows:
    print('NO_PRO_MISSING_CODES')
    raise SystemExit(0)

print('PATCHING_CODES=' + ','.join(r[0] for r in rows))

vals=[]
for r in rows:
    code,name,cluster,subjects,exams,hint = (r+["","","","",""])[:6]
    code=compact(code).upper(); name=compact(name) or code
    cluster=compact(cluster) or 'emerging industries'
    subjects=compact(subjects) or 'Math, Science, Computer fundamentals'
    exams=compact(exams) or 'JEE / CUET / institution-specific entrances'
    hint=compact(hint) or 'Build consistent execution through projects and mentor feedback.'

    pro = [
      ('OVERVIEW',1,'Personalized Overview',f'This Pro roadmap maps {name} with deeper exam, college, and execution intelligence for 2026-2036.'),
      ('WHAT_TO_STUDY',1,'Academic Roadmap',f'Build grade-wise mastery in {subjects} with weekly checkpoints and monthly review.'),
      ('WHAT_TO_STUDY',2,'Exam-Specific Plan',f'Map exam prep stages to {exams} with topic sequencing and mock strategy.'),
      ('WHAT_TO_STUDY',3,'Higher-Ed Path',f'Target top-fit programs and maintain alternate pathways linked to {name}.'),
      ('SKILLS',1,'Core Competencies',f'Strengthen foundational and domain competencies required for {name}.'),
      ('SKILLS',2,'Advanced Competencies','Add role-specific advanced tools, communication, and collaboration workflows.'),
      ('SKILLS',3,'Performance Habits','Use weekly review, benchmark tests, and mentor feedback loops for steady growth.'),
      ('PROJECTS',1,'Project Track 1','Build one foundational project and document measurable outcomes.'),
      ('PROJECTS',2,'Project Track 2','Build one intermediate project demonstrating applied problem solving.'),
      ('PROJECTS',3,'Project Track 3','Build one advanced project to strengthen profile for admissions/interviews.'),
      ('WHERE_TO_STUDY',1,'Exam Intelligence',f'Use exam route mapping across {exams} with target score planning.'),
      ('WHERE_TO_STUDY',2,'College Intelligence','Use tiered college shortlisting with outcomes, affordability, and fit criteria.'),
      ('WHERE_TO_STUDY',3,'Execution Resources','Blend coaching/self-study/online tracks based on score trend and schedule fit.'),
      ('ACTION_90',1,'Days 1-30','Establish baseline metrics, schedule discipline, and weak-topic closure plan.'),
      ('ACTION_90',2,'Days 31-60','Increase mock intensity and complete at least one portfolio-grade project milestone.'),
      ('ACTION_90',3,'Days 61-90','Run mentor review, refine strategy, and lock next-quarter goals.'),
      ('MILESTONE',1,'By 2030',f'Show competitive readiness and profile quality for {name} pathways.'),
      ('MILESTONE',2,'By 2032','Convert early opportunities into internships, research, or product contributions.'),
      ('MILESTONE',3,'By 2036','Advance into specialization/leadership trajectory with strong execution evidence.'),
      ('UPGRADE',1,'Pro Depth',f'This roadmap continuously adapts to performance and intent signals for {name}.')
    ]
    for sec,ordr,title,detail in pro:
      vals.append(f"('APTIPATH','v3','{esc(code)}','PRO','ANY','{esc(sec)}',{ordr},'{esc(title)}','{esc(detail)}','{{\\\"source\\\":\\\"PY_AGENTIC_BACKFILL_V1\\\",\\\"phase\\\":\\\"PRO_PATCH\\\"}}','ACTIVE',NOW(),NOW())")

sql = "INSERT IGNORE INTO rd_ci_career_roadmap (module_code,assessment_version,career_code,plan_tier,grade_stage,section_type,item_order,title,detail_text,metadata_json,status,created_at,updated_at) VALUES\n" + ",\n".join(vals) + ";"
subprocess.check_call(['bash','-lc',"mysql -uroot -p'Jatni@752050' -D robodynamics_db <<'SQL'\n"+sql+"\nSQL"]) 

check = run_sql("""
SELECT COUNT(*)
FROM (
  SELECT c.career_code
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
  HAVING SUM(CASE WHEN r.section_type='OVERVIEW' THEN 1 ELSE 0 END) < 1
      OR SUM(CASE WHEN r.section_type='WHAT_TO_STUDY' THEN 1 ELSE 0 END) < 1
      OR SUM(CASE WHEN r.section_type='SKILLS' THEN 1 ELSE 0 END) < 1
      OR SUM(CASE WHEN r.section_type='PROJECTS' THEN 1 ELSE 0 END) < 1
      OR SUM(CASE WHEN r.section_type='WHERE_TO_STUDY' THEN 1 ELSE 0 END) < 1
      OR SUM(CASE WHEN r.section_type='ACTION_90' THEN 1 ELSE 0 END) < 3
      OR SUM(CASE WHEN r.section_type='MILESTONE' THEN 1 ELSE 0 END) < 3
      OR SUM(CASE WHEN r.section_type='UPGRADE' THEN 1 ELSE 0 END) < 1
) z
""")
print('PRO_MISSING_AFTER_PATCH=' + (check[0][0] if check else 'NA'))
PY