set -euo pipefail
ENV_FILE=/opt/robodynamics/ai-tutor/tutor-api/.env
JWT_SECRET=$(grep -E '^AI_TUTOR_JWT_SECRET=' "$ENV_FILE" | head -n1 | cut -d= -f2-)
INTERNAL_KEY=$(grep -E '^TUTOR_INTERNAL_KEY=' "$ENV_FILE" | head -n1 | cut -d= -f2-)
TOKEN=$(python3 - <<PY
import jwt, time, uuid
secret='''$JWT_SECRET'''.strip()
now=int(time.time())
payload={"iss":"robodynamics-java","aud":"robodynamics-ai-tutor","sub":"user:7001","jti":str(uuid.uuid4()),"iat":now,"exp":now+600,"user_id":7001,"role":"PARENT","child_id":7002,"company_code":"RD","module":"VEDIC_MATH","grade":"6"}
print(jwt.encode(payload, secret, algorithm='HS256'))
PY
)

curl -sS -o /tmp/rd_b_start.json -H "X-AI-TUTOR-KEY: $INTERNAL_KEY" -H "Content-Type: application/json" --data "{\"token\":\"$TOKEN\",\"chapterCode\":\"L1_COMPLETING_WHOLE\"}" "http://127.0.0.1:8091/ai-tutor-api/vedic/start"
SID=$(python3 - <<'PY'
import json
print(json.load(open('/tmp/rd_b_start.json'))['sessionId'])
PY
)

curl -sS -o /tmp/rd_b_q.json -H "X-AI-TUTOR-KEY: $INTERNAL_KEY" -H "Content-Type: application/json" --data "{\"sessionId\":\"$SID\",\"chapterCode\":\"L1_COMPLETING_WHOLE\",\"exerciseGroup\":\"B\"}" "http://127.0.0.1:8091/ai-tutor-api/vedic/next-question"

python3 - <<'PY'
import json
q=(json.load(open('/tmp/rd_b_q.json')) or {}).get('question') or {}
print('B_GROUP=' + str(q.get('exerciseGroup')))
print('B_SKILL=' + str(q.get('skill')))
print('B_TEXT=' + str(q.get('questionText')))
assert str(q.get('exerciseGroup')) == 'B'
assert str(q.get('skill')) == 'Pairs That Make 10'
PY
