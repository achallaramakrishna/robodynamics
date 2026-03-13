set -e
for url in \
  "http://127.0.0.1:8080/exam-prep/create" \
  "http://127.0.0.1:8080/exam-prep" \
  "https://robodynamics.in/exam-prep/create" \
  "https://robodynamics.in/exam-prep"; do
  code=$(curl -ks -o /tmp/rd_verify.out -w "%{http_code}" "$url" || true)
  echo "URL=$url HTTP=$code"
  head -c 180 /tmp/rd_verify.out; echo
  echo "---"
done
