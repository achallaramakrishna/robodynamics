set -e
python3 - <<'PY'
import re, json, html, urllib.request, urllib.parse, http.cookiejar
BASE='http://127.0.0.1:8080'
USER='sashank_1'; PWD='sashank_1'

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
        code=resp.getcode(); headers=dict(resp.headers.items()); content=resp.read()
    except urllib.error.HTTPError as e:
        code=e.code; headers=dict(e.headers.items()); content=e.read()
    return code, content.decode('utf-8','replace'), headers.get('Location',''), headers

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

POS=["STRONGLY AGREE","ALWAYS","VERY HIGH","HIGH","EXCELLENT","DEFINITELY","YES","CONSISTENTLY","TOP","LEAD","ADVANCED","CONFIDENT"]
NEG=["STRONGLY DISAGREE","NEVER","LOW","VERY LOW","NO","RARELY","POOR","WEAK","LIMITED","NONE"]

def best_code(opts):
    if not opts: return 'A'
    scored=[o for o in opts if o.get('score') is not None]
    if scored:
        scored.sort(key=lambda x: x['score'], reverse=True)
        return scored[0]['code']
    best=None; bestv=-10**9
    for o in opts:
        t=o['label'].upper(); v=0
        for p in POS:
            if p in t: v += 6
        for n in NEG:
            if n in t: v -= 6
        if any(k in t for k in ['I CAN','I DO','I WILL','ENJOY','INTEREST']): v += 2
        if v>bestv: bestv=v; best=o['code']
    return best or opts[0]['code']

# login
req('/login')
code,body,loc,_=req('/login',{'userName':USER,'password':PWD})
if code not in (200,302,303):
    print('VERIFY_ERROR login_status',code); raise SystemExit(1)

# intake
code,body,_,_=req('/aptipath/student/intake')
if code in (302,303):
    code,body,_,_=req('/aptipath/student/intake')
sub=extract_val(body,name='subscriptionId')
if not sub:
    print('VERIFY_ERROR no_subscription'); raise SystemExit(1)

payload={
'subscriptionId':sub,'embed':'0','company':'',
'S_CURR_SCHOOL_01':'Robo Dynamics Test School','S_CURR_GRADE_01':'8','S_CURR_BOARD_01':'CBSE',
'S_GOAL_01':'Career clarity with consistent progress and strong fundamentals',
'S_LIFE_01':'I want a practical career path where I can build useful solutions',
'S_HOBBY_01':'Robotics, coding practice, and problem-solving activities',
'S_DISLIKE_01':'Rote learning without concept understanding','S_STYLE_01':'PRACTICAL',
'S_ACHIEVE_01':'Completed guided projects and performed well in assessments',
'S_FEAR_01':'Losing marks due to time pressure in exams',
'S_SUPPORT_01':'Need weekly mentoring, revision structure, and test analysis',
'S_CURR_STREAM_01':'PCM','S_CURR_SUBJECTS_01':'Physics, Chemistry, Mathematics',
'S_CURR_PROGRAM_01':'BTECH_CSE','S_CURR_YEARS_LEFT_01':'3_TO_4'
}
req('/aptipath/student/intake',payload)

# load test
code,body,loc,_=req('/aptipath/student/test')
if code in (302,303) and loc:
    code,body,loc,_=req(loc)
if code!=200:
    print('VERIFY_ERROR test_status',code); raise SystemExit(1)

m=re.search(r'<script id="questionsData" type="application/json">(.*?)</script>', body, re.S|re.I)
if not m:
    print('VERIFY_ERROR no_questions_json'); raise SystemExit(1)
questions=json.loads(html.unescape(m.group(1).strip()))
sid=extract_val(body,field_id='sessionIdField') or extract_val(body,name='sessionId')
if not sid:
    print('VERIFY_ERROR no_session_id'); raise SystemExit(1)

q_order=[]; submit={
'sessionId':sid,
'durationSeconds':str(max(1,len(questions)*15)),
'careerIntentCsv':'CS_AI,ROBOTICS_DRONE',
'selfNumeric':'5','selfLanguage':'4','selfDiscipline':'5','selfSpatial':'5',
'subjectMath':'5','subjectPhysics':'5','subjectChemistry':'4','subjectBiology':'2','subjectLanguage':'4',
'embed':'0','company':'',
'THINK_STORY_SUMMARY':'I perform best with consistent practice and structured review loops.',
'THINK_STORY_DECISION':'I will prioritize concept depth, timed practice, and reflection after each test.',
'THINK_STORY_ACTION':'I will run a weekly plan with mock tests, revision, and mentor checkpoints.'
}
for q in questions:
    code_q=str(q.get('questionCode') or '').strip()
    if not code_q: continue
    q_order.append(code_q)
    qtype=str(q.get('questionType') or '').upper().replace('-','_').replace(' ','_')
    opts=norm_opts(q.get('options'))
    if qtype in ('RANK_ORDER','RANKING'):
        ans='>'.join([o['code'] for o in opts]) if opts else 'A>B>C>D'
    else:
        ans=best_code(opts)
    submit['Q_'+code_q]=ans
    submit['T_'+code_q]='15'
    submit['C_'+code_q]='HIGH'
submit['questionOrder']=','.join(q_order)

scode,sbody,sloc,_=req('/aptipath/student/test/submit',submit)
if scode not in (200,302,303):
    print('VERIFY_ERROR submit_status',scode); raise SystemExit(1)

# handle report-intake redirect
result_loc=sloc
if '/aptipath/student/report-intake' in (result_loc or ''):
    rcode,rbody,_,_=req(result_loc)
    rsid=extract_val(rbody,name='sessionId') or sid
    rpayload={'sessionId':rsid,'RFQ_01':'I learned structured effort improves outcomes.','RFQ_02':'I will track weak areas weekly.','RFQ_03':'I will follow the 90-day plan.'}
    _,_,ploc,_=req('/aptipath/student/report-intake',rpayload)
    result_loc=ploc or ('/aptipath/student/result?sessionId='+sid)
if not result_loc:
    result_loc='/aptipath/student/result?sessionId='+sid

rcode,rbody,_,_=req(result_loc)
if rcode in (302,303):
    rcode,rbody,_,_=req('/aptipath/student/result?sessionId='+sid)

print('VERIFY_SESSION_ID', sid)
print('VERIFY_QUESTION_COUNT', len(q_order))
print('VERIFY_RESULT_STATUS', rcode)
print('VERIFY_RESULT_URL', '/aptipath/student/result?sessionId='+sid)
print('VERIFY_TOP_PRESENT', 'Top Career Matches' in rbody or 'Top career match' in rbody)
PY

mysql -uroot -pJatni@752050 -D robodynamics_db -N -s -e "
SELECT 'VERIFY_LATEST_SESSION', MAX(s.ci_assessment_session_id)
FROM rd_ci_assessment_session s
JOIN rd_ci_subscription sub ON sub.ci_subscription_id=s.ci_subscription_id
JOIN rd_user u ON u.userID=s.student_user_id
WHERE sub.module_code='APTIPATH' AND u.userName='sashank_1';
SELECT 'VERIFY_ANSWER_COUNT', COUNT(*)
FROM rd_ci_assessment_response r
WHERE r.ci_assessment_session_id=(
  SELECT MAX(s.ci_assessment_session_id)
  FROM rd_ci_assessment_session s
  JOIN rd_ci_subscription sub ON sub.ci_subscription_id=s.ci_subscription_id
  JOIN rd_user u ON u.userID=s.student_user_id
  WHERE sub.module_code='APTIPATH' AND u.userName='sashank_1'
);
" 
