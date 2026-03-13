set -e
BASE='http://127.0.0.1:8080'
COOKIE='/tmp/rd_fix_cookie.txt'
rm -f "$COOKIE"
PASS=$(mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT password FROM rd_users WHERE user_name='venkata' LIMIT 1;")
LOGIN_HTTP=$(curl -s -c "$COOKIE" -b "$COOKIE" -o /tmp/rd_fix_login_body.txt -w "%{http_code}" -d "userName=venkata&password=${PASS}" "$BASE/login")
echo "LOGIN_HTTP=$LOGIN_HTTP"
RESP_HEADERS=$(mktemp)
curl -s -D "$RESP_HEADERS" -o /tmp/rd_fix_content_body.txt -b "$COOKIE" "$BASE/student/content/4481?enrollmentId=205"
head -n 20 "$RESP_HEADERS"
echo '--- BODY_HEAD ---'
head -c 200 /tmp/rd_fix_content_body.txt; echo
