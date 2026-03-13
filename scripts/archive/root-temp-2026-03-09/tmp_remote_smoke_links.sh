#!/bin/sh
set -e
for p in / /exam-prep /tuition-on-demand '/plans/checkout?plan=career-basic'; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:8080$p")
  echo "HTTP:$p:$code"
done
echo '---HOME_LINK_SNIPPET---'
curl -s http://127.0.0.1:8080/ | grep -Eo 'href="[^"]+"' | grep -E 'exam-prep|tuition-on-demand|career-discover|exam-courses|tuition-info|Complete Razorpay Payment|\.jsp' | head -n 80 || true
echo '---CTA_SNIPPET---'
curl -s http://127.0.0.1:8080/ | grep -E 'Start Discovery Test - Parent Registration|Complete Razorpay Payment \(continue existing flow\)|Already registered\? Login and continue' | head -n 20 || true
