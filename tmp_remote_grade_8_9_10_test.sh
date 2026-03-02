set -euo pipefail
python3 - <<'PY'
import re, json, html, urllib.parse, urllib.request, http.cookiejar, subprocess, shlex

BASE = 'http://127.0.0.1:8080'
USER = 'krishvi'
PWD = 'krishvi'

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

def req(path, method='GET', data=None):
    url = BASE + path
    if data is not None:
        body = urllib.parse.urlencode(data).encode('utf-8')
    else:
        body = None
    r = urllib.request.Request(url, data=body, method=method)
    with opener.open(r, timeout=30) as resp:
        return resp.getcode(), resp.read().decode('utf-8', 'replace'), dict(resp.headers)

# prime + login
req('/login')
code, body, hdr = req('/login', method='POST', data={'userName': USER, 'password': PWD})
print(f'LOGIN_STATUS={code}')

code, intake_html, _ = req('/aptipath/student/intake')
print(f'INTAKE_STATUS={code}')
m = re.search(r'name="subscriptionId"\s+value="(\d+)"', intake_html)
if not m:
    raise SystemExit('FAILED: subscriptionId not found in intake html')
sub_id = m.group(1)
print(f'SUBSCRIPTION_ID={sub_id}')

scenarios = [
    ('8', 'PCM', 'BTECH_CSE'),
    ('9', 'PCM', 'BTECH_CSE'),
    ('10', 'PCM', 'BTECH_CSE'),
]

for grade, stream, program in scenarios:
    payload = {
        'subscriptionId': sub_id,
        'embed': '0',
        'company': '',
        'S_CURR_SCHOOL_01': 'Robo Test School',
        'S_CURR_GRADE_01': grade,
        'S_CURR_BOARD_01': 'CBSE',
        'S_CURR_STREAM_01': stream,
        'S_CURR_PROGRAM_01': program,
        'S_CURR_YEARS_LEFT_01': '3_TO_4',
        'S_GOAL_01': 'Career clarity',
        'S_LIFE_01': 'Learning growth'
    }
    c_post, _, h_post = req('/aptipath/student/intake', method='POST', data=payload)
    location = h_post.get('Location','')

    c_test, test_html, _ = req('/aptipath/student/test')

    m_json = re.search(r'<script id="questionsData" type="application/json">(.*?)</script>', test_html, re.S)
    if not m_json:
        print(f'GRADE={grade} POST={c_post} TEST={c_test} QUESTIONS=0 ERROR=no_questionsData_script')
        continue

    q_text = html.unescape(m_json.group(1).strip())
    try:
        questions = json.loads(q_text)
    except Exception as ex:
        print(f'GRADE={grade} POST={c_post} TEST={c_test} QUESTIONS=0 ERROR=json_parse:{ex}')
        continue

    q_codes = [q.get('questionCode') for q in questions if isinstance(q, dict) and q.get('questionCode')]
    sections = {}
    for q in questions:
        if not isinstance(q, dict):
            continue
        sec = (q.get('sectionCode') or 'UNKNOWN').strip()
        sections[sec] = sections.get(sec, 0) + 1

    expected = f'GRADE_{grade}'
    grade_match = 0
    grade_other = 0
    grade_null = 0
    if q_codes:
        in_list = ','.join("'" + c.replace("'", "''") + "'" for c in q_codes)
        sql = (
            "USE robodynamics_db; "
            "SELECT "
            "SUM(CASE WHEN grade_level='" + expected + "' THEN 1 ELSE 0 END),"
            "SUM(CASE WHEN grade_level IS NOT NULL AND grade_level<>'" + expected + "' THEN 1 ELSE 0 END),"
            "SUM(CASE WHEN grade_level IS NULL OR grade_level='' THEN 1 ELSE 0 END) "
            "FROM rd_ci_question_bank WHERE question_code IN (" + in_list + ");"
        )
        cmd = ["mysql", "-uroot", "-pJatni@752050", "-Nse", sql]
        out = subprocess.check_output(cmd, text=True, stderr=subprocess.DEVNULL).strip()
        if out:
            parts = out.split('\t')
            if len(parts) >= 3:
                grade_match = int(parts[0] or 0)
                grade_other = int(parts[1] or 0)
                grade_null = int(parts[2] or 0)

    sec_str = ','.join([f'{k}:{v}' for k,v in sorted(sections.items())])
    print(f'GRADE={grade} POST={c_post} REDIRECT={location} TEST={c_test} QUESTIONS={len(q_codes)} DB_MATCH={grade_match} DB_OTHER={grade_other} DB_NULL={grade_null} SECTIONS={sec_str}')

PY