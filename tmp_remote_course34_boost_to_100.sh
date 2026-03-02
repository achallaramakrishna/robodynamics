#!/bin/bash
set -euo pipefail
BASE="http://127.0.0.1:8080"
COOKIE="/tmp/rd_bulk_qbank_cookie.txt"
LOGIN_BODY="/tmp/rd_bulk_qbank_login.txt"
RESP="/tmp/rd_bulk_qbank_resp.json"

SESSIONS=(423 424 425 426 427 428 429 430 431 432 433 434 436)

mysql_count() {
  local sid="$1"
  mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT COUNT(*) FROM rd_quiz_questions WHERE course_session_id=${sid};"
}

mysql_title() {
  local sid="$1"
  mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT session_title FROM rd_course_sessions WHERE course_session_id=${sid} LIMIT 1;"
}

echo "STEP=LOGIN"
rm -f "$COOKIE" "$LOGIN_BODY" "$RESP"
curl -s -c "$COOKIE" -b "$COOKIE" -o "$LOGIN_BODY" -w "LOGIN_HTTP=%{http_code}\n" \
  -d "userName=anirudh&password=anirudh" "$BASE/login"

for sid in "${SESSIONS[@]}"; do
  title="$(mysql_title "$sid")"
  before="$(mysql_count "$sid")"
  echo "SESSION=${sid} TITLE=${title} BEFORE=${before}"

  rounds=0
  stagnant=0
  current="$before"
  while [ "$current" -lt 100 ] && [ "$rounds" -lt 12 ]; do
    need=$((100 - current))
    target=$((need * 2))
    if [ "$target" -lt 80 ]; then target=80; fi
    if [ "$target" -gt 220 ]; then target=220; fi

    cat > /tmp/rd_bulk_qbank_payload.json <<JSON
{
  "courseId": 34,
  "sessionIds": [${sid}],
  "questionTypes": ["multiple_choice", "short_answer", "long_answer", "fill_in_blank"],
  "difficultyLevels": ["Easy", "Medium", "Hard"],
  "examType": "FINAL_EXAM",
  "totalMarks": ${target},
  "aiTargetMarks": ${target},
  "allowAiAugmentation": true,
  "titlePrefix": "Chapter Booster",
  "subject": "New Enjoying Mathematics",
  "board": "CBSE",
  "examYear": 2026
}
JSON

    http_code=$(curl -s -b "$COOKIE" -H "Content-Type: application/json" -o "$RESP" -w "%{http_code}" \
      -X POST "$BASE/exam-prep/api/prepare-bank" --data @/tmp/rd_bulk_qbank_payload.json)

    gen=$(grep -o '"generatedCount":[0-9]*' "$RESP" | head -1 | cut -d: -f2 || true)
    if [ -z "$gen" ]; then gen=0; fi

    new_count="$(mysql_count "$sid")"
    echo "  ROUND=$rounds TARGET_MARKS=$target HTTP=$http_code GENERATED=$gen NOW=$new_count"

    if [ "$new_count" -le "$current" ]; then
      stagnant=$((stagnant + 1))
    else
      stagnant=0
    fi

    current="$new_count"
    rounds=$((rounds + 1))

    if [ "$stagnant" -ge 3 ]; then
      echo "  STOP=STAGNANT sid=${sid}"
      break
    fi
  done

  after="$(mysql_count "$sid")"
  echo "SESSION=${sid} AFTER=${after}"
  echo "----"
done

echo "FINAL_SUMMARY"
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT cs.course_session_id,
       cs.session_title,
       COUNT(qq.question_id) AS total_questions,
       SUM(CASE WHEN qq.question_type='multiple_choice' THEN 1 ELSE 0 END) AS mcq,
       SUM(CASE WHEN qq.question_type='short_answer' THEN 1 ELSE 0 END) AS short_answer,
       SUM(CASE WHEN qq.question_type='long_answer' THEN 1 ELSE 0 END) AS long_answer,
       SUM(CASE WHEN qq.question_type='fill_in_blank' THEN 1 ELSE 0 END) AS fill_in_blank,
       SUM(CASE WHEN qq.correct_answer IS NOT NULL AND TRIM(qq.correct_answer) <> '' THEN 1 ELSE 0 END) AS with_correct_answer,
       SUM(CASE WHEN qq.additional_info IS NOT NULL AND TRIM(qq.additional_info) <> '' THEN 1 ELSE 0 END) AS with_additional_info,
       SUM(CASE WHEN qq.difficulty_level IN ('Easy','Medium','Hard','Expert','Master') THEN 1 ELSE 0 END) AS with_valid_difficulty
FROM rd_course_sessions cs
LEFT JOIN rd_quiz_questions qq
  ON qq.course_session_id = cs.course_session_id
WHERE cs.course_id = 34
  AND LOWER(TRIM(cs.session_type)) = 'session'
  AND cs.session_title LIKE 'Lesson %'
GROUP BY cs.course_session_id, cs.session_title
ORDER BY cs.course_session_id;"
