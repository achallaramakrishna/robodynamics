#!/bin/bash
set -euo pipefail
BASE="http://127.0.0.1:8080"
COOKIE="/tmp/rd_to_1000_focus_cookie.txt"
RESP="/tmp/rd_to_1000_focus_resp.json"
SESSIONS=(426 427 429 430 431 432 433 434 436)

total_questions() {
  mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
  SELECT COUNT(*)
  FROM rd_quiz_questions q
  JOIN rd_course_sessions cs ON cs.course_session_id=q.course_session_id
  WHERE cs.course_id=34
    AND LOWER(TRIM(cs.session_type))='session'
    AND cs.session_title LIKE 'Lesson %';"
}

session_count() {
  local sid="$1"
  mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT COUNT(*) FROM rd_quiz_questions WHERE course_session_id=${sid};"
}

echo "STEP=LOGIN"
rm -f "$COOKIE" "$RESP"
curl -s -c "$COOKIE" -b "$COOKIE" -o /tmp/rd_to_1000_focus_login.txt -w "LOGIN_HTTP=%{http_code}\n" \
  -d "userName=anirudh&password=anirudh" "$BASE/login"

for round in 1 2 3 4; do
  cur_total=$(total_questions)
  echo "ROUND=${round} TOTAL=${cur_total}"
  if [ "$cur_total" -ge 1000 ]; then
    echo "TARGET_REACHED=${cur_total}"
    break
  fi

  for sid in "${SESSIONS[@]}"; do
    before=$(session_count "$sid")
    if [ "$before" -ge 95 ]; then
      echo "  SID=${sid} SKIP_BEFORE=${before}"
      continue
    fi

    cat > /tmp/rd_to_1000_focus_payload.json <<JSON
{
  "courseId": 34,
  "sessionIds": [${sid}],
  "questionTypes": ["multiple_choice", "short_answer", "long_answer", "fill_in_blank"],
  "difficultyLevels": ["Medium", "Hard", "Expert"],
  "examType": "FINAL_EXAM",
  "totalMarks": 80,
  "aiTargetMarks": 80,
  "allowAiAugmentation": true,
  "titlePrefix": "Exam Quality Boost",
  "subject": "New Enjoying Mathematics",
  "board": "CBSE",
  "examYear": 2026
}
JSON

    http_code=$(curl -s -b "$COOKIE" -H "Content-Type: application/json" -o "$RESP" -w "%{http_code}" \
      -X POST "$BASE/exam-prep/api/prepare-bank" --data @/tmp/rd_to_1000_focus_payload.json)
    gen=$(grep -o '"generatedCount":[0-9]*' "$RESP" | head -1 | cut -d: -f2 || true)
    [ -z "$gen" ] && gen=0
    after=$(session_count "$sid")
    echo "  SID=${sid} HTTP=${http_code} GENERATED=${gen} BEFORE=${before} AFTER=${after}"

    cur_total=$(total_questions)
    if [ "$cur_total" -ge 1000 ]; then
      echo "TARGET_REACHED=${cur_total}"
      break 2
    fi
  done
done

echo "STEP=FINAL_TOTAL"
total_questions