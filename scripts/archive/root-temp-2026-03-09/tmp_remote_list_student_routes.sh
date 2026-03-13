set -euo pipefail
python3 - <<'PY'
import re, urllib.parse, urllib.request, http.cookiejar

BASE='http://127.0.0.1:8080'
USER='krishvi'
PWD='krishvi'

cj=http.cookiejar.CookieJar()
opener=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

def req(path, method='GET', data=None):
    body=urllib.parse.urlencode(data).encode('utf-8') if data else None
    r=urllib.request.Request(BASE+path,data=body,method=method)
    with opener.open(r,timeout=30) as resp:
        return resp.read().decode('utf-8','replace')

req('/login')
req('/login',method='POST',data={'userName':USER,'password':PWD})
html=req('/aptipath/student/intake')

targets=set()
for m in re.finditer(r'(?:href|action)=\"([^\"]+)\"',html):
    v=m.group(1)
    if '/aptipath/student/' in v or v.startswith('/aptipath/'):
        targets.add(v)

onclicks=set()
for m in re.finditer(r"window\.location\.href='([^']+)'",html):
    onclicks.add(m.group(1))

print('ROUTES')
for t in sorted(targets):
    print(t)
print('ONCLICK')
for t in sorted(onclicks):
    print(t)
PY
