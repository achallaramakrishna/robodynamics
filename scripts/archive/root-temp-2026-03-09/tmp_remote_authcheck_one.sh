#!/bin/bash
set -euo pipefail
BASE="http://127.0.0.1:8080"
COOKIE="/tmp/rd_authcheck_cookie.txt"

curl -s -c "$COOKIE" -b "$COOKIE" -o /tmp/rd_authcheck_login.txt -w "LOGIN_HTTP=%{http_code}\n" \
  -d "userName=anirudh&password=anirudh" "$BASE/login"

cat > /tmp/rd_authcheck_payload.json <<JSON
{
  "courseId": 34,
  "sessionIds": [423,424,425,426,427,428,429,430,431,432,433,434,436],
  "questionTypes": ["multiple_choice","short_answer","long_answer","fill_in_blank"],
  "difficultyLevels": ["Easy","Medium","Hard","Expert"],
  "examType": "FINAL_EXAM",
  "totalMarks": 80,
  "durationMinutes": 90,
  "numberOfPapers": 1,
  "allowAiAugmentation": true,
  "titlePrefix": "AuthCheck",
  "subject": "New Enjoying Mathematics",
  "board": "CBSE",
  "examYear": 2026
}
JSON

resp=$(curl -s -b "$COOKIE" -H "Content-Type: application/json" -X POST "$BASE/exam-prep/api/create-exam" --data @/tmp/rd_authcheck_payload.json)
echo "$resp" | head -c 1000; echo
pid=$(echo "$resp" | grep -o '"examPaperId":[0-9]*' | head -1 | cut -d: -f2 || true)
echo "PAPER_ID=${pid}"

if [ -n "$pid" ]; then
  mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
  SELECT COUNT(*) AS non_math_hits
  FROM rd_exam_sections es
  JOIN rd_exam_section_questions esq ON esq.section_id=es.section_id
  JOIN rd_quiz_questions q ON q.question_id=esq.question_id
  WHERE es.exam_paper_id=${pid}
    AND (
      LOWER(q.question_text) LIKE '%photosynthesis%'
      OR LOWER(q.question_text) LIKE '%chlorophyll%'
      OR LOWER(q.question_text) LIKE '%ecosystem%'
      OR LOWER(q.question_text) LIKE '%food chain%'
      OR LOWER(q.question_text) LIKE '%atom%'
      OR LOWER(q.question_text) LIKE '%molecule%'
      OR LOWER(q.question_text) LIKE '%biology%'
      OR LOWER(q.question_text) LIKE '%cell membrane%'
      OR LOWER(q.question_text) LIKE '%cell wall%'
      OR LOWER(q.question_text) LIKE '%osmosis%'
      OR LOWER(q.question_text) LIKE '%genetic%'
      OR LOWER(q.question_text) LIKE '%dna%'
      OR LOWER(q.question_text) LIKE '%renewable energy%'
      OR LOWER(q.question_text) LIKE '%capital of france%'
      OR LOWER(q.question_text) LIKE '%unit of life%'
    );

  SELECT esq.question_id, LEFT(q.question_text, 140)
  FROM rd_exam_sections es
  JOIN rd_exam_section_questions esq ON esq.section_id=es.section_id
  JOIN rd_quiz_questions q ON q.question_id=esq.question_id
  WHERE es.exam_paper_id=${pid}
  ORDER BY esq.display_order
  LIMIT 25;"
fi