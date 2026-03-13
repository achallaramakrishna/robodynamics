set -e
BASE="http://127.0.0.1:8080"
COOKIE="/tmp/rd_examprep_cookie2.txt"
rm -f "$COOKIE" /tmp/rd_create_payload_3.json /tmp/rd_create_resp_3.json

curl -s -c "$COOKIE" -b "$COOKIE" -o /tmp/rd_login_body_3.txt -w "LOGIN_HTTP=%{http_code}\n" \
  -d "userName=anirudh&password=anirudh" "$BASE/login"

cat > /tmp/rd_create_payload_3.json <<'JSON'
{
  "courseId": 34,
  "sessionIds": [423,424,425,426,427,428,429],
  "questionTypes": ["multiple_choice","short_answer","long_answer","fill_in_blank"],
  "difficultyLevels": ["Easy","Medium","Hard"],
  "examType": "FINAL_EXAM",
  "totalMarks": 50,
  "durationMinutes": 90,
  "numberOfPapers": 3,
  "allowAiAugmentation": true,
  "titlePrefix": "CBSE Grade 5 Final",
  "subject": "New Enjoying Mathematics",
  "board": "CBSE",
  "examYear": 2026
}
JSON

curl -s -b "$COOKIE" -H "Content-Type: application/json" -o /tmp/rd_create_resp_3.json -w "CREATE_HTTP=%{http_code}\n" \
  -X POST "$BASE/exam-prep/api/create-exam" --data @/tmp/rd_create_payload_3.json
head -c 2000 /tmp/rd_create_resp_3.json; echo
