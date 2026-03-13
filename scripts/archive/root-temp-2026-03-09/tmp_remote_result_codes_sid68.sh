python3 - <<'PY'
import urllib.request, urllib.parse, urllib.error, http.cookiejar, re
BASE='http://127.0.0.1:8080'; USER='krishvi'; PWD='krishvi'; SID='68'
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, hdrs, newurl):
        return None
cj=http.cookiejar.CookieJar(); op=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj), NoRedirect())
def req(path,data=None):
    url=BASE+path; body=None
    if data is not None: body=urllib.parse.urlencode(data).encode('utf-8')
    r=urllib.request.Request(url,data=body)
    try:
        resp=op.open(r,timeout=240); return resp.getcode(), resp.read().decode('utf-8','replace'), dict(resp.headers.items())
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8','replace'), dict(e.headers.items())
req('/login'); req('/login',{'userName':USER,'password':PWD})
c,b,h=req('/aptipath/student/result?sessionId='+SID)
if c in (302,303) and h.get('Location'):
    c,b,h=req(h['Location'])
print('STATUS',c)
codes=re.findall(r'career_code:\s*</strong>\s*([^<]+)</div>', b, re.I)
print('BASIC_CARD_CODES', '|'.join([x.strip() for x in codes[:8]]))
PY
