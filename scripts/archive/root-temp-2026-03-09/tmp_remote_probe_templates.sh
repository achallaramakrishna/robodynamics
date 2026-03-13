#!/bin/bash
set -euo pipefail
KEY=$(grep -E '^TUTOR_INTERNAL_KEY=' /opt/robodynamics/ai-tutor/tutor-api/.env | head -n1 | cut -d= -f2-)
for cid in 131 132 133 134 135 136 138; do
  echo "==== course-template ${cid} ===="
  curl -s -H "X-AI-TUTOR-KEY: ${KEY}" "http://127.0.0.1:8085/api/ai-tutor/course-template?courseId=${cid}" \
    | python3 -c 'import sys,json; d=json.load(sys.stdin); ch=d.get("chapters") or []; print("courseId=",d.get("courseId"),"name=",d.get("courseName"),"chapters=",len(ch)); print("first=", (ch[0].get("title") if ch else ""))'
done