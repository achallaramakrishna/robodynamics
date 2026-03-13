#!/bin/bash
set -euo pipefail
BASE="http://127.0.0.1:8080"
COOKIE="/tmp/rd_g5_create_cookie.txt"
PAYLOAD="/tmp/rd_g5_create_payload.json"
RESP="/tmp/rd_g5_create_resp.json"

rm -f "$COOKIE" "$PAYLOAD" "$RESP"

curl -s -c "$COOKIE" -b "$COOKIE" -o /tmp/rd_g5_create_login.txt -w "LOGIN_HTTP=%{http_code}\n" \
  -d "userName=anirudh&password=anirudh" "$BASE/login"

cat > "$PAYLOAD" <<'JSON'
{
  "courseId": 34,
  "sessionIds": [1085],
  "questionTypes": ["multiple_choice", "short_answer", "fill_in_blank"],
  "difficultyLevels": ["Easy", "Medium", "Hard"],
  "examType": "FINAL_EXAM",
  "totalMarks": 20,
  "durationMinutes": 60,
  "numberOfPapers": 2,
  "allowAiAugmentation": false,
  "titlePrefix": "CBSE G5 Visual 20260304",
  "subject": "New Enjoying Mathematics",
  "board": "CBSE",
  "examYear": 2026
}
JSON

curl -s -b "$COOKIE" -H "Content-Type: application/json" -o "$RESP" -w "CREATE_HTTP=%{http_code}\n" \
  -X POST "$BASE/exam-prep/api/create-exam" --data @"$PAYLOAD"

echo "CREATE_RESPONSE_BEGIN"
cat "$RESP"
echo
echo "CREATE_RESPONSE_END"
