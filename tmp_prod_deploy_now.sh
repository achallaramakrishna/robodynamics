set -e
URL="http://127.0.0.1:8080/aptipath/student/result?sessionId=17&asPdf=1"
curl -s -o /tmp/apti17.pdf -w "%{http_code} %{content_type} %{size_download}\n" "$URL"
file -b /tmp/apti17.pdf || true
head -c 8 /tmp/apti17.pdf | xxd -p