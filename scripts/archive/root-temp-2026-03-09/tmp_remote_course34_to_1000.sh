#!/bin/bash
set -euo pipefail
BASE="http://127.0.0.1:8080"
COOKIE="/tmp/rd_to_1000_cookie.txt"
RESP="/tmp/rd_to_1000_resp.json"
SESSIONS=(423 424 425 426 427 428 429 430 431 432 433 434 436)

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
curl -s -c "$COOKIE" -b "$COOKIE" -o /tmp/rd_to_1000_login.txt -w "LOGIN_HTTP=%{http_code}\n" \
  -d "userName=anirudh&password=anirudh" "$BASE/login"

start_total=$(total_questions)
echo "START_TOTAL=${start_total}"

round=0
while [ "$round" -lt 20 ]; do
  cur_total=$(total_questions)
  echo "ROUND=${round} CURRENT_TOTAL=${cur_total}"
  if [ "$cur_total" -ge 1000 ]; then
    echo "TARGET_REACHED=${cur_total}"
    break
  fi

  for sid in "${SESSIONS[@]}"; do
    before=$(session_count "$sid")
    cat > /tmp/rd_to_1000_payload.json <<JSON
{
  "courseId": 34,
  "sessionIds": [${sid}],
  "questionTypes": ["multiple_choice", "short_answer", "long_answer", "fill_in_blank"],
  "difficultyLevels": ["Medium", "Hard", "Expert"],
  "examType": "FINAL_EXAM",
  "totalMarks": 60,
  "aiTargetMarks": 60,
  "allowAiAugmentation": true,
  "titlePrefix": "Exam Quality Boost",
  "subject": "New Enjoying Mathematics",
  "board": "CBSE",
  "examYear": 2026
}
JSON

    http_code=$(curl -s -b "$COOKIE" -H "Content-Type: application/json" -o "$RESP" -w "%{http_code}" \
      -X POST "$BASE/exam-prep/api/prepare-bank" --data @/tmp/rd_to_1000_payload.json)
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

  round=$((round + 1))
done

echo "STEP=FINAL_COUNTS"
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT cs.course_session_id, cs.session_title,
       COUNT(q.question_id) AS total_q,
       SUM(CASE WHEN q.question_type='multiple_choice' THEN 1 ELSE 0 END) AS mcq_q,
       SUM(CASE WHEN q.question_type='short_answer' THEN 1 ELSE 0 END) AS short_q,
       SUM(CASE WHEN q.question_type='long_answer' THEN 1 ELSE 0 END) AS long_q,
       SUM(CASE WHEN q.question_type='fill_in_blank' THEN 1 ELSE 0 END) AS fib_q,
       SUM(CASE WHEN q.difficulty_level IN ('Hard','Expert','Master') THEN 1 ELSE 0 END) AS hard_plus,
       SUM(CASE WHEN q.correct_answer IS NOT NULL AND TRIM(q.correct_answer)<>'' THEN 1 ELSE 0 END) AS with_correct,
       SUM(CASE WHEN q.explanation IS NOT NULL AND TRIM(q.explanation)<>'' THEN 1 ELSE 0 END) AS with_expl
FROM rd_course_sessions cs
LEFT JOIN rd_quiz_questions q ON q.course_session_id=cs.course_session_id
WHERE cs.course_id=34 AND LOWER(TRIM(cs.session_type))='session' AND cs.session_title LIKE 'Lesson %'
GROUP BY cs.course_session_id, cs.session_title
ORDER BY cs.course_session_id;

SELECT 'TOTAL_LESSON_Q', COUNT(*)
FROM rd_quiz_questions q
JOIN rd_course_sessions cs ON cs.course_session_id=q.course_session_id
WHERE cs.course_id=34 AND LOWER(TRIM(cs.session_type))='session' AND cs.session_title LIKE 'Lesson %';

SELECT 'TOTAL_OPTIONS', COUNT(*)
FROM rd_quiz_options o
JOIN rd_quiz_questions q ON q.question_id=o.question_id
JOIN rd_course_sessions cs ON cs.course_session_id=q.course_session_id
WHERE cs.course_id=34 AND LOWER(TRIM(cs.session_type))='session' AND cs.session_title LIKE 'Lesson %';

SELECT 'MCQ_WITH_GOOD_OPTIONS', COUNT(*)
FROM rd_quiz_questions q
LEFT JOIN (
  SELECT question_id, COUNT(*) AS opt_cnt, SUM(CASE WHEN is_correct=1 THEN 1 ELSE 0 END) AS correct_cnt
  FROM rd_quiz_options GROUP BY question_id
) x ON x.question_id=q.question_id
JOIN rd_course_sessions cs ON cs.course_session_id=q.course_session_id
WHERE cs.course_id=34 AND LOWER(TRIM(cs.session_type))='session' AND cs.session_title LIKE 'Lesson %'
  AND q.question_type='multiple_choice'
  AND COALESCE(x.opt_cnt,0)>=4
  AND COALESCE(x.correct_cnt,0)=1;
"