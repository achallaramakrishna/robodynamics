#!/bin/bash
set -euo pipefail
KEY=$(grep -E '^TUTOR_INTERNAL_KEY=' /opt/robodynamics/ai-tutor/tutor-api/.env | head -n1 | cut -d= -f2-)
if [ -z "$KEY" ]; then KEY=change_me_ai_tutor_internal_key; fi
for cid in neet_physics neet_chemistry neet_biology; do
  echo "=== API catalog courseId=$cid ==="
  curl -s -H "X-AI-TUTOR-KEY: $KEY" "http://127.0.0.1:8091/ai-tutor-api/vedic/catalog?courseId=$cid" > /tmp/rd_${cid}_catalog_before.json
  python3 - <<'PY' "/tmp/rd_${cid}_catalog_before.json"
import json,sys
p=sys.argv[1]
with open(p,'r',encoding='utf-8') as f:d=json.load(f)
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
  curl -s -H "X-AI-TUTOR-KEY: $KEY" "http://127.0.0.1:8085/api/ai-tutor/course-template?courseId=$dbid" > /tmp/rd_tpl_${dbid}.json
  python3 - <<'PY' "/tmp/rd_tpl_${dbid}.json" "$dbid"
import json,sys
p=sys.argv[1]; dbid=sys.argv[2]
with open(p,'r',encoding='utf-8') as f:d=json.load(f)
chs=d.get('chapters') or []
print('courseName=',d.get('courseName'))
print('chapterCount=',len(chs))
if chs:
    c=chs[0]
    print('firstTitle=',c.get('title'))
PY
  echo

done