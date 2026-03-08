set -euo pipefail

API_SVC=$(systemctl is-active rd-ai-tutor-api || true)
WEB_SVC=$(systemctl is-active rd-ai-tutor-web || true)
echo "API_SERVICE=$API_SVC"
echo "WEB_SERVICE=$WEB_SVC"

ENV_FILE=/opt/robodynamics/ai-tutor/tutor-api/.env
if [ ! -f "$ENV_FILE" ]; then
  echo "ENV_FILE_MISSING=$ENV_FILE"
  exit 1
fi

JWT_SECRET=$(grep -E '^AI_TUTOR_JWT_SECRET=' "$ENV_FILE" | head -n1 | cut -d= -f2-)
INTERNAL_KEY=$(grep -E '^TUTOR_INTERNAL_KEY=' "$ENV_FILE" | head -n1 | cut -d= -f2-)
if [ -z "$JWT_SECRET" ] || [ -z "$INTERNAL_KEY" ]; then
  echo "ENV_KEYS_MISSING"
  exit 1
fi

TOKEN=$(python3 - <<PY
import jwt, time, uuid
secret = '''$JWT_SECRET'''.strip()
now = int(time.time())
payload = {
  "iss": "robodynamics-java",
  "aud": "robodynamics-ai-tutor",
  "sub": "user:7001",
  "jti": str(uuid.uuid4()),
  "iat": now,
  "exp": now + 600,
  "user_id": 7001,
  "role": "PARENT",
  "child_id": 7002,
  "company_code": "RD",
  "module": "VEDIC_MATH",
  "grade": "6"
}
print(jwt.encode(payload, secret, algorithm="HS256"))
PY
)

# Direct tutor-api check
curl -sS -o /tmp/rd_l1_direct.json -w "HTTP_DIRECT=%{http_code}\n" \
  -H "X-AI-TUTOR-KEY: $INTERNAL_KEY" \
  -H "Content-Type: application/json" \
  --data "{\"token\":\"$TOKEN\",\"chapterCode\":\"L1_COMPLETING_WHOLE\"}" \
  "http://127.0.0.1:8091/ai-tutor-api/vedic/start"

python3 - <<'PY'
import json
with open('/tmp/rd_l1_direct.json','r',encoding='utf-8') as f:
    d=json.load(f)
lesson=d.get('lesson') or {}
beats=lesson.get('screenplay') or []
from collections import Counter
print('DIRECT_TITLE=', lesson.get('title'))
print('DIRECT_SOURCE=', lesson.get('source'))
print('DIRECT_BEATS=', len(beats))
print('DIRECT_CUES=', dict(Counter(b.get('cue') for b in beats)))
for g in 'A':
    arr=sorted([b for b in beats if str(b.get('exerciseGroup','')).upper()==g], key=lambda x:int(x.get('sequence',0)))
    print('DIRECT_A_ORDER=', '->'.join([b.get('cue','') for b in arr]))
print('DIRECT_CHECKPOINT_PAUSE=', sum(1 for b in beats if b.get('cue')=='checkpoint' and b.get('pauseType')=='student_response'))
print('DIRECT_SVG_ALL=', sum(1 for b in beats if isinstance(b.get('svgAnimation'), list) and len(b.get('svgAnimation'))>0))
PY

# Public web proxy check
curl -ksS -o /tmp/rd_l1_public.json -w "HTTP_PUBLIC_PROXY=%{http_code}\n" \
  -H "Content-Type: application/json" \
  --data "{\"token\":\"$TOKEN\",\"chapterCode\":\"L1_COMPLETING_WHOLE\"}" \
  "https://robodynamics.in/api/vedic/start"

python3 - <<'PY'
import json
with open('/tmp/rd_l1_public.json','r',encoding='utf-8') as f:
    d=json.load(f)
if isinstance(d,dict) and d.get('error'):
    print('PUBLIC_ERROR=', d.get('error'))
else:
    lesson=d.get('lesson') or {}
    beats=lesson.get('screenplay') or []
    from collections import Counter
    print('PUBLIC_TITLE=', lesson.get('title'))
    print('PUBLIC_SOURCE=', lesson.get('source'))
    print('PUBLIC_BEATS=', len(beats))
    print('PUBLIC_CUES=', dict(Counter(b.get('cue') for b in beats)))
    arr=sorted([b for b in beats if str(b.get('exerciseGroup','')).upper()=='A'], key=lambda x:int(x.get('sequence',0)))
    print('PUBLIC_A_ORDER=', '->'.join([b.get('cue','') for b in arr]))
PY
