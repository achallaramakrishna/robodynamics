import re
import json
import html
import urllib.parse
import urllib.request
import http.cookiejar
from urllib.error import HTTPError
from urllib.parse import urljoin

BASE = "http://127.0.0.1:8080"
USERS = [
    ("8", "sashank_1", "sashank_1", 12),
    ("9", "sashank", "sashank", 11),
    ("10", "ridhianish", "ridhianish", 10),
    ("11", "krishvi", "krishvi", 3),
    ("12", "student01", "student01", 9),
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


def req(opener, path, method="GET", data=None, binary=False):
    url = path if str(path).startswith("http") else urljoin(BASE, path)
    body = None
    if data is not None:
        body = urllib.parse.urlencode(data, doseq=True).encode("utf-8")
    request = urllib.request.Request(url, data=body, method=method)
    request.add_header("User-Agent", "AptiPathGradeE2E/1.0")

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
    ctype = headers.get("Content-Type", "")
    text = "" if binary else content.decode("utf-8", "replace")
    return code, text, loc, ctype, content


def extract_input_value(page_html, field_name=None, field_id=None):
    if field_id:
        m = re.search(r'id="%s"[^>]*value="([^"]*)"' % re.escape(field_id), page_html, re.I)
        if m:
            return html.unescape(m.group(1))
    if field_name:
        m = re.search(r'name="%s"[^>]*value="([^"]*)"' % re.escape(field_name), page_html, re.I)
        if m:
            return html.unescape(m.group(1))
    return ""


def normalize_options(raw_options):
    if isinstance(raw_options, str):
        try:
            raw_options = json.loads(raw_options)
        except Exception:
            raw_options = []
    if not isinstance(raw_options, list):
        return []
    norm = []
    for idx, opt in enumerate(raw_options):
        if isinstance(opt, dict):
            code = str(opt.get("code") or opt.get("key") or opt.get("value") or chr(65 + idx)).strip()
            label = str(opt.get("label") or opt.get("text") or opt.get("name") or code).strip()
        else:
            code = chr(65 + idx)
            label = str(opt).strip()
        if code:
            norm.append({"code": code.upper(), "label": label})
    return norm


def build_answers(questions):
    answers = {}
    times = {}
    conf = {}
    order = []
    for q in questions:
        if not isinstance(q, dict):
            continue
        q_code = str(q.get("questionCode") or "").strip()
        if not q_code:
            continue
        order.append(q_code)
        q_text = str(q.get("questionText") or "")
        q_type = str(q.get("questionType") or q.get("question_type") or "").strip().upper().replace("-", "_").replace(" ", "_")
        options = normalize_options(q.get("options"))
        is_rank = q_type in ("RANK_ORDER", "RANKING") or q_text.strip().upper().startswith("RANK ")
        if is_rank:
            ranked = [o["code"] for o in options if o.get("code")]
            ans = ">".join(ranked) if ranked else "A>B>C>D"
        else:
            ans = options[0]["code"] if options else "A"
        answers[q_code] = ans
        times[q_code] = "12"
        conf[q_code] = "MEDIUM"
    return order, answers, times, conf


def ensure_intake_ready(opener, grade):
    code, body, loc, _, _ = req(opener, "/aptipath/student/intake")
    if code in (302, 303) and loc:
        code, body, _, _, _ = req(opener, loc)
    if code != 200:
        return False, "", "intake_get_%s" % code

    sub_id = extract_input_value(body, field_name="subscriptionId")
    if not sub_id:
        return False, "", "subscription_id_missing"

    payload = {
        "subscriptionId": sub_id,
        "embed": "0",
        "company": "",
        "S_CURR_SCHOOL_01": "Robo Dynamics Test School",
        "S_CURR_GRADE_01": grade,
        "S_CURR_BOARD_01": "CBSE",
        "S_GOAL_01": "Career clarity with consistent progress and strong fundamentals",
        "S_LIFE_01": "I want a practical career path where I can build useful solutions",
        "S_HOBBY_01": "Robotics, coding practice, and problem-solving activities",
        "S_DISLIKE_01": "Rote learning without concept understanding",
        "S_STYLE_01": "PRACTICAL",
        "S_ACHIEVE_01": "Completed guided projects and performed well in assessments",
        "S_FEAR_01": "Losing marks due to time pressure in exams",
        "S_SUPPORT_01": "Need weekly mentoring, revision structure, and test analysis",
        "S_CURR_STREAM_01": "PCM",
        "S_CURR_SUBJECTS_01": "Physics, Chemistry, Mathematics",
        "S_CURR_PROGRAM_01": "BTECH_CSE",
        "S_CURR_YEARS_LEFT_01": "3_TO_4",
    }
    pcode, _, ploc, _, _ = req(opener, "/aptipath/student/intake", method="POST", data=payload)
    return True, sub_id, "intake_post_%s:%s" % (pcode, ploc)


def parse_questions_from_test_html(test_html):
    m = re.search(r'<script id="questionsData" type="application/json">(.*?)</script>', test_html, re.S | re.I)
    if not m:
        return []
    raw = html.unescape(m.group(1).strip())
    try:
        q = json.loads(raw)
        return q if isinstance(q, list) else []
    except Exception:
        return []


def submit_report_intake_if_needed(opener, location, fallback_session):
    if not location or "/aptipath/student/report-intake" not in location:
        return location

    code, body, _, _, _ = req(opener, location)
    if code != 200:
        return location

    session_id = extract_input_value(body, field_name="sessionId") or fallback_session
    embed_val = extract_input_value(body, field_name="embed")
    company_val = extract_input_value(body, field_name="company")

    payload = {
        "sessionId": session_id,
        "RFQ_01": "I learned that I perform better when I plan work into small focused blocks.",
        "RFQ_02": "I will track weak topics every week and complete one focused improvement cycle.",
        "RFQ_03": "I will follow a structured 90-day plan with mentorship checkpoints and mock tests.",
    }
    if embed_val:
        payload["embed"] = embed_val
    if company_val:
        payload["company"] = company_val

    _, _, ploc, _, _ = req(opener, "/aptipath/student/report-intake", method="POST", data=payload)
    if ploc:
        return ploc
    if session_id:
        return "/aptipath/student/result?sessionId=%s" % session_id
    return location


def add_as_pdf(path):
    if not path:
        return ""
    if "?" in path:
        return path + "&asPdf=1"
    return path + "?asPdf=1"


def run_user(grade, user, pwd, expected_sub):
    out = {
        "grade": grade,
        "user": user,
        "expectedSubscription": expected_sub,
        "loginOk": False,
        "intakeReady": False,
        "testLoaded": False,
        "submitted": False,
        "resultPageOk": False,
        "resultPdfOk": False,
        "roadmapBasicSeen": False,
        "roadmapProSeen": False,
        "sessionId": "",
        "questionCount": 0,
        "submitStatus": 0,
        "submitLocation": "",
        "resultStatus": 0,
        "pdfStatus": 0,
        "pdfLocation": "",
        "error": "",
    }

    opener = new_session()
    req(opener, "/login")
    lcode, lbody, lloc, _, _ = req(opener, "/login", method="POST", data={"userName": user, "password": pwd})

    if lcode in (302, 303):
        if "/login" in (lloc or "").lower():
            out["error"] = "login_redirected_to_login:%s" % lloc
            return out
        out["loginOk"] = True
    elif lcode == 200:
        bad = ("Incorrect password" in lbody) or ("No account found" in lbody) or ("inactive" in lbody.lower())
        out["loginOk"] = not bad
        if bad:
            out["error"] = "login_failed_200"
            return out
    else:
        out["error"] = "login_status_%s" % lcode
        return out

    intake_ok, sub_id, intake_note = ensure_intake_ready(opener, grade)
    out["intakeReady"] = intake_ok
    out["intakeNote"] = intake_note
    if sub_id:
        out["subscriptionIdSeen"] = sub_id
    if not intake_ok:
        out["error"] = intake_note
        return out

    tcode, tbody, tloc, _, _ = req(opener, "/aptipath/student/test")
    if tcode in (302, 303) and tloc:
        tcode, tbody, _, _, _ = req(opener, tloc)
    if tcode != 200:
        out["error"] = "test_status_%s" % tcode
        return out

    questions = parse_questions_from_test_html(tbody)
    out["questionCount"] = len(questions)
    if not questions:
        out["error"] = "no_questions"
        return out
    out["testLoaded"] = True

    session_id = extract_input_value(tbody, field_id="sessionIdField") or extract_input_value(tbody, field_name="sessionId")
    out["sessionId"] = session_id

    order, answers, times, conf = build_answers(questions)
    payload = {
        "sessionId": session_id,
        "durationSeconds": str(max(1, len(order) * 12)),
        "questionOrder": ",".join(order),
        "careerIntentCsv": "CS_AI,ROBOTICS_DRONE",
        "selfNumeric": "3",
        "selfLanguage": "3",
        "selfDiscipline": "3",
        "selfSpatial": "3",
        "subjectMath": "3",
        "subjectPhysics": "3",
        "subjectChemistry": "3",
        "subjectBiology": "3",
        "subjectLanguage": "3",
        "embed": "0",
        "company": "",
        "THINK_STORY_SUMMARY": "I noticed that I do better when I break complex work into smaller practice tasks.",
        "THINK_STORY_DECISION": "I decided to use weekly planning and timed revision because it improves accuracy and confidence.",
        "THINK_STORY_ACTION": "I will follow a seven-day cycle with practice, review, and one mentor feedback checkpoint.",
    }
    for code in order:
        payload["Q_" + code] = answers.get(code, "A")
        payload["T_" + code] = times.get(code, "12")
        payload["C_" + code] = conf.get(code, "MEDIUM")

    scode, sbody, sloc, _, _ = req(opener, "/aptipath/student/test/submit", method="POST", data=payload)
    out["submitStatus"] = scode
    out["submitLocation"] = sloc
    out["submitted"] = scode in (200, 302, 303)

    next_loc = sloc
    if not next_loc and scode == 200:
        if "/aptipath/student/report-intake" in sbody:
            next_loc = "/aptipath/student/report-intake"
        elif session_id:
            next_loc = "/aptipath/student/result?sessionId=%s" % session_id

    next_loc = submit_report_intake_if_needed(opener, next_loc, session_id)
    if not next_loc and session_id:
        next_loc = "/aptipath/student/result?sessionId=%s" % session_id
    if not next_loc:
        out["error"] = "no_result_location_after_submit"
        return out

    rcode, rbody, rloc, _, _ = req(opener, next_loc)
    if rcode in (302, 303) and rloc:
        if "/aptipath/student/report-intake" in rloc:
            final_loc = submit_report_intake_if_needed(opener, rloc, session_id)
            rcode, rbody, _, _, _ = req(opener, final_loc)
        else:
            rcode, rbody, _, _, _ = req(opener, rloc)

    out["resultStatus"] = rcode
    out["resultPageOk"] = (rcode == 200) and (("AptiPath" in rbody) or ("Report" in rbody) or ("Career" in rbody))
    out["roadmapBasicSeen"] = ("Basic Career Roadmap" in rbody) or ("Basic Plan" in rbody and "Upgrade to Pro" in rbody)
    out["roadmapProSeen"] = ("Pro Career Roadmap" in rbody) or ("Pro Plan" in rbody and "90-Day Action Plan" in rbody)

    pdf_path = add_as_pdf(next_loc)
    pcode, _, ploc, pctype, pbytes = req(opener, pdf_path, binary=True)
    out["pdfStatus"] = pcode
    out["pdfLocation"] = ploc
    out["resultPdfOk"] = (pcode == 200) and (("pdf" in (pctype or "").lower()) or pbytes[:4] == b"%PDF")

    if not out["resultPageOk"]:
        out["error"] = (out["error"] + ";" if out["error"] else "") + "result_page_check_failed"
    if not out["resultPdfOk"]:
        out["error"] = (out["error"] + ";" if out["error"] else "") + "result_pdf_check_failed"
    return out


results = []
for row in USERS:
    g, u, p, s = row
    try:
        results.append(run_user(g, u, p, s))
    except Exception as ex:
        results.append(
            {
                "grade": g,
                "user": u,
                "expectedSubscription": s,
                "loginOk": False,
                "intakeReady": False,
                "testLoaded": False,
                "submitted": False,
                "resultPageOk": False,
                "resultPdfOk": False,
                "error": "exception:%s:%s" % (type(ex).__name__, str(ex)),
            }
        )

def passed(r):
    return bool(
        r.get("loginOk")
        and r.get("intakeReady")
        and r.get("testLoaded")
        and r.get("submitted")
        and r.get("resultPageOk")
        and r.get("roadmapBasicSeen")
        and r.get("roadmapProSeen")
        and r.get("resultPdfOk")
    )

summary = {
    "total": len(results),
    "allPassed": sum(1 for r in results if passed(r)),
    "failed": sum(1 for r in results if not passed(r)),
}

print("APTIPATH_E2E_RESULTS_START")
for r in results:
    print(json.dumps(r, ensure_ascii=False))
print("APTIPATH_E2E_SUMMARY " + json.dumps(summary, ensure_ascii=False))
print("APTIPATH_E2E_RESULTS_END")
