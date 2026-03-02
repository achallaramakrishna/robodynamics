set -u
BASE="http://127.0.0.1:8080"
COOKIE="/tmp/rd_examprep_cookie_bulk.txt"
LOGIN_BODY="/tmp/rd_examprep_login_body.txt"

rm -f "$COOKIE" "$LOGIN_BODY"

login_http=$(curl -s -c "$COOKIE" -b "$COOKIE" -o "$LOGIN_BODY" -w "%{http_code}" \
  -d "userName=anirudh&password=anirudh" "$BASE/login")

echo "LOGIN_HTTP=$login_http"

courses=$(mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT DISTINCT c.course_id
FROM rd_courses c
WHERE c.is_active=1
  AND LOWER(COALESCE(c.course_name,'')) REGEXP '(cbse|icse)'
  AND LOWER(COALESCE(c.course_name,'')) REGEXP '(grade|class)'
ORDER BY c.course_id;")

for cid in $courses; do
  dir="/opt/robodynamics/session_materials/$cid"
  if [ ! -d "$dir" ]; then
    echo "COURSE=$cid STATUS=SKIP REASON=DIR_MISSING"
    continue
  fi

  pdfs=$(find "$dir" -type f \( -iname '*.pdf' -o -iname '*.PDF' \) | wc -l)
  if [ "$pdfs" -le 0 ]; then
    echo "COURSE=$cid STATUS=SKIP REASON=NO_PDFS"
    continue
  fi

  sess_csv=$(mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT GROUP_CONCAT(course_session_id ORDER BY course_session_id SEPARATOR ',')
FROM rd_course_sessions
WHERE course_id=$cid AND LOWER(COALESCE(session_type,''))='session';")

  if [ -z "$sess_csv" ] || [ "$sess_csv" = "NULL" ]; then
    echo "COURSE=$cid STATUS=SKIP REASON=NO_SESSIONS"
    continue
  fi

  sess_json=$(echo "$sess_csv" | sed 's/,/, /g')
  payload="/tmp/rd_extract_${cid}_payload.json"
  resp="/tmp/rd_extract_${cid}_resp.json"

  cat > "$payload" <<JSON
{
  "courseId": $cid,
  "sessionIds": [$sess_json],
  "maxPdfs": 500,
  "includeNonExercise": true,
  "dryRun": false
}
JSON

  http=$(curl -s -b "$COOKIE" -H "Content-Type: application/json" -o "$resp" -w "%{http_code}" \
    -X POST "$BASE/exam-prep/api/extract-exercises" --data @"$payload")

  if command -v python3 >/dev/null 2>&1; then
    summary=$(python3 - "$resp" <<'PY'
import json,sys
p=sys.argv[1]
try:
    d=json.load(open(p))
    ok=d.get('success')
    r=d.get('result') or {}
    imp=r.get('importResult') or {}
    print(f"ok={ok} scanned={r.get('scannedPdfCount',0)} extracted={r.get('extractedQuestionCount',0)} created={imp.get('createdQuestions',0)} skipped={imp.get('skippedQuestions',0)} failedFiles={len(r.get('failedFiles') or [])}")
except Exception as e:
    print(f"parse_error={e}")
PY
)
  else
    summary=$(head -c 400 "$resp" | tr '\n' ' ')
  fi

  sess_count=$(echo "$sess_csv" | awk -F',' '{print NF}')
  echo "COURSE=$cid STATUS=DONE HTTP=$http PDFS=$pdfs SESSIONS=$sess_count $summary"
done