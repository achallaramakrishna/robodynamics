set -e
BASE="https://robodynamics.in"
COOKIE="/tmp/rd_prod_krishvi_cookie.txt"
WEB_HTML="/tmp/rd_prod_result17_web.html"
PDF_HTML="/tmp/rd_prod_result17_pdfhtml.html"
rm -f "$COOKIE" "$WEB_HTML" "$PDF_HTML" /tmp/rd_prod_login.txt
curl -k -s -c "$COOKIE" -b "$COOKIE" -o /tmp/rd_prod_login.txt -w "LOGIN_HTTP=%{http_code}\n" -d "userName=krishvi&password=krishvi" "$BASE/login"
curl -k -s -L -b "$COOKIE" -o "$WEB_HTML" -w "WEB_HTTP=%{http_code} CT=%{content_type} SIZE=%{size_download}\n" "$BASE/aptipath/student/result?sessionId=17"
curl -k -s -L -b "$COOKIE" -o "$PDF_HTML" -w "PDFHTML_HTTP=%{http_code} CT=%{content_type} SIZE=%{size_download}\n" "$BASE/aptipath/student/result?sessionId=17&asPdf=1"
echo WEB_MARKERS
grep -n "AptiPath360 Career GPS Report\|Student:\|Score Visual Breakdown\|Assessed Accuracy\|Correct vs Incorrect\|Career Score Composition\|pathwayRadar\|roadmapContainer" "$WEB_HTML" | head -n 40 || true
echo PDFHTML_MARKERS
grep -n "AptiPath360 Career GPS Report\|Student:\|Score Visual Breakdown\|Assessed Accuracy\|Correct vs Incorrect\|Career Score Composition\|pdf-accuracy-wrap\|pdf-radar-grid\|pdf-roadmap-grid" "$PDF_HTML" | head -n 50 || true