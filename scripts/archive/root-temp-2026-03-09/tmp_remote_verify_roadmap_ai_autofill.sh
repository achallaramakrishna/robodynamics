python3 - <<'PY'
import json, html, re, urllib.request, urllib.parse, http.cookiejar, urllib.error, subprocess
BASE='http://127.0.0.1:8080'
USER='krishvi'; PWD='krishvi'

# DB answer key map
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
    parts=line.split('\t')
    if not parts: continue
    code=parts[0].strip().upper()
    corr=(parts[1].strip().upper() if len(parts)>1 else '')
    correct_map[code]=corr

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
    try:
        resp=op.open(r,timeout=60)
        return resp.getcode(), resp.read().decode('utf-8','replace'), dict(resp.headers.items())
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8','replace'), dict(e.headers.items())

def extract_val(page,name=None,field_id=None):
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
            code=str(o.get('code') or o.get('key') or o.get('value') or chr(65+i)).strip().upper()
            label=str(o.get('label') or o.get('text') or o.get('name') or code).strip()
            score=o.get('score', o.get('weight', o.get('points', None)))
            try: score=float(score) if score is not None else None
            except: score=None
        else:
            code=chr(65+i); label=str(o); score=None
        out.append({'code':code,'label':label,'score':score})
    return [x for x in out if x['code']]

# Doctor/biomedical leaning to avoid AI_ML top1
MED = ['DOCTOR','MEDICAL','PATIENT','BIOLOGY','HEALTH','HOSPITAL','CLINICAL','NEET','LIFE SCIENCE']
ANTI_TECH = ['AI','ML','CODING','PROGRAMMING','SOFTWARE','COMPUTER','ALGORITHM','DATA SCIENCE']
POS = ['STRONGLY AGREE','ALWAYS','VERY HIGH','HIGH','EXCELLENT','DEFINITELY','YES','CONFIDENT','ENJOY','LOVE']
LOW = ['STRONGLY DISAGREE','NEVER','LOW','VERY LOW','NO','DISLIKE','AVOID']

def score_option(opt):
    t=opt['label'].upper(); s=0.0
    if opt.get('score') is not None: s += opt['score'] * 2.0
    for k in MED:
        if k in t: s += 12.0
    for k in ANTI_TECH:
        if k in t: s -= 10.0
    for k in POS:
        if k in t: s += 2.0
    for k in LOW:
        if k in t: s -= 2.0
    return s

def best_behavioral(opts):
    if not opts: return 'A'
    return sorted(opts,key=score_option, reverse=True)[0]['code']

def rank_behavioral(opts):
    if not opts: return 'A>B>C>D'
    return '>'.join([o['code'] for o in sorted(opts,key=score_option, reverse=True)])

# login
req('/login')
code,body,h=req('/login',{'userName':USER,'password':PWD})
if code not in (200,302,303):
    print('LOGIN_FAIL', code); raise SystemExit(1)

# intake grade11 medical leaning
code,body,h=req('/aptipath/student/intake')
if code in (302,303) and h.get('Location'):
    code,body,h=req(h['Location'])
sub=extract_val(body,name='subscriptionId')
if not sub:
    print('NO_SUBSCRIPTION'); raise SystemExit(1)

payload={
'subscriptionId':sub,'embed':'0','company':'',
'S_CURR_SCHOOL_01':'Robo Dynamics Senior Secondary School',
'S_CURR_GRADE_01':'11',
'S_CURR_BOARD_01':'CBSE',
'S_CURR_STREAM_01':'PCB',
'S_CURR_SUBJECTS_01':'Physics, Chemistry, Biology',
'S_CURR_PROGRAM_01':'MBBS',
'S_CURR_YEARS_LEFT_01':'1_TO_2',
'S_GOAL_01':'I want doctor/medical as my primary career path.',
'S_LIFE_01':'I prefer biology and patient-care pathways over software tracks.',
'S_HOBBY_01':'Biology reading, health science videos, and lab activities',
'S_DISLIKE_01':'I avoid coding-first and AI software pathways as primary career choice',
'S_STYLE_01':'PRACTICAL',
'S_ACHIEVE_01':'Performed well in biology and chemistry assessments',
'S_FEAR_01':'Missing NEET cut-off',
'S_SUPPORT_01':'Need structured NEET roadmap and mentor review'
}
req('/aptipath/student/intake',payload)
req('/aptipath/student/test/restart',{'embed':'0','company':''})

# open test
code,body,h=req('/aptipath/student/test')
if code in (302,303) and h.get('Location'):
    code,body,h=req(h['Location'])
if code!=200:
    print('TEST_LOAD_FAIL', code); raise SystemExit(1)

m=re.search(r'<script id="questionsData" type="application/json">(.*?)</script>', body, re.S|re.I)
if not m:
    print('NO_QUESTIONS_JSON'); raise SystemExit(1)
questions=json.loads(html.unescape(m.group(1).strip()))
sid=extract_val(body,field_id='sessionIdField') or extract_val(body,name='sessionId')
if not sid:
    print('NO_SESSION_ID'); raise SystemExit(1)

submit={
'sessionId':sid,
'durationSeconds':str(max(1,len(questions)*18)),
'careerIntentCsv':'MEDICINE_HEALTH,BIOTECH_LIFE_SCI,PSYCHOLOGY_HEALTH',
'selfNumeric':'4','selfLanguage':'4','selfDiscipline':'5','selfSpatial':'3',
'subjectMath':'2','subjectPhysics':'4','subjectChemistry':'5','subjectBiology':'5','subjectLanguage':'4',
'embed':'0','company':'',
'THINK_STORY_SUMMARY':'Doctor/medical is my strongest and preferred path.',
'THINK_STORY_DECISION':'I will prioritize medical pathway over AI/software tracks.',
'THINK_STORY_ACTION':'I will execute NEET-focused milestones weekly for 90 days.'
}
q_order=[]
for q in questions:
    qc=str(q.get('questionCode') or '').strip().upper()
    if not qc: continue
    q_order.append(qc)
    qtype=str(q.get('questionType') or '').upper().replace('-','_').replace(' ','_')
    opts=norm_opts(q.get('options'))
    corr=correct_map.get(qc,'').strip().upper()
    valid_codes={o['code'] for o in opts}
    if corr and corr in valid_codes and qtype not in ('RANK_ORDER','RANKING'):
        ans=corr
    elif qtype in ('RANK_ORDER','RANKING'):
        ans=rank_behavioral(opts)
    else:
        ans=best_behavioral(opts)
    submit['Q_'+qc]=ans
    submit['T_'+qc]='18'
    submit['C_'+qc]='HIGH'
submit['questionOrder']=','.join(q_order)

scode,sbody,sh=req('/aptipath/student/test/submit',submit)
if scode not in (200,302,303):
    print('SUBMIT_FAIL', scode); raise SystemExit(1)

result_loc=sh.get('Location','')
if '/aptipath/student/report-intake' in result_loc:
    rc,rb,rh=req(result_loc)
    rsid=extract_val(rb,name='sessionId') or sid
    rp={
        'sessionId':rsid,
        'RFQ_01':'Doctor is my most aligned and motivating direction.',
        'RFQ_02':'Main constraint is NEET discipline under school workload.',
        'RFQ_03':'I will complete weekly mock and error analysis for 30 days.'
    }
    _,_,rh2=req('/aptipath/student/report-intake',rp)
    result_loc=rh2.get('Location','') or ('/aptipath/student/result?sessionId='+sid)
if not result_loc:
    result_loc='/aptipath/student/result?sessionId='+sid

code,html_result,h=req(result_loc)
if code in (302,303):
    code,html_result,h=req('/aptipath/student/result?sessionId='+sid)

print('SESSION_ID', sid)
print('RESULT_STATUS', code)
print('RESULT_LOC', result_loc)
PY

echo "--- LATEST SESSION SNAPSHOT ---"
mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -s <<'SQL'
SELECT s.ci_assessment_session_id
FROM rd_ci_assessment_session s
JOIN rd_ci_subscription sub ON sub.ci_subscription_id=s.ci_subscription_id
JOIN rd_users u ON u.userID=sub.student_user_id
WHERE UPPER(IFNULL(sub.module_code,''))='APTIPATH' AND u.userName='krishvi'
ORDER BY s.ci_assessment_session_id DESC
LIMIT 1;
SQL

SID=$(mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -s -e "SELECT s.ci_assessment_session_id FROM rd_ci_assessment_session s JOIN rd_ci_subscription sub ON sub.ci_subscription_id=s.ci_subscription_id JOIN rd_users u ON u.userID=sub.student_user_id WHERE UPPER(IFNULL(sub.module_code,''))='APTIPATH' AND u.userName='krishvi' ORDER BY s.ci_assessment_session_id DESC LIMIT 1;")

echo "SID=$SID"

mysql -uroot -p'Jatni@752050' -D robodynamics_db -t <<SQL
SELECT
  JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[0].careerCode')) AS top_code,
  JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[0].careerName')) AS top_name,
  JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[1].careerCode')) AS second_code,
  JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[1].careerName')) AS second_name
FROM rd_ci_recommendation_snapshot rs
WHERE rs.ci_assessment_session_id=$SID
ORDER BY rs.ci_recommendation_snapshot_id DESC
LIMIT 1;
SQL

TOP_CODE=$(mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -s -e "SELECT JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[0].careerCode')) FROM rd_ci_recommendation_snapshot rs WHERE rs.ci_assessment_session_id=$SID ORDER BY rs.ci_recommendation_snapshot_id DESC LIMIT 1;")

echo "TOP_CODE=$TOP_CODE"

echo "--- ROADMAP ROWS FOR TOP CODE ---"
mysql -uroot -p'Jatni@752050' -D robodynamics_db -t <<SQL
SELECT plan_tier, grade_stage, section_type, item_order, status, created_at,
       CASE WHEN metadata_json LIKE '%OPENAI_AUTOFILL%' THEN 'OPENAI_AUTOFILL' ELSE 'OTHER' END AS source
FROM rd_ci_career_roadmap
WHERE module_code='APTIPATH' AND assessment_version='v3' AND career_code=UPPER('$TOP_CODE')
ORDER BY created_at DESC, ci_career_roadmap_id DESC
LIMIT 20;
SQL

echo "--- RECENT OPENAI AUTOFILL INSERTS (30 min) ---"
mysql -uroot -p'Jatni@752050' -D robodynamics_db -t <<'SQL'
SELECT career_code, plan_tier, grade_stage, COUNT(*) AS rows_inserted, MAX(created_at) AS latest_at
FROM rd_ci_career_roadmap
WHERE metadata_json LIKE '%OPENAI_AUTOFILL%'
  AND created_at >= (NOW() - INTERVAL 30 MINUTE)
GROUP BY career_code, plan_tier, grade_stage
ORDER BY latest_at DESC;
SQL
