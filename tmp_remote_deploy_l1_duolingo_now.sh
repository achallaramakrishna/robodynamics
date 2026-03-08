set -euo pipefail

install -D -m 644 /tmp/VedicTutorClient.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/VedicTutorClient.tsx
install -D -m 644 /tmp/vedic_page.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/page.tsx
install -D -m 644 /tmp/learn_page.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/learn/page.tsx
install -D -m 644 /tmp/teacher_route.ts '/opt/robodynamics/ai-tutor/web/app/ai-tutor/teacher/[name]/route.ts'
install -D -m 644 /tmp/rule_engine.py /opt/robodynamics/ai-tutor/tutor-api/app/services/rule_engine.py
install -D -m 644 /tmp/course_script_loader.py /opt/robodynamics/ai-tutor/tutor-api/app/services/course_script_loader.py
install -D -m 644 /tmp/L1_COMPLETING_WHOLE.json /opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/chapter/L1_COMPLETING_WHOLE.json

rm -f /opt/robodynamics/vedic_math/chapter_scripts.json
rm -rf /opt/robodynamics/ai-tutor/web/public/teacher_1
mkdir -p /opt/robodynamics/ai-tutor/web/public
cp -a /tmp/teacher_1 /opt/robodynamics/ai-tutor/web/public/teacher_1

cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build_l1.log 2>&1 || (tail -n 200 /tmp/rd_ai_tutor_web_build_l1.log; exit 1)

systemctl restart rd-ai-tutor-api
systemctl restart rd-ai-tutor-web
sleep 3

echo "API=$(systemctl is-active rd-ai-tutor-api || true)"
echo "WEB=$(systemctl is-active rd-ai-tutor-web || true)"
echo "OLD_CHAPTER_SCRIPTS_EXISTS=$( [ -f /opt/robodynamics/vedic_math/chapter_scripts.json ] && echo yes || echo no )"

echo "FILE_SHA"
sha256sum /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/VedicTutorClient.tsx | awk '{print "REMOTE_VEDIC_CLIENT_SHA=" $1}'
sha256sum /opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/chapter/L1_COMPLETING_WHOLE.json | awk '{print "REMOTE_L1_SHA=" $1}'
sha256sum /opt/robodynamics/ai-tutor/tutor-api/app/services/rule_engine.py | awk '{print "REMOTE_RULE_ENGINE_SHA=" $1}'

ENV_FILE=/opt/robodynamics/ai-tutor/tutor-api/.env
JWT_SECRET=$(grep -E '^AI_TUTOR_JWT_SECRET=' "$ENV_FILE" | head -n1 | cut -d= -f2-)
INTERNAL_KEY=$(grep -E '^TUTOR_INTERNAL_KEY=' "$ENV_FILE" | head -n1 | cut -d= -f2-)
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

curl -sS -o /tmp/rd_l1_start_direct.json -w "HTTP_START_DIRECT=%{http_code}\n" \
  -H "X-AI-TUTOR-KEY: $INTERNAL_KEY" \
  -H "Content-Type: application/json" \
  --data "{\"token\":\"$TOKEN\",\"chapterCode\":\"L1_COMPLETING_WHOLE\"}" \
  "http://127.0.0.1:8091/ai-tutor-api/vedic/start"

curl -ksS -o /tmp/rd_l1_start_public.json -w "HTTP_START_PUBLIC=%{http_code}\n" \
  -H "Content-Type: application/json" \
  --data "{\"token\":\"$TOKEN\",\"chapterCode\":\"L1_COMPLETING_WHOLE\"}" \
  "https://robodynamics.in/api/vedic/start"

python3 - <<'PY'
import json
exp = ['intro','explain','demo','guided','practice','check','checkpoint']

with open('/tmp/rd_l1_start_direct.json','r',encoding='utf-8') as f:
  d=json.load(f)
lesson=d.get('lesson') or {}
beats=lesson.get('screenplay') or []
flow=lesson.get('exerciseFlow') or []
q=d.get('question') or {}
print('DIRECT_TITLE=' + str(lesson.get('title')))
print('DIRECT_BEATS=' + str(len(beats)))
print('DIRECT_FLOW=' + '|'.join([f"{x.get('exerciseGroup')}:{x.get('subtopic')}" for x in flow]))
for g in 'ABCDEFGHI':
  arr=sorted([b for b in beats if str(b.get('exerciseGroup','')).upper()==g], key=lambda x:int(x.get('sequence',0)))
  order=[b.get('cue') for b in arr]
  print(f'DIRECT_ORDER_{g}=' + '->'.join(order))
print('DIRECT_Q_GROUP=' + str(q.get('exerciseGroup')))
print('DIRECT_Q_SKILL=' + str(q.get('skill')))
print('DIRECT_Q_TEXT=' + str(q.get('questionText'))[:140])
assert lesson.get('title') == 'Lesson 1: Completing the Whole'
assert len(beats) == 63
for g in 'ABCDEFGHI':
  arr=sorted([b for b in beats if str(b.get('exerciseGroup','')).upper()==g], key=lambda x:int(x.get('sequence',0)))
  assert [b.get('cue') for b in arr] == exp

with open('/tmp/rd_l1_start_public.json','r',encoding='utf-8') as f:
  p=json.load(f)
if isinstance(p, dict) and p.get('error'):
  raise SystemExit('PUBLIC_ERROR=' + str(p.get('error')))
pl = p.get('lesson') or {}
print('PUBLIC_TITLE=' + str(pl.get('title')))
print('PUBLIC_BEATS=' + str(len(pl.get('screenplay') or [])))
PY

SID=$(python3 - <<'PY'
import json
print(json.load(open('/tmp/rd_l1_start_direct.json'))['sessionId'])
PY
)

curl -sS -o /tmp/rd_l1_b_direct.json -w "HTTP_B_DIRECT=%{http_code}\n" \
  -H "X-AI-TUTOR-KEY: $INTERNAL_KEY" \
  -H "Content-Type: application/json" \
  --data "{\"sessionId\":\"$SID\",\"chapterCode\":\"L1_COMPLETING_WHOLE\",\"exerciseGroup\":\"B\"}" \
  "http://127.0.0.1:8091/ai-tutor-api/vedic/next-question"

python3 - <<'PY'
import json
b=json.load(open('/tmp/rd_l1_b_direct.json','r',encoding='utf-8'))
q=b.get('question') or {}
print('B_GROUP=' + str(q.get('exerciseGroup')))
print('B_SKILL=' + str(q.get('skill')))
print('B_Q=' + str(q.get('questionText')))
assert str(q.get('exerciseGroup')) == 'B'
assert str(q.get('skill')) == 'Pairs That Make 10'
PY

curl -ksS -o /dev/null -w "UI_LEARN_HTTP=%{http_code}\n" "https://robodynamics.in/ai-tutor/learn"
curl -ksS -o /dev/null -w "TEACHER_ROUTE_HTTP=%{http_code}\n" "https://robodynamics.in/ai-tutor/teacher/gesture_explain_1.svg"
