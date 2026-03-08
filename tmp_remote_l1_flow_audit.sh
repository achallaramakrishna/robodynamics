set -e
f=/opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/chapter/L1_COMPLETING_WHOLE.json
echo FILE_EXISTS=$( [ -f "$f" ] && echo yes || echo no )
if [ -f "$f" ]; then
  echo SHA=$(sha256sum "$f" | awk '{print $1}')
  echo CUE_COUNTS
  grep -o '"cue"[[:space:]]*:[[:space:]]*"[^"]*"' "$f" | sort | uniq -c
  echo PAUSE_COUNTS
  grep -o '"pauseType"[[:space:]]*:[[:space:]]*"[^"]*"' "$f" | sort | uniq -c
  echo SOURCE
  grep -m1 '"source"' "$f" || true
fi
g=/opt/robodynamics/ai-tutor/tutor-api/app/services/rule_engine.py
echo RULE_ENGINE_EXISTS=$( [ -f "$g" ] && echo yes || echo no )
if [ -f "$g" ]; then
  grep -n 'cue not in' "$g" | head -n 1 || true
fi
h=/opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/page.tsx
echo WEB_PAGE_EXISTS=$( [ -f "$h" ] && echo yes || echo no )
if [ -f "$h" ]; then
  grep -n 'screenplay_completed_without_explicit_checkpoint\|Great work. Moving to the next question.\|retryLine' "$h" | head -n 20 || true
fi
