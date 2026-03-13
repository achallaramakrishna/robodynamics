#!/bin/bash
set -euo pipefail

curl -s -H "X-AI-TUTOR-KEY: change_me_ai_tutor_internal_key" \
  "http://127.0.0.1:8091/ai-tutor-api/vedic/catalog" > /tmp/rd_tutor_catalog.json

python3 - <<'PY'
import json
with open('/tmp/rd_tutor_catalog.json','r',encoding='utf-8') as f:
    d=json.load(f)
chapters=d.get('chapters',[])
print('CATALOG_CHAPTERS=', len(chapters))
first=chapters[0] if chapters else {}
print('CATALOG_FIRST_TITLE=', first.get('title'))
print('CATALOG_FIRST_SUBTOPICS=', len(first.get('subtopics') or []))
print('CATALOG_FIRST_EX_GROUPS=', len(first.get('exerciseGroups') or []))
print('CATALOG_FIRST_EST_MIN=', first.get('estimatedMinutes'))
PY

TOKEN=$(python3 - <<'PY'
import jwt, time, uuid
now = int(time.time())
payload = {
  "iss": "robodynamics-java",
  "aud": "robodynamics-ai-tutor",
  "sub": "user:9101",
  "jti": str(uuid.uuid4()),
  "iat": now,
  "exp": now + 600,
  "user_id": 9101,
  "role": "PARENT",
  "child_id": 9102,
  "company_code": "RD",
  "module": "VEDIC_MATH",
  "grade": "6"
}
print(jwt.encode(payload, "change_me_ai_tutor_secret", algorithm="HS256"))
PY
)

curl -s -H "X-AI-TUTOR-KEY: change_me_ai_tutor_internal_key" \
  -H "Content-Type: application/json" \
  --data "{\"token\":\"$TOKEN\",\"chapterCode\":\"L10_DIVISION_BY_9\",\"exerciseGroup\":\"H\"}" \
  "http://127.0.0.1:8091/ai-tutor-api/vedic/start" > /tmp/rd_tutor_start_catalogcheck.json

python3 - <<'PY'
import json
with open('/tmp/rd_tutor_start_catalogcheck.json','r',encoding='utf-8') as f:
    d=json.load(f)
lesson=d.get('lesson') or {}
q=d.get('question') or {}
print('START_ACTIVE_CHAPTER=', d.get('activeChapterCode'))
print('START_ACTIVE_EXERCISE=', d.get('activeExerciseGroup'))
print('LESSON_SUBTOPICS=', len(lesson.get('subtopics') or []))
print('LESSON_GOALS=', len(lesson.get('learningGoals') or []))
print('LESSON_EX_COVERAGE=', len(lesson.get('exerciseCoverage') or []))
print('QUESTION_EXERCISE=', q.get('exerciseGroup'))
print('QUESTION_VISUAL_KIND=', (q.get('visual') or {}).get('kind'))
PY
