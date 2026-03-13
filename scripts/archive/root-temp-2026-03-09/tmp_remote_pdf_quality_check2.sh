set -e
BASE="http://127.0.0.1:8080"
COOKIE="/tmp/rd_pdf_quality_cookie2.txt"
OUT="/tmp/AptiPath_Diagnostic_Report_Session_17_latest.pdf"
TXT="/tmp/AptiPath_Diagnostic_Report_Session_17_latest.txt"
rm -f "$COOKIE" "$OUT" "$TXT" /tmp/rd_pdf_login2.txt
curl -s -c "$COOKIE" -b "$COOKIE" -o /tmp/rd_pdf_login2.txt -w "LOGIN_HTTP=%{http_code}\n" -d "userName=krishvi&password=krishvi" "$BASE/login"
curl -s -L -b "$COOKIE" -o "$OUT" -w "PDF_HTTP=%{http_code} CT=%{content_type} SIZE=%{size_download}\n" "$BASE/aptipath/student/result/pdf?sessionId=17"
echo MAGIC=$(head -c 5 "$OUT" | xxd -p)
if command -v pdfinfo >/dev/null 2>&1; then
  echo PDFINFO=YES
  pdfinfo "$OUT" | sed -n '1,20p'
else
  echo PDFINFO=NO
fi
if command -v pdffonts >/dev/null 2>&1; then
  echo PDFFONTS=YES
  pdffonts "$OUT" | sed -n '1,25p'
else
  echo PDFFONTS=NO
fi
if command -v pdftotext >/dev/null 2>&1; then
  pdftotext "$OUT" "$TXT" || true
  echo TXT_MARKERS
  grep -n "AptiPath360 Career GPS Report\|Score Visual Breakdown\|Assessed Accuracy\|Correct vs Incorrect\|Career Score Composition" "$TXT" | head -n 30 || true
else
  echo PDFTOTEXT=NO
fi