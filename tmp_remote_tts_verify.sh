set -e
curl -ksS -X POST https://robodynamics.in/api/voice/tts \
  -H 'Content-Type: application/json' \
  -d '{"text":"Lesson one test","avatarId":"raj","languageCode":"en-IN","pace":1.0}' > /tmp/tts_verify.json
python3 - <<'PY'
import json
with open('/tmp/tts_verify.json', 'r', encoding='utf-8') as fh:
    obj = json.load(fh)
print(obj.get('provider'))
print(obj.get('speaker'))
print(obj.get('model'))
print(bool(obj.get('audioBase64')))
PY
