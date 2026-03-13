import re
import json
import html
import urllib.parse
import urllib.request
import http.cookiejar
from urllib.error import HTTPError
from urllib.parse import urljoin

BASE = "http://127.0.0.1:8080"

SCENARIOS = [
    {
        "name": "G11_PCM",
        "user": "krishvi",
        "pwd": "krishvi",
        "grade": "11",
        "stream": "PCM",
        "subjects": "PCM_PHYSICS_CHEMISTRY_MATH",
    },
    {
        "name": "G11_PCB",
        "user": "krishvi",
        "pwd": "krishvi",
        "grade": "11",
        "stream": "PCB",
        "subjects": "PCB_PHYSICS_CHEMISTRY_BIOLOGY",
    },
    {
        "name": "G11_PCMB",
        "user": "krishvi",
        "pwd": "krishvi",
        "grade": "11",
        "stream": "PCMB",
        "subjects": "PCB_PHYSICS_CHEMISTRY_BIOLOGY_MATH",
    },
    {
        "name": "G12_COMMERCE",
        "user": "student01",
        "pwd": "student01",
        "grade": "12",
        "stream": "COMMERCE",
        "subjects": "COM_ACC_ECO_BST",
    },
    {
        "name": "G12_HUMANITIES",
        "user": "student01",
        "pwd": "student01",
        "grade": "12",
        "stream": "HUMANITIES",
        "subjects": "HUM_HISTORY_POLITICAL_SCIENCE_SOCIOLOGY",
    },
    {
        "name": "G12_COM_HUM_DUAL",
        "user": "student01",
        "pwd": "student01",
        "grade": "12",
        "stream": "COMMERCE",
        "subjects": "HUM_HISTORY_POLITICAL_SCIENCE_SOCIOLOGY",
    },
]

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, hdrs, newurl):
        return None


def new_session():
    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(
        urllib.request.HTTPCookieProcessor(cj),
        NoRedirect(),
    )
    return opener


def req(opener, path, method="GET", data=None):
    url = path if str(path).startswith("http") else urljoin(BASE, path)
    body = None
    if data is not None:
        body = urllib.parse.urlencode(data, doseq=True).encode("utf-8")
    request = urllib.request.Request(url, data=body, method=method)
    request.add_header("User-Agent", "AptiPathTrackProbe/1.0")

    resp = None
    try:
        resp = opener.open(request, timeout=60)
        code = resp.getcode()
    except HTTPError as e:
        resp = e
        code = e.code

    content = b""
    if resp is not None:
        content = resp.read()
    headers = dict(resp.headers.items()) if resp is not None else {}
    loc = headers.get("Location", "")
    text = content.decode("utf-8", "replace")
    return code, text, loc


def extract_input_value(page_html, field_name=None):
    if field_name:
        m = re.search(r'name="%s"[^>]*value="([^"]*)"' % re.escape(field_name), page_html, re.I)
        if m:
            return html.unescape(m.group(1))
    return ""


def parse_questions(test_html):
    m = re.search(r'<script id="questionsData" type="application/json">(.*?)</script>', test_html, re.S | re.I)
    if not m:
        return []
    raw = html.unescape(m.group(1).strip())
    try:
        q = json.loads(raw)
        return q if isinstance(q, list) else []
    except Exception:
        return []


def run_scenario(sc):
    out = {
        "scenario": sc["name"],
        "grade": sc["grade"],
        "stream": sc["stream"],
        "subjects": sc["subjects"],
        "ok": False,
        "questionCount": 0,
        "sections": {},
        "error": "",
    }

    opener = new_session()
    req(opener, "/login")
    lcode, lbody, lloc = req(opener, "/login", method="POST", data={"userName": sc["user"], "password": sc["pwd"]})
    if lcode in (302, 303):
        if "/login" in (lloc or "").lower():
            out["error"] = "login_failed"
            return out
    elif lcode == 200:
        if "Incorrect password" in lbody or "No account found" in lbody:
            out["error"] = "login_failed_200"
            return out
    else:
        out["error"] = "login_status_%s" % lcode
        return out

    icode, ibody, iloc = req(opener, "/aptipath/student/intake")
    if icode in (302, 303) and iloc:
        icode, ibody, _ = req(opener, iloc)
    if icode != 200:
        out["error"] = "intake_get_%s" % icode
        return out

    sub_id = extract_input_value(ibody, field_name="subscriptionId")
    if not sub_id:
        out["error"] = "no_subscription_id"
        return out

    payload = {
        "subscriptionId": sub_id,
        "embed": "0",
        "company": "",
        "S_CURR_SCHOOL_01": "Robo Dynamics Test School",
        "S_CURR_GRADE_01": sc["grade"],
        "S_CURR_BOARD_01": "CBSE",
        "S_CURR_STREAM_01": sc["stream"],
        "S_CURR_SUBJECTS_01": sc["subjects"],
        "S_CURR_PROGRAM_01": "",
        "S_CURR_YEARS_LEFT_01": "",
        "S_GOAL_01": "ENGINEERING_RESEARCH",
        "S_LIFE_01": "I want a clear career path and measurable growth over 10 years.",
        "S_HOBBY_01": "Projects, reading, and problem solving",
        "S_DISLIKE_01": "Unstructured revision without concept clarity",
        "S_STYLE_01": "PRACTICAL",
        "S_ACHIEVE_01": "Completed projects and improved test consistency",
        "S_FEAR_01": "Time pressure in important exams",
        "S_SUPPORT_01": "Weekly planning and mentor review",
        "S_MOTIVE_01": "MASTERY",
        "S_ROLE_01": "Mentor in my target field",
        "S_ACCOLADE_01": "School level recognitions",
        "S_STRESS_01": "OVERTHINK",
        "S_PARENT_01": "HIGH_ALIGN",
    }
    pcode, _, _ = req(opener, "/aptipath/student/intake", method="POST", data=payload)
    if pcode not in (200, 302, 303):
        out["error"] = "intake_post_%s" % pcode
        return out

    req(opener, "/aptipath/student/test/restart", method="POST", data={"embed": "0", "company": ""})

    tcode, tbody, tloc = req(opener, "/aptipath/student/test")
    if tcode in (302, 303) and tloc:
        tcode, tbody, _ = req(opener, tloc)
    if tcode != 200:
        out["error"] = "test_get_%s" % tcode
        return out

    questions = parse_questions(tbody)
    out["questionCount"] = len(questions)
    counts = {}
    for q in questions:
        sec = str((q or {}).get("sectionCode") or "").strip().upper()
        if not sec:
            sec = "UNKNOWN"
        counts[sec] = counts.get(sec, 0) + 1
    out["sections"] = counts
    out["ok"] = True
    return out


print("APTIPATH_TRACK_PROBE_START")
for sc in SCENARIOS:
    print(json.dumps(run_scenario(sc), ensure_ascii=False))
print("APTIPATH_TRACK_PROBE_END")
