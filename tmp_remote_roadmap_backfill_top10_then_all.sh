#!/bin/bash
set -euo pipefail
python3 - <<'PY'
import subprocess
from pathlib import Path

DB='robodynamics_db'
MYSQL=['mysql',"-uroot","-pJatni@752050",'-D',DB,'-N','-B']


def run_sql(sql: str):
    out = subprocess.check_output(MYSQL + ['-e', sql], text=True)
    rows = []
    for line in out.splitlines():
        if not line.strip():
            continue
        rows.append(line.split('\t'))
    return rows


def run_sql_file(path: Path):
    subprocess.check_call(['bash','-lc', f"mysql -uroot -p'Jatni@752050' -D {DB} < '{path.as_posix()}'"]) 


def sql_escape(s: str) -> str:
    if s is None:
        return ''
    return s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', ' ').replace('\r', ' ').strip()


def compact(text: str) -> str:
    return ' '.join((text or '').split())


def normalize(v: str, fallback: str) -> str:
    v = compact(v)
    return v if v else fallback


def make_rows(code: str, name: str, cluster: str, subjects: str, exams: str, hint: str):
    code = normalize(code, 'UNKNOWN').upper()
    name = normalize(name, code)
    cluster = normalize(cluster, 'emerging industries')
    subjects = normalize(subjects, 'Math, Science, Computer fundamentals')
    exams = normalize(exams, 'JEE / CUET / institution-specific entrances')
    hint = normalize(hint, 'Build consistent execution through projects, mock reviews, and mentor feedback.')

    rows = []
    def add(plan, stage, section, order, title, detail):
        rows.append((code, plan, stage, section, int(order), compact(title), compact(detail)))

    # BASIC ANY
    add('BASIC','ANY','OVERVIEW',1,'Career Overview',
        f"{name} is a high-potential pathway in {cluster} for India 2026-2036. This roadmap gives a practical direction from school to early-career readiness.")
    add('BASIC','ANY','WHAT_TO_STUDY',1,'School Subject Focus',
        f"Prioritize {subjects} with weekly concept revision and problem-solving practice.")
    add('BASIC','ANY','WHAT_TO_STUDY',2,'Stream Alignment',
        f"Align stream and electives with {name} entry requirements and long-term growth options.")
    add('BASIC','ANY','WHAT_TO_STUDY',3,'Post-12 Path',
        f"Shortlist degree pathways connected to {name} and map exam/college routes early.")
    add('BASIC','ANY','SKILLS',1,'Foundation Skills',
        'Build analytical thinking, communication, and disciplined time management habits.')
    add('BASIC','ANY','SKILLS',2,'Technical Skills',
        f"Develop practical tools and domain basics relevant to {name}.")
    add('BASIC','ANY','SKILLS',3,'Execution Discipline',
        hint)
    add('BASIC','ANY','PROJECTS',1,'Starter Project',
        f"Complete one guided mini-project aligned to {name} and document outcomes.")
    add('BASIC','ANY','PROJECTS',2,'Portfolio Build',
        'Maintain a portfolio with clear problem statements, approach, results, and learning notes.')
    add('BASIC','ANY','PROJECTS',3,'Validation Sprint',
        'Run one mentor-reviewed project iteration every 30 days.')
    add('BASIC','ANY','WHERE_TO_STUDY',1,'Exam Route',
        f"Primary entry routes: {exams}.")
    add('BASIC','ANY','WHERE_TO_STUDY',2,'College Strategy',
        f"Create dream/target/safe college shortlist mapped to {name} programs.")
    add('BASIC','ANY','WHERE_TO_STUDY',3,'Learning Stack',
        'Combine school academics, mock tests, online learning, and project exposure.')
    add('BASIC','ANY','ACTION_90',1,'Days 1-30',
        f"Audit gaps and start a daily 60-90 minute focused block for {name} readiness.")
    add('BASIC','ANY','ACTION_90',2,'Days 31-60',
        'Complete one project milestone and one mock cycle with error analysis.')
    add('BASIC','ANY','ACTION_90',3,'Days 61-90',
        'Publish progress, review with mentor/parent, and lock the next 90-day plan.')
    add('BASIC','ANY','MILESTONE',1,'By 2028',
        f"Demonstrate strong fundamentals and 2-3 validated projects for {name} readiness.")
    add('BASIC','ANY','MILESTONE',2,'By 2032',
        f"Complete specialization, internships, and portfolio depth linked to {name} roles.")
    add('BASIC','ANY','MILESTONE',3,'By 2036',
        'Progress to high-impact role with advanced skill depth and domain expertise.')
    add('BASIC','ANY','UPGRADE',1,'Pro Plan',
        f"Choose Pro Plan (Rs 2999) for deeper personalized strategy and mentoring for {name}.")

    # PRO ANY
    add('PRO','ANY','OVERVIEW',1,'Personalized Overview',
        f"This Pro roadmap maps {name} with deeper exam, college, and execution intelligence for 2026-2036.")
    add('PRO','ANY','WHAT_TO_STUDY',1,'Academic Roadmap',
        f"Build grade-wise mastery in {subjects} with weekly checkpoints and monthly review.")
    add('PRO','ANY','WHAT_TO_STUDY',2,'Exam-Specific Plan',
        f"Map exam prep stages to {exams} with topic sequencing and mock strategy.")
    add('PRO','ANY','WHAT_TO_STUDY',3,'Higher-Ed Path',
        f"Target top-fit programs and maintain alternate pathways linked to {name}.")
    add('PRO','ANY','SKILLS',1,'Core Competencies',
        f"Strengthen foundational and domain competencies required for {name}.")
    add('PRO','ANY','SKILLS',2,'Advanced Competencies',
        'Add role-specific advanced tools, communication, and collaboration workflows.')
    add('PRO','ANY','SKILLS',3,'Performance Habits',
        'Use weekly review, benchmark tests, and mentor feedback loops for steady growth.')
    add('PRO','ANY','PROJECTS',1,'Project Track 1',
        'Build one foundational project and document measurable outcomes.')
    add('PRO','ANY','PROJECTS',2,'Project Track 2',
        'Build one intermediate project demonstrating applied problem solving.')
    add('PRO','ANY','PROJECTS',3,'Project Track 3',
        'Build one advanced project to strengthen profile for admissions/interviews.')
    add('PRO','ANY','WHERE_TO_STUDY',1,'Exam Intelligence',
        f"Use exam route mapping across {exams} with target score planning.")
    add('PRO','ANY','WHERE_TO_STUDY',2,'College Intelligence',
        'Use tiered college shortlisting with outcomes, affordability, and fit criteria.')
    add('PRO','ANY','WHERE_TO_STUDY',3,'Execution Resources',
        'Blend coaching/self-study/online tracks based on score trend and schedule fit.')
    add('PRO','ANY','ACTION_90',1,'Days 1-30',
        'Establish baseline metrics, schedule discipline, and weak-topic closure plan.')
    add('PRO','ANY','ACTION_90',2,'Days 31-60',
        'Increase mock intensity and complete at least one portfolio-grade project milestone.')
    add('PRO','ANY','ACTION_90',3,'Days 61-90',
        'Run mentor review, refine strategy, and lock next-quarter goals.')
    add('PRO','ANY','MILESTONE',1,'By 2030',
        f"Show competitive readiness and profile quality for {name} pathways.")
    add('PRO','ANY','MILESTONE',2,'By 2032',
        'Convert early opportunities into internships, research, or product contributions.')
    add('PRO','ANY','MILESTONE',3,'By 2036',
        'Advance into specialization/leadership trajectory with strong execution evidence.')
    add('PRO','ANY','UPGRADE',1,'Pro Depth',
        f"This roadmap continuously adapts to performance and intent signals for {name}.")

    return rows


def get_missing_basic_codes():
    sql = """
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
    """
    return [r[0].strip().upper() for r in run_sql(sql) if r and r[0].strip()]


def get_top_missing_basic(limit=10):
    sql = f"""
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
    SELECT m.career_code
    FROM missing_basic m
    LEFT JOIN freq f ON f.career_code=m.career_code
    ORDER BY IFNULL(f.freq,0) DESC, m.career_code
    LIMIT {int(limit)}
    """
    return [r[0].strip().upper() for r in run_sql(sql) if r and r[0].strip()]


def get_catalog_map(codes):
    if not codes:
        return {}
    in_list = ','.join("'" + sql_escape(c) + "'" for c in codes)
    sql = f"""
    SELECT c.career_code,
           IFNULL(c.career_name,''),
           IFNULL(c.cluster_name,''),
           IFNULL(c.required_subjects_csv,''),
           IFNULL(c.entrance_exams_csv,''),
           IFNULL(c.pathway_hint,'')
    FROM rd_ci_career_catalog c
    WHERE c.module_code='APTIPATH' AND c.assessment_version='v3' AND c.status='ACTIVE'
      AND c.career_code IN ({in_list})
    """
    out = {}
    for r in run_sql(sql):
        if not r:
            continue
        code = r[0].strip().upper()
        out[code] = {
            'name': r[1] if len(r) > 1 else '',
            'cluster': r[2] if len(r) > 2 else '',
            'subjects': r[3] if len(r) > 3 else '',
            'exams': r[4] if len(r) > 4 else '',
            'hint': r[5] if len(r) > 5 else '',
        }
    return out


def build_sql_inserts(codes, catalog_map, phase_label):
    all_values = []
    for code in codes:
        meta = catalog_map.get(code, {})
        rows = make_rows(
            code,
            meta.get('name',''),
            meta.get('cluster',''),
            meta.get('subjects',''),
            meta.get('exams',''),
            meta.get('hint','')
        )
        for career_code, plan, stage, section, item_order, title, detail in rows:
            val = (
                "('APTIPATH','v3','{career_code}','{plan}','{stage}','{section}',{item_order},'"
                "{title}','{detail}','{{\\\"source\\\":\\\"PY_AGENTIC_BACKFILL_V1\\\",\\\"phase\\\":\\\"{phase}\\\"}}','ACTIVE',NOW(),NOW())"
            ).format(
                career_code=sql_escape(career_code),
                plan=sql_escape(plan),
                stage=sql_escape(stage),
                section=sql_escape(section),
                item_order=item_order,
                title=sql_escape(title),
                detail=sql_escape(detail),
                phase=sql_escape(phase_label)
            )
            all_values.append(val)

    if not all_values:
        return ''

    chunks = []
    chunk_size = 400
    for i in range(0, len(all_values), chunk_size):
        values = ',\n'.join(all_values[i:i+chunk_size])
        chunks.append(
            "INSERT IGNORE INTO rd_ci_career_roadmap "
            "(module_code,assessment_version,career_code,plan_tier,grade_stage,section_type,item_order,title,detail_text,metadata_json,status,created_at,updated_at)\n"
            f"VALUES\n{values};\n"
        )

    return "START TRANSACTION;\n" + '\n'.join(chunks) + "\nCOMMIT;\n"


def audit_counts(label):
    sql = """
    SELECT 'basic_missing', COUNT(*)
    FROM (
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
    ) x
    UNION ALL
    SELECT 'pro_missing', COUNT(*)
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
    ) y
    """
    rows = run_sql(sql)
    print(f"[{label}] " + ', '.join(f"{r[0]}={r[1]}" for r in rows if len(r) >= 2))


# -------- Run --------
audit_counts('before')
missing = get_missing_basic_codes()
if not missing:
    print('No missing BASIC coverage. Nothing to backfill.')
    raise SystemExit(0)

top10 = get_top_missing_basic(10)
top10 = [c for c in top10 if c in set(missing)]
remaining = [c for c in missing if c not in set(top10)]

print('TOP10_FIRST=', ','.join(top10))
print('TOP10_COUNT=', len(top10))
print('REMAINING_COUNT=', len(remaining))

all_codes = top10 + remaining
catalog_map = get_catalog_map(all_codes)

work_dir = Path('/tmp')

if top10:
    sql_top = build_sql_inserts(top10, catalog_map, 'TOP10')
    p_top = work_dir / 'apti_roadmap_backfill_top10.sql'
    p_top.write_text(sql_top, encoding='utf-8')
    run_sql_file(p_top)
    print('TOP10_BACKFILL_DONE')
    audit_counts('after_top10')

if remaining:
    sql_rest = build_sql_inserts(remaining, catalog_map, 'BULK')
    p_rest = work_dir / 'apti_roadmap_backfill_rest.sql'
    p_rest.write_text(sql_rest, encoding='utf-8')
    run_sql_file(p_rest)
    print('BULK_BACKFILL_DONE')

# final counts
audit_counts('after_all')

# row-level summary
summary = run_sql("""
SELECT plan_tier, COUNT(*)
FROM rd_ci_career_roadmap
WHERE module_code='APTIPATH' AND assessment_version='v3' AND status='ACTIVE'
  AND metadata_json LIKE '%PY_AGENTIC_BACKFILL_V1%'
GROUP BY plan_tier
ORDER BY plan_tier
""")
print('INSERTED_OR_PRESENT_BY_PLAN=' + ', '.join(f"{r[0]}:{r[1]}" for r in summary if len(r)>=2))
PY