#!/bin/bash
set -euo pipefail
BASE="http://127.0.0.1:8080"
COOKIE="/tmp/rd_quality_fix_cookie.txt"
RESP="/tmp/rd_quality_fix_resp.json"
SESSIONS=(423 424 425 426 427 428 429 430 431 432 433 434 436)

mysql_one() {
  local q="$1"
  mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; ${q}"
}

metrics() {
  local sid="$1"
  mysql_one "SELECT
    COUNT(*) AS total_q,
    SUM(CASE WHEN difficulty_level IN ('Hard','Expert','Master') THEN 1 ELSE 0 END) AS hard_plus,
    SUM(CASE WHEN correct_answer IS NOT NULL AND TRIM(correct_answer)<>'' THEN 1 ELSE 0 END) AS with_correct,
    SUM(CASE WHEN explanation IS NOT NULL AND TRIM(explanation)<>'' THEN 1 ELSE 0 END) AS with_expl
  FROM rd_quiz_questions WHERE course_session_id=${sid};"
}

mcq_option_quality() {
  local sid="$1"
  mysql_one "SELECT
    SUM(CASE WHEN LOWER(TRIM(q.question_type))='multiple_choice' THEN 1 ELSE 0 END) AS mcq_total,
    SUM(CASE WHEN LOWER(TRIM(q.question_type))='multiple_choice' AND COALESCE(o.opt_cnt,0)>=4 AND COALESCE(o.correct_cnt,0)=1 THEN 1 ELSE 0 END) AS mcq_good
  FROM rd_quiz_questions q
  LEFT JOIN (
    SELECT question_id, COUNT(*) AS opt_cnt, SUM(CASE WHEN is_correct=1 THEN 1 ELSE 0 END) AS correct_cnt
    FROM rd_quiz_options GROUP BY question_id
  ) o ON o.question_id=q.question_id
  WHERE q.course_session_id=${sid};"
}

echo "STEP=LOGIN"
rm -f "$COOKIE" "$RESP"
curl -s -c "$COOKIE" -b "$COOKIE" -o /tmp/rd_quality_fix_login.txt -w "LOGIN_HTTP=%{http_code}\n" \
  -d "userName=anirudh&password=anirudh" "$BASE/login"

echo "STEP=EXTRACT_PDF_EXERCISES"
cat > /tmp/rd_quality_fix_extract_payload.json <<JSON
{
  "courseId": 34,
  "sessionIds": [423,424,425,426,427,428,429,430,431,432,433,434,436],
  "maxPdfs": 120,
  "includeNonExercise": false,
  "dryRun": false
}
JSON
EX_HTTP=$(curl -s -b "$COOKIE" -H "Content-Type: application/json" -o /tmp/rd_quality_fix_extract_resp.json -w "%{http_code}" \
  -X POST "$BASE/exam-prep/api/extract-exercises" --data @/tmp/rd_quality_fix_extract_payload.json)
echo "EXTRACT_HTTP=${EX_HTTP}"
head -c 800 /tmp/rd_quality_fix_extract_resp.json; echo

echo "STEP=SESSION_LOOP"
for sid in "${SESSIONS[@]}"; do
  title=$(mysql_one "SELECT session_title FROM rd_course_sessions WHERE course_session_id=${sid} LIMIT 1;")
  before=$(metrics "$sid")
  before_mcq=$(mcq_option_quality "$sid")
  echo "SESSION=${sid} TITLE=${title} BEFORE_METRICS=${before} BEFORE_MCQ=${before_mcq}"

  rounds=0
  stagnant=0
  prev_total=$(echo "$before" | awk '{print $1}')

  while [ "$rounds" -lt 8 ]; do
    cur=$(metrics "$sid")
    total=$(echo "$cur" | awk '{print $1}')
    hardp=$(echo "$cur" | awk '{print $2}')

    # stop if strong enough for now
    if [ "$total" -ge 100 ] && [ "$hardp" -ge 35 ]; then
      echo "  STOP=TARGET_REACHED total=${total} hard_plus=${hardp}"
      break
    fi

    cat > /tmp/rd_quality_fix_prepare_payload.json <<JSON
{
  "courseId": 34,
  "sessionIds": [${sid}],
  "questionTypes": ["multiple_choice", "short_answer", "long_answer", "fill_in_blank"],
  "difficultyLevels": ["Medium", "Hard", "Expert"],
  "examType": "FINAL_EXAM",
  "totalMarks": 120,
  "aiTargetMarks": 240,
  "allowAiAugmentation": true,
  "titlePrefix": "Exam Quality Booster",
  "subject": "New Enjoying Mathematics",
  "board": "CBSE",
  "examYear": 2026
}
JSON

    http_code=$(curl -s -b "$COOKIE" -H "Content-Type: application/json" -o "$RESP" -w "%{http_code}" \
      -X POST "$BASE/exam-prep/api/prepare-bank" --data @/tmp/rd_quality_fix_prepare_payload.json)
    gen=$(grep -o '"generatedCount":[0-9]*' "$RESP" | head -1 | cut -d: -f2 || true)
    [ -z "$gen" ] && gen=0

    cur2=$(metrics "$sid")
    total2=$(echo "$cur2" | awk '{print $1}')
    hard2=$(echo "$cur2" | awk '{print $2}')
    echo "  ROUND=${rounds} HTTP=${http_code} GENERATED=${gen} NOW_METRICS=${cur2}"

    if [ "$total2" -le "$prev_total" ]; then
      stagnant=$((stagnant + 1))
    else
      stagnant=0
    fi

    if [ "$http_code" -ge 400 ]; then
      echo "  WARN=PREPARE_BANK_FAILED"
      head -c 500 "$RESP"; echo
      stagnant=$((stagnant + 1))
    fi

    prev_total="$total2"
    rounds=$((rounds + 1))

    if [ "$stagnant" -ge 3 ]; then
      echo "  STOP=STAGNANT"
      break
    fi
  done

  after=$(metrics "$sid")
  after_mcq=$(mcq_option_quality "$sid")
  echo "SESSION=${sid} AFTER_METRICS=${after} AFTER_MCQ=${after_mcq}"
  echo "----"
done

echo "STEP=POST_SUMMARY"
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT cs.course_session_id, cs.session_title,
       COUNT(q.question_id) AS total_q,
       SUM(CASE WHEN q.difficulty_level IN ('Hard','Expert','Master') THEN 1 ELSE 0 END) AS hard_plus,
       SUM(CASE WHEN q.correct_answer IS NOT NULL AND TRIM(q.correct_answer)<>'' THEN 1 ELSE 0 END) AS with_correct,
       SUM(CASE WHEN q.explanation IS NOT NULL AND TRIM(q.explanation)<>'' THEN 1 ELSE 0 END) AS with_expl,
       SUM(CASE WHEN LOWER(TRIM(q.question_type))='multiple_choice' THEN 1 ELSE 0 END) AS mcq_q,
       SUM(CASE WHEN LOWER(TRIM(q.question_type))='multiple_choice' AND COALESCE(o.opt_cnt,0)>=4 AND COALESCE(o.correct_cnt,0)=1 THEN 1 ELSE 0 END) AS mcq_good
FROM rd_course_sessions cs
LEFT JOIN rd_quiz_questions q ON q.course_session_id=cs.course_session_id
LEFT JOIN (
  SELECT question_id, COUNT(*) AS opt_cnt, SUM(CASE WHEN is_correct=1 THEN 1 ELSE 0 END) AS correct_cnt
  FROM rd_quiz_options GROUP BY question_id
) o ON o.question_id=q.question_id
WHERE cs.course_id=34 AND LOWER(TRIM(cs.session_type))='session' AND cs.session_title LIKE 'Lesson %'
GROUP BY cs.course_session_id, cs.session_title
ORDER BY cs.course_session_id;"