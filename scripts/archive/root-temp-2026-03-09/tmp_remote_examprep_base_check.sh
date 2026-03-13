for u in \
  http://127.0.0.1:8080/login \
  http://127.0.0.1:8080/robodynamics/login \
  http://127.0.0.1:8080/exam-prep/create \
  http://127.0.0.1:8080/robodynamics/exam-prep/create; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$u")
  echo "$u $code"
done