python3 - <<'PY'
import time, urllib.request, urllib.parse, urllib.error, http.cookiejar
BASE='http://127.0.0.1:8080'
USER='krishvi'; PWD='krishvi'; SID='72'
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, hdrs, newurl):
        return None
cj=http.cookiejar.CookieJar()
op=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj), NoRedirect())
def req(path,data=None,timeout=40):
    url = path if path.startswith('http') else BASE+path
    body=None
    if data is not None:
        body=urllib.parse.urlencode(data).encode('utf-8')
    r=urllib.request.Request(url,data=body)
    try:
        resp=op.open(r,timeout=timeout)
        return resp.getcode(), resp.read().decode('utf-8','replace'), dict(resp.headers.items())
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8','replace'), dict(e.headers.items())

req('/login')
req('/login', {'userName':USER,'password':PWD})
start=time.monotonic()
code,body,h=req('/aptipath/student/result?sessionId='+SID, timeout=90)
if code in (302,303) and h.get('Location'):
    code,body,h=req(h['Location'], timeout=90)
elapsed=(time.monotonic()-start)*1000
print('STATUS', code)
print('ELAPSED_MS', int(elapsed))
print('BODY_LEN', len(body or ''))
print('HAS_CARDS', 'Career Direction Cards (Top 5)' in (body or ''))
print('HAS_MODAL', 'careerRoadmapModal' in (body or ''))
PY