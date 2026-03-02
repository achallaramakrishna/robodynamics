#!/bin/bash
set -euo pipefail
BASE="http://127.0.0.1:8080"
COOKIE="/tmp/rd_create10_cookie.txt"

rm -f "$COOKIE" /tmp/rd_create10_payload.json /tmp/rd_create10_resp.json

echo "STEP=LOGIN"
curl -s -c "$COOKIE" -b "$COOKIE" -o /tmp/rd_create10_login.txt -w "LOGIN_HTTP=%{http_code}\n" \
  -d "userName=anirudh&password=anirudh" "$BASE/login"

echo "STEP=CREATE_10"
cat > /tmp/rd_create10_payload.json <<JSON
{
  "courseId": 34,
  "sessionIds": [423,424,425,426,427,428,429,430,431,432,433,434,436],
  "questionTypes": ["multiple_choice","short_answer","long_answer","fill_in_blank"],
  "difficultyLevels": ["Easy","Medium","Hard","Expert"],
  "examType": "FINAL_EXAM",
  "totalMarks": 80,
  "durationMinutes": 90,
  "numberOfPapers": 10,
  "allowAiAugmentation": true,
  "titlePrefix": "Final Exam",
  "subject": "New Enjoying Mathematics",
  "board": "CBSE",
  "examYear": 2026
}
JSON

HTTP=$(curl -s -b "$COOKIE" -H "Content-Type: application/json" -o /tmp/rd_create10_resp.json -w "%{http_code}" \
  -X POST "$BASE/exam-prep/api/create-exam" --data @/tmp/rd_create10_payload.json)

echo "CREATE_HTTP=${HTTP}"
head -c 3000 /tmp/rd_create10_resp.json; echo

echo "STEP=LATEST_GENERATED"
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT ep.exam_paper_id, ep.title, ep.total_marks, ep.created_at
FROM rd_exam_papers ep
JOIN rd_course_session_details d ON d.course_session_detail_id=ep.course_session_detail_id
JOIN rd_course_sessions cs ON cs.course_session_id=d.course_session_id
WHERE cs.course_id=34 AND cs.session_title='Exam Papers - Parent Generated'
ORDER BY ep.exam_paper_id DESC
LIMIT 15;"