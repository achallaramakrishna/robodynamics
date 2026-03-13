#!/bin/bash
set -euo pipefail
KEY=$(grep -E '^TUTOR_INTERNAL_KEY=' /opt/robodynamics/ai-tutor/tutor-api/.env | head -n1 | cut -d= -f2-)
for id in 10 138; do
  echo "=== template json ${id} ==="
  curl -i -s -H "Accept: application/json" -H "X-AI-TUTOR-KEY: ${KEY}" "http://127.0.0.1:8080/api/ai-tutor/course-template?courseId=${id}" | head -n 20
  echo
 done