set -e
BASE="http://127.0.0.1:8080"
COOKIE="/tmp/rd_examprep_cookie.txt"

rm -f "$COOKIE" /tmp/rd_login_body.txt /tmp/rd_sessions_34.json /tmp/rd_extract_payload.json /tmp/rd_extract_resp.json /tmp/rd_create_payload.json /tmp/rd_create_resp.json

echo "STEP=LOGIN"
curl -s -c "$COOKIE" -b "$COOKIE" -o /tmp/rd_login_body.txt -w "LOGIN_HTTP=%{http_code}\n" \
  -d "userName=anirudh&password=anirudh" "$BASE/login"

echo "STEP=SESSIONS"
curl -s -b "$COOKIE" "$BASE/exam-prep/api/sessions?courseId=34" > /tmp/rd_sessions_34.json
head -c 400 /tmp/rd_sessions_34.json; echo

echo "STEP=EXTRACT"
cat > /tmp/rd_extract_payload.json <<'JSON'
{
  "courseId": 34,
  "sessionIds": [424,425,426,427,428,429,430,431,432,433,434,435,436],
  "maxPdfs": 60,
  "includeNonExercise": false,
  "dryRun": false
}
JSON
curl -s -b "$COOKIE" -H "Content-Type: application/json" -o /tmp/rd_extract_resp.json -w "EXTRACT_HTTP=%{http_code}\n" \
  -X POST "$BASE/exam-prep/api/extract-exercises" --data @/tmp/rd_extract_payload.json
head -c 1200 /tmp/rd_extract_resp.json; echo

echo "STEP=CREATE_FINAL_EXAM"
cat > /tmp/rd_create_payload.json <<'JSON'
{
  "courseId": 34,
  "sessionIds": [424,425,426,427,428,429],
  "questionTypes": ["multiple_choice","short_answer","long_answer","fill_in_blank"],
  "difficultyLevels": ["Easy","Medium","Hard"],
  "examType": "FINAL_EXAM",
  "totalMarks": 50,
  "durationMinutes": 90,
  "numberOfPapers": 1,
  "allowAiAugmentation": true,
  "titlePrefix": "CBSE Grade 5 Final",
  "subject": "New Enjoying Mathematics",
  "board": "CBSE",
  "examYear": 2026
}
JSON
curl -s -b "$COOKIE" -H "Content-Type: application/json" -o /tmp/rd_create_resp.json -w "CREATE_HTTP=%{http_code}\n" \
  -X POST "$BASE/exam-prep/api/create-exam" --data @/tmp/rd_create_payload.json
head -c 1200 /tmp/rd_create_resp.json; echo
