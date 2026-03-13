#!/bin/bash
set -e
for u in \
  "http://127.0.0.1:8080/ai-tutor/launch?module=VEDIC_MATH" \
  "http://127.0.0.1:8080/api/ai-tutor/session/summary" \
  "http://127.0.0.1:8080/parent/dashboard"; do
  c=$(curl -ks -o /tmp/rd_ai_verify.out -w "%{http_code}" "$u" || true)
  echo "URL=$u HTTP=$c"
  head -c 160 /tmp/rd_ai_verify.out; echo
  echo "---"
done