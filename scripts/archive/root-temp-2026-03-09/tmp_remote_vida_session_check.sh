set -e
for g in GRADE_8 GRADE_9 GRADE_10 COLLEGE; do
  echo "GRADE=$g"
  curl -s -H "Content-Type: application/json" -H "Accept: application/json" \
    -d "{\"studentId\":1,\"gradeBand\":\"$g\"}" \
    http://localhost:8080/vidapath/api/session/start > /tmp/vp_start.json
  head -c 300 /tmp/vp_start.json; echo
  grep -o '"questionId":"[^"]*"' /tmp/vp_start.json | head -n 6
  echo "---"
done
