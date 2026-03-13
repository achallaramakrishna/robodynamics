set -euo pipefail
python3 - <<'PY'
import re, urllib.parse, urllib.request, http.cookiejar

BASE = 'http://127.0.0.1:8080'
USER = 'krishvi'
PWD = 'krishvi'

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

def req(path, method='GET', data=None):
    body = urllib.parse.urlencode(data).encode('utf-8') if data else None
    r = urllib.request.Request(BASE + path, data=body, method=method)
    with opener.open(r, timeout=30) as resp:
        return resp.getcode(), resp.read().decode('utf-8', 'replace'), dict(resp.headers)

req('/login')
code, _, _ = req('/login', method='POST', data={'userName': USER, 'password': PWD})
print(f'LOGIN={code}')
code, intake_html, _ = req('/aptipath/student/intake')
print(f'INTAKE_GET={code}')
m = re.search(r'name="subscriptionId"\s+value="(\d+)"', intake_html)
sub_id = m.group(1) if m else ''
print(f'SUB_ID={sub_id}')

payload = {
    'subscriptionId': sub_id,
    'embed': '0',
    'company': '',
    'S_CURR_SCHOOL_01': 'Robo Test School',
    'S_CURR_GRADE_01': '11',
    'S_CURR_BOARD_01': 'CBSE',
    'S_CURR_STREAM_01': 'PCM',
    'S_CURR_PROGRAM_01': 'BTECH_CSE',
    'S_CURR_YEARS_LEFT_01': '1_TO_2',
    'S_GOAL_01': 'Career clarity',
    'S_LIFE_01': 'Learning growth'
}
code, _, hdr = req('/aptipath/student/intake', method='POST', data=payload)
print(f'INTAKE_POST={code} REDIRECT={hdr.get("Location","")}')
code, test_html, _ = req('/aptipath/student/test')
print(f'TEST_GET={code} LEN={len(test_html)}')

ids = re.findall(r'<script[^>]*id="([^"]+)"[^>]*>', test_html, re.I)
print('SCRIPT_IDS=' + ','.join(ids[:20]))

for patt in ['questionsData', 'questionCode', 'window.__', 'application/json', 'data-question']:
    print(f'PATTERN_{patt}={("YES" if patt in test_html else "NO")}')

print('HEAD_SNIPPET_START')
print(test_html[:2000])
print('HEAD_SNIPPET_END')
PY
