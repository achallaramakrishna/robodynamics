#!/bin/bash
set +e
BEFORE_TS=$(date '+%Y-%m-%d %H:%M:%S')
echo "BEFORE_TS=$BEFORE_TS"

SID=$(python3 - <<'PY'
import json, html, re, urllib.request, urllib.parse, http.cookiejar, urllib.error, subprocess, sys
BASE='http://127.0.0.1:8080'
USER='krishvi'; PWD='krishvi'
TIMEOUT=240

q = r'''mysql -uroot -p"Jatni@752050" -D robodynamics_db -N -s -e "
SELECT qb.question_code, COALESCE(qb.correct_option,'')
FROM rd_ci_question_bank qb
JOIN (
  SELECT question_code, MAX(ci_question_id) max_id
  FROM rd_ci_question_bank
  WHERE module_code='APTIPATH' AND assessment_version='v3' AND status='ACTIVE'
  GROUP BY question_code
) x ON x.question_code=qb.question_code AND x.max_id=qb.ci_question_id;
"'''
out = subprocess.check_output(q, shell=True, text=True)
correct_map = {}
for line in out.splitlines():
    p=line.split('\t')
    if not p: continue
    correct_map[p[0].strip().upper()] = (p[1].strip().upper() if len(p)>1 else '')

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, hdrs, newurl):
        return None

cj=http.cookiejar.CookieJar()
op=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj), NoRedirect())

def req(path,data=None):
    url = path if path.startswith('http') else BASE+path
    body=None
    if data is not None:
        body=urllib.parse.urlencode(data, doseq=True).encode('utf-8')
    r=urllib.request.Request(url,data=body)
    for _ in range(2):
        try:
            resp=op.open(r,timeout=TIMEOUT)
            return resp.getcode(), resp.read().decode('utf-8','replace'), dict(resp.headers.items())
        except urllib.error.HTTPError as e:
            return e.code, e.read().decode('utf-8','replace'), dict(e.headers.items())
        except Exception:
            continue
    return 599, '', {}

def extract(page,name=None,field_id=None):
    if field_id:
        m=re.search(r'id="%s"[^>]*value="([^"]*)"' % re.escape(field_id), page, re.I)
        if m: return html.unescape(m.group(1))
    if name:
        m=re.search(r'name="%s"[^>]*value="([^"]*)"' % re.escape(name), page, re.I)
        if m: return html.unescape(m.group(1))
    return ''

def norm_opts(raw):
    if isinstance(raw,str):
        try: raw=json.loads(raw)
        except: raw=[]
    if not isinstance(raw,list): return []
    out=[]
    for i,o in enumerate(raw):
        if isinstance(o,dict):
            c=str(o.get('code') or o.get('key') or o.get('value') or chr(65+i)).strip().upper()
            l=str(o.get('label') or o.get('text') or o.get('name') or c).strip()
        else:
            c=chr(65+i); l=str(o)
        out.append({'code':c,'label':l})
    return [x for x in out if x['code']]

MED = ['DOCTOR','MEDICAL','PATIENT','BIOLOGY','HEALTH','HOSPITAL','CLINICAL','NEET','LIFE SCIENCE']
ANTI_TECH = ['AI','ML','CODING','PROGRAMMING','SOFTWARE','COMPUTER','ALGORITHM','DATA SCIENCE']
def score(opt):
    t=opt['label'].upper(); s=0
    for k in MED:
        if k in t: s += 10
    for k in ANTI_TECH:
        if k in t: s -= 8
    return s

def choose(opts,rank=False):
    if not opts: return 'A>B>C>D' if rank else 'A'
    ordered=sorted(opts,key=score,reverse=True)
    return '>'.join([x['code'] for x in ordered]) if rank else ordered[0]['code']

# login
req('/login')
c,b,h=req('/login',{'userName':USER,'password':PWD})
if c not in (200,302,303):
    print('')
    sys.exit(0)

# intake
c,b,h=req('/aptipath/student/intake')
if c in (302,303) and h.get('Location'):
    c,b,h=req(h['Location'])
sub=extract(b,name='subscriptionId')
if not sub:
    print('')
    sys.exit(0)

req('/aptipath/student/intake',{
'subscriptionId':sub,'embed':'0','company':'',
'S_CURR_SCHOOL_01':'Robo Dynamics Senior Secondary School',
'S_CURR_GRADE_01':'11','S_CURR_BOARD_01':'CBSE','S_CURR_STREAM_01':'PCB',
'S_CURR_SUBJECTS_01':'Physics, Chemistry, Biology','S_CURR_PROGRAM_01':'MBBS','S_CURR_YEARS_LEFT_01':'1_TO_2',
'S_GOAL_01':'I want doctor/medical as my primary career path.',
'S_LIFE_01':'I prefer biology and patient-care pathways over software tracks.',
'S_HOBBY_01':'Biology reading and health science activities',
'S_DISLIKE_01':'I avoid coding-first and AI software pathways as primary choice',
'S_STYLE_01':'PRACTICAL','S_ACHIEVE_01':'Good performance in biology and chemistry',
'S_FEAR_01':'Missing NEET cut-off','S_SUPPORT_01':'Need structured NEET roadmap and mentor review'
})
req('/aptipath/student/test/restart',{'embed':'0','company':''})

# test load
c,b,h=req('/aptipath/student/test')
if c in (302,303) and h.get('Location'):
    c,b,h=req(h['Location'])
m=re.search(r'<script id="questionsData" type="application/json">(.*?)</script>', b, re.S|re.I)
if not m:
    print('')
    sys.exit(0)
questions=json.loads(html.unescape(m.group(1).strip()))
sid=extract(b,field_id='sessionIdField') or extract(b,name='sessionId')
if not sid:
    print('')
    sys.exit(0)

submit={
'sessionId':sid,'durationSeconds':str(max(1,len(questions)*16)),'careerIntentCsv':'MEDICAL_HEALTH,BIOTECH_LIFE_SCI,PSYCHOLOGY_EDU',
'selfNumeric':'4','selfLanguage':'4','selfDiscipline':'5','selfSpatial':'3','subjectMath':'2','subjectPhysics':'4','subjectChemistry':'5','subjectBiology':'5','subjectLanguage':'4',
'embed':'0','company':'',
'THINK_STORY_SUMMARY':'Doctor/medical is my strongest and preferred path.',
'THINK_STORY_DECISION':'I will prioritize medical pathway over AI/software tracks.',
'THINK_STORY_ACTION':'I will execute NEET-focused milestones weekly for 90 days.'
}
order=[]
for q in questions:
    qc=str(q.get('questionCode') or '').strip().upper()
    if not qc: continue
    order.append(qc)
    qt=str(q.get('questionType') or '').upper().replace('-','_').replace(' ','_')
    opts=norm_opts(q.get('options'))
    corr=correct_map.get(qc,'')
    valid={o['code'] for o in opts}
    if corr and corr in valid and qt not in ('RANK_ORDER','RANKING'):
        ans=corr
    else:
        ans=choose(opts, qt in ('RANK_ORDER','RANKING'))
    submit['Q_'+qc]=ans
    submit['T_'+qc]='16'
    submit['C_'+qc]='HIGH'
submit['questionOrder']=','.join(order)

c,b,h=req('/aptipath/student/test/submit',submit)
loc=h.get('Location','')
if '/aptipath/student/report-intake' in loc:
    c2,b2,h2=req(loc)
    rsid=extract(b2,name='sessionId') or sid
    req('/aptipath/student/report-intake',{'sessionId':rsid,'RFQ_01':'Doctor direction confirmed.','RFQ_02':'Need NEET consistency.','RFQ_03':'Will follow 90-day plan.'})

# trigger result build (roadmap resolution path)
req('/aptipath/student/result?sessionId='+sid)
print(sid)
PY
)

echo "SID=$SID"
if [ -z "$SID" ]; then
  echo "E2E_SESSION_CREATE_FAILED"
fi

echo "--- TOP CAREER CODE FOR SID ---"
TOP_CODE=$(mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -s -e "SELECT JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[0].careerCode')) FROM rd_ci_recommendation_snapshot rs WHERE rs.ci_assessment_session_id=$SID ORDER BY rs.ci_recommendation_snapshot_id DESC LIMIT 1;")
echo "TOP_CODE=$TOP_CODE"

echo "--- TOP CAREER NAME FOR SID ---"
mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -s -e "SELECT JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[0].careerName')) FROM rd_ci_recommendation_snapshot rs WHERE rs.ci_assessment_session_id=$SID ORDER BY rs.ci_recommendation_snapshot_id DESC LIMIT 1;"

echo "--- ROADMAP SECTIONS FOR TOP CODE (RECENT) ---"
mysql -uroot -p'Jatni@752050' -D robodynamics_db -t <<SQL
SELECT plan_tier, grade_stage, section_type, item_order,
       CASE WHEN metadata_json LIKE '%OPENAI_AUTOFILL%' THEN 'OPENAI_AUTOFILL' ELSE 'OTHER' END AS source,
       created_at
FROM rd_ci_career_roadmap
WHERE module_code='APTIPATH' AND assessment_version='v3' AND career_code=UPPER('$TOP_CODE')
ORDER BY ci_career_roadmap_id DESC
LIMIT 40;
SQL

echo "--- NEW OPENAI AUTOFILL GROUPS SINCE BEFORE_TS ---"
mysql -uroot -p'Jatni@752050' -D robodynamics_db -t <<SQL
SELECT career_code, plan_tier, grade_stage,
       SUM(CASE WHEN section_type='OVERVIEW' THEN 1 ELSE 0 END) AS overview,
       SUM(CASE WHEN section_type='WHAT_TO_STUDY' THEN 1 ELSE 0 END) AS what_to_study,
       SUM(CASE WHEN section_type='SKILLS' THEN 1 ELSE 0 END) AS skills,
       SUM(CASE WHEN section_type='PROJECTS' THEN 1 ELSE 0 END) AS projects,
       SUM(CASE WHEN section_type='WHERE_TO_STUDY' THEN 1 ELSE 0 END) AS where_to_study,
       SUM(CASE WHEN section_type='ACTION_90' THEN 1 ELSE 0 END) AS action_90,
       SUM(CASE WHEN section_type='MILESTONE' THEN 1 ELSE 0 END) AS milestone,
       SUM(CASE WHEN section_type='UPGRADE' THEN 1 ELSE 0 END) AS upgrade_rows,
       COUNT(*) AS total_rows,
       MAX(created_at) AS latest_at
FROM rd_ci_career_roadmap
WHERE metadata_json LIKE '%OPENAI_AUTOFILL%'
  AND created_at >= '$BEFORE_TS'
GROUP BY career_code, plan_tier, grade_stage
ORDER BY latest_at DESC;
SQL
