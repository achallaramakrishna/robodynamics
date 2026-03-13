#!/bin/bash
set -e

echo "CHECK launch"
curl -ks -o /tmp/rd_launch_body.txt -D /tmp/rd_launch_headers.txt "https://robodynamics.in/ai-tutor/launch?module=VEDIC_MATH" || true
grep -E "^HTTP/|^Location:" /tmp/rd_launch_headers.txt | head -n 10 || true
echo "---"

echo "CHECK tutor page"
code=$(curl -ks -o /tmp/rd_vedic_body.txt -w "%{http_code}" "https://robodynamics.in/ai-tutor/vedic")
echo "VEDIC_HTTP=$code"
head -c 180 /tmp/rd_vedic_body.txt; echo
echo "---"

echo "CHECK next api proxy"
code=$(curl -ks -o /tmp/rd_vedic_api_body.txt -w "%{http_code}" \
  -H "Content-Type: application/json" \
  --data '{"token":"bad"}' \
  "https://robodynamics.in/api/vedic/start")
echo "API_HTTP=$code"
head -c 220 /tmp/rd_vedic_api_body.txt; echo
echo "---"

echo "CHECK java ai tutor summary auth response"
code=$(curl -ks -o /tmp/rd_java_summary_body.txt -w "%{http_code}" \
  "https://robodynamics.in/api/ai-tutor/session/summary")
echo "JAVA_SUMMARY_HTTP=$code"
head -c 180 /tmp/rd_java_summary_body.txt; echo
echo "---"
