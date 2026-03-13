set -euo pipefail

cat > /tmp/qbank_ai_autorun.py <<'PY'
#!/usr/bin/env python3
import json
import os
import re
import subprocess
import sys
import time
import traceback
import urllib.request
from datetime import datetime

DB_CMD = ["mysql", "-uroot", "-pJatni@752050", "-D", "robodynamics_db", "--batch", "--raw", "-Nse"]
OPENAI_URL = "https://api.openai.com/v1/chat/completions"
RUN_ID = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
RUN_DIR = f"/tmp/qbank_ai_run_{RUN_ID}"
os.makedirs(RUN_DIR, exist_ok=True)
STATUS_JSONL = os.path.join(RUN_DIR, "chapter_status.jsonl")
STATUS_CSV = os.path.join(RUN_DIR, "chapter_status.csv")
MAX_CHAPTERS = int(os.environ.get("QBANK_MAX_CHAPTERS", "0"))
SLEEP_BETWEEN_CALLS = float(os.environ.get("QBANK_API_SLEEP_SEC", "0.6"))
SUBJECT_FILTER = os.environ.get("QBANK_SUBJECT_FILTER", "").strip().upper()
COURSE_FILTER_RAW = os.environ.get("QBANK_COURSE_IDS", "").strip()
COURSE_FILTER = set()
if COURSE_FILTER_RAW:
    for x in COURSE_FILTER_RAW.split(","):
        x = x.strip()
        if x.isdigit():
            COURSE_FILTER.add(int(x))


def log(msg):
    print(f"[{datetime.utcnow().isoformat()}] {msg}", flush=True)


def mysql_query(sql):
    proc = subprocess.run(DB_CMD + [sql], capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"MySQL query failed: {proc.stderr.strip()}")
    lines = []
    for line in proc.stdout.splitlines():
        if line.strip().startswith("mysql: [Warning]"):
            continue
        if line.strip():
            lines.append(line.rstrip("\n"))
    return lines


def mysql_exec(sql):
    proc = subprocess.run(DB_CMD + [sql], capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"MySQL exec failed: {proc.stderr.strip()}")
    return proc.stdout


def esc(value):
    if value is None:
        return ""
    value = str(value)
    value = value.replace("\\", "\\\\")
    value = value.replace("'", "\\'")
    value = value.replace("\x00", "")
    value = value.replace("\r", " ")
    value = value.replace("\n", " ")
    return value


def read_openai_key():
    candidates = [
        "/opt/tomcat/webapps/ROOT/WEB-INF/classes/app-config.properties",
        "/opt/config/app-config.properties",
        "/opt/robodynamics/app-config.properties",
    ]
    for path in candidates:
        if not os.path.exists(path):
            continue
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as fh:
                for line in fh:
                    if line.startswith("openai.api.key="):
                        return line.strip().split("=", 1)[1].strip()
        except Exception:
            continue
    return ""


OPENAI_KEY = os.environ.get("OPENAI_API_KEY", "").strip()
if not OPENAI_KEY:
    OPENAI_KEY = read_openai_key()
if not OPENAI_KEY:
    raise SystemExit("OpenAI key not found in production config.")


def call_openai(prompt, max_tokens=2200, retries=4):
    payload = {
        "model": "gpt-4o-mini",
        "temperature": 0.25,
        "max_tokens": max_tokens,
        "response_format": {"type": "json_object"},
        "messages": [{"role": "user", "content": prompt}],
    }
    data = json.dumps(payload).encode("utf-8")
    last_err = None
    for attempt in range(1, retries + 1):
        try:
            req = urllib.request.Request(
                OPENAI_URL,
                data=data,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {OPENAI_KEY}",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=180) as resp:
                body = resp.read().decode("utf-8", errors="ignore")
            obj = json.loads(body)
            if "error" in obj:
                raise RuntimeError(obj["error"].get("message", "OpenAI API error"))
            return obj["choices"][0]["message"]["content"]
        except Exception as ex:
            last_err = ex
            time.sleep(min(5 * attempt, 20))
    raise RuntimeError(f"OpenAI call failed after retries: {last_err}")


def parse_questions_blob(text):
    if not text:
        return []
    s = text.strip()
    if s.startswith("```"):
        s = re.sub(r"^```[a-zA-Z]*", "", s).strip()
        s = re.sub(r"```$", "", s).strip()
    # direct parse attempts
    candidates = []
    candidates.append(s)
    a = s.find("{")
    b = s.rfind("}")
    if a >= 0 and b > a:
        candidates.append(s[a:b + 1])
    a2 = s.find("[")
    b2 = s.rfind("]")
    if a2 >= 0 and b2 > a2:
        candidates.append(s[a2:b2 + 1])
    for c in candidates:
        try:
            obj = json.loads(c)
            if isinstance(obj, dict) and isinstance(obj.get("questions"), list):
                return obj["questions"]
            if isinstance(obj, list):
                return obj
        except Exception:
            continue
    return []


def normalize_type(t):
    v = (t or "").strip().lower()
    if v in ("mcq", "multiple choice"):
        return "multiple_choice"
    if v in ("short answer",):
        return "short_answer"
    if v in ("long answer",):
        return "long_answer"
    if v in ("fill in blank", "fill-in-blank", "fill_in_the_blank"):
        return "fill_in_blank"
    if v in ("multiple_choice", "short_answer", "long_answer", "fill_in_blank"):
        return v
    return "short_answer"


def normalize_diff(d):
    v = (d or "").strip().lower()
    if v == "easy":
        return "Easy"
    if v == "hard":
        return "Hard"
    if v == "expert":
        return "Expert"
    if v == "master":
        return "Master"
    return "Medium"


def default_marks(qtype):
    if qtype == "multiple_choice":
        return 1
    if qtype == "fill_in_blank":
        return 1
    if qtype == "short_answer":
        return 2
    return 5


def norm_text(t):
    return re.sub(r"\s+", " ", (t or "").strip().lower())


def get_subject_bucket(course_name):
    name = (course_name or "").lower()
    if re.search(r"math|mathematics|algebra|geometry|mensuration|trigonometry", name):
        return "MATH"
    if "physics" in name:
        return "PHYSICS"
    if "chemistry" in name:
        return "CHEMISTRY"
    if "biology" in name:
        return "BIOLOGY"
    if "science" in name:
        return "SCIENCE"
    if "hindi" in name:
        return "HINDI"
    if "english" in name:
        return "ENGLISH"
    return "OTHER"


def get_targets(subject):
    if subject == "MATH":
        return {"total": 45, "mcq": 20, "short_answer": 12, "long_answer": 8, "fill_in_blank": 5}
    if subject in ("SCIENCE", "PHYSICS", "CHEMISTRY"):
        return {"total": 42, "mcq": 18, "short_answer": 12, "long_answer": 8, "fill_in_blank": 4}
    if subject == "HINDI":
        return {"total": 36, "mcq": 12, "short_answer": 12, "long_answer": 8, "fill_in_blank": 4}
    return {"total": 36, "mcq": 14, "short_answer": 10, "long_answer": 8, "fill_in_blank": 4}


def get_gap_chapters():
    sql = r"""
SELECT t.course_id,
       t.course_name,
       t.course_session_id,
       COALESCE(t.session_id,'') AS session_order,
       t.session_title,
       t.sample_pdf
FROM (
  SELECT s.course_id,
         c.course_name,
         s.course_session_id,
         s.session_id,
         s.session_title,
         COUNT(DISTINCT CASE WHEN LOWER(COALESCE(d.type,''))='pdf' THEN d.course_session_detail_id END) AS pdf_count,
         MIN(CASE WHEN LOWER(COALESCE(d.type,''))='pdf' THEN d.file END) AS sample_pdf,
         COUNT(DISTINCT q.question_id) AS question_count
  FROM rd_course_sessions s
  JOIN rd_courses c ON c.course_id = s.course_id
  LEFT JOIN rd_course_session_details d ON d.course_session_id = s.course_session_id
  LEFT JOIN rd_quiz_questions q ON q.course_session_id = s.course_session_id
  WHERE c.is_active=1
    AND s.session_type='session'
    AND LOWER(COALESCE(c.course_name,'')) REGEXP '(cbse|icse)'
    AND LOWER(COALESCE(c.course_name,'')) REGEXP '(grade|class)'
  GROUP BY s.course_id, c.course_name, s.course_session_id, s.session_id, s.session_title
) t
WHERE t.pdf_count > 0 AND t.question_count = 0
ORDER BY
  CASE
    WHEN LOWER(t.course_name) REGEXP 'math|mathematics|algebra|geometry|mensuration|trigonometry' THEN 1
    WHEN LOWER(t.course_name) REGEXP 'hindi' THEN 2
    WHEN LOWER(t.course_name) REGEXP 'science' THEN 3
    WHEN LOWER(t.course_name) REGEXP 'physics' THEN 4
    WHEN LOWER(t.course_name) REGEXP 'chemistry' THEN 5
    ELSE 9
  END,
  t.course_id,
  t.course_session_id;
"""
    out = mysql_query(sql)
    rows = []
    for line in out:
        p = line.split("\t")
        if len(p) < 6:
            continue
        subject = get_subject_bucket(p[1])
        rows.append({
            "course_id": int(p[0]),
            "course_name": p[1],
            "course_session_id": int(p[2]),
            "session_order": p[3],
            "session_title": p[4],
            "sample_pdf": p[5] if len(p) > 5 else "",
            "subject_bucket": subject,
        })
    if SUBJECT_FILTER:
        rows = [r for r in rows if r["subject_bucket"] == SUBJECT_FILTER]
    if COURSE_FILTER:
        rows = [r for r in rows if r["course_id"] in COURSE_FILTER]
    return rows


def resolve_pdf(course_id, session_id, sample_pdf):
    course_root = f"/opt/robodynamics/session_materials/{course_id}"
    candidates = []

    if sample_pdf:
        f = sample_pdf.strip()
        if f.startswith("/session_materials/"):
            rel = f[len("/session_materials/"):]
            candidates.append(os.path.join("/opt/robodynamics/session_materials", rel))
        elif f.startswith("/"):
            candidates.append(f)
        else:
            candidates.append(os.path.join(course_root, f))

    # DB fallback
    db_files = mysql_query(
        f"SELECT file FROM rd_course_session_details "
        f"WHERE course_session_id={session_id} AND LOWER(COALESCE(type,''))='pdf' AND file IS NOT NULL LIMIT 3;"
    )
    for f in db_files:
        f = f.strip()
        if not f:
            continue
        if f.startswith("/session_materials/"):
            rel = f[len("/session_materials/"):]
            candidates.append(os.path.join("/opt/robodynamics/session_materials", rel))
        elif f.startswith("/"):
            candidates.append(f)
        else:
            candidates.append(os.path.join(course_root, f))

    for c in candidates:
        if os.path.exists(c):
            return c
        if not c.lower().endswith(".pdf") and os.path.exists(c + ".pdf"):
            return c + ".pdf"

    # broad search
    if os.path.isdir(course_root):
        hint = (sample_pdf or "").lower().replace(".pdf", "")
        for root, _, files in os.walk(course_root):
            for fn in files:
                if not fn.lower().endswith(".pdf"):
                    continue
                fp = os.path.join(root, fn)
                if hint and hint in fn.lower():
                    return fp
        for root, _, files in os.walk(course_root):
            for fn in files:
                if fn.lower().endswith(".pdf"):
                    return os.path.join(root, fn)
    return ""


def extract_text(pdf_path):
    if not pdf_path or not os.path.exists(pdf_path):
        return ""
    cmd = ["pdftotext", "-f", "1", "-l", "12", "-layout", pdf_path, "-"]
    proc = subprocess.run(cmd, capture_output=True)
    if proc.returncode != 0:
        return ""
    txt = proc.stdout.decode("utf-8", errors="ignore")
    txt = re.sub(r"\s+\n", "\n", txt)
    txt = re.sub(r"[ \t]+", " ", txt)
    return txt[:12000]


def chapter_has_questions(session_id):
    out = mysql_query(f"SELECT COUNT(*) FROM rd_quiz_questions WHERE course_session_id={session_id};")
    return int(out[0]) if out else 0


def get_existing_type_counts(session_id):
    sql = (
        "SELECT "
        "SUM(CASE WHEN LOWER(COALESCE(question_type,''))='multiple_choice' THEN 1 ELSE 0 END),"
        "SUM(CASE WHEN LOWER(COALESCE(question_type,''))='short_answer' THEN 1 ELSE 0 END),"
        "SUM(CASE WHEN LOWER(COALESCE(question_type,''))='long_answer' THEN 1 ELSE 0 END),"
        "SUM(CASE WHEN LOWER(COALESCE(question_type,''))='fill_in_blank' THEN 1 ELSE 0 END),"
        "COUNT(*) "
        f"FROM rd_quiz_questions WHERE course_session_id={session_id};"
    )
    out = mysql_query(sql)
    if not out:
        return {"multiple_choice": 0, "short_answer": 0, "long_answer": 0, "fill_in_blank": 0, "total": 0}
    p = out[0].split("\t")
    vals = [0, 0, 0, 0, 0]
    for i in range(min(len(p), 5)):
        try:
            vals[i] = int(p[i]) if p[i] else 0
        except Exception:
            vals[i] = 0
    return {
        "multiple_choice": vals[0],
        "short_answer": vals[1],
        "long_answer": vals[2],
        "fill_in_blank": vals[3],
        "total": vals[4],
    }


def build_prompt(ch, subject, qtype, count, text_seed, image_required):
    targets = {
        "multiple_choice": "Provide 4 options exactly, with exactly one correct.",
        "short_answer": "Answer length 2-5 lines.",
        "long_answer": "Answer length 6-14 lines with steps/reasoning.",
        "fill_in_blank": "Single blank style questions with precise answer."
    }
    img_rule = (
        "Use question_image for visual questions (diagram/graph/figure) in about 25% of generated questions."
        if image_required
        else "Use question_image only when strictly useful."
    )
    return f"""
Generate {count} high-quality {subject} exam questions for school board exams.

Course: {ch['course_name']} (course_id={ch['course_id']})
Chapter: {ch['session_title']} (course_session_id={ch['course_session_id']})
Question type to generate now: {qtype}

Rules:
- Strictly stay within this chapter.
- No duplicates or near-duplicates.
- {targets[qtype]}
- Provide non-empty correct_answer and concise explanation.
- Difficulty distribution: Easy 30%, Medium 45%, Hard 20%, Expert 5% (approx).
- {img_rule}
- Keep wording classroom-friendly and exam-ready.

Use this textbook extracted context as grounding (may be partial):
\"\"\"{text_seed}\"\"\"

Return STRICT JSON only (no markdown, no prose):
{{
  "questions": [
    {{
      "question_text": "string",
      "question_type": "{qtype}",
      "difficulty_level": "Easy|Medium|Hard|Expert|Master",
      "max_marks": 1,
      "correct_answer": "string",
      "explanation": "string",
      "question_image": "",
      "additional_info": "AI generated from textbook context",
      "options": [
        {{"option_text":"string","is_correct":false,"option_image":""}},
        {{"option_text":"string","is_correct":true,"option_image":""}},
        {{"option_text":"string","is_correct":false,"option_image":""}},
        {{"option_text":"string","is_correct":false,"option_image":""}}
      ]
    }}
  ]
}}
"""


def sanitize_question(q, expected_type):
    qtext = (q.get("question_text") or "").strip()
    if len(qtext) < 10:
        return None
    qtype = normalize_type(q.get("question_type") or expected_type)
    if qtype != expected_type:
        qtype = expected_type
    diff = normalize_diff(q.get("difficulty_level"))
    marks = q.get("max_marks")
    try:
        marks = int(marks)
    except Exception:
        marks = default_marks(qtype)
    if marks <= 0:
        marks = default_marks(qtype)
    canswer = (q.get("correct_answer") or "").strip()
    expl = (q.get("explanation") or "").strip()
    qimg = (q.get("question_image") or "").strip()
    addi = (q.get("additional_info") or "AI generated from textbook context").strip()
    if qtype != "multiple_choice" and not canswer:
        return None
    options = []
    if qtype == "multiple_choice":
        raw_opts = q.get("options") if isinstance(q.get("options"), list) else []
        seen = set()
        for o in raw_opts:
            ot = (o.get("option_text") or "").strip()
            if not ot:
                continue
            key = norm_text(ot)
            if key in seen:
                continue
            seen.add(key)
            options.append({
                "option_text": ot,
                "is_correct": bool(o.get("is_correct")),
                "option_image": (o.get("option_image") or "").strip()
            })
        # Fallback format: option_a/option_b/option_c/option_d + correct_option
        if len(options) < 4:
            letter_opts = []
            for letter in ("a", "b", "c", "d", "e"):
                v = (q.get(f"option_{letter}") or q.get(f"option{letter.upper()}") or "").strip()
                if v:
                    letter_opts.append((letter.upper(), v))
            if len(letter_opts) >= 4:
                corr = (q.get("correct_option") or q.get("answer_option") or "").strip().upper()
                for k, v in letter_opts[:4]:
                    options.append({
                        "option_text": v,
                        "is_correct": (k == corr),
                        "option_image": "",
                    })
        # Fallback format: choices[] + correct_option index/letter
        if len(options) < 4 and isinstance(q.get("choices"), list):
            corr = (q.get("correct_option") or q.get("answer_option") or "").strip().upper()
            choices = [str(x).strip() for x in q.get("choices") if str(x).strip()]
            if len(choices) >= 4:
                for i, v in enumerate(choices[:4], start=1):
                    mark = False
                    if corr == str(i):
                        mark = True
                    if corr in ("A", "B", "C", "D") and (ord(corr) - ord("A") + 1) == i:
                        mark = True
                    options.append({
                        "option_text": v,
                        "is_correct": mark,
                        "option_image": "",
                    })
        if len(options) < 4:
            return None
        options = options[:4]
        correct_count = sum(1 for o in options if o["is_correct"])
        if correct_count != 1:
            # normalize to one correct
            options[0]["is_correct"] = True
            for i in range(1, len(options)):
                options[i]["is_correct"] = False
        if not canswer:
            for o in options:
                if o["is_correct"]:
                    canswer = o["option_text"]
                    break
        if not canswer:
            return None
    return {
        "question_text": qtext,
        "question_type": qtype,
        "difficulty_level": diff,
        "max_marks": marks,
        "correct_answer": canswer,
        "explanation": expl,
        "question_image": qimg,
        "additional_info": addi,
        "options": options,
    }


def generate_for_chapter(ch, existing_counts):
    subject = get_subject_bucket(ch["course_name"])
    targets = get_targets(subject)
    image_required = subject in ("SCIENCE", "PHYSICS", "CHEMISTRY")
    if subject == "MATH":
        t = ch["session_title"].lower()
        if re.search(r"geometry|shape|symmetry|graph|chart|data|mensuration|construction|coordinate|triangle|circle|polygon|perimeter|area|volume|3-dimensional|nets", t):
            image_required = True
    pdf_path = resolve_pdf(ch["course_id"], ch["course_session_id"], ch["sample_pdf"])
    text_seed = extract_text(pdf_path) if pdf_path else ""
    if not text_seed:
        text_seed = f"Chapter title context: {ch['session_title']}"

    all_q = []
    seen = set()
    type_plan = [
        ("multiple_choice", max(0, targets["mcq"] - existing_counts.get("multiple_choice", 0))),
        ("short_answer", max(0, targets["short_answer"] - existing_counts.get("short_answer", 0))),
        ("long_answer", max(0, targets["long_answer"] - existing_counts.get("long_answer", 0))),
        ("fill_in_blank", max(0, targets["fill_in_blank"] - existing_counts.get("fill_in_blank", 0))),
    ]
    for qtype, cnt in type_plan:
        needed = cnt
        attempts = 0
        while needed > 0 and attempts < 3:
            prompt = build_prompt(ch, subject, qtype, needed, text_seed, image_required)
            raw = call_openai(prompt, max_tokens=2300)
            time.sleep(SLEEP_BETWEEN_CALLS)
            arr = parse_questions_blob(raw)
            batch = []
            for q in arr:
                sq = sanitize_question(q, qtype)
                if not sq:
                    continue
                nk = norm_text(sq["question_text"])
                if nk in seen:
                    continue
                seen.add(nk)
                batch.append(sq)
            if not batch:
                attempts += 1
                continue
            all_q.extend(batch[:needed])
            needed = cnt - sum(1 for x in all_q if x["question_type"] == qtype)
            attempts += 1
        if needed > 0:
            log(f"WARN chapter={ch['course_session_id']} type={qtype} short_by={needed}")

    # Final trim to remaining target
    remaining_total = max(0, targets["total"] - existing_counts.get("total", 0))
    if len(all_q) > remaining_total:
        all_q = all_q[:remaining_total]
    return all_q, subject, pdf_path


def insert_questions(ch, questions, subject):
    inserted = 0
    skipped_dup = 0
    options_inserted = 0
    for q in questions:
        nk = norm_text(q["question_text"])
        dup_sql = (
            f"SELECT question_id FROM rd_quiz_questions "
            f"WHERE course_session_id={ch['course_session_id']} "
            f"AND LOWER(TRIM(question_text))='{esc(nk)}' LIMIT 1;"
        )
        dup = mysql_query(dup_sql)
        if dup:
            skipped_dup += 1
            continue

        qimg = q["question_image"]
        if qimg and not qimg.startswith("/session_materials/"):
            qimg = ""
        insert_sql = (
            "INSERT INTO rd_quiz_questions "
            "(question_text,question_type,course_session_id,correct_answer,difficulty_level,max_marks,additional_info,points,"
            "explanation,syllabus_tag,question_image,exam_type,is_active,tier_level,tier_order,exam_year,is_pyq) "
            f"VALUES ('{esc(q['question_text'])}','{esc(q['question_type'])}',{ch['course_session_id']},"
            f"'{esc(q['correct_answer'])}','{esc(q['difficulty_level'])}',{int(q['max_marks'])},"
            f"'{esc(q['additional_info'])}','{int(max(1,q['max_marks']))}','{esc(q['explanation'])}',"
            f"'AI_QBANK_{esc(subject)}_20260301','{esc(qimg)}','FINAL_EXAM',1,'BEGINNER',1,2026,0);"
            "SELECT LAST_INSERT_ID();"
        )
        out = mysql_query(insert_sql)
        if not out:
            continue
        qid = int(out[-1].split("\t")[0])
        inserted += 1
        if q["question_type"] == "multiple_choice":
            for opt in q["options"]:
                osql = (
                    "INSERT INTO rd_quiz_options (question_id,option_text,is_correct,selected,option_image) "
                    f"VALUES ({qid},'{esc(opt['option_text'])}',{1 if opt['is_correct'] else 0},0,'{esc(opt['option_image'])}');"
                )
                mysql_exec(osql)
                options_inserted += 1
    return inserted, skipped_dup, options_inserted


def write_status(row):
    with open(STATUS_JSONL, "a", encoding="utf-8") as fh:
        fh.write(json.dumps(row, ensure_ascii=False) + "\n")


def main():
    chapters = get_gap_chapters()
    if MAX_CHAPTERS > 0:
        chapters = chapters[:MAX_CHAPTERS]
    log(f"Run dir: {RUN_DIR}")
    log(f"Filters: SUBJECT_FILTER={SUBJECT_FILTER or 'ALL'} COURSE_FILTER={sorted(COURSE_FILTER) if COURSE_FILTER else 'ALL'}")
    log(f"Chapters to process: {len(chapters)}")

    with open(STATUS_CSV, "w", encoding="utf-8") as fh:
        fh.write("course_id,course_name,course_session_id,session_title,subject,generated,inserted,skipped_duplicates,options_inserted,pdf_path,status,error\n")

    processed = 0
    for ch in chapters:
        started = time.time()
        try:
            existing = get_existing_type_counts(ch["course_session_id"])
            questions, subject, pdf_path = generate_for_chapter(ch, existing)
            inserted, skipped_dup, options_inserted = insert_questions(ch, questions, subject)
            elapsed = round(time.time() - started, 2)
            status = "OK" if inserted > 0 else "NO_INSERT"
            row = {
                "course_id": ch["course_id"],
                "course_name": ch["course_name"],
                "course_session_id": ch["course_session_id"],
                "session_title": ch["session_title"],
                "subject": subject,
                "existing_total": existing.get("total", 0),
                "existing_mcq": existing.get("multiple_choice", 0),
                "generated": len(questions),
                "inserted": inserted,
                "skipped_duplicates": skipped_dup,
                "options_inserted": options_inserted,
                "pdf_path": pdf_path,
                "status": status,
                "elapsed_sec": elapsed,
            }
            write_status(row)
            with open(STATUS_CSV, "a", encoding="utf-8") as fh:
                fh.write(
                    f"{ch['course_id']},\"{ch['course_name'].replace('\"','\"\"')}\",{ch['course_session_id']},"
                    f"\"{ch['session_title'].replace('\"','\"\"')}\",{subject},{len(questions)},{inserted},{skipped_dup},{options_inserted},"
                    f"\"{pdf_path}\",{status},\n"
                )
            processed += 1
            log(f"DONE session={ch['course_session_id']} inserted={inserted} generated={len(questions)} elapsed={elapsed}s")
        except Exception as ex:
            err = str(ex).replace("\n", " ").replace("\r", " ")
            tb = traceback.format_exc(limit=2)
            row = {
                "course_id": ch["course_id"],
                "course_name": ch["course_name"],
                "course_session_id": ch["course_session_id"],
                "session_title": ch["session_title"],
                "status": "ERROR",
                "error": err,
                "trace": tb,
            }
            write_status(row)
            with open(STATUS_CSV, "a", encoding="utf-8") as fh:
                fh.write(
                    f"{ch['course_id']},\"{ch['course_name'].replace('\"','\"\"')}\",{ch['course_session_id']},"
                    f"\"{ch['session_title'].replace('\"','\"\"')}\",,,0,0,0,,ERROR,\"{err.replace('\"','\"\"')}\"\n"
                )
            log(f"ERROR session={ch['course_session_id']} err={err}")
            time.sleep(1.5)

    log(f"Completed run. Processed chapters={processed}. Status file={STATUS_CSV}")


if __name__ == "__main__":
    main()
PY

chmod +x /tmp/qbank_ai_autorun.py

# Run unattended in background.
nohup python3 /tmp/qbank_ai_autorun.py > /tmp/qbank_ai_autorun.log 2>&1 &
echo "QBANK_AI_AUTORUN_STARTED PID=$!"
echo "LOG=/tmp/qbank_ai_autorun.log"
