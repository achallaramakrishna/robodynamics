#!/bin/bash
set -euo pipefail

TOKEN=$(python3 - <<'PY'
import jwt, time, uuid
now = int(time.time())
payload = {
  "iss": "robodynamics-java",
  "aud": "robodynamics-ai-tutor",
  "sub": "user:9999",
  "jti": str(uuid.uuid4()),
  "iat": now,
  "exp": now + 300,
  "user_id": 9999,
  "role": "PARENT",
  "child_id": 8888,
  "company_code": "RD",
  "module": "VEDIC_MATH",
  "grade": "6"
}
print(jwt.encode(payload, "change_me_ai_tutor_secret", algorithm="HS256"))
PY
)

echo "STEP start"
curl -s -o /tmp/rd_tutor_start.json -w "START_HTTP=%{http_code}\n" \
  -H "X-AI-TUTOR-KEY: change_me_ai_tutor_internal_key" \
  -H "Content-Type: application/json" \
  --data "{\"token\":\"$TOKEN\"}" \
  "http://127.0.0.1:8091/ai-tutor-api/vedic/start"
head -c 320 /tmp/rd_tutor_start.json; echo

SESSION_ID=$(python3 - <<'PY'
import json
with open('/tmp/rd_tutor_start.json','r',encoding='utf-8') as f:
    data = json.load(f)
print(data.get("sessionId",""))
PY
)
QUESTION_ID=$(python3 - <<'PY'
import json
with open('/tmp/rd_tutor_start.json','r',encoding='utf-8') as f:
    data = json.load(f)
print((data.get("question") or {}).get("questionId",""))
PY
)

echo "STEP check-answer"
curl -s -o /tmp/rd_tutor_check.json -w "CHECK_HTTP=%{http_code}\n" \
  -H "X-AI-TUTOR-KEY: change_me_ai_tutor_internal_key" \
  -H "Content-Type: application/json" \
  --data "{\"sessionId\":\"$SESSION_ID\",\"questionId\":\"$QUESTION_ID\",\"learnerAnswer\":\"0\"}" \
  "http://127.0.0.1:8091/ai-tutor-api/vedic/check-answer"
head -c 320 /tmp/rd_tutor_check.json; echo

echo "STEP java event endpoint with key"
curl -s -o /tmp/rd_java_event.json -w "JAVA_EVENT_HTTP=%{http_code}\n" \
  -H "X-AI-TUTOR-KEY: change_me_ai_tutor_internal_key" \
  -H "Content-Type: application/json" \
  --data '{"sessionId":"probe_session","userId":1,"childId":2,"moduleCode":"VEDIC_MATH","eventType":"PROBE","lessonCode":"L1","meta":{"k":"v"}}' \
  "http://127.0.0.1:8080/api/ai-tutor/session/event"
head -c 200 /tmp/rd_java_event.json; echo
