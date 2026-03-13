set -euo pipefail

echo "=== SERVICES ==="
echo "API=$(systemctl is-active rd-ai-tutor-api || true)"
echo "WEB=$(systemctl is-active rd-ai-tutor-web || true)"

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
  "exp": now + 900,
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

echo "=== START (DIRECT API) ==="
curl -sS -o /tmp/ch1_start_direct.json -w "HTTP_START_DIRECT=%{http_code}\n" \
  -H "X-AI-TUTOR-KEY: $INTERNAL_KEY" \
  -H "Content-Type: application/json" \
  --data "{\"token\":\"$TOKEN\",\"chapterCode\":\"L1_COMPLETING_WHOLE\"}" \
  "http://127.0.0.1:8091/ai-tutor-api/vedic/start"

python3 - <<'PY'
import json
from collections import Counter

with open('/tmp/ch1_start_direct.json','r',encoding='utf-8') as f:
    d = json.load(f)

lesson = d.get('lesson') or {}
beats = lesson.get('screenplay') or []
sp = d.get('sessionProgress') or {}
q = d.get('question') or {}
session_id = d.get('sessionId') or ''
canonical = ['intro','explain','demo','guided','practice','check','checkpoint']

print('TITLE=', lesson.get('title'))
print('SOURCE=', lesson.get('source'))
print('BEATS=', len(beats))
print('CUES=', dict(Counter(b.get('cue') for b in beats)))
print('SESSION=', session_id)
print('QID=', q.get('questionId'))
print('EXPECTED=', q.get('expectedAnswer'))
print('SP_HEARTS=', f"{sp.get('hearts')}/{sp.get('maxHearts')}")
print('SP_XP=', sp.get('xp'))
print('SP_STREAK=', sp.get('streak'))
print('SP_PATH_LEN=', len(sp.get('lessonPath') or []))

assert lesson.get('title') == 'Lesson 1: Completing the Whole'
assert len(beats) == 63, f"Expected 63 beats, got {len(beats)}"
for g in 'ABCDEFGHI':
    arr = sorted([b for b in beats if str(b.get('exerciseGroup','')).upper()==g], key=lambda x:int(x.get('sequence',0)))
    order = [b.get('cue') for b in arr]
    print(f'ORDER_{g}=' + '->'.join(order))
    assert order == canonical, f"Group {g} order mismatch: {order}"

assert session_id, "Missing sessionId"
assert q.get('questionId'), "Missing questionId"
assert q.get('expectedAnswer') is not None, "Missing expectedAnswer"

with open('/tmp/ch1_state.env','w',encoding='utf-8') as out:
    out.write(f"SESSION_ID={session_id}\n")
    out.write(f"QUESTION_ID={q.get('questionId')}\n")
    out.write("EXPECTED_ANSWER=" + str(q.get('expectedAnswer')).replace('\n',' ').replace('\r',' ') + "\n")
PY

source /tmp/ch1_state.env

echo "=== CHECK ANSWER (CORRECT) ==="
curl -sS -o /tmp/ch1_check_correct.json -w "HTTP_CHECK_CORRECT=%{http_code}\n" \
  -H "X-AI-TUTOR-KEY: $INTERNAL_KEY" \
  -H "Content-Type: application/json" \
  --data "{\"sessionId\":\"$SESSION_ID\",\"questionId\":\"$QUESTION_ID\",\"learnerAnswer\":\"$EXPECTED_ANSWER\",\"confidence\":\"high\"}" \
  "http://127.0.0.1:8091/ai-tutor-api/vedic/check-answer"

python3 - <<'PY'
import json
with open('/tmp/ch1_check_correct.json','r',encoding='utf-8') as f:
    d = json.load(f)
print('CORRECT=', d.get('correct'))
sp = d.get('sessionProgress') or {}
print('SP1_HEARTS=', f"{sp.get('hearts')}/{sp.get('maxHearts')}")
print('SP1_XP=', sp.get('xp'))
print('SP1_STREAK=', sp.get('streak'))
assert d.get('correct') is True, "Expected correct=True for expectedAnswer submission"
assert sp.get('xp', 0) >= 10, f"Expected xp >=10, got {sp.get('xp')}"
assert sp.get('hearts') == sp.get('maxHearts'), "Hearts should not reduce on correct answer"
PY

echo "=== CHECK ANSWER (WRONG) ==="
curl -sS -o /tmp/ch1_check_wrong.json -w "HTTP_CHECK_WRONG=%{http_code}\n" \
  -H "X-AI-TUTOR-KEY: $INTERNAL_KEY" \
  -H "Content-Type: application/json" \
  --data "{\"sessionId\":\"$SESSION_ID\",\"questionId\":\"$QUESTION_ID\",\"learnerAnswer\":\"__wrong_answer__\",\"confidence\":\"low\"}" \
  "http://127.0.0.1:8091/ai-tutor-api/vedic/check-answer"

python3 - <<'PY'
import json
with open('/tmp/ch1_check_wrong.json','r',encoding='utf-8') as f:
    d = json.load(f)
print('CORRECT2=', d.get('correct'))
sp = d.get('sessionProgress') or {}
print('SP2_HEARTS=', f"{sp.get('hearts')}/{sp.get('maxHearts')}")
print('SP2_XP=', sp.get('xp'))
print('SP2_STREAK=', sp.get('streak'))
assert d.get('correct') is False, "Expected correct=False for wrong answer"
assert (sp.get('hearts') or 0) < (sp.get('maxHearts') or 0), "Hearts should reduce on wrong answer"
PY

echo "=== NEXT QUESTION ==="
curl -sS -o /tmp/ch1_next_direct.json -w "HTTP_NEXT_DIRECT=%{http_code}\n" \
  -H "X-AI-TUTOR-KEY: $INTERNAL_KEY" \
  -H "Content-Type: application/json" \
  --data "{\"sessionId\":\"$SESSION_ID\",\"chapterCode\":\"L1_COMPLETING_WHOLE\",\"exerciseGroup\":\"A\"}" \
  "http://127.0.0.1:8091/ai-tutor-api/vedic/next-question"

python3 - <<'PY'
import json
with open('/tmp/ch1_next_direct.json','r',encoding='utf-8') as f:
    d = json.load(f)
q = d.get('question') or {}
sp = d.get('sessionProgress') or {}
print('NEXT_QID=', q.get('questionId'))
print('NEXT_EX_GROUP=', q.get('exerciseGroup'))
print('NEXT_SP_HEARTS=', f"{sp.get('hearts')}/{sp.get('maxHearts')}")
print('NEXT_SP_XP=', sp.get('xp'))
print('NEXT_SP_STREAK=', sp.get('streak'))
assert q.get('questionId'), "Missing next questionId"
assert isinstance(sp.get('lessonPath'), list), "Missing sessionProgress.lessonPath"
PY

echo "=== START (PUBLIC PROXY) ==="
curl -ksS -o /tmp/ch1_start_public.json -w "HTTP_START_PUBLIC=%{http_code}\n" \
  -H "Content-Type: application/json" \
  --data "{\"token\":\"$TOKEN\",\"chapterCode\":\"L1_COMPLETING_WHOLE\"}" \
  "https://robodynamics.in/api/vedic/start"

python3 - <<'PY'
import json
from collections import Counter

with open('/tmp/ch1_start_public.json','r',encoding='utf-8') as f:
    d = json.load(f)
if isinstance(d, dict) and d.get('error'):
    raise SystemExit(f"PUBLIC_ERROR={d.get('error')}")
lesson = d.get('lesson') or {}
beats = lesson.get('screenplay') or []
sp = d.get('sessionProgress') or {}
print('PUBLIC_TITLE=', lesson.get('title'))
print('PUBLIC_BEATS=', len(beats))
print('PUBLIC_CUES=', dict(Counter(b.get('cue') for b in beats)))
print('PUBLIC_SP_KEYS=', sorted(sp.keys()))
assert len(beats) == 63, f"Expected 63 beats in public response, got {len(beats)}"
assert 'hearts' in sp and 'xp' in sp and 'lessonPath' in sp, "sessionProgress keys missing in public response"
PY

echo "=== CHAPTER 1 TEST PASSED ==="
