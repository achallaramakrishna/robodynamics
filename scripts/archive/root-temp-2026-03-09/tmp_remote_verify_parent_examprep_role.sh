set -e
BASE="http://127.0.0.1:8080"
COOKIE="/tmp/rd_parent_ui_cookie.txt"
rm -f "$COOKIE" /tmp/rd_parent_create_page.html /tmp/rd_parent_prepare_resp.txt

curl -s -c "$COOKIE" -b "$COOKIE" -o /tmp/rd_parent_login_body.txt -w "LOGIN_HTTP=%{http_code}\n" \
  -d "userName=anirudh&password=anirudh" "$BASE/login"

curl -s -b "$COOKIE" "$BASE/exam-prep/create" > /tmp/rd_parent_create_page.html

echo -n "HAS_EXTRACT_BTN="; grep -q "id=\"extractExercisesBtn\"" /tmp/rd_parent_create_page.html && echo YES || echo NO
echo -n "HAS_PREPARE_BTN="; grep -q "id=\"prepareBankBtn\"" /tmp/rd_parent_create_page.html && echo YES || echo NO
echo -n "HAS_UPLOAD_BTN="; grep -q "id=\"uploadQbankBtn\"" /tmp/rd_parent_create_page.html && echo YES || echo NO
echo -n "HAS_CREATE_BTN="; grep -q "id=\"createBtn\"" /tmp/rd_parent_create_page.html && echo YES || echo NO

curl -s -b "$COOKIE" -H "Content-Type: application/json" -o /tmp/rd_parent_prepare_resp.txt -w "PARENT_PREPARE_HTTP=%{http_code}\n" \
  -X POST "$BASE/exam-prep/api/prepare-bank" --data '{"courseId":34,"sessionIds":[423],"totalMarks":10}'
head -c 240 /tmp/rd_parent_prepare_resp.txt; echo
