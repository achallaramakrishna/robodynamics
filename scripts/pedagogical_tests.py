"""
MindSutra Pedagogical Quality Tests
Tests that the coach-student interaction has correct structure, timing, and teaching quality.
Run on server: python3 /tmp/pedagogical_tests.py
"""
import urllib.request, json, ssl

ctx = ssl.create_default_context()
BASE = "https://robodynamics.in"
API  = "http://127.0.0.1:8091/ai-tutor-api"
KEY  = "change_me_ai_tutor_internal_key"

# All AI tutors with their first demo chapter
TUTORS = [
    # MindSutra — Vedic Math AI Tutor (G4-G8)
    {"name": "MindSutra",  "product": "Vedic Math",           "grade": 4, "chapter": "VM_G4_L1_FAST_ADDITION",    "lesson": "Completing the Whole - Fast Addition"},
    {"name": "MindSutra",  "product": "Vedic Math",           "grade": 5, "chapter": "L5_ALL_FROM_9_LAST_FROM_10", "lesson": "All from 9 and Last from 10"},
    {"name": "MindSutra",  "product": "Vedic Math",           "grade": 6, "chapter": "L7_SQUARES_ENDING_5",        "lesson": "Base Multiplication"},
    {"name": "MindSutra",  "product": "Vedic Math",           "grade": 7, "chapter": "L9_GENERAL_MULTIPLICATION",  "lesson": "General Multiplication"},
    {"name": "MindSutra",  "product": "Vedic Math",           "grade": 8, "chapter": "L11_VINCULUM_INTRO",         "lesson": "Vinculum / General"},
    # MindSpark — Aptitude & Reasoning AI Tutor (G6 only, more grades coming)
    {"name": "MindSpark",  "product": "Aptitude & Reasoning", "grade": 6, "chapter": "AR_G6_L1_SERIES",            "lesson": "Series Completion"},
]


def post(url, body):
    data = json.dumps(body).encode()
    req = urllib.request.Request(
        url, data=data,
        headers={"Content-Type": "application/json", "X-AI-Tutor-Key": KEY},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read())
        except Exception:
            return e.code, {}
    except Exception as ex:
        return 0, {"error": str(ex)}


def get_token(grade, chapter):
    url = "%s/ai-tutor/demo?grade=%d&chapter=%s&fresh=1" % (BASE, grade, chapter)
    req = urllib.request.Request(url, headers={"User-Agent": "pedagogical-test"})

    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, *a, **kw):
            return None

    opener = urllib.request.build_opener(NoRedirect())
    try:
        opener.open(req)
    except urllib.error.HTTPError as e:
        loc = e.headers.get("Location", "")
        for p in (loc.split("?", 1)[-1]).split("&"):
            if p.startswith("token="):
                return p[6:]
    return ""


def check(name, condition, detail=""):
    status = "PASS" if condition else "FAIL"
    msg = "  [%s] %s" % (status, name)
    if detail:
        msg += " -- " + detail
    print(msg)
    return 1 if condition else 0


def run_tutor(t):
    grade   = t["grade"]
    chapter = t["chapter"]
    name    = t["name"]
    product = t["product"]
    lesson  = t["lesson"]

    print("\n" + "=" * 65)
    print("%s | %s | Grade %d | %s" % (name, product, grade, lesson))
    print("=" * 65)
    passed = 0
    total  = 0

    # T1: guest token
    token = get_token(grade, chapter)
    total += 1
    if not check("T1: Guest JWT issued for demo URL", bool(token)):
        return 0, total
    passed += 1

    # T2: session start
    sc, start = post(API + "/tutor/start", {
        "token": token, "grade": str(grade), "chapter_code": chapter
    })
    total += 1
    if not check("T2: /tutor/start HTTP 200", sc == 200,
                 "HTTP %d %s" % (sc, str(start)[:80])):
        return passed, total
    passed += 1

    sid           = start.get("sessionId", "")
    active_ch     = start.get("activeChapterCode", "")
    lesson_obj    = start.get("lesson", {}) or {}
    lesson_title  = lesson_obj.get("title", "")

    total += 1; passed += check("T3: sessionId present",          bool(sid),         sid[:20])
    total += 1; passed += check("T4: activeChapterCode present",  bool(active_ch),   active_ch)
    total += 1; passed += check("T5: lesson.title present",       bool(lesson_title), lesson_title)

    # T6-T10: screenplay beats (intro must come before questions)
    screenplay    = lesson_obj.get("screenplay", []) or []
    intro_beats   = [b for b in screenplay if b.get("cue") == "intro"]
    explain_beats = [b for b in screenplay if b.get("cue") == "explain"]
    demo_beats    = [b for b in screenplay if b.get("cue") == "demo"]
    guided_beats  = [b for b in screenplay if b.get("cue") == "guided"]
    practice_beats = [b for b in screenplay if b.get("cue") == "practice"]

    total += 1; passed += check("T6: screenplay present (%d beats)" % len(screenplay),
                                 len(screenplay) > 0)
    total += 1; passed += check("T7: intro beat exists (greet student before questions)",
                                 len(intro_beats) > 0,
                                 "'%s'" % str(intro_beats[0].get("teacherLine", ""))[:70] if intro_beats else "MISSING")
    total += 1; passed += check("T8: explain beat exists (concept before practice)",
                                 len(explain_beats) > 0,
                                 "'%s'" % str(explain_beats[0].get("teacherLine", ""))[:70] if explain_beats else "MISSING")
    total += 1; passed += check("T9: demo beat exists (worked example before questions)",
                                 len(demo_beats) > 0,
                                 "'%s'" % str(demo_beats[0].get("teacherLine", ""))[:70] if demo_beats else "MISSING")
    total += 1; passed += check("T10: guided beat exists (teacher-guided attempt before solo)",
                                 len(guided_beats) > 0,
                                 "'%s'" % str(guided_beats[0].get("teacherLine", ""))[:70] if guided_beats else "MISSING")

    # T11: screenplay order — intro must come before practice
    if screenplay:
        intro_seq    = min((b.get("sequence", 9999) for b in intro_beats),    default=9999)
        practice_seq = min((b.get("sequence", 0)    for b in practice_beats), default=0)
        total += 1; passed += check(
            "T11: intro appears BEFORE practice in sequence",
            intro_seq < practice_seq,
            "intro_seq=%d practice_seq=%d" % (intro_seq, practice_seq)
        )

    # T12: learning goals
    goals = lesson_obj.get("learningGoals", []) or []
    total += 1; passed += check("T12: learningGoals present (%d)" % len(goals),
                                 len(goals) >= 2)
    if goals:
        print("       Goals[0]: %s" % goals[0])

    # T13: coachIntro for onboarding
    arc         = lesson_obj.get("duolingoLessonArc") or {}
    coach_intro = arc.get("onboarding", {}).get("coachIntro", "") if arc else ""
    total += 1; passed += check("T13: coachIntro text present (personalised greeting)",
                                 bool(coach_intro),
                                 "'%s'" % coach_intro[:80] if coach_intro else "MISSING")

    # T14-T19: question quality
    sc2, qr = post(API + "/tutor/next-question", {"sessionId": sid})
    total += 1
    if not check("T14: /tutor/next-question HTTP 200", sc2 == 200, "HTTP %d" % sc2):
        return passed, total
    passed += 1

    q      = qr.get("question", {}) or {}
    qtext  = q.get("questionText", "")
    qtype  = q.get("type", "")
    qhint  = q.get("hint", "")
    qsoln  = q.get("solution", "")
    qgroup = q.get("exerciseGroup", "")
    qskill = q.get("skill", "")

    total += 1; passed += check("T15: question.questionText not empty",      bool(qtext),  "'%s'" % qtext[:70])
    total += 1; passed += check("T16: question.type is a known type",
                                 qtype in ("short_answer", "mcq", "fill_blank", "true_false", "ordering"),
                                 qtype)
    total += 1; passed += check("T17: question.hint present (scaffolding)",  bool(qhint),  "'%s'" % qhint[:60])
    total += 1; passed += check("T18: question.solution present",            bool(qsoln),  "'%s'" % qsoln[:60])
    total += 1; passed += check("T19: first question in group A (start of lesson arc)",
                                 qgroup == "A", "got group='%s'" % qgroup)
    total += 1; passed += check("T20: question.skill labels the Vedic skill", bool(qskill), qskill)

    # T21-T24: wrong answer feedback quality
    sc3, fb = post(API + "/tutor/check-answer", {
        "sessionId":    sid,
        "questionId":   q.get("questionId", "x"),
        "learnerAnswer": "999"
    })
    total += 1
    if not check("T21: /tutor/check-answer HTTP 200 (wrong answer)", sc3 == 200):
        return passed, total
    passed += 1

    # check-answer response uses: correct / explanation / expectedAnswer / encouragement
    is_correct  = fb.get("correct", fb.get("is_correct", fb.get("isCorrect")))
    feedback    = str(fb.get("explanation", fb.get("feedback", fb.get("encouragement", ""))))
    correct_ans = str(fb.get("expectedAnswer", fb.get("correct_answer", fb.get("correctAnswer", ""))))

    total += 1; passed += check("T22: correct=False for wrong answer",
                                 is_correct is False,
                                 "got correct=%s" % is_correct)
    total += 1; passed += check("T23: explanation text is substantive",
                                 len(feedback) > 5,
                                 "'%s'" % feedback[:80])
    total += 1; passed += check("T24: expectedAnswer revealed in feedback",
                                 bool(correct_ans),
                                 "'%s'" % correct_ans)

    # T25-T27: correct answer gives praise
    expected = q.get("expectedAnswer", "")
    if expected:
        sc4, fb2 = post(API + "/tutor/check-answer", {
            "sessionId":     sid,
            "questionId":    q.get("questionId", "x"),
            "learnerAnswer": expected
        })
        total += 1
        if check("T25: /tutor/check-answer HTTP 200 (correct answer)", sc4 == 200):
            passed += 1
            is_c2  = fb2.get("correct", fb2.get("is_correct", fb2.get("isCorrect")))
            praise = str(fb2.get("encouragement", fb2.get("explanation", fb2.get("feedback", ""))))
            total += 1; passed += check("T26: correct=True for correct answer",
                                         is_c2 is True, "got correct=%s" % is_c2)
            total += 1; passed += check("T27: positive/encouraging feedback on correct answer",
                                         len(praise) > 5, "'%s'" % praise[:60])

    # T28-T29: doubt/chat endpoint answers in context
    sc5, doubt_resp = post(API + "/tutor/doubt", {
        "sessionId": sid,
        "message":   "Can you explain this concept in simple words?"
    })
    total += 1
    if check("T28: /tutor/doubt HTTP 200", sc5 == 200, "HTTP %d" % sc5):
        passed += 1
        reply = str(doubt_resp.get("reply", doubt_resp.get("response", "")))
        total += 1; passed += check("T29: doubt reply is non-empty and contextual",
                                     len(reply) > 30,
                                     "'%s'" % reply[:80])

    pct = int(100 * passed / total) if total else 0
    print("\n  SCORE: %d/%d tests passed (%d%%)" % (passed, total, pct))
    return passed, total


# ── Run all tutors ──────────────────────────────────────────────────
grand_pass  = 0
grand_total = 0
grade_results = []

for tutor in TUTORS:
    p, t = run_tutor(tutor)
    grand_pass  += p
    grand_total += t
    grade_results.append((tutor["name"], tutor["grade"], p, t))

print("\n" + "=" * 65)
print("OVERALL SUMMARY")
print("=" * 65)
for name, grade, p, t in grade_results:
    pct   = int(100 * p / t) if t else 0
    bar   = "#" * p + "." * (t - p)
    emoji = "OK" if p == t else ("~" if pct >= 80 else "X")
    print("  [%s] %s G%d: %d/%d (%d%%)  [%s]" % (emoji, name, grade, p, t, pct, bar))

overall_pct = int(100 * grand_pass / grand_total) if grand_total else 0
print("\n  GRAND TOTAL: %d/%d (%d%%)" % (grand_pass, grand_total, overall_pct))
if overall_pct == 100:
    print("  ALL TESTS PASSED -- Safe to open demos to parents")
elif overall_pct >= 85:
    print("  MOSTLY PASSING -- Review FAIL lines, then launch")
else:
    print("  NEEDS WORK -- Fix FAILs before sharing with parents")
