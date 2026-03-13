set -e
for u in \
  http://127.0.0.1:8080/ \
  http://127.0.0.1:8080/login \
  http://127.0.0.1:8080/exam-prep/create \
  http://127.0.0.1:8080/aptipath/student/home; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$u")
  echo "$u HTTP=$code"
done