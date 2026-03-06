set -e
curl -sS "https://robodynamics.in/api/vedic/catalog?courseId=vedic_math" > /tmp/ai_catalog_after.json
python3 - <<'PY'
import json
j=json.load(open('/tmp/ai_catalog_after.json'))
ch=next((c for c in j.get('chapters',[]) if c.get('chapterCode')=='L1_COMPLETING_WHOLE'), {})
print('L1_SUBTOPICS', ch.get('subtopics', []))
flow = ch.get('exerciseFlow', [])
print('L1_FLOW_A', flow[0] if flow else None)
print('L1_FLOW_B', flow[1] if len(flow)>1 else None)
PY