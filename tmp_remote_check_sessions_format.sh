set -e
BASE="http://127.0.0.1:8080"
COOKIE="/tmp/rd_sessions_cookie_check.txt"
rm -f "$COOKIE" /tmp/rd_sessions_headers.txt /tmp/rd_sessions_body.txt

curl -s -c "$COOKIE" -b "$COOKIE" -o /tmp/rd_login_check.txt -w "LOGIN_HTTP=%{http_code}\n" \
  -d "userName=anirudh&password=anirudh" "$BASE/login"

curl -s -D /tmp/rd_sessions_headers.txt -b "$COOKIE" "$BASE/exam-prep/api/sessions?courseId=34" > /tmp/rd_sessions_body.txt

echo "HEADERS_START"
head -n 30 /tmp/rd_sessions_headers.txt

echo "BODY_START"
head -c 350 /tmp/rd_sessions_body.txt; echo
