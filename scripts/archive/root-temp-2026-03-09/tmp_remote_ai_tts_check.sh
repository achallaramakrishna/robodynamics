set -e
curl -sS -X POST "https://robodynamics.in/api/voice/tts" \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello student, let us begin Vedic math.","avatarId":"arya","languageCode":"en-IN","pace":1.0}' > /tmp/ai_tts.json

echo "TTS_HEAD"
head -c 260 /tmp/ai_tts.json
echo
echo "HAS_AUDIO"
if grep -q '"audioBase64":"' /tmp/ai_tts.json; then echo yes; else echo no; fi
echo "SPEAKER"
grep -o '"speaker":"[^"]*"' /tmp/ai_tts.json | head -n1 || true