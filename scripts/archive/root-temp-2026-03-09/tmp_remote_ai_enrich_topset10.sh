#!/bin/bash
set -euo pipefail
python3 - <<'PY'
import json, re, subprocess, urllib.parse, urllib.request
from datetime import datetime

DB='robodynamics_db'
MYSQL=['mysql','-uroot','-pJatni@752050','-D',DB,'-N','-B']
AI_URL='http://127.0.0.1:8080/api/ai/ask'
SET_SIZE=10


def run_sql(sql):
    out = subprocess.check_output(MYSQL + ['-e', sql], text=True)
    rows=[]
    for line in out.splitlines():
        if not line.strip():
            continue
        rows.append(line.split('\t'))
    return rows


def exec_sql(sql):
    subprocess.check_call(MYSQL + ['-e', sql])


def esc(s):
    if s is None:
        return ''
    return s.replace('\\','\\\\').replace("'","\\'").replace('\n',' ').replace('\r',' ').strip()


def compact(s):
    return ' '.join((s or '').split())


def parse_json_payload(text):
    txt=(text or '').strip()
    if not txt:
        return {}
    if txt.lower().startswith('error:'):
        return {}
    try:
        return json.loads(txt)
    except Exception:
        pass
    m = re.search(r'\{[\s\S]*\}', txt)
    if not m:
        return {}
    try:
        return json.loads(m.group(0))
    except Exception:
        return {}


def normalize_section(s):
    x=compact(s).upper().replace('-','_').replace(' ','_')
    while '__' in x:
        x=x.replace('__','_')
    aliases={
        'STUDY':'WHAT_TO_STUDY','EXAMS':'WHERE_TO_STUDY','PHASE':'MILESTONE',
        'PLAN_90':'ACTION_90','NINETY_DAY_PLAN':'ACTION_90','LONG_TERM_MILESTONES':'MILESTONE'
    }
    return aliases.get(x,x)


def fallback_rows(meta, tier):
    name=meta['career_name']
    cluster=meta['cluster_name'] or 'emerging industries'
    subjects=meta['required_subjects_csv'] or 'Math, Science, Computer fundamentals'
    exams=meta['entrance_exams_csv'] or 'JEE / CUET / institution-specific entrances'
    hint=meta['pathway_hint'] or 'Build consistent execution through projects and mentor feedback.'

    rows=[]
    def add(sec,order,title,detail):
        rows.append({'sectionType':sec,'itemOrder':order,'title':title,'detailText':detail})

    add('OVERVIEW',1,'Career Overview',f"{name} is a strong pathway in {cluster} for India 2026-2036.")
    if tier=='PRO':
        add('WHAT_TO_STUDY',1,'Academic Plan',f"Build grade-wise depth in {subjects}.")
        add('WHAT_TO_STUDY',2,'Exam Focus',f"Align preparation to {exams}.")
        add('WHAT_TO_STUDY',3,'Higher-Ed Path',f"Map degree and specialization routes for {name}.")
    else:
        add('WHAT_TO_STUDY',1,'Study Focus',f"Prioritize {subjects} with weekly review.")
    add('SKILLS',1,'Skills',hint)
    add('PROJECTS',1,'Projects',f"Complete portfolio projects aligned to {name}.")
    add('WHERE_TO_STUDY',1,'Where to Study',f"Primary routes: {exams}.")
    add('ACTION_90',1,'Days 1-30','Baseline, schedule, and weak-area closure.')
    add('ACTION_90',2,'Days 31-60','Project milestone plus mock analysis.')
    add('ACTION_90',3,'Days 61-90','Review outcomes and lock next quarter plan.')
    add('MILESTONE',1,'By 2030',f"Build strong readiness for {name} pathways.")
    add('MILESTONE',2,'By 2032','Convert readiness to internships/projects.')
    if tier=='PRO':
        add('MILESTONE',3,'By 2036','Reach specialization and role maturity.')
    add('UPGRADE',1,'Pro Depth',f"Choose Pro Plan (Rs 2999) for deeper strategy in {name}.")
    return rows


def enforce(rows, meta, tier):
    allowed={'OVERVIEW','WHAT_TO_STUDY','SKILLS','PROJECTS','WHERE_TO_STUDY','ACTION_90','MILESTONE','UPGRADE'}
    bysec={}
    for r in rows:
        if not isinstance(r,dict):
            continue
        sec=normalize_section(r.get('sectionType',''))
        if sec not in allowed:
            continue
        title=compact(str(r.get('title','') or sec.title().replace('_',' ')))[:120]
        detail=compact(str(r.get('detailText',r.get('detail',''))))[:500]
        if not detail:
            continue
        bysec.setdefault(sec,[]).append({'sectionType':sec,'title':title,'detailText':detail})

    fb=fallback_rows(meta,tier)
    for fr in fb:
        sec=fr['sectionType']
        needed=1
        if sec=='ACTION_90':
            needed=3
        elif sec=='MILESTONE':
            needed=3 if tier=='PRO' else 2
        elif sec=='WHAT_TO_STUDY':
            needed=3 if tier=='PRO' else 1
        current=len(bysec.get(sec,[]))
        if current < needed:
            for rr in [x for x in fb if x['sectionType']==sec]:
                if len(bysec.get(sec,[]))>=needed:
                    break
                bysec.setdefault(sec,[]).append({'sectionType':sec,'title':rr['title'],'detailText':rr['detailText']})

    order=['OVERVIEW','WHAT_TO_STUDY','SKILLS','PROJECTS','WHERE_TO_STUDY','ACTION_90','MILESTONE','UPGRADE']
    out=[]
    for sec in order:
        arr=bysec.get(sec,[])
        for i,item in enumerate(arr, start=1):
            out.append({'sectionType':sec,'itemOrder':i,'title':item['title'],'detailText':item['detailText']})
    return out


def build_prompt(meta, tier):
    name=meta['career_name']
    cluster=meta['cluster_name']
    subjects=meta['required_subjects_csv']
    exams=meta['entrance_exams_csv']
    hint=meta['pathway_hint']

    if tier=='PRO':
        req=(
            "- Include sections: OVERVIEW(1), WHAT_TO_STUDY(>=3), SKILLS(>=1), PROJECTS(>=1), WHERE_TO_STUDY(>=1), ACTION_90(=3), MILESTONE(>=3), UPGRADE(>=1)."
        )
    else:
        req=(
            "- Include sections: OVERVIEW(1), WHAT_TO_STUDY(>=1), SKILLS(>=1), PROJECTS(>=1), WHERE_TO_STUDY(>=1), ACTION_90(=3), MILESTONE(>=2), UPGRADE(>=1)."
        )

    return (
        "Return strict JSON only with schema {\"rows\":[{\"sectionType\":\"...\",\"itemOrder\":1,\"title\":\"...\",\"detailText\":\"...\"}]}.\n"
        "No markdown, no extra text.\n"
        "Generate concise, realistic, student-safe roadmap for India 2026-2036.\n"
        f"{req}\n"
        "Use sectionType only from: OVERVIEW, WHAT_TO_STUDY, SKILLS, PROJECTS, WHERE_TO_STUDY, ACTION_90, MILESTONE, UPGRADE.\n"
        "Title <= 70 chars, detailText <= 220 chars.\n"
        f"careerCode={meta['career_code']}\n"
        f"careerName={name}\n"
        f"cluster={cluster}\n"
        f"planTier={tier}\n"
        "gradeStage=ANY\n"
        f"requiredSubjects={subjects}\n"
        f"entranceExams={exams}\n"
        f"pathwayHint={hint}"
    )


def ask_ai(prompt):
    data=urllib.parse.urlencode({'prompt':prompt}).encode('utf-8')
    req=urllib.request.Request(AI_URL,data=data,method='POST')
    with urllib.request.urlopen(req, timeout=80) as resp:
        return resp.read().decode('utf-8','replace')


def replace_rows(meta, tier, rows):
    code=meta['career_code']
    sections=sorted(set(r['sectionType'] for r in rows))
    in_sections=','.join("'"+esc(s)+"'" for s in sections)
    del_sql=(
        "DELETE FROM rd_ci_career_roadmap WHERE module_code='APTIPATH' AND assessment_version='v3' "
        f"AND career_code='{esc(code)}' AND plan_tier='{esc(tier)}' AND grade_stage='ANY' "
        f"AND section_type IN ({in_sections});"
    )
    exec_sql(del_sql)

    values=[]
    ts=datetime.utcnow().isoformat()
    for r in rows:
        meta_json=json.dumps({'source':'OPENAI_BATCH_TOPSET_V1','generatedAtUtc':ts,'tier':tier})
        values.append(
            "('APTIPATH','v3','{code}','{tier}','ANY','{sec}',{ord},'{title}','{detail}','{meta}','ACTIVE',NOW(),NOW())".format(
                code=esc(code), tier=esc(tier), sec=esc(r['sectionType']), ord=int(r['itemOrder']),
                title=esc(r['title']), detail=esc(r['detailText']), meta=esc(meta_json)
            )
        )
    if values:
        ins=(
            "INSERT INTO rd_ci_career_roadmap "
            "(module_code,assessment_version,career_code,plan_tier,grade_stage,section_type,item_order,title,detail_text,metadata_json,status,created_at,updated_at) VALUES\n"
            + ",\n".join(values) +
            "\nON DUPLICATE KEY UPDATE title=VALUES(title), detail_text=VALUES(detail_text), metadata_json=VALUES(metadata_json), status='ACTIVE', updated_at=NOW();"
        )
        exec_sql(ins)

# Top high-ranking careers
sql_top=f"""
WITH freq AS (
  SELECT career_code, COUNT(*) freq
  FROM (
    SELECT JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[0].careerCode')) AS career_code FROM rd_ci_recommendation_snapshot rs
    UNION ALL SELECT JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[1].careerCode')) FROM rd_ci_recommendation_snapshot rs
    UNION ALL SELECT JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[2].careerCode')) FROM rd_ci_recommendation_snapshot rs
    UNION ALL SELECT JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[3].careerCode')) FROM rd_ci_recommendation_snapshot rs
    UNION ALL SELECT JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[4].careerCode')) FROM rd_ci_recommendation_snapshot rs
  ) x
  WHERE career_code IS NOT NULL AND career_code<>''
  GROUP BY career_code
)
SELECT c.career_code, IFNULL(c.career_name,''), IFNULL(c.cluster_name,''), IFNULL(c.required_subjects_csv,''), IFNULL(c.entrance_exams_csv,''), IFNULL(c.pathway_hint,''), IFNULL(f.freq,0)
FROM rd_ci_career_catalog c
LEFT JOIN freq f ON f.career_code=c.career_code
WHERE c.module_code='APTIPATH' AND c.assessment_version='v3' AND c.status='ACTIVE'
ORDER BY IFNULL(f.freq,0) DESC, c.sort_order ASC, c.career_code ASC
LIMIT {SET_SIZE}
"""

careers=[]
for r in run_sql(sql_top):
    if len(r) < 7:
        continue
    careers.append({
        'career_code': (r[0] or '').strip().upper(),
        'career_name': compact(r[1]),
        'cluster_name': compact(r[2]),
        'required_subjects_csv': compact(r[3]),
        'entrance_exams_csv': compact(r[4]),
        'pathway_hint': compact(r[5]),
        'freq': int((r[6] or '0').strip() or '0')
    })

print('TOP_SET_CODES=' + ','.join(c['career_code'] for c in careers))

ok=0
fail=0
for c in careers:
    for tier in ('BASIC','PRO'):
        try:
            prompt=build_prompt(c,tier)
            raw=ask_ai(prompt)
            payload=parse_json_payload(raw)
            rows=enforce(payload.get('rows',[]), c, tier)
            replace_rows(c,tier,rows)
            print(f"OK {c['career_code']} {tier} rows={len(rows)}")
            ok += 1
        except Exception as e:
            print(f"FAIL {c['career_code']} {tier} err={str(e)[:180]}")
            fail += 1

print(f"DONE ok={ok} fail={fail}")
PY