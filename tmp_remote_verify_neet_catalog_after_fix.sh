#!/bin/bash
set -euo pipefail
KEY=$(grep -E '^TUTOR_INTERNAL_KEY=' /opt/robodynamics/ai-tutor/tutor-api/.env | head -n1 | cut -d= -f2-)
if [ -z "$KEY" ]; then KEY=change_me_ai_tutor_internal_key; fi

echo "ENV_MAPS"
grep -nE '^AI_TUTOR_TEMPLATE_API_URL=|^AI_TUTOR_NEET_|^AI_TUTOR_TEMPLATE_COURSE_IDS=' /opt/robodynamics/ai-tutor/tutor-api/.env || true

for cid in neet_physics neet_chemistry neet_biology; do
  echo "=== catalog $cid ==="
  curl -s -H "X-AI-TUTOR-KEY: $KEY" "http://127.0.0.1:8091/ai-tutor-api/vedic/catalog?courseId=$cid" > "/tmp/rd_${cid}_catalog_verify.json"
  python3 - <<'PY' "/tmp/rd_${cid}_catalog_verify.json"
import json,sys
p=sys.argv[1]
d=json.load(open(p,'r',encoding='utf-8'))
chs=d.get('chapters') or []
print('resolved=',d.get('courseId'),'chapters=',len(chs))
if chs:
    c=chs[0]
    print('first=',c.get('chapterCode'),'|',c.get('title'))
    print('groups=',len(c.get('exerciseGroups') or []),'flow=',len(c.get('exerciseFlow') or []))
PY
  echo

done