#!/bin/bash
set -euo pipefail
ENV_FILE=/opt/robodynamics/ai-tutor/tutor-api/.env
cp -a "$ENV_FILE" "${ENV_FILE}.bak_$(date +%Y%m%d_%H%M%S)"

upsert() {
  key="$1"
  value="$2"
  if grep -q "^${key}=" "$ENV_FILE"; then
    sed -i "s#^${key}=.*#${key}=${value}#" "$ENV_FILE"
  else
    echo "${key}=${value}" >> "$ENV_FILE"
  fi
}

upsert AI_TUTOR_TEMPLATE_API_URL "http://127.0.0.1:8080/robodynamics/api/ai-tutor/course-template"
upsert AI_TUTOR_NEET_PHYSICS_DB_COURSE_ID "138"
upsert AI_TUTOR_NEET_CHEMISTRY_DB_COURSE_ID "131"
upsert AI_TUTOR_NEET_BIOLOGY_DB_COURSE_ID "132"
upsert AI_TUTOR_TEMPLATE_COURSE_IDS "neet_physics:138,neet_chemistry:131,neet_biology:132"

systemctl restart rd-ai-tutor-api
sleep 2

echo "API=$(systemctl is-active rd-ai-tutor-api || true)"
KEY=$(grep -E '^TUTOR_INTERNAL_KEY=' "$ENV_FILE" | head -n1 | cut -d= -f2-)
if [ -z "$KEY" ]; then KEY=change_me_ai_tutor_internal_key; fi

for cid in neet_physics neet_chemistry neet_biology; do
  echo "=== catalog $cid ==="
  curl -s -H "X-AI-TUTOR-KEY: $KEY" "http://127.0.0.1:8091/ai-tutor-api/vedic/catalog?courseId=$cid" > "/tmp/rd_${cid}_catalog_after.json"
  python3 - <<'PY' "/tmp/rd_${cid}_catalog_after.json"
import json,sys
p=sys.argv[1]
d=json.load(open(p,'r',encoding='utf-8'))
chs=d.get('chapters') or []
print('resolved=',d.get('courseId'),'chapters=',len(chs))
if chs:
    c=chs[0]
    print('first=',c.get('chapterCode'),'|',c.get('title'))
PY
  echo

done
