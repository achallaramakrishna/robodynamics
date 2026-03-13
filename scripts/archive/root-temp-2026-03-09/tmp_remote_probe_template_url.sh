#!/bin/bash
set -euo pipefail
KEY=$(grep -E '^TUTOR_INTERNAL_KEY=' /opt/robodynamics/ai-tutor/tutor-api/.env | head -n1 | cut -d= -f2-)
if [ -z "$KEY" ]; then KEY=change_me_ai_tutor_internal_key; fi

for url in \
  "http://127.0.0.1:8080/robodynamics/api/ai-tutor/course-template?courseId=138" \
  "http://127.0.0.1:8080/api/ai-tutor/course-template?courseId=138" \
  "http://127.0.0.1:8085/api/ai-tutor/course-template?courseId=138"; do
  echo "=== $url ==="
  code=$(curl -s -o /tmp/rd_tpl_probe.json -w '%{http_code}' -H "X-AI-TUTOR-KEY: $KEY" "$url" || true)
  echo "http=$code"
  head -c 260 /tmp/rd_tpl_probe.json || true
  echo
  echo
done