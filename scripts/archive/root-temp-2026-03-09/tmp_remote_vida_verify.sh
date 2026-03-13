python3 - <<'PY'
import re, urllib.request, urllib.parse, http.cookiejar
BASE='http://127.0.0.1:8080'; USER='sashank'; PWD='sashank'; SID='54'
cj=http.cookiejar.CookieJar(); op=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
def req(path,data=None):
    body=None
    if data is not None: body=urllib.parse.urlencode(data).encode('utf-8')
    r=urllib.request.Request(BASE+path,data=body)
    with op.open(r,timeout=40) as resp:
        return resp.read().decode('utf-8','replace')
req('/login'); req('/login',{'userName':USER,'password':PWD})
html=req('/aptipath/student/result?sessionId='+SID)
names=re.findall(r'<div class="title">\s*([^<]+?)\s*</div>', html)
print('TOTAL_TITLES', len(names))
print('TOP20', ' | '.join(names[:20]))
print('HAS_AI_ML_ENGINEER', any('AI/ML Engineer' in n or 'AI Engineer' in n for n in names))
PY
