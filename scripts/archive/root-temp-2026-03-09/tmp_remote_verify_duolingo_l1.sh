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

curl -sS -o /tmp/rd_duolingo_direct.json -w "HTTP_DIRECT=%{http_code}\n" \
  -H "X-AI-TUTOR-KEY: $INTERNAL_KEY" \
  -H "Content-Type: application/json" \
  --data "{\"token\":\"$TOKEN\",\"chapterCode\":\"L1_COMPLETING_WHOLE\"}" \
  "http://127.0.0.1:8091/ai-tutor-api/vedic/start"

curl -ksS -o /tmp/rd_duolingo_public.json -w "HTTP_PUBLIC=%{http_code}\n" \
  -H "Content-Type: application/json" \
  --data "{\"token\":\"$TOKEN\",\"chapterCode\":\"L1_COMPLETING_WHOLE\"}" \
  "https://robodynamics.in/api/vedic/start"

python3 - <<'PY'
import json
from collections import Counter

def summarize(path, label):
    with open(path, 'r', encoding='utf-8') as f:
        d = json.load(f)
    if isinstance(d, dict) and d.get('error'):
        print(f'{label}_ERROR=', d.get('error'))
        return
    lesson = d.get('lesson') or {}
    beats = lesson.get('screenplay') or []
    sp = d.get('sessionProgress') or {}
    print(f'{label}_TITLE=', lesson.get('title'))
    print(f'{label}_SOURCE=', lesson.get('source'))
    print(f'{label}_BEATS=', len(beats))
    print(f'{label}_CUES=', dict(Counter(b.get('cue') for b in beats)))
    ga = sorted([b for b in beats if str(b.get('exerciseGroup','')).upper()=='A'], key=lambda x:int(x.get('sequence',0)))
    print(f'{label}_A_ORDER=', '->'.join([b.get('cue','') for b in ga]))
    print(f'{label}_SESSIONPROG_KEYS=', sorted(sp.keys()))
    print(f'{label}_HEARTS=', f"{sp.get('hearts')}/{sp.get('maxHearts')}")
    print(f'{label}_XP=', sp.get('xp'))
    print(f'{label}_STREAK=', sp.get('streak'))
    lp = sp.get('lessonPath') or []
    print(f'{label}_LESSONPATH_LEN=', len(lp))

summarize('/tmp/rd_duolingo_direct.json', 'DIRECT')
summarize('/tmp/rd_duolingo_public.json', 'PUBLIC')
PY

echo "ASSET_HTTP_CHECK"
curl -ksS -o /dev/null -w "ASSET_AI_TUTOR_PATH=%{http_code}\n" "https://robodynamics.in/ai-tutor/teacher_1/svg/gesture_explain_1.svg"
curl -ksS -o /dev/null -w "ASSET_ROOT_PATH=%{http_code}\n" "https://robodynamics.in/teacher_1/svg/gesture_explain_1.svg"
