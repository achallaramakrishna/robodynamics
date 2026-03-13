#!/bin/bash
set -euo pipefail

echo "CATALOG"
curl -s -H "X-AI-TUTOR-KEY: change_me_ai_tutor_internal_key" "http://127.0.0.1:8091/ai-tutor-api/vedic/catalog?courseId=vedic_math" > /tmp/rd_new_catalog.json
python3 - <<'PY'
import json
with open('/tmp/rd_new_catalog.json','r',encoding='utf-8') as f:
    d=json.load(f)
print('COURSE_ID=', d.get('courseId'))
print('CHAPTERS=', len(d.get('chapters',[])))
first=(d.get('chapters') or [{}])[0]
print('FIRST_FLOW_LEN=', len(first.get('exerciseFlow') or []))
print('FIRST_FLOW_HEAD=', (first.get('exerciseFlow') or [{}])[0])
PY

TOKEN=$(python3 - <<'PY'
import jwt, time, uuid
now=int(time.time())
payload={
  "iss":"robodynamics-java",
  "aud":"robodynamics-ai-tutor",
  "sub":"user:7001",
  "jti":str(uuid.uuid4()),
  "iat":now,
  "exp":now+600,
  "user_id":7001,
  "role":"PARENT",
  "child_id":7002,
  "company_code":"RD",
  "module":"VEDIC_MATH",
  "grade":"6"
}
print(jwt.encode(payload,"change_me_ai_tutor_secret",algorithm="HS256"))
PY
)

echo "START L1-H"
curl -s -H "X-AI-TUTOR-KEY: change_me_ai_tutor_internal_key" -H "Content-Type: application/json" \
  --data "{\"token\":\"$TOKEN\",\"courseId\":\"vedic_math\",\"chapterCode\":\"L1_COMPLETING_WHOLE\",\"exerciseGroup\":\"H\"}" \
  "http://127.0.0.1:8091/ai-tutor-api/vedic/start" > /tmp/rd_new_start.json
python3 - <<'PY'
import json
with open('/tmp/rd_new_start.json','r',encoding='utf-8') as f:
    d=json.load(f)
q=d.get('question') or {}
lesson=d.get('lesson') or {}
print('START_COURSE=', d.get('courseId'))
print('ACTIVE_CH=', d.get('activeChapterCode'))
print('ACTIVE_EX=', d.get('activeExerciseGroup'))
print('Q_SUBTOPIC=', q.get('subtopic'))
print('LESSON_FLOW=', len(lesson.get('exerciseFlow') or []))
print('LESSON_FLOW_LAST=', (lesson.get('exerciseFlow') or [{}])[-1])
PY

SID=$(python3 - <<'PY'
import json
with open('/tmp/rd_new_start.json','r',encoding='utf-8') as f:
    d=json.load(f)
print(d.get('sessionId',''))
PY
)
QID=$(python3 - <<'PY'
import json
with open('/tmp/rd_new_start.json','r',encoding='utf-8') as f:
    d=json.load(f)
print((d.get('question') or {}).get('questionId',''))
PY
)

echo "CHECK ANSWER"
curl -s -H "X-AI-TUTOR-KEY: change_me_ai_tutor_internal_key" -H "Content-Type: application/json" \
  --data "{\"sessionId\":\"$SID\",\"questionId\":\"$QID\",\"learnerAnswer\":\"0\",\"responseTimeMs\":12000,\"confidence\":\"low\"}" \
  "http://127.0.0.1:8091/ai-tutor-api/vedic/check-answer" > /tmp/rd_new_check.json
python3 - <<'PY'
import json
with open('/tmp/rd_new_check.json','r',encoding='utf-8') as f:
    d=json.load(f)
print('TUTOR_ACTION=', d.get('tutorAction'))
print('COACH_TIP=', d.get('coachTip'))
s=d.get('summary') or {}
print('SUMMARY_COURSE=', s.get('courseId'))
print('SUMMARY_LAST_MS=', s.get('lastResponseMs'))
print('SUMMARY_ERR_STREAK=', s.get('errorStreak'))
PY

echo "WEB PAGE CHECK"
curl -ks https://robodynamics.in/ai-tutor/vedic > /tmp/rd_new_vedic_page.html
for k in "AI Classroom Board" "Teach on Whiteboard" "Exercise Flow (A-I)" "Voice: On"; do
  if grep -q "$k" /tmp/rd_new_vedic_page.html; then
    echo "HAS_$k=1"
  else
    echo "HAS_$k=0"
  fi
done
