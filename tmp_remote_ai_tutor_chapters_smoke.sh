#!/bin/bash
set -euo pipefail

TOKEN=$(python3 - <<'PY'
import jwt, time, uuid
now = int(time.time())
payload = {
  "iss": "robodynamics-java",
  "aud": "robodynamics-ai-tutor",
  "sub": "user:5001",
  "jti": str(uuid.uuid4()),
  "iat": now,
  "exp": now + 600,
  "user_id": 5001,
  "role": "PARENT",
  "child_id": 5002,
  "company_code": "RD",
  "module": "VEDIC_MATH",
  "grade": "6"
}
print(jwt.encode(payload, "change_me_ai_tutor_secret", algorithm="HS256"))
PY
)

echo "START L1"
curl -s -o /tmp/rd_ch_l1.json -w "HTTP_L1=%{http_code}\n" \
  -H "X-AI-TUTOR-KEY: change_me_ai_tutor_internal_key" \
  -H "Content-Type: application/json" \
  --data "{\"token\":\"$TOKEN\",\"chapterCode\":\"L1_COMPLETING_WHOLE\"}" \
  "http://127.0.0.1:8091/ai-tutor-api/vedic/start"
python3 - <<'PY'
import json
with open('/tmp/rd_ch_l1.json','r',encoding='utf-8') as f:
    d=json.load(f)
print("CHAPTERS_COUNT=", len(d.get("chapters",[])))
print("ACTIVE=", d.get("activeChapterCode"))
print("Q_CHAPTER=", (d.get("question") or {}).get("chapterCode"))
print("TITLE=", (d.get("lesson") or {}).get("title"))
PY

SID=$(python3 - <<'PY'
import json
with open('/tmp/rd_ch_l1.json','r',encoding='utf-8') as f:
    d=json.load(f)
print(d.get("sessionId",""))
PY
)

echo "NEXT QUESTION WITH SWITCH TO L7"
curl -s -o /tmp/rd_ch_l7_q.json -w "HTTP_L7Q=%{http_code}\n" \
  -H "X-AI-TUTOR-KEY: change_me_ai_tutor_internal_key" \
  -H "Content-Type: application/json" \
  --data "{\"sessionId\":\"$SID\",\"chapterCode\":\"L7_SQUARES_ENDING_5\"}" \
  "http://127.0.0.1:8091/ai-tutor-api/vedic/next-question"
python3 - <<'PY'
import json
with open('/tmp/rd_ch_l7_q.json','r',encoding='utf-8') as f:
    d=json.load(f)
print("ACTIVE=", d.get("activeChapterCode"))
print("Q_CHAPTER=", (d.get("question") or {}).get("chapterCode"))
print("TITLE=", (d.get("lesson") or {}).get("title"))
print("QUESTION=", (d.get("question") or {}).get("questionText"))
PY

echo "PUBLIC PAGE CHECK"
curl -ks -o /tmp/rd_public_vedic.html -w "HTTP_PUBLIC=%{http_code}\n" https://robodynamics.in/ai-tutor/vedic
grep -q "Vedic Math AI Tutor" /tmp/rd_public_vedic.html && echo "PUBLIC_MARKUP_OK=1" || echo "PUBLIC_MARKUP_OK=0"
