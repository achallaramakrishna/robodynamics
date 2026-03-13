import json, html, re, urllib.request, urllib.parse, http.cookiejar
BASE='http://127.0.0.1:8080'
USER='sashank_1'; PWD='sashank_1'
cj=http.cookiejar.CookieJar(); op=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
def req(path,data=None):
    body=None
    if data is not None:
        body=urllib.parse.urlencode(data, doseq=True).encode('utf-8')
    r=urllib.request.Request(BASE+path,data=body)
    with op.open(r,timeout=60) as resp:
        return resp.getcode(), resp.read().decode('utf-8','replace'), dict(resp.headers.items())
req('/login'); req('/login',{'userName':USER,'password':PWD})
code, body, h = req('/aptipath/student/intake')
sub='' 
m=re.search(r'name="subscriptionId"[^>]*value="([^"]+)"', body)
if m: sub=m.group(1)
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
try:
    req('/aptipath/student/intake',payload)
except Exception:
    pass
code, html_page, _ = req('/aptipath/student/test')
m = re.search(r'<script id="questionsData" type="application/json">(.*?)</script>', html_page, re.S|re.I)
if not m:
    print('NO_QUESTIONS_JSON')
else:
    raw = html.unescape(m.group(1).strip())
    q = json.loads(raw)
    print('QCOUNT', len(q))
    for i,qq in enumerate(q[:3], start=1):
        print('Q',i,'CODE',qq.get('questionCode'),'TYPE',qq.get('questionType'))
        print('OPTIONS_RAW', json.dumps(qq.get('options'), ensure_ascii=False)[:700])
        print('---')
