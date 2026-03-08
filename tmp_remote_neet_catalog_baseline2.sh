#!/bin/bash
set -u
KEY=$(grep -E '^TUTOR_INTERNAL_KEY=' /opt/robodynamics/ai-tutor/tutor-api/.env | head -n1 | cut -d= -f2-)
if [ -z "${KEY:-}" ]; then KEY=change_me_ai_tutor_internal_key; fi

echo "KEY_LEN=${#KEY}"
for cid in neet_physics neet_chemistry neet_biology; do
  echo "=== API catalog courseId=$cid ==="
  code=$(curl -s -o "/tmp/rd_${cid}_catalog_before.json" -w "%{http_code}" -H "X-AI-TUTOR-KEY: $KEY" "http://127.0.0.1:8091/ai-tutor-api/vedic/catalog?courseId=$cid")
  echo "http=$code"
  head -c 220 "/tmp/rd_${cid}_catalog_before.json"; echo
  python3 - <<'PY' "/tmp/rd_${cid}_catalog_before.json"
import json,sys
p=sys.argv[1]
try:
    d=json.load(open(p,'r',encoding='utf-8'))
except Exception as e:
    print('parse_error=',e)
    raise SystemExit(0)
chs=d.get('chapters') or []
print('resolvedCourseId=',d.get('courseId'))
print('chapterCount=',len(chs))
if chs:
    c=chs[0]
    print('firstChapter=',c.get('chapterCode'))
    print('firstTitle=',c.get('title'))
    st=c.get('subtopics') or []
    print('firstSubtopic=', st[0] if st else '')
PY
  echo

done

for dbid in 155 156 157 138 131 132; do
  echo "=== Java template courseId=$dbid ==="
  code=$(curl -s -o "/tmp/rd_tpl_${dbid}.json" -w "%{http_code}" -H "X-AI-TUTOR-KEY: $KEY" "http://127.0.0.1:8085/api/ai-tutor/course-template?courseId=$dbid")
  echo "http=$code"
  head -c 180 "/tmp/rd_tpl_${dbid}.json"; echo
  python3 - <<'PY' "/tmp/rd_tpl_${dbid}.json"
import json,sys
p=sys.argv[1]
try:
    d=json.load(open(p,'r',encoding='utf-8'))
except Exception as e:
    print('parse_error=',e)
    raise SystemExit(0)
chs=d.get('chapters') or []
print('courseName=',d.get('courseName'))
print('chapterCount=',len(chs))
if chs:
    c=chs[0]
    print('firstTitle=',c.get('title'))
PY
  echo

done