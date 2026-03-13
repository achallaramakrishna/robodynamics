set -e
curl -ksS -X POST https://robodynamics.in/api/vedic/start \
  -H 'Content-Type: application/json' \
  --data '{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJyb2JvZHluYW1pY3MtamF2YSIsImF1ZCI6InJvYm9keW5hbWljcy1haS10dXRvciIsInN1YiI6InVzZXI6OTk5MDEiLCJqdGkiOiJwcm9kLWZsb3ctdGVzdC0xIiwiaWF0IjoxNzczMzMzMDY5LCJleHAiOjE3NzMzMzMzNjksInVzZXJfaWQiOjk5OTAxLCJyb2xlIjoiU1RVREVOVCIsImNoaWxkX2lkIjo5OTkwMSwiY29tcGFueV9jb2RlIjoiUkQiLCJtb2R1bGUiOiJWRURJQ19NQVRIIiwiZ3JhZGUiOiI2In0.pcq__U85RON6Kp5swhN4EtRrT-KfpL7KbP5mqRXRqzE","courseId":"vedic_math","chapterCode":"L1_COMPLETING_WHOLE","exerciseGroup":"A"}' > /tmp/prod_l1_start.json
python3 - <<'PY'
import json
obj = json.load(open('/tmp/prod_l1_start.json', 'r', encoding='utf-8'))
print(obj.get('sessionId', ''))
print(obj.get('question', {}).get('questionText', ''))
print(obj.get('activeExerciseGroup', ''))
print(obj.get('lesson', {}).get('title', ''))
PY
